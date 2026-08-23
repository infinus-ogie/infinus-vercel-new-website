import type { Metadata } from "next"
import { CareersPage } from "@/components/pages/CareersPage"
import { getDictionary } from "@/content/dictionary"
import { buildCareersJsonLd } from "@/lib/careers-jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"
import { pairPath } from "@/lib/growth-routes"

/**
 * ENGLISH Careers page — /careers, the English half of the `careers` pair.
 *
 * The job-application form lived at /#join-team, a homepage section, until the client asked
 * for a page of its own. Its copy and its component moved unchanged; what is new is
 * everything a page needs and a section does not — a title, a description, a canonical, a
 * breadcrumb, reciprocal hreflang and a sitemap entry.
 *
 * Both halves of the pair went live in the same commit. A one-sided pair is what the
 * route map's `planned` status exists to keep out of hreflang and the switcher, and there
 * was no reason to create one here.
 *
 * The path comes from content/routes.ts rather than a literal, so the URL is written down
 * once.
 */

const PATH = pairPath("careers", "en")
const content = getDictionary("en").careers

export const metadata: Metadata = {
  ...generatePageMetadata(content.metadata.title, content.metadata.description, PATH),
  alternates: localeAlternatesMetadata(PATH),
}

export default function EnglishCareersPage() {
  return (
    <CareersPage
      content={content}
      trust={getDictionary("en").home.trust}
      jsonLd={buildCareersJsonLd("en")}
    />
  )
}
