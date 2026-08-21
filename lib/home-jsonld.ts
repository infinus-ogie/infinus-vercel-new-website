import {
  DEFAULT_AUTHOR,
  DEFAULT_PUBLISHER,
  SITE_CONFIG,
  generatePageJsonLd,
  getCurrentDate,
} from './jsonld'
import { LOCALE_META, type Locale } from './i18n'
import { getDictionary } from '@/content/dictionary'

/**
 * The homepage's JSON-LD, per locale.
 *
 * ── Why this exists ─────────────────────────────────────────────────────────────
 * Before Phase H1 this block was inline in app/(en)/(site)/page.tsx with `SITE_CONFIG.url`
 * and `SITE_CONFIG.language` hardcoded. `/sr` needs the same schema with its own URL,
 * language, breadcrumb label and Serbian Q&A — so the construction moved here and takes the
 * locale as input. Nothing about the SCHEMA changed: same types, same fields, same order.
 *
 * ── English output is byte-identical ────────────────────────────────────────────
 * Two details make that true and are easy to get wrong:
 *
 *   · the page URL is `SITE_CONFIG.url` — "https://www.infinus.co" with NO trailing slash.
 *     `absoluteUrl("/")` would produce a trailing slash and change every English @id.
 *   · `inLanguage` is `SITE_CONFIG.language` ("en-US") for English, which is exactly
 *     `LOCALE_META.en.jsonLdLanguage`. The Serbian value is the existing "sr-Latn-RS" the
 *     campaign pages already use.
 *
 * DELIBERATELY NOT FIXED HERE: this schema is still injected client-side via next/script,
 * so `npm run seo:assert-build` still reports zero server-rendered JSON-LD. That is the
 * separately logged SSR issue and is out of scope.
 */
export function buildHomeJsonLd(locale: Locale): string {
  const content = getDictionary(locale).home
  const common = getDictionary(locale).common

  // No trailing slash for English, matching the pre-H1 output exactly.
  const pageUrl = locale === 'en' ? SITE_CONFIG.url : `${SITE_CONFIG.url}/sr`
  const inLanguage = LOCALE_META[locale].jsonLdLanguage

  const jsonLd = generatePageJsonLd({
    pageData: {
      name: content.metadata.title,
      url: pageUrl,
      inLanguage,
      description: content.structuredDescription,
    },
    // The pre-H1 page called getBreadcrumbs("/"), which returns exactly this one entry.
    // Localising the label is the minimum breadcrumb plumbing Phase F flagged; the English
    // value is still "Home", so English output is unchanged.
    breadcrumbs: [{ name: common.breadcrumbHome, url: locale === 'en' ? '/' : '/sr' }],
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
    faqs: content.structuredFaq.map((entry) => ({ question: entry.title, answer: entry.body })),
  })

  return JSON.stringify(jsonLd)
}
