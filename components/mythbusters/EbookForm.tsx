"use client";

import * as React from "react";
import { useId, useState } from "react";
import { z } from "zod";
import { CheckCircle2, Download, Lock } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { MythBustersDictionary, EbookFormField } from "@/content/dictionary";
import type { Locale } from "@/lib/i18n";
import { useRecaptcha } from "@/components/security/useRecaptcha";
import { HoneypotField, appendHoneypot } from "@/components/security/HoneypotField";
import { RECAPTCHA_FIELD } from "@/lib/security/fields";

/**
 * The e-book download form.
 *
 * ── The fields are DATA, not JSX ────────────────────────────────────────────────
 * The two locales ask for different things. The English source asks for Full Name, Business
 * Email, Company and an OPTIONAL Role or Job Title; the newer Serbian source asks for Ime,
 * Poslovna e-mail adresa, Kompanija and a REQUIRED Zemlja, with no role at all.
 *
 * So the component iterates `copy.fields` and builds its Zod schema from the same list.
 * There is no `locale === 'sr'` conditional anywhere in here, and adding or reordering a
 * field is a content edit rather than a component edit.
 *
 * `key` is the API contract and is never translated; only `label` is.
 *
 * ── TWO INSTANCES ON ONE PAGE ───────────────────────────────────────────────────
 * The Serbian page renders this form twice — once in the hero and once at the bottom — so a
 * visitor never has to scroll to reach it. That makes DOM uniqueness a correctness
 * requirement rather than a nicety:
 *
 *   · every input id, and every aria-describedby it points at, is prefixed with useId()
 *   · each instance owns its own state, so validation errors, the submitting flag and the
 *     success panel belong to the instance the visitor actually used
 *   · submitting one leaves the other untouched
 *
 * Without the prefix, two identical ids would make BOTH labels focus the FIRST input, and a
 * screen reader would read the top form's error while the visitor typed in the bottom one.
 *
 * ── Why /api/ebook and not /api/contact ─────────────────────────────────────────
 * /api/contact requires `subject` >= 5 and `message` >= 10. This form has neither, and
 * inventing values would push e-book leads into the contact notification stream under a
 * fabricated subject and body.
 *
 * ── The gate is a marketing gate, not a security boundary ───────────────────────
 * The PDF sits in public/ and is publicly addressable. That is the approved model: no
 * signed URLs, no auth, no expiring tokens.
 *
 * ── ONE English PDF, both locales ───────────────────────────────────────────────
 * EBOOK_HREF is the same file on both landing pages, by design: the page is bilingual, the
 * asset is not. The Serbian page says so above the fields.
 *
 * ── The panel promises nothing about email ──────────────────────────────────────
 * It used to say a copy was on its way, gated on an `emailDelivered` flag from /api/ebook.
 * The owner withdrew the delivery email entirely, so the flag, the strings and the block that
 * rendered them are gone rather than left to describe something that no longer happens.
 *
 * ── Submitting IS downloading ───────────────────────────────────────────────────
 * A valid submission captures the lead, starts the PDF download, and shows the Thank You
 * panel. The visitor is not asked to click anything to receive the file and is not waiting on
 * an inbox. The panel's button is a fallback for a blocked or interrupted download, and for
 * anyone who wants the file again — see the effect and its two guards below.
 */

/**
 * The conversion card's own surface.
 *
 * ── Why it is stronger than the old `shadow-sm` ─────────────────────────────────
 * This form now sits on navy in three places — both heroes and both closing sections — and a
 * 1px border with a whisper of shadow made it read as a small utility widget floating on a
 * dark panel rather than as the main object on the page. A real elevation and a hairline ring
 * give it weight on dark grounds and still behave on the light ones.
 *
 * Presentation only: no field, id, validation or submission behaviour is affected.
 */
/**
 * The card the form sits on.
 *
 * It has to look like the most important object in a navy hero without looking like an admin
 * panel — so: one soft lift rather than a hard border, a hairline ring for definition on white
 * sections, and padding that stays generous at the top where the heading is. `p-6 sm:p-7` is
 * unchanged; what changed is everything inside it, which now has its own margins instead of
 * inheriting a single grid gap.
 */
