"use client";

import { useCallback, useRef } from "react";

/**
 * Client-side reCAPTCHA v3, loaded ON DEMAND.
 *
 * ── Why not a global <Script> in the root shell ─────────────────────────────────
 * Two reasons, and the second is the important one.
 *
 * First: most visitors never touch a form, and loading a Google script on every page for
 * everyone is a cost they get nothing for.
 *
 * Second, and structural: this site's consent architecture guarantees that NO vendor URL
 * appears in prerendered HTML before a decision — `scripts/seo/assert-consent-safety.ts`
 * asserts it mechanically on every build. A global script tag would put a google.com URL in
 * the static output of every page. Injecting it from a form's submit handler keeps it out of
 * the prerendered HTML entirely, so that guarantee is untouched.
 *
 * ── This is NOT analytics, and is not consent-gated ─────────────────────────────
 * reCAPTCHA is a functional security dependency of the form: without it the submission
 * cannot be authorised at all. It is loaded only when someone actually submits, and it is
 * deliberately NOT wired into AnalyticsGate or MarketingGate — putting a security control
 * behind an optional consent toggle would mean "decline cookies" also means "the form no
 * longer works", which is worse for the visitor and worse for the site.
 *
 * The privacy consequence is real and belongs in the Privacy Policy: submitting a form
 * contacts Google. Flagged in the security report rather than decided here.
 *
 * ── Failure is the server's problem, not the visitor's ──────────────────────────
 * If the script cannot load or execute, this returns null and the form submits without a
 * token. The SERVER then decides: reject in production, allow in local development. The
 * client never gets to conclude that it is fine.
 */

/** Global injected by the reCAPTCHA script. */
interface Grecaptcha {
  ready(callback: () => void): void;
  execute(siteKey: string, options: { action: string }): Promise<string>;
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

const SCRIPT_ID = "recaptcha-v3";

/** Load the script once per page, reusing the in-flight promise for concurrent callers. */
function loadScript(siteKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.grecaptcha) return Promise.resolve();

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("recaptcha failed to load")));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("recaptcha failed to load"));
    document.head.appendChild(script);
  });
}

/**
 * Returns `execute(action)`, which yields a token or null.
 *
 * Null means "no token" for every reason — no site key configured, script blocked, execution
 * failed. The caller submits anyway and lets the server decide, because a client that
 * suppresses its own submission on a security failure is a client that can be made to
 * suppress submissions.
 */
export function useRecaptcha() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const loading = useRef<Promise<void> | null>(null);

  const execute = useCallback(
    async (action: string): Promise<string | null> => {
      if (!siteKey) return null;

      try {
        if (!loading.current) loading.current = loadScript(siteKey);
        await loading.current;

        const grecaptcha = window.grecaptcha;
        if (!grecaptcha) return null;

        await new Promise<void>((resolve) => grecaptcha.ready(resolve));
        return await grecaptcha.execute(siteKey, { action });
      } catch {
        // Deliberately silent: a failed token is not something to explain to the visitor,
        // and the server will produce the user-facing outcome either way.
        loading.current = null;
        return null;
      }
    },
    [siteKey]
  );

  return { execute };
}
