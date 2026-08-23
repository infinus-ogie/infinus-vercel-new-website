/**
 * English shared-Footer copy and destinations.
 *
 * Extracted VERBATIM from `footerConfig` and the bottom bar in components/ui/footer.tsx as
 * they stood at commit fe98e64: the description, the five columns in order, every link
 * label and href, and the bottom row.
 *
 * DATA, not copy — identical in both locales and never translated:
 *   · the mailbox office@infinus.co
 *   · the LinkedIn URL
 *   · the Brivio credit and its URL
 *   · "Infinus" in the copyright line
 *
 * The postal address IS locale-specific: the English page keeps its existing ASCII
 * "Tresnjinog cveta 1, 11070 Belgrade, Serbia", and the Serbian file uses the approved
 * Serbian form from the legal text.
 */

import type { FooterDictionary } from '../dictionary'

/**
 * Phase H4 repointed four links, twice.
 *
 * The Company and Resources columns have always sent English readers to /grow and
 * /professional-services. Until H4 those were the SERBIAN campaign pages, so an English
 * footer link landed on Serbian content — there was no English version to point at.
 *
 * H4's first attempt gave English new slugs (/grow-with-sap, /sap-for-professional-services)
 * and repointed these links at them. The owner rejected those slugs in favour of the clean
 * paths, so the hrefs below are back to /grow and /professional-services — but they now reach
 * ENGLISH pages, which is what makes them correct rather than merely unchanged.
 *
 * The Serbian footer points at /sr/grow and /sr/professional-services, so neither locale's
 * footer crosses into the other's content.
 *
 * The anchors are unchanged: both halves use #downloads, the historical Serbian ID shared by
 * both language versions of the page. See components/pages/GrowLandingPage.tsx.
 */
export const footer: FooterDictionary = {
  description:
    'Infinus d.o.o. is an SAP Gold Partner focused on SAP Business Suite solutions including Cloud ERP, Business Data Cloud, Business AI, and Business Technology Platform. We help businesses transform their operations with cutting-edge SAP technologies.',
  logoAlt: 'Infinus Logo',

  columns: {
    contact: {
      label: 'Contact Information',
      items: [
        { label: 'Trešnjinog cveta 1, 11070 Belgrade, Serbia', href: '#' },
        { label: 'office@infinus.co', href: 'mailto:office@infinus.co' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/company/infinus1/posts/?feedView=all' },
      ],
    },
    expertise: {
      label: 'SAP Expertise',
      items: [
        { label: 'SAP Advisory & Consulting', href: '/#our-expertise' },
        { label: 'SAP Implementations', href: '/#our-expertise' },
        { label: 'SAP Application Management & Support', href: '/#our-expertise' },
        { label: 'SAP Integration & Process Optimization', href: '/#our-expertise' },
        { label: 'SAP Extensions & Innovation', href: '/#our-expertise' },
      ],
    },
    company: {
      label: 'Company',
      items: [
        { label: 'About Us', href: '/#about' },
        { label: 'GROW with SAP: Finance', href: '/grow' },
        { label: 'SAP for Professional Services', href: '/professional-services' },
        { label: 'Careers', href: '/careers' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    resources: {
      label: 'Resources',
      items: [
        { label: 'GROW Materials', href: '/grow#downloads' },
        { label: 'Professional Services Materials', href: '/professional-services#downloads' },
      ],
    },
    legal: {
      label: 'Legal',
      items: [{ label: 'Privacy Policy', href: '/privacy' }],
    },
  },

  bottom: {
    rights: 'All rights reserved.',
    privacyLabel: 'Privacy',
    privacyHref: '/privacy',
    cookieSettings: 'Cookie settings',
    developedBy: 'Developed by',
  },
}
