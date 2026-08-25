/**
 * The TEMPORARY captcha-off state, asserted end to end.
 *
 * `RECAPTCHA_ENFORCEMENT_ENABLED` is `false` for roughly ten days while the owner is away. The
 * risk in a switch like this is not that it fails loudly - it is that it fails PARTIALLY: the
 * server stops asking for a token while the client still tries to mint one, or one of three
 * routes keeps its own check, and forms break on a deployment with no keys in a way nobody
 * sees until a client does.
 *
 * So these prove the whole shape: no Google call, no token needed, no env var needed, and
 * every OTHER control still doing its job. The reverse case - that verification works when the
 * switch is on - is covered in recaptcha.test.ts and guard.test.ts, which pin it to `true`.
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Mock } from 'vitest'
import { RECAPTCHA_ENFORCEMENT_ENABLED } from '@/lib/security/enforcement'
import { verifyRecaptcha, RECAPTCHA_ACTIONS } from '@/lib/security/recaptcha'
import { guardFormRequest } from '@/lib/security/guard'
import { HONEYPOT_FIELD } from '@/lib/security/fields'

const ORIGIN = 'https://www.infinus.co'

/**
 * The same minimal stand-in test/security/guard.test.ts uses: the guard only ever reads
 * headers off the request, so a full NextRequest is unnecessary and its type would have to be
 * satisfied with a cast anyway.
 */
function request(fields: Record<string, string>, origin = ORIGIN) {
  const body = new FormData()
  for (const [k, v] of Object.entries(fields)) body.set(k, v)
  const headers = new Map([
    ['origin', origin],
    ['host', 'www.infinus.co'],
  ])
  return {
    req: {
      headers: { get: (name: string) => headers.get(name.toLowerCase()) ?? null },
    } as never,
    body,
  }
}

describe('the enforcement switch itself', () => {
  test('is OFF, which is what every assertion below assumes', () => {
    expect(RECAPTCHA_ENFORCEMENT_ENABLED).toBe(false)
  })
})

describe('with enforcement off, verification never reaches Google', () => {
  let fetchSpy: Mock<[], Promise<Response>>

  beforeEach(() => {
    fetchSpy = vi.fn(async () => new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchSpy)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  test('a MISSING token passes, and no request is made', async () => {
    const result = await verifyRecaptcha({ token: null, action: RECAPTCHA_ACTIONS.contact })

    expect(result.ok).toBe(true)
    expect(fetchSpy, 'Google must not be contacted').not.toHaveBeenCalled()
  })

  test('a missing SECRET passes, even in a deployed environment', async () => {
    // This is the exact combination that made the real Preview fail closed.
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('RECAPTCHA_SECRET_KEY', '')

    const result = await verifyRecaptcha({ token: null, action: RECAPTCHA_ACTIONS.ebook })

    expect(result.ok, 'a keyless deployment must still accept valid submissions').toBe(true)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  test('a present token is ignored rather than verified', async () => {
    const result = await verifyRecaptcha({
      token: 'a-token-from-somewhere',
      action: RECAPTCHA_ACTIONS.careers,
    })

    expect(result.ok).toBe(true)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  test('the result reports itself as SKIPPED, not as a verified pass', async () => {
    const result = await verifyRecaptcha({ token: null, action: RECAPTCHA_ACTIONS.contact })

    // Callers and logs must be able to tell "not checked" from "checked and clean".
    expect(result).toMatchObject({ ok: true, skipped: true, score: null })
  })
})

describe('the shared guard, with no captcha configured at all', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 200 })))
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('RECAPTCHA_SECRET_KEY', '')
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  for (const kind of ['contact', 'careers', 'ebook'] as const) {
    test(`${kind}: a clean submission with no token is allowed`, async () => {
      const { req, body } = request({ name: 'Ana' })
      const outcome = await guardFormRequest({
        request: req,
        formData: body,
        action: RECAPTCHA_ACTIONS[kind],
        rateLimitKind: kind,
      })

      expect(outcome.ok, `${kind} was rejected`).toBe(true)
    })
  }

  // ── and everything else still rejects ────────────────────────────────────────

  test('the honeypot still rejects', async () => {
    const { req, body } = request({ name: 'Ana', [HONEYPOT_FIELD]: 'filled by a bot' })
    const outcome = await guardFormRequest({
      request: req,
      formData: body,
      action: RECAPTCHA_ACTIONS.contact,
      rateLimitKind: 'contact',
    })

    expect(outcome.ok).toBe(false)
    if (!outcome.ok) {
      expect(outcome.reason).toBe('honeypot')
      expect(outcome.response.status).toBe(400)
    }
  })

  test('a cross-origin submission still rejects', async () => {
    const { req, body } = request({ name: 'Ana' }, 'https://not-infinus.example')
    const outcome = await guardFormRequest({
      request: req,
      formData: body,
      action: RECAPTCHA_ACTIONS.contact,
      rateLimitKind: 'contact',
    })

    expect(outcome.ok).toBe(false)
    if (!outcome.ok) {
      expect(outcome.reason).toBe('cross-origin')
      expect(outcome.response.status).toBe(403)
    }
  })
})
