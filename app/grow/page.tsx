"use client";

import * as React from "react";

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (command: string, action: string, parameters: Record<string, any>) => void;
  }
}
import Script from "next/script";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  ArrowRight,
  Download,
  MessageCircle,
  HelpCircle,
  BarChart3,
  AlertTriangle,
  Brain,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaqSection } from "@/components/ui/Faq";
import { ResourceList } from "@/components/ui/ResourceList";
import ProServicesHero from "@/components/sections/growth/ProServicesHero";
import { NavBarDemo } from "@/components/ui/navbar-demo";
import Footer from "@/components/ui/footer";
import { StatCard } from "@/components/ui/StatCard";
import { FeatureTile } from "@/components/ui/FeatureTile";
import { StatPills } from "@/components/ui/StatPills";
import { IndustriesScroll } from "@/components/ui/IndustriesScroll";
import { 
  generatePageJsonLd, 
  getCurrentDate,
  DEFAULT_AUTHOR,
  DEFAULT_PUBLISHER 
} from "@/lib/jsonld";

// JSON-LD data
const pageData = {
  name: "GROW with SAP: Finansije kao pokretač rasta",
  url: "/grow",
  inLanguage: "sr-Latn-RS",
  description: "Transformišite finansijsku funkciju da podrži brzi i održivi rast. Za CFO-ove, finansijske menadžere, vlasnike i CEO brzorastućih srednjih kompanija."
};

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "GROW", url: "/grow" }
];

const articleData = {
  headline: "GROW with SAP: Finansije kao pokretač rasta",
  description: "Transformišite finansijsku funkciju da podrži brzi i održivi rast. Za CFO-ove, finansijske menadžere, vlasnike i CEO brzorastućih srednjih kompanija koje danas rade bez ERP-a ili sa zastarelim sistemima.",
  image: "/og-default.png",
  authorName: DEFAULT_AUTHOR.name,
  authorUrl: DEFAULT_AUTHOR.url,
  datePublished: getCurrentDate(),
  dateModified: getCurrentDate(),
  inLanguage: "sr-Latn-RS",
  mainEntityOfPage: "/grow",
  publisher: DEFAULT_PUBLISHER
};

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

// Generate JSON-LD
const jsonLdData = [
  // WebPage
  {
    "@type": "WebPage",
    "name": "GROW with SAP: Finansije kao pokretač rasta",
    "inLanguage": "sr-Latn-RS",
    "datePublished": getCurrentDate(),
    "dateModified": getCurrentDate(),
    "url": "/grow"
  },
  // BreadcrumbList
  {
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  },
  // Article
  {
    "@type": "Article",
    "headline": "GROW with SAP: Finansije kao pokretač rasta",
    "about": ["SAP Cloud ERP", "Finance transformation", "Midmarket growth"],
    "author": {
      "@type": "Organization",
      "name": "Infinus",
      "url": "https://www.infinus.co/"
    },
    "image": "/og-default.png",
    "inLanguage": "sr-Latn-RS"
  },
  // ItemList
  {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "CreativeWork",
        "name": "Oxford Economics izveštaj: CFO Insights",
        "url": "/downloads/CFO_Insights_OxfordEconomics.pdf"
      },
      {
        "@type": "CreativeWork",
        "name": "Checklista za CFO i finansijske menadžere",
        "url": "/downloads/Finance_Checklist.pdf"
      },
      {
        "@type": "CreativeWork",
        "name": "Infografik: 3 uvida o finansijama i rastu",
        "url": "/downloads/Finance_3_Insights.pdf"
      }
    ]
  },
  // FAQPage
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

const valueCards = [
  {
    icon: Zap,
    title: "Pojednostavite rad",
    description: "Automatizujte procese zatvaranja perioda, upravljanje potraživanjima i obavezama, konsolidaciju i izveštavanje."
  },
  {
    icon: TrendingUp,
    title: "Ubrzajte rast",
    description: "Koristite industrijski specifične best practice šablone, podržite više entiteta, valuta i jezika i brže uđite na nova tržišta."
  },
  {
    icon: Shield,
    title: "Osigurajte uspeh",
    description: "Obezbedite jedinstveni izvor finansijske istine, tačne i pravovremene uvide i podršku za sve regulatorne zahteve."
  },
  {
    icon: Brain,
    title: "Pripremite se za budućnost",
    description: "Integrišite finansije, HR i druge funkcije, uz podršku AI i naprednih analitika za bolje donošenje odluka."
  }
];

