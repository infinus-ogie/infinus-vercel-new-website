/**
 * Language switcher guards.
 *
 * Phase G turned this component on, so the test's job flipped: it must now prove the switcher
 * appears on EXACTLY the one real pair and still refuses to invent a destination everywhere
 * else. Three properties carry that:
 *
 *   1. It renders a correct, reciprocal control on /contact and /sr/contact.
 *   2. It renders NOTHING on every other page — including /grow (no English version) and
 *      /faq (Serbian version only planned).
 *   3. It resolves through the route-pair map, never by string surgery on the pathname.
 *      Asserted against the source too, because a `pathname.replace('/sr','')` would pass
 *      every behavioural test on today's URLs and then break on /grow.
 */
import { render } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { LanguageSwitcher, localeCode, resolveSwitchTarget } from '@/components/i18n/LanguageSwitcher'
import { allLivePaths, counterpartFor } from '@/lib/locale-routes'
import type { RoutePair } from '@/content/routes'

const ROOT = process.cwd()

/** The one real pair. */
const EN_PATH = '/contact'
const SR_PATH = '/sr/contact'

const SYNTHETIC_COMPLETE: readonly RoutePair[] = [
  {
    id: 'synthetic-contact',
    pairing: 'translatable',
    en: { path: '/synthetic-contact', status: 'live' },
    sr: { path: '/sr/synthetic-contact', status: 'live' },
  },
]

describe('the real pair renders a reciprocal EN | SR control', () => {
  test('on /contact: EN is current, SR links to the Serbian page', () => {
    const { container } = render(<LanguageSwitcher currentPath={EN_PATH} currentLocale="en" />)

    const group = container.querySelector('[data-language-switcher]')
    expect(group).not.toBeNull()
    expect(group!.getAttribute('role')).toBe('group')
    // Accessible label from the CURRENT locale's dictionary.
    expect(group!.getAttribute('aria-label')).toBe('Change language')

    const current = container.querySelector('[aria-current="true"]')
    expect(current!.textContent).toBe('EN')

    const link = container.querySelector('a')
    expect(link!.getAttribute('href')).toBe(SR_PATH)
    expect(link!.textContent).toBe('SR')
    // hreflang/lang describe the TARGET document's language.
    expect(link!.getAttribute('hreflang')).toBe('sr-Latn')
    expect(link!.getAttribute('lang')).toBe('sr-Latn')
    expect(link!.getAttribute('aria-label')).toBe('Change language: Srpski')
  })

  test('on /sr/contact: SR is current, EN links back, labelled in Serbian', () => {
    const { container } = render(<LanguageSwitcher currentPath={SR_PATH} currentLocale="sr" />)

    const group = container.querySelector('[data-language-switcher]')
    expect(group!.getAttribute('aria-label')).toBe('Promeni jezik')

    expect(container.querySelector('[aria-current="true"]')!.textContent).toBe('SR')

    const link = container.querySelector('a')
    expect(link!.getAttribute('href')).toBe(EN_PATH)
    expect(link!.textContent).toBe('EN')
    expect(link!.getAttribute('hreflang')).toBe('en')
    expect(link!.getAttribute('aria-label')).toBe('Promeni jezik: English')
  })

  test('exactly one link and one current marker — never two links', () => {
    for (const [path, locale] of [[EN_PATH, 'en'], [SR_PATH, 'sr']] as const) {
      const { container } = render(<LanguageSwitcher currentPath={path} currentLocale={locale} />)
      expect(container.querySelectorAll('a')).toHaveLength(1)
      expect(container.querySelectorAll('[aria-current="true"]')).toHaveLength(1)
    }
  })

  test('the codes are language subtags, not country codes, and there are no flags', () => {
    expect(localeCode('en')).toBe('EN')
    expect(localeCode('sr')).toBe('SR')

    const { container } = render(<LanguageSwitcher currentPath={EN_PATH} currentLocale="en" />)
    expect(container.textContent).not.toMatch(/GB|US|RS/)
    // No emoji flags, no <img>, no background-image.
    expect(container.querySelectorAll('img')).toHaveLength(0)
    expect(container.innerHTML).not.toMatch(/\uD83C[\uDDE6-\uDDFF]/)
  })

  test('the separator is hidden from assistive technology', () => {
    const { container } = render(<LanguageSwitcher currentPath={EN_PATH} currentLocale="en" />)
    const sep = container.querySelector('[aria-hidden="true"]')
    expect(sep).not.toBeNull()
    expect(sep!.textContent).toBe('|')
  })
})

