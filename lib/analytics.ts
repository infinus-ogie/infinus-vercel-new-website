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