export default function GrowPage() {
  const scrollToDownloads = () => {
    const element = document.getElementById('downloads');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBarDemo />
      <main className="flex-1">
        {/* JSON-LD Script */}
        <Script
          id="grow-page-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdData)
          }}
        />

        {/* Hero Section */}
        <ProServicesHero
          title="GROW with SAP:"
          subtitle="Finansije kao pokretač rasta"
          description="Transformišite finansijsku funkciju da podrži brzi i održivi rast. Za CFO-ove, finansijske menadžere, vlasnike i CEO brzorastućih srednjih kompanija koje danas rade bez ERP-a ili sa zastarelim sistemima."
          badge={{ label: "PROGRAM", text: "GROW with SAP" }}
          ctas={[
            { text: "Preuzmite materijale", href: "#downloads", primary: true }
          ]}
        />

      {/* Zašto baš sada Section */}
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
              Zašto baš sada
            </h2>
            <div className="w-16 h-1 bg-[#0a6ed1] mx-auto rounded-full" />
          </div>

          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto text-center">
            Danas finansije nisu samo brojke. CFO i finansijski menadžeri preuzimaju ključnu ulogu u tehnologiji, bezbednosti, ESG zahtevima i usklađenosti. Problem? Ručni, nepovezani procesi i zastareli sistemi ne prate tempo rasta - ograničavaju tačnost, brzinu donošenja odluka i zadovoljstvo klijenata.
          </p>

          <motion.div 
            className="mt-8 rounded-2xl bg-white/60 backdrop-blur border border-slate-200/60 p-4 md:p-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="grid gap-4 md:grid-cols-3 md:divide-x md:divide-slate-200/70 md:[&>article]:px-6">
              <motion.article 
                className="p-4 md:py-4"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.16, delay: 0.02, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <StatCard
                  icon={BarChart3}
                  valueParts={{ end: 2, suffix: " od 3" }}
                  label="finansijskih direktora kažu da njihovi trenutni sistemi ne mogu da skaliraju uz rast poslovanja."
                  underline
                />
              </motion.article>
              <motion.article 
                className="p-4 md:py-4"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.16, delay: 0.04, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <StatCard
                  icon={Shield}
                  valueParts={{ end: 70, suffix: "%+" }}
                  label="CFO-a navodi da su globalni računovodstveni standardi, bezbednost podataka i usklađenost najveći izazovi."
                  underline
                />
              </motion.article>
              <motion.article 
                className="p-4 md:py-4"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.16, delay: 0.06, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <StatCard
                  icon={Brain}
                  valueParts={{ end: 81, suffix: "%" }}
                  label="finansijskih lidera veruje da će veštačka inteligencija i Cloud ERP imati pozitivan uticaj na strategiju i korporativne finansije."
                  underline
                />
              </motion.article>
            </div>
          </motion.div>

          <p className="mt-3 text-xs text-slate-500/80 text-center">
            Izvor: <a href="https://www.oxfordeconomics.com/resource/cfo-insights/" className="underline decoration-slate-300 hover:decoration-slate-500">Oxford Economics (CFO Insights), 2024</a>
          </p>
        </motion.div>
      </Section>

      {/* Kako SAP Cloud ERP pomaže Section */}
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
              Kako SAP Cloud ERP pomaže<br />
              vašem poslovanju da raste
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[1fr]">
            {valueCards.map((card, index) => (
              <FeatureTile
                key={index}
                icon={card.icon}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Downloads Section */}
      <Section surface="surface-1" id="downloads">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <ResourceList
            zipUrl="/downloads/CFO_pack.zip"
            items={[
              {
                id: "cfo-insights",
                title: "Oxford Economics izveštaj: CFO Insights",
                description: "Šta finansijski lideri planiraju i gde su prepreke: skaliranje, usklađenost i uloga AI/Cloud ERP-a.",
                label: "Research",
                url: "/downloads/CFO_Insights_OxfordEconomics.pdf",
                image: "/downloads/CFO_Insights_OxfordEconomics.pdf",
                analyticsId: "CFO_Insights_OxfordEconomics"
              },
              {
                id: "finance-checklist",
                title: "Checklista za CFO i finansijske menadžere",
                description: "Ključna pitanja prilikom izbora ERP rešenja - kako pojednostaviti rad, ubrzati rast i obezbediti usklađenost.",
                label: "Checklist",
                url: "/downloads/Finance_Checklist.pdf",
                image: "/downloads/Finance_Checklist.pdf",
                analyticsId: "Finance_Checklist"
              },
              {
                id: "finance-insights",
                title: "Infografik: 3 uvida o finansijama i rastu",
                description: "Brzi uvidi o procesima koji usporavaju finansije i kako Cloud ERP pomaže u skaliranju.",
                label: "Infographic",
                url: "/downloads/Finance_3_Insights.pdf",
                image: "/downloads/Finance_3_Insights.pdf",
                analyticsId: "Finance_3_Insights"
              }
            ]}
          />
        </motion.div>
      </Section>

      {/* O Infinusu Section */}
      <Section surface="surface-0" id="about">
        <motion.div
          className="max-w-5xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl text-slate-900">
            O Infinusu
          </h2>

          {/* Trust / metrics */}
          <StatPills />

          {/* Industries scroll */}
          <div className="pt-2">
            <IndustriesScroll />
          </div>

          {/* EXISTING PARAGRAPH - do not change the text */}
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Infinus d.o.o. je SAP Gold Partner sa više od 30 sertifikovanih SAP konsultanata i brojnim regionalnim i međunarodnim referencama. Naš fokus je da pomognemo brzorastućim kompanijama da kroz SAP Cloud ERP dobiju strukturu, kontrolu i agilnost potrebnu za sledeću fazu rasta.
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
            Spremni da razgovaramo?
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Zakažite kratak poziv i proverite kako SAP Cloud ERP može da podrži vaš rast.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              onClick={() => window.gtag?.('event','cta_click',{cta:'send_inquiry', page:'grow'})}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F62D9] hover:bg-[#2857c7] active:translate-y-px
                         px-6 py-3 text-white text-base font-semibold shadow-sm focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2F62D9] min-h-[48px]"
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
          <FaqSection id="faq-grow" items={faqItems} />
        </motion.div>
      </Section>

      </main>
      <Footer />
    </div>
  );
}
