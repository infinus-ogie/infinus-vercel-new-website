"use client"

/**
 * Per-category cookie settings, reachable from the banner and from the footer at any
 * time — including after a decision has been made, which is how consent is withdrawn.
 *
 * Necessary is rendered as a disabled, checked control: always on, never toggleable.
 * Analytics and marketing start from the stored decision, or from OFF when there is no
 * decision yet — never pre-ticked.
 *
 * All copy, including the close control's accessible name and the always-on badge, comes
 * from the consent context, which RootShell filled from the root layout that rendered the
 * document. ONE dialog implementation for both languages; no locale conditional in here.
 */

import * as React from "react"
import Link from "next/link"
import { useConsent, useConsentOptional } from "./ConsentProvider"

const PRIMARY =
  "inline-flex h-11 items-center justify-center rounded-lg border border-slate-900 bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
const SECONDARY =
  "inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"

/**
 * One consent category row. PRESENTATION ONLY — the input's id, checked, disabled and
 * onChange wiring is unchanged, so consent behaviour is identical.
 *
 * Layout: a two-column grid so all three rows share one structure and every right-hand
 * control lands on the same vertical alignment line. The right column is exactly one
 * title line tall (h-5 == the 20px line box of the `text-sm` title) and centred within
 * it, which aligns the control with the CATEGORY TITLE rather than with the centre of
 * the title + description block.
 *
 * The checkbox is `appearance-none` with an explicit 20×20 box, border, radius and
 * checked state, because this project has no @tailwindcss/forms plugin — the previous
 * markup fell through to inconsistent browser-native rendering. The tick is a sibling
 * SVG revealed with `peer-checked`, so the real <input> stays the focusable, labelable
 * control and no ARIA changes are needed.
 */
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
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1 border-b border-slate-200 py-4 last:border-b-0">
      <div className="min-w-0">
        <label htmlFor={id} className="block cursor-pointer text-sm font-semibold leading-5 text-slate-900">
          {label}
        </label>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">{description}</p>
      </div>

      {/* Right column: one title-line tall, so the control aligns with the title. */}
      <div className="flex h-5 shrink-0 items-center gap-2.5">
        {hint && (
          <span className="text-[11px] font-medium uppercase leading-none tracking-wide text-slate-500">{hint}</span>
        )}
        {/* -m-2 p-2 enlarges the hit area without enlarging the visible 20×20 box. */}
        <label
          htmlFor={id}
          className={`relative -m-2 inline-flex items-center p-2 ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <input
            id={id}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.checked)}
            className={[
              'peer h-5 w-5 appearance-none rounded-[5px] border-2 border-slate-300 bg-white',
              'transition-colors',
              'checked:border-slate-900 checked:bg-slate-900',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2',
              disabled
                ? 'cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300'
                : 'cursor-pointer hover:border-slate-400 checked:hover:border-slate-700 checked:hover:bg-slate-700',
            ].join(' ')}
          />
          {/* Tick mark: driven purely by the input's checked state. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="pointer-events-none absolute left-2 top-2 h-5 w-5 opacity-0 transition-opacity peer-checked:opacity-100"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5.5 10.5l3 3 6-6.5" />
          </svg>
        </label>
      </div>
    </div>
  )
}

export function CookieSettingsDialog() {
  const { copy, settingsOpen, closeSettings, record, save, hydrated } = useConsent()
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

  const c = copy.settings

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
            href={copy.privacyHref}
            className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-800"
            data-testid="cookie-settings-privacy"
          >
            {copy.banner.policyLink}
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
/**
 * The control that reopens the consent dialog.
 *
 * `label` stays optional. The shared Footer passes its own locale's label (from the footer
 * dictionary), which is every real call site. When it is omitted the label now falls back to
 * the consent context's own `settings.title` — i.e. to THIS document's locale — rather than
 * to a hardcoded English constant, so a caller that forgets the prop no longer produces an
 * English control on a Serbian page.
 *
 * Still uses the OPTIONAL hook, because the footer is also mounted outside the provider by
 * existing unit tests. Without a provider there is no locale to resolve, so the label falls
 * back to the empty string and the control renders inert — markup identical, behaviour none,
 * exactly as before.
 */
export function CookieSettingsButton({ className, label }: { className?: string; label?: string }) {
  const consent = useConsentOptional()
  return (
    <button
      type="button"
      onClick={() => consent?.openSettings()}
      className={className}
      data-testid="cookie-settings-reopen"
    >
      {label ?? consent?.copy.settings.title ?? ""}
    </button>
  )
}
