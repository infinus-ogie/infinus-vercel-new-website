/**
 * Serbian GROW / Professional Services copy — the four historical Serbian pages.
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  EXISTING APPROVED SOURCE. Extracted, not written, and not reviewed again.      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ── Provenance ─────────────────────────────────────────────────────────────────
 * Every value is lifted VERBATIM from the four Serbian route files as they stood at commit
 * 2ca411e:
 *
 *   app/(sr)/grow/page.tsx + _config.ts + layout.tsx
 *   app/(sr)/grow/cfo/page.tsx + layout.tsx + _sections/CfoTimeline.tsx
 *   app/(sr)/grow/ceo/page.tsx + layout.tsx + _sections/CeoTimeline.tsx
 *   app/(sr)/professional-services/page.tsx + _config.ts + layout.tsx
 *
 * Those pages have since moved to app/(sr)/sr/grow/** and
 * app/(sr)/sr/professional-services/, i.e. from /grow to /sr/grow and so on. The move did not
 * touch a single string in this file.
 *
 * This is the SOURCE for the English translation in content/en/growth.ts. Nothing here was
 * reworded, retranslated or tidied — Phase H4 is a translation phase, and rewriting the
 * Serbian during extraction would destroy the only reference the English can be checked
 * against.
 *
 * ── Whitespace, and why it matters ──────────────────────────────────────────────
 * Several originals were multi-line JSX text, which JSX collapses to single spaces. The
 * values here are the COLLAPSED form, i.e. what the DOM actually received, so the Serbian
 * pages render byte-identically after extraction.
 *
 * ── One duplicate deliberately dropped ─────────────────────────────────────────
 * app/(sr)/grow/cfo/page.tsx declared a `cfoItems` array holding a second copy of the ten
 * CFO timeline entries, with literal "\n" line breaks. It was never referenced — the page
 * renders <CfoTimeline/>, which carried its own copy — so it was dead, and its line breaks
 * prove it never reached a page. Only the rendered copy is preserved here.
 *
 * ── One pre-existing defect FIXED, one still preserved ──────────────────────────
 *  1. FIXED. `professionalServices.schema.schemaDownloads` pointed at
 *     /professional-services-materials/, a directory that DOES NOT EXIST — the real files
 *     live in /growth-professional-services-materials/, which is what the page's own visible
 *     download list has always used. Those stale URLs reached the JSON-LD ItemList, so the
 *     page advertised four broken CreativeWork URLs to crawlers.
 *
 *     H4 preserved them, because that phase promised byte-identical Serbian output at an
 *     unchanged URL. The owner's route decision moves this page to /sr anyway, so the promise
 *     no longer binds and the fix was authorised. Both locales now use the real paths and a
 *     test resolves every schema download URL against public/. The visible download links and
 *     the files themselves were always correct and are untouched.
 *  2. ALSO FIXED, in the polish pass that followed. All four pages called <StatPills /> with
 *     no argument and that component defaulted to the ENGLISH dictionary, so these Serbian
 *     pages rendered "30+ experienced consultants" and "20+ satisfied customers" in the middle
 *     of Serbian copy. The strings they should have been using already existed, approved, in
 *     content/sr/home.ts — the Serbian homepage has always used them — so nothing was invented.
 *
 *     The component's `trust` prop is required now, so no call site can inherit the wrong
 *     locale by omission, and each route file passes its own. This is the ONE Serbian visible-
 *     text change in the whole of H4, and it is a correction rather than a rewrite: no Serbian
 *     string in THIS file changed for it.
 *
 * ── The one Serbian value this phase did change ─────────────────────────────────
 * `shared.contactHref` was '/contact' — the ENGLISH contact page — so the closing CTA on all
 * four Serbian pages sent the reader across the language boundary. It is '/sr/contact' now.
 * A destination, not copy: the button's wording is untouched.
 */

import type { GrowthDictionary } from '../dictionary'

