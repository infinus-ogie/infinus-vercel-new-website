/**
 * Viewport regression audit.
 *
 * Answers two questions the client asked for and one the plan added:
 *   · is there any document-level HORIZONTAL OVERFLOW at 320/360/390/430?
 *   · does the homepage's first-screen CTA actually sit ON the first screen?
 *   · do the pages render at all in both locales?
 *
 * Run against `npm run start` (a real build), not the dev server.
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const WIDTHS = [320, 360, 390, 430]
const HEIGHT = 568 // the shortest realistic phone, paired with 320

const PAGES = [
  '/', '/sr',
  '/careers', '/sr/careers',
  '/insights/sap-mythbusters', '/sr/insights/sap-mythbusters',
  '/contact', '/sr/contact',
  '/grow', '/sr/grow',
  '/professional-services', '/sr/professional-services',
  '/faq', '/sr/faq',
  '/privacy', '/sr/politika-privatnosti',
]

const results = []
let failures = 0

const browser = await chromium.launch()
for (const width of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height: HEIGHT } })
  const page = await context.newPage()

  for (const path of PAGES) {
    const response = await page.goto(BASE + path, { waitUntil: 'networkidle' })
    const status = response?.status() ?? 0

    const metrics = await page.evaluate(() => {
      const doc = document.documentElement
      // Widest element that actually sticks out, for a diagnosable failure.
      let worst = null
      for (const el of Array.from(document.body.querySelectorAll('*'))) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        const over = Math.round(r.right - doc.clientWidth)
        if (over > 1 && (!worst || over > worst.over)) {
          worst = { over, tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 60) }
        }
      }
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        worst,
      }
    })

    const overflow = metrics.scrollWidth - metrics.clientWidth
    const ok = status === 200 && overflow <= 1
    if (!ok) failures++
    results.push({ width, path, status, overflow, worst: metrics.worst, ok })
  }
  await context.close()
}

// The first-screen CTA and badge, homepage only, at the tightest viewport.
const ctaChecks = []
for (const [path, label] of [['/', 'Contact Us'], ['/sr', 'Kontaktirajte nas']]) {
  const context = await browser.newContext({ viewport: { width: 320, height: HEIGHT } })
  const page = await context.newPage()
  await page.goto(BASE + path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000) // the hero staggers in over ~1.5s
  const info = await page.evaluate((label) => {
    const cta = Array.from(document.querySelectorAll('a')).find(
      (a) => a.textContent?.trim() === label
    )
    const badge = document.querySelector('img[src*="sap-gold-partner-badge"]')
    const logo = document.querySelector('img[src*="infinus-logo"]')
    const bottom = (el) => (el ? Math.round(el.getBoundingClientRect().bottom) : null)
    const top = (el) => (el ? Math.round(el.getBoundingClientRect().top) : null)
    return {
      ctaBottom: bottom(cta),
      badgeBottom: bottom(badge),
      logoTop: top(logo),
      viewport: window.innerHeight,
    }
  }, label)
  ctaChecks.push({ path, label, ...info })
  await context.close()
}
await browser.close()

console.log('\n── Horizontal overflow ──────────────────────────────')
for (const w of WIDTHS) {
  const bad = results.filter((r) => r.width === w && !r.ok)
  console.log(`  ${w}px: ${bad.length === 0 ? 'clean' : `${bad.length} FAIL`}`)
  for (const b of bad) {
    console.log(`      ✗ ${b.path} status=${b.status} overflow=${b.overflow}px`, b.worst ?? '')
  }
}

console.log('\n── First-screen fit at 320x568 ──────────────────────')
for (const c of ctaChecks) {
  // The hero is min-h-screen with items-center and overflow-hidden: content taller than
  // the viewport gets clipped at BOTH ends, so the logo's top matters as much as the
  // badge's bottom.
  const ctaOk = c.ctaBottom !== null && c.ctaBottom <= c.viewport
  const badgeOk = c.badgeBottom !== null && c.badgeBottom <= c.viewport
  const logoOk = c.logoTop !== null && c.logoTop >= 0
  if (!ctaOk || !badgeOk || !logoOk) failures++
  console.log(
    `  ${c.path.padEnd(4)} logo top=${c.logoTop}px ${logoOk ? 'ok' : 'CLIPPED ABOVE'}` +
      ` | CTA bottom=${c.ctaBottom}px ${ctaOk ? 'ok' : 'BELOW THE FOLD'}` +
      ` | badge bottom=${c.badgeBottom}px ${badgeOk ? 'ok' : 'BELOW THE FOLD'}` +
      ` | viewport=${c.viewport}px`
  )
}

console.log(`\n${failures === 0 ? 'PASS' : `FAIL — ${failures} problem(s)`}\n`)
process.exit(failures === 0 ? 0 : 1)
