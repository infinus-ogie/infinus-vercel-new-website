/**
 * Serbian SAP vs Microsoft Insights article - /sr/insights/sap-vs-microsoft.
 *
 * CLIENT-SUPPLIED SOURCE OF TRUTH, transcribed from "Infinus_SAP_vs_Microsoft_SR.docx".
 * Do NOT rewrite, improve or paraphrase without separate approval.
 *
 * Public copy starts at the document's full title. The "Za Ogija" note above it, with
 * the menu, URL and button lines, is implementation guidance and is not carried across.
 *
 * ── Departures from the document, all owner-approved ────────────────────────────
 * At launch:
 *   1. The SAP Business One sentence gained its availability clause ("koje je
 *      dostupno u cloud-u i on-premise").
 *   2. Every em dash became a spaced hyphen, per the copy rule in CLAUDE.md.
 * After Dejan's review of the published page:
 *   3. That sentence ("Pre nego što donesete konačnu odluku, …") opens its own paragraph
 *      instead of continuing the first one.
 *   4. The partner link reads "B-ONE Solutions" instead of "B-ONE Solutions u Srbiji".
 *      Its destination is unchanged.
 *   5. The closing CTA reads "Zakažite sastanak i zatražite budžetsku ponudu" instead of
 *      the document's "Zakažite prezentaciju i zatražite budžetsku ponudu": Infinus does
 *      not offer a demo to every prospect, so the button invites a meeting. Same button,
 *      same #contact-form target.
 * Otherwise bold runs, link texts and link destinations are exactly the document's.
 *
 * ── Not from the document ───────────────────────────────────────────────────────
 * `metadata.description` is a DRAFT assembled from the document's own headings: the
 * source supplies no SEO description. `metadata.title` is the h1. `schema` feeds JSON-LD
 * only and is never rendered.
 */

import type { SapVsMicrosoftDictionary } from '../dictionary'

