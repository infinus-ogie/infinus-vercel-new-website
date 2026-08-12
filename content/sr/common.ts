/**
 * Serbian chrome strings (Latin script, matching <html lang="sr-Latn">).
 *
 * ── Provenance ──────────────────────────────────────────────────────────────────
 * OWNER-APPROVED (Phase G). "Srpski" is the existing endonym from LOCALE_META.sr; the
 * other three were drafted in Phase F as interface micro-copy and approved unchanged:
 *
 *   Promeni jezik · Početna · Pređi na sadržaj
 *
 * Do not reword them. `switchLanguage` is now live — it is the accessible label on the
 * language switcher rendered on /sr/contact.
 *
 * This file is chrome micro-copy only. Per-page Serbian copy lives beside it in its own
 * namespace (see ./contact.ts), and the site's shared Navbar/Footer labels are still
 * English pending the broader rollout.
 */

import type { CommonDictionary } from '../dictionary'

export const common: CommonDictionary = {
  localeName: 'Srpski',
  switchLanguage: 'Promeni jezik',
  breadcrumbHome: 'Početna',
  skipToContent: 'Pređi na sadržaj',
}
