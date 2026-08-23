import {
  DEFAULT_AUTHOR,
  DEFAULT_PUBLISHER,
  SITE_CONFIG,
  generatePageJsonLd,
  getCurrentDate,
} from './jsonld'
import { LOCALE_META, type Locale } from './i18n'
import { absoluteUrl } from './i18n'
import { getDictionary } from '@/content/dictionary'
import { pairPath } from './growth-routes'

/**
 * The Careers page's JSON-LD, per locale.
 *
 * Modelled directly on lib/home-jsonld.ts — same helper, same four schema types, same
 * order — because these two pages now split a schema that used to belong to one.
 *
 * ── The FAQ entries are the point of this file ──────────────────────────────────
 * "How do I apply?" and "What happens after I submit?" were the last two entries of the
 * HOMEPAGE's `structuredFaq`. They describe a form that is no longer on the homepage, so
 * leaving them there would have advertised an application process to crawlers on a page
 * that cannot start one. They move here, where the form actually is, and the homepage's
 * tuple shrinks from four entries to two.
 *
 * ── Why the URL is not hardcoded ────────────────────────────────────────────────
 * `pairPath` reads content/routes.ts, so this page's own URL is stated in exactly one
 * place. A literal here would be a second copy of a URL that the route map already owns,
 * and the two could drift.
 *
 * Like the homepage's, this schema is injected client-side via next/script, so it does not
 * appear in the server-rendered HTML. That is the separately logged SSR issue, carried
 * across deliberately rather than fixed in a routing change.
 */
export function buildCareersJsonLd(locale: Locale): string {
  const content = getDictionary(locale).careers
  const common = getDictionary(locale).common

  const path = pairPath('careers', locale)
  const pageUrl = absoluteUrl(path)
  const inLanguage = LOCALE_META[locale].jsonLdLanguage

  const jsonLd = generatePageJsonLd({
    pageData: {
      name: content.metadata.title,
      url: pageUrl,
      inLanguage,
      description: content.structuredDescription,
    },
    breadcrumbs: [
      { name: common.breadcrumbHome, url: locale === 'en' ? '/' : '/sr' },
      { name: content.heading, url: path },
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
    faqs: content.faq.map((entry) => ({ question: entry.title, answer: entry.body })),
  })

  return JSON.stringify(jsonLd)
}
