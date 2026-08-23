/**
 * Guards on the Serbian Contact translation itself.
 *
 * A translation cannot be unit-tested for quality — that is what the owner's review is for.
 * What CAN be mechanically guaranteed is the set of failures that are easy to introduce and
 * hard to spot in review:
 *
 *   · an untranslated string left in English inside a Serbian document
 *   · ASCII stand-ins (c/s/z/dj) where Serbian diacritics belong
 *   · Cyrillic characters, when the site is committed to Latin script (sr-Latn)
 *   · the approved privacy acknowledgement quietly reworded
 *   · a proper name (SAP, Infinus, the mailbox, the file formats) "translated"
 *   · the DRAFT provenance marker removed before the owner has approved the copy
 *
 * The English side is guarded too: it is the SOURCE OF TRUTH for the pair, extracted
 * verbatim from the pre-Phase-G implementation, so this file pins the strings whose drift
 * would silently change the live English page.
 */
import { describe, test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getDictionary } from '@/content/dictionary'
import type { ContactDictionary } from '@/content/dictionary'

const en = getDictionary('en').contact
const sr = getDictionary('sr').contact

/** Every leaf string of a contact dictionary, with its key path. */
function leaves(content: ContactDictionary): Array<{ path: string; value: string }> {
  const out: Array<{ path: string; value: string }> = []
  const walk = (node: Record<string, unknown>, prefix: string): void => {
    const keys = Object.keys(node)
    for (let i = 0; i < keys.length; i += 1) {
      const child = node[keys[i]]
      const here = prefix === '' ? keys[i] : `${prefix}.${keys[i]}`
      if (child !== null && typeof child === 'object') walk(child as Record<string, unknown>, here)
      else out.push({ path: here, value: String(child) })
    }
  }
  walk(content as unknown as Record<string, unknown>, '')
  return out
}

/**
 * Strings that are DELIBERATELY identical in both locales because they are data or proper
 * names, not copy. Anything else being identical means a missed translation.
 */
const INTENTIONALLY_SHARED = [
  'details.email',
  'details.web.label',
  'details.web.url',
  'form.emailPlaceholder',
  'privacy.after',
]

describe('English is the unchanged source of truth', () => {
  test('the strings that drive the live English page are exactly as they were', () => {
    // Pinned against the pre-Phase-G literals from app/(en)/(site)/contact/page.tsx and
    // components/ui/contact-2.tsx. A change here changes the live English page.
    expect(en.metadata.title).toBe('Contact Infinus - Get Expert SAP Support')
    expect(en.hero.heading).toBe('Start your SAP transformation')
    expect(en.details.heading).toBe('Contact Details')
    // The street name carries a š. The English page used an ASCII stand-in until the final
    // client-feedback phase corrected it; only the diacritic changed.
    expect(en.details.address).toBe('Trešnjinog cveta 1, Belgrade, Serbia')
    expect(en.form.nameLabel).toBe('Name *')
    expect(en.form.submit).toBe('Send Message')
    expect(en.form.submitting).toBe('Sending...')
    expect(en.validation.email).toBe('Invalid email address')
    expect(en.success.heading).toBe('Thank You!')
    expect(en.cta.heading).toBe('Ready to Get Started?')
    expect(en.cta.cards[0].title).toBe('Expert Team')
    expect(en.cta.cards[1].title).toBe('Free Consultation')
    expect(en.cta.cards[2].title).toBe('Quick Response')
  })

  test('the approved English acknowledgement composes to the exact sentence', () => {
    expect(`${en.privacy.before}${en.privacy.linkText}${en.privacy.after}`).toBe(
      'By submitting this form, you confirm that you have read our Privacy Policy.'
    )
  })
})

describe('nothing is left untranslated', () => {
  test('every copy string differs from English, except the deliberate data values', () => {
    const enLeaves = leaves(en)
    const srLeaves = leaves(sr)
    expect(srLeaves.map((l) => l.path)).toEqual(enLeaves.map((l) => l.path))

    for (let i = 0; i < enLeaves.length; i += 1) {
      const { path, value } = enLeaves[i]
      if (INTENTIONALLY_SHARED.indexOf(path) !== -1) continue
      expect(srLeaves[i].value, `sr.contact.${path} is still English: "${value}"`).not.toBe(value)
    }
  })

  test('the deliberately shared values ARE identical', () => {
    // Asserted positively so removing one from the allowlist is a decision, not a slip.
    const enByPath: Record<string, string> = {}
    for (const leaf of leaves(en)) enByPath[leaf.path] = leaf.value
    const srByPath: Record<string, string> = {}
    for (const leaf of leaves(sr)) srByPath[leaf.path] = leaf.value

    for (const path of INTENTIONALLY_SHARED) {
      expect(srByPath[path], `${path} should be shared data`).toBe(enByPath[path])
    }
  })
})

