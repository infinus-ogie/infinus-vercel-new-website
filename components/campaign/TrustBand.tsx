import * as React from "react"
import { Award, Globe2, ShieldCheck, Users2, type LucideIcon } from "lucide-react"

/**
 * The trust band that sits directly under both campaign heroes.
 *
 * ── One visual language, two payloads ──────────────────────────────────────────
 * The locales carry different proof and that is the client's decision, not a translation gap:
 *
 *   SR  a statement — "Poverenje kompanija koje…" — beside the SAP Gold Partner and Infinus
 *       marks. Its newer source replaced the old four-stat row with exactly this.
 *   EN  four metrics, including the 70% consultant-experience claim.
 *
 * What they must NOT differ in is authority. Both used to render as a thin 6px-padded white
 * strip with small grey text, which is why the marks read as afterthoughts rather than
 * credentials. This band gives both a real vertical presence, a defined top and bottom edge
 * and a consistent measure — so the two pages look designed by the same team while saying
 * different things.
 *
 * ── Why not a huge logo banner ─────────────────────────────────────────────────
 * The brief is explicit: more authority, not more size. So the lift comes from padding,
 * a divider, type weight and a light ground — not from scaling the artwork up until it
 * competes with the hero above it.
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
    <section
      className="border-b border-slate-200/80 bg-white"
      {...rest}
    >
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:py-7 lg:px-8">
        {/* Side by side from `lg`, stacked below it.
            It used to switch at `md`, which is 768px exactly — and at that width the Serbian
            statement's own `max-w-xl` plus the two logos needed more room than the container
            had, so the Infinus mark pushed 8px past the edge. There is no useful two-column
            trust band at 768; stacking it there is both correct and roomier. */}
        <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:gap-10 lg:text-left">
          {statement ? (
            <p className="max-w-xl text-[15px] font-medium leading-relaxed text-slate-700 md:text-base">
              {statement}
            </p>
          ) : null}
          {/* `min-w-0`, never `shrink-0`. On the English band there is no statement, so the
              proof IS the row: a non-shrinking wrapper made the badge plus four metrics
              overflow by 76px at exactly 768px, where `md:flex-row` kicks in but the viewport
              is still narrow. The marks inside keep their own `shrink-0`, so nothing is
              squashed — the row is simply allowed to wrap. */}
          <div className="min-w-0">{proof}</div>
        </div>
      </div>
    </section>
  )
}

/**
 * Icons for the metric list. Positional and `aria-hidden`, like the hero's value tiles: the
 * approved metric strings are not parsed or interpreted, they are simply given an anchor so
 * a row of four claims reads as four things rather than one run of text.
 */
const METRIC_ICONS: readonly LucideIcon[] = [ShieldCheck, Users2, Globe2, Award]

/**
 * The English metric list, as the band's proof slot.
 *
 * Kept in this module rather than inline in the page so the two locales' bands share their
 * spacing and type decisions in one place.
 *
 * The strings are rendered WHOLE. Splitting "30+ SAP Consultants" into a big number and a
 * caption would look closer to a dashboard, but it means parsing client-approved copy at
 * render time — and the first metric ("SAP Gold Partner") has no number to split on, so the
 * row would stop being uniform the moment the copy changed.
 */
export function TrustMetrics({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4 lg:justify-end">
      {items.map((item, index) => {
        const Icon = METRIC_ICONS[index % METRIC_ICONS.length]
        return (
          <li key={item} className="flex items-center gap-2.5 lg:max-w-[13rem]">
            <span className="inline-grid size-8 shrink-0 place-items-center rounded-full border border-slate-200 bg-white">
              <Icon className="h-4 w-4 text-brand-sap" aria-hidden="true" />
            </span>
            <span className="text-[13px] font-semibold leading-snug text-slate-800">{item}</span>
          </li>
        )
      })}
    </ul>
  )
}
