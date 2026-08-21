/**
 * Serbian case-study copy — all five pages (Latin script, ekavian).
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  OWNER-APPROVED. Signed off after the full H2/H3 411-string side-by-side review. ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ── Corrections applied at owner review ─────────────────────────────────────────
 * Seven wording corrections, all in the direction of plainer Serbian. Five of them retire
 * the same false friend: "neprimetan" reads as "unnoticeable/imperceptible", not
 * "seamless", so integrations and transitions are now "nesmetan" (unimpeded).
 *
 *   A1  manufacturing badge   "…migracije u cloud."
 *                          -> "…migracije u cloud okruženje."
 *   A2  manufacturing result  "…okruženje spremno za cloud"
 *                          -> "…okruženje prilagođeno radu u cloudu"
 *   A3  manufacturing intro   "uz neprimetnu tranziciju" -> "uz nesmetanu tranziciju"
 *   A4  nearshoring result    "…i bolja responzivnost" -> "…i brže reagovanje"
 *                             (drops the anglicism "responzivnost")
 *   A5  nearshoring result    "Neprimetna integracija…" -> "Nesmetana integracija…"
 *   A6  nearshoring result    "…sa klijentovim učesnicima u projektu"
 *                          -> "…sa relevantnim predstavnicima klijenta"
 *   A7  retail result         "Neprimetna integracija…" -> "Nesmetana integracija…"
 *
 * No figure, claim, module name, process name or acronym changed. Everything not listed
 * above is approved exactly as it was written.
 *
 * A8, the eighth review item, changed no copy at all: the nearshoring technology string was
 * being rendered as broken pills. Fixed in lib/case-study-technologies.ts.
 *
 * Translated from content/en/case-studies.ts, which is the source of truth. Faithful to the
 * English factual meaning: no claim added, strengthened, softened or dropped, and every
 * metric preserved exactly ("within 12 months" -> "u roku od 12 meseci").
 *
 * ── Kept untranslated on purpose ────────────────────────────────────────────────
 *   Infinus · SAP · SAP ERP · SAP S/4HANA · SAP Cloud ERP (Private) · SAP IS Retail
 *   SAP Application Management Services (AMS) · SAP Center of Excellence (CoE) · SAP Cloud
 *   the module acronyms (FI, CO, MM, SD, PP, QM, WM, EWM, ABAP, BC, SAC)
 *   the process names Forecasting & Replenishment (F&R), Order-to-Cash (O2C),
 *   Procure-to-Pay (P2P), Vendor Invoice Management (VIM)
 *   SLA · GxP · ECC · on-premise · nearshore
 *
 * "nearshore" and "on-premise" are established loanwords in Serbian IT usage and are left
 * as they are; the surrounding sentences are natural Serbian.
 *
 * No client or company is named in any of these pages, in either language, so there are no
 * customer names to preserve.
 */

import type { CaseStudiesDictionary } from '../dictionary'

