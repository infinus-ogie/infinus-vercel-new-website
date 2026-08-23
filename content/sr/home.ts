/**
 * Serbian homepage copy (Latin script, ekavian).
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  OWNER-APPROVED. Reviewed and signed off after the Phase H1 translation report. ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ── Corrections applied at owner review ─────────────────────────────────────────
 *   metadata.title        "Poslovni uspeh kroz SAP ekspertizu" -> "SAP ekspertiza za
 *                         poslovni uspeh"
 *   hero                  "SAP ekspertiza / kao poslovna prednost" -> "Pretvaramo SAP
 *                         ekspertizu / u poslovnu prednost"
 *   hero.lede             "Osnažujemo kompanije" -> "Pomažemo kompanijama"
 *   about.paragraphs[1]   "seniorski SAP konsultanti" -> "senior SAP konsultanti"
 *   services.lede         "poslovni uvid" -> "razumevanje poslovanja"
 *   services.items[2]     "SAP upravljanje aplikacijama i podrška" -> "Upravljanje SAP
 *                         aplikacijama i podrška"
 *   services.items[4]     "custom razvoj" -> "razvoj prilagođenih rešenja"
 *   benefits.lede         "realne poslovne izazove" -> "stvarne poslovne izazove"
 *
 * Translated from content/en/home.ts, which is the source of truth. Faithful to the
 * English factual meaning throughout: no claim added, strengthened, softened or dropped,
 * and every number matches the English side (5 MB, 10 characters, 1 business day).
 *
 * Two figures moved together with English in the final client-feedback round, at the
 * client's request: the client count is now 30+ (the business grew), and the "Deep SAP
 * Expertise" card states 70% of consultants with 10+ years rather than 20+ combined years.
 *
 * ── Kept untranslated on purpose ────────────────────────────────────────────────
 *   Infinus · SAP · SAP Gold Partner · SAP Cloud ERP (Public / Private) · SAP Business AI
 *   SAP Business Technology Platform (BTP) · SAP Business Data Cloud · SAP S/4HANA · ECC
 *   ABAP · BTP · LoB / LOB · SAP Activate · Professional Services · CFO / COO / CEO
 *   the example phone number, name@company.com, the LinkedIn placeholder URL
 *
 * "Professional Services" stays in English because the existing approved Serbian page at
 * /professional-services already uses it that way ("SAP Cloud ERP za Professional
 * Services"), and diverging here would be inconsistent with live Serbian copy.
 *
 * ── Two notes for the reviewer ──────────────────────────────────────────────────
 *  1. The English `join.paragraphs[0]` contains a typo ("Due to continues business
 *     expansion"). The Serbian renders the intended MEANING; the English typo is left
 *     alone because correcting it would change the live English page.
 *  2. `join.privacy` is legal-adjacent. It deliberately mirrors the already-approved
 *     Serbian Contact acknowledgement, with "forme" changed to "prijave". Like the English
 *     original it is informational and NOT the cookie-consent mechanism, so
 *     "pristajete"/"prihvatate" phrasings would be wrong. Worth approving explicitly.
 */

import type { HomeDictionary } from '../dictionary'

