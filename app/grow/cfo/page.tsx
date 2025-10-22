"use client";

import * as React from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import ProServicesHero from "@/components/sections/growth/ProServicesHero";
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavBarDemo } from "@/components/ui/navbar-demo";
import Footer from "@/components/ui/footer";
import { CheckCircle2, MessageCircle, Wallet, TrendingUp } from "lucide-react";
import { FaqSection } from "@/components/ui/Faq";
import { StatPills } from "@/components/ui/StatPills";
import { IndustriesScroll } from "@/components/ui/IndustriesScroll";
import { CfoTimeline } from "./_sections/CfoTimeline";

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "GROW", url: "/grow" },
  { name: "SAP for CFOs", url: "/grow/cfo" },
];

const faqItems = [
  {
    question: "Da li je SAP Cloud ERP prevelik za srednje i brzorastuće firme bez ERP-a?",
    answer: "Ne. Dizajniran je da brzo krene uz best-practice procese i da se kasnije širi po potrebi."
  },
  {
    question: "Kako SAP pomaže oko usklađenosti i standarda?",
    answer: "Gotove funkcije za lokalne standarde, e-fakturisanje, poreze i međunarodne standarde, uz centralizovane podatke za brže revizije."
  },
  {
    question: "Koja je uloga AI u finansijama?",
    answer: "AI automatizuje rutinske zadatke i ubrzava uvide, pa timovi donose bolje odluke brže."
  }
];

const jsonLdData = [
  {
    "@type": "WebPage",
    name: "SAP for CFOs",
    inLanguage: "sr-Latn-RS",
    url: "/grow/cfo",
  },
  {
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  },
  {
    "@type": "Article",
    headline: "SAP for CFOs",
    about: ["SAP Cloud ERP", "Business AI", "CFO"],
    author: { "@type": "Organization", name: "Infinus", url: "https://www.infinus.co/" },
    image: "/og-default.png",
    inLanguage: "sr-Latn-RS",
  },
  {
    "@type": "FAQPage",
    "mainEntity": faqItems.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
];

const cfoItems = [
  {
    title: '1) Jedinstvena „single source of truth"',
    body:
      'Integrisani finansije, prodaja, nabavka, logistika i operacije - bez excel ostrva,\nduplih unosa i verzija istog podatka.',
  },
  {
    title: "2) Brže i pouzdanije mesečno zatvaranje",
    body:
      "Automatizovana knjiženja, manje ručnog rada, sledljivost korekcija i jasne kontrole.",
  },
  {
    title: "3) Real-time profitabilnost i cash-flow",
    body:
      "Profitabilnost po proizvodu/kupcu/kanalu + dnevni pogled na DSO/DPO i potrebe\nlikvidnosti.",
  },
  {
    title: "4) Usklađenost i audit readiness",
    body:
      "Podrška za e-Faktura i eOtpremnica (SAP DRC/eDocument), IFRS 15/16, potpuni\naudit trail.",
  },
  {
    title: "5) Automatizacija AP/AR i banaka",
    body:
      "Automatsko usklađivanje izvoda, kontrola kašnjenja, smanjenje grešaka i ubrzana\nnaplata.",
  },
  {
    title: '6) Rolling forecast i „what-if" scenariji',
    body:
      'Plan povezan sa operativnim podacima - agilne korekcije budžeta i investicija.',
  },
  {
    title: "7) Ugrađena analitika i Business AI (Joule)",
    body:
      "Upiti prirodnim jezikom, prediktivna analitika, detekcija anomalija i automatizacija\nzadataka.",
  },
  {
    title: '8) Niži TCO i predvidljiv OPEX',
    body:
      'Bez lokalnih servera, bez velikih „verzijskih projekata" - automatska ažuriranja u\ncloudu.',
  },
  {
    title: "9) Sigurnost, dostupnost i kontrola pristupa",
    body:
      "Role-based access, enkripcija, SSO, visoka dostupnost, uz ISO i SOC sertifikate.",
  },
  {
    title: "10) Spremnost za rast i M&A",
    body:
      "Multi-company/multi-country, konsolidacija i Group Reporting out-of-the-box.",
  },
];

export default function CFOPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBarDemo />
      <main className="flex-1">
        <Script
          id="cfo-page-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />

        <ProServicesHero
          title="SAP Cloud ERP + Business AI"
          subtitle=""
          description="10 dugoročnih prednosti iz CFO perspektive u odnosu na tradicionalni „ERP + Excel“ pristup"
          badge={{ label: "PROGRAM", text: "GROW with SAP" }}
          ctas={[{ text: "Pogledaj prednosti", href: "#prednosti", primary: true }]}
          bgImage="/SAP%20for%20CFOs%20iamges/sap-cfo-hero2.png"
        />

        <CfoTimeline />

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
                A za brzi start (prvih 90 dana)
              </h3>
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-[#0a6ed1]/20 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 backdrop-blur px-6 py-3.5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#0a6ed1]/40 hover:scale-105 cursor-default">
                <CheckCircle2 className="h-5 w-5 text-[#0a6ed1] flex-shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900">Kraći monthly closing</div>
                  <div className="text-xs text-slate-600">−20% do −30%</div>
                </div>
              </div>

              <div className="inline-flex items-center gap-3 rounded-full border border-[#0a6ed1]/20 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 backdrop-blur px-6 py-3.5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#0a6ed1]/40 hover:scale-105 cursor-default">
                <Wallet className="h-5 w-5 text-[#0a6ed1] flex-shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900">Dnevni cash-flow forecast</div>
                  <div className="text-xs text-slate-600">direktno iz sistema</div>
                </div>
              </div>

              <div className="inline-flex items-center gap-3 rounded-full border border-[#0a6ed1]/20 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 backdrop-blur px-6 py-3.5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#0a6ed1]/40 hover:scale-105 cursor-default">
                <TrendingUp className="h-5 w-5 text-[#0a6ed1] flex-shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900">Profitabilnost po proizvodu/kanalu</div>
                  <div className="text-xs text-slate-600">u realnom vremenu</div>
                </div>
              </div>
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
            <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl text-slate-900">O Infinusu</h2>
            <StatPills />
            <div className="pt-2">
              <IndustriesScroll />
            </div>
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Infinus d.o.o. je SAP Gold Partner sa više od 30 sertifikovanih SAP konsultanata i brojnim regionalnim i međunarodnim referencama. Naš fokus je da pomognemo brzorastućim kompanijama da kroz SAP Cloud ERP dobiju strukturu, kontrolu i agilnost potrebnu za sledeću fazu rasta.
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">Spremni da razgovaramo?</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Zakažite kratak poziv i proverite kako SAP Cloud ERP može da podrži vaš rast.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F62D9] hover:bg-[#2857c7] active:translate-y-px px-6 py-3 text-white text-base font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2F62D9] min-h-[48px]"
              >
                <MessageCircle className="h-4 w-4 opacity-90" />
                Pošaljite upit
              </a>
            </div>
            <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-sm text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-[#0a6ed1]" />
              Odgovaramo u roku jednog radnog dana
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
            <FaqSection id="faq-cfo" items={faqItems} />
          </motion.div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}


