/**
 * English SAP Starter Package copy — /sap-packaged-solutions/sap-starter-package.
 *
 * ── Provenance: EXTRACTED, NOT WRITTEN ──────────────────────────────────────────
 * Verbatim from the `PAGE_CONTENT` object in
 * app/(en)/(site)/sap-packaged-solutions/sap-starter-package/page.tsx at commit f143256.
 * That object's own header records where IT came from: "All copy below is sourced verbatim
 * from the approved DOCX. Do not edit text in this file — update from the approved DOCX
 * only." That rule now applies to this file: the DOCX is upstream of the English copy, and
 * the English copy is upstream of the Serbian.
 *
 * ── Structure notes ────────────────────────────────────────────────────────────
 *   · `whatYouGain` and `why` render as title-only cards. The DOCX supplies titles only and
 *     no descriptions were invented, then or now.
 *   · The old object carried `brochure.heading` ("Brochure") and `brochure.downloadLabel`
 *     for a brochure section that the page does not render. Only the two PDF hrefs were
 *     ever used, so only those are carried across; the two unused labels are dropped rather
 *     than translated into a section that does not exist.
 *   · "Ready to deploy in 4–6 months" uses an EN DASH here, while the ProjectPulse page's
 *     equivalent line uses a hyphen ("4-6 months"). Two pages, two typographic
 *     conventions — both reproduced as they ship.
 *   · The hero and the final CTA use the same two button labels. They are stored per block
 *     rather than shared, because that is how the DOCX-derived object had them and because
 *     the two blocks are free to diverge.
 *
 * ── The brochure PDFs ──────────────────────────────────────────────────────────
 * There are two, and BOTH are offered on BOTH halves of the locale pair: the language
 * modal is a deliberate choice for the visitor, independent of which language the page is
 * in. So these two hrefs are identical across locales.
 */

import type { SapStarterPackageDictionary } from '../dictionary'

export const sapStarterPackage: SapStarterPackageDictionary = {
  metadata: {
    title: 'SAP Starter Package | Infinus – SAP Packaged Solutions',
    // The brand is dropped here only: the root layout's template supplies it once.
    documentTitle: 'SAP Starter Package – SAP Packaged Solutions',
    description:
      'A fast, structured way to implement SAP Cloud ERP and establish a scalable digital foundation for growth.',
  },

  hero: {
    badge: 'SAP Packaged Solutions',
    imageAlt: 'SAP Starter Package',
    title: 'SAP Starter Package',
    tagline: 'When your company outgrows Excel and disconnected systems',
    description:
      'A fast, structured way to implement SAP Cloud ERP and establish a scalable digital foundation for growth.',
    ctaDiscovery: 'Book a discovery call',
    ctaBrochure: 'Download brochure',
  },

  challenge: {
    heading: 'The challenge',
    lines: [
      "As companies grow, systems often don't keep up.",
      "Financial data is delayed, reports don't match, and teams spend too much time on manual work.",
      'You lose visibility into profitability, inventory, and cash flow — exactly when you need it most.',
    ],
  },

  solution: {
    heading: 'The solution',
    body: 'SAP Starter Package brings your core processes into one system — finance, sales, procurement, and operations.',
    highlight: 'One system. One source of truth. Real-time insight.',
    sub: 'A structured, low-risk approach to implementing SAP Cloud ERP.',
  },

  whatYouGain: {
    heading: 'What you gain',
    items: [
      'Real-time visibility into profitability and cash flow',
      'Less manual work and fewer errors',
      'Standardized processes that support growth',
      'Better control over operations and decision-making',
    ],
  },

  idealFor: {
    heading: 'Ideal for',
    items: [
      'Growing companies with disconnected systems',
      'Businesses relying on Excel and manual processes',
      'Companies that need better financial and operational control',
      'Organizations preparing for scaling',
    ],
  },

  why: {
    heading: 'Why SAP Starter Package',
    items: [
      'Focus on core business processes',
      'Built-in analytics and AI',
      'SAP best-practice approach',
      'Ready to deploy in 4–6 months',
    ],
  },

  cta: {
    heading: 'Ready to move beyond Excel and disconnected systems?',
    ctaDiscovery: 'Book a discovery call',
    ctaBrochure: 'Download brochure',
    trustNote: 'We respond within one business day',
  },

  // The language modal, which until now was hardcoded English inside
  // components/ui/BrochureLanguageModal.tsx and therefore appeared in English on any page
  // that used it. `note` is the parenthetical endonym beside an option; it is EMPTY on the
  // reader's own language, because there is nothing to gloss. Both locales leave exactly one
  // of the two empty, which is why test/i18n/dictionary.test.ts allowlists these two paths.
  brochureModal: {
    heading: 'Download Brochure',
    subheading: 'Choose your preferred language',
    closeLabel: 'Close',
    cancelLabel: 'Cancel',
    englishOption: { label: 'English', note: '' },
    serbianOption: { label: 'Serbian', note: '(Srpski)' },
  },

  brochure: {
    hrefEn: '/sap-starter-package/sap-starter-package-brochure-en.pdf',
    hrefSr: '/sap-starter-package/sap-starter-package-brochure.pdf',
  },

  schema: {
    breadcrumbHome: 'Home',
    articleAbout: [
      'SAP Starter Package',
      'SAP Cloud ERP',
      'SAP Implementation',
      'SAP Packaged Solutions',
      'Infinus',
    ],
  },

  contactHref: '/contact',
}
