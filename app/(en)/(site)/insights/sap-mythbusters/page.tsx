import type { Metadata } from "next"
import { MythBustersPage } from "@/components/pages/MythBustersPage"
import { getDictionary, enMythBustersLayout } from "@/content/dictionary"
import { buildMythBustersJsonLd } from "@/lib/mythbusters-jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"
import { pairPath } from "@/lib/growth-routes"

/**
 * ENGLISH SAP MythBusting landing page — /insights/sap-mythbusters.
 *
 * `/insights` was an unused URL space. The client's own source document names this path as
 * the English canonical, and the Serbian half follows the site's prefix convention.
 *
 * Both halves went live together: a one-sided pair is what the route map's `planned` status
 * exists to keep out of hreflang, the switcher and the sitemap.
 *
 * The page is a server component with a client form inside it, so the route stays statically
 * prerendered — no middleware, no request-time locale work, nothing new for the static
 * architecture to accommodate.
 */

const PATH = pairPath("insights-sap-mythbusters", "en")
const content = getDictionary("en").mythBusters
// Narrowed once at module scope: a dictionary that stops carrying the English layout is a
// BUILD failure, not a page that renders half of itself.
const layout = enMythBustersLayout(content)

const base = generatePageMetadata(content.metadata.title, content.metadata.description, PATH)

export const metadata: Metadata = {
  ...base,
  // The client's SEO title already ends in "| Infinus". Without `absolute` the root layout's
  // `%s | Infinus` template brands the tab twice — seo:assert-build fails on exactly that.
  title: { absolute: content.metadata.title },
  alternates: localeAlternatesMetadata(PATH),
}

export default function EnglishMythBustersPage() {
  return (
    <MythBustersPage
      content={content}
      layout={layout}
      jsonLd={buildMythBustersJsonLd("en")}
    />
  )
}
