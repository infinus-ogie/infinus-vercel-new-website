import { test, expect, type Page } from '@playwright/test'

/**
 * The video overlay's close control must be reachable at every viewport.
 *
 * ── The bug this guards ────────────────────────────────────────────────────────
 * The control was `absolute -top-16 right-0` on the OUTER container. That container is
 * vertically centred and its height follows the video's 16:9 aspect ratio, so the control's
 * absolute position drifted with viewport width:
 *
 *     320-430px   y 110..169   usable
 *     1024px      y 8..46      inside the viewport, but BEHIND the z-50 navbar
 *     1440px      y -42..-4    off-screen entirely
 *
 * No offset fixes that while keeping the control above the video: at 1440px the gap between
 * the navbar (bottom 86px) and the video (top 119px) is 33px, and the control is taller.
 * Anchoring to the video wrapper was tried and rejected: it fixes every width at 900px tall,
 * but the overlay content is taller than a short viewport, and `items-center` on an
 * over-tall child clips the top — at 1280x720 the video itself ends up behind the navbar,
 * taking anything positioned relative to it along. The control is now pinned to the FIXED
 * OVERLAY, so its position is independent of content height. It measures 96..140 at every
 * viewport below, which is the point.
 *
 * ── Why a real browser ─────────────────────────────────────────────────────────
 * This is geometry. jsdom has no layout, so `getBoundingClientRect` returns zeros and
 * `elementFromPoint` does not exist — it cannot distinguish an off-screen control from a
 * usable one.
 *
 * ── Why no lifecycle waits ─────────────────────────────────────────────────────
 * The <video> onError handler reassigns its own src, so on a browser without an H.264
 * decoder this route retries forever and never fires `load` or reaches `networkidle`. Every
 * wait here is a selector wait or a URL poll.
 */

const ROUTES = [
  { path: '/projectpulse/video', previous: '/projectpulse' },
  { path: '/sr/projectpulse/video', previous: '/sr/projectpulse' },
]

/**
 * The six widths the owner asked for, plus SHORT viewports.
 *
 * The heights matter as much as the widths here: the overlay content is ~856px tall, so
 * anything under that clips, and 1280x720 is exactly the case that defeated the previous
 * attempt at this fix. Playwright's own default viewport is 1280x720, which is how it was
 * caught.
 */
const VIEWPORTS: ReadonlyArray<{ width: number; height: number }> = [
  { width: 320, height: 800 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 1024, height: 900 },
  { width: 1440, height: 900 },
  // Short viewports — the content is taller than the screen at these sizes.
  { width: 1280, height: 720 },
  { width: 1024, height: 600 },
  { width: 1440, height: 700 },
]

async function openOverlay(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' })
  await page.locator('video').waitFor({ state: 'attached' })
  await page.waitForFunction(() => document.querySelector('nav') !== null)
  await page.waitForTimeout(1500)
}

async function waitForPath(page: Page, expected: string, tries = 60): Promise<string> {
  let at = new URL(page.url()).pathname
  for (let i = 0; i < tries && at !== expected; i += 1) {
    await page.waitForTimeout(250)
    at = new URL(page.url()).pathname
  }
  return at
}

const CLOSE = 'button[aria-label]'

