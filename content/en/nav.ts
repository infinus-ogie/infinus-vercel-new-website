/**
 * English shared-Navbar copy and destinations.
 *
 * Extracted VERBATIM from the `navItems` array in components/ui/navbar-demo.tsx as it
 * stood at commit fe98e64 — the same eight top-level entries in the same order, the same
 * two submenus, and the same hrefs. The English navbar is therefore unchanged.
 *
 * `label` and `href` are separate concerns. This file happens to pair English labels with
 * English URLs; content/sr/nav.ts pairs Serbian labels with whichever destination is
 * genuinely real for a Serbian visitor. Translating a label never invents a URL.
 *
 * The icons stay in the component: they are presentation, not copy, and are matched to
 * entries by key rather than by position.
 */

import type { NavDictionary } from '../dictionary'

export const nav: NavDictionary = {
  home: { label: 'Home', href: '/' },
  about: { label: 'About', href: '/#about' },
  expertise: { label: 'Our Expertise', href: '/#our-expertise' },
  benefits: { label: 'Benefits', href: '/#partnership-benefits' },

  packagedSolutions: {
    label: 'SAP Packaged Solutions',
    items: [
      { label: 'ProjectPulse', href: '/projectpulse' },
      { label: 'SAP Starter Package', href: '/sap-packaged-solutions/sap-starter-package' },
    ],
  },

  caseStudies: {
    label: 'Case Studies',
    items: [
      { label: 'Retail', href: '/case-study/retail1' },
      { label: 'Pharma 1', href: '/case-study/pharma1' },
      { label: 'Pharma 2', href: '/case-study/pharma2' },
      { label: 'Nearshoring', href: '/case-study/nearshoring1' },
      { label: 'Manufacturing', href: '/case-study/manufacturing1' },
    ],
  },

  contact: { label: 'Contact', href: '/contact' },
  faq: { label: 'FAQ', href: '/faq' },

  menuLabel: 'Menu',
}
