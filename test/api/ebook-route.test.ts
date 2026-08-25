/**
 * The e-book lead endpoint.
 *
 * The behaviour worth pinning is not the happy path — it is the two ways this handler can
 * lose a lead, given that the notification email is the ONLY record of one:
 *
 *   · it must not accept a submission it cannot validate
 *   · it must NOT report success when the send failed
 *
 * The second is the subtle one. Returning `{ success: true }` after a failed send would show
 * the visitor their download, satisfy the form, and drop the lead on the floor with nobody
 * any the wiser.
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

const sendEbookLeadEmail = vi.hoisted(() => vi.fn())
vi.mock('@/lib/email', () => ({ sendEbookLeadEmail }))

// A static import is fine: vi.mock is hoisted above it, so the handler picks up the mock.
// (A top-level `await import` would work under Vitest but fails `tsc --noEmit` on this
// project's module target.)
import { POST } from '@/app/api/ebook/route'

/**
 * A request that passes the shared security guard by default.
 *
 * These tests exercise the REAL guard rather than mocking it out, because "a rejected
 * request sends no email" is the property most worth proving and mocking the guard away
 * would prove nothing. Under NODE_ENV=test with no RECAPTCHA_SECRET_KEY the captcha layer
 * skips (development behaviour); the honeypot, origin and rate-limit layers all run for
 * real.
 *
 * `headers` lets a test override that — see the guard suite below.
 */
function request(
  fields: Record<string, string>,
  headers: Record<string, string> = { host: 'localhost:3000', origin: 'http://localhost:3000' }
) {
  const body = new FormData()
  for (const [key, value] of Object.entries(fields)) body.append(key, value)
  const headerMap = new Map(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]))
  return {
    formData: async () => body,
    headers: { get: (name: string) => headerMap.get(name.toLowerCase()) ?? null },
  } as unknown as Parameters<typeof POST>[0]
}

const VALID = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical Engines',
}

