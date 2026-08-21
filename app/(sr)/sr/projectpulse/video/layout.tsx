import { Metadata } from "next";
import { getDictionary } from "@/content/dictionary";
import { localeAlternatesMetadata } from "@/lib/seo-i18n";

/**
 * Metadata carrier for the Serbian video overlay — the mirror of the English sibling.
 *
 * Like the English half this emits title, description and alternates only, with no
 * OpenGraph block, so there is no og:locale to override. Symmetry with the English half is
 * deliberate.
 */

const PATH = "/sr/projectpulse/video";
const content = getDictionary("sr").projectPulseVideo;

export const metadata: Metadata = {
  title: content.metadata.title,
  description: content.metadata.description,
  alternates: localeAlternatesMetadata(PATH),
};

export default function SerbianProjectPulseVideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
