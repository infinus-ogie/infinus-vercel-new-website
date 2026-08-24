/**
 * Dictionary convention guards.
 *
 * The type system does most of the work here — a missing key is a compile error, not a test
 * failure. These tests cover the two things types alone cannot guarantee:
 *
 *   1. that the guarantee is REAL — proven with @ts-expect-error, which makes
 *      `npm run type-check` fail if the compiler ever stops rejecting an incomplete
 *      dictionary;
 *   2. that no key drifts into being optional, which would let a locale omit it while
 *      still type-checking.
 *
 * Plus the rule that matters most in production: NO SILENT ENGLISH FALLBACK.
 */
import { describe, test, expect } from 'vitest'
import { LOCALES, type Locale } from '@/lib/i18n'
import {
  DICTIONARY_NAMESPACES,
  dictionaries,
  dictionaryKeyReport,
  getDictionary,
  type CommonDictionary,
} from '@/content/dictionary'

describe('the registry covers every locale', () => {
  test('one dictionary per supported locale, and no extras', () => {
    expect(Object.keys(dictionaries).sort()).toEqual([...LOCALES].slice().sort())
  })

  test('getDictionary is total over Locale, for every namespace', () => {
    for (const locale of LOCALES) {
      const dictionary = getDictionary(locale)
      expect(dictionary, locale).toBeDefined()
      for (const namespace of DICTIONARY_NAMESPACES) {
        expect(dictionary[namespace], `${locale}.${namespace}`).toBeDefined()
      }
    }
  })

  test('every locale exposes exactly the declared namespaces', () => {
    for (const locale of LOCALES) {
      expect(Object.keys(getDictionary(locale)).sort()).toEqual([...DICTIONARY_NAMESPACES].slice().sort())
    }
  })
})

/**
 * The ONE namespace whose two locales are allowed to differ in shape.
 *
 * Every other namespace is a translation: one page, two languages, identical keys. The
 * MythBusting landing page is not. The client wrote the English page, then sent a DIFFERENT
 * Serbian page — a conversion layout with a split hero, an asset card, four myth/fact
 * previews instead of ten myth statements, a real FAQ and two form instances.
 *
 * `MythBustersDictionary.layout` is a discriminated union for exactly that reason, and a
 * union has different leaf keys per branch. Forcing key parity here would mean either
 * inventing Serbian copy the client did not write, or dropping Serbian sections they did.
 *
 * This is an exemption of ONE namespace, listed by name, asserted below to be genuinely a
 * union rather than an accident — not a relaxation of the rule for everything.
 */
const DIVERGENT_BY_DESIGN: readonly string[] = ['mythBusters']

