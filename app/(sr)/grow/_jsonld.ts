/**
 * Auto-generated JSON-LD schemas for GROW page
 */

import { growConfig } from "./_config";
import { generateAutoJsonLd, createSimplePageConfig } from "@/lib/auto-jsonld";
import { getPageUrl } from "@/lib/page-config";

export function generateGrowJsonLd() {
  const baseConfig = createSimplePageConfig(
    growConfig.page.slug,
    growConfig.page.title,
    growConfig.page.description,
    {
      language: growConfig.page.language,
      faqs: growConfig.faqs,
      articleAbout: growConfig.articleAbout,
      additionalSchemas: [
        // ItemList for downloads
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "GROW Resources and Downloads",
          description: "Resources and downloads for GROW with SAP finance transformation",
          itemListElement: growConfig.downloads.map((item, index) => ({
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

