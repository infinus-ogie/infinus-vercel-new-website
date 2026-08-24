import { NextResponse, type NextRequest } from 'next/server'
import { checkSameOrigin, expectedRecaptchaHostnames } from './origin'
import { verifyRecaptcha, type RecaptchaAction } from './recaptcha'
import { consumeRateLimit, clientIp, type RateLimitKind } from './rate-limit'
import { HONEYPOT_FIELD, RECAPTCHA_FIELD } from './fields'

/**
 * The one gate every public form endpoint passes through.
 *
 * ── Layered, and ordered cheapest-first ─────────────────────────────────────────
 *   1. honeypot     free, local, catches naive bots
 *   2. same-origin  free, local, catches another site's JavaScript
 *   3. rate limit   a store lookup (when one exists)
 *   4. captcha      a network round-trip to Google — last, so the cheap checks
 *                   reject obvious junk without paying for it
 *
 * No layer is sufficient alone. The honeypot is trivially bypassed by anything that reads
 * the DOM; same-origin does nothing against curl; the captcha is a score, not a verdict.
 * They fail independently, which is the point.
 *
 * ── Failing means NOTHING happens ───────────────────────────────────────────────
 * A caller that gets a `Response` back must return it immediately and perform no work: no
 * internal email, no delivery email, no upload, no generation. That is the actual security
 * property — a rejected request must not be able to make the server do anything expensive or
 * outbound. Every endpoint calls this before it touches `lib/email.ts`.
 *
 * ── The response says nothing useful ────────────────────────────────────────────
 * One generic message and one status code, whichever layer rejected. No score, no Google
 * error codes, no hostname, no mention that a honeypot exists. Anything more is a tuning
 * signal handed to whoever is probing; the detail goes to the server log instead.
 */

// The field names live in their own dependency-free module so client components can import
// them without dragging this file's server imports — and `node:crypto` — into the bundle.
// Re-exported here so server-side callers have one place to look.
export { HONEYPOT_FIELD, RECAPTCHA_FIELD } from './fields'

/** What the client is told. Deliberately identical for every rejection reason. */
const GENERIC_REJECTION = 'We could not process this submission. Please try again.'

export type GuardOutcome =
  /** Everything passed. `captchaSkipped` is true only in local development. */
  | { ok: true; captchaSkipped: boolean }
  /** Rejected. Return `response` and do nothing else. */
  | { ok: false; response: NextResponse; reason: string }

function reject(status: number, reason: string): GuardOutcome {
  return {
    ok: false,
    reason,
    response: NextResponse.json({ success: false, message: GENERIC_REJECTION }, { status }),
  }
}

/**
 * Run every abuse check for one submission.
 *
 * `action` and `rateLimitKind` are separate parameters because they are separate concepts:
 * the captcha action is what the token was minted for, and the rate-limit kind is which
 * budget this endpoint draws from. Today they happen to line up.
 */
export async function guardFormRequest({
  request,
  formData,
  action,
  rateLimitKind,
}: {
  request: NextRequest
  formData: FormData
  action: RecaptchaAction
  rateLimitKind: RateLimitKind
}): Promise<GuardOutcome> {
  // ── 1. Honeypot ────────────────────────────────────────────────────────────
  // A real visitor never sees this field, so anything in it came from something filling
  // the form by field name. Rejected with the same generic message as everything else:
  // telling a bot which check caught it is telling it how to pass next time.
  const honeypot = formData.get(HONEYPOT_FIELD)
  if (typeof honeypot === 'string' && honeypot.trim().length > 0) {
    console.warn('[security] honeypot triggered', { action })
    return reject(400, 'honeypot')
  }

  // ── 2. Same origin ─────────────────────────────────────────────────────────
  const origin = checkSameOrigin(request)
  if (!origin.ok) {
    console.warn('[security] cross-origin submission rejected', {
      action,
      origin: origin.origin,
      expected: origin.expected,
    })
    return reject(403, 'cross-origin')
  }

  // ── 3. Rate limit ──────────────────────────────────────────────────────────
  // `enforced: false` means no durable store is configured and nothing was checked. It is
  // NOT a pass — see lib/security/rate-limit.ts.
  const rate = await consumeRateLimit(rateLimitKind, request)
  if (!rate.allowed) {
    console.warn('[security] rate limit exceeded', { action })
    return reject(429, 'rate-limited')
  }

  // ── 4. reCAPTCHA ───────────────────────────────────────────────────────────
  const token = formData.get(RECAPTCHA_FIELD)
  const captcha = await verifyRecaptcha({
    token: typeof token === 'string' ? token : null,
    action,
    ip: clientIp(request),
    expectedHostnames: expectedRecaptchaHostnames(request),
  })

  if (!captcha.ok) {
    // The reason and any detail are logged, never returned. `detail` can carry Google's raw
    // error codes and the token's hostname; neither is the client's business.
    console.warn('[security] captcha rejected', { action, reason: captcha.reason })
    const status = captcha.reason === 'verification-unavailable' ? 503 : 400
    return reject(status, `captcha:${captcha.reason}`)
  }

  return { ok: true, captchaSkipped: captcha.skipped }
}
