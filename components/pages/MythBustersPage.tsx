import Script from "next/script"
import { CheckCircle2 } from "lucide-react"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { SapGoldPartnerBadge } from "@/components/ui/SapGoldPartnerBadge"
import { EbookForm } from "@/components/mythbusters/EbookForm"
import type { MythBustersDictionary, EnMythBustersLayout } from "@/content/dictionary"

/**
 * The SAP MythBusting landing page, shared by /insights/sap-mythbusters and its Serbian half.
 *
 * ONE implementation, two locales — the arrangement every other pair uses. The route files
 * differ only in which dictionary they pass, which metadata they export and which JSON-LD
 * they build.
 *
 * A server component: it reads no request state, so both routes stay statically prerendered.
 * Only the form beneath it is a client component.
 *
 * ── Sections, in the order the client's document lists them ─────────────────────
 * hero (eyebrow, two-line h1, lede, four bullets, CTA) -> trust bar -> why download
 * (lead + four value blocks) -> the ten myths + a second CTA -> audience -> form.
 *
 * Both CTAs are in-page anchors to #download rather than links elsewhere: the thing they
 * promise is the form at the bottom of this same page.
 *
 * ── The trust bar is local, on purpose ──────────────────────────────────────────
 * It carries FOUR items where the shared StatPills renders three, and its fourth is the 70%
 * consultant-experience claim. Reusing StatPills would have meant widening a component that
 * fifteen other pages render, to serve one page.
 */
export interface MythBustersPageProps {
  content: MythBustersDictionary
  /** The English page body, narrowed by the route file. */
  layout: EnMythBustersLayout
  /** Serialised JSON-LD for this locale, built by the route file. */
  jsonLd: string
}

export function MythBustersPage({ content, layout, jsonLd }: MythBustersPageProps) {
  return (
    <>
      <Script
        id="json-ld-mythbusters"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#00144a] pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.10] via-transparent to-blue-600/[0.06] blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300 sm:text-sm">
            {layout.hero.eyebrow}
          </p>

          <h1 className="mt-5 text-[30px] font-light leading-tight tracking-tight text-white sm:text-[38px] md:text-[50px]">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
              {layout.hero.titleLine1}
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white/90 to-blue-400">
              {layout.hero.titleLine2}
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-300 md:text-lg">
            {layout.hero.lede}
          </p>

          <ul className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
            {layout.hero.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2.5 text-sm text-slate-200">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#00144a] shadow-lg hover:bg-slate-100 focus-visible:ring-white focus-visible:ring-offset-[#00144a]"
            >
              <a href="#download">{layout.hero.cta}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Trust bar ────────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-slate-50" data-section="mythbusters-trust">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-5 md:flex-row md:justify-center md:gap-8">
            {/* The certification, shown as the artwork it is; the first trust item names it
                in words right beside it, so the image is decorative. */}
            <SapGoldPartnerBadge className="h-9 w-auto md:h-11" />
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
              {layout.trustBar.map((item) => (
                <li key={item} className="text-sm font-medium text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Why download ─────────────────────────────────────────────────────── */}
      <Section surface="surface-0" data-section="mythbusters-why">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            {layout.why.introTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">{layout.why.introBody}</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
          {layout.why.items.map((item) => (
            <div key={item.title} className="card rounded-2xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#0a6ed1]">
                {item.title}
              </h3>
              <p className="mt-3 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── The ten myths ────────────────────────────────────────────────────── */}
      <Section surface="surface-1" data-section="mythbusters-myths">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          {layout.myths.heading}
        </h2>

        <ol className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {layout.myths.items.map((myth, index) => (
            <li
              key={myth}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0a6ed1] text-sm font-semibold text-white">
                {index + 1}
              </span>
              <span className="text-slate-700">{myth}</span>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex justify-center">
          <Button asChild size="lg">
            <a href="#download">{layout.myths.cta}</a>
          </Button>
        </div>
      </Section>

      {/* ── Who it is for ────────────────────────────────────────────────────── */}
      <Section surface="surface-0" data-section="mythbusters-audience">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {layout.audience.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">{layout.audience.body}</p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          {layout.audience.roles.map((role) => (
            <li key={role} className="flex items-start gap-2.5 text-slate-700">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#0a6ed1]" aria-hidden="true" />
              <span>{role}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Download form ────────────────────────────────────────────────────── */}
      <Section id="download" surface="surface-1" data-section="mythbusters-form">
        <EbookForm copy={content.form} locale="en" placement="closing" />
      </Section>
    </>
  )
}
