import type { Metadata } from "next"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { LegalDocument } from "@/components/legal/LegalDocument"
import { PRIVACY_POLICY_DOCUMENTS } from "@/content/legal/politika-privatnosti"
import { SITE_CONFIG } from "@/lib/jsonld"

/**
 * The approved bilingual Privacy Policy.
 *
 * ONE page holding two independently approved legal documents (Serbian and English).
 * It is deliberately NOT a /sr ↔ /en pair: no hreflang, no alternates, no locale
 * routing. Each document is wrapped in its own <section lang="…"> so assistive
 * technology and crawlers read each in the right language, with in-page anchors to jump
 * between them.
 *
 * SEO: `noindex, follow` and excluded from the sitemap — an explicit product decision
 * that preserves the conservative behaviour of the /privacy page it replaces. This is a
 * publicly reachable legal document, not an SEO landing page.
 */

const CANONICAL = `${SITE_CONFIG.url}/politika-privatnosti`

export const metadata: Metadata = {
  title: "Politika privatnosti | Privacy Policy",
  description:
    "Politika privatnosti društva INFINUS d.o.o. — Privacy Policy of INFINUS d.o.o. Serbian and English versions.",
  alternates: {
    canonical: CANONICAL,
  },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Politika privatnosti | Privacy Policy",
    description:
      "Politika privatnosti društva INFINUS d.o.o. — Privacy Policy of INFINUS d.o.o. Serbian and English versions.",
    url: CANONICAL,
    siteName: SITE_CONFIG.name,
    type: "website",
  },
}

export default function PolitikaPrivatnostiPage() {
  return (
    <Section className="pt-32">
      <Container>
        <div className="mx-auto max-w-3xl">
          {/* In-page language switch. Not the site-wide EN|SR switcher — that arrives
              with the locale architecture in a later phase. */}
          <nav aria-label="Language" className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            {PRIVACY_POLICY_DOCUMENTS.map((doc, i) => (
              <span key={doc.anchor} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="text-slate-300">|</span>}
                <a
                  href={`#${doc.anchor}`}
                  lang={doc.lang}
                  className="font-medium text-[#0a6ed1] underline underline-offset-4 hover:text-[#00144a]"
                >
                  {doc.label}
                </a>
              </span>
            ))}
          </nav>

          {PRIVACY_POLICY_DOCUMENTS.map((doc, i) => (
            <div key={doc.anchor} className={i > 0 ? "mt-16 border-t border-slate-200 pt-12" : undefined}>
              <LegalDocument document={doc} />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
