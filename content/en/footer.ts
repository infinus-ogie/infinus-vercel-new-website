/**
 * English shared-Footer copy and destinations.
 *
 * ── Restructured in the final client-feedback round ─────────────────────────────
 * The five columns are now Contact Information · Company · Expertise · Insights · Legal,
 * mirroring the new navigation so a visitor meets the same grouping twice.
 *
 * What changed and why:
 *
 *   · Expertise used to list five SERVICE NAMES that all pointed at the same
 *     `/#our-expertise` anchor — five links, one destination. It now lists the real
 *     expertise destinations, with the two categories rendered as headings over their
 *     children.
 *   · Company dropped the two campaign links it was carrying and gained Why Infinus;
 *     Careers moved from the `/#join-team` homepage anchor to the real /careers page.
 *   · Insights is new. GROW and Professional Services were only ever reachable from this
 *     footer; now they sit in a group that says what they are.
 *   · The RESOURCES column is gone. Its two links pointed at `#downloads` on the campaign
 *     pages. Those sections, their anchors and every PDF and ZIP behind them are untouched:
 *     only the footer column was removed.
 *
 * ── Categories are headings, not links ──────────────────────────────────────────
 * "SAP Packaged Solutions" and "Case Studies" have no index page, so they are
 * `kind: 'group'` — a label over its real children. Pointing either at one arbitrary child
 * was ruled out explicitly. See the NavMenuEntry doc in content/dictionary.ts.
 *
 * DATA, not copy — identical in both locales and never translated:
 *   · the mailbox office@infinus.co
 *   · the LinkedIn URL
 *   · the Brivio credit and its URL
 *   · "Infinus" in the copyright line
 *
 * The postal address IS locale-specific: this file uses the English city name and the
 * Serbian file the approved Serbian form from the legal text. Both now spell "Trešnjinog"
 * with the š the street name actually has.
 */

import type { FooterDictionary } from '../dictionary'

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
        // Same owner decision as the navbar: /grow, not /grow/cfo.
        { kind: 'link', label: 'SAP for CFO', href: '/grow' },
        { kind: 'link', label: 'SAP for Professional Services', href: '/professional-services' },
        { kind: 'link', label: 'SAP MythBusting', href: '/insights/sap-mythbusters' },
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
