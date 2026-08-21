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

describe('shapes are identical across locales', () => {
  test('both locales expose exactly the same key paths, in every namespace', () => {
    for (const namespace of DICTIONARY_NAMESPACES) {
      const report = dictionaryKeyReport(namespace)
      expect(report.sr, namespace).toEqual(report.en)
      expect(report.en.length, `${namespace} looks empty`).toBeGreaterThan(0)
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
      const paths = dictionaryKeyReport(namespace).en
      for (const locale of LOCALES) {
        for (const path of paths) {
          const value = resolvePath(getDictionary(locale)[namespace] as unknown as Record<string, unknown>, path)
          expect(typeof value, `${locale}.${namespace}.${path}`).toBe('string')
          if (MAY_BE_EMPTY.indexOf(path) !== -1) continue
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
