import Script from "next/script"
import { BookOpen, CheckCircle2 } from "lucide-react"
import { Section } from "@/components/ui/section"
import { EbookForm } from "@/components/mythbusters/EbookForm"
import { EbookFaq } from "@/components/mythbusters/EbookFaq"
import {
  CampaignHero,
  CampaignEyebrow,
  CampaignHeading,
} from "@/components/campaign/CampaignHero"
import { EbookCover } from "@/components/campaign/EbookCover"
import { TrustBand } from "@/components/campaign/TrustBand"
import { MythFactItem } from "@/components/campaign/MythFactItem"
import { ValuePoints } from "@/components/campaign/ValuePoints"
import { ClosingSection } from "@/components/campaign/ClosingSection"
import { ConversionModule } from "@/components/campaign/ConversionModule"
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
              NO explanatory paragraph in the hero.

              Both approved paragraphs now render verbatim in the `mythbusters-context` block
              below the trust band. Neither is deleted, summarised or reworded — this is
              placement only. The hero was asking the reader for an eyebrow, a headline, a
              subtitle, prose and three value points before it showed them the form, and the
              prose is the part that reads at leisure on a light ground rather than competing
              above the fold.

              What is left is the four things the owner named: eyebrow, headline, subtitle,
              value points.
            */}
            <div className="mt-8">
              <ValuePoints items={layout.hero.benefits} heading={layout.hero.benefitsHeading} />
            </div>
          </div>
        }
        conversion={
          <ConversionModule
            /*
              The cover alone. The asset card that used to sit here printed the title, a
              subtitle, a "Šta dobijate" heading and four metadata items — so the hero named
              the same product three times over: once as artwork, once as a metadata panel and
              once as the form that hands it over. The cover identifies the document and the
              form identifies the action; the panel in between was the redundant one.

              The alt stays meaningful precisely BECAUSE that text is gone: nothing beside the
              image names the asset any more.
            */
            cover={<EbookCover alt={layout.assetCard.coverAlt} priority />}
            form={
              /* Compact, for the same reason as the English hero: four stacked fields made a
                 card taller than the pitch it sits beside.

                 No `assurances`: "Odmah dostupno za preuzimanje", "Bez spama" and "Vaši podaci
                 se tretiraju poverljivo" are removed from THIS instance. The privacy
                 acknowledgement and the English-asset note stay — those are commitments, not
                 reassurance decoration. The closing section still shows the three lines beside
                 its own headline. */
              <EbookForm copy={content.form} locale="sr" placement="hero" density="compact" />
            }
          />
        }
      />

      {/* ── Trust band ───────────────────────────────────────────────────────── */}
      {/* The same four proofs the English page shows, in the wording the first approved
          Serbian document used. The statement-plus-two-logos presentation is withdrawn. */}
      <TrustBand data-section="mythbusters-trust" items={layout.trustBar} />

      {/*
        ── The prose moved out of the hero ────────────────────────────────────
        BOTH approved paragraphs, verbatim and in source order. They read as the page's opening
        statement here: the band above has just made the credibility claim, these say what the
        document does with it, and "Da li je ovaj vodič za vas?" below then answers who it is
        for. Set at lede scale — in the hero they were the quietest thing on a dark ground;
        here they are the first thing on a light one.
      */}
      <Section surface="surface-0" data-section="mythbusters-context">
        <div className="mx-auto max-w-3xl space-y-5">
          {layout.hero.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              /* `text-lg`, the same body size as every other prose section on this page.
                 It was `md:text-xl`, which made this block the largest body copy on the page
                 and set it apart from the sections it introduces. */
              className="text-pretty text-lg leading-relaxed text-slate-600"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      {/* ── Da li je ovaj vodič za vas? ──────────────────────────────────────── */}
      <Section surface="surface-0" data-section="mythbusters-audience">
        {/* `max-w-3xl`, the measure the English audience section and every other prose block
            on both pages uses. It was `max-w-4xl` for no reason the content asked for. */}
        <div className="mx-auto max-w-3xl">
          <h2 className="text-pretty text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            {layout.audience.heading}
          </h2>
          <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-slate-600">
            {layout.audience.body}
          </p>

          <p className="mt-10 font-semibold text-slate-900">{layout.audience.rolesIntro}</p>
          {/* A compact grid, not six cards: this supports the pitch, it is not an event. */}
          <ul className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {layout.audience.roles.map((role) => (
              /* No per-item rule here: the English list of the same roles has none, and six
                 hairlines in a two-column grid read as an unfinished table. */
              <li key={role} className="flex items-start gap-3 text-slate-700">
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

        {/*
          The bridge back to conversion, as a sentence rather than a control.

          It was a full-width dashed-border pill, which is the shape of a disabled button: it
          invited a click and there is nothing to click. It is editorial copy, so it is set as
          editorial copy - centred, medium weight, with the book mark the section already uses
          for its accent.
        */}
        <p className="mx-auto mt-10 flex max-w-3xl items-center justify-center gap-2.5 text-center text-lg font-medium text-slate-700">
          <BookOpen className="h-5 w-5 shrink-0 text-brand-sap" aria-hidden="true" />
          <span>{layout.preview.more}</span>
        </p>
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

          {/*
            The four approved reasons as real proof items.

            They were four pieces of text separated by nothing but a thin blue vertical line,
            which read as an unfinished list rather than as the page's authority moment. Each
            now sits on the same quiet tinted panel the rest of the site uses for supporting
            tiles: a small marked icon, the statement at readable size, equal weight across
            all four, no shadow and no heavy border.

            Four across only at `lg`, 2x2 at `sm`, stacked below that - the Serbian statements
            are long enough that four narrow columns would set them three lines deep.
          */}
          <div className="mt-12 border-t border-slate-200 pt-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {layout.whyInfinus.reasonsHeading}
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {layout.whyInfinus.reasons.map((reason) => (
                <li
                  key={reason}
                  className="flex h-full flex-col gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-5"
                >
                  <span className="inline-grid size-9 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white">
                    <CheckCircle2 className="h-[18px] w-[18px] text-brand-sap" aria-hidden="true" />
                  </span>
                  <span className="text-[15px] font-semibold leading-snug text-slate-900">
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
        /*
          Heading, one supporting sentence, one metadata line. No `points`.

          The column used to carry the note AND the three reassurances beside it - "Odmah
          dostupno za preuzimanje", "Bez spama", "Vaši podaci se tretiraju poverljivo" - which
          restated the note and each other. Data handling belongs next to the fields that
          collect the data, and the form's Privacy Policy acknowledgement is untouched.
        */
        note={layout.finalCta.note}
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
