import type { Metadata } from "next"
import { MythBustersPageSr } from "@/components/pages/MythBustersPageSr"
import { getDictionary, srMythBustersLayout } from "@/content/dictionary"
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
 * ── This half does NOT share the English page's component ───────────────────────
 * Every other locale pair on this site renders one component twice. This one does not: the
 * client sent a NEW Serbian document ("LP_copy_structure_INFINUS_RS.docx") with a different
 * conversion structure — a split hero carrying the form and an e-book asset card, a
 * one-line trust bar, four myth/fact previews instead of ten myth statements, a real FAQ,
 * and a second form at the bottom.
 *
 * That is a different page, not a translation, so it has its own component and its own
 * layout shape. See components/pages/MythBustersPageSr.tsx and the union in
 * content/dictionary.ts.
 *
 * The SEO title and description still come from the OLDER "srp. verzija.docx" — the newer
 * LP document supplies none.
 */

const PATH = pairPath("insights-sap-mythbusters", "sr")
const content = getDictionary("sr").mythBusters
// Narrowed once at module scope — see the English half.
const layout = srMythBustersLayout(content)

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
    <MythBustersPageSr
      content={content}
      layout={layout}
      jsonLd={buildMythBustersJsonLd("sr")}
    />
  )
}
