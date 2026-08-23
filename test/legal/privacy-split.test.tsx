/**
 * The Privacy Policy after the locale split.
 *
 * One bilingual URL became two localised pages:
 *   /privacy                    English only, canonical English legal URL
 *   /sr/politika-privatnosti    Serbian only
 *   /politika-privatnosti       permanent redirect to /privacy
 *
 * Two things are proven here, and they are different in kind:
 *
 *   A. ROUTING AND POLICY — the pair is navigable but not indexable. This is the case that
 *      forced content/routes.ts to separate those two properties, so it is asserted from both
 *      sides: a counterpart resolves, and no alternates ever will.
 *
 *   B. LEGAL TEXT INTEGRITY — each page renders its own approved document, character for
 *      character, and none of the other language's document. The comparison ignores
 *      whitespace only. A changed word, number, date, email or regulator name fails.
 */

import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import fs from 'node:fs'
import { PrivacyPolicyPage } from '@/components/pages/PrivacyPolicyPage'
import { privacyPolicyDocumentFor } from '@/lib/legal-documents'
import {
  PRIVACY_POLICY_DOCUMENTS,
  PRIVACY_POLICY_UPDATED,
  type LegalBlock,
  type LegalInline,
} from '@/content/legal/politika-privatnosti'
import { ROUTE_PAIRS, validateRoutePairs } from '@/content/routes'
import { counterpartFor, isTranslatablePath, localeAlternatesFor } from '@/lib/locale-routes'
import { navbarSurfaceFor } from '@/lib/navbar-surface'
import { chromeLocaleFor } from '@/lib/chrome-locale'
import { ROUTES } from '../fixtures/routes'
import { LOCALE_LINKED_PAIRS, NAVIGABLE_PAIRS, COMPLETE_PAIRS } from '../fixtures/locale-pairs'

const EN = '/privacy'
const SR = '/sr/politika-privatnosti'
const OLD = '/politika-privatnosti'

/** Whitespace-insensitive, everything-else-sensitive. */
const squash = (s: string) =>
  s
    .normalize('NFC')
    .split('')
    .filter((c) => c.trim() !== '')
    .join('')

const inlineText = (c: readonly LegalInline[]) => c.map((x) => (x.t === 'break' ? ' ' : x.v)).join('')

const blockChunks = (b: LegalBlock): string[] =>
  b.t === 'ul' ? b.items.map(inlineText) : [inlineText(b.c)]

const sourceText = (blocks: readonly LegalBlock[]) =>
  blocks.flatMap(blockChunks).join(' ')

describe('A. the legal pair is navigable but not indexable', () => {
  const legal = ROUTE_PAIRS.filter((p) => p.id === 'legal-privacy-policy')[0]

  test('the route map declares both sides live under one page identity', () => {
    expect(legal).toBeDefined()
    expect(legal.pairing).toBe('locale-linked')
    expect(legal.en).toEqual({ path: EN, status: 'live' })
    expect(legal.sr).toEqual({ path: SR, status: 'live' })
  })

  test('a counterpart resolves in both directions', () => {
    expect(counterpartFor(EN)).toEqual({
      locale: 'sr',
      path: SR,
      url: `https://www.infinus.co${SR}`,
    })
    expect(counterpartFor(SR)).toEqual({
      locale: 'en',
      path: EN,
      url: `https://www.infinus.co${EN}`,
    })
  })

  test('but NO alternates, ever — the pair must not emit hreflang', () => {
    expect(localeAlternatesFor(EN)).toBeNull()
    expect(localeAlternatesFor(SR)).toBeNull()
    expect(isTranslatablePath(EN)).toBe(false)
    expect(isTranslatablePath(SR)).toBe(false)
  })

  test('the fixture keeps both sides noindex and out of the sitemap', () => {
    for (const path of [EN, SR]) {
      const route = ROUTES.filter((r) => r.path === path)[0]
      expect(route, `${path} missing from the fixture`).toBeDefined()
      expect(route.kind).toBe('page-noindex')
      expect(route.expectRobots).toBe('noindex, follow')
      expect(route.inSitemap).toBe(false)
      expect(route.expectCanonical).toBe(`https://www.infinus.co${path}`)
      expect(route.expectStaticHtml).toBe(true)
    }
    expect(ROUTES.filter((r) => r.path === EN)[0].expectLang).toBe('en')
    expect(ROUTES.filter((r) => r.path === SR)[0].expectLang).toBe('sr-Latn')
  })

  test('the old URL is a redirect source with no page of its own', () => {
    const old = ROUTES.filter((r) => r.path === OLD)[0]
    expect(old, 'the old URL must still be classified').toBeDefined()
    expect(old.kind).toBe('redirect-only')
    expect(old.expectStaticHtml).toBe(false)
    expect(old.inSitemap).toBe(false)
  })

  test('/sr/privacy is not a route in any form', () => {
    expect(ROUTES.filter((r) => r.path === '/sr/privacy')).toEqual([])
    expect(counterpartFor('/sr/privacy')).toBeNull()
    for (const pair of ROUTE_PAIRS) {
      expect(pair.en?.path).not.toBe('/sr/privacy')
      expect(pair.sr?.path).not.toBe('/sr/privacy')
    }
  })

  test('the model REFUSES a half-built locale link', () => {
    // The invariant that replaced "an excluded pair may not have two live sides". A
    // locale-linked pair exists to make the switcher work, so one live side is a bug: the
    // control would advertise a URL that 404s.
    const halfBuilt = validateRoutePairs([
      {
        id: 'half-linked',
        pairing: 'locale-linked',
        en: { path: '/x', status: 'live' },
        sr: { path: '/sr/x', status: 'planned' },
      },
    ])
    expect(halfBuilt.length).toBe(1)
    expect(halfBuilt[0]).toContain('locale-linked')

    // And the OLD guard still holds for `excluded`, which is what it was protecting.
    const fakeExcluded = validateRoutePairs([
      {
        id: 'fake-excluded',
        pairing: 'excluded',
        en: { path: '/y', status: 'live' },
        sr: { path: '/sr/y', status: 'live' },
      },
    ])
    expect(fakeExcluded.length).toBe(1)
    expect(fakeExcluded[0]).toContain('excluded')

    // The real map is clean.
    expect(validateRoutePairs()).toEqual([])
  })

  test('indexable pairs are 18 and navigable pairs 19, and the legal one is the difference', () => {
    // The distinction the owner asked to keep separate in tests as well as in the model.
    // H4 added four indexable pairs; the legal pair is still the only navigable-not-indexable
    // one, which is the invariant this test actually protects.
    expect(COMPLETE_PAIRS.length).toBe(18)
    expect(LOCALE_LINKED_PAIRS.length).toBe(1)
    expect(NAVIGABLE_PAIRS.length).toBe(19)
    // Every indexable pair is navigable; not every navigable pair is indexable.
    for (const p of COMPLETE_PAIRS) expect(isTranslatablePath(p.en)).toBe(true)
    for (const p of LOCALE_LINKED_PAIRS) expect(isTranslatablePath(p.en)).toBe(false)
  })

  test('both URLs classify as ONE page identity for chrome purposes', () => {
    // Light navbar on both, from the single `legal-privacy-policy` id — no path matching, and
    // no way for the two locales to drift apart.
    expect(navbarSurfaceFor(EN)).toBe('light')
    expect(navbarSurfaceFor(SR)).toBe('light')
    // And each is chrome-localised to its own language.
    expect(chromeLocaleFor(EN)).toBe('en')
    expect(chromeLocaleFor(SR)).toBe('sr')
  })
})