test.describe('video close control geometry', () => {
  for (const { path } of ROUTES) {
    for (const { width, height } of VIEWPORTS) {
      test(`${path} @ ${width}x${height} — fully inside the viewport and clear of the navbar`, async ({ page }) => {
        await page.setViewportSize({ width, height })
        await openOverlay(page, path)

        const geo = await page.evaluate((sel) => {
          const btn = document.querySelector(sel) as HTMLElement | null
          const nav = document.querySelector('nav')
          if (btn === null || nav === null) return null
          const r = btn.getBoundingClientRect()
          const n = nav.getBoundingClientRect()
          const cx = r.x + r.width / 2
          const cy = r.y + r.height / 2
          const hit =
            cx >= 0 && cx <= innerWidth && cy >= 0 && cy <= innerHeight
              ? document.elementFromPoint(cx, cy)
              : null
          return {
            top: r.top, right: r.right, bottom: r.bottom, left: r.left,
            width: r.width, height: r.height,
            cx, cy, navBottom: n.bottom, vw: innerWidth, vh: innerHeight,
            topmost: hit !== null && (hit === btn || btn.contains(hit) || hit.contains(btn)),
          }
        }, CLOSE)

        expect(geo, 'close control not found').not.toBeNull()
        const g = geo!

        // The four assertions the owner specified.
        expect(g.top, 'top must not be above the viewport').toBeGreaterThanOrEqual(0)
        expect(g.right, 'right edge must not exceed the viewport').toBeLessThanOrEqual(g.vw)
        expect(g.cx).toBeGreaterThanOrEqual(0)
        expect(g.cx).toBeLessThanOrEqual(g.vw)
        expect(g.cy, 'centre must be inside the viewport').toBeGreaterThanOrEqual(0)
        expect(g.cy).toBeLessThanOrEqual(g.vh)
        expect(g.left, 'left edge must not be off-screen').toBeGreaterThanOrEqual(0)
        expect(g.bottom, 'bottom must be inside the viewport').toBeLessThanOrEqual(g.vh)

        // Not hidden behind the navbar — the 1024px half of the bug.
        expect(g.top, 'must sit below the navbar, not behind it').toBeGreaterThanOrEqual(g.navBottom)

        // Actually the topmost element at its own centre, so a click lands on it.
        expect(g.topmost, 'something is covering the close control').toBe(true)

        // An adequate touch target. It measured 38px before.
        expect(g.height, 'touch target too short').toBeGreaterThanOrEqual(44)
        expect(g.width).toBeGreaterThanOrEqual(44)
      })
    }
  }
})

test.describe('video close control behaviour', () => {
  for (const { path, previous } of ROUTES) {
    test(`${path} — clicking it closes`, async ({ page }) => {
      await page.goto(previous, { waitUntil: 'networkidle' })
      await openOverlay(page, path)
      await page.locator(CLOSE).click()
      expect(await waitForPath(page, previous)).toBe(previous)
    })

    test(`${path} — reachable by Tab, and Enter closes`, async ({ page }) => {
      await page.goto(previous, { waitUntil: 'networkidle' })
      await openOverlay(page, path)
      let reached = false
      for (let i = 0; i < 25 && !reached; i += 1) {
        await page.keyboard.press('Tab')
        reached = await page.evaluate(() => {
          const a = document.activeElement
          return a !== null && a.tagName === 'BUTTON' && a.getAttribute('aria-label') !== null
        })
      }
      expect(reached, 'Tab never reaches the close control').toBe(true)
      // A visible focus indicator, not just focusability.
      const outline = await page.evaluate(() => getComputedStyle(document.activeElement as Element).outlineStyle)
      expect(outline, 'no visible focus ring').not.toBe('none')
      await page.keyboard.press('Enter')
      expect(await waitForPath(page, previous)).toBe(previous)
    })

    test(`${path} — Space closes`, async ({ page }) => {
      await page.goto(previous, { waitUntil: 'networkidle' })
      await openOverlay(page, path)
      await page.locator(CLOSE).focus()
      await page.keyboard.press('Space')
      expect(await waitForPath(page, previous)).toBe(previous)
    })

    test(`${path} — a mobile tap closes`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 })
      await page.goto(previous, { waitUntil: 'networkidle' })
      await openOverlay(page, path)
      await page.locator(CLOSE).click()
      expect(await waitForPath(page, previous)).toBe(previous)
    })

    test(`${path} — clicking the video does NOT close`, async ({ page }) => {
      await page.goto(previous, { waitUntil: 'networkidle' })
      await openOverlay(page, path)
      const box = await page.locator('video').boundingBox()
      // Lower part of the video, well clear of the close control in the top-right.
      await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height * 0.7)
      await page.waitForTimeout(1200)
      expect(new URL(page.url()).pathname).toBe(path)
    })
  }
})
