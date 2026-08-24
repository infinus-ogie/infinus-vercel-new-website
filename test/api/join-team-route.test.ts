/**
 * @vitest-environment node
 *
 * The job-application endpoint's LinkedIn field.
 *
 * The unit tests in test/security/hardening.test.ts prove the RULE. This file proves the
 * rule is actually WIRED INTO the endpoint — that a `javascript:` URL is refused by the
 * server, not merely by the browser schema that an attacker never runs.
 *
 * The property asserted throughout is the same one the guard suite asserts: a rejected
 * submission must send no mail.
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

const sendJoinTeamEmail = vi.hoisted(() => vi.fn())
vi.mock('@/lib/email', () => ({ sendJoinTeamEmail }))

import { POST } from '@/app/api/join-team/route'

function request(fields: Record<string, string>) {
  const body = new FormData()
  for (const [key, value] of Object.entries(fields)) body.append(key, value)
  const headers = new Map([
    ['host', 'localhost:3000'],
    ['origin', 'http://localhost:3000'],
  ])
  return {
    formData: async () => body,
    headers: { get: (name: string) => headers.get(name.toLowerCase()) ?? null },
  } as unknown as Parameters<typeof POST>[0]
}

const VALID = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  subject: 'Senior SAP Consultant',
  message: 'I would like to apply for this position.',
}

describe('POST /api/join-team — the LinkedIn field', () => {
  beforeEach(() => {
    sendJoinTeamEmail.mockReset()
    sendJoinTeamEmail.mockResolvedValue({ success: true, messageId: 'test' })
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('accepts an https LinkedIn profile', async () => {
    const response = await POST(
      request({ ...VALID, linkedin: 'https://www.linkedin.com/in/example' })
    )
    expect(response.status).toBe(200)
    expect(sendJoinTeamEmail).toHaveBeenCalledTimes(1)
  })

  test('accepts an omitted LinkedIn — the field is optional', async () => {
    const response = await POST(request(VALID))
    expect(response.status).toBe(200)
    expect(sendJoinTeamEmail).toHaveBeenCalledTimes(1)
  })

  test('accepts an empty LinkedIn — how the form submits an untouched field', async () => {
    const response = await POST(request({ ...VALID, linkedin: '' }))
    expect(response.status).toBe(200)
  })

  test('REJECTS javascript: and sends no mail', async () => {
    const response = await POST(request({ ...VALID, linkedin: 'javascript:alert(1)' }))
    expect(response.status).toBe(400)
    expect(sendJoinTeamEmail).not.toHaveBeenCalled()
  })

  test('REJECTS data: and sends no mail', async () => {
    const response = await POST(
      request({ ...VALID, linkedin: 'data:text/html,<script>alert(1)</script>' })
    )
    expect(response.status).toBe(400)
    expect(sendJoinTeamEmail).not.toHaveBeenCalled()
  })

  test('rejects file: and ftp:', async () => {
    for (const value of ['file:///etc/passwd', 'ftp://example.com/cv']) {
      sendJoinTeamEmail.mockClear()
      const response = await POST(request({ ...VALID, linkedin: value }))
      expect(response.status).toBe(400)
      expect(sendJoinTeamEmail).not.toHaveBeenCalled()
    }
  })

  test('the rejection tells the caller nothing about which field or rule failed', async () => {
    const response = await POST(request({ ...VALID, linkedin: 'javascript:alert(1)' }))
    const body = await response.json()
    expect(body).not.toHaveProperty('errors')
    expect(JSON.stringify(body)).not.toMatch(/linkedin|https|scheme|zod/i)
  })
})
