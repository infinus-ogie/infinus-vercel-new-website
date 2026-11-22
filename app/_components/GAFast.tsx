"use client";

import { useEffect } from "react";

/**
 * The initial GA4 `page_view`.
 *
 * Mounted only inside AnalyticsGate, so it exists only once analytics consent has been
 * given, and the gtag config sets `send_page_view: false`. It sends exactly ONE page view,
 * when the gate opens: on a direct load with consent already stored, or the moment a visitor
 * first accepts analytics.
 *
 * ── Later page changes are GA4's, not ours ─────────────────────────────────────
 * The property's Enhanced Measurement setting "Page changes based on browser history
 * events" is on, so gtag.js itself sends a `page_view` for every client-side navigation
 * (Next.js uses pushState). This component used to send one too, on every pathname or query
 * change, so each soft navigation was counted twice; and it had a second, mount-only effect,
 * so each direct load was counted twice. Both are gone.
 *
 * KEEP that Enhanced Measurement setting on (GA4 → Admin → Data streams → web stream →
 * Enhanced measurement → Page views → Advanced). Turning it off would stop page views for
 * client-side navigations. A switch between the English and Serbian root layouts is a full
 * page load, so it is counted here either way.
 *
 * A hash change such as the #contact-form jump is not a page view on either path.
 * `page_location` is the full URL, so the first hit of a campaign visit carries its UTM
 * parameters.
 */
export default function GAFast() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search,
      page_title: document.title,
    });
  }, []);

  return null;
}
