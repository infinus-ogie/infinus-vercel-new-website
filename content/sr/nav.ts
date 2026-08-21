/**
 * Serbian shared-Navbar copy and destinations (Latin script, ekavian).
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  OWNER-APPROVED. Reviewed and signed off after the Phase H1 translation report. ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Approved unchanged, including the deliberate Serbian labels on the two groups whose
 * destinations are still English pages (see the note below).
 *
 * ── Labels and destinations are separate decisions ──────────────────────────────
 * A translated label NEVER invents a URL. Each entry below points at a destination that
 * genuinely exists today:
 *
 *   home / about / expertise / benefits   -> /sr and its anchors. Real: the Serbian
 *                                            homepage renders those same sections.
 *   faq                                   -> /sr/faq        (live in H1)
 *   contact                               -> /sr/contact    (live since Phase G)
 *   packagedSolutions.*  caseStudies.*    -> the ENGLISH pages, unchanged. Their Serbian
 *                                            counterparts are still only planned, so
 *                                            linking to /sr/... would 404.
 *
 * That last group is the deliberate compromise of a partial rollout: a Serbian label on a
 * control that leads to an English page. Flagged for review — the alternative is keeping
 * those two group labels in English until their pages are translated.
 *
 * test/shell/chrome-locale.test.ts asserts every href here is either a live path in the
 * route map or an anchor on one, so a planned URL cannot slip in.
 */

import type { NavDictionary } from '../dictionary'

export const nav: NavDictionary = {
  home: { label: 'Početna', href: '/sr' },
  about: { label: 'O nama', href: '/sr#about' },
  expertise: { label: 'Naša ekspertiza', href: '/sr#our-expertise' },
  benefits: { label: 'Prednosti', href: '/sr#partnership-benefits' },

  packagedSolutions: {
    label: 'SAP paketna rešenja',
    items: [
      // Product names, kept as they are. Destinations stay English: no Serbian version yet.
      { label: 'ProjectPulse', href: '/projectpulse' },
      { label: 'SAP Starter Package', href: '/sap-packaged-solutions/sap-starter-package' },
    ],
  },

  caseStudies: {
    label: 'Studije slučaja',
    items: [
      { label: 'Maloprodaja', href: '/case-study/retail1' },
      { label: 'Farmacija 1', href: '/case-study/pharma1' },
      { label: 'Farmacija 2', href: '/case-study/pharma2' },
      // Established loanword in Serbian IT usage; left as-is deliberately.
      { label: 'Nearshoring', href: '/case-study/nearshoring1' },
      { label: 'Proizvodnja', href: '/case-study/manufacturing1' },
    ],
  },

  contact: { label: 'Kontakt', href: '/sr/contact' },
  faq: { label: 'Česta pitanja', href: '/sr/faq' },

  menuLabel: 'Meni',
}
