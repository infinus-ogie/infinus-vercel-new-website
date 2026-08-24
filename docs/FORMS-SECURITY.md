# Forms security

What protects the public submission endpoints, what does not yet, and exactly what has to be
configured before a Preview is usable for form QA.

## Required environment variables

| Variable | Where | Required | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Client | Yes | Mints the reCAPTCHA v3 token. Public by design. |
| `RECAPTCHA_SECRET_KEY` | **Server only** | Yes | Verifies the token with Google. |
| `RECAPTCHA_MIN_SCORE` | Server only | No | Score floor, `0`–`1`. Defaults to `0.5`. |

`RECAPTCHA_SECRET_KEY` must never carry the `NEXT_PUBLIC_` prefix — that prefix is what
inlines a value into the client bundle. It is never logged and never returned by an API.

### Fail-closed behaviour

With `NODE_ENV=production` — which is both Vercel Production **and** Vercel Preview — a
missing `RECAPTCHA_SECRET_KEY` causes every public submission to be **rejected**. A
deployment that forgot the variable refuses forms rather than silently accepting everything.

In development and test, a missing secret **skips** the captcha with a warning, so the forms
work locally without keys.

**A Preview must therefore have both keys set before form QA**, or every form will fail.

### Getting the keys

reCAPTCHA v3 keys, from the Google admin console. The site must be registered for every
domain that will serve the forms: the production domain, and `vercel.app` if Preview QA is
expected to exercise them. `localhost` is included automatically for local development keys.

## What is active

| Layer | Status |
|---|---|
| reCAPTCHA v3, verified server-side | Active once keys are set |
| Honeypot | Active |
| Same-origin | Active |
| Input length ceilings | Active |
| File type / size / signature validation | Active |
| Email HTML escaping | Active |
| Response hygiene | Active |
| **Durable rate limiting** | **NOT ACTIVE — see below** |

## Rate limiting is BLOCKED ON INFRASTRUCTURE

There is no durable store in this project: no Vercel KV, no Upstash, no Redis. On Vercel's
serverless runtime an in-memory counter resets per instance, so it would enforce a limit by
luck while making the code look protective. `lib/security/rate-limit.ts` therefore refuses to
pretend: with no backend it returns `enforced: false`, and `rateLimitStatus()` reports
`active: false`.

The budgets, the pseudonymised key derivation and the single call site are all in place.
Enabling it means implementing `RateLimitBackend` against whichever store is provisioned and
returning it from `resolveBackend()` — roughly twenty lines, and no endpoint changes.

Budgets that would apply, per IP:

| Endpoint | Budget |
|---|---|
| `/api/contact` | 5 / 10 min |
| `/api/join-team` | 3 / 15 min |
| `/api/ebook` | 5 / 10 min |

Until then, the site is **not rate-limited**, and no report should say otherwise.

## Privacy consequence to record

Submitting any public form now contacts `google.com` to mint and verify a reCAPTCHA token.
That is a functional security dependency, not analytics, and it is deliberately **not** behind
the cookie-consent gate: putting it there would mean "decline cookies" also means "the form
stops working".

The script is injected only when a form is actually submitted, so it never appears in
prerendered HTML and never loads for a visitor who does not use a form. That keeps
`scripts/seo/assert-consent-safety.ts` green.

**The Privacy Policy should mention that form submissions are processed through Google
reCAPTCHA.** That is a content change for the owner, not a code change.

## Deliberately not done in this pass

- `/api/projectpulse/pdf` is a `GET` that streams a static file with no user input. It is a
  download, not a write, and is left alone.
- Existing operational recipients (`PRODUCTION_EMAIL`, `RECIPIENT_EMAILS`) are unchanged.
