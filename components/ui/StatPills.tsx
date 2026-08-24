"use client";
import * as React from "react";
import { ShieldCheck, Users2, Globe2 } from "lucide-react";
import { TrustPill } from "@/components/ui/TrustPill";
import { SapGoldPartnerBadge } from "@/components/ui/SapGoldPartnerBadge";
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
 *
 * ── `certificationMark` is OPT-IN, and that is deliberate ──────────────────────
 * The homepage hero needs the official SAP Gold Partner artwork INSIDE the first pill, so the
 * certification is one object instead of a floating logo above a pill that repeats it in
 * words. Every other caller must keep the shield icon.
 *
 * This component is rendered by roughly fifteen pages. Making the badge unconditional would
 * put a certification mark into every trust row on the site to fix one hero — the same
 * over-reach the badge component's own notes warn about. So it defaults to false and exactly
 * one call site turns it on.
 */
export function StatPills({
  variant = "light",
  trust,
  certificationMark = false,
}: {
  variant?: "light" | "dark";
  trust: HomeDictionary["trust"];
  /** Homepage hero only: render the official badge in place of the first pill's icon. */
  certificationMark?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
      <TrustPill
        icon={ShieldCheck}
        tone="gold"
        variant={variant}
        mark={
          certificationMark ? (
            // DECORATIVE: the pill's own text names this certification, so announcing the
            // image too would read it out twice in a row. Sized for legibility rather than
            // squeezed into the 24px icon disc — a certification nobody can make out is not
            // a trust signal.
            <SapGoldPartnerBadge alt="" className="h-8 w-auto sm:h-9 md:h-10" />
          ) : undefined
        }
      >
        {trust.goldPartner}
      </TrustPill>
      <TrustPill icon={Users2} tone="blue" variant={variant}>{trust.consultants}</TrustPill>
      <TrustPill icon={Globe2} tone="blue" variant={variant}>{trust.customers}</TrustPill>
    </div>
  );
}
