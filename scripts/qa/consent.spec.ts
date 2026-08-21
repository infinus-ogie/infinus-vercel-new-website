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

test.describe('privacy policy pages', () => {
  test('/politika-privatnosti redirects in one hop to /privacy', async ({ page }) => {
    // Reversed from the Phase C direction. /privacy is the real English page now, and the
    // old bilingual URL points at it.
    const response = await page.goto('/politika-privatnosti')
    expect(new URL(page.url()).pathname).toBe('/privacy')
    expect(response?.status()).toBe(200)

    // Exactly one hop, and it is permanent.
    const chain: number[] = []
    let req = response?.request().redirectedFrom()
    while (req) {
      const res = await req.response()
      if (res) chain.push(res.status())
      req = req.redirectedFrom()
    }
    expect(chain).toEqual([308])
  })

  test('/privacy does NOT redirect', async ({ page }) => {
    // The inverse of the above, asserted separately so a future edit cannot reintroduce a
    // loop by pointing /privacy back at the old URL.
    const response = await page.goto('/privacy')
    expect(response?.status()).toBe(200)
    expect(new URL(page.url()).pathname).toBe('/privacy')
    expect(response?.request().redirectedFrom()).toBeNull()
  })

  test('/sr/privacy does not exist', async ({ page }) => {
    const response = await page.goto('/sr/privacy')
    expect(response?.status()).toBe(404)
  })

  for (const {
    path, lang, ownHeading, ownDate, ownCommitment, foreignHeading, foreignCommitment, counterpart,
  } of [
    {
      path: '/privacy',
      lang: 'en',
      ownHeading: 'Privacy Policy',
      ownDate: 'Last updated: 10 August 2026',
      ownCommitment: 'Google Analytics and other non-essential analytics or marketing cookies',
      foreignHeading: 'Politika privatnosti',
      foreignCommitment: 'Google Analytics i drugi nenužni analitički ili marketinški kolačići',
      counterpart: '/sr/politika-privatnosti',
    },
    {
      path: '/sr/politika-privatnosti',
      lang: 'sr-Latn',
      ownHeading: 'Politika privatnosti',
      ownDate: 'Poslednje ažuriranje: 10. avgust 2026.',
      ownCommitment: 'Google Analytics i drugi nenužni analitički ili marketinški kolačići',
      foreignHeading: 'Privacy Policy',
      foreignCommitment: 'Google Analytics and other non-essential analytics or marketing cookies',
      counterpart: '/privacy',
    },
  ]) {
    test(`${path} serves ONLY its own approved legal document`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' })

      // The document's own language, at document level.
      await expect(page.locator('html')).toHaveAttribute('lang', lang)

      // Exactly one legal document: one h1, and it is this language's.
      const h1 = page.locator('h1')
      await expect(h1).toHaveCount(1)
      await expect(h1).toHaveText(ownHeading)

      // Scoped to <main>, i.e. the legal DOCUMENT, not the whole page. The consent banner is
      // localised now, so a body-wide check would pass — but scoping is still what makes this
      // assertion mean what it says: that the legal document on this URL is this language's,
      // independent of any surrounding chrome that also mentions a privacy policy.
      const doc = (await page.locator('main').innerText()).replace(/\s+/g, ' ')
      expect(doc).toContain(ownDate)
      // The approved cookie/analytics commitment, in this language.
      expect(doc).toContain(ownCommitment)

      // And NOTHING of the other language's document. This is the failure that would matter
      // most: publishing the wrong jurisdiction's text, or both, on a URL claiming one.
      expect(doc).not.toContain(foreignHeading)
      expect(doc).not.toContain(foreignCommitment)

      // noindex, and NO hreflang. The pair is navigable, not indexable — see the
      // `locale-linked` policy in content/routes.ts.
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0)

      // But the switcher IS here and points at the real counterpart, which is the whole
      // reason navigability had to be separated from indexability.
      const switcher = page.locator(`nav a[href="${counterpart}"]`).first()
      await expect(switcher).toHaveCount(1)
    })
  }
})

