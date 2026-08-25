/**
 * How the visitor actually GETS the e-book.
 *
 * ── The flow, and the two it replaced ──────────────────────────────────────────
 * Submit -> the PDF starts downloading -> the Thank You panel appears. No email is sent to
 * the visitor, and nothing is required of them to receive the file.
 *
 * Two earlier versions failed in opposite directions and both are pinned here so neither can
 * come back:
 *
 *   · the first auto-clicked the download anchor AND offered a download button for the same
 *     file, so one submission produced two downloads;
 *   · the second removed the auto-click entirely, which made the download a second manual
 *     step and left the analytics counting submissions rather than downloads.
 *
 * The owner then withdrew the delivery email as well, so the panel's "a copy is on its way"
 * claim, the `emailDelivered` flag behind it and the whole gated block are gone. The tests
 * that asserted that gating went with them: a promise the product no longer makes is not a
 * contract worth protecting.
 */
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Mock, MockInstance } from 'vitest'
import { EbookForm } from '@/components/mythbusters/EbookForm'
import { getDictionary } from '@/content/dictionary'

const sr = getDictionary('sr').mythBusters.form
const en = getDictionary('en').mythBusters.form

const EBOOK_HREF = '/downloads/SAP_Mythbusting_Campaign_E-Book_Infinus.pdf'

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

async function submitSerbian(body: Record<string, unknown> = { success: true }) {
  mockEndpoint(body)
  const result = render(<EbookForm copy={sr} locale="sr" placement="hero" />)
  fillSerbian()
  fireEvent.click(screen.getByRole('button', { name: sr.submit }))
  await waitFor(() => {
    expect(screen.getByTestId('ebook-success-hero')).toBeInTheDocument()
  })
  return result
}

async function submitEnglish(placement: 'hero' | 'closing' = 'closing') {
  mockEndpoint({ success: true })
  render(<EbookForm copy={en} locale="en" placement={placement} />)
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
  await waitFor(() => {
    expect(screen.getByTestId(`ebook-success-${placement}`)).toBeInTheDocument()
  })
}

describe('a successful submission downloads the PDF', () => {
  /**
   * Programmatic anchor clicks - `element.click()`.
   *
   * `fireEvent.click` dispatches a MouseEvent without going through `.click()`, so a human
   * click never reaches this spy. That asymmetry is what makes it a clean probe: it counts
   * only the downloads the COMPONENT starts.
   */
  let autoClicks: MockInstance<[], void>
  let gtag: Mock

  beforeEach(() => {
    autoClicks = vi.spyOn(HTMLAnchorElement.prototype, 'click')
    gtag = vi.fn()
    vi.stubGlobal('gtag', gtag)
  })
  afterEach(() => {
    autoClicks.mockRestore()
    vi.unstubAllGlobals()
  })

  test('the download starts automatically, exactly once', async () => {
    await submitSerbian()
    expect(autoClicks, 'one submission, one automatic download').toHaveBeenCalledTimes(1)
  })

  test('the Thank You panel renders alongside it', async () => {
    await submitSerbian()
    const panel = screen.getByTestId('ebook-success-hero')

    expect(within(panel).getByText(sr.success.heading)).toBeInTheDocument()
    expect(within(panel).getByText(sr.success.nextHeading)).toBeInTheDocument()
    expect(within(panel).getByRole('link', { name: sr.success.expertCta })).toBeInTheDocument()
    expect(within(panel).getByRole('link', { name: sr.success.contactCta })).toBeInTheDocument()
  })

  test('the manual button remains, as a fallback for a blocked download', async () => {
    await submitSerbian()
    const link = screen.getByRole('link', { name: sr.success.downloadLabel })

    expect(link).toHaveAttribute('href', EBOOK_HREF)
    expect(link).toHaveAttribute('download')
  })

  test('the automatic download fires download_resource once', async () => {
    await submitSerbian()

    const events = gtag.mock.calls.filter(([, name]) => name === 'download_resource')
    expect(events).toHaveLength(1)
    expect(events[0][0]).toBe('event')
    expect(events[0][2]).toMatchObject({ id: 'sap_mythbusters_ebook', placement: 'hero' })
  })

  /**
   * The fallback is a re-download, not a second conversion. One submission is one counted
   * download however many times the visitor uses the button afterwards.
   */
  test('using the fallback button does NOT count a second download', async () => {
    await submitSerbian()
    const link = screen.getByRole('link', { name: sr.success.downloadLabel })

    fireEvent.click(link)
    fireEvent.click(link)

    expect(gtag.mock.calls.filter(([, n]) => n === 'download_resource')).toHaveLength(1)
  })

  test('the closing instance reports its own placement', async () => {
    mockEndpoint({ success: true })
    render(<EbookForm copy={sr} locale="sr" placement="closing" />)
    fillSerbian()
    fireEvent.click(screen.getByRole('button', { name: sr.submit }))
    await waitFor(() => expect(screen.getByTestId('ebook-success-closing')).toBeInTheDocument())

    const events = gtag.mock.calls.filter(([, name]) => name === 'download_resource')
    expect(events[0][2]).toMatchObject({ placement: 'closing' })
  })

  test('a failed submission downloads nothing and counts nothing', async () => {
    mockEndpoint({ success: false })
    render(<EbookForm copy={sr} locale="sr" placement="hero" />)
    fillSerbian()
    fireEvent.click(screen.getByRole('button', { name: sr.submit }))

    await waitFor(() => {
      expect(screen.getByText(sr.error)).toBeInTheDocument()
    })
    expect(screen.queryByTestId('ebook-success-hero')).toBeNull()
    expect(autoClicks).not.toHaveBeenCalled()
    expect(gtag.mock.calls.filter(([, n]) => n === 'download_resource')).toHaveLength(0)
  })
})

