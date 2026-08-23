/**
 * Pins the OWNER-APPROVED Serbian home / FAQ / nav / footer copy.
 *
 * Every string below was either approved as first drafted or changed at owner review. A
 * revert to superseded wording, or an accidental edit, must fail here rather than reach a
 * Preview. The English side is pinned too where H1 extracted it, because those literals are
 * the live English page.
 *
 * Diacritics and script are guarded as well: the Serbian side must stay Latin with real
 * č ć š ž đ, never ASCII stand-ins.
 */
import { describe, test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getDictionary } from '@/content/dictionary'

const en = getDictionary('en')
const sr = getDictionary('sr')

describe('the thirteen corrections made at owner review', () => {
  test('homepage metadata title', () => {
    expect(sr.home.metadata.title).toBe('Infinus - SAP ekspertiza za poslovni uspeh')
  })

  test('hero keeps its two-part structure with the approved wording', () => {
    expect(sr.home.hero.titleLine1).toBe('Pretvaramo SAP ekspertizu')
    expect(sr.home.hero.titleLine2).toBe('u poslovnu prednost')
  })

  test('hero supporting text', () => {
    expect(sr.home.hero.lede).toBe('Pomažemo kompanijama da rade pametnije i rastu brže')
  })

  test('about uses "senior SAP konsultanti"', () => {
    expect(sr.home.about.paragraphs[1]).toContain('senior SAP konsultanti')
    expect(sr.home.about.paragraphs[1]).not.toContain('seniorski')
  })

  test('services intro uses "razumevanje poslovanja"', () => {
    expect(sr.home.services.lede).toContain('Kombinujemo razumevanje poslovanja i SAP ekspertizu')
    expect(sr.home.services.lede).not.toContain('poslovni uvid')
  })

  test('the application-management service title', () => {
    expect(sr.home.services.items[2].title).toBe('Upravljanje SAP aplikacijama i podrška')
    // The same service name appears in the footer's expertise column and must match.
    expect(sr.footer.columns.expertise.items[2].label).toBe('Upravljanje SAP aplikacijama i podrška')
  })

  test('the "custom" anglicism is gone from every Serbian string', () => {
    expect(sr.home.services.items[4].body).toContain('razvoj prilagođenih rešenja')
    expect(sr.faq.items[0].answer).toContain('obuke za razvoj prilagođenih rešenja')
    expect(sr.faq.items[1].answer).toContain('za razvoj prilagođenih rešenja')
    for (const file of ['home', 'faq', 'nav', 'footer'] as const) {
      const source = readFileSync(join(process.cwd(), `content/sr/${file}.ts`), 'utf8')
      // Allowed only inside the provenance note that records the change.
      const code = source.replace(/\/\*[\s\S]*?\*\//g, '')
      expect(code, `content/sr/${file}.ts still uses "custom"`).not.toMatch(/\bcustom\b/)
    }
  })

  test('benefits intro uses "stvarne poslovne izazove"', () => {
    expect(sr.home.benefits.lede).toContain('stvarne poslovne izazove')
    expect(sr.home.benefits.lede).not.toContain('realne poslovne')
  })

  test('footer contact column label', () => {
    expect(sr.footer.columns.contact.label).toBe('Kontakt podaci')
  })

  test('FAQ pricing answer', () => {
    expect(sr.faq.items[3].answer).toContain('Nudimo fleksibilne modele cena')
    expect(sr.faq.items[3].answer).not.toContain('opcije cena')
  })

  test('FAQ client-process answer', () => {
    expect(sr.faq.items[5].answer).toContain('tokom kojih sagledavamo vaše poslovne potrebe i ciljeve')
    expect(sr.faq.items[5].answer).not.toContain('na kojima razumemo')
  })

  test('FAQ getting-started answer', () => {
    expect(sr.faq.items[6].answer).toContain(
      'Zajedno ćemo sagledati vaše poslovne potrebe i ciljeve i savetovati vas kako najbolje možemo da pomognemo.'
    )
    expect(sr.faq.items[6].answer).not.toContain('Zajedno sa vama razumećemo')
  })

  test('FAQ CTA body', () => {
    expect(sr.faq.cta.body).toBe(
      'Naši SAP stručnjaci su tu da pomognu. Kontaktirajte nas za odgovore prilagođene vašim konkretnim pitanjima i zahtevima.'
    )
  })
})

describe('the copy decisions approved as first drafted', () => {
  test('nav labels', () => {
    // The navbar was restructured into five groups. The Serbian labels below are the ones
    // that survived that move unchanged, plus the two the owner approved for the new
    // groupings ("Ekspertiza", "Uvidi").
    expect(sr.nav.home.label).toBe('Početna')
    expect(sr.nav.company.label).toBe('Kompanija')
    expect(sr.nav.expertise.label).toBe('Ekspertiza')
    expect(sr.nav.insights.label).toBe('Uvidi')
    expect(sr.nav.contact.label).toBe('Kontakt')

    const companyLabels = sr.nav.company.entries.map((e) => e.label)
    expect(companyLabels).toEqual(['O nama', 'Zašto Infinus', 'Karijera', 'Česta pitanja'])

    const expertiseLabels = sr.nav.expertise.entries.map((e) => e.label)
    expect(expertiseLabels).toEqual([
      'SAP ekspertiza',
      'Industrijska ekspertiza',
      'SAP paketna rešenja',
      'Studije slučaja',
    ])

    // The case studies survive as a CATEGORY inside Expertise, with all five pages.
    const caseStudies = sr.nav.expertise.entries.find((e) => e.label === 'Studije slučaja')
    expect(caseStudies?.kind).toBe('group')
    expect(caseStudies?.kind === 'group' && caseStudies.items.map((i) => i.label)).toEqual([
      'Maloprodaja',
      'Farmacija 1',
      'Farmacija 2',
      'Nearshoring',
      'Proizvodnja',
    ])
  })

  test('the hero CTA is Serbian copy pointing at the Serbian Contact page', () => {
    // The failure this guards is a translated label wired to an English URL — a Serbian
    // visitor clicking "Kontaktirajte nas" and landing on /contact.
    expect(sr.home.hero.ctaLabel).toBe('Kontaktirajte nas')
    expect(sr.home.hero.ctaHref).toBe('/sr/contact')
    expect(en.home.hero.ctaLabel).toBe('Contact Us')
    expect(en.home.hero.ctaHref).toBe('/contact')
  })

  test('section headings and footer labels', () => {
    expect(sr.home.services.heading).toBe('SAP ekspertiza u praksi')
    expect(sr.home.benefits.heading).toBe('Zašto Infinus')
    expect(sr.home.benefits.items[5].title).toBe('Regionalno prisustvo, evropski domet')
    expect(sr.footer.columns.legal.label).toBe('Pravne informacije')
    expect(sr.footer.bottom.cookieSettings).toBe('Podešavanja kolačića')
  })

  // The application form left the homepage for /careers, so its copy now lives in the
  // `careers` namespace. The approved Serbian wording is unchanged by that move, which is
  // exactly what these assertions are here to prove.
  test('the job form labels and the approved acknowledgement', () => {
    expect(sr.careers.form.linkedinLabel).toBe('LinkedIn profil')
    expect(sr.careers.form.submit).toBe('Pošaljite prijavu')
    expect(sr.careers.form.submitting).toBe('Šalje se...')
    const sentence = `${sr.careers.privacy.before}${sr.careers.privacy.linkText}${sr.careers.privacy.after}`
    expect(sentence).toBe('Slanjem prijave potvrđujete da ste pročitali našu Politiku privatnosti.')
    expect(sr.careers.privacy.href).toBe('/sr/politika-privatnosti')
  })
})

describe('the English source of truth is unchanged', () => {
  test('the literals H1 extracted are still verbatim', () => {
    expect(en.home.metadata.title).toBe('Infinus - Driving Business Success through SAP Expertise')
    expect(en.home.hero.titleLine1).toBe('Turning SAP Expertise')
    expect(en.home.hero.titleLine2).toBe('into Business Advantage')
    expect(en.home.hero.lede).toBe('Empowering companies to work smarter and grow faster')
    expect(en.home.services.items[2].title).toBe('SAP Application Management & Support')
    expect(en.home.benefits.heading).toBe('Why Infinus')
    // The long-standing typo ("continues") was corrected to "continuous" in the final
    // client-feedback phase, at the client's explicit request.
    expect(en.careers.paragraphs[0]).toContain('Due to continuous business expansion')
    expect(en.careers.paragraphs[1]).toContain('interested in becoming a member')
    expect(en.faq.heading).toBe('Frequently Asked Questions')
    expect(en.nav.expertise.label).toBe('Expertise')
    expect(en.footer.columns.contact.label).toBe('Contact Information')
  })
})

describe('script and orthography', () => {
  const allSerbian = (obj: unknown): string[] => {
    if (typeof obj === 'string') return [obj]
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj as Record<string, unknown>).flatMap((k) =>
        allSerbian((obj as Record<string, unknown>)[k])
      )
    }
    return []
  }
  const text = [sr.home, sr.faq, sr.nav, sr.footer].flatMap(allSerbian).join(' ')

  test('Latin script only — no Cyrillic', () => {
    expect(text).not.toMatch(/[Ѐ-ӿ]/)
  })

  test('real Serbian diacritics are present', () => {
    for (const ch of ['č', 'ć', 'š', 'ž', 'đ']) {
      expect(text, `no "${ch}" in the Serbian H1 copy`).toContain(ch)
    }
  })

  test('no ASCII stand-ins in words that need a diacritic', () => {
    for (const [ascii, proper] of [
      ['Pocetna', 'Početna'],
      ['resenja', 'rešenja'],
      ['podrska', 'podrška'],
      ['strucn', 'stručn'],
      ['Cesta', 'Česta'],
      ['slucaja', 'slučaja'],
      ['Trešnjinog', 'Trešnjinog'],
    ] as const) {
      if (ascii === proper) continue
      expect(text, `ASCII "${ascii}" used instead of "${proper}"`).not.toContain(ascii)
    }
    expect(text).toContain('Trešnjinog cveta 1, 11070 Beograd')
  })
})

describe('provenance says approved, not draft', () => {
  test('all four H1 Serbian files are marked OWNER-APPROVED', () => {
    for (const file of ['home', 'faq', 'nav', 'footer']) {
      const source = readFileSync(join(process.cwd(), `content/sr/${file}.ts`), 'utf8')
      expect(source, `content/sr/${file}.ts`).toMatch(/OWNER-APPROVED/)
      expect(source, `content/sr/${file}.ts still says DRAFT`).not.toMatch(/DRAFT — OWNER REVIEW REQUIRED/)
    }
  })
})
