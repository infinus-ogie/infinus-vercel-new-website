# D&B Visitor Intelligence & GA4 Tracking - QA Guide

## Quick Smoke Test

### 1. Enable Consent & Debug Mode
```javascript
// In browser console:
localStorage.setItem('marketing_consent','true'); 
location.reload();
```

### 2. Check Health Endpoint
Visit `/vi-debug` (only works when `NEXT_PUBLIC_DNB_VI_DEBUG=true`)

Expected JSON response:
```json
{
  "viEnabled": true,
  "account": "paapi1084",
  "hasVendorScripts": true,
  "hasRouteTracker": true,
  "hasClickTracker": true,
  "timestamp": "2024-01-XX...",
  "debug": true
}
```

### 3. Test Manual Events (Debug Mode Only)
```javascript
// In browser console:
__viTest.consentOn();           // Enable consent
__viTest.fireDownload();        // Test PDF download event
__viTest.fireZip();            // Test ZIP download event
__viTest.status();             // Check current status
```

### 4. Test Real Clicks
1. **Hero ZIP Download**: Click "Preuzmite materijale" on `/grow` or `/professional-services`
2. **Individual PDF**: Click any "Preuzmi PDF" button in downloads section
3. **ZIP Package**: Click "Preuzmi ceo paket (ZIP)" in downloads section

### 5. Verify Tracking

#### Network Tab
- Filter by `d41.co`
- Should see requests to:
  - `https://paapi1084.d41.co/sync/`
  - `https://cdn-0.d41.co/tags/dnb_coretag_v6.min.js`
  - Additional requests when clicking tracked elements

#### Console Logs (Debug Mode)
- `[ViClickTracker] Click detected: {...}`
- `[ViClickTracker] D&B VI data sent successfully`
- `[ViClickTracker] GA4 event sent successfully: vi_zip_click` or `vi_download_click`

#### GA4 DebugView
- Look for events: `vi_zip_click` and `vi_download_click`
- Check parameters: `item_name`, `link_url`, `file_name`, `page_location`

#### D&B VI Ready Event
```javascript
// Listen for D&B VI initialization
window.addEventListener('dnb_vi_ready', e => console.log('D&B VI Ready:', e.detail));
```

## Environment Variables Required

### Local Development (.env.local)
```bash
NEXT_PUBLIC_DNB_VI_ENABLED=true
NEXT_PUBLIC_DNB_VI_ACCOUNT=paapi1084
NEXT_PUBLIC_DNB_VI_DEBUG=true
```

### Vercel Production
Set these in Vercel Dashboard > Project > Settings > Environment Variables:
- `NEXT_PUBLIC_DNB_VI_ENABLED=true`
- `NEXT_PUBLIC_DNB_VI_ACCOUNT=paapi1084`
- `NEXT_PUBLIC_DNB_VI_DEBUG=false` (or `true` for testing)

## Troubleshooting

### No Tracking Events
1. Check consent: `localStorage.getItem('marketing_consent')`
2. Check feature flag: `process.env.NEXT_PUBLIC_DNB_VI_ENABLED`
3. Check D&B VI availability: `typeof window.dnbvid`

### Missing GA4 Events
1. Verify gtag is loaded: `typeof window.gtag`
2. Check GA4 DebugView is enabled
3. Verify event names: `vi_zip_click` and `vi_download_click`

### Missing D&B VI Requests
1. Check network tab for d41.co requests
2. Verify account ID matches environment variable
3. Check for JavaScript errors in console

## Files Modified

- `app/_components/VendorScripts.tsx` - D&B VI scripts + debug hooks
- `app/_components/RouteChangeTracker.tsx` - Page view tracking
- `app/_components/ViClickTracker.tsx` - Click event tracking
- `app/layout.tsx` - Component mounting
- `app/vi-debug/route.ts` - Health check endpoint
- `components/sections/growth/ProServicesHero.tsx` - Hero CTA attributes
- `components/ui/ResourceCard.tsx` - PDF download attributes
- `components/ui/ResourceList.tsx` - ZIP download attributes
