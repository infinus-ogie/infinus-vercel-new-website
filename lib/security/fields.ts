/**
 * The two form field names shared by the client and the server.
 *
 * ── Why these are not in guard.ts ───────────────────────────────────────────────
 * They were, and it broke the build. `guard.ts` imports the rate limiter, which imports
 * `node:crypto`; the four form components import these constants; so a client bundle ended
 * up trying to resolve a Node built-in.
 *
 * Splitting them out is the fix and also the correct boundary: these are shared VOCABULARY —
 * the names both halves must agree on — not server logic. Nothing in this file imports
 * anything, which is what makes it safe for either side.
 *
 * Both are API keys and are therefore never translated.
 */

/**
 * The honeypot field's name.
 *
 * Chosen to look worth filling in to a bot that autofills by name, while meaning nothing to
 * the real form. See components/security/HoneypotField.tsx for how it is hidden.
 */
export const HONEYPOT_FIELD = 'company_website'

/** The field carrying the reCAPTCHA token. */
export const RECAPTCHA_FIELD = 'recaptcha_token'
