import { Section } from "@/components/ui/section"
import { generatePageMetadata } from "@/lib/seo"
import { AutoJsonLd } from "@/components/seo/AutoJsonLd"
import { createSimplePageConfig } from "@/lib/auto-jsonld"
import { CheckCircle2, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const PAGE_CONTENT = {
  title: "Pharma Case Study 2",
  badge: "Case Study",

  clientOverview:
    "A leading pharmaceutical company operating in a highly regulated environment, relying on a complex SAP landscape to support its core business processes.",

  challenge:
    "The client required reliable, long-term SAP application support to ensure system stability, high availability, and compliance with strict regulatory standards. This included handling a high volume of incidents and complex change requests within demanding SLA requirements.",

  solutionIntro:
    "Infinus provided long-term SAP Application Management Services (AMS), covering all core modules including FI, CO, MM, SD, PP, QM, and WM. The engagement included handling incidents, service requests, and complex change requests under strict SLA conditions, ensuring continuous system stability and improvement.",

  solutionItems: [
    "End-to-end SAP application management",
    "SLA-based incident, service request, and change request handling",
    "Proactive system monitoring and optimization",
    "Functional and technical support across all modules",
    "Continuous improvement of business processes",
  ],

  results: [
    "High system availability and stability",
    "Faster incident resolution and reduced downtime",
    "Efficient handling of high-volume and complex change requests",
    "Improved efficiency of IT operations",
    "Enhanced compliance and audit readiness",
    "Long-term, reliable support for business-critical processes",
  ],

  engagementModel:
    "Long-term AMS engagement with SLA-based delivery and continuous improvement.",

  technologies: "SAP ERP, FI, CO, MM, SD, PP, QM, WM",
}

export const metadata = generatePageMetadata(
  "Pharma Case Study 2 | Infinus",
  PAGE_CONTENT.clientOverview,
  "/case-study/pharma2"
)

const pageConfig = createSimplePageConfig(
  "/case-study/pharma2",
  "Pharma Case Study 2 | Infinus",
  PAGE_CONTENT.clientOverview,
  { articleAbout: ["SAP", "Pharma", "Case Study", "Infinus"] }
)

export default function PharmaCase2StudyPage() {
  return (
    <>
      <AutoJsonLd config={pageConfig} />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[60vh] sm:min-h-[75vh]">
        <Image
          src="/case-study/pharma2-hero.jpg"
          alt="Pharma Case Study 2"
          fill
          priority
          className="object-cover object-center -z-10"
        />
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[6px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-36 pb-24 sm:pt-44 sm:pb-32 md:pt-56 md:pb-40 text-center">
          <div className="flex flex-col items-center gap-5">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">
              {PAGE_CONTENT.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              {PAGE_CONTENT.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Client Overview */}
      <Section surface="surface-1" id="client-overview">          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Client Overview</h2>
            <div className="w-12 h-1 bg-brand-sap mx-auto rounded-full" />
            <p className="text-lg text-slate-600 leading-relaxed">{PAGE_CONTENT.clientOverview}</p>
          </div>      </Section>

      {/* Challenge */}
      <Section surface="surface-0" id="challenge">          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Challenge</h2>
              <div className="w-12 h-1 bg-brand-sap mx-auto rounded-full" />
            </div>
            {PAGE_CONTENT.challenge.split("\n\n").map((p, i) => (
              <p key={i} className="text-lg text-slate-600 leading-relaxed">{p}</p>
            ))}
          </div>      </Section>

      {/* Solution */}
      <Section surface="surface-1" id="solution">          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Solution</h2>
              <div className="w-12 h-1 bg-brand-sap mx-auto rounded-full" />
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">{PAGE_CONTENT.solutionIntro}</p>
            <p className="text-base font-medium text-slate-700">The engagement included:</p>
            <ul className="space-y-3">
              {PAGE_CONTENT.solutionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-brand-sap mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>      </Section>

      {/* Results */}
      <Section surface="surface-0" id="results">          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Results</h2>
              <div className="w-12 h-1 bg-brand-sap mx-auto rounded-full" />
            </div>
            <ul className="space-y-3">
              {PAGE_CONTENT.results.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>      </Section>

      {/* Engagement Model */}
      <Section surface="surface-1" id="engagement-model">          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Engagement Model</h2>
            <div className="w-12 h-1 bg-brand-sap mx-auto rounded-full" />
            <p className="text-lg text-slate-600 leading-relaxed">{PAGE_CONTENT.engagementModel}</p>
          </div>      </Section>

      {/* Technologies & Scope */}
      <Section surface="surface-0" id="technologies">          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Technologies & Scope</h2>
            <div className="w-12 h-1 bg-brand-sap mx-auto rounded-full" />
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {PAGE_CONTENT.technologies.split(", ").map((tech, i) => (
                <span key={i} className="inline-block rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>      </Section>

      {/* CTA */}
      <section className="relative bg-slate-50 py-24 border-t border-slate-200/60">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50 to-slate-900/[0.03]" />
        </div>
        <div className="absolute inset-0 opacity-[0.015] bg-pattern-cross" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-brand-navy px-8 py-12 md:px-12 md:py-14 backdrop-blur-[6px]">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-5">
                Interested in working with us?
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 px-7 py-3.5 text-base font-semibold text-slate-900 shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
                  Contact us
                </Link>
              </div>
              <p className="inline-flex items-center gap-2 text-sm text-white/65">
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
                We respond within one business day
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
