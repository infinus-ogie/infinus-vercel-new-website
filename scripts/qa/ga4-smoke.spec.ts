import { test, expect, Page } from '@playwright/test';

/**
 * GA4 + D&B VI tracking smoke test.
 *
 * Runs against a deployed origin by default; override with BASE_URL, e.g.
 *   BASE_URL=http://127.0.0.1:3100 npm run qa:ga
 *
 * ── Updated for consent gating ──────────────────────────────────────────────────
 * Analytics no longer loads on page load. The site now requires explicit consent
 * before any Google Analytics request is made, so this spec asserts BOTH halves of
 * the new lifecycle: GA is absent before consent, and GA works after it.
 *
 * Consent is granted by clicking the REAL banner control rather than by writing
 * storage directly, so the test exercises the same path a visitor does. The previous
 * helper wrote localStorage['marketing_consent'], a mechanism that no longer exists —
 * it was replaced by the versioned first-party `infinus_consent` cookie.
 *
 * Broader consent behaviour (reject, per-category choices, withdrawal, persistence)
 * is covered by scripts/qa/consent.spec.ts and is deliberately not duplicated here;
 * this file stays focused on GA/D&B functionality.
 */

// Base URL configuration
const BASE_URL = process.env.BASE_URL || 'https://www.infinus.co';
const GA4_MEASUREMENT_ID = 'G-S0YZ6MZWK1';
const CONSENT_COOKIE = 'infinus_consent';

/** Hosts that must be silent until the visitor consents. */
const GA_LOADER_HOST = 'googletagmanager.com';
const GA_COLLECT_HOST = 'google-analytics.com';

/**
 * Grant consent through the visible banner (Accept = analytics + marketing).
 *
 * Waits for the banner to actually appear rather than checking whether it exists right
 * now: the banner is rendered by a client component after hydration, so at
 * `domcontentloaded` it is legitimately absent for a moment. Treating that moment as
 * "already decided" would silently skip granting consent and leave the rest of the test
 * asserting against a session that never consented — a test that passes for the wrong
 * reason, or times out mysteriously.
 *
 * An already-decided session is detected from the stored record, not from the absence
 * of a DOM node.
 */
async function grantConsentViaUi(page: Page) {
  if (await storedConsent(page)) {
    console.log('ℹ️  Consent decision already stored for this context');
    return;
  }
  console.log('🔐 Granting consent via the banner Accept control');
  const accept = page.getByTestId('cookie-accept');
  await accept.waitFor({ state: 'visible', timeout: 15000 });
  await accept.click();
  await expect(page.getByTestId('cookie-banner')).toBeHidden();
}

/** The stored consent decision, or null when none exists. */
async function storedConsent(page: Page) {
  const cookie = (await page.context().cookies()).find((c) => c.name === CONSENT_COOKIE);
  return cookie ? JSON.parse(decodeURIComponent(cookie.value)) : null;
}

// Utility to wait for GA4 collect requests
async function waitForCollect(page: Page, predicate: (url: string) => boolean, timeout = 10000) {
  const collectUrls: string[] = [];
  
  return new Promise<boolean>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      console.log('Last 5 collect URLs seen:', collectUrls.slice(-5));
      reject(new Error(`Timeout waiting for GA4 collect request. Last URLs: ${collectUrls.slice(-5).join(', ')}`));
    }, timeout);

    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('www.google-analytics.com/g/collect')) {
        collectUrls.push(url);
        if (predicate(url)) {
          clearTimeout(timeoutId);
          resolve(true);
        }
      }
    });
  });
}

// Utility to check for D&B VI requests
async function sawDnb(page: Page, timeout = 10000) {
  return new Promise<boolean>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Timeout waiting for D&B VI request (d41.co)'));
    }, timeout);

    page.on('request', (request) => {
      if (request.url().includes('d41.co')) {
        clearTimeout(timeoutId);
        resolve(true);
      }
    });
  });
}

