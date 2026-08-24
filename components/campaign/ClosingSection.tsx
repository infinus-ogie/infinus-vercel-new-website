import * as React from "react"

/**
 * The dark closing conversion section, shared by both MythBusting pages.
 *
 * ── What it replaces ───────────────────────────────────────────────────────────
 * A white form card centred on a dark band, with nothing said around it. The page simply
 * stopped and presented a form; there was no closing argument, and on the English half there
 * was not even a heading.
 *
 * It is now a two-column composition on the same ratio as the hero — statement on the left,
 * form on the right — so the campaign opens and closes in the same shape.
 *
 * ── The navy is `brand.navy` (#061A4D), not the hero's #00144a ─────────────────
 * The footer is exactly #00144a. A closing section in that value would butt into it and the
 * page would end in one undifferentiated navy block. This is a tonal step inside the existing
 * palette; the hairline top rule, the radial lift and the deep bottom padding keep the seam
 * to the footer legible.
 *
 * The form card inside stays white. Contrast and field legibility beat tonal consistency, and
 * a dark form on a dark ground is the worse trade.
 */
export function ClosingSection({
  heading,
  body,
  note,
  points,
  children,
  ...rest
}: {
  heading: string
  body: string
  /** The Serbian source's "PDF • Besplatno • Odmah dostupan" line. English has none. */
  note?: string
  /** Reassurances, shown beside the headline rather than inside the card. */
  points?: React.ReactNode
  /** The form card. */
  children: React.ReactNode
} & React.ComponentPropsWithoutRef<"section">) {
  return (
    <section className="relative scroll-mt-24 overflow-hidden bg-brand-navy" {...rest}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_25%_0%,rgba(10,110,209,0.20),transparent_70%)]"
      />

      {/*
        The seam with the footer.

        The footer is `brand.navyDeep` (#00144a) and this section is `brand.navy` (#061A4D) —
        close enough that at a glance the page can look like it ends in one long navy block.
        Three restrained things separate them, none of which is a new colour: a bottom rule
        that mirrors the top one, a gradient that settles this section INTO the footer's
        darker value over its last 96px, and deeper bottom padding so the form is not sitting
        on the join.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-brand-navyDeep"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-16 sm:px-6 md:pb-32 md:pt-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(380px,44%)] lg:gap-16">
          <div>
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl lg:text-[42px]">
              {heading}
            </h2>
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-slate-300">{body}</p>
            {note ? (
              <p className="mt-4 text-sm font-medium tracking-wide text-blue-200">{note}</p>
            ) : null}
            {points ? <div className="mt-8">{points}</div> : null}
          </div>

          <div>{children}</div>
        </div>
      </div>
    </section>
  )
}
