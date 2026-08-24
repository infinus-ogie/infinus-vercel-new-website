"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Upload, X, ShieldCheck, Users2, Globe2 } from "lucide-react";
import { TrustPill } from "@/components/ui/TrustPill";

// shadcn/ui components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CareersDictionary, HomeDictionary } from "@/content/dictionary";
import { useRecaptcha } from "@/components/security/useRecaptcha";
import { HoneypotField, appendHoneypot } from "@/components/security/HoneypotField";
import { RECAPTCHA_FIELD } from "@/lib/security/fields";

// ---------- schema ----------
/**
 * Built from locale-specific messages. A factory rather than a module constant because the
 * WORDING differs per locale while the RULES must not: min 2 / min 10 characters, email
 * format, valid URL, the three accepted MIME types and the 5MB ceiling are all unchanged.
 */
function createFormSchema(messages: CareersDictionary["validation"]) {
  return z.object({
    name: z.string().min(2, messages.name),
    phone: z.string().optional(),
    email: z.string().email(messages.email),
    linkedin: z.string().url(messages.linkedin).optional().or(z.literal("")),
    subject: z.string().min(2, messages.subject),
    message: z.string().min(10, messages.message),
    file: z
      .any()
      .refine(
        (f) => !f || (f instanceof File && ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(f.type)),
        messages.fileType
      )
      .refine((f) => !f || (f instanceof File && f.size <= 5 * 1024 * 1024), messages.fileSize),
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
  });
}
type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

// The two JSON-LD-only Q&A live in content/{en,sr}/careers.ts (`faq`), alongside the rest
// of this page's copy. They were on the homepage until the form moved off it.

/**
 * The job-application section, now the body of /careers and /sr/careers.
 *
 * Phase H1 made every string a lookup on a typed dictionary. This phase moved that
 * dictionary out of `home` into its own `careers` namespace and, in the same step, made
 * BOTH props REQUIRED.
 *
 * They used to default to the English dictionary. That default is precisely how English
 * copy ended up inside Serbian documents when StatPills had one — a migration aid that
 * silently produces wrong output rather than failing. There is no default now: a caller
 * names its locale's dictionary or does not compile.
 *
 * What deliberately did NOT change in the move: one behavioural implementation, the same
 * POST to /api/join-team, the same Zod rules, and the same untranslated FormData keys.
 * Relocating a component must not touch an API contract.
 */
export function JoinSection({
  copy,
  trust,
}: {
  copy: CareersDictionary;
  trust: HomeDictionary["trust"];
}) {
  const { form: f, validation } = copy;
  const FormSchema = createFormSchema(validation);
  const recaptcha = useRecaptcha();
  // react-hook-form's handleSubmit does not hand the submit event to onSubmit, so the form
  // element is captured by ref rather than from the event.
  const formRef = useRef<HTMLFormElement>(null);
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
      // Create FormData to handle file uploads
      const formDataToSend = new FormData();
      formDataToSend.append('name', values.name);
      formDataToSend.append('email', values.email);
      formDataToSend.append('subject', values.subject);
      formDataToSend.append('message', values.message);
      if (values.phone) {
        formDataToSend.append('phone', values.phone);
      }
      if (values.linkedin) {
        formDataToSend.append('linkedin', values.linkedin);
      }
      if (values.utm_source) {
        formDataToSend.append('utm_source', values.utm_source);
      }
      if (values.utm_medium) {
        formDataToSend.append('utm_medium', values.utm_medium);
      }
      if (values.utm_campaign) {
        formDataToSend.append('utm_campaign', values.utm_campaign);
      }
      if (values.file) {
        formDataToSend.append('file', values.file);
      }

      const token = await recaptcha.execute("careers");
      if (token) formDataToSend.append(RECAPTCHA_FIELD, token);
      appendHoneypot(formDataToSend, formRef.current);

      const response = await fetch("/api/join-team", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(copy.success);
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
              {copy.heading}
            </h2>
            <div className="space-y-4">
              <p className="max-w-[65ch] text-slate-600 leading-relaxed">
                {copy.paragraphs[0]}
              </p>
              <p className="max-w-[65ch] text-slate-600 leading-relaxed">
                {copy.paragraphs[1]}
              </p>
              <p className="max-w-[65ch] text-slate-600 leading-relaxed">{copy.paragraphs[2]}</p>
            </div>
            {/* Trust badges */}
            <div className="mt-6">
              <div className="flex flex-col gap-3 max-w-md">
                {/* First row: two badges */}
                <div className="flex gap-3">
                  <TrustPill icon={ShieldCheck} tone="gold" variant="light">{trust.goldPartner}</TrustPill>
                  <TrustPill icon={Users2} tone="blue" variant="light">{trust.consultants}</TrustPill>
                </div>
                {/* Second row: third badge aligned to the left */}
                <div className="flex">
                  <TrustPill icon={Globe2} tone="blue" variant="light">{trust.customers}</TrustPill>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: form card */}
          <div className="relative -mt-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
              <form ref={formRef} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <HoneypotField id="careers-company-website" />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-slate-700 mb-2 block">
                      {f.nameLabel}
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={f.namePlaceholder}
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
                      {f.phoneLabel}
                    </Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      placeholder={f.phonePlaceholder}
                      autoComplete="tel"
                      className="h-11 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...register("phone")} 
                    />
                    <p className="mt-1 text-xs text-slate-500">{f.phoneHint}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700 mb-2 block">
                      {f.emailLabel}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={f.emailPlaceholder}
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
                      {f.linkedinLabel}
                    </Label>
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder={f.linkedinPlaceholder}
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
                    {f.subjectLabel}
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder={f.subjectPlaceholder}
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
                    {f.messageLabel}
                  </Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder={f.messagePlaceholder}
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
                    {f.fileLabel}
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
                          <span className="font-medium text-blue-600">{f.fileClickToUpload}</span>{f.fileOrDragAndDrop}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{f.fileHint}</p>
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
                    {isSubmitting ? f.submitting : f.submit}
                  </Button>
                  <p className="text-sm text-slate-600">
                    {f.replyPromise}
                  </p>
                  {/* Owner-approved wording for the job application form. Informational
                      acknowledgement, NOT the cookie-consent mechanism. */}
                  <p className="text-xs text-slate-500">
                    {copy.privacy.before}
                    <a className="underline underline-offset-4 hover:text-slate-700" href={copy.privacy.href}>
                      {copy.privacy.linkText}
                    </a>
                    .
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
