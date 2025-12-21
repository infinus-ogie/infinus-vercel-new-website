"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { StatPills } from "@/components/ui/StatPills";
import { IndustriesScroll } from "@/components/ui/IndustriesScroll";
import { projectPulseConfig } from "../_config";
import {
  MessageCircle,
  CheckCircle2,
  Play,
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
  Award,
  UserCheck,
  Clock,
  Circle,
} from "lucide-react";

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
      <p className="text-xs font-semibold uppercase tracking-widest text-[#0a6ed1] mb-2">
        {kicker}
      </p>
      <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl text-slate-900 mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Industry icon mapping
const industryIconMap: Record<string, typeof Briefcase> = {
  "Consulting & Advisory": Briefcase,
  "IT Services": Code,
  "Systems Integration": Settings,
  "Software Development": Code,
  "Outsourcing & Nearshoring": Users,
  "Creative & Digital Agencies": Palette,
  "Architecture & Design": Building2,
  "Engineering services": Settings,
  "Legal services": Scale,
  "Other project-based services": Briefcase,
};

// Industries data - auto-generated from config
const industries = projectPulseConfig.industries.map((name) => ({
  name,
  icon: industryIconMap[name] || Briefcase,
}));

// Stepper steps - auto-generated from config
const steps = projectPulseConfig.howItWorks.steps;

// Role outcomes data - auto-generated from config
const roleOutcomes = projectPulseConfig.outcomes.roles;

// Implementation phases - auto-generated from config
const implementationPhases = projectPulseConfig.implementation.phases;

