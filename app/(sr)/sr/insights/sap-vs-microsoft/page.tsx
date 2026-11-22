import type { Metadata } from "next"
import { SapVsMicrosoftPage } from "@/components/pages/SapVsMicrosoftPage"
import { getDictionary } from "@/content/dictionary"
import { buildSapVsMicrosoftJsonLd } from "@/lib/sap-vs-microsoft-jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"
import { pairPath } from "@/lib/growth-routes"
import { LOCALE_META } from "@/lib/i18n"

/**
 * SERBIAN SAP vs Microsoft Insights article - /sr/insights/sap-vs-microsoft.
 *
 * `(sr)` is a route group and contributes nothing to the URL; the literal `sr` segment
 * produces the prefix. Sitting inside the Serbian root means the document emits
 * <html lang="sr-Latn"> with no per-page work.
 *
 * The slug is NOT translated, like /sr/insights/sap-mythbusters: the client's Serbian
 * document names this exact path.
 */

const PATH = pairPath("insights-sap-vs-microsoft", "sr")
const dictionary = getDictionary("sr")
const content = dictionary.sapVsMicrosoft

const base = generatePageMetadata(content.metadata.title, content.metadata.description, PATH)

export const metadata: Metadata = {
  ...base,
  alternates: localeAlternatesMetadata(PATH),
  openGraph: {
    ...base.openGraph,
    // The one field the shared English-defaulted helper gets wrong for this locale.
    locale: LOCALE_META.sr.ogLocale,
  },
}

export default function SerbianSapVsMicrosoftPage() {
  return (
    <SapVsMicrosoftPage
      content={content}
      contactForm={dictionary.home.contactShort}
      jsonLd={buildSapVsMicrosoftJsonLd("sr")}
      locale="sr"
    />
  )
}
