"use client";

import * as React from "react";

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (command: string, action: string, parameters?: Record<string, any>) => void;
  }
}
import Script from "next/script";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  Rocket, 
  ServerCog, 
  Brain,
  Users, 
  ArrowRight,
  Download,
  MessageCircle,
  HelpCircle,
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Lightbulb,
  Cloud,
  Target,
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
  name: "GROW with SAP za Professional Services | Infinus",
  url: "/professional-services",
  inLanguage: "sr-Latn-RS",
  description: "ERP rešenje za rast, agilnost i profitabilnost u profesionalnim uslugama - preuzmite materijale i zakažite konsultacije."
};

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Professional Services", url: "/professional-services" }
];

const articleData = {
  headline: "GROW with SAP za Professional Services",
  description: "ERP rešenje za rast, agilnost i profitabilnost u profesionalnim uslugama - preuzmite materijale i zakažite konsultacije.",
  image: "/og-default.png",
  authorName: DEFAULT_AUTHOR.name,
  authorUrl: DEFAULT_AUTHOR.url,
  datePublished: getCurrentDate(),
  dateModified: getCurrentDate(),
  inLanguage: "sr-Latn-RS",
  mainEntityOfPage: "/professional-services",
  publisher: DEFAULT_PUBLISHER
};

const faqItems = [
  {
    question: "Da li je SAP Cloud ERP prevelik za profesionalne uslužne kompanije?",
    answer: "Ne. Dizajniran je da brzo krene uz best-practice procese i da se kasnije širi po potrebi. Posebno je pogodan za profesionalne usluge jer omogućava fleksibilnost u upravljanju projektima i resursima."
  },
  {
    question: "Kako SAP pomaže oko skaliranja i agilnosti u profesionalnim uslugama?",
    answer: "SAP Cloud ERP omogućava centralizovano upravljanje projektima, resursima i finansijama, što omogućava brže skaliranje i bolju agilnost u odgovoru na promene tržišta."
  },
  {
    question: "Koja je uloga AI u profesionalnim uslugama?",
    answer: "AI automatizuje rutinske zadatke, poboljšava alokaciju resursa i omogućava bolje predviđanje potreba klijenata, što rezultuje većom profitabilnošću i kvalitetom usluga."
  }
];

// Generate JSON-LD
const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    // WebPage
    {
      "@type": "WebPage",
      "name": "GROW with SAP za Professional Services | Infinus",
      "inLanguage": "sr-Latn-RS",
      "datePublished": getCurrentDate(),
      "dateModified": getCurrentDate(),
      "url": "/professional-services"
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
    "headline": "GROW with SAP za Professional Services",
    "about": ["SAP Cloud ERP", "Professional Services", "Business growth"],
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
        "name": "Staying Ahead: How Professional Services firms use automation to become agile",
        "url": "/professional-services-materials/34388_Oxford_ProServPartner_91961.pdf"
      },
      {
        "@type": "CreativeWork",
        "name": "Rethinking Service Innovation: How business model transformation drives growth",
        "url": "/professional-services-materials/34390_Oxford_ServInnovPartner_91960.pdf"
      },
      {
        "@type": "CreativeWork",
        "name": "XaaS: How midsize organizations are innovating services (Infographic)",
        "url": "/professional-services-materials/35353_ServiceInnovationPartnerIG_91829.pdf"
      },
      {
        "@type": "CreativeWork",
        "name": "How can the XaaS business model drive innovative growth… (TechTarget)",
        "url": "/professional-services-materials/Techtarget-How can the XaaS business model drive innovative growth for your services, software or digital content bu.pdf"
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
  ]
};



const valueCards = [
  {
    icon: Users,
    title: "Povežite ljude i procese",
    description: "Uskladite talente sa potrebama projekata uz digitalne alate, AI i automatizaciju."
  },
  {
    icon: Rocket,
    title: "Ubrzajte isporuku usluga",
    description: "Skratite vreme postavljanja projekata, povećajte preciznost procena i poboljšajte praćenje profitabilnosti."
  },
  {
    icon: Lightbulb,
    title: "Otvorite nove izvore prihoda",
    description: "Kreirajte i monetizujte nove poslovne modele, od XaaS i pretplata do kombinovanih usluga i digitalnih rešenja."
  },
  {
    icon: Target,
    title: "Postignite konkurentsku prednost",
    description: "Obezbedite real-time uvide u marže projekata, iskorišćenost resursa i KPI-jeve kako biste donosili brže i sigurnije odluke."
  }
];

