import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEbookLeadEmail } from '@/lib/email'

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
 * ── Storage: none, deliberately ─────────────────────────────────────────────────
 * No CRM, no database, no third-party form backend. The owner's decision for this phase is
 * that the notification email IS the record of the lead. Stated here as well as in
 * lib/email.ts because it is the kind of constraint that gets forgotten and then
 * accidentally "fixed" by adding a dependency.
 *
 * ── Not yet protected ───────────────────────────────────────────────────────────
 * No captcha, no rate limiting, no honeypot — the same as every other public endpoint on
 * this site. That is the NEXT phase's work, and this handler is on its list. An incentivised
 * endpoint (a free asset behind it) historically attracts more automated abuse than a plain
 * contact form, so it should not be the last one done.
 */

const ebookLeadSchema = z.object({
  // The same rules the client-side form enforces, restated here because a browser is not a
  // trust boundary and the form is not the only thing that can POST to this URL.
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().min(1, 'Company is required'),
  // Optional in the client's source document, so optional here too.
  role: z.string().optional(),
  locale: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
})

/** FormData gives '' for an absent text field; treat that as absent, not as a value. */
function optional(formData: FormData, key: string): string | undefined {
  const value = formData.get(key)
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const body = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      role: optional(formData, 'role'),
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

    return NextResponse.json(
      { success: true, message: 'Thank you. Your e-book is ready to download.' },
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
