/**
 * TYPED DICTIONARY CONVENTION — the shape every future locale content file must satisfy.
 *
 * This file is the CONTRACT. The values live in content/en/ and content/sr/. It exists to
 * establish the pattern on a deliberately tiny surface; it is NOT a copy migration. The
 * site's existing page copy stays exactly where it is until a phase explicitly moves it.
 *
 * ── The rules the types enforce ─────────────────────────────────────────────────
 *
 *  1. One interface per namespace. A locale file is `const x: CommonDictionary = {…}`, so
 *     a MISSING key is a TypeScript error and a TYPO is a TypeScript error (excess
 *     property check on the object literal).
 *
 *  2. `Record<Locale, …>` on the registry, so adding a locale to lib/i18n.ts without
 *     adding its dictionary is a compile error, not a runtime hole.
 *
 *  3. NO FALLBACK. `getDictionary('sr')` returns the Serbian dictionary or does not
 *     compile. There is deliberately no `?? en` anywhere: an incomplete Serbian
 *     translation must break the build, never quietly render English text inside a
 *     `lang="sr-Latn"` document. Silent fallback is the failure mode this convention
 *     exists to make impossible.
 *
 *  4. Static registry, no dynamic import. `getDictionary` indexes a plain object built
 *     from static imports, so every locale's copy is statically analysable and the pages
 *     stay prerenderable. There is no lookup service, no async loading and nothing
 *     request-scoped.
 *
 *  5. Every value is a plain string. No interpolation syntax, no ICU messages, no
 *     runtime formatter. When a string needs a variable, add a function to the calling
 *     component — not a template language.
 *
 * ── What must NOT come in here ──────────────────────────────────────────────────
 *   · content/legal/politika-privatnosti.ts — frozen, independently approved legal text.
 *     It is not UI copy, it is not translated from anything, and it stays where it is.
 *   · components/consent/consent-copy.ts — already bilingual for the consent UI, which is
 *     shown on English and Serbian pages alike. Left in place; duplicating approved
 *     consent wording here would create two sources of truth.
 */

import { LOCALES, type Locale } from '@/lib/i18n'
import { common as enCommon } from './en/common'
import { common as srCommon } from './sr/common'

/**
 * Chrome strings that are not specific to any one page.
 *
 * Kept minimal on purpose — just enough to prove the pattern end to end. Nothing here is
 * rendered anywhere in this phase.
 */
export interface CommonDictionary {
  /** The language's own name, as shown in the language switcher. */
  readonly localeName: string
  /** Accessible label for the language switcher control. */
  readonly switchLanguage: string
  /** First breadcrumb item. lib/breadcrumbs.ts still hardcodes the English "Home". */
  readonly breadcrumbHome: string
  /** Skip link target description, for the shared site chrome. */
  readonly skipToContent: string
}

/** Every namespace a locale must provide. Add a namespace here and both locales break. */
export interface Dictionary {
  readonly common: CommonDictionary
}

/**
 * Static registry. `Record<Locale, Dictionary>` is what makes a missing locale a compile
 * error; `satisfies` keeps that check while preserving the literal types for callers.
 */
export const dictionaries = {
  en: { common: enCommon },
  sr: { common: srCommon },
} as const satisfies Record<Locale, Dictionary>

/**
 * The dictionary for a locale.
 *
 * Total by construction: the parameter is a `Locale` and the registry is a
 * `Record<Locale, Dictionary>`, so this cannot miss and never needs a fallback.
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

/**
 * The namespace key sets, for the runtime completeness test.
 *
 * The types already forbid a missing key, but `readonly x?: string` in the interface would
 * slip past them. test/i18n/dictionary.test.ts compares the actual key sets across locales
 * so an optional key cannot open that hole.
 */
export function dictionaryKeyReport(): Record<Locale, string[]> {
  const report = {} as Record<Locale, string[]>
  for (let i = 0; i < LOCALES.length; i += 1) {
    const locale = LOCALES[i]
    report[locale] = Object.keys(dictionaries[locale].common).sort()
  }
  return report
}
