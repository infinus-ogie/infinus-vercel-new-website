/**
 * Route-pair model guards.
 *
 * The point of this file is the NEGATIVE case. A pairing model is only useful if it refuses
 * to invent counterparts, so most of these tests assert that something is NOT produced:
 * no fake English GROW page, no live /sr/contact, no silent fallback to the locale home,
 * no alternate for a merely planned path.
 *
 * Synthetic maps are used for the "complete pair" behaviour, so the primitives can be
 * proven correct WITHOUT creating a real /sr route.
 */
import { describe, test, expect } from 'vitest'
import {
  LEGACY_UNPREFIXED_SERBIAN_PATHS,
  ROUTE_PAIRS,
  validateRoutePairs,
  type RoutePair,
} from '@/content/routes'
import {
  allLivePaths,
  counterpartFor,
  isTranslatablePath,
  livePathsFor,
  localeAlternatesFor,
  localeOfPath,
  pairForPath,
  plannedPaths,
} from '@/lib/locale-routes'

/** A complete EN/SR pair, as a future rollout will produce. Not a real route. */
const SYNTHETIC_COMPLETE: readonly RoutePair[] = [
  {
    id: 'synthetic-contact',
    pairing: 'translatable',
    en: { path: '/synthetic-contact', status: 'live' },
    sr: { path: '/sr/synthetic-contact', status: 'live' },
  },
]

