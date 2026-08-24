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
const sendEbookDeliveryEmail = vi.hoisted(() => vi.fn())
vi.mock('@/lib/email', () => ({ sendEbookLeadEmail, sendEbookDeliveryEmail }))

// A static import is fine: vi.mock is hoisted above it, so the handler picks up the mock.
// (A top-level `await import` would work under Vitest but fails `tsc --noEmit` on this
// project's module target.)
import { POST } from '@/app/api/ebook/route'

function request(fields: Record<string, string>) {
  const body = new FormData()
  for (const [key, value] of Object.entries(fields)) body.append(key, value)
  return { formData: async () => body } as unknown as Parameters<typeof POST>[0]
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
    sendEbookDeliveryEmail.mockReset()
    sendEbookDeliveryEmail.mockResolvedValue({ success: true, messageId: 'delivery' })
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
})

describe('locale-aware validation', () => {
  beforeEach(() => {
    sendEbookLeadEmail.mockReset()
    sendEbookLeadEmail.mockResolvedValue({ success: true, messageId: 'test' })
    sendEbookDeliveryEmail.mockReset()
    sendEbookDeliveryEmail.mockResolvedValue({ success: true, messageId: 'delivery' })
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

describe('the delivery email sent to the visitor', () => {
  beforeEach(() => {
    sendEbookLeadEmail.mockReset()
    sendEbookLeadEmail.mockResolvedValue({ success: true, messageId: 'test' })
    sendEbookDeliveryEmail.mockReset()
    sendEbookDeliveryEmail.mockResolvedValue({ success: true, messageId: 'delivery' })
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('goes to the submitted address, with only name/email/locale', async () => {
    await POST(request({ ...VALID, locale: 'sr', country: 'Srbija' }))

    expect(sendEbookDeliveryEmail).toHaveBeenCalledTimes(1)
    // Exactly three values reach the template. Nothing else submitted can influence it.
    expect(sendEbookDeliveryEmail).toHaveBeenCalledWith({
      name: VALID.name,
      email: VALID.email,
      locale: 'sr',
    })
  })

  test('is NOT sent when validation fails — no mail to an unvalidated address', async () => {
    // The abuse case this guards: using the endpoint to push branded mail at arbitrary
    // inboxes without leaving an internal record.
    await POST(request({ ...VALID, email: 'not-an-email' }))
    expect(sendEbookDeliveryEmail).not.toHaveBeenCalled()
  })

  test('is NOT sent when the internal lead notification failed', async () => {
    sendEbookLeadEmail.mockResolvedValue({ success: false, error: 'SMTP down' })
    await POST(request(VALID))
    expect(sendEbookDeliveryEmail).not.toHaveBeenCalled()
  })

  test('a delivery failure does NOT fail the submission', async () => {
    // The visitor already has the download on screen and the lead is already captured.
    // Reporting failure would take away a file they can see, over a convenience copy.
    sendEbookDeliveryEmail.mockResolvedValue({ success: false, error: 'mailbox full' })

    const response = await POST(request(VALID))
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({ success: true })
  })

  test('reports emailDelivered=true when the copy actually went out', async () => {
    const response = await POST(request(VALID))
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      emailDelivered: true,
    })
  })

  test('reports emailDelivered=false when it did not', async () => {
    // Two independent outcomes in one response: the submission succeeded, the convenience
    // copy did not. The success UI needs to tell them apart so it does not claim an email
    // was sent when none was.
    sendEbookDeliveryEmail.mockResolvedValue({ success: false, error: 'mailbox full' })

    const response = await POST(request(VALID))
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.emailDelivered).toBe(false)
  })

  test('emailDelivered leaks NO provider, SMTP or address detail', async () => {
    // The provider's error text can carry the SMTP host, the authenticated sender, the
    // recipient or a stack. None of that belongs in a browser response.
    sendEbookDeliveryEmail.mockResolvedValue({
      success: false,
      error: 'Invalid login: 535-5.7.8 Username and Password not accepted for smtp.gmail.com',
    })

    const response = await POST(request(VALID))
    const body = await response.json()

    expect(typeof body.emailDelivered).toBe('boolean')
    const serialised = JSON.stringify(body)
    for (const secret of ['smtp', 'gmail', '535', 'Username', 'Invalid login', '@']) {
      expect(serialised.toLowerCase(), `leaked "${secret}"`).not.toContain(secret.toLowerCase())
    }
    // The whole response is just the three known fields.
    expect(Object.keys(body).sort()).toEqual(['emailDelivered', 'message', 'success'])
  })

  test('exactly one message per submission', async () => {
    await POST(request(VALID))
    expect(sendEbookDeliveryEmail).toHaveBeenCalledTimes(1)
  })

  test('a failed send is a FAILED submission — never a silent lost lead', async () => {
    sendEbookLeadEmail.mockResolvedValue({ success: false, error: 'SMTP down' })

    const response = await POST(request(VALID))
    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toMatchObject({ success: false })
  })
})
