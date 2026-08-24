/**
 * @vitest-environment node
 *
 * Rate limiting — the abstraction, and the fact that it is NOT ACTIVE.
 *
 * The most important assertion in this file is the last one: `rateLimitStatus().active` is
 * false. It exists so that "we have rate limiting" cannot quietly become true in a report
 * while remaining false in production. When a durable store is provisioned, that test fails,
 * and updating it is the moment someone has to look at whether it really works.
 */
import { describe, test, expect } from 'vitest'
import {
  RATE_LIMITS,
  rateLimitStatus,
  rateLimitKey,
  clientIp,
  consumeRateLimit,
} from '@/lib/security/rate-limit'

function requestWith(headers: Record<string, string>) {
  const map = new Map(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]))
  return { headers: { get: (n: string) => map.get(n.toLowerCase()) ?? null } } as never
}

describe('the current status is honest about itself', () => {
  test('reports NOT ACTIVE, because no durable backend is configured', () => {
    // If this ever fails, a backend was added — and the security report must stop saying
    // "BLOCKED ON INFRA" in the same change.
    const status = rateLimitStatus()
    expect(status.active).toBe(false)
    expect(!status.active && status.reason).toBe('no-durable-backend-configured')
  })

  test('consuming a budget reports enforced:false rather than a fake pass', async () => {
    // `allowed: true` with `enforced: false` is the shape that stops a caller reading an
    // unchecked request as a checked one.
    const result = await consumeRateLimit('ebook', requestWith({ 'x-forwarded-for': '1.2.3.4' }))
    expect(result.allowed).toBe(true)
    expect(result.enforced).toBe(false)
  })
})

describe('the budgets', () => {
  test('every abuse-sensitive endpoint has one, and they are conservative', () => {
    expect(Object.keys(RATE_LIMITS).sort()).toEqual(['careers', 'contact', 'ebook'])
    for (const [kind, budget] of Object.entries(RATE_LIMITS)) {
      expect(budget.limit, kind).toBeGreaterThan(0)
      expect(budget.limit, kind).toBeLessThanOrEqual(10)
      expect(budget.windowSeconds, kind).toBeGreaterThanOrEqual(5 * 60)
    }
  })
})

describe('client identification', () => {
  test('takes the FIRST entry of x-forwarded-for — the client, not the proxy', () => {
    expect(clientIp(requestWith({ 'x-forwarded-for': '203.0.113.9, 10.0.0.1, 10.0.0.2' }))).toBe(
      '203.0.113.9'
    )
  })

  test('falls back to x-real-ip', () => {
    expect(clientIp(requestWith({ 'x-real-ip': '203.0.113.9' }))).toBe('203.0.113.9')
  })

  test('returns null when nothing identifies the client', () => {
    expect(clientIp(requestWith({}))).toBeNull()
  })
})

describe('the storage key', () => {
  test('does not contain the IP — the store holds digests, not addresses', () => {
    const key = rateLimitKey('contact', '203.0.113.9')
    expect(key).not.toContain('203.0.113.9')
    expect(key).toMatch(/^rl:contact:[0-9a-f]{32}$/)
  })

  test('is stable for the same client', () => {
    expect(rateLimitKey('contact', '203.0.113.9')).toBe(rateLimitKey('contact', '203.0.113.9'))
  })

  test('is SCOPED per endpoint, so one form does not spend another budget', () => {
    expect(rateLimitKey('contact', '203.0.113.9')).not.toBe(rateLimitKey('ebook', '203.0.113.9'))
  })

  test('distinguishes different clients', () => {
    expect(rateLimitKey('contact', '203.0.113.9')).not.toBe(rateLimitKey('contact', '198.51.100.4'))
  })

  test('an unknown client still produces a usable key', () => {
    expect(rateLimitKey('ebook', null)).toMatch(/^rl:ebook:[0-9a-f]{32}$/)
  })
})
