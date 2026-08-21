/**
 * ROUTE PAIR MAP — the single source of truth for locale route ownership.
 *
 * This is the file code asks "does this page have a real counterpart in the other language,
 * and what is its URL?". It drives:
 *
 *   · the global language switcher's destination
 *   · reciprocal hreflang / x-default
 *   · which locale the shared Navbar and Footer render in
 *   · the navbar's light/dark surface classification (lib/navbar-surface.ts)
 *
 * Eight pairs are complete today — home, faq, contact and the five case studies — and ONLY
 * those reach rendered HTML. Everything still marked `planned` is inert.
 *
 * ── The one rule that makes this safe ───────────────────────────────────────────
 *
 *   NO locale alternate and NO switcher destination may be produced unless the paths on
 *   BOTH sides of a pair are `status: "live"` AND the pair is `pairing: "translatable"`.
 *
 * A `"planned"` path is a design intention. It is written down so the eventual URL is
 * agreed and reviewable, and it is mechanically incapable of becoming an hreflang, a
 * switcher link or a sitemap entry. lib/locale-routes.ts enforces that; the tests in
 * test/i18n/ prove it, including for the specific `/sr/*` paths named below.
 *
 * ── Why counterpart URLs are written out, never derived ─────────────────────────
 * Prefixing an English path with `/sr` would be wrong for the pages that already exist.
 * The four Serbian campaign pages are live at UNPREFIXED URLs — `/grow`, `/grow/cfo`,
 * `/grow/ceo`, `/professional-services` — and they have no English version at all. The
 * model has to express that asymmetry honestly, so every path is a literal.
 *
 * ── What is NOT in here ─────────────────────────────────────────────────────────
 *   · internal demo/debug pages (/hero-demo, /combined-demo, /services-demo,
 *     /debug/visitor-intelligence) — never translated, never public
 *   · route handlers (/api/*, /llms.txt, /vi-debug) — no HTML document
 *   · the framework 404 — inherits no root layout, so it has no locale to own
 *
 * ── Relationship to the A2 harness ──────────────────────────────────────────────
 * test/fixtures/routes.ts remains the INDEPENDENT regression baseline for SEO output and
 * is not derived from this file. The link runs one way only, as an assertion:
 * test/i18n/route-map-fixture.test.ts checks that every `live` path here is a path the
 * fixture classifies as a real page. The harness in turn proves the fixture matches the
 * actual build, so a `live` path that does not exist cannot survive both checks.
 */

import { LOCALES, type Locale } from '@/lib/i18n'

/** A root-relative URL path. The template type rejects bare or absolute strings. */
export type RoutePath = `/${string}`

export type RouteStatus =
  /** The page exists in the build today and is reachable at this URL. */
  | 'live'
  /**
   * The agreed future URL for a page that DOES NOT EXIST YET. Never emitted as an
   * alternate, a switcher target or a sitemap entry.
   */
  | 'planned'

export interface LocaleRoute {
  readonly path: RoutePath
  readonly status: RouteStatus
}

export type PairingPolicy =
  /** A normal page: may take part in hreflang and the switcher once both sides are live. */
  | 'translatable'
  /**
   * Classified but permanently outside locale pairing. Produces NO hreflang and NO
   * switcher counterpart even if both sides were somehow live. Used for the bilingual
   * legal page (both languages on one URL) and the redirect-backed /cfo duplicate.
   */
  | 'excluded'

/**
 * One page identity across locales.
 *
 * The locale keys are a mapped type over {@link Locale}, so adding a third locale is a
 * compile error on every entry rather than a silently missing counterpart.
 */
export type RoutePair = {
  /** Stable, unique page identity. Never a URL — URLs are allowed to change. */
  readonly id: string
  readonly pairing: PairingPolicy
  /** Why this entry looks the way it does, where that is not obvious. */
  readonly note?: string
} & { readonly [L in Locale]: LocaleRoute | null }

const live = (path: RoutePath): LocaleRoute => ({ path, status: 'live' })
const planned = (path: RoutePath): LocaleRoute => ({ path, status: 'planned' })

