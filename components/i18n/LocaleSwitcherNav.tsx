"use client"

import { usePathname } from "next/navigation"
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher"
import { localeOfPath } from "@/lib/locale-routes"

/**
 * The Navbar's adapter for the language switcher.
 *
 * The Navbar is one shared component rendered on every page, so it cannot know at author
 * time which URL it is on. This wrapper supplies that from `usePathname()`.
 *
 * `usePathname()` is a CLIENT hook, not a request API — it reads the router state in the
 * browser and is inlined into the prerendered output during the build. It does not opt the
 * route out of static rendering, unlike `headers()` or `cookies()` from next/headers, which
 * remain banned across the whole app (asserted by scripts/seo/assert-consent-safety.ts).
 *
 * Locale comes from the route-pair map, never from the pathname's shape: a page under /sr
 * happens to be Serbian today, but /grow is Serbian at an unprefixed URL, so prefix-sniffing
 * would be wrong. `localeOfPath` returns null for anything unclassified — demo pages, route
 * handlers, the 404 — and this renders nothing in that case.
 *
 * Renders nothing at all unless the current page has a real live counterpart, so the Navbar
 * DOM is unchanged on every page except /contact and /sr/contact.
 */
export function LocaleSwitcherNav({
  className,
  activeClassName,
}: {
  className?: string
  activeClassName?: string
}) {
  const pathname = usePathname()
  if (!pathname) return null

  // Normalise a trailing slash so /contact/ resolves like /contact. Not path surgery for
  // locale purposes — the map still decides both the locale and the counterpart.
  const path = pathname !== "/" && pathname.slice(-1) === "/" ? pathname.slice(0, -1) : pathname

  const locale = localeOfPath(path)
  if (locale === null) return null

  return (
    <LanguageSwitcher
      currentPath={path}
      currentLocale={locale}
      className={className}
      activeClassName={activeClassName}
    />
  )
}
