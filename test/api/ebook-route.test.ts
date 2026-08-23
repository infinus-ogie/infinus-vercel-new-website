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
    await POST(
      request({ ...VALID, locale: 'sr', utm_source: 'linkedin', utm_campaign: 'mythbusting' })
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

  test('a failed send is a FAILED submission — never a silent lost lead', async () => {
    sendEbookLeadEmail.mockResolvedValue({ success: false, error: 'SMTP down' })

    const response = await POST(request(VALID))
    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toMatchObject({ success: false })
  })
})
