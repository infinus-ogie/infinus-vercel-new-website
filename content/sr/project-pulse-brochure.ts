/**
 * Serbian ProjectPulse brochure copy — /sr/projectpulse/brochure.
 *
 * ── Provenance: OWNER-APPROVED ─────────────────────────────────────────────────
 * Signed off after the full H2/H3 411-string side-by-side review. Translated from
 * content/en/project-pulse-brochure.ts, which remains the source of truth.
 *
 * ── Corrections applied at owner review ─────────────────────────────────────────
 * Sixteen corrections. NO NUMBER CHANGED and no English pricing copy was touched.
 *
 * Pricing (C6) is the one worth reading twice. The English rows repeat the word "from"
 * inside the value ("from EUR 100,000") even though the LABEL already says "(from)". The
 * Serbian labels say "(od)", so the values must not repeat it:
 *      "€9.000 / mesečno"  -> "9.000 EUR mesečno"
 *      "od EUR 100.000"    -> "100.000 EUR"
 * Same magnitudes, same currency, Serbian thousands separators, no duplicated "od".
 *
 * Terminology:
 *      C1   "SAP ugrađena analitika" -> "Ugrađena SAP analitika"; "dashboard-a" ->
 *           "kontrolnih tabli" (drops the half-declined anglicism)
 *      1A   the SAME anglicism in hero.pills[1], left standing at the C1 review because C1
 *           named only the benefits line. Now consistent: both read "kontrolnih tabli".
 *           The English "500+ prebuilt KPIs & dashboards" is unchanged.
 *      C8   "Zdravlje portfolija projekata" -> "Stanje portfolija projekata"
 *      C9   "Komandni centar" -> "Kontrolni centar"
 *      C12  "Potraživanja i obaveze i usaglašavanje sa bankom."
 *        -> "Potraživanja, obaveze i usaglašavanje bankovnih izvoda."
 *      C13  "Trezor…" -> "Trezorsko poslovanje…"
 *
 * "cloud platforma" -> "platforma u cloudu" where the phrase is Serbian prose:
 *      C2   benefits[3]            C16  whyInfinus.footnote
 * The hero title keeps "cloud platformi" (C11), so this is deliberate per-string wording,
 * not a global find-and-replace.
 *
 * Phrasing:
 *      C3   "…menadžment u pokretu." -> "Pristup preko mobilnih uređaja…" (drops the
 *           literal "on the go")
 *      C4   "Jedna cloud osnova" -> "Jedinstvena cloud osnova"
 *      C5   "Vreme do vrednosti…" -> "Brže ostvarivanje poslovne vrednosti…"
 *      C7   "Porazgovarajte…" -> "Razgovarajte…"
 *      C10  "napravljen za kompanije…" -> "namenjen kompanijama…"
 *      C11  "vodite projekte, ljude i profit" -> "upravljajte projektima, timovima i
 *           profitabilnošću"
 *      C14  "20+ implementiranih i podržanih SAP Cloud ERP klijenata." -> "20+ SAP Cloud
 *           ERP klijenata kojima smo implementirali rešenje i pružali podršku."
 *           At the time the count and the claim were identical; only the participle chain
 *           was unwound. The count itself later became 30+ on BOTH sides — see below.
 *      C15  "Priznati kao…" -> "Prepoznati kao…" 
 *
 * ── Translation decisions ──────────────────────────────────────────────────────
 * Left in English, deliberately — these are SAP product names, partner-status names and
 * finance acronyms that Serbian clients use unchanged, and translating them would break the
 * link to the SAP price list and to Infinus's own commercial documents:
 *   · SAP S/4HANA Cloud, SAP SuccessFactors, SAP Integration Suite, SAP Document &
 *     Reporting Compliance, SAP Business AI, Joule Copilot, SAP Sales Cloud, Employee
 *     Central, SAP Cloud ERP, SAP Gold Partner, SAP Top Cloud Performer, SAP Qualified
 *     Partner-Packaged Solution.
 *   · The SuccessFactors module names inside the optional-extensions sentence (Performance
 *     & Goals, Compensation, Learning, Career & Talent, Recruiting / Onboarding) — these
 *     are how the modules are ordered and licensed.
 *   · KPI, DSO, DPO, WIP, AR/AP, DRC, IFRS, T&M, M&A, AI, HR, ERP.
 *   · The three role labels CEO / CFO / COO, and "COO / Delivery" keeps "Delivery".
 *
 * Numbers, ranges and prices are preserved EXACTLY: "3–6 month" -> "3–6 meseci", "500+",
 * "30+", "42 days" -> "42 dana", "82%", "31%", "€9,000 / month" -> "€9.000 / mesečno"
 * and "from EUR 100,000" -> "od EUR 100.000". Only the thousands separator follows Serbian
 * convention (a dot); no figure was rounded, converted or re-stated.
 *
 * ONE figure has since changed, and it changed on BOTH sides at once: the SAP Cloud ERP
 * client count in `whyInfinus.bullets` went from 20+ to 30+ in the final client-feedback
 * round, because the business grew. That is a data update the owner approved, not a
 * translation drift — the English half carries the same 30+.
 *
 * The dashboard mock-up's KPI figures are illustrative in English and stay illustrative
 * here — see the English file.
 *
 * "Infinus d.o.o." is the registered legal name and is not translated or re-inflected.
 *
 * The en dash in "3–6" and the mid-sentence em-dash-style " – " separators match the
 * English typography, which is house style on this page.
 */

