"use client";

import * as React from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import ProServicesHero from "@/components/sections/growth/ProServicesHero";
import { Section } from "@/components/ui/section";
import { CheckCircle2, MessageCircle, TrendingUp, Wallet, Zap } from "lucide-react";
import { FaqSection } from "@/components/ui/Faq";
import { StatPills } from "@/components/ui/StatPills";
import { IndustriesScroll } from "@/components/ui/IndustriesScroll";
import { Timeline } from "@/components/ui/timeline";
import type {
  GrowthDictionary,
  GrowthRolePage as RoleCopy,
  HomeDictionary,
} from "@/content/dictionary";

/**
 * The CFO and CEO role pages, shared by all FOUR routes:
 *
 *     /grow/cfo            /sr/grow/cfo
 *     /grow/ceo            /sr/grow/ceo
 *
 * ── Why one component for two roles ────────────────────────────────────────────
 * The Serbian CFO and CEO pages were structurally identical — same hero shape, an advantages
 * timeline, three fast-start pills, About, CTA, FAQ — and differed only in copy, in the hero
 * image and in which three lucide icons the pills used. They were nonetheless two page files
 * plus two near-identical `_sections/*Timeline.tsx` components. This is one implementation
 * driven by `copy`, so a change to the shared layout can no longer land on one role and miss
 * the other.
 *
 * ── Anchors are IDENTICAL in both locales, deliberately ─────────────────────────
 * `#prednosti`, `#about` and `#cta` are the historical Serbian anchor IDs and they are shared
 * by the English halves rather than translated. Two reasons: the hero CTA jumps to
 * `#prednosti`, and existing external deep links point at these IDs. Keeping one set of IDs
 * across both locales is what makes that safe, and it falls out of using one component. A
 * translated `#advantages` would have been prettier and would have silently broken the
 * Serbian pages' own inbound links if it ever leaked back.
 *
 * ── Serbian output is unchanged ────────────────────────────────────────────────
 * The markup below is what app/(sr)/grow/{cfo,ceo}/page.tsx rendered at commit 2ca411e, with
 * literals replaced by lookups. The Serbian dictionary holds those literals verbatim,
 * including the collapsed whitespace of the multi-line timeline paragraphs.
 *
 * The ONE intentional exception to that: the trust pills. They used to be `<StatPills />`
 * with no argument, which defaulted to the ENGLISH dictionary, so both Serbian role pages
 * rendered English trust copy. They now take this locale's `trust`, which is the only Serbian
 * visible-text change in the whole migration and an approved one.
 */
export interface GrowRolePageProps {
  copy: RoleCopy;
  shared: GrowthDictionary["shared"];
  /** This locale's trust-pill copy, from the `home` namespace where it already lives. */
  trust: HomeDictionary["trust"];
  /** Serialised JSON-LD for this locale, built by the route file. */
  jsonLd: string;
  /** Script element id, kept per-page as it was. */
  jsonLdId: string;
  /** Hero background, a per-role asset that is identical in both locales. */
  bgImage: string;
  /**
   * Which role this is. A SERIALISABLE key, not the icon array itself.
   *
   * The icons are React components, and a function cannot cross the server-to-client
   * boundary — the route files are server components and this one is a client component, so
   * passing them as props fails the build with "Functions cannot be passed directly to Client
   * Components". The table lives below instead, and the route passes a string.
   */
  role: "cfo" | "ceo";
  /** This page's FAQ anchor id — `faq-cfo` / `faq-ceo`, unchanged from the originals. */
  faqId: string;
}

/**
 * The three fast-start pill icons per role, positional against the dictionary's tuple.
 *
 * Presentation, so not in the dictionary; and inside this client module rather than passed in,
 * so no function crosses the RSC boundary. Matched by POSITION, which is what lets the Serbian
 * and English copy share one icon set.
 */
const QUICK_START_ICONS: Record<"cfo" | "ceo", readonly React.ElementType<{ className?: string }>[]> = {
  cfo: [CheckCircle2, Wallet, TrendingUp],
  ceo: [Zap, TrendingUp, Wallet],
};

export function GrowRolePage({
  copy,
  shared,
  trust,
  jsonLd,
  jsonLdId,
  bgImage,
  role,
  faqId,
}: GrowRolePageProps) {
  const faqItems = [...shared.faqShared, copy.faqExtra];
  const quickStartIcons = QUICK_START_ICONS[role];

  return (
    <>
      <Script id={jsonLdId} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <ProServicesHero
        title={copy.hero.title}
        subtitle=""
        description={copy.hero.description}
        badge={{ label: shared.heroBadgeLabel, text: shared.heroBadgeText }}
        ctas={[{ text: copy.hero.ctaText, href: "#prednosti", primary: true }]}
        bgImage={bgImage}
      />

      <Timeline
        data={copy.timeline.map((item) => ({
          title: item.title,
          content: <p>{item.body}</p>,
        }))}
        heading={copy.timelineHeading}
        description={copy.timelineDescription}
        className="scroll-mt-24"
        id="prednosti"
      />

      <Section surface="surface-1">
        <motion.div
          className="max-w-6xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {shared.quickStartHeading}
            </h3>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {copy.quickStart.map((pill, i) => {
              const Icon = quickStartIcons[i];
              return (
                <div
                  key={i}
                  className="inline-flex items-center gap-3 rounded-full border border-[#0a6ed1]/20 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 backdrop-blur px-6 py-3.5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#0a6ed1]/40 hover:scale-105 cursor-default"
                >
                  <Icon className="h-5 w-5 text-[#0a6ed1] flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-900">{pill.title}</div>
                    <div className="text-xs text-slate-600">{pill.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </Section>

      <Section surface="surface-0" id="about">
        <motion.div
          className="max-w-5xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl text-slate-900">
            {shared.aboutHeading}
          </h2>
          <StatPills trust={trust} />
          <div className="pt-2">
            <IndustriesScroll label={shared.industriesLabel} />
          </div>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            {copy.aboutBody}
          </p>
        </motion.div>
      </Section>

      <Section surface="surface-1" id="cta">
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
            {shared.ctaHeading}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">{shared.ctaBody}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={shared.contactHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F62D9] hover:bg-[#2857c7] active:translate-y-px px-6 py-3 text-white text-base font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2F62D9] min-h-[48px]"
            >
              <MessageCircle className="h-4 w-4 opacity-90" />
              {shared.ctaButton}
            </a>
          </div>
          <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-sm text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-[#0a6ed1]" />
            {shared.ctaNote}
          </p>
        </motion.div>
      </Section>

      {/* FAQ Section */}
      <Section surface="surface-0">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <FaqSection id={faqId} items={faqItems} title={shared.faqHeading} />
        </motion.div>
      </Section>
    </>
  );
}
