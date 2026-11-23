/**
 * GA4 lead and contact-button tracking across the site, both languages.
 *
 *   · generate_lead from the homepage form and the Contact page form: one per enquiry the
 *     server confirms, with page and page_language only, never without consent.
 *   · cta_click on every contact button outside SAP vs Microsoft: one per click, with the
 *     button (`cta`), the page it was clicked on and its language.
 *
 * gtag is a spy and fetch is simulated: nothing here reaches Google or /api/contact.
 */
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import type { ComponentType } from 'react'

const nav = vi.hoisted(() => ({ pathname: '/', search: '' }))
vi.mock('next/navigation', () => ({
  usePathname: () => nav.pathname,
  useSearchParams: () => new URLSearchParams(nav.search),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), back: vi.fn() }),
}))

import { buildRecord, serializeConsent, CONSENT_COOKIE } from '@/lib/consent'
import { pageContextFromPath, isContactPath } from '@/lib/analytics'
import { getDictionary } from '@/content/dictionary'
import { CtaLink } from '@/components/analytics/CtaLink'
import { NavBarDemo } from '@/components/ui/navbar-demo'

import EnHome from '../../app/(en)/(site)/page'
import SrHome from '../../app/(sr)/sr/page'
import EnContact from '../../app/(en)/(site)/contact/page'
import SrContact from '../../app/(sr)/sr/contact/page'
import EnCase from '../../app/(en)/(site)/case-study/pharma1/page'
import SrCase from '../../app/(sr)/sr/case-study/pharma1/page'
import EnStarter from '../../app/(en)/(site)/sap-packaged-solutions/sap-starter-package/page'
import SrStarter from '../../app/(sr)/sr/sap-packaged-solutions/sap-starter-package/page'
import EnPulse from '../../app/(en)/(site)/projectpulse/page'
import SrPulse from '../../app/(sr)/sr/projectpulse/page'
import EnFaq from '../../app/(en)/(site)/faq/page'
import SrFaq from '../../app/(sr)/sr/faq/page'
import EnGrow from '../../app/(en)/(site)/grow/page'
import SrGrow from '../../app/(sr)/sr/grow/page'
import EnCfo from '../../app/(en)/(site)/grow/cfo/page'
import SrCfo from '../../app/(sr)/sr/grow/cfo/page'
import EnPs from '../../app/(en)/(site)/professional-services/page'
import SrPs from '../../app/(sr)/sr/professional-services/page'

function setConsent(analytics: boolean | null) {
  document.cookie = `${CONSENT_COOKIE}=; path=/; max-age=0`
  if (analytics === null) return
  document.cookie = `${CONSENT_COOKIE}=${serializeConsent(buildRecord({ analytics, marketing: false }, new Date()))}; path=/`
}

let gtag: ReturnType<typeof vi.fn>
const events = (name: string) => gtag.mock.calls.filter((c) => c[0] === 'event' && c[1] === name)
const respond = (impl: () => Promise<unknown>) =>
  vi.stubGlobal('fetch', vi.fn(async () => ({ json: impl }) as unknown as Response))

beforeEach(() => {
  gtag = vi.fn()
  window.gtag = gtag as unknown as Window['gtag']
  nav.pathname = '/'
})
afterEach(() => {
  setConsent(null)
  delete window.gtag
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function change(el: Element, value: string) {
  const name = (el as HTMLInputElement).name
  fireEvent.change(el, { target: { name, value } })
}

const ENQUIRY: Record<string, string> = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical Engines',
  phone: '+381 11 000 000',
  subject: 'SAP Cloud ERP evaluation',
  message: 'We are evaluating SAP Cloud ERP for our finance team.',
}
const PII = /Ada|example\.com|Analytical|evaluating|381|Cloud ERP evaluation/

function fill(scope: HTMLElement) {
  scope.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[name], textarea[name]').forEach((el) => {
    if (ENQUIRY[el.name] !== undefined) change(el, ENQUIRY[el.name])
  })
}

