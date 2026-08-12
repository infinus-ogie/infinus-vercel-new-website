/**
 * Language switcher guards.
 *
 * Two jobs:
 *
 *   1. Prove the component NEVER invents a destination. For every real path on the site it
 *      renders nothing, because no page has a live counterpart yet. It only renders for a
 *      complete pair, which today exists only as synthetic test data.
 *
 *   2. Prove it is NOT MOUNTED. Phase F ships no visible EN | SR control, so the site
 *      chrome must not reference it. That is asserted against the actual chrome source,
 *      because a stray import is exactly how "infrastructure only" quietly becomes a
 *      launch.
 */
import { render } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { LanguageSwitcher, resolveSwitchTarget } from '@/components/i18n/LanguageSwitcher'
import { allLivePaths, counterpartFor } from '@/lib/locale-routes'
import type { RoutePair } from '@/content/routes'

const ROOT = process.cwd()

const SYNTHETIC_COMPLETE: readonly RoutePair[] = [
  {
    id: 'synthetic-contact',
    pairing: 'translatable',
    en: { path: '/synthetic-contact', status: 'live' },
    sr: { path: '/sr/synthetic-contact', status: 'live' },
  },
]

describe('it never invents a destination', () => {
  test('resolveSwitchTarget returns NO COUNTERPART for every live path on the site', () => {
    for (const path of allLivePaths()) {
      expect(resolveSwitchTarget(path), `${path} must have no switch target`).toBeNull()
    }
  })

  test('renders nothing on an English page with no Serbian version', () => {
    const { container } = render(<LanguageSwitcher currentPath="/contact" currentLocale="en" />)
    expect(container.innerHTML).toBe('')
  })

  test('renders nothing on a Serbian page with no English version', () => {
    const { container } = render(<LanguageSwitcher currentPath="/grow" currentLocale="sr" />)
    expect(container.innerHTML).toBe('')
    // Specifically: it does NOT fall back to the English home page.
    expect(container.querySelector('a')).toBeNull()
  })

  test('renders nothing on the excluded legal page or on /cfo', () => {
    for (const path of ['/politika-privatnosti', '/cfo']) {
      const { container } = render(<LanguageSwitcher currentPath={path} currentLocale="en" />)
      expect(container.innerHTML, path).toBe('')
    }
  })

  test('renders nothing for an unknown path', () => {
    for (const path of ['/does-not-exist', '/sr', '/sr/contact', '/hero-demo', '']) {
      const { container } = render(<LanguageSwitcher currentPath={path} currentLocale="en" />)
      expect(container.innerHTML, path).toBe('')
    }
  })

  test('it resolves through the route map, not through string surgery on the path', () => {
    // If it prefixed or stripped "/sr", these would produce targets. They must not.
    expect(resolveSwitchTarget('/contact')).toBeNull()
    expect(resolveSwitchTarget('/sr/contact')).toBeNull()
    expect(resolveSwitchTarget('/professional-services')).toBeNull()

    const source = readFileSync(join(ROOT, 'components/i18n/LanguageSwitcher.tsx'), 'utf8')
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
    expect(code).not.toMatch(/\.replace\(/)
    expect(code).not.toMatch(/['"`]\/sr['"`]\s*\+/)
    expect(code).not.toMatch(/startsWith\(/)
  })
})

describe('it renders correctly for a genuine complete pair', () => {
  // Uses the primitives directly with synthetic data: proving the behaviour must not
  // require creating a real /sr route.
  test('the primitive resolves both directions of a synthetic pair', () => {
    expect(counterpartFor('/synthetic-contact', SYNTHETIC_COMPLETE)!.path).toBe('/sr/synthetic-contact')
    expect(counterpartFor('/sr/synthetic-contact', SYNTHETIC_COMPLETE)!.locale).toBe('en')
  })

  test('it renders a correctly annotated link to the Serbian counterpart', () => {
    const { container } = render(
      <LanguageSwitcher currentPath="/synthetic-contact" currentLocale="en" routePairs={SYNTHETIC_COMPLETE} />
    )

    const link = container.querySelector('a')
    expect(link).not.toBeNull()
    expect(link!.getAttribute('href')).toBe('/sr/synthetic-contact')
    // hreflang/lang describe the TARGET document's language, not the current page's.
    expect(link!.getAttribute('hreflang')).toBe('sr-Latn')
    expect(link!.getAttribute('lang')).toBe('sr-Latn')
    expect(link!.textContent).toBe('Srpski')
    expect(link!.getAttribute('aria-label')).toBe('Change language: Srpski')
  })

  test('the reverse direction is labelled in Serbian', () => {
    const { container } = render(
      <LanguageSwitcher currentPath="/sr/synthetic-contact" currentLocale="sr" routePairs={SYNTHETIC_COMPLETE} />
    )

    const link = container.querySelector('a')
    expect(link!.getAttribute('href')).toBe('/synthetic-contact')
    expect(link!.getAttribute('hreflang')).toBe('en')
    expect(link!.textContent).toBe('English')
    // Control label comes from the CURRENT locale's dictionary.
    expect(link!.getAttribute('aria-label')).toBe('Promeni jezik: English')
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
})

describe('it is NOT mounted anywhere', () => {
  /** Every .ts/.tsx file under app/ and components/, except the switcher and its test. */
  function sourceFiles(dir: string, out: string[] = []): string[] {
    for (const entry of readdirSync(dir)) {
      if (entry === 'node_modules' || entry.startsWith('.')) continue
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) sourceFiles(full, out)
      else if (/\.tsx?$/.test(entry)) out.push(relative(ROOT, full))
    }
    return out
  }

  const files = sourceFiles(join(ROOT, 'app'))
    .concat(sourceFiles(join(ROOT, 'components')))
    .filter((f) => f !== join('components', 'i18n', 'LanguageSwitcher.tsx'))

  test('no page, layout or component imports it', () => {
    const importers = files.filter((f) => /LanguageSwitcher/.test(readFileSync(join(ROOT, f), 'utf8')))
    expect(importers, 'the switcher must stay unmounted until a real pair exists').toEqual([])
  })

  test('the shared chrome renders no language control', () => {
    for (const file of ['components/shell/RootShell.tsx', 'components/shell/SiteChrome.tsx', 'components/ui/navbar-demo.tsx']) {
      const source = readFileSync(join(ROOT, file), 'utf8')
      expect(source, `${file} must not reference the switcher`).not.toMatch(/LanguageSwitcher|data-language-switcher/)
    }
  })

  test('the component itself is the only place the marker attribute exists', () => {
    const markerFiles = files.filter((f) => /data-language-switcher/.test(readFileSync(join(ROOT, f), 'utf8')))
    expect(markerFiles).toEqual([])
  })
})
