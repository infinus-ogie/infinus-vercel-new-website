import { test, expect, type Page } from '@playwright/test'

/**
 * The language switcher must be usable ON the video route.
 *
 * ── The bug this guards ────────────────────────────────────────────────────────
 * The video overlay was `z-[100]`, the single highest layer on the site. The fixed navbar
 * is `z-50`, so the overlay covered it completely: the switcher rendered with a correct
 * href and was simply unclickable, and so was every other navigation control — plus the
 * cookie banner (`z-[60]`) and the consent dialog (`z-[70]`).
 *
 * The overlay now sits at `z-[45]`: above all page content, below the navbar and the
 * consent UI. This spec asserts the OUTCOME rather than the number, so a future restyle
 * that keeps the switcher usable by other means still passes.
 *
 * ── Why this needs a real browser ──────────────────────────────────────────────
 * The defect was pure paint order. Nothing about the markup was wrong — jsdom has no
 * layout and no `elementFromPoint`, so it cannot tell a covered control from a usable one.
 *
 * ── Why lifecycle waits are avoided ────────────────────────────────────────────
 * The <video> element's `onError` handler reassigns its own `src`, so on a browser without
 * an H.264 decoder (headless Chromium) the route retries forever and never reaches `load`
 * or `networkidle`. Every wait below is therefore either a selector wait or a URL poll.
 * A latent consequence worth knowing: that retry is unbounded, so a genuinely missing video
 * would loop indefinitely. Pre-existing, logged, out of scope here.
 */

/**
 * Stop the page fetching the 7.5MB recording over and over.
 *
 * These specs test overlay geometry and navigation, never playback. But headless Chromium has
 * no H.264 decoder, so <video> errors — and `handleVideoError` reassigns `src` on every error
 * with no attempt limit, so the route re-downloads the file forever. Run across a whole suite
 * that saturates the server and makes unrelated assertions time out; two runs failed under
 * load and passed in isolation before this was traced.
 *
 * Aborting the request keeps the retry loop (that defect is logged, not fixed here) but makes
 * each attempt free. Nothing under test depends on the bytes arriving.
 */
test.beforeEach(async ({ page }) => {
  await page.route(/\.mp4(\?|$)/, (route) => route.abort())
})

const PAIR = [
  { from: '/projectpulse/video', to: '/sr/projectpulse/video', hreflang: 'sr-Latn', lang: 'sr-Latn' },
  { from: '/sr/projectpulse/video', to: '/projectpulse/video', hreflang: 'en', lang: 'en' },
]

/** Open a video route and wait for the overlay to hydrate, without a lifecycle wait. */
async function openOverlay(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' })
  await page.locator('video').waitFor({ state: 'attached' })
  // The Escape / backdrop handlers attach in a client effect.
  await page.waitForFunction(() => document.querySelector('nav') !== null)
  await page.waitForTimeout(1500)
}

/** Poll the pathname; see the note above on why waitForURL is unusable here. */
async function waitForPath(page: Page, expected: string, tries = 60): Promise<string> {
  let at = new URL(page.url()).pathname
  for (let i = 0; i < tries && at !== expected; i += 1) {
    await page.waitForTimeout(250)
    at = new URL(page.url()).pathname
  }
  return at
}

