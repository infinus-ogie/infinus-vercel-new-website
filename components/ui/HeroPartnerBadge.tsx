'use client';

import { SapGoldPartnerBadge } from "@/components/ui/SapGoldPartnerBadge";

/**
 * The homepage hero's brand lockup: Infinus, a hairline, the SAP Gold Partner credential.
 *
 * ── Why the two marks share one container ──────────────────────────────────────
 * The credential has moved twice. It began as the first of three trust pills, wearing the
 * same shape as "30+ consultants" - which flattened the difference between a certification
 * and a count. It then became a separate mark floating under this bubble, which read as two
 * unrelated objects stacked on top of each other.
 *
 * One container settles it: Infinus is the brand, SAP is who Infinus is certified by, and the
 * relationship is stated by putting them side by side rather than by any words.
 *
 * ── Hierarchy is height, because the assets are the same shape ─────────────────
 * Both marks are almost exactly 1.7:1 (892x504 and 814x478), so relative size is the only
 * lever that makes one primary. Infinus is set roughly 40% taller at every breakpoint and
 * neither is stretched - `w-auto` against a fixed height preserves both ratios.
 *
 * The lockup lands near 230px wide on desktop. That is deliberately restrained: it is a
 * credential line under the navigation, not a banner competing with the headline below it.
 *
 * ── One announcement per mark ──────────────────────────────────────────────────
 * Both images now carry information, so both have real alt text. The container's old
 * `aria-label` is gone: it duplicated the Infinus alt, and a single label on a box holding two
 * different marks would have been wrong anyway. The divider is decorative.
 *
 * ── It stays horizontal on phones ──────────────────────────────────────────────
 * At 320px the lockup is around 170px wide, so there is no width pressure and no reason to
 * stack. Stacking would also break the reading it exists to create.
 */
export function HeroPartnerBadge({ logoAlt = "Infinus" }: { logoAlt?: string }) {
  return (
    <div
      className="
        inline-flex items-center justify-center gap-3 sm:gap-4
        rounded-full border border-white/20 bg-white/10
        px-4 py-2 sm:px-5 sm:py-2.5
        shadow-[inset_0_0_0_1px_rgba(255,255,255,.1)]
        backdrop-blur-md ring-1 ring-white/20 hover:ring-white/30
        transition
      "
    >
      <img
        src="/infinus-logo-pack/infinus-logo-05.png"
        alt={logoAlt}
        className="h-10 w-auto shrink-0 sm:h-12 md:h-14"
      />

      {/* Decorative: the two marks are separated visually, not semantically. */}
      <span
        aria-hidden="true"
        className="h-8 w-px shrink-0 bg-white/25 sm:h-9 md:h-10"
      />

      {/* Meaningful here: nothing beside it names the certification, so the artwork IS the
          credential and its alt is the only place that information exists. */}
      <SapGoldPartnerBadge
        alt="SAP Gold Partner"
        className="h-7 w-auto shrink-0 sm:h-8 md:h-10"
      />
    </div>
  );
}
