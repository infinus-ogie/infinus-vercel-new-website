import type { Metadata } from "next"
import { CareersPage } from "@/components/pages/CareersPage"
import { getDictionary } from "@/content/dictionary"
import { buildCareersJsonLd } from "@/lib/careers-jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"
import { pairPath } from "@/lib/growth-routes"
import { LOCALE_META } from "@/lib/i18n"

/**
 * SERBIAN Careers page — /sr/careers.
 *
 * `(sr)` is a route group and contributes nothing to the URL; the literal `sr` segment is
 * what produces the prefix. Sitting inside the Serbian root means the document emits
 * <html lang="sr-Latn"> with no per-page work, and app/(sr)/sr/layout.tsx already supplies
 * the site chrome and the sr_RS OpenGraph default for the whole subtree.
 *
 * No middleware, no [locale] segment, no request-time locale detection — the locale is a
 * property of this file's position in the tree, decided at build time, so the route stays
 * statically prerendered.
 *
 * The body comes from components/pages/CareersPage.tsx, the same component /careers
 * renders. This file supplies only the Serbian dictionary, metadata and JSON-LD input.
 *
 * The copy is the owner-approved Serbian application text, moved verbatim from the
 * homepage's `join` block — see content/sr/careers.ts.
 */

const PATH = pairPath("careers", "sr")
const content = getDictionary("sr").careers

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

export default function SerbianCareersPage() {
  return (
    <CareersPage
      content={content}
      trust={getDictionary("sr").home.trust}
      jsonLd={buildCareersJsonLd("sr")}
    />
  )
}
