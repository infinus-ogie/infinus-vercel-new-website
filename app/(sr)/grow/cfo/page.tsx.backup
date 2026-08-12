"use client";

import * as React from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import ProServicesHero from "@/components/sections/growth/ProServicesHero";
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavBarDemo } from "@/components/ui/navbar-demo";
import Footer from "@/components/ui/footer";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { FaqSection } from "@/components/ui/Faq";
import { StatPills } from "@/components/ui/StatPills";
import { IndustriesScroll } from "@/components/ui/IndustriesScroll";
import CfoBenefits from "../_components/CfoBenefits";

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Focus Topics", url: "/#our-expertise" },
  { name: "SAP for CFOs", url: "/cfo" },
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
    url: "/cfo",
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
    title: "1) Jedinstvena „single source of truth“",
    body:
      "Integrisani finansije, prodaja, nabavka, logistika i operacije — bez excel ostrva,\nduplih unosa i verzija istog podatka.",
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
    title: "6) Rolling forecast i „what-if“ scenariji",
    body:
      "Plan povezan sa operativnim podacima — agilne korekcije budžeta i investicija.",
  },
  {
    title: "7) Ugrađena analitika i Business AI (Joule)",
    body:
      "Upiti prirodnim jezikom, prediktivna analitika, detekcija anomalija i automatizacija\nzadataka.",
  },
  {
    title: "8) Niži TCO i predvidljiv OPEX",
    body:
      "Bez lokalnih servera, bez velikih „verzijskih projekata“ — automatska ažuriranja u\ncloudu.",
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
          bgImage="/growth-materials/grow-with-sap2.png"
        />

        <Section surface="surface-0" id="prednosti">
          <motion.div
            className="max-w-5xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="text-center space-y-1">
              <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl text-slate-900">SAP Cloud ERP + Business AI</h2>
              <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">
{`10 dugoročnih prednosti iz CFO perspektive u odnosu na tradicionalni „ERP +
Excel“ pristup`}
              </p>
            </div>

            <CfoBenefits />
          </motion.div>
        </Section>

        <Section surface="surface-1">
          <motion.div
            className="max-w-4xl mx-auto space-y-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">A za brzi start (prvih 90 dana):</h3>
            <ul className="space-y-2 list-none">
              <li className="text-slate-700">{` Kraći monthly closing (−20% do −30%)`}</li>
              <li className="text-slate-700">{` Dnevni cash-flow forecast direktno iz sistema`}</li>
              <li className="text-slate-700">{` Profitabilnost po proizvodu/kanalu u realnom vremenu`}</li>
            </ul>
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


