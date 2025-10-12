'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import SplitType from 'split-type';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

type CTA = { text: string; href: string; primary?: boolean };

interface ProServicesHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  badge?: { label: string; text: string } | null;
  ctas?: CTA[];
  bgImage?: string;
}

export default function ProServicesHero({
  title = "Professional Services Growth",
  subtitle = "",
  description = "Accelerate your professional services business with SAP's comprehensive growth program. Access exclusive materials, insights, and expert guidance to scale your practice.",
  badge = { label: 'Program', text: 'GROW with SAP' },
  ctas = [
    { text: 'Preuzmite materijale', href: '#downloads', primary: true }
  ],
  bgImage = "/growth-materials/growth-overview-cover.png"
}: ProServicesHeroProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const hRef = useRef<HTMLHeadingElement | null>(null);
  const pRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    if (!hRef.current) return;
    const split = new SplitType(hRef.current, { types: 'lines' });
    gsap.set(split.lines, { yPercent: 20, opacity: 0, filter: 'blur(12px)' });
    if (badgeRef.current) gsap.set(badgeRef.current, { y: -8, opacity: 0 });
    if (pRef.current) gsap.set(pRef.current, { y: 8, opacity: 0 });
    if (ctaRef.current) gsap.set(ctaRef.current, { y: 8, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (badgeRef.current) tl.to(badgeRef.current, { y: 0, opacity: 1, duration: .45 }, 0);
    tl.to(split.lines, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: .8, stagger: .12 }, .05);
    if (pRef.current) tl.to(pRef.current, { y: 0, opacity: 1, duration: .45 }, '-=.45');
    if (ctaRef.current) tl.to(ctaRef.current, { y: 0, opacity: 1, duration: .45 }, '-=.3');

    return () => split.revert();
  }, { scope: rootRef });

  return (
    <section ref={rootRef} className="relative overflow-hidden h-[90vh] min-h-[700px]">
      {/* Background Image */}
      <Image
        src={bgImage}
        alt="Professional Services Growth Overview"
        fill
        priority
        className="object-cover object-[center_top] -z-10"
      />
      
      {/* Grain overlay */}
      <div className="absolute inset-0 beam grain -z-10" aria-hidden />

      {/* Global gradient overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      </div>

      {/* Local scrim behind text (left side) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          WebkitMaskImage: "radial-gradient(120% 90% at 22% 40%, #000 60%, transparent 72%)",
          maskImage: "radial-gradient(120% 90% at 22% 40%, #000 60%, transparent 72%)",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-24 pb-16 sm:pt-32">
        <div className="flex flex-col items-start gap-6">
          {badge && (
            <div ref={badgeRef} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-sm text-white">
              <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-white/80">{badge.label}</span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span className="text-xs tracking-tight text-white/85">{badge.text}</span>
            </div>
          )}
          <h1 ref={hRef} className="max-w-3xl text-left text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_1px_1px_rgba(0,0,0,.45)]">
            {title}
            {subtitle && (
              <>
                <br />
                {subtitle}
              </>
            )}
          </h1>
          <p ref={pRef} className="max-w-2xl text-left text-base sm:text-lg leading-relaxed text-white drop-shadow-[0_1px_1px_rgba(0,0,0,.35)]">
            {description}
          </p>
          <div ref={ctaRef} className="flex flex-wrap items-center gap-3 pt-1">
            {ctas && ctas.length > 0 ? ctas.map((b, i) => (
              <a 
                key={i} 
                href={b.href}
                data-vi={b.href.includes('.zip') ? 'zip' : undefined}
                data-vi-label={b.href.includes('.zip') ? (title.includes('Professional Services') ? 'Professional Services Materials – ZIP' : 'Grow Materials – ZIP') : undefined}
                data-vi-doc={b.href.includes('.zip') ? b.href.split('/').pop() || '' : undefined}
                className={`rounded-xl px-8 py-4 text-base font-medium transition focus:outline-none focus:ring-2 focus:ring-white/40
                  ${b.primary 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 border border-yellow-400 hover:from-yellow-500 hover:to-yellow-600 backdrop-blur shadow-lg font-semibold' 
                    : 'text-white border border-white/30 hover:bg-white/10 hover:border-white/50'
                  }`}
              >
                {b.text}
              </a>
            )) : (
              <a 
                href="/contact"
                className="rounded-xl px-6 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-white/40 bg-white text-slate-900 border border-white hover:bg-white/90 backdrop-blur shadow-lg"
              >
                Zakažite konsultacije
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
    </section>
  );
}