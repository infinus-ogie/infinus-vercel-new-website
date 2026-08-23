/**
 * Serbian Contact page copy (Latin script, ekavian).
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  OWNER-APPROVED. Reviewed and signed off after the Phase G translation report. ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Translated from content/en/contact.ts, which remains the source of truth for the pair.
 * Meaning and factual claims are preserved: nothing was added, strengthened, softened or
 * dropped. Proper names (Infinus, SAP, SAP Gold Partner, PDF/DOC/DOCX/TXT,
 * office@infinus.co, infinus.co) are left untranslated. Changing any string here changes
 * live Serbian copy, so treat it the way the English file is treated.
 *
 * ── Corrections applied at owner review ─────────────────────────────────────────
 * Six strings were changed from the drafted wording and are now the approved forms:
 *
 *   details.webLabel                  "Veb: "        -> "Sajt: "
 *   cta.body                          "…ekspertizu"  -> "…znanje i iskustvo"
 *   metadata.title                    "Kontakt …"    -> "Kontaktirajte …"
 *   form.messagePlaceholder           "…zahteve projekta…" -> "…zahteve u vezi sa projektom…"
 *   form.submitting                   "Slanje..."    -> "Šalje se..."
 *   success.attachmentNoticeBody      "Pošaljite …"  -> "Pokušajte da pošaljete …"
 *
 * ── Two strings that were approved BEFORE this file existed ─────────────────────
 *  1. `privacy` — the acknowledgement sentence and its link text were already approved and
 *     are used verbatim. Do not reword them. Like the English original it is informational,
 *     NOT the cookie-consent mechanism, so "pristajete" / "prihvatate" phrasings are wrong.
 *  2. `details.address` — "Trešnjinog cveta 1, 11070 Beograd" is copied verbatim from the
 *     approved Serbian legal text in content/legal/politika-privatnosti.ts rather than
 *     transliterated from the English page's ASCII "Tresnjinog cveta 1, Belgrade, Serbia".
 *     The English page keeps its existing wording; only the Serbian side uses the approved
 *     Serbian form, with the š the street name actually has.
 *
 * Diacritics are correct throughout: č ć š ž đ. No ASCII approximations.
 */

import type { ContactDictionary } from '../dictionary'

export const contact: ContactDictionary = {
  metadata: {
    title: 'Kontaktirajte Infinus - Stručna SAP podrška',
    description:
      'Kontaktirajte naše SAP stručnjake za implementaciju, podršku i konsultantske usluge. Obratite se kompaniji Infinus, vašem pouzdanom SAP Gold Partneru.',
  },

  hero: {
    heading: 'Započnite svoju SAP transformaciju',
    description:
      'Da li ste spremni da transformišete svoje poslovanje uz SAP? Obratite se našem timu stručnjaka za implementaciju, podršku i konsultantske usluge. Tu smo da vam pomognemo da ostvarite svoje poslovne ciljeve.',
  },

  details: {
    heading: 'Kontakt podaci',
    emailLabel: 'E-mail: ',
    addressLabel: 'Adresa: ',
    webLabel: 'Sajt: ',
    email: 'office@infinus.co',
    // Verbatim from the approved Serbian legal text. See the header note.
    address: 'Trešnjinog cveta 1, 11070 Beograd',
    web: { label: 'infinus.co', url: 'https://infinus.co' },
  },

  form: {
    nameLabel: 'Ime *',
    namePlaceholder: 'Vaše ime i prezime',
    phoneLabel: 'Telefon',
    phonePlaceholder: 'Broj telefona',
    emailLabel: 'E-mail *',
    // A technical example address, not copy — deliberately identical in both locales.
    emailPlaceholder: 'your.email@example.com',
    subjectLabel: 'Predmet *',
    subjectPlaceholder: 'Ukratko opišite temu upita',
    messageLabel: 'Poruka *',
    messagePlaceholder: 'Opišite nam svoje SAP potrebe ili zahteve u vezi sa projektom...',
    attachmentLabel: 'Prilog',
    attachmentHint: 'Podržani formati: PDF, DOC, DOCX, TXT (najviše 10 MB)',
    attachmentButton: 'Izaberi fajl',
    attachmentEmpty: 'Nijedan fajl nije izabran',
    submit: 'Pošaljite poruku',
    submitting: 'Šalje se...',
  },

  validation: {
    name: 'Ime mora imati najmanje 2 znaka',
    email: 'Neispravna e-mail adresa',
    subject: 'Predmet mora imati najmanje 5 znakova',
    message: 'Poruka mora imati najmanje 10 znakova',
  },

  success: {
    heading: 'Hvala vam!',
    body: 'Vaša poruka je uspešno poslata. Odgovorićemo vam u najkraćem roku.',
    sendAnother: 'Pošaljite novu poruku',
    attachmentNoticeHeading: 'Obaveštenje o prilogu',
    attachmentNoticeBody:
      'Vaša poruka je uspešno poslata, ali prilog nije mogao da bude obrađen. Pokušajte da pošaljete datoteku odvojeno ili nas kontaktirajte direktno.',
  },

  // Set on `errors.general`, which the component never renders. Known bug, untouched.
  errors: {
    submitFailed: 'Slanje poruke nije uspelo. Pokušajte ponovo.',
    unexpected: 'Došlo je do greške. Pokušajte ponovo.',
  },

  // Approved before this file existed, and used verbatim. Do not reword.
  privacy: {
    before: 'Slanjem obrasca potvrđujete da ste pročitali našu ',
    linkText: 'Politiku privatnosti',
    after: '.',
    href: '/sr/politika-privatnosti',
  },

  cta: {
    heading: 'Spremni da počnete?',
    body:
      'Pridružite se zadovoljnim klijentima koji su transformisali svoje poslovanje uz naše SAP znanje i iskustvo. Kontaktirajte nas već danas za besplatne konsultacije.',
    cards: [
      {
        title: 'Tim stručnjaka',
        body: 'Sertifikovani SAP stručnjaci sa dubokim poznavanjem industrije',
      },
      {
        title: 'Besplatne konsultacije',
        body: 'Stručan savet o vašim potrebama za SAP implementaciju',
      },
      {
        title: 'Brz odgovor',
        body: 'Na sve upite odgovaramo u roku od 24 sata',
      },
    ],
  },
}
