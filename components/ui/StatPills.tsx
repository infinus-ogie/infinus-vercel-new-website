"use client";
import * as React from "react";
import { ShieldCheck, Users2, Globe2 } from "lucide-react";
import { TrustPill } from "@/components/ui/TrustPill";
import type { HomeDictionary } from "@/content/dictionary";

/**
 * The three trust pills: SAP Gold Partner, the consultant count, the customer count.
 *
 * ── `trust` is REQUIRED, and that is the fix ────────────────────────────────────
 * It used to be optional, defaulting to `getDictionary("en").home.trust`. The default was
 * added so that call sites which had not been localised yet kept rendering what they always
 * had — a reasonable-looking migration aid that turned into a silent bug: four Serbian pages
 * called `<StatPills />` with no argument and shipped ENGLISH trust copy inside Serbian
 * documents. Nothing failed, nothing warned; the page simply said "30+ experienced
 * consultants" in the middle of Serbian prose.
 *
 * A default that produces WRONG output is worse than a compile error, so there is no default
 * now. Every call site has to name the locale's dictionary, and a new one cannot forget:
 * omitting the prop does not build.
 *
 * The icons are presentation and stay here — they carry no language.
 */
export function StatPills({
  variant = "light",
  trust,
}: {
  variant?: "light" | "dark";
  trust: HomeDictionary["trust"];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
      <TrustPill icon={ShieldCheck} tone="gold" variant={variant}>{trust.goldPartner}</TrustPill>
      <TrustPill icon={Users2} tone="blue" variant={variant}>{trust.consultants}</TrustPill>
      <TrustPill icon={Globe2} tone="blue" variant={variant}>{trust.customers}</TrustPill>
    </div>
  );
}
