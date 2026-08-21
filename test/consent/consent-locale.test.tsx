/**
 * The consent UI follows the SITE locale, not the URL.
 *
 * ── Why the distinction is the whole point ──────────────────────────────────────
 * Four Serbian pages live at UNPREFIXED URLs — /grow, /grow/cfo, /grow/ceo and
 * /professional-services. Deciding locale from `pathname.startsWith('/sr')` would hand those
 * pages an English cookie banner and send them to the English Privacy Policy. Root position
 * knows they are Serbian; the URL does not.
 *
 * So the locale comes from which ROOT LAYOUT rendered the document, threaded
 * app/(sr)/layout.tsx -> RootShell -> ConsentProvider -> the banner and the dialog. Decided
 * at BUILD time, from a file's position in the tree. This file proves the plumbing and the
 * copy; scripts/qa/consent-locale.spec.ts proves it in a real browser on the actual routes.
 *
 * ── What is deliberately NOT asserted here ──────────────────────────────────────
 * Consent BEHAVIOUR. This pass changed copy and one destination, nothing else, and the
 * behaviour is already covered by test/consent/consent-ui.test.tsx and
 * test/consent/consent-record.test.ts. The two behaviour tests below exist only to prove
 * that localisation did not disturb the two invariants most likely to break silently:
 * non-essential categories off by default, and Accept/Reject equally prominent.
 */

