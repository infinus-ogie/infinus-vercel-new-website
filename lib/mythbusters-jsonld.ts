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
 * JSON-LD for the SAP MythBusting landing page, per locale.
 *
 * ── What is emitted, and one thing deliberately not ─────────────────────────────
 * WebPage + BreadcrumbList + Article, from the shared helper, plus two additions specific to
 * this page: an ItemList of the ten myths, and a DigitalDocument for the e-book itself.
 *
 * FAQPage is deliberately NOT emitted. The ten myths are statements, not questions, and
 * dressing them as Q&A to win a rich result is exactly the kind of mismatched markup that
 * earns a manual action. The helper only adds a FAQPage when it is given `faqs`, so it is
 * simply not given any.
 *
 * ── inLanguage on the e-book is 'en' on BOTH halves ─────────────────────────────
 * The page is bilingual; the PDF is not. The Serbian landing page says so on screen and must
 * say the same thing in its structured data — advertising a Serbian-language asset that does
 * not exist would be a straightforward inaccuracy.
 *
 * The page's own `inLanguage` still follows the locale, so the Serbian document is correctly
 * described as Serbian while the file it offers is described as English.
 *
 * Like the homepage's, this is injected client-side via next/script and so does not appear
 * in the server-rendered HTML — the separately logged SSR issue, carried across rather than
 * fixed here.
 */

/** The public asset. Same path the form links to; stated once, in each place it is needed. */
const EBOOK_PATH = '/downloads/SAP_Mythbusting_Campaign_E-Book_Infinus.pdf'

export function buildMythBustersJsonLd(locale: Locale): string {
  const content = getDictionary(locale).mythBusters

  const path = pairPath('insights-sap-mythbusters', locale)
  const pageUrl = absoluteUrl(path)
  const inLanguage = LOCALE_META[locale].jsonLdLanguage

  const base = generatePageJsonLd({
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
      headline: content.metadata.title,
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
    // No `faqs` — see the note above.
  })

  return JSON.stringify([
    ...base,
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: content.schema.mythListName,
      itemListElement: content.myths.items.map((myth, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: myth,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'DigitalDocument',
      name: content.schema.ebookName,
      description: content.metadata.description,
      url: pageUrl,
      encodingFormat: 'application/pdf',
      // The ASSET's language, not the page's. English-only on both halves of the pair.
      inLanguage: 'en',
      publisher: DEFAULT_PUBLISHER,
      isAccessibleForFree: true,
      associatedMedia: {
        '@type': 'MediaObject',
        contentUrl: `${SITE_CONFIG.url}${EBOOK_PATH}`,
        encodingFormat: 'application/pdf',
      },
    },
  ])
}
