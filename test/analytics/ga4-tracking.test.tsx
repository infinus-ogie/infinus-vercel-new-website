/**
 * GA4 tracking: the measurement id, consent gating, page views and the two campaign events.
 *
 * gtag is a spy and fetch is simulated, so nothing here reaches Google or /api/contact.
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

const nav = vi.hoisted(() => ({ pathname: '/insights/sap-vs-microsoft', search: '' }))
vi.mock('next/navigation', () => ({
  usePathname: () => nav.pathname,
  useSearchParams: () => new URLSearchParams(nav.search),
}))

import {
  normalizeGaMeasurementId,
  DEFAULT_GA_MEASUREMENT_ID,
  buildRecord,
  serializeConsent,
  CONSENT_COOKIE,
} from '@/lib/consent'
import { trackEvent } from '@/lib/analytics'
import GAFast from '@/app/_components/GAFast'
import EnglishPage from '../../app/(en)/(site)/insights/sap-vs-microsoft/page'
import SerbianPage from '../../app/(sr)/sr/insights/sap-vs-microsoft/page'
import { HomeContactSection } from '@/components/home/HomeContactSection'
import { getDictionary } from '@/content/dictionary'

function setConsent(analytics: boolean | null) {
  document.cookie = `${CONSENT_COOKIE}=; path=/; max-age=0`
  if (analytics === null) return
  document.cookie = `${CONSENT_COOKIE}=${serializeConsent(buildRecord({ analytics, marketing: false }, new Date()))}; path=/`
}

let gtag: ReturnType<typeof vi.fn>
const events = (name: string) => gtag.mock.calls.filter((c) => c[0] === 'event' && c[1] === name)

beforeEach(() => {
  gtag = vi.fn()
  window.gtag = gtag as unknown as Window['gtag']
  nav.pathname = '/insights/sap-vs-microsoft'
  nav.search = ''
})
afterEach(() => {
  setConsent(null)
  delete window.gtag
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('the measurement id', () => {
  test('a trailing newline (the production bug) is trimmed away', () => {
    expect(normalizeGaMeasurementId('G-S0YZ6MZWK1\n')).toBe('G-S0YZ6MZWK1')
    expect(normalizeGaMeasurementId('  G-S0YZ6MZWK1 \r\n')).toBe('G-S0YZ6MZWK1')
  })

  test('missing or malformed values fall back to the property id, never reach a script', () => {
    expect(normalizeGaMeasurementId(undefined)).toBe(DEFAULT_GA_MEASUREMENT_ID)
    expect(normalizeGaMeasurementId('')).toBe(DEFAULT_GA_MEASUREMENT_ID)
    expect(normalizeGaMeasurementId("G-ABC'); alert(1); ('")).toBe(DEFAULT_GA_MEASUREMENT_ID)
    expect(normalizeGaMeasurementId('UA-12345-1')).toBe(DEFAULT_GA_MEASUREMENT_ID)
  })
})

describe('trackEvent honours the stored decision at the moment of sending', () => {
  test('no decision: nothing is sent', () => {
    setConsent(null)
    expect(trackEvent('cta_click', { cta: 'x' })).toBe(false)
    expect(gtag).not.toHaveBeenCalled()
  })

  test('analytics refused or withdrawn: nothing is sent, even with gtag still loaded', () => {
    setConsent(false)
    expect(trackEvent('cta_click', { cta: 'x' })).toBe(false)
    expect(gtag).not.toHaveBeenCalled()
  })

  test('analytics allowed: the event goes to gtag', () => {
    setConsent(true)
    expect(trackEvent('cta_click', { cta: 'x' })).toBe(true)
    expect(gtag).toHaveBeenCalledWith('event', 'cta_click', { cta: 'x' })
  })
})

describe('GAFast sends exactly one page_view, when the gate opens', () => {
  test('one on mount; route changes are left to GA4 Enhanced Measurement', () => {
    const { rerender } = render(<GAFast />)
    expect(events('page_view')).toHaveLength(1)
    expect(events('page_view')[0][2]).toMatchObject({ page_path: window.location.pathname + window.location.search })

    rerender(<GAFast />)
    nav.pathname = '/sr/insights/sap-vs-microsoft'
    nav.search = 'utm_source=qa'
    rerender(<GAFast />)
    expect(events('page_view')).toHaveLength(1)
  })
})

describe.each([
  { language: 'en', Page: EnglishPage },
  { language: 'sr', Page: SerbianPage },
] as const)('$language page: cta_click', ({ language, Page }) => {
  const label = getDictionary(language).sapVsMicrosoft.closing.cta

  test('with consent: one cta_click with cta, page and page_language', () => {
    setConsent(true)
    render(<Page />)
    fireEvent.click(screen.getByRole('link', { name: label }))
    expect(events('cta_click')).toEqual([
      ['event', 'cta_click', { cta: 'book_meeting', page: 'sap-vs-microsoft', page_language: language }],
    ])
    // The jump to the form is not a page view.
    expect(events('page_view')).toHaveLength(0)
  })

  test('without consent, or after withdrawal: nothing', () => {
    setConsent(null)
    render(<Page />)
    fireEvent.click(screen.getByRole('link', { name: label }))
    setConsent(false)
    fireEvent.click(screen.getByRole('link', { name: label }))
    expect(gtag).not.toHaveBeenCalled()
  })

  test('the link still points at the form', () => {
    render(<Page />)
    expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', '#contact-form')
  })
})

describe.each(['en', 'sr'] as const)('%s form: generate_lead', (language) => {
  const copy = getDictionary(language).home.contactShort
  const lead = { page: 'sap-vs-microsoft', language }

  function fillAndSubmit() {
    const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[name], textarea[name]')
    const values: Record<string, string> = {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      company: 'Analytical Engines',
      message: 'We are evaluating SAP Cloud ERP for our finance team.',
    }
    inputs.forEach((el) => {
      if (values[el.name] !== undefined) fireEvent.change(el, { target: { name: el.name, value: values[el.name] } })
    })
    fireEvent.click(screen.getByRole('button', { name: copy.submit }))
  }

  const respond = (impl: () => Promise<unknown>) =>
    vi.stubGlobal('fetch', vi.fn(async () => ({ json: impl }) as unknown as Response))

  test('server confirms: exactly one generate_lead, page and language only', async () => {
    setConsent(true)
    respond(async () => ({ success: true }))
    render(<HomeContactSection copy={copy} leadTracking={lead} />)
    fillAndSubmit()
    await waitFor(() => expect(screen.getByText(copy.success.heading)).toBeInTheDocument())
    expect(events('generate_lead')).toEqual([['event', 'generate_lead', { page: 'sap-vs-microsoft', page_language: language }]])
    expect(JSON.stringify(gtag.mock.calls)).not.toMatch(/Ada|example\.com|Analytical|evaluating/)
  })

  test('server refuses: no generate_lead', async () => {
    setConsent(true)
    respond(async () => ({ success: false }))
    render(<HomeContactSection copy={copy} leadTracking={lead} />)
    fillAndSubmit()
    await waitFor(() => expect(screen.getByText(copy.error)).toBeInTheDocument())
    expect(events('generate_lead')).toHaveLength(0)
  })

  test('network error: no generate_lead', async () => {
    setConsent(true)
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline') }))
    render(<HomeContactSection copy={copy} leadTracking={lead} />)
    fillAndSubmit()
    await waitFor(() => expect(screen.getByText(copy.error)).toBeInTheDocument())
    expect(events('generate_lead')).toHaveLength(0)
  })

  test('confirmed, but analytics refused: no generate_lead', async () => {
    setConsent(false)
    respond(async () => ({ success: true }))
    render(<HomeContactSection copy={copy} leadTracking={lead} />)
    fillAndSubmit()
    await waitFor(() => expect(screen.getByText(copy.success.heading)).toBeInTheDocument())
    expect(gtag).not.toHaveBeenCalled()
  })

  test('the homepage passes no leadTracking, so it sends no lead event', async () => {
    setConsent(true)
    respond(async () => ({ success: true }))
    render(<HomeContactSection copy={copy} />)
    fillAndSubmit()
    await waitFor(() => expect(screen.getByText(copy.success.heading)).toBeInTheDocument())
    expect(events('generate_lead')).toHaveLength(0)
  })
})
