"use client";

import { useEffect } from "react";

// Extend Window interface for D&B VI and gtag
declare global {
  interface Window {
    dnbvid?: {
      getData: (
        account: string,
        format: string,
        type: string,
        data: Record<string, string>,
        callback: () => void
      ) => void;
    };
    gtag?: (command: string, action: string, parameters?: Record<string, any>) => void;
  }
}

// ========== DEBUG LOGGING START ==========
const DEBUG_CLICK = true;
const log = (...args: any[]) => DEBUG_CLICK && console.log('[ViClickTracker DEBUG]', ...args);
// ========== DEBUG LOGGING END ==========

export default function ViClickTracker() {
  useEffect(() => {
    // TEMPORARY HOTFIX: Skip consent checks for campaign launch
    console.log('[ViClickTracker] Initializing (hotfix mode - unconditional tracking)');
    
    const dnbViEnabled = process.env.NEXT_PUBLIC_DNB_VI_ENABLED === "true";

    // Check if D&B VI is available (only if enabled)
    if (dnbViEnabled && (typeof window === "undefined" || !window.dnbvid)) {
      if (process.env.NEXT_PUBLIC_DNB_VI_DEBUG === "true") {
        console.log("[ViClickTracker] D&B VI not available");
      }
      // Don't return here - we still want GA4 tracking to work
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Find the closest element with data-vi="download" or data-vi="zip"
      const viElement = target.closest('[data-vi="download"], [data-vi="zip"]');
      
      if (!viElement) return;

      log('Click detected on VI element');

      // Get the anchor element (either the element itself or find the anchor within)
      const anchor = viElement.tagName === 'A' 
        ? viElement as HTMLAnchorElement
        : viElement.querySelector('a') as HTMLAnchorElement;

      // Extract data attributes
      const type = viElement.getAttribute('data-vi') || 'download';
      const label = viElement.getAttribute('data-vi-label') || 
                   (anchor?.innerText?.trim()) || 
                   (viElement as HTMLElement).innerText?.trim() || 
                   'Unknown';
      const href = anchor?.href || 
                  viElement.getAttribute('data-href') || 
                  viElement.getAttribute('href') || 
                  '';
      const doc = viElement.getAttribute('data-vi-doc') || '';
      const pagePath = window.location.pathname;

      log('Click details:', { type, label, href, doc, pagePath });

      // Send to D&B Visitor Intelligence (only if enabled)
      if (dnbViEnabled && window.dnbvid) {
        try {
          log('Sending to D&B VI');
          window.dnbvid.getData(
            process.env.NEXT_PUBLIC_DNB_VI_ACCOUNT!,
            "json",
            "T",
            {
              p1: type,
              p2: label,
              p3: href,
              p4: pagePath,
            },
            () => {
              log('D&B VI data sent successfully');
            }
          );
        } catch (error) {
          log('Error sending to D&B VI:', error);
        }
      }

      // Send to GA4 (TEMPORARY HOTFIX: unconditional)
      try {
        const eventName = type === "zip" ? "vi_zip_click" : "vi_download_click";
        console.log('[ViClickTracker] Firing GA4 event:', eventName, { label, href, doc });
        
        if (typeof (window as any).gtag === "function") {
          (window as any).gtag("event", eventName, {
            item_name: label,
            link_url: href,
            file_name: doc,
            page_location: pagePath
          });
          console.log('[ViClickTracker] GA4 event fired successfully:', eventName);
        } else {
          console.warn('[ViClickTracker] gtag not available');
        }
      } catch (error) {
        console.error('[ViClickTracker] Error sending to GA4:', error);
      }
    };

    // Handle manual test events (debug mode only)
    const handleManualClick = (event: CustomEvent) => {
      if (process.env.NEXT_PUBLIC_DNB_VI_DEBUG !== "true") return;
      
      const { type, label, href, page } = event.detail;
      
      if (process.env.NEXT_PUBLIC_DNB_VI_DEBUG === "true") {
        console.log("[ViClickTracker] Manual test event:", { type, label, href, page });
      }

      // Send to D&B Visitor Intelligence (only if enabled)
      if (dnbViEnabled && window.dnbvid) {
        try {
          window.dnbvid.getData(
            process.env.NEXT_PUBLIC_DNB_VI_ACCOUNT!,
            "json",
            "T",
            {
              p1: type,
              p2: label,
              p3: href,
              p4: page,
            },
            () => {
              if (process.env.NEXT_PUBLIC_DNB_VI_DEBUG === "true") {
                console.log("[ViClickTracker] D&B VI manual test data sent successfully");
              }
            }
          );
        } catch (error) {
          if (process.env.NEXT_PUBLIC_DNB_VI_DEBUG === "true") {
            console.error("[ViClickTracker] Error sending manual test to D&B VI:", error);
          }
        }
      }

      // Send to GA4
      try {
        const eventName = type === "zip" ? "vi_zip_click" : "vi_download_click";
        window.gtag?.("event", eventName, {
          item_name: label,
          link_url: href,
          file_name: href.split('/').pop() || '',
          page_location: page
        });
        
        if (process.env.NEXT_PUBLIC_DNB_VI_DEBUG === "true") {
          console.log("[ViClickTracker] GA4 manual test event sent successfully:", eventName);
        }
      } catch (error) {
        if (process.env.NEXT_PUBLIC_DNB_VI_DEBUG === "true") {
          console.error("[ViClickTracker] Error sending manual test to GA4:", error);
        }
      }
    };

    // Add event listeners - use CAPTURE phase (true) to fire BEFORE navigation
    console.log('[ViClickTracker] Adding click listener with CAPTURE PHASE');
    document.addEventListener('click', handleClick, true);
    window.addEventListener('vi_manual_click', handleManualClick as EventListener);

    console.log('[ViClickTracker] Click tracking initialized successfully (hotfix mode)');

    // Cleanup
    return () => {
      console.log('[ViClickTracker] Cleaning up click tracking');
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('vi_manual_click', handleManualClick as EventListener);
    };
  }, []);

  return null; // This component doesn't render anything
}
