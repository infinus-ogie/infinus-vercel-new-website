/**
 * Serbian ProjectPulse copy — /sr/projectpulse.
 *
 * ── Provenance: OWNER-APPROVED ─────────────────────────────────────────────────
 * Signed off after the full H2/H3 411-string side-by-side review. Translated from
 * content/en/project-pulse.ts, which remains the source of truth.
 *
 * ── Corrections applied at owner review ─────────────────────────────────────────
 * Fifteen wording corrections. Three themes run through them.
 *
 * 1. "end-to-end" is not left in Serbian prose. It survives ONLY inside the product's own
 *    named flow, "Project-to-Profit", which is never translated.
 *      B5   howItWorks.kicker      "End-to-end proces" -> "Proces od početka do kraja"
 *      B9   page.description       "u jedan end-to-end proces"
 *                               -> "u jedan proces od početka do kraja"
 *      B12  solution.description2  "…Jedan end-to-end proces."
 *                               -> "…Jedan proces od početka do kraja."
 *
 * 2. "napravljen/napravljeno za" (built for) becomes "namenjen/namenjeno" (intended for),
 *    and the audience is named as COMPANIES in professional services, not the sector:
 *      B2   hero.description       "napravljen za kompanije…" -> "namenjen kompanijama…"
 *      B3   hero.subtitle          "…za profesionalne usluge"
 *                               -> "…za kompanije iz oblasti profesionalnih usluga"
 *      B7   idealFor.kicker        "Napravljeno za profesionalne usluge"
 *                               -> "Namenjeno kompanijama iz oblasti profesionalnih usluga"
 *      B14  schema list descr.     "Industrije profesionalnih usluga koje imaju koristi…"
 *                               -> "Delatnosti iz oblasti profesionalnih usluga koje mogu
 *                                   imati koristi…"
 *
 * 3. Plainer, less literal Serbian:
 *      B1   cta.title              "…Project-to-Profit proces?" -> "…Project-to-Profit tok?"
 *      B4   hero.valueHighlights   "…rane informacije o blokadama u naplati"
 *                               -> "…rano uočljive blokade u naplati"
 *      B6   microCards[0]          "sa ugrađenom vidljivošću iskorišćenosti kapaciteta"
 *                               -> "uz jasan pregled iskorišćenosti kapaciteta"
 *      B8   implementation.subtitle "…do go-live faze" -> "…do puštanja u rad"
 *                                  (the PHASE NAME "Go-live & Hypercare" is untouched)
 *      B10  problem.description    "…žive u različitim alatima, uvid dolazi previše kasno."
 *                               -> "…nalaze u različitim alatima, uvid stiže prekasno."
 *      B11  problem.description2   "…marže već potrošene, a fakture već zakasnile."
 *                               -> "…marže već ugrožene, a fakture već kasne."
 *      B13  solution suffix        hyphen -> EN DASH, Serbian punctuation. Scoped to this
 *                                  sentence; the English hyphen is untouched.
 *      B15  valueProposition[1]    "Unapred konfigurisane Best Practices…"
 *                               -> "Unapred konfigurisane SAP Best Practices…"
 *                                  ("SAP Best Practices" is the programme name, not
 *                                   translated further)
 *
 * No figure, product name, methodology phase name, URL or English string changed.
 *
 * ── Translation decisions ──────────────────────────────────────────────────────
 * Left in English, deliberately:
 *   · "ProjectPulse" — the product name.
 *   · "Project-to-Profit" — the named end-to-end flow this product is sold on. Translating
 *     it would break the link to SAP's and Infinus's own materials, and it is the phrase
 *     the hero, the solution card and the final CTA all pivot on.
 *   · "SAP Qualified Partner Packaged Solution", "QPPS", "SAP Cloud ERP", "ERP", "Best
 *     Practices", "WIP", "go-live", "Fit-to-Standard", "UAT", "Hypercare" — SAP programme
 *     and methodology names, and the acronyms clients use unchanged in Serbian.
 *
 * Industry names follow Serbian sentence case, not English Title Case: "IT usluge", not
 * "IT Usluge". The English list is Title Case because that is house style there.
 *
 * Numbers and durations are preserved exactly: 4-6 months -> "4-6 meseci", 2-3 weeks ->
 * "2-3 nedelje", "7 steps" -> "7 koraka". No range was rounded or re-stated.
 *
 * The hero CTA keeps its "60-min" specificity ("60-minutni") and the footer CTA keeps its
 * shorter form, mirroring the English pair of labels rather than unifying them.
 *
 * `valueProposition.items[].description` stays empty in both locales — see the note in the
 * English file; those empty strings are part of the live JSON-LD.
 */

