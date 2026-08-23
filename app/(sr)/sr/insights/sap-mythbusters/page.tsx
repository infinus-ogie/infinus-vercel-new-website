import type { Metadata } from "next"
import { MythBustersPage } from "@/components/pages/MythBustersPage"
import { getDictionary } from "@/content/dictionary"
import { buildMythBustersJsonLd } from "@/lib/mythbusters-jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"
import { pairPath } from "@/lib/growth-routes"
import { LOCALE_META } from "@/lib/i18n"

/**
 * SERBIAN SAP MythBusting landing page — /sr/insights/sap-mythbusters.
 *
 * `(sr)` is a route group and contributes nothing to the URL; the literal `sr` segment
 * produces the prefix. Sitting inside the Serbian root means the document emits
 * <html lang="sr-Latn"> with no per-page work, and app/(sr)/sr/layout.tsx already supplies
 * the site chrome and the sr_RS OpenGraph default for the whole subtree.
 *
 * The slug is NOT translated. Only /privacy has a translated slug, because its two documents
 * were approved independently as separate legal texts; /sr/case-study and
 * /sr/sap-packaged-solutions keep their English segments for the same reason this one does.
 *
 * The copy is the client's own Serbian document, not a translation of the English page — see
 * content/sr/mythbusters.ts.
 */

const PATH = pairPath("insights-sap-mythbusters", "sr")
const content = getDictionary("sr").mythBusters

const base = generatePageMetadata(content.metadata.title, content.metadata.description, PATH)

export const metadata: Metadata = {
  ...base,
  // As on the English half: the supplied title already carries the brand.
  title: { absolute: content.metadata.title },
  alternates: localeAlternatesMetadata(PATH),
  openGraph: {
    ...base.openGraph,
    // The one field the shared English-defaulted helper gets wrong for this locale.
    locale: LOCALE_META.sr.ogLocale,
  },
}

export default function SerbianMythBustersPage() {
  return (
    <MythBustersPage
      content={content}
      locale="sr"
      jsonLd={buildMythBustersJsonLd("sr")}
    />
  )
}
