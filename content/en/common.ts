/**
 * English chrome strings.
 *
 * Deliberately tiny — see content/dictionary.ts for why. Nothing here is rendered in this
 * phase: no component that consumes it is mounted.
 *
 * The two values that DO exist elsewhere on the site today are reproduced verbatim rather
 * than reworded, so that wiring this up later cannot change visible copy:
 *   · "Home"    — lib/breadcrumbs.ts
 *   · "English" — LOCALE_META.en.endonym in lib/i18n.ts
 */

import type { CommonDictionary } from '../dictionary'

export const common: CommonDictionary = {
  localeName: 'English',
  switchLanguage: 'Change language',
  breadcrumbHome: 'Home',
  skipToContent: 'Skip to content',
}
