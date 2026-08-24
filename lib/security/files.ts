import { basename } from 'node:path'
import { FIELD_LIMITS } from './limits'

/**
 * Server-side validation for uploaded files.
 *
 * ── Three checks, because any one of them alone is trivially defeated ───────────
 *   extension   what the file claims to be by name — attacker-controlled
 *   MIME type   what the BROWSER said it is — attacker-controlled
 *   signature   what the first bytes actually are — the only one that costs effort
 *
 * A `.pdf` with `application/pdf` and a PE header inside is a file that passes both of the
 * cheap checks. Requiring all three to agree is what makes the allowlist mean something.
 *
 * The `accept` attribute on the input is a file-picker convenience and is not a check at
 * all: nothing stops a POST that never touched the picker.
 *
 * ── What this does NOT do ───────────────────────────────────────────────────────
 * Nothing here parses, renders, unpacks or executes the file. Validation reads the first few
 * bytes and compares them; the file is otherwise handled as opaque bytes and forwarded as an
 * email attachment. Introducing a parser to "check the file more thoroughly" would add the
 * exact attack surface this is trying to avoid.
 */

export interface AllowedFileType {
  /** Lowercase, with the dot. */
  readonly extension: string
  /** The MIME types a browser plausibly reports for this extension. */
  readonly mimeTypes: readonly string[]
  /**
   * Byte signatures, any of which identifies the format.
   *
   * Empty means the format has no magic number — plain text. Those are handled by the
   * "is not something else" rule in `hasValidSignature`.
   */
  readonly signatures: readonly (readonly number[])[]
}

/** PDF: "%PDF". */
const PDF: AllowedFileType = {
  extension: '.pdf',
  mimeTypes: ['application/pdf'],
  signatures: [[0x25, 0x50, 0x44, 0x46]],
}

/** Legacy .doc is an OLE2 compound file. */
const DOC: AllowedFileType = {
  extension: '.doc',
  mimeTypes: ['application/msword'],
  signatures: [[0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]],
}

/** .docx is a ZIP container. The three PK variants are local file, empty and spanned. */
const DOCX: AllowedFileType = {
  extension: '.docx',
  mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  signatures: [
    [0x50, 0x4b, 0x03, 0x04],
    [0x50, 0x4b, 0x05, 0x06],
    [0x50, 0x4b, 0x07, 0x08],
  ],
}

/** Plain text has no signature — see `hasValidSignature`. */
const TXT: AllowedFileType = {
  extension: '.txt',
  mimeTypes: ['text/plain'],
  signatures: [],
}

/** The Contact page's own hint says PDF, DOC, DOCX, TXT. Not expanded. */
export const CONTACT_FILE_TYPES: readonly AllowedFileType[] = [PDF, DOC, DOCX, TXT]

/** The Careers form's own hint says PDF, DOC, DOCX — no TXT for a CV. */
export const CAREERS_FILE_TYPES: readonly AllowedFileType[] = [PDF, DOC, DOCX]

/** Signatures that must never appear, whatever the file claims to be. */
const EXECUTABLE_SIGNATURES: readonly (readonly number[])[] = [
  [0x4d, 0x5a], // MZ — Windows PE/DOS executable
  [0x7f, 0x45, 0x4c, 0x46], // ELF
  [0xca, 0xfe, 0xba, 0xbe], // Mach-O fat / Java class
  [0xfe, 0xed, 0xfa, 0xce], // Mach-O 32
  [0xfe, 0xed, 0xfa, 0xcf], // Mach-O 64
  [0x23, 0x21], // #! shebang
]

export type FileRejection =
  | 'too-large'
  | 'empty'
  | 'bad-name'
  | 'extension-not-allowed'
  | 'mime-not-allowed'
  | 'signature-mismatch'

export type FileCheck =
  | { ok: true; safeFilename: string }
  | { ok: false; reason: FileRejection }

