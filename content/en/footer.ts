/**
 * English shared-Footer copy and destinations.
 *
 * Extracted VERBATIM from `footerConfig` and the bottom bar in components/ui/footer.tsx as
 * they stood at commit fe98e64: the description, the five columns in order, every link
 * label and href, and the bottom row.
 *
 * DATA, not copy — identical in both locales and never translated:
 *   · the mailbox office@infinus.rs
 *   · the LinkedIn URL
 *   · the Brivio credit and its URL
 *   · "Infinus" in the copyright line
 *
 * The postal address IS locale-specific: the English page keeps its existing ASCII
 * "Tresnjinog cveta 1, 11070 Belgrade, Serbia", and the Serbian file uses the approved
 * Serbian form from the legal text.
 */

import type { FooterDictionary } from '../dictionary'

export const footer: FooterDictionary = {
  description:
    'Infinus d.o.o. is a SAP Gold Partner focused on SAP Business Suite solutions including Cloud ERP, Business Data Cloud, Business AI, and Business Technology Platform. We help businesses transform their operations with cutting-edge SAP technologies.',
  logoAlt: 'Infinus Logo',

  columns: {
    contact: {
      label: 'Contact Information',
      items: [
        { label: 'Tresnjinog cveta 1, 11070 Belgrade, Serbia', href: '#' },
        { label: 'office@infinus.rs', href: 'mailto:office@infinus.rs' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/company/infinus1/posts/?feedView=all' },
      ],
    },
    expertise: {
      label: 'Our Expertise',
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
        { label: 'Careers', href: '/#join-team' },
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
