/**
 * Serbian Careers page copy (Latin script, ekavian).
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  OWNER-APPROVED. The `join` block of content/sr/home.ts, moved unchanged.       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ── Provenance: MOVED, NOT RE-TRANSLATED ────────────────────────────────────────
 * Every value is the Serbian `join` block from content/sr/home.ts, lifted verbatim. The
 * application form left the homepage for a page of its own; re-translating approved copy
 * during a routing change would have quietly put unreviewed Serbian on a live page.
 *
 * Note the Serbian half needed NO grammar correction in this round. The two typos the
 * client flagged ("continues", "interested to become") existed only in English; the Serbian
 * already read "Zbog kontinuiranog rasta poslovanja" and "ako želite da postanete član".
 *
 * ── The two additions ───────────────────────────────────────────────────────────
 *   · `metadata` is NEW — a section has no title or description, a page needs both.
 *   · `structuredDescription` is NEW, for this page's own schema.
 *
 * `privacy` keeps the approved acknowledgement and, importantly, the SERBIAN Privacy
 * Policy URL. The form is untouched: same fields, same rules, same FormData keys, same
 * POST to /api/join-team — the API contract is not translated and does not move.
 */

import type { CareersDictionary } from '../dictionary'

export const careers: CareersDictionary = {
  metadata: {
    // No brand suffix — the root template appends "| Infinus". See the English file.
    title: 'Karijera - pridružite se našem SAP timu',
    description:
      'Rastemo. Ako imate iskustva sa SAP S/4HANA, ECC, industrijskim ili LOB rešenjima i želite da postanete član tima posvećenih SAP profesionalaca, javite nam se.',
  },

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

  structuredDescription:
    'Otvorene pozicije i proces prijave u kompaniji Infinus, SAP Gold Partneru.',
}
