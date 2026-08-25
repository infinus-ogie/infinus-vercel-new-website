import nodemailer from 'nodemailer'

// Email configuration
const EMAIL_CONFIG = {
  // For testing - using Gmail SMTP
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'ognjen.drinic31@gmail.com',
    pass: (process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD)?.replace(/\s/g, '') // Remove spaces from app password
  }
}

// Production email (Infinus)
const PRODUCTION_EMAIL = 'office@infinus.rs'
// Test email (for development)
const TEST_EMAIL = 'ognjen.drinic31@gmail.com'

// Send to both production and test emails
const RECIPIENT_EMAILS = [PRODUCTION_EMAIL, TEST_EMAIL]

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport(EMAIL_CONFIG)
}

/**
 * Every user-controlled value below is escaped before it reaches HTML.
 *
 * The templates used to interpolate submitted values raw — `${data.name}` straight into a
 * tag — and the message field was turned into markup deliberately, with
 * `.replace(/\n/g, '<br>')` on untouched input. So a contact form submission containing
 * `<img src=x onerror=...>` produced live markup in the inbox of whoever opened it.
 *
 * `esc` is the shared escaper and `escLines` is the multi-line variant that escapes FIRST
 * and inserts `<br>` after — the order the old code had backwards. Both come from
 * lib/security/escape.ts so there is one strategy, not a per-template judgement call.
 *
 * Short fields also pass through `stripNewlines` where they reach a subject line, which is
 * the header-injection vector.
 */
import {
  escapeHtml as esc,
  escapeHtmlMultiline as escLines,
  stripNewlines,
} from './security/escape'

