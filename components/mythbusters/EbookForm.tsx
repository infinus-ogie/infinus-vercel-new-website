"use client";

import * as React from "react";
import { useState } from "react";
import { z } from "zod";
import { CheckCircle, Download } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { MythBustersDictionary } from "@/content/dictionary";
import type { Locale } from "@/lib/i18n";

/**
 * The e-book download form.
 *
 * ── Four fields, exactly as the client specified ────────────────────────────────
 * Full Name, Business Email, Company, and Role or Job Title — the last one optional, which
 * the source marks in the label itself rather than with an asterisk.
 *
 * ── Why /api/ebook and not /api/contact ─────────────────────────────────────────
 * /api/contact requires `subject` >= 5 and `message` >= 10. This form has neither, and
 * inventing values to satisfy those rules would push e-book leads into the contact
 * notification stream under a fabricated subject and body. A dedicated handler keeps the two
 * kinds of enquiry distinguishable in the inbox. It reuses lib/email.ts, so no new mail
 * infrastructure exists either way.
 *
 * ── The gate is a marketing gate, not a security boundary ───────────────────────
 * The PDF sits in public/ and is publicly addressable. That is the approved model for this
 * phase: no signed URLs, no auth, no expiring tokens. Anyone with the URL can bypass the
 * form, and that is understood.
 *
 * ── The download is user-initiated ──────────────────────────────────────────────
 * On success the panel renders a real link and clicks it programmatically. Browsers block
 * window.open() that is not tied to a user gesture, so the visible link is the reliable
 * path and the auto-click is the convenience — never the other way round.
 */

const EBOOK_HREF = "/downloads/SAP_Mythbusting_Campaign_E-Book_Infinus.pdf";

function createSchema(messages: MythBustersDictionary["form"]["validation"]) {
  return z.object({
    name: z.string().min(2, messages.name),
    email: z.string().email(messages.email),
    company: z.string().min(1, messages.company),
    // Optional in the source, so optional here. No message, because it cannot fail.
    role: z.string().optional(),
  });
}

type FormValues = z.infer<ReturnType<typeof createSchema>>;
type FieldErrors = Partial<Record<keyof FormValues | "general", string>>;

export function EbookForm({
  copy,
  locale,
}: {
  copy: MythBustersDictionary["form"];
  /** Sent with the lead so the notification says which half of the pair it came from. */
  locale: Locale;
}) {
  const schema = createSchema(copy.validation);

  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    company: "",
    role: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const downloadRef = React.useRef<HTMLAnchorElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.errors) {
        const key = issue.path[0] as keyof FormValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setIsSubmitting(true);
    try {
      // Untranslated keys: this is the API contract, not copy.
      const body = new FormData();
      body.append("name", parsed.data.name);
      body.append("email", parsed.data.email);
      body.append("company", parsed.data.company);
      if (parsed.data.role) body.append("role", parsed.data.role);
      body.append("locale", locale);

      // UTM attribution, captured the same way the Careers form does it.
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

      // Consent-gated analytics, reusing the event name the resource modal already uses so
      // downloads stay comparable across the site.
      if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
        (window as any).gtag("event", "download_resource", {
          id: "sap_mythbusters_ebook",
          title: "10 Myths About SAP Cloud ERP",
        });
      }
    } catch {
      setErrors({ general: copy.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fire the download once the success panel exists, so the anchor is in the DOM.
  React.useEffect(() => {
    if (isDone) downloadRef.current?.click();
  }, [isDone]);

  if (isDone) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-emerald-600" aria-hidden="true" />
        <h3 className="text-2xl font-semibold text-slate-900">{copy.success.heading}</h3>
        <p className="mt-3 text-slate-600">{copy.success.body}</p>
        <a
          ref={downloadRef}
          href={EBOOK_HREF}
          download
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {copy.success.downloadLabel}
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">{copy.heading}</h2>
      <p className="mt-2 text-slate-600">{copy.body}</p>

      {/* Stated BEFORE the fields. A Serbian visitor must know the asset is English-only
          before handing over their details, not after. */}
      <p className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
        {copy.languageNote}
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ebook-name">{copy.nameLabel}</Label>
          <Input
            id="ebook-name"
            name="name"
            value={values.name}
            onChange={handleChange}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "ebook-name-error" : undefined}
          />
          {errors.name && (
            <p id="ebook-name-error" className="text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ebook-email">{copy.emailLabel}</Label>
          <Input
            id="ebook-email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "ebook-email-error" : undefined}
          />
          {errors.email && (
            <p id="ebook-email-error" className="text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ebook-company">{copy.companyLabel}</Label>
          <Input
            id="ebook-company"
            name="company"
            value={values.company}
            onChange={handleChange}
            aria-invalid={errors.company ? true : undefined}
            aria-describedby={errors.company ? "ebook-company-error" : undefined}
          />
          {errors.company && (
            <p id="ebook-company-error" className="text-sm text-red-600">
              {errors.company}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ebook-role">{copy.roleLabel}</Label>
          <Input id="ebook-role" name="role" value={values.role} onChange={handleChange} />
        </div>

        {errors.general && (
          <p role="alert" className="text-sm text-red-600">
            {errors.general}
          </p>
        )}

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? copy.submitting : copy.submit}
        </Button>

        {/* Informational acknowledgement, NOT the cookie-consent mechanism. The href is
            locale-owned, so a Serbian visitor is never sent to the English document. */}
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
