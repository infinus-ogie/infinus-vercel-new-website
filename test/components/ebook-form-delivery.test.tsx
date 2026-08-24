/**
 * What the e-book success panel is allowed to CLAIM.
 *
 * A submission and its convenience email are two independent outcomes, and the panel must
 * not blur them. Two failure modes matter here and they pull in opposite directions:
 *
 *   · claiming "a copy is on its way" when the send failed is a promise the visitor can
 *     check against their inbox and find false
 *   · turning a failed convenience copy into an error state misrepresents what happened —
 *     the lead was captured, the download is right there, and nothing the visitor did went
 *     wrong
 *
 * So the panel is gated on the endpoint's `emailDelivered` boolean, and both branches are
 * asserted: what appears, and what must not.
 */
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { EbookForm } from '@/components/mythbusters/EbookForm'
import { getDictionary } from '@/content/dictionary'

const sr = getDictionary('sr').mythBusters.form
const en = getDictionary('en').mythBusters.form

function mockEndpoint(body: Record<string, unknown>) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ json: async () => body }) as unknown as Response)
  )
}

function fillSerbian() {
  fireEvent.change(screen.getByLabelText('Ime'), { target: { name: 'name', value: 'Ana Anić' } })
  fireEvent.change(screen.getByLabelText('Poslovna e-mail adresa'), {
    target: { name: 'email', value: 'ana@primer.rs' },
  })
  fireEvent.change(screen.getByLabelText('Kompanija'), {
    target: { name: 'company', value: 'Primer d.o.o.' },
  })
  fireEvent.change(screen.getByLabelText('Zemlja'), {
    target: { name: 'country', value: 'Srbija' },
  })
}

async function submitSerbian(body: Record<string, unknown>) {
  mockEndpoint(body)
  const result = render(<EbookForm copy={sr} locale="sr" placement="hero" />)
  fillSerbian()
  fireEvent.click(screen.getByRole('button', { name: sr.submit }))
  await waitFor(() => {
    expect(screen.getByTestId('ebook-success-hero')).toBeInTheDocument()
  })
  return result
}

describe('when the delivery email succeeded', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('the panel may say a copy was sent', async () => {
    await submitSerbian({ success: true, emailDelivered: true })

    const panel = screen.getByTestId('ebook-success-hero')
    expect(panel).toHaveAttribute('data-email-delivered', 'true')
    expect(within(panel).getByText(sr.success.emailHeading)).toBeInTheDocument()
    expect(within(panel).getByText(sr.success.emailBody)).toBeInTheDocument()
    expect(within(panel).queryByText(sr.success.emailFallback)).not.toBeInTheDocument()
  })
})

describe('when the delivery email failed', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('the submission is still a SUCCESS, not an error', async () => {
    await submitSerbian({ success: true, emailDelivered: false })

    const panel = screen.getByTestId('ebook-success-hero')
    expect(within(panel).getByText(sr.success.heading)).toBeInTheDocument()
    // No error styling, no alert, nothing implying the visitor did something wrong.
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(within(panel).queryByText(sr.error)).not.toBeInTheDocument()
  })

  test('it does NOT claim an email was sent', async () => {
    await submitSerbian({ success: true, emailDelivered: false })

    const panel = screen.getByTestId('ebook-success-hero')
    expect(panel).toHaveAttribute('data-email-delivered', 'false')
    expect(within(panel).queryByText(sr.success.emailHeading)).not.toBeInTheDocument()
    expect(within(panel).queryByText(sr.success.emailBody)).not.toBeInTheDocument()
    // Belt and braces: the promise must not survive anywhere in the rendered panel.
    expect(panel.textContent).not.toContain('putem e-maila')
  })

  test('it shows the neutral fallback instead', async () => {
    await submitSerbian({ success: true, emailDelivered: false })

    const panel = screen.getByTestId('ebook-success-hero')
    expect(within(panel).getByText(sr.success.emailFallback)).toBeInTheDocument()
    expect(sr.success.emailFallback).toBe('E-book možete odmah preuzeti pomoću dugmeta ispod.')
  })

  test('the download is still offered, and still points at the English PDF', async () => {
    await submitSerbian({ success: true, emailDelivered: false })

    const link = screen.getByRole('link', { name: sr.success.downloadLabel })
    expect(link).toHaveAttribute(
      'href',
      '/downloads/SAP_Mythbusting_Campaign_E-Book_Infinus.pdf'
    )
    expect(link).toHaveAttribute('download')
  })
})

describe('a malformed or older response understates rather than overstates', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('a missing emailDelivered field is treated as NOT delivered', async () => {
    // The safe default: never claim the email went out on the strength of an absent field.
    await submitSerbian({ success: true })

    const panel = screen.getByTestId('ebook-success-hero')
    expect(panel).toHaveAttribute('data-email-delivered', 'false')
    expect(within(panel).getByText(sr.success.emailFallback)).toBeInTheDocument()
  })

  test('a truthy non-boolean does not count as delivered', async () => {
    await submitSerbian({ success: true, emailDelivered: 'yes' })
    expect(screen.getByTestId('ebook-success-hero')).toHaveAttribute(
      'data-email-delivered',
      'false'
    )
  })
})

describe('the English half behaves the same way', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('English also gates its email claim on actual delivery', async () => {
    mockEndpoint({ success: true, emailDelivered: false })
    render(<EbookForm copy={en} locale="en" placement="closing" />)

    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { name: 'name', value: 'Ada Lovelace' },
    })
    fireEvent.change(screen.getByLabelText('Business Email'), {
      target: { name: 'email', value: 'ada@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Company'), {
      target: { name: 'company', value: 'Analytical Engines' },
    })
    fireEvent.click(screen.getByRole('button', { name: en.submit }))

    await waitFor(() => {
      expect(screen.getByTestId('ebook-success-closing')).toBeInTheDocument()
    })

    const panel = screen.getByTestId('ebook-success-closing')
    expect(within(panel).queryByText(en.success.emailHeading)).not.toBeInTheDocument()
    expect(within(panel).getByText(en.success.emailFallback)).toBeInTheDocument()
    expect(en.success.emailFallback).toBe(
      'You can download the e-book immediately using the button below.'
    )
  })
})
