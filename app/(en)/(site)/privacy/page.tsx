import type { Metadata } from "next"
import { PrivacyPolicyPage } from "@/components/pages/PrivacyPolicyPage"
import { privacyPolicyDocumentFor } from "@/lib/legal-documents"
import { SITE_CONFIG } from "@/lib/jsonld"
import { LOCALE_META } from "@/lib/i18n"

/**
 * ENGLISH Privacy Policy — the canonical English legal URL.
 *
 * /privacy was a page before Phase C, became a permanent redirect to the bilingual
 * /politika-privatnosti, and is now a real page again — this time English ONLY. The redirect
 * runs the other way: /politika-privatnosti -> /privacy, permanent, one hop.
 *
 * ── Deliberately NOT indexable, and deliberately NOT hreflang-paired ────────────
 * `noindex, follow` and outside the sitemap, preserving the conservative treatment this
 * legal document has always had. It DOES have a real Serbian counterpart at
 * /sr/politika-privatnosti and the EN|SR switcher moves between them, which is why
 * content/routes.ts marks the pair `locale-linked` rather than `translatable`: navigable,
 * but not indexable, and therefore no hreflang on either side.
 *
 * `alternates` carries a canonical and NOTHING else — no `languages`. Using
 * localeAlternatesMetadata here would emit hreflang, which is the one thing this pair must
 * not do.
 *
 * The metadata is hand-written rather than run through generatePageMetadata, exactly as the
 * page it replaces was: that helper sets `robots: index,follow` and a social block this page
 * does not want.
 */

const CANONICAL = `${SITE_CONFIG.url}/privacy`
const document = privacyPolicyDocumentFor("en")

export const metadata: Metadata = {
  // `absolute` because the root template would otherwise append "| Infinus" — harmless, but
  // this title is deliberately the document's own name.
  title: { absolute: "Privacy Policy | Infinus" },
  description:
    "Privacy Policy of INFINUS d.o.o. — how we collect, use and protect personal data.",
  alternates: { canonical: CANONICAL },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Privacy Policy | Infinus",
    description:
      "Privacy Policy of INFINUS d.o.o. — how we collect, use and protect personal data.",
    url: CANONICAL,
    siteName: SITE_CONFIG.name,
    type: "website",
    // Stated explicitly. Defining `openGraph` at all REPLACES the root's block, so omitting
    // this drops og:locale entirely — which is how /sr/projectpulse/brochure once ended up
    // advertising the wrong locale. Every other English page emits en_US; so does this one,
    // and the Serbian half states sr_RS for the same reason.
    locale: LOCALE_META.en.ogLocale,
  },
}

export default function EnglishPrivacyPolicyPage() {
  return <PrivacyPolicyPage document={document} />
}