describe('shapes are identical across locales', () => {
  test('both locales expose exactly the same key paths, in every namespace', () => {
    for (const namespace of DICTIONARY_NAMESPACES) {
      const report = dictionaryKeyReport(namespace)
      expect(report.en.length, `${namespace} looks empty`).toBeGreaterThan(0)
      if (DIVERGENT_BY_DESIGN.indexOf(namespace) !== -1) continue
      expect(report.sr, namespace).toEqual(report.en)
    }
  })

  test('the divergent namespace really is a two-variant union, not a drifted translation', () => {
    // The exemption above is only legitimate if the divergence is the DECLARED one. Both
    // sides must carry a layout variant, and they must differ — a Serbian page that quietly
    // fell back to the English shape would otherwise pass unnoticed.
    const en = getDictionary('en').mythBusters
    const sr = getDictionary('sr').mythBusters
    expect(en.layout.variant).toBe('en-overview')
    expect(sr.layout.variant).toBe('sr-conversion')

    // Everything OUTSIDE the union is still a strict translation pair.
    for (const shared of ['metadata', 'schema'] as const) {
      expect(Object.keys(sr[shared]).sort(), shared).toEqual(Object.keys(en[shared]).sort())
    }
  })

  test('the contact namespace has the full set of leaf keys the page needs', () => {
    // Spot-check the paths a missing translation would silently drop. `cta.cards.N.*` also
    // proves the tuple type kept exactly three cards in both locales.
    const keys = dictionaryKeyReport('contact').en
    for (const key of [
      'metadata.title',
      'metadata.description',
      'hero.heading',
      'form.nameLabel',
      'form.messagePlaceholder',
      'form.submit',
      'form.submitting',
      'validation.email',
      'success.heading',
      'errors.submitFailed',
      'privacy.before',
      'privacy.linkText',
      'cta.cards.0.title',
      'cta.cards.2.body',
    ]) {
      expect(keys, `contact.${key} missing`).toContain(key)
    }
    expect(keys).not.toContain('cta.cards.3.title')
  })

  /**
   * Paths where an EMPTY string is the correct value, not a missing translation.
   *
   * The industry-modal title is assembled as prefix + label + suffix. English reads
   * "Retail Expertise", so it has no prefix; Serbian reads "Ekspertiza: Maloprodaja", so it
   * has no suffix. Exactly one of the two is empty in each locale, by design.
   */
  /**
   * Paths matched by PATTERN rather than by name, where the index is not knowable up front.
   *
   * An OPTIONAL e-book form field cannot fail validation, so it carries no message. English
   * has one such field (Role or Job Title); Serbian has none. Listing "form.fields.3.
   * validation" by name would encode the field ORDER into this test.
   */
  const EMPTY_BY_PATTERN = [/^form\.fields\.\d+\.validation$/]

  const MAY_BE_EMPTY = [
    'domains.modal.titlePrefix',
    'domains.modal.titleSuffix',
    // The pharma1 case study has no engagement-model section; the shared component omits a
    // section whose content is empty rather than rendering a bare heading.
    'items.pharma1.engagementModel',
    // ProjectPulse's four "Why ProjectPulse" cards render titles only. The empty
    // descriptions are not placeholders — they are concatenated into the live JSON-LD
    // featureList, so removing them would change the emitted schema. Both locales are
    // empty, in both, deliberately.
    'valueProposition.items.0.description',
    'valueProposition.items.1.description',
    'valueProposition.items.2.description',
    'valueProposition.items.3.description',
    // The brochure modal glosses the OTHER language's name in parentheses and leaves the
    // reader's own language unglossed, so exactly one of these two is empty per locale —
    // and it is a different one on each side. See the composition test below.
    'brochureModal.englishOption.note',
    'brochureModal.serbianOption.note',
  ]

  test('no key is optional or non-string, and only fragment keys may be empty', () => {
    // An optional key in an interface would let a locale omit it and still compile.
    for (const namespace of DICTIONARY_NAMESPACES) {
      for (const locale of LOCALES) {
        // The divergent namespace is walked per LOCALE rather than against the English key
        // list, because its two sides legitimately have different keys.
        const paths =
          DIVERGENT_BY_DESIGN.indexOf(namespace) === -1
            ? dictionaryKeyReport(namespace).en
            : dictionaryKeyReport(namespace)[locale]

        for (const path of paths) {
          const value = resolvePath(getDictionary(locale)[namespace] as unknown as Record<string, unknown>, path)
          // `required` on an e-book form field is a genuine BOOLEAN: it drives validation,
          // and the two locales disagree about it (Serbian requires Zemlja, English makes
          // Role optional). Encoding that as the string "true" to satisfy this rule would be
          // hiding a real type behind a convention.
          if (/^form\.fields\.\d+\.required$/.test(path)) {
            expect(typeof value, `${locale}.${namespace}.${path}`).toBe('boolean')
            continue
          }
          expect(typeof value, `${locale}.${namespace}.${path}`).toBe('string')
          if (MAY_BE_EMPTY.indexOf(path) !== -1) continue
          if (EMPTY_BY_PATTERN.some((pattern) => pattern.test(path))) continue
          expect((value as string).length, `${locale}.${namespace}.${path} is empty`).toBeGreaterThan(0)
        }
      }
    }
  })

  test('the brochure modal glosses the foreign language and not the reader’s own', () => {
    // The two `note` fields are allowlisted above as legitimately empty, so assert the rule
    // that makes them legitimate instead of just tolerating a blank string: on each side
    // exactly one option is glossed, and it is never the reader's own language.
    for (const locale of LOCALES) {
      const modal = getDictionary(locale).sapStarterPackage.brochureModal
      const own = locale === 'en' ? modal.englishOption : modal.serbianOption
      const other = locale === 'en' ? modal.serbianOption : modal.englishOption
      expect(own.note, `${locale}: own language must not be glossed`).toBe('')
      expect(other.note.length, `${locale}: foreign language must be glossed`).toBeGreaterThan(0)
      // Both options always carry a real label, gloss or not.
      expect(modal.englishOption.label.length).toBeGreaterThan(0)
      expect(modal.serbianOption.label.length).toBeGreaterThan(0)
    }
  })

  test('the modal title fragments compose to a non-empty title in both locales', () => {
    // Since one fragment is legitimately empty per locale, assert what actually matters:
    // prefix + label + suffix must produce real text on both sides.
    for (const locale of LOCALES) {
      const modal = getDictionary(locale).home.domains.modal
      const label = getDictionary(locale).home.domains.items[0].label
      const composed = `${modal.titlePrefix}${label}${modal.titleSuffix}`
      expect(composed.length, `${locale} modal title`).toBeGreaterThan(label.length)
    }
  })
})

