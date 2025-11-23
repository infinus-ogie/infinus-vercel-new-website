"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Section } from "@/components/ui/section";
import ProServicesHero from "@/components/sections/growth/ProServicesHero";
import { StatPills } from "@/components/ui/StatPills";
import { IndustriesScroll } from "@/components/ui/IndustriesScroll";
import { FaqSection } from "@/components/ui/Faq";
import { MessageCircle, CheckCircle2 } from "lucide-react";

// FAQ items for ProjectPulse
const faqItems = [
  {
    question: "What is ProjectPulse?",
    answer: "ProjectPulse is a SAP Qualified Partner-Packaged Solution by Infinus designed for Professional Services companies. It unifies finance, project and resource management, sales, procurement and core HR, supported by SAP embedded analytics and SAP Business AI."
  },
  {
    question: "How does ProjectPulse help executives and project teams?",
    answer: "Executives gain real-time visibility into profitability, cash and utilization through more than 500 prebuilt KPIs, dashboards and role-based overview pages. Project teams manage scope, milestones, staffing, billing readiness and event-based revenue recognition for fixed-price and T and M engagements."
  },
  {
    question: "What is included in the base scope?",
    answer: "The base scope covers Finance (AR and AP, closing, treasury, profitability, consolidation), Customer Projects and Billing, Sourcing and Procurement, Sales of Services, SuccessFactors Employee Central, Integration Suite, DRC localizations and embedded analytics. Optional extensions include Sales Cloud and additional SuccessFactors modules."
  },
  {
    question: "How long does implementation take and what is the expected outcome?",
    answer: "A prescriptive 3 to 6 month implementation accelerates time to value. Net result: real-time projects, aligned resources and predictable margins on a single intelligent cloud platform."
  }
];

