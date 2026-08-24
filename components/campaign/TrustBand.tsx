import * as React from "react"
import { Award, Globe2, ShieldCheck, Users2, type LucideIcon } from "lucide-react"

/**
 * The trust band under both campaign heroes.
 *
 * ── One SHELL, two payloads ────────────────────────────────────────────────────
 * The locales carry different proof, and that is the client's decision rather than a
 * translation gap:
 *
 *   SR  a statement — "Poverenje kompanija koje…" — beside the SAP Gold Partner and Infinus
 *       marks. Its newer source replaced the old four-stat row with exactly this.
 *   EN  four metrics, including the 70% consultant-experience claim.
 *
 * Everything around that content is now identical: ground, both borders, height, padding,
 * alignment, type scale, mark containers and breakpoint. Previously the two bands only
 * happened to look similar, and drifted apart every time either was touched.
 *
 * ── Restrained on purpose ──────────────────────────────────────────────────────
 * A cool near-white ground picking up the navy above it, a hairline top and bottom rule, and
 * space. No cards, no shadows, no oversized logos. The band's job is to carry the hero's
 * credibility across into the white page below it, not to be a second hero.
 */
export function TrustBand({
  statement,
  proof,
  ...rest
}: {
  /** The Serbian statement. Omitted on English, whose proof is the metric list itself. */
  statement?: string
  /** Logos (SR) or metrics (EN). */
  proof: React.ReactNode
} & React.ComponentPropsWithoutRef<"section">) {
  return (
    <section className="border-y border-slate-200/80 bg-[#F6F9FE]" {...rest}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-7 text-center sm:px-6 md:py-8 lg:flex-row lg:justify-between lg:gap-12 lg:px-8 lg:text-left">
        {statement ? (
          <p className="max-w-lg text-[15px] font-medium leading-relaxed text-slate-700">
            {statement}
          </p>
        ) : null}
        <div className="min-w-0">{proof}</div>
      </div>
    </section>
  )
}

/**
 * Icons for the metric list. Positional and `aria-hidden`: the approved metric strings are
 * never interpreted, they are simply given an anchor so a row of four claims reads as four
 * things rather than one run of text.
 */
const METRIC_ICONS: readonly LucideIcon[] = [ShieldCheck, Users2, Globe2, Award]

/**
 * Split a metric into its leading credential and the rest.
 *
 * "30+ SAP Consultants" -> "30+" / "SAP Consultants"
 * "70% of Consultants with 10+ Years of SAP Experience" -> "70%" / "of Consultants with…"
 * "SAP Gold Partner" -> no leading figure; rendered whole.
 *
 * This is a LINE BREAK, not an edit. Every word of the approved metric is rendered, in the
 * approved order — the split only decides which of them gets the larger type, so a scanning
 * reader sees "30+" before they see what it counts. A metric with no leading figure falls
 * through and renders exactly as written, which is why the first item still reads
 * "SAP Gold Partner" on one line.
 */
function splitMetric(value: string): { figure: string | null; label: string } {
  const match = /^(\d[\d.,]*\s*[%+]?\+?)\s+(.+)$/.exec(value)
  if (!match) return { figure: null, label: value }
  return { figure: match[1].trim(), label: match[2].trim() }
}

/** The English metric list, as the band's proof slot. */
export function TrustMetrics({ items }: { items: readonly string[] }) {
  return (
    /*
      Two-up on phones, four across from `sm`, a single divided row at `lg`.
      Stacked one-per-line the four English metrics made the band 381px tall on a 390px
      screen — nearly double the Serbian band beside it, which is the opposite of the shared
      shell this is supposed to be. Two columns halves that and keeps the pairs aligned.
    */
    <ul className="grid grid-cols-2 items-center gap-x-4 gap-y-5 sm:grid-cols-4 lg:flex lg:flex-nowrap lg:items-stretch lg:justify-end lg:gap-x-0">
      {items.map((item, index) => {
        const Icon = METRIC_ICONS[index % METRIC_ICONS.length]
        const { figure, label } = splitMetric(item)
        return (
          <li
            key={item}
            /* The dividers belong to the single-row layout only — inside a two-column grid a
               left rule on every other item reads as an accident, not a separator. */
            className="flex min-w-0 items-center gap-3 lg:border-l lg:border-slate-200 lg:px-5 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
          >
            <span className="inline-grid size-9 shrink-0 place-items-center rounded-full border border-slate-200 bg-white">
              <Icon className="h-[18px] w-[18px] text-brand-sap" aria-hidden="true" />
            </span>
            <span className="min-w-0 text-left">
              {figure ? (
                <>
                  <span className="block text-lg font-bold leading-none tracking-tight text-slate-900">
                    {figure}
                  </span>{" "}
                  {/* The space is deliberate. Two block spans concatenate in `textContent`
                      with nothing between them — "30+SAP Consultants" — which is what anyone
                      copying the line, or any tool reading the node's text, would get. It has
                      no visual effect: the spans are block-level and break anyway. */}
                  <span className="mt-1 block text-[12.5px] font-medium leading-snug text-slate-600">
                    {label}
                  </span>
                </>
              ) : (
                <span className="block text-[13px] font-semibold leading-snug text-slate-900">
                  {label}
                </span>
              )}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * The Serbian proof slot: the two marks in matching containers.
 *
 * Same container, same height, same border as the metric icons opposite them on the English
 * band — which is what stops "logos" and "metrics" reading as two different components. Big
 * enough to be credentials, small enough not to compete with the hero.
 */
export function TrustLogos({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-4 sm:gap-5">{children}</div>
}

/** One mark, in the shared container. */
export function TrustLogo({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-14 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 sm:px-5">
      {children}
    </span>
  )
}
