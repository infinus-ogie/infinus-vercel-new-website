// app/(site)/_components/AboutSection.tsx
// ABOUT US - two-column, enterprise styling.
// Uses the shared tokens/classes we set earlier (card, Section wrapper, etc).
// KEEP YOUR EXACT COPY: replace the strings inside `defaultCopy` with your text 1:1.

// If you use lucide-react + shadcn/ui:
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Copy = {
  title: string;
  intro: string;
  paragraphs: string[];
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
};

// Replace these with your exact About copy (1:1). Strings are placeholders.
const defaultCopy: Copy = {
  title: "About Us.",
  intro:
    "Infinus is a SAP Gold Partner focused on SAP solutions and business transformation.",
  paragraphs: [
    // TODO: paste your exact text here (keep paragraph boundaries clean)
    "Our experienced SAP consultants bring high-quality expertise across processes, technologies, and best practices to deliver reliable outcomes.",
    "We support organizations with proven methodologies and a modern approach to SAP Cloud and platform services.",
  ],
  bullets: [
    // TODO: keep this list equal to your real bullet list (order matters)
    "SAP Cloud ERP (Private and Public)",
    "SAP Business Data Cloud",
    "SAP Business AI",
    "SAP Business Technology Platform",
  ],
  ctaLabel: "Learn more",
  ctaHref: "/about",
};

export default function AboutSection({ copy = defaultCopy }: { copy?: Copy }) {
  return (
    <section id="about" data-section="about" className="section section--surface-0">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 md:py-24">
        <div className="grid items-start gap-10 md:grid-cols-12">
          {/* LEFT - SAP badge / visual */}
          <figure className="md:col-span-5">
            <div className="card p-4 sm:p-6 rounded-2xl">
              <Image
                src="/sap-gold-partner-logo-about-us.webp" // swap to your asset path
                alt="SAP Gold Partner"
                width={640}
                height={480}
                className="mx-auto h-auto w-full max-w-sm object-contain"
                priority={false}
              />
            </div>
          </figure>

          {/* RIGHT - text + bullets + CTA (copy 1:1) */}
          <div className="md:col-span-7">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              {copy.title}
            </h2>

            <p className="mt-4 max-w-[65ch] text-slate-700 leading-relaxed">
              {copy.intro}
            </p>

            {copy.paragraphs.map((p, i) => (
              <p key={i} className="mt-4 max-w-[65ch] text-slate-600 leading-relaxed">
                {p}
              </p>
            ))}

            <ul className="mt-6 space-y-3">
              {copy.bullets.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-primary-700" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button asChild className="btn-primary h-11 px-5 rounded-xl inline-flex items-center gap-2">
                <Link href={copy.ctaHref}>
                  {copy.ctaLabel} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}