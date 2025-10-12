import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Manual GA4 + D&B VI Verification', () => {
  test('Full tracking verification on production', async ({ page }) => {
    console.log('\n=== STARTING FULL TRACKING VERIFICATION ===\n');

    // Set up consent before navigation
    await page.addInitScript(() => {
      localStorage.setItem('marketing_consent', 'true');
      console.log('[TEST] Consent set to true in addInitScript');
    });

    const ga4Requests: string[] = [];
    const dnbRequests: string[] = [];
    const gtagRequests: string[] = [];

    // Listen to all network requests
    page.on('request', (request) => {
      const url = request.url();
      
      if (url.includes('www.google-analytics.com/g/collect')) {
        ga4Requests.push(url);
        console.log(`[GA4 COLLECT] ${url.substring(0, 150)}...`);
      }
      
      if (url.includes('d41.co')) {
        dnbRequests.push(url);
        console.log(`[D&B VI] ${url}`);
      }
      
      if (url.includes('gtag/js')) {
        gtagRequests.push(url);
        console.log(`[GTAG SCRIPT] ${url}`);
      }
    });

    console.log('\n1) Loading homepage...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    
    // Check consent status
    const consentStatus = await page.evaluate(() => {
      return localStorage.getItem('marketing_consent');
    });
    console.log('Consent status:', consentStatus);
    
            // Wait a bit for tracking scripts to load
            await page.waitForTimeout(5000);

    // Manually trigger page_view to test GA4
    await page.evaluate(() => {
      if (typeof window.gtag !== 'undefined') {
        console.log('[TEST] Manually triggering page_view');
        window.gtag('event', 'page_view', {
          page_location: window.location.href,
          page_path: window.location.pathname,
          page_title: document.title
        });
      } else {
        console.log('[TEST] gtag not available');
      }
    });

    console.log('\n2) Checking if GA4 script loaded...');
    if (gtagRequests.length > 0) {
      console.log(`✅ GA4 script loaded: ${gtagRequests[0]}`);
    } else {
      console.log('❌ GA4 script NOT loaded');
    }

    console.log('\n3) Checking for page_view events...');
    const pageViewRequests = ga4Requests.filter(url => url.includes('en=page_view'));
    if (pageViewRequests.length > 0) {
      console.log(`✅ Found ${pageViewRequests.length} page_view event(s)`);
    } else {
      console.log('❌ No page_view events found');
    }

    console.log('\n4) Checking for D&B VI requests...');
    if (dnbRequests.length > 0) {
      console.log(`✅ Found ${dnbRequests.length} D&B VI request(s):`);
      dnbRequests.forEach((url, i) => console.log(`   ${i + 1}. ${url}`));
    } else {
      console.log('❌ No D&B VI requests found');
    }

    console.log('\n5) Navigating to /grow...');
    await page.goto(`${BASE_URL}/grow`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('\n6) Looking for ZIP button on /grow...');
    let zipButton;
    try {
      zipButton = page.locator('[data-vi="zip"]').first();
      await zipButton.waitFor({ timeout: 3000 });
      console.log('✅ Found ZIP button with [data-vi="zip"]');
    } catch {
      try {
        zipButton = page.getByText(/Preuzmite materijale/i).first();
        await zipButton.waitFor({ timeout: 3000 });
        console.log('✅ Found ZIP button by text');
      } catch {
        console.log('❌ ZIP button not found');
        zipButton = null;
      }
    }

    if (zipButton) {
      console.log('\n7) Clicking ZIP button...');
      const beforeZipClick = ga4Requests.length;
      await zipButton.click();
      await page.waitForTimeout(2000);
      
      const zipClickRequests = ga4Requests.slice(beforeZipClick).filter(url => url.includes('vi_zip_click'));
      if (zipClickRequests.length > 0) {
        console.log(`✅ vi_zip_click event fired`);
        const hasFileName = zipClickRequests[0].includes('ep.file_name');
        const hasLinkUrl = zipClickRequests[0].includes('ep.link_url');
        console.log(`   - has ep.file_name: ${hasFileName ? '✅' : '❌'}`);
        console.log(`   - has ep.link_url: ${hasLinkUrl ? '✅' : '❌'}`);
      } else {
        console.log('❌ vi_zip_click event NOT fired');
      }
    }

    console.log('\n8) Looking for PDF button on /grow...');
    let pdfButton;
    try {
      pdfButton = page.locator('[data-vi="download"]').first();
      await pdfButton.waitFor({ timeout: 3000 });
      console.log('✅ Found PDF button with [data-vi="download"]');
    } catch {
      try {
        pdfButton = page.getByText(/Preuzmi PDF/i).first();
        await pdfButton.waitFor({ timeout: 3000 });
        console.log('✅ Found PDF button by text');
      } catch {
        console.log('❌ PDF button not found');
        pdfButton = null;
      }
    }

    if (pdfButton) {
      console.log('\n9) Clicking PDF button...');
      const beforePdfClick = ga4Requests.length;
      await pdfButton.click();
      await page.waitForTimeout(2000);
      
      const pdfClickRequests = ga4Requests.slice(beforePdfClick).filter(url => url.includes('vi_download_click'));
      if (pdfClickRequests.length > 0) {
        console.log(`✅ vi_download_click event fired`);
        const hasFileName = pdfClickRequests[0].includes('ep.file_name');
        const hasLinkUrl = pdfClickRequests[0].includes('ep.link_url');
        console.log(`   - has ep.file_name: ${hasFileName ? '✅' : '❌'}`);
        console.log(`   - has ep.link_url: ${hasLinkUrl ? '✅' : '❌'}`);
      } else {
        console.log('❌ vi_download_click event NOT fired');
      }
    }

    console.log('\n10) Navigating to /professional-services...');
    await page.goto(`${BASE_URL}/professional-services`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('\n11) Looking for ZIP button on /professional-services...');
    try {
      zipButton = page.locator('[data-vi="zip"]').first();
      await zipButton.waitFor({ timeout: 3000 });
      console.log('✅ Found ZIP button');
      
      const beforeZipClick = ga4Requests.length;
      await zipButton.click();
      await page.waitForTimeout(2000);
      
      const zipClickRequests = ga4Requests.slice(beforeZipClick).filter(url => url.includes('vi_zip_click'));
      if (zipClickRequests.length > 0) {
        console.log(`✅ vi_zip_click event fired on /professional-services`);
      }
    } catch {
      console.log('❌ ZIP button not found on /professional-services');
    }

    console.log('\n\n=== FINAL SUMMARY ===');
    console.log(`\nGA4 Script Loaded: ${gtagRequests.length > 0 ? '✅ YES' : '❌ NO'}`);
    console.log(`Total GA4 Collect Requests: ${ga4Requests.length}`);
    console.log(`Page View Events: ${ga4Requests.filter(u => u.includes('page_view')).length}`);
    console.log(`vi_zip_click Events: ${ga4Requests.filter(u => u.includes('vi_zip_click')).length}`);
    console.log(`vi_download_click Events: ${ga4Requests.filter(u => u.includes('vi_download_click')).length}`);
    console.log(`D&B VI Requests: ${dnbRequests.length > 0 ? '✅ YES' : '❌ NO'} (${dnbRequests.length} total)`);

    console.log('\n=== Last 5 GA4 Collect URLs ===');
    ga4Requests.slice(-5).forEach((url, i) => {
      const u = new URL(url);
      const params = new URLSearchParams(u.search);
      const eventName = params.get('en') || 'unknown';
      console.log(`${i + 1}. Event: ${eventName}`);
      if (params.has('ep.file_name')) console.log(`   - file_name: ${params.get('ep.file_name')}`);
      if (params.has('ep.link_url')) console.log(`   - link_url: ${params.get('ep.link_url')}`);
    });

    console.log('\n=== D&B VI Requests ===');
    dnbRequests.forEach((url, i) => console.log(`${i + 1}. ${url}`));

    console.log('\n=== VERIFICATION COMPLETE ===\n');

    // Assert basic requirements
    expect(gtagRequests.length, 'GA4 script should load').toBeGreaterThan(0);
    expect(ga4Requests.length, 'Should have GA4 collect requests').toBeGreaterThan(0);
  });
});

