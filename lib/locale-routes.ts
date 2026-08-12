/**
 * LOCALE-AWARE URL HELPERS — the only sanctioned way to answer "where is the other
 * language version of this page?".
 *
 * Every function here is pure, synchronous and build-time safe: no request, no cookies,
 * no headers, no pathname string surgery. Callers must never re-implement locale routing
 * with `pathname.replace('/sr', '')` or by prefixing `/sr` — that is precisely what these
 * helpers exist to prevent, because it silently invents URLs that do not exist.
 *
 * ── The safety invariant ────────────────────────────────────────────────────────
 * `counterpartFor` and `localeAlternatesFor` return null unless the counterpart is REAL:
 * `pairing: "translatable"` AND every side `status: "live"`. There is no fallback to the
 * locale home page and no fallback to the default locale. "No counterpart" is a first-class
 * answer, and today it is the answer for every page on the site.
 */

import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_META,
  absoluteUrl,
  type Locale,
} from './i18n'
import { ROUTE_PAIRS, type RoutePair, type RoutePath } from '@/content/routes'

/** A resolved, real counterpart in another locale. */
export interface Counterpart {
  readonly locale: Locale
  readonly path: RoutePath
  /** Absolute production URL, for metadata and JSON-LD. */
  readonly url: string
}

/** Reciprocal hreflang input for a complete pair. Never produced for an incomplete one. */
export interface LocaleAlternates {
  /** hreflang tag → absolute URL, e.g. `{ en: "…/contact", "sr-Latn": "…/sr/contact" }`. */
  readonly languages: Record<string, string>
  /** Absolute URL of the default-locale version. */
  readonly xDefault: string
}

/** True when `path` is the live path of `pair` in `locale`. */
function isLiveAt(pair: RoutePair, locale: Locale, path: string): boolean {
  const entry = pair[locale]
  return entry !== null && entry.status === 'live' && entry.path === path
}

/**
 * The pair that owns a LIVE path, or null.
 *
 * Planned paths are deliberately not resolvable: asking about `/sr/contact` today must not
 * behave as though that page existed.
 */
export function pairForPath(path: string, pairs: readonly RoutePair[] = ROUTE_PAIRS): RoutePair | null {
  for (let i = 0; i < pairs.length; i += 1) {
    for (let j = 0; j < LOCALES.length; j += 1) {
      if (isLiveAt(pairs[i], LOCALES[j], path)) return pairs[i]
    }
  }
  return null
}

/**
 * Which locale owns a live path.
 *
 * Returns null for an unknown path, a planned path, or anything not in the map (internal
 * demo pages, route handlers, the 404). Callers must handle null rather than assuming the
 * default locale — an unclassified page has no locale, it is not English by default.
 */
export function localeOfPath(path: string, pairs: readonly RoutePair[] = ROUTE_PAIRS): Locale | null {
  for (let i = 0; i < pairs.length; i += 1) {
    for (let j = 0; j < LOCALES.length; j += 1) {
      if (isLiveAt(pairs[i], LOCALES[j], path)) return LOCALES[j]
    }
  }
  return null
}

/**
 * The real counterpart of a live path in another locale, or null.
 *
 * Returns null when:
 *   · the path is not in the map
 *   · the pair is `excluded` (the legal page, /cfo)
 *   · the other side is null       — e.g. /grow has no English version
 *   · the other side is `planned`  — e.g. /sr/contact does not exist yet
 *
 * Today every page on the site falls into one of the last three cases, so this returns
 * null for every live path in the build.
 */
export function counterpartFor(
  path: string,
  pairs: readonly RoutePair[] = ROUTE_PAIRS
): Counterpart | null {
  const pair = pairForPath(path, pairs)
  if (pair === null || pair.pairing !== 'translatable') return null

  const from = localeOfPath(path, pairs)
  if (from === null) return null

  for (let j = 0; j < LOCALES.length; j += 1) {
    const locale = LOCALES[j]
    if (locale === from) continue
    const entry = pair[locale]
    if (entry === null || entry.status !== 'live') continue
    return { locale, path: entry.path, url: absoluteUrl(entry.path) }
  }
  return null
}

/**
 * Reciprocal language alternates for a live path, or null when the pair is not complete.
 *
 * A pair is complete only when EVERY supported locale has a live path and the pair is
 * translatable. `x-default` is always the default locale's URL: it is served at the
 * unprefixed path and is the right target for an unmatched audience.
 *
 * Both members of a complete pair produce the SAME object, which is what makes the
 * hreflang reciprocal — a one-way annotation is ignored by search engines.
 */
export function localeAlternatesFor(
  path: string,
  pairs: readonly RoutePair[] = ROUTE_PAIRS
): LocaleAlternates | null {
  const pair = pairForPath(path, pairs)
  if (pair === null || pair.pairing !== 'translatable') return null

  const languages: Record<string, string> = {}
  for (let j = 0; j < LOCALES.length; j += 1) {
    const locale = LOCALES[j]
    const entry = pair[locale]
    // One missing or merely planned side ⇒ no alternates at all, for either side.
    if (entry === null || entry.status !== 'live') return null
    languages[LOCALE_META[locale].bcp47] = absoluteUrl(entry.path)
  }

  const fallback = pair[DEFAULT_LOCALE]
  if (fallback === null || fallback.status !== 'live') return null

  return { languages, xDefault: absoluteUrl(fallback.path) }
}

/** Every live path owned by a locale, in map order. */
export function livePathsFor(locale: Locale, pairs: readonly RoutePair[] = ROUTE_PAIRS): RoutePath[] {
  const out: RoutePath[] = []
  for (let i = 0; i < pairs.length; i += 1) {
    const entry = pairs[i][locale]
    if (entry !== null && entry.status === 'live') out.push(entry.path)
  }
  return out
}

/** Every live path in the map, across all locales. */
export function allLivePaths(pairs: readonly RoutePair[] = ROUTE_PAIRS): RoutePath[] {
  const out: RoutePath[] = []
  for (let j = 0; j < LOCALES.length; j += 1) {
    const paths = livePathsFor(LOCALES[j], pairs)
    for (let i = 0; i < paths.length; i += 1) out.push(paths[i])
  }
  return out
}

/**
 * Every path the map declares but that does NOT exist yet.
 *
 * Exposed so build-time assertions can prove these never appear in rendered HTML, in the
 * sitemap or in the route manifest.
 */
export function plannedPaths(pairs: readonly RoutePair[] = ROUTE_PAIRS): RoutePath[] {
  const out: RoutePath[] = []
  for (let i = 0; i < pairs.length; i += 1) {
    for (let j = 0; j < LOCALES.length; j += 1) {
      const entry = pairs[i][LOCALES[j]]
      if (entry !== null && entry.status === 'planned') out.push(entry.path)
    }
  }
  return out
}

/** True when a live path may take part in hreflang and the language switcher at all. */
export function isTranslatablePath(path: string, pairs: readonly RoutePair[] = ROUTE_PAIRS): boolean {
  const pair = pairForPath(path, pairs)
  return pair !== null && pair.pairing === 'translatable'
}
