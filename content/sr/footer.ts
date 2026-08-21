/**
 * Serbian shared-Footer copy and destinations (Latin script, ekavian).
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  OWNER-APPROVED. Reviewed and signed off after the Phase H1 translation report. ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ── Corrections applied at owner review ─────────────────────────────────────────
 *   columns.contact.label            "Kontakt informacije" -> "Kontakt podaci"
 *   columns.expertise.items[2]       "SAP upravljanje aplikacijama i podrška" ->
 *                                    "Upravljanje SAP aplikacijama i podrška"
 *
 * ── Unchanged data, never translated ────────────────────────────────────────────
 *   · office@infinus.rs, the LinkedIn URL, the Brivio credit and its URL
 *   · "Infinus" and "Infinus d.o.o." — the legal company name
 *   · official SAP product names
 *
 * ── The one approved string here ────────────────────────────────────────────────
 * The postal address is "Trešnjinog cveta 1, 11070 Beograd", copied verbatim from the
 * owner-approved Serbian legal text in content/legal/politika-privatnosti.ts, rather than
 * transliterated from the English footer's ASCII "Tresnjinog cveta 1, 11070 Belgrade,
 * Serbia". Everything else on this page is draft.
 *
 * ── Destinations ────────────────────────────────────────────────────────────────
 * Same rule as the Navbar: labels are translated, URLs are only ever real.
 *
 * The Company and Resources columns used to point at /grow and /professional-services,
 * because those WERE the Serbian pages. They are the English pages now: the owner's route
 * decision gave English the clean unprefixed paths and moved the Serbian content under /sr.
 * So these links became /sr/grow and /sr/professional-services — a change of href that keeps
 * the destination exactly where it always was, which is the whole point.
 *
 * The Legal column points at the SERBIAN Privacy Policy, /sr/politika-privatnosti — the single
 * bilingual URL was split by locale.
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
        { label: 'office@infinus.rs', href: 'mailto:office@infinus.rs' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/company/infinus1/posts/?feedView=all' },
      ],
    },
    expertise: {
      label: 'Naša ekspertiza',
      items: [
        { label: 'SAP savetovanje i konsalting', href: '/sr#our-expertise' },
        { label: 'SAP implementacije', href: '/sr#our-expertise' },
        { label: 'Upravljanje SAP aplikacijama i podrška', href: '/sr#our-expertise' },
        { label: 'SAP integracija i optimizacija procesa', href: '/sr#our-expertise' },
        { label: 'SAP ekstenzije i inovacije', href: '/sr#our-expertise' },
      ],
    },
    company: {
      label: 'Kompanija',
      items: [
        { label: 'O nama', href: '/sr#about' },
        { label: 'GROW with SAP: Finansije', href: '/sr/grow' },
        { label: 'SAP za Professional Services', href: '/sr/professional-services' },
        { label: 'Karijera', href: '/sr#join-team' },
        { label: 'Česta pitanja', href: '/sr/faq' },
        { label: 'Kontakt', href: '/sr/contact' },
      ],
    },
    resources: {
      label: 'Resursi',
      items: [
        { label: 'GROW materijali', href: '/sr/grow#downloads' },
        { label: 'Materijali za Professional Services', href: '/sr/professional-services#downloads' },
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
