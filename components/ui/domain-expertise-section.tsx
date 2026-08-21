// components/ui/domain-expertise-section.tsx
// DOMAIN EXPERTISE - uniform 4:3 tiles with image overlay labels.
// KEEP YOUR EXACT COPY: replace labels below 1:1. Swap image paths to your assets.

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";
import { getDictionary } from "@/content/dictionary";
import type { HomeDictionary } from "@/content/dictionary";

type Domain = {
  label: string;
  href?: string;
  imgSrc: string;
  imgAlt: string;
  /** Appended to the label for the tile's accessible name. Locale-specific. */
  ariaSuffix: string;
};

type TileProps = Domain & {
  onClick?: () => void;
};

/**
 * Image paths only. Labels and alt text moved to content/{en,sr}/home.ts in Phase H1 and are
 * paired with these by position — the 9-tuple in HomeDictionary keeps the two lists in step.
 */
const domainImages: readonly string[] = [
  "/domain-expertise/retail.webp",
  "/domain-expertise/pharmaceuticals.webp",
  "/domain-expertise/wholesale.jpeg",
  "/domain-expertise/consumer-goods.webp",
  "/domain-expertise/industrial-manufacturing.webp",
  "/domain-expertise/professional-services.webp",
  "/domain-expertise/travel.webp",
  "/domain-expertise/oil-and-gas.webp",
  "/domain-expertise/telco.webp",
];

/**
 * Phase H1: copy moved to content/{en,sr}/home.ts. `copy` defaults to the ENGLISH
 * dictionary, so existing callers render byte-identical output. The anchor every tile links
 * to is derived from the section's own page so the Serbian tiles stay on /sr.
 */
export default function DomainExpertiseSection({
  copy = getDictionary("en").home.domains,
  sectionHref = "/#domain-expertise",
}: {
  copy?: HomeDictionary["domains"];
  sectionHref?: string;
}) {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const handleDomainClick = (label: string) => {
    setSelectedDomain(label);
  };

  const closeModal = () => {
    setSelectedDomain(null);
  };

  return (
    <section id="domain-expertise" data-section="domain" className="section section--surface-0" aria-labelledby="domains-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{copy.eyebrow}</p>
          <h2 id="domains-title" className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            {copy.heading}
          </h2>
          <p className="mt-3 text-slate-600">
            {copy.lede}
          </p>
        </header>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {copy.items.map((item, index) => (
            <li key={item.label}>
              <Tile
                label={item.label}
                href={sectionHref}
                imgSrc={domainImages[index]}
                imgAlt={item.imageAlt}
                ariaSuffix={copy.modal.tileAriaSuffix}
                onClick={() => handleDomainClick(item.label)}
              />
            </li>
          ))}
        </ul>

        {/* Modal */}
        {selectedDomain && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
                aria-label={copy.modal.closeAria}
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {copy.modal.titlePrefix}{selectedDomain}{copy.modal.titleSuffix}
                </h3>
                <p className="text-slate-600 mb-6">
                  {copy.modal.bodyBefore}{selectedDomain.toLowerCase()}{copy.modal.bodyAfter}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    {copy.modal.close}
                  </button>
                  <Link
                    href={copy.contactHref}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={closeModal}
                  >
                    {copy.modal.contact}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Tile({ label, href, imgSrc, imgAlt, ariaSuffix, onClick }: TileProps) {
  const content = (
    <figure className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card transition hover:shadow-cardHover cursor-pointer">
      {/* Image */}
      <Image
        src={imgSrc}
        alt={imgAlt}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        priority={false}
      />
      {/* Global scrim overlay */}
      <div className="absolute inset-0 bg-black/15 transition-colors duration-300 group-hover:bg-black/25" />
      {/* White pill badge */}
      <figcaption className="pointer-events-none absolute bottom-3 left-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 text-slate-900 px-4 py-1.5 text-sm font-medium shadow-sm ring-1 ring-black/5 backdrop-blur-[2px]">
          {label}
        </span>
      </figcaption>
    </figure>
  );

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return href ? (
    <Link
      href={href}
      aria-label={`${label}${ariaSuffix}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 rounded-xl"
      onClick={handleClick}
    >
      {content}
    </Link>
  ) : (
    <div
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2 rounded-xl"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`${label}${ariaSuffix}`}
    >
      {content}
    </div>
  );
}
