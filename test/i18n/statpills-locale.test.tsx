/**
 * The trust pills render in the page's OWN language.
 *
 * ── The bug this exists for ─────────────────────────────────────────────────────
 * `StatPills` used to declare `trust` as optional, defaulting to
 * `getDictionary('en').home.trust`. Four Serbian pages called `<StatPills />` with no
 * argument, so they shipped "30+ experienced consultants" and "20+ satisfied customers"
 * inside Serbian documents. Nothing failed and nothing warned: a default that produces the
 * wrong answer looks exactly like a default that produces the right one.
 *
 * The fix removed the default, which makes the omission a compile error. That is the real
 * guard — this file is the one that would still catch a call site wired to the WRONG locale,
 * which the type system cannot see.
 *
 * ── Why it renders the ROUTE components ─────────────────────────────────────────
 * Rendering the shared page component with a hand-picked `trust` would only prove the
 * component uses what it is given. The decision that matters is made one level up, in the
 * route file, which is the thing that knows its own locale. So these tests import the actual
 * page modules — the same ones Next renders — and read the pills out of the result.
 */
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { getDictionary } from '@/content/dictionary'
import { LOCALES, type Locale } from '@/lib/i18n'

import EnglishGrowPage from '../../app/(en)/(site)/grow/page'
import EnglishCfoPage from '../../app/(en)/(site)/grow/cfo/page'
import EnglishProfessionalServicesPage from '../../app/(en)/(site)/professional-services/page'
import SerbianGrowPage from '../../app/(sr)/sr/grow/page'
import SerbianCfoPage from '../../app/(sr)/sr/grow/cfo/page'
import SerbianProfessionalServicesPage from '../../app/(sr)/sr/professional-services/page'

const trustFor = (locale: Locale) => getDictionary(locale).home.trust

/** The three pill strings for a locale, in render order. */
const pillsOf = (locale: Locale): string[] => {
  const t = trustFor(locale)
  return [t.goldPartner, t.consultants, t.customers]
}

const PAGES: ReadonlyArray<{
  label: string
  path: string
  locale: Locale
  Page: () => JSX.Element
}> = [
  { label: 'English GROW', path: '/grow', locale: 'en', Page: EnglishGrowPage },
  { label: 'Serbian GROW', path: '/sr/grow', locale: 'sr', Page: SerbianGrowPage },
  { label: 'English CFO', path: '/grow/cfo', locale: 'en', Page: EnglishCfoPage },
  { label: 'Serbian CFO', path: '/sr/grow/cfo', locale: 'sr', Page: SerbianCfoPage },
  {
    label: 'English Professional Services',
    path: '/professional-services',
    locale: 'en',
    Page: EnglishProfessionalServicesPage,
  },
  {
    label: 'Serbian Professional Services',
    path: '/sr/professional-services',
    locale: 'sr',
    Page: SerbianProfessionalServicesPage,
  },
]

