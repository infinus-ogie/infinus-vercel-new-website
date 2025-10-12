# GA4 Fix Checklist

## ✅ Completed (By AI Assistant)

- [x] Fixed GoogleAnalytics.tsx consent flow (default → update pattern)
- [x] Added `send_page_view: false` to prevent duplicate page views
- [x] Added manual page_view event after consent grant
- [x] Fixed ViClickTracker to use capture phase (`true` instead of `{ passive: true }`)
- [x] Enhanced RouteChangeTracker with better logging
- [x] Added comprehensive debug logging to all three components
- [x] Enhanced Playwright tests with console log capture
- [x] Added route change tracking test
- [x] Ran tests and identified root cause (missing env vars)
- [x] Built project successfully (no TypeScript errors)
- [x] Verified no linter errors
- [x] Created documentation:
  - GA4_REGRESSION_REPORT.md (technical analysis)
  - VERCEL_FIX_GUIDE.md (step-by-step guide)
  - GA4_FIX_SUMMARY.md (executive summary)
  - GA4_CHECKLIST.md (this file)

---

## ⚠️ YOUR ACTIONS REQUIRED

### 1. Configure Vercel Environment Variables

**Go to:** https://vercel.com/infinus-projects/infinus-vercel-new-website/settings/environment-variables

**Add these variables for Production, Preview, AND Development:**

```
NEXT_PUBLIC_GA_ID=G-S0YZ6MZWK1
NEXT_PUBLIC_DNB_VI_ENABLED=true
NEXT_PUBLIC_DNB_VI_ACCOUNT=paapi1084
NEXT_PUBLIC_DNB_VI_DEBUG=false
```

- [ ] Added `NEXT_PUBLIC_GA_ID` to Production
- [ ] Added `NEXT_PUBLIC_GA_ID` to Preview
- [ ] Added `NEXT_PUBLIC_GA_ID` to Development
- [ ] Added `NEXT_PUBLIC_DNB_VI_ENABLED` to Production
- [ ] Added `NEXT_PUBLIC_DNB_VI_ACCOUNT` to Production
- [ ] Clicked "Save"

### 2. Redeploy Application

**Choose ONE method:**

- [ ] **Option A:** Vercel Dashboard → Deployments → ... → Redeploy
- [ ] **Option B:** Run `git commit --allow-empty -m "Trigger redeploy" && git push origin main`
- [ ] **Option C:** Run `vercel --prod`

- [ ] Wait for deployment to complete (2-3 minutes)
- [ ] Verify deployment success in Vercel dashboard

### 3. Run Tests

```bash
npm run qa:ga
```

- [ ] All tests pass (A, A2, B, C, D, E, F, G, H)
- [ ] No timeout errors
- [ ] Console logs show GA4 initialization
- [ ] See collect URLs in test output

**Expected output:**
```
✅ PASS - A. page_view tracking with debug logs
✅ PASS - A2. Route change tracking
✅ PASS - B. ZIP click tracking on /grow
✅ PASS - C. PDF download tracking on /grow
✅ PASS - D. ZIP click tracking on /professional-services
✅ PASS - E. PDF download tracking on /professional-services
✅ PASS - F. D&B VI script loading
✅ PASS - G. Debug endpoint health check
✅ PASS - H. Environment variables and tracking status check
```

### 4. Manual Verification in Browser

**Visit:** https://www.infinus.co

- [ ] Open Chrome DevTools (F12)
- [ ] Go to Console tab
- [ ] Look for `[GA4 DEBUG]` logs (should see 11 numbered steps)
- [ ] Go to Network tab
- [ ] Filter for `google-analytics.com`
- [ ] Reload page
- [ ] See `gtag/js?id=G-S0YZ6MZWK1` request
- [ ] See `g/collect?v=2&...&en=page_view` request

### 5. Verify in GA4 Dashboard

**Go to:** https://analytics.google.com/ (Property: G-S0YZ6MZWK1)

