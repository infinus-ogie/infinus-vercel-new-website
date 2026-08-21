"use client"

/**
 * Cookie banner shown only to a visitor with no valid stored decision.
 *
 * Equal prominence is a hard requirement: Accept and Reject are rendered from the SAME
 * class string, so they are identical in size, weight, contrast and position, and they
 * sit side by side in the same container. Neither is a "primary" button and neither is
 * a text link. Any future restyling must keep BUTTON_CLASS shared between them — the
 * unit tests assert the two buttons carry identical classes.
 *
 * The banner never treats scrolling, navigation, closing or inactivity as consent:
 * there is no dismiss affordance at all, only the three explicit actions. Following the
 * Privacy Policy link is navigation, so it is not consent either.
 *
 * ── One banner, both languages ──────────────────────────────────────────────────
 * This used to render the English copy AND a Serbian paragraph beneath it, on every page in
 * both roots — the pre-locale compromise. It now renders ONE language: the copy comes from
 * the context, which RootShell filled from the root layout that rendered the document. So
 * there is still exactly one implementation, and no `locale === "sr"` conditional anywhere
 * in it.
 *
 * The Serbian paragraph is gone from English pages and vice versa, which is the point: no
 * consent string from the other language appears on either.
 */

import * as React from "react"
import Link from "next/link"
import { useConsent } from "./ConsentProvider"

/** Shared by Accept and Reject. Do not give either its own visual weight. */
const BUTTON_CLASS =
  "inline-flex h-11 w-full items-center justify-center rounded-lg border border-slate-900 bg-slate-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 sm:w-auto sm:min-w-[8.5rem]"

const SETTINGS_CLASS =
  "inline-flex h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 sm:w-auto"

export function CookieBanner() {
  const { copy, needsDecision, acceptAll, rejectAll, openSettings } = useConsent()

  if (!needsDecision) return null

  const c = copy.banner

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      data-testid="cookie-banner"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 id="cookie-banner-title" className="text-sm font-semibold text-slate-900">
            {c.title}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            {c.body}{" "}
            <Link
              href={copy.privacyHref}
              className="underline underline-offset-2 hover:text-slate-900"
              data-testid="cookie-banner-privacy"
            >
              {c.policyLink}
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:shrink-0">
          {/* Accept and Reject: same element, same classes, adjacent. */}
          <button type="button" onClick={acceptAll} className={BUTTON_CLASS} data-testid="cookie-accept">
            {c.accept}
          </button>
          <button type="button" onClick={rejectAll} className={BUTTON_CLASS} data-testid="cookie-reject">
            {c.reject}
          </button>
          <button type="button" onClick={openSettings} className={SETTINGS_CLASS} data-testid="cookie-settings-open">
            {c.settings}
          </button>
        </div>
      </div>
    </div>
  )
}