describe('page context comes from the path the visitor is on', () => {
  test.each([
    ['/', 'home', 'en'],
    ['/sr', 'home', 'sr'],
    ['/sr/', 'home', 'sr'],
    ['/contact', 'contact', 'en'],
    ['/sr/contact', 'contact', 'sr'],
    ['/insights/sap-vs-microsoft', 'sap-vs-microsoft', 'en'],
    ['/sr/insights/sap-vs-microsoft', 'sap-vs-microsoft', 'sr'],
    ['/grow', 'grow', 'en'],
    ['/sr/grow/cfo', 'grow-cfo', 'sr'],
    ['/professional-services', 'professional-services', 'en'],
    ['/sap-packaged-solutions/sap-starter-package', 'sap-starter-package', 'en'],
    ['/sr/case-study/pharma1', 'case-study-pharma1', 'sr'],
    ['/faq?x=1#top', 'faq', 'en'],
  ])('%s → %s, %s', (path, page, language) => {
    expect(pageContextFromPath(path)).toEqual({ page, language })
  })

  test('the Contact page is recognised in both languages, nothing else is', () => {
    expect(isContactPath('/contact')).toBe(true)
    expect(isContactPath('/sr/contact')).toBe(true)
    expect(isContactPath('/contact/')).toBe(true)
    expect(isContactPath('/careers')).toBe(false)
    expect(isContactPath('/contact-us')).toBe(false)
    expect(isContactPath('#contact-form')).toBe(false)
  })
})

describe.each([
  { language: 'en', Home: EnHome, path: '/' },
  { language: 'sr', Home: SrHome, path: '/sr' },
] as const)('$language homepage', ({ language, Home, path }) => {
  const copy = getDictionary(language).home

  function submit() {
    const section = document.getElementById('contact-form')!
    fill(section)
    fireEvent.click(within(section).getByRole('button', { name: copy.contactShort.submit }))
  }

  test('form confirmed by the server: exactly one generate_lead, page "home", no form data', async () => {
    setConsent(true)
    nav.pathname = path
    respond(async () => ({ success: true }))
    render(<Home />)
    submit()
    await waitFor(() => expect(screen.getByText(copy.contactShort.success.heading)).toBeInTheDocument())
    expect(events('generate_lead')).toEqual([['event', 'generate_lead', { page: 'home', page_language: language }]])
    expect(JSON.stringify(gtag.mock.calls)).not.toMatch(PII)
  })

  test('form refused by the server: no generate_lead', async () => {
    setConsent(true)
    respond(async () => ({ success: false }))
    render(<Home />)
    submit()
    await waitFor(() => expect(screen.getByText(copy.contactShort.error)).toBeInTheDocument())
    expect(events('generate_lead')).toHaveLength(0)
  })

  test('form confirmed, analytics refused: nothing at all', async () => {
    setConsent(false)
    respond(async () => ({ success: true }))
    render(<Home />)
    submit()
    await waitFor(() => expect(screen.getByText(copy.contactShort.success.heading)).toBeInTheDocument())
    expect(gtag).not.toHaveBeenCalled()
  })

  test('hero, about and industry contact buttons: one cta_click each, with page and language', () => {
    setConsent(true)
    nav.pathname = path
    render(<Home />)
    // The hero and the industry modal share the "Contact Us" label: the hero is the first
    // such link, and the modal's is the last one once the modal is open.
    fireEvent.click(screen.getAllByRole('link', { name: copy.hero.ctaLabel })[0])
    fireEvent.click(screen.getByText(copy.about.ctaLabel).closest('a')!)
    fireEvent.click(screen.getAllByText(copy.domains.items[0].label)[0])
    fireEvent.click(screen.getAllByRole('link', { name: copy.domains.modal.contact }).at(-1)!)
    const ctx = { page: 'home', page_language: language }
    expect(events('cta_click')).toEqual([
      ['event', 'cta_click', { cta: 'contact_us', ...ctx }],
      ['event', 'cta_click', { cta: 'about_contact', ...ctx }],
      ['event', 'cta_click', { cta: 'industry_contact', ...ctx }],
    ])
    expect(events('generate_lead')).toHaveLength(0)
  })

  test('without consent the buttons send nothing', () => {
    setConsent(null)
    render(<Home />)
    fireEvent.click(screen.getByRole('link', { name: copy.hero.ctaLabel }))
    setConsent(false)
    fireEvent.click(screen.getByRole('link', { name: copy.hero.ctaLabel }))
    expect(gtag).not.toHaveBeenCalled()
  })
})

