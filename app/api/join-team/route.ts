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
  utm_campaign: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
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
