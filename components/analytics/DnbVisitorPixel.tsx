"use client";

import Script from "next/script";

type Props = {
  enabled?: boolean;
  siteId?: string; // default: env
  // optional metadata you might pass back later via the 4th param (kept empty for now)
  meta?: Record<string, any>;
};

/**
 * D&B Hoovers Visitor Intelligence pixel
 * Loads sync + coretag and calls dnbvid.getData(siteId,"json","T",{},cb)
 * Safe to render multiple times (no-op after first load).
 */
export default function DnbVisitorPixel({ enabled, siteId, meta }: Props) {
  const isEnabled =
    typeof window === "undefined"
      ? (process.env.NEXT_PUBLIC_ENABLE_DNB_VI === "true")
      : enabled ?? (process.env.NEXT_PUBLIC_ENABLE_DNB_VI === "true");

  const id = siteId || process.env.NEXT_PUBLIC_DNB_VI_SITE_ID || "paapi1084";

  if (!isEnabled) return null;

  // keep https (avoid protocol-relative) per best-practice
  const SYNC_SRC = `https://${id}.d41.co/sync/`;
  const CORE_SRC = "https://cdn-0.d41.co/tags/dnb_coretag_v6.min.js";

  return (
    <>
      <Script src={SYNC_SRC} strategy="afterInteractive" />
      <Script src={CORE_SRC} strategy="afterInteractive" />
      <Script id="dnb-vi-init" strategy="afterInteractive">
        {`
          (function initDnbVI(){
            if (!window || typeof window !== 'object') return;
            // simple guard to avoid duplicate init
            if (window.__dnb_vi_initialized) return;
            window.__dnb_vi_initialized = true;

            function safeInit(){
              try {
                var sid = "${id}";
                var payload = ${JSON.stringify(meta || {})}; // empty for now
                if (typeof dnbvid === "undefined" || typeof dnbvid.getData !== "function") {
                  // try again shortly if core hasn't loaded yet
                  return setTimeout(safeInit, 200);
                }
                dnbvid.getData(sid, "json", "T", payload, function(dnb_Data){
                  // Minimal debug surface for QA:
                  window.dnb_vi_last = dnb_Data;
                  
                  // Expose status for QA & tests
                  try {
                    const status = (dnb_Data && typeof dnb_Data.status !== "undefined") ? String(dnb_Data.status) : "n/a";
                    if (typeof document !== "undefined" && document.body) {
                      document.body.dataset.dnbViStatus = status; // e.g. "200", "404", ...
                    }
                    // emit a DOM event for listeners / tests
                    window.dispatchEvent(new CustomEvent("dnb-vi-ready", { detail: dnb_Data }));
                  } catch {}
                  
                  // Optional console for local only:
                  if (location.hostname === "localhost") {
                    console.debug("[DNB-VI] response:", dnb_Data);
                  }
                });
              } catch(e){
                if (location.hostname === "localhost") {
                  console.warn("[DNB-VI] init error", e);
                }
              }
            }
            safeInit();
            
            // Make a manual re-run available for debug page
            (window as any).dnb_vi_rerun = function(payload = {}) {
              try {
                if (typeof dnbvid === "undefined" || typeof dnbvid.getData !== "function") {
                  console.warn("[DNB-VI] re-run: dnbvid not available yet");
                  return;
                }
                dnbvid.getData("${id}", "json", "T", payload, function (d) {
                  window.dnb_vi_last = d;
                  const s = d?.status ? String(d.status) : "n/a";
                  if (document?.body) document.body.dataset.dnbViStatus = s;
                  window.dispatchEvent(new CustomEvent("dnb-vi-ready", { detail: d }));
                  if (location.hostname === "localhost" || "${process.env.NEXT_PUBLIC_DNB_VI_DEBUG}" === "true") {
                    console.debug("[DNB-VI] re-run:", d);
                  }
                });
              } catch (e) {
                console.warn("[DNB-VI] re-run error", e);
              }
            };
          })();
        `}
      </Script>
    </>
  );
}
