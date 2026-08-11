/**
 * Cookie-consent record: storage, validation and vendor teardown.
 *
 * Deliberately framework-free and client-only. Nothing here may be imported into a
 * server component in a way that reads request state — the consent decision is read
 * from `document.cookie` AFTER mount, never from `next/headers`. Reading cookies
 * server-side would opt every page out of static prerendering, which is precisely the
 * regression the SEO harness exists to catch.
 */

/** First-party preference cookie. Not a credential — the client must be able to update it. */
export const CONSENT_COOKIE = 'infinus_consent' as const

/**
 * Bump when the categories or their meaning change, so returning visitors are
 * re-prompted instead of silently inheriting a decision they never made.
 */
export const CONSENT_VERSION = 1 as const

/** 12 months, expressed in seconds. */
export const CONSENT_MAX_AGE_SECONDS = 365 * 24 * 60 * 60

/** Google Analytics measurement id. Inlined at build time; falls back to the id previously hardcoded in app/layout.tsx. */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-S0YZ6MZWK1'

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing'

/** The non-essential categories a visitor can actually choose. */
export const OPTIONAL_CATEGORIES: readonly Exclude<ConsentCategory, 'necessary'>[] = ['analytics', 'marketing']

export interface ConsentRecord {
  /** Schema version; a record from an older version is treated as no decision. */
  v: number
  /** ISO timestamp of the decision — the proof-of-consent record. */
  ts: string
  /** Always true: strictly necessary cookies are not optional and are never tracked. */
  necessary: true
  analytics: boolean
  marketing: boolean
}

export type ConsentChoices = Pick<ConsentRecord, 'analytics' | 'marketing'>

/** No decision yet: nothing non-essential may load. */
export const NO_CONSENT: ConsentChoices = { analytics: false, marketing: false }

export function buildRecord(choices: ConsentChoices, now: Date): ConsentRecord {
  return {
    v: CONSENT_VERSION,
    ts: now.toISOString(),
    necessary: true,
    analytics: choices.analytics === true,
    marketing: choices.marketing === true,
  }
}

/**
 * Parse a stored value into a record.
 *
 * Returns null — meaning "no decision, re-prompt" — for anything unusable: absent,
 * malformed JSON, wrong shape, or a version this build does not understand.
 */
export function parseConsent(raw: string | null | undefined): ConsentRecord | null {
  if (!raw) return null
  let decoded: string
  try {
    decoded = decodeURIComponent(raw)
  } catch {
    return null
  }
  let value: unknown
  try {
    value = JSON.parse(decoded)
  } catch {
    return null
  }
  if (typeof value !== 'object' || value === null) return null
  const record = value as Record<string, unknown>
  if (record.v !== CONSENT_VERSION) return null
  if (typeof record.ts !== 'string' || record.ts === '') return null
  if (record.necessary !== true) return null
  if (typeof record.analytics !== 'boolean' || typeof record.marketing !== 'boolean') return null
  return {
    v: CONSENT_VERSION,
    ts: record.ts,
    necessary: true,
    analytics: record.analytics,
    marketing: record.marketing,
  }
}

export function serializeConsent(record: ConsentRecord): string {
  return encodeURIComponent(JSON.stringify(record))
}

/** Read the raw cookie value by name from a document.cookie-style string. */
export function readRawCookie(cookieString: string, name: string): string | null {
  for (const part of cookieString.split(';')) {
    const trimmed = part.trim()
    if (trimmed.startsWith(`${name}=`)) return trimmed.slice(name.length + 1)
  }
  return null
}

export function readConsent(): ConsentRecord | null {
  if (typeof document === 'undefined') return null
  return parseConsent(readRawCookie(document.cookie, CONSENT_COOKIE))
}

export function persistConsent(record: ConsentRecord): void {
  if (typeof document === 'undefined') return
  const attributes = [
    `${CONSENT_COOKIE}=${serializeConsent(record)}`,
    'path=/',
    `max-age=${CONSENT_MAX_AGE_SECONDS}`,
    'SameSite=Lax',
  ]
  // Secure only over HTTPS: on http://localhost a Secure cookie would be dropped.
  if (typeof location !== 'undefined' && location.protocol === 'https:') attributes.push('Secure')
  document.cookie = attributes.join('; ')
}

/** Names of first-party cookies GA sets for this property, as far as the site can know them. */
export function analyticsCookieNames(cookieString: string): string[] {
  const names: string[] = []
  for (const part of cookieString.split(';')) {
    const name = part.trim().split('=')[0]
    if (name === '_ga' || name.startsWith('_ga_') || name === '_gid' || name.startsWith('_gat')) {
      names.push(name)
    }
  }
  return names
}

/**
 * Best-effort teardown when analytics consent is withdrawn.
 *
 * `ga-disable-<id>` stops an already-loaded gtag from sending anything further, and the
 * first-party `_ga*` cookies are expired on every plausible domain scope. A script that
 * is already in the document cannot truly be unloaded, which is why the provider also
 * reloads the page after withdrawal rather than pretending otherwise.
 */
export function teardownAnalytics(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  ;(window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = true

  const host = location.hostname
  // e.g. "www.infinus.co" -> ["www.infinus.co", "infinus.co"]
  const domains = new Set<string>(['', host])
  const parts = host.split('.')
  if (parts.length > 2) domains.add(parts.slice(-2).join('.'))

  for (const name of analyticsCookieNames(document.cookie)) {
    for (const domain of Array.from(domains)) {
      const scope = domain ? `; domain=${domain}` : ''
      document.cookie = `${name}=; path=/; max-age=0${scope}`
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${scope}`
    }
  }
}
