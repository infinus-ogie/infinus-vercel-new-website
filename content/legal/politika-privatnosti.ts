/**
 * APPROVED LEGAL COPY — DO NOT EDIT.
 *
 * Source document : Politika Privatnosti Infinus v2.docx
 * Source SHA-256  : 34af9e119303ffaeda2162f34cc293274ec6b38190562190d1a917b5b85353b6
 * Approved / last updated : 10 August 2026
 * Transcribed     : mechanically from the .docx (not retyped), preserving every
 *                   paragraph, list item, line break, bold run and hyperlink target.
 *
 * This file contains two INDEPENDENTLY APPROVED legal documents (Serbian and
 * English). They are NOT a translation pair.
 *
 * DO NOT, without written owner/legal approval:
 *   - reword, summarise, "improve" or re-translate any sentence;
 *   - merge, deduplicate or cross-reference the two versions;
 *   - add cookie tables, provider names, durations or any new legal statement;
 *   - move this file into content/en/** or content/sr/**, or feed it through the
 *     marketing translation dictionaries introduced in a later phase. Legal copy
 *     is deliberately kept outside that system so no refactor can rewrite it.
 *
 * Only presentation is owned by the renderer (headings, lists, spacing, anchors).
 *
 * ── AMENDMENT, 24 August 2026 — PENDING LEGAL REVIEW ───────────────────────────
 * One paragraph was ADDED to section 2 of EACH document ("Koje podatke obrađujemo i
 * zašto" / "Data we process and why"), on the owner's explicit written instruction,
 * disclosing that public forms are protected by Google reCAPTCHA.
 *
 * It is required because the forms security phase made form submission contact Google:
 * reCAPTCHA is a functional anti-abuse dependency, loaded only when a form is actually
 * submitted, and deliberately NOT behind the cookie-consent gate. The processing was
 * therefore real and undisclosed.
 *
 * These two paragraphs are the ONLY text in this file that did not come from the source
 * .docx, so the SHA-256 above no longer covers the file as it now stands. Nothing else was
 * reworded, reordered or removed, and no consent language was added.
 *
 * FLAGGED FOR DEJAN'S REVIEW. Until signed off, treat these two paragraphs — and only
 * these two — as draft legal copy.
 */

export type LegalInline =
  | { t: 'text'; v: string }
  | { t: 'bold'; v: string }
  | { t: 'link'; v: string; href: string }
  | { t: 'break' }

export type LegalBlock =
  | { t: 'h1'; c: LegalInline[] }
  | { t: 'h2'; c: LegalInline[] }
  | { t: 'p'; c: LegalInline[] }
  | { t: 'ul'; items: LegalInline[][] }

export interface LegalDocument {
  /** BCP-47 tag for the <section lang> attribute. */
  lang: string
  /** In-page switcher label. */
  label: string
  /** In-page anchor id. */
  anchor: string
  blocks: LegalBlock[]
}

/** The approved source document's own last-updated date. */
export const PRIVACY_POLICY_UPDATED = '2026-08-10' as const