export const sapVsMicrosoft: SapVsMicrosoftDictionary = {
  metadata: {
    title: 'SAP ERP vs Microsoft Dynamics 365 Business Central',
    description:
      'Razmišljate o prelasku sa Microsoft Navisiona? Pogledajte gde SAP Cloud ERP ide korak dalje: AI, procesi, finansije, upravljanje grupom i proizvodnja.',
  },

  schema: {
    breadcrumbHome: 'Početna',
    breadcrumbPage: 'SAP vs Microsoft',
  },

  title: 'SAP ERP vs Microsoft Dynamics 365 Business Central',

  intro: {
    heading: 'Razmišljate o prelasku sa Microsoft Navisiona?',
    paragraphs: [
      [
        { kind: 'text', text: 'Ako već koristite Navision, logično je da razmotrite ' },
        { kind: 'strong', text: 'Microsoft Dynamics 365 Business Central' },
        { kind: 'text', text: ', Microsoftovo ERP rešenje za mala i srednja preduzeća.' },
      ],
      [
        { kind: 'text', text: 'Pre nego što donesete konačnu odluku, vredi pogledati i ' },
        { kind: 'strong', text: 'SAP Business One' },
        { kind: 'text', text: ', SAP-ovo rešenje za isti tržišni segment, koje je dostupno u cloud-u i on-premise. ' },
        { kind: 'link', text: 'SAP Business One', href: 'https://www.sap.com/products/erp/business-one.html' },
        { kind: 'text', text: ' · ' },
        { kind: 'link', text: 'B-ONE Solutions', href: 'https://b-one.rs/' },
      ],
      [
        { kind: 'strong', text: 'Šta se u vašem poslovanju promenilo otkako ste uveli Navision?' },
        { kind: 'text', text: ' Ako danas imate složeniju proizvodnju, širite maloprodajnu mrežu ili poslujete u više delatnosti, na više tržišta ili kroz više pravnih lica, vredi proveriti kako vam ' },
        { kind: 'strong', text: 'SAP Cloud ERP' },
        { kind: 'text', text: ', SAP-ovo rešenje za srednja i velika preduzeća, može pomoći da odgovorite na te izazove.' },
      ],
    ],
  },

  comparison: {
    heading: 'Gde SAP Cloud ERP ide korak dalje',
    groups: [
      {
        heading: 'AI',
        items: [
          [
            { kind: 'strong', text: 'Joule Work' },
            { kind: 'text', text: ' - SAP-ova vizija operativnog rada u ERP-u. ' },
            { kind: 'link', text: 'Pogledajte video', href: 'https://www.youtube.com/watch?v=hVEl-itw4fQ&list=PLRFmzdHJ8Y2A' },
          ],
        ],
      },
      {
        heading: 'Procesi',
        items: [
          [
            { kind: 'strong', text: 'SAP Best Practices' },
            { kind: 'text', text: ' - unapred pripremljeni poslovni procesi zasnovani na iskustvu iz SAP implementacija širom sveta. Vaš tim može da ih razmotri, isproba i odluči koje će primeniti.' },
          ],
          [
            { kind: 'strong', text: 'Ugrađena industrijska ekspertiza' },
            { kind: 'text', text: ' - poslovni procesi i funkcionalnosti prilagođeni potrebama pojedinih industrija, zasnovani na dugogodišnjem iskustvu SAP-a sa vodećim svetskim kompanijama.' },
          ],
          [
            { kind: 'strong', text: 'Manja zavisnost od rešenja trećih strana' },
            { kind: 'text', text: ' - napredne funkcionalnosti dostupne su u standardu ili kroz dodatne SAP proizvode. Veći obim koji pokriva SAP može da smanji potrebu za partnerskim dodacima, složenim integracijama i njihovim održavanjem.' },
          ],
        ],
      },
      {
        heading: 'Finansije i upravljanje grupom',
        items: [
          [
            { kind: 'strong', text: 'Više pravnih lica i pogona' },
            { kind: 'text', text: ' - zajednički procesi na nivou grupe, uz odvojene poslovne knjige po pravnom licu.' },
          ],
          [
            { kind: 'strong', text: 'Međukompanijska prodaja' },
            { kind: 'text', text: ' - jedno pravno lice prima porudžbinu, drugo isporučuje, a prodajni i interni dokumenti ostaju povezani.' },
          ],
          [
            { kind: 'strong', text: 'Finansijsko zatvaranje grupe' },
            { kind: 'text', text: ' - automatsko knjiženje međukompanijskih eliminacija po definisanim pravilima.' },
          ],
          [
            { kind: 'strong', text: 'Treasury' },
            { kind: 'text', text: ' - centralni pregled novčanih tokova i likvidnosti, uz upravljanje finansijskim transakcijama i valutnim rizikom.' },
          ],
          [
            { kind: 'strong', text: 'Contract and Lease Management (IFRS 16)' },
            { kind: 'text', text: ' - upravljanje ugovorima o zakupu i obračun vrednosti imovine s pravom korišćenja i obaveza po zakupu.' },
          ],
          [
            { kind: 'strong', text: 'Analiza profitabilnosti' },
            { kind: 'text', text: ' - pregled marže po proizvodu, kupcu ili prodajnom kanalu, uz uvid u komponente troška prodate robe.' },
          ],
          [
            { kind: 'strong', text: 'Kreditni rizik kupaca' },
            { kind: 'text', text: ' - automatske provere koje po definisanim pravilima mogu da zaustave porudžbinu ili isporuku.' },
          ],
        ],
      },
      {
        heading: 'Proizvodnja i operacije',
        items: [
          [
            { kind: 'strong', text: 'Simulacija kapaciteta' },
            { kind: 'text', text: ' - procena kako promene u potražnji ili odluka o kupovini komponente utiču na opterećenje proizvodnje.' },
          ],
          [
            { kind: 'strong', text: 'Sledljivost od sirovine do gotovog proizvoda' },
            { kind: 'text', text: ' - praćenje porekla serije i njene upotrebe kroz više nivoa proizvodnje.' },
          ],
          [
            { kind: 'strong', text: 'Product Costing' },
            { kind: 'text', text: ' - obračun nedovršene proizvodnje i odstupanja na osnovu događaja kao što su utrošak materijala ili potvrda operacije.' },
          ],
          [
            { kind: 'strong', text: 'Dopuna kritičnih materijala' },
            { kind: 'text', text: ' - prilagođavanje nivoa zaliha za dopunu prema potrošnji i vremenu nabavke.' },
          ],
          [
            { kind: 'strong', text: 'Raspodela robe kada je nema dovoljno' },
            { kind: 'text', text: ' - raspodela dostupnih količina po kupcima i periodima prema unapred definisanim pravilima.' },
          ],
          [
            { kind: 'strong', text: 'Kontrola kvaliteta na prijemu' },
            { kind: 'text', text: ' - evidencija sertifikata dobavljača i odluka o tome koji deo pregledane količine može u upotrebu.' },
          ],
          [
            { kind: 'strong', text: 'Preventivno održavanje opreme' },
            { kind: 'text', text: ' - planovi održavanja, radni nalozi i raspoređivanje ekipa.' },
          ],
          [
            { kind: 'strong', text: 'Centralna nabavka za grupu' },
            { kind: 'text', text: ' - pregled i odobravanje zahteva za nabavku iz više povezanih sistema na jednom mestu.' },
          ],
        ],
      },
    ],
  },

  closing: {
    heading: 'Pogledajte SAP na primeru iz svog poslovanja',
    body: [
      { kind: 'text', text: 'SAP Cloud ERP pruža dublju funkcionalnost za složenije poslovanje.' },
      { kind: 'break' },
      { kind: 'text', text: 'Infinus nudi konkurentnu cenu i efikasnu implementaciju za obim koji dogovorimo sa vama.' },
    ],
    cta: 'Zakažite sastanak i zatražite budžetsku ponudu',
  },
}
