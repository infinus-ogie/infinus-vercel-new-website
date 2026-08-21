/**
 * Serbian shared-Navbar copy and destinations (Latin script, ekavian).
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  OWNER-APPROVED. Reviewed and signed off after the Phase H1 translation report. ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Labels approved at H1 review. Phase H2 repointed the case-study submenu at the real
 * Serbian pages; the labels themselves are unchanged.
 *
 * ── Labels and destinations are separate decisions ──────────────────────────────
 * A translated label NEVER invents a URL. Each entry below points at a destination that
 * genuinely exists today:
 *
 *   home / about / expertise / benefits   -> /sr and its anchors. Real: the Serbian
 *                                            homepage renders those same sections.
 *   faq                                   -> /sr/faq        (live in H1)
 *   contact                               -> /sr/contact    (live since Phase G)
 *   caseStudies.*                         -> /sr/case-study/... (live since Phase H2)
 *   packagedSolutions.*                   -> the ENGLISH pages, unchanged. Their Serbian
 *                                            counterparts are still only planned, so
 *                                            linking to /sr/... would 404.
 *
 * That last group is the deliberate compromise of a partial rollout: a Serbian label on a
 * control that leads to an English page. It resolves as those pages are translated.
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
      // Phase H2: these now point at the REAL Serbian case studies.
      { label: 'Maloprodaja', href: '/sr/case-study/retail1' },
      { label: 'Farmacija 1', href: '/sr/case-study/pharma1' },
      { label: 'Farmacija 2', href: '/sr/case-study/pharma2' },
      // Established loanword in Serbian IT usage; left as-is deliberately.
      { label: 'Nearshoring', href: '/sr/case-study/nearshoring1' },
      { label: 'Proizvodnja', href: '/sr/case-study/manufacturing1' },
    ],
  },

  contact: { label: 'Kontakt', href: '/sr/contact' },
  faq: { label: 'Česta pitanja', href: '/sr/faq' },

  menuLabel: 'Meni',
}
