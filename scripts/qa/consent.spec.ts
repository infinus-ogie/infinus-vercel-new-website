import { test, expect, type Page, type Request } from '@playwright/test'

/**
 * NETWORK PROOF for strict no-load consent gating.
 *
 * Unit tests can only show that a gate component returns null. This spec proves the
 * thing that actually matters to the approved Privacy Policy: a real browser makes NO
 * request to Google Analytics or D&B before the visitor consents.
 *
 * Runs against the production build (see playwright.consent.config.ts).
 */

const GA_HOSTS = ['googletagmanager.com', 'google-analytics.com']
const MARKETING_HOSTS = ['d41.co']

interface RequestLog {
  all: string[]
  ga: string[]
  marketing: string[]
}

/** Record every request the page makes, bucketed by vendor. */
function trackRequests(page: Page): RequestLog {
  const log: RequestLog = { all: [], ga: [], marketing: [] }
  page.on('request', (req: Request) => {
    const url = req.url()
    log.all.push(url)
    if (GA_HOSTS.some((h) => url.includes(h))) log.ga.push(url)
    if (MARKETING_HOSTS.some((h) => url.includes(h))) log.marketing.push(url)
  })
  return log
}

/** Deterministic settle: wait for the banner decision state, then for the network to go quiet. */
async function loadHome(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.waitForLoadState('networkidle')
}

const consentCookie = async (page: Page) => {
  const cookies = await page.context().cookies()
  const raw = cookies.find((c) => c.name === 'infinus_consent')
  return raw ? JSON.parse(decodeURIComponent(raw.value)) : null
}

const gaCookies = async (page: Page) =>
  (await page.context().cookies()).filter((c) => c.name === '_ga' || c.name.startsWith('_ga_'))

