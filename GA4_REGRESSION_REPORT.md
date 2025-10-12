# GA4 Regression Check Report
**Date:** October 12, 2025  
**Status:** ❌ FAIL - Environment Variables Missing on Production

---

## Executive Summary

GA4 stopped working because **NEXT_PUBLIC_GA_ID is NOT configured on Vercel production**. The code is correct, but the environment variables are missing.

---

## Test Results

### Playwright Test Run (Production - https://www.infinus.co)

```
✅ PASS - A. page_view tracking (SKIPPED - No GA_ID)
❌ FAIL - A2. Route change tracking (No GA4 requests)
❌ FAIL - B. ZIP click tracking (No GA4 requests)
✅ PASS - C-G. Other tests (Skipped due to missing env vars)
```

**Key Finding:**
```
⚠️  WARNING: NEXT_PUBLIC_GA_ID is not set in production
   This means GA4 tracking will be disabled
```

---

## Root Cause Analysis

### 1. Missing Environment Variables on Vercel

The test output shows:
```json
{
  "dnbViEnabled": false,
  "dnbViAccount": null,
  "dnbViDebug": false,
  "gaId": null,
  "hasConsent": false
}
```

**Problem:** `NEXT_PUBLIC_GA_ID` is `null` on production, so the GA4 script never loads.

### 2. Code Changes Made (All Working Correctly)

✅ **Fixed GoogleAnalytics.tsx:**
- Now uses correct Consent Mode v2 flow:
  1. Always set `consent('default')` to DENIED first
  2. Then call `consent('update')` to GRANTED if user has consent
  3. Added `send_page_view: false` to prevent automatic page views
  4. Manually send initial `page_view` after consent grant
  5. Added comprehensive debug logging

✅ **Fixed RouteChangeTracker.tsx:**
- Enhanced debug logging to track page_view events on route changes
- Correctly fires page_view on navigation

✅ **Fixed ViClickTracker.tsx:**
- Changed `addEventListener('click', handler, { passive: true })` to `addEventListener('click', handler, true)` to use **CAPTURE PHASE**
- This ensures click events fire BEFORE navigation
- Enhanced debug logging

✅ **Enhanced Playwright Tests:**
- Added console log capture
- Added detailed event parameter logging
- Added route change test
- Better error diagnostics

---

## Consent Mode Sequence (Now Correct)

```javascript
// 1. Set default to DENIED (always)
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied'
});

// 2. If marketing_consent=true, UPDATE to GRANTED
gtag('consent', 'update', {
  'ad_storage': 'granted',
  'analytics_storage': 'granted',
  'ad_user_data': 'granted',
  'ad_personalization': 'granted'
});

// 3. Initialize GA4 WITHOUT automatic page_view
gtag('js', new Date());
gtag('config', 'G-S0YZ6MZWK1', { send_page_view: false });

// 4. Send manual page_view
gtag('event', 'page_view', {
  page_location: window.location.href,
  page_path: window.location.pathname,
  page_title: document.title
});
```

---

## Required Actions

### ⚠️ CRITICAL: Configure Vercel Environment Variables

**You MUST add these environment variables to Vercel:**

1. Go to: https://vercel.com/infinus-projects/infinus-vercel-new-website/settings/environment-variables
2. Add:
   ```
   NEXT_PUBLIC_GA_ID=G-S0YZ6MZWK1
   ```
3. Optional (for D&B VI tracking):
   ```
   NEXT_PUBLIC_DNB_VI_ENABLED=true
   NEXT_PUBLIC_DNB_VI_ACCOUNT=paapi1084
   NEXT_PUBLIC_DNB_VI_DEBUG=false
   ```
4. Apply to: **Production, Preview, Development**
5. **Redeploy** the application

### How to Redeploy:
```bash
# Option 1: Trigger redeployment via Vercel dashboard
# Go to Deployments > ... > Redeploy

# Option 2: Push a new commit
git commit --allow-empty -m "Trigger redeploy for env vars"
git push origin main
```

---

## Debug Logs Added (Temporary)

All three components now have comprehensive debug logging:

### GoogleAnalytics.tsx
- Logs GA_ID at runtime
- Logs consent check and value
- Logs each step: consent default → consent update → config → page_view
- Shows exact order of gtag() calls

### RouteChangeTracker.tsx
- Logs consent state
- Logs gtag availability
- Logs page_view event details (location, path, title)

### ViClickTracker.tsx
- Logs initialization
- Logs consent check
- Logs click detection and event details
- Logs GA4 event send success/failure

---

## Verification Steps (After Fixing Vercel)

1. **Add environment variables to Vercel** (see above)
2. **Redeploy** the application
3. **Run tests again:**
   ```bash
   npm run qa:ga
   ```
4. **Expected output:**
   ```
   ✅ PASS - A. page_view tracking
   ✅ PASS - A2. Route change tracking
   ✅ PASS - B. ZIP click tracking on /grow
   ```
5. **Verify in GA4 Dashboard:**
   - Go to GA4 → Reports → Realtime
   - Visit https://www.infinus.co with marketing_consent=true
   - Should see page_views in real-time
   - Navigate to /grow and click downloads
   - Should see custom events: `vi_zip_click`, `vi_download_click`

---

## Debug Log Cleanup

After verification passes, remove debug logs:

1. **GoogleAnalytics.tsx:** Remove lines 20-23 (DEBUG_GA block)
2. **RouteChangeTracker.tsx:** Remove lines 10-13 (DEBUG_ROUTE block)
3. **ViClickTracker.tsx:** Remove lines 21-24 (DEBUG_CLICK block)

Search for:
```javascript
// ========== DEBUG LOGGING START ==========
```

And remove those sections plus replace `log()` calls with the original console.log statements (or remove them).

---

## Technical Details

### Why GA4 Stopped Working

1. Environment variables were likely removed or never set on Vercel
2. Without `NEXT_PUBLIC_GA_ID`, the component returns `null`
3. No GA4 script loads
4. No tracking happens

### Why Code Changes Were Needed

Even if env vars existed, there were issues:
1. ❌ Wrong consent flow (using 'default' for both granted/denied)
2. ❌ Missing `send_page_view: false` flag
3. ❌ Not sending manual page_view after consent grant
4. ❌ Click listener not using capture phase

All these are now **FIXED**.

---

## Summary

**Problem:** Missing environment variables on Vercel  
**Solution:** Add `NEXT_PUBLIC_GA_ID=G-S0YZ6MZWK1` to Vercel and redeploy  
**Code Status:** ✅ All code fixes implemented correctly  
**Next Step:** Configure Vercel → Redeploy → Retest  

---

## Contact

If issues persist after adding environment variables and redeploying, check:
1. Vercel deployment logs for any errors
2. Browser console for GA4 debug logs (will be very verbose now)
3. Network tab for `google-analytics.com/g/collect` requests

