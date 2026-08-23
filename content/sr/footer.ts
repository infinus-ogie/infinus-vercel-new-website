/**
 * Serbian shared-Footer copy and destinations (Latin script, ekavian).
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  OWNER-APPROVED. Restructured and re-approved in the final client-feedback      ║
 * ║  round; the labels reuse the navbar's approved set.                             ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ── Same restructure as the English half ────────────────────────────────────────
 * Kontakt podaci · Kompanija · Ekspertiza · Uvidi · Pravne informacije, mirroring the new
 * navigation. The old "Resursi" column is gone; the campaign download sections, their
 * `#downloads` anchors and every PDF and ZIP behind them are untouched.
 *
 * ── Corrections carried forward from the H1 owner review ────────────────────────
 *   columns.contact.label   "Kontakt informacije" -> "Kontakt podaci"
 *
 * The five service names that used to fill the Ekspertiza column all pointed at the same
 * `/sr#our-expertise` anchor. They are replaced by the real destinations, so the column now
 * leads somewhere different for each entry rather than five times to one place.
 *
 * ── Unchanged data, never translated ────────────────────────────────────────────
 *   · office@infinus.co, the LinkedIn URL, the Brivio credit and its URL
 *   · "Infinus" and "Infinus d.o.o." — the legal company name
 *   · official SAP product names, and "SAP za Professional Services" as the industry category
 *
 * ── The approved address ────────────────────────────────────────────────────────
 * "Trešnjinog cveta 1, 11070 Beograd", verbatim from the owner-approved Serbian legal text
 * in content/legal/politika-privatnosti.ts.
 *
 * ── Destinations ────────────────────────────────────────────────────────────────
 * Same rule as the navbar: labels are translated, URLs are only ever real, and every one of
 * them is Serbian. The Legal column points at the SERBIAN Privacy Policy — that slug is
 * translated, so no prefix rule reaches it.
 */

import type { FooterDictionary } from '../dictionary'

export const footer: FooterDictionary = {
  description:
    'Infinus d.o.o. je SAP Gold Partner fokusiran na rešenja iz SAP Business Suite portfolija, uključujući Cloud ERP, Business Data Cloud, Business AI i Business Technology Platform. Pomažemo kompanijama da transformišu svoje poslovanje uz najsavremenije SAP tehnologije.',
  logoAlt: 'Infinus logo',

  columns: {
    contact: {
      label: 'Kontakt podaci',
      items: [
        // Verbatim from the approved Serbian legal text.
        { label: 'Trešnjinog cveta 1, 11070 Beograd', href: '#' },
        { label: 'office@infinus.co', href: 'mailto:office@infinus.co' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/company/infinus1/posts/?feedView=all' },
      ],
    },

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
            { label: 'Nearshoring', href: '/sr/case-study/nearshoring1' },
            { label: 'Proizvodnja', href: '/sr/case-study/manufacturing1' },
          ],
        },
      ],
    },

    insights: {
      label: 'Uvidi',
      entries: [
        // Same owner decision as the navbar: /sr/grow, not /sr/grow/cfo.
        { kind: 'link', label: 'SAP za CFO', href: '/sr/grow' },
        { kind: 'link', label: 'SAP za Professional Services', href: '/sr/professional-services' },
        // SAP MythBusting joins this group when /sr/insights/sap-mythbusters exists.
      ],
    },

    legal: {
      label: 'Pravne informacije',
      items: [{ label: 'Politika privatnosti', href: '/sr/politika-privatnosti' }],
    },
  },

  bottom: {
    rights: 'Sva prava zadržana.',
    privacyLabel: 'Privatnost',
    privacyHref: '/sr/politika-privatnosti',
    cookieSettings: 'Podešavanja kolačića',
    developedBy: 'Razvio',
  },
}
