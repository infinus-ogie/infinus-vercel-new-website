import Script from "next/script";
import { generatePageMetadata } from "@/lib/seo";
import { getCurrentDate } from "@/lib/jsonld";
import { ProjectPulseContent } from "./_components/ProjectPulseContent";
import type { Metadata } from "next";

// SEO Metadata
export const metadata: Metadata = generatePageMetadata(
  "ProjectPulse | SAP Qualified Partner-Packaged Solution | Infinus",
  "ProjectPulse is a SAP Qualified Partner-Packaged Solution for Professional Services firms, unifying finance, projects, sales, procurement, HR and analytics on a single intelligent cloud platform.",
  "/projectpulse"
)

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "ProjectPulse", url: "/projectpulse" },
];

// FAQ items for JSON-LD schema (must match the FAQ content on the page)
const faqItems = [
  {
    question: "What is ProjectPulse?",
    answer: "ProjectPulse is a SAP Qualified Partner-Packaged Solution designed for Professional Services companies. It unifies finance, project and resource management, sales, procurement and core HR, supported by SAP embedded analytics and SAP Business AI.",
  },
  {
    question: "How does ProjectPulse help executives and project teams?",
    answer: "Executives gain real-time visibility into profitability, cash and utilization through more than 500 prebuilt KPIs, dashboards and role-based overview pages. Project teams manage scope, milestones, staffing, billing readiness and event-based revenue recognition for fixed-price and T and M engagements.",
  },
  {
    question: "What is included in the base scope?",
    answer: "The base scope covers Finance (AR and AP, closing, treasury, profitability, consolidation), Customer Projects and Billing, Sourcing and Procurement, Sales of Services, SuccessFactors Employee Central, Integration Suite, DRC localizations and embedded analytics. Optional extensions include Sales Cloud and additional SuccessFactors modules.",
  },
  {
    question: "How long does implementation take and what is the expected outcome?",
    answer: "A prescriptive 3 to 6 month implementation accelerates time to value. Net result: real-time projects, aligned resources and predictable margins on a single intelligent cloud platform.",
  },
];

const jsonLdData = [
  {
    "@type": "WebPage",
    name: "ProjectPulse | SAP Qualified Partner-Packaged Solution",
    inLanguage: "en-US",
    url: "/projectpulse",
    description: "ProjectPulse is a SAP Qualified Partner-Packaged Solution for Professional Services firms, unifying finance, projects, sales, procurement, HR and analytics on a single intelligent cloud platform.",
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
    headline: "ProjectPulse | SAP Qualified Partner-Packaged Solution",
    about: ["SAP Cloud ERP", "Professional Services", "ProjectPulse", "SAP Qualified Partner-Packaged Solution"],
    author: { "@type": "Organization", name: "Infinus", url: "https://www.infinus.co/" },
    image: "/og-default.png",
    inLanguage: "en-US",
    datePublished: getCurrentDate(),
    dateModified: getCurrentDate(),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  },
];

export default function ProjectPulsePage() {
  return (
    <>
      <Script
        id="projectpulse-page-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <ProjectPulseContent />
    </>
  );
}
