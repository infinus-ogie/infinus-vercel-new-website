/**
 * @vitest-environment node
 *
 * The remaining hardening gaps, closed.
 *
 * Each block here corresponds to a finding that the previous security pass reported as
 * PARTIAL or OPTIONAL rather than fixing. They are grouped in one file because they share
 * nothing except their origin — a report that said "not done yet" and now must not regress.
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { isHttpsWebUrl } from '@/lib/security/url'
import { PRIVACY_POLICY_DOCUMENTS, type LegalBlock } from '@/content/legal/politika-privatnosti'

// ──────────────────────────────────────────────────────────────────────────────
// 1. LinkedIn: HTTPS web URLs only
// ──────────────────────────────────────────────────────────────────────────────

describe('the LinkedIn URL rule', () => {
  test('accepts an ordinary https LinkedIn profile', () => {
    expect(isHttpsWebUrl('https://www.linkedin.com/in/example')).toBe(true)
  })

  test('accepts a regional LinkedIn host — this is not a domain allowlist', () => {
    expect(isHttpsWebUrl('https://rs.linkedin.com/in/example')).toBe(true)
  })

  test('REJECTS javascript:, which z.string().url() accepts', () => {
    expect(isHttpsWebUrl('javascript:alert(1)')).toBe(false)
  })

  test('REJECTS data:, which z.string().url() accepts', () => {
    expect(isHttpsWebUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
  })

  test('rejects file: and ftp:', () => {
    expect(isHttpsWebUrl('file:///etc/passwd')).toBe(false)
    expect(isHttpsWebUrl('ftp://example.com/x')).toBe(false)
  })

  test('rejects plain http — the rule is HTTPS, not "any web scheme"', () => {
    expect(isHttpsWebUrl('http://www.linkedin.com/in/example')).toBe(false)
  })

  test('rejects a scheme that merely starts with https', () => {
    // A `startsWith('https')` implementation would pass this. The check is an exact
    // protocol match for exactly this reason.
    expect(isHttpsWebUrl('https-evil://example.com')).toBe(false)
  })

  test('rejects malformed input', () => {
    expect(isHttpsWebUrl('not a url')).toBe(false)
    expect(isHttpsWebUrl('')).toBe(false)
    expect(isHttpsWebUrl('://')).toBe(false)
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// 2. Mail logging: no secrets, no personal data on the success path
// ──────────────────────────────────────────────────────────────────────────────

const sendMail = vi.hoisted(() => vi.fn())
const verify = vi.hoisted(() => vi.fn())
vi.mock('nodemailer', () => ({
  default: { createTransport: () => ({ verify, sendMail }) },
}))

// Imported after the mock so the module's transporter factory picks it up.
import { sendEmail } from '@/lib/email'

describe('sendEmail logging', () => {
  const SECRET = 'abcd efgh ijkl mnop'
  const RECIPIENT = 'office@infinus.rs, someone@example.com'
  const SUBMITTER = 'applicant@example.com'
  const SUBJECT = 'New Job Application: Senior SAP Consultant'

  let logged: string

  beforeEach(async () => {
    vi.stubEnv('EMAIL_USER', 'sender@example.com')
    vi.stubEnv('EMAIL_PASS', SECRET)
    verify.mockReset()
    verify.mockResolvedValue(true)
    sendMail.mockReset()
    sendMail.mockResolvedValue({ messageId: '<abc@example.com>' })

    const lines: string[] = []
    const capture = (...args: unknown[]) => {
      lines.push(args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '))
    }
    vi.spyOn(console, 'log').mockImplementation(capture)
    vi.spyOn(console, 'error').mockImplementation(capture)
    vi.spyOn(console, 'warn').mockImplementation(capture)

    await sendEmail(RECIPIENT, SUBJECT, '<p>body</p>', 'body', SUBMITTER, undefined, 'careers')
    logged = lines.join('\n')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  test('the message is still actually sent', () => {
    expect(sendMail).toHaveBeenCalledTimes(1)
  })

  test('never logs the SMTP password', () => {
    expect(logged).not.toContain(SECRET)
    expect(logged).not.toContain(SECRET.replace(/\s/g, ''))
  })

  test('never logs the SMTP password LENGTH, or anything about it', () => {
    // The removed line was `Email config pass length: 16`. Neither the label nor a bare
    // length may appear.
    expect(logged.toLowerCase()).not.toContain('pass length')
    expect(logged.toLowerCase()).not.toContain('password')
    expect(logged).not.toContain(String(SECRET.replace(/\s/g, '').length))
  })

  test('never logs recipient addresses', () => {
    expect(logged).not.toContain('office@infinus.rs')
    expect(logged).not.toContain('someone@example.com')
  })

  test("never logs the submitter's address, which is the Reply-To", () => {
    expect(logged).not.toContain(SUBMITTER)
  })

  test('never logs the user-derived subject', () => {
    expect(logged).not.toContain('Senior SAP Consultant')
    expect(logged).not.toContain(SUBJECT)
  })

  test('still logs enough to be operationally useful', () => {
    // The point is data minimisation, not silence: the template kind and the outcome must
    // survive, or an operator cannot tell the mail path is working at all.
    expect(logged).toContain('careers')
    expect(logged).toContain('[mail] sent')
  })
})

describe('sendEmail failure logging', () => {
  beforeEach(() => {
    vi.stubEnv('EMAIL_USER', 'sender@example.com')
    vi.stubEnv('EMAIL_PASS', 'secret')
    verify.mockReset()
    verify.mockResolvedValue(true)
    sendMail.mockReset()
    sendMail.mockRejectedValue(new Error('535 Authentication failed'))
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  test('reports failure to the caller and logs the provider message server-side', async () => {
    const lines: string[] = []
    vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      lines.push(args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '))
    })
    vi.spyOn(console, 'log').mockImplementation(() => {})

    const result = await sendEmail('a@b.com', 'S', '<p>x</p>', 'x', undefined, undefined, 'contact')

    expect(result.success).toBe(false)
    expect(lines.join('\n')).toContain('535 Authentication failed')
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// 3. The GA smoke test must not target production by omission
// ──────────────────────────────────────────────────────────────────────────────

describe('the GA smoke test default target', () => {
  const source = readFileSync(join(process.cwd(), 'scripts/qa/ga4-smoke.spec.ts'), 'utf8')

  test('BASE_URL falls back to a LOCAL origin', () => {
    const fallback = source.match(/const BASE_URL = process\.env\.BASE_URL \|\| (.+);/)
    expect(fallback).not.toBeNull()
    // Resolved via the named constant, which must itself be local.
    expect(fallback?.[1]).toBe('LOCAL_DEFAULT')
    expect(source).toMatch(/const LOCAL_DEFAULT = 'http:\/\/localhost:\d+';/)
  })

  test('no production origin is reachable as a DEFAULT', () => {
    // The literal may still appear in a comment showing how to opt in, but it must never be
    // the right-hand side of the BASE_URL fallback.
    const fallbackLine = source
      .split('\n')
      .find((l) => l.includes('const BASE_URL = process.env.BASE_URL'))
    expect(fallbackLine).toBeDefined()
    expect(fallbackLine).not.toContain('infinus.co')
    expect(fallbackLine).not.toContain('https://')
  })
})

// ──────────────────────────────────────────────────────────────────────────────
// 4. The Privacy Policy discloses reCAPTCHA, in both legal languages
// ──────────────────────────────────────────────────────────────────────────────

function documentText(blocks: LegalBlock[]): string {
  const parts: string[] = []
  for (const block of blocks) {
    if (block.t === 'ul') {
      for (const item of block.items) for (const i of item) if ('v' in i) parts.push(i.v)
    } else {
      for (const i of block.c) if ('v' in i) parts.push(i.v)
    }
  }
  return parts.join('\n')
}

describe('the Privacy Policy reCAPTCHA disclosure', () => {
  const bySection = (lang: string) => {
    const doc = PRIVACY_POLICY_DOCUMENTS.find((d) => d.lang === lang)
    expect(doc, `no privacy document for ${lang}`).toBeDefined()
    return documentText(doc!.blocks)
  }

  test('the Serbian document discloses it, in Serbian', () => {
    const text = bySection('sr-Latn')
    expect(text).toContain('Google reCAPTCHA')
    expect(text).toContain('sprečavanja spama')
    expect(text).toContain('automatizovanih zloupotreba')
    // Not the English sentence in the Serbian document.
    expect(text).not.toContain('Public forms are protected')
  })

  test('the English document discloses it, in English', () => {
    const text = bySection('en')
    expect(text).toContain('Google reCAPTCHA')
    expect(text).toContain('prevent spam and automated abuse')
    expect(text).not.toContain('Javne forme su zaštićene')
  })

  test('both documents carry exactly ONE reCAPTCHA paragraph', () => {
    for (const doc of PRIVACY_POLICY_DOCUMENTS) {
      const hits = documentText(doc.blocks).split('reCAPTCHA').length - 1
      expect(hits, `${doc.lang} should mention reCAPTCHA once`).toBe(1)
    }
  })

  test('no consent language was smuggled in with it', () => {
    // The disclosure is about a functional security dependency. It must not imply the
    // visitor consented to it, or that it is analytics.
    for (const doc of PRIVACY_POLICY_DOCUMENTS) {
      const text = documentText(doc.blocks)
      const sentence = text.split('\n').find((l) => l.includes('reCAPTCHA')) ?? ''
      expect(sentence).not.toMatch(/pristanak|consent|analitik|analytic|marketing/i)
    }
  })
})