// Implementation Stepper Component with auto-play
function ImplementationStepper() {
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
  }, [isInView, hasStarted]);

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
          kicker="Delivery plan"
          title={projectPulseConfig.implementation.title}
          subtitle={projectPulseConfig.implementation.subtitle}
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
                          ? 'bg-[#0a6ed1] text-white shadow-md' 
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {index < implementationPhases.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-2 transition-colors duration-400 ${
                        isActive ? 'bg-[#0a6ed1]/30' : 'bg-slate-200'
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
                        isActive ? 'bg-[#0a6ed1]/10 text-[#0a6ed1]' : 'bg-slate-100 text-slate-400'
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
                          ? 'bg-[#0a6ed1] text-white shadow-md' 
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    <div className="flex flex-col gap-1 pt-1">
                      <h4 className={`font-semibold text-base transition-colors duration-400 ${
                        isActive ? 'text-slate-900' : 'text-slate-400'
                      } ${index === 4 ? 'whitespace-nowrap' : ''}`}>
                        {phase.name}
                      </h4>
                      <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors duration-400 ${
                        isActive ? 'text-[#0a6ed1]' : 'text-slate-400'
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

export function ProjectPulseContent() {
  const [activeRole, setActiveRole] = useState<"CEO" | "CFO" | "COO">("CEO");

  return (
    <>
      {/* Hero Section - SAP Premium */}
      <section className="relative overflow-hidden min-h-[75vh]">
        <Image
          src="/Project Pulse/project-pulse2.png"
          alt="ProjectPulse Background"
          fill
          priority
          className="object-cover object-[center_top] -z-10"
        />

        {/* Refined overlays */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-12 sm:pt-32 sm:pb-14">
          <div className="max-w-[850px] -ml-2 sm:-ml-4">
            {/* Premium glass card */}
            <div className="rounded-2xl border border-white/15 bg-black/25 backdrop-blur-md shadow-2xl px-8 py-6 sm:px-10 sm:py-7">
              {/* SAP Qualified Badge */}
              <div className="flex items-center gap-4 mb-4">
                <div className="inline-flex items-center rounded-xl border border-white/15 bg-white/10 px-5 py-2.5">
                  <Image
                    src="/Project Pulse/SAP_Qualified_PartnerPackageSolution_C.png"
                    alt="SAP Qualified Partner-Packaged Solution"
                    width={240}
                    height={62}
                    className="h-10 sm:h-12 w-auto brightness-0 invert opacity-90"
                  />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-left text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                {projectPulseConfig.hero.title}
              </h1>

              {/* Headline line */}
              <p className="mt-2 text-left text-xl sm:text-2xl font-semibold text-white/95">
                {projectPulseConfig.hero.subtitle}
              </p>

              {/* Subhead */}
              <p className="mt-3 text-left text-base sm:text-lg leading-relaxed text-white/85 font-light">
                {projectPulseConfig.hero.description}
              </p>

              {/* CTAs */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href="/contact"
                  className="rounded-xl px-6 py-3 text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400/50 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:from-yellow-500 hover:to-yellow-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Book a 30-min discovery call
                </a>

                <a
                  href="/api/projectpulse/pdf?v=2"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-vi="download"
                  data-vi-label="ProjectPulse Brochure"
                  data-vi-doc="ProjectPulse-Brochure.pdf"
                  className="rounded-xl px-6 py-3 text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-white/40 text-white border border-white/30 hover:bg-white/10 hover:border-white/50"
                >
                  Download brochure
                </a>

                <a
                  href="/projectpulse/video"
                  className="inline-flex items-center gap-2 px-3 py-2 text-base font-medium text-white/85 hover:text-white transition-colors"
                >
                  <Play className="h-4 w-4" />
                  Watch the video
                </a>
              </div>

              {/* Proof chips */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {projectPulseConfig.hero.valueHighlights.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1.5 text-sm text-white/85"
                  >
                    <CheckCircle2 className="h-4 w-4 opacity-85" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Content Rail - all sections wrapped */}
      <div className="relative bg-slate-50">
        {/* Subtle background pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8 py-14 md:py-16 space-y-12 md:space-y-16">
          
          {/* Ideal For Section */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 md:p-10">
              <SectionHeader
                kicker="Built for Professional Services"
                title="Ideal for companies in"
              />
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {industries.map((industry, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-2.5 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#0a6ed1]/35 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0a6ed1]/10 flex items-center justify-center group-hover:bg-[#0a6ed1]/15 transition-colors flex-shrink-0">
                      <industry.icon className="h-4 w-4 text-[#0a6ed1]" />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-slate-700">
                      {industry.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Problem Block */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl text-slate-900 leading-tight">
                      {projectPulseConfig.problem.title}
                    </h2>
                  </div>
                  <p className="text-lg leading-relaxed text-slate-600">
                    {projectPulseConfig.problem.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-5">
                    Typical symptoms
                  </h3>
                  <ul className="space-y-3">
                    {projectPulseConfig.problem.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Circle className="h-2 w-2 mt-2.5 text-slate-400 fill-current flex-shrink-0" />
                        <span className="text-base text-slate-600">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Outcome teaser callout */}
              <div className="mt-8 bg-[#0a6ed1]/5 border border-[#0a6ed1]/15 rounded-xl p-5 text-center">
                <p className="text-base sm:text-lg font-semibold text-[#0a6ed1]">
                  {projectPulseConfig.problem.outcome}
                </p>
              </div>
            </div>
          </motion.div>

          {/* What ProjectPulse Is - Premium SAP Design */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="relative rounded-3xl overflow-hidden border border-[#0a6ed1]/20 bg-gradient-to-br from-[#0a6ed1]/5 via-blue-50/30 to-slate-50/50 shadow-xl p-8 md:p-12">
              {/* Premium background pattern */}
              <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm22 4c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-21-21c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM36 91c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='%230a6ed1' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                }}
              />
              
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a6ed1]/8 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="text-center mb-10">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#0a6ed1] mb-2">
                    Product overview
                  </p>
                  <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl text-slate-900 mb-2">
                    {projectPulseConfig.valueProposition.title}
                  </h2>
                  <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                    {projectPulseConfig.valueProposition.subtitle}
                  </p>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {projectPulseConfig.valueProposition.items.map((item, index) => {
                    const icons = [Award, ClipboardCheck, Settings];
                    const Icon = icons[index] || Award;
                    return (
                      <div key={index} className="group flex flex-col h-full rounded-2xl border border-white/60 bg-white/70 backdrop-blur-sm p-7 text-center hover:bg-white hover:shadow-xl hover:border-[#0a6ed1]/30 transition-all duration-300 hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0a6ed1] to-[#0a4a8c] flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                        <p className="text-slate-600 text-base leading-relaxed flex-1">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 md:p-10">
              <SectionHeader
                kicker="End-to-end flow"
                title={projectPulseConfig.howItWorks.title}
                subtitle={projectPulseConfig.howItWorks.subtitle}
              />

              {/* Stepper in inset panel */}
              <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
                {/* Mobile: Vertical list */}
                <div className="flex flex-col gap-2 sm:hidden">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white border border-slate-200 flex-1">
                        <span className="w-6 h-6 rounded-full bg-[#0a6ed1] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {step.number}
                        </span>
                        <span className="text-sm font-medium text-slate-700">{step.name}</span>
                      </div>
                      {index < steps.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-slate-400 rotate-90 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Desktop: Horizontal flow */}
                <div className="hidden sm:flex flex-wrap justify-center items-center gap-2 md:gap-3">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 hover:border-[#0a6ed1]/40 transition-all">
                        <span className="w-6 h-6 rounded-full bg-[#0a6ed1] text-white text-xs font-bold flex items-center justify-center">
                          {step.number}
                        </span>
                        <span className="text-sm font-medium text-slate-700">{step.name}</span>
                      </div>
                      {index < steps.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-slate-400 mx-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Micro Cards */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                {projectPulseConfig.howItWorks.microCards.map((card, index) => {
                  const icons = [Users, Receipt, DollarSign];
                  const Icon = icons[index] || Users;
                  return (
                    <div key={index} className="flex flex-col h-full rounded-xl border border-slate-200 bg-slate-50 p-6 hover:bg-white hover:shadow-sm transition-all">
                      <div className="w-11 h-11 rounded-xl bg-[#0a6ed1]/10 flex items-center justify-center mb-4">
                        <Icon className="h-5 w-5 text-[#0a6ed1]" />
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
          </motion.div>

          {/* Outcomes by Role */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 md:p-10">
              <SectionHeader
                kicker="Executive outcomes"
                title={projectPulseConfig.outcomes.title}
                subtitle={projectPulseConfig.outcomes.subtitle}
              />

              <div className="mt-8 flex flex-col md:flex-row gap-8">
                {/* Tabs sidebar */}
                <div className="md:w-48 bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex md:flex-col gap-2">
                    {(["CEO", "CFO", "COO"] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => setActiveRole(role)}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-base font-medium transition-all w-full ${
                          activeRole === role
                            ? "bg-[#0a6ed1] text-white shadow-sm"
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

                {/* Content area */}
                <div className="flex-1 md:border-l md:border-slate-200 md:pl-8">
                  <h3 className="text-xl font-semibold text-slate-900 mb-5">
                    {activeRole} Outcomes
                  </h3>
                  <ul className="space-y-4">
                    {roleOutcomes[activeRole].map((outcome, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-0.5 w-6 h-6 rounded-full bg-[#0a6ed1]/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-[#0a6ed1]" />
                        </div>
                        <span className="text-base text-slate-600">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Implementation */}
          {/* <ImplementationStepper /> */}
        </div>
      </div>

      {/* About Infinus */}
      <Section surface="surface-1" id="about">
        <motion.div
          className="max-w-5xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl text-slate-900">
            {projectPulseConfig.about.title}
          </h2>

          {/* Trust / metrics */}
          <StatPills />

          {/* Industries scroll */}
          <div className="pt-2">
            <IndustriesScroll label="Industries" />
          </div>

          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            {projectPulseConfig.about.description}
          </p>
        </motion.div>
      </Section>

      {/* Final CTA */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-[#0a4a8c]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04]" />
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5">
            {projectPulseConfig.cta.title}
          </h2>
          <p className="text-base sm:text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            {projectPulseConfig.cta.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 px-7 py-3.5 text-base font-semibold text-slate-900 shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle className="h-5 w-5" />
              {projectPulseConfig.cta.primaryCta}
            </a>
            <a
              href="/api/projectpulse/pdf?v=2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 hover:border-white/50 hover:bg-white/10 px-7 py-3.5 text-base font-semibold text-white transition-all"
            >
              {projectPulseConfig.cta.secondaryCta}
            </a>
          </div>

          <p className="inline-flex items-center gap-2 text-sm text-white/65">
            <CheckCircle2 className="h-4 w-4" />
            {projectPulseConfig.cta.trustNote}
          </p>
        </motion.div>
      </section>
    </>
  );
}
