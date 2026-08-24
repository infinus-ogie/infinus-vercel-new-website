/**
 * Serbian SAP MythBusting landing-page copy (Latin script, ekavian).
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  CLIENT-SUPPLIED SOURCE OF TRUTH.                                              ║
 * ║  VISIBLE PAGE  -> "LP_copy_structure_INFINUS_RS.docx"  (newest)                 ║
 * ║  SEO TITLE/META -> "srp. verzija.docx"  (the LP document carries none)          ║
 * ║  Do NOT rewrite, improve or paraphrase without separate approval.               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ── Two generations of Serbian source, and which one wins ───────────────────────
 * The first Serbian document mirrored the English page: a four-metric trust bar, all ten
 * myths as a list, one form at the bottom. The client then sent a NEW document with a
 * different conversion structure — a split hero with the form and an e-book asset card, a
 * one-line trust bar with two logos, four myth/fact previews instead of ten myth
 * statements, a why-Infinus section, a why-now section, a real FAQ, and a second form.
 *
 * The newer document SUPERSEDES the older one for everything it covers. It carries no SEO
 * metadata, so the title and description below are still the approved ones from "srp.
 * verzija.docx" — that is the only place the older document still governs.
 *
 * The two variants were NOT merged. Where the new document is silent on a technical or
 * legal requirement (the privacy acknowledgement, the English-only note on the asset) the
 * existing implementation is preserved; where it speaks, it wins outright.
 *
 * ── THE APPROVED DEPARTURES FROM THE SUPPLIED TEXT ──────────────────────────────
 *  1. The older source's acknowledgement ended "...pročitali našu Privacy Policy" — an
 *     English legal term inside Serbian body copy, and grammatically wrong in that
 *     accusative slot. It uses the site's approved "Politiku privatnosti" instead. The new
 *     LP document independently confirms this wording in its FAQ ("u skladu sa našom
 *     Politikom privatnosti").
 *  2. The LP document offers the asset card subtitle as "Executive vodič (ili: Praktični
 *     vodič)" — an author's alternative, not two strings. "Executive vodič" is used, being
 *     the first and primary option. Flagged for the owner rather than chosen silently.
 *
 * Nothing else is altered, including the mixed English role plurals and the client's own
 * punctuation and register.
 *
 * ── The e-book is ENGLISH, and that is the intended architecture ────────────────
 * OWNER DECISION, final: there is ONE canonical English PDF and both landing pages link to
 * it. The landing page is bilingual; the downloadable asset is not. No Serbian PDF is
 * missing, expected, or to be fabricated under a translated filename.
 *
 * What that obliges on this side: `form.languageNote` says the asset is in English, and it
 * renders ABOVE both forms. A Serbian visitor must know that before handing over their
 * details, not after.
 */

import type { MythBustersDictionary } from '../dictionary'

