import type { Metadata } from "next"
import { ProfessionalServicesPage } from "@/components/pages/ProfessionalServicesPage"
import { getDictionary } from "@/content/dictionary"
import { buildProfessionalServicesJsonLd } from "@/lib/growth-jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"
import { pairPath } from "@/lib/growth-routes"

/**
 * ENGLISH Professional Services page — the English half of the `professional-services` pair.
 *
 * Counterpart: /sr/professional-services, from the route map. This URL served Serbian before
 * the bilingual rollout; the Serbian content moved under /sr and English took the clean path,
 * like every other pair on the site.
 *
 * Its copy is its own — nothing is shared with /projectpulse, which addresses the same
 * audience with a different offering. The copy is a DRAFT pending owner review.
 */

const PATH = pairPath("professional-services", "en")
const dictionary = getDictionary("en").growth
const content = dictionary.professionalServices

export const metadata: Metadata = {
  ...generatePageMetadata(content.metadata.title, content.metadata.description, PATH),
  alternates: localeAlternatesMetadata(PATH),
}

export default function EnglishProfessionalServicesPage() {
  return (
    <ProfessionalServicesPage
      copy={content}
      shared={dictionary.shared}
      trust={getDictionary("en").home.trust}
      jsonLd={buildProfessionalServicesJsonLd("en", PATH)}
    />
  )
}
