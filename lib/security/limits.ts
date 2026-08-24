/**
 * Server-side length ceilings for every public form field.
 *
 * ── Why these exist ─────────────────────────────────────────────────────────────
 * The client-side Zod schemas check that fields are LONG ENOUGH. Nothing checked that they
 * were short enough, in either direction, which means a POST could carry a several-megabyte
 * "name" — into a Zod parse, into an email template, into a string concatenation, and into
 * a message that some mail server then has to accept or reject.
 *
 * These are deliberately generous. The point is to stop payload abuse, not to make a real
 * submission annoying: 200 characters of company name is a lot of company name, and a
 * 5,000-character message is a long enquiry but a plausible one.
 *
 * ── One place, on purpose ───────────────────────────────────────────────────────
 * Every public endpoint imports from here rather than declaring its own numbers, so "what is
 * the maximum message length" has one answer that can be checked and changed once.
 */
export const FIELD_LIMITS = {
  /** Personal or full name. */
  name: 120,
  /** RFC 5321 caps a full address at 254 octets; there is no reason to accept more. */
  email: 254,
  phone: 40,
  company: 200,
  country: 100,
  /** Job title / role. */
  role: 150,
  subject: 200,
  /** The one genuinely long field. */
  message: 5000,
  /** A URL, so longer than a name but nowhere near unbounded. */
  linkedin: 500,
  /** Campaign attribution values. Short by nature; long ones are someone probing. */
  utm: 120,
  /** Uploaded filename, before sanitisation. */
  filename: 255,
} as const

/** Attachment ceilings, per endpoint's approved UI copy. */
export const FILE_LIMITS = {
  /** The Contact page's own hint says "max 10MB". */
  contactBytes: 10 * 1024 * 1024,
  /** The Careers form's own hint says "max 5MB". */
  careersBytes: 5 * 1024 * 1024,
} as const
