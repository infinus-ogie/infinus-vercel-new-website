
'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import SplitType from 'split-type';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const SimpleShaderBG = dynamic(() => import('./simple-shader-bg'), { ssr: false });

type CTA = { text: string; href: string; primary?: boolean };

type HeroMode = 'shader' | 'image' | 'split';

interface HeroAdvancedProps {
  mode?: HeroMode;                       // default: 'shader'
  title: string;
  description: string;
  badge?: { label: string; text: string } | null;
  ctas?: CTA[];
  scrim?: "none" | "left" | "center";    // DODATO - kontrola scrim-a
  // Background as image (for 'image' or as fallback visual):
  bgImage?: { src: string; alt: string };
  // Side image (for 'split' mode):
  sideImage?: { src: string; alt: string };
}

export default function HeroAdvanced({
  mode = 'shader',
  title,
  description,
  badge = { label: 'Program', text: 'GROW with SAP' },
  ctas = [
    { text: 'Preuzmite materijale', href: '#downloads', primary: true },
    { text: 'Zakažite konsultacije', href: '/contact' }
  ],
  scrim = "left",
  bgImage,
  sideImage
}: HeroAdvancedProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const hRef = useRef<HTMLHeadingElement | null>(null);
  const pRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    if (!hRef.current) return;
    const split = new SplitType(hRef.current, { types: 'lines' });
    gsap.set(split.lines, { yPercent: 20, opacity: 0, filter: 'blur(12px)' });
    if (badgeRef.current) gsap.set(badgeRef.current, { y: -8, autoAlpha: 0 });
    if (pRef.current) gsap.set(pRef.current, { y: 8, autoAlpha: 0 });
    if (ctaRef.current) gsap.set(ctaRef.current, { y: 8, autoAlpha: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (badgeRef.current) tl.to(badgeRef.current, { y: 0, autoAlpha: 1, duration: .45 }, 0);
    tl.to(split.lines, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: .8, stagger: .12 }, .05);
    if (pRef.current) tl.to(pRef.current, { y: 0, autoAlpha: 1, duration: .45 }, '-=.45');
    if (ctaRef.current) tl.to(ctaRef.current, { y: 0, autoAlpha: 1, duration: .45 }, '-=.3');

    return () => split.revert();
  }, { scope: rootRef });

  const reduce = typeof window !== 'undefined' && 
    window.matchMedia && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section ref={rootRef} className={`relative overflow-hidden ${mode !== 'split' ? 'h-[88vh] min-h-[640px]' : ''}`}>
      {/* Background: shader or image */}
      {mode === 'shader' && !reduce && <SimpleShaderBG />}
      {mode !== 'shader' && bgImage && (
        <Image
          src={bgImage.src}
          alt={bgImage.alt}
          fill
          priority
          className="object-cover object-center -z-10"
        />
      )}
      <div className={`absolute inset-0 beam grain -z-10`} aria-hidden />

      {/* globalni lagani fade ka dnu */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      </div>

      {/* lokalni scrim iza teksta (levo) */}
      {scrim !== "none" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            // radial mask fokusirana na levu trećinu (gde stoji kopija)
            WebkitMaskImage:
              scrim === "left"
                ? "radial-gradient(120% 90% at 22% 40%, #000 60%, transparent 72%)"
                : "radial-gradient(110% 70% at 50% 45%, #000 58%, transparent 75%)",
            maskImage:
              scrim === "left"
                ? "radial-gradient(120% 90% at 22% 40%, #000 60%, transparent 72%)"
                : "radial-gradient(110% 70% at 50% 45%, #000 58%, transparent 75%)",
          }}
        >
          <div className="absolute inset-0 bg-black/55" />
        </div>
      )}

      <div className={`relative z-10 mx-auto max-w-7xl px-6 lg:px-8 ${mode === 'split' ? 'py-28' : 'pt-36 pb-24 sm:pt-44'}`}>
        {mode === 'split' ? (
          <div className="grid items-center gap-10 md:grid-cols-2">
            <HeroCopy
              titleRef={hRef} 
              paraRef={pRef} 
              ctaRef={ctaRef} 
              badgeRef={badgeRef}
              title={title} 
              description={description} 
              badge={badge} 
              ctas={ctas}
            />
            {sideImage && (
              <div className="relative aspect-[4/3] md:aspect-[5/4] rounded-3xl overflow-hidden border border-slate-200">
                <Image src={sideImage.src} alt={sideImage.alt} fill className="object-cover" />
              </div>
            )}
          </div>
        ) : (
          <HeroCopy
            titleRef={hRef} 
            paraRef={pRef} 
            ctaRef={ctaRef} 
            badgeRef={badgeRef}
            title={title} 
            description={description} 
            badge={badge} 
            ctas={ctas}
          />
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
    </section>
  );
}

function HeroCopy({
  titleRef, 
  paraRef, 
  ctaRef, 
  badgeRef,
  title, 
  description, 
  badge, 
  ctas
}: {
  titleRef: React.RefObject<HTMLHeadingElement>;
  paraRef: React.RefObject<HTMLParagraphElement>;
  ctaRef: React.RefObject<HTMLDivElement>;
  badgeRef: React.RefObject<HTMLDivElement>;
  title: string; 
  description: string;
  badge: { label: string; text: string } | null;
  ctas: CTA[];
}) {
  return (
    <div className="flex flex-col items-start gap-6">
      {badge && (
        <div ref={badgeRef} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-sm text-white">
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-white/80">{badge.label}</span>
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <span className="text-xs tracking-tight text-white/85">{badge.text}</span>
        </div>
      )}
      <h1 ref={titleRef} className="max-w-3xl text-left text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_1px_1px_rgba(0,0,0,.45)]">
        {title}
      </h1>
      <p ref={paraRef} className="max-w-2xl text-left text-base sm:text-lg leading-relaxed text-white drop-shadow-[0_1px_1px_rgba(0,0,0,.35)]">
        {description}
      </p>
      <div ref={ctaRef} className="flex flex-wrap items-center gap-3 pt-1">
        {ctas.map((b, i) => (
          <a 
            key={i} 
            href={b.href}
            className={`rounded-xl px-5 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-white/40
              ${b.primary 
                ? 'bg-white/15 text-white border border-white/20 hover:bg-white/25 backdrop-blur' 
                : 'text-white/85 border border-white/20 hover:bg-white/10'
              }`}
          >
            {b.text}
          </a>
        ))}
      </div>
    </div>
  );
}