/**
 * The four Serbian pages that legitimately live at unprefixed URLs.
 *
 * Any OTHER Serbian route must sit under `/sr`. validateRoutePairs() rejects a new
 * unprefixed Serbian path, so the legacy exception cannot quietly grow.
 */
export const LEGACY_UNPREFIXED_SERBIAN_PATHS: readonly RoutePath[] = [
  '/grow',
  '/grow/cfo',
  '/grow/ceo',
  '/professional-services',
  // Built but redirected away; excluded from pairing, listed so validation accepts it.
  '/cfo',
]

export const ROUTE_PAIRS: readonly RoutePair[] = [
  // ── Marketing pages ─────────────────────────────────────────────────────────
  // Complete pairs produce a switcher destination, hreflang and a Serbian sitemap URL.
  // Entries still marked `planned` are English-only: no /sr route exists for them and
  // nothing is emitted.
  {
    // Phase H1: the Serbian homepage went live, so this is now a complete pair.
    id: 'home',
    pairing: 'translatable',
    en: live('/'),
    sr: live('/sr'),
  },
  {
    // The first real pair (Phase G). Phase H1 added `home` and `faq` alongside it, so
    // three pairs are now complete; every other Serbian side below is still `planned` and
    // therefore still inert — no switcher destination, no hreflang, no sitemap entry.
    id: 'contact',
    pairing: 'translatable',
    en: live('/contact'),
    sr: live('/sr/contact'),
  },
  {
    // Phase H1: the Serbian FAQ went live, so this is now a complete pair.
    id: 'faq',
    pairing: 'translatable',
    en: live('/faq'),
    sr: live('/sr/faq'),
  },
  {
    id: 'case-study-retail1',
    pairing: 'translatable',
    en: live('/case-study/retail1'),
    sr: live('/sr/case-study/retail1'),
  },
  {
    id: 'case-study-pharma1',
    pairing: 'translatable',
    en: live('/case-study/pharma1'),
    sr: live('/sr/case-study/pharma1'),
  },
  {
    id: 'case-study-pharma2',
    pairing: 'translatable',
    en: live('/case-study/pharma2'),
    sr: live('/sr/case-study/pharma2'),
  },
  {
    id: 'case-study-nearshoring1',
    pairing: 'translatable',
    en: live('/case-study/nearshoring1'),
    sr: live('/sr/case-study/nearshoring1'),
  },
  {
    id: 'case-study-manufacturing1',
    pairing: 'translatable',
    en: live('/case-study/manufacturing1'),
    sr: live('/sr/case-study/manufacturing1'),
  },
  { id: 'projectpulse', pairing: 'translatable', en: live('/projectpulse'), sr: live('/sr/projectpulse') },
  {
    id: 'projectpulse-brochure',
    pairing: 'translatable',
    en: live('/projectpulse/brochure'),
    sr: live('/sr/projectpulse/brochure'),
  },
  {
    id: 'projectpulse-video',
    pairing: 'translatable',
    en: live('/projectpulse/video'),
    sr: live('/sr/projectpulse/video'),
  },
  {
    id: 'sap-starter-package',
    pairing: 'translatable',
    en: live('/sap-packaged-solutions/sap-starter-package'),
    sr: live('/sr/sap-packaged-solutions/sap-starter-package'),
  },

  // ── Serbian campaign pages ───────────────────────────────────────────────────
  // Live Serbian content at unprefixed URLs, with NO English counterpart — not even a
  // planned one, because no English GROW page has been scoped. `en: null` is the honest
  // representation: the helpers return NO COUNTERPART rather than falling back to `/`.
  {
    id: 'grow',
    pairing: 'translatable',
    en: null,
    sr: live('/grow'),
    note: 'Serbian campaign page with no English version. Must NOT be paired with "/".',
  },
  { id: 'grow-cfo', pairing: 'translatable', en: null, sr: live('/grow/cfo') },
  { id: 'grow-ceo', pairing: 'translatable', en: null, sr: live('/grow/ceo') },
  { id: 'professional-services', pairing: 'translatable', en: null, sr: live('/professional-services') },

  // ── Excluded from locale pairing ─────────────────────────────────────────────
  {
    id: 'legal-privacy-policy',
    pairing: 'excluded',
    en: live('/politika-privatnosti'),
    sr: null,
    note:
      'ONE URL holding both independently approved legal documents, as bilingual sections ' +
      'inside the page. It is not an EN/SR route pair: there is nothing to point hreflang ' +
      'at and nothing for the switcher to navigate to. Its own in-page Srpski/English ' +
      'navigation is unrelated to this map and stays as it is.',
  },
  {
    id: 'cfo-legacy-redirect',
    pairing: 'excluded',
    en: null,
    sr: live('/cfo'),
    note:
      'Still built but 301-redirected to /grow/cfo by next.config.js, and canonicalised ' +
      'there. Never a language-switch destination; scheduled for deletion in the Cleanup ' +
      'phase.',
  },
]