- [ ] Navigate to Reports → Realtime
- [ ] See at least 1 active user (you)
- [ ] See page_view events
- [ ] Event count increasing as you navigate

### 6. Test Click Tracking

**Visit:** https://www.infinus.co/grow

- [ ] See `[RouteTracker DEBUG]` logs for route change
- [ ] See `[ViClickTracker DEBUG]` initialization logs
- [ ] Click the ZIP download button
- [ ] See `[ViClickTracker DEBUG] Click detected on VI element`
- [ ] See `[ViClickTracker DEBUG] GA4 event sent successfully: vi_zip_click`
- [ ] Check Network tab for `g/collect?...&en=vi_zip_click`
- [ ] Check GA4 Realtime → Events for `vi_zip_click`

**Visit:** https://www.infinus.co/professional-services

- [ ] Click ZIP button
- [ ] See `vi_zip_click` event
- [ ] Click "Preuzmi PDF" button
- [ ] See `vi_download_click` event

### 7. Remove Debug Logs (After Everything Works)

**Edit these files and remove DEBUG blocks:**

- [ ] `app/_components/GoogleAnalytics.tsx` - Remove lines 20-23
- [ ] `app/_components/RouteChangeTracker.tsx` - Remove lines 10-13
- [ ] `app/_components/ViClickTracker.tsx` - Remove lines 21-24

**In each file, also replace:**
- [ ] Replace all `log(...)` calls with appropriate action (keep or remove)

### 8. Commit Clean Code

```bash
git add app/_components/*.tsx
git commit -m "Fix GA4: Correct consent flow, capture phase clicks, manual page_views"
git push origin main
```

- [ ] Committed changes
- [ ] Pushed to main branch
- [ ] Verified deployment on Vercel

### 9. Final Verification (After Cleanup)

```bash
npm run qa:ga
```

- [ ] All tests still pass (without debug logs)
- [ ] GA4 still working in production
- [ ] No console.log spam in production

---

## 📊 Success Metrics

After completing all steps, you should have:

✅ **100% test pass rate** (9/9 tests passing)  
✅ **GA4 collecting data** (visible in Realtime dashboard)  
✅ **Page views tracked** (on every navigation)  
✅ **Click events tracked** (vi_zip_click, vi_download_click)  
✅ **Consent mode working** (proper DENIED → GRANTED flow)  
✅ **Clean console** (after debug logs removed)  

---

## 🆘 If Something Fails

### Tests still fail after adding env vars?
- Check `VERCEL_FIX_GUIDE.md` troubleshooting section
- Verify env vars with `vercel env ls`
- Check Vercel deployment logs

### No console logs appear?
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Try Incognito mode
- Clear browser cache

### No GA4 requests in Network tab?
- Check if GA4 script loaded (`gtag/js?id=G-S0YZ6MZWK1`)
- Check browser console for errors
- Verify `NEXT_PUBLIC_GA_ID` is set in Vercel

### Events not showing in GA4 Dashboard?
- Wait 1-2 minutes (sometimes delayed)
- Check if you're looking at the right property (G-S0YZ6MZWK1)
- Try sending a test event again

---

## 📚 Documentation

- **GA4_REGRESSION_REPORT.md** - Full technical analysis
- **VERCEL_FIX_GUIDE.md** - Detailed Vercel setup guide
- **GA4_FIX_SUMMARY.md** - Executive summary
- **GA4_CHECKLIST.md** - This checklist

---

## ⏱️ Estimated Time

- Vercel configuration: **5 minutes**
- Redeploy wait: **2-3 minutes**
- Testing: **10 minutes**
- Debug log removal: **5 minutes**
- Final verification: **5 minutes**

**Total: ~30 minutes**

---

## 🎯 Priority

**URGENT:** Configure Vercel environment variables (Step 1 & 2)  
**HIGH:** Run tests and verify (Step 3, 4, 5, 6)  
**MEDIUM:** Clean up debug logs (Step 7, 8, 9)  

---

**Start with Step 1 NOW** → The code is ready, just needs environment variables!

