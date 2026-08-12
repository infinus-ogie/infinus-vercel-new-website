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
import { dictionaries, dictionaryKeyReport, getDictionary, type CommonDictionary } from '@/content/dictionary'

describe('the registry covers every locale', () => {
  test('one dictionary per supported locale, and no extras', () => {
    expect(Object.keys(dictionaries).sort()).toEqual([...LOCALES].slice().sort())
  })

  test('getDictionary is total over Locale', () => {
    for (const locale of LOCALES) {
      const dictionary = getDictionary(locale)
      expect(dictionary, locale).toBeDefined()
      expect(dictionary.common, `${locale}.common`).toBeDefined()
    }
  })
})

describe('shapes are identical across locales', () => {
  test('both locales expose exactly the same key set', () => {
    const report = dictionaryKeyReport()
    expect(report.sr).toEqual(report.en)
  })

  test('no key is optional, empty or non-string in any locale', () => {
    // An optional key in CommonDictionary would let a locale omit it and still compile.
    const keys = dictionaryKeyReport().en
    expect(keys.length).toBeGreaterThan(0)

    for (const locale of LOCALES) {
      const common = getDictionary(locale).common as unknown as Record<string, unknown>
      for (const key of keys) {
        expect(typeof common[key], `${locale}.common.${key}`).toBe('string')
        expect((common[key] as string).length, `${locale}.common.${key} is empty`).toBeGreaterThan(0)
      }
    }
  })
})

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