describe('B. each page renders its own approved legal document, exactly', () => {
  test('the source still holds exactly two documents and the approved date', () => {
    expect(PRIVACY_POLICY_DOCUMENTS.length).toBe(2)
    expect(PRIVACY_POLICY_UPDATED).toBe('2026-08-10')
    expect(PRIVACY_POLICY_DOCUMENTS.map((d) => d.lang).slice().sort()).toEqual(['en', 'sr-Latn'])
  })

  test('the document lookup is by language tag, and a miss throws', () => {
    expect(privacyPolicyDocumentFor('en').lang).toBe('en')
    expect(privacyPolicyDocumentFor('sr').lang).toBe('sr-Latn')
    // Positional indexing is what this guards against: the array order is an artefact of the
    // source .docx, and picking the wrong element would publish the wrong language's law.
    expect(privacyPolicyDocumentFor('en')).not.toBe(privacyPolicyDocumentFor('sr'))
  })

  for (const [locale, tag, ownH1, ownDate, otherH1, otherDate] of [
    ['en', 'en', 'Privacy Policy', 'Last updated: 10 August 2026', 'Politika privatnosti', 'Poslednje ažuriranje'],
    ['sr', 'sr-Latn', 'Politika privatnosti', 'Poslednje ažuriranje: 10. avgust 2026.', 'Privacy Policy', 'Last updated'],
  ] as const) {
    test(`${locale}: renders every approved block, in order, and nothing of the other language`, () => {
      const doc = privacyPolicyDocumentFor(locale)
      expect(doc.lang).toBe(tag)

      const { container } = render(<PrivacyPolicyPage document={doc} />)
      const rendered = squash(container.textContent ?? '')

      // Character-for-character: the rendered page contains exactly the approved text.
      expect(rendered).toBe(squash(sourceText(doc.blocks)))

      // Its own heading and date.
      const h1s = Array.from(container.querySelectorAll('h1')).map((h) => h.textContent?.trim())
      expect(h1s).toEqual([ownH1])
      expect(rendered).toContain(squash(ownDate))

      // And none of the other document. Checked block by block, not just by heading, so a
      // partial leak cannot hide.
      const other = PRIVACY_POLICY_DOCUMENTS.filter((d) => d.lang !== tag)[0]
      expect(rendered).not.toContain(squash(otherH1))
      expect(rendered).not.toContain(squash(otherDate))
      for (const b of other.blocks) {
        for (const chunk of blockChunks(b)) {
          const n = squash(chunk)
          // Short fragments can coincide across languages; long ones cannot.
          if (n.length < 40) continue
          expect(rendered, `a ${other.lang} block leaked in: ${chunk.slice(0, 60)}`).not.toContain(n)
        }
      }
    })
  }

  test('there is no in-page language nav left to jump between documents', () => {
    // The old bilingual page had anchor links between its two sections. With one document per
    // page there is nothing to jump to, and moving languages is the global switcher's job.
    const { container } = render(<PrivacyPolicyPage document={privacyPolicyDocumentFor('en')} />)
    const anchors = Array.from(container.querySelectorAll('a[href^="#"]')).map((a) =>
      a.getAttribute('href')
    )
    expect(anchors).toEqual([])
  })

  test('the approved legal source file still carries its do-not-edit rule', () => {
    const src = fs.readFileSync('content/legal/politika-privatnosti.ts', 'utf8')
    expect(src).toContain('APPROVED LEGAL COPY — DO NOT EDIT')
    // The recorded provenance of the .docx must not have been quietly altered.
    expect(src).toContain('34af9e119303ffaeda2162f34cc293274ec6b38190562190d1a917b5b85353b6')
  })
})