describe('POST /api/ebook', () => {
  beforeEach(() => {
    sendEbookLeadEmail.mockReset()
    sendEbookLeadEmail.mockResolvedValue({ success: true, messageId: 'test' })
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('accepts the four supplied fields and reports success', async () => {
    const response = await POST(request({ ...VALID, role: 'CFO' }))
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({ success: true })

    expect(sendEbookLeadEmail).toHaveBeenCalledWith(
      expect.objectContaining({ ...VALID, role: 'CFO' })
    )
  })

  test('role is optional — the source document marks it so', async () => {
    const response = await POST(request(VALID))
    expect(response.status).toBe(200)
    expect(sendEbookLeadEmail).toHaveBeenCalledWith(expect.objectContaining({ role: undefined }))
  })

  test('an empty optional field is treated as absent, not as an empty value', async () => {
    await POST(request({ ...VALID, role: '', utm_source: '' }))
    const arg = sendEbookLeadEmail.mock.calls[0][0]
    expect(arg.role).toBeUndefined()
    expect(arg.utm_source).toBeUndefined()
  })

  test('carries the locale and UTM attribution through', async () => {
    // `country` is included because a Serbian submission now requires it — see the
    // locale-aware validation suite below.
    await POST(
      request({
        ...VALID,
        locale: 'sr',
        country: 'Srbija',
        utm_source: 'linkedin',
        utm_campaign: 'mythbusting',
      })
    )
    expect(sendEbookLeadEmail).toHaveBeenCalledWith(
      expect.objectContaining({ locale: 'sr', utm_source: 'linkedin', utm_campaign: 'mythbusting' })
    )
  })

  test('rejects an invalid email without attempting to send', async () => {
    const response = await POST(request({ ...VALID, email: 'not-an-email' }))
    expect(response.status).toBe(400)
    expect(sendEbookLeadEmail).not.toHaveBeenCalled()
  })

  test('rejects a missing company without attempting to send', async () => {
    const response = await POST(request({ name: VALID.name, email: VALID.email, company: '' }))
    expect(response.status).toBe(400)
    expect(sendEbookLeadEmail).not.toHaveBeenCalled()
  })

  test('validates server-side, so a crafted POST cannot bypass the form', async () => {
    // The browser form enforces the same rules. A browser is not a trust boundary.
    const response = await POST(request({ name: 'A', email: 'a@b.co', company: 'X' }))
    expect(response.status).toBe(400)
  })

  /**
   * This endpoint used to answer a validation failure with `errors: error.errors` — Zod's
   * issue array — while /api/contact and /api/join-team both returned one generic message.
   * The detail carried no secret, but it named every failing field back to whoever was
   * probing, and being the only endpoint that answered differently is itself a signal.
   */
  test('a validation failure returns the SAME generic shape as the other endpoints', async () => {
    const response = await POST(request({ ...VALID, email: 'not-an-email' }))
    const body = await response.json()

    expect(body).not.toHaveProperty('errors')
    expect(body).toEqual({
      success: false,
      message: 'We could not process this submission. Please try again.',
    })
  })

  test('the rejection names no field, rule or library', async () => {
    const response = await POST(request({ name: 'A', email: 'nope', company: '' }))
    const serialised = JSON.stringify(await response.json())

    for (const leak of ['email', 'company', 'name', 'zod', 'invalid_string', 'too_small']) {
      expect(serialised.toLowerCase()).not.toContain(leak)
    }
  })
})

describe('locale-aware validation', () => {
  beforeEach(() => {
    sendEbookLeadEmail.mockReset()
    sendEbookLeadEmail.mockResolvedValue({ success: true, messageId: 'test' })
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('Serbian REQUIRES country — the newer SR source marks no field optional', async () => {
    const response = await POST(request({ ...VALID, locale: 'sr' }))
    expect(response.status).toBe(400)
    expect(sendEbookLeadEmail).not.toHaveBeenCalled()
  })

  test('Serbian succeeds once country is supplied', async () => {
    const response = await POST(request({ ...VALID, locale: 'sr', country: 'Srbija' }))
    expect(response.status).toBe(200)
    expect(sendEbookLeadEmail).toHaveBeenCalledWith(
      expect.objectContaining({ country: 'Srbija', locale: 'sr' })
    )
  })

  test('English does NOT require country — its source never asks for one', async () => {
    // The guard against forcing structural parity between two genuinely different forms.
    const response = await POST(request({ ...VALID, locale: 'en' }))
    expect(response.status).toBe(200)
  })

  test('English still does not require a role', async () => {
    const response = await POST(request({ ...VALID, locale: 'en' }))
    expect(response.status).toBe(200)
    expect(sendEbookLeadEmail).toHaveBeenCalledWith(expect.objectContaining({ role: undefined }))
  })

  test('an unknown locale is rejected rather than silently defaulted', async () => {
    const response = await POST(request({ ...VALID, locale: 'de' }))
    expect(response.status).toBe(400)
  })
})

/**
 * What this endpoint is allowed to SEND, now that the delivery email is gone.
 *
 * It used to email the download link to whatever address the form carried, which made it the
 * only endpoint on the site that mailed a member of the public and gave it a corresponding
 * abuse profile. The owner withdrew that flow: the browser downloads the PDF directly.
 *
 * These assert the removal as a PROPERTY of the module rather than as the absence of one
 * call - the mocked `@/lib/email` exposes only `sendEbookLeadEmail`, so a reintroduced
 * delivery import would fail to resolve rather than quietly start mailing again.
 */
describe('no mail reaches a user-supplied address', () => {
  beforeEach(() => {
    sendEbookLeadEmail.mockReset()
    sendEbookLeadEmail.mockResolvedValue({ success: true, messageId: 'test' })
  })

  test('a valid submission sends the internal notification and nothing else', async () => {
    const response = await POST(request(VALID))

    expect(response.status).toBe(200)
    expect(sendEbookLeadEmail).toHaveBeenCalledTimes(1)
    // The lead notification carries the submitted data; it goes to RECIPIENT_EMAILS, which
    // lib/email.ts owns. Nothing here chooses a recipient.
    expect(sendEbookLeadEmail).toHaveBeenCalledWith(expect.objectContaining({
      name: VALID.name,
      email: VALID.email,
    }))
  })

  test('the email module exposes no delivery function to call', async () => {
    const mod = await import('@/lib/email')
    expect('sendEbookDeliveryEmail' in mod, 'the withdrawn delivery path').toBe(false)
    expect(typeof mod.sendEbookLeadEmail, 'the internal notification stays').toBe('function')
  })

  test('the response says nothing about email at all', async () => {
    const response = await POST(request(VALID))
    const body = await response.json()

    expect(Object.keys(body).sort()).toEqual(['message', 'success'])
    expect(body).not.toHaveProperty('emailDelivered')

    // And it still leaks no provider detail, which was the original reason this was a boolean.
    const serialised = JSON.stringify(body).toLowerCase()
    for (const secret of ['smtp', 'gmail', 'username', 'invalid login', '@']) {
      expect(serialised, `leaked "${secret}"`).not.toContain(secret)
    }
  })

  test('a rejected request sends no mail whatsoever', async () => {
    const response = await POST(request({ ...VALID, email: 'not-an-email' }))

    expect(response.status).toBe(400)
    expect(sendEbookLeadEmail).not.toHaveBeenCalled()
  })

  test('a failed internal send is a FAILED submission - never a silent lost lead', async () => {
    sendEbookLeadEmail.mockResolvedValue({ success: false, error: 'SMTP down' })

    const response = await POST(request(VALID))
    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toMatchObject({ success: false })
  })
})
