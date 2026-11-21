import {
  DEFAULT_AUTHOR,
  DEFAULT_PUBLISHER,
  SITE_CONFIG,
  generatePageJsonLd,
  getCurrentDate,
} from './jsonld'
import { LOCALE_META, absoluteUrl, type Locale } from './i18n'
import { getDictionary } from '@/content/dictionary'
import { pairPath } from './growth-routes'

/**
 * JSON-LD for the SAP vs Microsoft Insights article, per locale.
 *
 * WebPage + BreadcrumbList + Article from the shared helper, the same base the MythBusting
 * page emits. Nothing else: the page has no FAQ, and its bullet lists are capability
 * descriptions rather than a list a rich result should be built from.
 *
 * Like MythBusting's, this is injected client-side via next/script, so it does not appear in
 * the server-rendered HTML. That is the separately logged SSR issue, carried across rather
 * than fixed here.
 */
export function buildSapVsMicrosoftJsonLd(locale: Locale): string {
  const content = getDictionary(locale).sapVsMicrosoft

  const path = pairPath('insights-sap-vs-microsoft', locale)
  const pageUrl = absoluteUrl(path)
  const inLanguage = LOCALE_META[locale].jsonLdLanguage

  return JSON.stringify(
    generatePageJsonLd({
      pageData: {
        name: content.metadata.title,
        url: pageUrl,
        inLanguage,
        description: content.metadata.description,
      },
      breadcrumbs: [
        { name: content.schema.breadcrumbHome, url: locale === 'en' ? '/' : '/sr' },
        { name: content.schema.breadcrumbPage, url: path },
      ],
      articleData: {
        headline: content.title,
        description: content.metadata.description,
        image: SITE_CONFIG.defaultImage,
        authorName: DEFAULT_AUTHOR.name,
        authorUrl: DEFAULT_AUTHOR.url,
        datePublished: getCurrentDate(),
        dateModified: getCurrentDate(),
        inLanguage,
        mainEntityOfPage: pageUrl,
        publisher: DEFAULT_PUBLISHER,
      },
    })
  )
}