/**
 * The first `length` bytes of a file.
 *
 * Prefers `slice`, which avoids buffering a whole attachment to read four bytes. Not every
 * runtime returns a fully-featured Blob from it — jsdom's does not implement `arrayBuffer`
 * on the slice — so this falls back to a full read.
 *
 * The fallback is bounded: `checkUploadedFile` validates SIZE before calling this, so the
 * worst case is the endpoint's own ceiling and never an unbounded read.
 */
async function readHead(file: File, length: number): Promise<Uint8Array> {
  try {
    const slice = file.slice(0, length)
    if (typeof (slice as Blob).arrayBuffer === 'function') {
      return new Uint8Array(await slice.arrayBuffer())
    }
  } catch {
    // fall through
  }
  return new Uint8Array(await file.arrayBuffer()).slice(0, length)
}

function startsWith(bytes: Uint8Array, signature: readonly number[]): boolean {
  if (bytes.length < signature.length) return false
  for (let i = 0; i < signature.length; i += 1) {
    if (bytes[i] !== signature[i]) return false
  }
  return true
}

/**
 * Reduce a client-supplied filename to something safe to put in a header or a log.
 *
 * Strips any directory component — `basename` handles `../../etc/passwd` and
 * `C:\windows\x` alike — then removes every character that is not a plain name character.
 * The result cannot traverse a path, cannot inject a newline into a MIME header, and cannot
 * be empty.
 */
export function sanitiseFilename(raw: string): string {
  // Windows separators survive POSIX basename(), so normalise them first.
  const withoutPaths = basename(raw.replace(/\\/g, '/'))
  const cleaned = withoutPaths
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[^A-Za-z0-9._ -]/g, '_')
    .replace(/^\.+/, '')
    .trim()
    .slice(0, FIELD_LIMITS.filename)

  return cleaned.length > 0 ? cleaned : 'attachment'
}

/** The declared extension of a name, lowercased and including the dot. */
function extensionOf(filename: string): string {
  const dot = filename.lastIndexOf('.')
  return dot === -1 ? '' : filename.slice(dot).toLowerCase()
}

/**
 * Does the content match what the extension claims?
 *
 * For formats WITH a signature, one of them must match. For plain text, which has none, the
 * rule is inverted: it must not begin with the signature of something else. That catches the
 * `payload.exe` renamed to `notes.txt` case without pretending to validate text.
 */
function hasValidSignature(type: AllowedFileType, head: Uint8Array): boolean {
  if (type.signatures.length === 0) {
    return !EXECUTABLE_SIGNATURES.some((signature) => startsWith(head, signature))
  }
  return type.signatures.some((signature) => startsWith(head, signature))
}

/**
 * Validate an uploaded file against an allowlist.
 *
 * Returns the sanitised filename on success, so callers use THAT rather than `file.name`.
 */
export async function checkUploadedFile(
  file: File,
  {
    allowed,
    maxBytes,
  }: {
    allowed: readonly AllowedFileType[]
    maxBytes: number
  }
): Promise<FileCheck> {
  if (file.size === 0) return { ok: false, reason: 'empty' }
  if (file.size > maxBytes) return { ok: false, reason: 'too-large' }

  const rawName = typeof file.name === 'string' ? file.name : ''
  if (rawName.length === 0 || rawName.length > FIELD_LIMITS.filename) {
    return { ok: false, reason: 'bad-name' }
  }

  const safeFilename = sanitiseFilename(rawName)
  const extension = extensionOf(safeFilename)

  const type = allowed.find((candidate) => candidate.extension === extension)
  if (!type) return { ok: false, reason: 'extension-not-allowed' }

  // The browser's Content-Type. Checked because a mismatch is a signal, not because it is
  // trusted on its own.
  const declaredMime = (file.type || '').toLowerCase().split(';')[0].trim()
  if (declaredMime && !type.mimeTypes.includes(declaredMime)) {
    return { ok: false, reason: 'mime-not-allowed' }
  }

  // Read only the first bytes where the runtime allows it: enough for every signature
  // above, and a rejected file is never fully buffered.
  const head = await readHead(file, 16)
  if (!hasValidSignature(type, head)) {
    return { ok: false, reason: 'signature-mismatch' }
  }

  return { ok: true, safeFilename }
}
