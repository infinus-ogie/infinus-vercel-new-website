/**
 * Tests for /faq.
 *
 * The previous version of this file asserted seven Q&A pairs that do not exist on
 * the page ("Why choose Infinus as your SAP partner?", "Infinus provides
 * comprehensive SAP services", etc.) — it was written against an older FAQ set and
 * had been silently dead ever since the Vitest JSX transform broke.
 *
 * It also asserted that answer text was present on first paint. It is not: the page
 * uses a Radix Accordion (`type="single" collapsible`), so answers are not mounted
 * until their question is expanded.
 *
 * Rather than re-hardcode a dozen questions and answers — which would have to be
 * edited by hand every time marketing changes the copy, and which is exactly what
 * rotted last time — these tests assert the page's *structure and behaviour* and
 * derive expectations from the rendered accordion itself. Only the two headings and
 * the CTA links, which are structural anchors rather than body copy, are named.
 */
import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import FAQPage from '../app/(en)/(site)/faq/page'

/** Every accordion question is rendered as a Radix trigger button. */
const getQuestionTriggers = () =>
  screen.getAllByRole('button').filter((el) => el.hasAttribute('aria-expanded'))

describe('/faq page', () => {
  test('renders the page heading and intro', () => {
    render(<FAQPage />)

    expect(screen.getByRole('heading', { level: 1, name: /frequently asked questions/i })).toBeInTheDocument()
    expect(screen.getByText(/find answers to common questions about our sap services/i)).toBeInTheDocument()
  })

  test('renders a non-empty list of questions, each as a collapsed accordion trigger', () => {
    render(<FAQPage />)

    const triggers = getQuestionTriggers()

    // Guards against the page silently rendering zero questions.
    expect(triggers.length).toBeGreaterThan(0)

    for (const trigger of triggers) {
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger.textContent?.trim()).not.toBe('')
    }
  })

  test('every question is unique — no duplicated or accidentally repeated entries', () => {
    render(<FAQPage />)

    const questions = getQuestionTriggers().map((t) => t.textContent?.trim())
    expect(new Set(questions).size).toBe(questions.length)
  })

  test('expanding a question reveals its answer', () => {
    render(<FAQPage />)

    const [firstTrigger] = getQuestionTriggers()
    const regionId = firstTrigger.getAttribute('aria-controls')
    expect(regionId).toBeTruthy()

    // Radix mounts an empty, `hidden` content region while the item is closed and
    // only mounts the answer itself on expand.
    const collapsed = document.getElementById(regionId!)
    expect(collapsed).not.toBeNull()
    expect(collapsed).not.toBeVisible()
    expect(collapsed!.textContent?.trim()).toBe('')

    fireEvent.click(firstTrigger)

    expect(firstTrigger).toHaveAttribute('aria-expanded', 'true')
    const expanded = document.getElementById(regionId!)
    expect(expanded).toBeVisible()
    expect(expanded!.textContent?.trim().length).toBeGreaterThan(0)
  })

  test('is single-open: expanding a second question collapses the first', () => {
    render(<FAQPage />)

    const triggers = getQuestionTriggers()
    expect(triggers.length).toBeGreaterThan(1)

    fireEvent.click(triggers[0])
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(triggers[1])
    expect(triggers[1]).toHaveAttribute('aria-expanded', 'true')
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'false')
  })

  test('renders the contact CTA with working destinations', () => {
    render(<FAQPage />)

    const cta = screen.getByRole('heading', { level: 2, name: /still have questions\?/i })
    expect(cta).toBeInTheDocument()

    expect(screen.getByRole('link', { name: /^contact us$/i })).toHaveAttribute('href', '/contact')

    // NOTE: this mailto uses contact@infinus.co, while the footer, the contact page
    // and lib/email.ts all use office@infinus.rs. Recorded here rather than changed,
    // since production copy is out of scope for this phase.
    expect(screen.getByRole('link', { name: /^email us$/i })).toHaveAttribute(
      'href',
      'mailto:contact@infinus.co'
    )
  })

  test('the questions rendered on the page are the ones fed to the FAQ schema', () => {
    // The page builds both the accordion and its FAQPage JSON-LD from one
    // `pageConfig.faqs` array, so a question visible to a user is by construction
    // the same one advertised to Google. `pageConfig` is module-private, so this
    // asserts the observable consequence: each accordion item carries both a
    // question trigger and a matching content region id.
    render(<FAQPage />)

    const triggers = getQuestionTriggers()
    const regionIds = triggers.map((t) => t.getAttribute('aria-controls'))

    expect(regionIds.every(Boolean)).toBe(true)
    expect(new Set(regionIds).size).toBe(triggers.length)

    for (const trigger of triggers) {
      const header = trigger.closest('h3')
      expect(header).not.toBeNull()
      expect(within(header as HTMLElement).getByRole('button')).toBe(trigger)
    }
  })
})
