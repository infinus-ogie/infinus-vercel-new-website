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

export default function ProjectPulseVideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
