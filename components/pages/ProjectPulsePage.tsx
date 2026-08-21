"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { StatPills } from "@/components/ui/StatPills";
import { IndustriesScroll } from "@/components/ui/IndustriesScroll";
import { YieldCard } from "@/components/ui/yield-card";
import type { ProjectPulseDictionary } from "@/content/dictionary";
import {
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  Code,
  Building2,
  Palette,
  Scale,
  Users,
  Settings,
  ClipboardCheck,
  Receipt,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Crown,
  Calculator,
  Target,
  Clock,
  BadgeCheck,
  BarChart3,
} from "lucide-react";

/**
 * The ProjectPulse page body, shared by /projectpulse and /sr/projectpulse.
 *
 * ONE implementation, two locales. The route files differ only in which dictionary they
 * pass, which metadata they export and which JSON-LD they build.
 *
 * The markup and section order are exactly what
 * app/(en)/(site)/projectpulse/_components/ProjectPulseContent.tsx rendered at commit
 * f143256, with literal strings and `projectPulseConfig` lookups replaced by lookups on
 * `content`. The English dictionary holds those literals verbatim, so /projectpulse is
 * unchanged apart from the language switcher the shared Navbar now renders.
 *
 * ── Why the icons are POSITIONAL ────────────────────────────────────────────────
 * The old file mapped industry icons from a Record keyed on the ENGLISH industry name.
 * Reused as-is, every Serbian label would have missed the map and silently fallen back to
 * the generic Briefcase. The list is a fixed-length tuple in both locales, so the icons are
 * matched by position instead — the same fix applied to the two title-only card grids.
 *
 * ── The four commented-out blocks ───────────────────────────────────────────────
 * "How it works", "Outcomes by role", "Implementation" and "About Infinus" were already
 * commented out before this phase, along with the ImplementationStepper component and the
 * `activeRole` state that serve them. They are kept, rewritten against `content`, so
 * re-enabling a section stays a one-line change rather than a new translation phase — and
 * so this phase removes nothing that was not already gone.
 */

