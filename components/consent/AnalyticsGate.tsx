"use client"

/**
 * STRICT NO-LOAD analytics gate.
 *
 * Returns null — emitting nothing at all — until the visitor has explicitly allowed
 * analytics. This is deliberately NOT Google Consent Mode v2: we do not load gtag with
 * `denied` defaults, because the approved Privacy Policy states that Google Analytics
 * "may be activated only after you provide consent". No googletagmanager.com request
 * may exist before that point.
 *
 * Because the gate is client-only and starts closed, the vendor URL never appears in
 * the prerendered HTML either. `scripts/seo/assert-no-preconsent-vendors.ts` asserts
 * that mechanically on every build.
 *
 * Trackers mounted here, classified by what they actually transmit rather than by name:
 *   - GAFast            sends the initial GA4 `page_view` when this gate opens. Later
 *                       client-side navigations are counted by GA4 Enhanced Measurement
 *                       (history events), not by this site; see GAFast.
 *   - AITrafficTracker  sends a GA4 `ai_traffic` event derived from document.referrer.
 *   - ViClickTracker    sends GA4 `vi_download_click` / `vi_zip_click` on download
 *                       clicks. It ALSO has a D&B branch, which self-guards on
 *                       `window.dnbvid` — an object that only exists once MarketingGate
 *                       has loaded D&B — so no marketing call can happen from here
 *                       without marketing consent.
 */

import * as React from "react"
import Script from "next/script"
import { GA_MEASUREMENT_ID } from "@/lib/consent"
import { useConsent } from "./ConsentProvider"
import GAFast from "@/app/_components/GAFast"
import AITrafficTracker from "@/app/_components/AITrafficTracker"
import ViClickTracker from "@/app/_components/ViClickTracker"

export function AnalyticsGate() {
  const { analytics } = useConsent()

  if (!analytics) return null

  return (
    <>
      {/* The id is already normalised (lib/consent.ts). It is still encoded for the URL and
          embedded with JSON.stringify rather than between hand-written quotes, so no value
          can break out of either context: a raw newline there is what took GA4 down
          site-wide. */}
      <Script
        id="ga4-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', ${JSON.stringify(GA_MEASUREMENT_ID)}, { send_page_view: false });
        `}
      </Script>
      {/* GAFast no longer reads useSearchParams(), but the Suspense boundary stays: it
          costs nothing, and it is what kept that hook from forcing static pages to bail out
          of static rendering — the original cause of a site-wide noindex on this site. */}
      <React.Suspense fallback={null}>
        <GAFast />
      </React.Suspense>
      <AITrafficTracker />
      <ViClickTracker />
    </>
  )
}
