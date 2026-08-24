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
 * ── The schema follows what each locale actually SHOWS ──────────────────────────
 * The two halves are different pages, so their structured data differs too. Both emit
 * WebPage + BreadcrumbList + Article from the shared helper, plus a DigitalDocument for the
 * e-book. What varies is the list:
 *
 *   EN  an ItemList of the ten myths it displays in full
 *   SR  an ItemList of the four myth/fact previews it displays, and a FAQPage
 *
 * FAQPage is emitted for SERBIAN ONLY, and only over its "Često postavljana pitanja"
 * section — five genuine question/answer pairs that are visible on the page. The myth/fact
 * previews are NOT marked up as FAQ on either half: they are statements, and dressing them
 * as Q&A to win a rich result is the kind of mismatched markup that earns a manual action.
 * The English page has no FAQ section at all, so it emits none.
 *
 * ── inLanguage on the e-book is 'en' on BOTH halves, by design ──────────────────
 * The page is bilingual; the ASSET is not. There is ONE canonical English PDF and both
 * landing pages link to it — an owner decision, not a gap waiting to be filled. No Serbian
 * PDF is missing or expected.
 *
 * So both halves describe an English document, because that is the document they serve.
 * Marking the Serbian one `sr` would advertise a translation that does not exist and is not
 * planned.
 *
 * The page's own `inLanguage` still follows the locale, so the Serbian document is correctly
 * described as Serbian while the file it offers is correctly described as English.
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

  const layout = content.layout

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
    // `faqs` is supplied ONLY where a real FAQ section is visible — Serbian. The helper
    // omits the FAQPage node entirely when the list is empty.
    faqs:
      layout.variant === 'sr-conversion'
        ? layout.faq.items.map((item) => ({ question: item.question, answer: item.answer }))
        : [],
  })

  // The list each locale actually displays: ten myth statements in English, four myth/fact
  // previews in Serbian. Emitting ten on the Serbian page would describe six items no
  // visitor can see there.
  const listItems =
    layout.variant === 'sr-conversion'
      ? layout.preview.items.map((item) => item.myth)
      : layout.myths.items

  return JSON.stringify([
    ...base,
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: content.schema.mythListName,
      itemListElement: listItems.map((myth, index) => ({
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
