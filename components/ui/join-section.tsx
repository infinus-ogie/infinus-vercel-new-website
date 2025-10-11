"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Upload, X, ShieldCheck, Users2, Globe2 } from "lucide-react";
import { StatPills } from "@/components/ui/StatPills";
import { TrustPill } from "@/components/ui/TrustPill";

// shadcn/ui components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------- schema ----------
const FormSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  phone: z.string().optional(),
  email: z.string().email("Enter a valid email address."),
  linkedin: z.string().url("Please enter a valid LinkedIn URL.").optional().or(z.literal("")),
  subject: z.string().min(2, "Subject is required."),
  message: z.string().min(10, "Message should be at least 10 characters."),
  file: z
    .any()
    .refine(
      (f) => !f || (f instanceof File && ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(f.type)),
      "Allowed files: PDF, DOC, DOCX."
    )
    .refine((f) => !f || (f instanceof File && f.size <= 5 * 1024 * 1024), "Max file size is 5MB."),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});
type FormValues = z.infer<typeof FormSchema>;

// ---------- tiny local FAQ for JSON-LD on Home (optional) ----------
export const joinSectionFAQ: { question: string; answer: string }[] = [
  {
    question: "How do I apply?",
    answer:
      "Fill in your name, email, phone, subject and message, attach your resume if you have one, and click Submit Application. We will review and get back to you.",
  },
  {
    question: "What happens after I submit?",
    answer:
      "Our team reviews your application and replies by email. If there is a fit, we will schedule an introductory call.",
  },
];

export function JoinSection() {
  const [success, setSuccess] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      linkedin: "",
      subject: "",
      message: "",
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
    },
  });

  // Set client-side flag to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Capture UTM if present
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    ["utm_source","utm_medium","utm_campaign"].forEach((key) => {
      const v = params.get(key);
      if (v) setValue(key as keyof FormValues, v);
    });
  }, [setValue]);

  async function onSubmit(values: FormValues) {
    setSuccess(null);

    try {
      const response = await fetch("/api/join-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Thanks for your application. We'll get back to you!");
        reset({ name: "", phone: "", email: "", linkedin: "", subject: "", message: "", utm_source: "", utm_medium: "", utm_campaign: "" });
        setFileName("");
        setFileSize("");
      } else {
        console.error("Form submission failed:", result.message);
        // You can add error handling here, like showing a toast notification
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // You can add error handling here, like showing a toast notification
    }
  }

  const handleFileSelect = (file: File) => {
    if (file && ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type) && file.size <= 5 * 1024 * 1024) {
      setValue("file", file);
      setFileName(file.name);
      setFileSize((file.size / 1024 / 1024).toFixed(1) + " MB");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const removeFile = () => {
    setValue("file", null);
    setFileName("");
    setFileSize("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-7xl mx-auto px-6 lg:px-8">
        {/* 2-col: copy left, form right */}
        <div className="grid md:grid-cols-[5fr_7fr] gap-12">
          {/* LEFT: heading + explainer (KEEP YOUR TEXT) */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Join Our Team
            </h2>
            <div className="space-y-4">
              <p className="max-w-[65ch] text-slate-600 leading-relaxed">
                Due to continues business expansion, we are looking to expand our team.
              </p>
              <p className="max-w-[65ch] text-slate-600 leading-relaxed">
                If you have experience in some of SAP S/4HANA or ECC modules and areas, industry solutions, and/or LOB solutions, and if you are interested to become a member of the agile team of dedicated SAP professionals, please contact us.
              </p>
              <p className="max-w-[65ch] text-slate-600 leading-relaxed">We will be glad to talk with you!</p>
            </div>
            {/* Trust badges */}
            <div className="mt-6">
              <div className="flex flex-col gap-3 max-w-md">
                {/* First row: two badges */}
                <div className="flex gap-3">
                  <TrustPill icon={ShieldCheck} tone="gold" variant="light">SAP Gold Partner</TrustPill>
                  <TrustPill icon={Users2} tone="blue" variant="light">30+ experienced consultants</TrustPill>
                </div>
                {/* Second row: third badge aligned to the left */}
                <div className="flex">
                  <TrustPill icon={Globe2} tone="blue" variant="light">20+ satisfied customers</TrustPill>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: form card */}
          <div className="relative -mt-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-slate-700 mb-2 block">
                      Your Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Nikola Trivic"
                      autoComplete="name"
                      className="h-11 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      {...register("name")}
                    />
                    {isClient && errors.name && (
                      <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-slate-700 mb-2 block">
                      Phone Number
                    </Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      placeholder="+381 64 123 4567"
                      autoComplete="tel"
                      className="h-11 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...register("phone")} 
                    />
                    <p className="mt-1 text-xs text-slate-500">Include country code (E.164 format)</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700 mb-2 block">
                      Your Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      autoComplete="email"
                      className="h-11 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      {...register("email")}
                    />
                    {isClient && errors.email && (
                      <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="linkedin" className="text-sm font-medium text-slate-700 mb-2 block">
                      LinkedIn URL
                    </Label>
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="h-11 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-invalid={!!errors.linkedin}
                      aria-describedby={errors.linkedin ? "linkedin-error" : undefined}
                      {...register("linkedin")}
                    />
                    {isClient && errors.linkedin && (
                      <p id="linkedin-error" className="mt-1 text-sm text-red-600">{errors.linkedin.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm font-medium text-slate-700 mb-2 block">
                    Subject *
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="SAP Consultant Position"
                    className="h-11 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                    {...register("subject")}
                  />
                  {isClient && errors.subject && (
                    <p id="subject-error" className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-slate-700 mb-2 block">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us about your SAP experience and why you'd like to join our team..."
                    className="min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    {...register("message")}
                  />
                  {isClient && errors.message && (
                    <p id="message-error" className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">
                    Attach your resume (optional)
                  </Label>
                  <div
                    className={cn(
                      "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                      isDragOver ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-slate-400",
                      fileName && "border-green-300 bg-green-50"
                    )}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                    />
                    {fileName ? (
                      <div className="flex items-center justify-center gap-2">
                        <Upload className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">{fileName}</span>
                        <span className="text-xs text-slate-500">({fileSize})</span>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">
                          <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX (max 5MB)</p>
                      </div>
                    )}
                  </div>
                  {isClient && errors.file && <p className="mt-1 text-sm text-red-600">{errors.file.message as string}</p>}
                </div>

                {/* UTM hidden fields */}
                <input type="hidden" {...register("utm_source")} />
                <input type="hidden" {...register("utm_medium")} />
                <input type="hidden" {...register("utm_campaign")} />

                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="btn-primary h-12 w-full md:w-auto px-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                  <p className="text-sm text-slate-600">
                    We reply within 1 business day.
                  </p>
                  <p className="text-xs text-slate-500">
                    By submitting this form you agree to our{" "}
                    <a className="underline underline-offset-4 hover:text-slate-700" href="/privacy">
                      Privacy Policy
                    </a>.
                  </p>
                </div>

                {isClient && success && (
                  <div role="status" aria-live="polite" className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">{success}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
