import type { Metadata } from "next"
import { PrivacyPolicyPage } from "@/components/pages/PrivacyPolicyPage"
import { privacyPolicyDocumentFor } from "@/lib/legal-documents"
import { SITE_CONFIG } from "@/lib/jsonld"
import { LOCALE_META } from "@/lib/i18n"

/**
 * SERBIAN Politika privatnosti — /sr/politika-privatnosti.
 *
 * Inside the Serbian document root, so it emits <html lang="sr-Latn"> with no per-page work,
 * and it inherits og:locale sr_RS from app/(sr)/sr/layout.tsx. The override below is
 * therefore redundant today and kept deliberately: this page hand-writes its own openGraph
 * block (it needs a legal-specific title and url), and defining `openGraph` at all REPLACES
 * the inherited one wholesale — which is exactly how /sr/projectpulse/brochure ended up
 * advertising en_US. Stating the locale here keeps that impossible.
 *
 * The Serbian half of the `locale-linked` Privacy pair: a real counterpart for the EN|SR
 * switcher, `noindex, follow`, outside the sitemap, and NO hreflang. See the English half
 * and content/routes.ts.
 *
 * The URL keeps the Serbian slug "politika-privatnosti" — it is the document's own name in
 * Serbian, and it is the URL the previous bilingual page already used.
 */

const CANONICAL = `${SITE_CONFIG.url}/sr/politika-privatnosti`
const document = privacyPolicyDocumentFor("sr")

export const metadata: Metadata = {
  title: { absolute: "Politika privatnosti | Infinus" },
  description:
    "Politika privatnosti društva INFINUS d.o.o. — kako prikupljamo, koristimo i štitimo lične podatke.",
  alternates: { canonical: CANONICAL },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Politika privatnosti | Infinus",
    description:
      "Politika privatnosti društva INFINUS d.o.o. — kako prikupljamo, koristimo i štitimo lične podatke.",
    url: CANONICAL,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: LOCALE_META.sr.ogLocale,
  },
}

export default function SerbianPrivacyPolicyPage() {
  return <PrivacyPolicyPage document={document} />
}