export function ProjectPulseContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden h-[90vh] min-h-[700px]">
        <Image
          src="/Project Pulse/project-pulse2.png"
          alt="ProjectPulse Background"
          fill
          priority
          className="object-cover object-[center_top] -z-10"
        />
        
        {/* Grain overlay */}
        <div className="absolute inset-0 beam grain -z-10" aria-hidden />

        {/* Global gradient overlay */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </div>

        {/* Local scrim behind text (left side) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            WebkitMaskImage: "radial-gradient(120% 90% at 22% 40%, #000 60%, transparent 72%)",
            maskImage: "radial-gradient(120% 90% at 22% 40%, #000 60%, transparent 72%)",
          }}
        >
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-24 pb-16 sm:pt-32">
          <div className="flex flex-col items-start gap-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-sm text-white">
              <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-white/80">SOLUTION</span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span className="text-xs tracking-tight text-white/85">For Professional Services companies</span>
            </div>

            {/* Title */}
            <h1 className="max-w-3xl text-left text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_1px_1px_rgba(0,0,0,.45)]">
              ProjectPulse
            </h1>

            {/* SAP Qualified Partner Logo - small badge below title */}
            <div className="flex items-center">
              <Image
                src="/Project Pulse/SAP_Qualified_PartnerPackageSolution_C.png"
                alt="SAP Qualified Partner-Packaged Solution"
                width={706}
                height={182}
                className="h-10 w-auto md:h-14 lg:h-20 object-contain brightness-0 invert drop-shadow-[0_1px_1px_rgba(0,0,0,.35)]"
                priority
                quality={95}
                sizes="(max-width: 768px) 160px, (max-width: 1024px) 224px, 320px"
              />
            </div>
            
            {/* Description */}
            <p className="max-w-2xl text-left text-base sm:text-lg leading-relaxed text-white drop-shadow-[0_1px_1px_rgba(0,0,0,.35)]">
              Run projects, people, and financials on one intelligent SAP platform.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a 
                href="/api/projectpulse/pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl px-8 py-4 text-base font-medium transition focus:outline-none focus:ring-2 focus:ring-white/40 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 border border-yellow-400 hover:from-yellow-500 hover:to-yellow-600 backdrop-blur shadow-lg font-semibold"
              >
                Open brochure (PDF)
              </a>
              <a 
                href="/projectpulse/video"
                className="rounded-xl px-8 py-4 text-base font-medium transition focus:outline-none focus:ring-2 focus:ring-white/40 text-white border border-white/30 hover:bg-white/10 hover:border-white/50"
              >
                Watch quick overview video
              </a>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
      </section>

      {/* Content Section */}
      <Section surface="surface-1">
        <motion.div
          className="max-w-5xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl text-slate-900">
              Overview
            </h2>
            <div className="w-16 h-1 bg-[#0a6ed1] mx-auto rounded-full" />
          </div>

          {/* Main Content - Dejan's exact text organized with H3 subsections */}
          <div className="mt-10 space-y-10 text-base md:text-lg leading-relaxed text-slate-600">
            {/* 1. What ProjectPulse Is */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                What ProjectPulse Is
              </h3>
              <p>
                <strong>
                  ProjectPulse is a SAP Qualified Partner-Packaged Solution by Infinus designed for Professional Services companies.
                </strong>
              </p>
            </motion.div>

            {/* 2. Unified Financial & Operational Flow */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeOut", delay: 0.05 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                Unified Financial & Operational Flow
              </h3>
              <p>
                It unifies finance, project & resource management, sales, procurement and core HR - augmented by SAP embedded analytics and SAP Business AI - to automate the end-to-end flow from opportunity/quote to invoice and period-end close.
              </p>
            </motion.div>

            {/* 3. Real-Time Visibility for Executives & Delivery Teams */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                Real-Time Visibility for Executives & Delivery Teams
              </h3>
              <p>
                Executives gain real-time visibility into profitability, cash, and utilization through 500+ prebuilt KPIs, dashboards, and role-based overview pages, while project teams manage scope, milestones, staffing, billing readiness, and event-based revenue recognition for both fixed-price and T&M engagements.
              </p>
            </motion.div>

            {/* 4. Base Scope Coverage */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeOut", delay: 0.15 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                Base Scope Coverage
              </h3>
              <p>
                The base scope covers Finance (AR/AP, closing, treasury, profitability, consolidation), Customer Projects & Billing, Sourcing & Procurement, Sales of Services, SuccessFactors Employee Central, Integration Suite, DRC localizations, and embedded analytics. A prescriptive 3–6-month implementation accelerates time-to-value, with optional extensions (e.g., Sales Cloud, additional SuccessFactors modules) for scale-up.
              </p>
            </motion.div>

            {/* 5. The Result */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                The Result
              </h3>
              <p className="font-semibold text-slate-900">
                Net result: real-time projects, aligned resources, and predictable margins on a single intelligent cloud platform.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </Section>

      {/* About Infinus Section */}
      <Section surface="surface-0" id="about">
        <motion.div
          className="max-w-5xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl text-slate-900">
            About Infinus
          </h2>

          {/* Trust / metrics */}
          <StatPills />

          {/* Industries scroll */}
          <div className="pt-2">
            <IndustriesScroll />
          </div>

          {/* Description */}
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Infinus d.o.o. is a SAP Gold Partner with more than 30 certified SAP consultants and numerous regional and international references. Our focus is to help Professional Services companies gain the structure, control, and agility needed for the next phase of growth through SAP Cloud ERP.
          </p>
        </motion.div>
      </Section>

      {/* CTA Section */}
      <Section surface="surface-1" id="cta">
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
            Ready to talk?
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Schedule a brief call and see how ProjectPulse can support your Professional Services operations.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F62D9] hover:bg-[#2857c7] active:translate-y-px px-6 py-3 text-white text-base font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2F62D9] min-h-[48px]"
            >
              <MessageCircle className="h-4 w-4 opacity-90" />
              Send inquiry
            </a>
          </div>

          <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-sm text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-[#0a6ed1]" />
            We respond within one business day
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
          <FaqSection id="faq-projectpulse" title="Frequently Asked Questions" items={faqItems} />
        </motion.div>
      </Section>
    </>
  );
}
