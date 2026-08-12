/**
 * Serbian chrome strings (Latin script, matching <html lang="sr-Latn">).
 *
 * ── Provenance, stated plainly ──────────────────────────────────────────────────
 * "Srpski" is the existing endonym already used in LOCALE_META.sr. The other three are
 * NEW interface micro-copy written for this phase — standard, unambiguous UI terms, not
 * marketing language and not translated from any approved document. They are UNREVIEWED
 * and flagged for owner sign-off before anything renders them.
 *
 * They are safe to land now because nothing consumes them: no component that reads this
 * file is mounted, so these strings appear in zero bytes of output. If the owner prefers
 * different wording, changing it here is a one-line edit with no output consequences.
 *
 * This file is NOT where the site's Serbian marketing copy will be written. Approved
 * campaign copy for /sr pages arrives in its own reviewed phase.
 */

import type { CommonDictionary } from '../dictionary'

export const common: CommonDictionary = {
  localeName: 'Srpski',
  switchLanguage: 'Promeni jezik',
  breadcrumbHome: 'Početna',
  skipToContent: 'Pređi na sadržaj',
}
