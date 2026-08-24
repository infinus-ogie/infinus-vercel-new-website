/**
 * The Serbian MythBusting FAQ accordion.
 *
 * ── The bug this file exists for ───────────────────────────────────────────────
 * The first version passed `forceMount` to keep every answer in the DOM, on the assumption
 * that Radix would still hide closed content. IT DOES NOT. With `forceMount` the content
 * element is rendered and left alone: `data-state` and `aria-expanded` flip, and nothing else
 * happens. All five answers sat open at full height and clicking a question changed only
 * invisible attributes.
 *
 * So the assertions below are about STATE, not about `toBeVisible()`: the hiding is done by a
 * Tailwind class on the item, and jsdom loads no stylesheet, so visibility here would prove
 * nothing either way. `data-state` and `aria-expanded` are the contract Radix guarantees and
 * the CSS keys off — get those right and the visual behaviour follows.
 */
import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { EbookFaq } from '@/components/mythbusters/EbookFaq'
import { getDictionary, srMythBustersLayout } from '@/content/dictionary'

const items = srMythBustersLayout(getDictionary('sr').mythBusters).faq.items

/** The five triggers, in source order. */
const triggers = () => screen.getAllByRole('button')

/** Open/closed as a readable tuple, e.g. [true, false, false, false, false]. */
const openState = () =>
  triggers().map((t) => t.getAttribute('aria-expanded') === 'true')

describe('the FAQ accordion', () => {
  test('renders every supplied question', () => {
    render(<EbookFaq items={items} />)
    expect(triggers()).toHaveLength(items.length)
    for (const item of items) {
      expect(screen.getByText(item.question)).toBeInTheDocument()
    }
  })

  test('opens the FIRST item on initial render and leaves the rest closed', () => {
    render(<EbookFaq items={items} />)
    expect(openState()).toEqual([true, false, false, false, false])
  })

  test('clicking a closed question opens it AND closes the one that was open', () => {
    render(<EbookFaq items={items} />)

    fireEvent.click(triggers()[2])

    // Exactly one open, and it is the one that was clicked.
    expect(openState()).toEqual([false, false, true, false, false])
  })

  test('only ever one answer is open, however many are clicked', () => {
    render(<EbookFaq items={items} />)

    for (const index of [1, 3, 4, 2]) {
      fireEvent.click(triggers()[index])
      const state = openState()
      expect(state.filter(Boolean), `after clicking ${index}`).toHaveLength(1)
      expect(state[index], `item ${index} should be the open one`).toBe(true)
    }
  })

  test('the open item can be closed again — nothing gets stuck open', () => {
    render(<EbookFaq items={items} />)

    fireEvent.click(triggers()[0])
    expect(openState()).toEqual([false, false, false, false, false])
  })

  /**
   * Enter and Space are NATIVE `<button>` activation — the browser turns them into a click.
   * jsdom does not emulate that, so a `fireEvent.keyDown(trigger, { key: 'Enter' })` test here
   * would assert jsdom's behaviour rather than this component's, and would pass or fail for
   * reasons that have nothing to do with the accordion.
   *
   * What IS this component's responsibility is using a real button, keeping it focusable, and
   * not overriding activation. That is what these two assert. The end-to-end keyboard path was
   * verified in a real browser: focus item 2, Enter opens it; focus item 4, Space opens it and
   * item 2 closes; focus stays on the trigger throughout.
   */
  test('each question is a real focusable button, so Enter and Space activate it', () => {
    render(<EbookFaq items={items} />)

    for (const trigger of triggers()) {
      expect(trigger.tagName).toBe('BUTTON')
      expect(trigger.getAttribute('type')).toBe('button')
      expect(trigger).not.toBeDisabled()
      // Not removed from the tab order, and not given a competing key handler contract.
      expect(trigger.getAttribute('tabindex')).not.toBe('-1')
    }
  })

  test('a trigger can hold focus', () => {
    render(<EbookFaq items={items} />)
    triggers()[2].focus()
    expect(document.activeElement).toBe(triggers()[2])
  })

  /**
   * `forceMount` is the reason the answers survive in the markup while closed — which is what
   * lets test/mythbusters-page.test.tsx assert the client's approved copy actually shipped,
   * and what a crawler or a find-in-page reads.
   */
  test('every answer stays in the DOM while its item is closed', () => {
    const { container } = render(<EbookFaq items={items} />)

    const closed = Array.from(container.querySelectorAll('[data-faq-item]')).filter(
      (item) => item.getAttribute('data-state') === 'closed'
    )
    expect(closed.length, 'four of the five start closed').toBe(4)

    for (const item of items) {
      expect(screen.getByText(item.answer)).toBeInTheDocument()
    }
  })

  test('each trigger points at its own answer region, with no duplicate ids', () => {
    const { container } = render(<EbookFaq items={items} />)

    const ids = Array.from(container.querySelectorAll('[id]')).map((el) => el.id)
    expect(new Set(ids).size, `duplicate ids: ${ids.filter((id, i) => ids.indexOf(id) !== i)}`).toBe(
      ids.length
    )

    for (const trigger of triggers()) {
      const controlled = trigger.getAttribute('aria-controls')
      expect(controlled).toBeTruthy()
      const region = container.querySelector(`#${CSS.escape(controlled!)}`)
      expect(region, 'aria-controls must resolve').not.toBeNull()
      // The region belongs to the SAME item as the trigger that controls it.
      expect(trigger.closest('[data-faq-item]')).toBe(region!.closest('[data-faq-item]'))
    }
  })

  test('the item and its region agree on state', () => {
    const { container } = render(<EbookFaq items={items} />)
    fireEvent.click(triggers()[3])

    const item = container.querySelectorAll('[data-faq-item]')[3]
    const region = item.querySelector('[role="region"]')
    expect(item.getAttribute('data-state')).toBe('open')
    expect(region?.getAttribute('data-state')).toBe('open')
    expect(within(item as HTMLElement).getByText(items[3].answer)).toBeInTheDocument()
  })
})
