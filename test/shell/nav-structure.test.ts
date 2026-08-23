/**
 * Structural guards on the restructured main navigation.
 *
 * Three failures are worth making impossible here, and only one of them is about labels:
 *
 *   1. A CATEGORY LINKING TO ONE CHILD. "SAP Packaged Solutions" and "Case Studies" have no
 *      index page. Pointing either at one of its members would tell a visitor they are
 *      opening a category and then hand them one arbitrary page from it. The owner ruled
 *      that out explicitly, so it is asserted rather than trusted.
 *   2. A CROSS-LOCALE LEAK. Every Serbian destination must be Serbian and every English one
 *      English. A translated label wired to the other language's URL is the single easiest
 *      mistake to make in a bilingual menu and the hardest to see in review.
 *   3. A DEAD DESTINATION. Every href must be a live path in content/routes.ts, or an
 *      anchor on one. A menu entry pointing at a route nobody built is a 404 with extra
 *      steps.
 *
 * The two locales are checked for STRUCTURAL parity too: same groups, same entry counts,
 * same kinds in the same order. Labels differ, shape must not.
 */
import { describe, test, expect } from 'vitest'
import { getDictionary } from '@/content/dictionary'
import type { NavDictionary, NavMenuCopy } from '@/content/dictionary'
import { ROUTE_PAIRS } from '@/content/routes'
import type { Locale } from '@/lib/i18n'

const en = getDictionary('en').nav
const sr = getDictionary('sr').nav

/** Every path either locale actually serves today. */
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

/** The page part of an href: "/sr#about" -> "/sr", "/faq" -> "/faq". */
function pageOf(href: string): string {
  const hash = href.indexOf('#')
  return hash === -1 ? href : href.slice(0, hash)
}

const menus = (nav: NavDictionary): NavMenuCopy[] => [nav.company, nav.expertise, nav.insights]

/** Every destination a locale's navbar offers, headings excluded — they have none. */
function allHrefs(nav: NavDictionary): string[] {
  const out = [nav.home.href, nav.contact.href]
  for (const menu of menus(nav)) {
    for (const entry of menu.entries) {
      if (entry.kind === 'group') out.push(...entry.items.map((i) => i.href))
      else out.push(entry.href)
    }
  }
  return out
}

describe('the five top-level entries', () => {
  test('both locales expose Home, three groups and Contact', () => {
    for (const nav of [en, sr]) {
      expect(nav.home.href).not.toBe('#')
      expect(nav.contact.href).not.toBe('#')
      expect(menus(nav)).toHaveLength(3)
      for (const menu of menus(nav)) {
        expect(menu.entries.length).toBeGreaterThan(0)
      }
    }
  })

  test('the two locales agree on STRUCTURE, entry for entry', () => {
    const shape = (nav: NavDictionary) =>
      menus(nav).map((menu) =>
        menu.entries.map((e) => (e.kind === 'group' ? `group:${e.items.length}` : 'link'))
      )
    expect(shape(sr)).toEqual(shape(en))
  })
})

describe('categories are headings, never links to one child', () => {
  test('SAP Packaged Solutions and Case Studies are groups in both locales', () => {
    for (const nav of [en, sr]) {
      const groups = nav.expertise.entries.filter((e) => e.kind === 'group')
      expect(groups).toHaveLength(2)
      for (const group of groups) {
        // A group carries no href at all — the shape makes "category as link" unsayable.
        expect(group).not.toHaveProperty('href')
        expect(group.kind === 'group' && group.items.length).toBeGreaterThan(1)
      }
    }
  })

  test('all five case studies and both packaged solutions are still reachable', () => {
    const groups = en.expertise.entries.filter((e) => e.kind === 'group')
    const counts = groups.map((g) => (g.kind === 'group' ? g.items.length : 0))
    expect(counts).toEqual([2, 5])
  })
})

describe('destinations are real, and never cross locales', () => {
  test('every href resolves to a live path or an anchor on one', () => {
    const live = livePaths()
    for (const nav of [en, sr]) {
      for (const href of allHrefs(nav)) {
        expect(live, `navbar points at "${href}", which is not a live route`).toContain(pageOf(href))
      }
    }
  })

  test('the Serbian navbar never links into English', () => {
    for (const href of allHrefs(sr)) {
      expect(href.startsWith('/sr'), `Serbian navbar leaks to "${href}"`).toBe(true)
    }
  })

  test('the English navbar never links into the /sr space', () => {
    for (const href of allHrefs(en)) {
      expect(href === '/sr' || href.startsWith('/sr/'), `English navbar leaks to "${href}"`).toBe(
        false
      )
    }
  })
})

describe('the owner decision on SAP for CFO', () => {
  test('it points at the GROW landing page, not the dedicated CFO role page', () => {
    const cfoEn = en.insights.entries.find((e) => e.label === 'SAP for CFO')
    const cfoSr = sr.insights.entries.find((e) => e.label === 'SAP za CFO')

    expect(cfoEn?.kind === 'link' && cfoEn.href).toBe('/grow')
    expect(cfoSr?.kind === 'link' && cfoSr.href).toBe('/sr/grow')
  })

  test('the role pages stay live even though nothing in the navbar points at them', () => {
    // They are reachable from /grow itself. This asserts they were not quietly retired
    // when the menu stopped naming them.
    const ids = ROUTE_PAIRS.filter((p) => p.id === 'grow-cfo' || p.id === 'grow-ceo')
    expect(ids).toHaveLength(2)
    for (const pair of ids) {
      expect(pair.en?.status).toBe('live')
      expect(pair.sr?.status).toBe('live')
    }
  })
})
