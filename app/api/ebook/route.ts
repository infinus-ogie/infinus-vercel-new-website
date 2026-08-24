import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEbookLeadEmail, sendEbookDeliveryEmail } from '@/lib/email'
import { guardFormRequest } from '@/lib/security/guard'
import { RECAPTCHA_ACTIONS } from '@/lib/security/recaptcha'
import { FIELD_LIMITS } from '@/lib/security/limits'

/**
 * The SAP MythBusting e-book lead endpoint.
 *
 * ── Why this exists rather than reusing /api/contact ────────────────────────────
 * That endpoint requires `subject` >= 5 and `message` >= 10 characters. This form has
 * neither field, and inventing values to satisfy those rules would push e-book leads into
 * the contact notification stream under a fabricated subject and body — making the shared
 * inbox harder to work with, which is the opposite of the point.
 *
 * What IS reused is everything that matters: lib/email.ts, its transport and its recipient
 * list. There is one mail path on this site, not three.
 *
 * ── Two independent outcomes, one response ──────────────────────────────────────
 * A submission and a delivery email can succeed independently, so the response reports both:
 * `success` for the submission and `emailDelivered` for the convenience copy. The success UI
 * keys off the second to decide whether it may claim an email was sent.
 *
 * `emailDelivered` is a boolean and carries no diagnostic detail — see the response itself.
 *
 * ── Storage: none, deliberately ─────────────────────────────────────────────────
 * No CRM, no database, no third-party form backend. The owner's decision for this phase is
 * that the notification email IS the record of the lead. Stated here as well as in
 * lib/email.ts because it is the kind of constraint that gets forgotten and then
 * accidentally "fixed" by adding a dependency.
 *
 * ── It now sends mail to a USER-SUPPLIED address, which raises the stakes ───────
 * The Serbian page promises "Kopiju ćete dobiti i putem e-maila", so the handler actually
 * sends it. That makes this the only endpoint on the site that emails a member of the
 * public, and it changes its abuse profile: an attacker could try to use it to push
 * Infinus-branded mail at arbitrary inboxes.
 *
 * What contains that, short of the security phase:
 *   · the template is FIXED and server-owned — see EBOOK_DELIVERY_COPY in lib/email.ts.
 *     Nothing submitted controls the sender, the subject, the body or any recipient beyond
 *     the To: header, and the one interpolated value is HTML-escaped.
 *   · one message per submission, sent only AFTER validation passes and only AFTER the lead
 *     has been filed, so no send happens without a corresponding internal record of it.
 *
 * That is why this endpoint is guarded before it does ANYTHING: honeypot, same-origin,
 * rate limit and reCAPTCHA all run before the first email call. A rejected request sends no
 * internal notification and no delivery email — see lib/security/guard.ts.
 */

/**
 * The fields BOTH locales send. `role` and `country` are locale-specific and are checked
 * separately below, because "required" is not a property of the field — it is a property of
 * the field IN A LOCALE.
 */
const baseSchema = z.object({
  // The same rules the client-side form enforces, restated here because a browser is not a
  // trust boundary and the form is not the only thing that can POST to this URL.
  // Ceilings as well as floors: without a maximum, a POST can carry a multi-megabyte
  // "name" into a Zod parse, an email template and a mail server. See lib/security/limits.ts.
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(FIELD_LIMITS.name),
  email: z.string().email('Invalid email address').max(FIELD_LIMITS.email),
  company: z.string().trim().min(1, 'Company is required').max(FIELD_LIMITS.company),
  // Present on the ENGLISH form, optional there. Never sent by the Serbian form.
  role: z.string().max(FIELD_LIMITS.role).optional(),
  // Present on the SERBIAN form and required there. Never sent by the English form.
  country: z.string().max(FIELD_LIMITS.country).optional(),
  locale: z.enum(['en', 'sr']).optional(),
  utm_source: z.string().max(FIELD_LIMITS.utm).optional(),
  utm_medium: z.string().max(FIELD_LIMITS.utm).optional(),
  utm_campaign: z.string().max(FIELD_LIMITS.utm).optional(),
})

/**
 * Locale-aware validation, layered on top.
 *
 * The two landing pages ask for different things — the client wrote two different source
 * documents — so requiring `country` from an English submission, or `role` from a Serbian
 * one, would reject valid leads. The API KEYS stay untranslated either way; only which of
 * them must be present varies.
 */
const ebookLeadSchema = baseSchema.superRefine((data, ctx) => {
  if (data.locale === 'sr' && !data.country?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['country'],
      message: 'Country is required',
    })
  }
})

/** FormData gives '' for an absent text field; treat that as absent, not as a value. */
function optional(formData: FormData, key: string): string | undefined {
  const value = formData.get(key)
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Every abuse check, before any work. A rejection returns here having sent nothing —
    // which is the whole point on the one endpoint that emails a user-supplied address.
    const guard = await guardFormRequest({
      request,
      formData,
      action: RECAPTCHA_ACTIONS.ebook,
      rateLimitKind: 'ebook',
    })
    if (!guard.ok) return guard.response

    const body = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      role: optional(formData, 'role'),
      country: optional(formData, 'country'),
      locale: optional(formData, 'locale'),
      utm_source: optional(formData, 'utm_source'),
      utm_medium: optional(formData, 'utm_medium'),
      utm_campaign: optional(formData, 'utm_campaign'),
    }

    const validatedData = ebookLeadSchema.parse(body)

    const emailResult = await sendEbookLeadEmail(validatedData)

    if (!emailResult.success) {
      // The notification is the ONLY record of this lead, so a failed send is a failed
      // submission. Reporting success here would lose the lead silently.
      console.error('Failed to send e-book lead email:', emailResult.error)
      return NextResponse.json(
        { success: false, message: 'Failed to send email notification' },
        { status: 500 }
      )
    }

    // ── The delivery email, sent to the visitor ──────────────────────────────────
    // Only AFTER validation has passed and the lead has been recorded, so this endpoint
    // cannot be used to send mail to an address without also filing a lead about it.
    //
    // A failure here does NOT fail the submission: the visitor already has their download on
    // screen and the lead is already captured. Reporting failure would take away a file they
    // can see, over a convenience copy.
    const deliveryResult = await sendEbookDeliveryEmail({
      name: validatedData.name,
      email: validatedData.email,
      locale: validatedData.locale ?? 'en',
    })

    if (!deliveryResult.success) {
      // Logged server-side with the provider's message. Deliberately NOT returned — see the
      // response below.
      console.error('E-book delivery email failed (lead was still captured):', deliveryResult.error)
    }

    // `emailDelivered` is a BOOLEAN and nothing else.
    //
    // The success panel needs to know whether it may say "a copy is on its way", because
    // claiming that when the send failed is a promise the visitor can check and find false.
    // But it needs ONLY that. The provider's error text can carry the SMTP host, the
    // authenticated sender, the recipient, a bounce reason or a stack — none of which a
    // browser has any business seeing. So the boolean crosses the wire and the detail stays
    // in the server log.
    return NextResponse.json(
      {
        success: true,
        emailDelivered: deliveryResult.success === true,
        message: 'Thank you. Your e-book is ready to download.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('E-book form error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid form data', errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}