export default function ProfessionalServicesPage() {
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
          id="professional-services-page-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdData)
          }}
        />

        {/* Hero Section */}
        <ProServicesHero
          title="SAP Cloud ERP za Professional Services kompanije"
          subtitle=""
          description="Upravljajte projektima, resursima, procesima i profitabilnošću uz rešenje koje razume vaš biznis. Efikasan, skalabilan i agilan ERP za firme koje prodaju znanje, vreme i usluge."
          badge={{ label: "PROGRAM", text: "GROW with SAP" }}
          ctas={[
            { text: "Preuzmite materijale", href: "/growth-professional-services-materials/Professional_Services_pack.zip", primary: true }
          ]}
          bgImage="/growth-professional-services-materials/professional-services-cover.jpg"
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
              Profesionalne usluge su pod pritiskom: vrhunsko korisničko iskustvo, privlačenje i zadržavanje talenata i brze tehnološke promene. Kako uskladiti ljude i procese u jednom fleksibilnom sistemu koji omogućava profitabilan i održiv rast?
            </p>

            <motion.div 
              className="mt-8 rounded-2xl bg-white/60 backdrop-blur border border-slate-200/60 p-4 md:p-6"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:divide-x md:divide-slate-200/70 md:[&>article]:px-6">
                <motion.article 
                  className="p-4 md:py-4"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.16, delay: 0.02, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <StatCard
                    icon={BarChart3}
                    valueParts={{ end: 85, suffix: "%" }}
                    label="firmi u profesionalnim uslugama beleži rast prihoda, ali manje od 70% i rast profitabilnosti"
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
                    icon={Lightbulb}
                    valueParts={{ end: 40, suffix: "%" }}
                    label="lidera smatra inovacije i nove poslovne modele ključnim, ali ističu prepreke u skaliranju i zastarele sisteme"
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
                    icon={Cloud}
                    valueParts={{ end: 78, suffix: "%" }}
                    label="kompanija već koristi Cloud ERP da unapredi agilnost, optimizuje procese i isporuči bolja iskustva klijentima"
                    underline
                  />
                </motion.article>
                <motion.article 
                  className="p-4 md:py-4"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.16, delay: 0.08, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <StatCard
                    icon={Brain}
                    valueParts={{ end: 53, suffix: "%" }}
                    label="planira da usvoji AI u narednih 12 meseci radi veće efikasnosti i produktivnosti"
                    underline
                  />
                </motion.article>
              </div>
            </motion.div>

            <p className="mt-3 text-xs text-slate-500/80 text-center">
              Izvor: <a href="https://www.oxfordeconomics.com/resource/professional-services-research/" className="underline decoration-slate-300 hover:decoration-slate-500">SAP i Oxford Economics istraživanje, 2024</a>
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
                uslužnim kompanijama
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
              zipUrl="/growth-professional-services-materials/Professional_Services_pack.zip"
              title="Preuzmite materijale za profesionalne usluge"
              description="Pristupite našoj sveobuhvatnoj kolekciji resursa, istraživanja i vodiča koji će vam pomoći da razvijete profesionalne usluge sa SAP rešenjima."
              items={[
                {
                  id: "proserv-automation",
                  title: "Staying Ahead: How Professional Services firms use automation to become agile",
                  description: "Istraživanje o tome kako profesionalne uslužne kompanije koriste automatizaciju za postizanje agilnosti i rasta profitabilnosti.",
                  label: "Research",
                  url: "/growth-professional-services-materials/34388_Oxford_ProServPartner_91961.pdf",
                  image: "/growth-professional-services-materials/34388_Oxford_ProServPartner_91961.pdf",
                  analyticsId: "Oxford_ProServPartner"
                },
                {
                  id: "service-innovation",
                  title: "Rethinking Service Innovation: How business model transformation drives growth",
                  description: "Analiza transformacije poslovnih modela u profesionalnim uslugama i njihovog uticaja na rast kompanija.",
                  label: "Analysis",
                  url: "/growth-professional-services-materials/34390_Oxford_ServInnovPartner_91960.pdf",
                  image: "/growth-professional-services-materials/34390_Oxford_ServInnovPartner_91960.pdf",
                  analyticsId: "Oxford_ServInnovPartner"
                },
                {
                  id: "xaas-infographic",
                  title: "XaaS: How midsize organizations are innovating services (Infographic)",
                  description: "Vizuelni pregled kako srednje kompanije inoviraju usluge kroz XaaS modele poslovanja.",
                  label: "Infographic",
                  url: "/growth-professional-services-materials/35353_ServiceInnovationPartnerIG_91829.pdf",
                  image: "/growth-professional-services-materials/35353_ServiceInnovationPartnerIG_91829.pdf",
                  analyticsId: "ServiceInnovPartnerIG"
                },
                {
                  id: "xaas-techtarget",
                  title: "How can the XaaS business model drive innovative growth… (TechTarget)",
                  description: "Tehnička analiza XaaS modela poslovanja i njegovog potencijala za inovativni rast kompanija.",
                  label: "Technical Analysis",
                  url: "/growth-professional-services-materials/Techtarget-How can the XaaS business model drive innovative growth for your services, software or digital content bu.pdf",
                  image: "/growth-professional-services-materials/Techtarget-How can the XaaS business model drive innovative growth for your services, software or digital content bu.pdf",
                  analyticsId: "Techtarget_XaaS"
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
              Infinus d.o.o. je SAP Gold Partner sa više od 30 sertifikovanih SAP konsultanata i brojnim regionalnim i međunarodnim referencama. Naš fokus je da pomognemo profesionalnim uslužnim kompanijama da kroz SAP Cloud ERP dobiju strukturu, kontrolu i agilnost potrebnu za sledeću fazu rasta.
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
                onClick={() => window.gtag?.('event','cta_click',{cta:'send_inquiry', page:'professional-services'})}
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
            <FaqSection id="faq-pro" items={faqItems} />
          </motion.div>
        </Section>

      </main>
      <Footer />
    </div>
  );
}
