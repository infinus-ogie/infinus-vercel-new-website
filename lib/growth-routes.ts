/**
 * Route-map lookups and per-role presentation for the GROW / Professional Services pages.
 *
 * ── Why `pairPath` exists ───────────────────────────────────────────────────────
 * A route file needs to know its OWN path, not just its counterpart's: it goes into the
 * self-canonical, og:url, the JSON-LD `url` and both sides of the hreflang pair. Hard-coding
 * that literal in the page file means the same URL is written down in two places — here and
 * in content/routes.ts — and the two can drift.
 *
 * These eight pages proved the point. Their Serbian halves moved from /grow, /grow/cfo,
 * /grow/ceo and /professional-services to the same paths under /sr, and the English halves
 * moved from a set of rejected slugs onto the clean paths the Serbian pages vacated. Because
 * every route file asks the map by PAGE ID and locale, that migration changed four lines in
 * content/routes.ts and no page file's logic at all.
 *
 * A missing entry throws at build time rather than silently rendering a page at a path
 * nothing links to. Same discipline the switcher already uses for counterparts.
 */

import { ROUTE_PAIRS, type RoutePath } from '@/content/routes'
import type { Locale } from '@/lib/i18n'

/** The path this page identity occupies in this locale. Throws if the map does not declare it. */
export function pairPath(id: string, locale: Locale): RoutePath {
  for (let i = 0; i < ROUTE_PAIRS.length; i += 1) {
    if (ROUTE_PAIRS[i].id !== id) continue
    const entry = ROUTE_PAIRS[i][locale]
    if (entry === null) {
      throw new Error(`content/routes.ts declares no ${locale} route for page "${id}"`)
    }
    return entry.path
  }
  throw new Error(`content/routes.ts has no pair with id "${id}"`)
}

/**
 * Hero backgrounds for the two role pages.
 *
 * Presentation, and identical in both locales — the images carry no text. The paths are
 * percent-encoded because the directories contain spaces, exactly as the Serbian originals had
 * them.
 */
export const ROLE_HERO_IMAGE = {
  cfo: '/SAP%20for%20CFOs%20iamges/sap-cfo-hero2.png',
  ceo: '/SAP%20for%20CEO%20images/hero-ceo-2.png',
} as const
