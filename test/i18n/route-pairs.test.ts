/**
 * Route-pair model guards.
 *
 * The point of this file is the NEGATIVE case. A pairing model is only useful if it refuses
 * to invent counterparts, so most of these tests assert that something is NOT produced:
 * no fake English GROW page, no live /sr/projectpulse, no silent fallback to the locale
 * home, no alternate for a merely planned path.
 *
 * Phase G created the first real pair, H1 added two more, H2 five and H3 the last four, so the
 * reciprocal path is asserted against the live map for all twelve. Synthetic maps carry the
 * shapes the live map does not contain — and as of H3 that now includes the PLANNED status
 * itself: no real pair is half-built any more. The inertness of `planned` still has to be
 * proven, because the next untranslated page will reintroduce it, so those tests moved from
 * the live map onto a synthetic one rather than being deleted along with their last subject.
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
import {
  COMPLETE_PAIRS as REAL_PAIRS,
  PAIRED_PATHS,
  NAVIGABLE_PATHS,
  PLANNED_SERBIAN_PATHS,
  LIVE_SERBIAN_PREFIXED_PATHS,
} from '../fixtures/locale-pairs'


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
    expect(problems.join(' ')).toContain('neither under /sr nor one of the')
  })

  test('an existing path marked "planned"', () => {
    // Uses /cfo, the one path left in LEGACY_UNPREFIXED_SERBIAN_PATHS. It used to use /grow,
    // which since the GROW migration is an ENGLISH path and trips the "must be under /sr" rule
    // first — a different problem, and one that would have masked the one under test.
    const problems = problemsFor({
      id: 'already-there',
      pairing: 'translatable',
      en: null,
      sr: { path: '/cfo', status: 'planned' },
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

  test('the four clean campaign paths are owned by EN, not by sr any more', () => {
    // These four served SERBIAN until the GROW migration and this test asserted `'sr'`. The
    // inversion is the migration: English owns the unprefixed paths, Serbian moved under /sr.
    // Getting this wrong in either direction is a visitor sent to the wrong language, so both
    // halves are pinned explicitly rather than derived from each other.
    for (const path of ['/grow', '/grow/cfo', '/grow/ceo', '/professional-services']) {
      expect(localeOfPath(path), path).toBe('en')
    }
    for (const path of ['/sr/grow', '/sr/grow/cfo', '/sr/grow/ceo', '/sr/professional-services']) {
      expect(localeOfPath(path), path).toBe('sr')
    }
  })

  test('the rejected English slugs are not routes at all', () => {
    // /grow-with-sap and friends were the first attempt at the English halves. They were never
    // pushed, deployed or indexed, and the owner rejected them, so they must not exist in the
    // map, must resolve no locale and must not be reachable as a counterpart from anywhere.
    for (const path of [
      '/grow-with-sap',
      '/grow-with-sap/cfo',
      '/grow-with-sap/ceo',
      '/sap-for-professional-services',
    ]) {
      expect(localeOfPath(path), path).toBeNull()
      expect(pairForPath(path), path).toBeNull()
      expect(counterpartFor(path), path).toBeNull()
    }
    const declared = allLivePaths().concat(plannedPaths())
    for (const path of declared) {
      expect(path.indexOf('grow-with-sap'), path).toBe(-1)
      expect(path.indexOf('sap-for-professional-services'), path).toBe(-1)
    }
  })

  test('every Serbian half is owned by sr AND lives under /sr', () => {
    // Both halves of this used to be needed separately, because four Serbian pages sat at
    // unprefixed URLs and "owned by sr" and "starts with /sr" were different claims. After the
    // migration they coincide again for every PAIRED page — so the test asserts the stronger
    // statement, and would fail if a future pair reintroduced an unprefixed Serbian half.
    const legacy: string[] = [...LEGACY_UNPREFIXED_SERBIAN_PATHS]
    for (const pair of REAL_PAIRS) {
      expect(localeOfPath(pair.sr), pair.sr).toBe('sr')
      expect(pair.sr === '/sr' || pair.sr.indexOf('/sr/') === 0, `${pair.sr} must be under /sr`).toBe(true)
      // And the legacy exception must not be reachable through a pair: the one path left in it
      // is /cfo, which is `excluded` and therefore not in REAL_PAIRS at all.
      expect(legacy.indexOf(pair.sr), `${pair.sr} must not need the legacy exception`).toBe(-1)
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
    expect(srLive.slice().sort()).toEqual(legacy.concat([...LIVE_SERBIAN_PREFIXED_PATHS]).sort())
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
  test('exactly the paths of the declared NAVIGABLE pairs have a counterpart', () => {
    // Navigable, not indexable: the Privacy pair resolves a counterpart and emits no
    // hreflang, so this list is NAVIGABLE_PATHS while the hreflang tests use PAIRED_PATHS.
    const withCounterpart = allLivePaths().filter((p) => counterpartFor(p) !== null)
    expect(withCounterpart.slice().sort()).toEqual([...NAVIGABLE_PATHS].sort())
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
      if (NAVIGABLE_PATHS.indexOf(path) !== -1) continue
      expect(counterpartFor(path), `${path} must have no counterpart`).toBeNull()
    }
  })

  test('/grow resolves to the Serbian page it used to be, and never to "/sr"', () => {
    // This assertion has now been written three ways, and the guard that survives every
    // rewrite is the one that matters: the counterpart must be the DECLARED path and must
    // never be the other locale's home page, which is the tempting wrong answer whenever a
    // page has no obvious mirror.
    const target = counterpartFor('/grow')
    expect(target).toEqual({
      locale: 'sr',
      path: '/sr/grow',
      url: 'https://www.infinus.co/sr/grow',
    })
    expect(target!.path).not.toBe('/sr')
  })

  test('the four GROW pairs resolve reciprocally on the final URLs', () => {
    const EXPECTED: ReadonlyArray<readonly [string, string]> = [
      ['/grow', '/sr/grow'],
      ['/grow/cfo', '/sr/grow/cfo'],
      ['/grow/ceo', '/sr/grow/ceo'],
      ['/professional-services', '/sr/professional-services'],
    ]
    for (const [en, sr] of EXPECTED) {
      expect(counterpartFor(en)?.path, en).toBe(sr)
      expect(counterpartFor(sr)?.path, sr).toBe(en)
    }
  })

  test('counterparts still come from the map, not from a /sr prefix rule', () => {
    // These four pairs DO happen to follow the prefix pattern now, which makes it tempting to
    // replace the lookup with string surgery. Three live cases prove that would be wrong, and
    // they are the reason content/routes.ts writes every path out as a literal.
    //
    //   · the home pair is "/" <-> "/sr", where prefixing gives "/sr/" — a different URL
    //   · the Privacy pair translates the SLUG, so no prefix reaches it
    //   · /cfo is a Serbian-era path with no counterpart, and "/sr/cfo" does not exist
    expect(counterpartFor('/')?.path).toBe('/sr')
    expect(counterpartFor('/sr')?.path).toBe('/')
    expect(counterpartFor('/privacy')?.path).toBe('/sr/politika-privatnosti')
    expect(counterpartFor('/sr/politika-privatnosti')?.path).toBe('/privacy')
    expect(counterpartFor('/cfo')).toBeNull()
    expect(localeOfPath('/sr/cfo')).toBeNull()
  })

  test('/projectpulse now resolves to a REAL Serbian counterpart', () => {
    // Until H3 this test asserted the opposite: /sr/projectpulse was declared, agreed,
    // written down — and still not a destination. It is one now, so the assertion inverts.
    const pair = pairForPath('/projectpulse')
    expect(pair).not.toBeNull()
    expect(pair!.sr).toEqual({ path: '/sr/projectpulse', status: 'live' })
    expect(counterpartFor('/projectpulse')).toEqual({
      locale: 'sr',
      path: '/sr/projectpulse',
      url: 'https://www.infinus.co/sr/projectpulse',
    })
  })

  test('a planned counterpart is still inert, proven on a synthetic map', () => {
    // The live map has no planned entry left, so this proves the RULE rather than a
    // particular route. It is the guard that has to survive H3: the next English page added
    // without a translation must not start advertising a URL that 404s.
    const halfBuilt: RoutePair[] = [
      {
        id: 'half-built',
        pairing: 'translatable',
        en: { path: '/new-thing', status: 'live' },
        sr: { path: '/sr/new-thing', status: 'planned' },
      },
    ]
    const halfPair = pairForPath('/new-thing', halfBuilt)
    expect(halfPair).not.toBeNull()
    // `sr` is nullable on a RoutePair — the Serbian legacy pages have `en: null` — so the
    // entry is asserted whole rather than dereferenced twice.
    expect(halfPair!.sr).toEqual({ path: '/sr/new-thing', status: 'planned' })
    expect(counterpartFor('/new-thing', halfBuilt)).toBeNull()
    expect(localeAlternatesFor('/new-thing', halfBuilt)).toBeNull()
    expect(plannedPaths(halfBuilt)).toEqual(['/sr/new-thing'])
    expect(allLivePaths(halfBuilt)).toEqual(['/new-thing'])
  })

  test('activating the translated pairs did not activate anything else', () => {
    // Guarded the specific H1 risk: flipping statuses and accidentally waking the whole
    // planned set. PLANNED_SERBIAN_PATHS is empty as of H3, so this loop is now vacuous —
    // and the assertion below is what stops that from passing silently forever.
    for (const path of PLANNED_SERBIAN_PATHS) {
      expect(plannedPaths(), `${path} must still be planned`).toContain(path)
      expect(counterpartFor(path), `${path} must not resolve`).toBeNull()
    }
    // Every path the fixture says is planned, and nothing else, is planned in the map.
    expect(plannedPaths().slice().sort()).toEqual(PLANNED_SERBIAN_PATHS.slice().sort())
  })

  test('excluded pages never produce a counterpart', () => {
    // The Privacy pair is the interesting case: NOT translatable (so no hreflang), yet it
    // DOES resolve a counterpart (so the switcher works). Asserting both directions is the
    // point — it is the one place where those two answers differ.
    expect(isTranslatablePath('/privacy')).toBe(false)
    expect(isTranslatablePath('/sr/politika-privatnosti')).toBe(false)
    expect(localeAlternatesFor('/privacy')).toBeNull()
    expect(localeAlternatesFor('/sr/politika-privatnosti')).toBeNull()
    expect(counterpartFor('/privacy')).toEqual({
      locale: 'sr',
      path: '/sr/politika-privatnosti',
      url: 'https://www.infinus.co/sr/politika-privatnosti',
    })
    expect(counterpartFor('/sr/politika-privatnosti')).toEqual({
      locale: 'en',
      path: '/privacy',
      url: 'https://www.infinus.co/privacy',
    })
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
  test('ONLY the declared complete pairs produce alternates', () => {
    const withAlternates = allLivePaths().filter((p) => localeAlternatesFor(p) !== null)
    expect(withAlternates.slice().sort()).toEqual([...PAIRED_PATHS].sort())
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
  test('the planned set is EMPTY: every declared route is now a real destination', () => {
    // This test tracked the shrinking backlog: /sr/contact left it in G, /sr and /sr/faq in
    // H1, the five case studies in H2, and the four product pages in H3 emptied it.
    const planned = plannedPaths()
    expect(planned).toEqual([])
    // The property it used to assert still has to hold whenever the set refills.
    for (const path of planned) {
      expect(path === '/sr' || path.indexOf('/sr/') === 0, `${path} must be under /sr`).toBe(true)
    }
    for (const pair of REAL_PAIRS) expect(planned, pair.sr).not.toContain(pair.sr)
  })

  test('an empty planned set does not mean an empty map', () => {
    // Guards the way this could go wrong silently: plannedPaths() would also return [] if
    // the pair map were emptied or mis-parsed. Assert there is a substantial live map behind
    // the empty backlog.
    expect(allLivePaths().length).toBeGreaterThanOrEqual(30)
    expect(ROUTE_PAIRS.length).toBeGreaterThanOrEqual(12)
  })

  test('no planned path is also a live path', () => {
    const live = allLivePaths()
    for (const path of plannedPaths()) {
      expect(live.indexOf(path), `${path} cannot be planned and live`).toBe(-1)
    }
  })
})
