'use client';

import { ShieldCheck } from 'lucide-react';

export function HeroPartnerBadge() {
  return (
    <div
      className="
        inline-flex items-center gap-1.5 whitespace-nowrap
        rounded-full border border-amber-300/40 bg-gradient-to-r from-amber-200/30 via-yellow-200/25 to-amber-300/30
        pl-2 pr-3 py-0.5 sm:pl-2.5 sm:pr-4 sm:py-0.5
        shadow-[inset_0_0_0_1px_rgba(251,191,36,.2)]
        backdrop-blur-md ring-1 ring-amber-300/40 hover:ring-amber-300/60
        transition
      "
      aria-label="Infinus - SAP Gold Partner"
    >
      {/* Your actual logo in original colors */}
      <img
        src="/infinus-logo-pack/infinus-logo-06.png"
        alt="Infinus"
        className="h-12 w-auto sm:h-14 shrink-0"
      />

      {/* Thin divider */}
      <span className="mx-0.5 h-4 w-px bg-amber-400/30 sm:mx-1" />

      {/* Small shield with checkmark icon + label */}
      <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden />
      <span className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.12em] text-amber-200">
        SAP Gold Partner
      </span>
    </div>
  );
}
