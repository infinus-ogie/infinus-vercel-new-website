/**
 * reCAPTCHA v3 server-side verification.
 *
 * ── v3, and no library ──────────────────────────────────────────────────────────
 * v3 is invisible: it scores a request rather than asking the visitor to prove anything, so
 * it costs the approved form UX nothing. There is no wrapper package because there is
 * nothing to wrap — the whole protocol is one POST to Google with a token and a secret.
 *
 * ── Client-side success means nothing ───────────────────────────────────────────
 * A token from the browser is a claim, not a result. The only thing that establishes
 * anything is this call, made from the server with the secret, and the checks below on what
 * comes back. A caller that trusts `grecaptcha.execute` resolving has verified nothing.
 *
 * ── What is checked, and why each one ───────────────────────────────────────────
 *   token present    an absent token is a bot that did not bother, or a form that broke
 *   success          Google's own verdict on the token itself
 *   action           a token minted for `contact` must not be replayed against `ebook`;
 *                    without this check one harvested token opens every endpoint
 *   score            the actual bot signal, compared against a configurable floor
 *   hostname         the token was issued on a page we serve, where Google tells us
 *
 * ── FAIL CLOSED in production ───────────────────────────────────────────────────
 * If the secret is missing, a production deployment REJECTS public submissions. The
 * alternative — quietly accepting everything because an env var was forgotten — is how a
 * site ends up with no protection at all while its code says otherwise.
 *
 * Development and test are allowed through with a loud warning, so a contributor without
 * keys can still run the forms locally.
 */

/** Google's verification endpoint. */
const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'

/** Used when RECAPTCHA_MIN_SCORE is unset or unparseable. Google's own suggested default. */
const DEFAULT_MIN_SCORE = 0.5

/** The action names each protected surface mints its token under. */
export const RECAPTCHA_ACTIONS = {
  /** The Contact page and the homepage short business form — the same kind of enquiry. */
  contact: 'contact',
  careers: 'careers',
  ebook: 'ebook',
} as const

export type RecaptchaAction = (typeof RECAPTCHA_ACTIONS)[keyof typeof RECAPTCHA_ACTIONS]

/**
 * Why a verification failed.
 *
 * Kept as a coarse enum on purpose: it is for the SERVER LOG and for choosing a status code.
 * None of it reaches the client — see the note on the response shape in lib/security/guard.ts.
 */
export type RecaptchaFailure =
  | 'missing-secret'
  | 'missing-token'
  | 'verification-unavailable'
  | 'rejected'
  | 'wrong-action'
  | 'low-score'
  | 'wrong-hostname'

export type RecaptchaResult =
  | { ok: true; score: number | null; skipped: boolean }
  | { ok: false; reason: RecaptchaFailure; detail?: string }

/** The shape Google returns. Every field is optional because a v2 secret returns fewer. */
interface SiteVerifyResponse {
  success?: boolean
  score?: number
  action?: string
  hostname?: string
  challenge_ts?: string
  'error-codes'?: string[]
}

/**
 * Is this a deployed environment, where a missing secret must be fatal?
 *
 * `NODE_ENV === 'production'` covers both a Vercel Production and a Vercel Preview build,
 * which is what we want: a Preview with no keys should refuse submissions rather than
 * silently accept them and give false confidence during QA.
 */
function isDeployed(): boolean {
  return process.env.NODE_ENV === 'production'
}

/** The configured score floor, or the default when unset/invalid. */
export function minimumScore(): number {
  const raw = process.env.RECAPTCHA_MIN_SCORE
  if (!raw) return DEFAULT_MIN_SCORE
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) return DEFAULT_MIN_SCORE
  return parsed
}

/**
 * Verify a token against Google.
 *
 * `expectedHostnames` is optional: Google reports the hostname the token was issued on, and
 * comparing it is only meaningful when we know what to expect. On Preview the host changes
 * per deployment, so callers pass the request's own host rather than a hardcoded list.
 */
export async function verifyRecaptcha({
  token,
  action,
  ip,
  expectedHostnames,
}: {
  token: string | null | undefined
  action: RecaptchaAction
  ip?: string | null
  expectedHostnames?: readonly string[]
}): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY

  if (!secret) {
    if (isDeployed()) {
      // FAIL CLOSED. A deployment without a secret is misconfigured, and the honest
      // response to "I cannot tell whether this is a bot" is to refuse.
      console.error('[security] RECAPTCHA_SECRET_KEY is not set — rejecting public submission')
      return { ok: false, reason: 'missing-secret' }
    }
    console.warn('[security] RECAPTCHA_SECRET_KEY is not set — captcha SKIPPED (development only)')
    return { ok: true, score: null, skipped: true }
  }

  if (!token) return { ok: false, reason: 'missing-token' }

  let data: SiteVerifyResponse
  try {
    const body = new URLSearchParams({ secret, response: token })
    // Google accepts the client IP as a corroborating signal. Optional, and never logged.
    if (ip) body.set('remoteip', ip)

    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      // Do not let a slow verifier hold a serverless function open indefinitely.
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      return { ok: false, reason: 'verification-unavailable', detail: `HTTP ${response.status}` }
    }
    data = (await response.json()) as SiteVerifyResponse
  } catch (error) {
    // Network failure or malformed JSON. We could not verify, so we did not verify.
    return {
      ok: false,
      reason: 'verification-unavailable',
      detail: error instanceof Error ? error.message : 'unknown',
    }
  }

  if (data.success !== true) {
    return { ok: false, reason: 'rejected', detail: (data['error-codes'] ?? []).join(',') }
  }

  // A token is minted for one action. Accepting any action would let a token harvested from
  // the contact form be replayed against the e-book endpoint, which is the one that emails
  // strangers.
  if (typeof data.action === 'string' && data.action !== action) {
    return { ok: false, reason: 'wrong-action', detail: data.action }
  }

  if (expectedHostnames && expectedHostnames.length > 0 && typeof data.hostname === 'string') {
    // Google reports "localhost" for local keys; the caller decides what to expect.
    if (!expectedHostnames.includes(data.hostname)) {
      return { ok: false, reason: 'wrong-hostname', detail: data.hostname }
    }
  }

  // v3 always returns a score. A v2 secret does not, and there is nothing to compare — the
  // `success` above is the whole verdict in that case.
  if (typeof data.score === 'number') {
    if (data.score < minimumScore()) {
      return { ok: false, reason: 'low-score', detail: String(data.score) }
    }
    return { ok: true, score: data.score, skipped: false }
  }

  return { ok: true, score: null, skipped: false }
}
