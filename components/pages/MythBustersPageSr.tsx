import Script from "next/script"
import Image from "next/image"
import { ArrowDown, Check, CheckCircle2 } from "lucide-react"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { SapGoldPartnerBadge } from "@/components/ui/SapGoldPartnerBadge"
import { EbookForm } from "@/components/mythbusters/EbookForm"
import { EbookAssetCard } from "@/components/mythbusters/EbookAssetCard"
import type { MythBustersDictionary, SrMythBustersLayout } from "@/content/dictionary"

/**
 * The SERBIAN SAP MythBusting landing page.
 *
 * ── Why this is not the English component ───────────────────────────────────────
 * Every other locale pair on this site renders ONE component twice. This one does not, and
 * the reason is that the client did not send a translation — they sent a different page.
 *
 * The English document is an overview: hero, four-metric trust bar, why-download blocks, all
 * ten myths listed, audience, form at the end. The newer Serbian document
 * ("LP_copy_structure_INFINUS_RS.docx") is a conversion layout: a split hero with the form
 * and an e-book asset card beside the copy, a one-line trust bar with two logos, audience,
 * contents, FOUR myth/fact previews, why-Infinus, why-now, a real FAQ, a closing CTA, and a
 * second form.
 *
 * Rendering both from one component would mean a component that is mostly conditionals, and
 * a dictionary whose keys are half-unused in each locale. The union in content/dictionary.ts
 * says out loud that these are two shapes; this file is one of them.
 *
 * A server component: it reads no request state, so the route stays statically prerendered.
 * Only the two form instances are client components.
 */
export interface MythBustersPageSrProps {
  content: MythBustersDictionary
  layout: SrMythBustersLayout
  jsonLd: string
}