describe('it never invents a destination', () => {
  test('resolveSwitchTarget returns a target for the real pair and null for everything else', () => {
    const withTarget = allLivePaths().filter((p) => resolveSwitchTarget(p) !== null)
    expect(withTarget.slice().sort()).toEqual([EN_PATH, SR_PATH].slice().sort())
  })

  test('renders nothing on a Serbian page with no English version', () => {
    for (const path of ['/grow', '/grow/cfo', '/grow/ceo', '/professional-services']) {
      const { container } = render(<LanguageSwitcher currentPath={path} currentLocale="sr" />)
      expect(container.innerHTML, path).toBe('')
      // Specifically: it does NOT fall back to the English home page.
      expect(container.querySelector('a'), path).toBeNull()
    }
  })

  test('renders nothing on an English page whose Serbian version is only planned', () => {
    for (const path of ['/', '/faq', '/projectpulse', '/case-study/pharma2']) {
      const { container } = render(<LanguageSwitcher currentPath={path} currentLocale="en" />)
      expect(container.innerHTML, path).toBe('')
    }
  })

  test('renders nothing on the excluded legal page or on /cfo', () => {
    for (const path of ['/politika-privatnosti', '/cfo']) {
      const { container } = render(<LanguageSwitcher currentPath={path} currentLocale="en" />)
      expect(container.innerHTML, path).toBe('')
    }
  })

  test('renders nothing for an unknown or planned path', () => {
    for (const path of ['/does-not-exist', '/sr', '/sr/faq', '/hero-demo', '']) {
      const { container } = render(<LanguageSwitcher currentPath={path} currentLocale="en" />)
      expect(container.innerHTML, path).toBe('')
    }
  })

  test('it resolves through the route map, not through string surgery on the path', () => {
    // If it stripped or prefixed "/sr", these would produce targets. They must not.
    expect(resolveSwitchTarget('/sr/faq')).toBeNull()
    expect(resolveSwitchTarget('/faq')).toBeNull()
    expect(resolveSwitchTarget('/professional-services')).toBeNull()

    const source = readFileSync(join(ROOT, 'components/i18n/LanguageSwitcher.tsx'), 'utf8')
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
    expect(code).not.toMatch(/\.replace\(/)
    expect(code).not.toMatch(/['"`]\/sr['"`]\s*\+/)
    expect(code).not.toMatch(/startsWith\(/)
  })

  test('an excluded pair renders nothing even with both sides live', () => {
    const excluded: readonly RoutePair[] = [
      {
        id: 'excluded-pair',
        pairing: 'excluded',
        en: { path: '/x', status: 'live' },
        sr: { path: '/sr/x', status: 'live' },
      },
    ]
    const { container } = render(<LanguageSwitcher currentPath="/x" currentLocale="en" routePairs={excluded} />)
    expect(container.innerHTML).toBe('')
  })

  test('a half-built synthetic pair renders nothing on either side', () => {
    const halfBuilt: readonly RoutePair[] = [
      {
        id: 'half',
        pairing: 'translatable',
        en: { path: '/half', status: 'live' },
        sr: { path: '/sr/half', status: 'planned' },
      },
    ]
    for (const path of ['/half', '/sr/half']) {
      const { container } = render(<LanguageSwitcher currentPath={path} currentLocale="en" routePairs={halfBuilt} />)
      expect(container.innerHTML, path).toBe('')
    }
  })

  test('a complete synthetic pair works without any real route existing', () => {
    const { container } = render(
      <LanguageSwitcher currentPath="/synthetic-contact" currentLocale="en" routePairs={SYNTHETIC_COMPLETE} />
    )
    expect(container.querySelector('a')!.getAttribute('href')).toBe('/sr/synthetic-contact')
    expect(counterpartFor('/sr/synthetic-contact', SYNTHETIC_COMPLETE)!.locale).toBe('en')
  })
})

describe('it is mounted in exactly one place, through the client adapter', () => {
  test('the Navbar mounts the adapter, not the pure component', () => {
    const navbar = readFileSync(join(ROOT, 'components/ui/navbar-demo.tsx'), 'utf8')
    expect(navbar).toMatch(/LocaleSwitcherNav/)
    // The pure component needs a path it cannot know; the Navbar must go through the adapter.
    expect(navbar).not.toMatch(/<LanguageSwitcher\b/)
  })

  test('the adapter reads the path with usePathname and NOT with a request API', () => {
    const adapter = readFileSync(join(ROOT, 'components/i18n/LocaleSwitcherNav.tsx'), 'utf8')
    expect(adapter).toMatch(/^"use client"/)
    expect(adapter).toMatch(/usePathname/)
    // These would opt every page out of static rendering.
    const code = adapter.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
    expect(code).not.toMatch(/next\/headers|cookies\(|headers\(/)
  })

  test('the adapter derives locale from the route map, not from the /sr prefix', () => {
    const code = readFileSync(join(ROOT, 'components/i18n/LocaleSwitcherNav.tsx'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
    expect(code).toMatch(/localeOfPath/)
    // The only slicing allowed is trailing-slash normalisation, never locale inference.
    expect(code).not.toMatch(/['"`]\/sr['"`]/)
  })

  test('the document shell and the footer still render no language control', () => {
    for (const file of ['components/shell/RootShell.tsx', 'components/shell/SiteChrome.tsx', 'components/ui/footer.tsx']) {
      const source = readFileSync(join(ROOT, file), 'utf8')
      expect(source, `${file} must not mount the switcher`).not.toMatch(
        /LanguageSwitcher|LocaleSwitcherNav|data-language-switcher/
      )
    }
  })
})
