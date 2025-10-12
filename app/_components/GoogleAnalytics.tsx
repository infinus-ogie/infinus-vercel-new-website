"use client";

import Script from "next/script";

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-S0YZ6MZWK1';

  // Always load GA4 if we have a GA ID
  if (!gaId) return null;

  return (
    <>
      <Script
        id="ga4-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          
          // Check if user has already given consent first
          let hasConsent = false;
          try {
            const consent = localStorage.getItem('marketing_consent');
            hasConsent = consent === 'true';
            console.log('[GA4] Consent check:', { consent, hasConsent, gaId: '${gaId}' });
          } catch (e) {
            console.warn('Could not access localStorage for consent check:', e);
          }

          // Set consent MODE FIRST (before gtag init)
          if (hasConsent) {
            // Set consent to GRANTED immediately
            gtag('consent', 'default', {
              'ad_storage': 'granted',
              'analytics_storage': 'granted',
              'ad_user_data': 'granted',
              'ad_personalization': 'granted'
            });
            console.log('[GA4] Consent set to GRANTED');
          } else {
            // Set default consent to DENIED (Consent Mode v2)
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
            console.log('[GA4] Consent set to DENIED');
          }
          
          // Initialize GA4 (AFTER consent mode is set)
          gtag('js', new Date());
          gtag('config', '${gaId}');
          
          console.log('[GA4] Initialized');
        `}
      </Script>
    </>
  );
}