describe.each([
  { language: 'en', Contact: EnContact, path: '/contact' },
  { language: 'sr', Contact: SrContact, path: '/sr/contact' },
] as const)('$language Contact page form', ({ language, Contact, path }) => {
  const copy = getDictionary(language).contact

  function submit() {
    const form = document.querySelector('form')!
    fill(form)
    fireEvent.click(within(form).getByRole('button', { name: copy.form.submit }))
  }

  test('one generate_lead per enquiry the server confirms, page "contact", no form data', async () => {
    setConsent(true)
    nav.pathname = path
    respond(async () => ({ success: true }))
    render(<Contact />)

    submit()
    await waitFor(() => expect(screen.getByText(copy.success.heading)).toBeInTheDocument())
    expect(events('generate_lead')).toEqual([['event', 'generate_lead', { page: 'contact', page_language: language }]])

    // "Send another": a second, separately confirmed enquiry is a second lead.
    fireEvent.click(screen.getByRole('button', { name: copy.success.sendAnother }))
    submit()
    await waitFor(() => expect(screen.getByText(copy.success.heading)).toBeInTheDocument())
    expect(events('generate_lead')).toHaveLength(2)
    expect(JSON.stringify(gtag.mock.calls)).not.toMatch(PII)
  })

  test('server refusal or network error: no generate_lead', async () => {
    setConsent(true)
    respond(async () => ({ success: false }))
    render(<Contact />)
    submit()
    await waitFor(() => expect(document.querySelector('form button[type="submit"]')).not.toBeDisabled())
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline') }))
    submit()
    await waitFor(() => expect(document.querySelector('form button[type="submit"]')).not.toBeDisabled())
    expect(screen.queryByText(copy.success.heading)).not.toBeInTheDocument()
    expect(events('generate_lead')).toHaveLength(0)
  })

  test('the enquiry the visitor typed is never written to the browser console', async () => {
    setConsent(true)
    const spies = (['log', 'info', 'warn', 'error', 'debug'] as const).map((m) => vi.spyOn(console, m).mockImplementation(() => {}))
    respond(async () => ({ success: true }))
    render(<Contact />)
    submit()
    await waitFor(() => expect(screen.getByText(copy.success.heading)).toBeInTheDocument())
    for (const spy of spies) expect(JSON.stringify(spy.mock.calls)).not.toMatch(PII)
  })

  test('confirmed, analytics refused: no generate_lead', async () => {
    setConsent(false)
    respond(async () => ({ success: true }))
    render(<Contact />)
    submit()
    await waitFor(() => expect(screen.getByText(copy.success.heading)).toBeInTheDocument())
    expect(gtag).not.toHaveBeenCalled()
  })
})

/**
 * Every contact link a page renders is tracked, once per click. Anchors are found by their
 * destination, so a contact link added later without tracking makes this fail.
 */
const contactLinks = (href: string) => Array.from(document.querySelectorAll<HTMLAnchorElement>(`main a, a`))
  .filter((a, i, all) => all.indexOf(a) === i && a.getAttribute('href') === href)

