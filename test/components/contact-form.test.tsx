/**
 * Tests for the LIVE contact form.
 *
 * This file previously tested `components/forms/contact-form.tsx`, which is dead
 * code — nothing in the app imports it. The form actually rendered on /contact is
 * `components/ui/contact-2.tsx` (via app/(site)/contact/page.tsx), so that is what
 * is tested here.
 *
 * Two behaviours of the live component shape these tests:
 *
 * 1. The submit button is `disabled={isSubmitting || !isValid}`, so it cannot be
 *    clicked while the form is invalid. The per-field error messages in the JSX are
 *    therefore not reachable through the UI, and asserting on them (as the old test
 *    did) would assert unreachable behaviour. We test the disabled/enabled gate
 *    instead — that is the validation surface a user actually experiences.
 * 2. `@testing-library/user-event` cannot be imported in this repo: it resolves
 *    `@testing-library/dom` as a peer, which is only installed nested under
 *    @testing-library/react (a consequence of `legacy-peer-deps=true` in .npmrc).
 *    We use `fireEvent` from @testing-library/react, which is sufficient for a
 *    controlled form driven by onChange.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Contact2 } from '@/components/ui/contact-2'

const VALID_INPUT = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  subject: 'SAP implementation enquiry',
  message: 'We are evaluating SAP Cloud ERP and would like to discuss scope.',
}

/** Fill every required field so the zod schema passes and submit becomes enabled. */
function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText('Name *'), { target: { name: 'name', value: VALID_INPUT.name } })
  fireEvent.change(screen.getByLabelText('Email *'), { target: { name: 'email', value: VALID_INPUT.email } })
  fireEvent.change(screen.getByLabelText('Subject *'), { target: { name: 'subject', value: VALID_INPUT.subject } })
  fireEvent.change(screen.getByLabelText('Message *'), { target: { name: 'message', value: VALID_INPUT.message } })
}

const submitButton = () => screen.getByRole('button', { name: /send message|sending/i })

