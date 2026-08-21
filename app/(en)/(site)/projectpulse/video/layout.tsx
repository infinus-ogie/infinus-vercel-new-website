import { Metadata } from "next";
import { getDictionary } from "@/content/dictionary";
import { localeAlternatesMetadata } from "@/lib/seo-i18n";

/**
 * Metadata carrier for the English video overlay.
 *
 * The page is a client component and so cannot export `metadata`; this layout does it
 * instead. The only Phase H3 change is that `alternates` now carries reciprocal hreflang
 * next to the canonical it already had, because /sr/projectpulse/video went live.
 */

const PATH = "/projectpulse/video";
const content = getDictionary("en").projectPulseVideo;

export const metadata: Metadata = {
  title: content.metadata.title,
  description: content.metadata.description,
  alternates: localeAlternatesMetadata(PATH),
};

export default function ProjectPulseVideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
