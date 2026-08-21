/**
 * Route-pair model guards.
 *
 * The point of this file is the NEGATIVE case. A pairing model is only useful if it refuses
 * to invent counterparts, so most of these tests assert that something is NOT produced:
 * no fake English GROW page, no live /sr/projectpulse, no silent fallback to the locale
 * home, no alternate for a merely planned path.
 *
 * Phase G created the first real pair and Phase H1 added two more, so the reciprocal path is
 * asserted against the live map for all three. Synthetic maps are still used for the shapes
 * the live map does not contain — a half-built pair, an excluded pair with two live sides —
 * so those cases can be proven without creating more /sr routes.
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

/**
 * The genuinely complete pairs in the live map. Everything else must stay unpaired.
 *
 * Phase G made contact real; Phase H1 added home and faq. Listed explicitly so activating a
 * fourth pair has to be a deliberate edit here, not a silent consequence.
 */
const REAL_PAIRS = [
  { en: '/', sr: '/sr' },
  { en: '/faq', sr: '/sr/faq' },
  { en: '/contact', sr: '/sr/contact' },
] as const
const PAIRED_PATHS: string[] = REAL_PAIRS.flatMap((p) => [p.en, p.sr])

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

  test('every Serbian half is owned by sr, at a properly prefixed URL', () => {
    for (const pair of REAL_PAIRS) {
      expect(localeOfPath(pair.sr), pair.sr).toBe('sr')
      expect(pair.sr === '/sr' || pair.sr.indexOf('/sr/') === 0, pair.sr).toBe(true)
    }
  })

  test('live Serbian paths are the legacy unprefixed set plus properly /sr-prefixed ones', () => {
    // The legacy exception is closed: a NEW Serbian route must sit under /sr, and
    // validateRoutePairs rejects any that does not.
    const legacy: string[] = [...LEGACY_UNPREFIXED_SERBIAN_PATHS]
    const srLive = livePathsFor('sr')
    for (const path of srLive) {
      const isLegacy = legacy.indexOf(path) !== -1
      const isPrefixed = path === '/sr' || path.indexOf('/sr/') === 0
      expect(isLegacy || isPrefixed, `${path} is neither legacy nor /sr-prefixed`).toBe(true)
    }
    expect(srLive.slice().sort()).toEqual(legacy.concat(REAL_PAIRS.map((p) => p.sr)).sort())
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
  test('exactly the six paths of the three real pairs have a counterpart', () => {
    const withCounterpart = allLivePaths().filter((p) => counterpartFor(p) !== null)
    expect(withCounterpart.slice().sort()).toEqual(PAIRED_PATHS.slice().sort())
  })

  test('each real pair resolves reciprocally', () => {
    for (const pair of REAL_PAIRS) {
      expect(counterpartFor(pair.en), pair.en).toEqual({
        locale: 'sr',
        path: pair.sr,
        url: `https://www.infinus.co${pair.sr}`,
      })
      expect(counterpartFor(pair.sr), pair.sr).toEqual({
        locale: 'en',
        path: pair.en,
        url: `https://www.infinus.co${pair.en}`,
      })
    }
  })

  test('every OTHER live path still has no counterpart', () => {
    for (const path of allLivePaths()) {
      if (PAIRED_PATHS.indexOf(path) !== -1) continue
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

  test('/projectpulse has no Serbian counterpart, despite a planned URL', () => {
    const pair = pairForPath('/projectpulse')
    expect(pair).not.toBeNull()
    expect(pair!.sr).toEqual({ path: '/sr/projectpulse', status: 'planned' })
    // Declared, agreed, written down — and still not a destination.
    expect(counterpartFor('/projectpulse')).toBeNull()
  })

  test('activating three pairs did not activate anything else', () => {
    // Guards the specific H1 risk: flipping two statuses and accidentally waking the whole
    // planned set.
    const stillPlanned = [
      '/sr/projectpulse',
      '/sr/projectpulse/brochure',
      '/sr/projectpulse/video',
      '/sr/case-study/pharma2',
      '/sr/case-study/retail1',
      '/sr/sap-packaged-solutions/sap-starter-package',
    ]
    for (const path of stillPlanned) {
      expect(plannedPaths(), `${path} must still be planned`).toContain(path)
      expect(counterpartFor(path), `${path} must not resolve`).toBeNull()
    }
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
  test('ONLY the three real pairs produce alternates', () => {
    const withAlternates = allLivePaths().filter((p) => localeAlternatesFor(p) !== null)
    expect(withAlternates.slice().sort()).toEqual(PAIRED_PATHS.slice().sort())
  })

  test('each real pair emits the identical reciprocal set from both sides', () => {
    for (const pair of REAL_PAIRS) {
      const fromEn = localeAlternatesFor(pair.en)
      const fromSr = localeAlternatesFor(pair.sr)
      expect(fromEn, pair.en).not.toBeNull()
      expect(fromSr, pair.sr).toEqual(fromEn)
      expect(fromEn!.languages).toEqual({
        en: `https://www.infinus.co${pair.en}`,
        'sr-Latn': `https://www.infinus.co${pair.sr}`,
      })
      // x-default is always the English half.
      expect(fromEn!.xDefault).toBe(`https://www.infinus.co${pair.en}`)
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
  test('the planned set is /sr counterparts only, and no longer contains /sr/contact', () => {
    const planned = plannedPaths()
    expect(planned.length).toBeGreaterThan(0)
    for (const path of planned) {
      expect(path === '/sr' || path.indexOf('/sr/') === 0, `${path} must be under /sr`).toBe(true)
    }
    for (const pair of REAL_PAIRS) expect(planned, pair.sr).not.toContain(pair.sr)
  })

  test('no planned path is also a live path', () => {
    const live = allLivePaths()
    for (const path of plannedPaths()) {
      expect(live.indexOf(path), `${path} cannot be planned and live`).toBe(-1)
    }
  })
})
