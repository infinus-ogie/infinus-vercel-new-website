// app/(site)/_components/SAPExpertiseSection.tsx
// SAP EXPERTISE - compact chips with icons, copy 1:1.

import Link from "next/link";
import { Cloud, Database, Sparkles, Boxes } from "lucide-react";

type Item = { label: string; href: string; Icon: React.ComponentType<any> };

// KEEP THESE LABELS EXACTLY (copy 1:1)
const items: Item[] = [
  { label: "SAP Cloud ERP (Private and Public)", href: "/services#cloud-erp", Icon: Cloud },
  { label: "SAP Business Data Cloud",            href: "/services#data-cloud", Icon: Database },
  { label: "SAP Business AI",                    href: "/services#business-ai", Icon: Sparkles },
  { label: "SAP Business Technology Platform",   href: "/services#btp", Icon: Boxes },
];

export default function SAPExpertiseSection() {
  return (
    <section id="sap-expertise" data-section="sap" className="section section--surface-1">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 md:py-24">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-wider text-slate-500 uppercase">Capabilities</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            SAP Expertise
          </h2>
          <p className="mt-3 text-slate-600">
            The platforms and services we work with every day.
          </p>
        </header>

        {/* Chips */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {items.map(({ label, href, Icon }) => (
            <Link
              key={label}
              href={href}
              className="chip group"
              aria-label={`${label}`}
            >
              <Icon className="h-4 w-4 text-primary-700" aria-hidden />
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

