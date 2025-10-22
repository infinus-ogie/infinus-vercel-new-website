import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendJoinTeamEmail } from '@/lib/email'

const joinTeamFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  file: z.any().optional()
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form data
    const file = formData.get('file') as File
    console.log('Join team attachment received:', file ? {
      name: file.name,
      size: file.size,
      type: file.type
    } : 'No attachment')
    
    const body = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || undefined,
      linkedin: formData.get('linkedin') as string || undefined,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      utm_source: formData.get('utm_source') as string || undefined,
      utm_medium: formData.get('utm_medium') as string || undefined,
      utm_campaign: formData.get('utm_campaign') as string || undefined,
      file: file && file.size > 0 ? file : undefined
    }
    
    // Validate the form data
    const validatedData = joinTeamFormSchema.parse(body)
    
    // Send email notification
    const emailResult = await sendJoinTeamEmail(validatedData)
    
    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send email notification' 
        },
        { status: 500 }
      )
    }
    
    console.log('Join team form submission processed successfully:', validatedData)
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your application. We will get back to you soon!' 
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Join team form error:', error)
    
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
