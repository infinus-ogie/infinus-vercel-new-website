/**
 * English shared-Navbar copy and destinations.
 *
 * ── Restructured in the final client-feedback round ─────────────────────────────
 * Until this phase the navbar was eight flat entries, extracted verbatim from the
 * `navItems` array in components/ui/navbar-demo.tsx at commit fe98e64. The client proposed
 * five groups instead, and this file is that proposal:
 *
 *     Home · Company · Expertise · Insights · Contact
 *
 * NOTHING LOST A DESTINATION. Every URL the old navbar reached is still reachable:
 *
 *   About            -> Company > About Us              (same /#about anchor)
 *   Benefits         -> Company > Why Infinus           (same /#partnership-benefits anchor)
 *   FAQ              -> Company > FAQ
 *   Our Expertise    -> Expertise > SAP Expertise       (renamed label, same anchor)
 *   Packaged Sol.    -> Expertise > SAP Packaged Solutions, as a category with its two pages
 *   Case Studies     -> Expertise > Case Studies, as a category with its five pages
 *   Contact          -> Contact
 *
 * What is genuinely NEW is Insights, which finally gives the GROW and Professional Services
 * campaign pages a place in the main navigation. They were previously reachable only from
 * the footer.
 *
 * ── The two categories, and why they are not links ──────────────────────────────
 * "SAP Packaged Solutions" and "Case Studies" have no index page. They render as headings
 * with their real children beneath, not as links to one arbitrary child — see the
 * NavMenuEntry doc in content/dictionary.ts for why that distinction is enforced by the
 * type rather than left to the component.
 *
 * ── The anchors are unchanged on purpose ────────────────────────────────────────
 * `#our-expertise`, `#domain-expertise` and `#partnership-benefits` keep their ids even
 * though their visible labels changed. An anchor id is an addressable identifier that
 * inbound links and the footer depend on; terminology and identity are different things.
 *
 * The icons stay in the component: they are presentation, not copy.
 */

import type { NavDictionary } from '../dictionary'

export const nav: NavDictionary = {
  home: { label: 'Home', href: '/' },

  company: {
    label: 'Company',
    entries: [
      { kind: 'link', label: 'About Us', href: '/#about' },
      { kind: 'link', label: 'Why Infinus', href: '/#partnership-benefits' },
      { kind: 'link', label: 'Careers', href: '/careers' },
      { kind: 'link', label: 'FAQ', href: '/faq' },
    ],
  },

  expertise: {
    label: 'Expertise',
    entries: [
      { kind: 'link', label: 'SAP Expertise', href: '/#our-expertise' },
      { kind: 'link', label: 'Industry Expertise', href: '/#domain-expertise' },
      {
        kind: 'group',
        label: 'SAP Packaged Solutions',
        items: [
          { label: 'ProjectPulse', href: '/projectpulse' },
          { label: 'SAP Starter Package', href: '/sap-packaged-solutions/sap-starter-package' },
        ],
      },
      {
        kind: 'group',
        label: 'Case Studies',
        items: [
          { label: 'Retail', href: '/case-study/retail1' },
          { label: 'Pharma 1', href: '/case-study/pharma1' },
          { label: 'Pharma 2', href: '/case-study/pharma2' },
          { label: 'Nearshoring', href: '/case-study/nearshoring1' },
          { label: 'Manufacturing', href: '/case-study/manufacturing1' },
        ],
      },
    ],
  },

  insights: {
    label: 'Insights',
    entries: [
      // OWNER DECISION: "SAP for CFO" points at /grow, the GROW campaign landing page the
      // client named, NOT at /grow/cfo. The dedicated CFO and CEO role pages stay live and
      // indexed and remain reachable from /grow itself.
      { kind: 'link', label: 'SAP for CFO', href: '/grow' },
      { kind: 'link', label: 'SAP for Professional Services', href: '/professional-services' },
      { kind: 'link', label: 'SAP MythBusting', href: '/insights/sap-mythbusters' },
    ],
  },

  contact: { label: 'Contact', href: '/contact' },

  menuLabel: 'Menu',
}
