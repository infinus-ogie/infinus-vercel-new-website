import { createSimplePageConfig } from './auto-jsonld'
import type { PageConfig } from './page-config'
import { SITE_CONFIG } from './jsonld'
import { LOCALE_META, type Locale } from './i18n'
import { getDictionary } from '@/content/dictionary'

/**
 * The FAQ page's JSON-LD input, per locale.
 *
 * Built from the SAME dictionary array the accordion renders, so the questions advertised to
 * crawlers are by construction the questions on the page — in whichever language.
 *
 * ── English output is byte-identical ────────────────────────────────────────────
 * The pre-H1 page called `createSimplePageConfig("/faq", title, description, { faqs,
 * articleAbout })` and passed NO `language` and NO `breadcrumbs`, so lib/auto-jsonld.ts
 * filled in `SITE_CONFIG.language` and `getDefaultBreadcrumbs(...)`. For English this
 * reproduces both of those defaults explicitly and identically; only the Serbian call
 * differs, with its own language and a "Početna" breadcrumb.
 */
export function buildFaqPageConfig(locale: Locale): PageConfig {
  const content = getDictionary(locale).faq
  const common = getDictionary(locale).common
  const slug = locale === 'en' ? '/faq' : '/sr/faq'

  return createSimplePageConfig(slug, content.metadata.title, content.metadata.description, {
    // Identical to the implicit default for English ("en-US"); the real Serbian value for sr.
    language: locale === 'en' ? SITE_CONFIG.language : LOCALE_META[locale].jsonLdLanguage,
    faqs: content.items.map((item) => ({ question: item.question, answer: item.answer })),
    articleAbout: [...content.structuredAbout],
    // English deliberately passes NOTHING here, so lib/auto-jsonld.ts fills in exactly the
    // default it always did and the English schema is untouched by construction. Serbian
    // supplies the same structure with a localised first label.
    breadcrumbs:
      locale === 'en'
        ? undefined
        : [
            { name: common.breadcrumbHome, url: SITE_CONFIG.url },
            { name: content.metadata.title, url: `${SITE_CONFIG.url}${slug}` },
          ],
  })
}
