/**
 * Link, locale-switcher and consent audit — the client's "all links / EN-SR switching /
 * cookie notice" checks, done mechanically against a real build.
 *
 * Three questions:
 *   1. does every internal link in the shared chrome resolve to a 200?
 *   2. does the EN|SR switcher round-trip — EN -> SR -> back to the same EN URL?
 *   3. does the cookie banner appear for a first-time visitor, in the page's language?
 *
 * The link check crawls the RENDERED navbar and footer rather than reading the dictionaries,
 * so it catches a component that drops or mangles an href as well as a bad destination.
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

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

let failures = 0
const browser = await chromium.launch()

// ── 1. every internal chrome link resolves ───────────────────────────────────
const context = await browser.newContext()
const page = await context.newPage()
const seen = new Map() // href -> status

for (const path of PAGES) {
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded' })

  // Open every dropdown so its links are in the DOM, then harvest nav + footer.
  const triggers = await page.locator('nav[aria-label="Main"] button[aria-haspopup="true"]').all()
  for (const trigger of triggers) {
    if (await trigger.isVisible()) await trigger.click()
  }

  const hrefs = await page.evaluate(() => {
    const nodes = document.querySelectorAll('nav[aria-label="Main"] a[href], footer a[href]')
    return Array.from(new Set(Array.from(nodes).map((a) => a.getAttribute('href'))))
  })

  for (const href of hrefs) {
    if (!href || href === '#' || href.startsWith('mailto:') || href.startsWith('http')) continue
    const target = href.split('#')[0] || '/'
    if (seen.has(target)) continue
    const res = await page.request.get(BASE + target)
    seen.set(target, res.status())
  }
}
await context.close()

const badLinks = [...seen].filter(([, status]) => status !== 200)
if (badLinks.length) failures += badLinks.length

console.log('\n── Internal chrome links ────────────────────────────')
console.log(`  ${seen.size} distinct internal destinations checked`)
for (const [href, status] of badLinks) console.log(`      ✗ ${href} -> ${status}`)
if (!badLinks.length) console.log('  all resolve 200')

// ── 2. the EN|SR switcher round-trips ────────────────────────────────────────
console.log('\n── EN|SR switcher round-trip ────────────────────────')
const PAIRS = [
  ['/', '/sr'],
  ['/careers', '/sr/careers'],
  ['/insights/sap-mythbusters', '/sr/insights/sap-mythbusters'],
  ['/contact', '/sr/contact'],
  ['/grow', '/sr/grow'],
  ['/faq', '/sr/faq'],
  ['/privacy', '/sr/politika-privatnosti'],
]
for (const [en, sr] of PAIRS) {
  const ctx = await browser.newContext()
  const p = await ctx.newPage()
  await p.goto(BASE + en, { waitUntil: 'domcontentloaded' })

  const toSr = p.locator('nav[aria-label="Main"] a[href="' + sr + '"]').first()
  const forward = (await toSr.count()) > 0
  let back = false
  if (forward) {
    await toSr.click()
    await p.waitForURL('**' + sr, { timeout: 5000 }).catch(() => {})
    const toEn = p.locator('nav[aria-label="Main"] a[href="' + en + '"]').first()
    back = (await toEn.count()) > 0
  }
  const ok = forward && back
  if (!ok) failures++
  console.log(`  ${ok ? '✓' : '✗'} ${en.padEnd(28)} <-> ${sr}`)
  await ctx.close()
}

// ── 3. the cookie banner, in the page's language ─────────────────────────────
console.log('\n── Cookie notice (first-time visitor) ───────────────')
for (const [path, expect] of [['/', 'Cookies on infinus.co'], ['/sr', 'Kolačići na infinus.co']]) {
  const ctx = await browser.newContext()
  const p = await ctx.newPage()
  await p.goto(BASE + path, { waitUntil: 'domcontentloaded' })

  // The banner is client-rendered after hydration and only for a visitor with no stored
  // decision, so it has to be WAITED for. Checking immediately after domcontentloaded
  // reports a false failure — which this check did, before it was corrected.
  const banner = p.locator('[data-testid="cookie-banner"]')
  let title = null
  try {
    await banner.waitFor({ state: 'visible', timeout: 8000 })
    title = (await banner.locator('h2').textContent())?.trim() ?? null
  } catch {
    /* left null — reported as a failure below */
  }

  const ok = title === expect
  if (!ok) failures++
  console.log(`  ${ok ? '✓' : '✗'} ${path.padEnd(4)} banner title ${JSON.stringify(title)}`)
  await ctx.close()
}

// ── 4. the e-book asset is actually downloadable ─────────────────────────────
console.log('\n── E-book asset ────────────────────────────────────')
{
  const ctx = await browser.newContext()
  const p = await ctx.newPage()
  const res = await p.request.get(BASE + '/downloads/SAP_Mythbusting_Campaign_E-Book_Infinus.pdf')
  const type = res.headers()['content-type'] ?? ''
  const size = (await res.body()).length
  const ok = res.status() === 200 && type.includes('pdf')
  if (!ok) failures++
  console.log(`  ${ok ? '✓' : '✗'} ${res.status()} ${type} ${(size / 1024 / 1024).toFixed(1)}MB`)
  await ctx.close()
}

await browser.close()
console.log(`\n${failures === 0 ? 'PASS' : `FAIL — ${failures} problem(s)`}\n`)
process.exit(failures === 0 ? 0 : 1)