test.describe('the consent UI follows the site locale, not the URL', () => {
  /**
   * The point of this block is the THIRD group below.
   *
   * /grow, /grow/cfo, /grow/ceo and /professional-services are Serbian pages at UNPREFIXED
   * URLs. Anything that decided locale from `pathname.startsWith('/sr')` would give them an
   * English cookie banner and send them to the English Privacy Policy, and would still pass
   * a test suite that only checked / and /sr. So they are checked explicitly, and they are
   * the reason locale is threaded from the root layout instead of read from the URL.
   */
  const EN = {
    title: 'Cookies on infinus.co',
    accept: 'Accept',
    reject: 'Reject',
    settings: 'Cookie settings',
    policy: 'Privacy Policy',
    href: '/privacy',
    close: 'Close',
    save: 'Save settings',
    necessary: 'Necessary',
    alwaysOn: 'Always on',
  }
  const SR = {
    title: 'Kolačići na infinus.co',
    accept: 'Prihvati',
    reject: 'Odbij',
    settings: 'Podešavanja kolačića',
    policy: 'Politika privatnosti',
    href: '/sr/politika-privatnosti',
    close: 'Zatvori',
    save: 'Sačuvaj podešavanja',
    necessary: 'Neophodni',
    alwaysOn: 'Uvek uključeno',
  }

  const CASES: ReadonlyArray<{ path: string; copy: typeof EN; other: typeof EN; label: string }> = [
    // English root.
    { path: '/', copy: EN, other: SR, label: 'English root' },
    { path: '/contact', copy: EN, other: SR, label: 'English child' },
    { path: '/privacy', copy: EN, other: SR, label: 'English legal page' },
    // Serbian root, /sr-prefixed.
    { path: '/sr', copy: SR, other: EN, label: 'Serbian root' },
    { path: '/sr/contact', copy: SR, other: EN, label: 'Serbian child' },
    { path: '/sr/politika-privatnosti', copy: SR, other: EN, label: 'Serbian legal page' },
    // Serbian root, UNPREFIXED. The cases that make URL sniffing wrong.
    { path: '/grow', copy: SR, other: EN, label: 'Serbian legacy, no /sr prefix' },
    { path: '/grow/cfo', copy: SR, other: EN, label: 'Serbian legacy, no /sr prefix' },
    { path: '/grow/ceo', copy: SR, other: EN, label: 'Serbian legacy, no /sr prefix' },
    { path: '/professional-services', copy: SR, other: EN, label: 'Serbian legacy, no /sr prefix' },
  ]

  for (const { path, copy, other, label } of CASES) {
    test(`${path} — ${label}: banner copy and privacy destination`, async ({ page }) => {
      // A fresh context per test is what Playwright already gives us, so the banner shows.
      await page.goto(path, { waitUntil: 'domcontentloaded' })

      const banner = page.getByTestId('cookie-banner')
      await expect(banner).toBeVisible()
      await expect(banner).toContainText(copy.title)
      await expect(page.getByTestId('cookie-accept')).toHaveText(copy.accept)
      await expect(page.getByTestId('cookie-reject')).toHaveText(copy.reject)
      await expect(page.getByTestId('cookie-settings-open')).toHaveText(copy.settings)

      // The destination, from the actual rendered link rather than from a helper.
      const link = page.getByTestId('cookie-banner-privacy')
      await expect(link).toHaveText(copy.policy)
      await expect(link).toHaveAttribute('href', copy.href)

      // And nothing of the other language leaked into this banner.
      const text = await banner.innerText()
      expect(text).not.toContain(other.title)
      expect(text).not.toContain(other.accept)
      expect(text).not.toContain(other.reject)
    })
  }

  for (const { path, copy, label } of [CASES[0], CASES[3], CASES[6]]) {
    test(`${path} — ${label}: settings dialog is localised, including its own privacy link`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      await page.getByTestId('cookie-settings-open').click()

      const dialog = page.getByTestId('cookie-settings-dialog')
      await expect(dialog).toBeVisible()
      await expect(dialog).toContainText(copy.necessary)
      await expect(dialog).toContainText(copy.alwaysOn)
      await expect(page.getByTestId('cookie-settings-save')).toHaveText(copy.save)

      // The close control's accessible name is user-facing copy and must be localised too.
      await expect(page.getByTestId('cookie-settings-close')).toHaveAttribute('aria-label', copy.close)

      // The dialog exposes its OWN privacy link; it must agree with the banner's.
      await expect(page.getByTestId('cookie-settings-privacy')).toHaveAttribute('href', copy.href)

      // Localisation must not have pre-ticked anything.
      await expect(page.locator('#consent-analytics')).not.toBeChecked()
      await expect(page.locator('#consent-marketing')).not.toBeChecked()
      await expect(page.locator('#consent-necessary')).toBeChecked()
      await expect(page.locator('#consent-necessary')).toBeDisabled()
    })
  }

  test('the privacy link does not grant consent', async ({ page }) => {
    // Navigation is not consent. Following the banner's own link must leave the visitor
    // undecided, so the banner is still there when they come back.
    await page.goto('/sr', { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('cookie-banner')).toBeVisible()
    await page.getByTestId('cookie-banner-privacy').click()
    await page.waitForURL((u) => new URL(u).pathname === '/sr/politika-privatnosti')
    const stored = await page.evaluate(() => document.cookie)
    expect(stored).not.toContain('infinus_consent')
    await expect(page.getByTestId('cookie-banner')).toBeVisible()
  })

  test('a decision made in one locale is honoured in the other', async ({ page }) => {
    await page.goto('/grow', { waitUntil: 'domcontentloaded' })
    await page.getByTestId('cookie-accept').click()
    await expect(page.getByTestId('cookie-banner')).toBeHidden()
    const before = await page.evaluate(
      () => (document.cookie.match(/infinus_consent=([^;]*)/) ?? [])[1]
    )
    // Cross a root boundary, which is a full document navigation.
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const after = await page.evaluate(
      () => (document.cookie.match(/infinus_consent=([^;]*)/) ?? [])[1]
    )
    expect(after).toBe(before)
    await expect(page.getByTestId('cookie-banner')).toBeHidden()
  })
})