/**
 * Structural problems in a route map, as human-readable strings.
 *
 * Returns an empty array when the map is sound. Called by test/i18n/route-pairs.test.ts
 * and by scripts/seo/assert-i18n-routes.ts, and exported so a synthetic map can be
 * validated in a unit test without touching the real one.
 */
export function validateRoutePairs(pairs: readonly RoutePair[] = ROUTE_PAIRS): string[] {
  const problems: string[] = []
  const seenIds: Record<string, true> = {}
  const pathOwner: Record<string, string> = {}

  for (let i = 0; i < pairs.length; i += 1) {
    const pair = pairs[i]

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(pair.id)) {
      problems.push(`id "${pair.id}" is not a non-empty kebab-case identifier`)
    }
    if (seenIds[pair.id]) problems.push(`duplicate id "${pair.id}"`)
    seenIds[pair.id] = true

    let declared = 0

    for (let j = 0; j < LOCALES.length; j += 1) {
      const locale: Locale = LOCALES[j]
      const entry = pair[locale]
      if (entry === null) continue
      declared += 1

      const { path, status } = entry

      if (path !== '/' && path.slice(-1) === '/') {
        problems.push(`${pair.id}.${locale}: path "${path}" must not have a trailing slash`)
      }
      if (/[?#\s]/.test(path)) {
        problems.push(`${pair.id}.${locale}: path "${path}" must not contain a query, fragment or whitespace`)
      }

      // One path may belong to exactly one page identity, in exactly one locale.
      const owner = pathOwner[path]
      if (owner) {
        problems.push(`path "${path}" is claimed twice: by ${owner} and by ${pair.id}.${locale}`)
      }
      pathOwner[path] = `${pair.id}.${locale}`

      // A locale's URL space must be unambiguous, or "which locale owns this path?" has
      // no answer and the switcher could send a visitor to the wrong language.
      if (locale === 'en' && (path === '/sr' || path.indexOf('/sr/') === 0)) {
        problems.push(`${pair.id}.en: "${path}" is inside the Serbian URL space`)
      }
      if (
        locale === 'sr' &&
        path !== '/sr' &&
        path.indexOf('/sr/') !== 0 &&
        LEGACY_UNPREFIXED_SERBIAN_PATHS.indexOf(path) === -1
      ) {
        problems.push(
          `${pair.id}.sr: "${path}" is neither under /sr nor one of the four legacy ` +
            'unprefixed Serbian paths'
        )
      }
      if (status === 'planned' && LEGACY_UNPREFIXED_SERBIAN_PATHS.indexOf(path) !== -1) {
        problems.push(`${pair.id}.${locale}: "${path}" already exists and cannot be "planned"`)
      }
    }

    if (declared === 0) problems.push(`${pair.id} declares no locale route at all`)

    if (pair.pairing === 'excluded') {
      let liveSides = 0
      for (let j = 0; j < LOCALES.length; j += 1) {
        const entry = pair[LOCALES[j]]
        if (entry && entry.status === 'live') liveSides += 1
      }
      if (liveSides > 1) {
        problems.push(
          `${pair.id} is "excluded" but has ${liveSides} live sides — it looks like a real ` +
            'pair and should say so, or be split'
        )
      }
    }
  }

  return problems
}
