/**
 * Metadata / hreflang primitive guards.
 *
 * Phase G made exactly one pair real, so the load-bearing assertions are now two-sided:
 * /contact and /sr/contact must produce the complete reciprocal set, and every other path on
 * the site must still produce a canonical and NOTHING ELSE.
 */
import { describe, test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { localeAlternatesMetadata } from '@/lib/seo-i18n'
import { allLivePaths, localeAlternatesFor, plannedPaths } from '@/lib/locale-routes'
import { PRODUCTION_ORIGIN, publicPages } from '../fixtures/routes'

const PAIR = ['/contact', '/sr/contact']

describe('no hreflang is produced for anything outside the real pair', () => {
  test('every live path except the pair yields a canonical and no languages', () => {
    for (const path of allLivePaths()) {
      if (PAIR.indexOf(path) !== -1) continue
      const alternates = localeAlternatesMetadata(path)
      expect(Object.keys(alternates).sort(), path).toEqual(['canonical'])
      expect(alternates.languages, path).toBeUndefined()
    }
  })

  test('every planned path yields a canonical and no languages', () => {
    for (const path of plannedPaths()) {
      expect(localeAlternatesMetadata(path).languages, path).toBeUndefined()
    }
  })

  test('an unknown path yields a canonical and no languages', () => {
    for (const path of ['/does-not-exist', '/hero-demo', '/_not-found']) {
      expect(localeAlternatesMetadata(path).languages, path).toBeUndefined()
    }
  })

  test('the canonical matches the shape the A2 fixture already expects', () => {
    // Same origin, same path, no trailing-slash drift — so wiring this in later cannot
    // change a single canonical tag.
    for (const route of publicPages()) {
      const alternates = localeAlternatesMetadata(route.path)
      expect(alternates.canonical, route.path).toBe(route.expectCanonical)
    }
    expect(localeAlternatesMetadata('/').canonical).toBe(`${PRODUCTION_ORIGIN}/`)
  })
})

describe('the real Contact pair emits reciprocal alternates', () => {
  test('both halves emit the identical complete set, including x-default', () => {
    const expected = {
      en: `${PRODUCTION_ORIGIN}/contact`,
      'sr-Latn': `${PRODUCTION_ORIGIN}/sr/contact`,
      'x-default': `${PRODUCTION_ORIGIN}/contact`,
    }
    for (const path of PAIR) {
      expect(localeAlternatesMetadata(path).languages, path).toEqual(expected)
    }
  })

  test('each half keeps its OWN self-canonical', () => {
    expect(localeAlternatesMetadata('/contact').canonical).toBe(`${PRODUCTION_ORIGIN}/contact`)
    expect(localeAlternatesMetadata('/sr/contact').canonical).toBe(`${PRODUCTION_ORIGIN}/sr/contact`)
  })

  test('x-default is the English URL on BOTH halves', () => {
    for (const path of PAIR) {
      const languages = localeAlternatesMetadata(path).languages as Record<string, string>
      expect(languages['x-default'], path).toBe(`${PRODUCTION_ORIGIN}/contact`)
      expect(languages['x-default'], path).toBe(languages.en)
    }
  })

  test('each half lists itself among its alternates', () => {
    for (const path of PAIR) {
      const languages = localeAlternatesMetadata(path).languages as Record<string, string>
      const self = `${PRODUCTION_ORIGIN}${path}`
      const values = Object.keys(languages).map((k) => languages[k])
      expect(values, `${path} must self-reference`).toContain(self)
    }
  })
})

describe('reciprocal alternates for a synthetic complete pair', () => {
  const synthetic = [
    {
      id: 'synthetic-faq',
      pairing: 'translatable' as const,
      en: { path: '/synthetic-faq' as const, status: 'live' as const },
      sr: { path: '/sr/synthetic-faq' as const, status: 'live' as const },
    },
  ]

  test('both sides advertise the identical language set', () => {
    const fromEn = localeAlternatesFor('/synthetic-faq', synthetic)
    const fromSr = localeAlternatesFor('/sr/synthetic-faq', synthetic)
    expect(fromEn).toEqual(fromSr)
    expect(fromEn!.languages).toEqual({
      en: `${PRODUCTION_ORIGIN}/synthetic-faq`,
      'sr-Latn': `${PRODUCTION_ORIGIN}/sr/synthetic-faq`,
    })
  })

  test('x-default points at English', () => {
    const alternates = localeAlternatesFor('/synthetic-faq', synthetic)!
    expect(alternates.xDefault).toBe(`${PRODUCTION_ORIGIN}/synthetic-faq`)
  })

  test('the hreflang tokens are the same tags the documents declare in <html lang>', () => {
    const languages = localeAlternatesFor('/synthetic-faq', synthetic)!.languages
    expect(Object.keys(languages).sort()).toEqual(['en', 'sr-Latn'])
  })

  test('every alternate URL is absolute on the production origin', () => {
    const languages = localeAlternatesFor('/synthetic-faq', synthetic)!.languages
    const keys = Object.keys(languages)
    for (let i = 0; i < keys.length; i += 1) {
      expect(languages[keys[i]].indexOf(`${PRODUCTION_ORIGIN}/`)).toBe(0)
      expect(languages[keys[i]]).not.toMatch(/localhost|127\.0\.0\.1|vercel\.app/)
    }
  })

  test('the Metadata-shaped helper adds x-default alongside the languages', () => {
    const alternates = localeAlternatesMetadata('/synthetic-faq', synthetic)
    expect(alternates.canonical).toBe(`${PRODUCTION_ORIGIN}/synthetic-faq`)
    expect(alternates.languages).toEqual({
      en: `${PRODUCTION_ORIGIN}/synthetic-faq`,
      'sr-Latn': `${PRODUCTION_ORIGIN}/sr/synthetic-faq`,
      'x-default': `${PRODUCTION_ORIGIN}/synthetic-faq`,
    })
  })
})

describe('the existing metadata helper is untouched', () => {
  test('lib/seo.ts imports nothing from the i18n foundation', () => {
    // The 10 pages that call generateMetadata must not gain content/routes.ts in their
    // module graph. Verified against the source, because a stray import would not fail any
    // behavioural assertion — it would only move bundle bytes.
    const source = readFileSync(join(process.cwd(), 'lib/seo.ts'), 'utf8')
    expect(source).not.toMatch(/from '\.\/(i18n|locale-routes|seo-i18n)'/)
    expect(source).not.toMatch(/content\/routes/)
    expect(source).not.toMatch(/localeAlternates/)
  })

  test('generateMetadata still produces the same shape it always did', async () => {
    const { generateMetadata } = await import('@/lib/seo')
    const metadata = generateMetadata({
      title: 'Contact Infinus',
      description: 'desc',
      url: '/contact',
    })

    expect(metadata.robots).toBe('index,follow')
    expect(metadata.alternates).toEqual({ canonical: `${PRODUCTION_ORIGIN}/contact` })
    // No languages key: the existing helper is not locale-aware and must not become so
    // implicitly.
    expect(metadata.alternates!.languages).toBeUndefined()
    expect(metadata.openGraph).toBeDefined()
  })
})
