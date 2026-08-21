/**
 * Which locale the SHARED CHROME (Navbar, Footer) renders in for a given path.
 *
 * ── Why this is not just `localeOfPath` ─────────────────────────────────────────
 * It nearly is — and it deliberately delegates to it, so the route-pair map stays the single
 * source of truth and no prefix-sniffing appears anywhere. The one thing this adds is a
 * documented DEFAULT for paths the map does not classify:
 *
 *   · /privacy resolves to `en` and /sr/politika-privatnosti to `sr` because the map says
 *     so — the Privacy Policy is one page identity with a real route in each locale:
 *     the bilingual legal page keeps English chrome by decision (it is the special page that
 *     holds both approved language versions on one URL).
 *   · demo and debug pages are not in the map at all. They render no SiteChrome today, but
 *     defaulting them to `en` keeps the behaviour obvious if that ever changes.
 *
 * The four Serbian campaign pages — /grow, /grow/cfo, /grow/ceo, /professional-services —
 * resolve to `sr`, so they now receive the Serbian Navbar and Footer. That is an INTENDED
 * visible change of Phase H1: their bodies were always Serbian while their chrome was not.
 *
 * Pure and synchronous: safe to call during render in a client component, reads no request
 * state, so every route stays statically prerendered.
 */

import { localeOfPath } from './locale-routes'
import { DEFAULT_LOCALE, type Locale } from './i18n'

/** Strip a trailing slash so `/sr/` behaves like `/sr`. */
function normalisePath(pathname: string): string {
  if (pathname.length > 1 && pathname.slice(-1) === '/') return pathname.slice(0, -1)
  return pathname
}

export function chromeLocaleFor(pathname: string | null | undefined): Locale {
  if (typeof pathname !== 'string' || pathname === '') return DEFAULT_LOCALE
  return localeOfPath(normalisePath(pathname)) ?? DEFAULT_LOCALE
}
