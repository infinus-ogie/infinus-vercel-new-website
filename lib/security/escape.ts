/**
 * HTML escaping for values that reach an email body.
 *
 * ── Why this is its own module ──────────────────────────────────────────────────
 * Every email template on this site interpolates submitted values straight into HTML. Most
 * of them go to the Infinus inbox, so the blast radius was "an ugly internal email" — but
 * "the recipient is a colleague" is not a security control, and one template (the e-book
 * delivery) is addressed to a member of the public.
 *
 * One escaping strategy, applied at every interpolation point, is the only version of this
 * that stays true as templates change. A per-template judgement call about which fields are
 * "safe enough" is the version that rots.
 *
 * ── What this does NOT do ───────────────────────────────────────────────────────
 * It is not a sanitiser and does not try to be. It escapes the five characters that let a
 * value break out of HTML text or an attribute value. User HTML is never rendered as HTML —
 * it is shown as the literal text the person typed, which is what the reader of a contact
 * form actually wants to see.
 */

/** Escape a value for interpolation into HTML text or a quoted attribute. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Escape a multi-line value and preserve its line breaks as <br>.
 *
 * The order matters and is easy to get wrong: escape FIRST, then insert the `<br>` tags.
 * Doing it the other way round — the pattern the old templates used, `.replace(/\n/g, '<br>')`
 * on raw input — inserts real markup and then has nothing left that can safely escape the
 * rest, because escaping afterwards would neutralise the breaks too.
 */
export function escapeHtmlMultiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, '<br>')
}

/**
 * Escape a value for a plain-text email body.
 *
 * A no-op on the characters themselves — there is no markup to break out of — but it strips
 * CR and LF, which are the header-injection vector in any field that could reach a header.
 * Applied to short fields, never to the message body, which is allowed to have newlines.
 */
export function stripNewlines(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim()
}
