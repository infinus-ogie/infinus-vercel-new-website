import Script from "next/script";
import { ProjectPulsePage } from "@/components/pages/ProjectPulsePage";
import { getDictionary } from "@/content/dictionary";
import { buildProjectPulseJsonLd } from "@/lib/project-pulse-jsonld";
import { generatePageMetadata } from "@/lib/seo";
import { localeAlternatesMetadata } from "@/lib/seo-i18n";

/**
 * ENGLISH ProjectPulse — the English half of the projectpulse locale pair.
 *
 * Phase H3 changed how this file is assembled, not what it renders. The body moved to
 * components/pages/ProjectPulsePage.tsx (shared with /sr/projectpulse), the copy moved from
 * the sibling _config.ts to content/en/project-pulse.ts verbatim, and the seven JSON-LD
 * objects moved from the sibling _jsonld.ts to lib/project-pulse-jsonld.ts with their
 * shape, order and English values unchanged.
 *
 * The ONE intentional head change: `alternates` now carries real reciprocal hreflang,
 * because /sr/projectpulse went live in this phase.
 *
 * The " | Infinus" appended below is pre-existing, and so is the fact that
 * `content.page.title` already ends in a suffix of its own.
 */

const PATH = "/projectpulse";
const content = getDictionary("en").projectPulse;

export const metadata = {
  ...generatePageMetadata(content.page.title + " | Infinus", content.page.description, PATH),
  alternates: localeAlternatesMetadata(PATH),
};

const jsonLdData = buildProjectPulseJsonLd("en");

export default function EnglishProjectPulsePage() {
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
