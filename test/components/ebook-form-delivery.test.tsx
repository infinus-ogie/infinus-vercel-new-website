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
import type { Mock, MockInstance } from 'vitest'
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

/**
 * WHEN the PDF is allowed to leave the browser, and what gets counted when it does.
 *
 * ── The bug this suite exists for ──────────────────────────────────────────────
 * Submitting used to download the file twice over. A `useEffect` synthetically clicked the
 * success panel's anchor the moment the panel mounted, so the browser saved the PDF on its
 * own — and then the same panel offered a "Download the E-Book" button for the identical
 * file. The client's Serbian LP/Thank-You source describes one flow: the e-book is ready, the
 * user clicks, the download starts.
 *
 * The analytics had the matching problem. `download_resource` fired inside the submit handler,
 * so it counted submissions and would have counted them even if nobody ever took the file.
 *
 * These assert the corrected sequence from both ends: nothing downloads until the button is
 * clicked, and nothing is counted until something downloads.
 */
describe('the download is user-initiated, not automatic', () => {
  /**
   * Every PROGRAMMATIC anchor click — `element.click()`.
   *
   * `fireEvent.click` dispatches a MouseEvent without going through `.click()`, so a real
   * user click never touches this spy. That asymmetry is exactly what makes it a clean probe
   * for the bug: it sees the code clicking the link for the user, and nothing else.
   */
  let anchorClicks: MockInstance<[], void>
  let gtag: Mock

  beforeEach(() => {
    anchorClicks = vi.spyOn(HTMLAnchorElement.prototype, 'click')
    gtag = vi.fn()
    vi.stubGlobal('gtag', gtag)
  })
  afterEach(() => {
    anchorClicks.mockRestore()
    vi.unstubAllGlobals()
  })

  test('a valid submit shows the success panel but starts NO download', async () => {
    await submitSerbian({ success: true, emailDelivered: true })

    expect(screen.getByTestId('ebook-success-hero')).toBeInTheDocument()
    // The regression, stated directly: nothing may click the anchor on our behalf.
    expect(anchorClicks, 'submitting must not trigger a download').not.toHaveBeenCalled()
  })

  test('and counts no download event on submit', async () => {
    await submitSerbian({ success: true, emailDelivered: true })

    expect(
      gtag.mock.calls.filter(([, name]) => name === 'download_resource'),
      'a submission is not a download'
    ).toHaveLength(0)
  })

  test('the success panel offers a real download link', async () => {
    await submitSerbian({ success: true, emailDelivered: true })
    const link = screen.getByRole('link', { name: sr.success.downloadLabel })

    expect(link).toHaveAttribute('href', '/downloads/SAP_Mythbusting_Campaign_E-Book_Infinus.pdf')
    expect(link).toHaveAttribute('download')
  })

  test('clicking it fires download_resource exactly once, with the placement', async () => {
    await submitSerbian({ success: true, emailDelivered: true })
    fireEvent.click(screen.getByRole('link', { name: sr.success.downloadLabel }))

    const events = gtag.mock.calls.filter(([, name]) => name === 'download_resource')
    expect(events).toHaveLength(1)
    expect(events[0][0]).toBe('event')
    expect(events[0][2]).toMatchObject({ id: 'sap_mythbusters_ebook', placement: 'hero' })
  })

  test('two clicks are two real downloads, so two events — never a double-fire from one', async () => {
    await submitSerbian({ success: true, emailDelivered: true })
    const link = screen.getByRole('link', { name: sr.success.downloadLabel })

    fireEvent.click(link)
    expect(gtag.mock.calls.filter(([, n]) => n === 'download_resource')).toHaveLength(1)
    fireEvent.click(link)
    expect(gtag.mock.calls.filter(([, n]) => n === 'download_resource')).toHaveLength(2)
  })

  test('the closing form reports its own placement', async () => {
    mockEndpoint({ success: true, emailDelivered: true })
    render(<EbookForm copy={sr} locale="sr" placement="closing" />)
    fillSerbian()
    fireEvent.click(screen.getByRole('button', { name: sr.submit }))
    await waitFor(() => expect(screen.getByTestId('ebook-success-closing')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('link', { name: sr.success.downloadLabel }))
    const events = gtag.mock.calls.filter(([, name]) => name === 'download_resource')
    expect(events[0][2]).toMatchObject({ placement: 'closing' })
  })

  test('the truthful fallback still governs the panel, download unaffected', async () => {
    await submitSerbian({ success: true, emailDelivered: false })
    const panel = screen.getByTestId('ebook-success-hero')

    expect(panel).toHaveAttribute('data-email-delivered', 'false')
    expect(within(panel).getByText(sr.success.emailFallback)).toBeInTheDocument()
    // A failed convenience copy must not take the download away.
    expect(within(panel).getByRole('link', { name: sr.success.downloadLabel })).toHaveAttribute(
      'download'
    )
    expect(anchorClicks).not.toHaveBeenCalled()
  })
})

/**
 * Consent gating, asserted rather than assumed.
 *
 * components/consent/AnalyticsGate.tsx only injects gtag once analytics consent is granted, so
 * `typeof window.gtag === 'function'` is the gate itself. With consent withheld there is no
 * function — and clicking download must still download, silently.
 */
describe('with analytics consent withheld', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('the download works and nothing is sent', async () => {
    await submitSerbian({ success: true, emailDelivered: true })
    expect((window as unknown as { gtag?: unknown }).gtag).toBeUndefined()

    const link = screen.getByRole('link', { name: sr.success.downloadLabel })
    // Must not throw: the tracking is a side effect of the click, not a precondition for it.
    expect(() => fireEvent.click(link)).not.toThrow()
    expect(link).toHaveAttribute('download')
  })
})

/**
 * One asset, both locales. The page is bilingual; the e-book is not.
 */
describe('the PDF is the same English file on both pages', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('Serbian and English success panels link to the identical href', async () => {
    await submitSerbian({ success: true, emailDelivered: true })
    const srHref = screen
      .getByRole('link', { name: sr.success.downloadLabel })
      .getAttribute('href')

    vi.unstubAllGlobals()
    mockEndpoint({ success: true, emailDelivered: true })
    render(<EbookForm copy={en} locale="en" placement="closing" />)
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { name: 'name', value: 'Ann Example' },
    })
    fireEvent.change(screen.getByLabelText('Business Email'), {
      target: { name: 'email', value: 'ann@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Company'), {
      target: { name: 'company', value: 'Example Ltd' },
    })
    fireEvent.click(screen.getByRole('button', { name: en.submit }))
    await waitFor(() => expect(screen.getByTestId('ebook-success-closing')).toBeInTheDocument())

    const enHref = screen
      .getByRole('link', { name: en.success.downloadLabel })
      .getAttribute('href')

    expect(enHref).toBe(srHref)
    expect(enHref).toBe('/downloads/SAP_Mythbusting_Campaign_E-Book_Infinus.pdf')
  })
})
