import Script from "next/script"
import { CheckCircle2 } from "lucide-react"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { EbookForm } from "@/components/mythbusters/EbookForm"
import {
  CampaignHero,
  CampaignEyebrow,
  CampaignHeading,
} from "@/components/campaign/CampaignHero"
import { EbookCover } from "@/components/campaign/EbookCover"
import { TrustBand } from "@/components/campaign/TrustBand"
import { ValuePoints } from "@/components/campaign/ValuePoints"
import { ClosingSection } from "@/components/campaign/ClosingSection"
import { ConversionModule } from "@/components/campaign/ConversionModule"
import type { MythBustersDictionary, EnMythBustersLayout } from "@/content/dictionary"

/**
 * The ENGLISH SAP MythBusting landing page — /insights/sap-mythbusters.
 *
 * ── Same campaign, different document ──────────────────────────────────────────
 * The Serbian half is a separate component because the client sent a new Serbian SOURCE, not
 * a translation: four myth/fact previews instead of ten myth statements, a real FAQ, a
 * why-now section. That divergence is content, and it stays.
 *
 * What used to diverge and should never have is the DESIGN. This page was centred, generic
 * and never showed the thing it gives away, while the Serbian page was a split conversion
 * layout — so the pair read as two different websites. Both now share
 * components/campaign/*: the hero shell, the type scale, the cover treatment, the trust band
 * and the closing composition. Only the copy and the section list differ.
 *
 * ── The form is now in the hero, on the owner's decision ───────────────────────
 * Previously the only form was at the bottom. It is now in the hero as well, matching the
 * Serbian conversion principle. Two instances on one page is exactly the case EbookForm was
 * built for — every id it emits is prefixed with `useId()` and each instance owns its own
 * state — so this needed no change to the form itself.
 *
 * A server component; only the two form instances are client components.
 */
export interface MythBustersPageProps {
  content: MythBustersDictionary
  /** The English page body, narrowed by the route file. */
  layout: EnMythBustersLayout
  /** Serialised JSON-LD for this locale, built by the route file. */
  jsonLd: string
}

/** Where the mobile hero CTA jumps to. Also the focus target — see the wrapper below. */
const HERO_FORM_ID = "ebook-hero"

