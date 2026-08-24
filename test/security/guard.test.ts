/**
 * The shared form guard: honeypot, same-origin, rate limit, captcha.
 *
 * The property that matters most is asserted throughout: a rejected request must cause the
 * server to do NOTHING. Every endpoint calls this before it touches lib/email.ts, so a
 * failure here is the difference between "a bot got blocked" and "a bot made us send mail".
 *
 * Also asserted: the response tells the caller nothing. Whichever layer rejected, the body
 * is identical — no score, no Google error codes, no mention that a honeypot exists.
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  guardFormRequest,
  HONEYPOT_FIELD,
  RECAPTCHA_FIELD,
} from '@/lib/security/guard'
import { RECAPTCHA_ACTIONS } from '@/lib/security/recaptcha'

const ORIGINAL_ENV = { ...process.env }

function makeRequest(
  fields: Record<string, string> = {},
  headers: Record<string, string> = { host: 'infinus.co', origin: 'https://infinus.co' }
) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(fields)) formData.append(key, value)
  const headerMap = new Map(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]))
  return {
    formData,
    request: {
      headers: { get: (name: string) => headerMap.get(name.toLowerCase()) ?? null },
    } as never,
  }
}

function run(fields?: Record<string, string>, headers?: Record<string, string>) {
  const { formData, request } = makeRequest(fields, headers)
  return guardFormRequest({
    request,
    formData,
    action: RECAPTCHA_ACTIONS.contact,
    rateLimitKind: 'contact',
  })
}

describe('the honeypot', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    delete process.env.RECAPTCHA_SECRET_KEY
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    vi.restoreAllMocks()
  })

  test('an EMPTY honeypot passes, as a real submission does', async () => {
    const result = await run({ [HONEYPOT_FIELD]: '' })
    expect(result.ok).toBe(true)
  })

  test('an absent honeypot passes too', async () => {
    const result = await run({})
    expect(result.ok).toBe(true)
  })

  test('a POPULATED honeypot is rejected', async () => {
    const result = await run({ [HONEYPOT_FIELD]: 'http://spam.example' })
    expect(result.ok).toBe(false)
    expect(!result.ok && result.response.status).toBe(400)
  })

  test('whitespace alone does not count as filled', async () => {
    // A stray space must not lock a real person out of the form with no explanation.
    const result = await run({ [HONEYPOT_FIELD]: '   ' })
    expect(result.ok).toBe(true)
  })

  test('the rejection does not reveal that a honeypot exists', async () => {
    const result = await run({ [HONEYPOT_FIELD]: 'x' })
    const body = await (!result.ok ? result.response.json() : Promise.resolve({}))
    const serialised = JSON.stringify(body).toLowerCase()
    for (const word of ['honeypot', 'company_website', 'bot', 'spam']) {
      expect(serialised, `leaked "${word}"`).not.toContain(word)
    }
  })
})

describe('same-origin', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    delete process.env.RECAPTCHA_SECRET_KEY
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    vi.restoreAllMocks()
  })

  test('a matching Origin passes', async () => {
    const result = await run({}, { host: 'infinus.co', origin: 'https://infinus.co' })
    expect(result.ok).toBe(true)
  })

  test('a cross-origin POST is rejected with 403', async () => {
    const result = await run({}, { host: 'infinus.co', origin: 'https://evil.example' })
    expect(result.ok).toBe(false)
    expect(!result.ok && result.response.status).toBe(403)
  })

  test('a Vercel PREVIEW host works without any allowlist', async () => {
    // The check derives its expectation from the request, so a preview deployment protects
    // itself with no list to maintain — and nobody has to disable it to run QA.
    const host = 'infinus-git-feature-abc123.vercel.app'
    const result = await run({}, { host, origin: `https://${host}` })
    expect(result.ok).toBe(true)
  })

  test('localhost development works', async () => {
    const result = await run({}, { host: 'localhost:3000', origin: 'http://localhost:3000' })
    expect(result.ok).toBe(true)
  })

  test('x-forwarded-host wins over host, as it does behind Vercel', async () => {
    const result = await run(
      {},
      {
        host: 'internal-lambda.local',
        'x-forwarded-host': 'infinus.co',
        origin: 'https://infinus.co',
      }
    )
    expect(result.ok).toBe(true)
  })

  test('a MISSING Origin is accepted, not treated as evidence', async () => {
    // Some browsers omit it on same-origin POSTs and privacy tooling strips it. Rejecting
    // on absence breaks real submissions to catch an attacker who can simply omit it.
    const result = await run({}, { host: 'infinus.co' })
    expect(result.ok).toBe(true)
  })

  test('Referer is used when Origin is absent', async () => {
    const result = await run(
      {},
      { host: 'infinus.co', referer: 'https://evil.example/page' }
    )
    expect(result.ok).toBe(false)
  })
})

describe('captcha, through the guard', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, RECAPTCHA_SECRET_KEY: 'test-secret' }
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('a good token passes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ success: true, score: 0.9, action: 'contact', hostname: 'infinus.co' }),
      }) as unknown as Response)
    )
    const result = await run({ [RECAPTCHA_FIELD]: 'tok' })
    expect(result.ok).toBe(true)
  })

  test('a low score is rejected with 400', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ success: true, score: 0.1, action: 'contact' }),
      }) as unknown as Response)
    )
    const result = await run({ [RECAPTCHA_FIELD]: 'tok' })
    expect(result.ok).toBe(false)
    expect(!result.ok && result.response.status).toBe(400)
  })

  test('an unreachable verifier is a 503, not a silent pass', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('ECONNREFUSED')
      })
    )
    const result = await run({ [RECAPTCHA_FIELD]: 'tok' })
    expect(result.ok).toBe(false)
    expect(!result.ok && result.response.status).toBe(503)
  })

  test('no score, error code or hostname reaches the client', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          success: false,
          score: 0.02,
          hostname: 'attacker.example',
          'error-codes': ['timeout-or-duplicate', 'invalid-input-secret'],
        }),
      }) as unknown as Response)
    )

    const result = await run({ [RECAPTCHA_FIELD]: 'tok' })
    expect(result.ok).toBe(false)

    const body = await (!result.ok ? result.response.json() : Promise.resolve({}))
    const serialised = JSON.stringify(body).toLowerCase()
    for (const secret of ['0.02', 'attacker', 'invalid-input-secret', 'timeout', 'score', 'recaptcha', 'captcha']) {
      expect(serialised, `leaked "${secret}"`).not.toContain(secret)
    }
    expect(Object.keys(body).sort()).toEqual(['message', 'success'])
  })
})

describe('every rejection looks the same from outside', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    delete process.env.RECAPTCHA_SECRET_KEY
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    vi.restoreAllMocks()
  })

  test('honeypot and cross-origin return an identical body', async () => {
    // Different status codes, same message. Telling a prober WHICH layer caught them is
    // telling them what to change.
    const honeypot = await run({ [HONEYPOT_FIELD]: 'x' })
    const crossOrigin = await run({}, { host: 'infinus.co', origin: 'https://evil.example' })

    expect(honeypot.ok).toBe(false)
    expect(crossOrigin.ok).toBe(false)

    const a = await (!honeypot.ok ? honeypot.response.json() : null)
    const b = await (!crossOrigin.ok ? crossOrigin.response.json() : null)
    expect(a).toEqual(b)
  })
})
