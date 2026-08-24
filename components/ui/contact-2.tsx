"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { CheckCircle, Upload, Mail, MapPin, Globe } from "lucide-react";
import type { ContactDictionary } from "@/content/dictionary";
import { useRecaptcha } from "@/components/security/useRecaptcha";
import { HoneypotField, appendHoneypot } from "@/components/security/HoneypotField";
import { RECAPTCHA_FIELD } from "@/lib/security/fields";

/**
 * The live contact form.
 *
 * Phase G made it LOCALE-AWARE by turning every hardcoded string into a lookup on a typed
 * `content` object. What deliberately did NOT change:
 *
 *   · one behavioural implementation — validation rules, FormData construction, the
 *     fetch to /api/contact, loading/success/error state machine. There is no Serbian
 *     copy of any of it.
 *   · the API contract. FormData keys stay `name`, `email`, `subject`, `message`,
 *     `phone`, `attachment` regardless of the visitor's language, so /api/contact and
 *     lib/email.ts need no change and no locale awareness.
 *   · the validation RULES (min 2 / 5 / 10 characters, email format). Only the messages
 *     are translated, via the schema factory below.
 *
 * KNOWN BUG, deliberately left alone: `errors.general` is set on failure but never
 * rendered, so a submission error is invisible to the visitor. `content.errors` carries the
 * copy in both languages so that fixing this later is a rendering change with no copy
 * decision attached.
 */

/**
 * Validation schema built from locale-specific messages.
 *
 * A factory rather than a module constant because the messages differ per locale while the
 * rules must not. Called once per render — cheap, and it keeps the rules in exactly one place.
 */
function createContactFormSchema(messages: ContactDictionary["validation"]) {
  return z.object({
    name: z.string().min(2, messages.name),
    email: z.string().email(messages.email),
    phone: z.string().optional(),
    subject: z.string().min(5, messages.subject),
    message: z.string().min(10, messages.message),
    attachment: z.any().optional()
  })
}

type ContactFormData = {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  attachment?: unknown
}

interface FormErrors {
  [key: string]: string
}

interface Contact2Props {
  /** All user-facing copy for this locale. See content/{en,sr}/contact.ts. */
  content: ContactDictionary;
}

