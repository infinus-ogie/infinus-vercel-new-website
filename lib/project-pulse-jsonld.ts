/**
 * JSON-LD for the ProjectPulse page, in either locale.
 *
 * Replaces app/(en)/(site)/projectpulse/_jsonld.ts, which read a single English config
 * directly. The seven schema objects, their order, their keys and their key ORDER are
 * unchanged — only the strings come from a dictionary now, so `buildProjectPulseJsonLd('en')`
 * emits byte-for-byte what the old function emitted.
 *
 * What differs for Serbian:
 *   · `inLanguage` on the WebPage and the Article becomes sr-Latn-RS, matching the
 *     convention the rest of the site's Serbian pages already use.
 *   · every URL points at /sr/projectpulse, from `content.page.url`.
 *   · the breadcrumb, the HowTo name, the industries ItemList and the Article `about` topics
 *     are Serbian.
 *
 * What is deliberately identical in both locales: the Organization block (legal address and
 * contact email), the offers, the application categories and `softwareVersion`. Those are
 * facts about the company and the product, not copy.
 *
 * `getCurrentDate()` is a build-time value, so `datePublished`/`dateModified` move with every
 * deploy. Pre-existing behaviour, carried across rather than fixed here.
 */

import { getDictionary } from '@/content/dictionary'
import { getCurrentDate, DEFAULT_AUTHOR, DEFAULT_PUBLISHER, SITE_CONFIG } from '@/lib/jsonld'
import { LOCALE_META, type Locale } from '@/lib/i18n'

export function buildProjectPulseJsonLd(locale: Locale) {
  const content = getDictionary(locale).projectPulse
  const baseUrl = SITE_CONFIG.url
  // English keeps SITE_CONFIG.language verbatim so its output is unchanged; Serbian uses the
  // same jsonLdLanguage token every other Serbian page emits.
  const inLanguage = locale === 'en' ? SITE_CONFIG.language : LOCALE_META[locale].jsonLdLanguage

  return [
    // WebPage schema
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: content.page.title,
      inLanguage,
      url: content.page.url,
      description: content.page.description,
      mainEntity: {
        '@type': 'SoftwareApplication',
        name: 'ProjectPulse',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Cloud',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        provider: {
          '@type': 'Organization',
          name: 'Infinus',
          url: baseUrl,
          sameAs: [baseUrl],
        },
        description: content.page.description,
        featureList: content.hero.valueHighlights,
        applicationSubCategory: 'ERP Software',
        softwareVersion: '1.0',
        releaseNotes: content.schema.softwareReleaseNotes,
      },
    },

    // BreadcrumbList
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: content.schema.breadcrumbHome,
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: content.schema.breadcrumbPage,
          item: content.page.url,
        },
      ],
    },

    // Article schema
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: content.page.title,
      about: [
        ...content.schema.articleAbout.map((entry) => ({
          '@type': entry.type,
          name: entry.name,
        })),
        ...content.industries.map((industry) => ({
          '@type': 'Thing',
          name: industry,
        })),
      ],
      author: {
        '@type': 'Organization',
        name: DEFAULT_AUTHOR.name,
        url: DEFAULT_AUTHOR.url,
      },
      publisher: DEFAULT_PUBLISHER,
      image: SITE_CONFIG.defaultImage,
      inLanguage,
      datePublished: getCurrentDate(),
      dateModified: getCurrentDate(),
    },

    // SoftwareApplication schema (detailed)
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'ProjectPulse',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Cloud',
      description: content.page.description,
      url: content.page.url,
      provider: {
        '@type': 'Organization',
        name: 'Infinus',
        url: baseUrl,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Trešnjinog cveta 1',
          addressLocality: 'Belgrade',
          postalCode: '11070',
          addressCountry: 'RS',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'office@infinus.co',
          contactType: 'Customer Service',
        },
      },
      // The four `valueProposition` descriptions are empty strings on the live page, so this
      // list ends in four empty entries. Reproduced, not fixed — see content/en/project-pulse.ts.
      featureList: [
        ...content.hero.valueHighlights,
        ...content.howItWorks.microCards.map((card) => card.description),
        ...content.valueProposition.items.map((item) => item.description),
      ],
      applicationSubCategory: 'ERP Software',
      softwareRequirements: 'SAP Cloud ERP',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'USD',
      },
      audience: {
        '@type': 'Audience',
        audienceType: content.industries.join(', '),
      },
    },

    // HowTo schema for implementation process
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: content.schema.howToName,
      description: content.implementation.subtitle,
      step: content.implementation.phases.map((phase, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: phase.name,
        text: phase.description,
        itemListElement: {
          '@type': 'HowToDirection',
          text: `${phase.name}: ${phase.description} (Duration: ${phase.duration})`,
        },
      })),
    },

    // ItemList for industries
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: content.schema.industriesListName,
      description: content.schema.industriesListDescription,
      itemListElement: content.industries.map((industry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: industry,
      })),
    },
  ]
}
