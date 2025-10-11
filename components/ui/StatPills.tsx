"use client";
import * as React from "react";
import { ShieldCheck, Users2, Globe2 } from "lucide-react";
import { TrustPill } from "@/components/ui/TrustPill";

export function StatPills({ variant = "light" }: { variant?: "light" | "dark" }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
      <TrustPill icon={ShieldCheck} tone="gold" variant={variant}>SAP Gold Partner</TrustPill>
      <TrustPill icon={Users2} tone="blue" variant={variant}>30+ experienced consultants</TrustPill>
      <TrustPill icon={Globe2} tone="blue" variant={variant}>20+ satisfied customers</TrustPill>
    </div>
  );
}
