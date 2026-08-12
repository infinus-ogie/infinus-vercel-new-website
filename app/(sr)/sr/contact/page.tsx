import type { Metadata } from "next"
import { ContactPage } from "@/components/pages/ContactPage"
import { getDictionary } from "@/content/dictionary"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"
import { createSimplePageConfig } from "@/lib/auto-jsonld"
import { LOCALE_META } from "@/lib/i18n"

/**
 * SERBIAN Contact page — /sr/contact. The site's first real /sr route.
 *
 * ── Why it lives at app/(sr)/sr/contact/ ────────────────────────────────────────
 * `(sr)` is a route group and contributes nothing to the URL; the literal `sr` segment is
 * what produces /sr/contact. Sitting inside the Serbian root means the document emits
 * <html lang="sr-Latn"> with no per-page work, exactly like the legacy campaign pages.
 *
 * No middleware, no [locale] segment, no request-time locale detection. The locale is a
 * property of this file's position in the tree, decided at build time, so the route stays
 * statically prerendered.
 *
 * ── What is shared and what is not ──────────────────────────────────────────────
 * The body, the form and every behaviour come from components/pages/ContactPage.tsx — the
 * same component /contact renders. This file supplies only the Serbian dictionary, the
 * Serbian metadata and the Serbian JSON-LD input.
 *
 * The visible copy is a DRAFT pending owner approval; see content/sr/contact.ts.
 */

const PATH = "/sr/contact"
const content = getDictionary("sr").contact

const base = generatePageMetadata(content.metadata.title, content.metadata.description, PATH)

export const metadata: Metadata = {
  ...base,
  // Self-canonical https://www.infinus.co/sr/contact, plus the same reciprocal
  // en / sr-Latn / x-default set that /contact emits. Both halves of a pair must advertise
  // the identical set or search engines ignore the annotation.
  alternates: localeAlternatesMetadata(PATH),
  openGraph: {
    ...base.openGraph,
    // The one field the shared English-defaulted helper gets wrong for this locale.
    locale: LOCALE_META.sr.ogLocale,
  },
}

/**
 * JSON-LD input.
 *
 * `inLanguage` is the existing Serbian value the campaign pages already use, so structured
 * data stays consistent across the Serbian side of the site.
 *
 * NO FAQ block, unlike the English page: those four English entries carry placeholder
 * contact data (a "+1 (555) 123-4567" number, "9 AM to 6 PM EST" hours and an address that
 * is not the one on the page). Translating known-wrong details into a second language would
 * multiply the problem, and inventing correct Serbian ones would be fabrication. Flagged for
 * the owner instead.
 */
const pageConfig = createSimplePageConfig(PATH, content.metadata.title, content.metadata.description, {
  language: LOCALE_META.sr.jsonLdLanguage,
  articleAbout: ["SAP usluge", "SAP konsalting", "SAP podrška", "Kontakt"],
})

export default function SerbianContactPage() {
  return <ContactPage content={content} jsonLd={pageConfig} />
}
