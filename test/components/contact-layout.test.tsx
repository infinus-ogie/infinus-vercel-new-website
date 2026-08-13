/**
 * Class-level guard for the Contact mobile-overflow fix.
 *
 * jsdom has no layout engine, so this file cannot measure the bug. The real geometry check
 * lives in scripts/qa/contact-layout.spec.ts, which runs a browser against the production
 * build. What THIS file adds is a fast tripwire in `npm test`: it fails the moment someone
 * removes one of the two classes the fix depends on, with an explanation of why they matter.
 *
 * ── The bug these classes prevent ───────────────────────────────────────────────
 * The left column is `mx-auto`, which makes it a shrink-to-fit flex item, and shrink-to-fit
 * is floored at the element's MIN-CONTENT width. That floor was 344px (en) / 338px (sr) — the
 * width of the single longest word in the h1 at text-5xl ("transformation" /
 * "transformaciju") — while the container offers only 312px at a 360px viewport. The document
 * therefore scrolled sideways below ~375px.
 *
 *   w-full            gives the column an explicit width so it tracks the container instead
 *                     of shrink-to-fitting to that min-content floor
 *   lg:w-auto         restores the original sizing from lg up, where the two-column row
 *                     layout takes over — desktop geometry is unchanged
 *   break-words       lets the now-too-long word wrap instead of overflowing its own box
 *   lg:break-normal   scopes that to the single-column layout, so the desktop heading still
 *                     wraps onto the same three lines it did before
 */
import { describe, test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render } from '@testing-library/react'
import { Contact2 } from '@/components/ui/contact-2'
import { getDictionary } from '@/content/dictionary'

const SOURCE = readFileSync(join(process.cwd(), 'components/ui/contact-2.tsx'), 'utf8')

describe('the Contact layout keeps its narrow-viewport constraints', () => {
  test('the left column is width-driven below lg and auto from lg up', () => {
    // Order-independent: assert the classes, not the string.
    const column = /<div className="([^"]*max-w-sm[^"]*)"/.exec(SOURCE)
    expect(column, 'the max-w-sm left column was not found').not.toBeNull()

    const classes = column![1].split(/\s+/)
    expect(classes, 'w-full is what stops shrink-to-fit flooring at min-content').toContain('w-full')
    expect(classes, 'lg:w-auto is what keeps desktop geometry unchanged').toContain('lg:w-auto')
    expect(classes).toContain('mx-auto')
    expect(classes).toContain('max-w-sm')
  })

  test('the h1 can break a long word below lg, and must not from lg up', () => {
    const h1 = /<h1 className="([^"]*)"/.exec(SOURCE)
    expect(h1).not.toBeNull()

    const classes = h1![1].split(/\s+/)
    expect(classes, 'break-words lets the longest word wrap on small phones').toContain('break-words')
    expect(classes, 'lg:break-normal preserves the approved 3-line desktop heading').toContain(
      'lg:break-normal'
    )
    // The type scale itself is unchanged — the fix must not have shrunk the heading.
    expect(classes).toContain('text-5xl')
    expect(classes).toContain('lg:text-6xl')
  })

  test('the fix does not hide the problem with overflow-x on a container', () => {
    // Clipping would make the assertion in scripts/qa/contact-layout.spec.ts pass while the
    // content was still too wide, which is the opposite of the goal.
    const code = SOURCE.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    expect(code).not.toMatch(/overflow-x-hidden|overflow-hidden/)
  })

  test('both locales still render through this one shared layout', () => {
    // The fix is in shared markup, so it cannot be applied to one language only.
    for (const locale of ['en', 'sr'] as const) {
      const { container, unmount } = render(<Contact2 content={getDictionary(locale).contact} />)
      const column = container.querySelector('.max-w-sm')
      expect(column, `${locale} column missing`).not.toBeNull()
      expect(column!.className).toContain('w-full')
      expect(column!.className).toContain('lg:w-auto')
      expect(container.querySelector('h1')!.className).toContain('break-words')
      unmount()
    }
  })
})
