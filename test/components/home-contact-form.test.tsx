/**
 * The homepage's short business enquiry form.
 *
 * Two things are worth guarding here, and they are the two the client was specific about:
 *
 *   1. what the form must NOT contain — no LinkedIn field and no CV upload. Those belong to
 *      the job application on /careers. If the two forms ever converge, the split the client
 *      asked for has quietly been undone, and this file is where that shows up.
 *   2. that it reuses /api/contact rather than growing a second contact backend, and sends
 *      the untranslated FormData keys that endpoint expects — including the `company` field
 *      the endpoint historically dropped on the floor.
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { HomeContactSection } from '@/components/home/HomeContactSection'
import { getDictionary } from '@/content/dictionary'

const en = getDictionary('en').home.contactShort
const sr = getDictionary('sr').home.contactShort

function fillValid() {
  fireEvent.change(screen.getByLabelText(/name \*/i), { target: { name: 'name', value: 'Ada Lovelace' } })
  fireEvent.change(screen.getByLabelText(/business email \*/i), {
    target: { name: 'email', value: 'ada@example.com' },
  })
  fireEvent.change(screen.getByLabelText(/^company$/i), { target: { name: 'company', value: 'Analytical Engines' } })
  fireEvent.change(screen.getByLabelText(/message \*/i), {
    target: { name: 'message', value: 'We are evaluating SAP Cloud ERP for our finance team.' },
  })
}

describe('homepage short contact form', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ json: async () => ({ success: true }) }) as unknown as Response)
    )
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('offers exactly the four approved fields', () => {
    render(<HomeContactSection copy={en} />)

    expect(screen.getByLabelText(/name \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/business email \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^company$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message \*/i)).toBeInTheDocument()
  })

  test('has NO LinkedIn field and NO file upload — those belong to Careers', () => {
    const { container } = render(<HomeContactSection copy={en} />)

    expect(screen.queryByLabelText(/linkedin/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/linkedin/i)).not.toBeInTheDocument()
    expect(container.querySelector('input[type="file"]')).toBeNull()
    expect(screen.queryByText(/resume|cv/i)).not.toBeInTheDocument()
  })

  test('does not expose a subject field', () => {
    // The API needs a subject; the client did not ask for the field. It is sent internally
    // instead of being shown — asserted positively in the submission test below.
    render(<HomeContactSection copy={en} />)
    expect(screen.queryByLabelText(/subject/i)).not.toBeInTheDocument()
  })

  test('the submit control reads "Contact Us", not a scheduling promise', () => {
    render(<HomeContactSection copy={en} />)

    expect(screen.getByRole('button', { name: /^contact us$/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /schedule a call/i })).not.toBeInTheDocument()
  })

  test('refuses to submit when the required fields are invalid', async () => {
    render(<HomeContactSection copy={en} />)

    fireEvent.click(screen.getByRole('button', { name: /^contact us$/i }))

    await waitFor(() => {
      expect(screen.getByText(en.validation.name)).toBeInTheDocument()
    })
    expect(screen.getByText(en.validation.email)).toBeInTheDocument()
    expect(screen.getByText(en.validation.message)).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  test('POSTs to /api/contact with the untranslated FormData keys, company included', async () => {
    render(<HomeContactSection copy={en} />)
    fillValid()
    fireEvent.click(screen.getByRole('button', { name: /^contact us$/i }))

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

    const [url, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toBe('/api/contact')
    expect(init.method).toBe('POST')

    const body = init.body as FormData
    expect(body.get('name')).toBe('Ada Lovelace')
    expect(body.get('email')).toBe('ada@example.com')
    expect(body.get('company')).toBe('Analytical Engines')
    expect(body.get('message')).toBe('We are evaluating SAP Cloud ERP for our finance team.')

    // Not a visible field, and long enough to satisfy the endpoint's min-5 rule.
    expect(String(body.get('subject')).length).toBeGreaterThanOrEqual(5)
  })

  test('shows a success state instead of the form once the send succeeds', async () => {
    render(<HomeContactSection copy={en} />)
    fillValid()
    fireEvent.click(screen.getByRole('button', { name: /^contact us$/i }))

    await waitFor(() => {
      expect(screen.getByText(en.success.heading)).toBeInTheDocument()
    })
    expect(screen.queryByRole('button', { name: /^contact us$/i })).not.toBeInTheDocument()
  })

  test('shows an error when the endpoint reports failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ json: async () => ({ success: false }) }) as unknown as Response)
    )
    render(<HomeContactSection copy={en} />)
    fillValid()
    fireEvent.click(screen.getByRole('button', { name: /^contact us$/i }))

    // The Contact page sets this state and never renders it. This form renders it.
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(en.error)
    })
  })
})

describe('homepage short contact form — Serbian', () => {
  test('renders Serbian copy and links to the Serbian Privacy Policy', () => {
    render(<HomeContactSection copy={sr} />)

    expect(screen.getByRole('button', { name: /^kontaktirajte nas$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /politiku privatnosti/i })).toHaveAttribute(
      'href',
      '/sr/politika-privatnosti'
    )
    expect(screen.queryByRole('link', { name: /^privacy policy$/i })).not.toBeInTheDocument()
  })
})
