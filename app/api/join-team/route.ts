import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendJoinTeamEmail } from '@/lib/email'
import { guardFormRequest } from '@/lib/security/guard'
import { RECAPTCHA_ACTIONS } from '@/lib/security/recaptcha'
import { FIELD_LIMITS, FILE_LIMITS } from '@/lib/security/limits'
import { checkUploadedFile, CAREERS_FILE_TYPES } from '@/lib/security/files'
import { isHttpsWebUrl } from '@/lib/security/url'

/**
 * The job-application endpoint, used by /careers and /sr/careers.
 *
 * ── Brought up to the Contact endpoint's standard ───────────────────────────────
 * This route accepted an attachment with NO server-side checks at all: no size limit, no
 * extension allowlist, no MIME check. The 5MB ceiling and the PDF/DOC/DOCX list existed only
 * in the browser, where they are a convenience for the file picker and nothing more —
 * a POST that never touched the picker was unconstrained.
 *
 * It now runs the same validation Contact does, against the allowlist the form's own hint
 * already advertises: PDF, DOC, DOCX, max 5MB. No visible format was added or removed.
 *
 * ── Guarded before it does anything ─────────────────────────────────────────────
 * Honeypot, same-origin, rate limit and reCAPTCHA all run before validation, before the CV
 * is read and before any mail call.
 *
 * ── What is deliberately NOT logged ─────────────────────────────────────────────
 * The previous version logged the entire validated submission — name, email, phone,
 * LinkedIn and the full covering message — on every successful application. That is a
 * candidate's personal data sitting in a log for no operational reason. Gone.
 */

const joinTeamFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(FIELD_LIMITS.name),
  email: z.string().email('Invalid email address').max(FIELD_LIMITS.email),
  phone: z.string().max(FIELD_LIMITS.phone).optional(),
  // An HTTPS URL or nothing. The empty-string branch is how the form submits an untouched
  // field.
  //
  // `.url()` alone is NOT enough here: it accepts `javascript:`, `data:`, `file:` and
  // `ftp:`, all of which are valid URLs by `new URL()`'s definition. This value becomes the
  // `href` of an anchor in the internal application email, where escaping stops it breaking
  // out of the attribute but says nothing about what the attribute points at.
  // See lib/security/url.ts.
  linkedin: z
    .string()
    .max(FIELD_LIMITS.linkedin)
    .refine(isHttpsWebUrl, 'LinkedIn must be an https:// URL')
    .optional()
    .or(z.literal('')),
  subject: z.string().trim().min(5, 'Subject must be at least 5 characters').max(FIELD_LIMITS.subject),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(FIELD_LIMITS.message),
  utm_source: z.string().max(FIELD_LIMITS.utm).optional(),
  utm_medium: z.string().max(FIELD_LIMITS.utm).optional(),
  utm_campaign: z.string().max(FIELD_LIMITS.utm).optional(),
})

const GENERIC_REJECTION = 'We could not process this submission. Please try again.'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const guard = await guardFormRequest({
      request,
      formData,
      action: RECAPTCHA_ACTIONS.careers,
      rateLimitKind: 'careers',
    })
    if (!guard.ok) return guard.response

    const body = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || undefined,
      linkedin: (formData.get('linkedin') as string) || undefined,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      utm_source: (formData.get('utm_source') as string) || undefined,
      utm_medium: (formData.get('utm_medium') as string) || undefined,
      utm_campaign: (formData.get('utm_campaign') as string) || undefined,
    }

    const validatedData = joinTeamFormSchema.parse(body)

    // ── The CV, optional ───────────────────────────────────────────────────────
    const uploaded = formData.get('file')
    let file: { file: File; safeFilename: string } | undefined

    if (uploaded instanceof File && uploaded.size > 0) {
      const check = await checkUploadedFile(uploaded, {
        allowed: CAREERS_FILE_TYPES,
        maxBytes: FILE_LIMITS.careersBytes,
      })

      if (!check.ok) {
        console.warn('[security] careers attachment rejected', { reason: check.reason })
        return NextResponse.json({ success: false, message: GENERIC_REJECTION }, { status: 400 })
      }

      file = { file: uploaded, safeFilename: check.safeFilename }
    }

    const emailResult = await sendJoinTeamEmail({ ...validatedData, file })

    if (!emailResult.success) {
      console.error('[careers] send failed:', emailResult.error)
      return NextResponse.json(
        { success: false, message: 'Failed to send your application. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Thank you for your application. We will get back to you soon!' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Field names only — never the values, which are an applicant's personal data.
      console.warn('[careers] validation failed:', error.errors.map((e) => e.path.join('.')))
      return NextResponse.json({ success: false, message: GENERIC_REJECTION }, { status: 400 })
    }

    console.error('[careers] unexpected error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}
