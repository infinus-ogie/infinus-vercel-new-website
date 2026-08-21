import { FaqPage } from "@/components/pages/FaqPage"
import { getDictionary } from "@/content/dictionary"
import { buildFaqPageConfig } from "@/lib/faq-jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"

/**
 * ENGLISH FAQ page — the English half of the FAQ locale pair.
 *
 * Phase H1 moved the body to components/pages/FaqPage.tsx (shared with /sr/faq) and the
 * twelve Q&A plus the surrounding copy to content/en/faq.ts verbatim. Visible English copy
 * is unchanged.
 *
 * The ONE intentional head change: real reciprocal hreflang, now that /sr/faq exists.
 */

const PATH = "/faq"
const content = getDictionary("en").faq

export const metadata = {
  ...generatePageMetadata(content.metadata.title, content.metadata.description, PATH),
  alternates: localeAlternatesMetadata(PATH),
}

const pageConfig = buildFaqPageConfig("en")

export default function EnglishFaqPage() {
  return <FaqPage content={content} jsonLd={pageConfig} />
}
