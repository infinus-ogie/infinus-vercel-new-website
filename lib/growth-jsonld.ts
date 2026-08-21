/**
 * JSON-LD for the four GROW / Professional Services pages, in either locale.
 *
 * Replaces app/(sr)/grow/_jsonld.ts and app/(sr)/professional-services/_jsonld.ts, which each
 * read a single Serbian config, plus the inline `jsonLdData` arrays in the two role pages.
 * Same schema objects, same order, same keys — only the strings and the language token come
 * from a dictionary now, so the Serbian output is unchanged.
 *
 * What differs per locale:
 *   · `inLanguage` — sr-Latn-RS for Serbian, en-US for English, per the project convention.
 *   · every URL, from the route map rather than from string manipulation.
 *   · names, descriptions, breadcrumb labels, FAQ questions and answers.
 *
 * What is identical in both: the Organization author block, the OG image, the `articleAbout`
 * topics (SAP product names, which are not translated) and every figure.
 */

import { getDictionary } from '@/content/dictionary'
import { createSimplePageConfig, generateAutoJsonLd } from '@/lib/auto-jsonld'
import { getPageUrl } from '@/lib/page-config'
import { LOCALE_META, type Locale } from '@/lib/i18n'
import { SITE_CONFIG } from '@/lib/jsonld'

/** The JSON-LD language token for a locale. English keeps the site default. */
const languageFor = (locale: Locale): string =>
  locale === 'en' ? SITE_CONFIG.language : LOCALE_META[locale].jsonLdLanguage

/** GROW landing page — the shape app/(sr)/grow/_jsonld.ts produced. */
export function buildGrowJsonLd(locale: Locale, slug: string): string {
  const g = getDictionary(locale).growth
  const copy = g.grow
  const faqs = [...g.shared.faqShared, copy.faqExtra]

  const config = createSimplePageConfig(slug, copy.metadata.title, copy.metadata.description, {
    language: languageFor(locale),
    faqs: faqs.map((f) => ({ question: f.question, answer: f.answer })),
    articleAbout: [...copy.schema.articleAbout],
    additionalSchemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: copy.schema.downloadsListName,
        description: copy.schema.downloadsListDescription,
        itemListElement: copy.downloads.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CreativeWork',
            name: copy.schema.schemaDownloadNames[index],
            url: item.url.startsWith('http') ? item.url : getPageUrl(item.url),
          },
        })),
      },
    ],
  })

  return JSON.stringify(generateAutoJsonLd(config))
}

/** Professional Services — the shape its own _jsonld.ts produced. */
export function buildProfessionalServicesJsonLd(locale: Locale, slug: string): string {
  const g = getDictionary(locale).growth
  const copy = g.professionalServices

  const config = createSimplePageConfig(slug, copy.metadata.title, copy.metadata.description, {
    language: languageFor(locale),
    faqs: copy.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    articleAbout: [...copy.schema.articleAbout],
    additionalSchemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: copy.schema.downloadsListName,
        description: copy.schema.downloadsListDescription,
        // `schemaDownloads`, NOT `downloads`: the Serbian half deliberately keeps historical
        // URLs that point at a directory which no longer exists, so its schema output cannot
        // drift. The English half carries the real paths. See content/sr/growth.ts.
        itemListElement: copy.schema.schemaDownloads.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CreativeWork',
            name: item.name,
            url: item.url.startsWith('http') ? item.url : getPageUrl(item.url),
          },
        })),
      },
    ],
  })

  return JSON.stringify(generateAutoJsonLd(config))
}

/**
 * A role page (CFO or CEO).
 *
 * Hand-built rather than routed through createSimplePageConfig, because the Serbian originals
 * were hand-built inline arrays with a deliberately minimal shape — four objects, no
 * @context on the first three, relative URLs. Reproduced exactly so the Serbian pages emit
 * what they emitted before; tidying it up would be a schema change dressed as a refactor.
 */
export function buildRoleJsonLd(
  locale: Locale,
  role: 'cfo' | 'ceo',
  slug: string,
  parentSlug: string
): string {
  const g = getDictionary(locale).growth
  const copy = g[role]
  const faqs = [...g.shared.faqShared, copy.faqExtra]
  const lang = languageFor(locale)
  const [homeLabel, growLabel, pageLabel] = copy.schema.breadcrumbs

  return JSON.stringify([
    {
      '@type': 'WebPage',
      name: copy.schema.pageName,
      inLanguage: lang,
      url: slug,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { name: homeLabel, url: '/' },
        { name: growLabel, url: parentSlug },
        { name: pageLabel, url: slug },
      ].map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    },
    {
      '@type': 'Article',
      headline: copy.schema.pageName,
      about: [...copy.schema.articleAbout],
      author: { '@type': 'Organization', name: 'Infinus', url: 'https://www.infinus.co/' },
      image: '/og-default.png',
      inLanguage: lang,
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ])
}
