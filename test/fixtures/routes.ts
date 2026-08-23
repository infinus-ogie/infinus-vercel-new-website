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
 * Verified against a fresh `next build` — Phase H2, after adding the five Serbian case
 * studies:
 *   39 manifest entries = 30 page routes + 8 route handlers + 1 framework route
 *   31 rendered .html files (30 pages + _not-found)
 *   34 prerendered routes, 0 dynamic routes
 *   24 sitemap URLs
 *
 * Preceding verified states: 31 / 22 / 23 / 26 / 16 before /sr/contact, 32 / 23 / 24 / 27 / 17
 * after Phase G, 34 / 25 / 26 / 29 / 19 after H1. H2's delta is exactly +5 in each
 * page-shaped count and 0 change to dynamic routes.
 */

export const PRODUCTION_ORIGIN = 'https://www.infinus.co' as const

export type RouteKind =
  /** Public page that should be indexed and appear in the sitemap. */
  | 'page-indexable'
  /** Public page intentionally excluded from the index. */
  | 'page-noindex'
  /** Page route that is still built but is redirected away by next.config.js. */
  | 'page-redirected'
  /**
   * Path served ONLY by a next.config.js redirect: no page component, no manifest
   * entry, no prerendered HTML. Distinct from 'page-redirected', where a page is
   * still built behind the redirect.
   */
  | 'redirect-only'
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
 * A page whose document is SERBIAN: identical expectations to `indexable`, except lang.
 *
 * Phase E introduced this when the four campaign pages moved under app/(sr)/, a second ROOT
 * layout emitting <html lang="sr-Latn"> — correcting a long-standing bug where Serbian copy
 * was served under lang="en" from a single shared root layout.
 *
 * Those four pages have since moved again, to /sr/grow, /sr/grow/cfo, /sr/grow/ceo and
 * /sr/professional-services, and the unprefixed paths they left behind are now English. The
 * helper is unchanged; only which paths it is applied to.
 */
