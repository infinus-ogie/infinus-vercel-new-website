"use client";
import * as React from "react";
import { ShieldCheck, Users2, Globe2 } from "lucide-react";
import { TrustPill } from "@/components/ui/TrustPill";
import { getDictionary } from "@/content/dictionary";
import type { HomeDictionary } from "@/content/dictionary";

/**
 * The three trust pills, shown in the hero and again beside the job-application form.
 *
 * `trust` defaults to the English dictionary so existing call sites render exactly what
 * they did before; the Serbian homepage passes its own. The icons are presentation and stay
 * here.
 */
export function StatPills({
  variant = "light",
  trust = getDictionary("en").home.trust,
}: {
  variant?: "light" | "dark";
  trust?: HomeDictionary["trust"];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
      <TrustPill icon={ShieldCheck} tone="gold" variant={variant}>{trust.goldPartner}</TrustPill>
      <TrustPill icon={Users2} tone="blue" variant={variant}>{trust.consultants}</TrustPill>
      <TrustPill icon={Globe2} tone="blue" variant={variant}>{trust.customers}</TrustPill>
    </div>
  );
}
