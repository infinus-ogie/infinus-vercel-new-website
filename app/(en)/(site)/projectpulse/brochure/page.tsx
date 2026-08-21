import type { Metadata } from "next";
import { ProjectPulseBrochurePage } from "@/components/pages/ProjectPulseBrochurePage";
import { getDictionary } from "@/content/dictionary";
import { localeAlternatesMetadata } from "@/lib/seo-i18n";

/**
 * ENGLISH ProjectPulse brochure — the English half of the projectpulse-brochure pair.
 *
 * Phase H3 changed how this file is assembled, not what it renders. All 400 lines of markup
 * and inline copy moved to components/pages/ProjectPulseBrochurePage.tsx (shared with
 * /sr/projectpulse/brochure) and content/en/project-pulse-brochure.ts respectively, the
 * latter verbatim.
 *
 * The ONE intentional head change: `alternates` now carries reciprocal hreflang alongside
 * the canonical it already had. This page never used `generatePageMetadata`, so the metadata
 * object stays hand-written rather than being switched to the helper — that would have
 * changed the emitted OpenGraph and Twitter tags.
 */

const PATH = "/projectpulse/brochure";
const content = getDictionary("en").projectPulseBrochure;

export const metadata: Metadata = {
  title: content.metadata.title,
  description: content.metadata.description,
  alternates: localeAlternatesMetadata(PATH),
};

const ProjectPulseBrochureRoute = () => <ProjectPulseBrochurePage content={content} />;

export default ProjectPulseBrochureRoute;