describe('the trust pills follow the page, not a default', () => {
  for (const { label, path, locale, Page } of PAGES) {
    const other: Locale = locale === 'en' ? 'sr' : 'en'

    test(`${path} renders the ${locale} pills and none of the ${other} ones`, () => {
      render(<Page />)

      for (const pill of pillsOf(locale)) {
        expect(screen.getAllByText(pill).length, `${label} must show "${pill}"`).toBeGreaterThan(0)
      }

      // The negative half is the one that was failing before the fix. Only the strings that
      // actually DIFFER between locales are checked: "SAP Gold Partner" is identical in both,
      // because it is a partner status and not a translatable phrase.
      for (const pill of pillsOf(other)) {
        if (pillsOf(locale).indexOf(pill) !== -1) continue
        expect(screen.queryByText(pill), `${label} must NOT show "${pill}"`).toBeNull()
      }
    })
  }

  test('the two locales really do differ, or the test above proves nothing', () => {
    // A guard on the guard: if someone made the Serbian trust copy identical to the English,
    // every assertion above would pass while the pages were wrong. Two of the three strings
    // must differ; the third ("SAP Gold Partner") is a proper noun and legitimately shared.
    const en = pillsOf('en')
    const sr = pillsOf('sr')
    const differing = en.filter((v, i) => v !== sr[i])
    expect(differing.length, 'EN and SR trust copy are indistinguishable').toBeGreaterThanOrEqual(2)
    expect(trustFor('en').goldPartner).toBe(trustFor('sr').goldPartner)
  })

  test('StatPills has no locale-bearing default left to fall back to', () => {
    // Belt and braces on the actual fix. `trust` must be a REQUIRED prop: with a default,
    // every call site that forgets it silently renders the default locale, which is exactly
    // how this bug shipped. Read from source because a type-level fact leaves no runtime
    // trace to assert.
    const src = require('node:fs').readFileSync('components/ui/StatPills.tsx', 'utf8') as string
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
    expect(code, 'trust must not have a default value').not.toMatch(/trust\s*=/)
    expect(code, 'trust must be a required prop').toMatch(/trust:\s*HomeDictionary\["trust"\]/)
    // And it must not reach for a dictionary itself — the locale is the caller's to know.
    expect(code, 'StatPills must not resolve a dictionary itself').not.toMatch(/getDictionary/)
  })
})

describe('the closing CTA points at the reader own-language contact page', () => {
  const EXPECTED: Record<Locale, string> = { en: '/contact', sr: '/sr/contact' }

  test('each locale dictionary owns its own contact destination', () => {
    for (const locale of LOCALES) {
      expect(getDictionary(locale).growth.shared.contactHref, locale).toBe(EXPECTED[locale])
    }
  })

  for (const { label, path, locale, Page } of PAGES) {
    test(`${path} CTA links to ${EXPECTED[locale]}`, () => {
      const { container } = render(<Page />)
      const hrefs = Array.from(container.querySelectorAll('a[href]')).map((a) =>
        a.getAttribute('href')
      )
      expect(hrefs, `${label} must link to its own contact page`).toContain(EXPECTED[locale])
      // And must not link to the other locale's.
      const wrong = locale === 'en' ? '/sr/contact' : '/contact'
      expect(hrefs, `${label} must not link to ${wrong}`).not.toContain(wrong)
    })
  }
})

describe('no call site anywhere can inherit a locale by omission', () => {
  test('every LIVE <StatPills> and <TrustStrip> names its trust explicitly', () => {
    // The type system already guarantees this — `trust` is required — so what this really
    // guards is the reviewer's claim that the audit was complete: it walks the source rather
    // than trusting a list written by hand.
    //
    // Commented-out JSX is skipped, and that distinction earned its place. components/pages/
    // ProjectPulsePage.tsx contains `<StatPills />` with no argument, which looks exactly like
    // the bug that was just fixed — but it sits inside a `{/* About Infinus - Hidden */}` block
    // that has been commented out for a long time, so it renders nowhere and compiles as text.
    // (Editing it is also how you discover that a literal `*/` inside a JSX comment closes the
    // enclosing one.)
    const fs = require('node:fs') as typeof import('node:fs')
    const path = require('node:path') as typeof import('node:path')

    const files: string[] = []
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(full)
        else if (/\.tsx$/.test(entry.name)) files.push(full)
      }
    }
    walk('components')
    walk('app')

    const bare: string[] = []
    let live = 0
    for (const file of files) {
      const src = fs.readFileSync(file, 'utf8')
      // Strip JSX/block comments so a commented-out call site is not counted either way.
      const code = src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
      const calls = code.match(/<(StatPills|TrustStrip)\b[^>]*>/g) ?? []
      for (const call of calls) {
        live += 1
        if (call.indexOf('trust=') === -1) bare.push(`${file}: ${call}`)
      }
    }

    expect(live, 'no call sites were found at all — the walk is broken').toBeGreaterThanOrEqual(6)
    expect(bare, 'these call sites would inherit a default locale').toEqual([])
  })
})
