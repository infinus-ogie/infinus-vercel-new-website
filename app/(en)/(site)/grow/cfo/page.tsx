import type { Metadata } from "next"
import { GrowRolePage } from "@/components/pages/GrowRolePage"
import { getDictionary } from "@/content/dictionary"
import { buildRoleJsonLd } from "@/lib/growth-jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"
import { pairPath, ROLE_HERO_IMAGE } from "@/lib/growth-routes"

/**
 * ENGLISH SAP for CFOs — the English half of the `grow-cfo` pair.
 *
 * Counterpart: /sr/grow/cfo, from the route map. This URL served Serbian before the bilingual
 * rollout — see the parent page for why it is English now.
 *
 * The body comes from components/pages/GrowRolePage.tsx, which the Serbian half and the other
 * role page also render. The copy is a DRAFT pending owner review.
 */

const PATH = pairPath("grow-cfo", "en")
const dictionary = getDictionary("en").growth
const content = dictionary.cfo

export const metadata: Metadata = {
  ...generatePageMetadata(content.metadata.title, content.metadata.description, PATH),
  alternates: localeAlternatesMetadata(PATH),
}

export default function EnglishCFOPage() {
  return (
    <GrowRolePage
      copy={content}
      shared={dictionary.shared}
      trust={getDictionary("en").home.trust}
      jsonLd={buildRoleJsonLd("en", "cfo", PATH, pairPath("grow", "en"))}
      jsonLdId="cfo-page-jsonld"
      bgImage={ROLE_HERO_IMAGE.cfo}
      role="cfo"
      faqId="faq-cfo"
    />
  )
}