export function MythBustersPageSr({ content, layout, jsonLd }: MythBustersPageSrProps) {
  return (
    <>
      <Script
        id="json-ld-mythbusters"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      {/* ── Hero: copy left, asset card + form right ─────────────────────────── */}
      <section
        className="relative overflow-hidden bg-[#00144a] pt-28 pb-14 md:pt-32 md:pb-20"
        data-section="mythbusters-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.10] via-transparent to-blue-600/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_minmax(360px,420px)] lg:gap-12">
            {/* LEFT — the pitch */}
            <div>
              <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-blue-100 sm:text-sm">
                {layout.hero.badge}
              </p>

              <h1 className="mt-5 text-[30px] font-light leading-tight tracking-tight text-white sm:text-[38px] md:text-[46px]">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                  {layout.hero.title}
                </span>
              </h1>

              <p className="mt-4 text-lg font-medium text-blue-200">{layout.hero.subtitle}</p>

              {layout.hero.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 max-w-2xl text-base text-slate-300">
                  {paragraph}
                </p>
              ))}

              <div className="mt-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
                  {layout.hero.benefitsHeading}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {layout.hero.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-slate-200">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* RIGHT — the asset card above the FIRST form instance, so a visitor never has
                to scroll to reach it. Stacks under the copy below lg. */}
            <div className="space-y-5">
              <EbookAssetCard copy={layout.assetCard} />
              <EbookForm
                copy={content.form}
                locale="sr"
                placement="hero"
                assurances={layout.formAssurances}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar, directly under the hero ───────────────────────────────── */}
      <section
        className="border-b border-slate-200 bg-slate-50"
        data-section="mythbusters-trust"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-6 text-center sm:px-6 md:flex-row md:justify-center md:gap-10 md:text-left lg:px-8">
          <p className="max-w-xl text-sm font-medium text-slate-700">
            {layout.trustBar.statement}
          </p>
          {/* Both marks are MEANINGFUL here: no adjacent text names either, unlike the
              homepage badge which sits beside a pill that already says "SAP Gold Partner". */}
          <div className="flex shrink-0 items-center gap-6">
            <SapGoldPartnerBadge className="h-9 w-auto md:h-10" alt={layout.trustBar.sapLogoAlt} />
            <Image
              src="/infinus-new-logo.webp"
              alt={layout.trustBar.infinusLogoAlt}
              width={250}
              height={75}
              className="h-8 w-auto md:h-9"
            />
          </div>
        </div>
      </section>

      {/* ── Da li je ovaj vodič za vas? ──────────────────────────────────────── */}
      <Section surface="surface-0" data-section="mythbusters-audience">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {layout.audience.heading}
          </h2>
          <p className="mt-4 text-slate-600">{layout.audience.body}</p>
          <p className="mt-4 font-medium text-slate-700">{layout.audience.rolesIntro}</p>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {layout.audience.roles.map((role) => (
              <li key={role} className="flex items-start gap-2.5 text-slate-700">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#0a6ed1]" aria-hidden="true" />
                <span>{role}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Šta vas očekuje u e-booku ────────────────────────────────────────── */}
      <Section surface="surface-1" data-section="mythbusters-contents">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {layout.contents.heading}
          </h2>
          <p className="mt-4 font-medium text-slate-700">{layout.contents.intro}</p>
          <ul className="mt-4 space-y-3">
            {layout.contents.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#0a6ed1]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Zavirite u e-book: four myth -> fact previews ────────────────────── */}
      <Section surface="surface-0" data-section="mythbusters-preview">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          {layout.preview.heading}
        </h2>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
          {layout.preview.items.map((item) => (
            <div
              key={item.myth}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {layout.preview.mythLabel}
              </p>
              <p className="mt-2 font-medium text-slate-900">{item.myth}</p>

              <ArrowDown className="my-4 h-5 w-5 text-[#0a6ed1]" aria-hidden="true" />

              <p className="text-xs font-semibold uppercase tracking-wider text-[#0a6ed1]">
                {layout.preview.factLabel}
              </p>
              <p className="mt-2 text-slate-600">{item.fact}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center font-medium text-slate-700">{layout.preview.more}</p>
      </Section>

      {/* ── Zašto Infinus? ───────────────────────────────────────────────────── */}
      <Section surface="surface-1" data-section="mythbusters-why-infinus">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {layout.whyInfinus.heading}
          </h2>
          {layout.whyInfinus.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-slate-600">
              {paragraph}
            </p>
          ))}

          <p className="mt-8 font-semibold text-slate-900">{layout.whyInfinus.reasonsHeading}</p>
          <ul className="mt-4 space-y-3">
            {layout.whyInfinus.reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-3 text-slate-700">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Zašto baš sada? ──────────────────────────────────────────────────── */}
      <Section surface="surface-0" data-section="mythbusters-why-now">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {layout.whyNow.heading}
          </h2>
          {layout.whyNow.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-slate-600">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      {/* ── FAQ. Genuine Q&A, and the only section emitted as FAQPage schema. ── */}
      <Section surface="surface-1" data-section="mythbusters-faq">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {layout.faq.heading}
          </h2>
          <dl className="mt-8 space-y-6">
            {layout.faq.items.map((item) => (
              <div key={item.question} className="rounded-xl border border-slate-200 bg-white p-5">
                <dt className="font-semibold text-slate-900">{item.question}</dt>
                <dd className="mt-2 text-slate-600">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* ── Final CTA above the SECOND form instance ─────────────────────────── */}
      <Section id="download" surface="surface-0" data-section="mythbusters-form">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {layout.finalCta.heading}
          </h2>
          <p className="mt-4 text-slate-600">{layout.finalCta.body}</p>
          <p className="mt-2 text-sm font-medium text-slate-500">{layout.finalCta.note}</p>
        </div>

        <div className="mx-auto mt-10 max-w-xl">
          <EbookForm
            copy={content.form}
            locale="sr"
            placement="closing"
            assurances={layout.formAssurances}
          />
        </div>
      </Section>
    </>
  )
}