export const mythBusters: MythBustersDictionary = {
  metadata: {
    // From "srp. verzija.docx" — the newer LP document supplies no SEO metadata.
    // Ends in "| Infinus", so the route file passes it as title.absolute.
    title: '10 mitova o SAP Cloud ERP-u | Besplatna e-knjiga | Infinus',
    description:
      'Preuzmite besplatnu e-knjigu i otkrijte činjenice iza 10 najčešćih mitova o troškovima, implementaciji, skalabilnosti i poslovnoj vrednosti SAP Cloud ERP rešenja.',
  },

  layout: {
    variant: 'sr-conversion',

    hero: {
      badge: 'Besplatan e-book | PDF | Odmah dostupan',
      title: 'Donosite ERP odluke na osnovu činjenica – ne mitova',
      subtitle: '10 najčešćih zabluda o SAP Cloud ERP-u – jasno objašnjeno.',
      paragraphs: [
        'Mnoge kompanije SAP Cloud ERP i dalje povezuju sa visokim troškovima, složenim projektima ili manjkom fleksibilnosti.',
        'Ovaj e-book pokazuje koje od tih pretpostavki danas više ne važe i kako savremena SAP Cloud ERP rešenja pomažu kompanijama da efikasnije rastu i dugoročno grade održivo poslovanje.',
      ],
      benefitsHeading: 'Zašto vredi preuzeti e-book',
      benefits: [
        'Upoznajte 10 najčešćih mitova o SAP-u.',
        'Donosite informisane ERP odluke na osnovu aktuelnih činjenica.',
        'Otkrijte praktične pristupe za rast i skaliranje poslovanja.',
      ],
    },

    assetCard: {
      title: '10 mitova o SAP Cloud ERP-u',
      // The source offers "Executive vodič (ili: Praktični vodič)" — an author's alternative,
      // not two strings. The owner chose the second.
      subtitle: 'Praktični vodič',
      whatYouGetHeading: 'Šta dobijate',
      items: [
        'PDF vodič',
        'oko 15 minuta čitanja',
        'Odmah dostupno za preuzimanje',
        'Besplatno',
      ],
      coverAlt: 'Naslovna strana e-knjige „10 mitova o SAP Cloud ERP-u“',
    },

    formAssurances: [
      'Odmah dostupno za preuzimanje',
      'Bez spama',
      'Vaši podaci se tretiraju poverljivo',
    ],

    trustBar: {
      statement:
        'Poverenje kompanija koje uspešno razvijaju svoju digitalnu transformaciju uz SAP',
      // The badge sits beside the Infinus mark, with no adjacent text naming either, so both
      // images are MEANINGFUL here and carry real alt text — unlike the homepage badge,
      // which is decorative because a trust pill names the certification next to it.
      sapLogoAlt: 'SAP Gold Partner',
      infinusLogoAlt: 'Infinus',
    },

    audience: {
      heading: 'Da li je ovaj vodič za vas?',
      body:
        'Ovaj e-book je namenjen kompanijama koje žele da modernizuju svoju ERP strategiju i obezbede održiv budući rast.',
      rolesIntro: 'Posebno je koristan za:',
      roles: [
        'generalne i izvršne direktore',
        'CFO rukovodioce',
        'CIO rukovodioce',
        'IT direktore i rukovodioce',
        'rukovodioce digitalizacije i transformacije',
        'srednje velike kompanije u fazi rasta',
      ],
    },

    contents: {
      heading: 'Šta vas očekuje u e-booku',
      intro: 'U vodiču ćete saznati:',
      items: [
        'zašto je SAP Cloud ERP danas znatno fleksibilniji nego što se često pretpostavlja',
        'kako kompanije mogu brže da sprovedu implementaciju',
        'koje prednosti donose savremene cloud arhitekture',
        'kako transparentni modeli troškova omogućavaju sigurnije planiranje',
        'koji kriterijumi su zaista važni pri izboru ERP rešenja',
      ],
    },

    preview: {
      heading: 'Zavirite u e-book',
      mythLabel: 'Mit',
      factLabel: 'Činjenica',
      // FOUR previews, exactly as supplied. This section replaces the old ten-myth list; it
      // is NOT that list shortened, and no fifth pair may be invented for symmetry.
      items: [
        {
          myth: 'SAP Cloud ERP je namenjen samo velikim kompanijama.',
          fact:
            'Savremena SAP Cloud ERP rešenja podržavaju kompanije različitih veličina i mogu da rastu zajedno sa njihovim potrebama.',
        },
        {
          myth: 'SAP Cloud ERP je preskup.',
          fact:
            'Predvidivi subscription modeli donose veću transparentnost i pomažu u smanjenju investicionog rizika.',
        },
        {
          myth: 'Implementacija traje godinama.',
          fact: 'Standardizovane najbolje prakse danas omogućavaju znatno brže projekte.',
        },
        {
          myth: 'Cloud znači manju fleksibilnost.',
          fact:
            'Savremena Cloud ERP rešenja kombinuju standardizaciju sa mogućnošću proširenja.',
        },
      ],
      more: '...i još šest mitova u besplatnom vodiču.',
    },

    whyInfinus: {
      heading: 'Zašto Infinus?',
      paragraphs: [
        'Infinus je SAP Gold Partner sa sedištem u Srbiji, fokusiran na SAP Business Suite rešenja, uključujući Cloud ERP, Business Data Cloud, Business AI i SAP Business Technology Platform.',
        'Tim kombinuje SAP savetovanje, implementaciju, podršku i optimizaciju sa razumevanjem poslovnih procesa i industrija, kako bi kompleksne SAP inicijative pretvorio u jasne i merljive poslovne rezultate.',
      ],
      reasonsHeading: 'Zašto kompanije biraju Infinus',
      reasons: [
        'SAP Gold Partner',
        '30+ iskusnih SAP konsultanata',
        'End-to-end podrška: od savetovanja i implementacije do optimizacije',
        // Already uses the approved "klijentima"; no terminology normalisation was needed.
        'Lokalno prisustvo u Srbiji uz iskustvo na projektima i sa klijentima širom EU',
      ],
    },

    whyNow: {
      heading: 'Zašto baš sada?',
      paragraphs: [
        'Mnoge ERP odluke se i dalje donose na osnovu pretpostavki koje su odavno prevaziđene.',
        'Ako danas procenjujete Cloud ERP, odluku treba zasnivati na aktuelnim činjenicama – ne na iskustvima iz prethodnih generacija ERP sistema.',
        'Ovaj e-book će vam pomoći u tome.',
      ],
    },

    faq: {
      heading: 'Često postavljana pitanja',
      // Genuine question/answer pairs, so this section — and ONLY this section — is also
      // emitted as FAQPage structured data. The myth/fact previews are statements and are
      // deliberately not marked up as FAQ.
      items: [
        { question: 'Da li je e-book besplatan?', answer: 'Da.' },
        { question: 'Kada dobijam pristup e-booku?', answer: 'Odmah nakon slanja forme.' },
        { question: 'U kom formatu je dokument?', answer: 'PDF.' },
        {
          question: 'Da li nakon toga moram da razgovaram sa prodajnim predstavnikom?',
          answer: 'Ne. Najpre dobijate samo pristup e-booku.',
        },
        {
          question: 'Kako se koriste moji podaci?',
          answer:
            'Vaši podaci se obrađuju isključivo u skladu sa našom Politikom privatnosti.',
        },
      ],
    },

    finalCta: {
      heading: 'Spremni za ERP odluke zasnovane na činjenicama?',
      body: 'Preuzmite besplatan e-book i saznajte koji mitovi o SAP-u danas više ne važe.',
      button: 'Preuzmite e-book',
      note: 'PDF • Besplatno • Odmah dostupan',
    },
  },

  form: {
    heading: 'Preuzmite e-book',
    body: 'Popunite kratku formu i e-book će vam odmah biti dostupan.',
    // The NEW source's four fields, in its order. It marks none of them optional, so all
    // four are required — including Zemlja, which replaces the older source's optional
    // "Funkcija ili pozicija". `key` is the API contract and is never translated.
    fields: [
      { key: 'name', label: 'Ime', required: true, validation: 'Unesite svoje ime.' },
      {
        key: 'email',
        label: 'Poslovna e-mail adresa',
        required: true,
        validation: 'Unesite ispravnu poslovnu e-mail adresu.',
      },
      { key: 'company', label: 'Kompanija', required: true, validation: 'Unesite naziv kompanije.' },
      { key: 'country', label: 'Zemlja', required: true, validation: 'Unesite zemlju.' },
    ],
    submit: 'Preuzmite e-book',
    submitting: 'Šalje se...',
    success: {
      eyebrow: 'Hvala na interesovanju!',
      heading: 'Vaš e-book je spreman za preuzimanje.',
      body: 'Hvala na interesovanju za naš vodič „10 mitova o SAP Cloud ERP-u“. Kliknite na dugme ispod da biste odmah preuzeli e-book.',
      downloadLabel: 'Preuzmite e-book',
      downloadNote: 'Preuzimanje počinje odmah nakon klika.',
      // This promise is KEPT ONLY because the application actually sends that email — see
      // sendEbookDeliveryEmail in lib/email.ts — AND it is rendered only when that send
      // actually succeeded. `emailFallback` below replaces it when it did not. Copy that
      // promises a message the system did not send is a lie the visitor can catch.
      emailHeading: 'Kopiju ćete dobiti i putem e-maila.',
      emailBody:
        'Ako želite da dokument ponovo otvorite kasnije, link za preuzimanje poslaćemo i na vašu poslovnu e-mail adresu.',
      emailFallback: 'E-book možete odmah preuzeti pomoću dugmeta ispod.',
      nextHeading: 'Šta je sledeće?',
      nextBody:
        'Da li birate novo ERP rešenje ili planirate sledeći korak digitalne transformacije? Infinus SAP stručnjaci mogu da vas podrže bez obzira na to da li ste tek u fazi evaluacije ili već imate definisane konkretne zahteve.',
      // There is still NO scheduling integration, so this goes to the Serbian Contact page
      // rather than promising a booking flow that does not exist.
      expertCta: 'Razgovarajte sa SAP stručnjakom',
      questionsHeading: 'Imate pitanja?',
      questionsBody: 'Naš tim je tu da vam pomogne.',
      contactCta: 'Kontaktirajte nas',
      contactHref: '/sr/contact',
    },
    error: 'Došlo je do greške. Pokušajte ponovo.',
    // The asset is English by design — see this file's header. The note is what keeps the
    // Serbian page honest about it, and it is shown before submission, not after.
    languageNote: 'E-book je u PDF formatu i dostupan je na engleskom jeziku.',
    // OWNER DECISION: the older source read "...pročitali našu Privacy Policy". Replaced
    // with the site's approved Serbian legal terminology, which the new LP document's own
    // FAQ independently uses. The new document does not repeat this acknowledgement, but a
    // marketing document going quiet on a legal UI requirement does not remove it.
    privacy: {
      before: 'Slanjem formulara potvrđujete da ste pročitali našu ',
      linkText: 'Politiku privatnosti',
      after: '. Vaši podaci biće korišćeni za dostavljanje e-knjige.',
      href: '/sr/politika-privatnosti',
    },
  },

  schema: {
    breadcrumbHome: 'Početna',
    breadcrumbPage: '10 mitova o SAP Cloud ERP-u',
    mythListName: '10 mitova o SAP Cloud ERP-u',
    // The ASSET's name. It is the English e-book, so its name is the English one.
    ebookName: '10 Myths About SAP Cloud ERP',
  },
}
