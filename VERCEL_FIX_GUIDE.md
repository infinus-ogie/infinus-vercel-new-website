# Quick Fix Guide: Configure Vercel Environment Variables

## 🚨 IMMEDIATE ACTION REQUIRED

GA4 is not working because environment variables are missing on Vercel. Follow these steps:

---

## Step 1: Check Current Vercel Configuration

Run this command to see current environment variables:
```bash
vercel env ls
```

If you don't have Vercel CLI installed:
```bash
npm i -g vercel
vercel login
vercel link
```

---

## Step 2: Add Missing Environment Variables

### Option A: Via Vercel Dashboard (RECOMMENDED)

1. Go to: https://vercel.com
2. Navigate to your project: **infinus-vercel-new-website**
3. Click **Settings** → **Environment Variables**
4. Add these variables:

   | Variable Name | Value | Environments |
   |--------------|-------|--------------|
   | `NEXT_PUBLIC_GA_ID` | `G-S0YZ6MZWK1` | Production, Preview, Development |
   | `NEXT_PUBLIC_DNB_VI_ENABLED` | `true` | Production, Preview, Development |
   | `NEXT_PUBLIC_DNB_VI_ACCOUNT` | `paapi1084` | Production, Preview, Development |
   | `NEXT_PUBLIC_DNB_VI_DEBUG` | `false` | Production only |

5. Click **Save**

### Option B: Via Vercel CLI

```bash
# Add GA4 ID (REQUIRED)
vercel env add NEXT_PUBLIC_GA_ID production
# When prompted, enter: G-S0YZ6MZWK1

vercel env add NEXT_PUBLIC_GA_ID preview
# When prompted, enter: G-S0YZ6MZWK1

vercel env add NEXT_PUBLIC_GA_ID development
# When prompted, enter: G-S0YZ6MZWK1

# Add D&B VI variables (OPTIONAL)
vercel env add NEXT_PUBLIC_DNB_VI_ENABLED production
# When prompted, enter: true

vercel env add NEXT_PUBLIC_DNB_VI_ACCOUNT production
# When prompted, enter: paapi1084
```

---

## Step 3: Redeploy

### Option A: Via Vercel Dashboard
1. Go to **Deployments**
2. Click **...** on the latest production deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (unchecked)
5. Click **Redeploy**

### Option B: Via Git Push
```bash
git commit --allow-empty -m "Trigger redeploy for environment variables"
git push origin main
```

### Option C: Via Vercel CLI
```bash
vercel --prod
```

---

## Step 4: Verify Configuration

After redeployment completes (usually 2-3 minutes):

```bash
# Run the GA4 smoke tests
npm run qa:ga
```

**Expected Output:**
```
✅ PASS - A. page_view tracking with debug logs
✅ PASS - A2. Route change tracking
✅ PASS - B. ZIP click tracking on /grow
```

---

## Step 5: Check GA4 Dashboard

1. Go to: https://analytics.google.com/
2. Select property: **G-S0YZ6MZWK1**
3. Go to: **Reports** → **Realtime**
4. In a new tab, visit: https://www.infinus.co
5. Open browser console and look for:
   ```
   [GA4 DEBUG] 1. Initializing GA4, GA_ID: G-S0YZ6MZWK1
   [GA4 DEBUG] 2. Consent check: {consentValue: "true", hasConsent: true}
   [GA4 DEBUG] 3. Setting consent default to DENIED
   [GA4 DEBUG] 4. Consent default set to DENIED
   [GA4 DEBUG] 5. User has consent, updating to GRANTED
   [GA4 DEBUG] 6. Consent updated to GRANTED
   [GA4 DEBUG] 7. Calling gtag("js", new Date())
   [GA4 DEBUG] 8. Calling gtag("config") with send_page_view: false
   [GA4 DEBUG] 9. Sending initial page_view event
   [GA4 DEBUG] 10. Initial page_view sent
   [GA4 DEBUG] 11. GA4 initialization complete
   ```
6. You should see **1 active user** in GA4 Realtime

---

## Step 6: Test Click Tracking

1. Visit: https://www.infinus.co/grow
2. Click the **ZIP download button**
3. Check browser console for:
   ```
   [ViClickTracker DEBUG] Click detected on VI element
   [ViClickTracker DEBUG] Sending GA4 event: vi_zip_click
   [ViClickTracker DEBUG] GA4 event sent successfully: vi_zip_click
   ```
4. Check GA4 Realtime → Events → Should see `vi_zip_click`

---

## Step 7: Remove Debug Logs (After Everything Works)

Once tests pass and GA4 is working:

```bash
# This will remove all debug logging
# Edit these files and remove DEBUG blocks:
# - app/_components/GoogleAnalytics.tsx (lines 20-23)
# - app/_components/RouteChangeTracker.tsx (lines 10-13)  
# - app/_components/ViClickTracker.tsx (lines 21-24)
```

Or just commit the cleaned-up version after manual verification.

---

## Troubleshooting

### If Tests Still Fail After Adding Env Vars

1. **Verify env vars are set:**
   ```bash
   vercel env ls
   ```
   Should show `NEXT_PUBLIC_GA_ID` for all environments.

2. **Check deployment logs:**
   - Go to Vercel Dashboard → Deployments → Click on latest deployment
   - Check "Build Logs" for any errors
   - Check "Function Logs" (if any)

3. **Clear browser cache:**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Or open in Incognito mode

4. **Check browser console:**
   - Should see debug logs from `[GA4 DEBUG]`, `[RouteTracker DEBUG]`, `[ViClickTracker DEBUG]`
   - If no logs appear, the components aren't rendering (check React DevTools)

5. **Check network tab:**
   - Filter for `google-analytics.com`
   - Should see:
     - `gtag/js?id=G-S0YZ6MZWK1` (script load)
     - `g/collect?v=2&...&en=page_view` (page_view event)
     - `g/collect?v=2&...&en=vi_zip_click` (after clicking ZIP)

---

## Quick Reference

**Vercel Project:** infinus-vercel-new-website  
**GA4 Measurement ID:** G-S0YZ6MZWK1  
**Production URL:** https://www.infinus.co  
**Test Command:** `npm run qa:ga`  
**Account to Use:** infinus (NOT brivio)

---

## Support

If issues persist:
1. Check `GA4_REGRESSION_REPORT.md` for detailed technical analysis
2. Review browser console for debug logs
3. Check Vercel deployment logs
4. Verify environment variables are set for Production environment

