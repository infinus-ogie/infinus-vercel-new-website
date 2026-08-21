/**
 * Splitting a case study's "Technologies & Scope" string into pills.
 *
 * ── The bug this fixes ─────────────────────────────────────────────────────────
 * The technologies field is one comma-separated string, and the component used to split it
 * with a plain `value.split(", ")`. That works for four of the five case studies. It breaks
 * on nearshoring1, whose value groups a module list inside parentheses:
 *
 *   "SAP ERP, SAP S/4HANA, multiple functional and technical modules (FI, CO, MM, SD, PP,
 *    QM, EWM, ABAP, BC, SAC)"
 *
 * Splitting on every ", " tore the parenthetical apart, so the page rendered twelve pills
 * including the nonsense pair "multiple functional and technical modules (FI" and "SAC)".
 * The claim was never wrong — the string is correct and unchanged — but the rendering
 * misrepresented it as a dangling fragment and a stray closing bracket.
 *
 * ── The fix ────────────────────────────────────────────────────────────────────
 * Split on ", " only at DEPTH ZERO, so a separator inside parentheses is treated as part of
 * the group it belongs to. nearshoring1 now renders three pills, the third being the whole
 * "…modules (FI, CO, MM, SD, PP, QM, EWM, ABAP, BC, SAC)" grouping — which is what the
 * string says.
 *
 * ── Why this is a display fix and not a content change ─────────────────────────
 * No dictionary value changed. Both locales keep the exact technology strings the owner
 * approved, in English and in Serbian. The concatenation of the pills is identical to
 * before; only the boundaries between them move. The other four case studies produce
 * byte-identical pill lists, including pharma1's "SAP Cloud ERP (Private)" — parentheses
 * with no separator inside were never affected either way.
 *
 * Written against tsconfig `target: es5`: an index loop, no iterator spread, no regex
 * lookbehind.
 */

/** The separator between technology entries. */
const SEPARATOR = ', '

/**
 * Split a technologies string into pill labels, keeping parenthesised groups whole.
 *
 * Unbalanced input degrades gracefully rather than throwing: a stray ")" cannot push the
 * depth below zero, and an unclosed "(" simply keeps the remainder in one pill.
 */
export function splitTechnologies(value: string): string[] {
  const out: string[] = []
  let depth = 0
  let start = 0

  for (let i = 0; i < value.length; i += 1) {
    const ch = value.charAt(i)
    if (ch === '(') {
      depth += 1
    } else if (ch === ')') {
      if (depth > 0) depth -= 1
    } else if (depth === 0 && ch === ',' && value.substr(i, SEPARATOR.length) === SEPARATOR) {
      out.push(value.slice(start, i))
      i += SEPARATOR.length - 1
      start = i + 1
    }
  }
  out.push(value.slice(start))

  // Drop empties so a trailing separator cannot render a blank pill.
  const cleaned: string[] = []
  for (let i = 0; i < out.length; i += 1) {
    const trimmed = out[i].trim()
    if (trimmed !== '') cleaned.push(trimmed)
  }
  return cleaned
}
