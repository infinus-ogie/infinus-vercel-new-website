"use client";

import { motion } from "framer-motion";
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
    answer: "A prescriptive 4 to 6 month implementation accelerates time to value. Net result: real-time projects, aligned resources and predictable margins on a single intelligent cloud platform."
  }
];

export function ProjectPulseContent() {
  return (
    <>
      {/* Hero Section */}
      <ProServicesHero
        title="ProjectPulse"
        subtitle=""
        description="ProjectPulse is a SAP Qualified Partner-Packaged Solution by Infinus designed for Professional Services companies."
        badge={{ label: "SOLUTION", text: "SAP Qualified Partner-Packaged Solution" }}
        ctas={[
          { text: "Open brochure (PDF)", href: "/api/projectpulse/pdf", primary: true },
          { text: "Watch 2-minute overview video", href: "https://www.youtube.com/watch?v=TODO", primary: false }
        ]}
        bgImage="/Project Pulse/project-pulse2.png"
      />

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
                The base scope covers Finance (AR/AP, closing, treasury, profitability, consolidation), Customer Projects & Billing, Sourcing & Procurement, Sales of Services, SuccessFactors Employee Central, Integration Suite, DRC localizations, and embedded analytics. A prescriptive 4–6-month implementation accelerates time-to-value, with optional extensions (e.g., Sales Cloud, additional SuccessFactors modules) for scale-up.
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
