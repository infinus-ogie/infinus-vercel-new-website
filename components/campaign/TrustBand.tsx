import * as React from "react"
import { SapGoldPartnerBadge } from "@/components/ui/SapGoldPartnerBadge"
import { cn } from "@/lib/utils"

/**
 * The trust band under both campaign heroes.
 *
 * ── One band, one payload ──────────────────────────────────────────────────────
 * The two locales used to carry different proof: English four metrics, Serbian a statement
 * beside the SAP and Infinus marks. The owner has withdrawn that split — both pages now show
 * the same four cells, and the Serbian strings are the ones from the FIRST approved Serbian
 * document rather than a fresh translation (see content/sr/mythbusters.ts).
 *
 * So this component no longer has locale branches, a `statement` slot, or logo sub-components.
 * It takes four approved strings and renders four cells. Anything that made the two bands able
 * to drift apart has been removed rather than kept in sync.
 *
 * ── Restraint is the design ────────────────────────────────────────────────────
 * A very pale blue resolving to cool white, one hairline rule top and bottom, hairline
 * separators between cells, and space. No cards, no pills, no shadows, and — deliberately —
 * no icons: a row of generic blue glyphs decorated the claims without telling the reader
 * anything the number beside them did not already say.
 *
 * The band sits between a navy hero and a white page and its job is that transition, not to be
 * a third section competing with the two it joins.
 */
export function TrustBand({
  items,
  ...rest
}: {
  /** The four approved proof strings, in approved order. */
  items: readonly string[]
} & React.ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className="border-y border-slate-200/70 bg-gradient-to-b from-[#EDF3FC] to-[#FAFCFE]"
      {...rest}
    >
      {/*
        Two height floors, and they are what make the locales one band rather than two.

        The descriptors differ in length between English and Serbian, so the cells wrap to
        different line counts and the bands resolve to different heights — 236 vs 219 on a
        phone, 161 vs 143 at `md`. Left alone, switching locale nudges the whole page down.

        `15rem` / `md:10rem` are the taller side of each measured pair, so both locales settle
        on the same value and the content centres inside it. Measured, not rounded to something
        that looked about right.
      */}
      <div className="mx-auto flex min-h-[15rem] max-w-6xl flex-col justify-center px-4 py-8 sm:px-6 md:min-h-[10rem] md:py-9 lg:px-8">
        <ul className="grid grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-y-0">
          {items.map((item, index) => {
            const { figure, label } = splitMetric(item)
            return (
              <li
                key={item}
                className={cn(
                  "flex min-w-0 flex-col items-center justify-center gap-2 px-4 text-center sm:px-6 md:px-4 lg:px-6",
                  /*
                    A separator on the LEFT of every cell that is not first in its row: the
                    2×2 starts a new row at cell 3, the four-across row only at cell 1.

                    Decided by index rather than by `odd:`/`first-child` variants because those
                    would need a later rule to beat an earlier one at the SAME breakpoint, and
                    Tailwind's output order within a breakpoint is not something to rely on for
                    correctness. This is explicit and cannot resolve the wrong way.
                  */
                  index === 0
                    ? undefined
                    : index % 2 === 1
                      ? "border-l border-slate-200/70"
                      : "md:border-l md:border-slate-200/70"
                )}
              >
                {figure ? (
                  <>
                    <span className="text-[26px] font-bold leading-none tracking-tight text-slate-900 lg:text-[28px]">
                      {figure}
                    </span>{" "}
                    {/* The space is deliberate: two block-level spans concatenate in
                        `textContent` with nothing between them — "30+SAP konsultanata" — which
                        is what anyone copying the line, or any tool reading the node, would
                        get. No visual effect, since the spans break anyway. */}
                    <span className="max-w-[22ch] text-[12.5px] font-medium leading-[1.4] text-slate-600">
                      {label}
                    </span>
                  </>
                ) : (
                  /*
                    The partner credential is artwork, not a figure. It carries the approved
                    string as its accessible name rather than repeating it underneath: the
                    badge already sets those words, so a caption would be the same credential
                    twice — which is exactly what this band was asked to stop doing.
                  */
                  <SapGoldPartnerBadge className="h-12 w-auto lg:h-[52px]" alt={item} />
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/**
 * Split a metric into its leading figure and the rest.
 *
 *   "30+ SAP konsultanata"  ->  "30+" / "SAP konsultanata"
 *   "70% of Consultants…"   ->  "70%" / "of Consultants…"
 *   "SAP Gold Partner"      ->  no leading figure; rendered as the badge.
 *
 * This is a LINE BREAK, not an edit. Every word of the approved string is rendered, in the
 * approved order — the split only decides which of them gets the larger type, so a scanning
 * reader sees "30+" before they see what it counts.
 */
function splitMetric(value: string): { figure: string | null; label: string } {
  const match = /^(\d[\d.,]*\s*[%+]?\+?)\s+(.+)$/.exec(value)
  if (!match) return { figure: null, label: value }
  return { figure: match[1].trim(), label: match[2].trim() }
}
