"use client";
import * as React from "react";
import { ShieldCheck, Users2, Globe2 } from "lucide-react";
import { TrustPill } from "@/components/ui/TrustPill";

export function StatPills() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <TrustPill icon={ShieldCheck} tone="gold">SAP Gold Partner</TrustPill>
      <TrustPill icon={Users2} tone="blue">30+ sertifikovanih SAP konsultanata</TrustPill>
      <TrustPill icon={Globe2} tone="blue">EU reference</TrustPill>
    </div>
  );
}
