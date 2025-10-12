"use client";

import Script from "next/script";

export default function GoogleAnalytics() {
  // Use env var if available, otherwise fallback to hardcoded
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-S0YZ6MZWK1';

  // Debug: log what we got
  if (typeof window !== 'undefined') {
    console.log('[GoogleAnalytics] Component rendering, gaId:', gaId);
  }

  return (
    <>
      <Script
        id="ga4-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          // ========== DEBUG LOGGING START ==========
          const DEBUG_GA = true;
          const log = (...args) => DEBUG_GA && console.log('[GA4 DEBUG]', ...args);
          // ========== DEBUG LOGGING END ==========

          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          
          log('1. Initializing GA4, GA_ID:', '${gaId}');
          
          // Check if user has already given consent
          let hasConsent = false;
          let consentValue = null;
          try {
            consentValue = localStorage.getItem('marketing_consent');
            hasConsent = consentValue === 'true';
            log('2. Consent check:', { consentValue, hasConsent });
          } catch (e) {
            console.warn('[GA4] Could not access localStorage for consent check:', e);
          }

          // ALWAYS set consent to DENIED first (Consent Mode v2 requirement)
          log('3. Setting consent default to DENIED');
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'analytics_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'wait_for_update': 500
          });
          log('4. Consent default set to DENIED');

          // If user has consent, UPDATE consent to GRANTED
          if (hasConsent) {
            log('5. User has consent, updating to GRANTED');
            gtag('consent', 'update', {
              'ad_storage': 'granted',
              'analytics_storage': 'granted',
              'ad_user_data': 'granted',
              'ad_personalization': 'granted'
            });
            log('6. Consent updated to GRANTED');
          }
          
          // Initialize GA4 (AFTER consent mode is set)
          log('7. Calling gtag("js", new Date())');
          gtag('js', new Date());
          
          log('8. Calling gtag("config") with send_page_view: false');
          gtag('config', '${gaId}', {
            send_page_view: false  // We send manual page_views
          });
          
          // If we have consent, send initial page_view manually
          if (hasConsent) {
            log('9. Sending initial page_view event');
            gtag('event', 'page_view', {
              page_location: window.location.href,
              page_path: window.location.pathname + window.location.search,
              page_title: document.title
            });
            log('10. Initial page_view sent');
          } else {
            log('9. Skipping initial page_view (no consent)');
          }
          
          log('11. GA4 initialization complete');
        `}
      </Script>
    </>
  );
}
