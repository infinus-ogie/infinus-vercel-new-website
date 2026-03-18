import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { generatePageMetadata } from "@/lib/seo"
import { AutoJsonLd } from "@/components/seo/AutoJsonLd"
import { createSimplePageConfig } from "@/lib/auto-jsonld"
import { CheckCircle2, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const PAGE_CONTENT = {
  title: "Retail Case Study",
  badge: "Case Study",

  clientOverview:
    "A leading European retail company with operations across multiple countries, managing complex supply chain processes and a large SAP landscape through its centralized SAP Center of Excellence (CoE).",

  challenge:
    "The client needed a reliable and scalable way to support and continuously improve its SAP environment across multiple markets. Key challenges included maintaining consistency across countries, managing frequent change requests, and ensuring stability of critical business processes such as Forecasting & Replenishment (F&R), Order-to-Cash (O2C), Procure-to-Pay (P2P), and Vendor Invoice Management (VIM).\n\nAdditionally, the internal team required experienced SAP professionals who could integrate quickly, communicate effectively in an international environment, and contribute with minimal ramp-up time.",

  solutionIntro:
    "Infinus provided long-term SAP expert support as an extension of the client's SAP Center of Excellence. Our senior consultants worked closely with internal teams, supporting daily operations, change requests, and continuous improvements across key business processes.",

  solutionItems: [
    "Functional and technical SAP support across multiple modules",
    "Continuous improvement of business processes",
    "Handling change requests and deployments",
    "Cross-country coordination and standardization efforts",
    "Close collaboration with business stakeholders and IT teams",
  ],

  results: [
    "Standardized processes across multiple European markets",
    "Faster and more efficient change deployment",
    "Improved control and visibility over complex supply chain operations",
    "Reduced operational risks and increased system stability",
    "Seamless integration with the client's internal SAP CoE",
  ],

  engagementModel:
    "Long-term nearshore collaboration with a dedicated team of senior SAP consultants, fully integrated into the client's SAP Center of Excellence.",

  technologies: "SAP ERP, SAP IS Retail, F&R, O2C, P2P, VIM",
}

export const metadata = generatePageMetadata(
  "Retail Case Study | Infinus",
  PAGE_CONTENT.clientOverview,
  "/case-study/retail1"
)

const pageConfig = createSimplePageConfig(
  "/case-study/retail1",
  "Retail Case Study | Infinus",
  PAGE_CONTENT.clientOverview,
  { articleAbout: ["SAP", "Retail", "Case Study", "Infinus"] }
)

export default function RetailCaseStudyPage() {
  return (
    <>
      <AutoJsonLd config={pageConfig} />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[75vh]">
        <Image
          src="/domain-expertise/retail.webp"
          alt="Retail Case Study"
          fill
          priority
          className="object-cover object-center -z-10"
        />
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[6px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-8 pt-48 pb-32 md:pt-56 md:pb-40 text-center">
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
      <Section surface="surface-1" id="client-overview">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Client Overview</h2>
            <div className="w-12 h-1 bg-[#0a6ed1] mx-auto rounded-full" />
            <p className="text-lg text-slate-600 leading-relaxed">{PAGE_CONTENT.clientOverview}</p>
          </div>
        </Container>
      </Section>

      {/* Challenge */}
      <Section surface="surface-0" id="challenge">
        <Container>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Challenge</h2>
              <div className="w-12 h-1 bg-[#0a6ed1] mx-auto rounded-full" />
            </div>
            {PAGE_CONTENT.challenge.split("\n\n").map((p, i) => (
              <p key={i} className="text-lg text-slate-600 leading-relaxed">{p}</p>
            ))}
          </div>
        </Container>
      </Section>

      {/* Solution */}
      <Section surface="surface-1" id="solution">
        <Container>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Solution</h2>
              <div className="w-12 h-1 bg-[#0a6ed1] mx-auto rounded-full" />
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">{PAGE_CONTENT.solutionIntro}</p>
            <p className="text-base font-medium text-slate-700">The engagement included:</p>
            <ul className="space-y-3">
              {PAGE_CONTENT.solutionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-[#0a6ed1] mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Results */}
      <Section surface="surface-0" id="results">
        <Container>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Results</h2>
              <div className="w-12 h-1 bg-[#0a6ed1] mx-auto rounded-full" />
            </div>
            <ul className="space-y-3">
              {PAGE_CONTENT.results.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Engagement Model */}
      <Section surface="surface-1" id="engagement-model">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Engagement Model</h2>
            <div className="w-12 h-1 bg-[#0a6ed1] mx-auto rounded-full" />
            <p className="text-lg text-slate-600 leading-relaxed">{PAGE_CONTENT.engagementModel}</p>
          </div>
        </Container>
      </Section>

      {/* Technologies & Scope */}
      <Section surface="surface-0" id="technologies">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Technologies & Scope</h2>
            <div className="w-12 h-1 bg-[#0a6ed1] mx-auto rounded-full" />
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {PAGE_CONTENT.technologies.split(", ").map((tech, i) => (
                <span key={i} className="inline-block rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <section className="relative bg-slate-50 py-24 border-t border-slate-200/60">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50 to-slate-900/[0.03]" />
        </div>
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-[#061A4D] px-8 py-12 md:px-12 md:py-14 backdrop-blur-[6px]">
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