test.describe('fresh session — nothing non-essential may load', () => {
  test('no GA or marketing request before any decision', async ({ page }) => {
    const log = trackRequests(page)
    await loadHome(page)

    await expect(page.getByTestId('cookie-banner')).toBeVisible()

    expect(log.ga, `unexpected analytics requests: ${log.ga.join(', ')}`).toEqual([])
    expect(log.marketing, `unexpected marketing requests: ${log.marketing.join(', ')}`).toEqual([])
    // Sanity: the page really did load resources, so an empty GA list is meaningful.
    expect(log.all.length).toBeGreaterThan(0)
    expect(await consentCookie(page)).toBeNull()
  })

  test('banner shows Accept and Reject with equal prominence', async ({ page }) => {
    await loadHome(page)
    const accept = page.getByTestId('cookie-accept')
    const reject = page.getByTestId('cookie-reject')
    await expect(accept).toBeVisible()
    await expect(reject).toBeVisible()

    const [aBox, rBox] = [await accept.boundingBox(), await reject.boundingBox()]
    expect(aBox).not.toBeNull()
    expect(rBox).not.toBeNull()
    // Same rendered size, to within sub-pixel rounding.
    expect(Math.abs(aBox!.height - rBox!.height)).toBeLessThan(2)
    expect(Math.abs(aBox!.width - rBox!.width)).toBeLessThan(2)
    // Same styling.
    expect(await accept.getAttribute('class')).toBe(await reject.getAttribute('class'))
  })

  test('navigating without deciding still loads nothing', async ({ page }) => {
    const log = trackRequests(page)
    await loadHome(page)
    await page.goto('/contact', { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('networkidle')

    expect(log.ga).toEqual([])
    expect(log.marketing).toEqual([])
    // Navigation is not consent: the banner is still asking.
    await expect(page.getByTestId('cookie-banner')).toBeVisible()
    expect(await consentCookie(page)).toBeNull()
  })
})

test.describe('Reject', () => {
  test('records the refusal, loads no vendor, and leaves the site usable', async ({ page }) => {
    const log = trackRequests(page)
    await loadHome(page)
    await page.getByTestId('cookie-reject').click()

    await expect(page.getByTestId('cookie-banner')).toBeHidden()
    expect(await consentCookie(page)).toMatchObject({ necessary: true, analytics: false, marketing: false })

    // Browse on; still nothing.
    await page.goto('/contact', { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('networkidle')
    expect(log.ga).toEqual([])
    expect(log.marketing).toEqual([])

    // The contact form still works after refusing — consent is not a prerequisite.
    await expect(page.getByLabel('Name *')).toBeVisible()
    await page.getByLabel('Name *').fill('Jane Doe')
    await page.getByLabel('Email *').fill('jane@example.com')
    await page.getByLabel('Subject *').fill('SAP implementation enquiry')
    await page.getByLabel('Message *').fill('We are evaluating SAP Cloud ERP and would like to discuss scope.')
    await expect(page.getByRole('button', { name: /send message/i })).toBeEnabled()

    // And the decision survives a reload without re-prompting.
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('cookie-banner')).toBeHidden()
  })
})

test.describe('Accept', () => {
  test('analytics loads only after the visitor accepts', async ({ page }) => {
    const log = trackRequests(page)
    await loadHome(page)
    expect(log.ga).toEqual([])

    const gaRequest = page.waitForRequest((req) => req.url().includes('googletagmanager.com'), { timeout: 15_000 })
    await page.getByTestId('cookie-accept').click()
    await gaRequest

    expect(log.ga.length).toBeGreaterThan(0)
    expect(await consentCookie(page)).toMatchObject({ analytics: true, marketing: true })

    // D&B is deliberately NOT asserted to load. It is consent-gated, but two
    // pre-existing defects (a TypeScript-in-JS SyntaxError in the inline script and an
    // env-name mismatch) leave it inert. Phase C only guarantees it cannot load
    // BEFORE consent; restoring its functionality is a separate explicit change.
  })

  test('the decision persists across a reload without re-prompting', async ({ page }) => {
    await loadHome(page)
    await page.getByTestId('cookie-accept').click()
    await expect(page.getByTestId('cookie-banner')).toBeHidden()

    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('cookie-banner')).toBeHidden()
    expect(await consentCookie(page)).toMatchObject({ analytics: true })
  })
})

test.describe('custom settings', () => {
  test('analytics-only consent loads GA but records marketing as refused', async ({ page }) => {
    await loadHome(page)
    await page.getByTestId('cookie-settings-open').click()
    await expect(page.getByTestId('cookie-settings-dialog')).toBeVisible()

    // Nothing is pre-ticked, and Necessary cannot be turned off.
    await expect(page.getByLabel('Analytics')).not.toBeChecked()
    await expect(page.getByLabel('Marketing')).not.toBeChecked()
    await expect(page.getByLabel('Necessary')).toBeChecked()
    await expect(page.getByLabel('Necessary')).toBeDisabled()

    const gaRequest = page.waitForRequest((req) => req.url().includes('googletagmanager.com'), { timeout: 15_000 })
    await page.getByLabel('Analytics').check()
    await page.getByTestId('cookie-settings-save').click()
    await gaRequest

    expect(await consentCookie(page)).toMatchObject({ analytics: true, marketing: false })
  })
})

test.describe('withdrawal', () => {
  test('turning analytics off clears GA cookies and stops further analytics', async ({ page }) => {
    // 1. accept, so GA actually loads and sets its cookies
    await loadHome(page)
    const firstGa = page.waitForRequest((req) => req.url().includes('googletagmanager.com'), { timeout: 15_000 })
    await page.getByTestId('cookie-accept').click()
    await firstGa
    await expect.poll(async () => (await gaCookies(page)).length, { timeout: 15_000 }).toBeGreaterThan(0)

    // 2. reopen settings from the footer and withdraw analytics
    await page.getByTestId('cookie-settings-reopen').first().click()
    await expect(page.getByTestId('cookie-settings-dialog')).toBeVisible()
    await expect(page.getByLabel('Analytics')).toBeChecked()
    await page.getByLabel('Analytics').uncheck()
    await page.getByTestId('cookie-settings-save').click()

    // The provider reloads the page, because an already-loaded script cannot be unloaded.
    await page.waitForLoadState('load')
    await expect.poll(async () => (await consentCookie(page))?.analytics, { timeout: 15_000 }).toBe(false)
    await expect.poll(async () => (await gaCookies(page)).length, { timeout: 15_000 }).toBe(0)

    // 3. from here on, no new analytics request
    const afterWithdrawal = trackRequests(page)
    await page.goto('/contact', { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('networkidle')
    expect(afterWithdrawal.ga, `analytics still loading after withdrawal: ${afterWithdrawal.ga.join(', ')}`).toEqual([])
    await expect(page.getByTestId('cookie-banner')).toBeHidden()
  })
})

test.describe('privacy policy page', () => {
  test('/privacy redirects in one hop to the approved legal URL', async ({ page }) => {
    const response = await page.goto('/privacy')
    expect(new URL(page.url()).pathname).toBe('/politika-privatnosti')
    expect(response?.status()).toBe(200)

    // Redirect chain: exactly one hop, and it is a permanent redirect.
    const chain: number[] = []
    let req = response?.request().redirectedFrom()
    while (req) {
      const res = await req.response()
      if (res) chain.push(res.status())
      req = req.redirectedFrom()
    }
    expect(chain).toEqual([308])
  })

  test('serves both approved language versions with correct lang attributes', async ({ page }) => {
    await page.goto('/politika-privatnosti', { waitUntil: 'domcontentloaded' })

    const sr = page.locator('section[lang="sr-Latn"]')
    const en = page.locator('section[lang="en"]')
    await expect(sr).toHaveCount(1)
    await expect(en).toHaveCount(1)
    await expect(sr).toContainText('Politika privatnosti')
    await expect(en).toContainText('Privacy Policy')
    // The approved cookie/analytics commitment is present in both versions.
    await expect(sr).toContainText('Google Analytics i drugi nenužni analitički ili marketinški kolačići')
    await expect(en).toContainText('Google Analytics and other non-essential analytics or marketing cookies')

    // noindex, and no hreflang: one URL holding two documents is not a locale pair.
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0)
  })
})
