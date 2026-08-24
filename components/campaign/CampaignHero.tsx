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
 * `minmax(0,1fr)` for the editorial column and `minmax(380px,44%)` for the conversion column.
 * The 380px floor is what stops the form and cover being squeezed into the narrow strip that
 * made the previous Serbian hero feel like a utility widget; `minmax(0,…)` on the left is
 * what lets long Serbian words wrap instead of forcing the grid wider than its container.
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
        `pt-32 md:pt-44` — the campaign content used to start at 112/128px, which put the
        eyebrow almost against the fixed navbar. This is +16 on mobile and +48 on desktop, so
        the hero has a deliberate starting position below the chrome rather than beginning
        wherever the nav happens to end. The bottom padding is unchanged: the extra room is
        wanted at the top, not everywhere.
      */}
      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-32 sm:px-6 md:pb-20 md:pt-44 lg:px-8">
        {/*
          The conversion column widens at `xl` so the cover and the form can sit side by side
          inside it — see ConversionModule, which is what actually splits. At `lg` it keeps
          the narrower 46% and the module stays stacked.
        */}
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(400px,46%)] lg:gap-14 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)] xl:gap-16">
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
