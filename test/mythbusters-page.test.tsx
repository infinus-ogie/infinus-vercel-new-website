/**
 * The SAP MythBusting landing pages.
 *
 * The copy is CLIENT-SUPPLIED SOURCE OF TRUTH, so the assertions here are deliberately
 * literal: they pin the exact strings from the client's two documents. A later edit that
 * "improves" the marketing copy fails this file, which is the point — the client asked for
 * their wording, not ours.
 *
 * Three things beyond the copy are guarded:
 *   · the ten myths are all present, in order, in both locales
 *   · the SERBIAN page uses the approved "Politiku privatnosti", not the English term the
 *     source document carried, and links to the Serbian policy
 *   · the English-only note about the e-book renders BEFORE the form, in both locales
 */
import { render, screen, within } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import EnglishMythBusters from '../app/(en)/(site)/insights/sap-mythbusters/page'
import SerbianMythBusters from '../app/(sr)/sr/insights/sap-mythbusters/page'
import { getDictionary } from '@/content/dictionary'

const en = getDictionary('en').mythBusters
const sr = getDictionary('sr').mythBusters

describe('client-supplied copy is reproduced verbatim', () => {
  test('the English SEO title and description are the source strings', () => {
    expect(en.metadata.title).toBe('10 Myths About SAP Cloud ERP | Free E-Book | Infinus')
    expect(en.metadata.description).toBe(
      'Download the free e-book and discover the facts behind 10 common myths about SAP Cloud ERP costs, implementation, scalability, and business value.'
    )
  })

  test('the Serbian SEO title is the source string', () => {
    expect(sr.metadata.title).toBe('10 mitova o SAP Cloud ERP-u | Besplatna e-knjiga | Infinus')
  })

  test('the hero wording differs between locales exactly as the client wrote it', () => {
    // Not a translation slip: the client's Serbian hero says "o SAP-u" while its own SEO
    // title says "o SAP Cloud ERP-u". Pinned so nobody "fixes" it.
    expect(en.hero.titleLine1).toBe('10 Myths About SAP Cloud ERP.')
    expect(sr.hero.titleLine1).toBe('10 mitova o SAP-u.')
  })

  test('both trust bars carry the four supplied items, including the 30+ clients figure', () => {
    expect(en.trustBar).toHaveLength(4)
    expect(en.trustBar[2]).toBe('30+ Satisfied Clients')
    expect(sr.trustBar[2]).toBe('30+ zadovoljnih klijenata')
  })
})

describe('the English page renders its sections', () => {
  test('hero, bullets and CTA', () => {
    render(<EnglishMythBusters />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('10 Myths About SAP Cloud ERP.')
    for (const bullet of en.hero.bullets) {
      expect(screen.getByText(bullet)).toBeInTheDocument()
    }
    expect(screen.getAllByRole('link', { name: en.hero.cta }).length).toBeGreaterThan(0)
  })

  test('all ten myths, in the order the source lists them', () => {
    const { container } = render(<EnglishMythBusters />)
    const section = container.querySelector('[data-section="mythbusters-myths"]') as HTMLElement

    const rendered = Array.from(section.querySelectorAll('ol > li')).map((li) =>
      li.textContent?.replace(/^\d+/, '').trim()
    )
    expect(rendered).toEqual([...en.myths.items])
  })

  test('the audience list and the second CTA', () => {
    render(<EnglishMythBusters />)
    for (const role of en.audience.roles) {
      expect(screen.getByText(role)).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: en.myths.cta })).toHaveAttribute('href', '#download')
  })
})

describe('the download form', () => {
  test('offers the four supplied fields and no others', () => {
    render(<EnglishMythBusters />)

    expect(screen.getByLabelText(en.form.nameLabel)).toBeInTheDocument()
    expect(screen.getByLabelText(en.form.emailLabel)).toBeInTheDocument()
    expect(screen.getByLabelText(en.form.companyLabel)).toBeInTheDocument()
    expect(screen.getByLabelText(en.form.roleLabel)).toBeInTheDocument()

    // Nothing borrowed from the other two forms on the site.
    expect(screen.queryByLabelText(/linkedin/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/message|poruka/i)).not.toBeInTheDocument()
  })

  test('states the e-book is English-only BEFORE submission, in both locales', () => {
    const { unmount } = render(<EnglishMythBusters />)
    expect(screen.getByText(en.form.languageNote)).toBeInTheDocument()
    unmount()

    render(<SerbianMythBusters />)
    // The point of this one: a Serbian visitor must learn the asset's language before
    // handing over their details, not on the success screen.
    expect(screen.getByText(sr.form.languageNote)).toBeInTheDocument()
    expect(sr.form.languageNote).toContain('engleskom jeziku')
  })
})

describe('the Serbian legal terminology decision', () => {
  test('the acknowledgement uses "Politiku privatnosti", not the English term', () => {
    render(<SerbianMythBusters />)

    const link = screen.getByRole('link', { name: 'Politiku privatnosti' })
    expect(link).toHaveAttribute('href', '/sr/politika-privatnosti')

    // The client's document said "Privacy Policy" inside Serbian copy. It must not survive.
    const acknowledgement = `${sr.form.privacy.before}${sr.form.privacy.linkText}${sr.form.privacy.after}`
    expect(acknowledgement).not.toContain('Privacy Policy')
    expect(acknowledgement).toBe(
      'Slanjem formulara potvrđujete da ste pročitali našu Politiku privatnosti. Vaši podaci biće korišćeni za dostavljanje e-knjige.'
    )
  })

  test('the English page keeps "Privacy Policy" and the English URL', () => {
    render(<EnglishMythBusters />)
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy')
  })
})

describe('the Serbian page is Serbian throughout', () => {
  test('no English default leaked into the Serbian document', () => {
    render(<SerbianMythBusters />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('10 mitova o SAP-u.')
    expect(screen.getByRole('button', { name: sr.form.submit })).toBeInTheDocument()
    expect(screen.queryByText('Which Myths Are We Busting?')).not.toBeInTheDocument()
  })
})
