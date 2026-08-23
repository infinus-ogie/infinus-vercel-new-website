/**
 * Copy and structure anchors for the Careers pages.
 *
 * These assertions are NOT new. They were the join-team anchors in home-copy-match.test.tsx
 * and they moved here with the form itself, unchanged, when the client asked for the job
 * application to leave the homepage. Keeping them identical is the point: it is what proves
 * the migration moved a component rather than rewriting one.
 *
 * Both halves of the pair are rendered, because the failure worth guarding against is the
 * one the codebase has hit before — an English default leaking into a Serbian document.
 * JoinSection's props are required precisely so that cannot happen silently, and the
 * Serbian assertions below are what would catch it if the requirement were ever relaxed.
 */
import { render, screen, within } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import EnglishCareersPage from '../app/(en)/(site)/careers/page'
import SerbianCareersPage from '../app/(sr)/sr/careers/page'

describe('Careers page — English', () => {
  test('keeps its recruiting copy, with the grammar corrections applied', () => {
    const { container } = render(<EnglishCareersPage />)
    const join = container.querySelector('[data-section="join-team"]') as HTMLElement
    expect(join).not.toBeNull()

    expect(within(join).getByText(/due to continuous business expansion/i)).toBeInTheDocument()
    expect(within(join).getByText(/interested in becoming a member/i)).toBeInTheDocument()
    expect(within(join).getByText(/we will be glad to talk with you/i)).toBeInTheDocument()
  })

  test('application form exposes its fields and submit control', () => {
    const { container } = render(<EnglishCareersPage />)
    const join = container.querySelector('[data-section="join-team"]') as HTMLElement

    // These field captions are plain text, not <label for=...>. Recorded as-is: making them
    // real labels is an accessibility improvement, and this migration is not the place.
    for (const field of [
      /your name \*/i,
      /phone number/i,
      /your email \*/i,
      /subject \*/i,
      /message \*/i,
      /attach your resume/i,
    ]) {
      expect(within(join).getByText(field)).toBeInTheDocument()
    }

    expect(within(join).getByRole('button', { name: /submit application/i })).toBeInTheDocument()
  })

  test('the LinkedIn field and CV upload survive the move', () => {
    // The homepage's REPLACEMENT form must not have these. This one must keep them, and
    // asserting it here is what stops the two forms being confused for each other.
    const { container } = render(<EnglishCareersPage />)
    const join = container.querySelector('[data-section="join-team"]') as HTMLElement

    expect(within(join).getByText(/linkedin url/i)).toBeInTheDocument()
    expect(within(join).getByText(/attach your resume/i)).toBeInTheDocument()
  })

  test('uses the owner-approved acknowledgement wording and the English policy', () => {
    const { container } = render(<EnglishCareersPage />)
    const join = container.querySelector('[data-section="join-team"]') as HTMLElement

    // Informational acknowledgement, NOT the cookie-consent mechanism — "agree"/"accept"
    // phrasings are wrong here.
    expect(
      within(join).getByText(/by submitting your application, you confirm that you have read our/i)
    ).toBeInTheDocument()
    expect(within(join).queryByText(/you agree to our/i)).not.toBeInTheDocument()
    expect(within(join).getByRole('link', { name: /privacy policy/i })).toHaveAttribute(
      'href',
      '/privacy'
    )
  })
})

describe('Careers page — Serbian', () => {
  test('renders Serbian copy, not the English default', () => {
    render(<SerbianCareersPage />)

    expect(screen.getByText(/zbog kontinuiranog rasta poslovanja/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /pošaljite prijavu/i })).toBeInTheDocument()
    expect(screen.queryByText(/due to continuous business expansion/i)).not.toBeInTheDocument()
  })

  test('links to the SERBIAN Privacy Policy, never the English one', () => {
    render(<SerbianCareersPage />)

    const link = screen.getByRole('link', { name: /politiku privatnosti/i })
    expect(link).toHaveAttribute('href', '/sr/politika-privatnosti')
  })
})
