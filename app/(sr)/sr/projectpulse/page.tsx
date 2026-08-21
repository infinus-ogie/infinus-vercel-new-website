import type { Metadata } from "next";
import Script from "next/script";
import { ProjectPulsePage } from "@/components/pages/ProjectPulsePage";
import { getDictionary } from "@/content/dictionary";
import { buildProjectPulseJsonLd } from "@/lib/project-pulse-jsonld";
import { generatePageMetadata } from "@/lib/seo";
import { localeAlternatesMetadata } from "@/lib/seo-i18n";
import { LOCALE_META } from "@/lib/i18n";

/**
 * SERBIAN ProjectPulse — /sr/projectpulse.
 *
 * Inside the Serbian document root, so it emits <html lang="sr-Latn"> with no per-page
 * work. Statically prerendered; no middleware, no [locale] segment, no request-time
 * detection.
 *
 * The body and every section come from components/pages/ProjectPulsePage.tsx — the same
 * component /projectpulse renders. This file supplies only the Serbian dictionary, metadata
 * and JSON-LD input.
 *
 * The " | Infinus" suffix mirrors the English half exactly, so the two titles differ only in
 * language.
 *
 * The visible copy is a DRAFT pending owner approval; see content/sr/project-pulse.ts.
 */

const PATH = "/sr/projectpulse";
const content = getDictionary("sr").projectPulse;

const base = generatePageMetadata(
  content.page.title + " | Infinus",
  content.page.description,
  PATH
);

export const metadata: Metadata = {
  ...base,
  alternates: localeAlternatesMetadata(PATH),
  openGraph: {
    ...base.openGraph,
    locale: LOCALE_META.sr.ogLocale,
  },
};

const jsonLdData = buildProjectPulseJsonLd("sr");

export default function SerbianProjectPulsePage() {
  return (
    <>
      <Script
        id="projectpulse-page-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <ProjectPulsePage content={content} />
    </>
  );
}
