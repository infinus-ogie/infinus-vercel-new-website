import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * The shared MythBusting campaign hero shell.
 *
 * ── Why this exists ────────────────────────────────────────────────────────────
 * The two landing pages are genuinely different DOCUMENTS — the client sent a new Serbian
 * conversion layout rather than a translation — and that divergence belongs in the content.
 * It had leaked into the presentation too, so the pages read as two different websites: one
 * centred and generic, one a split layout with tiny type in a large empty navy canvas.
 *
 * This shell is the part that must be identical: the ground, the container width, the column
 * ratio and the vertical rhythm. Each locale fills the two slots with its own approved copy.
 *
 * ── The ratio ──────────────────────────────────────────────────────────────────
 * Roughly 49/51 at `xl`, where the conversion column holds the cover and the form side by
 * side and therefore needs real width. `minmax(0,…)` on the left is what lets long Serbian
 * words wrap instead of forcing the grid wider than its container; the `420px` floor on the
 * right is what stops the form being squeezed into the utility strip it used to sit in.
 *
 * Below `lg` the columns stack, so mobile gets a single ordered read rather than a squeezed
 * two-column layout — see the page components for that order.
 *
 * ── Decoration is structural, not scenery ──────────────────────────────────────
 * One soft radial wash and one edge-lit gradient. The homepage's animated ElegantShape field
 * is deliberately NOT reused here: on a page whose job is to show a document and take four
 * form fields, five floating blurred capsules compete with the two things that matter. The
 * navy, the type and the cover carry this hero.
 *
 * A server component, so both routes stay statically prerendered.
 */
export function CampaignHero({
  editorial,
  conversion,
  className,
  ...rest
}: {
  /** Left column: eyebrow, headline, supporting copy, benefits. */
  editorial: React.ReactNode
  /** Right column: the e-book cover and the form. */
  conversion: React.ReactNode
  className?: string
} & React.ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className={cn("relative overflow-hidden bg-brand-navyDeep", className)}
      {...rest}
    >
      {/* Depth, kept to two layers. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_78%_12%,rgba(10,110,209,0.20),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      {/*
        Top spacing is ONE system for both locales, which is why it lives here and not in
        either page.

        `pt-40 md:pt-56` — 160px / 224px. The fixed navbar is ~80px tall, so this leaves a
        deliberate 80/144px of navy between the chrome and the eyebrow: enough that the hero
        reads as its own surface rather than as the continuation of the header, and short of
        the dead band you get when a hero is pushed toward the fold for its own sake.

        Bottom padding is unchanged. The room was wanted under the nav, not everywhere.
      */}
      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-40 sm:px-6 md:pb-20 md:pt-56 lg:px-8">
        {/*
          ── The outer ratio ──────────────────────────────────────────────────────────
          1 : 1.32 at `xl`, which is roughly 43/57.

          This is the ratio the whole pass turns on. The conversion column has to hold the
          cover AND a form wide enough for two fields per row; at the previous 49/51 the form
          resolved to 312px and dropped to a single column, so the desktop hero showed four
          stacked fields next to a cover. Giving the right column 57% puts the form near 410px,
          which is over the line where its grid goes 2×2 — see EbookForm, which decides on its
          own width rather than on the viewport's.

          The editorial side loses nothing that matters: it carries an eyebrow, a headline, a
          subtitle and three or four value points, and 43% of this container is still a
          comfortable measure for all of them.

          At `lg` the module inside is still stacked, so the column only has to hold a
          full-width form: `minmax(440px,52%)` is a floor a long Serbian label cannot push
          it below.
        */}
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(440px,52%)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.32fr)] xl:gap-10">
          <div>{editorial}</div>
          {/* `lg:sticky` keeps the conversion column beside the copy on tall desktop heroes
              without any scroll listener. Harmless when the column is the taller of the two. */}
          <div className="lg:sticky lg:top-28">{conversion}</div>
        </div>
      </div>
    </section>
  )
}

/**
 * The campaign eyebrow chip — "Free E-Book | PDF | 15-Minute Read" / "Besplatan e-book | …".
 *
 * Both locales print this string; only the wording differs. Shared so the two heroes cannot
 * drift apart on a detail this visible.
 */
export function CampaignEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-blue-100 backdrop-blur-sm sm:text-sm">
      {children}
    </p>
  )
}

/**
 * The campaign h1.
 *
 * One scale for both locales, and a substantially larger one than either page used before —
 * the previous Serbian hero topped out at 46px on desktop, which is what made campaign
 * marketing read as document body text. `text-balance` keeps the last line from stranding a
 * single word, which matters more here than usual because the two languages break differently.
 */
export function CampaignHeading({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h1
      className={cn(
        "text-balance font-light tracking-tight text-white",
        "text-[34px] leading-[1.1] sm:text-[42px] md:text-[52px] lg:text-[56px]",
        className
      )}
    >
      {children}
    </h1>
  )
}