// Email templates
export const emailTemplates = {
  contactForm: (data: {
    name: string
    email: string
    phone?: string
    company?: string
    subject: string
    message: string
    /** Already validated and sanitised by the route — see lib/security/files.ts. */
    attachment?: { file: File; safeFilename: string }
  }) => ({
    // stripNewlines, because a subject is a HEADER: a CR/LF in it is header injection.
    subject: `New Contact Form Submission: ${stripNewlines(data.subject)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Contact Form Submission</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${esc(data.name)}</p>
          <p><strong>Email:</strong> ${esc(data.email)}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${esc(data.phone)}</p>` : ''}
          ${data.company ? `<p><strong>Company:</strong> ${esc(data.company)}</p>` : ''}
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Message Details</h3>
          <p><strong>Subject:</strong> ${esc(data.subject)}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
            ${escLines(data.message)}
          </div>
          ${data.attachment ? `
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 4px; border-left: 4px solid #f59e0b; margin-top: 15px;">
            <h4 style="color: #92400e; margin-top: 0;">📎 Attachment Information</h4>
            <p><strong>File:</strong> ${esc(data.attachment.safeFilename)}</p>
            <p><strong>Size:</strong> ${(data.attachment.file.size / 1024).toFixed(2)} KB</p>
            <p><strong>Type:</strong> ${esc(data.attachment.file.type)}</p>
            <p style="color: #92400e; font-size: 14px; margin-bottom: 0;"><em>This attachment should be visible in your email client. If not, please contact the sender directly.</em></p>
          </div>
          ` : ''}
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This email was sent from the Infinus website contact form.</p>
          <p>Reply directly to this email to respond to ${esc(data.name)}.</p>
        </div>
      </div>
    `,
    text: `
New Contact Form Submission

Contact Information:
- Name: ${data.name}
- Email: ${data.email}
${data.phone ? `- Phone: ${data.phone}` : ''}
${data.company ? `- Company: ${data.company}` : ''}

Message Details:
- Subject: ${data.subject}
- Message: ${data.message}
${data.attachment ? `
ATTACHMENT INFORMATION:
- File: ${data.attachment.safeFilename}
- Size: ${(data.attachment.file.size / 1024).toFixed(2)} KB
- Type: ${data.attachment.file.type}
- Note: This attachment should be visible in your email client. If not, please contact the sender directly.` : ''}

This email was sent from the Infinus website contact form.
Reply directly to this email to respond to ${data.name}.
    `
  }),

  joinTeam: (data: {
    name: string
    email: string
    phone?: string
    linkedin?: string
    subject: string
    message: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    /** Already validated and sanitised by the route — see lib/security/files.ts. */
    file?: { file: File; safeFilename: string }
  }) => ({
    subject: `New Job Application: ${stripNewlines(data.subject)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Job Application</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Applicant Information</h3>
          <p><strong>Name:</strong> ${esc(data.name)}</p>
          <p><strong>Email:</strong> ${esc(data.email)}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${esc(data.phone)}</p>` : ''}
          ${/* Escaped in BOTH the href and the text: an unescaped href here is one
               javascript: URL away from clickable markup in a colleague's inbox. */ ''}
          ${data.linkedin ? `<p><strong>LinkedIn:</strong> <a href="${esc(data.linkedin)}">${esc(data.linkedin)}</a></p>` : ''}
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Application Details</h3>
          <p><strong>Position:</strong> ${esc(data.subject)}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
            ${escLines(data.message)}
          </div>
          ${data.file ? `
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 4px; border-left: 4px solid #f59e0b; margin-top: 15px;">
            <h4 style="color: #92400e; margin-top: 0;">📎 Resume Attachment</h4>
            <p><strong>File:</strong> ${esc(data.file.safeFilename)}</p>
            <p><strong>Size:</strong> ${(data.file.file.size / 1024).toFixed(2)} KB</p>
            <p><strong>Type:</strong> ${esc(data.file.file.type)}</p>
            <p style="color: #92400e; font-size: 14px; margin-bottom: 0;"><em>This resume attachment should be visible in your email client.</em></p>
          </div>
          ` : ''}
        </div>
        
        ${(data.utm_source || data.utm_medium || data.utm_campaign) ? `
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">UTM Tracking</h3>
          ${data.utm_source ? `<p><strong>Source:</strong> ${esc(data.utm_source)}</p>` : ''}
          ${data.utm_medium ? `<p><strong>Medium:</strong> ${esc(data.utm_medium)}</p>` : ''}
          ${data.utm_campaign ? `<p><strong>Campaign:</strong> ${esc(data.utm_campaign)}</p>` : ''}
        </div>
        ` : ''}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This email was sent from the Infinus website job application form.</p>
          <p>Reply directly to this email to respond to ${esc(data.name)}.</p>
        </div>
      </div>
    `,
    text: `
New Job Application

Applicant Information:
- Name: ${data.name}
- Email: ${data.email}
${data.phone ? `- Phone: ${data.phone}` : ''}
${data.linkedin ? `- LinkedIn: ${data.linkedin}` : ''}

Application Details:
- Position: ${data.subject}
- Message: ${data.message}
${data.file ? `
RESUME ATTACHMENT:
- File: ${data.file.safeFilename}
- Size: ${(data.file.file.size / 1024).toFixed(2)} KB
- Type: ${data.file.file.type}
- Note: This resume attachment should be visible in your email client.` : ''}

${(data.utm_source || data.utm_medium || data.utm_campaign) ? `
UTM Tracking:
${data.utm_source ? `- Source: ${data.utm_source}` : ''}
${data.utm_medium ? `- Medium: ${data.utm_medium}` : ''}
${data.utm_campaign ? `- Campaign: ${data.utm_campaign}` : ''}
` : ''}

This email was sent from the Infinus website job application form.
Reply directly to this email to respond to ${data.name}.
    `
  })
  ,

  /**
   * The SAP MythBusting e-book lead.
   *
   * Four fields plus attribution — deliberately NOT routed through the contact template.
   * An e-book download and a sales enquiry are different events, and giving them the same
   * subject line would make the shared inbox harder to work with, not easier.
   *
   * The e-book itself is NOT attached. It is 13MB, it is publicly downloadable from the
   * page the visitor is already on, and attaching it to every internal notification would
   * be 13MB per lead delivered to the wrong recipient.
   */
  ebookLead: (data: {
    name: string
    email: string
    company: string
    role?: string
    country?: string
    locale?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
  }) => ({
    subject: `E-Book Download: ${stripNewlines(data.company)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New E-Book Download</h2>
        <p style="color: #6b7280;">10 Myths About SAP Cloud ERP</p>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Lead Details</h3>
          <p><strong>Full Name:</strong> ${esc(data.name)}</p>
          <p><strong>Business Email:</strong> ${esc(data.email)}</p>
          <p><strong>Company:</strong> ${esc(data.company)}</p>
          ${data.role ? `<p><strong>Role or Job Title:</strong> ${esc(data.role)}</p>` : ''}
          ${data.country ? `<p><strong>Country:</strong> ${esc(data.country)}</p>` : ''}
          ${data.locale ? `<p><strong>Page language:</strong> ${esc(data.locale)}</p>` : ''}
        </div>

        ${(data.utm_source || data.utm_medium || data.utm_campaign) ? `
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">UTM Tracking</h3>
          ${data.utm_source ? `<p><strong>Source:</strong> ${esc(data.utm_source)}</p>` : ''}
          ${data.utm_medium ? `<p><strong>Medium:</strong> ${esc(data.utm_medium)}</p>` : ''}
          ${data.utm_campaign ? `<p><strong>Campaign:</strong> ${esc(data.utm_campaign)}</p>` : ''}
        </div>
        ` : ''}

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This email was sent from the SAP MythBusting e-book landing page.</p>
          <p>Reply directly to this email to respond to ${esc(data.name)}.</p>
        </div>
      </div>
    `,
    text: `
New E-Book Download — 10 Myths About SAP Cloud ERP

Lead Details:
- Full Name: ${data.name}
- Business Email: ${data.email}
- Company: ${data.company}
${data.role ? `- Role or Job Title: ${data.role}` : ''}
${data.locale ? `- Page language: ${data.locale}` : ''}
${(data.utm_source || data.utm_medium || data.utm_campaign) ? `
UTM Tracking:
${data.utm_source ? `- Source: ${data.utm_source}` : ''}
${data.utm_medium ? `- Medium: ${data.utm_medium}` : ''}
${data.utm_campaign ? `- Campaign: ${data.utm_campaign}` : ''}
` : ''}

This email was sent from the SAP MythBusting e-book landing page.
Reply directly to this email to respond to ${data.name}.
    `
  })
}

