/**
 * @vitest-environment node
 *
 * Node, not jsdom, and deliberately: this is SERVER code, and jsdom's `File` implements
 * neither `arrayBuffer()` nor a usable `slice().arrayBuffer()`. Testing it under jsdom would
 * mean testing against a File that behaves nothing like the one the route actually receives
 * from `request.formData()`.
 */

/**
 * Uploaded-file validation.
 *
 * The cases below are ordered by how much effort they cost an attacker. The cheap ones —
 * wrong extension, wrong MIME — are what a browser would stop. The one that matters is the
 * last group: a file whose NAME and declared TYPE are both perfectly valid and whose CONTENT
 * is something else. That is the submission a size-and-MIME check waves through, and it was
 * being waved through until this pass.
 */
import { describe, test, expect } from 'vitest'
import {
  checkUploadedFile,
  sanitiseFilename,
  CONTACT_FILE_TYPES,
  CAREERS_FILE_TYPES,
} from '@/lib/security/files'
import { FILE_LIMITS } from '@/lib/security/limits'

/** A File whose first bytes are `signature`, padded to `size`. */
function fileWith({
  name,
  type,
  signature = [],
  size = 1024,
}: {
  name: string
  type: string
  signature?: number[]
  size?: number
}): File {
  const bytes = new Uint8Array(size)
  bytes.set(signature, 0)
  return new File([bytes], name, { type })
}

const PDF_SIG = [0x25, 0x50, 0x44, 0x46]
const DOC_SIG = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]
const DOCX_SIG = [0x50, 0x4b, 0x03, 0x04]
const MZ_SIG = [0x4d, 0x5a] // Windows executable

const contact = { allowed: CONTACT_FILE_TYPES, maxBytes: FILE_LIMITS.contactBytes }
const careers = { allowed: CAREERS_FILE_TYPES, maxBytes: FILE_LIMITS.careersBytes }

describe('files the approved UI actually offers', () => {
  test('a real PDF passes', async () => {
    const result = await checkUploadedFile(
      fileWith({ name: 'cv.pdf', type: 'application/pdf', signature: PDF_SIG }),
      contact
    )
    expect(result.ok).toBe(true)
  })

  test('a real DOC passes', async () => {
    const result = await checkUploadedFile(
      fileWith({ name: 'cv.doc', type: 'application/msword', signature: DOC_SIG }),
      contact
    )
    expect(result.ok).toBe(true)
  })

  test('a real DOCX passes', async () => {
    const result = await checkUploadedFile(
      fileWith({
        name: 'cv.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        signature: DOCX_SIG,
      }),
      contact
    )
    expect(result.ok).toBe(true)
  })

  test('a plain TXT passes on Contact — it has no signature to match', async () => {
    const result = await checkUploadedFile(
      fileWith({ name: 'notes.txt', type: 'text/plain', signature: [0x48, 0x65] }),
      contact
    )
    expect(result.ok).toBe(true)
  })

  test('TXT is NOT accepted on Careers, whose own hint says PDF/DOC/DOCX', async () => {
    const result = await checkUploadedFile(
      fileWith({ name: 'notes.txt', type: 'text/plain' }),
      careers
    )
    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toBe('extension-not-allowed')
  })
})

describe('size', () => {
  test('an oversized file is rejected', async () => {
    const result = await checkUploadedFile(
      fileWith({ name: 'big.pdf', type: 'application/pdf', signature: PDF_SIG, size: 11 * 1024 * 1024 }),
      contact
    )
    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toBe('too-large')
  })

  test('Careers has the TIGHTER limit its own hint advertises', async () => {
    const sixMb = fileWith({
      name: 'cv.pdf',
      type: 'application/pdf',
      signature: PDF_SIG,
      size: 6 * 1024 * 1024,
    })
    // Fine for Contact (10MB), too large for Careers (5MB).
    expect((await checkUploadedFile(sixMb, contact)).ok).toBe(true)
    expect((await checkUploadedFile(sixMb, careers)).ok).toBe(false)
  })

  test('a zero-byte file is rejected', async () => {
    const result = await checkUploadedFile(
      new File([], 'empty.pdf', { type: 'application/pdf' }),
      contact
    )
    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toBe('empty')
  })
})

