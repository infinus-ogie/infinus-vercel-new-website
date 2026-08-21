import { Section } from "@/components/ui/section"
import { AutoJsonLd } from "@/components/seo/AutoJsonLd"
import type { PageConfig } from "@/lib/page-config"
import { CheckCircle2, MessageCircle, TrendingUp, Wrench, BarChart3, Layers } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BrochureLanguageModal } from "@/components/ui/BrochureLanguageModal"
import type { SapStarterPackageDictionary } from "@/content/dictionary"

/**
 * The SAP Starter Package body, shared by /sap-packaged-solutions/sap-starter-package and
 * /sr/sap-packaged-solutions/sap-starter-package.
 *
 * The markup is copied VERBATIM from the English route file at commit f143256 — including
 * its unusual inline `<Section …>          <div>` formatting, which is preserved rather than
 * reflowed because whitespace-only JSX children without a newline become real text nodes.
 * Only the string lookups changed.
 *
 * ── Why the icons moved out of the content ──────────────────────────────────────
 * The old `PAGE_CONTENT` attached a lucide component to each "What you gain" and "Why"
 * item. A React component is not copy and cannot live in a translated dictionary, so the two
 * lists are now plain strings and the icons are matched by POSITION. Both lists are
 * fixed-length tuples in both locales, so position is stable.
 *
 * A server component: it reads no request state, so both routes stay statically prerendered.
 */

/** Icons for the four "What you gain" cards, positional. */
const WHAT_YOU_GAIN_ICONS = [TrendingUp, Wrench, Layers, BarChart3] as const

/** Icons for the four "Why SAP Starter Package" cards, positional. */
const WHY_ICONS = [Layers, BarChart3, CheckCircle2, TrendingUp] as const

export interface SapStarterPackagePageProps {
  content: SapStarterPackageDictionary
  /** JSON-LD config for this locale, built by the route file. */
  jsonLd: PageConfig
}

export function SapStarterPackagePage({ content, jsonLd }: SapStarterPackagePageProps) {
  return (
    <>
      <AutoJsonLd config={jsonLd} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[60vh] sm:min-h-[75vh]">
        <Image
          src="/sap-starter-package/sap-starter-package-hero.png"
          alt={content.hero.imageAlt}
          fill
          priority
          className="object-cover object-center -z-10"
        />

        {/* Overlays */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[6px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-36 pb-24 sm:pt-44 sm:pb-32 md:pt-56 md:pb-40 text-center">
          <div className="flex flex-col items-center gap-5">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">
              {content.hero.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              {content.hero.title}
            </h1>
            <p className="text-xl md:text-2xl font-medium text-white/95">
              {content.hero.tagline}
            </p>
            <p className="text-base sm:text-lg text-white/85 font-light leading-relaxed max-w-2xl mx-auto">
              {content.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href={content.contactHref}
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400/50 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:from-yellow-500 hover:to-yellow-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {content.hero.ctaDiscovery}
              </Link>
              <BrochureLanguageModal
                label={content.hero.ctaBrochure}
                hrefEn={content.brochure.hrefEn}
                hrefSr={content.brochure.hrefSr}
                variant="hero"
                copy={content.brochureModal}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── The challenge ────────────────────────────────────────────── */}
      <Section surface="surface-1" id="the-challenge">          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              {content.challenge.heading}
            </h2>
            <div className="w-12 h-1 bg-brand-sap mx-auto rounded-full" />
            <div className="space-y-3 text-lg text-slate-600 leading-relaxed">
              {content.challenge.lines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>      </Section>

      {/* ── The solution ─────────────────────────────────────────────── */}
      <Section surface="surface-0" id="the-solution">          <div className="max-w-2xl mx-auto text-center space-y-5">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              {content.solution.heading}
            </h2>
            <div className="w-12 h-1 bg-brand-sap mx-auto rounded-full" />
            <p className="text-lg text-slate-600 leading-relaxed">
              {content.solution.body}
            </p>
            {/* Highlight line — styled for visual emphasis, wording unchanged from DOCX */}
            <p className="text-xl md:text-2xl font-semibold text-slate-900">
              {content.solution.highlight}
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              {content.solution.sub}
            </p>
          </div>      </Section>

      {/* ── What you gain ────────────────────────────────────────────── */}
      <Section surface="surface-1" id="what-you-gain">          <div className="space-y-10">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                {content.whatYouGain.heading}
              </h2>
              <div className="w-12 h-1 bg-brand-sap mx-auto rounded-full" />
            </div>
            {/* Title-only cards — no descriptions added; DOCX provides titles only */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {content.whatYouGain.items.map((item, i) => {
                const Icon = WHAT_YOU_GAIN_ICONS[i] || TrendingUp
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 flex flex-col items-start gap-4 backdrop-blur"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-sap/10 shrink-0">
                      <Icon className="h-5 w-5 text-brand-sap" />
                    </div>
                    <p className="font-semibold text-slate-900 leading-snug">{item}</p>
                  </div>
                )
              })}
            </div>
          </div>      </Section>

      {/* ── Ideal for ────────────────────────────────────────────────── */}
      <Section surface="surface-0" id="ideal-for">          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                {content.idealFor.heading}
              </h2>
              <div className="w-12 h-1 bg-brand-sap mx-auto rounded-full" />
            </div>
            <ul className="space-y-3">
              {content.idealFor.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-lg text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-brand-sap mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>      </Section>

      {/* ── Why SAP Starter Package ──────────────────────────────────── */}
      <Section surface="surface-1" id="why-sap-starter-package">          <div className="space-y-10">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                {content.why.heading}
              </h2>
              <div className="w-12 h-1 bg-brand-sap mx-auto rounded-full" />
            </div>
            {/* Title-only cards — no descriptions added; DOCX provides titles only */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {content.why.items.map((item, i) => {
                const Icon = WHY_ICONS[i] || Layers
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 flex flex-col items-start gap-4 backdrop-blur"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-sap/10 shrink-0">
                      <Icon className="h-5 w-5 text-brand-sap" />
                    </div>
                    <p className="font-semibold text-slate-900 leading-snug">{item}</p>
                  </div>
                )
              })}
            </div>
          </div>      </Section>

      {/* ── Final CTA — matches ProjectPulse CTA design ──────────────── */}
      <section className="relative bg-slate-50 py-24 border-t border-slate-200/60">
        {/* Subtle transition band */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50 to-slate-900/[0.03]" />
        </div>

        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.015] bg-pattern-cross" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-brand-navy px-8 py-12 md:px-12 md:py-14 backdrop-blur-[6px]">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-5">
                {content.cta.heading}
              </h2>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <Link
                  href={content.contactHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 px-7 py-3.5 text-base font-semibold text-slate-900 shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
                  {content.cta.ctaDiscovery}
                </Link>

                <BrochureLanguageModal
                  label={content.cta.ctaBrochure}
                  hrefEn={content.brochure.hrefEn}
                  hrefSr={content.brochure.hrefSr}
                  variant="cta"
                  copy={content.brochureModal}
                />
              </div>

              <p className="inline-flex items-center gap-2 text-sm text-white/65">
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
                {content.cta.trustNote}
              </p>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
