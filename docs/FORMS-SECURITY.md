# Forms security

> ## ⚠ reCAPTCHA enforcement is TEMPORARILY DISABLED
>
> `RECAPTCHA_ENFORCEMENT_ENABLED` in `lib/security/enforcement.ts` is `false`, on the owner's
> decision, for roughly ten days while they are on vacation.
>
> **What that means right now**
>
> * no Google script is loaded, no token is minted, no verification request is made
> * `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` are **not required** on
>   localhost, Preview or Production
> * forms submit normally on a deployment with no captcha configuration at all
> * the implementation is fully intact and re-enables with one edit
>
> **What still protects the endpoints:** honeypot, same-origin, Zod validation, field-length
> ceilings, HTML escaping, fixed recipient lists, and the upload MIME / extension / signature
> checks. All unchanged.
>
> **What does not:** reCAPTCHA (this switch) and durable rate limiting (BLOCKED ON INFRA,
> unrelated). Treat the current posture as *reduced*, not complete.
>
> The Privacy Policy's reCAPTCHA disclosure has been withdrawn for the same period, because
> it would otherwise describe processing that is not happening. The wording is preserved in
> `RECAPTCHA_PRIVACY_DISCLOSURE` and must be restored in the same edit that re-enables
> enforcement. See the post-vacation checklist at the end of this document.

What protects the public submission endpoints, what does not yet, and exactly what has to be
configured before a Preview is usable for form QA.

## Required environment variables

| Variable | Where | Required | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Client | **Not while disabled** | Mints the reCAPTCHA v3 token. Public by design. |
| `RECAPTCHA_SECRET_KEY` | **Server only** | **Not while disabled** | Verifies the token with Google. |
| `RECAPTCHA_MIN_SCORE` | Server only | No | Score floor, `0`–`1`. Defaults to `0.5`. |

While `RECAPTCHA_ENFORCEMENT_ENABLED` is `false`, none of the three is read and none is
required. The "Yes" in that column returns when enforcement does.

`RECAPTCHA_SECRET_KEY` must never carry the `NEXT_PUBLIC_` prefix — that prefix is what
inlines a value into the client bundle. It is never logged and never returned by an API.

### Fail-closed behaviour (suspended while enforcement is off)

The rest of this section describes behaviour that resumes when the switch is `true`. Right now
`verifyRecaptcha()` returns a skipped pass before reading any of it.

With `NODE_ENV=production` — which is both Vercel Production **and** Vercel Preview — a
missing `RECAPTCHA_SECRET_KEY` causes every public submission to be **rejected**. A
deployment that forgot the variable refuses forms rather than silently accepting everything.

In development and test, a missing secret **skips** the captcha with a warning, so the forms
work locally without keys.

**A Preview must therefore have both keys set before form QA**, or every form will fail —
*once enforcement is back on*. While it is off, a Preview needs no captcha keys and forms work.

### Getting the keys

reCAPTCHA v3 keys, from the Google admin console. The site must be registered for every
domain that will serve the forms: the production domain, and `vercel.app` if Preview QA is
expected to exercise them. `localhost` is included automatically for local development keys.

## What is active

| Layer | Status |
|---|---|
| reCAPTCHA v3, verified server-side | **TEMPORARILY DISABLED** — see the banner |
| Honeypot | Active |
| Same-origin | Active |
| Input length ceilings | Active |
| File type / size / signature validation | Active |
| Email HTML escaping | Active |
| Response hygiene | Active |
| **Durable rate limiting** | **NOT ACTIVE — see below** |

## Rate limiting is BLOCKED ON INFRA

There is no durable store in this project: no Vercel KV, no Upstash, no Redis. On Vercel's
serverless runtime an in-memory counter resets per instance, so it would enforce a limit by
luck while making the code look protective. `lib/security/rate-limit.ts` therefore refuses to
pretend: with no backend it returns `enforced: false`, and `rateLimitStatus()` reports
`active: false`.

The budgets, the pseudonymised key derivation and the single call site are all in place.

Budgets that would apply, per IP:

| Endpoint | Budget |
|---|---|
| `/api/contact` | 5 / 10 min |
| `/api/join-team` | 3 / 15 min |
| `/api/ebook` | 5 / 10 min |

Until a backend exists, the site is **not rate-limited**, and no report should say otherwise.

### What enabling it takes

Two things: credentials, and an adapter. Nothing else — no endpoint changes, no schema, no
migration. The guard already calls `consumeRateLimit()` on every submission.

**Recommended store: Upstash Redis.** It is the serverless-appropriate choice here because it
speaks HTTP rather than the Redis wire protocol, so it needs no connection pooling and no
persistent socket — which is exactly what a per-invocation serverless function cannot keep.
Vercel KV is the same product under Vercel's own branding and works identically. A
self-managed Redis over TCP is the option to avoid: connection churn per invocation is the
failure mode serverless Redis exists to solve.

**Env contract** — add whichever pair the provider gives you:

| Variable | Provider | Notes |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Upstash | Server-only. Never `NEXT_PUBLIC_`. |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash | Server-only. Never `NEXT_PUBLIC_`. |
| `KV_REST_API_URL` | Vercel KV | The same two values under Vercel's names. |
| `KV_REST_API_TOKEN` | Vercel KV | |

