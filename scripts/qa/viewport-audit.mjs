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

// ── BOTH MythBusting pages' two form instances ───────────────────────────────
// The Serbian source asked for a form at the top AND the bottom; the owner has since approved
// the same conversion principle for English, so both pages now render two instances. Two
// instances on one page make DOM-id uniqueness a correctness requirement, not a nicety:
// duplicate ids would make both labels focus the first input.
//
// The Serbian page is checked for its own extra furniture (five FAQ rows, four myth/fact
// previews); the English page shares only the two-form contract.
//
// The band's SAP mark is now checked on BOTH locales — they render the same four-cell trust
// band, so it stopped being Serbian-only furniture. The Infinus mark is no longer part of that
// band at all, which is why nothing asserts it here any more.
const MYTH_PAGES = [
  { locale: 'sr', path: '/sr/insights/sap-mythbusters', full: true },
  { locale: 'en', path: '/insights/sap-mythbusters', full: false },
]

const formChecks = []
for (const width of [320, 430]) {
 for (const target of MYTH_PAGES) {
  const context = await browser.newContext({ viewport: { width, height: 900 } })
  const page = await context.newPage()
  await page.goto(BASE + target.path, { waitUntil: 'networkidle' })

  const info = await page.evaluate(() => {
    const ids = Array.from(document.querySelectorAll('[id]')).map((el) => el.id)
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)

    // Every label must resolve to an input INSIDE its own form instance.
    let escaped = 0
    for (const form of Array.from(document.querySelectorAll('[data-testid^="ebook-form-"]'))) {
      for (const label of Array.from(form.querySelectorAll('label'))) {
        const target = label.htmlFor ? document.getElementById(label.htmlFor) : null
        if (!target || !form.contains(target)) escaped++
      }
    }

    const cover = document.querySelector('img[src*="sap-mythbusting-ebook-cover"]')
    return {
      hero: !!document.querySelector('[data-testid="ebook-form-hero"]'),
      closing: !!document.querySelector('[data-testid="ebook-form-closing"]'),
      duplicates: Array.from(new Set(duplicates)),
      escaped,
      coverVisible: cover ? cover.getBoundingClientRect().width > 0 : false,
      sapLogo: !!document.querySelector('[data-section="mythbusters-trust"] img[alt="SAP Gold Partner"]'),
      // The band must NOT carry the Infinus mark any more; kept as a check, inverted.
      infinusLogo: !!document.querySelector('[data-section="mythbusters-trust"] img[alt="Infinus"]'),
      trustCells: document.querySelectorAll('[data-section="mythbusters-trust"] li').length,
      // The FAQ is a real accordion now, so there are no `dt` elements to count; each row
      // carries `data-faq-item`. The myth/fact previews carry `data-myth-item` rather than
      // being counted as `.grid > div`, which coupled this audit to a layout class.
      faq: document.querySelectorAll('[data-section="mythbusters-faq"] [data-faq-item]').length,
      previews: document.querySelectorAll('[data-myth-item]').length,
    }
  })
  formChecks.push({ width, locale: target.locale, full: target.full, ...info })
  await context.close()
 }
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

console.log('\n── MythBusting: two form instances per locale ───────')
for (const c of formChecks) {
  const shared =
    c.hero &&
    c.closing &&
    c.duplicates.length === 0 &&
    c.escaped === 0 &&
    c.coverVisible &&
    // Both locales now render the same band: the SAP mark present, Infinus gone, four cells.
    c.sapLogo &&
    !c.infinusLogo &&
    c.trustCells === 4
  const srOnly = c.faq === 5 && c.previews === 4
  const ok = c.full ? shared && srOnly : shared
  if (!ok) failures++
  console.log(
    `  ${ok ? '✓' : '✗'} ${c.locale} ${String(c.width).padEnd(4)} hero=${c.hero} closing=${c.closing}` +
      ` dupIds=${c.duplicates.length} escapedLabels=${c.escaped} cover=${c.coverVisible}` +
      ` sapMark=${c.sapLogo} infinusInBand=${c.infinusLogo} cells=${c.trustCells}` +
      (c.full ? ` faq=${c.faq} previews=${c.previews}` : '')
  )
  if (c.duplicates.length) console.log(`        duplicate ids: ${c.duplicates.join(', ')}`)
}

console.log(`\n${failures === 0 ? 'PASS' : `FAIL — ${failures} problem(s)`}\n`)
process.exit(failures === 0 ? 0 : 1)