/**
 * GA4 sends events over TWO transports:
 *   · a GET whose query string carries `en`, `dp`, `dl` (single, unbatched hit), and
 *   · a POST whose query string carries only the common fields, with one
 *     newline-separated parameter block per event in the BODY.
 *
 * The original helpers only ever read the query string, so any batched event was
 * invisible to them — which is why the route-change and click assertions could not
 * match once consent gating changed when GA initialises. `collectEvents` normalises
 * both transports into a list of events, so assertions describe behaviour rather than
 * a particular wire format. This makes the checks stricter, not looser.
 */
interface Ga4Event {
  en: string | null;
  dp: string | null;
  dl: string | null;
  params: URLSearchParams;
}

function isCollectRequest(url: string) {
  try {
    const u = new URL(url);
    return /(^|\.)google-analytics\.com$/.test(u.hostname) && u.pathname === '/g/collect';
  } catch {
    return false;
  }
}

function collectEvents(request: { url(): string; postData(): string | null }): Ga4Event[] {
  if (!isCollectRequest(request.url())) return [];
  const common = new URLSearchParams(new URL(request.url()).search);
  const toEvent = (params: URLSearchParams): Ga4Event => ({
    en: params.get('en') ?? common.get('en'),
    dp: params.get('dp') ?? common.get('dp'),
    dl: params.get('dl') ?? common.get('dl'),
    params,
  });

  const body = request.postData();
  if (body && body.trim() !== '') {
    return body
      .split(/\r?\n/)
      .filter((line) => line.trim() !== '')
      .map((line) => toEvent(new URLSearchParams(line)));
  }
  return [toEvent(common)];
}

/** Does this request carry the named GA4 event, over either transport? */
function sentEvent(request: { url(): string; postData(): string | null }, name: string) {
  return collectEvents(request).some((e) => e.en === name);
}

/** Does this request carry the named event for the given page path? */
function sentEventForPath(
  request: { url(): string; postData(): string | null },
  name: string,
  pathname: string
) {
  return collectEvents(request).some((e) => {
    if (e.en !== name) return false;
    if (e.dp === pathname) return true;
    if (!e.dl) return false;
    try {
      return new URL(e.dl).pathname === pathname;
    } catch {
      return false;
    }
  });
}

// Retained for the URL-only checks below.
function hasEventName(url: string, name: string) {
  const u = new URL(url);
  return u.hostname === 'www.google-analytics.com'
      && u.pathname === '/g/collect'
      && new URLSearchParams(u.search).get('en') === name;
}

function hasParam(url: string, key: string) {
  const u = new URL(url);
  return new URLSearchParams(u.search).has(key);
}

/**
 * Does a GA4 collect request describe the given page path?
 *
 * The path lives inside the `dp` (page path) or `dl` (page location) parameter and is
 * percent-encoded, so a naive `url.includes('/grow')` can never match — the raw query
 * string contains `%2Fgrow`. Decode the parameters and compare pathnames instead.
 */
function hasPagePath(url: string, pathname: string) {
  const params = new URLSearchParams(new URL(url).search);
  const dp = params.get('dp');
  if (dp && dp === pathname) return true;
  const dl = params.get('dl');
  if (!dl) return false;
  try {
    return new URL(dl).pathname === pathname;
  } catch {
    return false;
  }
}

/**
 * Wait until gtag is actually callable.
 *
 * Consent gating changed the timing here: GA used to be present from page load, so a
 * click right after page load always found `window.gtag`. It now loads only once
 * consent is granted, and asynchronously, so a click fired immediately after Accept can
 * land before gtag exists — ViClickTracker would then log "gtag not available" and send
 * nothing. Waiting for the real state (rather than sleeping) makes the test
 * deterministic without weakening it.
 */
async function waitForGtagReady(page: Page) {
  await page.waitForFunction(() => typeof (window as unknown as { gtag?: unknown }).gtag === 'function', {
    timeout: 15000,
  });
}

