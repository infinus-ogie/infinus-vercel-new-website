import type { Metadata } from "next"
import { FaqPage } from "@/components/pages/FaqPage"
import { getDictionary } from "@/content/dictionary"
import { buildFaqPageConfig } from "@/lib/faq-jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"
import { LOCALE_META } from "@/lib/i18n"

/**
 * SERBIAN FAQ page — /sr/faq.
 *
 * Same architecture as /sr: inside the Serbian root, statically prerendered, sharing
 * components/pages/FaqPage.tsx with `/faq`. Only the dictionary, metadata and JSON-LD input
 * differ.
 *
 * Its FAQPage structured data is built from the SERBIAN questions and answers — the same
 * array the accordion renders — so the schema never advertises English content on a Serbian
 * page.
 *
 * lib/navbar-surface.ts classifies this page as light-surface automatically through the
 * shared `faq` page id, with no path-specific exception.
 *
 * The visible copy is a DRAFT pending owner approval; see content/sr/faq.ts.
 */

const PATH = "/sr/faq"
const content = getDictionary("sr").faq

const base = generatePageMetadata(content.metadata.title, content.metadata.description, PATH)

export const metadata: Metadata = {
  ...base,
  alternates: localeAlternatesMetadata(PATH),
  openGraph: {
    ...base.openGraph,
    locale: LOCALE_META.sr.ogLocale,
  },
}

const pageConfig = buildFaqPageConfig("sr")

export default function SerbianFaqPage() {
  return <FaqPage content={content} jsonLd={pageConfig} />
}
