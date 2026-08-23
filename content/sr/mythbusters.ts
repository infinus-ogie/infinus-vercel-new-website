/**
 * Serbian SAP MythBusting landing-page copy (Latin script, ekavian).
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  CLIENT-SUPPLIED SOURCE OF TRUTH. Transcribed from "srp. verzija.docx".        ║
 * ║  Do NOT rewrite, improve or paraphrase without separate approval.              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * NOT a translation of content/en/mythbusters.ts. The client wrote both documents, so this
 * file is a source in its own right and the two are allowed to differ. They do, visibly:
 * the Serbian hero reads "10 mitova o SAP-u" where the English reads "10 Myths About SAP
 * Cloud ERP", and the Serbian SEO title says "o SAP Cloud ERP-u". Those are the client's
 * choices and are preserved rather than harmonised.
 *
 * ── THE ONE APPROVED DEPARTURE FROM THE SUPPLIED TEXT ───────────────────────────
 * The source's acknowledgement ends:
 *
 *     "Slanjem formulara potvrđujete da ste pročitali našu Privacy Policy."
 *
 * "Privacy Policy" is an English legal term sitting inside Serbian body copy, and it is
 * grammatically wrong in that accusative slot. The site has fully localized legal
 * terminology and uses "Politiku privatnosti" in the Contact form, the Careers form and the
 * consent UI. This file uses that, linking to /sr/politika-privatnosti.
 *
 * That is an OWNER DECISION, not an editorial liberty. Nothing else in the supplied copy is
 * altered, including punctuation and the mixed English role plurals ("CEOs i vlasnici
 * kompanija"), which are the client's own register.
 *
 * ── Structure notes ─────────────────────────────────────────────────────────────
 * As in the English file, the [ZAŠTO PREUZETI E-KNJIGU] section's first block reads as the
 * section lead and is carried as `why.introTitle` / `why.introBody`; the remaining four are
 * `why.items`. The DOCX section markers are editorial labels, not visible copy.
 *
 * ── The e-book is English-only, and the page says so before the form ────────────
 * `form.languageNote` renders ABOVE the fields, not after submission. A Serbian visitor
 * must know the asset's language before handing over their details.
 */

import type { MythBustersDictionary } from '../dictionary'

