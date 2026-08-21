import { createSimplePageConfig } from './auto-jsonld'
import type { PageConfig } from './page-config'
import { SITE_CONFIG } from './jsonld'
import { LOCALE_META, type Locale } from './i18n'
import { getDictionary, type CaseStudyKey } from '@/content/dictionary'

/**
 * A case-study page's JSON-LD input, per locale.
 *
 * English reproduces the pre-H2 call exactly — `createSimplePageConfig(slug, title,
 * clientOverview, { articleAbout })` with no `language` and no `breadcrumbs`, so
 * lib/auto-jsonld.ts fills in the same defaults it always did and the English schema is
 * byte-unchanged. Serbian adds its own inLanguage and a "Početna" breadcrumb.
 *
 * DELIBERATELY NOT FIXED: this schema is still injected client-side, so the harness still
 * reports zero server-rendered JSON-LD. That is the separately logged SSR issue.
 */
export function buildCaseStudyPageConfig(locale: Locale, key: CaseStudyKey): PageConfig {
  const dictionary = getDictionary(locale)
  const entry = dictionary.caseStudies.items[key]
  const slug = locale === 'en' ? `/case-study/${key}` : `/sr/case-study/${key}`

  return createSimplePageConfig(slug, entry.metadataTitle, entry.clientOverview, {
    language: locale === 'en' ? undefined : LOCALE_META[locale].jsonLdLanguage,
    articleAbout: [...entry.structuredAbout],
    breadcrumbs:
      locale === 'en'
        ? undefined
        : [
            { name: dictionary.common.breadcrumbHome, url: SITE_CONFIG.url },
            { name: entry.metadataTitle, url: `${SITE_CONFIG.url}${slug}` },
          ],
  })
}

/** Hero image per case study. Presentation, identical in both locales. */
export const CASE_STUDY_HERO_IMAGE: Record<CaseStudyKey, string> = {
  retail1: '/domain-expertise/retail.webp',
  pharma1: '/domain-expertise/pharmaceuticals.webp',
  pharma2: '/case-study/pharma2-hero.jpg',
  nearshoring1: '/case-study/nearshoring-hero.jpg',
  manufacturing1: '/domain-expertise/industrial-manufacturing.webp',
}
