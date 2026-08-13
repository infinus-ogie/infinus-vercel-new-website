import { test, expect } from '@playwright/test'

/**
 * Narrow-viewport regression guard for the shared Contact layout.
 *
 * Runs in the same Playwright project as the consent network proof, against the same
 * production build, so CI covers it through the existing `npm run test:consent` step with no
 * new pipeline stage and no visual-snapshot infrastructure.
 *
 * ── What regressed, and why a browser is required ───────────────────────────────
 * Before this guard existed, /contact scrolled sideways below ~375px: the left column is a
 * shrink-to-fit flex item (`mx-auto`), and shrink-to-fit is floored at the element's
 * min-content width. That floor was 344px (en) / 338px (sr) — set by the single longest word
 * in the h1 at text-5xl — while the container offers only 312px at 360px viewport.
 *
 * jsdom has no layout engine, so `scrollWidth`/`getBoundingClientRect` are meaningless there
 * and a unit test cannot catch this. test/components/contact-layout.test.tsx guards the CSS
 * classes; this file guards the actual rendered geometry.
 *
 * Both locales are checked: the Serbian heading has a different longest word, so it has its
 * own min-content floor and could regress independently.
 */

const NARROW = [320, 360, 375, 390, 430] as const

/** The pair of real pages that share this layout. */
const PAGES = [
  { path: '/contact', locale: 'en', heading: 'Start your SAP transformation' },
  { path: '/sr/contact', locale: 'sr-Latn', heading: 'Započnite svoju SAP transformaciju' },
] as const

for (const page of PAGES) {
  for (const width of NARROW) {
    test(`${page.path} does not scroll horizontally at ${width}px`, async ({ page: p }) => {
      await p.setViewportSize({ width, height: 900 })
      await p.goto(page.path, { waitUntil: 'networkidle' })

      // Dismiss the consent banner so it cannot influence layout measurements.
      const reject = p.getByTestId('cookie-reject')
      if (await reject.count()) {
        await reject.click()
        await p.waitForTimeout(300)
      }

      const result = await p.evaluate(() => {
        const doc = document.documentElement
        const vw = window.innerWidth
        const offenders: string[] = []
        // Only the page body: the shared footer has its own pre-existing narrow-column
        // overflow that does not widen the document and is out of scope here.
        document.querySelectorAll('main *').forEach((el) => {
          const box = el.getBoundingClientRect()
          if (box.width > 0 && box.right > vw + 1) {
            offenders.push(`${el.tagName.toLowerCase()}.${(el.getAttribute('class') ?? '').split(' ')[0]}`)
          }
        })
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          lang: doc.lang,
          offenders,
        }
      })

      // The load-bearing assertion: the document is exactly as wide as the viewport.
      expect(result.scrollWidth, `document is wider than the ${width}px viewport`).toBe(result.clientWidth)
      expect(result.offenders, 'these elements extend past the viewport').toEqual([])
      // Confirms the right page was measured, not a redirect or a 404.
      expect(result.lang).toBe(page.locale)
    })
  }

  test(`${page.path} keeps its heading and form usable at 320px`, async ({ page: p }) => {
    await p.setViewportSize({ width: 320, height: 900 })
    await p.goto(page.path, { waitUntil: 'networkidle' })
    const reject = p.getByTestId('cookie-reject')
    if (await reject.count()) {
      await reject.click()
      await p.waitForTimeout(300)
    }

    // The heading text survives wrapping intact — break-words may split a word across lines
    // visually, but the text content must not change.
    await expect(p.locator('main h1')).toHaveText(page.heading)

    const fitsInViewport = async (selector: string) =>
      p.evaluate((sel) => {
        const el = document.querySelector(sel)
        if (el === null) return null
        return el.getBoundingClientRect().right <= window.innerWidth + 1
      }, selector)

    for (const selector of [
      'main h1',
      'main form',
      '#name',
      '#email',
      '#subject',
      '#message',
      '#attachment',
      'main form button[type="submit"]',
    ]) {
      expect(await fitsInViewport(selector), `${selector} extends past the viewport`).toBe(true)
    }
  })
}
