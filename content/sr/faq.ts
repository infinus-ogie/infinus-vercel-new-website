/**
 * Serbian FAQ page copy (Latin script, ekavian).
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  OWNER-APPROVED. Reviewed and signed off after the Phase H1 translation report. ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ── Corrections applied at owner review ─────────────────────────────────────────
 *   items[0]  "obuke za custom razvoj" -> "obuke za razvoj prilagođenih rešenja"
 *   items[1]  "razvoj custom rešenja" -> "razvoj prilagođenih rešenja"
 *   items[3]  "fleksibilne opcije cena" -> "fleksibilne modele cena"
 *   items[5]  "na kojima razumemo" -> "tokom kojih sagledavamo"
 *   items[6]  "Zajedno sa vama razumećemo…" -> "Zajedno ćemo sagledati…"
 *   cta.body  "personalizovane odgovore na vaša konkretna pitanja i zahteve" ->
 *             "odgovore prilagođene vašim konkretnim pitanjima i zahtevima"
 *
 * Translated from content/en/faq.ts, which is the source of truth. All twelve questions
 * are kept in the SAME ORDER with the same identity — the tuple type enforces the count,
 * and order stability matters because the visible accordion and the FAQPage JSON-LD are
 * built from this one array.
 *
 * Faithful to the English factual meaning: no claim added, strengthened, softened or
 * dropped. Preserved exactly as written in English:
 *   · the module and solution acronyms (FI, CO, MM, SD, EWM, PP, PM, QM, SCM, F & R, BW,
 *     DWC, SAC, IBP, ABAP, Fiori, SAP Basis, NetWeaver, SAP Retail, SAP Oil & Gas)
 *   · the T&M / fixed-price engagement models
 *   · the stated hours, 9:00–17:00 CET, Monday to Friday
 *   · "Life Sciences", which Serbian industry usage keeps untranslated
 *
 * `cta.emailHref` keeps the pre-existing contact@infinus.co inconsistency rather than
 * silently correcting it on the Serbian side only.
 */

import type { FaqDictionary } from '../dictionary'

export const faq: FaqDictionary = {
  metadata: {
    title: 'Česta pitanja - SAP usluge',
    description:
      'Pronađite odgovore na najčešća pitanja o SAP uslugama, implementaciji, podršci i našoj ekspertizi kao SAP Gold Partnera.',
  },

  heading: 'Česta pitanja',
  intro:
    'Pronađite odgovore na najčešća pitanja o našim SAP uslugama, procesu implementacije i tome kako možemo da pomognemo u transformaciji vašeg poslovanja uz stručna SAP rešenja.',

  items: [
    {
      question: 'Koje usluge nudite?',
      answer:
        'SAP implementacione usluge - otvoreni smo i za T&M i za fiksni model angažovanja. SAP usluge podrške za postojeći SAP sistem klijenta (za sve module i procese, uključujući standardnu podršku i zahteve za izmene). Druge usluge povezane sa SAP rešenjima, uključujući nadogradnje, transformacije, konverzije, migracije, obuke za razvoj prilagođenih rešenja i usluge kontrole kvaliteta.',
    },
    {
      question: 'Kojim resursima raspolažete?',
      answer:
        'SAP funkcionalni konsultanti sa širokim znanjem i iskustvom u mnogim SAP modulima i rešenjima kao što su FI, CO, MM, SD, EWM, PP, PM, QM, SCM, F & R, SAP Retail i SAP Oil & Gas. SAP developeri koji odlično vladaju ABAP i Fiori tehnologijama za razvoj prilagođenih rešenja i interfejsa usmerenih na korisnika. SAP BC tehnički konsultanti koji na ekspertskom nivou pružaju tehničku podršku, rešavanje problema i rešenja za SAP Basis i NetWeaver. SAP konsultanti za Data & Analytics rešenja koji odlično poznaju BW, DWC, SAC, IBP i druge alate, pružajući klijentima pouzdanu analitiku podataka i rešenja.',
    },
    {
      question: 'Koje su vaše glavne oblasti ekspertize?',
      answer:
        'Ekspertiza po vertikalnim industrijama uključuje: maloprodaju, logistiku, Life Sciences, proizvodnju, avio-industriju, naftu i gas, komunalne usluge i telekomunikacije.',
    },
    {
      question: 'Kakve su vaše cene?',
      answer:
        'Naše cene zavise od konkretnih usluga i rešenja. Nudimo fleksibilne modele cena i zajedno sa vama ćemo napraviti prilagođen plan koji odgovara vašem budžetu i potrebama.',
    },
    {
      question: 'Koje su prednosti korišćenja vaših usluga?',
      answer:
        'Naši iskusni SAP konsultanti donose sveobuhvatno znanje o poslovnim procesima, tehnologijama, tržišnim trendovima i najboljim praksama kako bi pružili konsultantske usluge i rešenja najvišeg nivoa.',
    },
    {
      question: 'Kako izgleda vaš proces rada sa klijentima?',
      answer:
        'Naš proces počinje uvodnim konsultacijama tokom kojih sagledavamo vaše poslovne potrebe i ciljeve. Nakon toga zajedno sa vama identifikujemo oblasti za poboljšanje, pružamo savete o najboljim praksama i prilagođavamo rešenja vašim specifičnim potrebama.',
    },
    {
      question: 'Kako da započnem saradnju?',
      answer:
        'Saradnju možete započeti organizovanjem uvodnog konsultativnog sastanka. Zajedno ćemo sagledati vaše poslovne potrebe i ciljeve i savetovati vas kako najbolje možemo da pomognemo.',
    },
    {
      question: 'Kada ste dostupni?',
      answer:
        'Radno vreme je od 9:00 do 17:00 po srednjoevropskom vremenu (CET), od ponedeljka do petka.',
    },
    {
      question: 'Imate li preporuke klijenata ili studije slučaja?',
      answer: 'Da, na zahtev su dostupne različite preporuke klijenata i studije slučaja.',
    },
    {
      question: 'Kakvi su vaši uslovi poslovanja?',
      answer: 'Naši uslovi poslovanja dostupni su na zahtev.',
    },
    {
      question: 'Imate li garancije?',
      answer:
        'Stojimo iza svojih usluga i posvećeni smo postizanju rezultata. Ako niste zadovoljni rezultatima naših usluga, zajedno sa vama ćemo pronaći rešenje.',
    },
    {
      question: 'Kako da vas kontaktiram ako imam još pitanja?',
      answer: 'Možete nas kontaktirati telefonom ili e-mailom.',
    },
  ],

  cta: {
    heading: 'Imate još pitanja?',
    body:
      'Naši SAP stručnjaci su tu da pomognu. Kontaktirajte nas za odgovore prilagođene vašim konkretnim pitanjima i zahtevima.',
    contactLabel: 'Kontaktirajte nas',
    contactHref: '/sr/contact',
    emailLabel: 'Pišite nam',
    // Same mailbox as the English page — pre-existing inconsistency, preserved.
    emailHref: 'mailto:contact@infinus.co',
  },

  structuredAbout: ['SAP usluge', 'SAP česta pitanja', 'SAP podrška', 'SAP implementacija'],
}
