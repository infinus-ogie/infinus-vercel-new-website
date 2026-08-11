/**
 * Structural tests for the homepage section order.
 *
 * The previous version of this file built a list of elements with
 * `screen.getByTestId ? screen.getByTestId(...) : null` and then `.filter(Boolean)`
 * — `screen.getByTestId` is always truthy, so the ternary always took the first
 * branch, and no `data-testid` attributes exist on the homepage, so the call threw
 * before any real assertion ran. Every "section appears Nth" test then asserted only
 * that some copy existed *somewhere*, never its position, so the file's stated
 * purpose (order) was never actually tested.
 *
 * This rewrite asserts the real thing: the document order of the `data-section`
 * attributes that app/page.tsx renders. Copy assertions live in
 * home-copy-match.test.tsx so the two files do not overlap.
 */
import { render } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import HomePage from '../app/page'

/** The `data-section` values app/page.tsx renders, in the order it renders them. */
const EXPECTED_SECTION_ORDER = [
  'about',
  'sap-services',
  'partnership-benefits',
  'domain',
  'join-team',
] as const

function renderedSectionOrder(container: HTMLElement): string[] {
  // querySelectorAll returns nodes in document order, which is what we assert on.
  return Array.from(container.querySelectorAll('[data-section]')).map(
    (el) => el.getAttribute('data-section') as string
  )
}

describe('Homepage section structure', () => {
  test('renders exactly the expected sections, in order', () => {
    const { container } = render(<HomePage />)

    expect(renderedSectionOrder(container)).toEqual([...EXPECTED_SECTION_ORDER])
  })

  test('renders each expected section exactly once', () => {
    const { container } = render(<HomePage />)
    const order = renderedSectionOrder(container)

    for (const section of EXPECTED_SECTION_ORDER) {
      expect(order.filter((s) => s === section)).toHaveLength(1)
    }
  })

  test('the hero precedes every marked section', () => {
    const { container } = render(<HomePage />)

    const hero = container.querySelector('h1')
    const firstSection = container.querySelector('[data-section]')

    expect(hero).not.toBeNull()
    expect(firstSection).not.toBeNull()
    // Node.compareDocumentPosition: 4 = DOCUMENT_POSITION_FOLLOWING.
    expect(hero!.compareDocumentPosition(firstSection!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  test('has exactly one h1, and the section headings below it are h2', () => {
    const { container } = render(<HomePage />)

    expect(container.querySelectorAll('h1')).toHaveLength(1)

    // Each marked section owns a heading; none of them may compete with the h1.
    for (const section of EXPECTED_SECTION_ORDER) {
      const el = container.querySelector(`[data-section="${section}"]`)
      expect(el, `missing section: ${section}`).not.toBeNull()
      expect(el!.querySelectorAll('h1')).toHaveLength(0)
    }
  })

  test('page content sits inside main, with the footer after it', () => {
    // The homepage renders its own <NavBarDemo/> and <Footer/> rather than using the
    // (site) layout. Phase D consolidates that; this test pins the current state so
    // the consolidation is provably behaviour-preserving.
    //
    // NOTE: there is deliberately no assertion for a <nav> landmark. The desktop
    // navigation is built from <div>/<a> elements, and the only <nav> element in
    // navbar-demo.tsx lives inside the mobile overlay, which is not rendered until
    // the hamburger is opened. So the page ships with no navigation landmark at all.
    // Recorded as a finding rather than fixed — components/ are out of A1's scope.
    const { container } = render(<HomePage />)

    const main = container.querySelector('main')
    const footer = container.querySelector('footer')

    expect(main).not.toBeNull()
    expect(footer).not.toBeNull()
    expect(main!.querySelectorAll('[data-section]').length).toBe(EXPECTED_SECTION_ORDER.length)
    expect(main!.compareDocumentPosition(footer!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
