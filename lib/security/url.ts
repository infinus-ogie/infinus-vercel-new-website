/**
 * URL scheme validation for user-submitted links.
 *
 * ── Why Zod's `.url()` is not enough ────────────────────────────────────────────
 * `z.string().url()` asks only "does `new URL()` parse this", and `new URL()` parses far
 * more than a web address. All four of these are valid URLs by that definition:
 *
 *   javascript:alert(1)
 *   data:text/html,<script>alert(1)</script>
 *   file:///etc/passwd
 *   ftp://example.com/x
 *
 * The Careers LinkedIn value is rendered as the `href` of an anchor in the internal
 * application email. Escaping the value stops it breaking OUT of the attribute; it does
 * nothing about what the attribute then points at. Escaping is not scheme validation, and
 * treating it as such is how a `javascript:` href ends up in a colleague's inbox.
 *
 * ── The rule ────────────────────────────────────────────────────────────────────
 * HTTPS only, and a host must be present. Not an allowlist of domains: the field is a
 * convenience for a candidate and rejecting `rs.linkedin.com` or a personal profile page
 * would turn a security fix into a functional regression.
 *
 * ── Shared, and dependency-free on purpose ──────────────────────────────────────
 * The same rule has to hold on the client, where it produces a useful localised message
 * before submit, and on the server, which is the only place it is actually enforced. This
 * module imports nothing so either side can use it — the same reason
 * lib/security/fields.ts exists.
 */

/**
 * Is this a syntactically valid `https://` URL with a host?
 *
 * Returns false for every non-HTTPS scheme, for anything `new URL()` cannot parse, and for
 * an https URL with an empty host (`https:///path`).
 */
export function isHttpsWebUrl(value: string): boolean {
  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    return false
  }

  // Exact match, not `startsWith`: `https-evil:` would pass a prefix test.
  if (parsed.protocol !== 'https:') return false

  return parsed.hostname.length > 0
}
