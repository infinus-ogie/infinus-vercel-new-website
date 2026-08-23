/**
 * Structural guards on the restructured footer.
 *
 * The rule the owner was most explicit about is the first one below, so it is asserted
 * twice: once against the DATA (a category cannot carry an href, because the type has no
 * such field) and once against the RENDERED footer (the category text must not be inside a
 * link element). The second check is the one that would catch a component change that
 * quietly wrapped a heading in an anchor.
 */
import { render, screen, within } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { getDictionary } from '@/content/dictionary'
import type { FooterDictionary, NavMenuCopy } from '@/content/dictionary'
import { ROUTE_PAIRS } from '@/content/routes'
import type { Locale } from '@/lib/i18n'
import Footer from '@/components/ui/footer'

const en = getDictionary('en').footer
const sr = getDictionary('sr').footer

const menus = (footer: FooterDictionary): NavMenuCopy[] => [
  footer.columns.company,
  footer.columns.expertise,
  footer.columns.insights,
]

function livePaths(): string[] {
  const out: string[] = []
  for (const pair of ROUTE_PAIRS) {
    for (const locale of ['en', 'sr'] as Locale[]) {
      const entry = pair[locale]
      if (entry && entry.status === 'live') out.push(entry.path)
    }
  }
  return out
}

const pageOf = (href: string) => (href.includes('#') ? href.slice(0, href.indexOf('#')) : href)

/** Every internal destination the footer offers, headings excluded. */
function internalHrefs(footer: FooterDictionary): string[] {
  const out: string[] = [footer.bottom.privacyHref]
  for (const item of [...footer.columns.contact.items, ...footer.columns.legal.items]) {
    if (item.href !== '#' && !item.href.startsWith('http') && !item.href.startsWith('mailto:')) {
      out.push(item.href)
    }
  }
  for (const menu of menus(footer)) {
    for (const entry of menu.entries) {
      if (entry.kind === 'group') out.push(...entry.items.map((i) => i.href))
      else out.push(entry.href)
    }
  }
  return out
}

describe('the five columns', () => {
  test('both locales expose Contact, Company, Expertise, Insights and Legal', () => {
    for (const footer of [en, sr]) {
      expect(footer.columns.contact.items.length).toBeGreaterThan(0)
      expect(footer.columns.legal.items.length).toBeGreaterThan(0)
      expect(menus(footer)).toHaveLength(3)
    }
  })

  test('the old Resources column is gone from both locales', () => {
    for (const footer of [en, sr]) {
      expect(footer.columns).not.toHaveProperty('resources')
    }
  })

  test('the two locales agree on structure, entry for entry', () => {
    const shape = (footer: FooterDictionary) =>
      menus(footer).map((menu) =>
        menu.entries.map((e) => (e.kind === 'group' ? `group:${e.items.length}` : 'link'))
      )
    expect(shape(sr)).toEqual(shape(en))
  })
})

describe('a category label never masquerades as a link', () => {
  test('groups carry no href in the data', () => {
    for (const footer of [en, sr]) {
      for (const menu of menus(footer)) {
        for (const entry of menu.entries) {
          if (entry.kind === 'group') expect(entry).not.toHaveProperty('href')
        }
      }
    }
  })

  test('the rendered category text is not inside a link', () => {
    vi.mock('next/navigation', () => ({ usePathname: () => '/' }))
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer') as HTMLElement

    for (const category of ['SAP Packaged Solutions', 'Case Studies']) {
      const node = within(footer).getByText(category)
      expect(node.closest('a'), `"${category}" is rendered as a link`).toBeNull()
    }

    // And the children it heads ARE links, so nothing became unreachable.
    expect(within(footer).getByRole('link', { name: 'ProjectPulse' })).toHaveAttribute(
      'href',
      '/projectpulse'
    )
    expect(within(footer).getByRole('link', { name: 'Retail' })).toHaveAttribute(
      'href',
      '/case-study/retail1'
    )
  })
})

describe('destinations are real, and never cross locales', () => {
  test('every internal href resolves to a live path or an anchor on one', () => {
    const live = livePaths()
    for (const footer of [en, sr]) {
      for (const href of internalHrefs(footer)) {
        expect(live, `footer points at "${href}", which is not a live route`).toContain(pageOf(href))
      }
    }
  })

  test('the Serbian footer never links into English', () => {
    for (const href of internalHrefs(sr)) {
      expect(href.startsWith('/sr'), `Serbian footer leaks to "${href}"`).toBe(true)
    }
  })

  test('the English footer never links into the /sr space', () => {
    for (const href of internalHrefs(en)) {
      expect(href === '/sr' || href.startsWith('/sr/'), `English footer leaks to "${href}"`).toBe(
        false
      )
    }
  })

  test('the Legal column and bottom bar use each locale own Privacy Policy', () => {
    expect(en.columns.legal.items[0].href).toBe('/privacy')
    expect(en.bottom.privacyHref).toBe('/privacy')
    expect(sr.columns.legal.items[0].href).toBe('/sr/politika-privatnosti')
    expect(sr.bottom.privacyHref).toBe('/sr/politika-privatnosti')
  })
})
