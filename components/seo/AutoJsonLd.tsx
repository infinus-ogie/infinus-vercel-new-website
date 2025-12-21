/**
 * Auto JSON-LD Component
 * Automatically injects JSON-LD schemas based on page config
 * Usage: <AutoJsonLd config={pageConfig} />
 */

import Script from "next/script";
import { PageConfig } from "@/lib/page-config";
import { generateAutoJsonLd } from "@/lib/auto-jsonld";

interface AutoJsonLdProps {
  config: PageConfig;
  id?: string;
}

export function AutoJsonLd({ config, id = "auto-jsonld" }: AutoJsonLdProps) {
  const jsonLdData = generateAutoJsonLd(config);
  
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}

