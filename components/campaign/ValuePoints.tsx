import { BadgeCheck, BarChart3, Layers, Lightbulb, type LucideIcon } from "lucide-react"

/**
 * The hero's value points, as icon tiles.
 *
 * ── Why tiles instead of a check list ──────────────────────────────────────────
 * Four identical ticks in a two-column block read as fine print under the paragraph — the
 * eye skims them as one grey mass. A tile gives each point an anchor and a baseline, which
 * is what makes a four-item list scannable at a glance in a hero.
 *
 * ── The icons carry no meaning, deliberately ───────────────────────────────────
 * They are `aria-hidden` and assigned BY POSITION, not by interpreting the sentence next to
 * them. Choosing an icon per claim would be an editorial act on approved copy — this is
 * decoration that gives the list rhythm, and a screen reader gets the text exactly as
 * written. The cycle means a three-item Serbian list and a four-item English one both look
 * intentional without either dictating the other's length.
 */
const ICONS: readonly LucideIcon[] = [Layers, BadgeCheck, BarChart3, Lightbulb]

export function ValuePoints({
  items,
  heading,
}: {
  items: readonly string[]
  /** The Serbian source prints a label above its list; the English one does not. */
  heading?: string
}) {
  return (
    <div>
      {heading ? (
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
          {heading}
        </p>
      ) : null}

      <ul className="space-y-3.5">
        {items.map((item, index) => {
          const Icon = ICONS[index % ICONS.length]
          return (
            <li key={item} className="flex items-center gap-3.5">
              <span className="inline-grid size-9 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm">
                <Icon className="h-[18px] w-[18px] text-blue-200" aria-hidden="true" />
              </span>
              <span className="text-[15px] leading-snug text-slate-200">{item}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * The closing section's inline reassurances, on a dark ground.
 *
 * Same idea at a smaller scale: a horizontal run under the headline rather than a stacked
 * list, so the closing column stays short enough to sit beside the form card.
 */
export function ClosingPoints({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-7 sm:gap-y-3">
      {items.map((item, index) => {
        const Icon = ICONS[index % ICONS.length]
        return (
          <li key={item} className="flex items-center gap-2.5 text-[14px] text-slate-300">
            <span className="inline-grid size-7 shrink-0 place-items-center rounded-lg border border-white/15 bg-white/10">
              <Icon className="h-[15px] w-[15px] text-blue-200" aria-hidden="true" />
            </span>
            <span>{item}</span>
          </li>
        )
      })}
    </ul>
  )
}
