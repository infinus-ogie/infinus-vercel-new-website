import Script from "next/script";
import { generatePageMetadata } from "@/lib/seo";
import { projectPulseConfig } from "./_config";
import { generateProjectPulseJsonLd } from "./_jsonld";
import { ProjectPulseContent } from "./_components/ProjectPulseContent";
import type { Metadata } from "next";

// SEO Metadata - automatically generated from config
export const metadata: Metadata = generatePageMetadata(
  projectPulseConfig.page.title + " | Infinus",
  projectPulseConfig.page.description,
  projectPulseConfig.page.slug
);

// Auto-generated JSON-LD schemas - updates automatically when config changes
const jsonLdData = generateProjectPulseJsonLd();

export default function ProjectPulsePage() {
  return (
    <>
      <Script
        id="projectpulse-page-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <ProjectPulseContent />
    </>
  );
}
