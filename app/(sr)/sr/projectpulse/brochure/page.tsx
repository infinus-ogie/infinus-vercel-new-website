import type { Metadata } from "next";
import { ProjectPulseBrochurePage } from "@/components/pages/ProjectPulseBrochurePage";
import { getDictionary } from "@/content/dictionary";
import { localeAlternatesMetadata } from "@/lib/seo-i18n";

/**
 * SERBIAN ProjectPulse brochure — /sr/projectpulse/brochure.
 *
 * The body comes from components/pages/ProjectPulseBrochurePage.tsx — the same component
 * /projectpulse/brochure renders.
 *
 * The metadata is hand-written to MIRROR the English half, which never used
 * `generatePageMetadata` either. That means neither half emits OpenGraph or Twitter tags on
 * this route, so there is no og:locale to override here. Matching the English half is the
 * point: the two documents differ in language and in nothing else. Adding social tags to
 * this page alone would make the pair asymmetric; adding them to both is a change to an
 * approved English page and belongs in its own phase.
 *
 * The visible copy is a DRAFT pending owner approval; see content/sr/project-pulse-brochure.ts.
 */

const PATH = "/sr/projectpulse/brochure";
const content = getDictionary("sr").projectPulseBrochure;

export const metadata: Metadata = {
  title: content.metadata.title,
  description: content.metadata.description,
  alternates: localeAlternatesMetadata(PATH),
};

const SerbianProjectPulseBrochureRoute = () => <ProjectPulseBrochurePage content={content} />;

export default SerbianProjectPulseBrochureRoute;
