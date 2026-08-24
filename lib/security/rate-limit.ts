import type { NextRequest } from 'next/server'
import { createHash } from 'node:crypto'

/**
 * Rate limiting — the abstraction, and an honest account of what it currently does.
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  STATUS: NOT ACTIVE. There is no durable store configured, so nothing here     ║
 * ║  rate-limits anything yet. `rateLimitStatus()` reports that, and the security   ║
 * ║  report must say "BLOCKED ON INFRA" rather than "protected".                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ── Why there is no in-memory fallback ──────────────────────────────────────────
 * The tempting version of this file is a module-level `Map` of IP -> timestamps. On Vercel
 * that is worse than nothing: every serverless invocation may get a fresh instance, so the
 * counter resets constantly and the limit is enforced by luck. It would pass its own unit
 * tests, look protective in review, and stop no real attacker — while letting everyone
 * downstream believe the endpoints are limited.
 *
 * A control that cannot survive multiple instances must not be described as a control. So
 * this module refuses to pretend: with no backend it returns `allowed` and says so.
 *
 * ── What is here instead ────────────────────────────────────────────────────────
 * The whole shape of the real thing: per-endpoint budgets, a pseudonymised identifier, and
 * one call site in the shared guard. Turning it on is implementing `RateLimitBackend`
 * against whatever store gets provisioned (Vercel KV and Upstash Redis are both a
 * ~20-line adapter) and returning it from `resolveBackend()`. No endpoint changes.
 */

/** Per-endpoint budgets. Conservative: a real person does not submit five CVs an hour. */
export const RATE_LIMITS = {
  contact: { limit: 5, windowSeconds: 10 * 60 },
  careers: { limit: 3, windowSeconds: 15 * 60 },
  /** The most abuse-sensitive: it emails a user-supplied address. */
  ebook: { limit: 5, windowSeconds: 10 * 60 },
} as const

export type RateLimitKind = keyof typeof RATE_LIMITS

export interface RateLimitBackend {
  /** Name for the status report. */
  readonly name: string
  /** Increment the counter for `key` and report whether it is now over budget. */
  hit(key: string, limit: number, windowSeconds: number): Promise<{ allowed: boolean }>
}

/**
 * The backend, or null when none is configured.
 *
 * Reads env rather than importing a client, so no unused SDK ends up in the bundle and the
 * absence of credentials is not a build error.
 */
function resolveBackend(): RateLimitBackend | null {
  // Deliberately empty. When a durable store is provisioned, construct and return its
  // adapter here — see this file's header for what that involves.
  return null
}

export type RateLimitStatus =
  | { active: true; backend: string }
  | { active: false; reason: 'no-durable-backend-configured' }

/** What the security report should say about rate limiting, computed rather than claimed. */
export function rateLimitStatus(): RateLimitStatus {
  const backend = resolveBackend()
  return backend
    ? { active: true, backend: backend.name }
    : { active: false, reason: 'no-durable-backend-configured' }
}

/**
 * The client IP, from the headers a proxy in front of us controls.
 *
 * `x-forwarded-for` is a comma-separated chain and the FIRST entry is the client. It is
 * trivially spoofable when nothing trusted sets it — which is another reason this is one
 * layer rather than the layer.
 */
export function clientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0].trim()
    if (first) return first
  }
  return request.headers.get('x-real-ip')
}

/**
 * A stable, non-reversible identifier for a client.
 *
 * The IP is hashed before it becomes a storage key, so the rate-limit store holds no
 * addresses — only opaque digests that answer "have I seen this one" without recording who.
 * It is scoped per endpoint so a contact submission does not consume the e-book budget.
 */
export function rateLimitKey(kind: RateLimitKind, ip: string | null): string {
  const subject = ip ?? 'unknown'
  const digest = createHash('sha256').update(`${kind}:${subject}`).digest('hex').slice(0, 32)
  return `rl:${kind}:${digest}`
}

export type RateLimitResult =
  | { allowed: true; enforced: boolean }
  | { allowed: false; enforced: true }

/**
 * Consume one unit of an endpoint's budget.
 *
 * `enforced: false` means no backend was configured and NOTHING was checked. Callers must
 * not read `allowed: true` as evidence of protection — see `rateLimitStatus()`.
 */
export async function consumeRateLimit(
  kind: RateLimitKind,
  request: NextRequest
): Promise<RateLimitResult> {
  const backend = resolveBackend()
  if (!backend) return { allowed: true, enforced: false }

  const { limit, windowSeconds } = RATE_LIMITS[kind]
  const key = rateLimitKey(kind, clientIp(request))

  try {
    const { allowed } = await backend.hit(key, limit, windowSeconds)
    return allowed ? { allowed: true, enforced: true } : { allowed: false, enforced: true }
  } catch (error) {
    // A store outage must not take the forms down with it. Logged, and allowed through:
    // the captcha and origin checks are still in force.
    console.error('[security] rate-limit backend failed; allowing request', error)
    return { allowed: true, enforced: false }
  }
}
