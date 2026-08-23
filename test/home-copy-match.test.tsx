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
 * This rewrite keeps a deliberately small set of anchors: the hero, its call to action,
 * the section headings and the domain list. These are the strings whose accidental loss
 * would be a real regression.
 *
 * The join-team form's anchors USED to live here too. It moved to a page of its own in the
 * final client-feedback phase, so its assertions moved with it, to careers-page.test.tsx.
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

  test('hero offers a first-screen call to action pointing at Contact', () => {
    render(<HomePage />)

    // The English half of the pair. Its destination is locale-owned copy, so the Serbian
    // homepage renders the same control pointing at /sr/contact — asserted in
    // test/i18n/h1-copy.test.ts rather than here, where only English is rendered.
    expect(screen.getByRole('link', { name: /^contact us$/i })).toHaveAttribute('href', '/contact')
  })

  test('section headings are present and unchanged', () => {
    render(<HomePage />)

    for (const name of [
      /^about us$/i,
      /^our sap expertise in action$/i,
      /^why infinus$/i,
      /^industry expertise$/i,
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