export const home: HomeDictionary = {
  metadata: {
    title: 'Infinus - SAP ekspertiza za poslovni uspeh',
    description:
      'Vaš pouzdan partner za SAP ekspertizu. SAP Gold Partner fokusiran na rešenja iz SAP Business Suite portfolija, uključujući SAP Cloud ERP, SAP Business Data Cloud, SAP Business AI i SAP Business Technology Platform.',
  },

  hero: {
    titleLine1: 'Pretvaramo SAP ekspertizu',
    titleLine2: 'u poslovnu prednost',
    lede: 'Pomažemo kompanijama da rade pametnije i rastu brže',
    logoAlt: 'Infinus',
  },

  trust: {
    goldPartner: 'SAP Gold Partner',
    consultants: '30+ iskusnih konsultanata',
    customers: '30+ zadovoljnih klijenata',
  },

  about: {
    title: 'O nama',
    intro:
      'Infinus je SAP Gold Partner specijalizovan za SAP Cloud ERP (Public i Private) i SAP Business AI, sa dubokom ekspertizom u celom SAP Business Suite portfoliju.',
    paragraphs: [
      'Naš tim iskusnih konsultanata kombinuje tehnološko znanje sa razumevanjem poslovnih procesa kako bi pružio SAP konsultantske usluge najvišeg nivoa i prilagođena rešenja koja donose merljive rezultate.',
      'Većina naših stručnjaka su senior SAP konsultanti sa više od decenije profesionalnog iskustva u različitim industrijama, tehnologijama i funkcionalnim oblastima.',
    ],
    bullets: [
      'SAP Cloud ERP (Public i Private)',
      'SAP Business AI',
      'SAP Business Technology Platform (BTP)',
      'SAP Business Data Cloud',
    ],
    ctaLabel: 'Saznajte više',
    ctaHref: '/sr/contact',
    imageAlt: 'SAP Gold Partner',
  },

  services: {
    heading: 'SAP ekspertiza u praksi',
    lede:
      'Kombinujemo razumevanje poslovanja i SAP ekspertizu kako bismo kompanijama pomogli da rade pametnije, brže i sa sigurnošću. Od strategije do podrške, vaš smo pouzdan partner kroz ceo SAP životni ciklus.',
    items: [
      {
        title: 'SAP savetovanje i konsalting',
        body:
          'Definišemo pravu SAP strategiju za vaše poslovanje - usklađujemo tehnologiju sa vašim ciljevima i obezbeđujemo merljive rezultate.',
      },
      {
        title: 'SAP implementacije',
        body:
          'Brze, transparentne i pouzdane implementacije zasnovane na SAP Activate metodologiji i dokazanim najboljim praksama - prilagođene vašem poslovanju.',
      },
      {
        title: 'Upravljanje SAP aplikacijama i podrška',
        body:
          'Kontinuirano praćenje, optimizacija i stručno vođenje kako bi vaš SAP sistem ostao stabilan, bezbedan i ažuran.',
      },
      {
        title: 'SAP integracija i optimizacija procesa',
        body:
          'Povezujemo SAP sa drugim sistemima kako bismo pojednostavili tokove rada, poboljšali vidljivost i uklonili operativne silose.',
      },
      {
        title: 'SAP ekstenzije i inovacije',
        body:
          'Unapređujemo standardne SAP funkcionalnosti kroz razvoj prilagođenih rešenja, analitiku i BTP inovacije prema vašim specifičnim potrebama.',
      },
    ],
    cardHref: '/sr/contact',
  },

  benefits: {
    heading: 'Zašto Infinus',
    lede:
      'Saradnja sa kompanijom Infinus znači rad sa stručnjacima koji razumeju i SAP tehnologiju i stvarne poslovne izazove.',
    items: [
      {
        title: 'Duboka SAP ekspertiza',
        body:
          '70% naših konsultanata ima više od 10 godina praktičnog SAP iskustva u SAP ECC, SAP S/4HANA, ABAP, BTP i line-of-business rešenjima.',
      },
      {
        title: 'Razumevanje poslovanja',
        body:
          'Govorimo jezik CFO-a, COO-a i CEO-a - složene SAP koncepte prevodimo u jasne poslovne rezultate.',
      },
      {
        title: 'Partnerstvo zasnovano na poverenju',
        body:
          'Delujemo kao produžetak vašeg tima - transparentno, odgovorno i u potpunosti usklađeno sa vašim uspehom.',
      },
      {
        title: 'Kompletna podrška od početka do kraja',
        body:
          'Od savetovanja i implementacije do podrške i optimizacije - pokrivamo ceo SAP životni ciklus sa jednim timom.',
      },
      {
        title: 'Agilnost i predvidivost',
        body:
          'Brza realizacija, minimalni prekidi i rezultati koje možete izmeriti - uz SAP Activate metodologiju i najbolje prakse.',
      },
      {
        title: 'Regionalno prisustvo, evropski domet',
        body:
          'Sedište u Srbiji i klijenti širom EU - lokalna posvećenost uz međunarodne standarde.',
      },
    ],
    cardHref: '/sr/contact',
  },

  domains: {
    eyebrow: 'Industrije',
    heading: 'Industrijska ekspertiza',
    lede: 'SAP rešenja prilagođena industriji, uz duboko poznavanje poslovnih procesa.',
    items: [
      { label: 'Maloprodaja', imageAlt: 'Maloprodajna industrija' },
      { label: 'Farmaceutska industrija', imageAlt: 'Farmaceutska industrija' },
      { label: 'Veleprodaja i distribucija', imageAlt: 'Veleprodaja i distribucija' },
      { label: 'Roba široke potrošnje', imageAlt: 'Roba široke potrošnje' },
      { label: 'Industrijska proizvodnja', imageAlt: 'Industrijska proizvodnja' },
      { label: 'Professional Services', imageAlt: 'Professional Services' },
      { label: 'Turizam i putovanja', imageAlt: 'Industrija putovanja' },
      { label: 'Nafta i gas', imageAlt: 'Sektor nafte i gasa' },
      { label: 'Telekomunikacije', imageAlt: 'Telekomunikacije' },
    ],
    modal: {
      // Serbian puts the label after the noun, so the prefix carries the wording and the
      // suffix is empty. The component concatenates prefix + label + suffix either way.
      titlePrefix: 'Ekspertiza: ',
      titleSuffix: '',
      bodyBefore: 'Detaljne informacije o našoj ekspertizi za oblast ',
      bodyAfter:
        ' i o SAP rešenjima biće dostupne uskoro. Radimo na sadržaju koji će vam pomoći da razumete kako možemo da podržimo specifične potrebe vaše industrije.',
      close: 'Zatvori',
      contact: 'Kontaktirajte nas',
      closeAria: 'Zatvori prozor',
      tileAriaSuffix: ' - oblast',
    },
    contactHref: '/sr/contact',
  },

  join: {
    heading: 'Pridružite se našem timu',
    paragraphs: [
      'Zbog kontinuiranog rasta poslovanja, želimo da proširimo naš tim.',
      'Ako imate iskustva u nekim od SAP S/4HANA ili ECC modula i oblasti, industrijskih rešenja i/ili LOB rešenja, i ako želite da postanete član agilnog tima posvećenih SAP profesionalaca, kontaktirajte nas.',
      'Biće nam drago da razgovaramo sa vama!',
    ],
    form: {
      nameLabel: 'Ime i prezime *',
      namePlaceholder: 'Nikola Trivić',
      phoneLabel: 'Broj telefona',
      phonePlaceholder: '+381 64 123 4567',
      phoneHint: 'Uključite pozivni broj zemlje (E.164 format)',
      emailLabel: 'E-mail *',
      emailPlaceholder: 'name@company.com',
      linkedinLabel: 'LinkedIn profil',
      linkedinPlaceholder: 'https://linkedin.com/in/yourprofile',
      subjectLabel: 'Predmet *',
      subjectPlaceholder: 'Pozicija SAP konsultanta',
      messageLabel: 'Poruka *',
      messagePlaceholder: 'Opišite nam svoje SAP iskustvo i zašto želite da se pridružite našem timu...',
      fileLabel: 'Priložite svoj CV (opciono)',
      fileClickToUpload: 'Kliknite da otpremite',
      fileOrDragAndDrop: ' ili prevucite datoteku',
      fileHint: 'PDF, DOC, DOCX (najviše 5 MB)',
      submit: 'Pošaljite prijavu',
      submitting: 'Šalje se...',
      replyPromise: 'Odgovaramo u roku od jednog radnog dana.',
    },
    validation: {
      name: 'Unesite svoje ime i prezime.',
      email: 'Unesite ispravnu e-mail adresu.',
      linkedin: 'Unesite ispravnu LinkedIn adresu.',
      subject: 'Predmet je obavezan.',
      message: 'Poruka mora imati najmanje 10 znakova.',
      fileType: 'Dozvoljene datoteke: PDF, DOC, DOCX.',
      fileSize: 'Najveća dozvoljena veličina datoteke je 5 MB.',
    },
    success: 'Hvala na prijavi. Odgovorićemo vam u najkraćem roku!',
    // Legal-adjacent. Mirrors the approved Serbian Contact sentence: "forme" -> "prijave".
    privacy: {
      before: 'Slanjem prijave potvrđujete da ste pročitali našu ',
      linkText: 'Politiku privatnosti',
      after: '.',
      href: '/sr/politika-privatnosti',
    },
    faq: [
      {
        title: 'Kako da se prijavim?',
        body:
          'Popunite ime, e-mail, telefon, predmet i poruku, priložite CV ako ga imate i kliknite na Pošaljite prijavu. Razmotrićemo prijavu i odgovoriti vam.',
      },
      {
        title: 'Šta se dešava nakon što pošaljem prijavu?',
        body:
          'Naš tim razmatra vašu prijavu i odgovara e-mailom. Ako postoji poklapanje, zakazaćemo uvodni razgovor.',
      },
    ],
  },

  structuredDescription:
    'Vaš pouzdan partner za SAP ekspertizu. SAP Gold Partner fokusiran na rešenja iz SAP Business Suite portfolija.',

  structuredFaq: [
    {
      title: 'Koje usluge pruža Infinus?',
      body:
        'Infinus pruža SAP implementacione usluge (greenfield, brownfield, konverzije, migracije i rollout projekte), SAP usluge podrške (SAP Application Management Services i SLA usluge podrške) i druge usluge (podrška za SAP lokalizaciju, razvoj, obuke i slično).',
    },
    {
      title: 'Koje su prednosti saradnje sa kompanijom Infinus?',
      body:
        'Prednosti uključuju evropski fokus (sedište u Srbiji, CET vremenska zona, usluge širom Evrope), hibridni model rada (rad na lokaciji i udaljeni rad), konkurentne cene (isplative usluge bez ustupaka u kvalitetu) i fleksibilna rešenja (fleksibilni modeli angažovanja prilagođeni vašim potrebama).',
    },
    {
      title: 'Kako da se prijavim?',
      body:
        'Popunite ime, e-mail, telefon, predmet i poruku, priložite CV ako ga imate i kliknite na Pošaljite prijavu. Razmotrićemo prijavu i odgovoriti vam.',
    },
    {
      title: 'Šta se dešava nakon što pošaljem prijavu?',
      body:
        'Naš tim razmatra vašu prijavu i odgovara e-mailom. Ako postoji poklapanje, zakazaćemo uvodni razgovor.',
    },
  ],
}
