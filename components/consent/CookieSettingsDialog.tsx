"use client"

/**
 * Per-category cookie settings, reachable from the banner and from the footer at any
 * time — including after a decision has been made, which is how consent is withdrawn.
 *
 * Necessary is rendered as a disabled, checked control: always on, never toggleable.
 * Analytics and marketing start from the stored decision, or from OFF when there is no
 * decision yet — never pre-ticked.
 */

import * as React from "react"
import Link from "next/link"
import { useConsent, useConsentOptional } from "./ConsentProvider"
import { consentCopy, PRIVACY_POLICY_PATH } from "./consent-copy"

const PRIMARY =
  "inline-flex h-11 items-center justify-center rounded-lg border border-slate-900 bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
const SECONDARY =
  "inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"

function CategoryRow({
  id,
  label,
  description,
  checked,
  disabled,
  hint,
  onChange,
}: {
  id: string
  label: string
  description: string
  checked: boolean
  disabled?: boolean
  hint?: string
  onChange?: (next: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 py-4 last:border-b-0">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-sm font-semibold text-slate-900">
          {label}
        </label>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">{description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {hint && <span className="text-[11px] uppercase tracking-wide text-slate-500">{hint}</span>}
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="h-5 w-5 cursor-pointer rounded border-slate-400 text-slate-900 focus:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
    </div>
  )
}

export function CookieSettingsDialog() {
  const { settingsOpen, closeSettings, record, save, hydrated } = useConsent()
  const [analytics, setAnalytics] = React.useState(false)
  const [marketing, setMarketing] = React.useState(false)

  // Re-seed the toggles from the stored decision each time the dialog opens, so a
  // cancelled edit never leaks into the next one.
  React.useEffect(() => {
    if (!settingsOpen) return
    setAnalytics(record?.analytics === true)
    setMarketing(record?.marketing === true)
  }, [settingsOpen, record])

  React.useEffect(() => {
    if (!settingsOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSettings()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [settingsOpen, closeSettings])

  if (!hydrated || !settingsOpen) return null

  const c = consentCopy.settings

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => {
        // Closing without saving leaves the stored decision untouched — it is not consent.
        if (e.target === e.currentTarget) closeSettings()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-title"
        data-testid="cookie-settings-dialog"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="cookie-settings-title" className="text-lg font-semibold text-slate-900">
            {c.title}
          </h2>
          <button
            type="button"
            onClick={closeSettings}
            aria-label={c.close}
            data-testid="cookie-settings-close"
            className="rounded p-1 text-slate-400 transition-colors hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-slate-600">{c.intro}</p>

        <div className="mt-4">
          <CategoryRow
            id="consent-necessary"
            label={c.categories.necessary.label}
            description={c.categories.necessary.description}
            checked
            disabled
            hint={c.alwaysOn}
          />
          <CategoryRow
            id="consent-analytics"
            label={c.categories.analytics.label}
            description={c.categories.analytics.description}
            checked={analytics}
            onChange={setAnalytics}
          />
          <CategoryRow
            id="consent-marketing"
            label={c.categories.marketing.label}
            description={c.categories.marketing.description}
            checked={marketing}
            onChange={setMarketing}
          />
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={PRIVACY_POLICY_PATH}
            className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-800"
          >
            {consentCopy.banner.policyLink}
          </Link>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => save({ analytics: false, marketing: false })}
              className={SECONDARY}
              data-testid="cookie-settings-reject-all"
            >
              {c.rejectAll}
            </button>
            <button
              type="button"
              onClick={() => save({ analytics: true, marketing: true })}
              className={SECONDARY}
              data-testid="cookie-settings-accept-all"
            >
              {c.acceptAll}
            </button>
            <button
              type="button"
              onClick={() => save({ analytics, marketing })}
              className={PRIMARY}
              data-testid="cookie-settings-save"
            >
              {c.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Footer / inline trigger that reopens the settings dialog.
 *
 * Uses the optional hook so the footer can also be rendered outside the provider
 * (existing unit tests mount pages directly). Without a provider the control still
 * renders — keeping footer markup identical everywhere — but does nothing.
 */
export function CookieSettingsButton({ className }: { className?: string }) {
  const consent = useConsentOptional()
  return (
    <button
      type="button"
      onClick={() => consent?.openSettings()}
      className={className}
      data-testid="cookie-settings-reopen"
    >
      {consentCopy.settings.title}
    </button>
  )
}