// SectionHeader helper component for consistent headers
function SectionHeader({
  kicker,
  title,
  subtitle,
  center = true,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-sap mb-2">
        {kicker}
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Industry icons, positional — see the note above. Order matches `content.industries`.
const INDUSTRY_ICONS = [
  Briefcase, // Business Consulting & Advisory
  Code, // IT Services
  Code, // Software Development
  Users, // Outsourcing & Managed Services
  Palette, // Creative & Digital Services
  Building2, // Architecture & Design Services
  Settings, // Engineering Services
  Scale, // Legal Services
] as const;

/** Icons for the three "What you gain" cards, positional. */
const WHAT_YOU_GAIN_ICONS = [Users, Receipt, BarChart3] as const;

/** Icons for the four "Why ProjectPulse" cards, positional. */
const VALUE_PROPOSITION_ICONS = [BadgeCheck, ClipboardCheck, BarChart3, Clock] as const;

/** Icons for the three "How it works" micro-cards, positional. Section commented out. */
const MICRO_CARD_ICONS = [Users, Receipt, DollarSign] as const;

// Implementation Stepper Component with auto-play
function ImplementationStepper({ content }: { content: ProjectPulseDictionary }) {
  const implementationPhases = content.implementation.phases;
  const [activeStep, setActiveStep] = useState(0);
  const [visibleDescriptions, setVisibleDescriptions] = useState<number[]>([]);
  const [isInView, setIsInView] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setIsInView(true);
            setHasStarted(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!isInView || !hasStarted) return;

    let stepIndex = 0;
    const timers: NodeJS.Timeout[] = [];

    const processStep = () => {
      if (stepIndex >= implementationPhases.length) return;

      const stepNumber = stepIndex + 1;

      // Show step (activate it)
      setActiveStep(stepNumber);

      // After 500ms, show description for this step
      const timer1 = setTimeout(() => {
        setVisibleDescriptions(prev => [...prev, stepNumber]);

        // After 800ms more, move to next step
        const timer2 = setTimeout(() => {
          stepIndex++;
          processStep();
        }, 800);
        timers.push(timer2);
      }, 500);
      timers.push(timer1);
    };

    // Start after a small delay
    const startTimer = setTimeout(() => {
      processStep();
    }, 200);
    timers.push(startTimer);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isInView, hasStarted, implementationPhases.length]);

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 md:p-10">
        <SectionHeader
          kicker={content.implementation.kicker}
          title={content.implementation.title}
          subtitle={content.implementation.subtitle}
        />

        <div className="mt-8">
          {/* Mobile: Vertical timeline */}
          <div className="flex flex-col gap-4 sm:hidden">
            {implementationPhases.map((phase, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber <= activeStep;
              const showDescription = visibleDescriptions.includes(stepNumber);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: isActive ? 1 : 0.4 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex gap-3"
                >
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all duration-400 ${
                        isActive
                          ? 'bg-brand-sap text-white shadow-md'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {index < implementationPhases.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-2 transition-colors duration-400 ${
                        isActive ? 'bg-brand-sap/30' : 'bg-slate-200'
                      }`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-semibold text-base transition-colors duration-400 ${
                        isActive ? 'text-slate-900' : 'text-slate-400'
                      }`}>
                        {phase.name}
                      </h4>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full transition-colors duration-400 ${
                        isActive ? 'bg-brand-sap/10 text-brand-sap' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {phase.duration}
                      </span>
                    </div>

                    <AnimatePresence>
                      {showDescription && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-sm text-slate-600 leading-relaxed mt-2"
                        >
                          {phase.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop: Horizontal grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-5 gap-4">
            {implementationPhases.map((phase, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber <= activeStep;
              const showDescription = visibleDescriptions.includes(stepNumber);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.4, scale: 0.98 }}
                  animate={{
                    opacity: isActive ? 1 : 0.4,
                    scale: isActive ? 1 : 0.98
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col"
                >
                  {/* Step Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all duration-400 ${
                        isActive
                          ? 'bg-brand-sap text-white shadow-md'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    <div className="flex flex-col gap-1 pt-1">
                      <h4 className={`font-semibold text-base transition-colors duration-400 ${
                        isActive ? 'text-slate-900' : 'text-slate-400'
                      }`}>
                        {phase.name}
                      </h4>
                      <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors duration-400 ${
                        isActive ? 'text-brand-sap' : 'text-slate-400'
                      }`}>
                        <Clock className="h-3.5 w-3.5" />
                        {phase.duration}
                      </div>
                    </div>
                  </div>

                  {/* Description Card - appears and stays */}
                  <AnimatePresence>
                    {showDescription && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -8 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-4 shadow-sm min-h-[80px] flex items-center">
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {phase.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export interface ProjectPulsePageProps {
  content: ProjectPulseDictionary;
}

export function ProjectPulsePage({ content }: ProjectPulsePageProps) {
  const [activeRole, setActiveRole] = useState<"CEO" | "CFO" | "COO">("CEO");
  const steps = content.howItWorks.steps;
  const roleOutcomes = content.outcomes.roles;

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[60vh] sm:min-h-[75vh]">
        <Image
          src="/Project Pulse/project-pulse2.png"
          alt={content.hero.backgroundAlt}
          fill
          priority
          className="object-cover object-[center_top] -z-10"
        />

        {/* Overlays */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[6px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-36 pb-24 sm:pt-44 sm:pb-32 md:pt-56 md:pb-40 text-center">
          <div className="flex flex-col items-center gap-5">
            {/* SAP Qualified Badge */}
            <div className="inline-flex items-center rounded-xl border border-white/15 bg-white/10 px-4 py-2 sm:px-5 sm:py-2.5">
              <Image
                src="/Project Pulse/SAP_Qualified_PartnerPackageSolution_C.png"
                alt={content.hero.badgeAlt}
                width={240}
                height={62}
                className="h-9 sm:h-11 w-auto brightness-0 invert opacity-90"
              />
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              {content.hero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl font-medium text-white/95">
              {content.hero.subtitle}
            </p>

            {/* Description */}
            <p className="text-base sm:text-lg text-white/85 font-light leading-relaxed max-w-2xl mx-auto">
              {content.hero.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <a
                href={content.contactHref}
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400/50 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:from-yellow-500 hover:to-yellow-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {content.hero.ctaDiscovery}
              </a>

              <button
                type="button"
                data-vi="download"
                data-vi-label="ProjectPulse Brochure"
                data-vi-doc={content.brochureFilename}
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-white/40 text-white border border-white/30 hover:bg-white/10 hover:border-white/50"
                onClick={() => {
                  const href = content.brochureHref;
                  window.open(href, "_blank", "noopener,noreferrer");
                  const a = document.createElement("a");
                  a.href = href;
                  a.download = content.brochureFilename;
                  a.style.display = "none";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
              >
                {content.hero.ctaBrochure}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Content Rail - all sections wrapped */}
      <div className="relative bg-slate-50">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.015] bg-pattern-cross" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 md:py-16 space-y-12 md:space-y-16">

          {/* Challenge & Solution Block */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
              {/* The Challenge */}
              <YieldCard
                title={content.problem.title}
                description={content.problem.description}
                description2={content.problem.description2}
                icon={AlertTriangle}
                gradientColors={{
                  bg: 'linear-gradient(180deg, #F8FAFC 0%, #F5F9FF 100%)',
                  iconColor: '#0a6ed1'
                }}
              />

              {/* The Solution */}
              <YieldCard
                title={content.problem.solution.title}
                description={
                  <>
                    {content.problem.solution.descriptionPrefix}<strong>{content.problem.solution.descriptionStrong}</strong>{content.problem.solution.descriptionSuffix}
                  </>
                }
                description2={content.problem.solution.description2}
                icon={BadgeCheck}
                gradientColors={{
                  bg: 'linear-gradient(180deg, #F6FAFF 0%, #EEF5FF 100%)',
                  iconColor: '#0a6ed1'
                }}
              />
            </div>
          </motion.div>

          {/* What You Gain */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="relative">
              <div className="text-center mb-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-sap mb-2">
                  {content.whatYouGain.kicker}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
                  {content.whatYouGain.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                {content.whatYouGain.items.map((item, index) => {
                  const Icon = WHAT_YOU_GAIN_ICONS[index] || Users;
                  return (
                    <div key={index} className="group flex flex-col text-center px-6 py-6 border-t border-slate-200/60 first:border-t-0 md:border-t-0 md:border-r md:last:border-r-0 md:pr-8 md:last:pr-0">
                      <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 transition-all duration-200 ease-out group-hover:bg-blue-50/70 group-hover:scale-[1.06] group-hover:ring-1 group-hover:ring-[#0a6ed1]/15">
                        <Icon className="h-5 w-5 text-brand-sap" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-600 text-base leading-loose">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Ideal For Section */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 md:p-10">
              <SectionHeader
                kicker={content.idealFor.kicker}
                title={content.idealFor.title}
              />

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {content.industries.map((industry, index) => {
                  const Icon = INDUSTRY_ICONS[index] || Briefcase;
                  return (
                    <div
                      key={index}
                      className="group flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-brand-sap/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-3.5 w-3.5 text-brand-sap" />
                      </div>
                      <span className="text-sm sm:text-base font-medium text-slate-700">
                        {industry}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* What ProjectPulse Is - Premium SAP Design (Why ProjectPulse) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="relative border-t border-b border-slate-200 bg-slate-50/30 py-12 md:py-16">
              <div className="relative z-10">
                <div className="text-center mb-12">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-sap mb-2">
                    {content.valueProposition.kicker}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
                    {content.valueProposition.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                  {content.valueProposition.items.map((item, index) => {
                    const Icon = VALUE_PROPOSITION_ICONS[index] || BadgeCheck;
                    return (
                      <div key={index} className="group flex flex-col text-center py-4 border-t border-slate-200/60 first:border-t-0 md:border-t-0 md:border-r md:last:border-r-0 md:pr-8 md:last:pr-0">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 transition-all duration-200 ease-out group-hover:bg-blue-50/70 group-hover:scale-[1.06] group-hover:ring-1 group-hover:ring-[#0a6ed1]/15">
                          <Icon className="h-6 w-6 text-brand-sap" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* How It Works - Hidden */}
          {/* <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 md:p-10">
              <SectionHeader
                kicker={content.howItWorks.kicker}
                title={content.howItWorks.title}
                subtitle={content.howItWorks.subtitle}
              />

              <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
                <div className="flex flex-col gap-2 sm:hidden">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white border border-slate-200 flex-1">
                        <span className="w-6 h-6 rounded-full bg-brand-sap text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-slate-700">{step}</span>
                      </div>
                      {index < steps.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-slate-400 rotate-90 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="hidden sm:flex flex-wrap justify-center items-center gap-2 md:gap-3">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 hover:border-[#0a6ed1]/40 transition-all">
                        <span className="w-6 h-6 rounded-full bg-brand-sap text-white text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-slate-700">{step}</span>
                      </div>
                      {index < steps.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-slate-400 mx-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                {content.howItWorks.microCards.map((card, index) => {
                  const Icon = MICRO_CARD_ICONS[index] || Users;
                  return (
                    <div key={index} className="flex flex-col h-full rounded-xl border border-slate-200 bg-slate-50 p-6 hover:bg-white hover:shadow-sm transition-all">
                      <div className="w-11 h-11 rounded-xl bg-brand-sap/10 flex items-center justify-center mb-4">
                        <Icon className="h-5 w-5 text-brand-sap" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{card.title}</h3>
                      <p className="text-base text-slate-600 flex-1">
                        {card.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div> */}

          {/* Outcomes by Role - Hidden */}
          {/* <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 md:p-10">
              <SectionHeader
                kicker={content.outcomes.kicker}
                title={content.outcomes.title}
                subtitle={content.outcomes.subtitle}
              />

              <div className="mt-8 flex flex-col md:flex-row gap-8">
                <div className="md:w-48 bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex md:flex-col gap-2">
                    {(["CEO", "CFO", "COO"] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => setActiveRole(role)}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-base font-medium transition-all w-full ${
                          activeRole === role
                            ? "bg-brand-sap text-white shadow-sm"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {role === "CEO" && <Crown className="h-5 w-5" />}
                        {role === "CFO" && <Calculator className="h-5 w-5" />}
                        {role === "COO" && <Target className="h-5 w-5" />}
                        <span>{role}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 md:border-l md:border-slate-200 md:pl-8">
                  <h3 className="text-xl font-semibold text-slate-900 mb-5">
                    {activeRole} {content.outcomes.outcomesSuffix}
                  </h3>
                  <ul className="space-y-4">
                    {roleOutcomes[activeRole].map((outcome, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-0.5 w-6 h-6 rounded-full bg-brand-sap/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-brand-sap" />
                        </div>
                        <span className="text-base text-slate-600">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div> */}

          {/* Implementation */}
          {/* <ImplementationStepper content={content} /> */}
        </div>
      </div>

      {/* About Infinus - Hidden */}
      {/* <Section surface="surface-1" id="about">
        <motion.div
          className="max-w-5xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl text-slate-900">
            {content.about.title}
          </h2>

          <StatPills />

          <div className="pt-2">
            <IndustriesScroll label={content.about.industriesLabel} />
          </div>

          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            {content.about.description}
          </p>
        </motion.div>
      </Section> */}

      {/* Final CTA */}
      <section className="relative bg-slate-50 py-24 border-t border-slate-200/60">
        {/* Subtle transition band above CTA - fade to darker tone */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50 to-slate-900/[0.03]" />
        </div>

        {/* Subtle background pattern (same as other sections) */}
        <div className="absolute inset-0 opacity-[0.015] bg-pattern-cross" />

        <motion.div
          className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true, amount: 0.25 }}
        >
          {/* CTA Box - dark box on light background */}
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-brand-navy px-8 py-12 md:px-12 md:py-14 backdrop-blur-[6px]">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-5">
                {content.cta.title}
              </h2>

              <p className="text-base sm:text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                {content.cta.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <a
                  href={content.contactHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 px-7 py-3.5 text-base font-semibold text-slate-900 shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
                  {content.cta.primaryCta}
                </a>

                <a
                  href={content.brochureHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 hover:border-white/40 hover:bg-white/[0.06] px-7 py-3.5 text-base font-semibold text-white transition-all"
                >
                  {content.cta.secondaryCta}
                </a>
              </div>

              <p className="inline-flex items-center gap-2 text-sm text-white/65">
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
                {content.cta.trustNote}
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