export const PRIVACY_POLICY_DOCUMENTS: readonly LegalDocument[] = [
  {
    "lang": "sr-Latn",
    "label": "Srpski",
    "anchor": "srpski",
    "blocks": [
      {
        "t": "h1",
        "c": [
          {
            "t": "bold",
            "v": "Politika privatnosti"
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "bold",
            "v": "Poslednje ažuriranje: 10. avgust 2026."
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Ova politika objašnjava kako INFINUS d.o.o. obrađuje podatke o posetiocima sajtova "
          },
          {
            "t": "bold",
            "v": "infinus.rs"
          },
          {
            "t": "text",
            "v": " i "
          },
          {
            "t": "bold",
            "v": "infinus.co"
          },
          {
            "t": "text",
            "v": "."
          }
        ]
      },
      {
        "t": "h2",
        "c": [
          {
            "t": "text",
            "v": "1. Ko obrađuje podatke"
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Rukovalac podacima je:"
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "INFINUS d.o.o. Beograd"
          },
          {
            "t": "break"
          },
          {
            "t": "text",
            "v": "Trešnjinog cveta 1, 11070 Beograd"
          },
          {
            "t": "break"
          },
          {
            "t": "text",
            "v": "Matični broj: 21568325"
          },
          {
            "t": "break"
          },
          {
            "t": "text",
            "v": "E-mail: "
          },
          {
            "t": "link",
            "v": "office@infinus.rs",
            "href": "mailto:office@infinus.rs"
          }
        ]
      },
      {
        "t": "h2",
        "c": [
          {
            "t": "text",
            "v": "2. Koje podatke obrađujemo i zašto"
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Možemo obrađivati:"
          }
        ]
      },
      {
        "t": "ul",
        "items": [
          [
            {
              "t": "text",
              "v": "podatke iz kontakt forme: ime, e-mail, broj telefona, naslov i sadržaj poruke, kao i dostavljeni prilog;"
            }
          ],
          [
            {
              "t": "text",
              "v": "podatke kandidata za posao: kontakt podatke, LinkedIn adresu, biografiju i druge podatke koje kandidat dostavi;"
            }
          ],
          [
            {
              "t": "text",
              "v": "tehničke podatke o poseti sajtu, kao što su IP adresa, vrsta uređaja i pregledača, posećene stranice i vreme posete."
            }
          ]
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Podatke koristimo radi:"
          }
        ]
      },
      {
        "t": "ul",
        "items": [
          [
            {
              "t": "text",
              "v": "odgovaranja na upite i pripreme ili izvršenja poslovne saradnje;"
            }
          ],
          [
            {
              "t": "text",
              "v": "sprovođenja postupka zapošljavanja;"
            }
          ],
          [
            {
              "t": "text",
              "v": "bezbednog i pouzdanog rada sajta;"
            }
          ],
          [
            {
              "t": "text",
              "v": "analize posećenosti, samo uz pristanak posetioca kada je on potreban;"
            }
          ],
          [
            {
              "t": "text",
              "v": "ispunjavanja zakonskih obaveza i zaštite pravnih interesa društva."
            }
          ]
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Pravni osnov obrade može biti preduzimanje radnji na Vaš zahtev pre zaključenja ugovora, izvršenje ugovora, zakonska obaveza, legitimni interes INFINUS-a ili Vaš pristanak."
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Polja označena zvezdicom neophodna su da bismo odgovorili na upit ili razmotrili prijavu. Ostali podaci su dobrovoljni."
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Javne forme su zaštićene Google reCAPTCHA mehanizmom radi sprečavanja spama i automatizovanih zloupotreba. Prilikom slanja forme, određeni podaci mogu biti obrađeni od strane Google-a u ovu bezbednosnu svrhu, u skladu sa važećim Google pravilima privatnosti."
          }
        ]
      },
      {
        "t": "h2",
        "c": [
          {
            "t": "text",
            "v": "3. Kolačići i analitika"
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Sajt koristi neophodne tehničke podatke i kolačiće potrebne za njegovo funkcionisanje i bezbednost."
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Google Analytics i drugi nenužni analitički ili marketinški kolačići mogu se aktivirati samo nakon Vašeg pristanka. Pristanak možete odbiti ili kasnije opozvati preko podešavanja kolačića. Odbijanje nenužnih kolačića ne utiče na osnovno korišćenje sajta."
          }
        ]
      },
      {
        "t": "h2",
        "c": [
          {
            "t": "text",
            "v": "4. Ko može imati pristup podacima"
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Podacima mogu pristupiti ovlašćeni zaposleni INFINUS-a i pružaoci usluga hostinga, održavanja sajta, elektronske pošte, analitike i druge tehničke podrške, samo u meri potrebnoj za obavljanje njihovih poslova. Podaci se mogu dostaviti državnim organima kada je to propisano zakonom."
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Sajt je hostovan preko platforme Vercel, a za analitiku može koristiti Google Analytics. Zbog toga se određeni tehnički podaci mogu obrađivati izvan Srbije, uključujući SAD. Takav prenos vrši se samo uz primenu odgovarajućih ugovornih i drugih mera zaštite propisanih zakonom."
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Podatke ne prodajemo."
          }
        ]
      },
      {
        "t": "h2",
        "c": [
          {
            "t": "text",
            "v": "5. Koliko dugo čuvamo podatke"
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Podatke čuvamo samo dok su potrebni za svrhu zbog koje su prikupljeni:"
          }
        ]
      },
      {
        "t": "ul",
        "items": [
          [
            {
              "t": "text",
              "v": "podatke iz poslovnih upita – do završetka komunikacije i nakon toga koliko je potrebno radi zaštite pravnih interesa;"
            }
          ],
          [
            {
              "t": "text",
              "v": "podatke kandidata – do završetka izbora, a najduže šest meseci, osim ako kandidat pristane na duže čuvanje radi budućih prilika;"
            }
          ],
          [
            {
              "t": "text",
              "v": "tehničke i analitičke podatke – u rokovima podešenim u servisima koje koristimo."
            }
          ]
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Podaci se mogu čuvati duže kada to nalaže zakon ili kada su potrebni za ostvarivanje ili odbranu pravnog zahteva."
          }
        ]
      },
      {
        "t": "h2",
        "c": [
          {
            "t": "text",
            "v": "6. Vaša prava"
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "U skladu sa Zakonom o zaštiti podataka o ličnosti možete, kada su ispunjeni zakonski uslovi, zahtevati:"
          }
        ]
      },
      {
        "t": "ul",
        "items": [
          [
            {
              "t": "text",
              "v": "pristup podacima i njihovu kopiju;"
            }
          ],
          [
            {
              "t": "text",
              "v": "ispravku, brisanje ili ograničenje obrade;"
            }
          ],
          [
            {
              "t": "text",
              "v": "prenosivost podataka;"
            }
          ],
          [
            {
              "t": "text",
              "v": "podnošenje prigovora;"
            }
          ],
          [
            {
              "t": "text",
              "v": "opoziv pristanka, bez uticaja na zakonitost ranije obrade."
            }
          ]
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Zahtev možete poslati na "
          },
          {
            "t": "link",
            "v": "office@infinus.rs",
            "href": "mailto:office@infinus.rs"
          },
          {
            "t": "text",
            "v": ". Imate i pravo da podnesete pritužbu Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti, putem sajta "
          },
          {
            "t": "link",
            "v": "poverenik.rs",
            "href": "https://www.poverenik.rs/"
          },
          {
            "t": "text",
            "v": "."
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Ne donosimo odluke koje proizvode pravne ili slične značajne posledice isključivo automatizovanom obradom Vaših podataka."
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Ovu politiku možemo povremeno izmeniti. Važeća verzija uvek će biti objavljena na ovoj stranici."
          }
        ]
      }
    ]
  },
  {
    "lang": "en",
    "label": "English",
    "anchor": "english",
    "blocks": [
      {
        "t": "h1",
        "c": [
          {
            "t": "bold",
            "v": "Privacy Policy"
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "bold",
            "v": "Last updated: 10 August 2026"
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "This Privacy Policy explains how INFINUS d.o.o. processes personal data relating to visitors of "
          },
          {
            "t": "bold",
            "v": "infinus.rs"
          },
          {
            "t": "text",
            "v": " and "
          },
          {
            "t": "bold",
            "v": "infinus.co"
          },
          {
            "t": "text",
            "v": "."
          }
        ]
      },
      {
        "t": "h2",
        "c": [
          {
            "t": "text",
            "v": "1. Data controller"
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "The data controller is:"
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "INFINUS d.o.o. Beograd"
          },
          {
            "t": "break"
          },
          {
            "t": "text",
            "v": "Trešnjinog cveta 1, 11070 Belgrade, Serbia"
          },
          {
            "t": "break"
          },
          {
            "t": "text",
            "v": "Company registration number: 21568325"
          },
          {
            "t": "break"
          },
          {
            "t": "text",
            "v": "Email: "
          },
          {
            "t": "link",
            "v": "office@infinus.rs",
            "href": "mailto:office@infinus.rs"
          }
        ]
      },
      {
        "t": "h2",
        "c": [
          {
            "t": "text",
            "v": "2. Data we process and why"
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "We may process:"
          }
        ]
      },
      {
        "t": "ul",
        "items": [
          [
            {
              "t": "text",
              "v": "contact form data, including your name, email address, telephone number, subject, message and any attachment;"
            }
          ],
          [
            {
              "t": "text",
              "v": "job application data, including contact details, LinkedIn profile, CV and other information submitted by the applicant;"
            }
          ],
          [
            {
              "t": "text",
              "v": "technical information about your visit, such as your IP address, device and browser type, pages visited and time of access."
            }
          ]
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "We process this information to:"
          }
        ]
      },
      {
        "t": "ul",
        "items": [
          [
            {
              "t": "text",
              "v": "respond to enquiries and prepare or perform a business relationship;"
            }
          ],
          [
            {
              "t": "text",
              "v": "manage recruitment processes;"
            }
          ],
          [
            {
              "t": "text",
              "v": "maintain the security and reliable operation of the website;"
            }
          ],
          [
            {
              "t": "text",
              "v": "analyse website traffic, subject to consent where required;"
            }
          ],
          [
            {
              "t": "text",
              "v": "comply with legal obligations and protect our legal interests."
            }
          ]
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "The applicable legal basis may be taking steps at your request before entering into a contract, performing a contract, compliance with a legal obligation, INFINUS’s legitimate interests or your consent."
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Fields marked with an asterisk are required for us to respond to your enquiry or consider your application. Other information is optional."
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Public forms are protected by Google reCAPTCHA to prevent spam and automated abuse. When a form is submitted, data may be processed by Google for this security purpose in accordance with Google’s applicable privacy terms."
          }
        ]
      },
      {
        "t": "h2",
        "c": [
          {
            "t": "text",
            "v": "3. Cookies and analytics"
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "The website uses technical data and cookies necessary for its operation and security."
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Google Analytics and other non-essential analytics or marketing cookies may be activated only after you provide consent. You may refuse or later withdraw your consent through the cookie settings. Refusing non-essential cookies will not affect the basic operation of the website."
          }
        ]
      },
      {
        "t": "h2",
        "c": [
          {
            "t": "text",
            "v": "4. Recipients and international transfers"
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Personal data may be accessed by authorised INFINUS employees and service providers responsible for hosting, website maintenance, email, analytics and other technical support, only to the extent necessary for their work. Data may also be disclosed to public authorities when required by law."
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "The website is hosted using Vercel and may use Google Analytics. Certain technical data may therefore be processed outside Serbia, including in the United States. Such transfers are carried out only with appropriate contractual and other safeguards required by applicable law."
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "We do not sell personal data."
          }
        ]
      },
      {
        "t": "h2",
        "c": [
          {
            "t": "text",
            "v": "5. Retention"
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "We retain personal data only for as long as necessary for the purpose for which it was collected:"
          }
        ]
      },
      {
        "t": "ul",
        "items": [
          [
            {
              "t": "text",
              "v": "business enquiry data is retained until the communication is completed and afterwards for as long as necessary to protect legal interests;"
            }
          ],
          [
            {
              "t": "text",
              "v": "job application data is retained until the recruitment process is completed and for no longer than six months afterwards, unless the applicant consents to longer retention for future opportunities;"
            }
          ],
          [
            {
              "t": "text",
              "v": "technical and analytics data is retained in accordance with the retention settings of the services we use."
            }
          ]
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Data may be retained for longer where required by law or necessary to establish, exercise or defend a legal claim."
          }
        ]
      },
      {
        "t": "h2",
        "c": [
          {
            "t": "text",
            "v": "6. Your rights"
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Subject to the conditions prescribed by the Serbian Law on Personal Data Protection, you may request:"
          }
        ]
      },
      {
        "t": "ul",
        "items": [
          [
            {
              "t": "text",
              "v": "access to and a copy of your personal data;"
            }
          ],
          [
            {
              "t": "text",
              "v": "correction, deletion or restriction of processing;"
            }
          ],
          [
            {
              "t": "text",
              "v": "data portability;"
            }
          ],
          [
            {
              "t": "text",
              "v": "the right to object;"
            }
          ],
          [
            {
              "t": "text",
              "v": "withdrawal of consent, without affecting processing carried out before its withdrawal."
            }
          ]
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "Requests may be sent to "
          },
          {
            "t": "link",
            "v": "office@infinus.rs",
            "href": "mailto:office@infinus.rs"
          },
          {
            "t": "text",
            "v": "."
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "You also have the right to lodge a complaint with the Serbian Commissioner for Information of Public Importance and Personal Data Protection through "
          },
          {
            "t": "link",
            "v": "poverenik.rs",
            "href": "https://www.poverenik.rs/"
          },
          {
            "t": "text",
            "v": "."
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "We do not make decisions producing legal or similarly significant effects solely through automated processing of your personal data."
          }
        ]
      },
      {
        "t": "p",
        "c": [
          {
            "t": "text",
            "v": "We may update this Privacy Policy from time to time. The current version will always be published on this page."
          }
        ]
      }
    ]
  }
] as const