export const growth: GrowthDictionary = {
  // ── Copy the four pages share. Extracted once instead of four times. ──────────
  shared: {
    aboutHeading: 'O Infinusu',
    ctaHeading: 'Spremni da razgovaramo?',
    ctaBody: 'Zakažite kratak poziv i proverite kako SAP Cloud ERP može da podrži vaš rast.',
    ctaButton: 'Pošaljite upit',
    ctaNote: 'Odgovaramo u roku jednog radnog dana',
    quickStartHeading: 'A za brzi start (prvih 90 dana)',
    whyHeading: 'Zašto baš sada',
    heroBadgeLabel: 'PROGRAM',
    heroBadgeText: 'GROW with SAP',
    industriesLabel: 'Industrije',
    faqHeading: 'Često postavljana pitanja',
    // The SERBIAN contact page. It was '/contact' — the English one — which sent a Serbian
    // visitor across the language boundary from the closing CTA of every one of these pages.
    contactHref: '/sr/contact',
    // The two FAQ entries /grow, /grow/cfo and /grow/ceo all share, word for word.
    faqShared: [
      {
        question: 'Da li je SAP Cloud ERP prevelik za srednje i brzorastuće firme bez ERP-a?',
        answer: 'Ne. Dizajniran je da brzo krene uz best-practice procese i da se kasnije širi po potrebi.',
      },
      {
        question: 'Kako SAP pomaže oko usklađenosti i standarda?',
        answer: 'Gotove funkcije za lokalne standarde, e-fakturisanje, poreze i međunarodne standarde, uz centralizovane podatke za brže revizije.',
      },
    ],
    resourceList: {
      zipLabel: 'Preuzmi ceo paket (ZIP)',
      defaultTitle: 'Preuzmite materijale za brzorastuće kompanije',
      defaultDescription:
        'Ovde možete preuzeti besplatne materijale koji objašnjavaju kako finansije mogu postati pokretač rasta – i saznajte na konkretnim primerima kako SAP Cloud ERP podržava skaliranje poslovanja.',
    },
  },

  // ── /grow ────────────────────────────────────────────────────────────────────
  grow: {
    metadata: {
      title: 'GROW with SAP: Finansije kao pokretač rasta',
      description:
        'Transformišite finansijsku funkciju da podrži brzi i održivi rast. Za CFO-ove, finansijske menadžere, vlasnike i CEO brzorastućih srednjih kompanija.',
    },
    hero: {
      title: 'GROW with SAP:',
      subtitle: 'Finansije kao pokretač rasta',
      description:
        'Transformišite finansijsku funkciju da podrži brzi i održivi rast. Za CFO-ove, finansijske menadžere, vlasnike i CEO brzorastućih srednjih kompanija koje danas rade bez ERP-a ili sa zastarelim sistemima.',
      ctaText: 'Preuzmite materijale',
    },
    whyBody:
      'Danas finansije nisu samo brojke. CFO i finansijski menadžeri preuzimaju ključnu ulogu u tehnologiji, bezbednosti, ESG zahtevima i usklađenosti. Problem? Ručni, nepovezani procesi i zastareli sistemi ne prate tempo rasta - ograničavaju tačnost, brzinu donošenja odluka i zadovoljstvo klijenata.',
    stats: [
      {
        value: '2',
        suffix: ' od 3',
        label: 'finansijskih direktora kažu da njihovi trenutni sistemi ne mogu da skaliraju uz rast poslovanja.',
      },
      {
        value: '70',
        suffix: '%+',
        label: 'CFO-a navodi da su globalni računovodstveni standardi, bezbednost podataka i usklađenost najveći izazovi.',
      },
      {
        value: '81',
        suffix: '%',
        label: 'finansijskih lidera veruje da će veštačka inteligencija i Cloud ERP imati pozitivan uticaj na strategiju i korporativne finansije.',
      },
    ],
    sourceLabel: 'Izvor:',
    sourceText: 'Oxford Economics (CFO Insights), 2024',
    sourceHref: 'https://www.oxfordeconomics.com/resource/cfo-insights/',
    benefitsHeadingLine1: 'Kako SAP Cloud ERP pomaže',
    benefitsHeadingLine2: 'vašem poslovanju da raste',
    valueCards: [
      {
        title: 'Pojednostavite rad',
        description:
          'Automatizujte procese zatvaranja perioda, upravljanje potraživanjima i obavezama, konsolidaciju i izveštavanje.',
      },
      {
        title: 'Ubrzajte rast',
        description:
          'Koristite industrijski specifične best practice šablone, podržite više entiteta, valuta i jezika i brže uđite na nova tržišta.',
      },
      {
        title: 'Osigurajte uspeh',
        description:
          'Obezbedite jedinstveni izvor finansijske istine, tačne i pravovremene uvide i podršku za sve regulatorne zahteve.',
      },
      {
        title: 'Pripremite se za budućnost',
        description:
          'Integrišite finansije, HR i druge funkcije, uz podršku AI i naprednih analitika za bolje donošenje odluka.',
      },
    ],
    zipUrl: '/downloads/CFO_pack.zip',
    downloads: [
      {
        id: 'cfo-insights',
        title: 'Oxford Economics izveštaj: CFO Insights',
        description:
          'Šta finansijski lideri planiraju i gde su prepreke: skaliranje, usklađenost i uloga AI/Cloud ERP-a.',
        label: 'Research',
        url: '/downloads/CFO_Insights_OxfordEconomics.pdf',
        analyticsId: 'CFO_Insights_OxfordEconomics',
      },
      {
        id: 'finance-checklist',
        title: 'Checklista za CFO i finansijske menadžere',
        description:
          'Ključna pitanja prilikom izbora ERP rešenja - kako pojednostaviti rad, ubrzati rast i obezbediti usklađenost.',
        label: 'Checklist',
        url: '/downloads/Finance_Checklist.pdf',
        analyticsId: 'Finance_Checklist',
      },
      {
        id: 'finance-insights',
        title: 'Infografik: 3 uvida o finansijama i rastu',
        description:
          'Brzi uvidi o procesima koji usporavaju finansije i kako Cloud ERP pomaže u skaliranju.',
        label: 'Infographic',
        url: '/downloads/Finance_3_Insights.pdf',
        analyticsId: 'Finance_3_Insights',
      },
    ],
    focusHeading: 'Fokusirane perspektive',
    focusBody: 'Dublje uvide za različite uloge u organizaciji',
    focusCards: [
      {
        title: 'SAP for CFOs',
        body: '10 dugoročnih prednosti iz CFO perspektive',
        cta: 'Otvori',
        ariaLabel: 'Otvori SAP for CFOs stranicu',
      },
      {
        title: 'SAP for CEOs',
        body: '12 dugoročnih prednosti iz CEO perspektive',
        cta: 'Otvori',
        ariaLabel: 'Otvori SAP for CEOs stranicu',
      },
    ],
    aboutBody:
      'Infinus d.o.o. je SAP Gold Partner sa više od 30 sertifikovanih SAP konsultanata i brojnim regionalnim i međunarodnim referencama. Naš fokus je da pomognemo brzorastućim kompanijama da kroz SAP Cloud ERP dobiju strukturu, kontrolu i agilnost potrebnu za sledeću fazu rasta.',
    faqExtra: {
      question: 'Koja je uloga AI u finansijama?',
      answer: 'AI automatizuje rutinske zadatke i ubrzava uvide, pa timovi donose bolje odluke brže.',
    },
    schema: {
      articleAbout: ['SAP Cloud ERP', 'Finance transformation', 'Midmarket growth'],
      downloadsListName: 'GROW Resources and Downloads',
      downloadsListDescription: 'Resources and downloads for GROW with SAP finance transformation',
      schemaDownloadNames: [
        'Oxford Economics izveštaj: CFO Insights',
        'Checklista za CFO i finansijske menadžere',
        'Infografik: 3 uvida o finansijama i rastu',
      ],
    },
  },

  // ── /grow/cfo and /grow/ceo: structurally identical role pages ────────────────
  cfo: {
    metadata: {
      title: 'SAP for CFOs | Infinus',
      description:
        'SAP Cloud ERP + Business AI — 10 dugoročnih prednosti iz CFO perspektive u odnosu na tradicionalni „ERP + Excel“ pristup.',
      ogImageAlt: 'SAP for CFOs',
    },
    hero: {
      title: 'SAP Cloud ERP + Business AI',
      description:
        '10 dugoročnih prednosti iz CFO perspektive u odnosu na tradicionalni „ERP + Excel“ pristup',
      ctaText: 'Pogledaj prednosti',
    },
    timelineHeading: 'Ključne prednosti iz CFO perspektive',
    timelineDescription: '10 razloga zašto SAP Cloud ERP + Business AI nadmašuje „ERP + Excel"',
    timeline: [
      {
        title: '1) Jedinstvena „single source of truth"',
        body: 'Integrisani finansije, prodaja, nabavka, logistika i operacije - bez excel ostrva, duplih unosa i verzija istog podatka.',
      },
      {
        title: '2) Brže i pouzdanije mesečno zatvaranje',
        body: 'Automatizovana knjiženja, manje ručnog rada, sledljivost korekcija i jasne kontrole.',
      },
      {
        title: '3) Real-time profitabilnost i cash-flow',
        body: 'Profitabilnost po proizvodu/kupcu/kanalu + dnevni pogled na DSO/DPO i potrebe likvidnosti.',
      },
      {
        title: '4) Usklađenost i audit readiness',
        body: 'Podrška za e-Faktura i eOtpremnica (SAP DRC/eDocument), IFRS 15/16, potpuni audit trail.',
      },
      {
        title: '5) Automatizacija AP/AR i banaka',
        body: 'Automatsko usklađivanje izvoda, kontrola kašnjenja, smanjenje grešaka i ubrzana naplata.',
      },
      {
        title: '6) Rolling forecast i „what-if" scenariji',
        body: 'Plan povezan sa operativnim podacima - agilne korekcije budžeta i investicija.',
      },
      {
        title: '7) Ugrađena analitika i Business AI (Joule)',
        body: 'Upiti prirodnim jezikom, prediktivna analitika, detekcija anomalija i automatizacija zadataka.',
      },
      {
        title: '8) Niži TCO i predvidljiv OPEX',
        body: 'Bez lokalnih servera, bez velikih „verzijskih projekata" - automatska ažuriranja u cloudu.',
      },
      {
        title: '9) Sigurnost, dostupnost i kontrola pristupa',
        body: 'Role-based access, enkripcija, SSO, visoka dostupnost, uz ISO i SOC sertifikate.',
      },
      {
        title: '10) Spremnost za rast i M&A',
        body: 'Multi-company/multi-country, konsolidacija i Group Reporting out-of-the-box.',
      },
    ],
    quickStart: [
      { title: 'Kraći monthly closing', detail: '−20% do −30%' },
      { title: 'Dnevni cash-flow forecast', detail: 'direktno iz sistema' },
      { title: 'Profitabilnost po proizvodu/kanalu', detail: 'u realnom vremenu' },
    ],
    aboutBody:
      'Infinus d.o.o. je SAP Gold Partner sa više od 30 sertifikovanih SAP konsultanata i brojnim regionalnim i međunarodnim referencama. Naš fokus je da pomognemo brzorastućim kompanijama da kroz SAP Cloud ERP dobiju strukturu, kontrolu i agilnost potrebnu za sledeću fazu rasta.',
    faqExtra: {
      question: 'Koja je uloga AI u finansijama?',
      answer: 'AI automatizuje rutinske zadatke i ubrzava uvide, pa timovi donose bolje odluke brže.',
    },
    schema: {
      pageName: 'SAP for CFOs',
      articleAbout: ['SAP Cloud ERP', 'Business AI', 'CFO'],
      breadcrumbs: ['Home', 'GROW', 'SAP for CFOs'],
    },
  },

  ceo: {
    metadata: {
      title: 'SAP for CEOs | Infinus',
      description:
        'SAP Cloud ERP + Business AI iz CEO perspektive — kako lider brzorastuće kompanije dobija jedinstven izvor istine, brže odluke i spremnost za rast.',
      ogImageAlt: 'SAP for CEOs',
    },
    hero: {
      title: 'SAP Cloud ERP + Business AI',
      description:
        '12 dugoročnih prednosti iz CEO perspektive u odnosu na tradicionalni "ERP + Excel" pristup',
      ctaText: 'Pogledaj prednosti',
    },
    timelineHeading: 'Ključne prednosti iz CEO perspektive',
    timelineDescription: '12 razloga zašto SAP Cloud ERP + Business AI ubrzava rast i smanjuje rizik',
    timeline: [
      { title: '1) Business AI kao poluga rasta', body: 'Brže analize, uvidi i odluke, bez čekanja izveštaja.' },
      { title: '2) End-to-end pokrivenost svih procesa', body: 'Jedan integrisani sistem za ceo value chain.' },
      {
        title: '3) Brz i pouzdan uvid u svaki element poslovanja',
        body: 'Profitabilnost, cash-flow, margin mix, rizici.',
      },
      {
        title: '4) Rolling forecast i what-if scenariji',
        body: 'Predvidivost rasta i sigurnije investicione odluke (CapEx, M&A).',
      },
      {
        title: '5) Optimizacija poslovanja uz SAP Best Practices',
        body: 'Standardizovani O2C/P2P, niži operativni rizik, veća efikasnost.',
      },
      {
        title: '6) Skaliranje i M&A readiness',
        body: 'Multi-company/multi-country, brza post-merger integracija i konsolidacija.',
      },
      {
        title: '7) Sigurnost i kontinuitet poslovanja',
        body: 'Pouzdan rad bez zastoja, zaštita podataka i kontrolisan pristup; manji operativni rizik.',
      },
      {
        title: '8) Brži time-to-cash i oslobađanje gotovine',
        body: 'Kraći DSO/DIO/DPO, niži obrtni kapital, jača likvidnost.',
      },
      {
        title: '9) Efikasnija alokacija kapitala',
        body: 'Jasan ROI po segmentima; gašenje neprofitabilnih inicijativa, ulaganje u pobednike.',
      },
      {
        title: '10) Revenue assurance (bez curenja prihoda)',
        body: 'Stroža kontrola popusta/rabata i tačno fakturisanje; manje „pojedene" marže.',
      },
      {
        title: '11) Jača pozicija kod banaka i investitora',
        body: 'Transparentni KPI i pouzdani izveštaji ubrzavaju due diligence i poboljšavaju uslove finansiranja.',
      },
      {
        title: '12) Manji key-person rizik',
        body: 'Standardizacija i automatizacija smanjuju zavisnost od pojedinaca i obezbeđuju kontinuitet.',
      },
    ],
    quickStart: [
      { title: 'Brže odluke uz AI', detail: 'upiti na prirodnom jeziku' },
      { title: 'Predvidivost rasta', detail: 'rolling forecast i scenariji' },
      { title: 'Bolji cash-flow', detail: 'kraći DSO/DIO/DPO' },
    ],
    aboutBody:
      'Infinus d.o.o. je SAP Gold Partner sa više od 30 sertifikovanih SAP konsultanata i brojnim regionalnim i međunarodnim referencama. Naš fokus je da pomognemo brzorastućim kompanijama da kroz SAP Cloud ERP dobiju strukturu, kontrolu i agilnost potrebnu za sledeću fazu rasta.',
    faqExtra: {
      question: 'Koja je uloga AI u poslovanju?',
      answer: 'AI automatizuje rutinske zadatke i ubrzava uvide, pa timovi donose bolje odluke brže.',
    },
    schema: {
      pageName: 'SAP for CEOs',
      articleAbout: ['SAP Cloud ERP', 'Business AI', 'CEO'],
      breadcrumbs: ['Home', 'GROW', 'SAP for CEOs'],
    },
  },

  // ── /professional-services ───────────────────────────────────────────────────
  professionalServices: {
    metadata: {
      title: 'GROW with SAP za Professional Services | Infinus',
      description:
        'ERP rešenje za rast, agilnost i profitabilnost u profesionalnim uslugama - preuzmite materijale i zakažite konsultacije.',
      ogImageAlt: 'GROW with SAP za Professional Services',
    },
    hero: {
      title: 'SAP Cloud ERP za Professional Services kompanije',
      description:
        'Upravljajte projektima, resursima, procesima i profitabilnošću uz rešenje koje razume vaš biznis. Efikasan, skalabilan i agilan ERP za firme koje prodaju znanje, vreme i usluge.',
      ctaText: 'Preuzmite materijale',
    },
    whyBody:
      'Profesionalne usluge su pod pritiskom: vrhunsko korisničko iskustvo, privlačenje i zadržavanje talenata i brze tehnološke promene. Kako uskladiti ljude i procese u jednom fleksibilnom sistemu koji omogućava profitabilan i održiv rast?',
    stats: [
      {
        value: '85',
        suffix: '%',
        label: 'firmi u profesionalnim uslugama beleži rast prihoda, ali manje od 70% i rast profitabilnosti',
      },
      {
        value: '40',
        suffix: '%',
        label: 'lidera smatra inovacije i nove poslovne modele ključnim, ali ističu prepreke u skaliranju i zastarele sisteme',
      },
      {
        value: '78',
        suffix: '%',
        label: 'kompanija već koristi Cloud ERP da unapredi agilnost, optimizuje procese i isporuči bolja iskustva klijentima',
      },
      {
        value: '53',
        suffix: '%',
        label: 'planira da usvoji AI u narednih 12 meseci radi veće efikasnosti i produktivnosti',
      },
    ],
    sourceLabel: 'Izvor:',
    sourceText: 'SAP i Oxford Economics istraživanje, 2024',
    sourceHref: 'https://www.oxfordeconomics.com/resource/professional-services-research/',
    benefitsHeadingLine1: 'Kako SAP Cloud ERP pomaže',
    benefitsHeadingLine2: 'uslužnim kompanijama',
    valueCards: [
      {
        title: 'Povežite ljude i procese',
        description: 'Uskladite talente sa potrebama projekata uz digitalne alate, AI i automatizaciju.',
      },
      {
        title: 'Ubrzajte isporuku usluga',
        description:
          'Skratite vreme postavljanja projekata, povećajte preciznost procena i poboljšajte praćenje profitabilnosti.',
      },
      {
        title: 'Otvorite nove izvore prihoda',
        description:
          'Kreirajte i monetizujte nove poslovne modele, od XaaS i pretplata do kombinovanih usluga i digitalnih rešenja.',
      },
      {
        title: 'Postignite konkurentsku prednost',
        description:
          'Obezbedite real-time uvide u marže projekata, iskorišćenost resursa i KPI-jeve kako biste donosili brže i sigurnije odluke.',
      },
    ],
    zipUrl: '/growth-professional-services-materials/Professional_Services_pack.zip',
    downloadsTitle: 'Preuzmite materijale za profesionalne usluge',
    downloadsDescription:
      'Pristupite našoj sveobuhvatnoj kolekciji resursa, istraživanja i vodiča koji će vam pomoći da razvijete profesionalne usluge sa SAP rešenjima.',
    downloads: [
      {
        id: 'proserv-automation',
        title: 'Staying Ahead: How Professional Services firms use automation to become agile',
        description:
          'Istraživanje o tome kako profesionalne uslužne kompanije koriste automatizaciju za postizanje agilnosti i rasta profitabilnosti.',
        label: 'Research',
        url: '/growth-professional-services-materials/34388_Oxford_ProServPartner_91961.pdf',
        analyticsId: 'Oxford_ProServPartner',
      },
      {
        id: 'service-innovation',
        title: 'Rethinking Service Innovation: How business model transformation drives growth',
        description:
          'Analiza transformacije poslovnih modela u profesionalnim uslugama i njihovog uticaja na rast kompanija.',
        label: 'Analysis',
        url: '/growth-professional-services-materials/34390_Oxford_ServInnovPartner_91960.pdf',
        analyticsId: 'Oxford_ServInnovPartner',
      },
      {
        id: 'xaas-infographic',
        title: 'XaaS: How midsize organizations are innovating services (Infographic)',
        description: 'Vizuelni pregled kako srednje kompanije inoviraju usluge kroz XaaS modele poslovanja.',
        label: 'Infographic',
        url: '/growth-professional-services-materials/35353_ServiceInnovationPartnerIG_91829.pdf',
        analyticsId: 'ServiceInnovPartnerIG',
      },
      {
        id: 'xaas-techtarget',
        title: 'How can the XaaS business model drive innovative growth… (TechTarget)',
        description: 'Tehnička analiza XaaS modela poslovanja i njegovog potencijala za inovativni rast kompanija.',
        label: 'Technical Analysis',
        url: '/growth-professional-services-materials/Techtarget-How can the XaaS business model drive innovative growth for your services, software or digital content bu.pdf',
        analyticsId: 'Techtarget_XaaS',
      },
    ],
    aboutBody:
      'Infinus d.o.o. je SAP Gold Partner sa više od 30 sertifikovanih SAP konsultanata i brojnim regionalnim i međunarodnim referencama. Naš fokus je da pomognemo profesionalnim uslužnim kompanijama da kroz SAP Cloud ERP dobiju strukturu, kontrolu i agilnost potrebnu za sledeću fazu rasta.',
    faqs: [
      {
        question: 'Da li je SAP Cloud ERP prevelik za profesionalne uslužne kompanije?',
        answer:
          'Ne. Dizajniran je da brzo krene uz best-practice procese i da se kasnije širi po potrebi. Posebno je pogodan za profesionalne usluge jer omogućava fleksibilnost u upravljanju projektima i resursima.',
      },
      {
        question: 'Kako SAP pomaže oko skaliranja i agilnosti u profesionalnim uslugama?',
        answer:
          'SAP Cloud ERP omogućava centralizovano upravljanje projektima, resursima i finansijama, što omogućava brže skaliranje i bolju agilnost u odgovoru na promene tržišta.',
      },
      {
        question: 'Koja je uloga AI u profesionalnim uslugama?',
        answer:
          'AI automatizuje rutinske zadatke, poboljšava alokaciju resursa i omogućava bolje predviđanje potreba klijenata, što rezultuje većom profitabilnošću i kvalitetom usluga.',
      },
    ],
    schema: {
      articleAbout: ['SAP Cloud ERP', 'Professional Services', 'Business growth'],
      downloadsListName: 'Professional Services Resources and Downloads',
      downloadsListDescription: 'Resources and downloads for GROW with SAP professional services',
      // FIXED, on owner authorisation. These four URLs used to read
      // /professional-services-materials/ — a directory that does not exist — so the JSON-LD
      // ItemList advertised four broken CreativeWork URLs to crawlers while the visible
      // download list beside it pointed at the real files all along.
      //
      // H4 preserved the broken values, because that phase guaranteed byte-identical Serbian
      // output at an unchanged URL. This page is now deliberately moving to /sr, so that
      // constraint no longer applies and the owner authorised the fix. Both locales use the
      // real paths, and a test asserts every schema download URL resolves to a file in
      // public/. The downloadable files themselves are untouched.
      schemaDownloads: [
        {
          name: 'Staying Ahead: How Professional Services firms use automation to become agile',
          url: '/growth-professional-services-materials/34388_Oxford_ProServPartner_91961.pdf',
        },
        {
          name: 'Rethinking Service Innovation: How business model transformation drives growth',
          url: '/growth-professional-services-materials/34390_Oxford_ServInnovPartner_91960.pdf',
        },
        {
          name: 'XaaS: How midsize organizations are innovating services (Infographic)',
          url: '/growth-professional-services-materials/35353_ServiceInnovationPartnerIG_91829.pdf',
        },
        {
          name: 'How can the XaaS business model drive innovative growth… (TechTarget)',
          url: '/growth-professional-services-materials/Techtarget-How can the XaaS business model drive innovative growth for your services, software or digital content bu.pdf',
        },
      ],
    },
  },
}