import type { ProjectPulseBrochureDictionary } from '../dictionary'

export const projectPulseBrochure: ProjectPulseBrochureDictionary = {
  metadata: {
    title: 'ProjectPulse brošura – SAP Qualified Partner-Packaged Solution',
    description:
      'ProjectPulse je SAP Qualified Partner-Packaged Solution kompanije Infinus za kompanije iz oblasti profesionalnih usluga, koji na jednoj inteligentnoj cloud platformi objedinjuje finansije, projekte, prodaju, nabavku, HR i analitiku.',
  },

  ribbon: {
    left: 'Infinus · SAP Gold Partner',
    right: 'ProjectPulse · SAP Qualified Partner-Packaged Solution',
  },

  hero: {
    kicker: 'Za kompanije iz oblasti profesionalnih usluga',
    title:
      'ProjectPulse: upravljajte projektima, timovima i profitabilnošću na jednoj inteligentnoj cloud platformi.',
    body: 'ProjectPulse je SAP Qualified Partner-Packaged Solution kompanije Infinus, namenjen kompanijama iz oblasti profesionalnih usluga. Objedinjuje finansije, upravljanje projektima i resursima, prodaju, nabavku i osnovni HR – uz podršku SAP ugrađene analitike i SAP Business AI – kako bi automatizovao ceo proces od prilike i ponude do fakture i zatvaranja perioda.',
    pills: [
      'Implementacija u roku od 3–6 meseci',
      '500+ unapred pripremljenih KPI-jeva i kontrolnih tabli',
      'SAP Business AI i ugrađena analitika',
    ],
  },

  dashboard: {
    title: 'Kontrolni centar za menadžment',
    subtitle: 'KPI-jevi u realnom vremenu · AI uvidi',
    portfolio: {
      title: 'Stanje portfolija projekata',
      body: 'Marža, WIP i spremnost za fakturisanje na svim aktivnim projektima.',
    },
    utilization: {
      title: 'Iskorišćenost i kapacitet',
      body: 'Planirani u odnosu na ostvarene naplative časove, po ulozi, regionu i veštini.',
    },
    cash: {
      title: 'Novčani tok i obrtni kapital',
      body: 'DSO, DPO, novčani tok i projekcije likvidnosti na jednom mestu.',
    },
    kpis: [
      { label: 'DSO', value: '42 dana' },
      { label: 'Iskorišćenost', value: '82%' },
      { label: 'Bruto marža', value: '31%' },
    ],
    poweredBy:
      'Zasnovano na SAP S/4HANA Cloud, SAP SuccessFactors, SAP Integration Suite, SAP Document & Reporting Compliance, ugrađenoj analitici i SAP Business AI.',
  },

  challenges: {
    heading: 'Zašto je ProjectPulse potreban kompanijama iz oblasti profesionalnih usluga',
    intro:
      'Objedinjuje finansije, upravljanje projektima i resursima, prodaju, nabavku i osnovni HR – uz podršku SAP ugrađene analitike i SAP Business AI – kako bi automatizovao ceo proces od prilike i ponude do fakture i zatvaranja perioda.',
    items: [
      {
        kicker: 'Izazov · Projekti',
        title: 'Ograničena vidljivost u realnom vremenu',
        body: 'Ne postoji jedno mesto sa pregledom obuhvata, ključnih tačaka, angažovanih ljudi, troškova i spremnosti za fakturisanje po projektu.',
      },
      {
        kicker: 'Izazov · Finansije',
        title: 'Složeno upravljanje prihodom i novčanim tokom',
        body: 'Priznavanje prihoda, WIP i marže rasuti su po tabelama i različitim alatima – zatvaranje perioda je sporo i reaktivno.',
      },
      {
        kicker: 'Izazov · Ljudi',
        title: 'Nedovoljno iskorišćeni ili preopterećeni timovi',
        body: 'Ne postoji zajednički pregled dostupnosti, veština i potreba – zbog čega je teško optimizovati iskorišćenost i izbeći preopterećenost.',
      },
    ],
  },

  byRole: {
    heading: 'Poslovna vrednost po ulozi',
    intro:
      'Menadžment dobija vidljivost profitabilnosti, novčanog toka i iskorišćenosti u realnom vremenu, a projektni timovi kontrolu nad obuhvatom, ključnim tačkama, angažovanjem ljudi i spremnošću za fakturisanje.',
    roles: [
      {
        kicker: 'CEO',
        title: 'Jedinstvena cloud osnova za rast',
        bullets: [
          'Jedinstvena platforma za finansije, projekte, HR, prodaju i nabavku.',
          'Profitabilnost u realnom vremenu po klijentu, regionu i liniji usluga.',
          'Standardizovan operativni model za rast i akvizicije.',
        ],
      },
      {
        kicker: 'CFO',
        title: 'Kontinuirano zatvaranje perioda i predvidive marže',
        bullets: [
          'Priznavanje prihoda po događajima, za projekte po fiksnoj ceni i T&M projekte.',
          'Analitika WIP-a, DSO-a, novčanog toka i marže u realnom vremenu.',
          'Računovodstvo, konsolidacija i grupno izveštavanje u skladu sa IFRS.',
        ],
      },
      {
        kicker: 'COO / Delivery',
        title: 'Kontrola projekata i resursa u realnom vremenu',
        bullets: [
          'Obuhvat, ključne tačke, angažovanje ljudi i spremnost za fakturisanje na jednom mestu.',
          'Planiranje iskorišćenosti i kapaciteta po ulozi, regionu i veštini.',
          'Manje ručnog usklađivanja između projektnih alata i tabela.',
        ],
      },
    ],
  },

  benefits: {
    heading: 'Ključne koristi na jednom mestu',
    items: [
      'Vidljivost performansi i profitabilnosti projekata u realnom vremenu.',
      'End-to-end automatizacija od prilike i ponude do fakture i zatvaranja perioda.',
      'Ugrađena SAP analitika i 500+ unapred pripremljenih KPI-jeva, kontrolnih tabli i preglednih stranica.',
      'Projekti, finansije, prodaja, nabavka i osnovni HR objedinjeni na jednoj platformi u cloudu.',
      'Odlučivanje uz podršku AI, kroz SAP Business AI i Joule Copilot.',
      'Pristup preko mobilnih uređaja za projektne timove i menadžment.',
    ],
  },

  scope: {
    heading: 'Funkcionalni obuhvat',
    intro:
      'Osnovni obuhvat pokriva finansije (AR/AP, zatvaranje perioda, trezor, profitabilnost, konsolidacija), projekte i fakturisanje prema klijentima, nabavku, prodaju usluga, SuccessFactors Employee Central, Integration Suite, DRC lokalizacije i ugrađenu analitiku.',
    groups: [
      {
        title: 'Finansije',
        bullets: [
          'Potraživanja, obaveze i usaglašavanje bankovnih izvoda.',
          'Zatvaranje perioda, konsolidacija i grupno izveštavanje.',
          'Trezorsko poslovanje i upravljanje novčanim tokom.',
          'Analiza profitabilnosti i troškova po više dimenzija.',
          'Priznavanje prihoda po događajima i praćenje WIP-a.',
        ],
      },
      {
        title: 'Projekti i fakturisanje prema klijentima',
        bullets: [
          'Struktuiranje, planiranje i kontrola projekata.',
          'Ključne tačke, budžeti, realizacija i izmene obuhvata.',
          'Upravljanje resursima i angažovanje ljudi po veštinama.',
          'Evidentiranje i odobravanje radnog vremena i troškova.',
          'Scenariji fakturisanja po fiksnoj ceni i po T&M modelu.',
        ],
      },
      {
        title: 'Nabavka i prodaja',
        bullets: [
          'Nabavka usluga i podugovaranje.',
          'Zahtevi za nabavku i nabavne narudžbenice.',
          'Prodaja usluga, ponude i narudžbenice.',
          'Marža i profitabilnost po klijentu i projektu.',
        ],
      },
      {
        title: 'Osnovni HR i analitika',
        bullets: [
          'Matični podaci o zaposlenima i organizaciona struktura.',
          'Raspored rada, odsustva i osnovno evidentiranje radnog vremena.',
          'Ugrađena analitika i pregledne stranice po ulogama.',
          'SAP Business AI Joule Copilot nad operativnim podacima.',
        ],
      },
    ],
    optional: {
      title: 'Opcione nadogradnje',
      body: 'Opcione nadogradnje, kao što su SAP Sales Cloud i dodatni SAP SuccessFactors moduli (Performance & Goals, Compensation, Learning, Career & Talent, Recruiting / Onboarding), mogu se dodati kako vaše poslovanje u oblasti profesionalnih usluga raste.',
    },
  },

  commercial: {
    heading: 'Brže ostvarivanje poslovne vrednosti i komercijalni model',
    intro:
      'Precizno definisana implementacija u roku od 3–6 meseci ubrzava vreme do prve vrednosti, uz jasno određen osnovni obuhvat i nadogradnje.',
    rows: [
      { label: 'Trajanje projekta', value: '3–6 meseci' },
      { label: 'Cloud pretplate (od)', value: '9.000 EUR mesečno' },
      { label: 'Usluge implementacije (od)', value: '100.000 EUR' },
    ],
    footnote:
      'Precizan obuhvat, pravna lica, lokalizacije i opcione nadogradnje potvrđuju se u fazi analize i unose u konačnu ponudu sa fiksnom cenom.',
  },

  whyInfinus: {
    kicker: 'Zašto Infinus',
    title: 'SAP Gold Partner za profesionalne usluge',
    bullets: [
      'SAP Gold Partner sa dokazanom ekspertizom u SAP Cloud ERP-u.',
      '30+ konsultanata fokusiranih na poslovne modele profesionalnih usluga.',
      '30+ SAP Cloud ERP klijenata kojima smo implementirali rešenje i pružali podršku.',
      'Prepoznati kao SAP Top Cloud Performer u regionu.',
    ],
    footnote:
      'Rezultat: projekti u realnom vremenu, usklađeni resursi i predvidive marže na jednoj inteligentnoj platformi u cloudu.',
  },

  cta: {
    kicker: 'Sledeći korak',
    heading: 'Projekti u realnom vremenu. Usklađeni resursi. Predvidive marže.',
    body: 'Razgovarajte sa Infinusom o rešenju ProjectPulse i vidite kako SAP Qualified Partner-Packaged Solution može da modernizuje vaše poslovanje u oblasti profesionalnih usluga za nekoliko meseci, a ne godina.',
    button: 'Zakažite razgovor o rešenju ProjectPulse',
    emailPrefix: 'Ili nam pišite na',
    emailAddress: 'dejan@infinus.co',
    emailSuffix: 'da zatražite kompletnu brošuru i video.',
  },

  copyrightSuffix:
    'Infinus d.o.o. ProjectPulse je SAP Qualified Partner-Packaged Solution za kompanije iz oblasti profesionalnih usluga.',
}
