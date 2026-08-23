/**
 * Serbian shared-Navbar copy and destinations (Latin script, ekavian).
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  OWNER-APPROVED. Labels signed off in the final client-feedback round.          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ── Labels and destinations are separate decisions ──────────────────────────────
 * A translated label NEVER invents a URL. Every href below points at a Serbian page that
 * genuinely exists today: the /sr homepage and its anchors, /sr/careers, /sr/faq,
 * /sr/projectpulse, /sr/sap-packaged-solutions/…, the five /sr/case-study/… pages,
 * /sr/grow, /sr/professional-services and /sr/contact.
 *
 * No control in this navbar leads to an English page, so a visitor who switches language
 * cannot fall back into English by following the menu.
 *
 * ── Which labels were newly approved here ───────────────────────────────────────
 * Most reuse terminology the site already had. Three are new and were approved explicitly:
 *
 *   Ekspertiza              the Expertise group (new grouping, so a new label)
 *   Uvidi                   Insights
 *   Industrijska ekspertiza the industry section, previously "Ekspertiza po industrijama"
 *
 * "Zašto Infinus" already existed as a kicker in the ProjectPulse brochure copy, and
 * "SAP ekspertiza" replaced "Naša ekspertiza" alongside the English rename.
 *
 * ── Kept untranslated on purpose ────────────────────────────────────────────────
 * "SAP MythBusting" is a campaign name, like "ProjectPulse" and "GROW with SAP". "SAP za
 * Professional Services" keeps the industry category in English, matching the existing
 * footer label. "Nearshoring" is an established loanword in Serbian IT usage.
 */

import type { NavDictionary } from '../dictionary'

export const nav: NavDictionary = {
  home: { label: 'Početna', href: '/sr' },

  company: {
    label: 'Kompanija',
    entries: [
      { kind: 'link', label: 'O nama', href: '/sr#about' },
      { kind: 'link', label: 'Zašto Infinus', href: '/sr#partnership-benefits' },
      { kind: 'link', label: 'Karijera', href: '/sr/careers' },
      { kind: 'link', label: 'Česta pitanja', href: '/sr/faq' },
    ],
  },

  expertise: {
    label: 'Ekspertiza',
    entries: [
      { kind: 'link', label: 'SAP ekspertiza', href: '/sr#our-expertise' },
      { kind: 'link', label: 'Industrijska ekspertiza', href: '/sr#domain-expertise' },
      {
        kind: 'group',
        label: 'SAP paketna rešenja',
        items: [
          // Product names, kept as they are. The URL keeps the English
          // `sap-packaged-solutions` segment — see the header of
          // app/(sr)/sr/sap-packaged-solutions/sap-starter-package/page.tsx.
          { label: 'ProjectPulse', href: '/sr/projectpulse' },
          { label: 'SAP Starter Package', href: '/sr/sap-packaged-solutions/sap-starter-package' },
        ],
      },
      {
        kind: 'group',
        label: 'Studije slučaja',
        items: [
          { label: 'Maloprodaja', href: '/sr/case-study/retail1' },
          { label: 'Farmacija 1', href: '/sr/case-study/pharma1' },
          { label: 'Farmacija 2', href: '/sr/case-study/pharma2' },
          // Established loanword in Serbian IT usage; left as-is deliberately.
          { label: 'Nearshoring', href: '/sr/case-study/nearshoring1' },
          { label: 'Proizvodnja', href: '/sr/case-study/manufacturing1' },
        ],
      },
    ],
  },

  insights: {
    label: 'Uvidi',
    entries: [
      // Mirrors the English decision: "SAP za CFO" points at the GROW landing page, not at
      // the dedicated /sr/grow/cfo role page, which stays live and reachable from it.
      { kind: 'link', label: 'SAP za CFO', href: '/sr/grow' },
      { kind: 'link', label: 'SAP za Professional Services', href: '/sr/professional-services' },
      // SAP MythBusting joins this group when /sr/insights/sap-mythbusters exists.
    ],
  },

  contact: { label: 'Kontakt', href: '/sr/contact' },

  menuLabel: 'Meni',
}