describe('the real route map is structurally sound', () => {
  test('validateRoutePairs reports no problems', () => {
    expect(validateRoutePairs()).toEqual([])
  })

  test('page ids are unique', () => {
    const ids = ROUTE_PAIRS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('no path is claimed by two page identities', () => {
    const paths: string[] = []
    for (const pair of ROUTE_PAIRS) {
      for (const entry of [pair.en, pair.sr]) if (entry) paths.push(entry.path)
    }
    expect(new Set(paths).size).toBe(paths.length)
  })

  test('every pair declares at least one locale route', () => {
    for (const pair of ROUTE_PAIRS) {
      expect(pair.en !== null || pair.sr !== null, `${pair.id} declares nothing`).toBe(true)
    }
  })
})

describe('validateRoutePairs catches invalid configuration', () => {
  const problemsFor = (pair: RoutePair) => validateRoutePairs([pair])

  test('duplicate live path across two ids', () => {
    const problems = validateRoutePairs([
      { id: 'a', pairing: 'translatable', en: { path: '/dup', status: 'live' }, sr: null },
      { id: 'b', pairing: 'translatable', en: { path: '/dup', status: 'live' }, sr: null },
    ])
    expect(problems.join(' ')).toContain('claimed twice')
  })

  test('the same path claimed as both English and Serbian', () => {
    const problems = problemsFor({
      id: 'both-locales',
      pairing: 'translatable',
      en: { path: '/same', status: 'live' },
      sr: { path: '/same', status: 'live' },
    })
    expect(problems.join(' ')).toContain('claimed twice')
  })

  test('an English route inside the Serbian URL space', () => {
    const problems = problemsFor({
      id: 'wrong-space',
      pairing: 'translatable',
      en: { path: '/sr/contact', status: 'live' },
      sr: null,
    })
    expect(problems.join(' ')).toContain('inside the Serbian URL space')
  })

  test('a NEW unprefixed Serbian route — the legacy exception cannot grow', () => {
    const problems = problemsFor({
      id: 'sneaky',
      pairing: 'translatable',
      en: null,
      sr: { path: '/nova-stranica', status: 'live' },
    })
    expect(problems.join(' ')).toContain('neither under /sr nor one of the four legacy')
  })

  test('an existing path marked "planned"', () => {
    const problems = problemsFor({
      id: 'already-there',
      pairing: 'translatable',
      en: null,
      sr: { path: '/grow', status: 'planned' },
    })
    expect(problems.join(' ')).toContain('cannot be "planned"')
  })

  test('a pair with no locale route at all', () => {
    expect(problemsFor({ id: 'empty', pairing: 'translatable', en: null, sr: null }).join(' ')).toContain(
      'declares no locale route'
    )
  })

  test('a trailing slash, a query string and a non-kebab id', () => {
    expect(
      problemsFor({ id: 'Bad_Id', pairing: 'translatable', en: { path: '/x/', status: 'live' }, sr: null }).join(' ')
    ).toContain('trailing slash')
    expect(
      problemsFor({ id: 'q', pairing: 'translatable', en: { path: '/x?a=1', status: 'live' }, sr: null }).join(' ')
    ).toContain('query, fragment or whitespace')
    expect(problemsFor({ id: 'Bad_Id', pairing: 'translatable', en: null, sr: null }).join(' ')).toContain(
      'kebab-case'
    )
  })

  test('an "excluded" pair that is really a complete pair', () => {
    const problems = problemsFor({
      id: 'hidden-pair',
      pairing: 'excluded',
      en: { path: '/hidden', status: 'live' },
      sr: { path: '/sr/hidden', status: 'live' },
    })
    expect(problems.join(' ')).toContain('live sides')
  })
})

describe('locale ownership of live paths', () => {
  test('the English pages are owned by en', () => {
    for (const path of ['/', '/contact', '/faq', '/case-study/pharma2', '/projectpulse']) {
      expect(localeOfPath(path), path).toBe('en')
    }
  })

  test('the Serbian pages are owned by sr, at their real unprefixed URLs', () => {
    for (const path of ['/grow', '/grow/cfo', '/grow/ceo', '/professional-services']) {
      expect(localeOfPath(path), path).toBe('sr')
    }
  })

  test('every live Serbian path is an explicitly allowlisted legacy unprefixed path', () => {
    const srLive = livePathsFor('sr').slice().sort()
    expect(srLive).toEqual([...LEGACY_UNPREFIXED_SERBIAN_PATHS].slice().sort())
  })

  test('unclassified paths have NO locale — not a default of English', () => {
    for (const path of [
      '/hero-demo',
      '/debug/visitor-intelligence',
      '/api/contact',
      '/llms.txt',
      '/_not-found',
      '/does-not-exist',
    ]) {
      expect(localeOfPath(path), path).toBeNull()
      expect(pairForPath(path), path).toBeNull()
    }
  })

  test('a planned path is not resolvable as a live route', () => {
    for (const path of plannedPaths()) {
      expect(localeOfPath(path), `${path} must not resolve`).toBeNull()
      expect(pairForPath(path), `${path} must not resolve`).toBeNull()
    }
  })
})

describe('counterparts are never invented', () => {
  test('NO live path on the site has a counterpart today', () => {
    // The whole point of the phase: infrastructure exists, nothing is paired yet.
    for (const path of allLivePaths()) {
      expect(counterpartFor(path), `${path} must have no counterpart`).toBeNull()
    }
  })

  test('/grow has no English counterpart, and is NOT paired with "/"', () => {
    const target = counterpartFor('/grow')
    expect(target).toBeNull()
    // Explicit guard against the tempting wrong answer.
    expect(target === null ? null : target.path).not.toBe('/')
  })

  test('the other Serbian pages have no English counterpart either', () => {
    for (const path of ['/grow/cfo', '/grow/ceo', '/professional-services']) {
      expect(counterpartFor(path), path).toBeNull()
    }
  })

  test('/contact has no Serbian counterpart yet, despite a planned URL', () => {
    const pair = pairForPath('/contact')
    expect(pair).not.toBeNull()
    expect(pair!.sr).toEqual({ path: '/sr/contact', status: 'planned' })
    // Declared, agreed, written down — and still not a destination.
    expect(counterpartFor('/contact')).toBeNull()
  })

  test('excluded pages never produce a counterpart', () => {
    expect(isTranslatablePath('/politika-privatnosti')).toBe(false)
    expect(counterpartFor('/politika-privatnosti')).toBeNull()
    expect(isTranslatablePath('/cfo')).toBe(false)
    expect(counterpartFor('/cfo')).toBeNull()
  })

  test('a synthetic COMPLETE pair does resolve, in both directions', () => {
    const toSr = counterpartFor('/synthetic-contact', SYNTHETIC_COMPLETE)
    expect(toSr).toEqual({
      locale: 'sr',
      path: '/sr/synthetic-contact',
      url: 'https://www.infinus.co/sr/synthetic-contact',
    })

    const toEn = counterpartFor('/sr/synthetic-contact', SYNTHETIC_COMPLETE)
    expect(toEn).toEqual({
      locale: 'en',
      path: '/synthetic-contact',
      url: 'https://www.infinus.co/synthetic-contact',
    })
  })

  test('a synthetic pair whose other side is only planned does NOT resolve', () => {
    const halfBuilt: readonly RoutePair[] = [
      {
        id: 'half',
        pairing: 'translatable',
        en: { path: '/half', status: 'live' },
        sr: { path: '/sr/half', status: 'planned' },
      },
    ]
    expect(counterpartFor('/half', halfBuilt)).toBeNull()
    expect(counterpartFor('/sr/half', halfBuilt)).toBeNull()
  })
})

describe('locale alternates', () => {
  test('NO live path on the site produces alternates today', () => {
    for (const path of allLivePaths()) {
      expect(localeAlternatesFor(path), `${path} must produce no alternates`).toBeNull()
    }
  })

  test('a planned path produces no alternates', () => {
    for (const path of plannedPaths()) {
      expect(localeAlternatesFor(path), path).toBeNull()
    }
  })

  test('a complete synthetic pair produces reciprocal alternates', () => {
    const fromEn = localeAlternatesFor('/synthetic-contact', SYNTHETIC_COMPLETE)
    const fromSr = localeAlternatesFor('/sr/synthetic-contact', SYNTHETIC_COMPLETE)

    expect(fromEn).not.toBeNull()
    // Reciprocity: both members advertise the identical set, or search engines ignore it.
    expect(fromSr).toEqual(fromEn)

    expect(fromEn!.languages).toEqual({
      en: 'https://www.infinus.co/synthetic-contact',
      'sr-Latn': 'https://www.infinus.co/sr/synthetic-contact',
    })
  })

  test('x-default is the English URL for a complete synthetic pair', () => {
    const alternates = localeAlternatesFor('/synthetic-contact', SYNTHETIC_COMPLETE)
    expect(alternates!.xDefault).toBe('https://www.infinus.co/synthetic-contact')
    expect(alternates!.xDefault).toBe(alternates!.languages.en)
  })

  test('an excluded synthetic pair produces no alternates even when both sides are live', () => {
    // Belt and braces: `pairing` alone is enough to refuse.
    const excluded: readonly RoutePair[] = [
      {
        id: 'excluded-pair',
        pairing: 'excluded',
        en: { path: '/x', status: 'live' },
        sr: { path: '/sr/x', status: 'live' },
      },
    ]
    expect(localeAlternatesFor('/x', excluded)).toBeNull()
    expect(counterpartFor('/x', excluded)).toBeNull()
  })
})

describe('planned routes are inert', () => {
  test('the planned set is exactly the /sr counterparts of the English pages', () => {
    const planned = plannedPaths()
    expect(planned.length).toBeGreaterThan(0)
    for (const path of planned) {
      expect(path === '/sr' || path.indexOf('/sr/') === 0, `${path} must be under /sr`).toBe(true)
    }
  })

  test('no planned path is also a live path', () => {
    const live = allLivePaths()
    for (const path of plannedPaths()) {
      expect(live.indexOf(path), `${path} cannot be planned and live`).toBe(-1)
    }
  })
})