/**
 * What the Thank You panel SAYS, now that the download is automatic.
 *
 * The panel used to read "Your e-book is ready" / "Use the button below to download", which
 * described the manual flow. By the time a visitor reads it the file is already downloading,
 * so that wording was not merely stale - it was wrong about something they could check in
 * their downloads folder.
 */
describe('the Thank You panel acknowledges the download already started', () => {
  beforeEach(() => {
    vi.stubGlobal('gtag', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('Serbian says the download has been started', async () => {
    await submitSerbian()
    const panel = screen.getByTestId('ebook-success-hero')

    expect(within(panel).getByText('Preuzimanje e-booka je pokrenuto.')).toBeInTheDocument()
    expect(
      within(panel).getByText('E-book bi trebalo automatski da se preuzme na vaš uređaj.')
    ).toBeInTheDocument()
    expect(within(panel).getByRole('link', { name: 'Preuzmite ponovo' })).toBeInTheDocument()
  })

  test('English says the download has started', async () => {
    await submitEnglish()
    const panel = screen.getByTestId('ebook-success-closing')

    expect(within(panel).getByText('Your e-book download has started.')).toBeInTheDocument()
    expect(
      within(panel).getByText('The e-book should download automatically to your device.')
    ).toBeInTheDocument()
    expect(within(panel).getByRole('link', { name: 'Download Again' })).toBeInTheDocument()
  })

  test('the superseded manual-download wording is gone from the copy', () => {
    const gone = [
      'Vaš e-book je spreman za preuzimanje.',
      'Kliknite na dugme ispod',
      'Preuzimanje počinje odmah nakon klika.',
      'Your e-book is ready',
      'Use the button below to download',
      'The download starts as soon as you click.',
    ]
    const serialised = JSON.stringify([sr.success, en.success])
    for (const phrase of gone) {
      expect(serialised, `still describes the old manual flow: "${phrase}"`).not.toContain(phrase)
    }
  })

  /**
   * The helper sentence says "the button below", so it has to actually be above the button.
   * Copy and layout agreeing is the whole point of rewriting both together.
   */
  test('the fallback helper is rendered before the button it refers to', async () => {
    await submitSerbian()
    const panel = screen.getByTestId('ebook-success-hero')

    const helper = within(panel).getByText(sr.success.downloadNote)
    const button = within(panel).getByRole('link', { name: sr.success.downloadLabel })
    expect(
      helper.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING,
      'the helper must precede the button'
    ).toBeTruthy()
  })

  /**
   * De-emphasised, not hidden. The conversion is complete; this is a recovery path.
   */
  test('the fallback button is present and reachable, not a primary CTA', async () => {
    await submitSerbian()
    const button = screen.getByRole('link', { name: sr.success.downloadLabel })

    expect(button).toBeVisible()
    expect(button).toHaveAttribute('download')
    // Outlined rather than filled: no primary fill class survives on it.
    expect(button.className).not.toMatch(/bg-primary/)
  })
})

/**
 * The panel must not promise an email, because none is sent.
 *
 * Asserted as absence of the WORDS a visitor would act on, not just absence of a removed
 * dictionary key: someone could reintroduce the sentence as a literal and every type-level
 * check would still pass.
 */
describe('nothing claims the e-book was emailed', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('the Serbian panel makes no email promise', async () => {
    await submitSerbian()
    const text = screen.getByTestId('ebook-success-hero').textContent ?? ''

    expect(text).not.toContain('e-mail')
    // Diacritic-free substring on purpose: it matches the withdrawn sentence whether or not
    // someone reintroduces it with different accents or casing.
    expect(text).not.toMatch(/Kopiju/i)
  })

  test('the English panel makes no email promise', async () => {
    await submitEnglish()
    const text = screen.getByTestId('ebook-success-closing').textContent ?? ''

    expect(text).not.toMatch(/email/i)
    expect(text).not.toMatch(/on its way/i)
  })

  test('the success copy carries no email strings at all', () => {
    for (const [name, copy] of [
      ['sr', sr.success],
      ['en', en.success],
    ] as const) {
      const keys = Object.keys(copy)
      expect(keys, `${name} success copy`).not.toContain('emailHeading')
      expect(keys, `${name} success copy`).not.toContain('emailBody')
      expect(keys, `${name} success copy`).not.toContain('emailFallback')
    }
  })

  /**
   * The panel used to key off `emailDelivered` from the endpoint. Nothing may depend on it
   * again: a response that still carries the field must change nothing at all.
   */
  test('an endpoint response carrying emailDelivered changes nothing', async () => {
    await submitSerbian({ success: true, emailDelivered: false })
    const panel = screen.getByTestId('ebook-success-hero')

    expect(panel).not.toHaveAttribute('data-email-delivered')
    expect(within(panel).getByRole('link', { name: sr.success.downloadLabel })).toBeInTheDocument()
    expect(within(panel).getByText(sr.success.heading)).toBeInTheDocument()
  })
})

/**
 * One asset, both locales. The page is bilingual; the e-book is not.
 */
describe('the same English PDF on both pages', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('Serbian and English download links are the identical href', async () => {
    await submitSerbian()
    const srHref = screen.getByRole('link', { name: sr.success.downloadLabel }).getAttribute('href')

    vi.unstubAllGlobals()
    await submitEnglish()
    const enHref = screen.getByRole('link', { name: en.success.downloadLabel }).getAttribute('href')

    expect(enHref).toBe(srHref)
    expect(enHref).toBe(EBOOK_HREF)
  })

  test('the Serbian form still states the asset is English, before the fields', () => {
    mockEndpoint({ success: true })
    const { container } = render(<EbookForm copy={sr} locale="sr" placement="hero" />)

    const note = screen.getByText(sr.languageNote)
    const form = container.querySelector('form') as HTMLElement
    expect(note).toBeInTheDocument()
    expect(
      note.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING,
      'the note must precede the fields'
    ).toBeTruthy()
  })
})

/**
 * With analytics consent withheld there is no `gtag`, and the download must still happen.
 * The tracking is a side effect of the download, never a precondition for it.
 */
describe('with analytics consent withheld', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('the automatic download still runs and nothing is sent', async () => {
    const autoClicks = vi.spyOn(HTMLAnchorElement.prototype, 'click')
    try {
      await submitSerbian()
      expect((window as unknown as { gtag?: unknown }).gtag).toBeUndefined()
      expect(autoClicks).toHaveBeenCalledTimes(1)
      expect(screen.getByRole('link', { name: sr.success.downloadLabel })).toHaveAttribute(
        'download'
      )
    } finally {
      autoClicks.mockRestore()
    }
  })
})
