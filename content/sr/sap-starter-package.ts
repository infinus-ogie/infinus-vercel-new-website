/**
 * Serbian SAP Starter Package copy — /sr/sap-packaged-solutions/sap-starter-package.
 *
 * ── Provenance: OWNER-APPROVED ─────────────────────────────────────────────────
 * Signed off after the full H2/H3 411-string side-by-side review. Translated from
 * content/en/sap-starter-package.ts, which is itself extracted verbatim from the approved
 * DOCX and remains the source of truth.
 *
 * ── Corrections applied at owner review ─────────────────────────────────────────
 *      E1   challenge.lines[0]   confirmed correct as written — no change
 *      E2   challenge.lines[1]   "timovi provode previše vremena na ručnom radu"
 *                             -> "timovi troše previše vremena na ručni rad"
 *      E3   challenge.lines[2]   em dash -> EN DASH. Scoped to this sentence.
 *      E4   solution.highlight   "Jedan izvor istine" -> "Jedinstven izvor pouzdanih
 *                                podataka" (the same correction as ProjectPulse B12)
 *      E5   solution.sub         "Struktuiran pristup … , sa niskim rizikom."
 *                             -> "Strukturisan pristup … uz nizak rizik."
 *      E6   whatYouGain[3]       "Bolju kontrolu poslovanja i odlučivanja"
 *                             -> "Bolju kontrolu nad poslovanjem i donošenjem odluka"
 *      E7   idealFor[3]          "…za skaliranje" -> "…za rast i skaliranje"
 *
 * The claim in E5 is unchanged: still a structured, low-risk approach.
 *
 * NOTE for a future style pass, deliberately NOT changed here: E5 introduces
 * "Strukturisan" while `hero.description` still reads "Brz i struktuiran način". The owner
 * ruling approves every string not explicitly corrected, so the hero keeps its spelling and
 * the inconsistency is reported rather than silently harmonised.
 *
 * E8: the bilingual modal behaviour is approved as built — the English page offers
 * "Serbian (Srpski)" and the Serbian page offers "Engleski (English)".
 *
 * ── Translation decisions ──────────────────────────────────────────────────────
 * Left in English, deliberately: "SAP Starter Package" and "SAP Packaged Solutions" are the
 * offering's names as Infinus sells and prices them, "SAP Cloud ERP" and "AI" are used
 * unchanged in Serbian, and "Excel" is a product name.
 *
 * "SAP best-practice approach" -> "Pristup zasnovan na SAP best practice metodologiji":
 * "best practice" is the term SAP consultants use in Serbian; translating it to "najbolja
 * praksa" would read as generic advice rather than as the named SAP methodology.
 *
 * "4–6 months" -> "4–6 meseci", keeping the EN DASH the English line uses. Note the
 * ProjectPulse pages use a hyphen for the same range; that inconsistency is inherited from
 * the English source on both sides and was not silently harmonised.
 *
 * The em dashes in the challenge and solution copy are kept as em dashes. Serbian
 * typography more often uses a spaced en dash, but changing punctuation the owner approved
 * in the DOCX-derived English is a style decision for review, not a translation call.
 *
 * The brochure PDFs are NOT swapped: both language options appear on both halves of the
 * pair. `brochureModal.englishOption.note` carries the gloss here and
 * `serbianOption.note` is empty — the mirror image of the English file.
 */

import type { SapStarterPackageDictionary } from '../dictionary'

export const sapStarterPackage: SapStarterPackageDictionary = {
  metadata: {
    title: 'SAP Starter Package | Infinus – SAP Packaged Solutions',
    description:
      'Brz i struktuiran način da implementirate SAP Cloud ERP i postavite skalabilnu digitalnu osnovu za rast.',
  },

  hero: {
    badge: 'SAP Packaged Solutions',
    imageAlt: 'SAP Starter Package',
    title: 'SAP Starter Package',
    tagline: 'Kada vaša kompanija preraste Excel i nepovezane sisteme',
    description:
      'Brz i struktuiran način da implementirate SAP Cloud ERP i postavite skalabilnu digitalnu osnovu za rast.',
    ctaDiscovery: 'Zakažite uvodni razgovor',
    ctaBrochure: 'Preuzmite brošuru',
  },

  challenge: {
    heading: 'Izazov',
    lines: [
      'Kako kompanije rastu, sistemi često ne mogu da isprate taj rast.',
      'Finansijski podaci kasne, izveštaji se ne poklapaju, a timovi troše previše vremena na ručni rad.',
      'Gubite vidljivost profitabilnosti, zaliha i novčanog toka – upravo kada vam je najpotrebnija.',
    ],
  },

  solution: {
    heading: 'Rešenje',
    body: 'SAP Starter Package objedinjuje vaše osnovne procese u jedan sistem — finansije, prodaju, nabavku i operacije.',
    highlight: 'Jedan sistem. Jedinstven izvor pouzdanih podataka. Uvid u realnom vremenu.',
    sub: 'Strukturisan pristup implementaciji SAP Cloud ERP-a uz nizak rizik.',
  },

  whatYouGain: {
    heading: 'Šta dobijate',
    items: [
      'Vidljivost profitabilnosti i novčanog toka u realnom vremenu',
      'Manje ručnog rada i manje grešaka',
      'Standardizovane procese koji podržavaju rast',
      'Bolju kontrolu nad poslovanjem i donošenjem odluka',
    ],
  },

  idealFor: {
    heading: 'Idealno za',
    items: [
      'Kompanije u rastu sa nepovezanim sistemima',
      'Kompanije koje se oslanjaju na Excel i ručne procese',
      'Kompanije kojima je potrebna bolja finansijska i operativna kontrola',
      'Organizacije koje se pripremaju za rast i skaliranje',
    ],
  },

  why: {
    heading: 'Zašto SAP Starter Package',
    items: [
      'Fokus na osnovne poslovne procese',
      'Ugrađena analitika i AI',
      'Pristup zasnovan na SAP best practice metodologiji',
      'Spremno za implementaciju u roku od 4–6 meseci',
    ],
  },

  cta: {
    heading: 'Spremni da napustite Excel i nepovezane sisteme?',
    ctaDiscovery: 'Zakažite uvodni razgovor',
    ctaBrochure: 'Preuzmite brošuru',
    trustNote: 'Odgovaramo u roku od jednog radnog dana',
  },

  brochureModal: {
    heading: 'Preuzmite brošuru',
    subheading: 'Izaberite jezik',
    closeLabel: 'Zatvori',
    cancelLabel: 'Otkaži',
    englishOption: { label: 'Engleski', note: '(English)' },
    serbianOption: { label: 'Srpski', note: '' },
  },

  brochure: {
    hrefEn: '/sap-starter-package/sap-starter-package-brochure-en.pdf',
    hrefSr: '/sap-starter-package/sap-starter-package-brochure.pdf',
  },

  schema: {
    breadcrumbHome: 'Početna',
    articleAbout: [
      'SAP Starter Package',
      'SAP Cloud ERP',
      'SAP implementacija',
      'SAP Packaged Solutions',
      'Infinus',
    ],
  },

  contactHref: '/sr/contact',
}
