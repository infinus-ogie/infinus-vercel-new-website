/**
 * TEMPORARY security-enforcement switches.
 *
 * ── Why this file exists ────────────────────────────────────────────────────────
 * A single place to turn one control off, so turning it back on is one edit rather than an
 * archaeology exercise across routes, forms and hooks. Nothing here deletes an implementation:
 * every reCAPTCHA module, helper and test stays exactly where it is and works the moment this
 * flips back to `true`.
 *
 * It is a build-time constant rather than an env var on purpose. An env var would mean the
 * enforcement state depends on deployment configuration that can be missing, mistyped or
 * silently different between Preview and Production - which is the class of problem this
 * switch exists to escape. A constant is visible in the diff, reviewable, and identical
 * everywhere the code runs.
 */

/**
 * TEMPORARY: reCAPTCHA enforcement disabled by owner until post-vacation security setup.
 * Re-enable before final security sign-off.
 *
 * While this is `false`:
 *   · the client does not load the Google script and does not mint a token
 *   · the server does not call Google and does not reject a submission for a missing token,
 *     missing secret, missing action or missing score
 *
 * Every OTHER control is untouched and still runs: honeypot, same-origin, Zod validation,
 * field-length limits, HTML escaping, fixed recipient lists, and the upload MIME/extension/
 * signature checks. See docs/FORMS-SECURITY.md for the current, honest posture.
 *
 * Durable rate limiting remains BLOCKED ON INFRA and is unrelated to this switch.
 */
export const RECAPTCHA_ENFORCEMENT_ENABLED = false
