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

/**
 * `title.absolute` is deliberate. The dictionary value already ends in "| Infinus", and the
 * root layout's `%s | Infinus` template would append a second one, rendering
 * "ProjectPulse Video | Infinus | Infinus". `absolute` opts this route out of the template
 * so the title carries exactly the one suffix its content declares. The content string is
 * unchanged.
 */
export const metadata: Metadata = {
  // See the note above the export: `absolute` prevents a second brand suffix.
  title: { absolute: content.metadata.title },
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
