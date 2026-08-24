/**
 * The SAP MythBusting landing pages.
 *
 * The copy is CLIENT-SUPPLIED SOURCE OF TRUTH, so the assertions are deliberately literal:
 * they pin the exact strings from the client's documents. A later edit that "improves" the
 * marketing copy fails this file, which is the point.
 *
 * ── The two halves are DIFFERENT PAGES ──────────────────────────────────────────
 * Not a translation pair. The English page follows "eng verzija.docx"; the Serbian page
 * follows the newer "LP_copy_structure_INFINUS_RS.docx", which replaced the earlier Serbian
 * document with a different conversion structure. These tests assert that divergence
 * deliberately, so nobody later "restores parity" and undoes the client's newer design.
 */
import { render, screen, within } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import EnglishMythBusters from '../app/(en)/(site)/insights/sap-mythbusters/page'
import SerbianMythBusters from '../app/(sr)/sr/insights/sap-mythbusters/page'
import { getDictionary, enMythBustersLayout, srMythBustersLayout } from '@/content/dictionary'

const en = getDictionary('en').mythBusters
const sr = getDictionary('sr').mythBusters
const enLayout = enMythBustersLayout(en)
const srLayout = srMythBustersLayout(sr)

describe('client-supplied copy is reproduced verbatim', () => {
  test('the English SEO title and description are the source strings', () => {
    expect(en.metadata.title).toBe('10 Myths About SAP Cloud ERP | Free E-Book | Infinus')
    expect(en.metadata.description).toBe(
      'Download the free e-book and discover the facts behind 10 common myths about SAP Cloud ERP costs, implementation, scalability, and business value.'
    )
  })

  test('the Serbian SEO metadata still comes from the OLDER source', () => {
    // "LP_copy_structure_INFINUS_RS.docx" carries no SEO metadata, so the approved title and
    // description from "srp. verzija.docx" survive. That is the only place the older Serbian
    // document still governs.
    expect(sr.metadata.title).toBe('10 mitova o SAP Cloud ERP-u | Besplatna e-knjiga | Infinus')
    expect(sr.metadata.description).toContain('Preuzmite besplatnu e-knjigu')
  })

  test('the Serbian hero is the NEW document, not the old one', () => {
    expect(srLayout.hero.title).toBe('Donosite ERP odluke na osnovu činjenica – ne mitova')
    expect(srLayout.hero.badge).toBe('Besplatan e-book | PDF | Odmah dostupan')
    // The superseded hero headline must not survive anywhere.
    expect(JSON.stringify(sr)).not.toContain('10 mitova o SAP-u.')
  })
})

