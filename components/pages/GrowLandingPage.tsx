"use client";

import * as React from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Briefcase,
  Crown,
  BarChart3,
  Shield,
  Brain,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { FaqSection } from "@/components/ui/Faq";
import { ResourceList } from "@/components/ui/ResourceList";
import ProServicesHero from "@/components/sections/growth/ProServicesHero";
import { StatCard } from "@/components/ui/StatCard";
import { FeatureTile } from "@/components/ui/FeatureTile";
import { StatPills } from "@/components/ui/StatPills";
import { IndustriesScroll } from "@/components/ui/IndustriesScroll";
import type { GrowthDictionary, HomeDictionary } from "@/content/dictionary";

/**
 * The GROW landing page, shared by /grow (English) and /sr/grow (Serbian).
 *
 * The markup is what app/(sr)/grow/page.tsx rendered at commit 2ca411e, with literals
 * replaced by lookups on `copy` and `shared`.
 *
 * ── Anchors identical in both locales ───────────────────────────────────────────
 * `#zasto`, `#benefits`, `#downloads`, `#cta-cards`, `#about`, `#cta` and `#faq-grow` are the
 * historical Serbian IDs and both halves use them. `#zasto` is Serbian for "why", so the
 * English page carries a Serbian-named anchor — deliberately. The Serbian footer links to
 * `/grow#downloads`, external material links at these IDs, and analytics reference them; one
 * shared set is what keeps all of that working, and it is what using one component gives us.
 * Renaming them on the English half would have been cosmetic and would have created two sets
 * of IDs to keep in step.
 *
 * ── The two role cards get their URLs from the ROUTE MAP ─────────────────────────
 * Not by string manipulation, and not from the dictionary. `cfoHref`/`ceoHref` are passed in
 * by the route file, which resolves them from content/routes.ts — so the English page links to
 * the English role pages and the Serbian page to the Serbian ones, and neither can drift into
 * the other language.
 *
 * ── The trust pills come from the LOCALE's dictionary ───────────────────────────
 * `<StatPills trust={trust} />`, never `<StatPills />`. The bare call used to work, because
 * the component defaulted to English — which is exactly how this page shipped "30+
 * experienced consultants" inside Serbian copy. The prop is required now, so the locale has
 * to be named at the call site and the route file is the thing that knows it.
 */
export interface GrowLandingPageProps {
  copy: GrowthDictionary["grow"];
  shared: GrowthDictionary["shared"];
  /** This locale's trust-pill copy, from the `home` namespace where it already lives. */
  trust: HomeDictionary["trust"];
  jsonLd: string;
  /** Destinations for the two role cards, resolved from the route map by the route file. */
  cfoHref: string;
  ceoHref: string;
}

/**
 * Icons, positional against the dictionary's fixed-length tuples.
 *
 * They are presentation, not copy, so they stay in the component rather than in a translated
 * dictionary — and matching by POSITION rather than by a label keyed on English text is what
 * lets the Serbian and English copy share them.
 */
const GROW_STAT_ICONS: readonly React.ElementType<{ className?: string }>[] = [
  BarChart3, // "2 in 3" — CFOs whose systems cannot scale
  Shield, // "70%+" — standards, security and compliance
  Brain, // "81%" — AI and Cloud ERP
];

const GROW_VALUE_ICONS: readonly React.ElementType<{ className?: string }>[] = [
  Zap, // Simplify the work
  TrendingUp, // Accelerate growth
  Shield, // Secure success
  Brain, // Prepare for what comes next
];