function resolvePath(root: Record<string, unknown>, path: string): unknown {
  const segments = path.split('.')
  let node: unknown = root
  for (let i = 0; i < segments.length; i += 1) {
    node = (node as Record<string, unknown>)[segments[i]]
  }
  return node
}

describe('no silent English fallback', () => {
  test('the Serbian dictionary shares no value with the English one', () => {
    // Every string is genuinely translated. An untranslated key would show English text
    // inside a lang="sr-Latn" document — the exact failure this convention forbids.
    const en = getDictionary('en').common as unknown as Record<string, string>
    const sr = getDictionary('sr').common as unknown as Record<string, string>

    for (const key of Object.keys(en)) {
      expect(sr[key], `sr.common.${key} is identical to English`).not.toBe(en[key])
    }
  })

  test('getDictionary("sr") never returns the English object', () => {
    expect(getDictionary('sr')).not.toBe(getDictionary('en'))
    expect(getDictionary('sr').common.localeName).toBe('Srpski')
    expect(getDictionary('en').common.localeName).toBe('English')
  })

  test('the registry is a static object — no async loading, no request-scoped lookup', () => {
    // If this ever became a promise, the pages could no longer be prerendered.
    for (const locale of LOCALES) {
      expect(getDictionary(locale)).not.toBeInstanceOf(Promise)
    }
  })
})

describe('the type-level guarantees are real', () => {
  test('an incomplete dictionary does not compile', () => {
    // @ts-expect-error — `breadcrumbHome` and `skipToContent` are missing. If the compiler
    // ever ACCEPTS this, tsc reports "unused @ts-expect-error" and type-check fails, so
    // this line is a live assertion rather than a comment.
    const incomplete: CommonDictionary = { localeName: 'Deutsch', switchLanguage: 'Sprache ändern' }
    expect(incomplete).toBeDefined()
  })

  test('a misspelled key does not compile', () => {
    const typo: CommonDictionary = {
      localeName: 'x',
      switchLanguage: 'x',
      breadcrumbHome: 'x',
      skipToContent: 'x',
      // @ts-expect-error — excess property: a typo cannot masquerade as a new key.
      skipToConent: 'x',
    }
    expect(typo).toBeDefined()
  })

  test('an unsupported locale cannot index the registry', () => {
    // @ts-expect-error — 'de' is not a Locale.
    const bad: Locale = 'de'
    expect(bad).toBe('de')
  })
})
