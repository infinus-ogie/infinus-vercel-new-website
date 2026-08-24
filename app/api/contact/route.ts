import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendContactFormEmail } from '@/lib/email'
import { guardFormRequest } from '@/lib/security/guard'
import { RECAPTCHA_ACTIONS } from '@/lib/security/recaptcha'
import { FIELD_LIMITS, FILE_LIMITS } from '@/lib/security/limits'
import { checkUploadedFile, CONTACT_FILE_TYPES } from '@/lib/security/files'

/**
 * The contact endpoint, used by three surfaces: /contact, /sr/contact and the homepage
 * short business form.
 *
 * ── Guarded before it does anything ─────────────────────────────────────────────
 * Honeypot, same-origin, rate limit and reCAPTCHA all run before validation, before the
 * attachment is touched and before any mail call. A rejected request costs one FormData
 * parse and sends nothing.
 *
 * ── The attachment is the interesting part ──────────────────────────────────────
 * It used to be checked on size and on the browser's declared MIME type. Both of those are
 * attacker-controlled, so a renamed executable with a forged Content-Type passed. Validation
 * now requires the extension, the MIME type AND the file's first bytes to agree, and the
 * filename is sanitised before it reaches a MIME header — see lib/security/files.ts.
 *
 * The approved allowlist is unchanged: PDF, DOC, DOCX, TXT, max 10MB, exactly as the page's
 * own hint says.
 *
 * ── Responses say nothing ───────────────────────────────────────────────────────
 * Validation and security rejections return one generic message. The previous version
 * echoed Zod's issue list, the offending file's size and type, and the mail provider's error
 * text straight to the browser. All of that is now logged instead.
 */

const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(FIELD_LIMITS.name),
  email: z.string().email('Invalid email address').max(FIELD_LIMITS.email),
  phone: z.string().max(FIELD_LIMITS.phone).optional(),
  company: z.string().max(FIELD_LIMITS.company).optional(),
  subject: z.string().trim().min(5, 'Subject must be at least 5 characters').max(FIELD_LIMITS.subject),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(FIELD_LIMITS.message),
})

/** One message for every rejection a caller could learn something from. */
const GENERIC_REJECTION = 'We could not process this submission. Please try again.'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const guard = await guardFormRequest({
      request,
      formData,
      action: RECAPTCHA_ACTIONS.contact,
      rateLimitKind: 'contact',
    })
    if (!guard.ok) return guard.response

    const body = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || undefined,
      // Read from FormData as well as declared: the homepage short form actually sends it.
      company: (formData.get('company') as string) || undefined,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    }

    const validatedData = contactFormSchema.parse(body)

    // ── Attachment, optional ───────────────────────────────────────────────────
    const uploaded = formData.get('attachment')
    let attachment: { file: File; safeFilename: string } | undefined

    if (uploaded instanceof File && uploaded.size > 0) {
      const check = await checkUploadedFile(uploaded, {
        allowed: CONTACT_FILE_TYPES,
        maxBytes: FILE_LIMITS.contactBytes,
      })

      if (!check.ok) {
        // The reason distinguishes "your file is too big" from "your file is not what it
        // claims to be" in the LOG. The visitor gets one message either way: an attacker
        // probing the allowlist learns nothing from a rejection that names the check.
        console.warn('[security] contact attachment rejected', { reason: check.reason })
        return NextResponse.json({ success: false, message: GENERIC_REJECTION }, { status: 400 })
      }

      attachment = { file: uploaded, safeFilename: check.safeFilename }
    }

    const emailResult = await sendContactFormEmail({ ...validatedData, attachment })

    if (!emailResult.success) {
      // Provider text stays server-side: it can carry the SMTP host and the authenticated
      // sender.
      console.error('[contact] send failed:', 'error' in emailResult ? emailResult.error : 'unknown')
      return NextResponse.json(
        { success: false, message: 'Failed to send your message. Please try again.' },
        { status: 500 }
      )
    }

    if ('warning' in emailResult && emailResult.warning) {
      return NextResponse.json(
        {
          success: true,
          message:
            'Message sent successfully, but the attachment could not be processed. Please try sending the file separately or contact us directly.',
          warning: true,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Thank you for your message. We will get back to you soon.' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      // The issue list names fields and their constraints. Logged, not returned.
      console.warn('[contact] validation failed:', error.errors.map((e) => e.path.join('.')))
      return NextResponse.json({ success: false, message: GENERIC_REJECTION }, { status: 400 })
    }

    console.error('[contact] unexpected error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}
