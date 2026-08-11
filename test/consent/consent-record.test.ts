/**
 * Consent record: parsing, validation and versioning.
 *
 * These assert observable behaviour — what a given stored value means — rather than
 * restating constants. The rule under test throughout: anything the site cannot fully
 * trust must read as "no decision", so the visitor is asked again and nothing
 * non-essential loads in the meantime.
 */
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  CONSENT_COOKIE,
  CONSENT_VERSION,
  analyticsCookieNames,
  buildRecord,
  parseConsent,
  persistConsent,
  readConsent,
  readRawCookie,
  serializeConsent,
} from '@/lib/consent'

const valid = (over: Record<string, unknown> = {}) =>
  JSON.stringify({ v: CONSENT_VERSION, ts: '2026-08-11T10:00:00.000Z', necessary: true, analytics: false, marketing: false, ...over })

describe('parseConsent — anything untrustworthy means "no decision"', () => {
  test('absent value', () => {
    expect(parseConsent(null)).toBeNull()
    expect(parseConsent(undefined)).toBeNull()
    expect(parseConsent('')).toBeNull()
  })

  test('malformed JSON', () => {
    expect(parseConsent('{not json')).toBeNull()
    expect(parseConsent('%7Bbroken')).toBeNull()
  })

  test('valid JSON of the wrong shape', () => {
    expect(parseConsent('"a string"')).toBeNull()
    expect(parseConsent('42')).toBeNull()
    expect(parseConsent('null')).toBeNull()
    expect(parseConsent('[]')).toBeNull()
  })

  test('an outdated schema version is re-prompted, not inherited', () => {
    expect(parseConsent(valid({ v: CONSENT_VERSION - 1 }))).toBeNull()
    expect(parseConsent(valid({ v: CONSENT_VERSION + 1 }))).toBeNull()
    expect(parseConsent(valid({ v: 'one' }))).toBeNull()
  })

  test('necessary must be literally true — a record claiming otherwise is invalid', () => {
    expect(parseConsent(valid({ necessary: false }))).toBeNull()
    expect(parseConsent(valid({ necessary: 'yes' }))).toBeNull()
  })

  test('non-boolean category values are rejected rather than coerced', () => {
    expect(parseConsent(valid({ analytics: 'true' }))).toBeNull()
    expect(parseConsent(valid({ analytics: 1 }))).toBeNull()
    expect(parseConsent(valid({ marketing: null }))).toBeNull()
  })

  test('a missing or empty timestamp is invalid — there would be no proof of consent', () => {
    expect(parseConsent(valid({ ts: '' }))).toBeNull()
    const noTs = JSON.stringify({ v: CONSENT_VERSION, necessary: true, analytics: true, marketing: true })
    expect(parseConsent(noTs)).toBeNull()
  })

  test('a well-formed record round-trips, preserving each category independently', () => {
    const record = parseConsent(valid({ analytics: true, marketing: false }))
    expect(record).not.toBeNull()
    expect(record?.analytics).toBe(true)
    expect(record?.marketing).toBe(false)
    expect(record?.necessary).toBe(true)
    expect(record?.ts).toBe('2026-08-11T10:00:00.000Z')
  })

  test('URL-encoded values are decoded (cookies are stored encoded)', () => {
    const encoded = encodeURIComponent(valid({ analytics: true }))
    expect(parseConsent(encoded)?.analytics).toBe(true)
  })
})

describe('buildRecord', () => {
  test('always stamps necessary=true and the current time', () => {
    const at = new Date('2026-08-11T12:34:56.000Z')
    const record = buildRecord({ analytics: false, marketing: true }, at)
    expect(record.necessary).toBe(true)
    expect(record.ts).toBe('2026-08-11T12:34:56.000Z')
    expect(record.v).toBe(CONSENT_VERSION)
    expect(record.marketing).toBe(true)
    expect(record.analytics).toBe(false)
  })

  test('coerces anything non-true to false — no accidental opt-in', () => {
    const record = buildRecord({ analytics: undefined as unknown as boolean, marketing: 1 as unknown as boolean }, new Date())
    expect(record.analytics).toBe(false)
    expect(record.marketing).toBe(false)
  })

  test('round-trips through serialize/parse unchanged', () => {
    const record = buildRecord({ analytics: true, marketing: true }, new Date('2026-01-01T00:00:00.000Z'))
    expect(parseConsent(serializeConsent(record))).toEqual(record)
  })
})

describe('readRawCookie', () => {
  test('finds the named cookie among others and ignores prefix lookalikes', () => {
    const jar = `_ga=GA1.1.x; ${CONSENT_COOKIE}_old=stale; ${CONSENT_COOKIE}=value123; other=1`
    expect(readRawCookie(jar, CONSENT_COOKIE)).toBe('value123')
  })

  test('returns null when absent', () => {
    expect(readRawCookie('a=1; b=2', CONSENT_COOKIE)).toBeNull()
    expect(readRawCookie('', CONSENT_COOKIE)).toBeNull()
  })
})

describe('analyticsCookieNames — only cookies the site can actually clear', () => {
  test('matches GA first-party cookies and nothing unrelated', () => {
    const jar = '_ga=1; _ga_S0YZ6MZWK1=2; _gid=3; _gat_x=4; infinus_consent=5; session=6'
    const names = analyticsCookieNames(jar)
    expect(names).toContain('_ga')
    expect(names).toContain('_ga_S0YZ6MZWK1')
    expect(names).toContain('_gid')
    expect(names).not.toContain('infinus_consent')
    expect(names).not.toContain('session')
  })

  test('returns nothing when no analytics cookies are present', () => {
    expect(analyticsCookieNames('infinus_consent=1')).toEqual([])
  })
})

describe('persistConsent / readConsent against a real document.cookie', () => {
  let jar = ''
  beforeEach(() => {
    jar = ''
    vi.spyOn(document, 'cookie', 'get').mockImplementation(() => jar)
    vi.spyOn(document, 'cookie', 'set').mockImplementation((value: string) => {
      const [pair] = value.split(';')
      const [name] = pair.split('=')
      const kept = jar
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s && !s.startsWith(`${name}=`))
      // max-age=0 means deletion
      jar = /max-age=0|expires=Thu, 01 Jan 1970/.test(value) ? kept.join('; ') : [...kept, pair].join('; ')
    })
  })
  afterEach(() => {
  vi.restoreAllMocks()
})

  test('a persisted decision is readable again', () => {
    persistConsent(buildRecord({ analytics: true, marketing: false }, new Date()))
    const read = readConsent()
    expect(read?.analytics).toBe(true)
    expect(read?.marketing).toBe(false)
  })

  test('the cookie is scoped to the whole site, is not a session cookie, and is SameSite=Lax', () => {
    const writes: string[] = []
    vi.spyOn(document, 'cookie', 'set').mockImplementation((v: string) => void writes.push(v))
    persistConsent(buildRecord({ analytics: false, marketing: false }, new Date()))
    expect(writes).toHaveLength(1)
    expect(writes[0]).toContain('path=/')
    expect(writes[0]).toContain('SameSite=Lax')
    // 12 months, so returning visitors are eventually re-asked.
    expect(writes[0]).toMatch(/max-age=31536000\b/)
  })

  test('no decision stored reads as null', () => {
    expect(readConsent()).toBeNull()
  })

  test('a corrupted stored value reads as null so the banner returns', () => {
    jar = `${CONSENT_COOKIE}=%7Bcorrupted`
    expect(readConsent()).toBeNull()
  })
})
