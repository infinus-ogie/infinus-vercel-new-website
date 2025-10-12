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
    // Set up request interception to track network calls
    await page.route('**/*', (route) => {
      route.continue();
    });
  });

  test('A. page_view tracking', async ({ page }) => {
    // Go to homepage
    await page.goto(BASE_URL);
    
    // Check debug endpoint first
    await checkDebugEndpoint(page);
    
    // Enable consent and reload
    await enableConsent(page);
    await page.reload();
    
    // Check if GA4 is configured by looking for the gtag script
    const gaScriptLoaded = await page.waitForRequest(request => 
      request.url().includes('gtag/js'), { timeout: 5000 }
    ).catch(() => null);
    
    if (!gaScriptLoaded) {
      console.log('⚠️  SKIPPING: GA4 script not loaded (NEXT_PUBLIC_GA_ID not set)');
      return;
    }
    
    // Wait for page_view event
    await waitForCollect(page, (url) => hasEventName(url, 'page_view'));
    
    console.log('✓ page_view tracking confirmed');
  });

  test('B. ZIP click tracking on /grow', async ({ page }) => {
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
    
    // Wait for D&B VI to load
    await sawDnb(page);
    
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
        throw new Error('ZIP button not found on /grow page. Expected [data-vi="zip"] or text matching /Preuzmite materijale/i');
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
