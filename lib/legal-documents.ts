/**
 * Picking the approved legal document for a locale.
 *
 * content/legal/politika-privatnosti.ts holds the two documents in an array, tagged with a
 * BCP-47 `lang`. The route files must not index into that array by position: the order is an
 * artefact of the source .docx, and `PRIVACY_POLICY_DOCUMENTS[1]` silently becoming the wrong
 * language is exactly the kind of mistake that would publish Serbian legal text on the
 * English URL.
 *
 * So the lookup is by language tag, and a miss THROWS at build time rather than falling back.
 * A missing legal document must fail the build, never render an empty page or the other
 * language.
 */

import { PRIVACY_POLICY_DOCUMENTS, type LegalDocument } from '@/content/legal/politika-privatnosti'
import { LOCALE_META, type Locale } from '@/lib/i18n'

export function privacyPolicyDocumentFor(locale: Locale): LegalDocument {
  // The document's own `lang` uses the same BCP-47 tags as LOCALE_META, so the locale model
  // is the single source of truth for which tag belongs to which locale.
  const tag = LOCALE_META[locale].bcp47
  for (let i = 0; i < PRIVACY_POLICY_DOCUMENTS.length; i += 1) {
    if (PRIVACY_POLICY_DOCUMENTS[i].lang === tag) return PRIVACY_POLICY_DOCUMENTS[i]
  }
  throw new Error(
    `No approved Privacy Policy document for locale "${locale}" (looked for lang="${tag}"). ` +
      'content/legal/politika-privatnosti.ts must contain one document per locale.'
  )
}
