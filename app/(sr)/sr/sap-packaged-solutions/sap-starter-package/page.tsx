import type { Metadata } from "next"
import { SapStarterPackagePage } from "@/components/pages/SapStarterPackagePage"
import { getDictionary } from "@/content/dictionary"
import { buildSapStarterPackageConfig } from "@/lib/sap-starter-package-jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"
import { LOCALE_META } from "@/lib/i18n"

/**
 * SERBIAN SAP Starter Package — /sr/sap-packaged-solutions/sap-starter-package.
 *
 * The path keeps the English `sap-packaged-solutions` segment. That is deliberate: the
 * segment is part of the offering's name as Infinus sells it, the English route is already
 * indexed under it, and translating URL segments would fork the route-pair map's one-to-one
 * shape for no SEO gain. content/routes.ts is the source of truth for this path.
 *
 * The body comes from components/pages/SapStarterPackagePage.tsx — the same component the
 * English half renders — including the brochure language modal, which now takes its copy
 * from this locale's dictionary instead of being hardcoded English.
 *
 * The visible copy is a DRAFT pending owner approval; see content/sr/sap-starter-package.ts.
 */

const PATH = "/sr/sap-packaged-solutions/sap-starter-package"
const content = getDictionary("sr").sapStarterPackage

const base = generatePageMetadata(content.metadata.title, content.metadata.description, PATH)

export const metadata: Metadata = {
  ...base,
  alternates: localeAlternatesMetadata(PATH),
  openGraph: {
    ...base.openGraph,
    locale: LOCALE_META.sr.ogLocale,
  },
}

export default function SerbianSapStarterPackagePage() {
  return <SapStarterPackagePage content={content} jsonLd={buildSapStarterPackageConfig("sr")} />
}
