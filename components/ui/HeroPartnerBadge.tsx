'use client';

export function HeroPartnerBadge() {
  return (
    <div
      className="
        inline-flex items-center justify-center
        rounded-full border border-white/20 bg-white/10
        px-1 py-1 sm:px-2 sm:py-1.5
        shadow-[inset_0_0_0_1px_rgba(255,255,255,.1)]
        backdrop-blur-md ring-1 ring-white/20 hover:ring-white/30
        transition
      "
      aria-label="Infinus"
    >
      {/* Infinus logo in original colors */}
      <img
        src="/infinus-logo-pack/infinus-logo-05.png"
        alt="Infinus"
        className="h-20 w-auto sm:h-24 shrink-0"
      />
    </div>
  );
}
