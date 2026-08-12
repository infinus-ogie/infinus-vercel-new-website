/**
 * Auto-generated JSON-LD schemas for Professional Services page
 */

import { professionalServicesConfig } from "./_config";
import { generateAutoJsonLd, createSimplePageConfig } from "@/lib/auto-jsonld";
import { getPageUrl } from "@/lib/page-config";

export function generateProfessionalServicesJsonLd() {
  const baseConfig = createSimplePageConfig(
    professionalServicesConfig.page.slug,
    professionalServicesConfig.page.title,
    professionalServicesConfig.page.description,
    {
      language: professionalServicesConfig.page.language,
      faqs: professionalServicesConfig.faqs,
      articleAbout: professionalServicesConfig.articleAbout,
      additionalSchemas: [
        // ItemList for downloads
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Professional Services Resources and Downloads",
          description: "Resources and downloads for GROW with SAP for Professional Services",
          itemListElement: professionalServicesConfig.downloads.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "CreativeWork",
              name: item.name,
              url: item.url.startsWith("http") ? item.url : getPageUrl(item.url),
            },
          })),
        },
      ],
    }
  );
  
  return generateAutoJsonLd(baseConfig);
}