describe('Contact2 (live contact form)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renders every field the API route expects, with correct labels', () => {
    render(<Contact2 />)

    expect(screen.getByLabelText('Name *')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone')).toBeInTheDocument()
    expect(screen.getByLabelText('Email *')).toBeInTheDocument()
    expect(screen.getByLabelText('Subject *')).toBeInTheDocument()
    expect(screen.getByLabelText('Message *')).toBeInTheDocument()
    expect(screen.getByLabelText('Attachment')).toBeInTheDocument()
    expect(submitButton()).toBeInTheDocument()
  })

  it('marks the four required fields as required and leaves phone optional', () => {
    render(<Contact2 />)

    expect(screen.getByLabelText('Name *')).toBeRequired()
    expect(screen.getByLabelText('Email *')).toBeRequired()
    expect(screen.getByLabelText('Subject *')).toBeRequired()
    expect(screen.getByLabelText('Message *')).toBeRequired()
    expect(screen.getByLabelText('Phone')).not.toBeRequired()
  })

  it('uses the correct input types so mobile keyboards and mailto behave', () => {
    render(<Contact2 />)

    expect(screen.getByLabelText('Email *')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Phone')).toHaveAttribute('type', 'tel')
    expect(screen.getByLabelText('Attachment')).toHaveAttribute('type', 'file')
  })

  it('keeps submit disabled until the whole form validates', async () => {
    render(<Contact2 />)

    expect(submitButton()).toBeDisabled()

    // A partially filled form must stay disabled.
    fireEvent.change(screen.getByLabelText('Name *'), { target: { name: 'name', value: VALID_INPUT.name } })
    fireEvent.change(screen.getByLabelText('Email *'), { target: { name: 'email', value: VALID_INPUT.email } })
    await waitFor(() => expect(submitButton()).toBeDisabled())

    fillRequiredFields()
    await waitFor(() => expect(submitButton()).toBeEnabled())
  })

  it('keeps submit disabled when the email is malformed', async () => {
    render(<Contact2 />)

    fillRequiredFields()
    await waitFor(() => expect(submitButton()).toBeEnabled())

    fireEvent.change(screen.getByLabelText('Email *'), { target: { name: 'email', value: 'not-an-email' } })
    await waitFor(() => expect(submitButton()).toBeDisabled())
  })

  it('keeps submit disabled when the message is shorter than the schema minimum', async () => {
    render(<Contact2 />)

    fillRequiredFields()
    await waitFor(() => expect(submitButton()).toBeEnabled())

    fireEvent.change(screen.getByLabelText('Message *'), { target: { name: 'message', value: 'too short' } })
    await waitFor(() => expect(submitButton()).toBeDisabled())
  })

  it('POSTs the entered values to /api/contact as FormData', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ success: true }) })
    vi.stubGlobal('fetch', fetchMock)

    render(<Contact2 />)
    fillRequiredFields()
    await waitFor(() => expect(submitButton()).toBeEnabled())

    fireEvent.click(submitButton())

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/contact')
    expect(init.method).toBe('POST')
    expect(init.body).toBeInstanceOf(FormData)

    const body = init.body as FormData
    expect(body.get('name')).toBe(VALID_INPUT.name)
    expect(body.get('email')).toBe(VALID_INPUT.email)
    expect(body.get('subject')).toBe(VALID_INPUT.subject)
    expect(body.get('message')).toBe(VALID_INPUT.message)
  })

  it('shows the sending state and blocks double submission while in flight', async () => {
    let releaseFetch: (value: unknown) => void = () => {}
    const pending = new Promise((resolve) => {
      releaseFetch = resolve
    })
    const fetchMock = vi.fn().mockReturnValue(pending)
    vi.stubGlobal('fetch', fetchMock)

    render(<Contact2 />)
    fillRequiredFields()
    await waitFor(() => expect(submitButton()).toBeEnabled())

    fireEvent.click(submitButton())

    await waitFor(() => expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled())
    fireEvent.click(screen.getByRole('button', { name: /sending/i }))
    expect(fetchMock).toHaveBeenCalledTimes(1)

    releaseFetch({ json: async () => ({ success: true }) })
    await waitFor(() => expect(screen.getByText(/thank you/i)).toBeInTheDocument())
  })

  it('shows the success screen on a successful response and can return to a blank form', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => ({ success: true }) }))

    render(<Contact2 />)
    fillRequiredFields()
    await waitFor(() => expect(submitButton()).toBeEnabled())
    fireEvent.click(submitButton())

    await waitFor(() => {
      expect(screen.getByText(/thank you/i)).toBeInTheDocument()
      expect(screen.getByText(/your message has been sent successfully/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /send another message/i }))

    // Back on the form, cleared, and gated again.
    expect(screen.getByLabelText('Name *')).toHaveValue('')
    expect(screen.getByLabelText('Email *')).toHaveValue('')
    expect(screen.getByLabelText('Message *')).toHaveValue('')
    expect(submitButton()).toBeDisabled()
  })

  it('does not claim success and stays retryable when the API reports failure', async () => {
    // KNOWN PRODUCTION DEFECT (found while writing this test; NOT fixed in A1
    // because it needs a change to components/ui/contact-2.tsx, which is outside
    // this phase's file boundary):
    //
    //   On a failed submission the component calls
    //   `setErrors({ general: ... })` at contact-2.tsx:126 and :139, but no JSX
    //   branch ever renders `errors.general`. The user therefore gets NO feedback
    //   when /api/contact fails — the form simply goes quiet.
    //
    // This test deliberately asserts only what must hold whether or not that
    // defect is fixed: no false success screen, values preserved, retry possible.
    // It will keep passing once the error display is added.
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ json: async () => ({ success: false, message: 'Mail transport unavailable' }) })
    )

    render(<Contact2 />)
    fillRequiredFields()
    await waitFor(() => expect(submitButton()).toBeEnabled())
    fireEvent.click(submitButton())

    // The success screen replaces the whole form, so its absence is what proves
    // the failure path was taken rather than silently treated as success.
    await waitFor(() => expect(submitButton()).toBeEnabled())
    expect(screen.queryByText(/thank you/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/your message has been sent successfully/i)).not.toBeInTheDocument()

    // The user's input survives so they can retry without retyping.
    expect(screen.getByLabelText('Name *')).toHaveValue(VALID_INPUT.name)
    expect(screen.getByLabelText('Message *')).toHaveValue(VALID_INPUT.message)
  })

  it('links to the privacy policy from the consent line', () => {
    render(<Contact2 />)

    // NOTE: Phase C replaces this destination with /politika-privatnosti and
    // changes the wording. This assertion documents the CURRENT live state so the
    // change is visible in that phase's diff.
    const privacyLink = screen.getByRole('link', { name: /privacy policy/i })
    expect(privacyLink).toHaveAttribute('href', '/privacy')
  })

  it('shows the published contact details', () => {
    render(<Contact2 />)

    expect(screen.getByRole('link', { name: 'office@infinus.rs' })).toHaveAttribute(
      'href',
      'mailto:office@infinus.rs'
    )
    expect(screen.getByText(/Tresnjinog cveta 1, Belgrade, Serbia/i)).toBeInTheDocument()
  })

  it('associates every error-capable input with an accessible invalid state', () => {
    render(<Contact2 />)

    // No errors on first paint.
    for (const label of ['Name *', 'Email *', 'Subject *', 'Message *']) {
      expect(screen.getByLabelText(label)).toHaveAttribute('aria-invalid', 'false')
    }
  })
})
