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

/**
 * Read the trust band as a user agent would: each cell's text, or — when the cell is carried
 * by a mark instead of words — that mark's accessible name.
 *
 * The SAP Gold Partner cell is artwork. Its approved string lives in the image's `alt` rather
 * than in a caption underneath, because the badge already sets those words and printing them
 * again is the duplication the band was asked to stop. So `textContent` alone would report an
 * empty first cell and prove nothing; this reports what is actually announced.
 *
 * Shared by both locales, which is itself part of the contract — the two bands are now one
 * component and must read identically.
 */
function readBandCells(bar: HTMLElement): string[] {
  return Array.from(bar.querySelectorAll('li')).map((cell) => {
    const text = (cell.textContent ?? '').replace(/\s+/g, ' ').trim()
    if (text) return text
    return (cell.querySelector('img')?.getAttribute('alt') ?? '').trim()
  })
}

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

  /**
   * All four approved strings must ship, in order — but they are no longer all plain text.
   *
   * Two things changed in the band. Each metric's leading figure is now set larger than the
   * words after it, so "30+ Satisfied Clients" is two elements rather than one text node; that
   * is a LINE BREAK, not an edit. And "SAP Gold Partner" is rendered as the certification
   * badge, because the band used to show that credential twice — once as artwork beside the
   * row and once as words inside it. Its approved string is the image's accessible name now.
   *
   * So this reads each item the way a user agent would: its text if it has any, otherwise the
   * accessible name of the mark that replaces it. That is a stronger assertion than the old
   * single-node lookup — it catches a split that drops or reorders a word, AND it fails if the
   * badge ever loses the alt that carries the credential to a screen reader.
   */
  test('keeps its four-metric trust bar, including the 70% claim', () => {
    const { container } = render(<EnglishMythBusters />)
    const bar = container.querySelector('[data-section="mythbusters-trust"]') as HTMLElement

    const rendered = readBandCells(bar)

    expect(rendered).toEqual([...enLayout.trustBar])
    expect(rendered).toContain('70% of Consultants with 10+ Years of SAP Experience')
    expect(rendered).toContain('30+ Satisfied Clients')
  })

  /**
   * The de-duplication itself, asserted directly: exactly ONE element on the page announces
   * the SAP Gold Partner credential. Without this the badge and a text item could drift back
   * into both being rendered and every other assertion here would still pass.
   */
  test('announces the SAP Gold Partner credential exactly once', () => {
    const { container } = render(<EnglishMythBusters />)
    const bar = container.querySelector('[data-section="mythbusters-trust"]') as HTMLElement

    const mentions = Array.from(bar.querySelectorAll('img, li')).filter((el) => {
      const name = el.tagName === 'IMG' ? el.getAttribute('alt') : el.textContent
      return (name ?? '').trim() === 'SAP Gold Partner'
    })

    expect(mentions).toHaveLength(1)
    expect(mentions[0].tagName, 'the credential should be the badge, not a text row').toBe('IMG')
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

/**
 * Where the two approved Serbian hero paragraphs are rendered.
 *
 * BOTH are now out of the hero — the owner's final call, after the hero still read as too
 * dense with one of them left behind. The hero keeps eyebrow, headline, subtitle and value
 * points; the prose reads below the trust band.
 *
 * The risk in a move like that is quiet loss: a paragraph that gets summarised, trimmed to
 * fit, or simply dropped when someone later tidies the section it landed in. These lock the
 * placement AND the wording, which is why they compare against the dictionary rather than
 * against a string typed into the test.
 */
/**
 * One trust band, two pages.
 *
 * The locales used to render genuinely different components here — metrics on one side,
 * a statement plus two logos on the other — and they drifted apart every time either was
 * touched. They are now the same component with the same shape, and only the strings differ.
 *
 * This asserts the SHAPE is shared and the STRINGS are each locale's own, which is the
 * distinction the brief draws: visual parity, not copy parity.
 */
describe('the trust band is one shared system', () => {
  test('both locales render four cells, in the same structure', () => {
    const enBar = render(<EnglishMythBusters />).container.querySelector(
      '[data-section="mythbusters-trust"]'
    ) as HTMLElement
    const enCells = readBandCells(enBar)

    const srBar = render(<SerbianMythBusters />).container.querySelector(
      '[data-section="mythbusters-trust"]'
    ) as HTMLElement
    const srCells = readBandCells(srBar)

    expect(enCells).toHaveLength(4)
    expect(srCells).toHaveLength(4)
    expect(enCells).toEqual([...enLayout.trustBar])
    expect(srCells).toEqual([...srLayout.trustBar])
  })

  test('the first cell is the SAP artwork on BOTH pages, and the figures line up', () => {
    for (const [name, Page, items] of [
      ['en', EnglishMythBusters, enLayout.trustBar],
      ['sr', SerbianMythBusters, srLayout.trustBar],
    ] as const) {
      const bar = render(<Page />).container.querySelector(
        '[data-section="mythbusters-trust"]'
      ) as HTMLElement
      const cells = Array.from(bar.querySelectorAll('li'))

      expect(cells[0].querySelector('img'), `${name}: cell 1 is the badge`).not.toBeNull()
      expect(items[0]).toBe('SAP Gold Partner')

      // Cells 2-4 lead with their figure, which is what makes the row scannable.
      for (const index of [1, 2, 3]) {
        const text = (cells[index].textContent ?? '').trim()
        expect(text, `${name}: cell ${index + 1} leads with a figure`).toMatch(/^(30\+|70%)/)
      }
    }
  })

  test('no generic decorative icons survive in either band', () => {
    for (const [name, Page] of [
      ['en', EnglishMythBusters],
      ['sr', SerbianMythBusters],
    ] as const) {
      const bar = render(<Page />).container.querySelector(
        '[data-section="mythbusters-trust"]'
      ) as HTMLElement
      // The badge is an <img>; the retired lucide icons rendered as inline <svg>.
      expect(bar.querySelectorAll('svg'), `${name}: no icon noise`).toHaveLength(0)
    }
  })
})

describe('the Serbian hero prose, relocated below the trust band', () => {
  const paragraphs = srLayout.hero.paragraphs

  test('the hero renders NEITHER paragraph', () => {
    const { container } = render(<SerbianMythBusters />)
    const hero = container.querySelector('[data-section="mythbusters-hero"]') as HTMLElement

    for (const paragraph of paragraphs) {
      expect(within(hero).queryByText(paragraph), paragraph.slice(0, 40)).toBeNull()
    }
  })

  test('the hero editorial is down to eyebrow, headline, subtitle and value points', () => {
    const { container } = render(<SerbianMythBusters />)
    const hero = container.querySelector('[data-section="mythbusters-hero"]') as HTMLElement

    expect(within(hero).getByText(srLayout.hero.badge)).toBeInTheDocument()
    expect(within(hero).getByRole('heading', { level: 1 })).toHaveTextContent(srLayout.hero.title)
    expect(within(hero).getByText(srLayout.hero.subtitle)).toBeInTheDocument()
    for (const benefit of srLayout.hero.benefits) {
      expect(within(hero).getByText(benefit)).toBeInTheDocument()
    }
  })

  test('both paragraphs render VERBATIM, in source order, in the context section', () => {
    const { container } = render(<SerbianMythBusters />)
    const section = container.querySelector('[data-section="mythbusters-context"]') as HTMLElement

    expect(section, 'the relocation target must exist').not.toBeNull()

    const rendered = Array.from(section.querySelectorAll('p')).map((p) =>
      (p.textContent ?? '').trim()
    )
    // Exact equality, in order: a summarised, re-punctuated or reordered copy fails here.
    expect(rendered).toEqual(paragraphs.map((p) => p.trim()))
  })

  test('the context block sits between the trust band and the audience section', () => {
    const { container } = render(<SerbianMythBusters />)
    const order = Array.from(container.querySelectorAll('[data-section]')).map((el) =>
      el.getAttribute('data-section')
    )

    const band = order.indexOf('mythbusters-trust')
    const moved = order.indexOf('mythbusters-context')
    const audience = order.indexOf('mythbusters-audience')

    expect(moved, 'relocated prose must follow the trust band').toBeGreaterThan(band)
    expect(moved, 'and precede "Da li je ovaj vodič za vas?"').toBeLessThan(audience)
  })

  test('each paragraph appears exactly once on the page', () => {
    const { container } = render(<SerbianMythBusters />)
    for (const paragraph of paragraphs) {
      const hits = Array.from(container.querySelectorAll('p')).filter(
        (el) => (el.textContent ?? '').trim() === paragraph.trim()
      )
      expect(hits, paragraph.slice(0, 40)).toHaveLength(1)
    }
  })
})

/**
 * The redundant asset metadata is gone from the Serbian hero.
 *
 * The right-hand column used to print the e-book title, a subtitle, a "Šta dobijate" heading
 * and four metadata items UNDER the cover — so the hero named the same product three times:
 * as artwork, as a metadata panel, and as the form that hands it over. Only the cover and the
 * form remain.
 *
 * The dictionary copy is deliberately NOT deleted, so this asserts on what renders rather than
 * on what exists.
 */
describe('the Serbian hero conversion column', () => {
  test('shows the cover but none of the asset-metadata copy', () => {
    const { container } = render(<SerbianMythBusters />)
    const hero = container.querySelector('[data-section="mythbusters-hero"]') as HTMLElement
    const card = srLayout.assetCard

    const cover = within(hero).getByAltText(card.coverAlt) as HTMLImageElement
    expect(decodeURIComponent(cover.src)).toContain('sap-mythbusting-ebook-cover')

    for (const gone of [card.title, card.subtitle, card.whatYouGetHeading, ...card.items]) {
      expect(within(hero).queryByText(gone), gone).toBeNull()
    }
  })

  test('drops the three reassurance lines from the hero form', () => {
    const { container } = render(<SerbianMythBusters />)
    const hero = container.querySelector('[data-section="mythbusters-hero"]') as HTMLElement

    for (const line of srLayout.formAssurances) {
      expect(within(hero).queryByText(line), line).toBeNull()
    }
  })

  test('but keeps the privacy acknowledgement and the English-asset note', () => {
    const { container } = render(<SerbianMythBusters />)
    const hero = container.querySelector('[data-section="mythbusters-hero"]') as HTMLElement

    // Commitments, not reassurance decoration — removing these would be a legal/clarity
    // regression rather than a simplification.
    expect(within(hero).getByText(sr.form.languageNote)).toBeInTheDocument()
    expect(
      within(hero).getByRole('link', { name: sr.form.privacy.linkText })
    ).toBeInTheDocument()
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

  /**
   * The trust band's content decision was reversed by the owner.
   *
   * This page briefly showed a one-line statement beside the SAP and Infinus marks; it now
   * shows the same four proofs as the English page, in the wording of the FIRST approved
   * Serbian document (restored from 3d852ad~1 — not a fresh translation of the English).
   * The previous version of this test asserted the opposite, which is why it is rewritten
   * rather than extended.
   */
  test('the trust bar is the four approved metrics, NOT the statement and two logos', () => {
    const { container } = render(<SerbianMythBusters />)
    const bar = container.querySelector('[data-section="mythbusters-trust"]') as HTMLElement

    expect(readBandCells(bar)).toEqual([...srLayout.trustBar])

    // The superseded presentation must not come back alongside it.
    expect(
      within(bar).queryByText(/Poverenje kompanija/),
      'the withdrawn statement'
    ).not.toBeInTheDocument()
    expect(within(bar).queryByAltText('Infinus'), 'the Infinus mark').not.toBeInTheDocument()
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

  /* The title/subtitle assertions that used to live here moved out with the asset-metadata
     panel itself — see "the Serbian hero conversion column", which asserts that copy is now
     absent. What survives is the part that still matters: the real cover, from the real PDF. */
  test('shows the real e-book cover', () => {
    render(<SerbianMythBusters />)

    const cover = screen.getByAltText(srLayout.assetCard.coverAlt) as HTMLImageElement
    expect(cover).toBeInTheDocument()
    // Derived from page 1 of the actual download, not a stand-in.
    expect(decodeURIComponent(cover.src)).toContain('sap-mythbusting-ebook-cover')
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
  /**
   * The asset-metadata panel no longer renders — the hero was naming the same product three
   * times — so this asserts the DICTIONARY rather than the page.
   *
   * The choice it protects is still live: offered "Executive vodič" and "Praktični vodič", the
   * owner picked the second. Keeping the assertion on the copy means the decision survives
   * even while the string is off-screen, and it comes back correct if the panel is ever
   * restored. Asserting the rendered page instead would have quietly deleted the record of a
   * decision the owner actually made.
   */
  test('the copy keeps "Praktični vodič" — the owner picked the second of the two offered', () => {
    expect(srLayout.assetCard.subtitle).toBe('Praktični vodič')
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
