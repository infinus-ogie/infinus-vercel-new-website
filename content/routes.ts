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
 *   `pairing: "locale-linked"` is the one case with two live sides and NO hreflang: a real
 *   navigable counterpart on a page that is deliberately not indexable.
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

/**
 * What a pair is allowed to produce.
 *
 * Two separate questions hide in here, and conflating them is what forced this type to grow
 * a third case:
 *
 *   1. is there a REAL counterpart a visitor can navigate to?
 *   2. does the pair participate in SEO output — hreflang and the sitemap?
 *
 * For every marketing page the answers move together. For the Privacy Policy they do not:
 * the two documents are genuinely separate pages in two languages and a visitor should be
 * able to switch between them, but both are `noindex, follow` and outside the sitemap, so
 * neither may emit hreflang.
 */
export type PairingPolicy =
  /** A normal page: may take part in hreflang and the switcher once both sides are live. */
  | 'translatable'
  /**
   * Both sides are real and navigable — counterpart resolution and the language switcher
   * work — but the pair produces NO hreflang and stays out of the sitemap.
   *
   * The Privacy Policy: /privacy (English) and /sr/politika-privatnosti (Serbian) are two
   * independently approved legal documents, each `noindex, follow`. Navigability and
   * indexability are different properties and this is the case that proves it.
   *
   * Requires BOTH sides live — see validateRoutePairs. A half-built locale link is a bug,
   * not a state: the switcher would advertise a URL that 404s.
   */
  | 'locale-linked'
  /**
   * Classified but permanently outside locale pairing. Produces NO hreflang and NO
   * switcher counterpart even if both sides were somehow live. Used for the
   * redirect-backed /cfo duplicate.
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

  // ── A real locale link that is deliberately not indexable ────────────────────
  {
    id: 'legal-privacy-policy',
    pairing: 'locale-linked',
    en: live('/privacy'),
    sr: live('/sr/politika-privatnosti'),
    note:
      'Two INDEPENDENTLY APPROVED legal documents, one per locale, each on its own URL. ' +
      'They are not a translation pair — neither was translated from the other — but they ' +
      'are the same page in two languages as far as a visitor is concerned, so the switcher ' +
      'moves between them. Both are noindex,follow and outside the sitemap, so neither ' +
      'emits hreflang. This supersedes the single bilingual /politika-privatnosti URL, ' +
      'which is now a permanent redirect to /privacy and therefore not a page at all.',
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

    // ── per-policy invariants on how many sides are live ──────────────────────
    // The old rule was "excluded may not have two live sides", which existed to stop a real
    // pair from hiding behind an exclusion. That is still worth enforcing, but it also made
    // the legal pair inexpressible: two live sides that must NOT be indexable. So the rule
    // is now per policy, and it is tighter than before rather than looser — `locale-linked`
    // has a requirement of its own that nothing had before.
    let liveSides = 0
    for (let j = 0; j < LOCALES.length; j += 1) {
      const entry = pair[LOCALES[j]]
      if (entry && entry.status === 'live') liveSides += 1
    }

    if (pair.pairing === 'excluded' && liveSides > 1) {
      problems.push(
        `${pair.id} is "excluded" but has ${liveSides} live sides — it looks like a real ` +
          'pair and should say so ("locale-linked" if it must stay out of hreflang), or be split'
      )
    }

    if (pair.pairing === 'locale-linked' && liveSides !== 2) {
      // The whole point of this policy is that the switcher CAN navigate between the two
      // sides. With fewer than two live it would advertise a URL that 404s, which is the
      // exact failure the planned/live distinction exists to prevent everywhere else.
      problems.push(
        `${pair.id} is "locale-linked" but has ${liveSides} live side(s) — this policy ` +
          'requires both, because it exists to make the switcher work'
      )
    }
  }

  return problems
}
