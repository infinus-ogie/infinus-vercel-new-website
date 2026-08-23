/**
 * Serbian shared-Navbar copy and destinations (Latin script, ekavian).
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  OWNER-APPROVED. Reviewed and signed off after the Phase H1 translation report. ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Labels approved at H1 review. Phase H2 repointed the case-study submenu at the real
 * Serbian pages and Phase H3 did the same for SAP paketna rešenja; every destination in this
 * file is a Serbian page.
 *
 * One label changed in the final client-feedback round: `expertise` reads "SAP ekspertiza"
 * rather than "Naša ekspertiza", mirroring the English rename. The href still points at the
 * `#our-expertise` anchor — the anchor id is deliberately NOT renamed with the terminology.
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
 *   packagedSolutions.*                   -> /sr/projectpulse and
 *                                            /sr/sap-packaged-solutions/... (live in H3)
 *
 * With H3 the last English destination left this file. Every control in the Serbian navbar
 * now leads to a Serbian page, so a visitor who switches language no longer falls back into
 * English by following the menu.
 *
 * test/shell/chrome-locale.test.ts asserts every href here is either a live path in the
 * route map or an anchor on one, so a planned URL cannot slip in.
 */

import type { NavDictionary } from '../dictionary'

export const nav: NavDictionary = {
  home: { label: 'Početna', href: '/sr' },
  about: { label: 'O nama', href: '/sr#about' },
  expertise: { label: 'SAP ekspertiza', href: '/sr#our-expertise' },
  benefits: { label: 'Prednosti', href: '/sr#partnership-benefits' },

  packagedSolutions: {
    label: 'SAP paketna rešenja',
    items: [
      // Product names, kept as they are. Phase H3: destinations are now the REAL Serbian
      // pages. The URL keeps the English `sap-packaged-solutions` segment — see the header
      // of app/(sr)/sr/sap-packaged-solutions/sap-starter-package/page.tsx.
      { label: 'ProjectPulse', href: '/sr/projectpulse' },
      { label: 'SAP Starter Package', href: '/sr/sap-packaged-solutions/sap-starter-package' },
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