const serbianPage = (path: string): RouteExpectation => ({
  ...indexable(path),
  expectLang: 'sr-Latn',
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
  // ── 24 public indexable pages ────────────────────────────────────────────────
  indexable('/', '/'),
  indexable('/contact'),
  // The final client-feedback phase: the job-application form left the homepage for a
  // page of its own, in both locales at once.
  indexable('/careers'),
  serbianPage('/sr/careers'),
  // The SAP MythBusting e-book landing page, in the previously unused /insights space.
  indexable('/insights/sap-mythbusters'),
  serbianPage('/sr/insights/sap-mythbusters'),
  {
    // Phase G: the Serbian half of the site's first real locale pair.
    path: '/sr/contact',
    kind: 'page-indexable',
    expectLang: 'sr-Latn',
    expectRobots: 'index, follow',
    expectCanonical: `${PRODUCTION_ORIGIN}/sr/contact`,
    inSitemap: true,
    expectStaticHtml: true,
  },
  {
    // Phase H1: the Serbian homepage. Under app/(sr)/sr/, so it declares sr-Latn.
    path: '/sr',
    kind: 'page-indexable',
    expectLang: 'sr-Latn',
    expectRobots: 'index, follow',
    expectCanonical: `${PRODUCTION_ORIGIN}/sr`,
    inSitemap: true,
    expectStaticHtml: true,
  },
  {
    // Phase H1: the Serbian FAQ. Under app/(sr)/sr/faq/, so it declares sr-Latn.
    //
    // /sr, /sr/faq and /sr/contact are the ONLY routes that emit hreflang, together with
    // their three English halves. scripts/seo/assert-i18n-routes.ts asserts the reciprocal
    // sets and proves no other page emits any.
    path: '/sr/faq',
    kind: 'page-indexable',
    expectLang: 'sr-Latn',
    expectRobots: 'index, follow',
    expectCanonical: `${PRODUCTION_ORIGIN}/sr/faq`,
    inSitemap: true,
    expectStaticHtml: true,
  },
  indexable('/faq'),
  {
    // Phase H2: the Serbian half of the retail1 case-study pair.
    path: '/sr/case-study/retail1',
    kind: 'page-indexable',
    expectLang: 'sr-Latn',
    expectRobots: 'index, follow',
    expectCanonical: `${PRODUCTION_ORIGIN}/sr/case-study/retail1`,
    inSitemap: true,
    expectStaticHtml: true,
  },
  {
    // Phase H2: the Serbian half of the pharma1 case-study pair.
    path: '/sr/case-study/pharma1',
    kind: 'page-indexable',
    expectLang: 'sr-Latn',
    expectRobots: 'index, follow',
    expectCanonical: `${PRODUCTION_ORIGIN}/sr/case-study/pharma1`,
    inSitemap: true,
    expectStaticHtml: true,
  },
  {
    // Phase H2: the Serbian half of the pharma2 case-study pair.
    path: '/sr/case-study/pharma2',
    kind: 'page-indexable',
    expectLang: 'sr-Latn',
    expectRobots: 'index, follow',
    expectCanonical: `${PRODUCTION_ORIGIN}/sr/case-study/pharma2`,
    inSitemap: true,
    expectStaticHtml: true,
  },
  {
    // Phase H2: the Serbian half of the nearshoring1 case-study pair.
    path: '/sr/case-study/nearshoring1',
    kind: 'page-indexable',
    expectLang: 'sr-Latn',
    expectRobots: 'index, follow',
    expectCanonical: `${PRODUCTION_ORIGIN}/sr/case-study/nearshoring1`,
    inSitemap: true,
    expectStaticHtml: true,
  },
  {
    // Phase H2: the Serbian half of the manufacturing1 case-study pair.
    path: '/sr/case-study/manufacturing1',
    kind: 'page-indexable',
    expectLang: 'sr-Latn',
    expectRobots: 'index, follow',
    expectCanonical: `${PRODUCTION_ORIGIN}/sr/case-study/manufacturing1`,
    inSitemap: true,
    expectStaticHtml: true,
  },
  indexable('/case-study/retail1'),
  indexable('/case-study/pharma1'),
  indexable('/case-study/pharma2'),
  indexable('/case-study/nearshoring1'),
  indexable('/case-study/manufacturing1'),
  indexable('/projectpulse'),
  indexable('/projectpulse/brochure'),
  indexable('/projectpulse/video'),
  indexable('/sap-packaged-solutions/sap-starter-package'),
  // ── Phase H3: the Serbian halves of the four product pages ──────────────────
  // These sit under app/(sr)/sr/, so they emit <html lang="sr-Latn"> like every other /sr
  // page. The Starter Package keeps the English `sap-packaged-solutions` segment: the
  // offering's name is part of the URL, and translating segments would fork the pair map.
  {
    path: '/sr/projectpulse',
    kind: 'page-indexable',
    expectLang: 'sr-Latn',
    expectRobots: 'index, follow',
    expectCanonical: `${PRODUCTION_ORIGIN}/sr/projectpulse`,
    inSitemap: true,
    expectStaticHtml: true,
  },
  {
    path: '/sr/projectpulse/brochure',
    kind: 'page-indexable',
    expectLang: 'sr-Latn',
    expectRobots: 'index, follow',
    expectCanonical: `${PRODUCTION_ORIGIN}/sr/projectpulse/brochure`,
    inSitemap: true,
    expectStaticHtml: true,
  },
  {
    path: '/sr/projectpulse/video',
    kind: 'page-indexable',
    expectLang: 'sr-Latn',
    expectRobots: 'index, follow',
    expectCanonical: `${PRODUCTION_ORIGIN}/sr/projectpulse/video`,
    inSitemap: true,
    expectStaticHtml: true,
  },
  {
    path: '/sr/sap-packaged-solutions/sap-starter-package',
    kind: 'page-indexable',
    expectLang: 'sr-Latn',
    expectRobots: 'index, follow',
    expectCanonical: `${PRODUCTION_ORIGIN}/sr/sap-packaged-solutions/sap-starter-package`,
    inSitemap: true,
    expectStaticHtml: true,
  },
  // ── Phase H4: the four GROW pairs, English on the clean paths ────────────────
  // These four URLs used to serve SERBIAN. The owner's route decision made English the
  // unprefixed default here too, and moved the Serbian content to the same paths under /sr.
  // Two consequences this fixture is the right place to pin:
  //   · the unprefixed paths must now assert lang="en", not lang="sr-Latn"
  //   · /sr/grow and friends must exist as real Serbian documents
  indexable('/grow'),
  indexable('/grow/cfo'),
  indexable('/grow/ceo'),
  indexable('/professional-services'),
  serbianPage('/sr/grow'),
  serbianPage('/sr/grow/cfo'),
  serbianPage('/sr/grow/ceo'),
  serbianPage('/sr/professional-services'),

  // ── 2 public noindex pages: the Privacy Policy, one per locale ───────────────
  // Split by locale in this phase. Both are deliberately noindex,follow and out of the
  // sitemap — publicly reachable legal documents, not SEO landing pages — and neither emits
  // hreflang. They ARE a real navigable pair for the EN|SR switcher, which content/routes.ts
  // expresses as `locale-linked`: navigable is not the same property as indexable.
  {
    // The canonical ENGLISH legal URL. Was a page before Phase C, was a redirect during it,
    // and is a page again — English only this time.
    path: '/privacy',
    kind: 'page-noindex',
    expectLang: 'en',
    expectRobots: 'noindex, follow',
    expectCanonical: `${PRODUCTION_ORIGIN}/privacy`,
    inSitemap: false,
    expectStaticHtml: true,
  },
  {
    // The Serbian legal URL, keeping the document's own Serbian name as its slug.
    path: '/sr/politika-privatnosti',
    kind: 'page-noindex',
    expectLang: 'sr-Latn',
    expectRobots: 'noindex, follow',
    expectCanonical: `${PRODUCTION_ORIGIN}/sr/politika-privatnosti`,
    inSitemap: false,
    expectStaticHtml: true,
  },

  // ── redirect sources: 1 redirect-only + 1 still-built page ───────────────────
  {
    // The old bilingual URL. Its page component was deleted when the policy was split, so
    // next.config.js is the only thing serving this path — one direct hop to /privacy, no
    // chain, and no prerendered HTML. This reverses the Phase C direction.
    path: '/politika-privatnosti',
    kind: 'redirect-only',
    expectLang: null,
    expectRobots: null,
    expectCanonical: null,
    inSitemap: false,
    expectStaticHtml: false,
  },
  {
    // Still built and prerendered even though next.config.js 301s it away, so the
    // HTML exists and its canonical correctly points at the redirect target.
    path: '/cfo',
    kind: 'page-redirected',
    // Genuinely Serbian content (verified by inspecting the built HTML), so it sits under
    // the Serbian root and its prerendered document now declares sr-Latn too. Its
    // redirect and canonical behaviour is untouched.
    expectLang: 'sr-Latn',
    expectRobots: 'index, follow',
    expectCanonical: `${PRODUCTION_ORIGIN}/grow/cfo`,
    inSitemap: false,
    expectStaticHtml: true,
    knownIssue:
      'Unreachable duplicate that is still built, and now a stale one: it is a SERBIAN ' +
      'document whose canonical points at /grow/cfo, which is the ENGLISH CFO page since ' +
      'the GROW URL migration. Harmless — the permanent redirect means no crawler or ' +
      'visitor ever reaches this document — but it should be deleted in the Cleanup phase.',
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
    // NO lang attribute, and no fonts or consent UI.
    //
    // Not a choice: Next.js 14 renders the global not-found OUTSIDE every route group, so
    // with two locale roots it inherits neither. A top-level app/not-found.tsx is rejected
    // ("not-found.tsx doesn't have a root layout"), and multiple root layouts require
    // app/layout.tsx to be absent, so there is nothing for it to inherit. Placing one
    // inside (en) was tried and verified to change nothing for unmatched URLs.
    //
    // The 404 status code and copy are correct; only the document shell is bare.
    expectLang: null,
    // Also no robots meta: without a root layout the document inherits no root metadata
    // either. The 404 HTTP status is what keeps it out of the index, not a meta tag.
    expectRobots: null,
    expectCanonical: null,
    inSitemap: false,
    expectStaticHtml: true,
    knownIssue:
      'Global 404 renders without <html lang>, robots meta, fonts or consent UI — a ' +
      'Next 14 multiple-root-layout limitation introduced in Phase E. Revisit on a ' +
      'Next upgrade; the 404 status code and copy are correct.',
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

/** Kinds that exist only as a redirect and therefore have no manifest entry. */
export const REDIRECT_ONLY_KINDS: readonly RouteKind[] = ['redirect-only']

export const isPageRoute = (r: RouteExpectation): boolean => PAGE_KINDS.includes(r.kind)
export const isHandlerRoute = (r: RouteExpectation): boolean => HANDLER_KINDS.includes(r.kind)
export const isFrameworkRoute = (r: RouteExpectation): boolean => r.kind === 'page-framework'
export const isRedirectOnlyRoute = (r: RouteExpectation): boolean => REDIRECT_ONLY_KINDS.includes(r.kind)
/** Every path that next.config.js redirects away, whichever kind it is. */
export const redirectSourceRoutes = (): RouteExpectation[] =>
  ROUTES.filter((r) => r.kind === 'redirect-only' || r.kind === 'page-redirected')

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
  /**
   * 16 before Phase G; +1 for /sr/contact, +2 for /sr and /sr/faq in H1, +5 for the
   * Serbian case studies in H2, +4 for the Serbian product pages in H3.
   *
   * With H3 the English and Serbian halves were BALANCED for the /sr space. H4 closed the
   * last gap in the other direction: the four Serbian legacy pages at unprefixed URLs got
   * English counterparts at NEW paths, +4 -> 32. Every public page in either language now has
   * a counterpart.
   */
  /** +4 in the final client-feedback phase: the Careers and MythBusting pairs. */
  indexable: 36,
  /** /privacy and /sr/politika-privatnosti — the Privacy Policy, one page per locale */
  noindex: 2,
  /** /cfo — page still built behind its redirect */
  redirected: 1,
  /** /politika-privatnosti — redirect only now, no page component and no HTML */
  redirectOnly: 1,
  internal: 4,
  framework: 1,
  utilityHandlers: 4,
  apiHandlers: 4,
  /**
   * Page routes in app-path-routes-manifest.json (excludes _not-found).
   * Phase C: /privacy stopped being a page and /politika-privatnosti became one, so the
   * build produced 22. Phase G added /sr/contact -> 23; H1 added /sr and /sr/faq -> 25;
   * H2 added the five Serbian case studies -> 30; H3 added the four Serbian product
   * pages -> 34; splitting the Privacy Policy by locale swaps /politika-privatnosti for
   * /privacy and adds /sr/politika-privatnosti -> 35; H4 adds the four English GROW /
   * Professional Services pages -> 39; the final client-feedback phase adds the Careers
   * pair -> 41 and the MythBusting pair -> 43.
   */
  manifestPages: 43,
  /** route handlers in app-path-routes-manifest.json */
  manifestHandlers: 8,
  /** total manifest entries: 43 pages + 8 handlers + 1 _not-found */
  manifestTotal: 52,
  /**
   * Rendered .html files: 43 built pages + _not-found. /politika-privatnosti is in the
   * fixture as a redirect source but produces no HTML, so it is NOT counted here.
   */
  renderedHtml: 44,
  sitemapUrls: 36,
  /** the 38 public pages whose <head> is snapshotted (36 indexable + 2 legal pages) */
  snapshotPages: 38,
} as const
