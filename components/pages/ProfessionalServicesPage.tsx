"use client";

import * as React from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import {
  MessageCircle,
  CheckCircle2,
  BarChart3,
  Brain,
  Lightbulb,
  Cloud,
  Users,
  Rocket,
  Target,
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
 * The Professional Services page, shared by /professional-services (English) and
 * /sr/professional-services (Serbian).
 *
 * The markup is what app/(sr)/professional-services/page.tsx rendered at commit 2ca411e, with
 * literals replaced by lookups. That file is now app/(sr)/sr/professional-services/page.tsx —
 * same content, new URL.
 *
 * ── How it differs from the GROW landing page ───────────────────────────────────
 * Same skeleton, three real differences: FOUR statistics instead of three, its own downloads
 * heading and description instead of the shared defaults, and no role cards — there is no
 * CFO/CEO split for this audience. It also has three FAQ entries of its own rather than the
 * two shared GROW ones plus a variant.
 *
 * Kept as its own component rather than adding three conditionals to the GROW page: the two
 * pages are separately owned marketing assets, and a shared component with a `variant` flag
 * would make every future change to either one a change to both.
 *
 * ── Anchors identical in both locales ───────────────────────────────────────────
 * `#zasto`, `#benefits`, `#downloads`, `#about`, `#cta` and `#faq-pro`, unchanged from the
 * Serbian original and shared by the English half. The Serbian footer links
 * `/professional-services#downloads`.
 *
 * ── The ProjectPulse overlap ────────────────────────────────────────────────────
 * This page and /projectpulse both address professional services firms, and their English
 * copy is deliberately NOT shared. Nothing here was taken from the ProjectPulse namespace:
 * this page's Serbian original is its only source, and it sells SAP Cloud ERP for the
 * industry rather than the ProjectPulse packaged solution.
 *
 * `<StatPills trust={trust} />` takes this locale's copy. The bare call it replaces defaulted
 * to English, which is how this page rendered English trust pills in Serbian.
 */
export interface ProfessionalServicesPageProps {
  copy: GrowthDictionary["professionalServices"];
  shared: GrowthDictionary["shared"];
  /** This locale's trust-pill copy, from the `home` namespace where it already lives. */
  trust: HomeDictionary["trust"];
  jsonLd: string;
}

/**
 * Icons, positional against the dictionary's fixed-length tuples.
 *
 * They are presentation, not copy, so they stay in the component rather than in a translated
 * dictionary — and matching by POSITION rather than by a label keyed on English text is what
 * lets the Serbian and English copy share them.
 */
const PS_STAT_ICONS: readonly React.ElementType<{ className?: string }>[] = [
  BarChart3, // 85% — revenue growth vs profitability growth
  Lightbulb, // 40% — innovation and new business models
  Cloud, // 78% — already using Cloud ERP
  Brain, // 53% — planning to adopt AI
];

const PS_VALUE_ICONS: readonly React.ElementType<{ className?: string }>[] = [
  Users, // Connect people and processes
  Rocket, // Accelerate service delivery
  Lightbulb, // Open new revenue streams
  Target, // Build a competitive advantage
];

export function ProfessionalServicesPage({ copy, shared, trust, jsonLd }: ProfessionalServicesPageProps) {
  // Its own three FAQ entries — this page shares none with the GROW pages. Spread into a
  // mutable array because FaqSection takes FAQ[], and the dictionary is readonly by design.
  const faqItems = [...copy.faqs];

  return (
    <>
      <Script
        id="professional-services-page-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      {/* Hero Section */}
      <ProServicesHero
        title={copy.hero.title}
        subtitle=""
        description={copy.hero.description}
        badge={{ label: shared.heroBadgeLabel, text: shared.heroBadgeText }}
        ctas={[{ text: copy.hero.ctaText, href: copy.zipUrl, primary: true }]}
        bgImage="/growth-professional-services-materials/professional-services-cover.jpg"
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:divide-x md:divide-slate-200/70 md:[&>article]:px-6">
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
                    icon={PS_STAT_ICONS[i]}
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
                icon={PS_VALUE_ICONS[index]}
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
            title={copy.downloadsTitle}
            description={copy.downloadsDescription}
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
              onClick={() => window.gtag?.("event", "cta_click", { cta: "send_inquiry", page: "professional-services" })}
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
          <FaqSection id="faq-pro" items={faqItems} title={shared.faqHeading} />
        </motion.div>
      </Section>
    </>
  );
}
