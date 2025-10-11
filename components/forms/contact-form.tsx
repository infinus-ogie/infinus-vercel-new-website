"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { CheckCircle, Upload } from "lucide-react"

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  attachment: z.any().optional()
})

type ContactFormData = z.infer<typeof contactFormSchema>

interface FormErrors {
  [key: string]: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    attachment: null
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)

  // Validate form on every change
  useEffect(() => {
    const result = contactFormSchema.safeParse(formData)
    setIsValid(result.success)
  }, [formData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, attachment: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      // Validate form data
      const validatedData = contactFormSchema.parse(formData)
      
      // Create FormData to handle file uploads
      const formDataToSend = new FormData()
      formDataToSend.append('name', validatedData.name)
      formDataToSend.append('email', validatedData.email)
      formDataToSend.append('subject', validatedData.subject)
      formDataToSend.append('message', validatedData.message)
      if (validatedData.phone) {
        formDataToSend.append('phone', validatedData.phone)
      }
      if (validatedData.attachment) {
        formDataToSend.append('attachment', validatedData.attachment)
      }
      
      // Submit to API
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formDataToSend,
      })

      const result = await response.json()

      if (result.success) {
        console.log("Form submitted successfully:", validatedData)
        setIsSubmitted(true)
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          attachment: null
        })
        
        // Show warning if attachment couldn't be processed
        if (result.warning) {
          console.warn("Attachment warning:", result.warning)
          setWarning(result.warning)
        }
      } else {
        console.error("Form submission failed:", result.message)
        setErrors({ general: result.message || "Failed to send message. Please try again." })
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FormErrors = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        console.error("Error submitting form:", error)
        setErrors({ general: "An error occurred. Please try again." })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-8 shadow-sm">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your message has been sent successfully. We'll get back to you soon.
          </p>
          {warning && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Attachment Notice</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Your message was sent successfully, but the attachment could not be processed. Please try sending the file separately or contact us directly.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Button onClick={() => {
            setIsSubmitted(false)
            setWarning(null)
          }} variant="outline">
            Send Another Message
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Our Team</h2>
        <p className="text-gray-600">
          Get in touch with our SAP experts for implementation, support, and consulting services.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className={`${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-blue-500 focus:ring-blue-500"}`}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
              required
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.name}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-blue-500 focus:ring-blue-500"}`}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            className="focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <Input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleInputChange}
            className={`${errors.subject ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-blue-500 focus:ring-blue-500"}`}
            aria-invalid={errors.subject ? "true" : "false"}
            aria-describedby={errors.subject ? "subject-error" : undefined}
            required
          />
          {errors.subject && (
            <p id="subject-error" className="text-sm text-red-600 mt-1" role="alert">
              {errors.subject}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className={`${errors.message ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-blue-500 focus:ring-blue-500"}`}
            aria-invalid={errors.message ? "true" : "false"}
            aria-describedby={errors.message ? "message-error" : undefined}
            rows={5}
            required
          />
          {errors.message && (
            <p id="message-error" className="text-sm text-red-600 mt-1" role="alert">
              {errors.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-2">
            Attachment
          </label>
          <div className="relative">
            <Input
              id="attachment"
              name="attachment"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="focus:border-blue-500 focus:ring-blue-500"
            />
            <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: PDF, DOC, DOCX, TXT (max 10MB)
          </p>
        </div>

        <div className="text-xs text-gray-600">
          By submitting, you agree to the{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  )
}
