# D&B Visitor Intelligence Click Tracking

This document describes the implementation of click tracking for "Preuzmi PDF" CTAs and ZIP downloads on the /grow and /professional-services pages.

## Implementation Overview

### Components Added

1. **ViClickTracker** (`app/_components/ViClickTracker.tsx`)
   - Client component that attaches a delegated click listener to the document
   - Tracks clicks on elements with `data-vi="download"` (PDF) or `data-vi="zip"` (ZIP) attributes
   - Sends data to both D&B Visitor Intelligence and GA4

### Components Modified

1. **ResourceCard** (`components/ui/ResourceCard.tsx`)
   - Added `data-vi="download"`, `data-vi-label`, and `data-vi-doc` attributes to download buttons/links

2. **ResourceList** (`components/ui/ResourceList.tsx`)
   - Added tracking attributes to ZIP download links

3. **ProServicesHero** (`components/sections/growth/ProServicesHero.tsx`)
   - Added `data-vi="zip"`, `data-vi-label`, and `data-vi-doc` attributes to hero ZIP CTAs

4. **Layout** (`app/layout.tsx`)
   - Added ViClickTracker component after RouteChangeTracker

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# D&B Visitor Intelligence Configuration
NEXT_PUBLIC_DNB_VI_ACCOUNT=your_dnb_vi_account_id
NEXT_PUBLIC_DNB_VI_ENABLED=true
NEXT_PUBLIC_DNB_VI_DEBUG=false
```

## How It Works

1. **Consent Check**: The tracker only activates if:
   - `NEXT_PUBLIC_DNB_VI_ENABLED === "true"`
   - `localStorage.getItem("marketing_consent") === "true"`

2. **Click Detection**: Uses event delegation to catch clicks on elements with `data-vi="download"` or `data-vi="zip"`

3. **Data Extraction**: Reads:
   - `data-vi` (type: "download" or "zip")
   - `data-vi-label` (fallback to innerText)
   - `href` from the anchor element or `data-href`
   - `data-vi-doc` (optional filename)
   - Current page path

4. **D&B VI Integration**: Calls `dnbvid.getData()` with:
   - p1: type ("download" or "zip")
   - p2: label
   - p3: href
   - p4: page path

5. **GA4 Integration**: Fires different events based on type:
   - `vi_download_click` for PDF downloads
   - `vi_zip_click` for ZIP downloads
   - Both include: item_name, link_url, file_name, page_location

## Testing

### Enable Consent
```javascript
localStorage.setItem('marketing_consent','true'); 
location.reload();
```

### Enable Debug Mode
Set `NEXT_PUBLIC_DNB_VI_DEBUG=true` in your environment variables.

### Verify Tracking
1. Click on any "Preuzmi PDF" button or "Preuzmite materijale" ZIP link
2. Check Network tab for requests to d41.co
3. Check console for debug logs (if debug enabled)
4. Check GA4 DebugView for `vi_download_click` or `vi_zip_click` events

## Data Attributes

### PDF Downloads
- `data-vi="download"` - Identifies the element as trackable
- `data-vi-label` - Human-readable label (e.g., "Oxford Economics: CFO Insights")
- `data-vi-doc` - Document filename (e.g., "oxford-cfo-insights.pdf")

### ZIP Downloads
- `data-vi="zip"` - Identifies the element as trackable
- `data-vi-label` - Human-readable label (e.g., "Grow Materials – ZIP")
- `data-vi-doc` - ZIP filename (e.g., "grow-pack.zip")

## Pages Affected

- `/grow` - Hero ZIP CTA and all PDF downloads in the downloads section
- `/professional-services` - Hero ZIP CTA and all PDF downloads in the downloads section
- ZIP package downloads on both pages
