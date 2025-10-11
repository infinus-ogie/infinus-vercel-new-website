import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendContactFormEmail } from '@/lib/email'

// Note: In App Router, body parsing is handled automatically
// File size limits are handled in the route handler logic

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  attachment: z.any().optional()
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form data
    const attachment = formData.get('attachment') as File
    console.log('Attachment received:', attachment ? {
      name: attachment.name,
      size: attachment.size,
      type: attachment.type,
      lastModified: attachment.lastModified
    } : 'No attachment')
    
    // Debug attachment details
    if (attachment && attachment.size > 0) {
      console.log('Attachment details:', {
        name: attachment.name,
        size: attachment.size,
        type: attachment.type,
        lastModified: attachment.lastModified,
        stream: typeof attachment.stream,
        arrayBuffer: typeof attachment.arrayBuffer
      })
    }
    
    const body = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || undefined,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      attachment: attachment && attachment.size > 0 ? attachment : undefined
    }
    
    // Validate the form data
    const validatedData = contactFormSchema.parse(body)
    
    // Check attachment if present
    if (validatedData.attachment && validatedData.attachment.size > 0) {
      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (validatedData.attachment.size > maxSize) {
        return NextResponse.json(
          { 
            success: false, 
            message: `File size too large. Maximum allowed size is 10MB. Your file is ${(validatedData.attachment.size / 1024 / 1024).toFixed(2)}MB.` 
          },
          { status: 400 }
        )
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
      if (!allowedTypes.includes(validatedData.attachment.type)) {
        return NextResponse.json(
          { 
            success: false, 
            message: `File type not allowed. Please upload PDF, DOC, DOCX, or TXT files only.` 
          },
          { status: 400 }
        )
      }
    }
    
    // Send email notification
    try {
      console.log('Attempting to send email with data:', {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        hasAttachment: !!validatedData.attachment,
        attachmentName: validatedData.attachment?.name,
        attachmentSize: validatedData.attachment?.size,
        attachmentType: validatedData.attachment?.type
      })
      
      const emailResult = await sendContactFormEmail(validatedData)
      
      if (!emailResult.success) {
        console.error('Failed to send email:', 'error' in emailResult ? emailResult.error : 'Unknown error')
        return NextResponse.json(
          { 
            success: false, 
            message: 'Failed to send email notification' 
          },
          { status: 500 }
        )
      }
      
      // Check if there was a warning about attachment
      if ('warning' in emailResult && emailResult.warning) {
        console.log('Email sent with warning:', emailResult.warning)
        return NextResponse.json(
          { 
            success: true, 
            message: 'Message sent successfully, but attachment could not be processed. Please try sending the file separately or contact us directly.',
            warning: emailResult.warning
          },
          { status: 200 }
        )
      }
    } catch (emailError) {
      console.error('Error in email sending process:', emailError)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Error processing email: ' + (emailError instanceof Error ? emailError.message : 'Unknown error')
        },
        { status: 500 }
      )
    }
    
    console.log('Contact form submission processed successfully:', validatedData)
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your message. We will get back to you soon.' 
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Contact form error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid form data',
          errors: error.errors 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while processing your request' 
      },
      { status: 500 }
    )
  }
}
