"use client";

import * as React from "react";
import { useState } from "react";
import { z } from "zod";
import { CheckCircle } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { HomeDictionary } from "@/content/dictionary";

/**
 * The short business enquiry form on the homepage.
 *
 * ── Why this is not Contact2 ────────────────────────────────────────────────────
 * components/ui/contact-2.tsx renders the WHOLE Contact page — hero, details column, CTA
 * cards, attachment handling — and is not a reusable form primitive. Reusing it here would
 * have meant either duplicating that page on the homepage or growing it a `variant` prop
 * that forks its markup in six places.
 *
 * What IS reused is the part that matters: /api/contact, its Zod rules, its FormData keys
 * and lib/email.ts. There is no second contact backend, and none was added.
 *
 * ── The fields, and the one that is absent ──────────────────────────────────────
 * Name, Business Email, Company, Message. No phone, no attachment, and explicitly NO
 * LinkedIn and NO CV upload — those belong to the job application on /careers, and keeping
 * the two forms visibly different is the point of the split the client asked for.
 *
 * ── The subject ────────────────────────────────────────────────────────────────
 * /api/contact requires `subject` to be at least 5 characters, and the client did not ask
 * for a subject field. So the form sends a fixed internal value rather than showing a field
 * nobody asked for and nobody would fill in usefully. It is deliberately NOT translated: it
 * is an API value and an email subject line for the Infinus inbox, not visitor-facing copy,
 * and a Serbian submission arriving under a different subject than an English one would
 * make the inbox harder to work with, not easier.
 */

/** Not copy. See the note above: this reaches /api/contact and the notification subject. */
const INTERNAL_SUBJECT = "Website contact form";

function createSchema(messages: HomeDictionary["contactShort"]["validation"]) {
  return z.object({
    // The same rules /api/contact enforces server-side. Only the wording is per locale.
    name: z.string().min(2, messages.name),
    email: z.string().email(messages.email),
    company: z.string().optional(),
    message: z.string().min(10, messages.message),
  });
}

type FormValues = z.infer<ReturnType<typeof createSchema>>;
type FieldErrors = Partial<Record<keyof FormValues | "general", string>>;

export function HomeContactSection({ copy }: { copy: HomeDictionary["contactShort"] }) {
  const schema = createSchema(copy.validation);

  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      // These keys ARE the API contract and are never translated.
      const body = new FormData();
      body.append("name", parsed.data.name);
      body.append("email", parsed.data.email);
      body.append("subject", INTERNAL_SUBJECT);
      body.append("message", parsed.data.message);
      if (parsed.data.company) body.append("company", parsed.data.company);

      const response = await fetch("/api/contact", { method: "POST", body });
      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
      } else {
        // Rendered, unlike the Contact page's equivalent — see the dictionary note.
        setErrors({ general: copy.error });
      }
    } catch {
      setErrors({ general: copy.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-emerald-600" aria-hidden="true" />
        <h2 className="text-3xl font-semibold text-slate-900">{copy.success.heading}</h2>
        <p className="mt-3 text-slate-600">{copy.success.body}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          {copy.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-[60ch] text-slate-600">{copy.body}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="home-contact-name">{copy.nameLabel}</Label>
            <Input
              id="home-contact-name"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder={copy.namePlaceholder}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "home-contact-name-error" : undefined}
            />
            {errors.name && (
              <p id="home-contact-name-error" className="text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="home-contact-email">{copy.emailLabel}</Label>
            <Input
              id="home-contact-email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder={copy.emailPlaceholder}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "home-contact-email-error" : undefined}
            />
            {errors.email && (
              <p id="home-contact-email-error" className="text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="home-contact-company">{copy.companyLabel}</Label>
          <Input
            id="home-contact-company"
            name="company"
            value={values.company}
            onChange={handleChange}
            placeholder={copy.companyPlaceholder}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="home-contact-message">{copy.messageLabel}</Label>
          <Textarea
            id="home-contact-message"
            name="message"
            rows={5}
            value={values.message}
            onChange={handleChange}
            placeholder={copy.messagePlaceholder}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "home-contact-message-error" : undefined}
          />
          {errors.message && (
            <p id="home-contact-message-error" className="text-sm text-red-600">
              {errors.message}
            </p>
          )}
        </div>

        {errors.general && (
          <p role="alert" className="text-sm text-red-600">
            {errors.general}
          </p>
        )}

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
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
