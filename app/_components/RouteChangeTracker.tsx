"use client";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const ENABLED = process.env.NEXT_PUBLIC_DNB_VI_ENABLED === "true";
const ACCOUNT = process.env.NEXT_PUBLIC_DNB_VI_ACCOUNT || "paapi1084";
const DEBUG = process.env.NEXT_PUBLIC_DNB_VI_DEBUG === "true";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function hasConsent() {
  try {
    const consent = typeof window !== "undefined" && localStorage.getItem("marketing_consent") === "true";
    console.log('[RouteChangeTracker] Consent check:', { consent, hasWindow: typeof window !== "undefined" });
    return consent;
  } catch (e) { 
    console.log('[RouteChangeTracker] Consent check error:', e);
    return false; 
  }
}

function callViOnce(url: string, title: string) {
  console.log('[RouteChangeTracker] callViOnce called:', { url, title, hasGtag: typeof (window as any).gtag !== "undefined", GA_ID });
  
  // Send GA4 page_view immediately if gtag is available
  if (typeof window !== "undefined" && (window as any).gtag && GA_ID) {
    (window as any).gtag('event', 'page_view', {
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search,
      page_title: document.title
    });
    console.log("GA4 pageview sent", { url, title });
  } else {
    console.log("GA4 pageview NOT sent - missing requirements:", { 
      hasWindow: typeof window !== "undefined", 
      hasGtag: typeof (window as any).gtag !== "undefined", 
      GA_ID 
    });
  }

  // Only run D&B VI if enabled
  if (!ENABLED) return;

  // Retry loop for D&B VI (up to ~10s)
  let tries = 0, MAX = 50;
  const tick = () => {
    try {
      if (typeof window === "undefined" || typeof (window as any).dnbvid?.getData !== "function") {
        if (tries++ < MAX) return setTimeout(tick, 200);
        if (DEBUG) console.warn("DNB VI route-call: dnbvid not available");
        return;
      }
      (window as any).dnbvid.getData(ACCOUNT, "json", "T", {}, function(dnb_Data: any){
        if (DEBUG) console.log("DNB VI pageview", { url, title, dnb_Data });
        if (dnb_Data && dnb_Data.status == 200) {
          try { window.dispatchEvent(new CustomEvent("dnb_vi_ready", { detail: dnb_Data })); } catch {}
        }
      });
    } catch (e) {
      if (DEBUG) console.error("DNB VI route-call error", e);
    }
  };
  tick();
}

export default function RouteChangeTracker() {
  const pathname = usePathname();
  const search = useSearchParams();
  const firstRun = useRef(true);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    // Always run if we have consent, regardless of D&B VI enabled status
    // This ensures GA4 page_view tracking works even when D&B VI is disabled
    if (!hasConsent()) return;

    // Debounce 200ms – da se title/DOM ažuriraju i izbegnu dupli pozivi
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const url = pathname + (search?.toString() ? `?${search.toString()}` : "");
      const title = document.title || "";
      callViOnce(url, title);
    }, firstRun.current ? 0 : 200);

    firstRun.current = false;
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [pathname, search]);

  return null;
}
