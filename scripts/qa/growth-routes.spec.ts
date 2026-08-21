import { test, expect, type Page } from '@playwright/test'

/**
 * The eight GROW / Professional Services routes, checked in a real browser.
 *
 * ── Why this file exists ────────────────────────────────────────────────────────
 * These four pairs went through a URL migration that changed the LANGUAGE served at four
 * already-published paths: /grow, /grow/cfo, /grow/ceo and /professional-services were
 * Serbian, and are English now, with the Serbian content moved to the same paths under /sr.
 *
 * The unit suite proves the route map is right and the SEO harness proves the built HTML is
 * right. Neither can prove the thing a visitor actually experiences: that the page loads, that
 * it is in the language the URL claims, that the chrome around it belongs to that language,
 * and that the switcher gets you to the other half. A migration is exactly when those come
 * apart — a stale link or a mismatched locale root produces a page that is individually
 * correct and collectively wrong.
 *
 * Deliberately NOT a copy test. The English copy is a review draft and will change; asserting
 * prose here would turn every editorial tweak into a failing browser test. What is asserted is
 * structural: language, chrome locale, canonical, hreflang, counterpart, and no horizontal
 * overflow — plus two things that LOOK like copy and are really wiring:
 *
 *   · the closing CTA's destination, which pointed at the English /contact from Serbian pages
 *   · the trust pills, which rendered English on all four Serbian pages because StatPills
 *     defaulted to the English dictionary when a call site omitted `trust`
 *
 * Both are read off the rendered page rather than the dictionary. A dictionary test proves the
 * value is right; only this proves the right value reaches the element.
 */

const PAIRS = [
  { en: '/grow', sr: '/sr/grow' },
  { en: '/grow/cfo', sr: '/sr/grow/cfo' },
  { en: '/grow/ceo', sr: '/sr/grow/ceo' },
  { en: '/professional-services', sr: '/sr/professional-services' },
] as const

/** A word that appears on the page in one language and cannot appear in the other. */
const MARKER = { en: 'About Infinus', sr: 'O Infinusu' } as const

/**
 * A trust-pill string that differs between locales.
 *
 * "SAP Gold Partner" is deliberately NOT used here — it is identical in both languages, so it
 * would pass whichever dictionary the pills came from, which is precisely the bug this checks
 * for. The consultant count is the one that was rendering in English on Serbian pages.
 */
const PILLS = { en: 'experienced consultants', sr: 'iskusnih konsultanata' } as const

const ORIGIN = 'https://www.infinus.co'

async function head(page: Page) {
  return page.evaluate(() => {
    const attr = (sel: string, name: string) =>
      document.querySelector(sel)?.getAttribute(name) ?? null
    return {
      lang: document.documentElement.getAttribute('lang'),
      canonical: attr('link[rel="canonical"]', 'href'),
      ogLocale: attr('meta[property="og:locale"]', 'content'),
      alternates: Array.from(document.querySelectorAll('link[rel="alternate"]'))
        .map((l) => `${l.getAttribute('hreflang')} => ${l.getAttribute('href')}`)
        .sort(),
    }
  })
}

