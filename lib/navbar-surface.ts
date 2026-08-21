/**
 * NAVBAR SURFACE — which visual state the shared navbar starts in on a given route.
 *
 * ── The problem this solves ─────────────────────────────────────────────────────
 * The navbar is fixed and transparent at the top of the page, and it chose its
 * light-text/dark-text treatment from SCROLL POSITION ALONE (`scrollY > 100` in
 * tubelight-navbar, `scrollY > 600` in navbar-demo). That assumes every page opens behind a
 * tall dark hero. Several pages do not, and on them white text landed on a white background:
 * measured contrast 1.00 on /contact, /sr/contact, /faq and the Privacy Policy, against
 * 7.15–17.31 on the dark-hero pages. /sr/faq joined the light set in Phase H1 by inheriting
 * the `faq` page id, with no new entry needed here.
 *
 * ── Why classification is EXPLICIT and keyed on page identity ───────────────────
 * Not runtime DOM sampling: reading the backdrop during render is fragile, depends on image
 * decode timing, and would flicker.
 *
 * Not string matching either. `pathname.includes('contact')` or a `/sr` prefix rule would
 * silently capture unrelated future routes — exactly the class of bug the route-pair map was
 * built to prevent.
 *
 * Instead this resolves the pathname to a PAGE ID through content/routes.ts, the single
 * source of truth, and checks membership in an explicit list. Two consequences worth having:
 *
 *   · /contact and /sr/contact share the id `contact`, so the English and Serbian halves of a
 *     pair can never drift apart — one entry classifies both.
 *   · a future /sr/faq inherits `faq` automatically the moment it goes live. Extending this
 *     means adding one id, not one path per locale.
 *
 * Anything unclassified defaults to `dark`, which is the existing behaviour, so no current or
 * future page changes appearance unless it is listed here deliberately.
 *
 * ── Scope ───────────────────────────────────────────────────────────────────────
 * This decides only the state at the TOP of the page. The scroll transition itself is
 * untouched on dark-hero pages.
 *
 * KNOWN ISSUE, deliberately NOT addressed here: on `/` at roughly y=800 the `scrollY > 600`
 * threshold flips the navbar to dark text while the dark hero is still behind it (measured
 * contrast 1.02, dark-on-dark). That is a scroll-transition bug, not a starting-state bug,
 * and changing the threshold would alter the approved behaviour of several dark-hero pages.
 * Logged for a dedicated navbar-polish task.
 */

import { pairForPath } from './locale-routes'

export type NavbarSurface =
  /** Page opens on a light/white surface: the navbar needs its dark-text treatment. */
  | 'light'
  /** Page opens behind a dark hero: the navbar keeps its light-text treatment. */
  | 'dark'

/**
 * Page IDs (from content/routes.ts) whose pages open on a light surface.
 *
 * Verified by measuring the real backdrop luminance behind the navbar on every page that
 * renders the shared chrome. These four measured 1.0 (pure white); every other page measured
 * 0.011–0.097 (dark).
 *
 * Add an id here only after confirming the page actually opens light.
 */
export const LIGHT_SURFACE_PAGE_IDS: readonly string[] = [
  // /contact and /sr/contact — the Contact pair, both halves at once.
  'contact',
  // /faq
  'faq',
  // /privacy and /sr/politika-privatnosti — the Privacy Policy, both locales. One id
  // classifies both, which is the point of keying this on page identity rather than path.
  'legal-privacy-policy',
]

/** The default for anything not explicitly classified: today's behaviour, unchanged. */
export const DEFAULT_NAVBAR_SURFACE: NavbarSurface = 'dark'

/** Strip a trailing slash so `/faq/` classifies like `/faq`. */
function normalisePath(pathname: string): string {
  if (pathname.length > 1 && pathname.slice(-1) === '/') return pathname.slice(0, -1)
  return pathname
}

/**
 * Which surface the navbar should start on for this path.
 *
 * Pure and synchronous — safe to call during render in a client component, and it reads no
 * request state, so pages stay statically prerendered.
 */
export function navbarSurfaceFor(pathname: string | null | undefined): NavbarSurface {
  if (typeof pathname !== 'string' || pathname === '') return DEFAULT_NAVBAR_SURFACE

  const pair = pairForPath(normalisePath(pathname))
  if (pair === null) return DEFAULT_NAVBAR_SURFACE

  return LIGHT_SURFACE_PAGE_IDS.indexOf(pair.id) === -1 ? 'dark' : 'light'
}

/**
 * The `textColor` tokens the navbar components key their ENTIRE treatment off.
 *
 * Both components already branch on `textColor === 'text-white/90'` throughout — pill
 * background, borders, hover states, active pill, submenu panels, mobile overlay. Reusing
 * these two tokens is what keeps this a state selection rather than a third design system.
 */
export const NAVBAR_TEXT_ON_LIGHT = 'text-slate-900'
export const NAVBAR_TEXT_ON_DARK = 'text-white/90'

/** Initial `textColor` for a surface, so the very first paint is already correct. */
export function navbarTextColorFor(surface: NavbarSurface): string {
  return surface === 'light' ? NAVBAR_TEXT_ON_LIGHT : NAVBAR_TEXT_ON_DARK
}
