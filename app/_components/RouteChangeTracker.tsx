"use client";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const ENABLED = process.env.NEXT_PUBLIC_DNB_VI_ENABLED === "true";
const ACCOUNT = process.env.NEXT_PUBLIC_DNB_VI_ACCOUNT || "paapi1084";
const DEBUG = process.env.NEXT_PUBLIC_DNB_VI_DEBUG === "true";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function hasConsent() {
  try {
    return typeof window !== "undefined" && localStorage.getItem("marketing_consent") === "true";
  } catch { return false; }
}

function callViOnce(url: string, title: string) {
  // Retry loop (up to ~10s)
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
      
      // Send GA4 page_view if gtag is available
      if (typeof window !== "undefined" && (window as any).gtag && GA_ID) {
        (window as any).gtag('event', 'page_view', {
          page_location: window.location.href,
          page_path: window.location.pathname + window.location.search,
          page_title: document.title
        });
        if (DEBUG) console.log("GA4 pageview sent", { url, title });
      }
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
    if (!ENABLED || !hasConsent()) return;

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