export const mythBusters: MythBustersDictionary = {
  metadata: {
    // Verbatim. Ends in "| Infinus", so the route file passes it as title.absolute.
    title: '10 mitova o SAP Cloud ERP-u | Besplatna e-knjiga | Infinus',
    description:
      'Preuzmite besplatnu e-knjigu i otkrijte činjenice iza 10 najčešćih mitova o troškovima, implementaciji, skalabilnosti i poslovnoj vrednosti SAP Cloud ERP rešenja.',
  },

  hero: {
    eyebrow: 'Besplatna e-knjiga | PDF | 15 minuta čitanja',
    // The source's hero says "o SAP-u", not "o SAP Cloud ERP-u" as the SEO title does.
    // Client's wording, kept as written.
    titleLine1: '10 mitova o SAP-u.',
    titleLine2: 'Novi pogled na rast.',
    lede:
      'Saznajte šta uspešne kompanije danas rade drugačije i kako SAP Cloud ERP podržava rast bez nepotrebne složenosti, nepredvidivih troškova i dugotrajnih projekata.',
    bullets: [
      'Deset najčešćih SAP Cloud ERP mitova',
      'Činjenice zasnovane na aktuelnim mogućnostima rešenja',
      'Konkretni primeri i rezultati kompanija',
      'Praktični uvidi za donošenje ERP odluka',
    ],
    cta: 'Preuzmite besplatnu e-knjigu',
  },

  trustBar: [
    'SAP Gold Partner',
    '30+ SAP konsultanata',
    '30+ zadovoljnih klijenata',
    '70% konsultanata sa više od 10 godina SAP iskustva',
  ],

  why: {
    introTitle: 'OD PRETPOSTAVKI DO BOLJIH ODLUKA',
    introBody:
      'Odluke o ERP transformaciji često se zasnivaju na iskustvima sa ranijim generacijama sistema. Ova e-knjiga pokazuje šta se promenilo i koje činjenice treba uzeti u obzir prilikom procene SAP Cloud ERP rešenja.',
    items: [
      {
        title: 'REALNIJA PROCENA TROŠKOVA',
        body:
          'Saznajte kako subscription modeli i fit-to-standard pristup mogu učiniti troškove transparentnijim i predvidivijim.',
      },
      {
        title: 'BRŽA I JEDNOSTAVNIJA IMPLEMENTACIJA',
        body:
          'Otkrijte kako unapred definisane najbolje prakse, automatizacija i SAP Activate metodologija ubrzavaju put do poslovne vrednosti.',
      },
      {
        title: 'RAST BEZ DODATNE KOMPLEKSNOSTI',
        body:
          'Razumite kako modularna cloud arhitektura podržava širenje kompanije, ulazak na nova tržišta i povećanje obima poslovanja.',
      },
      {
        title: 'DOKAZIVA POSLOVNA VREDNOST',
        body:
          'Pogledajte kako kompanije ostvaruju merljive rezultate kroz automatizaciju, analitiku i integrisane poslovne procese.',
      },
    ],
  },

  myths: {
    heading: 'Koje mitove razbijamo?',
    items: [
      'SAP je preskup.',
      'SAP je namenjen samo velikim i multinacionalnim kompanijama.',
      'Implementacija SAP rešenja traje predugo i previše je komplikovana.',
      'SAP je teško razumeti i prilagoditi.',
      'Integracija sa postojećim sistemima zahteva mnogo prilagođavanja.',
      'SAP nije namenjen rastućim kompanijama.',
      'SAP nije prilagođen našoj industriji.',
      'Nema dovoljno dokaza o povratu investicije.',
      'SAP je napredan, ali ne donosi dovoljno poslovne vrednosti.',
      'Za njegovo korišćenje potreban je veliki interni SAP tim.',
    ],
    cta: 'Otkrijte svih 10 mitova',
  },

  audience: {
    heading: 'Da li je ova e-knjiga za vas?',
    body:
      'E-knjiga je namenjena rukovodiocima i donosiocima odluka koji razmatraju modernizaciju ERP sistema, žele pouzdaniju osnovu za rast ili procenjuju poslovnu opravdanost prelaska na SAP Cloud ERP.',
    roles: [
      // The source uses the English plurals for the C-level roles. Client's register.
      'CEOs i vlasnici kompanija',
      'CFOs i finansijski rukovodioci',
      'CIOs i IT rukovodioci',
      'Direktori operacija',
      'Rukovodioci digitalne transformacije',
      'Donosioci odluka u rastućim srednjim kompanijama',
    ],
  },

  form: {
    heading: 'Preuzmite besplatnu e-knjigu',
    body: 'Popunite kratku formu i e-knjiga će vam odmah biti dostupna.',
    nameLabel: 'Ime i prezime',
    emailLabel: 'Poslovna email adresa',
    companyLabel: 'Kompanija',
    roleLabel: 'Funkcija ili pozicija – opciono',
    submit: 'Preuzmite e-knjigu',
    submitting: 'Šalje se...',
    validation: {
      name: 'Unesite svoje ime i prezime.',
      email: 'Unesite ispravnu poslovnu email adresu.',
      company: 'Unesite naziv kompanije.',
    },
    success: {
      heading: 'Vaša e-knjiga je spremna',
      body: 'Hvala vam. Preuzimanje bi trebalo da počne automatski — ako ne počne, koristite link ispod.',
      downloadLabel: 'Preuzmite e-knjigu (PDF)',
    },
    error: 'Došlo je do greške. Pokušajte ponovo.',
    languageNote: 'E-knjiga je u PDF formatu i dostupna je na engleskom jeziku.',
    // OWNER DECISION: the source read "...pročitali našu Privacy Policy". Replaced with the
    // site's approved Serbian legal terminology. See this file's header.
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
    ebookName: '10 Myths About SAP Cloud ERP',
  },
}
