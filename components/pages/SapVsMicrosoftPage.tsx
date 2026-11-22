import * as React from "react"
import Script from "next/script"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { CampaignHeading } from "@/components/campaign/CampaignHero"
import { HomeContactSection } from "@/components/home/HomeContactSection"
import type {
  HomeDictionary,
  RichText,
  SapVsMicrosoftDictionary,
} from "@/content/dictionary"

/**
 * The SAP vs Microsoft Insights article, shared by /insights/sap-vs-microsoft (English) and
 * /sr/insights/sap-vs-microsoft (Serbian).
 *
 * ── One component, two locales ─────────────────────────────────────────────────
 * The client wrote the two documents with the same structure, so this is a normal locale
 * pair: the route files differ only in which dictionary, metadata and JSON-LD they pass.
 *
 * ── The visual system is MythBusting's ─────────────────────────────────────────
 * It is the nearest Insights page and the most recently finished one, so this page takes its
 * parts rather than inventing new ones: the navy hero ground and the campaign h1 scale
 * (CampaignHeading), the `Section` surfaces, the section-heading and body type, the uppercase
 * SAP-blue sub-headings and the hairline rules that group them, and the `lg` Button.
 *
 * What it deliberately does not take is the split conversion hero. This is an article, not
 * an e-book gate: the document opens on its title and ends on its call to action, and the
 * page follows that order.
 *
 * ── The contact form is the existing one, unchanged ────────────────────────────
 * HomeContactSection is the site's embeddable business-enquiry form: same /api/contact
 * endpoint, same Zod rules, reCAPTCHA token and honeypot as the homepage. It is rendered
 * exactly as the homepage renders it, with this locale's `home.contactShort` copy.
 *
 * The document's final bold line is the button, and it jumps to that form. Its label was
 * changed after launch from a demo to a meeting ("Book a meeting and request a budgetary
 * quote" / "Zakažite sastanak i zatražite budžetsku ponudu"), because a demo is not offered
 * to every prospect. `tabIndex={-1}` with `scroll-mt-24` on the target is the
 * same pattern MythBustersPage uses: the jump lands focus at the top of the form and keeps
 * its heading clear of the fixed navbar.
 *
 * A server component; only the form is a client component.
 */
export interface SapVsMicrosoftPageProps {
  content: SapVsMicrosoftDictionary
  /** This locale's short contact-form copy, from the `home` namespace where it lives. */
  contactForm: HomeDictionary["contactShort"]
  /** Serialised JSON-LD for this locale, built by the route file. */
  jsonLd: string
}

/** The CTA's target. Identical in both locales, like every other anchor on the site. */
export const SAP_VS_MICROSOFT_FORM_ID = "contact-form"

/**
 * Render one paragraph or bullet from the dictionary's inline runs.
 *
 * The links are the document's own external destinations, so they open in a new tab rather
 * than taking the visitor off the page they are reading.
 */