const CARD_SURFACE =
  "rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,.04),0_24px_48px_-24px_rgba(0,0,0,.45)] ring-1 ring-black/[0.04] sm:p-7"

/** The public asset. Same file the success panel links to. */
const EBOOK_HREF = "/downloads/SAP_Mythbusting_Campaign_E-Book_Infinus.pdf";

/**
 * Build the validation schema from the field list.
 *
 * Optional fields become `z.string().optional()` — they cannot fail, which is why their
 * `validation` string is empty in the dictionary. Email gets a format check on top of the
 * presence check, and only when it is present.
 */
function createSchema(fields: readonly EbookFormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) {
    if (!field.required) {
      shape[field.key] = z.string().optional();
      continue;
    }
    shape[field.key] =
      field.key === "email"
        ? z.string().email(field.validation)
        : z.string().trim().min(1, field.validation);
  }
  return z.object(shape);
}

type Values = Record<string, string>;
type FieldErrors = Record<string, string | undefined>;

export function EbookForm({
  copy,
  locale,
  /** Distinguishes the hero instance from the closing one in analytics. Not user-visible. */
  placement,
  assurances,
  className,
  density = "comfortable",
  showIntro = true,
}: {
  copy: MythBustersDictionary["form"];
  locale: Locale;
  placement: "hero" | "closing";
  /** The reassurance lines the Serbian source prints under the CTA. */
  assurances?: readonly string[];
  className?: string;
  /**
   * PRESENTATION ONLY — how tightly the fields are packed.
   *
   * `compact` lays the fields out in a grid that is two columns whenever the FORM is at least
   * 27rem wide and one column when it is not — a container query, so a form squeezed into a
   * narrow hero column drops to one column on its own instead of holding a 2×2 it cannot
   * afford. Four fields stacked made a card tall enough to dominate the hero it sits beside;
   * two rows of two is the same form at roughly half the height, where there is room for it.
   *
   * Field order, names, types, validation and submission are identical in both densities.
   */
  density?: "comfortable" | "compact";
  /**
   * Whether the card prints its own heading and body.
   *
   * The closing section states them at section scale in its own column, so the card there
   * turns them off rather than repeating the same two sentences twice within one screen.
   */
  showIntro?: boolean;
}) {
  // One per mounted instance. This is what keeps two forms on one page from colliding.
  const uid = useId();
  const isCompact = density === "compact";
  const recaptcha = useRecaptcha();
  const fieldId = (key: string) => `ebook-${uid}-${key}`;
  const errorId = (key: string) => `ebook-${uid}-${key}-error`;

  const schema = React.useMemo(() => createSchema(copy.fields), [copy.fields]);

  const [values, setValues] = useState<Values>(() => {
    const initial: Values = {};
    for (const field of copy.fields) initial[field.key] = "";
    return initial;
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  /**
   * Whether the convenience copy actually reached the visitor's inbox.
   *
   * Reported by /api/ebook as a plain boolean. The success panel shows the "a copy is on its
   * way" copy only when this is true — claiming it otherwise is a promise the visitor can
   * check and find false.
   *
   * Defaults to FALSE, so a malformed or older response understates rather than overstates.
   */

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Captured before any await: React pools the event and currentTarget is null afterwards.
    const form = event.currentTarget as HTMLFormElement;
    setErrors({});

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.errors) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setIsSubmitting(true);
    try {
      // Untranslated keys: the API contract, not copy.
      const body = new FormData();
      for (const field of copy.fields) {
        const value = (parsed.data as Values)[field.key];
        if (value) body.append(field.key, value);
      }
      body.append("locale", locale);

      const token = await recaptcha.execute("ebook");
      if (token) body.append(RECAPTCHA_FIELD, token);

      // Scoped to THIS form: with two instances on the page, a document-wide lookup would
      // read the hero form's honeypot even when the closing form was submitted.
      appendHoneypot(body, form);

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
          const value = params.get(key);
          if (value) body.append(key, value);
        }
      }

      const response = await fetch("/api/ebook", { method: "POST", body });
      const result = await response.json();

      if (!result.success) {
        setErrors({ general: copy.error });
        return;
      }

      setIsDone(true);
      // No analytics here. `download_resource` fires when the download actually starts —
      // see the effect below — not when the form is submitted.
    } catch {
      setErrors({ general: copy.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Start the download, and count it once.
   *
   * ── The flow the owner settled on ──────────────────────────────────────────────
   * Submit -> the PDF starts downloading -> the Thank You panel appears. The visitor is not
   * asked to click anything to get the file, and no email is sent. The button in the panel is
   * a FALLBACK for the case a browser blocks or interrupts the automatic download, and for
   * anyone who wants the file again.
   *
   * Two guards, for two different mistakes:
   *
   *   `autoStarted`  stops the automatic download firing twice. React runs effects twice in
   *                  development StrictMode, and a double `.click()` is a second file in the
   *                  downloads folder — visible, and exactly what the previous version of
   *                  this component was criticised for.
   *
   *   `counted`      stops the analytics double-counting. The automatic download and the
   *                  fallback button are the same anchor, so the programmatic click runs the
   *                  same handler a human click would. One successful submission is one
   *                  `download_resource`, whether or not the visitor also uses the button.
   *
   * `typeof window.gtag === "function"` IS the consent gate, not a defensive check:
   * components/consent/AnalyticsGate.tsx only injects gtag once analytics consent is granted,
   * so without consent there is no function and nothing is sent. Kept verbatim rather than
   * reimplemented, so the gating cannot drift from the rest of the site.
   */
  const downloadRef = React.useRef<HTMLAnchorElement | null>(null);
  const autoStarted = React.useRef(false);
  const counted = React.useRef(false);

  const trackDownload = () => {
    if (counted.current) return;
    if (typeof window === "undefined") return;
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag !== "function") return;

    counted.current = true;
    gtag("event", "download_resource", {
      id: "sap_mythbusters_ebook",
      title: "10 Myths About SAP Cloud ERP",
      placement,
    });
  };

  React.useEffect(() => {
    if (!isDone || autoStarted.current) return;
    autoStarted.current = true;
    // The anchor is in the DOM by now: this effect runs after the success panel renders.
    downloadRef.current?.click();
  }, [isDone]);

  if (isDone) {
    const s = copy.success;
    return (
      <div
        data-testid={`ebook-success-${placement}`}
        className={`${CARD_SURFACE} ${className ?? ""}`}
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-[#0a6ed1]">{s.eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{s.heading}</h2>
        <p className="mt-3 text-slate-600">{s.body}</p>

        {/*
          The helper comes BEFORE the button, because the copy says "the button below".

          And the button is deliberately secondary now: outlined rather than filled. The
          conversion is already complete by the time this panel renders and the file is
          already downloading, so a solid primary button here would read as one more required
          step. It stays full-size, focusable and obvious - it is the recovery path when a
          browser blocks the automatic download - just not the loudest thing on the panel.
        */}
        <p className="mt-4 text-[13px] leading-relaxed text-slate-500">{s.downloadNote}</p>

        {/* Both the automatic download and the fallback. The effect above clicks this same
            anchor, so there is one download path rather than two that can drift apart, and
            the tracking rides along with the navigation instead of replacing it: the file
            downloads identically whether or not analytics is loaded. */}
        <a
          ref={downloadRef}
          href={EBOOK_HREF}
          download
          onClick={trackDownload}
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {s.downloadLabel}
        </a>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <h3 className="text-lg font-semibold text-slate-900">{s.nextHeading}</h3>
          <p className="mt-2 text-sm text-slate-600">{s.nextBody}</p>
          <Button asChild className="mt-4">
            <a href={s.contactHref}>{s.expertCta}</a>
          </Button>
        </div>

        {/* The panel ends after the SAP-specialist step.

            A second block - "Imate pitanja?" / "Naš tim je tu da vam pomogne" / "Kontaktirajte
            nas" - used to follow it, pointing at the same contact page with the same intent as
            the CTA directly above. Two next-step sections, one next step. The copy is kept in
            the dictionary so it can be reused if a genuinely different destination appears. */}
      </div>
    );
  }

  return (
    <div
      data-testid={`ebook-form-${placement}`}
      className={`${CARD_SURFACE} ${className ?? ""}`}
    >
      {showIntro && (
        <>
          <h2 className="text-pretty text-[21px] font-semibold leading-snug tracking-tight text-slate-900 sm:text-[22px]">
            {copy.heading}
          </h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-slate-600">{copy.body}</p>
        </>
      )}

      {/* Stated BEFORE the fields. A Serbian visitor must know the asset is English-only
          before handing over their details, not after. Compact renders it as one quiet line
          rather than a boxed paragraph — same sentence, a third of the height. */}
      <p
        className={
          isCompact
            ? `${showIntro ? "mt-4" : ""} text-[12.5px] leading-relaxed text-slate-500`
            : "mt-5 rounded-xl border border-slate-200/70 bg-slate-50 px-4 py-3 text-[13px] leading-relaxed text-slate-600"
        }
      >
        {copy.languageNote}
      </p>

      {/*
        `ebook-formq` makes this element a query container; `ebook-fieldgrid` inside it is one
        or two columns depending on the width THIS form actually got, not the width of the
        window. Both are defined in app/globals.css, where the 27rem threshold is explained.

        Everything below the field grid — error, button, assurances, privacy — is an ordinary
        block sibling now. It used to be a grid child carrying `sm:col-span-2`, which meant the
        button's full width depended on the same breakpoint the fields did; at `lg`, where the
        fields were wrongly two-up, so was everything else.
      */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className={isCompact ? "ebook-formq mt-5" : "mt-6"}
      >
        <div className={isCompact ? "ebook-fieldgrid" : "space-y-5"}>
          {copy.fields.map((field) => (
            <div key={field.key} className="min-w-0">
              {/*
                `min-h-[1.125rem]` reserves exactly one line for every label, so the four
                inputs in a 2×2 sit on two clean baselines. The long optional label is the
                reason: at a width where it wrapped it would carry its own input 18px below
                its neighbour's, which is the uneven look §6 describes. The grid threshold
                stops it wrapping; this keeps the row honest if it ever does.
              */}
              <Label
                htmlFor={fieldId(field.key)}
                className="block min-h-[1.125rem] text-[13px] font-semibold leading-[1.125rem] text-slate-800"
              >
                {field.label}
              </Label>
              {/* h-11 rather than the shared h-10: a taller target on a conversion form,
                  applied here only so the Contact and Careers forms keep the site-wide
                  field height. */}
              <Input
                id={fieldId(field.key)}
                name={field.key}
                type={field.key === "email" ? "email" : "text"}
                value={values[field.key] ?? ""}
                onChange={handleChange}
                aria-invalid={errors[field.key] ? true : undefined}
                aria-describedby={errors[field.key] ? errorId(field.key) : undefined}
                className="mt-1.5 h-11 w-full rounded-xl border-slate-300 bg-white text-[15px] focus-visible:ring-brand-sap aria-[invalid=true]:border-red-400"
              />
              {errors[field.key] && (
                <p id={errorId(field.key)} className="mt-1.5 text-[13px] font-medium text-red-600">
                  {errors[field.key]}
                </p>
              )}
            </div>
          ))}
        </div>

        {errors.general && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700"
          >
            {errors.general}
          </p>
        )}

        <HoneypotField id={fieldId("company-website")} />

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="mt-5 h-12 w-full text-[15px] font-semibold"
        >
          {isSubmitting ? copy.submitting : copy.submit}
        </Button>

        {assurances && assurances.length > 0 && (
          <ul className="mt-3.5 flex flex-wrap gap-x-4 gap-y-2">
            {assurances.map((line) => (
              <li key={line} className="flex items-center gap-1.5 text-xs text-slate-600">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Informational acknowledgement, NOT the cookie-consent mechanism. Present beside
            BOTH form instances — a marketing document going quiet on a legal UI requirement
            does not remove it. The href is locale-owned. */}
        <p
          className="mt-4 flex items-start gap-2.5 rounded-xl bg-slate-50 px-3.5 py-3 text-[11.5px] leading-relaxed text-slate-500"
        >
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
          <span>
            {copy.privacy.before}
            <a
              className="underline underline-offset-4 hover:text-slate-700"
              href={copy.privacy.href}
            >
              {copy.privacy.linkText}
            </a>
            {copy.privacy.after}
          </span>
        </p>
      </form>
    </div>
  );
}
