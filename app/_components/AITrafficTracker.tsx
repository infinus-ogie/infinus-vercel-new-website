"use client";

import { useEffect } from "react";

/**
 * AI Traffic Tracker
 * 
 * Detects traffic from AI search engines and sends custom events to GA4.
 * 
 * AI Search Engines:
 * - ChatGPT (chat.openai.com)
 * - Perplexity (www.perplexity.ai)
 * - Google Gemini (gemini.google.com)
 * - Claude (claude.ai)
 * - Microsoft Copilot (copilot.microsoft.com)
 * 
 * This component:
 * 1. Checks document.referrer for AI domains
 * 2. Checks URL parameters for AI source indicators
 * 3. Sends custom 'ai_traffic' event to GA4 with source details
 */
export default function AITrafficTracker() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof (window as any).gtag !== "function") {
      return;
    }

    const detectAITraffic = () => {
      const referrer = document.referrer || "";
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get("utm_source");
      const utmMedium = urlParams.get("utm_medium");

      // AI Search Engine domains
      const aiDomains = [
        { domain: "chat.openai.com", name: "ChatGPT" },
        { domain: "www.perplexity.ai", name: "Perplexity" },
        { domain: "perplexity.ai", name: "Perplexity" },
        { domain: "gemini.google.com", name: "Google Gemini" },
        { domain: "claude.ai", name: "Claude" },
        { domain: "copilot.microsoft.com", name: "Microsoft Copilot" },
        { domain: "www.bing.com", name: "Bing Chat" },
      ];

      // Check referrer
      let aiSource: string | null = null;
      let aiDomain: string | null = null;

      for (const ai of aiDomains) {
        if (referrer.includes(ai.domain)) {
          aiSource = ai.name;
          aiDomain = ai.domain;
          break;
        }
      }

      // Check UTM parameters
      if (!aiSource && (utmSource?.toLowerCase().includes("ai") || utmMedium === "ai")) {
        aiSource = utmSource || "AI Search";
        aiDomain = "unknown";
      }

      // If AI traffic detected, send custom event
      if (aiSource) {
        (window as any).gtag("event", "ai_traffic", {
          ai_source: aiSource,
          ai_domain: aiDomain,
          referrer: referrer || "(direct)",
          page_location: window.location.href,
          page_path: window.location.pathname,
        });

        console.log("[AI Traffic Tracker] Detected AI traffic:", {
          source: aiSource,
          domain: aiDomain,
          referrer: referrer || "(direct)",
        });
      }

      // Also set custom dimension for all traffic (even if not AI)
      // This helps identify "unknown" or "direct" traffic that might be from AI
      const trafficSource = aiSource || "organic";
      (window as any).gtag("set", {
        custom_map: {
          dimension1: trafficSource, // AI Source (custom dimension 1)
        },
      });
    };

    // Run detection after a short delay to ensure GA4 is loaded
    const timeoutId = setTimeout(detectAITraffic, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}

