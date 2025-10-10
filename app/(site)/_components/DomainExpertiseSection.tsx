// app/(site)/_components/DomainExpertiseSection.tsx
// DOMAIN EXPERTISE - uniform 4:3 tiles with image overlay labels.
// KEEP YOUR EXACT COPY: replace labels below 1:1. Swap image paths to your assets.

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";

type Domain = {
  label: string;      // e.g., "Retail"
  href?: string;      // optional deep link or anchor (e.g., "/services#retail")
  imgSrc: string;     // /public path
  imgAlt: string;     // accessible alt
};

type TileProps = Domain & {
  onClick?: () => void;
};

const domains: Domain[] = [
  { label: "Retail",                     href: "/services#retail",         imgSrc: "/domain-expertise/retail.webp",          imgAlt: "Retail industry" },
  { label: "Pharmaceuticals",           href: "/services#pharma",         imgSrc: "/domain-expertise/pharmaceuticals.webp",          imgAlt: "Pharmaceuticals industry" },
  { label: "Wholesale and Distribution", href: "/services#wholesale",      imgSrc: "/domain-expertise/wholesale.jpeg",       imgAlt: "Wholesale and Distribution" },
  { label: "Consumer Goods",            href: "/services#consumer-goods",  imgSrc: "/domain-expertise/consumer-goods.webp",        imgAlt: "Consumer goods" },
  { label: "Industrial Manufacturing",  href: "/services#manufacturing",   imgSrc: "/domain-expertise/industrial-manufacturing.webp",   imgAlt: "Industrial manufacturing" },
  { label: "Professional Services",     href: "/services#professional",    imgSrc: "/domain-expertise/professional-services.webp",   imgAlt: "Professional services" },
  { label: "Travel",                    href: "/services#travel",          imgSrc: "/domain-expertise/travel.webp",          imgAlt: "Travel industry" },
  { label: "Oil & Gas",                 href: "/services#oilgas",          imgSrc: "/domain-expertise/oil-and-gas.webp",          imgAlt: "Oil and gas sector" },
  { label: "Telco",                     href: "/services#telco",           imgSrc: "/domain-expertise/telco.webp",           imgAlt: "Telecommunications" },
];

export default function DomainExpertiseSection() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const handleDomainClick = (label: string) => {
    setSelectedDomain(label);
  };

  const closeModal = () => {
    setSelectedDomain(null);
  };

  return (
    <section id="domain-expertise" data-section="domain" className="section section--surface-0" aria-labelledby="domains-title">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 md:py-24">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium tracking-wider text-slate-500 uppercase">Industries</p>
          <h2 id="domains-title" className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Domain Expertise
          </h2>
          <p className="mt-3 text-slate-600">
            Industry-specific SAP solutions delivered with deep process knowledge.
          </p>
        </header>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {domains.map(({ label, href, imgSrc, imgAlt }) => (
            <li key={label}>
              <Tile 
                label={label} 
                href={href} 
                imgSrc={imgSrc} 
                imgAlt={imgAlt} 
                onClick={() => handleDomainClick(label)}
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
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {selectedDomain} Expertise
                </h3>
                <p className="text-slate-600 mb-6">
                  Detailed information about our {selectedDomain.toLowerCase()} expertise and SAP solutions is coming soon. 
                  We're working on comprehensive content to help you understand how we can support your industry-specific needs.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    href="/contact"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={closeModal}
                  >
                    Contact Us
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

function Tile({ label, href, imgSrc, imgAlt, onClick }: TileProps) {
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
      aria-label={`${label} domain`}
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
      aria-label={`${label} domain`}
    >
      {content}
    </div>
  );
}
