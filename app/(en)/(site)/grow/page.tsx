import type { Metadata } from "next"
import { GrowLandingPage } from "@/components/pages/GrowLandingPage"
import { getDictionary } from "@/content/dictionary"
import { buildGrowJsonLd } from "@/lib/growth-jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"
import { counterpartFor } from "@/lib/locale-routes"
import { pairPath } from "@/lib/growth-routes"

/**
 * ENGLISH GROW landing page — /grow, the English half of the `grow` pair.
 *
 * This URL served SERBIAN before the bilingual rollout. It is English now, by owner decision:
 * English is the site's unprefixed default language and this page keeps the clean campaign
 * path, while the Serbian content it used to serve moved to /sr/grow. An old inbound link
 * therefore lands here, in English, one switcher click away from the Serbian original — an
 * accepted trade for a URL architecture where the path says which language it is.
 *
 * The counterpart still comes from content/routes.ts rather than from prefixing, because
 * other pairs in that map do not follow the prefix rule and a derivation that is right most
 * of the time is the wrong mechanism for advertising URLs to crawlers.
 *
 * The body comes from components/pages/GrowLandingPage.tsx, the same component /sr/grow
 * renders. The copy is a DRAFT pending owner review; see content/en/growth.ts.
 */

const PATH = pairPath("grow", "en")
const dictionary = getDictionary("en").growth
const content = dictionary.grow

export const metadata: Metadata = {
  ...generatePageMetadata(content.metadata.title, content.metadata.description, PATH),
  alternates: localeAlternatesMetadata(PATH),
}

export default function EnglishGrowPage() {
  return (
    <GrowLandingPage
      copy={content}
      shared={dictionary.shared}
      trust={getDictionary("en").home.trust}
      jsonLd={buildGrowJsonLd("en", PATH)}
      cfoHref={pairPath("grow-cfo", "en")}
      ceoHref={pairPath("grow-ceo", "en")}
    />
  )
}
