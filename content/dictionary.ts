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
import { contact as enContact } from './en/contact'
import { contact as srContact } from './sr/contact'

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

/**
 * Every user-facing string on the Contact page, in ONE shape both locales satisfy.
 *
 * Extracted mechanically from the live English page and form
 * (app/(en)/(site)/contact/page.tsx + components/ui/contact-2.tsx) — not from any earlier
 * audit document. The English values are verbatim, so the refactor cannot change a single
 * visible character on /contact.
 */
export interface ContactDictionary {
  readonly metadata: {
    readonly title: string
    readonly description: string
  }
  /** The page's h1 and lede, passed into the form section. */
  readonly hero: {
    readonly heading: string
    readonly description: string
  }
  /**
   * The contact-details list beside the form.
   *
   * `email`, `web` and `address` are DATA, not copy: the mailbox and domain are identical
   * in both locales. Only the address is locale-specific, because the approved Serbian
   * legal text writes it in Serbian with correct diacritics.
   */
  readonly details: {
    readonly heading: string
    readonly emailLabel: string
    readonly addressLabel: string
    readonly webLabel: string
    readonly email: string
    readonly address: string
    readonly web: { readonly label: string; readonly url: string }
  }
  readonly form: {
    readonly nameLabel: string
    readonly namePlaceholder: string
    readonly phoneLabel: string
    readonly phonePlaceholder: string
    readonly emailLabel: string
    readonly emailPlaceholder: string
    readonly subjectLabel: string
    readonly subjectPlaceholder: string
    readonly messageLabel: string
    readonly messagePlaceholder: string
    readonly attachmentLabel: string
    readonly attachmentHint: string
    readonly submit: string
    readonly submitting: string
  }
  /** Zod messages. The RULES (min lengths, email format) stay shared and unchanged. */
  readonly validation: {
    readonly name: string
    readonly email: string
    readonly subject: string
    readonly message: string
  }
  readonly success: {
    readonly heading: string
    readonly body: string
    readonly sendAnother: string
    readonly attachmentNoticeHeading: string
    readonly attachmentNoticeBody: string
  }
  /**
   * Submission-failure copy.
   *
   * KNOWN BUG, deliberately NOT fixed here: the component sets `errors.general` but never
   * renders it, so neither string reaches a user today. They are translated and wired
   * through anyway so that fixing the bug later is a rendering change only, with no copy
   * decision attached.
   */
  readonly errors: {
    readonly submitFailed: string
    readonly unexpected: string
  }
  /**
   * The privacy acknowledgement, split so the link text is a separate string.
   *
   * OWNER-APPROVED in BOTH languages. Informational — it is NOT the cookie-consent
   * mechanism, so "agree"/"accept"/"pristajete" phrasings are wrong here.
   */
  readonly privacy: {
    readonly before: string
    readonly linkText: string
    readonly after: string
    readonly href: string
  }
  readonly cta: {
    readonly heading: string
    readonly body: string
    /** Exactly three cards, as the live page renders. The tuple type enforces that. */
    readonly cards: readonly [ContactCtaCard, ContactCtaCard, ContactCtaCard]
  }
}

export interface ContactCtaCard {
  readonly title: string
  readonly body: string
}

/** Every namespace a locale must provide. Add a namespace here and both locales break. */
export interface Dictionary {
  readonly common: CommonDictionary
  readonly contact: ContactDictionary
}

/**
 * Static registry. `Record<Locale, Dictionary>` is what makes a missing locale a compile
 * error; `satisfies` keeps that check while preserving the literal types for callers.
 */
export const dictionaries = {
  en: { common: enCommon, contact: enContact },
  sr: { common: srCommon, contact: srContact },
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

/** Namespaces every locale must provide, as literals for the runtime completeness test. */
export const DICTIONARY_NAMESPACES = ['common', 'contact'] as const

export type DictionaryNamespace = (typeof DICTIONARY_NAMESPACES)[number]

/**
 * Every leaf key path in a namespace, sorted — e.g. `form.nameLabel`, `cta.cards.0.title`.
 *
 * The types already forbid a missing key, but `readonly x?: string` in an interface would
 * slip past them. test/i18n/dictionary.test.ts compares these paths across locales so an
 * optional key cannot open that hole.
 */
export function dictionaryKeyReport(namespace: DictionaryNamespace = 'common'): Record<Locale, string[]> {
  const report = {} as Record<Locale, string[]>
  for (let i = 0; i < LOCALES.length; i += 1) {
    const locale = LOCALES[i]
    report[locale] = leafPaths(dictionaries[locale][namespace] as unknown as Record<string, unknown>).sort()
  }
  return report
}

/** Depth-first leaf paths of a plain nested object of strings. */
function leafPaths(value: Record<string, unknown>, prefix = ''): string[] {
  const out: string[] = []
  const keys = Object.keys(value)
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]
    const child = value[key]
    const pathHere = prefix === '' ? key : `${prefix}.${key}`
    if (child !== null && typeof child === 'object') {
      out.push.apply(out, leafPaths(child as Record<string, unknown>, pathHere))
    } else {
      out.push(pathHere)
    }
  }
  return out
}