/**
 * Which template is being sent. Present ONLY so the logs below can say something useful
 * without naming a person: "a careers application went out" rather than an address.
 */
export type MailKind = 'contact' | 'careers' | 'ebook-lead'

/**
 * Send one message.
 *
 * ── What this deliberately does NOT log ─────────────────────────────────────────
 * The previous version logged, on every single send: the recipient list, the Reply-To (which
 * is the submitter's own address), the subject line (which carries user-supplied text), and
 * and the length of the SMTP app password.
 *
 * The password length is gone entirely, and nothing here reports whether a password is set
 * or how long it is. It answered no question worth answering and it described a secret.
 *
 * The addresses and the subject are gone for a different reason: they are personal data
 * accumulating in a log for no operational purpose. Knowing that an `ebook-lead` was sent,
 * and its message id, is enough to diagnose the mail path; knowing WHO it went to is only
 * needed when something failed, and the failure branch still carries the provider's own
 * text.
 *
 * What is left is operational metadata: the template kind, the attachment count, the
 * outcome, and the provider's message id.
 *
 * ── The error branch is unchanged in strength ───────────────────────────────────
 * The provider's message and stack still reach the SERVER log, because an SMTP failure is
 * undiagnosable without them. Neither is returned to a browser: `error` on the result is for
 * the caller's own log, and every route turns it into its own generic message.
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string,
  replyTo?: string,
  attachments?: Array<{ filename: string; content: Buffer; contentType?: string }>,
  kind: MailKind | 'unspecified' = 'unspecified'
) {
  try {
    const transporter = createTransporter()

    // Verify connection
    await transporter.verify()

    const mailOptions = {
      from: `"Infinus Website" <${EMAIL_CONFIG.auth.user}>`,
      to: to,
      replyTo: replyTo || EMAIL_CONFIG.auth.user,
      subject: subject,
      html: html,
      text: text,
      attachments: attachments || []
    }

    console.log('[mail] sending', { kind, attachments: mailOptions.attachments.length })

    const result = await transporter.sendMail(mailOptions)
    console.log('[mail] sent', { kind, messageId: result.messageId })
    return { success: true, messageId: result.messageId }
  } catch (error) {
    // SERVER-SIDE ONLY. Callers return their own generic text to the browser.
    console.error('[mail] send failed', {
      kind,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Send contact form email
export async function sendContactFormEmail(data: {
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  /** Validated and sanitised by the route before it gets here. */
  attachment?: { file: File; safeFilename: string }
}) {
  const template = emailTemplates.contactForm(data)

  // Prepare attachments if any
  let attachments: Array<{ filename: string; content: Buffer; contentType?: string }> = []
  if (data.attachment && data.attachment.file.size > 0) {
    // Size only. The previous version logged the submitter's original filename on every
    // send, which put an attacker-controlled string into the log for free.
    console.log('[contact] processing attachment, bytes:', data.attachment.file.size)

    try {
      const buffer = Buffer.from(await data.attachment.file.arrayBuffer())
      attachments.push({
        // The SANITISED name: this reaches a MIME header, where a newline is header
        // injection and a path separator is a filename nobody intended.
        filename: data.attachment.safeFilename,
        content: buffer,
        contentType: data.attachment.file.type
      })
    } catch (error) {
      console.error('Error processing attachment:', error)
      // Don't fail the entire email if attachment processing fails
      console.log('Continuing without attachment due to processing error')
      // Return a warning that attachment couldn't be processed
      return { 
        success: true, 
        messageId: 'email-sent-without-attachment',
        warning: 'Attachment could not be processed and was not included in the email'
      }
    }
  }
  
  return await sendEmail(
    RECIPIENT_EMAILS.join(', '),
    template.subject,
    template.html,
    template.text,
    data.email,
    attachments,
    'contact'
  )
}