// Health check for debug endpoint
async function checkDebugEndpoint(page: Page) {
  try {
    const response = await page.request.get(`${BASE_URL}/vi-debug`);
    if (response.ok()) {
      const data = await response.json();
      console.log('Debug endpoint response:', JSON.stringify(data, null, 2));
    } else {
      console.log('Debug endpoint returned status:', response.status());
    }
  } catch (error: unknown) {
    // `error` is typed `unknown` under strict mode; narrow before reading .message.
    const message = error instanceof Error ? error.message : String(error);
    console.log('Debug endpoint check failed (expected if 404):', message);
  }
}

test.describe('GA4 + D&B VI Tracking QA', () => {
  test.beforeEach(async ({ page }) => {
    // Capture console logs for debugging
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('[GA4') || text.includes('[RouteTracker') || text.includes('[ViClickTracker')) {
        consoleLogs.push(text);
      }
    });
    
    // Store logs on page context for later access
    (page as any)._consoleLogs = consoleLogs;
    
    // Set up request interception to track network calls
    await page.route('**/*', (route) => {
      route.continue();
    });
  });

  test('A. GA stays silent before consent, then sends page_view after consent', async ({ page }) => {
    const collectRequests: string[] = [];
    const d41Requests: string[] = [];
    
    // Track all GA4 and D&B VI requests
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('www.google-analytics.com/g/collect')) {
        collectRequests.push(url);
      }
      if (url.includes('d41.co')) {
        d41Requests.push(url);
      }
    });
    
    // Track every analytics request from the very first byte.
    const gaLoaderRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes(GA_LOADER_HOST)) gaLoaderRequests.push(request.url());
    });

    // ── 1. BEFORE CONSENT: nothing analytics-related may be requested ──────────
    console.log('\n📍 Navigating to', BASE_URL);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    await checkDebugEndpoint(page);

    expect(await storedConsent(page), 'a fresh context must have no consent decision').toBeNull();
    expect(
      gaLoaderRequests,
      `GA loader requested BEFORE consent: ${gaLoaderRequests.join(', ')}`
    ).toEqual([]);
    expect(
      collectRequests,
      `GA collect requested BEFORE consent: ${collectRequests.join(', ')}`
    ).toEqual([]);
    console.log('✅ no GA loader or collect request before consent');

    // ── 2. AFTER CONSENT: the loader and page_view must follow ─────────────────
    // Arm the waiters before clicking so neither request can be missed.
    const loaderRequest = page.waitForRequest((r) => r.url().includes('gtag/js'), { timeout: 15000 });
    const pageViewRequest = page.waitForRequest((r) => sentEvent(r, 'page_view'), { timeout: 15000 });

    await grantConsentViaUi(page);
    expect(await storedConsent(page)).toMatchObject({ analytics: true });

    await loaderRequest;
    console.log('✅ GA4 script loaded after consent');

    // Print console logs from GA4 initialization
    const consoleLogs = (page as any)._consoleLogs || [];
    console.log('\n📋 Console logs from page:');
    consoleLogs.forEach((log: string) => console.log('  ', log));

    try {
      await pageViewRequest;
      console.log('✅ page_view event sent');
    } catch (error) {
      console.log('\n❌ page_view event NOT sent');
      console.log('Last 5 GA4 collect requests:');
      collectRequests.slice(-5).forEach((url) => {
        const u = new URL(url);
        const params = new URLSearchParams(u.search);
        const eventName = params.get('en') || 'N/A';
        const pagePath = params.get('dp') || params.get('dl') || 'N/A';
        console.log(`  Event: ${eventName}, Path: ${pagePath}`);
      });
      throw error;
    }
    
    // Print summary
    console.log('\n📊 Summary:');
    console.log(`  GA4 requests: ${collectRequests.length}`);
    console.log(`  D&B VI requests: ${d41Requests.length}`);
    console.log('\nLast 5 GA4 collect URLs with event names:');
    collectRequests.slice(-5).forEach((url) => {
      const u = new URL(url);
      const params = new URLSearchParams(u.search);
      const eventName = params.get('en') || '(initial)';
      const pagePath = params.get('dp') || params.get('dl') || 'N/A';
      const pageLocation = params.get('dl') || 'N/A';
      console.log(`  📤 Event: ${eventName}`);
      console.log(`     Page Path: ${pagePath}`);
      console.log(`     Page Location: ${pageLocation}`);
    });
    
    console.log('\n✓ page_view tracking confirmed');
  });

  test('A2. Route change tracking', async ({ page }) => {
    const collectRequests: string[] = [];
    
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('www.google-analytics.com/g/collect')) {
        collectRequests.push(url);
      }
    });
    
    console.log('\n📍 Testing route change tracking');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const initialPageView = page.waitForRequest((r) => sentEvent(r, 'page_view'), { timeout: 15000 });
    await grantConsentViaUi(page);

    // Wait for initial page_view
    await initialPageView;
    console.log('✅ Initial page_view sent');
    
    const initialCount = collectRequests.length;
    
    await waitForGtagReady(page);

    // Arm the waiter BEFORE navigating: the page_view for the new document can fire
    // before a listener registered afterwards would ever see it.
    const growPageView = page.waitForRequest((r) => sentEventForPath(r, 'page_view', '/grow'), {
      timeout: 15000,
    });

    console.log('🔀 Navigating to /grow');
    await page.goto(`${BASE_URL}/grow`);

    try {
      await growPageView;
      console.log('✅ Route change page_view sent');
    } catch (error) {
      console.log('❌ Route change page_view NOT sent');
      console.log(`Collected ${collectRequests.length - initialCount} new requests after navigation`);
      throw error;
    }
    
    console.log('✓ Route change tracking confirmed');
  });

  test('B. ZIP click tracking on /grow', async ({ page }) => {
    const collectRequests: string[] = [];
    const consoleLogs = (page as any)._consoleLogs || [];
    
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('www.google-analytics.com/g/collect')) {
        collectRequests.push(url);
      }
    });
    
    console.log('\n📍 Testing ZIP click on /grow');
    await page.goto(`${BASE_URL}/grow`, { waitUntil: 'domcontentloaded' });
    await grantConsentViaUi(page);

    // ViClickTracker sends its events through gtag, which only exists after consent has
    // loaded GA. Wait for that rather than guessing with a timeout.
    await waitForGtagReady(page);
    
    // Print relevant console logs
    console.log('\n📋 ViClickTracker logs:');
    consoleLogs.filter((log: string) => log.includes('[ViClickTracker')).forEach((log: string) => console.log('  ', log));
    
    // Try to find ZIP button with data-vi attribute first, then fallback to text
    let zipButton;
    try {
      zipButton = page.locator('[data-vi="zip"]').first();
      await zipButton.waitFor({ timeout: 2000 });
      console.log('✅ Found ZIP button with [data-vi="zip"]');
    } catch {
      try {
        zipButton = page.getByText(/Preuzmite materijale/i).first();
        await zipButton.waitFor({ timeout: 2000 });
        console.log('✅ Found ZIP button by text');
      } catch {
        console.log('❌ ZIP button not found on /grow page');
        throw new Error('ZIP button not found on /grow page. Expected [data-vi="zip"] or text matching /Preuzmite materijale/i');
      }
    }
    
    // Arm the waiter before the click so a fast event cannot be missed.
    const zipEvent = page.waitForRequest(
      (r) => collectEvents(r).some((e) => e.en === 'vi_zip_click' && e.params.has('ep.item_name')),
      { timeout: 15000 }
    );

    console.log('🖱️  Clicking ZIP button');
    await zipButton.click();

    try {
      await zipEvent;
      console.log('✅ vi_zip_click event sent');
    } catch (error) {
      console.log('❌ vi_zip_click event NOT sent');
      console.log('Last 3 GA4 requests after click:');
      collectRequests.slice(-3).forEach((url) => {
        const u = new URL(url);
        const params = new URLSearchParams(u.search);
        const eventName = params.get('en') || 'N/A';
        console.log(`  Event: ${eventName}`);
      });
      throw error;
    }
    
    console.log('✓ vi_zip_click tracking confirmed on /grow');
  });

  test('C. PDF download tracking on /grow', async ({ page }) => {
    await page.goto(`${BASE_URL}/grow`);
    await grantConsentViaUi(page);
    
    // Check if tracking is enabled first by looking for the debug endpoint response
    const debugResponse = await page.request.get(`${BASE_URL}/vi-debug`);
    let trackingEnabled = false;
    if (debugResponse.ok()) {
      const debugData = await debugResponse.json();
      trackingEnabled = debugData.viEnabled;
    }
    
    if (!trackingEnabled) {
      console.log('⚠️  SKIPPING: D&B VI tracking is disabled (NEXT_PUBLIC_DNB_VI_ENABLED not set)');
      return;
    }
    
    // Try to find PDF button with data-vi attribute first, then fallback to text
    let pdfButton;
    try {
      pdfButton = page.locator('[data-vi="download"]').first();
      await pdfButton.waitFor({ timeout: 2000 });
    } catch {
      try {
        pdfButton = page.getByText(/Preuzmi PDF/i).first();
        await pdfButton.waitFor({ timeout: 2000 });
      } catch {
        throw new Error('PDF download button not found on /grow page. Expected [data-vi="download"] or text matching /Preuzmi PDF/i');
      }
    }
    
    // Click the PDF button
    await pdfButton.click();
    
    // Wait for vi_download_click event with required parameters
    await waitForCollect(page, (url) => {
      return hasEventName(url, 'vi_download_click') && 
             hasParam(url, 'ep.file_name') && 
             hasParam(url, 'ep.link_url');
    });
    
    console.log('✓ vi_download_click tracking confirmed on /grow');
  });

  test('D. ZIP click tracking on /professional-services', async ({ page }) => {
    await page.goto(`${BASE_URL}/professional-services`);
    await grantConsentViaUi(page);
    
    // Check if tracking is enabled first by looking for the debug endpoint response
    const debugResponse = await page.request.get(`${BASE_URL}/vi-debug`);
    let trackingEnabled = false;
    if (debugResponse.ok()) {
      const debugData = await debugResponse.json();
      trackingEnabled = debugData.viEnabled;
    }
    
    if (!trackingEnabled) {
      console.log('⚠️  SKIPPING: D&B VI tracking is disabled (NEXT_PUBLIC_DNB_VI_ENABLED not set)');
      return;
    }
    
    // Try to find ZIP button with data-vi attribute first, then fallback to text
    let zipButton;
    try {
      zipButton = page.locator('[data-vi="zip"]').first();
      await zipButton.waitFor({ timeout: 2000 });
    } catch {
      try {
        zipButton = page.getByText(/Preuzmite materijale/i).first();
        await zipButton.waitFor({ timeout: 2000 });
      } catch {
        throw new Error('ZIP button not found on /professional-services page. Expected [data-vi="zip"] or text matching /Preuzmite materijale/i');
      }
    }
    
    // Click the ZIP button
    await zipButton.click();
    
    // Wait for vi_zip_click event with required parameters
    await waitForCollect(page, (url) => {
      return hasEventName(url, 'vi_zip_click') && 
             hasParam(url, 'ep.file_name') && 
             hasParam(url, 'ep.link_url');
    });
    
    console.log('✓ vi_zip_click tracking confirmed on /professional-services');
  });

  test('E. PDF download tracking on /professional-services', async ({ page }) => {
    await page.goto(`${BASE_URL}/professional-services`);
    await grantConsentViaUi(page);
    
    // Check if tracking is enabled first by looking for the debug endpoint response
    const debugResponse = await page.request.get(`${BASE_URL}/vi-debug`);
    let trackingEnabled = false;
    if (debugResponse.ok()) {
      const debugData = await debugResponse.json();
      trackingEnabled = debugData.viEnabled;
    }
    
    if (!trackingEnabled) {
      console.log('⚠️  SKIPPING: D&B VI tracking is disabled (NEXT_PUBLIC_DNB_VI_ENABLED not set)');
      return;
    }
    
    // Try to find PDF button with data-vi attribute first, then fallback to text
    let pdfButton;
    try {
      pdfButton = page.locator('[data-vi="download"]').first();
      await pdfButton.waitFor({ timeout: 2000 });
    } catch {
      try {
        pdfButton = page.getByText(/Preuzmi PDF/i).first();
        await pdfButton.waitFor({ timeout: 2000 });
      } catch {
        throw new Error('PDF download button not found on /professional-services page. Expected [data-vi="download"] or text matching /Preuzmi PDF/i');
      }
    }
    
    // Click the PDF button
    await pdfButton.click();
    
    // Wait for vi_download_click event with required parameters
    await waitForCollect(page, (url) => {
      return hasEventName(url, 'vi_download_click') && 
             hasParam(url, 'ep.file_name') && 
             hasParam(url, 'ep.link_url');
    });
    
    console.log('✓ vi_download_click tracking confirmed on /professional-services');
  });

  test('F. D&B VI script loading', async ({ page }) => {
    await page.goto(`${BASE_URL}/grow`);
    await grantConsentViaUi(page);
    
    // Check if tracking is enabled first by looking for the debug endpoint response
    const debugResponse = await page.request.get(`${BASE_URL}/vi-debug`);
    let trackingEnabled = false;
    if (debugResponse.ok()) {
      const debugData = await debugResponse.json();
      trackingEnabled = debugData.viEnabled;
    }
    
    if (!trackingEnabled) {
      console.log('⚠️  SKIPPING: D&B VI tracking is disabled (NEXT_PUBLIC_DNB_VI_ENABLED not set)');
      return;
    }
    
    // Wait for D&B VI request
    await sawDnb(page);
    
    console.log('✓ D&B VI script loading confirmed');
  });

  test('G. Debug endpoint health check', async ({ page }) => {
    await page.goto(BASE_URL);
    await checkDebugEndpoint(page);
    
    console.log('✓ Debug endpoint health check completed');
  });

  test('H. Environment variables and tracking status check', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check if tracking is enabled by calling the debug endpoint
    const debugResponse = await page.request.get(`${BASE_URL}/vi-debug`);
    let trackingStatus = {
      dnbViEnabled: false,
      dnbViAccount: null,
      dnbViDebug: false,
      gaId: null,
      hasConsent: false
    };
    
    if (debugResponse.ok()) {
      const debugData = await debugResponse.json();
      trackingStatus = {
        dnbViEnabled: debugData.viEnabled,
        dnbViAccount: debugData.account,
        dnbViDebug: debugData.debug,
        gaId: null, // We can't get this from the debug endpoint
        hasConsent: false // We'll check this separately
      };
    }
    
    // Check consent status from the versioned first-party consent cookie.
    const consent = await storedConsent(page);
    trackingStatus.hasConsent = consent?.analytics === true;
    
    console.log('Environment variables status:', JSON.stringify(trackingStatus, null, 2));
    
    if (!trackingStatus.dnbViEnabled) {
      console.log('⚠️  WARNING: NEXT_PUBLIC_DNB_VI_ENABLED is not set to "true" in production');
      console.log('   This means D&B VI tracking will be disabled');
    }
    
    if (!trackingStatus.gaId) {
      console.log('⚠️  WARNING: NEXT_PUBLIC_GA_ID is not set in production');
      console.log('   This means GA4 tracking will be disabled');
    }
    
    console.log('✓ Environment variables check completed');
  });
});
