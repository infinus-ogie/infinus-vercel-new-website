/**
 * Minimal smoke coverage for the CURRENT /privacy page.
 *
 * ── Phase C will replace this file ──────────────────────────────────────────────
 * The approved bilingual policy moves to /politika-privatnosti, /privacy becomes a
 * 301, and privacy coverage is rebuilt there. This file is intentionally kept small
 * and structural: just enough to notice if the page that is currently linked from
 * the footer, the contact form and the job-application form stops rendering before
 * that replacement lands.
 * ───────────────────────────────────────────────────────────────────────────────
 *
 * The previous version asserted a policy that does not exist on this page. Every
 * one of these was absent: "Information We Collect", "How We Use Your Information",
 * "Information Sharing and Disclosure", "Cookies and Tracking Technologies",
 * "Your Rights" phrased that way, "Third-Party Links", "Children's Privacy",
 * "Personal Information", "Automatically Collected Information", and the opening
 * line `Infinus ("we," "our," or "us") is committed to protecting your privacy`.
 * The real page uses different section names (asserted below) and opens with
 * "At Infinus, we are committed to protecting your privacy…".
 */
import { render, screen, within } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import PrivacyPage from '../app/(site)/privacy/page'

/** Section headings the current page actually renders, in document order. */
const CURRENT_SECTIONS = [
  'Information Collection',
  'Use of Information',
  'Sharing of Information',
  'Data Security',
  'Your Rights',
  'Changes to Privacy Policy',
  'Contact Us',
] as const

describe('/privacy page (superseded in Phase C)', () => {
  test('renders as a privacy policy document', () => {
    render(<PrivacyPage />)

    expect(screen.getByRole('heading', { level: 1, name: /^privacy policy$/i })).toBeInTheDocument()
    expect(screen.getByText(/at infinus, we are committed to protecting your privacy/i)).toBeInTheDocument()
  })

  test('renders its section headings in the expected order', () => {
    const { container } = render(<PrivacyPage />)

    const headings = Array.from(container.querySelectorAll('h2')).map((h) => h.textContent?.trim())
    expect(headings).toEqual([...CURRENT_SECTIONS])
  })

  test('table of contents links to every section that exists', () => {
    const { container } = render(<PrivacyPage />)

    const toc = container.querySelector('.toc') as HTMLElement
    expect(toc).not.toBeNull()

    const targets = Array.from(toc.querySelectorAll('a'))
      .map((a) => a.getAttribute('href'))
      .filter((href): href is string => !!href && href.startsWith('#'))

    expect(targets.length).toBeGreaterThan(0)
    for (const href of targets) {
      expect(container.querySelector(`[id="${href.slice(1)}"]`), `no anchor target for ${href}`).not.toBeNull()
    }
  })

  test('publishes the controller contact details', () => {
    render(<PrivacyPage />)

    expect(screen.getAllByText(/office@infinus\.rs/i).length).toBeGreaterThan(0)
  })

  test('documents no cookie or tracking policy yet — Phase C must add one', () => {
    // The site loads Google Analytics and a D&B Visitor Intelligence pixel, but this
    // policy contains no cookie/tracking section at all. That is a compliance gap,
    // not a test bug: this assertion records the gap so it fails (and this file gets
    // replaced) the moment Phase C introduces the real policy.
    const { container } = render(<PrivacyPage />)

    expect(container.textContent).not.toMatch(/cookie/i)
  })
})