describe('extension and MIME', () => {
  test('a forbidden extension is rejected', async () => {
    for (const name of ['payload.exe', 'script.sh', 'archive.zip', 'page.html', 'sheet.xlsx']) {
      const result = await checkUploadedFile(
        fileWith({ name, type: 'application/pdf', signature: PDF_SIG }),
        contact
      )
      expect(result.ok, name).toBe(false)
      expect(!result.ok && result.reason).toBe('extension-not-allowed')
    }
  })

  test('an allowed extension with a MISMATCHED MIME is rejected', async () => {
    const result = await checkUploadedFile(
      fileWith({ name: 'cv.pdf', type: 'application/x-msdownload', signature: PDF_SIG }),
      contact
    )
    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toBe('mime-not-allowed')
  })

  test('a double extension does not sneak past', async () => {
    const result = await checkUploadedFile(
      fileWith({ name: 'invoice.pdf.exe', type: 'application/pdf', signature: PDF_SIG }),
      contact
    )
    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toBe('extension-not-allowed')
  })
})

describe('content, which is the check that actually costs something to beat', () => {
  test('an executable renamed to .pdf, with a forged MIME, is REJECTED', async () => {
    // Extension says PDF. Declared type says PDF. Both are attacker-controlled and both
    // pass. The first two bytes are MZ, and that is what catches it.
    const result = await checkUploadedFile(
      fileWith({ name: 'cv.pdf', type: 'application/pdf', signature: MZ_SIG }),
      contact
    )
    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toBe('signature-mismatch')
  })

  test('an executable renamed to .txt is rejected, despite text having no signature', async () => {
    // Plain text cannot be positively identified, so the rule inverts: it must not be
    // something else. Without this, .txt would be an unchecked hole in the allowlist.
    const result = await checkUploadedFile(
      fileWith({ name: 'readme.txt', type: 'text/plain', signature: MZ_SIG }),
      contact
    )
    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toBe('signature-mismatch')
  })

  test('a shell script renamed to .txt is rejected', async () => {
    const result = await checkUploadedFile(
      fileWith({ name: 'notes.txt', type: 'text/plain', signature: [0x23, 0x21] }),
      contact
    )
    expect(result.ok).toBe(false)
  })

  test('a DOCX body inside a .doc name is rejected — the formats differ', async () => {
    const result = await checkUploadedFile(
      fileWith({ name: 'cv.doc', type: 'application/msword', signature: DOCX_SIG }),
      contact
    )
    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toBe('signature-mismatch')
  })
})

describe('filename sanitisation', () => {
  test('path traversal is stripped', async () => {
    for (const hostile of [
      '../../../etc/passwd.pdf',
      '..\\..\\windows\\system32\\evil.pdf',
      '/etc/shadow.pdf',
    ]) {
      const safe = sanitiseFilename(hostile)
      expect(safe, hostile).not.toContain('/')
      expect(safe, hostile).not.toContain('\\')
      expect(safe, hostile).not.toContain('..')
    }
  })

  test('control characters and newlines are removed', async () => {
    // A newline in a filename reaches a MIME header, where it is header injection.
    const safe = sanitiseFilename('cv\r\nBcc: victim@example.com.pdf')
    expect(safe).not.toMatch(/[\r\n]/)
  })

  test('a name that sanitises to nothing gets a safe default', () => {
    expect(sanitiseFilename('...')).toBe('attachment')
    expect(sanitiseFilename('')).toBe('attachment')
    expect(sanitiseFilename('///')).toBe('attachment')
  })

  test('an ordinary name survives readably', () => {
    expect(sanitiseFilename('Ana Anic - CV 2026.pdf')).toBe('Ana Anic - CV 2026.pdf')
  })

  test('the check RETURNS the sanitised name, so callers never use file.name', async () => {
    const result = await checkUploadedFile(
      fileWith({ name: '../../cv.pdf', type: 'application/pdf', signature: PDF_SIG }),
      contact
    )
    expect(result.ok).toBe(true)
    expect(result.ok && result.safeFilename).toBe('cv.pdf')
  })

  test('an absurdly long filename is rejected', async () => {
    const result = await checkUploadedFile(
      fileWith({ name: 'a'.repeat(5000) + '.pdf', type: 'application/pdf', signature: PDF_SIG }),
      contact
    )
    expect(result.ok).toBe(false)
    expect(!result.ok && result.reason).toBe('bad-name')
  })
})
