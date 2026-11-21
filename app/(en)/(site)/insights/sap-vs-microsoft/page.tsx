import type { Metadata } from "next"
import { SapVsMicrosoftPage } from "@/components/pages/SapVsMicrosoftPage"
import { getDictionary } from "@/content/dictionary"
import { buildSapVsMicrosoftJsonLd } from "@/lib/sap-vs-microsoft-jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"
import { pairPath } from "@/lib/growth-routes"

/**
 * ENGLISH SAP vs Microsoft Insights article - /insights/sap-vs-microsoft.
 *
 * Counterpart: /sr/insights/sap-vs-microsoft, from the route map. Both halves went live
 * together, so hreflang, the language switcher and the sitemap all see a complete pair.
 *
 * The page is a server component with a client form inside it, so the route stays statically
 * prerendered.
 */

const PATH = pairPath("insights-sap-vs-microsoft", "en")
const dictionary = getDictionary("en")
const content = dictionary.sapVsMicrosoft

export const metadata: Metadata = {
  // The title carries no brand, so the shared helper appends " | Infinus" once.
  ...generatePageMetadata(content.metadata.title, content.metadata.description, PATH),
  alternates: localeAlternatesMetadata(PATH),
}

export default function EnglishSapVsMicrosoftPage() {
  return (
    <SapVsMicrosoftPage
      content={content}
      contactForm={dictionary.home.contactShort}
      jsonLd={buildSapVsMicrosoftJsonLd("en")}
    />
  )
}
