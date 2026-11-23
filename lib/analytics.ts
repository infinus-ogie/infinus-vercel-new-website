import { readConsent } from './consent'
import type { Locale } from './i18n'

/** Event parameters. Primitive values only: nothing a visitor typed ever goes in here. */
export type AnalyticsParams = Readonly<Record<string, string | number | boolean>>

/**
 * Send a GA4 event, only if the visitor has allowed analytics RIGHT NOW.
 *
 * `typeof window.gtag === 'function'` alone is not a consent check: once gtag has loaded it
 * stays defined after a withdrawal, until the reload the consent provider performs. So the
 * stored decision is read at the moment of sending, and gtag must also be present (it only
 * ever is after AnalyticsGate has opened).
 *
 * Returns whether the event was handed to gtag, which is what the tests assert on.
 */
export function trackEvent(name: string, params: AnalyticsParams): boolean {
  if (typeof window === 'undefined') return false
  if (readConsent()?.analytics !== true) return false
  if (typeof window.gtag !== 'function') return false
  window.gtag('event', name, { ...params })
  return true
}

/** Page and language, the two dimensions every campaign event carries. */
export interface PageContext {
  /** A stable page slug, e.g. "sap-vs-microsoft". Matches the `page` value cta_click uses. */
  readonly page: string
  readonly language: Locale
}

/**
 * The event parameters for a page context.
 *
 * The language goes out as `page_language`, NOT `language`: gtag reserves `language` as the
 * visitor's browser language (the `ul` field) and silently consumes it, so a parameter by
 * that name never reaches GA4 as an event parameter.
 */
export function pageParams(context: PageContext): AnalyticsParams {
  return { page: context.page, page_language: context.language }
}

/**
 * Folders that only group pages and carry no meaning of their own. They are dropped from
 * the page slug so that `/insights/sap-vs-microsoft` stays "sap-vs-microsoft", the value
 * the campaign events have used since they went live.
 */
const GROUPING_SEGMENTS = new Set(['insights', 'sap-packaged-solutions'])

/**
 * The page and language a click or an enquiry came from, read from the route path.
 *
 *   /                                → home, en
 *   /sr                              → home, sr
 *   /sr/contact                      → contact, sr
 *   /insights/sap-vs-microsoft       → sap-vs-microsoft, en
 *   /grow/cfo                        → grow-cfo, en
 *   /sap-packaged-solutions/sap-starter-package → sap-starter-package, en
 *
 * The language is the URL prefix and nothing else: every Serbian page lives under /sr, and
 * the route-pair table (lib/locale-routes) only knows the pages that have a counterpart.
 */
export function pageContextFromPath(pathname: string | null | undefined): PageContext {
  const path = typeof pathname === 'string' ? pathname.split(/[?#]/)[0] : '/'
  const segments = path.split('/').filter(Boolean)
  const language: Locale = segments[0] === 'sr' ? 'sr' : 'en'
  if (language === 'sr') segments.shift()
  if (segments.length > 1 && GROUPING_SEGMENTS.has(segments[0])) segments.shift()
  return { page: segments.join('-') || 'home', language }
}

/** `cta` names the button; page and language say where it was clicked. */
export function ctaParams(cta: string, context: PageContext): AnalyticsParams {
  return { cta, ...pageParams(context) }
}

/** One `cta_click` for a click on `pathname`, consent permitting. */
export function trackCtaClick(cta: string, pathname: string | null | undefined): boolean {
  return trackEvent('cta_click', ctaParams(cta, pageContextFromPath(pathname)))
}

/** The Contact page in either language: the destination of the navigation's Contact item. */
export function isContactPath(href: string): boolean {
  return /^\/(sr\/)?contact\/?$/.test(href)
}