describe.each([
  { name: 'case study', En: EnCase, Sr: SrCase, path: '/case-study/pharma1', page: 'case-study-pharma1', cta: 'contact_us', count: 1 },
  { name: 'SAP Starter Package', En: EnStarter, Sr: SrStarter, path: '/sap-packaged-solutions/sap-starter-package', page: 'sap-starter-package', cta: 'book_discovery_call', count: 2 },
  { name: 'ProjectPulse', En: EnPulse, Sr: SrPulse, path: '/projectpulse', page: 'projectpulse', cta: 'book_discovery_call', count: 2 },
  { name: 'FAQ', En: EnFaq, Sr: SrFaq, path: '/faq', page: 'faq', cta: 'contact_us', count: 1 },
  { name: 'Grow', En: EnGrow, Sr: SrGrow, path: '/grow', page: 'grow', cta: 'send_inquiry', count: 1 },
  { name: 'Grow CFO', En: EnCfo, Sr: SrCfo, path: '/grow/cfo', page: 'grow-cfo', cta: 'send_inquiry', count: 1 },
  { name: 'Professional Services', En: EnPs, Sr: SrPs, path: '/professional-services', page: 'professional-services', cta: 'send_inquiry', count: 1 },
] as const)('$name: contact buttons', ({ En, Sr, path, page, cta, count }) => {
  test.each([
    { language: 'en', Page: En as ComponentType, at: path, href: '/contact' },
    { language: 'sr', Page: Sr as ComponentType, at: `/sr${path}`, href: '/sr/contact' },
  ])('$language: one cta_click per click, with button, page and language', ({ language, Page, at, href }) => {
    setConsent(true)
    nav.pathname = at
    render(<Page />)
    const links = contactLinks(href)
    expect(links).toHaveLength(count)
    links.forEach((a) => fireEvent.click(a))
    expect(events('cta_click')).toEqual(
      Array.from({ length: count }, () => ['event', 'cta_click', { cta, page, page_language: language }])
    )
  })
})

describe.each([
  { language: 'en', Page: EnFaq, at: '/faq' },
  { language: 'sr', Page: SrFaq, at: '/sr/faq' },
] as const)('$language FAQ email button', ({ language, Page, at }) => {
  test('one cta_click "email_us"', () => {
    setConsent(true)
    nav.pathname = at
    render(<Page />)
    const mail = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]'))
      .filter((a) => a.textContent === getDictionary(language).faq.cta.emailLabel)
    expect(mail).toHaveLength(1)
    fireEvent.click(mail[0])
    expect(events('cta_click')).toEqual([['event', 'cta_click', { cta: 'email_us', page: 'faq', page_language: language }]])
  })
})

describe('navigation Contact item', () => {
  test.each([
    { at: '/insights/sap-vs-microsoft', href: '/contact', page: 'sap-vs-microsoft', language: 'en' },
    { at: '/sr/grow', href: '/sr/contact', page: 'grow', language: 'sr' },
    { at: '/sr', href: '/sr/contact', page: 'home', language: 'sr' },
  ])('on $at: one nav_contact for the page the visitor is on', ({ at, href, page, language }) => {
    setConsent(true)
    nav.pathname = at
    render(<NavBarDemo />)
    const links = contactLinks(href)
    expect(links.length).toBeGreaterThan(0)
    fireEvent.click(links[0])
    expect(events('cta_click')).toEqual([['event', 'cta_click', { cta: 'nav_contact', page, page_language: language }]])
  })

  test('other navigation items send nothing', () => {
    setConsent(true)
    nav.pathname = '/'
    render(<NavBarDemo />)
    Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))
      .filter((a) => !isContactPath(a.getAttribute('href')!))
      .forEach((a) => fireEvent.click(a))
    expect(gtag).not.toHaveBeenCalled()
  })

  test('without consent: nothing', () => {
    setConsent(false)
    nav.pathname = '/'
    render(<NavBarDemo />)
    fireEvent.click(contactLinks('/contact')[0])
    expect(gtag).not.toHaveBeenCalled()
  })
})

describe('CtaLink', () => {
  test('the MythBusters "talk to a specialist" button reports its page and language', () => {
    setConsent(true)
    nav.pathname = '/sr/insights/sap-mythbusters'
    render(<CtaLink cta="talk_to_specialist" href="/sr/contact">x</CtaLink>)
    fireEvent.click(screen.getByRole('link', { name: 'x' }))
    expect(events('cta_click')).toEqual([
      ['event', 'cta_click', { cta: 'talk_to_specialist', page: 'sap-mythbusters', page_language: 'sr' }],
    ])
  })

  test('a caller onClick still runs, once, alongside the event', () => {
    setConsent(true)
    const onClick = vi.fn()
    render(<CtaLink cta="x" href="/contact" onClick={onClick}>go</CtaLink>)
    fireEvent.click(screen.getByRole('link', { name: 'go' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(events('cta_click')).toHaveLength(1)
  })
})
