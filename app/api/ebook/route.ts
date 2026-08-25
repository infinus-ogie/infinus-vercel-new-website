import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEbookLeadEmail } from '@/lib/email'
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
 * ── One outcome, one response ───────────────────────────────────────────────────
 * `success` and a message. Nothing about mail crosses the wire, because the only send left
 * is internal and the visitor's download does not depend on it.
 *
 * ── Storage: none, deliberately ─────────────────────────────────────────────────
 * No CRM, no database, no third-party form backend. The owner's decision for this phase is
 * that the notification email IS the record of the lead. Stated here as well as in
 * lib/email.ts because it is the kind of constraint that gets forgotten and then
 * accidentally "fixed" by adding a dependency.
 *
 * ── It no longer emails a USER-SUPPLIED address ─────────────────────────────────
 * It used to. The Serbian page promised "Kopiju ćete dobiti i putem e-maila", so the handler
 * sent the download link to whatever address was submitted — which made this the only
 * endpoint on the site that emailed a member of the public, and gave it the abuse profile
 * that goes with that: someone could try to push Infinus-branded mail at arbitrary inboxes.
 *
 * The owner withdrew the delivery email, so that surface is GONE rather than mitigated. Every
 * send this route can still cause goes to RECIPIENT_EMAILS, a fixed server-owned list.
 *
 * The guards remain and are not weakened by that: honeypot, same-origin, rate limit and
 * reCAPTCHA all still run before the first email call, because the internal notification is
 * itself worth protecting from flooding. A rejected request sends nothing at all — see
 * lib/security/guard.ts. Durable (cross-instance) rate limiting is still outstanding.
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

/**
 * The one thing a rejected submission is told, matching /api/contact and /api/join-team.
 *
 * The previous version returned `errors: error.errors` — Zod's issue array — which named
 * every failing field back to whoever was probing. It carried no secret and no stack, but it
 * was a free map of the schema, and it was the only public endpoint that answered differently
 * from the other two. One shape, one message.
 *
 * The client does not need the detail: EbookForm runs its own Zod parse and renders its own
 * per-field messages before it ever POSTs.
 */
const GENERIC_REJECTION = 'We could not process this submission. Please try again.'

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

    // ── No delivery email ────────────────────────────────────────────────────────
    // This endpoint used to send the download link to the address the visitor typed in, and
    // reported the outcome as `emailDelivered` so the success panel knew whether it could
    // claim a copy was on its way. That flow is withdrawn: the browser downloads the PDF
    // directly once this responds, so there is nothing to promise and nothing to report.
    //
    // Worth stating plainly, because it changes this route's risk profile: it no longer
    // sends mail to ANY user-supplied recipient. The one send left is the internal lead
    // notification above, which goes to a fixed server-owned recipient list.
    return NextResponse.json(
      { success: true, message: 'Thank you. Your e-book is ready to download.' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Field PATHS only, never the values — a submitted business email and company name are
      // personal data, and there is no debugging question that needs them in a log.
      console.warn('[ebook] validation failed:', error.errors.map((e) => e.path.join('.')))
      return NextResponse.json({ success: false, message: GENERIC_REJECTION }, { status: 400 })
    }

    console.error('[ebook] unexpected error:', error)
    return NextResponse.json({ success: false, message: GENERIC_REJECTION }, { status: 500 })
  }
}