import type { ProjectPulseDictionary } from '../dictionary'

export const projectPulse: ProjectPulseDictionary = {
  page: {
    title: 'ProjectPulse | SAP Qualified Partner-Packaged Solution',
    description:
      'ProjectPulse je SAP Qualified Partner-Packaged Solution (QPPS) za kompanije iz oblasti profesionalnih usluga. ERP rešenje koje povezuje pružanje usluga, planiranje resursa, spremnost za fakturisanje, profitabilnost i vidljivost novčanog toka u jedan proces od početka do kraja.',
    url: 'https://www.infinus.co/sr/projectpulse',
    slug: '/sr/projectpulse',
  },

  hero: {
    backgroundAlt: 'ProjectPulse pozadina',
    badgeAlt: 'SAP Qualified Partner-Packaged Solution',
    title: 'ProjectPulse',
    subtitle: 'Project-to-Profit za kompanije iz oblasti profesionalnih usluga',
    description:
      'ProjectPulse je SAP Qualified Partner Packaged Solution namenjen kompanijama iz oblasti profesionalnih usluga koje žele punu kontrolu nad realizacijom projekata, maržama i novčanim tokom.',
    valueHighlights: [
      'Struktuirana realizacija projekata i disciplina u angažovanju ljudi',
      'Spremnost za fakturisanje i rano uočljive blokade u naplati',
      'Vidljivost marže i novčanog toka u realnom vremenu, po projektu i klijentu',
    ],
    ctaDiscovery: 'Zakažite 60-minutni uvodni razgovor',
    ctaBrochure: 'Preuzmite brošuru',
  },

  industries: [
    'Poslovni konsalting i savetovanje',
    'IT usluge',
    'Razvoj softvera',
    'Outsourcing i upravljane usluge',
    'Kreativne i digitalne usluge',
    'Arhitektura i dizajn',
    'Inženjerske usluge',
    'Pravne usluge',
  ],

  problem: {
    title: 'Izazov',
    description:
      'Kada se projekti, evidencija radnog vremena, troškovi i fakturisanje nalaze u različitim alatima, uvid stiže prekasno.',
    description2:
      'Probleme vidite tek kada su marže već ugrožene, a fakture već kasne.',
    solution: {
      title: 'Rešenje',
      descriptionPrefix: 'ProjectPulse standardizuje ceo vaš ',
      descriptionStrong: 'Project-to-Profit',
      descriptionSuffix:
        ' proces u SAP Cloud ERP-u – od otvaranja projekta i angažovanja ljudi do fakturisanja, profitabilnosti i novčanog toka.',
      description2: 'Jedan sistem. Jedinstven izvor pouzdanih podataka. Jedan proces od početka do kraja.',
    },
  },

  valueProposition: {
    kicker: 'Pregled rešenja',
    title: 'Zašto ProjectPulse',
    items: [
      { title: 'SAP Qualified Partner Packaged Solution (QPPS)', description: '' },
      { title: 'Unapred konfigurisane SAP Best Practices za profesionalne usluge', description: '' },
      { title: 'Ugrađena analitika i AI', description: '' },
      { title: 'Spremno za implementaciju u roku od 4-6 meseci', description: '' },
    ],
  },

  whatYouGain: {
    kicker: 'Koristi',
    title: 'Šta dobijate',
    items: [
      {
        title: 'Struktuirana realizacija i disciplina u angažovanju ljudi',
        description:
          'Pravi ljudi na pravim projektima, sa ugrađenom vidljivošću iskorišćenosti kapaciteta.',
      },
      {
        title: 'Spremnost za fakturisanje bez iznenađenja',
        description: 'Blokade u naplati vidite rano, a ne na kraju meseca.',
      },
      {
        title: 'Vidljivost marže i novčanog toka u realnom vremenu',
        description: 'Profitabilnost po projektu, klijentu i liniji usluga.',
      },
    ],
  },

  idealFor: {
    kicker: 'Namenjeno kompanijama iz oblasti profesionalnih usluga',
    title: 'Idealno za',
  },

  howItWorks: {
    kicker: 'Proces od početka do kraja',
    title: 'Kako funkcioniše',
    subtitle: 'Project-to-Profit u 7 koraka',
    steps: [
      'Otvaranje projekta',
      'Angažovanje ljudi',
      'Realizacija',
      'Kontrola',
      'Fakturisanje',
      'Profitabilnost',
      'Zatvaranje',
    ],
    microCards: [
      {
        title: 'Disciplina u angažovanju ljudi',
        description:
          'Pravi ljudi, pravi projekti, pravo vreme, uz jasan pregled iskorišćenosti kapaciteta.',
      },
      {
        title: 'Signali spremnosti za fakturisanje',
        description: 'Blokade u naplati vidite rano, bez iznenađenja na kraju meseca.',
      },
      {
        title: 'Vidljivost marže i novčanog toka',
        description:
          'Profitabilnost u realnom vremenu po projektu, klijentu i liniji usluga.',
      },
    ],
  },

  outcomes: {
    kicker: 'Rezultati za menadžment',
    title: 'Rezultati po ulozi',
    subtitle: 'Šta ProjectPulse donosi svakom članu menadžmenta',
    outcomesSuffix: 'rezultati',
    roles: {
      CEO: [
        'Vidljivost celog portfolija projekata',
        'Profitabilnost po klijentu i liniji usluga',
        'Podrška strateškim odlukama podacima u realnom vremenu',
      ],
      CFO: [
        'Brži ciklusi fakturisanja',
        'Jasan pregled WIP-a i nefakturisanog prihoda',
        'Vidljivost i planiranje novčanog toka',
        'Usklađenost priznavanja prihoda sa propisima',
      ],
      COO: [
        'Transparentnost iskorišćenosti kapaciteta i naplativosti',
        'Rano otkrivanje odstupanja',
        'Optimizacija planiranja resursa',
      ],
    },
  },

  implementation: {
    kicker: 'Plan implementacije',
    title: 'Implementacija',
    subtitle: 'Tipično 4-6 meseci od početka projekta do puštanja u rad',
    phases: [
      { name: 'Discover', duration: '2-3 nedelje', description: 'Analiza zahteva i usklađenosti' },
      {
        name: 'Fit-to-Standard',
        duration: '4-6 nedelja',
        description: 'Konfiguracija i prilagođavanje',
      },
      { name: 'Build & Integrate', duration: '6-8 nedelja', description: 'Razvoj i integracija' },
      { name: 'Test & Train', duration: '3-4 nedelje', description: 'UAT i obuka korisnika' },
      { name: 'Go-live & Hypercare', duration: '2-4 nedelje', description: 'Puštanje u rad i stabilizacija' },
    ],
  },

  about: {
    title: 'O kompaniji Infinus',
    description:
      'Pomažemo kompanijama iz oblasti profesionalnih usluga da kroz SAP Cloud ERP dobiju strukturu, kontrolu i agilnost potrebne za sledeću fazu rasta.',
    industriesLabel: 'Industrije',
  },

  cta: {
    title: 'Želite da vidite svoj Project-to-Profit tok?',
    description:
      'Zakažite uvodni razgovor i vidite kako ProjectPulse donosi strukturu, vidljivost i kontrolu u vaše poslovanje.',
    primaryCta: 'Zakažite uvodni razgovor',
    secondaryCta: 'Preuzmite brošuru',
    trustNote: 'Odgovaramo u roku od jednog radnog dana',
  },

  schema: {
    breadcrumbHome: 'Početna',
    breadcrumbPage: 'ProjectPulse',
    softwareReleaseNotes: 'SAP Qualified Partner-Packaged Solution za profesionalne usluge',
    howToName: 'Proces implementacije rešenja ProjectPulse',
    industriesListName: 'Industrije koje ProjectPulse pokriva',
    industriesListDescription:
      'Delatnosti iz oblasti profesionalnih usluga koje mogu imati koristi od rešenja ProjectPulse',
    articleAbout: [
      { name: 'SAP Cloud ERP', type: 'Thing' },
      { name: 'Profesionalne usluge', type: 'Thing' },
      { name: 'ProjectPulse', type: 'SoftwareApplication' },
      { name: 'SAP Qualified Partner-Packaged Solution', type: 'Thing' },
    ],
  },

  contactHref: '/sr/contact',
  brochureHref: '/api/projectpulse/pdf?v=2',
  brochureFilename: 'ProjectPulse-Brochure.pdf',
}
