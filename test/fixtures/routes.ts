/**
 * CANONICAL ROUTE INVENTORY — single source of truth for the SEO regression harness.
 *
 * Every expected value below is an INDEPENDENT literal, deliberately not derived from
 * lib/seo.ts, next-sitemap.config.js or any other production module. If the harness
 * computed its expectations from the same code it is testing, it could only ever
 * restate the implementation and would detect nothing.
 *
 * ── How to maintain ────────────────────────────────────────────────────────────
 * Adding a route to app/ WITHOUT adding it here makes `npm run seo:assert-build`
 * fail with "in build manifest but not classified in the fixture". That failure is
 * the point: no route reaches production without someone deciding its lang, robots,
 * canonical and sitemap behaviour.
 *
 * ── IMPORTANT: this describes the site as it is TODAY ──────────────────────────
 * Several expectations encode output that is currently WRONG. They are marked with
 * `knownIssue` and must not be "corrected" here. The harness's job in this phase is
 * to detect unintended drift, so the baseline has to be honest about today's bugs.
 * A later phase changes the production code AND the expectation together, in one
 * reviewable diff.
 *
 * Verified against a fresh `next build` of commit a83e76f:
 *   31 manifest entries = 22 page routes + 8 route handlers + 1 framework route
 *   23 rendered .html files (22 pages + _not-found)
 *   26 prerendered routes, 0 dynamic routes
 *   16 sitemap URLs
 */

export const PRODUCTION_ORIGIN = 'https://www.infinus.co' as const

export type RouteKind =
  /** Public page that should be indexed and appear in the sitemap. */
  | 'page-indexable'
  /** Public page intentionally excluded from the index. */
  | 'page-noindex'
  /** Page route that is still built but is redirected away by next.config.js. */
  | 'page-redirected'
  /** Internal demo/debug page: robots.txt-blocked, not for indexing. */
  | 'page-internal'
  /** Next.js framework route. */
  | 'page-framework'
  /** Route handler serving text/plain or debug output. */
  | 'handler-utility'
  /** Route handler under /api. */
  | 'handler-api'

export interface RouteExpectation {
  /** URL path as it appears in .next/app-path-routes-manifest.json. */
  path: string
  kind: RouteKind
  /**
   * Expected `<html lang="...">` in the built HTML.
   * `null` for route handlers, which emit no HTML document.
   */
  expectLang: string | null
  /**
   * Expected `<meta name="robots">` content, compared after collapsing whitespace
   * (Next emits `index,follow` from a string value and `index, follow` from the
   * object form; the directives are identical and the spacing is not meaningful).
   * `null` means no robots meta tag is expected at all.
   */
  expectRobots: string | null
  /** Expected absolute canonical URL, or `null` if no canonical tag is expected. */
  expectCanonical: string | null
  /** Must this path appear exactly once in the generated sitemap? */
  inSitemap: boolean
  /** Must a prerendered .html file exist for this route in .next/server/app? */
  expectStaticHtml: boolean
  /**
   * Set when the expectation above records current-but-incorrect output.
   * Phase E/C changes the production code and this string together.
   */
  knownIssue?: string
}

const indexable = (path: string, canonicalPath = path): RouteExpectation => ({
  path,
  kind: 'page-indexable',
  expectLang: 'en',
  expectRobots: 'index, follow',
  expectCanonical: `${PRODUCTION_ORIGIN}${canonicalPath}`,
  inSitemap: true,
  expectStaticHtml: true,
})

/**
 * The four Serbian-content campaign pages. Identical in every respect to the English
 * indexable pages EXCEPT that they serve Serbian copy under `lang="en"`, because
 * `<html lang>` lives in the single root layout and no child can override it.
 */
const serbianPage = (path: string): RouteExpectation => ({
  ...indexable(path),
  knownIssue:
    'Serves Serbian copy under <html lang="en">. Phase E introduces a second root ' +
    'layout and this expectation becomes "sr-Latn". Do not change it before then.',
})

const handler = (path: string, kind: 'handler-utility' | 'handler-api'): RouteExpectation => ({
  path,
  kind,
  expectLang: null,
  expectRobots: null,
  expectCanonical: null,
  inSitemap: false,
  expectStaticHtml: false,
})

