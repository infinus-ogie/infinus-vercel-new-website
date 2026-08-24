import Script from "next/script"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"
import { Section } from "@/components/ui/section"
import { SapGoldPartnerBadge } from "@/components/ui/SapGoldPartnerBadge"
import { EbookForm } from "@/components/mythbusters/EbookForm"
import { EbookAssetCard } from "@/components/mythbusters/EbookAssetCard"
import { EbookFaq } from "@/components/mythbusters/EbookFaq"
import {
  CampaignHero,
  CampaignEyebrow,
  CampaignHeading,
} from "@/components/campaign/CampaignHero"
import { TrustBand } from "@/components/campaign/TrustBand"
import { MythFactItem } from "@/components/campaign/MythFactItem"
import { ValuePoints, ClosingPoints } from "@/components/campaign/ValuePoints"
import { ClosingSection } from "@/components/campaign/ClosingSection"
import type { MythBustersDictionary, SrMythBustersLayout } from "@/content/dictionary"

/**
 * The SERBIAN SAP MythBusting landing page.
 *
 * ── Why this is not the English component ───────────────────────────────────────
 * The client did not send a translation — they sent a different document. The English source
 * is an overview (ten myth statements, four metrics, form at the end); this one is a
 * conversion layout (four myth/fact previews, a statement-plus-logos trust bar, a real FAQ, a
 * why-now section, a form top and bottom). Rendering both from one component would make it
 * mostly conditionals and leave half of each locale's dictionary unused.
 *
 * ── The DESIGN, however, is now shared ─────────────────────────────────────────
 * What made this page look like a different website from its English half was never the
 * content — it was the execution: 46px headings in a full-width navy canvas, a 96px cover
 * inside a card inside a card, and eight consecutive `max-w-3xl` text blocks that read like a
 * Word document. Both halves now build on components/campaign/*, so the hero shell, type
 * scale, cover treatment, trust band and closing composition are identical and only the copy
 * and section list differ.
 *
 * ── Rhythm, not alternation ────────────────────────────────────────────────────
 * dark hero -> light trust band -> white editorial -> tinted -> white proof -> tinted
 * authority -> white -> tinted FAQ -> dark conversion. Surfaces change where the KIND of
 * content changes, not on every section, and the page ends where it began tonally so the
 * campaign is framed rather than merely long.
 *
 * A server component. Only the two form instances and the FAQ accordion are client components.
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

      {/* ── Hero: copy left, e-book + form right ─────────────────────────────── */}
      <CampaignHero
        data-section="mythbusters-hero"
        editorial={
          <div>
            <CampaignEyebrow>{layout.hero.badge}</CampaignEyebrow>

            <CampaignHeading className="mt-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/85">
                {layout.hero.title}
              </span>
            </CampaignHeading>

            {/* The subtitle carries the specific promise, so it gets the blue and real size
                rather than sitting in the paragraph flow as it did before. */}
            <p className="mt-5 max-w-[44ch] text-lg font-medium leading-snug text-blue-200 md:text-xl">
              {layout.hero.subtitle}
            </p>

            {/*
              Both approved paragraphs are kept — none of the client's prose is dropped — but
              they are set one step quieter than the subtitle above and the tiles below. The
              Serbian hero carries more words than the English one because its source does;
              the fix for "too much competing at once" is hierarchy, not deletion.
            */}
            <div className="mt-5 space-y-3.5">
              {layout.hero.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-[52ch] text-[15px] leading-relaxed text-slate-300/85"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8">
              <ValuePoints items={layout.hero.benefits} heading={layout.hero.benefitsHeading} />
            </div>
          </div>
        }
        conversion={
          <div className="space-y-6">
            <EbookAssetCard copy={layout.assetCard} />
            {/* Compact, for the same reason as the English hero: four stacked fields made a
                card taller than the pitch it sits beside. */}
            <EbookForm
              copy={content.form}
              locale="sr"
              placement="hero"
              assurances={layout.formAssurances}
              density="compact"
            />
          </div>
        }
      />

      {/* ── Trust band ───────────────────────────────────────────────────────── */}
      <TrustBand
        data-section="mythbusters-trust"
        statement={layout.trustBar.statement}
        proof={
          /* Both marks are MEANINGFUL here: no adjacent text names either, unlike the
             homepage badge which now sits inside a pill that says "SAP Gold Partner". */
          <div className="flex items-center gap-8 md:gap-10">
            <SapGoldPartnerBadge
              className="h-10 w-auto shrink-0 md:h-12"
              alt={layout.trustBar.sapLogoAlt}
            />
            <Image
              src="/infinus-new-logo.webp"
              alt={layout.trustBar.infinusLogoAlt}
              width={250}
              height={75}
              className="h-9 w-auto shrink-0 md:h-10"
            />
          </div>
        }
      />

      {/* ── Da li je ovaj vodič za vas? ──────────────────────────────────────── */}
      <Section surface="surface-0" data-section="mythbusters-audience">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-pretty text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            {layout.audience.heading}
          </h2>
          <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-slate-600">
            {layout.audience.body}
          </p>

          <p className="mt-10 font-semibold text-slate-900">{layout.audience.rolesIntro}</p>
          {/* A compact grid, not six cards: this supports the pitch, it is not an event. */}
          <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {layout.audience.roles.map((role) => (
              <li
                key={role}
                className="flex items-start gap-3 border-t border-slate-100 pt-3 text-slate-700"
              >
                <CheckCircle2
                  className="mt-1 h-4 w-4 shrink-0 text-brand-sap"
                  aria-hidden="true"
                />
                <span>{role}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Šta vas očekuje u e-booku ────────────────────────────────────────── */}
      <Section surface="surface-1" data-section="mythbusters-contents">
        <div className="mx-auto grid max-w-5xl gap-x-16 gap-y-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
          <div>
            <h2 className="text-pretty text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              {layout.contents.heading}
            </h2>
            <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-slate-600">
              {layout.contents.intro}
            </p>
          </div>

          {/* Two-column rhythm rather than a stacked list under a heading: the value of the
              document is explained beside its name, which is what makes this read as an
              editorial spread instead of a feature dump. */}
          <ul className="space-y-4">
            {layout.contents.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3.5 border-b border-slate-200 pb-4 text-slate-700 last:border-b-0 last:pb-0"
              >
                <CheckCircle2
                  className="mt-1 h-[18px] w-[18px] shrink-0 text-brand-sap"
                  aria-hidden="true"
                />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Zavirite u e-book: four myth -> fact previews ────────────────────── */}
      <Section surface="surface-0" data-section="mythbusters-preview">
        <h2 className="mx-auto max-w-3xl text-balance text-center text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
          {layout.preview.heading}
        </h2>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2">
          {layout.preview.items.map((item) => (
            <MythFactItem
              key={item.myth}
              mythLabel={layout.preview.mythLabel}
              factLabel={layout.preview.factLabel}
              myth={item.myth}
              fact={item.fact}
            />
          ))}
        </div>

        {/* The bridge back to conversion. It was tiny centred grey text under the grid; it is
            the sentence that turns four previews into a reason to download, so it gets to
            look like one. */}
        <div className="mx-auto mt-10 max-w-5xl">
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-5 text-center text-lg font-medium text-slate-800">
            {layout.preview.more}
          </p>
        </div>
      </Section>

      {/* ── Zašto Infinus? ───────────────────────────────────────────────────── */}
      <Section surface="surface-1" data-section="mythbusters-why-infinus">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <h2 className="text-pretty text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              {layout.whyInfinus.heading}
            </h2>
            <div className="mt-6 space-y-4">
              {layout.whyInfinus.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-[62ch] text-lg leading-relaxed text-slate-600"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* An authority moment rather than another bulleted list: the four approved reasons
              as proof points on a rule, with the certification mark anchoring the first one.
              No invented numbers, no six generic cards. */}
          <div className="mt-12 border-t border-slate-200 pt-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {layout.whyInfinus.reasonsHeading}
            </p>
            <ul className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {layout.whyInfinus.reasons.map((reason) => (
                <li key={reason} className="border-l-2 border-brand-sap/30 pl-4">
                  <span className="text-[17px] font-semibold leading-snug text-slate-900">
                    {reason}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── Zašto baš sada? ──────────────────────────────────────────────────── */}
      <Section surface="surface-0" data-section="mythbusters-why-now">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-pretty text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            {layout.whyNow.heading}
          </h2>
          <div className="mt-6 space-y-4">
            {layout.whyNow.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-relaxed text-slate-600">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FAQ. Genuine Q&A, and the only section emitted as FAQPage schema. ── */}
      <Section surface="surface-1" data-section="mythbusters-faq">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-pretty text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            {layout.faq.heading}
          </h2>
          <div className="mt-10">
            <EbookFaq items={layout.faq.items} />
          </div>
        </div>
      </Section>

      {/* ── Final conversion ─────────────────────────────────────────────────── */}
      <ClosingSection
        id="download"
        data-section="mythbusters-form"
        heading={layout.finalCta.heading}
        body={layout.finalCta.body}
        note={layout.finalCta.note}
        /* The reassurances move out of the card and up beside the headline. Inside the form
           they were fine print under a button; here they are part of the closing argument,
           and the card gets shorter for it. */
        points={<ClosingPoints items={layout.formAssurances} />}
      >
        <EbookForm
          copy={content.form}
          locale="sr"
          placement="closing"
          density="compact"
          showIntro={false}
        />
      </ClosingSection>

    </>
  )
}
