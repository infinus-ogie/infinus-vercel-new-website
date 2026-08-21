import type { Metadata } from "next"
import { CaseStudyPage } from "@/components/pages/CaseStudyPage"
import { getDictionary } from "@/content/dictionary"
import { buildCaseStudyPageConfig, CASE_STUDY_HERO_IMAGE } from "@/lib/case-study-jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"
import { LOCALE_META } from "@/lib/i18n"

/**
 * SERBIAN case study — /sr/case-study/nearshoring1.
 *
 * Inside the Serbian document root, so it emits <html lang="sr-Latn"> with no per-page
 * work. Statically prerendered; no middleware, no [locale] segment, no request-time
 * detection.
 *
 * The body, every section and the conditional-section logic come from
 * components/pages/CaseStudyPage.tsx — the same component the English page renders. This
 * file supplies only the Serbian dictionary, metadata and JSON-LD input.
 *
 * The visible copy is a DRAFT pending owner approval; see content/sr/case-studies.ts.
 */

const KEY = "nearshoring1" as const
const PATH = "/sr/case-study/nearshoring1"
const dictionary = getDictionary("sr").caseStudies
const entry = dictionary.items[KEY]

const base = generatePageMetadata(entry.metadataTitle, entry.clientOverview, PATH)

export const metadata: Metadata = {
  ...base,
  alternates: localeAlternatesMetadata(PATH),
  openGraph: {
    ...base.openGraph,
    locale: LOCALE_META.sr.ogLocale,
  },
}

export default function SerbianCaseStudyPage() {
  return (
    <CaseStudyPage
      entry={entry}
      labels={dictionary.labels}
      contactHref={dictionary.contactHref}
      heroImage={CASE_STUDY_HERO_IMAGE[KEY]}
      jsonLd={buildCaseStudyPageConfig("sr", KEY)}
    />
  )
}
