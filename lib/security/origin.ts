import type { NextRequest } from 'next/server'

/**
 * Same-origin validation for public write endpoints.
 *
 * ── This is defence in depth, not authentication ────────────────────────────────
 * `Origin` is set by the browser and cannot be forged BY A PAGE, which is exactly the attack
 * it stops: some other site's JavaScript POSTing to these endpoints on a visitor's behalf.
 * It stops nothing at all from curl, and it is not meant to — that is what the captcha and
 * the rate limit are for. Three weak-ish layers that fail independently beat one that has to
 * be perfect.
 *
 * ── Why the expected host is DERIVED, never hardcoded ───────────────────────────
 * Hardcoding `www.infinus.co` would break every Vercel Preview, which is where this gets
 * QA'd — and a check that has to be disabled to test the thing it protects gets disabled
 * permanently. So the request's own host is the expectation: a form served from
 * `xyz.vercel.app` may POST to `xyz.vercel.app`, and a form served from production may POST
 * to production, with no list to maintain.
 *
 * ── Requests with no Origin ─────────────────────────────────────────────────────
 * ACCEPTED. A missing Origin is not evidence of anything: some browsers omit it on
 * same-origin POSTs, and privacy tooling strips it. Rejecting on absence would break real
 * submissions to catch an attacker who can simply omit the header anyway.
 */

/** The host this request was actually served through, preferring the proxy's view. */
export function requestHost(request: NextRequest): string | null {
  // Vercel sets x-forwarded-host on the edge; `host` is the direct one.
  const forwarded = request.headers.get('x-forwarded-host')
  if (forwarded) return forwarded.split(',')[0].trim().toLowerCase()

  const host = request.headers.get('host')
  return host ? host.trim().toLowerCase() : null
}

/** The hostname (no port) of a URL-ish header value, or null if it will not parse. */
function hostnameOf(value: string): string | null {
  try {
    return new URL(value).host.toLowerCase()
  } catch {
    return null
  }
}

export type OriginResult =
  | { ok: true; reason: 'same-origin' | 'no-origin-header' }
  | { ok: false; origin: string; expected: string }

/**
 * Is this POST plausibly from a page we served?
 *
 * Compares `Origin` — falling back to `Referer` — against the request's own host.
 */
export function checkSameOrigin(request: NextRequest): OriginResult {
  const expected = requestHost(request)

  // Without a host header there is nothing to compare against; do not invent a failure.
  if (!expected) return { ok: true, reason: 'no-origin-header' }

  const originHeader = request.headers.get('origin')
  const refererHeader = request.headers.get('referer')

  const candidate = originHeader
    ? hostnameOf(originHeader)
    : refererHeader
      ? hostnameOf(refererHeader)
      : null

  // See the note above: absence is not evidence.
  if (!candidate) return { ok: true, reason: 'no-origin-header' }

  if (candidate === expected) return { ok: true, reason: 'same-origin' }

  return { ok: false, origin: candidate, expected }
}

/**
 * The hostnames a reCAPTCHA token may legitimately have been issued on.
 *
 * Derived from the request for the same reason the origin check is: Preview hosts are not
 * knowable ahead of time. `localhost` is included so local keys, which Google issues against
 * it, verify during development.
 */
export function expectedRecaptchaHostnames(request: NextRequest): string[] {
  const host = requestHost(request)
  if (!host) return []
  // Google reports the hostname WITHOUT the port.
  const withoutPort = host.split(':')[0]
  return [withoutPort, 'localhost']
}
