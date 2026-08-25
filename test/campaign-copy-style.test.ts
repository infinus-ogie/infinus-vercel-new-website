/**
 * Project copy-style rules, enforced against the dictionaries rather than against a rendered
 * page — so a rule holds for every locale and every page at once, including ones added later.
 *
 * The rule itself lives in CLAUDE.md so future sessions inherit it; this is what makes it
 * more than a note.
 */
import { describe, test, expect } from 'vitest'
import { LOCALES } from '@/lib/i18n'
import { getDictionary } from '@/content/dictionary'

const EM_DASH = '—'

/** Every string reachable from a dictionary, with a dotted path for the failure message. */
function walk(value: unknown, path: string, out: Array<{ path: string; text: string }>) {
  if (typeof value === 'string') {
    out.push({ path, text: value })
    return
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, `${path}[${i}]`, out))
    return
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k, out)
  }
}

describe('no em dashes in user-facing copy', () => {
  for (const locale of LOCALES) {
    test(`the ${locale} dictionary is clean`, () => {
      const strings: Array<{ path: string; text: string }> = []
      walk(getDictionary(locale), '', strings)

      const offenders = strings
        .filter((s) => s.text.includes(EM_DASH))
        .map((s) => `${s.path}: ${s.text.slice(0, 80)}`)

      expect(offenders, `use a hyphen, comma or colon instead:\n${offenders.join('\n')}`).toEqual(
        []
      )
    })
  }

  /**
   * The dictionary is where copy belongs, but text written straight into a component would
   * slip past the check above. This is a guard on the rule, not on any one string.
   */
  test('the rule is recorded for future sessions', async () => {
    const { readFileSync } = await import('node:fs')
    const claudeMd = readFileSync('CLAUDE.md', 'utf8')
    expect(claudeMd).toContain(EM_DASH)
    expect(claudeMd.toLowerCase()).toContain('do not use em dashes')
  })
})