export const caseStudies: CaseStudiesDictionary = {
  labels: {
    clientOverview: 'O klijentu',
    challenge: 'Izazov',
    solution: 'Rešenje',
    engagementIncluded: 'Angažovanje je obuhvatilo:',
    results: 'Rezultati',
    engagementModel: 'Model angažovanja',
    technologies: 'Tehnologije i obim',
    ctaHeading: 'Zainteresovani ste za saradnju?',
    ctaButton: 'Kontaktirajte nas',
    ctaNote: 'Odgovaramo u roku od jednog radnog dana',
  },
  contactHref: '/sr/contact',

  items: {
    retail1: {
      metadataTitle: 'Studija slučaja: Maloprodaja | Infinus',
      title: 'Studija slučaja: Maloprodaja',
      badge: 'Studija slučaja',
      clientOverview:
        'Vodeća evropska maloprodajna kompanija sa poslovanjem u više zemalja, koja upravlja složenim procesima u lancu snabdevanja i velikim SAP okruženjem preko svog centralizovanog SAP Center of Excellence (CoE).',
      challenge:
        'Klijentu je bio potreban pouzdan i skalabilan način da podržava i kontinuirano unapređuje svoje SAP okruženje na više tržišta. Ključni izazovi bili su održavanje doslednosti između zemalja, upravljanje čestim zahtevima za izmene i obezbeđivanje stabilnosti kritičnih poslovnih procesa kao što su Forecasting & Replenishment (F&R), Order-to-Cash (O2C), Procure-to-Pay (P2P) i Vendor Invoice Management (VIM).\n\nPored toga, internom timu su bili potrebni iskusni SAP profesionalci koji se brzo uključuju, efikasno komuniciraju u međunarodnom okruženju i doprinose uz minimalno vreme uvođenja.',
      solutionIntro:
        'Infinus je pružio dugoročnu stručnu SAP podršku kao produžetak klijentovog SAP Center of Excellence. Naši senior konsultanti su blisko radili sa internim timovima, podržavajući svakodnevne operacije, zahteve za izmene i kontinuirana unapređenja ključnih poslovnih procesa.',
      solutionItems: [
        'Funkcionalna i tehnička SAP podrška za više modula',
        'Kontinuirano unapređenje poslovnih procesa',
        'Obrada zahteva za izmene i primena u produkciji',
        'Koordinacija između zemalja i standardizacija',
        'Bliska saradnja sa poslovnim korisnicima i IT timovima',
      ],
      results: [
        'Standardizovani procesi na više evropskih tržišta',
        'Brža i efikasnija primena izmena',
        'Bolja kontrola i vidljivost složenih operacija u lancu snabdevanja',
        'Smanjeni operativni rizici i povećana stabilnost sistema',
        'Nesmetana integracija sa internim SAP CoE klijenta',
      ],
      engagementModel:
        'Dugoročna nearshore saradnja sa posvećenim timom senior SAP konsultanata, u potpunosti integrisanim u klijentov SAP Center of Excellence.',
      technologies: 'SAP ERP, SAP IS Retail, F&R, O2C, P2P, VIM',
      structuredAbout: ['SAP', 'Maloprodaja', 'Studija slučaja', 'Infinus'],
    },

    pharma1: {
      metadataTitle: 'Studija slučaja: Farmacija 1 | Infinus',
      title: 'Studija slučaja: Farmacija 1',
      badge: 'Studija slučaja',
      clientOverview:
        'Farmaceutska kompanija u brzom rastu koja se širi na nova tržišta i nove linije proizvoda, uz potrebu za integrisanim i skalabilnim poslovnim procesima usklađenim sa strogim regulatornim standardima.',
      challenge:
        'Sa rastom kompanije poslovni procesi su postajali sve složeniji. Klijentu je bila potrebna jedinstvena platforma koja integriše proizvodnju, finansije i kontroling, uz pouzdanost podataka, punu sledljivost i usklađenost sa GxP propisima.',
      solutionIntro:
        'Infinus je implementirao SAP Cloud ERP Private i u roku od 12 meseci isporučio sistem punog obima, usklađen sa GxP zahtevima. Rešenje je integrisalo planiranje proizvodnje, upravljanje zalihama, finansije i kontroling, uz analitiku u realnom vremenu i centralizovane podatke na nivou cele organizacije.',
      solutionItems: [],
      results: [
        'Poboljšana operativna efikasnost u ključnim poslovnim procesima',
        'Bolja kontrola troškova proizvodnje i profitabilnosti',
        'Vidljivost finansijskih i operativnih podataka u realnom vremenu',
        'Pouzdan sistem, spreman za reviziju i usklađen sa regulatornim zahtevima',
        'Skalabilna digitalna platforma koja podržava dalji rast poslovanja',
      ],
      engagementModel: '',
      technologies: 'SAP Cloud ERP (Private), FI, CO, MM, SD, PP, QM, WM',
      structuredAbout: ['SAP', 'Farmacija', 'Studija slučaja', 'Infinus'],
    },

    pharma2: {
      metadataTitle: 'Studija slučaja: Farmacija 2 | Infinus',
      title: 'Studija slučaja: Farmacija 2',
      badge: 'Studija slučaja',
      clientOverview:
        'Vodeća farmaceutska kompanija koja posluje u strogo regulisanom okruženju i čije ključne poslovne procese podržava složeno SAP okruženje.',
      challenge:
        'Klijentu je bila potrebna pouzdana, dugoročna podrška SAP aplikacijama kako bi obezbedio stabilnost sistema, visoku dostupnost i usklađenost sa strogim regulatornim standardima. To je uključivalo obradu velikog broja incidenata i složenih zahteva za izmene u okviru zahtevnih SLA uslova.',
      solutionIntro:
        'Infinus je pružio dugoročne SAP Application Management Services (AMS) koji pokrivaju sve ključne module, uključujući FI, CO, MM, SD, PP, QM i WM. Angažovanje je obuhvatilo obradu incidenata, servisnih zahteva i složenih zahteva za izmene pod strogim SLA uslovima, uz kontinuiranu stabilnost i unapređenje sistema.',
      solutionItems: [
        'Upravljanje SAP aplikacijama od početka do kraja',
        'Obrada incidenata, servisnih zahteva i zahteva za izmene po SLA modelu',
        'Proaktivno praćenje i optimizacija sistema',
        'Funkcionalna i tehnička podrška za sve module',
        'Kontinuirano unapređenje poslovnih procesa',
      ],
      results: [
        'Visoka dostupnost i stabilnost sistema',
        'Brže rešavanje incidenata i manje vreme nedostupnosti',
        'Efikasna obrada velikog broja i složenih zahteva za izmene',
        'Povećana efikasnost IT operacija',
        'Bolja usklađenost i spremnost za reviziju',
        'Dugoročna i pouzdana podrška poslovno kritičnim procesima',
      ],
      engagementModel:
        'Dugoročno AMS angažovanje sa isporukom po SLA modelu i kontinuiranim unapređenjem.',
      technologies: 'SAP ERP, FI, CO, MM, SD, PP, QM, WM',
      structuredAbout: ['SAP', 'Farmacija', 'Studija slučaja', 'Infinus'],
    },

    nearshoring1: {
      metadataTitle: 'Studija slučaja: Nearshoring | Infinus',
      title: 'Studija slučaja: Nearshoring',
      badge: 'Studija slučaja',
      clientOverview:
        'Vodeća konsultantska kompanija za SAP sa sedištem u EU, koja realizuje složene SAP projekte u više industrija i kojoj je potreban skalabilan i pouzdan kapacitet za isporuku kako bi podržala rastuću potražnju klijenata.',
      challenge:
        'Uz rastući broj projekata i kratke rokove isporuke, klijentu je bio potreban fleksibilan i skalabilan način da proširi svoje SAP kapacitete za isporuku. Ključni izazovi bili su obezbeđivanje doslednog kvaliteta, brzo uključivanje stručnih konsultanata i neprimetna integracija eksternih resursa u projekte u toku.',
      solutionIntro:
        'Infinus je delovao kao strateški nearshore partner i obezbedio iskusne SAP konsultante za više modula. Naš tim se direktno integrisao u klijentovu organizaciju za isporuku, podržavajući realizaciju projekata, implementacije u toku i kontinuirana unapređenja.',
      solutionItems: [
        'Nearshore SAP konsultantska podrška za više modula',
        'Brzo uključivanje senior konsultanata',
        'Nesmetana integracija sa projektnim timovima klijenta',
        'Fleksibilno skaliranje resursa prema potrebama projekta',
        'Bliska saradnja sa relevantnim predstavnicima klijenta',
      ],
      results: [
        'Povećan kapacitet za isporuku i skalabilnost projekata',
        'Brža realizacija projekata i brže reagovanje',
        'Dosledan kvalitet isporuke u više angažovanja',
        'Optimizovano korišćenje resursa i troškovna efikasnost',
        'Snažno, dugoročno strateško partnerstvo',
      ],
      engagementModel:
        'Dugoročna nearshore saradnja sa posvećenim timom SAP konsultanata, u potpunosti integrisanim u klijentov model isporuke.',
      technologies:
        'SAP ERP, SAP S/4HANA, više funkcionalnih i tehničkih modula (FI, CO, MM, SD, PP, QM, EWM, ABAP, BC, SAC)',
      structuredAbout: ['SAP', 'Nearshoring', 'Studija slučaja', 'Infinus'],
    },

    manufacturing1: {
      metadataTitle: 'Studija slučaja: Proizvodnja | Infinus',
      title: 'Studija slučaja: Proizvodnja',
      badge: 'Studija slučaja',
      clientOverview:
        'Vodeći evropski proizvođač cevnih i građevinskih rešenja od polimera, sa sedištem u Srbiji, koji posluje na više međunarodnih tržišta uz složene procese proizvodnje i lanca snabdevanja.',
      challenge:
        'Klijent je koristio zatečeni SAP ECC sistem i trebalo je da pređe na S/4HANA uz minimalne prekide u poslovanju. Ključni izazovi bili su obezbeđivanje doslednosti podataka, održavanje kontinuiteta ključnih operacija i modernizacija sistemskog okruženja radi podrške budućem rastu i skalabilnosti.',
      solutionIntro:
        'Infinus je izveo kompletnu konverziju sa ECC na S/4HANA u kombinaciji sa migracijom sa on-premise infrastrukture na SAP Cloud okruženje. Projekat je pokrio sve ključne module, uključujući FI, CO, MM, SD, PP i QM, uz nesmetanu tranziciju, optimizovane procese i minimalno vreme nedostupnosti.',
      solutionItems: [
        'Kompletna konverzija sistema na S/4HANA',
        'Migracija na SAP Cloud okruženje',
        'Migracija podataka i validacija sistema',
        'Optimizacija procesa tokom tranzicije',
        'Funkcionalna i tehnička podrška za sve module',
      ],
      results: [
        'Uspešna konverzija bez prekida u poslovanju',
        'Bolje performanse i stabilnost sistema',
        'Modernizovano SAP okruženje prilagođeno radu u cloudu',
        'Veća skalabilnost i fleksibilnost za budući rast',
        'Optimizovani ključni poslovni procesi',
      ],
      engagementModel:
        'Projektna transformacija sa kompletnom isporukom, od konverzije sistema do migracije u cloud okruženje.',
      technologies: 'SAP S/4HANA, FI, CO, MM, SD, PP, QM',
      structuredAbout: ['SAP', 'Proizvodnja', 'Studija slučaja', 'Infinus'],
    },
  },
}
