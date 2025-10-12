"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const DNB_ENABLED = process.env.NEXT_PUBLIC_DNB_VI_ENABLED === "true";
const DNB_ACCOUNT = process.env.NEXT_PUBLIC_DNB_VI_ACCOUNT || "paapi1084";
const DEBUG = process.env.NEXT_PUBLIC_DNB_VI_DEBUG === "true";

/**
 * VendorScripts
 * - Central place to inject third-party marketing/analytics tags.
 * - We gate D&B VI by a feature flag and (optionally) user consent.
 */
export default function VendorScripts() {
  const [canLoadMarketing, setCanLoadMarketing] = useState(false);

  useEffect(() => {
    // SIMPLE consent gate (optional):
    // If you have a cookie banner, replace this with real consent check:
    // e.g. read "marketing_consent" from cookies/localStorage or your ConsentProvider.
    const consent =
      typeof window !== "undefined"
        ? localStorage.getItem("marketing_consent") === "true"
        : true; // on SSR assume false/true; tweak as needed
    console.log('[VendorScripts] Consent check:', { consent, DNB_ENABLED });
    setCanLoadMarketing(consent);
  }, []);

  // If flag off or no consent -> do nothing
  if (!DNB_ENABLED || !canLoadMarketing) return null;

  return (
    <>
      {/* D&B Visitor Intelligence - External Scripts */}
      <Script
        id="dnb-vi-sync"
        strategy="afterInteractive"
        src={`https://${DNB_ACCOUNT}.d41.co/sync/`}
      />
      <Script
        id="dnb-vi-coretag"
        strategy="afterInteractive"
        src="https://cdn-0.d41.co/tags/dnb_coretag_v6.min.js"
      />
      
      {/* D&B VI Initialization with Retry Logic */}
      <Script id="dnb-vi-init" strategy="afterInteractive">
        {`
          (function initDnbVi(){
            var tries = 0, MAX = 50; // ~10s at 200ms
            function start(){
              try {
                if (typeof window === 'undefined' || typeof window.dnbvid === 'undefined' || typeof window.dnbvid.getData !== 'function') {
                  if (tries++ < MAX) return setTimeout(start, 200);
                  console.error('DNB VI: dnbvid not available');
                  return;
                }
                // Exact vendor call (from email):
                window.dnbvid.getData("${DNB_ACCOUNT}","json","T",{},function(dnb_Data){
                  // Mapping placeholder (we keep as-is for now)
                  if (dnb_Data && dnb_Data.status == 200) {
                    // Fire a custom event so we can hook later (GA4)
                    try {
                      window.dispatchEvent(new CustomEvent('dnb_vi_ready', { detail: dnb_Data }));
                    } catch(_) {}
                  }
                });
              } catch (e) {
                console.error('DNB VI init error', e);
              }
            }
            start();
          })();
        `}
      </Script>
      
      {/* Debug Test Hooks - Only in debug mode */}
      {DEBUG && (
        <Script id="vi-debug-hooks" strategy="afterInteractive">
          {`
            (function setupDebugHooks() {
              if (typeof window === 'undefined') return;
              
              window.__viTest = {
                consentOn: () => {
                  localStorage.setItem('marketing_consent', 'true');
                  console.log('[VI Debug] Consent enabled - reload page to activate tracking');
                },
                consentOff: () => {
                  localStorage.removeItem('marketing_consent');
                  console.log('[VI Debug] Consent disabled - reload page to deactivate tracking');
                },
                fireDownload: (label = 'Test PDF', href = '/dummy.pdf') => {
                  console.log('[VI Debug] Firing test download event:', { label, href });
                  window.dispatchEvent(new CustomEvent('vi_manual_click', {
                    detail: { type: 'download', label, href, page: location.pathname }
                  }));
                },
                fireZip: (label = 'Test ZIP', href = '/dummy.zip') => {
                  console.log('[VI Debug] Firing test ZIP event:', { label, href });
                  window.dispatchEvent(new CustomEvent('vi_manual_click', {
                    detail: { type: 'zip', label, href, page: location.pathname }
                  }));
                },
                status: () => {
                  const consent = localStorage.getItem('marketing_consent') === 'true';
                  const dnbvid = typeof window.dnbvid !== 'undefined';
                  console.log('[VI Debug] Status:', { consent, dnbvid, account: '${DNB_ACCOUNT}' });
                  return { consent, dnbvid, account: '${DNB_ACCOUNT}' };
                }
              };
              
              console.log('[VI Debug] Test hooks available at window.__viTest');
              console.log('[VI Debug] Usage: __viTest.consentOn(); __viTest.fireDownload(); __viTest.fireZip();');
            })();
          `}
        </Script>
      )}
    </>
  );
}

