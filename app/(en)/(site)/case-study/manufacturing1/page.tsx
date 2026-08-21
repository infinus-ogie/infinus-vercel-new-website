import { CaseStudyPage } from "@/components/pages/CaseStudyPage"
import { getDictionary } from "@/content/dictionary"
import { buildCaseStudyPageConfig, CASE_STUDY_HERO_IMAGE } from "@/lib/case-study-jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"

/**
 * ENGLISH case study — the English half of the manufacturing1 locale pair.
 *
 * Phase H2 changed how this file is assembled, not what it renders. The body moved to
 * components/pages/CaseStudyPage.tsx, shared with all nine other case-study routes, and the
 * copy moved to content/en/case-studies.ts verbatim.
 *
 * The ONE intentional head change: `alternates` now carries real reciprocal hreflang,
 * because /sr/case-study/manufacturing1 went live in this phase.
 */

const KEY = "manufacturing1" as const
const PATH = "/case-study/manufacturing1"
const dictionary = getDictionary("en").caseStudies
const entry = dictionary.items[KEY]

export const metadata = {
  ...generatePageMetadata(entry.metadataTitle, entry.clientOverview, PATH),
  alternates: localeAlternatesMetadata(PATH),
}

export default function EnglishCaseStudyPage() {
  return (
    <CaseStudyPage
      entry={entry}
      labels={dictionary.labels}
      contactHref={dictionary.contactHref}
      heroImage={CASE_STUDY_HERO_IMAGE[KEY]}
      jsonLd={buildCaseStudyPageConfig("en", KEY)}
    />
  )
}
