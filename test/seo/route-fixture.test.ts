/**
 * Internal-consistency tests for the canonical route inventory.
 *
 * These run in `npm test` and need NO build output, so the fixture cannot rot
 * unnoticed between builds. The build-dependent half — fixture vs. actual build
 * manifest, static HTML existence, robots/canonical/lang in the rendered output — is
 * asserted by `npm run seo:assert-build`, which requires `next build` to have run.
 *
 * Nothing here is derived from production code: every expectation is compared against
 * the literal EXPECTED_COUNTS in the fixture, so an accidental edit to ROUTES fails
 * rather than silently redefining the truth.
 */
import { describe, test, expect } from 'vitest'
import {
  EXPECTED_COUNTS,
  PRODUCTION_ORIGIN,
  ROUTES,
  handlerRoutes,
  htmlRoutes,
  isHandlerRoute,
  isPageRoute,
  pageRoutes,
  publicPages,
  sitemapRoutes,
  type RouteKind,
} from '../fixtures/routes'

const byKind = (kind: RouteKind) => ROUTES.filter((r) => r.kind === kind)

describe('route fixture — shape', () => {
  test('every path is root-relative and free of trailing slashes or query strings', () => {
    for (const r of ROUTES) {
      expect(r.path.startsWith('/'), `${r.path} must start with /`).toBe(true)
      expect(r.path === '/' || !r.path.endsWith('/'), `${r.path} must not have a trailing slash`).toBe(true)
      expect(r.path).not.toMatch(/[?#]/)
    }
  })

  test('paths are unique', () => {
    const paths = ROUTES.map((r) => r.path)
    expect(new Set(paths).size).toBe(paths.length)
  })

  test('every route is classified as exactly one of page / handler / framework', () => {
    for (const r of ROUTES) {
      const classes = [isPageRoute(r), isHandlerRoute(r), r.kind === 'page-framework'].filter(Boolean)
      expect(classes.length, `${r.path} is classified ${classes.length} times`).toBe(1)
    }
  })
})

describe('route fixture — counts match the verified build', () => {
  test('per-kind counts', () => {
    expect(byKind('page-indexable')).toHaveLength(EXPECTED_COUNTS.indexable)
    expect(byKind('page-noindex')).toHaveLength(EXPECTED_COUNTS.noindex)
    expect(byKind('page-redirected')).toHaveLength(EXPECTED_COUNTS.redirected)
    expect(byKind('page-internal')).toHaveLength(EXPECTED_COUNTS.internal)
    expect(byKind('page-framework')).toHaveLength(EXPECTED_COUNTS.framework)
    expect(byKind('handler-utility')).toHaveLength(EXPECTED_COUNTS.utilityHandlers)
    expect(byKind('handler-api')).toHaveLength(EXPECTED_COUNTS.apiHandlers)
  })

  test('page routes, handlers and rendered HTML add up to the manifest totals', () => {
    expect(pageRoutes()).toHaveLength(EXPECTED_COUNTS.manifestPages)
    expect(handlerRoutes()).toHaveLength(EXPECTED_COUNTS.manifestHandlers)
    expect(htmlRoutes()).toHaveLength(EXPECTED_COUNTS.renderedHtml)
    expect(pageRoutes().length + handlerRoutes().length + byKind('page-framework').length).toBe(
      EXPECTED_COUNTS.manifestTotal
    )
  })

  test('sitemap membership equals the indexable set', () => {
    expect(sitemapRoutes()).toHaveLength(EXPECTED_COUNTS.sitemapUrls)
    expect(sitemapRoutes().map((r) => r.path).sort()).toEqual(
      byKind('page-indexable')
        .map((r) => r.path)
        .sort()
    )
  })

  test('the snapshot set is the 16 indexable pages plus /privacy', () => {
    expect(publicPages()).toHaveLength(EXPECTED_COUNTS.snapshotPages)
    expect(publicPages().map((r) => r.path)).toContain('/privacy')
  })
})

describe('route fixture — expectation coherence', () => {
  test('indexable pages are in the sitemap, have a canonical, and are not noindex', () => {
    for (const r of byKind('page-indexable')) {
      expect(r.inSitemap, `${r.path} must be in the sitemap`).toBe(true)
      expect(r.expectStaticHtml, `${r.path} must be statically rendered`).toBe(true)
      expect(r.expectCanonical, `${r.path} must declare a canonical`).not.toBeNull()
      expect(r.expectRobots ?? '', `${r.path} must not be noindex`).not.toContain('noindex')
    }
  })

  test('nothing that is noindex, redirected, internal or a handler is in the sitemap', () => {
    for (const r of ROUTES) {
      if (r.kind === 'page-indexable') continue
      expect(r.inSitemap, `${r.path} (${r.kind}) must not be in the sitemap`).toBe(false)
    }
  })

  test('route handlers expect no HTML, lang, robots, canonical or sitemap entry', () => {
    for (const r of handlerRoutes()) {
      expect(r.expectStaticHtml).toBe(false)
      expect(r.expectLang).toBeNull()
      expect(r.expectRobots).toBeNull()
      expect(r.expectCanonical).toBeNull()
      expect(r.inSitemap).toBe(false)
    }
  })

  test('every route expecting HTML also declares a lang and robots expectation', () => {
    for (const r of htmlRoutes()) {
      expect(r.expectLang, `${r.path} needs an expected lang`).not.toBeNull()
      expect(r.expectRobots, `${r.path} needs an expected robots value`).not.toBeNull()
    }
  })

  test('every canonical is absolute on the production origin', () => {
    for (const r of ROUTES) {
      if (r.expectCanonical === null) continue
      expect(r.expectCanonical.startsWith(`${PRODUCTION_ORIGIN}/`), `${r.path} canonical must be absolute`).toBe(true)
      expect(r.expectCanonical).not.toMatch(/localhost|127\.0\.0\.1|vercel\.app/)
    }
  })

  test('canonical matches its own path except where a redirect makes that wrong', () => {
    for (const r of ROUTES) {
      if (r.expectCanonical === null) continue
      const canonicalPath = r.expectCanonical.slice(PRODUCTION_ORIGIN.length) || '/'
      if (r.kind === 'page-redirected') {
        // A redirected route must point at its target, never at itself.
        expect(canonicalPath, `${r.path} must not self-canonicalise`).not.toBe(r.path)
      } else {
        expect(canonicalPath, `${r.path} must be self-canonical`).toBe(r.path)
      }
    }
  })
})

describe('route fixture — known issues are explicit', () => {
  test('the four Serbian pages are flagged as serving Serbian under lang="en"', () => {
    const serbian = ['/grow', '/grow/cfo', '/grow/ceo', '/professional-services']
    for (const path of serbian) {
      const route = ROUTES.find((r) => r.path === path)
      expect(route, `${path} must be in the fixture`).toBeDefined()
      expect(route?.expectLang).toBe('en')
      expect(route?.knownIssue, `${path} must carry a knownIssue note`).toBeTruthy()
      expect(route?.knownIssue).toMatch(/lang="en"/)
    }
  })

  test('every knownIssue names the phase or action that will resolve it', () => {
    for (const r of ROUTES.filter((x) => x.knownIssue)) {
      expect(r.knownIssue, `${r.path} knownIssue must say what resolves it`).toMatch(/Phase|Cleanup/)
    }
  })

  test('no route is silently expected to be broken without a knownIssue', () => {
    // An internal page with index,follow is a defect; it must be flagged.
    for (const r of byKind('page-internal')) {
      expect(r.knownIssue, `${r.path} has index,follow and must carry a knownIssue`).toBeTruthy()
    }
  })
})