export const Contact2 = ({ content }: Contact2Props) => {
  const { details, form, success, privacy } = content
  const contactFormSchema = createContactFormSchema(content.validation)
  const recaptcha = useRecaptcha()

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    attachment: null
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)

  // Validate form on every change
  useEffect(() => {
    const result = contactFormSchema.safeParse(formData)
    setIsValid(result.success)
    // contactFormSchema is rebuilt each render from immutable content; the rules it
    // encodes never change, so formData is the only meaningful dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, attachment: file }))
  }

  /** Lets the visible pill forward its click to the real input. */
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  /**
   * The filename the custom picker displays.
   *
   * DERIVED from form state rather than held in its own useState, so it cannot disagree with
   * what will actually be submitted — and so it clears with the rest of the form after a
   * successful send without a second reset to remember. `attachment` is typed `unknown`
   * because the Zod schema treats it as `z.any()`, hence the instanceof narrowing.
   */
  const selectedFileName =
    formData.attachment instanceof File ? formData.attachment.name : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Captured before any await: React pools the event and currentTarget is null afterwards.
    const formElement = e.currentTarget as HTMLFormElement
    setIsSubmitting(true)
    setErrors({})

    try {
      // Validate form data
      const validatedData = contactFormSchema.parse(formData)

      // Create FormData to handle file uploads.
      // These keys are the API contract and are NOT translated.
      const formDataToSend = new FormData()
      formDataToSend.append('name', validatedData.name)
      formDataToSend.append('email', validatedData.email)
      formDataToSend.append('subject', validatedData.subject)
      formDataToSend.append('message', validatedData.message)
      if (validatedData.phone) {
        formDataToSend.append('phone', validatedData.phone)
      }
      if (validatedData.attachment) {
        formDataToSend.append('attachment', validatedData.attachment as Blob)
      }

      // Submit to API
      const token = await recaptcha.execute("contact")
      if (token) formDataToSend.append(RECAPTCHA_FIELD, token)
      appendHoneypot(formDataToSend, formElement)

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formDataToSend,
      })

      const result = await response.json()

      if (result.success) {
        console.log("Form submitted successfully:", validatedData)
        setIsSubmitted(true)
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          attachment: null
        })

        // Show warning if attachment couldn't be processed
        if (result.warning) {
          console.warn("Attachment warning:", result.warning)
          setWarning(result.warning)
        }
      } else {
        console.error("Form submission failed:", result.message)
        setErrors({ general: result.message || content.errors.submitFailed })
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FormErrors = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        console.error("Error submitting form:", error)
        setErrors({ general: content.errors.unexpected })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section className="py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">{success.heading}</h2>
            <p className="text-gray-600 mb-6">
              {success.body}
            </p>
            {warning && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">{success.attachmentNoticeHeading}</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>{success.attachmentNoticeBody}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Button onClick={() => {
              setIsSubmitted(false)
              setWarning(null)
            }} variant="outline">
              {success.sendAnother}
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-40 pb-32">
      <div className="container">
        <div className="mx-auto flex max-w-screen-xl flex-col justify-between gap-10 lg:flex-row lg:gap-20">
          {/* MOBILE OVERFLOW FIX (below ~375px).
              `mx-auto` makes this a shrink-to-fit flex item, and shrink-to-fit is floored at
              the element's min-content width. That floor was 344px (en) / 338px (sr), set by
              the single longest word in the h1 below at text-5xl — wider than the 312px the
              container offers at 360px, so the document scrolled sideways.
              `w-full` gives the column an explicit width instead of shrink-to-fit, so it
              tracks the container; `lg:w-auto` restores the original sizing from lg up, where
              the two-column row layout takes over. max-w-sm still caps it. */}
          <div className="mx-auto flex w-full max-w-sm flex-col justify-between gap-10 lg:w-auto">
            <div className="text-center lg:text-left">
              {/* With the column now narrower than that longest word on small phones, the word
                  itself has to be breakable or it would overflow its own box.
                  `lg:break-normal` scopes this to the single-column layout only: from lg up,
                  the two-column row lets that word overhang its 384px box exactly as it did
                  before, so the desktop heading still wraps onto the same 3 lines. */}
              <h1 className="mb-2 break-words text-5xl font-semibold lg:mb-1 lg:break-normal lg:text-6xl">
                {content.hero.heading}
              </h1>
              <p className="text-muted-foreground">{content.hero.description}</p>
            </div>
            <div className="mx-auto w-fit lg:mx-0">
              <h3 className="mb-6 text-center text-2xl font-semibold lg:text-left">
                {details.heading}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <span className="font-bold">{details.emailLabel}</span>
                    <a href={`mailto:${details.email}`} className="underline">
                      {details.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <span className="font-bold">{details.addressLabel}</span>
                    <span>{details.address}</span>
                  </div>
                </li>
                <li className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <span className="font-bold">{details.webLabel}</span>
                    <a href={details.web.url} target="_blank" rel="noopener noreferrer" className="underline">
                      {details.web.label}
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="mx-auto flex max-w-screen-md flex-col gap-6 rounded-lg border p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <HoneypotField id="contact-page-company-website" />

              <div className="flex gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="name">{form.nameLabel}</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={form.namePlaceholder}
                    className={errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    required
                  />
                  {errors.name && (
                    <p id="name-error" className="text-sm text-red-600 mt-1" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="phone">{form.phoneLabel}</Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={form.phonePlaceholder}
                  />
                </div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">{form.emailLabel}</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={form.emailPlaceholder}
                  className={errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  required
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-600 mt-1" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="subject">{form.subjectLabel}</Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder={form.subjectPlaceholder}
                  className={errors.subject ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                  aria-invalid={errors.subject ? "true" : "false"}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                  required
                />
                {errors.subject && (
                  <p id="subject-error" className="text-sm text-red-600 mt-1" role="alert">
                    {errors.subject}
                  </p>
                )}
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="message">{form.messageLabel}</Label>
                <Textarea
                  placeholder={form.messagePlaceholder}
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className={errors.message ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  required
                />
                {errors.message && (
                  <p id="message-error" className="text-sm text-red-600 mt-1" role="alert">
                    {errors.message}
                  </p>
                )}
              </div>
              {/* ── The attachment field ──────────────────────────────────────────────
                  A native file input paints its own button and its own "no file" text, and it
                  takes that copy from the BROWSER's locale rather than the page's. So
                  /sr/contact showed "Choose file / No file chosen" between Serbian labels on
                  any English-configured browser, and no amount of page-level localisation
                  could reach it.

                  The fix is presentation only. The real <input type="file"> is still here with
                  the same id, name, `accept` list and onChange handler, and it is still what
                  the browser opens and what FormData reads. It is `sr-only` rather than
                  `hidden`, which is the whole trick: it stays in the accessibility tree and
                  stays focusable, so keyboard and screen-reader behaviour is the native one.

                  ── Why the pill is a <button> and not a second <label> ────────────────
                  A second `<label htmlFor="attachment">` would have been fewer lines and it
                  is what the obvious version of this looks like. It is wrong twice over: the
                  input would have TWO labelling elements, so its accessible name becomes
                  "Attachment Choose file", and "the label of this field" stops having a single
                  answer. The pill is therefore a `type="button"` that forwards its click to the
                  input, marked `aria-hidden` with `tabIndex={-1}` because it is pure mouse
                  affordance: a keyboard user focuses the real input (the ring below shows it)
                  and presses Enter or Space, which is the native way to open a file picker.
                  One label, one tab stop, one accessible name.

                  Nothing about validation moved. The accepted types are still `accept` here
                  and the 10 MB limit is still the size check in app/api/contact/route.ts. This
                  adds no client-side gate, pre-screens nothing and fakes no part of the
                  upload. */}
              <div className="grid w-full min-w-0 gap-1.5">
                <Label htmlFor="attachment">{form.attachmentLabel}</Label>
                <div className="min-w-0">
                  <input
                    ref={fileInputRef}
                    id="attachment"
                    name="attachment"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="peer sr-only"
                    aria-describedby="attachment-hint attachment-state"
                  />
                  {/* The focus ring lands HERE, on the visible half, because the input it
                      belongs to is off-screen. Without `peer-focus-visible` a keyboard user
                      would tab into the field and see nothing at all happen. */}
                  <div className="flex w-full min-w-0 items-center gap-3 rounded-md border border-input bg-background p-1 pr-3 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2">
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-hidden="true"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                    >
                      <Upload className="h-4 w-4" aria-hidden="true" />
                      {form.attachmentButton}
                    </button>
                    {/* aria-live so the choice is ANNOUNCED, not just visible. `truncate` needs
                        `min-w-0` on every ancestor up to the grid, or the flex row is sized by
                        its longest word and a long filename pushes the document sideways —
                        which it did, by 342px at 320px wide, before those were added. */}
                    <span
                      id="attachment-state"
                      aria-live="polite"
                      title={selectedFileName ?? undefined}
                      className={`min-w-0 flex-1 truncate text-sm ${
                        selectedFileName ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {selectedFileName ?? form.attachmentEmpty}
                    </span>
                  </div>
                </div>
                <p id="attachment-hint" className="text-xs text-gray-500">
                  {form.attachmentHint}
                </p>
              </div>
              {/* Owner-approved wording in BOTH languages. This is an informational
                  acknowledgement, NOT the cookie-consent mechanism — do not reword to
                  "agree"/"accept" or "pristajete"/"prihvatate". */}
              <div className="text-xs text-gray-600">
                {privacy.before}
                <a href={privacy.href} className="text-primary hover:underline">
                  {privacy.linkText}
                </a>
                {privacy.after}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? form.submitting : form.submit}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
