"use client";

import * as React from "react";
import { useId, useState } from "react";
import { z } from "zod";
import { CheckCircle2, Download } from "lucide-react";

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
 * ── The success panel only claims what actually happened ────────────────────────
 * /api/ebook reports `emailDelivered`, and the "a copy is on its way" block renders only
 * when it is true. A failed convenience copy does not turn a successful submission into an
 * error state — the visitor still gets the confirmation and the download.
 */

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
}: {
  copy: MythBustersDictionary["form"];
  locale: Locale;
  placement: "hero" | "closing";
  /** The reassurance lines the Serbian source prints under the CTA. */
  assurances?: readonly string[];
  className?: string;
}) {
  // One per mounted instance. This is what keeps two forms on one page from colliding.
  const uid = useId();
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
  const [emailDelivered, setEmailDelivered] = useState(false);
  const downloadRef = React.useRef<HTMLAnchorElement | null>(null);

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

      setEmailDelivered(result.emailDelivered === true);
      setIsDone(true);

      if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
        (window as any).gtag("event", "download_resource", {
          id: "sap_mythbusters_ebook",
          title: "10 Myths About SAP Cloud ERP",
          placement,
        });
      }
    } catch {
      setErrors({ general: copy.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fire the download once the success panel exists, so the anchor is in the DOM. The
  // visible link is the reliable path; the click is the convenience.
  React.useEffect(() => {
    if (isDone) downloadRef.current?.click();
  }, [isDone]);

  if (isDone) {
    const s = copy.success;
    return (
      <div
        data-testid={`ebook-success-${placement}`}
        data-email-delivered={emailDelivered ? "true" : "false"}
        className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 ${className ?? ""}`}
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-[#0a6ed1]">{s.eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{s.heading}</h2>
        <p className="mt-3 text-slate-600">{s.body}</p>

        <a
          ref={downloadRef}
          href={EBOOK_HREF}
          download
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {s.downloadLabel}
        </a>
        <p className="mt-2 text-xs text-slate-500">{s.downloadNote}</p>

        {/* Only claimed when it actually happened. When the send failed the submission is
            still a success — the lead is captured and the download is right above — so this
            is a neutral restatement of where the file is, not an error. A red state here
            would misrepresent what went wrong and to whom it matters. */}
        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          {emailDelivered ? (
            <>
              <p className="text-sm font-semibold text-slate-900">{s.emailHeading}</p>
              <p className="mt-1 text-sm text-slate-600">{s.emailBody}</p>
            </>
          ) : (
            <p className="text-sm text-slate-600">{s.emailFallback}</p>
          )}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <h3 className="text-lg font-semibold text-slate-900">{s.nextHeading}</h3>
          <p className="mt-2 text-sm text-slate-600">{s.nextBody}</p>
          <Button asChild className="mt-4">
            <a href={s.contactHref}>{s.expertCta}</a>
          </Button>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <h3 className="text-base font-semibold text-slate-900">{s.questionsHeading}</h3>
          <p className="mt-1 text-sm text-slate-600">{s.questionsBody}</p>
          <Button asChild variant="outline" className="mt-4">
            <a href={s.contactHref}>{s.contactCta}</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid={`ebook-form-${placement}`}
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 ${className ?? ""}`}
    >
      <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">{copy.heading}</h2>
      <p className="mt-2 text-sm text-slate-600">{copy.body}</p>

      {/* Stated BEFORE the fields. A Serbian visitor must know the asset is English-only
          before handing over their details, not after. */}
      <p className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
        {copy.languageNote}
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        {copy.fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={fieldId(field.key)}>{field.label}</Label>
            <Input
              id={fieldId(field.key)}
              name={field.key}
              type={field.key === "email" ? "email" : "text"}
              value={values[field.key] ?? ""}
              onChange={handleChange}
              aria-invalid={errors[field.key] ? true : undefined}
              aria-describedby={errors[field.key] ? errorId(field.key) : undefined}
            />
            {errors[field.key] && (
              <p id={errorId(field.key)} className="text-sm text-red-600">
                {errors[field.key]}
              </p>
            )}
          </div>
        ))}

        {errors.general && (
          <p role="alert" className="text-sm text-red-600">
            {errors.general}
          </p>
        )}

        <HoneypotField id={fieldId("company-website")} />

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? copy.submitting : copy.submit}
        </Button>

        {assurances && assurances.length > 0 && (
          <ul className="space-y-1.5">
            {assurances.map((line) => (
              <li key={line} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Informational acknowledgement, NOT the cookie-consent mechanism. Present beside
            BOTH form instances — a marketing document going quiet on a legal UI requirement
            does not remove it. The href is locale-owned. */}
        <p className="text-xs text-slate-500">
          {copy.privacy.before}
          <a className="underline underline-offset-4 hover:text-slate-700" href={copy.privacy.href}>
            {copy.privacy.linkText}
          </a>
          {copy.privacy.after}
        </p>
      </form>
    </div>
  );
}