import { describe, test, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import fs from 'node:fs'
import { ConsentProvider } from '@/components/consent/ConsentProvider'
import { CookieBanner } from '@/components/consent/CookieBanner'
import { CookieSettingsDialog, CookieSettingsButton } from '@/components/consent/CookieSettingsDialog'
import { getDictionary, DICTIONARY_NAMESPACES } from '@/content/dictionary'
import { LOCALES, type Locale } from '@/lib/i18n'
import { CONSENT_COOKIE } from '@/lib/consent'

/**
 * Read a source file with comments removed.
 *
 * The assertions below forbid certain identifiers in the consent components' CODE. Those
 * files' own doc comments legitimately discuss the forbidden things — ConsentProvider's
 * header says "Nothing here touches `next/headers`" — so searching the raw text finds the
 * documentation rather than a violation.
 */
function code(file: string): string {
  return fs
    .readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
}

const en = getDictionary('en').consent
const sr = getDictionary('sr').consent

function mount(locale: Locale) {
  return render(
    <ConsentProvider copy={getDictionary(locale).consent}>
      <CookieBanner />
      <CookieSettingsDialog />
      <CookieSettingsButton className="footer-cookie" />
    </ConsentProvider>
  )
}

beforeEach(() => {
  // No stored decision, so the banner renders.
  document.cookie = `${CONSENT_COOKIE}=; Max-Age=0; path=/`
})

describe('A. the dictionaries are complete and independent', () => {
  test('consent is a registered namespace, so key parity is enforced', () => {
    expect(DICTIONARY_NAMESPACES.indexOf('consent')).not.toBe(-1)
  })

  test('every visible string is present and non-empty in BOTH locales', () => {
    for (const locale of LOCALES) {
      const c = getDictionary(locale).consent
      const strings = [
        c.banner.title, c.banner.body, c.banner.accept, c.banner.reject,
        c.banner.settings, c.banner.policyLink,
        c.settings.title, c.settings.intro, c.settings.save, c.settings.acceptAll,
        c.settings.rejectAll, c.settings.close, c.settings.alwaysOn,
        c.settings.categories.necessary.label, c.settings.categories.necessary.description,
        c.settings.categories.analytics.label, c.settings.categories.analytics.description,
        c.settings.categories.marketing.label, c.settings.categories.marketing.description,
        c.privacyHref,
      ]
      for (const s of strings) {
        expect(typeof s, locale).toBe('string')
        expect(s.length, `${locale}: empty consent string`).toBeGreaterThan(0)
      }
    }
  })

  test('there is NO fallback: the Serbian copy is genuinely Serbian, not English', () => {
    // A silent fallback would show up as the two locales agreeing on prose. The only values
    // allowed to match are the ones that are the same word in both languages.
    const SAME_BY_DESIGN = new Set(['Marketing'])
    const pairs: Array<[string, string, string]> = [
      ['banner.title', en.banner.title, sr.banner.title],
      ['banner.body', en.banner.body, sr.banner.body],
      ['banner.accept', en.banner.accept, sr.banner.accept],
      ['banner.reject', en.banner.reject, sr.banner.reject],
      ['banner.settings', en.banner.settings, sr.banner.settings],
      ['banner.policyLink', en.banner.policyLink, sr.banner.policyLink],
      ['settings.title', en.settings.title, sr.settings.title],
      ['settings.intro', en.settings.intro, sr.settings.intro],
      ['settings.save', en.settings.save, sr.settings.save],
      ['settings.acceptAll', en.settings.acceptAll, sr.settings.acceptAll],
      ['settings.rejectAll', en.settings.rejectAll, sr.settings.rejectAll],
      ['settings.close', en.settings.close, sr.settings.close],
      ['settings.alwaysOn', en.settings.alwaysOn, sr.settings.alwaysOn],
      ['necessary.label', en.settings.categories.necessary.label, sr.settings.categories.necessary.label],
      ['necessary.description', en.settings.categories.necessary.description, sr.settings.categories.necessary.description],
      ['analytics.label', en.settings.categories.analytics.label, sr.settings.categories.analytics.label],
      ['analytics.description', en.settings.categories.analytics.description, sr.settings.categories.analytics.description],
      ['marketing.label', en.settings.categories.marketing.label, sr.settings.categories.marketing.label],
      ['marketing.description', en.settings.categories.marketing.description, sr.settings.categories.marketing.description],
      ['privacyHref', en.privacyHref, sr.privacyHref],
    ]
    for (const [key, a, b] of pairs) {
      if (SAME_BY_DESIGN.has(a)) { expect(a, key).toBe(b); continue }
      expect(a, `${key} is identical in both locales — a fallback, or a missed translation`).not.toBe(b)
    }
  })

  test('the Serbian copy is Latin script with real diacritics', () => {
    const all = JSON.stringify(sr)
    expect(/[Ѐ-ӿ]/.test(all), 'Cyrillic in the Serbian consent copy').toBe(false)
    expect(/[čćžšđ]/i.test(all), 'no Serbian diacritics at all — likely ASCII-flattened').toBe(true)
    expect(all.indexOf('�'), 'replacement character').toBe(-1)
  })

  test('the ENGLISH strings are byte-identical to what shipped before localisation', () => {
    // Extracted verbatim from the old components/consent/consent-copy.ts. The English consent
    // UI must read exactly as it did; only its Serbian sibling is new.
    expect(en.banner.title).toBe('Cookies on infinus.co')
    expect(en.banner.body).toBe(
      'We use cookies that are necessary for the website to work. With your consent we also use analytics cookies to understand how the site is used, and marketing cookies. You can refuse, or change your choice later.'
    )
    expect(en.banner.accept).toBe('Accept')
    expect(en.banner.reject).toBe('Reject')
    expect(en.banner.settings).toBe('Cookie settings')
    expect(en.banner.policyLink).toBe('Privacy Policy')
    expect(en.settings.title).toBe('Cookie settings')
    expect(en.settings.intro).toBe(
      'Choose which cookies you allow. Necessary cookies are always on because the site cannot work without them. Analytics and marketing cookies are off until you turn them on.'
    )
    expect(en.settings.save).toBe('Save settings')
    expect(en.settings.acceptAll).toBe('Accept all')
    expect(en.settings.rejectAll).toBe('Reject all')
    expect(en.settings.close).toBe('Close')
    expect(en.settings.alwaysOn).toBe('Always on')
    expect(en.settings.categories.necessary.label).toBe('Necessary')
    expect(en.settings.categories.necessary.description).toBe(
      'Required for the site to load, for security, and to remember your cookie choice. These cannot be switched off.'
    )
    expect(en.settings.categories.analytics.label).toBe('Analytics')
    expect(en.settings.categories.analytics.description).toBe(
      'Google Analytics, used to measure which pages are visited. Nothing loads until you allow this.'
    )
    expect(en.settings.categories.marketing.label).toBe('Marketing')
    expect(en.settings.categories.marketing.description).toBe(
      'Visitor-identification and marketing tools. Nothing loads until you allow this.'
    )
  })

  test('the Serbian banner strings that already shipped are unchanged', () => {
    // These two were the old `titleSr` / `bodySr`, rendered alongside the English text.
    expect(sr.banner.title).toBe('Kolačići na infinus.co')
    expect(sr.banner.body).toBe(
      'Koristimo kolačiće neophodne za rad sajta. Uz Vaš pristanak koristimo i analitičke kolačiće, kao i marketinške kolačiće. Možete odbiti ili kasnije promeniti izbor.'
    )
  })

  test('the owner-approved Serbian terms are used exactly', () => {
    expect(sr.banner.settings).toBe('Podešavanja kolačića')
    expect(sr.settings.title).toBe('Podešavanja kolačića')
    expect(sr.banner.policyLink).toBe('Politika privatnosti')
    expect(sr.banner.accept).toBe('Prihvati')
    expect(sr.banner.reject).toBe('Odbij')
    expect(sr.settings.categories.necessary.label).toBe('Neophodni')
    expect(sr.settings.categories.analytics.label).toBe('Analitika')
    expect(sr.settings.categories.marketing.label).toBe('Marketing')
    expect(sr.settings.save).toBe('Sačuvaj podešavanja')
  })
})

describe('B. the privacy destination is locale-aware by construction', () => {
  test('the dictionaries point at their own locale’s legal page', () => {
    expect(en.privacyHref).toBe('/privacy')
    expect(sr.privacyHref).toBe('/sr/politika-privatnosti')
  })

  test('the rendered BANNER links to this locale’s policy', () => {
    for (const [locale, want] of [['en', '/privacy'], ['sr', '/sr/politika-privatnosti']] as const) {
      const { unmount } = mount(locale)
      const link = screen.getByTestId('cookie-banner-privacy')
      expect(link.getAttribute('href'), locale).toBe(want)
      expect(link.textContent, locale).toBe(getDictionary(locale).consent.banner.policyLink)
      unmount()
    }
  })

  test('the rendered SETTINGS DIALOG links to this locale’s policy too', () => {
    // Two components expose the link; both must resolve the same way, or a visitor could
    // reach the wrong document depending on which one they used.
    for (const [locale, want] of [['en', '/privacy'], ['sr', '/sr/politika-privatnosti']] as const) {
      const { unmount } = mount(locale)
      fireEvent.click(screen.getByTestId('cookie-settings-open'))
      expect(screen.getByTestId('cookie-settings-privacy').getAttribute('href'), locale).toBe(want)
      unmount()
    }
  })

  test('no component resolves the destination from a pathname', () => {
    // The regression that would break /grow: locale inferred from the URL. Asserted against
    // the source, because a runtime test on / and /sr would pass while /grow silently broke.
    for (const f of [
      'components/consent/CookieBanner.tsx',
      'components/consent/CookieSettingsDialog.tsx',
      'components/consent/ConsentProvider.tsx',
    ]) {
      const src = code(f)
      expect(src.indexOf('usePathname'), `${f} must not read the pathname`).toBe(-1)
      expect(src.indexOf("startsWith('/sr')"), `${f} must not sniff the URL`).toBe(-1)
      expect(src.indexOf('"/sr'), `${f} must not hardcode a Serbian path`).toBe(-1)
      expect(src.indexOf('/privacy'), `${f} must not hardcode a legal path`).toBe(-1)
    }
  })

  test('nothing in the consent UI reads request state', () => {
    for (const f of [
      'components/consent/CookieBanner.tsx',
      'components/consent/CookieSettingsDialog.tsx',
      'components/consent/ConsentProvider.tsx',
      'components/shell/RootShell.tsx',
    ]) {
      const src = code(f)
      expect(src.indexOf('next/headers'), `${f} would break static rendering`).toBe(-1)
      expect(src.indexOf('cookies()'), f).toBe(-1)
      expect(src.indexOf('headers()'), f).toBe(-1)
      expect(src.indexOf('Accept-Language'), f).toBe(-1)
    }
  })
})

describe('C. one implementation, rendered in whichever language it is given', () => {
  test('there is exactly one banner and one dialog implementation', () => {
    const files = fs.readdirSync('components/consent')
    expect(files.filter((f) => /CookieBanner/.test(f))).toEqual(['CookieBanner.tsx'])
    expect(files.filter((f) => /CookieSettingsDialog/.test(f))).toEqual(['CookieSettingsDialog.tsx'])
    // No per-locale forks anywhere.
    expect(files.filter((f) => /Sr\.tsx$|-sr\.tsx$|En\.tsx$/.test(f))).toEqual([])
  })

  test('the English banner shows no Serbian string, and vice versa', () => {
    const { container: enBox, unmount: unEn } = mount('en')
    const enText = enBox.textContent ?? ''
    expect(enText).toContain(en.banner.title)
    expect(enText).not.toContain(sr.banner.title)
    expect(enText).not.toContain(sr.banner.accept)
    unEn()

    const { container: srBox, unmount: unSr } = mount('sr')
    const srText = srBox.textContent ?? ''
    expect(srText).toContain(sr.banner.title)
    expect(srText).not.toContain(en.banner.title)
    // "Accept" must not survive on the Serbian banner.
    expect(srText).not.toContain(en.banner.accept)
    unSr()
  })

  test('the settings dialog is fully localised, accessible names included', () => {
    const { unmount } = mount('sr')
    fireEvent.click(screen.getByTestId('cookie-settings-open'))
    const dialog = screen.getByTestId('cookie-settings-dialog')
    const text = dialog.textContent ?? ''
    for (const s of [
      sr.settings.title, sr.settings.intro, sr.settings.save, sr.settings.acceptAll,
      sr.settings.rejectAll, sr.settings.alwaysOn,
      sr.settings.categories.necessary.label, sr.settings.categories.necessary.description,
      sr.settings.categories.analytics.label, sr.settings.categories.marketing.label,
    ]) {
      expect(text, `missing Serbian string: ${s.slice(0, 40)}`).toContain(s)
    }
    // The close control's accessible name is real user-facing copy.
    expect(screen.getByTestId('cookie-settings-close').getAttribute('aria-label')).toBe(sr.settings.close)
    unmount()
  })

  test('the footer reopen control falls back to THIS locale, not to English', () => {
    // The footer passes its own label in production. When a caller omits it, the fallback
    // must still be the document's language.
    const { unmount } = mount('sr')
    expect(screen.getByTestId('cookie-settings-reopen').textContent).toBe(sr.settings.title)
    unmount()
    mount('en')
    expect(screen.getByTestId('cookie-settings-reopen').textContent).toBe(en.settings.title)
  })
})

describe('D. localisation changed no behaviour', () => {
  test('Accept and Reject stay equally prominent in both locales', () => {
    for (const locale of LOCALES) {
      const { unmount } = mount(locale)
      const accept = screen.getByTestId('cookie-accept')
      const reject = screen.getByTestId('cookie-reject')
      expect(accept.className, locale).toBe(reject.className)
      expect(accept.tagName).toBe('BUTTON')
      expect(reject.tagName).toBe('BUTTON')
      unmount()
    }
  })

  test('non-essential categories are OFF by default in both locales', () => {
    for (const locale of LOCALES) {
      const { unmount } = mount(locale)
      fireEvent.click(screen.getByTestId('cookie-settings-open'))
      expect((document.getElementById('consent-analytics') as HTMLInputElement).checked, locale).toBe(false)
      expect((document.getElementById('consent-marketing') as HTMLInputElement).checked, locale).toBe(false)
      // Necessary is on and cannot be turned off.
      const necessary = document.getElementById('consent-necessary') as HTMLInputElement
      expect(necessary.checked, locale).toBe(true)
      expect(necessary.disabled, locale).toBe(true)
      unmount()
    }
  })
})