describe('the English page is unchanged by the Serbian rework', () => {
  test('hero, bullets and CTA', () => {
    render(<EnglishMythBusters />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('10 Myths About SAP Cloud ERP.')
    for (const bullet of enLayout.hero.bullets) {
      expect(screen.getByText(bullet)).toBeInTheDocument()
    }
  })

  test('keeps its four-metric trust bar, including the 70% claim', () => {
    render(<EnglishMythBusters />)
    expect(screen.getByText('70% of Consultants with 10+ Years of SAP Experience')).toBeInTheDocument()
    expect(screen.getByText('30+ Satisfied Clients')).toBeInTheDocument()
  })

  test('still lists all ten myths, in the source order', () => {
    const { container } = render(<EnglishMythBusters />)
    const section = container.querySelector('[data-section="mythbusters-myths"]') as HTMLElement

    const rendered = Array.from(section.querySelectorAll('ol > li')).map((li) =>
      li.textContent?.replace(/^\d+/, '').trim()
    )
    expect(rendered).toEqual([...enLayout.myths.items])
  })

  test('its form keeps Role and has no Country', () => {
    render(<EnglishMythBusters />)

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Business Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Company')).toBeInTheDocument()
    expect(screen.getByLabelText('Role or Job Title – optional')).toBeInTheDocument()
    expect(screen.queryByLabelText(/country|zemlja/i)).not.toBeInTheDocument()
  })

  test('renders ONE form — the second instance is a Serbian requirement', () => {
    const { container } = render(<EnglishMythBusters />)
    expect(container.querySelectorAll('[data-testid^="ebook-form-"]')).toHaveLength(1)
  })
})

describe('the Serbian page follows the new conversion structure', () => {
  test('renders every section the new document specifies', () => {
    const { container } = render(<SerbianMythBusters />)
    for (const section of [
      'mythbusters-hero',
      'mythbusters-trust',
      'mythbusters-audience',
      'mythbusters-contents',
      'mythbusters-preview',
      'mythbusters-why-infinus',
      'mythbusters-why-now',
      'mythbusters-faq',
      'mythbusters-form',
    ]) {
      expect(container.querySelector(`[data-section="${section}"]`), section).not.toBeNull()
    }
  })

  test('the trust bar is the new statement plus two logos, NOT the old four metrics', () => {
    const { container } = render(<SerbianMythBusters />)
    const bar = container.querySelector('[data-section="mythbusters-trust"]') as HTMLElement

    expect(within(bar).getByText(srLayout.trustBar.statement)).toBeInTheDocument()
    expect(within(bar).getByAltText('SAP Gold Partner')).toBeInTheDocument()
    expect(within(bar).getByAltText('Infinus')).toBeInTheDocument()

    // The superseded metrics must not reappear on this page.
    expect(within(bar).queryByText(/70%/)).not.toBeInTheDocument()
    expect(within(bar).queryByText(/30\+/)).not.toBeInTheDocument()
  })

  test('shows the FOUR myth/fact previews, not the ten-myth list', () => {
    const { container } = render(<SerbianMythBusters />)
    const preview = container.querySelector('[data-section="mythbusters-preview"]') as HTMLElement

    for (const item of srLayout.preview.items) {
      expect(within(preview).getByText(item.myth)).toBeInTheDocument()
      expect(within(preview).getByText(item.fact)).toBeInTheDocument()
    }
    expect(within(preview).getByText('...i još šest mitova u besplatnom vodiču.')).toBeInTheDocument()
    // Exactly four, so nobody pads the section out to five for visual symmetry.
    expect(srLayout.preview.items).toHaveLength(4)
  })

  test('renders the FAQ as visible question and answer pairs', () => {
    const { container } = render(<SerbianMythBusters />)
    const faq = container.querySelector('[data-section="mythbusters-faq"]') as HTMLElement

    for (const item of srLayout.faq.items) {
      expect(within(faq).getByText(item.question)).toBeInTheDocument()
      expect(within(faq).getByText(item.answer)).toBeInTheDocument()
    }
  })

  test('shows the asset card with the real e-book cover', () => {
    render(<SerbianMythBusters />)

    const cover = screen.getByAltText(srLayout.assetCard.coverAlt) as HTMLImageElement
    expect(cover).toBeInTheDocument()
    // Derived from page 1 of the actual download, not a stand-in.
    expect(decodeURIComponent(cover.src)).toContain('sap-mythbusting-ebook-cover')
    expect(screen.getByText(srLayout.assetCard.title)).toBeInTheDocument()
    expect(screen.getByText('Executive vodič')).toBeInTheDocument()
  })

  test('carries the final CTA and the why-Infinus reasons', () => {
    render(<SerbianMythBusters />)
    expect(screen.getByText(srLayout.finalCta.heading)).toBeInTheDocument()
    for (const reason of srLayout.whyInfinus.reasons) {
      expect(screen.getByText(reason)).toBeInTheDocument()
    }
  })
})

describe('two form instances, one per the new source', () => {
  test('the Serbian page renders a form in the hero AND at the bottom', () => {
    const { container } = render(<SerbianMythBusters />)
    expect(container.querySelector('[data-testid="ebook-form-hero"]')).not.toBeNull()
    expect(container.querySelector('[data-testid="ebook-form-closing"]')).not.toBeNull()
  })

  test('no duplicate DOM ids across the two instances', () => {
    const { container } = render(<SerbianMythBusters />)
    const ids = Array.from(container.querySelectorAll('[id]')).map((el) => el.id)
    expect(ids.length).toBeGreaterThan(0)
    expect(new Set(ids).size, `duplicate ids: ${ids.filter((id, i) => ids.indexOf(id) !== i)}`).toBe(
      ids.length
    )
  })

  test('every label binds to an input inside its OWN form instance', () => {
    const { container } = render(<SerbianMythBusters />)

    for (const testid of ['ebook-form-hero', 'ebook-form-closing']) {
      const form = container.querySelector(`[data-testid="${testid}"]`) as HTMLElement
      const labels = Array.from(form.querySelectorAll('label'))
      expect(labels.length).toBe(srLayout ? sr.form.fields.length : 0)

      for (const label of labels) {
        const target = container.querySelector(`#${CSS.escape(label.htmlFor)}`)
        expect(target, `label "${label.textContent}" points at nothing`).not.toBeNull()
        // The binding must not reach across into the other form.
        expect(form.contains(target as Node), `label "${label.textContent}" escapes its form`).toBe(
          true
        )
      }
    }
  })

  test('the Serbian form asks for Zemlja and NOT for a role', () => {
    const { container } = render(<SerbianMythBusters />)
    const form = container.querySelector('[data-testid="ebook-form-hero"]') as HTMLElement

    expect(within(form).getByLabelText('Ime')).toBeInTheDocument()
    expect(within(form).getByLabelText('Poslovna e-mail adresa')).toBeInTheDocument()
    expect(within(form).getByLabelText('Kompanija')).toBeInTheDocument()
    expect(within(form).getByLabelText('Zemlja')).toBeInTheDocument()
    expect(within(form).queryByLabelText(/funkcija|pozicija|role/i)).not.toBeInTheDocument()
  })

  test('all four Serbian fields are required — the new source marks none optional', () => {
    expect(sr.form.fields.map((f) => f.key)).toEqual(['name', 'email', 'company', 'country'])
    expect(sr.form.fields.every((f) => f.required)).toBe(true)
  })

  test('the English field set is untouched by that change', () => {
    expect(en.form.fields.map((f) => f.key)).toEqual(['name', 'email', 'company', 'role'])
    expect(en.form.fields.find((f) => f.key === 'role')?.required).toBe(false)
  })
})

describe('truthfulness about the e-book language', () => {
  test('BOTH locales state the e-book is English, above the form', () => {
    // A Serbian e-book was announced but not supplied: the attached PDF is byte-identical to
    // the English one. Until a real Serbian PDF arrives this note must stay, and must stay
    // true.
    expect(sr.form.languageNote).toContain('engleskom jeziku')
    expect(en.form.languageNote).toContain('available in English')

    render(<SerbianMythBusters />)
    expect(screen.getAllByText(sr.form.languageNote).length).toBeGreaterThan(0)
  })
})

describe('the Serbian legal terminology decision', () => {
  test('the acknowledgement uses "Politiku privatnosti" beside BOTH forms', () => {
    const { container } = render(<SerbianMythBusters />)

    for (const testid of ['ebook-form-hero', 'ebook-form-closing']) {
      const form = container.querySelector(`[data-testid="${testid}"]`) as HTMLElement
      const link = within(form).getByRole('link', { name: 'Politiku privatnosti' })
      expect(link).toHaveAttribute('href', '/sr/politika-privatnosti')
    }

    const acknowledgement = `${sr.form.privacy.before}${sr.form.privacy.linkText}${sr.form.privacy.after}`
    expect(acknowledgement).not.toContain('Privacy Policy')
  })

  test('the FAQ answer about data points at the Serbian policy terminology', () => {
    const dataAnswer = srLayout.faq.items.find((i) => i.question.startsWith('Kako se koriste'))
    expect(dataAnswer?.answer).toContain('Politikom privatnosti')
  })

  test('the English page keeps "Privacy Policy" and the English URL', () => {
    render(<EnglishMythBusters />)
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy')
  })
})

describe('the Serbian page is Serbian throughout', () => {
  test('no English default leaked into the Serbian document', () => {
    render(<SerbianMythBusters />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Donosite ERP odluke na osnovu činjenica'
    )
    expect(screen.queryByText('Which Myths Are We Busting?')).not.toBeInTheDocument()
    expect(screen.queryByText(/Download the Free E-Book/)).not.toBeInTheDocument()
  })
})
