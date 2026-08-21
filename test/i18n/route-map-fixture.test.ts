/**
 * The link between the i18n route map and the independent A2 route fixture.
 *
 * There must be ONE route inventory, not two that can disagree. This file is that
 * connection, and it deliberately runs in ONE direction only:
 *
 *   content/routes.ts  ──asserted against──►  test/fixtures/routes.ts  ──asserted by the
 *                                                                        harness against
 *                                                                        the real build
 *
 * The fixture stays an INDEPENDENT baseline: it is never derived from content/routes.ts,
 * and nothing here relaxes an expectation to make the two agree. The consequence of the
 * chain is what matters — a `live` path in the pair map that does not exist as a real built
 * route cannot pass both this file and `npm run seo:assert-build`.
 *
 * The filesystem check (which locale ROOT owns each page) lives in
 * test/shell/locale-roots.test.tsx and is asserted against here too, so a page cannot be
 * declared Serbian in the pair map while sitting under the English root.
 */
import { describe, test, expect } from 'vitest'
import { readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { ROUTE_PAIRS } from '@/content/routes'
import { allLivePaths, livePathsFor, localeAlternatesFor, localeOfPath, plannedPaths } from '@/lib/locale-routes'
import { ROUTES, publicPages, type RouteExpectation } from '../fixtures/routes'
import {
  COMPLETE_PAIRS as REAL_PAIRS,
  PAIRED_PATHS,
  LIVE_SERBIAN_PREFIXED_PATHS,
} from '../fixtures/locale-pairs'

const ROOT = process.cwd()
const APP = join(ROOT, 'app')

function pageFiles(dir = APP, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) pageFiles(full, out)
    else if (entry === 'page.tsx' || entry === 'page.ts') out.push(relative(ROOT, full))
  }
  return out
}

function urlFor(pagePath: string): string {
  const segments = pagePath
    .split(sep)
    .slice(1, -1)
    .filter((s) => !(s.startsWith('(') && s.endsWith(')')))
  return '/' + segments.join('/')
}

const pages = pageFiles()
const fixtureByPath: Record<string, RouteExpectation> = {}
for (const route of ROUTES) fixtureByPath[route.path] = route

describe('every live pair-map path is a real classified route', () => {
  test('each live path is classified in the A2 fixture', () => {
    for (const path of allLivePaths()) {
      expect(fixtureByPath[path], `${path} is "live" in content/routes.ts but not classified`).toBeDefined()
    }
  })

  test('each live path is a route that produces a real HTML document', () => {
    for (const path of allLivePaths()) {
      expect(fixtureByPath[path].expectStaticHtml, `${path} produces no HTML`).toBe(true)
    }
  })

  test('each live path is served by a real page file on disk', () => {
    const fromFs = pages.map(urlFor)
    for (const path of allLivePaths()) {
      expect(fromFs.indexOf(path), `${path} has no page.tsx`).not.toBe(-1)
    }
  })

  test('no live path is a route handler, a redirect-only path or the framework 404', () => {
    for (const path of allLivePaths()) {
      expect(['handler-utility', 'handler-api', 'redirect-only', 'page-framework']).not.toContain(
        fixtureByPath[path].kind
      )
    }
  })
})

describe('planned routes still do not exist', () => {
  test('no planned path is classified in the fixture', () => {
    for (const path of plannedPaths()) {
      expect(fixtureByPath[path], `${path} must not exist yet`).toBeUndefined()
    }
  })

  test('no planned path has a page file on disk', () => {
    const fromFs = pages.map(urlFor)
    for (const path of plannedPaths()) {
      expect(fromFs.indexOf(path), `${path} must not exist yet`).toBe(-1)
    }
  })

  test('the ONLY /sr routes that exist are the ones the map declares live', () => {
    // The strongest guard for "H1 launched exactly two more Serbian URLs". Every other
    // planned Serbian path must still have no page and no fixture entry.
    const declaredSr: string[] = livePathsFor('sr').filter((p) => p === '/sr' || p.indexOf('/sr/') === 0)
    expect(declaredSr.slice().sort()).toEqual([...LIVE_SERBIAN_PREFIXED_PATHS].sort())

    for (const page of pages) {
      const url = urlFor(page)
      if (url !== '/sr' && url.indexOf('/sr/') !== 0) continue
      expect(declaredSr, `${page} serves undeclared ${url}`).toContain(url)
    }
    for (const route of ROUTES) {
      if (route.path !== '/sr' && route.path.indexOf('/sr/') !== 0) continue
      expect(declaredSr, `${route.path} is classified but undeclared`).toContain(route.path)
    }
  })

  test('/sr is now a real route with a page file and a fixture entry', () => {
    expect(pages.map(urlFor)).toContain('/sr')
    expect(ROUTES.map((r) => r.path)).toContain('/sr')
  })
})

describe('locale ownership agrees with the filesystem root layout', () => {
  const enPageUrls = pages.filter((p) => p.includes(`(en)${sep}`)).map(urlFor)
  const srPageUrls = pages.filter((p) => p.includes(`(sr)${sep}`)).map(urlFor)

  test('every path the map calls Serbian sits under the Serbian root', () => {
    for (const path of livePathsFor('sr')) {
      expect(srPageUrls.indexOf(path), `${path} is sr in the map but not under app/(sr)/`).not.toBe(-1)
    }
  })

  test('every path the map calls English sits under the English root', () => {
    for (const path of livePathsFor('en')) {
      expect(enPageUrls.indexOf(path), `${path} is en in the map but not under app/(en)/`).not.toBe(-1)
    }
  })

  test('the map’s locale agrees with the <html lang> the fixture expects', () => {
    for (const path of allLivePaths()) {
      const locale = localeOfPath(path)
      const expected = locale === 'sr' ? 'sr-Latn' : 'en'
      expect(fixtureByPath[path].expectLang, `${path} (${locale})`).toBe(expected)
    }
  })
})