export function GrowLandingPage({ copy, shared, trust, jsonLd, cfoHref, ceoHref }: GrowLandingPageProps) {
  const faqItems = [...shared.faqShared, copy.faqExtra];
  const roleHrefs = [cfoHref, ceoHref];
  const roleIcons = [Briefcase, Crown];

  return (
    <>
      <Script
        id="grow-page-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      {/* Hero Section */}
      <ProServicesHero
        title={copy.hero.title}
        subtitle={copy.hero.subtitle}
        description={copy.hero.description}
        badge={{ label: shared.heroBadgeLabel, text: shared.heroBadgeText }}
        ctas={[{ text: copy.hero.ctaText, href: copy.zipUrl, primary: true }]}
      />

      {/* Why now */}
      <Section surface="surface-1" id="zasto">
        <motion.div
          className="max-w-5xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl text-slate-900">
              {shared.whyHeading}
            </h2>
            <div className="w-16 h-1 bg-[#0a6ed1] mx-auto rounded-full" />
          </div>

          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto text-center">
            {copy.whyBody}
          </p>

          <motion.div
            className="mt-8 rounded-2xl bg-white/60 backdrop-blur border border-slate-200/60 p-4 md:p-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="grid gap-4 md:grid-cols-3 md:divide-x md:divide-slate-200/70 md:[&>article]:px-6">
              {copy.stats.map((stat, i) => (
                <motion.article
                  key={i}
                  className="p-4 md:py-4"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.16, delay: 0.02 * (i + 1), ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <StatCard
                    icon={GROW_STAT_ICONS[i]}
                    valueParts={{ end: Number(stat.value), suffix: stat.suffix }}
                    label={stat.label}
                    underline
                  />
                </motion.article>
              ))}
            </div>
          </motion.div>

          <p className="mt-3 text-xs text-slate-500/80 text-center">
            {copy.sourceLabel}{" "}
            <a
              href={copy.sourceHref}
              className="underline decoration-slate-300 hover:decoration-slate-500"
            >
              {copy.sourceText}
            </a>
          </p>
        </motion.div>
      </Section>

      {/* How SAP Cloud ERP helps */}
      <Section surface="surface-0" id="benefits">
        <motion.div
          className="space-y-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl text-slate-900">
              {copy.benefitsHeadingLine1}<br />
              {copy.benefitsHeadingLine2}
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[1fr]">
            {copy.valueCards.map((card, index) => (
              <FeatureTile
                key={index}
                icon={GROW_VALUE_ICONS[index]}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Downloads */}
      <Section surface="surface-1" id="downloads">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <ResourceList
            zipUrl={copy.zipUrl}
            zipLabel={shared.resourceList.zipLabel}
            title={shared.resourceList.defaultTitle}
            description={shared.resourceList.defaultDescription}
            items={copy.downloads.map((d) => ({
              id: d.id,
              title: d.title,
              description: d.description,
              label: d.label,
              url: d.url,
              image: d.url,
              analyticsId: d.analyticsId,
            }))}
          />
        </motion.div>
      </Section>

      {/* Role cards */}
      <Section surface="surface-1" id="cta-cards">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="rounded-3xl bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50/50 border border-blue-100/60 p-8 md:p-12 shadow-sm">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl text-slate-900">
                {copy.focusHeading}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mt-4">{copy.focusBody}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {copy.focusCards.map((card, i) => {
                const Icon = roleIcons[i];
                return (
                  <motion.div
                    key={i}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: 0.1 * (i + 1), ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#0a6ed1]/10 text-[#0a6ed1]">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">{card.title}</h3>
                      </div>
                      <p className="text-slate-600 mb-6 leading-relaxed">{card.body}</p>
                      <a
                        href={roleHrefs[i]}
                        aria-label={card.ariaLabel}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#2F62D9] hover:bg-[#2857c7] active:translate-y-px px-6 py-3 text-white text-base font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2F62D9] min-h-[48px] transition-all duration-200"
                      >
                        {card.cta}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </Section>

      {/* About Infinus */}
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

      {/* CTA */}
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
              onClick={() => window.gtag?.("event", "cta_click", { cta: "send_inquiry", page: "grow" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F62D9] hover:bg-[#2857c7] active:translate-y-px
                         px-6 py-3 text-white text-base font-semibold shadow-sm focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2F62D9] min-h-[48px]"
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

      {/* FAQ */}
      <Section surface="surface-0">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <FaqSection id="faq-grow" items={faqItems} title={shared.faqHeading} />
        </motion.div>
      </Section>
    </>
  );
}
