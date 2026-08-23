/**
 * Copy anchors for the homepage.
 *
 * Almost every assertion in the previous version of this file was stale — it was
 * written against an earlier homepage and had been dead ever since the Vitest JSX
 * transform broke. Examples of what it asserted versus what the page actually
 * renders today:
 *
 *   "Driving Business Success through SAP Expertise"  → that string is the <title>
 *                                                       metadata, not the hero; the
 *                                                       hero h1 is "Turning SAP
 *                                                       Expertise into Business
 *                                                       Advantage"
 *   "Our Services"                                   → now "Our Expertise in Action"
 *   "Benefits from working with us"                  → now "Benefits working with us"
 *   a standalone "SAP Expertise" section              → no longer exists
 *   "European Focus" / "Hybrid Work Model" /
 *   "Competitive Pricing" / "Flexible Solutions"      → replaced by six different
 *                                                       benefit cards
 *   getByLabelText('Your Name *') etc.                → the join-team form uses no
 *                                                       <label> elements at all, so
 *                                                       these could never resolve
 *
 * This rewrite keeps a deliberately small set of anchors: the hero, the section
 * headings, the domain list, and the join-team form's fields and consent line. These
 * are the strings whose accidental loss would be a real regression, and they are the
 * ones Phase F must reproduce byte-identically when copy moves into dictionaries.
 * Section ordering is covered by home-sections-order.test.tsx.
 */
import { render, screen, within } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import HomePage from '../app/(en)/(site)/page'
import { SiteChrome } from '@/components/shell/SiteChrome'

describe('Homepage copy', () => {
  test('hero states the current positioning', () => {
    render(<HomePage />)

    expect(
      screen.getByRole('heading', { level: 1, name: /turning sap expertise into business advantage/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/empowering companies to work smarter and grow faster/i)).toBeInTheDocument()
    expect(screen.getAllByText(/sap gold partner/i).length).toBeGreaterThan(0)
  })

  test('section headings are present and unchanged', () => {
    render(<HomePage />)

    for (const name of [
      /^about us$/i,
      /^our sap expertise in action$/i,
      /^why infinus$/i,
      /^industry expertise$/i,
      /^join our team$/i,
    ]) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument()
    }
  })

  test('about section names the four SAP product pillars', () => {
    const { container } = render(<HomePage />)
    const about = container.querySelector('[data-section="about"]') as HTMLElement
    expect(about).not.toBeNull()

    // Several pillars appear twice in this section — once in the prose and once as a
    // badge — so assert "at least one occurrence" rather than uniqueness.
    for (const pillar of [
      /SAP Cloud ERP \(Public and Private\)/i,
      /SAP Business AI/i,
      /SAP Business Technology Platform \(BTP\)/i,
      /SAP Business Data Cloud/i,
    ]) {
      expect(within(about).getAllByText(pillar).length).toBeGreaterThan(0)
    }
  })

  test('the five service lines are listed', () => {
    const { container } = render(<HomePage />)
    const services = container.querySelector('[data-section="sap-services"]') as HTMLElement
    expect(services).not.toBeNull()

    for (const service of [
      'SAP Advisory & Consulting',
      'SAP Implementations',
      'SAP Application Management & Support',
      'SAP Integration & Process Optimization',
      'SAP Extensions & Innovation',
    ]) {
      expect(within(services).getByRole('heading', { name: service })).toBeInTheDocument()
    }
  })

  test('the six partnership benefits are listed', () => {
    const { container } = render(<HomePage />)
    const benefits = container.querySelector('[data-section="partnership-benefits"]') as HTMLElement
    expect(benefits).not.toBeNull()

    for (const benefit of [
      'Deep SAP Expertise',
      'Business Understanding',
      'Trusted Partnership',
      'End-to-End Capability',
      'Agility & Predictability',
      'Regional Presence, European Reach',
    ]) {
      expect(within(benefits).getByRole('heading', { name: benefit })).toBeInTheDocument()
    }
  })

  test('all nine industry domains are listed', () => {
    const { container } = render(<HomePage />)
    const domain = container.querySelector('[data-section="domain"]') as HTMLElement
    expect(domain).not.toBeNull()

    for (const industry of [
      'Retail',
      'Pharmaceuticals',
      'Wholesale and Distribution',
      'Consumer Goods',
      'Industrial Manufacturing',
      'Professional Services',
      'Travel',
      'Oil & Gas',
      'Telco',
    ]) {
      expect(within(domain).getByText(industry)).toBeInTheDocument()
    }
  })

  test('join-team section keeps its recruiting copy', () => {
    const { container } = render(<HomePage />)
    const join = container.querySelector('[data-section="join-team"]') as HTMLElement
    expect(join).not.toBeNull()

    // Grammar corrected in the final client-feedback phase: "continues" -> "continuous".
    expect(within(join).getByText(/due to continuous business expansion/i)).toBeInTheDocument()
    expect(within(join).getByText(/we will be glad to talk with you/i)).toBeInTheDocument()
  })

  test('join-team application form exposes its fields and submit control', () => {
    const { container } = render(<HomePage />)
    const join = container.querySelector('[data-section="join-team"]') as HTMLElement

    // These field captions are plain text, not <label for=...>, which is why the old
    // getByLabelText assertions could never pass. Recorded as-is; making them real
    // labels is an accessibility improvement for a later phase, not for A1.
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

  test('job application form uses the owner-approved acknowledgement wording', () => {
    const { container } = render(<HomePage />)
    const join = container.querySelector('[data-section="join-team"]') as HTMLElement

    // Exact owner-approved sentence. It is an informational acknowledgement, NOT the
    // cookie-consent mechanism — "agree"/"consent"/"accept" phrasings are wrong here.
    expect(
      within(join).getByText(/by submitting your application, you confirm that you have read our/i)
    ).toBeInTheDocument()
    expect(within(join).queryByText(/you agree to our/i)).not.toBeInTheDocument()
    expect(within(join).getByRole('link', { name: /privacy policy/i })).toHaveAttribute(
      'href',
      '/privacy'
    )
  })

  test('footer carries the company details and the privacy policy link', () => {
    // Footer comes from the shared chrome since Phase D, so compose it as production does.
    const { container } = render(
      <SiteChrome>
        <HomePage />
      </SiteChrome>
    )
    const footer = container.querySelector('footer') as HTMLElement
    expect(footer).not.toBeNull()

    expect(within(footer).getByText(/Trešnjinog cveta 1, 11070 Belgrade, Serbia/i)).toBeInTheDocument()
    expect(within(footer).getByRole('link', { name: 'office@infinus.co' })).toHaveAttribute(
      'href',
      'mailto:office@infinus.co'
    )
    expect(within(footer).getByRole('link', { name: /^privacy policy$/i })).toHaveAttribute(
      'href',
      '/privacy'
    )
  })

  test('footer offers a Cookie settings control on every page', () => {
    const { container } = render(
      <SiteChrome>
        <HomePage />
      </SiteChrome>
    )
    const footer = container.querySelector('footer') as HTMLElement

    // A button, not a link to a page: it reopens the consent dialog so a decision can
    // be changed or withdrawn at any time.
    const control = within(footer).getByRole('button', { name: /cookie settings/i })
    expect(control).toBeInTheDocument()
    expect(control.tagName).toBe('BUTTON')
  })
})