describe('Serbian script and orthography', () => {
  const srText = leaves(sr)
    .map((l) => l.value)
    .join(' ')

  test('uses Latin script — no Cyrillic anywhere', () => {
    expect(srText).not.toMatch(/[Ѐ-ӿ]/)
  })

  test('actually uses Serbian diacritics', () => {
    for (const char of ['č', 'ć', 'š', 'ž', 'đ']) {
      expect(srText, `no "${char}" anywhere in the Serbian copy`).toContain(char)
    }
  })

  test('no ASCII stand-ins in the words where diacritics belong', () => {
    // Each pair is a word that MUST carry a diacritic, and the ASCII form that must not appear.
    const forbidden: Array<[string, string]> = [
      ['Tresnjinog', 'Trešnjinog'],
      ['podrska', 'podrška'],
      ['strucn', 'stručn'],
      ['pocnete', 'počnete'],
      ['procitali', 'pročitali'],
      ['potvrdjujete', 'potvrđujete'],
      ['uspesno', 'uspešno'],
      ['sta', 'šta'],
      ['Vasa', 'Vaša'],
      ['nasu', 'našu'],
    ]
    for (const [ascii, proper] of forbidden) {
      expect(srText, `ASCII "${ascii}" used instead of "${proper}"`).not.toContain(ascii)
    }
    // And the correct forms are present where the copy uses them.
    for (const proper of ['Trešnjinog', 'podrška', 'pročitali', 'potvrđujete', 'uspešno']) {
      expect(srText, `expected "${proper}" in the Serbian copy`).toContain(proper)
    }
  })

  test('the address is the approved Serbian form, taken from the legal text', () => {
    expect(sr.details.address).toBe('Trešnjinog cveta 1, 11070 Beograd')

    const legal = readFileSync(join(process.cwd(), 'content/legal/politika-privatnosti.ts'), 'utf8')
    expect(legal, 'the address must match the approved Serbian legal text verbatim').toContain(
      sr.details.address
    )
  })
})

describe('proper names and technical values survive translation', () => {
  const srText = leaves(sr)
    .map((l) => l.value)
    .join(' ')

  test('SAP, Infinus and the SAP Gold Partner designation are untranslated', () => {
    expect(srText).toContain('SAP')
    expect(srText).toContain('Infinus')
    expect(sr.metadata.description).toContain('SAP Gold Partner')
  })

  test('the file formats and size limit are unchanged', () => {
    for (const token of ['PDF', 'DOC', 'DOCX', 'TXT', '10 MB']) {
      expect(sr.form.attachmentHint, token).toContain(token)
    }
  })

  test('the mailbox and domain are the real ones', () => {
    expect(sr.details.email).toBe('office@infinus.rs')
    expect(sr.details.web.url).toBe('https://infinus.co')
  })

  test('the numeric claims are preserved exactly', () => {
    // "within 24 hours" must stay 24 hours; a translation may not quietly change a promise.
    expect(en.cta.cards[2].body).toContain('24 hours')
    expect(sr.cta.cards[2].body).toContain('24 sata')
    // Validation minimums match the shared schema rules.
    expect(sr.validation.name).toContain('2')
    expect(sr.validation.subject).toContain('5')
    expect(sr.validation.message).toContain('10')
  })
})

/**
 * The exact sentence is pinned, and it has been re-approved once.
 *
 * It read "Slanjem forme ..." until the owner replaced "forme" with "obrasca" — the more
 * formal Serbian word for a form — in the Contact localisation polish. The assertion is still
 * byte-exact rather than a loose match, because this is a legal acknowledgement: a paraphrase
 * that drifts in unnoticed is the failure mode worth failing on.
 */
describe('the file picker gets its copy from the dictionary, not the browser', () => {
  test('both locales declare their own button and empty-state strings', () => {
    // A native <input type="file"> renders its button and "no file" text from the BROWSER's
    // locale, so a Serbian page on an English browser showed English chrome and the site had
    // no say in it. These four strings are what the custom presentation shows instead.
    expect(en.form.attachmentButton).toBe('Choose file')
    expect(en.form.attachmentEmpty).toBe('No file selected')
    expect(sr.form.attachmentButton).toBe('Izaberi fajl')
    expect(sr.form.attachmentEmpty).toBe('Nijedan fajl nije izabran')
  })

  test('the two locales actually differ, and the accepted types do not', () => {
    // If these were ever made identical, every "no English on the Serbian page" assertion in
    // scripts/qa/contact-file-picker.spec.ts would pass while the page was wrong.
    expect(sr.form.attachmentButton).not.toBe(en.form.attachmentButton)
    expect(sr.form.attachmentEmpty).not.toBe(en.form.attachmentEmpty)
    // The hint still states the same limit and formats in both — those are facts, not copy.
    for (const hint of [en.form.attachmentHint, sr.form.attachmentHint]) {
      expect(hint).toContain('PDF')
      expect(hint).toContain('DOCX')
      expect(hint).toContain('10')
    }
  })
})

