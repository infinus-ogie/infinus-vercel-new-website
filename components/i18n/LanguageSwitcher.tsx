/**
 * LANGUAGE SWITCHER — live since Phase G, on the one real pair only.
 *
 * ── What it renders, and when ───────────────────────────────────────────────────
 * `EN | SR`, with the current language marked as current and the other language as a link.
 * Language CODES, never flags: a flag names a country, not a language, and Serbian is not
 * "Serbia" any more than English is "the United Kingdom".
 *
 * It renders NOTHING unless the current page has a real live counterpart. Today that means
 * it appears on exactly two URLs — /contact and /sr/contact — and nowhere else. On /grow it
 * renders nothing rather than offering "/" as a fake English version; on /faq it renders
 * nothing rather than linking a /sr/faq that does not exist.
 *
 * ── Why it never does string surgery on the path ────────────────────────────────
 * Counterpart resolution goes through lib/locale-routes.ts and therefore through the
 * declared route-pair map. `pathname.replace('/sr', '')` or `'/sr' + pathname` would
 * fabricate URLs — and would be actively wrong for the four Serbian pages that live at
 * UNPREFIXED paths (/grow, /professional-services, …). The map is the only source of
 * counterpart truth, and "no counterpart" is a first-class answer.
 *
 * ── Static safety ───────────────────────────────────────────────────────────────
 * This component is pure: path and locale come in as props, so it is server-renderable and
 * cannot turn a route dynamic. The shared Navbar needs the current path at runtime, which
 * LocaleSwitcherNav supplies via `usePathname()` — a client hook, not a request API. No
 * middleware, no cookies(), no headers(), no Accept-Language. The site stays at 0 dynamic
 * routes.
 *
 * The two-letter codes are derived from the Locale keys rather than stored as copy: `en` and
 * `sr` ARE the language subtags, so there is nothing to translate and nothing to drift.
 */

import Link from 'next/link'
import { LOCALES, LOCALE_META, type Locale } from '@/lib/i18n'
import { counterpartFor, type Counterpart } from '@/lib/locale-routes'
import { ROUTE_PAIRS, type RoutePair } from '@/content/routes'
import { getDictionary } from '@/content/dictionary'
import { cn } from '@/lib/utils'

export interface LanguageSwitcherProps {
  /** Root-relative path of the page rendering this control, e.g. `/contact`. */
  currentPath: string
  /** Locale of the page rendering this control — i.e. which root layout owns it. */
  currentLocale: Locale
  /** Extra classes for the wrapper, so the Navbar can match its own light/dark treatment. */
  className?: string
  /** Classes for the active-language marker. */
  activeClassName?: string
  /**
   * Route map to resolve against. Defaults to the real one; overridable for the same
   * reason every helper in lib/locale-routes.ts takes this parameter — so paired behaviour
   * can be exercised without depending on the live map.
   */
  routePairs?: readonly RoutePair[]
}

/** The display code for a locale: the language subtag, uppercased. */
export function localeCode(locale: Locale): string {
  return locale.toUpperCase()
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

export function LanguageSwitcher({
  currentPath,
  currentLocale,
  className,
  activeClassName,
  routePairs = ROUTE_PAIRS,
}: LanguageSwitcherProps) {
  const target = resolveSwitchTarget(currentPath, routePairs)

  // No real counterpart ⇒ no control at all. Never a fabricated URL, never the locale home.
  if (target === null) return null

  const label = getDictionary(currentLocale).common.switchLanguage
  const targetName = getDictionary(target.locale).common.localeName

  // Rendered in a stable order (LOCALES) rather than "current first", so the control does
  // not visually reshuffle when a visitor switches language.
  return (
    <div
      role="group"
      aria-label={label}
      data-language-switcher={target.locale}
      className={cn('flex items-center gap-1 text-sm font-medium', className)}
    >
      {LOCALES.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          {index > 0 && (
            <span aria-hidden="true" className="opacity-40">
              |
            </span>
          )}
          {locale === currentLocale ? (
            <span aria-current="true" className={cn('font-semibold', activeClassName)}>
              {localeCode(locale)}
            </span>
          ) : (
            <Link
              href={target.path}
              hrefLang={LOCALE_META[locale].bcp47}
              lang={LOCALE_META[locale].bcp47}
              aria-label={`${label}: ${targetName}`}
              className="opacity-70 transition-opacity hover:opacity-100 hover:underline"
            >
              {localeCode(locale)}
            </Link>
          )}
        </span>
      ))}
    </div>
  )
}
