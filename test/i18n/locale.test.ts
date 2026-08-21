/**
 * Locale primitive guards.
 *
 * The values asserted here are the ones the two Phase E root layouts already emit and the
 * ones existing JSON-LD already declares. A change to any of them is a visible SEO change,
 * so they are pinned against INDEPENDENT literals written out in this file rather than
 * read back out of lib/i18n.ts.
 */
import { describe, test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_META,
  ORIGIN,
  absoluteUrl,
  htmlLangFor,
  isLocale,
  localeFromHtmlLang,
} from '@/lib/i18n'
import { PRODUCTION_ORIGIN } from '../fixtures/routes'

const ROOT = process.cwd()

describe('supported locales', () => {
  test('exactly two locales, en and sr', () => {
    expect(LOCALES).toEqual(['en', 'sr'])
  })

  test('the default locale is English', () => {
    expect(DEFAULT_LOCALE).toBe('en')
    expect(LOCALES.indexOf(DEFAULT_LOCALE)).not.toBe(-1)
  })

  test('isLocale accepts only supported locales', () => {
    expect(isLocale('en')).toBe(true)
    expect(isLocale('sr')).toBe(true)

    // Everything else, including plausible-looking tags and non-strings.
    for (const bad of ['sr-Latn', 'sr-Latn-RS', 'en-US', 'EN', 'de', '', '/sr', null, undefined, 0, {}, ['en']]) {
      expect(isLocale(bad), `${JSON.stringify(bad)} must not be a locale`).toBe(false)
    }
  })

  test('every locale has a complete meta record', () => {
    for (const locale of LOCALES) {
      const meta = LOCALE_META[locale]
      expect(meta.locale).toBe(locale)
      for (const field of ['bcp47', 'ogLocale', 'jsonLdLanguage', 'endonym'] as const) {
        expect(typeof meta[field], `${locale}.${field}`).toBe('string')
        expect(meta[field].length, `${locale}.${field} must not be empty`).toBeGreaterThan(0)
      }
    }
  })
})

describe('document language mapping', () => {
  test('en maps to "en" and sr maps to "sr-Latn"', () => {
    expect(htmlLangFor('en')).toBe('en')
    expect(htmlLangFor('sr')).toBe('sr-Latn')
  })

  test('the mapping matches what the Phase E root layouts actually emit', () => {
    // The primitive is worthless if it disagrees with the shipped layouts, so read them.
    const en = readFileSync(join(ROOT, 'app/(en)/layout.tsx'), 'utf8')
    const sr = readFileSync(join(ROOT, 'app/(sr)/layout.tsx'), 'utf8')

    expect(en).toContain(`lang="${htmlLangFor('en')}"`)
    expect(sr).toContain(`lang="${htmlLangFor('sr')}"`)
  })

  test('localeFromHtmlLang round-trips, and rejects unknown tags', () => {
    for (const locale of LOCALES) {
      expect(localeFromHtmlLang(htmlLangFor(locale))).toBe(locale)
    }
    // No loose prefix matching: an unknown tag is null, never coerced to a locale.
    for (const bad of ['sr', 'sr-Cyrl', 'en-US', 'en-GB', 'sr-Latn-RS', '']) {
      expect(localeFromHtmlLang(bad), `${bad} must not resolve to a locale`).toBeNull()
    }
  })

  test('the JSON-LD and og:locale tokens record what the site already emits', () => {
    // Different from <html lang> ON PURPOSE — see lib/i18n.ts. Pinned so a future
    // "cleanup" that unifies them has to change this expectation deliberately.
    expect(LOCALE_META.en.jsonLdLanguage).toBe('en-US')
    expect(LOCALE_META.sr.jsonLdLanguage).toBe('sr-Latn-RS')
    expect(LOCALE_META.en.ogLocale).toBe('en_US')
    expect(LOCALE_META.sr.ogLocale).toBe('sr_RS')
  })

  test('the recorded tokens match the values live code actually uses', () => {
    const jsonld = readFileSync(join(ROOT, 'lib/jsonld.ts'), 'utf8')
    const seo = readFileSync(join(ROOT, 'lib/seo.ts'), 'utf8')
    // app/(sr)/grow/_config.ts held this literal until Phase H4 moved the GROW copy into the
    // dictionary. The Serbian JSON-LD language now comes from LOCALE_META itself, via
    // lib/growth-jsonld.ts, so the token is no longer duplicated anywhere — which is the
    // stronger arrangement. lib/i18n.ts is where it is declared.
    const i18n = readFileSync(join(ROOT, 'lib/i18n.ts'), 'utf8')

    // SITE_CONFIG.language is the default lib/auto-jsonld.ts applies to English pages.
    expect(jsonld).toContain(`language: '${LOCALE_META.en.jsonLdLanguage}'`)
    // The single og:locale literal in the shared metadata helper.
    expect(seo).toContain(`locale: '${LOCALE_META.en.ogLocale}'`)
    // Declared exactly once, in the locale model.
    expect(i18n).toContain(`jsonLdLanguage: '${LOCALE_META.sr.jsonLdLanguage}'`)
    // And consumed from there rather than re-typed: no page or builder hardcodes it.
    const growthJsonLd = readFileSync(join(ROOT, 'lib/growth-jsonld.ts'), 'utf8')
    expect(growthJsonLd).toContain('LOCALE_META[locale].jsonLdLanguage')
  })
})

describe('URL prefixes', () => {
  test('English is unprefixed and Serbian claims /sr for NEW routes', () => {
    expect(LOCALE_META.en.urlPrefix).toBe('')
    expect(LOCALE_META.sr.urlPrefix).toBe('/sr')
  })
})

describe('production origin', () => {
  test('agrees with the independent literal in the A2 fixture', () => {
    expect(ORIGIN).toBe(PRODUCTION_ORIGIN)
    expect(ORIGIN).toBe('https://www.infinus.co')
  })

  test('absoluteUrl builds canonical-shaped URLs', () => {
    expect(absoluteUrl('/')).toBe('https://www.infinus.co/')
    expect(absoluteUrl('/contact')).toBe('https://www.infinus.co/contact')
    expect(absoluteUrl('/grow/cfo')).toBe('https://www.infinus.co/grow/cfo')
    expect(absoluteUrl('/')).not.toContain('//co')
  })
})