describe('coverage: every public page has a known locale ownership', () => {
  test('every public page appears exactly once in the pair map', () => {
    const live = allLivePaths()
    for (const route of publicPages()) {
      const occurrences = live.filter((p) => p === route.path).length
      expect(occurrences, `${route.path} must appear exactly once in the pair map`).toBe(1)
    }
  })

  test('internal demo/debug pages are deliberately absent from the pair map', () => {
    const live: string[] = allLivePaths()
    for (const path of ['/hero-demo', '/combined-demo', '/services-demo', '/debug/visitor-intelligence']) {
      expect(live.indexOf(path), `${path} must not be translatable`).toBe(-1)
    }
  })

  test('the pair map covers the public pages plus /cfo, and nothing else', () => {
    const expected = publicPages()
      .map((r) => r.path)
      .concat(['/cfo'])
      .sort()
    expect(allLivePaths().slice().sort()).toEqual(expected)
  })
})

describe('the legal page is classified as a non-pair', () => {
  test('it is present, excluded, and has no Serbian side', () => {
    const legal = ROUTE_PAIRS.filter((p) => p.id === 'legal-privacy-policy')[0]
    expect(legal).toBeDefined()
    expect(legal.pairing).toBe('excluded')
    expect(legal.en).toEqual({ path: '/politika-privatnosti', status: 'live' })
    expect(legal.sr).toBeNull()
  })

  test('the fixture still expects it noindex and out of the sitemap', () => {
    // Unchanged by this phase; asserted here so pairing work cannot drift it.
    const legal = fixtureByPath['/politika-privatnosti']
    expect(legal.expectRobots).toBe('noindex, follow')
    expect(legal.inSitemap).toBe(false)
    expect(legal.expectLang).toBe('en')
  })
})

describe('/cfo stays a redirect, never a language-switch destination', () => {
  test('it is excluded from pairing', () => {
    const cfo = ROUTE_PAIRS.filter((p) => p.id === 'cfo-legacy-redirect')[0]
    expect(cfo.pairing).toBe('excluded')
    expect(cfo.sr).toEqual({ path: '/cfo', status: 'live' })
  })

  test('the fixture still expects it redirected and canonicalised to /grow/cfo', () => {
    expect(fixtureByPath['/cfo'].kind).toBe('page-redirected')
    expect(fixtureByPath['/cfo'].expectCanonical).toBe('https://www.infinus.co/grow/cfo')
  })
})

describe('every declared pair agrees with the independent fixture', () => {
  test('both halves are classified as indexable pages', () => {
    for (const path of PAIRED_PATHS) {
      const route = fixtureByPath[path]
      expect(route, `${path} must be classified`).toBeDefined()
      expect(route.kind).toBe('page-indexable')
      expect(route.inSitemap).toBe(true)
      expect(route.expectStaticHtml).toBe(true)
      expect(route.expectRobots).toBe('index, follow')
    }
  })

  test('each half is self-canonical, on the production origin', () => {
    for (const path of PAIRED_PATHS) {
      expect(fixtureByPath[path].expectCanonical, path).toBe(`https://www.infinus.co${path}`)
    }
  })

  test('the fixture langs match the locales the map assigns', () => {
    for (const pair of REAL_PAIRS) {
      expect(fixtureByPath[pair.en].expectLang, pair.en).toBe('en')
      expect(fixtureByPath[pair.sr].expectLang, pair.sr).toBe('sr-Latn')
      expect(localeOfPath(pair.en), pair.en).toBe('en')
      expect(localeOfPath(pair.sr), pair.sr).toBe('sr')
    }
  })

  test('the alternate URLs the map produces are exactly the fixture canonicals', () => {
    for (const pair of REAL_PAIRS) {
      const alternates = localeAlternatesFor(pair.en)
      expect(alternates, pair.en).not.toBeNull()
      expect(alternates!.languages.en).toBe(fixtureByPath[pair.en].expectCanonical)
      expect(alternates!.languages['sr-Latn']).toBe(fixtureByPath[pair.sr].expectCanonical)
      expect(alternates!.xDefault).toBe(fixtureByPath[pair.en].expectCanonical)
    }
  })

  test('no OTHER fixture page is half of a complete pair', () => {
    for (const route of ROUTES) {
      if (PAIRED_PATHS.indexOf(route.path) !== -1) continue
      expect(localeAlternatesFor(route.path), `${route.path} must emit no alternates`).toBeNull()
    }
  })
})

describe('asymmetry is genuinely representable, not just claimed', () => {
  test('at least one live Serbian path is NOT the /sr-prefixed form of an English path', () => {
    // Proof the model does not derive URLs by prefixing: /grow is live Serbian at an
    // unprefixed URL, and no /sr/grow exists or is planned.
    const srLive = livePathsFor('sr')
    expect(srLive.indexOf('/grow')).not.toBe(-1)
    expect(plannedPaths().indexOf('/sr/grow')).toBe(-1)
    expect(allLivePaths().indexOf('/sr/grow')).toBe(-1)
  })

  test('at least one pair has a null side in each direction', () => {
    const nullEn = ROUTE_PAIRS.filter((p) => p.en === null && p.sr !== null)
    const nullSr = ROUTE_PAIRS.filter((p) => p.sr === null && p.en !== null)
    expect(nullEn.length).toBeGreaterThan(0)
    expect(nullSr.length).toBeGreaterThan(0)
  })
})