export function MythBustersPage({ content, layout, jsonLd }: MythBustersPageProps) {
  return (
    <>
      <Script
        id="json-ld-mythbusters"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      {/* ── Hero: editorial left, conversion right ───────────────────────────── */}
      <CampaignHero
        data-section="mythbusters-hero"
        editorial={
          <div>
            <CampaignEyebrow>{layout.hero.eyebrow}</CampaignEyebrow>

            <CampaignHeading className="mt-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                {layout.hero.titleLine1}
              </span>{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white/90 to-blue-400">
                {layout.hero.titleLine2}
              </span>
            </CampaignHeading>

            {/* Held to a readable measure rather than the full column: a 900px line of
                12-word prose is what made this hero read as a document. */}
            <p className="mt-6 max-w-[50ch] text-base leading-relaxed text-slate-300/90 md:text-[17px]">
              {layout.hero.lede}
            </p>

            <div className="mt-8">
              <ValuePoints items={layout.hero.bullets} />
            </div>

            {/* MOBILE ONLY. On desktop the form sits in the column beside this copy, so a
                button promising the same thing would be a second, weaker route to something
                already on screen. Below `lg` the form is under the cover, so the jump is
                genuinely useful — it targets the HERO form, not the closing one. */}
            <div className="mt-9 lg:hidden">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/35 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#00144a]"
              >
                <a href={`#${HERO_FORM_ID}`}>{layout.hero.cta}</a>
              </Button>
            </div>
          </div>
        }
        conversion={
          <ConversionModule
            /* Decorative, and deliberately unlike the Serbian call: that locale has approved
               alt copy naming the document and this one does not, so inventing an English
               string here would be writing client copy. The sizing is ConversionModule's now,
               which is what actually holds the two heroes to the same composition. */
            cover={<EbookCover priority />}
            form={
              /*
                `tabIndex={-1}` with `scroll-mt-24` is what makes the mobile CTA correct rather
                than merely functional: a bare `#id` jump moves the viewport but leaves focus
                on the link, so a keyboard or screen-reader user lands nowhere. Focusing the
                wrapper puts them at the top of the form they asked for, and the scroll margin
                keeps the heading clear of the fixed navbar.
              */
              <div id={HERO_FORM_ID} tabIndex={-1} className="scroll-mt-24 focus:outline-none">
                {/* Compact: two fields per row instead of four stacked. The card was taller
                    than the copy beside it, which inverted the hero's hierarchy. */}
                <EbookForm copy={content.form} locale="en" placement="hero" density="compact" />
              </div>
            }
          />
        }
      />

      {/* ── Trust band ───────────────────────────────────────────────────────── */}
      {/* Identical to the Serbian call: one band, four approved proofs, no locale branch. */}
      <TrustBand data-section="mythbusters-trust" items={layout.trustBar} />

      {/* ── Why download ─────────────────────────────────────────────────────── */}
      <Section surface="surface-0" data-section="mythbusters-why">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-pretty text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            {layout.why.introTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-[60ch] text-lg leading-relaxed text-slate-600">
            {layout.why.introBody}
          </p>
        </div>

        {/* Four value points as editorial columns. They were bordered cards; the border added
            nothing but chrome, and four of them in a row is the card fatigue the brief calls
            out. A rule and real spacing group them just as well. */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-x-14 gap-y-10 sm:grid-cols-2">
          {layout.why.items.map((item) => (
            <div key={item.title} className="border-t border-slate-200 pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-sap">
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── The ten myths ────────────────────────────────────────────────────── */}
      <Section surface="surface-1" data-section="mythbusters-myths">
        <h2 className="mx-auto max-w-3xl text-balance text-center text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
          {layout.myths.heading}
        </h2>

        {/* The numbers were filled blue discs, which made a list of ten claims look like a
            feature grid and gave the ordinal more weight than the myth. They are now quiet
            navigation cues and the myth is the thing you read. */}
        <ol className="mx-auto mt-14 grid max-w-5xl gap-x-14 sm:grid-cols-2">
          {layout.myths.items.map((myth, index) => (
            <li
              key={myth}
              className="flex items-baseline gap-5 border-t border-slate-200 py-5"
            >
              <span
                aria-hidden="true"
                className="w-7 shrink-0 text-right text-lg font-light tabular-nums text-slate-400"
              >
                {index + 1}
              </span>
              <span className="text-[17px] leading-snug text-slate-800">{myth}</span>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex justify-center">
          <Button asChild size="lg">
            <a href="#download">{layout.myths.cta}</a>
          </Button>
        </div>
      </Section>

      {/* ── Who it is for ────────────────────────────────────────────────────── */}
      <Section surface="surface-0" data-section="mythbusters-audience">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-pretty text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            {layout.audience.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-[60ch] text-lg leading-relaxed text-slate-600">
            {layout.audience.body}
          </p>
        </div>

        <ul className="mx-auto mt-12 grid max-w-3xl gap-x-10 gap-y-4 sm:grid-cols-2">
          {layout.audience.roles.map((role) => (
            <li key={role} className="flex items-start gap-3 text-slate-700">
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-sap" aria-hidden="true" />
              <span>{role}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/*
        ── Closing conversion ─────────────────────────────────────────────────────
        The English layout carries NO dedicated closing copy — the Serbian source supplies a
        `finalCta` block and the English one does not. Rather than invent a headline, the
        section promotes the form's own approved heading and body to section scale and the
        card below turns its copy off, so the same two sentences are stated once, larger,
        where a closing argument belongs.

        Flagged in the report: if the owner approves a proper English closing line, it drops
        straight in here.
      */}
      <ClosingSection
        id="download"
        data-section="mythbusters-form"
        heading={content.form.heading}
        body={content.form.body}
      >
        <EbookForm
          copy={content.form}
          locale="en"
          placement="closing"
          density="compact"
          showIntro={false}
        />
      </ClosingSection>
    </>
  )
}
