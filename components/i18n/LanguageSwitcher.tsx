/**
 * LANGUAGE SWITCHER — infrastructure only. NOT MOUNTED ANYWHERE.
 *
 * Deliberately absent from components/ui/navbar-demo.tsx, components/layout/Footer and
 * components/shell/*. There is not one genuine EN/SR page pair on the site yet, so a
 * visible EN | SR control would either be dead or would send visitors to URLs that 404.
 * test/i18n/language-switcher.test.tsx asserts it stays unmounted; if it ever renders in
 * production chrome by accident, the head baseline and that test both fail.
 *
 * ── Why it takes `currentPath` as a prop ────────────────────────────────────────
 * No `usePathname()`, no `'use client'`, no request-time anything. Every page is a static
 * file that knows its own URL as a literal, so the path is passed in. That keeps this a
 * pure function of its props — trivially unit-testable, and incapable of turning a page
 * dynamic. The whole site stays at 0 dynamic routes.
 *
 * ── Why it never does string surgery on the path ────────────────────────────────
 * Counterpart resolution goes through lib/locale-routes.ts and therefore through the
 * declared route-pair map. `pathname.replace('/sr', '')` or `'/sr' + pathname` would
 * fabricate URLs — and would be actively wrong for the four Serbian pages that live at
 * UNPREFIXED paths (/grow, /professional-services, …). If the map says there is no
 * counterpart, this component renders nothing. It never guesses, and it never falls back
 * to the locale home page.
 *
 * ── Current behaviour on every page of the live site ────────────────────────────
 * `resolveSwitchTarget` returns null for every path in the build today, so this renders
 * `null` everywhere. The UI for "counterpart unavailable" — disabled control, hidden, or a
 * link to a language index — is a design decision for the rollout phase.
 */

import Link from 'next/link'
import { LOCALE_META, type Locale } from '@/lib/i18n'
import { counterpartFor, type Counterpart } from '@/lib/locale-routes'
import { ROUTE_PAIRS, type RoutePair } from '@/content/routes'
import { getDictionary } from '@/content/dictionary'

export interface LanguageSwitcherProps {
  /** Root-relative path of the page rendering this control, e.g. `/contact`. */
  currentPath: string
  /** Locale of the page rendering this control — i.e. which root layout owns it. */
  currentLocale: Locale
  /**
   * Route map to resolve against. Defaults to the real one; overridable for the same
   * reason every helper in lib/locale-routes.ts takes this parameter — so the paired
   * behaviour can be exercised without first creating a live /sr route.
   */
  routePairs?: readonly RoutePair[]
}

/**
 * The single sanctioned way to ask "where does the switcher go from here?".
 *
 * Exported separately from the component so the decision can be tested, and reused by
 * future metadata code, without rendering anything.
 *
 * Returns null — meaning NO COUNTERPART — when the page has no live counterpart, is
 * excluded from pairing, or is not in the route map at all.
 */
export function resolveSwitchTarget(
  currentPath: string,
  routePairs: readonly RoutePair[] = ROUTE_PAIRS
): Counterpart | null {
  return counterpartFor(currentPath, routePairs)
}

export function LanguageSwitcher({ currentPath, currentLocale, routePairs = ROUTE_PAIRS }: LanguageSwitcherProps) {
  const target = resolveSwitchTarget(currentPath, routePairs)

  // No real counterpart ⇒ no control. Never a fabricated URL, never the locale home.
  if (target === null) return null

  const label = getDictionary(currentLocale).common.switchLanguage
  const targetName = getDictionary(target.locale).common.localeName

  return (
    <Link
      href={target.path}
      hrefLang={LOCALE_META[target.locale].bcp47}
      lang={LOCALE_META[target.locale].bcp47}
      aria-label={`${label}: ${targetName}`}
      data-language-switcher={target.locale}
    >
      {targetName}
    </Link>
  )
}
