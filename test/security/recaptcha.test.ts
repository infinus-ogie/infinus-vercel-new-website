/**
 * reCAPTCHA server-side verification.
 *
 * The property under test is not "does it call Google" — it is "what does it refuse". Every
 * case below is a token that a naive implementation would accept: a token for a different
 * action, a token from a different hostname, a low score, a malformed response. Each of them
 * is a way in if the check is written as `if (data.success) allow`.
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { verifyRecaptcha, minimumScore, RECAPTCHA_ACTIONS } from '@/lib/security/recaptcha'

/*
 * The reCAPTCHA implementation is TEMPORARILY not enforced (see lib/security/enforcement.ts),
 * but it is not removed, and these tests are what will prove it still works when it is turned
 * back on. So they pin the switch to ON and go on exercising the verification logic exactly as
 * before. The DISABLED behaviour is covered separately in test/security/recaptcha-disabled.test.ts.
 */
vi.mock('@/lib/security/enforcement', () => ({ RECAPTCHA_ENFORCEMENT_ENABLED: true }))

const ORIGINAL_ENV = { ...process.env }

function googleReturns(payload: unknown, ok = true) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok, status: ok ? 200 : 500, json: async () => payload }) as unknown as Response)
  )
}

describe('verifyRecaptcha', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, RECAPTCHA_SECRET_KEY: 'test-secret' }
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('accepts a valid, high-scoring token for the expected action', async () => {
    googleReturns({ success: true, score: 0.9, action: 'contact', hostname: 'infinus.co' })

    const result = await verifyRecaptcha({
      token: 'tok',
      action: RECAPTCHA_ACTIONS.contact,
      expectedHostnames: ['infinus.co'],
    })

    expect(result.ok).toBe(true)
    expect(result.ok && result.score).toBe(0.9)
    expect(result.ok && result.skipped).toBe(false)
  })

  test('rejects a MISSING token without calling Google', async () => {
    googleReturns({ success: true, score: 0.9 })
    const result = await verifyRecaptcha({ token: null, action: RECAPTCHA_ACTIONS.contact })

    expect(result).toEqual({ ok: false, reason: 'missing-token' })
    expect(fetch).not.toHaveBeenCalled()
  })

  test('rejects when Google says the token is invalid', async () => {
    googleReturns({ success: false, 'error-codes': ['invalid-input-response'] })
    const result = await verifyRecaptcha({ token: 'tok', action: RECAPTCHA_ACTIONS.contact })

    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toBe('rejected')
  })

  test('rejects a token minted for a DIFFERENT action', async () => {
    // The replay case: a token harvested from the contact form must not open the e-book
    // endpoint, which is the one that emails strangers.
    googleReturns({ success: true, score: 0.9, action: 'contact' })
    const result = await verifyRecaptcha({ token: 'tok', action: RECAPTCHA_ACTIONS.ebook })

    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toBe('wrong-action')
  })

  test('rejects a score below the threshold', async () => {
    googleReturns({ success: true, score: 0.1, action: 'contact' })
    const result = await verifyRecaptcha({ token: 'tok', action: RECAPTCHA_ACTIONS.contact })

    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toBe('low-score')
  })

  test('rejects a token issued on an unexpected hostname', async () => {
    googleReturns({ success: true, score: 0.9, action: 'contact', hostname: 'evil.example' })
    const result = await verifyRecaptcha({
      token: 'tok',
      action: RECAPTCHA_ACTIONS.contact,
      expectedHostnames: ['infinus.co', 'localhost'],
    })

    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toBe('wrong-hostname')
  })

  test('rejects when the verification service itself fails', async () => {
    googleReturns({}, false)
    const result = await verifyRecaptcha({ token: 'tok', action: RECAPTCHA_ACTIONS.contact })

    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toBe('verification-unavailable')
  })

  test('rejects a malformed verification response rather than assuming success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError('Unexpected token < in JSON')
        },
      }) as unknown as Response)
    )

    const result = await verifyRecaptcha({ token: 'tok', action: RECAPTCHA_ACTIONS.contact })
    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toBe('verification-unavailable')
  })

  test('a v2-style response with no score is accepted on `success` alone', async () => {
    // Nothing to compare a threshold against; `success` is the whole verdict there.
    googleReturns({ success: true, action: 'contact' })
    const result = await verifyRecaptcha({ token: 'tok', action: RECAPTCHA_ACTIONS.contact })

    expect(result.ok).toBe(true)
    expect(result.ok && result.score).toBeNull()
  })
})

describe('a missing secret', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('FAILS CLOSED when deployed', async () => {
    // The failure this prevents: a production deploy that forgot the env var and therefore
    // silently accepts every submission while its code says it is protected.
    process.env = { ...ORIGINAL_ENV, NODE_ENV: 'production' }
    delete process.env.RECAPTCHA_SECRET_KEY

    const result = await verifyRecaptcha({ token: 'tok', action: RECAPTCHA_ACTIONS.contact })
    expect(result).toEqual({ ok: false, reason: 'missing-secret' })
  })

  test('skips in development, so local work does not need keys', async () => {
    process.env = { ...ORIGINAL_ENV, NODE_ENV: 'development' }
    delete process.env.RECAPTCHA_SECRET_KEY

    const result = await verifyRecaptcha({ token: null, action: RECAPTCHA_ACTIONS.contact })
    expect(result.ok).toBe(true)
    // `skipped` is what stops a caller reading this as "verified".
    expect(result.ok && result.skipped).toBe(true)
  })
})

describe('the score threshold', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  test('defaults to 0.5 when unset', () => {
    delete process.env.RECAPTCHA_MIN_SCORE
    expect(minimumScore()).toBe(0.5)
  })

  test('is configurable', () => {
    process.env.RECAPTCHA_MIN_SCORE = '0.7'
    expect(minimumScore()).toBe(0.7)
  })

  test('falls back to the default for nonsense, rather than to 0', () => {
    // A threshold of 0 accepts everything. Parsing "" or "abc" to 0 would silently disable
    // the check, which is the wrong direction to fail in.
    for (const value of ['', 'abc', '-1', '5', 'NaN']) {
      process.env.RECAPTCHA_MIN_SCORE = value
      expect(minimumScore(), value).toBe(0.5)
    }
  })
})
