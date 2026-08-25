import * as React from "react"
import { Award, Globe2, Users2, type LucideIcon } from "lucide-react"
import { SapGoldPartnerBadge } from "@/components/ui/SapGoldPartnerBadge"

/**
 * The trust band under both campaign heroes.
 *
 * ── One SHELL, two payloads ────────────────────────────────────────────────────
 * The locales carry different proof, and that is the client's decision rather than a
 * translation gap:
 *
 *   SR  a statement — "Poverenje kompanija koje…" — beside the SAP Gold Partner and Infinus
 *       marks. Its newer source replaced the old four-stat row with exactly this.
 *   EN  four metrics, the first of which IS the SAP Gold Partner credential.
 *
 * Everything around that content is identical: ground, both rules, minimum height, padding,
 * vertical centring, type scale, mark size and breakpoint. Previously the two bands only
 * happened to look similar and drifted apart every time either was touched.
 *
 * ── The shell's job is the transition ──────────────────────────────────────────
 * It sits between a navy hero and a white page, so it is neither: a very pale blue that
 * carries a memory of the hero at its top edge and resolves to near-white at its bottom, with
 * a hairline rule on both sides. No card, no shadow, no rounded container around the strip —
 * those would make it a third section competing with the two it joins. Space and one tint.
 */
export function TrustBand({
  statement,
  proof,
  ...rest
}: {
  /** The Serbian statement. Omitted on English, whose proof is the metric row itself. */
  statement?: string
  /** Logos (SR) or metrics (EN). */
  proof: React.ReactNode
} & React.ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className="border-y border-slate-200/70 bg-gradient-to-b from-[#EDF3FC] to-[#FAFCFE]"
      {...rest}
    >
      {/*
        `lg:min-h-[10.25rem]` is what makes the two locales the same band rather than two bands
        that happen to share a colour. English stacks a mark over a figure over a descriptor;
        Serbian sets a sentence beside two marks. Left alone those resolve to 204px and 122px,
        and switching locale shows the jump. The floor holds both at 160px on desktop, the
        English column is tuned to fit inside it, and everything centres.

        164px rather than a round 160: that is the English row's own content height once
        compressed, measured. Setting the floor to exactly it makes the Serbian band resolve to
        the same 166px including rules, so switching locale moves nothing. Rounding down to
        160 left English 4px taller — invisible in isolation, visible when the two are compared,
        which is the whole point of the shared shell.
      */}
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-6 px-4 py-7 text-center sm:px-6 md:py-8 lg:min-h-[10.25rem] lg:flex-row lg:justify-between lg:gap-12 lg:px-8 lg:text-left">
        {statement ? (
          <p className="max-w-[38ch] text-[15px] font-medium leading-relaxed text-slate-700 md:text-base">
            {statement}
          </p>
        ) : null}
        <div className="min-w-0">{proof}</div>
      </div>
    </section>
  )
}

/**
 * Icons for the metrics that are numbers.
 *
 * Positional and `aria-hidden`: the approved strings are never interpreted, they are only
 * given an anchor so a row of claims reads as separate things rather than one run of text.
 * Index 0 is absent because the first English item is the partner credential, which brings
 * its own mark — see {@link TrustMetrics}.
 */
const METRIC_ICONS: Readonly<Record<number, LucideIcon>> = { 1: Users2, 2: Globe2, 3: Award }

/**
 * Split a metric into its leading credential and the rest.
 *
 * "30+ SAP Consultants" -> "30+" / "SAP Consultants"
 * "70% of Consultants with 10+ Years of SAP Experience" -> "70%" / "of Consultants with…"
 * "SAP Gold Partner" -> no leading figure.
 *
 * This is a LINE BREAK, not an edit. Every word of the approved metric is rendered, in the
 * approved order — the split only decides which of them gets the larger type, so a scanning
 * reader sees "30+" before they see what it counts.
 */
function splitMetric(value: string): { figure: string | null; label: string } {
  const match = /^(\d[\d.,]*\s*[%+]?\+?)\s+(.+)$/.exec(value)
  if (!match) return { figure: null, label: value }
  return { figure: match[1].trim(), label: match[2].trim() }
}

/**
 * The English proof row.
 *
 * ── Vertical, not a sentence ───────────────────────────────────────────────────
 * Each item reads mark → credential → descriptor down the page. Set horizontally, "70%" and
 * "of Consultants with 10+ Years of SAP Experience" ran together into a line of prose that
 * had to be read rather than scanned, which is what made the old band feel utilitarian.
 *
 * ── The partner mark appears ONCE ──────────────────────────────────────────────
 * "SAP Gold Partner" is the first approved metric AND the band used to print the certification
 * badge next to the row, so the same credential was on screen twice — once as artwork and once
 * as a shield icon with the words beside it. Now the badge IS that item's mark and the approved
 * string is its accessible name: the artwork already sets the words, so repeating them under it
 * would be the duplication in a different form. Screen readers get the string from `alt`;
 * test/mythbusters-page.test.tsx asserts all four strings survive on that basis.
 */
export function TrustMetrics({ items }: { items: readonly string[] }) {
  return (
    <ul className="grid grid-cols-2 items-start gap-x-5 gap-y-6 sm:grid-cols-4 lg:flex lg:flex-nowrap lg:items-center lg:justify-end lg:gap-x-0">
      {items.map((item, index) => {
        const Icon = METRIC_ICONS[index]
        const { figure, label } = splitMetric(item)
        return (
          <li
            key={item}
            /* Separators belong to the single row only: inside a two-column grid a left rule
               on every other item reads as an accident rather than a divider. */
            className="flex min-w-0 flex-col items-center justify-start gap-2 text-center lg:border-l lg:border-slate-200/80 lg:px-6 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
          >
            {/* One fixed-height slot for every mark, so four items whose marks differ in kind
                still sit on one baseline. */}
            <span className="flex h-9 items-center justify-center">
              {Icon ? (
                <span className="inline-grid size-9 place-items-center rounded-full border border-slate-200 bg-white">
                  <Icon className="h-[18px] w-[18px] text-brand-sap" aria-hidden="true" />
                </span>
              ) : (
                <SapGoldPartnerBadge className="h-9 w-auto" alt={item} />
              )}
            </span>

            {figure ? (
              <span className="flex min-w-0 flex-col">
                <span className="text-xl font-bold leading-none tracking-tight text-slate-900">
                  {figure}
                </span>{" "}
                {/* The space is deliberate: two block-level spans concatenate in `textContent`
                    with nothing between them — "30+SAP Consultants" — which is what anyone
                    copying the line, or any tool reading the node, would get. No visual
                    effect, since the spans break anyway. */}
                <span className="mt-1 max-w-[20ch] text-[12px] font-medium leading-[1.35] text-slate-600">
                  {label}
                </span>
              </span>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

/**
 * The Serbian proof slot: the two marks, with a hairline between them.
 *
 * Given real presence — these are the page's credentials, not footer decoration — while
 * staying inside the band's height so the two locales match. The rule between them is the
 * same weight as the separators on the English row opposite.
 */
export function TrustLogos({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-5 sm:gap-7 [&>*+*]:border-l [&>*+*]:border-slate-200/80 [&>*+*]:pl-5 sm:[&>*+*]:pl-7">
      {children}
    </div>
  )
}

/** One mark. No container: on this pale ground a white box around a logo is a card, and the
 *  band is deliberately not made of cards. */
export function TrustLogo({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center justify-center">{children}</span>
}
