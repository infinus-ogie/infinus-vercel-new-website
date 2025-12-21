# Tracking Guidelines - Quick Reference

## 📋 Rule: Always Track Download Buttons

**When creating ANY new page with download buttons (PDF, ZIP, documents), you MUST add tracking attributes.**

## Quick Template

```tsx
// For PDF downloads
<a 
  href="/path/to/file.pdf"
  data-vi="download"
  data-vi-label="Descriptive Name"
  data-vi-doc="filename.pdf"
>
  Download PDF
</a>

// For ZIP downloads
<a 
  href="/path/to/file.zip"
  data-vi="zip"
  data-vi-label="Descriptive Name"
  data-vi-doc="filename.zip"
>
  Download ZIP
</a>
```

## Why This Matters

- **Tracks clicks, not just downloads** - You'll see how many people clicked, even if they didn't complete the download
- **GA4 Event**: `vi_download_click` (for PDFs) or `vi_zip_click` (for ZIPs)
- **Location in GA4**: Reports → Engagement → Events → `vi_download_click`

## Examples in Codebase

- ✅ `/grow` - ResourceCard component
- ✅ `/professional-services` - ResourceCard component  
- ✅ `/projectpulse` - ProjectPulseContent component

## Full Documentation

See [VI_CLICK_TRACKING.md](./VI_CLICK_TRACKING.md) for complete implementation details.

