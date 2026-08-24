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
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { getDictionary, enMythBustersLayout, srMythBustersLayout } from '@/content/dictionary'
import { buildMythBustersJsonLd } from '@/lib/mythbusters-jsonld'

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

  /**
   * Scoped to ONE instance now that the English page has two.
   *
   * A document-wide `getByLabelText` would throw on "found multiple elements", and loosening
   * it to `getAllByLabelText` would stop proving the thing that matters — that each form
   * carries the four approved English fields and no Country. So it asks a single instance.
   */
  test('its form keeps Role and has no Country', () => {
    const { container } = render(<EnglishMythBusters />)
    const form = container.querySelector('[data-testid="ebook-form-hero"]') as HTMLElement

    expect(within(form).getByLabelText('Full Name')).toBeInTheDocument()
    expect(within(form).getByLabelText('Business Email')).toBeInTheDocument()
    expect(within(form).getByLabelText('Company')).toBeInTheDocument()
    expect(within(form).getByLabelText('Role or Job Title – optional')).toBeInTheDocument()
    expect(within(form).queryByLabelText(/country|zemlja/i)).not.toBeInTheDocument()
  })

  /**
   * The English page now renders TWO instances, hero and closing.
   *
   * This assertion used to read "renders ONE form — the second instance is a Serbian
   * requirement", which was true when only the Serbian source asked for a top form. The owner
   * has since approved the same top-form conversion principle for English, so the old
   * assertion encoded a superseded product decision rather than a regression guard.
   *
   * What replaces it is the property that actually needs protecting with two instances on a
   * page: both are present, and their fields stay identical.
   */
  test('renders a form in the hero AND at the bottom', () => {
    const { container } = render(<EnglishMythBusters />)
    expect(container.querySelector('[data-testid="ebook-form-hero"]')).not.toBeNull()
    expect(container.querySelector('[data-testid="ebook-form-closing"]')).not.toBeNull()
    expect(container.querySelectorAll('[data-testid^="ebook-form-"]')).toHaveLength(2)
  })

  test('no duplicate DOM ids across the two English instances', () => {
    const { container } = render(<EnglishMythBusters />)
    const ids = Array.from(container.querySelectorAll('[id]')).map((el) => el.id)
    expect(ids.length).toBeGreaterThan(0)
    expect(new Set(ids).size, `duplicate ids: ${ids.filter((id, i) => ids.indexOf(id) !== i)}`).toBe(
      ids.length
    )
  })

  test('every English label binds to an input inside its OWN form instance', () => {
    const { container } = render(<EnglishMythBusters />)

    for (const testid of ['ebook-form-hero', 'ebook-form-closing']) {
      const form = container.querySelector(`[data-testid="${testid}"]`) as HTMLElement
      const labels = Array.from(form.querySelectorAll('label'))
      expect(labels.length, testid).toBeGreaterThan(0)

      for (const label of labels) {
        const target = label.htmlFor ? form.querySelector(`#${CSS.escape(label.htmlFor)}`) : null
        expect(target, `${testid}: "${label.textContent}" escaped its own form`).not.toBeNull()
      }
    }
  })

  /**
   * The mobile-only jump target.
   *
   * Desktop shows the form beside the copy, so the approved CTA is hidden there; below `lg` it
   * scrolls to the hero form. The anchor is only correct if its target exists and is
   * focusable — a bare `#id` jump moves the viewport but leaves focus on the link.
   */
  test('the mobile hero CTA targets the hero form, and that target can take focus', () => {
    const { container } = render(<EnglishMythBusters />)

    const cta = screen.getByRole('link', { name: enLayout.hero.cta })
    expect(cta).toHaveAttribute('href', '#ebook-hero')

    const target = container.querySelector('#ebook-hero') as HTMLElement
    expect(target).not.toBeNull()
    expect(target.tabIndex).toBe(-1)
    // The hero form is what it points at, not the closing one.
    expect(target.querySelector('[data-testid="ebook-form-hero"]')).not.toBeNull()
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
    // The subtitle wording is asserted in its own suite below.
    expect(screen.getByText(srLayout.assetCard.subtitle)).toBeInTheDocument()
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
      // The visible fields plus the honeypot's own label, which is present in the DOM for
      // bots and hidden from every real visitor — see components/security/HoneypotField.tsx.
      const labels = Array.from(form.querySelectorAll('label'))
      expect(labels.length).toBe(sr.form.fields.length + 1)

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

describe('one English e-book, served and described identically by both locales', () => {
  const EBOOK = '/downloads/SAP_Mythbusting_Campaign_E-Book_Infinus.pdf'

  test('the SERBIAN page states the e-book is English, before submission', () => {
    // The architecture is deliberate: a bilingual landing page over a single English asset.
    // This note is what keeps the Serbian half honest about it, and it renders above the
    // fields rather than on the success screen.
    expect(sr.form.languageNote).toContain('engleskom jeziku')
    expect(en.form.languageNote).toContain('available in English')

    const { container } = render(<SerbianMythBusters />)
    for (const testid of ['ebook-form-hero', 'ebook-form-closing']) {
      const form = container.querySelector(`[data-testid="${testid}"]`) as HTMLElement
      expect(within(form).getByText(sr.form.languageNote)).toBeInTheDocument()
    }
  })

  test('no Serbian-named or translated PDF asset was invented', () => {
    // There is one canonical file. A "-sr" or "-srp" variant would be a fabricated asset.
    const files = readdirSync(join(process.cwd(), 'public/downloads'))
    const ebooks = files.filter((f) => /mythbusting/i.test(f) && f.endsWith('.pdf'))
    expect(ebooks).toEqual(['SAP_Mythbusting_Campaign_E-Book_Infinus.pdf'])
  })

  test('BOTH landing pages describe the asset as inLanguage "en"', () => {
    for (const locale of ['en', 'sr'] as const) {
      const nodes = JSON.parse(buildMythBustersJsonLd(locale)) as Array<Record<string, unknown>>
      const document = nodes.find((node) => node['@type'] === 'DigitalDocument')

      expect(document, `${locale}: no DigitalDocument node`).toBeDefined()
      expect(document!.inLanguage, locale).toBe('en')
      expect(document!.encodingFormat, locale).toBe('application/pdf')

      // And both point at the same file.
      const media = document!.associatedMedia as Record<string, string>
      expect(media.contentUrl, locale).toContain(EBOOK)
    }
  })

  test('the page itself is still described in its own language', () => {
    // The asset is English on both halves; the PAGE is not. Conflating the two would
    // describe the Serbian document as English to crawlers.
    const srNodes = JSON.parse(buildMythBustersJsonLd('sr')) as Array<Record<string, unknown>>
    const webPage = srNodes.find((node) => node['@type'] === 'WebPage')
    expect(webPage!.inLanguage).toBe('sr-Latn-RS')
  })
})

describe('the asset card wording', () => {
  test('uses "Praktični vodič" — the owner picked the second of the two offered', () => {
    render(<SerbianMythBusters />)
    expect(screen.getByText('Praktični vodič')).toBeInTheDocument()
  })

  test('"Executive vodič" appears nowhere on the Serbian page or in its copy', () => {
    const { container } = render(<SerbianMythBusters />)
    expect(container.textContent).not.toContain('Executive vodič')
    expect(JSON.stringify(sr)).not.toContain('Executive vodič')
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
    // One per form instance, and the page now has two. EVERY one must point at /privacy —
    // `getAllBy` plus a loop over all of them is a stronger check than the old single lookup.
    const links = screen.getAllByRole('link', { name: 'Privacy Policy' })
    expect(links).toHaveLength(2)
    for (const link of links) expect(link).toHaveAttribute('href', '/privacy')
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
