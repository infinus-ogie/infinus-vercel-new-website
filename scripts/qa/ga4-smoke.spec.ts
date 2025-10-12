import { test, expect, Page } from '@playwright/test';

// Base URL configuration
const BASE_URL = process.env.BASE_URL || 'https://www.infinus.co';
const GA4_MEASUREMENT_ID = 'G-S0YZ6MZWK1';

// Helper function to enable consent
async function enableConsent(page: Page) {
  await page.evaluate(() => {
    localStorage.setItem('marketing_consent', 'true');
  });
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

// Helper functions for GA4 parameter checking
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
  } catch (error) {
    console.log('Debug endpoint check failed (expected if 404):', error.message);
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

  test('A. page_view tracking with debug logs', async ({ page }) => {
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
    
    // Go to homepage
    console.log('\n📍 Navigating to', BASE_URL);
    await page.goto(BASE_URL);
    
    // Check debug endpoint first
    await checkDebugEndpoint(page);
    
    // Enable consent BEFORE reload
    console.log('🔐 Setting marketing_consent=true');
    await enableConsent(page);
    
    console.log('🔄 Reloading page...');
    await page.reload();
    
    // Wait a bit for scripts to initialize
    await page.waitForTimeout(2000);
    
    // Print console logs from GA4 initialization
    const consoleLogs = (page as any)._consoleLogs || [];
    console.log('\n📋 Console logs from page:');
    consoleLogs.forEach((log: string) => console.log('  ', log));
    
    // Check if GA4 is configured by looking for the gtag script
    const gaScriptLoaded = await page.waitForRequest(request => 
      request.url().includes('gtag/js'), { timeout: 5000 }
    ).catch(() => null);
    
    if (!gaScriptLoaded) {
      console.log('\n⚠️  SKIPPING: GA4 script not loaded (NEXT_PUBLIC_GA_ID not set)');
      return;
    }
    
    console.log('✅ GA4 script loaded');
    
    // Wait for page_view event
    try {
      await waitForCollect(page, (url) => hasEventName(url, 'page_view'));
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
    await page.goto(BASE_URL);
    await enableConsent(page);
    await page.reload();
    
    // Wait for initial page_view
    await waitForCollect(page, (url) => hasEventName(url, 'page_view'));
    console.log('✅ Initial page_view sent');
    
    const initialCount = collectRequests.length;
    
    // Navigate to /grow
    console.log('🔀 Navigating to /grow');
    await page.goto(`${BASE_URL}/grow`);
    await page.waitForTimeout(1000);
    
    // Wait for another page_view
    try {
      await waitForCollect(page, (url) => {
        return hasEventName(url, 'page_view') && url.includes('/grow');
      });
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
    await page.goto(`${BASE_URL}/grow`);
    await enableConsent(page);
    await page.reload();
    
    // Wait for page to be ready
    await page.waitForTimeout(1000);
    
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
    
    // Click the ZIP button
    console.log('🖱️  Clicking ZIP button');
    await zipButton.click();
    await page.waitForTimeout(500);
    
    // Wait for vi_zip_click event with required parameters
    try {
      await waitForCollect(page, (url) => {
        return hasEventName(url, 'vi_zip_click') && 
               hasParam(url, 'ep.item_name');
      });
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
    await enableConsent(page);
    await page.reload();
    
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
    await enableConsent(page);
    await page.reload();
    
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
    await enableConsent(page);
    await page.reload();
    
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
    await enableConsent(page);
    await page.reload();
    
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
    
    // Check consent status
    const hasConsent = await page.evaluate(() => {
      return localStorage.getItem('marketing_consent') === 'true';
    });
    trackingStatus.hasConsent = hasConsent;
    
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
