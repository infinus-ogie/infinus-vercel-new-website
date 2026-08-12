/**
 * Metadata / hreflang primitive guards.
 *
 * The load-bearing assertion in this file is the boring one: for every real path on the
 * site, `localeAlternatesMetadata` returns a canonical and NOTHING ELSE. Zero hreflang is
 * the correct output today, because not one genuine EN/SR pair exists.
 *
 * The reciprocal-pair behaviour is proven against synthetic data, so the primitive can be
 * trusted before any /sr route is created.
 */
import { describe, test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { localeAlternatesMetadata } from '@/lib/seo-i18n'
import { allLivePaths, localeAlternatesFor, plannedPaths } from '@/lib/locale-routes'
import { PRODUCTION_ORIGIN, publicPages } from '../fixtures/routes'

describe('no hreflang is produced for anything that exists today', () => {
  test('every live path yields a canonical and no languages', () => {
    for (const path of allLivePaths()) {
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

describe('reciprocal alternates for a complete pair', () => {
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