function Rich({ runs }: { runs: RichText }) {
  return (
    <>
      {runs.map((run, index) => {
        switch (run.kind) {
          case "text":
            return <React.Fragment key={index}>{run.text}</React.Fragment>
          case "strong":
            return (
              <strong key={index} className="font-semibold text-slate-900">
                {run.text}
              </strong>
            )
          case "link":
            return (
              <a
                key={index}
                href={run.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-sap underline decoration-brand-sap/40 underline-offset-4 transition-colors hover:decoration-brand-sap focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sap focus-visible:ring-offset-2"
              >
                {run.text}
              </a>
            )
          case "break":
            return <br key={index} />
        }
      })}
    </>
  )
}

export function SapVsMicrosoftPage({ content, contactForm, jsonLd }: SapVsMicrosoftPageProps) {
  const { intro, comparison, closing } = content

  return (
    <>
      <Script
        id="json-ld-sap-vs-microsoft"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      {/* ── Hero: the title on the campaign navy ─────────────────────────────── */}
      {/* Same ground, decoration and top spacing as CampaignHero, so the navbar's dark
          treatment and the Insights pages' first impression match. */}
      <section
        data-section="sap-vs-microsoft-hero"
        className="relative overflow-hidden bg-brand-navyDeep"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_78%_12%,rgba(10,110,209,0.20),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-40 sm:px-6 md:pb-24 md:pt-56 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <CampaignHeading className="max-w-4xl">
              <span className="bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
                {content.title}
              </span>
            </CampaignHeading>
          </div>
        </div>
      </section>

      {/* ── Thinking about moving from Navision? ─────────────────────────────── */}
      <Section surface="surface-0" data-section="sap-vs-microsoft-intro">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-pretty text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            {intro.heading}
          </h2>
          {/* Left-aligned and held to a reading measure: two dense paragraphs with inline
              links read badly centred. */}
          <div className="mt-8 max-w-[68ch] space-y-6 text-lg leading-relaxed text-slate-600">
            {intro.paragraphs.map((paragraph, index) => (
              <p key={index}>
                <Rich runs={paragraph} />
              </p>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Where SAP Cloud ERP goes further ─────────────────────────────────── */}
      <Section surface="surface-1" data-section="sap-vs-microsoft-comparison">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-pretty text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            {comparison.heading}
          </h2>

          {/* Each group is a row: its heading in a narrow column, its bullets beside it. The
              hairline rule groups them the way MythBusting groups its value points, without
              boxing eighteen bullets into cards. Stacks below `md`. */}
          <div className="mt-12 md:mt-16">
            {comparison.groups.map((group) => (
              <div
                key={group.heading}
                className="grid gap-4 border-t border-slate-200 py-8 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:gap-10 md:py-10"
              >
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-sap md:pt-1">
                  {group.heading}
                </h3>
                <ul className="list-disc space-y-4 pl-5 text-[17px] leading-relaxed text-slate-600 marker:text-brand-sap">
                  {group.items.map((item, index) => (
                    <li key={index} className="pl-1">
                      <Rich runs={item} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Closing argument and the call to action ──────────────────────────── */}
      {/* `brand.navy`, the tone MythBusting closes on, so the article ends in the same voice
          it opened with. The form follows on white, and the footer after it. */}
      <section
        data-section="sap-vs-microsoft-closing"
        className="relative overflow-hidden bg-brand-navy"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_0%,rgba(10,110,209,0.22),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl lg:text-[42px]">
              {closing.heading}
            </h2>
            <p className="mx-auto mt-5 max-w-[60ch] text-lg leading-relaxed text-slate-300">
              <Rich runs={closing.body} />
            </p>
            <div className="mt-10 flex justify-center">
              {/* The site's standard primary Button (default variant, `lg`), flat.
                  · `shadow-none`: the default variant's `shadow-card` computes to a WHITE
                    shadow, invisible on white but a glow on navy. The homepage hero CTA drops
                    it the same way.
                  · The base Button never wraps. The Serbian label is ~50 characters, wider
                    than a 360px phone, so this one may wrap and grows to fit.
                  · The focus ring is white on a navy offset, as on the homepage hero: the
                    default slate ring vanishes on this background. */}
              <Button
                asChild
                size="lg"
                className="h-auto min-h-12 max-w-full whitespace-normal py-3 text-center shadow-none focus-visible:ring-white focus-visible:ring-offset-brand-navy"
              >
                <a href={`#${SAP_VS_MICROSOFT_FORM_ID}`}>{closing.cta}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── The contact form ─────────────────────────────────────────────────── */}
      <Section surface="surface-0" data-section="sap-vs-microsoft-contact">
        <div
          id={SAP_VS_MICROSOFT_FORM_ID}
          tabIndex={-1}
          className="scroll-mt-24 focus:outline-none"
        >
          <HomeContactSection copy={contactForm} />
        </div>
      </Section>
    </>
  )
}
