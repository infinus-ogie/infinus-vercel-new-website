"use client"

/**
 * Single source of truth for the visitor's cookie decision.
 *
 * Static-rendering contract: the decision is read from document.cookie in an effect
 * AFTER mount. Before that, `hydrated` is false and every consumer behaves as
 * "no consent". Nothing here touches `next/headers`, so every page stays statically
 * prerendered and no vendor URL can appear in the prerendered HTML.
 */

import * as React from "react"
import {
  type ConsentChoices,
  type ConsentRecord,
  NO_CONSENT,
  buildRecord,
  persistConsent,
  readConsent,
  teardownAnalytics,
} from "@/lib/consent"

interface ConsentContextValue {
  /** False until the cookie has been read on the client. Treat as "no consent". */
  hydrated: boolean
  /** The stored decision, or null when the visitor has not decided yet. */
  record: ConsentRecord | null
  /** True only when the visitor has explicitly allowed this category. */
  analytics: boolean
  marketing: boolean
  /** A decision is needed: hydrated, and no valid record stored. */
  needsDecision: boolean
  settingsOpen: boolean
  acceptAll: () => void
  rejectAll: () => void
  save: (choices: ConsentChoices) => void
  openSettings: () => void
  closeSettings: () => void
}

const ConsentContext = React.createContext<ConsentContextValue | null>(null)

export function useConsent(): ConsentContextValue {
  const ctx = React.useContext(ConsentContext)
  if (ctx === null) {
    throw new Error("useConsent must be used inside <ConsentProvider>")
  }
  return ctx
}

/**
 * Optional variant for components that may render outside the provider (e.g. a footer
 * reused in a context without it). Returns null instead of throwing.
 */
export function useConsentOptional(): ConsentContextValue | null {
  return React.useContext(ConsentContext)
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = React.useState(false)
  const [record, setRecord] = React.useState<ConsentRecord | null>(null)
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  React.useEffect(() => {
    setRecord(readConsent())
    setHydrated(true)
  }, [])

  const commit = React.useCallback(
    (choices: ConsentChoices) => {
      const previous = record
      const next = buildRecord(choices, new Date())
      persistConsent(next)
      setRecord(next)
      setSettingsOpen(false)

      // Withdrawal: a script already in the document cannot be unloaded, so disable
      // what we can, clear the cookies we own, then reload to genuinely stop it.
      const analyticsWithdrawn = previous?.analytics === true && next.analytics === false
      const marketingWithdrawn = previous?.marketing === true && next.marketing === false
      if (analyticsWithdrawn) teardownAnalytics()
      if ((analyticsWithdrawn || marketingWithdrawn) && typeof location !== "undefined") {
        location.reload()
      }
    },
    [record]
  )

  const value = React.useMemo<ConsentContextValue>(() => {
    const choices: ConsentChoices = record ?? NO_CONSENT
    return {
      hydrated,
      record,
      analytics: hydrated && choices.analytics === true,
      marketing: hydrated && choices.marketing === true,
      needsDecision: hydrated && record === null,
      settingsOpen,
      acceptAll: () => commit({ analytics: true, marketing: true }),
      rejectAll: () => commit({ analytics: false, marketing: false }),
      save: commit,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false),
    }
  }, [hydrated, record, settingsOpen, commit])

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}