for (const pair of PAIRS) {
  for (const locale of ['en', 'sr'] as const) {
    const path = pair[locale]
    const other = locale === 'en' ? pair.sr : pair.en

    test(`${path} — serves ${locale}, in ${locale} chrome and pills, CTA + switcher correct`, async ({
      page,
    }) => {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' })
      expect(response?.status(), `${path} must be 200`).toBe(200)

      // ── the document declares the right language ──────────────────────────────
      const h = await head(page)
      expect(h.lang, `${path} <html lang>`).toBe(locale === 'en' ? 'en' : 'sr-Latn')
      expect(h.ogLocale, `${path} og:locale`).toBe(locale === 'en' ? 'en_US' : 'sr_RS')
      expect(h.canonical, `${path} must be self-canonical`).toBe(`${ORIGIN}${path}`)

      // Reciprocal hreflang, x-default on the English half.
      expect(h.alternates, `${path} alternates`).toEqual(
        [
          `en => ${ORIGIN}${pair.en}`,
          `sr-Latn => ${ORIGIN}${pair.sr}`,
          `x-default => ${ORIGIN}${pair.en}`,
        ].sort()
      )

      // ── the BODY is in that language, not just the head ───────────────────────
      // The marker sits in the About block, which every one of these pages renders.
      const main = page.locator('main')
      await expect(main, `${path} body language`).toContainText(MARKER[locale])
      await expect(main).not.toContainText(MARKER[locale === 'en' ? 'sr' : 'en'])

      // ── the CHROME belongs to the same locale ─────────────────────────────────
      // The footer's own campaign links are the tell: an English footer on a Serbian page
      // would send the visitor across the language boundary without saying so.
      const footerHrefs = await page.evaluate(() =>
        Array.from(document.querySelectorAll('footer a[href^="/"]')).map((a) =>
          a.getAttribute('href')
        )
      )
      const campaign = footerHrefs.filter(
        (h): h is string => h !== null && (h.indexOf('grow') !== -1 || h.indexOf('professional') !== -1)
      )
      expect(campaign.length, `${path} footer has campaign links`).toBeGreaterThan(0)
      for (const href of campaign) {
        const isSerbian = href.indexOf('/sr/') === 0
        expect(isSerbian, `${path} footer link ${href} must stay in this locale`).toBe(locale === 'sr')
      }

      // ── the closing CTA goes to THIS locale's contact page ────────────────────
      // Read off the rendered anchor, not the dictionary: the dictionary test proves the value
      // is right, and this proves the value is what actually reaches the button.
      const contactHrefs = await page.evaluate(() =>
        Array.from(document.querySelectorAll('main a[href]'))
          .map((a) => a.getAttribute('href'))
          .filter((h): h is string => h !== null && h.indexOf('contact') !== -1)
      )
      const wantContact = locale === 'en' ? '/contact' : '/sr/contact'
      const wrongContact = locale === 'en' ? '/sr/contact' : '/contact'
      expect(contactHrefs.length, `${path} has a contact CTA`).toBeGreaterThan(0)
      expect(contactHrefs, `${path} CTA must point at ${wantContact}`).toContain(wantContact)
      expect(contactHrefs, `${path} CTA must not point at ${wrongContact}`).not.toContain(
        wrongContact
      )

      // ── the trust pills are in this page's language ───────────────────────────
      // They defaulted to English on every Serbian page until StatPills lost its default.
      await expect(main, `${path} trust pills`).toContainText(PILLS[locale])
      await expect(main).not.toContainText(PILLS[locale === 'en' ? 'sr' : 'en'])

      // ── the switcher reaches the other half ───────────────────────────────────
      const switcher = page.locator('[data-language-switcher] a').first()
      await expect(switcher, `${path} renders a switcher`).toHaveAttribute('href', other)
      await switcher.click()
      await page.waitForURL((u) => new URL(u).pathname === other, { timeout: 15000 })
      await expect(page.locator('main')).toContainText(MARKER[locale === 'en' ? 'sr' : 'en'])
    })
  }
}

test.describe('the rejected English slugs are gone, not redirected', () => {
  // They were never pushed, deployed or indexed, so a redirect would be inventing history.
  for (const path of [
    '/grow-with-sap',
    '/grow-with-sap/cfo',
    '/grow-with-sap/ceo',
    '/sap-for-professional-services',
  ]) {
    test(`${path} is a 404`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' })
      expect(response?.status(), `${path} must not exist`).toBe(404)
      // And specifically not a redirect: the URL must not have moved.
      expect(new URL(page.url()).pathname).toBe(path)
    })
  }
})

test.describe('the legacy /cfo redirect still lands somewhere real', () => {
  test('/cfo permanently redirects to /grow/cfo, which is now ENGLISH', async ({ page }) => {
    const response = await page.goto('/cfo', { waitUntil: 'domcontentloaded' })
    expect(response?.status()).toBe(200)
    expect(new URL(page.url()).pathname, 'one hop, no chain').toBe('/grow/cfo')
    // The language change is the documented consequence of the migration, asserted rather
    // than left implicit: an old /cfo link used to arrive in Serbian and now arrives in
    // English, one switcher click from /sr/grow/cfo.
    expect(await page.evaluate(() => document.documentElement.lang)).toBe('en')
    await expect(page.locator('main')).toContainText(MARKER.en)
    await expect(page.locator('[data-language-switcher] a').first()).toHaveAttribute(
      'href',
      '/sr/grow/cfo'
    )
  })
})

test.describe('no horizontal overflow on a phone', () => {
  const WIDTHS = [320, 360, 390, 430]
  for (const pair of PAIRS) {
    for (const path of [pair.en, pair.sr]) {
      test(`${path} fits every phone width`, async ({ page }) => {
        for (const width of WIDTHS) {
          await page.setViewportSize({ width, height: 900 })
          await page.goto(path, { waitUntil: 'domcontentloaded' })
          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth
          )
          expect(overflow, `${path} at ${width}px overflows by ${overflow}px`).toBeLessThanOrEqual(0)
        }
      })
    }
  }
})
