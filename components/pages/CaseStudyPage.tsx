import { Section } from "@/components/ui/section"
import { AutoJsonLd } from "@/components/seo/AutoJsonLd"
import { CheckCircle2, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { splitTechnologies } from "@/lib/case-study-technologies"
import type { PageConfig } from "@/lib/page-config"
import type { CaseStudiesDictionary, CaseStudyEntry } from "@/content/dictionary"

/**
 * The case-study page body, shared by all TEN case-study routes (five English, five
 * Serbian).
 *
 * Before Phase H2 this markup was copy-pasted into five page files whose only real
 * difference was a `PAGE_CONTENT` object and a hero image. The markup below is that shared
 * structure, verbatim, with literals replaced by lookups — so every English page renders
 * byte-identically.
 *
 * Two sections are CONDITIONAL, exactly as before: the solution bullet list and the
 * engagement-model block. The pharma1 page has neither, and an empty value omits the
 * section rather than rendering a bare heading.
 *
 * The hero image's alt text is the h1, which is what all five pages already did.
 *
 * A server component: no request state, so every route stays statically prerendered.
 */
export interface CaseStudyPageProps {
  entry: CaseStudyEntry
  labels: CaseStudiesDictionary["labels"]
  contactHref: string
  /** Hero image path. Presentation, so it lives with the route, not the dictionary. */
  heroImage: string
  jsonLd: PageConfig
}

export function CaseStudyPage({ entry, labels, contactHref, heroImage, jsonLd }: CaseStudyPageProps) {
  return (
    <>
      <AutoJsonLd config={jsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[60vh] sm:min-h-[75vh]">
        <Image
          src={heroImage}
          alt={entry.title}
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
              {entry.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              {entry.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Client Overview */}
      <Section surface="surface-1" id="client-overview">          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{labels.clientOverview}</h2>
            <div className="w-12 h-1 bg-brand-sap mx-auto rounded-full" />
            <p className="text-lg text-slate-600 leading-relaxed">{entry.clientOverview}</p>
          </div>      </Section>

      {/* Challenge */}
      <Section surface="surface-0" id="challenge">          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{labels.challenge}</h2>
              <div className="w-12 h-1 bg-brand-sap mx-auto rounded-full" />
            </div>
            {entry.challenge.split("\n\n").map((p, i) => (
              <p key={i} className="text-lg text-slate-600 leading-relaxed">{p}</p>
            ))}
          </div>      </Section>

      {/* Solution */}
      <Section surface="surface-1" id="solution">          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{labels.solution}</h2>
              <div className="w-12 h-1 bg-brand-sap mx-auto rounded-full" />
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">{entry.solutionIntro}</p>
            {entry.solutionItems.length > 0 && (
              <>
                <p className="text-base font-medium text-slate-700">{labels.engagementIncluded}</p>
                <ul className="space-y-3">
                  {entry.solutionItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <CheckCircle2 className="h-5 w-5 text-brand-sap mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>      </Section>

      {/* Results */}
      <Section surface="surface-0" id="results">          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{labels.results}</h2>
              <div className="w-12 h-1 bg-brand-sap mx-auto rounded-full" />
            </div>
            <ul className="space-y-3">
              {entry.results.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>      </Section>

      {/* Engagement Model */}
      {entry.engagementModel !== "" && (
        <Section surface="surface-1" id="engagement-model">          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{labels.engagementModel}</h2>
            <div className="w-12 h-1 bg-brand-sap mx-auto rounded-full" />
            <p className="text-lg text-slate-600 leading-relaxed">{entry.engagementModel}</p>
          </div>      </Section>
      )}

      {/* Technologies & Scope */}
      <Section surface="surface-0" id="technologies">          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{labels.technologies}</h2>
            <div className="w-12 h-1 bg-brand-sap mx-auto rounded-full" />
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {splitTechnologies(entry.technologies).map((tech, i) => (
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
                {labels.ctaHeading}
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <Link
                  href={contactHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 px-7 py-3.5 text-base font-semibold text-slate-900 shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
                  {labels.ctaButton}
                </Link>
              </div>
              <p className="inline-flex items-center gap-2 text-sm text-white/65">
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
                {labels.ctaNote}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
