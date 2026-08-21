import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { LegalDocument } from "@/components/legal/LegalDocument"
import type { LegalDocument as LegalDocumentData } from "@/content/legal/politika-privatnosti"

/**
 * The Privacy Policy body, shared by /privacy and /sr/politika-privatnosti.
 *
 * ── One document per page ──────────────────────────────────────────────────────
 * This replaces the single bilingual /politika-privatnosti URL, which rendered BOTH
 * approved legal documents stacked in one page with in-page anchors to jump between them.
 * That made sense before the site had locales. It does not now: the site follows the
 * visitor's language everywhere else, and a legal document is the last place to make
 * someone scroll past the wrong language to find theirs.
 *
 * So each page renders exactly ONE document. The in-page Srpski/English anchor nav is gone —
 * there is no second document on the page to jump to — and moving between languages is the
 * global EN|SR switcher's job, exactly as on every other page.
 *
 * ── The legal text is not this component's business ────────────────────────────
 * `document` comes straight from content/legal/politika-privatnosti.ts, which is approved
 * copy under an explicit do-not-edit rule. The two documents there are INDEPENDENTLY
 * approved, not a translation pair — neither was translated from the other. This component
 * chooses which one to render and owns nothing but presentation, and the presentation it
 * uses is the same LegalDocument renderer as before, unchanged.
 *
 * A server component: it reads no request state, so both routes stay statically prerendered.
 */
export interface PrivacyPolicyPageProps {
  document: LegalDocumentData
}

export function PrivacyPolicyPage({ document }: PrivacyPolicyPageProps) {
  return (
    <Section className="pt-32">
      <Container>
        <div className="mx-auto max-w-3xl">
          <LegalDocument document={document} />
        </div>
      </Container>
    </Section>
  )
}
