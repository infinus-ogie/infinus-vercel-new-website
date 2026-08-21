import { SapStarterPackagePage } from "@/components/pages/SapStarterPackagePage"
import { getDictionary } from "@/content/dictionary"
import { buildSapStarterPackageConfig } from "@/lib/sap-starter-package-jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"

/**
 * ENGLISH SAP Starter Package — the English half of the sap-starter-package pair.
 *
 * Phase H3 changed how this file is assembled, not what it renders. The body moved to
 * components/pages/SapStarterPackagePage.tsx (shared with the Serbian half) and the
 * `PAGE_CONTENT` object moved to content/en/sap-starter-package.ts verbatim.
 *
 * That object's rule travels with it: the copy comes from the approved DOCX and is not
 * edited here. See the header of content/en/sap-starter-package.ts.
 *
 * The ONE intentional head change: `alternates` now carries real reciprocal hreflang,
 * because /sr/sap-packaged-solutions/sap-starter-package went live in this phase.
 */

const PATH = "/sap-packaged-solutions/sap-starter-package"
const content = getDictionary("en").sapStarterPackage

export const metadata = {
  ...generatePageMetadata(content.metadata.title, content.metadata.description, PATH),
  // `documentTitle` is the brand-free page title; the root layout's "%s | Infinus" template
  // supplies the brand once. A plain string (not `absolute`) is what lets the template apply,
  // and it is the same mechanism the brochure pages use.
  //
  // This deliberately overrides the `title` that generatePageMetadata put in the spread
  // above. That helper normalises `metadata.title`, which still carries the brand mid-string
  // because og:title, twitter:title and the JSON-LD need it there — and those keep it.
  title: content.metadata.documentTitle,
  alternates: localeAlternatesMetadata(PATH),
}

export default function EnglishSapStarterPackagePage() {
  return <SapStarterPackagePage content={content} jsonLd={buildSapStarterPackageConfig("en")} />
}