describe('the owner corrections to the Serbian Contact copy', () => {
  test('the three approved strings are in place and the old ones are gone', () => {
    expect(sr.hero.description).toContain(
      'Tu smo da vam pomognemo da ostvarite svoje poslovne ciljeve.'
    )
    expect(sr.hero.description).not.toContain('Tu smo da vam pomognemo da uspete.')
    expect(sr.form.subjectPlaceholder).toBe('Ukratko opišite temu upita')
    expect(sr.privacy.before).toBe('Slanjem obrasca potvrđujete da ste pročitali našu ')
  })

  test('the privacy destination did NOT move', () => {
    // The copy around the link changed; the link did not. Serbian readers must still land on
    // the Serbian policy, and English on the English one.
    expect(sr.privacy.href).toBe('/sr/politika-privatnosti')
    expect(en.privacy.href).toBe('/privacy')
  })

  test('the English Contact copy is untouched apart from the picker', () => {
    // Named explicitly, because "we only changed Serbian" is the sort of claim that quietly
    // stops being true.
    expect(en.form.subjectPlaceholder).toBe("What's this about?")
    expect(en.privacy.before).toBe('By submitting this form, you confirm that you have read our ')
  })
})

describe('the approved Serbian acknowledgement is used verbatim', () => {
  test('it composes to the exact approved sentence', () => {
    expect(`${sr.privacy.before}${sr.privacy.linkText}${sr.privacy.after}`).toBe(
      'Slanjem obrasca potvrđujete da ste pročitali našu Politiku privatnosti.'
    )
  })

  test('the linked text is the declined form "Politiku privatnosti"', () => {
    expect(sr.privacy.linkText).toBe('Politiku privatnosti')
    // The Privacy Policy is split by locale now, so this href is one of the few values that
    // legitimately DIFFERS between the two contact dictionaries — see the note by SHARED
    // above. The Serbian acknowledgement must reach the Serbian document.
    expect(sr.privacy.href).toBe('/sr/politika-privatnosti')
  })

  test('it is an acknowledgement, not a consent phrasing', () => {
    const sentence = `${sr.privacy.before}${sr.privacy.linkText}${sr.privacy.after}`
    expect(sentence).not.toMatch(/pristajete|prihvatate|saglasni/i)
  })
})

describe('provenance is honest about approval status', () => {
  const srSource = readFileSync(join(process.cwd(), 'content/sr/contact.ts'), 'utf8')

  test('the Serbian file is marked OWNER-APPROVED, no longer a draft', () => {
    expect(srSource).toMatch(/OWNER-APPROVED\./)
    expect(srSource).toMatch(/Reviewed and signed off/)
    // The draft marker must be gone, not merely contradicted somewhere else in the file.
    expect(srSource).not.toContain('DRAFT TRANSLATION')
    expect(srSource).not.toMatch(/requires owner copy approval/)
  })

  test('the six strings corrected at owner review carry their approved wording', () => {
    // Pinned individually: these are the exact strings the owner changed, so a revert to
    // the drafted wording must fail rather than pass quietly.
    expect(sr.details.webLabel).toBe('Sajt: ')
    expect(sr.cta.body).toContain('uz naše SAP znanje i iskustvo')
    expect(sr.metadata.title).toBe('Kontaktirajte Infinus - Stručna SAP podrška')
    expect(sr.form.messagePlaceholder).toBe('Opišite nam svoje SAP potrebe ili zahteve u vezi sa projektom...')
    expect(sr.form.submitting).toBe('Šalje se...')
    expect(sr.success.attachmentNoticeBody).toBe(
      'Vaša poruka je uspešno poslata, ali prilog nije mogao da bude obrađen. Pokušajte da pošaljete datoteku odvojeno ili nas kontaktirajte direktno.'
    )
  })

  test('the drafted wording it replaced is gone', () => {
    const all = leaves(sr)
      .map((l) => l.value)
      .join(' ')
    for (const superseded of [
      'Veb: ',
      'uz našu SAP ekspertizu',
      'Kontakt Infinus - Stručna SAP podrška',
      'zahteve projekta...',
      'Slanje...',
    ]) {
      expect(all, `superseded draft wording "${superseded}" is still present`).not.toContain(superseded)
    }
  })

  test('the English file records that its values were extracted, not written', () => {
    const enSource = readFileSync(join(process.cwd(), 'content/en/contact.ts'), 'utf8')
    expect(enSource).toMatch(/EXTRACTED, NOT WRITTEN/)
  })
})
