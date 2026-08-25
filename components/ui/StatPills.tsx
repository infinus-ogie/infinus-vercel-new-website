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
 *
 * ── `goldPartner` is OPT-OUT, and only the homepage opts out ────────────────────
 * The certification used to render as the first pill, with the official artwork tucked inside
 * it on the homepage. Putting a piece of brand artwork into the same pill system as two
 * numeric proof points never sat right: one of the three is a credential and the other two
 * are counts, and the pill flattened that difference.
 *
 * On the homepage the credential is now its own mark under the Infinus logo (see
 * shape-landing-hero.tsx), so this row is two matched pills that genuinely belong together.
 *
 * Everywhere ELSE the pill stays. Roughly five other pages render this row and none of them
 * shows the SAP artwork anywhere near it, so dropping the pill there would quietly remove a
 * credential to solve a homepage-only composition problem. Hence opt-out rather than removal,
 * with exactly one caller opting out.
 */
export function StatPills({
  variant = "light",
  trust,
  goldPartner = true,
}: {
  variant?: "light" | "dark";
  trust: HomeDictionary["trust"];
  /** Homepage hero only: it shows the certification as its own mark instead. */
  goldPartner?: boolean;
}) {
  return (
    /* Column count follows the pill count, so two pills centre as a balanced pair rather than
       sitting in the left two thirds of a three-column grid. */
    <div
      className={`mx-auto grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 ${
        goldPartner ? "lg:grid-cols-3" : "lg:max-w-2xl"
      }`}
    >
      {goldPartner ? (
        <TrustPill icon={ShieldCheck} tone="gold" variant={variant}>
          {trust.goldPartner}
        </TrustPill>
      ) : null}
      <TrustPill icon={Users2} tone="blue" variant={variant}>{trust.consultants}</TrustPill>
      <TrustPill icon={Globe2} tone="blue" variant={variant}>{trust.customers}</TrustPill>
    </div>
  );
}
