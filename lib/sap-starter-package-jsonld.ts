/**
 * JSON-LD config for the SAP Starter Package page, in either locale.
 *
 * English passes neither `language` nor `breadcrumbs`, so lib/auto-jsonld.ts fills in the
 * defaults it always did and the English schema is byte-unchanged. Serbian supplies the
 * sr-Latn-RS language token and a "Početna" breadcrumb — the same shape
 * lib/case-study-jsonld.ts settled on in Phase H2.
 */

import { getDictionary } from '@/content/dictionary'
import { createSimplePageConfig } from '@/lib/auto-jsonld'
import type { PageConfig } from '@/lib/page-config'
import { SITE_CONFIG } from '@/lib/jsonld'
import { LOCALE_META, type Locale } from '@/lib/i18n'

export function buildSapStarterPackageConfig(locale: Locale): PageConfig {
  const content = getDictionary(locale).sapStarterPackage
  const slug =
    locale === 'en'
      ? '/sap-packaged-solutions/sap-starter-package'
      : '/sr/sap-packaged-solutions/sap-starter-package'

  return createSimplePageConfig(slug, content.metadata.title, content.metadata.description, {
    language: locale === 'en' ? undefined : LOCALE_META[locale].jsonLdLanguage,
    articleAbout: [...content.schema.articleAbout],
    breadcrumbs:
      locale === 'en'
        ? undefined
        : [
            { name: content.schema.breadcrumbHome, url: SITE_CONFIG.url },
            { name: content.metadata.title, url: `${SITE_CONFIG.url}${slug}` },
          ],
  })
}