export const ROUTES: readonly RouteExpectation[] = [
  // ── 16 public indexable pages ────────────────────────────────────────────────
  indexable('/', '/'),
  indexable('/contact'),
  indexable('/faq'),
  indexable('/case-study/retail1'),
  indexable('/case-study/pharma1'),
  indexable('/case-study/pharma2'),
  indexable('/case-study/nearshoring1'),
  indexable('/case-study/manufacturing1'),
  indexable('/projectpulse'),
  indexable('/projectpulse/brochure'),
  indexable('/projectpulse/video'),
  indexable('/sap-packaged-solutions/sap-starter-package'),
  serbianPage('/grow'),
  serbianPage('/grow/cfo'),
  serbianPage('/grow/ceo'),
  serbianPage('/professional-services'),

  // ── 1 public noindex page ────────────────────────────────────────────────────
  {
    path: '/privacy',
    kind: 'page-noindex',
    expectLang: 'en',
    expectRobots: 'noindex, follow',
    expectCanonical: `${PRODUCTION_ORIGIN}/privacy`,
    inSitemap: false,
    expectStaticHtml: true,
  },

  // ── 1 redirected page route ──────────────────────────────────────────────────
  {
    // Still built and prerendered even though next.config.js 301s it away, so the
    // HTML exists and its canonical correctly points at the redirect target.
    path: '/cfo',
    kind: 'page-redirected',
    expectLang: 'en',
    expectRobots: 'index, follow',
    expectCanonical: `${PRODUCTION_ORIGIN}/grow/cfo`,
    inSitemap: false,
    expectStaticHtml: true,
    knownIssue:
      'Unreachable duplicate of /grow/cfo that is still built. Scheduled for deletion ' +
      'in the Cleanup phase, which must land before any GROW URL migration.',
  },

  // ── 4 internal / demo pages ──────────────────────────────────────────────────
  ...(['/hero-demo', '/combined-demo', '/services-demo', '/debug/visitor-intelligence'] as const).map(
    (path): RouteExpectation => ({
      path,
      kind: 'page-internal',
      expectLang: 'en',
      // Currently inherits the site-wide index,follow from the root layout. Blocked
      // in robots.txt only, which prevents crawling but not indexing of a linked URL.
      expectRobots: 'index, follow',
      expectCanonical: null,
      inSitemap: false,
      expectStaticHtml: true,
      knownIssue:
        'Internal route with no noindex meta tag; only robots.txt-blocked. Cleanup ' +
        'phase adds an explicit noindex. Until then this records reality.',
    })
  ),

  // ── 1 framework route ────────────────────────────────────────────────────────
  {
    path: '/_not-found',
    kind: 'page-framework',
    expectLang: 'en',
    expectRobots: 'index, follow',
    expectCanonical: null,
    inSitemap: false,
    expectStaticHtml: true,
  },

  // ── 4 utility route handlers ─────────────────────────────────────────────────
  handler('/llms.txt', 'handler-utility'),
  handler('/well-known/llms.txt', 'handler-utility'),
  handler('/.well-known/llms.txt', 'handler-utility'),
  handler('/vi-debug', 'handler-utility'),

  // ── 4 API route handlers ─────────────────────────────────────────────────────
  handler('/api/contact', 'handler-api'),
  handler('/api/join-team', 'handler-api'),
  handler('/api/upload', 'handler-api'),
  handler('/api/projectpulse/pdf', 'handler-api'),
]

/** Kinds that produce an HTML document (i.e. appear in app-path-routes-manifest as /page). */
export const PAGE_KINDS: readonly RouteKind[] = [
  'page-indexable',
  'page-noindex',
  'page-redirected',
  'page-internal',
]

export const HANDLER_KINDS: readonly RouteKind[] = ['handler-utility', 'handler-api']

export const isPageRoute = (r: RouteExpectation): boolean => PAGE_KINDS.includes(r.kind)
export const isHandlerRoute = (r: RouteExpectation): boolean => HANDLER_KINDS.includes(r.kind)
export const isFrameworkRoute = (r: RouteExpectation): boolean => r.kind === 'page-framework'

export const pageRoutes = (): RouteExpectation[] => ROUTES.filter(isPageRoute)
export const handlerRoutes = (): RouteExpectation[] => ROUTES.filter(isHandlerRoute)
export const htmlRoutes = (): RouteExpectation[] => ROUTES.filter((r) => r.expectStaticHtml)
export const sitemapRoutes = (): RouteExpectation[] => ROUTES.filter((r) => r.inSitemap)
export const publicPages = (): RouteExpectation[] =>
  ROUTES.filter((r) => r.kind === 'page-indexable' || r.kind === 'page-noindex')

/**
 * Counts verified against the build of a83e76f. These are asserted in
 * test/seo/route-fixture.test.ts so an edit to ROUTES cannot silently change them.
 */
export const EXPECTED_COUNTS = {
  indexable: 16,
  noindex: 1,
  redirected: 1,
  internal: 4,
  framework: 1,
  utilityHandlers: 4,
  apiHandlers: 4,
  /** page routes in app-path-routes-manifest.json (excludes _not-found) */
  manifestPages: 22,
  /** route handlers in app-path-routes-manifest.json */
  manifestHandlers: 8,
  /** total manifest entries: 22 pages + 8 handlers + 1 _not-found */
  manifestTotal: 31,
  /** rendered .html files: 22 pages + _not-found */
  renderedHtml: 23,
  sitemapUrls: 16,
  /** the 17 public pages whose <head> is snapshotted (16 indexable + /privacy) */
  snapshotPages: 17,
} as const
