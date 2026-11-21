/**
 * The SAP vs Microsoft Insights article.
 *
 * The copy is CLIENT-SUPPLIED SOURCE OF TRUTH ("Infinus_SAP_vs_Microsoft_EN.docx" and
 * "Infinus_SAP_vs_Microsoft_SR.docx"), so the assertions that matter are literal: the two
 * owner-approved edits are pinned word for word, and so are the document's link
 * destinations. A later "improvement" to the copy fails this file, which is the point.
 */
import { render, screen, within } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import EnglishPage, { metadata as enMetadata } from '../app/(en)/(site)/insights/sap-vs-microsoft/page'
import SerbianPage, { metadata as srMetadata } from '../app/(sr)/sr/insights/sap-vs-microsoft/page'
import { getDictionary, type RichText } from '@/content/dictionary'
import { SAP_VS_MICROSOFT_FORM_ID } from '@/components/pages/SapVsMicrosoftPage'

const PAGES = [
  { locale: 'en', Page: EnglishPage, metadata: enMetadata, path: '/insights/sap-vs-microsoft' },
  { locale: 'sr', Page: SerbianPage, metadata: srMetadata, path: '/sr/insights/sap-vs-microsoft' },
] as const

const plain = (runs: RichText) => runs.map((run) => ('text' in run ? run.text : '\n')).join('')
const squash = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim()

describe('the two approved edits, verbatim', () => {
  // Dejan's review: the SAP Business One sentence opens its own paragraph, and the partner
  // link reads "B-ONE Solutions" in both locales.
  test('English: the SAP Business One sentence opens its own paragraph, with its availability clause', () => {
    const [first, second] = getDictionary('en').sapVsMicrosoft.intro.paragraphs.map(plain)
    expect(first).toBe(
      'If you already use Navision, Microsoft Dynamics 365 Business Central is a natural option to consider. It is Microsoft’s ERP solution for small and midsize businesses.'
    )
    expect(second).toBe(
      'Before making a final decision, it is also worth looking at SAP Business One, SAP’s ERP solution for the same market segment, which is available in the cloud and on-premises. SAP Business One · B-ONE Solutions'
    )
  })

  test('Serbian: the SAP Business One sentence opens its own paragraph, with its availability clause', () => {
    const [first, second] = getDictionary('sr').sapVsMicrosoft.intro.paragraphs.map(plain)
    expect(first).toBe(
      'Ako već koristite Navision, logično je da razmotrite Microsoft Dynamics 365 Business Central, Microsoftovo ERP rešenje za mala i srednja preduzeća.'
    )
    expect(second).toBe(
      'Pre nego što donesete konačnu odluku, vredi pogledati i SAP Business One, SAP-ovo rešenje za isti tržišni segment, koje je dostupno u cloud-u i on-premise. SAP Business One · B-ONE Solutions'
    )
  })

  test('em dashes became spaced hyphens, and in-word hyphens survived', () => {
    const sr = getDictionary('sr').sapVsMicrosoft
    expect(plain(sr.comparison.groups[0].items[0])).toBe(
      'Joule Work - SAP-ova vizija operativnog rada u ERP-u. Pogledajte video'
    )
    expect(JSON.stringify(sr)).not.toContain('—')
    expect(JSON.stringify(getDictionary('en').sapVsMicrosoft)).not.toContain('—')
  })
})

describe.each(PAGES)('$path', ({ locale, Page, metadata, path }) => {
  const content = getDictionary(locale).sapVsMicrosoft

  test('renders the full title as the only h1', () => {
    render(<Page />)
    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent('SAP ERP vs Microsoft Dynamics 365 Business Central')
  })

  test('keeps the document order: intro, four comparison groups, closing', () => {
    render(<Page />)
    const h2s = screen.getAllByRole('heading', { level: 2 }).map((h) => squash(h.textContent))
    expect(h2s.slice(0, 3)).toEqual([
      content.intro.heading,
      content.comparison.heading,
      content.closing.heading,
    ])
    const h3s = screen.getAllByRole('heading', { level: 3 }).map((h) => squash(h.textContent))
    expect(h3s).toEqual(content.comparison.groups.map((g) => g.heading))
    expect(content.comparison.groups.map((g) => g.items.length)).toEqual([1, 3, 7, 8])
  })

  test('renders every bullet as the document reads it', () => {
    const { container } = render(<Page />)
    const section = container.querySelector('[data-section="sap-vs-microsoft-comparison"]') as HTMLElement
    const rendered = Array.from(section.querySelectorAll('li')).map((li) => squash(li.textContent))
    expect(rendered).toEqual(content.comparison.groups.flatMap((g) => g.items.map(plain)))
  })

  test('links go to the document’s own destinations', () => {
    render(<Page />)
    const hrefs = screen
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'))
      .filter((href) => href !== null && /^https?:/.test(href))
    expect(hrefs).toEqual([
      'https://www.sap.com/products/erp/business-one.html',
      'https://b-one.rs/',
      'https://www.youtube.com/watch?v=hVEl-itw4fQ&list=PLRFmzdHJ8Y2A',
    ])
  })

  test('the CTA jumps to the existing contact form on the same page', () => {
    const { container } = render(<Page />)
    const cta = screen.getByRole('link', { name: content.closing.cta })
    expect(cta).toHaveAttribute('href', `#${SAP_VS_MICROSOFT_FORM_ID}`)

    const target = container.querySelector(`#${SAP_VS_MICROSOFT_FORM_ID}`) as HTMLElement
    expect(target).not.toBeNull()
    const form = target.querySelector('form') as HTMLFormElement
    expect(form).not.toBeNull()
    // The homepage form, in this locale: its own labels and its own submit button.
    const copy = getDictionary(locale).home.contactShort
    expect(within(form).getByLabelText(copy.nameLabel)).toBeInTheDocument()
    expect(within(form).getByLabelText(copy.emailLabel)).toBeInTheDocument()
    expect(within(form).getByRole('button', { name: copy.submit })).toBeInTheDocument()
    // Nothing on the page follows the form: it is the last section before the footer.
    expect(container.querySelector('[data-section="sap-vs-microsoft-contact"]')).toBe(
      Array.from(container.querySelectorAll('[data-section]')).at(-1)
    )
  })

  test('metadata: one brand suffix, self-canonical and a reciprocal hreflang pair', () => {
    expect(metadata.title).toEqual({
      absolute: 'SAP ERP vs Microsoft Dynamics 365 Business Central | Infinus',
    })
    const alternates = metadata.alternates as {
      canonical: string
      languages: Record<string, string>
    }
    expect(alternates.canonical).toBe(`https://www.infinus.co${path}`)
    expect(alternates.languages).toEqual({
      en: 'https://www.infinus.co/insights/sap-vs-microsoft',
      'sr-Latn': 'https://www.infinus.co/sr/insights/sap-vs-microsoft',
      'x-default': 'https://www.infinus.co/insights/sap-vs-microsoft',
    })
  })
})

describe('the Insights menu and footer link both halves', () => {
  test.each(['en', 'sr'] as const)('%s', (locale) => {
    const href = locale === 'en' ? '/insights/sap-vs-microsoft' : '/sr/insights/sap-vs-microsoft'
    const { nav, footer } = getDictionary(locale)
    expect(nav.insights.entries).toContainEqual({ kind: 'link', label: 'SAP vs Microsoft', href })
    expect(footer.columns.insights.entries).toContainEqual({ kind: 'link', label: 'SAP vs Microsoft', href })
  })
})
