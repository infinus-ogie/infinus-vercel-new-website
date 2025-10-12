"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * TEMPORARY HOTFIX: Unconditional GA4 page_view tracking
 * 
 * This bypasses Consent Mode v2 for immediate campaign tracking.
 * Will be replaced with proper consent-aware tracking after campaign launch.
 * 
 * Fires page_view on:
 * - Initial mount
 * - Route changes (SPA navigation)
 */
export default function GAFast() {
  const pathname = usePathname();
  const search = useSearchParams();

  const fire = () => {
    if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
      (window as any).gtag('event', 'page_view', {
        page_location: window.location.href,
        page_path: window.location.pathname + window.location.search,
        page_title: document.title
      });
      console.log('[GAFast] page_view fired:', window.location.pathname);
    } else {
      console.warn('[GAFast] gtag not available');
    }
  };

  // Fire on initial mount
  useEffect(fire, []);
  
  // Fire on route change
  useEffect(fire, [pathname, search]);

  return null;
}

