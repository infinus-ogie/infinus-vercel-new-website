"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { CheckCircle, Upload, Mail, MapPin, Globe } from "lucide-react";

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

interface Contact2Props {
  title?: string;
  description?: string;
  email?: string;
  address?: string;
  web?: { label: string; url: string };
}

export const Contact2 = ({
  title = "Contact Our SAP Experts",
  description = "Ready to transform your business with SAP? Get in touch with our expert team for implementation, support, and consulting services. We're here to help you succeed.",
  email = "office@infinus.rs",
  address = "Tresnjinog cveta 1, Belgrade, Serbia",
  web = { label: "infinus.co", url: "https://infinus.co" },
}: Contact2Props) => {
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
      
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log("Form submitted:", validatedData)
      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        attachment: null
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FormErrors = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section className="py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your message has been sent successfully. We'll get back to you soon.
            </p>
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              Send Another Message
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-40 pb-32">
      <div className="container">
        <div className="mx-auto flex max-w-screen-xl flex-col justify-between gap-10 lg:flex-row lg:gap-20">
          <div className="mx-auto flex max-w-sm flex-col justify-between gap-10">
            <div className="text-center lg:text-left">
              <h1 className="mb-2 text-5xl font-semibold lg:mb-1 lg:text-6xl">
                {title}
              </h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="mx-auto w-fit lg:mx-0">
              <h3 className="mb-6 text-center text-2xl font-semibold lg:text-left">
                Contact Details
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <span className="font-bold">Email: </span>
                    <a href={`mailto:${email}`} className="underline">
                      {email}
                    </a>
                  </div>
                </li>
                <li className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <span className="font-bold">Address: </span>
                    <span>{address}</span>
                  </div>
                </li>
                <li className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <span className="font-bold">Web: </span>
                    <a href={web.url} target="_blank" rel="noopener noreferrer" className="underline">
                      {web.label}
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="mx-auto flex max-w-screen-md flex-col gap-6 rounded-lg border p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="name">Name *</Label>
                  <Input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name" 
                    className={errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
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
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number" 
                  />
                </div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com" 
                  className={errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
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
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="subject">Subject *</Label>
                <Input 
                  type="text" 
                  id="subject" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?" 
                  className={errors.subject ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
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
              <div className="grid w-full gap-1.5">
                <Label htmlFor="message">Message *</Label>
                <Textarea 
                  placeholder="Tell us about your SAP needs or project requirements..." 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className={errors.message ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  required
                />
                {errors.message && (
                  <p id="message-error" className="text-sm text-red-600 mt-1" role="alert">
                    {errors.message}
                  </p>
                )}
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="attachment">Attachment</Label>
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
                <p className="text-xs text-gray-500">
                  Supported formats: PDF, DOC, DOCX, TXT (max 10MB)
                </p>
              </div>
              <div className="text-xs text-gray-600">
                By submitting, you agree to the{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