Vercel's KV integration injects its pair automatically when the store is linked to the
project; Upstash's are copied from its console.

**The adapter.** `resolveBackend()` in `lib/security/rate-limit.ts` currently returns `null`.
Replace that with the following. It uses Upstash's REST API directly, so it adds **no
dependency**:

```ts
function resolveBackend(): RateLimitBackend | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  if (!url || !token) return null

  return {
    name: 'upstash-redis',
    async hit(key, limit, windowSeconds) {
      // INCR then EXPIRE ... NX: the first hit in a window starts the clock, later hits in
      // the same window leave it alone, so the window is fixed rather than sliding forward
      // on every request. Pipelined into one round-trip.
      const response = await fetch(`${url}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, String(windowSeconds), 'NX'],
        ]),
        signal: AbortSignal.timeout(3000),
      })

      if (!response.ok) throw new Error(`rate-limit store HTTP ${response.status}`)

      const [incr] = (await response.json()) as Array<{ result: number }>
      return { allowed: incr.result <= limit }
    },
  }
}
```

That is the whole change. `rateLimitStatus()` then reports `active: true` on its own, because
it asks `resolveBackend()` rather than being told.

**Fail-honest either way.** With no credentials the adapter returns `null` and the status
stays `BLOCKED ON INFRA`. If the store is configured but unreachable, `consumeRateLimit()`
catches, logs, and allows the request through with `enforced: false` — a store outage must not
take the forms down, and the captcha and origin checks are still in force.

## Privacy consequence to record

Submitting a public form contacts `google.com` to mint and verify a reCAPTCHA token — **but
not while enforcement is disabled**, during which no request reaches Google and the Privacy
Policy disclosure is withdrawn to match.
That is a functional security dependency, not analytics, and it is deliberately **not** behind
the cookie-consent gate: putting it there would mean "decline cookies" also means "the form
stops working".

The script is injected only when a form is actually submitted, so it never appears in
prerendered HTML and never loads for a visitor who does not use a form. That keeps
`scripts/seo/assert-consent-safety.ts` green.

**The Privacy Policy now discloses this.** One paragraph was added to section 2 of BOTH
legal documents — `content/legal/politika-privatnosti.ts` — on the owner's instruction. That
file is otherwise mechanically transcribed approved copy, so the addition is marked in its
header and is **flagged for Dejan's legal review**. It states the fact and nothing more: no
consent language, and no suggestion that reCAPTCHA is analytics.

## QA safety

`npm run qa:ga` used to default to `BASE_URL=https://www.infinus.co`, so the bare command
drove a browser against live production — granting consent there, clicking downloads, and
reporting production's state as if it were the branch under test. It now defaults to
`http://localhost:3000`, matching `viewport-audit.mjs` and `link-and-locale-audit.mjs`, and
warns loudly when pointed at a non-local origin. Hitting production is still supported; it
just has to be asked for:

```
BASE_URL=https://www.infinus.co npm run qa:ga
```

`test/security/hardening.test.ts` asserts the fallback can never become a remote origin
again.

## Deliberately not done in this pass

- `/api/projectpulse/pdf` is a `GET` that streams a static file with no user input. It is a
  download, not a write, and is left alone.
- Existing operational recipients (`PRODUCTION_EMAIL`, `RECIPIENT_EMAILS`) are unchanged.
- `/vi-debug` is left in code as it is. It already returns 404 unless
  `NEXT_PUBLIC_DNB_VI_DEBUG === "true"`, and everything it reports is a `NEXT_PUBLIC_*` value
  that is in the client bundle anyway — so there is nothing to fix in the handler. It is
  currently ENABLED in Production, which is untidy rather than dangerous.
  **Manual action, Vercel Production scope: unset `NEXT_PUBLIC_DNB_VI_DEBUG`** so the route
  returns 404 there. Deliberately not solved in code: gating a debug endpoint on a hardcoded
  environment check would remove the operator's ability to turn it on when they need it.

## POST-VACATION SECURITY TODO

Not done tonight, deliberately. All of it belongs to one pass:

1. Re-enable the shared switch: `RECAPTCHA_ENFORCEMENT_ENABLED = true` in
   `lib/security/enforcement.ts`.
2. Create / configure the real Google reCAPTCHA v3 property, registered for the production
   domain and `vercel.app`.
3. Set the keys on Preview **and** Production:
   * `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   * `RECAPTCHA_SECRET_KEY`
4. Restore the Privacy Policy disclosure from `RECAPTCHA_PRIVACY_DISCLOSURE`
   (`content/legal/politika-privatnosti.ts`) into section 2 of both documents, in the same
   edit as step 1. `test/security/hardening.test.ts` fails if one is done without the other.
5. Enable durable serverless rate limiting (Redis / Vercel KV / Upstash) and lift
   `BLOCKED ON INFRA`.
6. Remove the temporary captcha-disabled state: the banner above, the `vi.mock` pins in
   `test/security/recaptcha.test.ts` and `guard.test.ts`, and
   `test/security/recaptcha-disabled.test.ts`.
7. Re-run the full forms and security QA before final security sign-off.
