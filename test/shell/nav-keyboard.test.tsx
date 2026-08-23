/**
 * Keyboard and screen-reader access to the navigation dropdowns.
 *
 * Before this, the desktop dropdowns opened on `onMouseEnter` and nothing else. There was no
 * aria-expanded, no aria-haspopup, no way to open a menu from the keyboard and no way to
 * close one. Seven of the site's pages sat behind those menus, so a keyboard or
 * screen-reader user could not reach them at all.
 *
 * These tests exist so that cannot silently come back. They exercise the DISCLOSURE pattern
 * the component implements — a button toggling a container of ordinary links — rather than
 * the ARIA menu pattern, which would take the links out of the tab order.
 */
import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { NavBar } from '@/components/ui/tubelight-navbar'
import { navItemsFor } from '@/components/ui/nav-items'
import { getDictionary } from '@/content/dictionary'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

const items = navItemsFor(getDictionary('en').nav)

function renderBar() {
  const result = render(<NavBar items={items} />)
  // The desktop bar and the (unused) mobile fallback both render here; scope to the bar.
  return result
}

function expertiseTrigger() {
  return screen.getByRole('button', { name: /expertise/i })
}

describe('the dropdown triggers announce themselves', () => {
  beforeEach(() => {
    renderBar()
  })

  test('each group trigger has aria-haspopup and starts collapsed', () => {
    for (const name of [/^company$/i, /^expertise$/i, /^insights$/i]) {
      const trigger = screen.getByRole('button', { name })
      expect(trigger).toHaveAttribute('aria-haspopup', 'true')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveAttribute('aria-controls')
    }
  })

  test('aria-expanded flips when the menu opens, and aria-controls points at the panel', () => {
    const trigger = expertiseTrigger()
    fireEvent.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const panelId = trigger.getAttribute('aria-controls') as string
    expect(document.getElementById(panelId)).not.toBeNull()
  })
})

describe('opening and closing without a mouse', () => {
  test('clicking the trigger toggles — it used to only set the active tab', () => {
    renderBar()
    const trigger = expertiseTrigger()

    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  test('ArrowDown opens the menu and lands on its first link', () => {
    renderBar()
    const trigger = expertiseTrigger()
    trigger.focus()

    fireEvent.keyDown(trigger, { key: 'ArrowDown' })

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const panel = document.getElementById(trigger.getAttribute('aria-controls') as string)!
    const links = within(panel).getAllByRole('link')
    expect(document.activeElement).toBe(links[0])
  })

  test('ArrowUp opens the menu and lands on its LAST link', () => {
    renderBar()
    const trigger = expertiseTrigger()
    trigger.focus()

    fireEvent.keyDown(trigger, { key: 'ArrowUp' })

    const panel = document.getElementById(trigger.getAttribute('aria-controls') as string)!
    const links = within(panel).getAllByRole('link')
    expect(document.activeElement).toBe(links[links.length - 1])
  })

  test('Escape closes the menu AND returns focus to the trigger', () => {
    renderBar()
    const trigger = expertiseTrigger()
    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })

    const panel = document.getElementById(trigger.getAttribute('aria-controls') as string)!
    fireEvent.keyDown(panel, { key: 'Escape' })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    // Escape must never strand the caret with nothing focused.
    expect(document.activeElement).toBe(trigger)
  })
})

describe('moving around inside an open menu', () => {
  function open() {
    renderBar()
    const trigger = expertiseTrigger()
    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    const panel = document.getElementById(trigger.getAttribute('aria-controls') as string)!
    return { trigger, panel, links: within(panel).getAllByRole('link') }
  }

  test('ArrowDown and ArrowUp step through the links', () => {
    const { panel, links } = open()

    fireEvent.keyDown(panel, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(links[1])

    fireEvent.keyDown(panel, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(links[0])
  })

  test('ArrowUp from the first link wraps to the last', () => {
    const { panel, links } = open()

    fireEvent.keyDown(panel, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(links[links.length - 1])
  })

  test('Home and End jump to the ends', () => {
    const { panel, links } = open()

    fireEvent.keyDown(panel, { key: 'End' })
    expect(document.activeElement).toBe(links[links.length - 1])

    fireEvent.keyDown(panel, { key: 'Home' })
    expect(document.activeElement).toBe(links[0])
  })

  test('the links stay in the normal tab order — no roving tabindex, no trap', () => {
    const { links } = open()
    for (const link of links) {
      expect(link).not.toHaveAttribute('tabindex', '-1')
    }
  })

  test('category headings are reachable as text but are not focusable links', () => {
    const { panel } = open()

    const heading = within(panel).getByText('Case Studies')
    expect(heading.closest('a')).toBeNull()
    // Its children are real links, so nothing became unreachable by keyboard.
    expect(within(panel).getByRole('link', { name: 'Retail' })).toBeInTheDocument()
  })
})

describe('focus leaving the group closes it', () => {
  test('blurring to something outside the trigger and panel collapses the menu', () => {
    renderBar()
    const trigger = expertiseTrigger()
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    // relatedTarget outside the group — what Tab past the last link produces.
    fireEvent.blur(trigger, { relatedTarget: document.body })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})
