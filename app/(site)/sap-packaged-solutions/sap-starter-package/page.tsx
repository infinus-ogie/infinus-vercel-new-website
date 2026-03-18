import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { generatePageMetadata } from "@/lib/seo"
import { AutoJsonLd } from "@/components/seo/AutoJsonLd"
import { createSimplePageConfig } from "@/lib/auto-jsonld"
import {
  CheckCircle2,
  MessageCircle,
  FileText,
  TrendingUp,
  Wrench,
  BarChart3,
  Layers,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// ─────────────────────────────────────────────────────────────────────────────
// PAGE CONTENT
// All copy below is sourced verbatim from the approved DOCX.
// Do not edit text in this file — update from the approved DOCX only.
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_CONTENT = {
  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    badge: "SAP Packaged Solutions",
    // DOCX: page title
    title: "SAP Starter Package",
    // DOCX: hero tagline
    tagline: "When your company outgrows Excel and disconnected systems",
    // DOCX: hero description
    description:
      "A fast, structured way to implement SAP Cloud ERP and establish a scalable digital foundation for growth.",
    // DOCX: CTA labels
    ctaDiscovery: "Book a discovery call",
    ctaBrochure: "Download brochure",
  },

  // ── The challenge ─────────────────────────────────────────────────────────
  // DOCX: "The challenge" section — three sentences, verbatim
  challenge: {
    heading: "The challenge",
    lines: [
      "As companies grow, systems often don't keep up.",
      "Financial data is delayed, reports don't match, and teams spend too much time on manual work.",
      "You lose visibility into profitability, inventory, and cash flow — exactly when you need it most.",
    ],
  },

  // ── The solution ──────────────────────────────────────────────────────────
  // DOCX: "The solution" section — three lines, verbatim
  solution: {
    heading: "The solution",
    body: "SAP Starter Package brings your core processes into one system — finance, sales, procurement, and operations.",
    // Styled distinctly in the layout (larger/bolder) — wording unchanged
    highlight: "One system. One source of truth. Real-time insight.",
    sub: "A structured, low-risk approach to implementing SAP Cloud ERP.",
  },

  // ── What you gain ─────────────────────────────────────────────────────────
  // DOCX: "What you gain" bullets — title-only cards, no descriptions added
  whatYouGain: {
    heading: "What you gain",
    items: [
      { icon: TrendingUp,   title: "Real-time visibility into profitability and cash flow" },
      { icon: Wrench,       title: "Less manual work and fewer errors" },
      { icon: Layers,       title: "Standardized processes that support growth" },
      { icon: BarChart3,    title: "Better control over operations and decision-making" },
    ],
  },

  // ── Ideal for ─────────────────────────────────────────────────────────────
  // DOCX: "Ideal for" bullets — verbatim
  idealFor: {
    heading: "Ideal for",
    items: [
      "Growing companies with disconnected systems",
      "Businesses relying on Excel and manual processes",
      "Companies that need better financial and operational control",
      "Organizations preparing for scaling",
    ],
  },

  // ── Why SAP Starter Package ───────────────────────────────────────────────
  // DOCX: "Why SAP Starter Package" bullets — title-only cards, no descriptions added
  why: {
    heading: "Why SAP Starter Package",
    items: [
      { icon: Layers,       title: "Focus on core business processes" },
      { icon: BarChart3,    title: "Built-in analytics and AI" },
      { icon: CheckCircle2, title: "SAP best-practice approach" },
      { icon: TrendingUp,   title: "Ready to deploy in 4–6 months" },
    ],
  },

  // ── Final CTA ─────────────────────────────────────────────────────────────
  // DOCX: "Ready to move beyond Excel and disconnected systems?" block — verbatim
  cta: {
    heading: "Ready to move beyond Excel and disconnected systems?",
    ctaDiscovery: "Book a discovery call",
    ctaBrochure: "Download brochure",
    trustNote: "We respond within one business day",
  },

  // ── Brochure ──────────────────────────────────────────────────────────────
  // Heading approved: "Brochure"
  // PDF: /sap-starter-package/sap-starter-package-brochure.pdf (Serbian, unchanged)
  brochure: {
    heading: "Brochure",
    downloadLabel: "Download brochure",
    downloadHref: "/sap-starter-package/sap-starter-package-brochure.pdf",
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// SEO
// ─────────────────────────────────────────────────────────────────────────────

export const metadata = generatePageMetadata(
  "SAP Starter Package | Infinus – SAP Packaged Solutions",
  "A fast, structured way to implement SAP Cloud ERP and establish a scalable digital foundation for growth.",
  "/sap-packaged-solutions/sap-starter-package"
)

const pageConfig = createSimplePageConfig(
  "/sap-packaged-solutions/sap-starter-package",
  "SAP Starter Package | Infinus – SAP Packaged Solutions",
  "A fast, structured way to implement SAP Cloud ERP and establish a scalable digital foundation for growth.",
  {
    articleAbout: [
      "SAP Starter Package",
      "SAP Cloud ERP",
      "SAP Implementation",
      "SAP Packaged Solutions",
      "Infinus",
    ],
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function SapStarterPackagePage() {
  return (
    <>
      <AutoJsonLd config={pageConfig} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[75vh]">
        <Image
          src="/sap-starter-package/sap-starter-package-hero.png"
          alt="SAP Starter Package"
          fill
          priority
          className="object-cover object-center -z-10"
        />

        {/* Overlays */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[6px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-8 pt-48 pb-32 md:pt-56 md:pb-40 text-center">
          <div className="flex flex-col items-center gap-5">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">
              {PAGE_CONTENT.hero.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              {PAGE_CONTENT.hero.title}
            </h1>
            <p className="text-xl md:text-2xl font-medium text-white/95">
              {PAGE_CONTENT.hero.tagline}
            </p>
            <p className="text-base sm:text-lg text-white/85 font-light leading-relaxed max-w-2xl mx-auto">
              {PAGE_CONTENT.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm sm:text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400/50 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:from-yellow-500 hover:to-yellow-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {PAGE_CONTENT.hero.ctaDiscovery}
              </Link>
              <a
                href={PAGE_CONTENT.brochure.downloadHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm sm:text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-white/40 text-white border border-white/30 hover:bg-white/10 hover:border-white/50"
              >
                {PAGE_CONTENT.hero.ctaBrochure}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── The challenge ────────────────────────────────────────────── */}
      <Section surface="surface-1" id="the-challenge">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              {PAGE_CONTENT.challenge.heading}
            </h2>
            <div className="w-12 h-1 bg-[#0a6ed1] mx-auto rounded-full" />
            <div className="space-y-3 text-lg text-slate-600 leading-relaxed">
              {PAGE_CONTENT.challenge.lines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── The solution ─────────────────────────────────────────────── */}
      <Section surface="surface-0" id="the-solution">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-5">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              {PAGE_CONTENT.solution.heading}
            </h2>
            <div className="w-12 h-1 bg-[#0a6ed1] mx-auto rounded-full" />
            <p className="text-lg text-slate-600 leading-relaxed">
              {PAGE_CONTENT.solution.body}
            </p>
            {/* Highlight line — styled for visual emphasis, wording unchanged from DOCX */}
            <p className="text-xl md:text-2xl font-semibold text-slate-900">
              {PAGE_CONTENT.solution.highlight}
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              {PAGE_CONTENT.solution.sub}
            </p>
          </div>
        </Container>
      </Section>

      {/* ── What you gain ────────────────────────────────────────────── */}
      <Section surface="surface-1" id="what-you-gain">
        <Container>
          <div className="space-y-10">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                {PAGE_CONTENT.whatYouGain.heading}
              </h2>
              <div className="w-12 h-1 bg-[#0a6ed1] mx-auto rounded-full" />
            </div>
            {/* Title-only cards — no descriptions added; DOCX provides titles only */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PAGE_CONTENT.whatYouGain.items.map((item, i) => {
                const Icon = item.icon
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 flex flex-col items-start gap-4 backdrop-blur"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a6ed1]/10 shrink-0">
                      <Icon className="h-5 w-5 text-[#0a6ed1]" />
                    </div>
                    <p className="font-semibold text-slate-900 leading-snug">{item.title}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Ideal for ────────────────────────────────────────────────── */}
      <Section surface="surface-0" id="ideal-for">
        <Container>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                {PAGE_CONTENT.idealFor.heading}
              </h2>
              <div className="w-12 h-1 bg-[#0a6ed1] mx-auto rounded-full" />
            </div>
            <ul className="space-y-3">
              {PAGE_CONTENT.idealFor.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-lg text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-[#0a6ed1] mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ── Why SAP Starter Package ──────────────────────────────────── */}
      <Section surface="surface-1" id="why-sap-starter-package">
        <Container>
          <div className="space-y-10">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                {PAGE_CONTENT.why.heading}
              </h2>
              <div className="w-12 h-1 bg-[#0a6ed1] mx-auto rounded-full" />
            </div>
            {/* Title-only cards — no descriptions added; DOCX provides titles only */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PAGE_CONTENT.why.items.map((item, i) => {
                const Icon = item.icon
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 flex flex-col items-start gap-4 backdrop-blur"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a6ed1]/10 shrink-0">
                      <Icon className="h-5 w-5 text-[#0a6ed1]" />
                    </div>
                    <p className="font-semibold text-slate-900 leading-snug">{item.title}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Final CTA — matches ProjectPulse CTA design ──────────────── */}
      <section className="relative bg-slate-50 py-24 border-t border-slate-200/60">
        {/* Subtle transition band */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50 to-slate-900/[0.03]" />
        </div>

        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-[#061A4D] px-8 py-12 md:px-12 md:py-14 backdrop-blur-[6px]">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-5">
                {PAGE_CONTENT.cta.heading}
              </h2>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 px-7 py-3.5 text-base font-semibold text-slate-900 shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
                  {PAGE_CONTENT.cta.ctaDiscovery}
                </Link>

                <a
                  href={PAGE_CONTENT.brochure.downloadHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 hover:border-white/40 hover:bg-white/[0.06] px-7 py-3.5 text-base font-semibold text-white transition-all"
                >
                  {PAGE_CONTENT.cta.ctaBrochure}
                </a>
              </div>

              <p className="inline-flex items-center gap-2 text-sm text-white/65">
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
                {PAGE_CONTENT.cta.trustNote}
              </p>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
