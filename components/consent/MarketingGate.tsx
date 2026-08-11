"use client"

/**
 * STRICT NO-LOAD marketing gate.
 *
 * Returns null until the visitor has explicitly allowed marketing. D&B Visitor
 * Intelligence performs company/visitor identification against a third party, which is
 * non-essential processing, so it is treated as marketing rather than analytics.
 *
 * ── Deliberately NOT repaired here ──────────────────────────────────────────────
 * The audit found two independent defects that currently make D&B inert:
 *   1. components/analytics/DnbVisitorPixel.tsx injects an inline script containing
 *      `(window as any).dnb_vi_rerun = …` — TypeScript syntax inside a raw JS string,
 *      which is a SyntaxError, so the whole inline script never executes.
 *   2. That component gates on NEXT_PUBLIC_ENABLE_DNB_VI, while the production env
 *      uses NEXT_PUBLIC_DNB_VI_ENABLED (the name the unused VendorScripts.tsx read).
 *
 * Neither is fixed in this phase, on purpose. Fixing them would ACTIVATE unconsented
 * third-party identification tracking as a side effect of a privacy change. The only
 * job here is to guarantee it cannot load without consent; restoring its functionality
 * is a separate, explicit decision that is now safe to make because this gate exists.
 *
 * Consequence to be honest about: after marketing consent, D&B most likely still does
 * nothing. That is the pre-existing state, not something this gate introduced.
 */

import { useConsent } from "./ConsentProvider"
import DnbVisitorPixel from "@/components/analytics/DnbVisitorPixel"

export function MarketingGate() {
  const { marketing } = useConsent()

  if (!marketing) return null

  return <DnbVisitorPixel />
}