test.describe('language switcher on the video route', () => {
  for (const { from, to, hreflang, lang } of PAIR) {
    test(`${from} — the switcher is not covered by the overlay`, async ({ page }) => {
      await openOverlay(page, from)

      const link = page.locator(`nav a[hreflang="${hreflang}"]`).and(page.locator(':visible')).first()
      await expect(link).toHaveCount(1)
      await expect(link).toHaveAttribute('href', to)

      // The actual assertion: the topmost element at the control's own centre IS the
      // control. This is what failed before the fix, with a correct href throughout.
      const box = await link.boundingBox()
      expect(box, 'switcher has no layout box').not.toBeNull()
      const isTopmost = await page.evaluate(
        ([x, y, sel]) => {
          const el = document.elementFromPoint(x as number, y as number)
          const anchor = document.querySelector(sel as string)
          if (el === null || anchor === null) return false
          return el === anchor || anchor.contains(el) || el.contains(anchor)
        },
        [box!.x + box!.width / 2, box!.y + box!.height / 2, `nav a[hreflang="${hreflang}"]`] as const
      )
      expect(isTopmost, 'the language switcher is covered and cannot be clicked').toBe(true)
    })

    test(`${from} — the switcher actually navigates to ${to}`, async ({ page }) => {
      await openOverlay(page, from)
      await page.locator(`nav a[hreflang="${hreflang}"]`).and(page.locator(':visible')).first().click()
      expect(await waitForPath(page, to)).toBe(to)
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
      // Still a video overlay on the other side, not a bare page.
      await expect(page.locator('video')).toHaveCount(1)
    })
  }

  test('the overlay sits below the navbar and the consent UI', async ({ page }) => {
    await openOverlay(page, '/sr/projectpulse/video')
    const z = await page.evaluate(() => {
      const overlay = document.querySelector('div.fixed.inset-0')
      const nav = document.querySelector('nav')
      return {
        overlay: Number(getComputedStyle(overlay as Element).zIndex),
        nav: Number(getComputedStyle(nav as Element).zIndex),
      }
    })
    // Above page content, below the navbar. The consent UI is higher still (60 / 70).
    expect(z.overlay).toBeGreaterThan(40)
    expect(z.overlay).toBeLessThan(z.nav)
    expect(z.nav).toBe(50)
  })

  test('every navbar link is reachable, not just the switcher', async ({ page }) => {
    await openOverlay(page, '/sr/projectpulse/video')
    const unreachable = await page.evaluate(() =>
      Array.from(document.querySelectorAll('nav a'))
        .filter((a) => a.getClientRects().length > 0)
        .filter((a) => {
          const r = a.getBoundingClientRect()
          const el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
          return el === null || !(el === a || a.contains(el) || el.contains(a))
        })
        .map((a) => a.getAttribute('href') ?? '(no href)')
    )
    expect(unreachable, 'these navbar links are covered by the overlay').toEqual([])
  })
})

test.describe('the overlay still behaves like an overlay', () => {
  test('Escape returns to the previous page', async ({ page }) => {
    await page.goto('/sr/projectpulse', { waitUntil: 'networkidle' })
    await openOverlay(page, '/sr/projectpulse/video')
    await page.keyboard.press('Escape')
    expect(await waitForPath(page, '/sr/projectpulse')).toBe('/sr/projectpulse')
  })

  test('a backdrop click returns to the previous page', async ({ page }) => {
    await page.goto('/sr/projectpulse', { waitUntil: 'networkidle' })
    await openOverlay(page, '/sr/projectpulse/video')
    // Far left, vertically centred: dimmed backdrop, well clear of the video and the navbar.
    await page.mouse.click(40, 500)
    expect(await waitForPath(page, '/sr/projectpulse')).toBe('/sr/projectpulse')
  })

  test('clicking the video does NOT dismiss', async ({ page }) => {
    await page.goto('/sr/projectpulse', { waitUntil: 'networkidle' })
    await openOverlay(page, '/sr/projectpulse/video')
    const box = await page.locator('video').boundingBox()
    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.waitForTimeout(1200)
    expect(new URL(page.url()).pathname).toBe('/sr/projectpulse/video')
  })

  test('the dimmed backdrop still covers the whole viewport', async ({ page }) => {
    await openOverlay(page, '/sr/projectpulse/video')
    const covers = await page.evaluate(() => {
      const bd = document.querySelector('div.absolute.inset-0.bg-black\\/70')
      if (bd === null) return null
      const r = bd.getBoundingClientRect()
      return r.width >= innerWidth && r.height >= innerHeight
    })
    // Lowering the z-index must not have shrunk the dim: the navbar paints OVER a full-
    // viewport backdrop, it does not sit on an undimmed strip.
    expect(covers, 'the backdrop no longer covers the viewport').toBe(true)
  })
})

test.describe('no other route changed stacking', () => {
  for (const path of ['/', '/sr', '/contact', '/sr/contact', '/projectpulse', '/sr/projectpulse']) {
    test(`${path} has no overlay and a reachable navbar`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      await page.locator('nav a').first().waitFor()
      const state = await page.evaluate(() => {
        const a = document.querySelector('nav a') as Element
        const r = a.getBoundingClientRect()
        const el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
        return {
          navZ: getComputedStyle(document.querySelector('nav') as Element).zIndex,
          reachable: el !== null && (el === a || a.contains(el) || el.contains(a)),
          hasVideoOverlay: document.querySelector('video') !== null,
        }
      })
      expect(state.navZ).toBe('50')
      expect(state.reachable).toBe(true)
      expect(state.hasVideoOverlay).toBe(false)
    })
  }
})