// Send join team email
export async function sendJoinTeamEmail(data: {
  name: string
  email: string
  phone?: string
  linkedin?: string
  subject: string
  message: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  /** Validated and sanitised by the route before it gets here. */
  file?: { file: File; safeFilename: string }
}) {
  const template = emailTemplates.joinTeam(data)

  // Prepare attachments if any
  let attachments: Array<{ filename: string; content: Buffer; contentType?: string }> = []
  if (data.file && data.file.file.size > 0) {
    // Size only — a CV filename is personal data and an attacker-controlled string.
    console.log('[careers] processing attachment, bytes:', data.file.file.size)

    try {
      const buffer = Buffer.from(await data.file.file.arrayBuffer())
      attachments.push({
        filename: data.file.safeFilename,
        content: buffer,
        contentType: data.file.file.type
      })
    } catch (error) {
      console.error('Error processing join team attachment:', error)
      // Don't fail the entire email if attachment processing fails
      console.log('Continuing without attachment due to processing error')
    }
  }
  
  return await sendEmail(
    RECIPIENT_EMAILS.join(', '),
    template.subject,
    template.html,
    template.text,
    data.email,
    attachments,
    'careers'
  )
}

/**
 * Send the e-book lead notification.
 *
 * EMAIL ONLY. There is no CRM, no database and no third-party form backend in this project,
 * and none was added: the owner's decision for this phase is that the notification IS the
 * record of the lead. Worth stating plainly rather than leaving implicit — if this send
 * fails, the lead is gone.
 *
 * Reuses sendEmail() and RECIPIENT_EMAILS, so delivery behaves exactly like the contact and
 * job-application forms and there is one mail path on the site, not three.
 */
export async function sendEbookLeadEmail(data: {
  name: string
  email: string
  company: string
  role?: string
  country?: string
  locale?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}) {
  const template = emailTemplates.ebookLead(data)

  return await sendEmail(
    RECIPIENT_EMAILS.join(', '),
    template.subject,
    template.html,
    template.text,
    data.email,
    undefined,
    'ebook-lead'
  )
}

/*
 * There is deliberately NO e-book delivery email here any more.
 *
 * `sendEbookDeliveryEmail` and its EBOOK_DELIVERY_COPY sent the download link to the address
 * a visitor typed into the form. The owner withdrew that flow: the PDF now downloads directly
 * on a successful submission, which removes the campaign's dependency on a separate mailbox
 * and app password.
 *
 * It also removes a security surface worth naming. This module no longer has ANY path that
 * sends mail to a user-supplied recipient — every remaining send goes to RECIPIENT_EMAILS,
 * which is a fixed server-owned list. See docs/ for the updated risk note.
 *
 * `sendEbookLeadEmail` above is unchanged: the internal notification is how the lead is
 * recorded, and it still goes only to the operational recipients.
 */
