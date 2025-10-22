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

// Email templates
export const emailTemplates = {
  contactForm: (data: {
    name: string
    email: string
    phone?: string
    company?: string
    subject: string
    message: string
    attachment?: File
  }) => ({
    subject: `New Contact Form Submission: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Contact Form Submission</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
          ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Message Details</h3>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
          ${data.attachment ? `
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 4px; border-left: 4px solid #f59e0b; margin-top: 15px;">
            <h4 style="color: #92400e; margin-top: 0;">📎 Attachment Information</h4>
            <p><strong>File:</strong> ${data.attachment.name}</p>
            <p><strong>Size:</strong> ${(data.attachment.size / 1024).toFixed(2)} KB</p>
            <p><strong>Type:</strong> ${data.attachment.type}</p>
            <p style="color: #92400e; font-size: 14px; margin-bottom: 0;"><em>This attachment should be visible in your email client. If not, please contact the sender directly.</em></p>
          </div>
          ` : ''}
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This email was sent from the Infinus website contact form.</p>
          <p>Reply directly to this email to respond to ${data.name}.</p>
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
- File: ${data.attachment.name}
- Size: ${(data.attachment.size / 1024).toFixed(2)} KB
- Type: ${data.attachment.type}
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
    file?: File
  }) => ({
    subject: `New Job Application: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Job Application</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Applicant Information</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
          ${data.linkedin ? `<p><strong>LinkedIn:</strong> <a href="${data.linkedin}">${data.linkedin}</a></p>` : ''}
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Application Details</h3>
          <p><strong>Position:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
          ${data.file ? `
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 4px; border-left: 4px solid #f59e0b; margin-top: 15px;">
            <h4 style="color: #92400e; margin-top: 0;">📎 Resume Attachment</h4>
            <p><strong>File:</strong> ${data.file.name}</p>
            <p><strong>Size:</strong> ${(data.file.size / 1024).toFixed(2)} KB</p>
            <p><strong>Type:</strong> ${data.file.type}</p>
            <p style="color: #92400e; font-size: 14px; margin-bottom: 0;"><em>This resume attachment should be visible in your email client.</em></p>
          </div>
          ` : ''}
        </div>
        
        ${(data.utm_source || data.utm_medium || data.utm_campaign) ? `
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">UTM Tracking</h3>
          ${data.utm_source ? `<p><strong>Source:</strong> ${data.utm_source}</p>` : ''}
          ${data.utm_medium ? `<p><strong>Medium:</strong> ${data.utm_medium}</p>` : ''}
          ${data.utm_campaign ? `<p><strong>Campaign:</strong> ${data.utm_campaign}</p>` : ''}
        </div>
        ` : ''}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This email was sent from the Infinus website job application form.</p>
          <p>Reply directly to this email to respond to ${data.name}.</p>
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
- File: ${data.file.name}
- Size: ${(data.file.size / 1024).toFixed(2)} KB
- Type: ${data.file.type}
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
}

// Send email function
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string,
  replyTo?: string,
  attachments?: Array<{ filename: string; content: Buffer; contentType?: string }>
) {
  try {
    console.log('Attempting to send email to:', to)
    console.log('Email config user:', EMAIL_CONFIG.auth.user)
    console.log('Email config pass length:', EMAIL_CONFIG.auth.pass?.length)
    
    const transporter = createTransporter()
    
    // Verify connection
    await transporter.verify()
    console.log('SMTP connection verified successfully')
    
    const mailOptions = {
      from: `"Infinus Website" <${EMAIL_CONFIG.auth.user}>`,
      to: to,
      replyTo: replyTo || EMAIL_CONFIG.auth.user,
      subject: subject,
      html: html,
      text: text,
      attachments: attachments || []
    }
    
    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      replyTo: mailOptions.replyTo,
      subject: mailOptions.subject,
      html: '[HTML content]',
      text: '[Text content]',
      attachments: mailOptions.attachments ? mailOptions.attachments.map(att => ({
        filename: att.filename,
        contentType: att.contentType,
        size: att.content ? att.content.length : 0
      })) : []
    })
    
    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    console.error('Error details:', {
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
  attachment?: File
}) {
  const template = emailTemplates.contactForm(data)
  
  // Prepare attachments if any
  let attachments: Array<{ filename: string; content: Buffer; contentType?: string }> = []
  if (data.attachment && data.attachment.size > 0) {
    console.log('Processing attachment:', {
      name: data.attachment.name,
      size: data.attachment.size,
      type: data.attachment.type
    })
    
    try {
      const buffer = Buffer.from(await data.attachment.arrayBuffer())
      attachments.push({
        filename: data.attachment.name,
        content: buffer,
        contentType: data.attachment.type
      })
      console.log('Attachment processed successfully, size:', buffer.length)
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
    attachments
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
  file?: File
}) {
  const template = emailTemplates.joinTeam(data)
  
  // Prepare attachments if any
  let attachments: Array<{ filename: string; content: Buffer; contentType?: string }> = []
  if (data.file && data.file.size > 0) {
    console.log('Processing join team attachment:', {
      name: data.file.name,
      size: data.file.size,
      type: data.file.type
    })
    
    try {
      const buffer = Buffer.from(await data.file.arrayBuffer())
      attachments.push({
        filename: data.file.name,
        content: buffer,
        contentType: data.file.type
      })
      console.log('Join team attachment processed successfully, size:', buffer.length)
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
    attachments
  )
}
