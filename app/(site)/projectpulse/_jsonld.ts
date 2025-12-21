/**
 * Auto-generated JSON-LD schemas for ProjectPulse page
 * Automatically updates when projectPulseConfig changes
 */

import { projectPulseConfig } from "./_config";
import { getCurrentDate, DEFAULT_AUTHOR, DEFAULT_PUBLISHER, SITE_CONFIG } from "@/lib/jsonld";

export function generateProjectPulseJsonLd() {
  const baseUrl = SITE_CONFIG.url;
  const pageUrl = `${baseUrl}${projectPulseConfig.page.slug}`;

  return [
    // WebPage schema
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: projectPulseConfig.page.title,
      inLanguage: SITE_CONFIG.language,
      url: projectPulseConfig.page.url,
      description: projectPulseConfig.page.description,
      mainEntity: {
        "@type": "SoftwareApplication",
        name: "ProjectPulse",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Cloud",
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        provider: {
          "@type": "Organization",
          name: "Infinus",
          url: baseUrl,
          sameAs: [baseUrl],
        },
        description: projectPulseConfig.page.description,
        featureList: projectPulseConfig.hero.valueHighlights,
        applicationSubCategory: "ERP Software",
        softwareVersion: "1.0",
        releaseNotes: "SAP Qualified Partner-Packaged Solution for Professional Services",
      },
    },

    // BreadcrumbList
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "ProjectPulse",
          item: projectPulseConfig.page.url,
        },
      ],
    },

    // Article schema
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: projectPulseConfig.page.title,
      about: [
        {
          "@type": "Thing",
          name: "SAP Cloud ERP",
        },
        {
          "@type": "Thing",
          name: "Professional Services",
        },
        {
          "@type": "SoftwareApplication",
          name: "ProjectPulse",
        },
        {
          "@type": "Thing",
          name: "SAP Qualified Partner-Packaged Solution",
        },
        ...projectPulseConfig.industries.map((industry) => ({
          "@type": "Thing",
          name: industry,
        })),
      ],
      author: {
        "@type": "Organization",
        name: DEFAULT_AUTHOR.name,
        url: DEFAULT_AUTHOR.url,
      },
      publisher: DEFAULT_PUBLISHER,
      image: SITE_CONFIG.defaultImage,
      inLanguage: SITE_CONFIG.language,
      datePublished: getCurrentDate(),
      dateModified: getCurrentDate(),
    },

    // SoftwareApplication schema (detailed)
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "ProjectPulse",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Cloud",
      description: projectPulseConfig.page.description,
      url: projectPulseConfig.page.url,
      provider: {
        "@type": "Organization",
        name: "Infinus",
        url: baseUrl,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Tresnjinog cveta 1",
          addressLocality: "Belgrade",
          postalCode: "11070",
          addressCountry: "RS",
        },
        contactPoint: {
          "@type": "ContactPoint",
          email: "office@infinus.rs",
          contactType: "Customer Service",
        },
      },
      featureList: [
        ...projectPulseConfig.hero.valueHighlights,
        ...projectPulseConfig.howItWorks.microCards.map((card) => card.description),
        ...projectPulseConfig.valueProposition.items.map((item) => item.description),
      ],
      applicationSubCategory: "ERP Software",
      softwareRequirements: "SAP Cloud ERP",
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "USD",
      },
      audience: {
        "@type": "Audience",
        audienceType: projectPulseConfig.industries.join(", "),
      },
    },

    // HowTo schema for implementation process
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "ProjectPulse Implementation Process",
      description: projectPulseConfig.implementation.subtitle,
      step: projectPulseConfig.implementation.phases.map((phase, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: phase.name,
        text: phase.description,
        itemListElement: {
          "@type": "HowToDirection",
          text: `${phase.name}: ${phase.description} (Duration: ${phase.duration})`,
        },
      })),
    },

    // ItemList for industries
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Industries Served by ProjectPulse",
      description: "Professional services industries that benefit from ProjectPulse",
      itemListElement: projectPulseConfig.industries.map((industry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: industry,
      })),
    },
  ];
}

