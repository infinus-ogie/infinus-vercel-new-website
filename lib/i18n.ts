/**
 * LOCALE PRIMITIVES — the small, typed foundation the bilingual site is built on.
 *
 * Deliberately NOT an i18n framework. There is no message formatter, no plural engine,
 * no locale negotiation and no runtime lookup service. This module answers exactly four
 * questions and nothing else:
 *
 *   · which locales exist                → LOCALES / Locale
 *   · which one is the default           → DEFAULT_LOCALE
 *   · what language tokens does a locale
 *     use in each output surface         → LOCALE_META
 *   · what is the production origin      → ORIGIN
 *
 * ── Architectural constraints this module exists to preserve ────────────────────
 * The whole site is 100% statically prerendered (26 prerendered / 0 dynamic). Locale is
 * therefore a property of the ROUTE — decided at build time by which root layout owns the
 * file — never a property of the request. Consequences, all intentional:
 *
 *   · no middleware
 *   · no Accept-Language routing, no locale cookie routing
 *   · no cookies() / headers() / next/headers anywhere in a page or layout
 *   · nothing here reads or returns anything request-scoped
 *
 * ── Why several language tokens per locale ──────────────────────────────────────
 * The site already emits three DIFFERENT language tokens for the same locale, and they
 * are recorded here as they are, not normalised:
 *
 *   surface                     English   Serbian
 *   <html lang> (Phase E)       en        sr-Latn
 *   schema.org inLanguage       en-US     sr-Latn-RS
 *   og:locale                   en_US     sr_RS      (Serbian value not yet emitted)
 *
 * Unifying them would change live output, so this module describes reality and leaves the
 * existing values alone. `bcp47` is the one used for <html lang> and for hreflang.
 */

import { SITE_CONFIG } from './jsonld'

/**
 * The production origin, taken from the existing canonical source rather than restated,
 * so there is exactly one literal for it in production code.
 *
 * test/fixtures/routes.ts keeps its own INDEPENDENT literal on purpose — the A2 harness
 * must not derive its expectations from the code it tests. test/i18n/locale.test.ts
 * asserts the two agree.
 */
export const ORIGIN = SITE_CONFIG.url

/** Every supported locale. Order is significant only for stable test output. */
export const LOCALES = ['en', 'sr'] as const

export type Locale = (typeof LOCALES)[number]

/**
 * English. Also the `x-default` target for any future complete pair: it is the version
 * served at the unprefixed URL and the one addressed to an unmatched audience.
 */
export const DEFAULT_LOCALE: Locale = 'en'

export interface LocaleMeta {
  readonly locale: Locale
  /**
   * BCP-47 tag used for `<html lang="…">` and for hreflang. These are the values the two
   * Phase E root layouts already emit; changing either would be a visible SEO change.
   */
  readonly bcp47: string
  /**
   * URL prefix for NEW routes authored in this locale.
   *
   * NEVER applied automatically. Serbian counterpart URLs are declared explicitly in
   * content/routes.ts, because the four existing Serbian pages live at UNPREFIXED URLs
   * (/grow, /professional-services, …) and blind prefixing would misdescribe them.
   */
  readonly urlPrefix: '' | '/sr'
  /** `og:locale`. The Serbian value is declared but not emitted anywhere yet. */
  readonly ogLocale: string
  /** schema.org `inLanguage`, exactly as the existing JSON-LD already emits it. */
  readonly jsonLdLanguage: string
  /** The language's own name, for the language switcher. */
  readonly endonym: string
}

export const LOCALE_META: { readonly [L in Locale]: LocaleMeta } = {
  en: {
    locale: 'en',
    bcp47: 'en',
    urlPrefix: '',
    ogLocale: 'en_US',
    // SITE_CONFIG.language — the default already applied by lib/auto-jsonld.ts.
    jsonLdLanguage: 'en-US',
    endonym: 'English',
  },
  sr: {
    locale: 'sr',
    bcp47: 'sr-Latn',
    urlPrefix: '/sr',
    ogLocale: 'sr_RS',
    // Already passed explicitly by app/(sr)/**/_config.ts. Recorded, not changed.
    jsonLdLanguage: 'sr-Latn-RS',
    endonym: 'Srpski',
  },
}

/** Narrows an untrusted value to a supported locale. Anything else is rejected. */
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && LOCALES.indexOf(value as Locale) !== -1
}

/** The `<html lang>` / hreflang token for a locale. */
export function htmlLangFor(locale: Locale): string {
  return LOCALE_META[locale].bcp47
}

/** Inverse of {@link htmlLangFor}. Returns null for an unknown tag rather than guessing. */
export function localeFromHtmlLang(bcp47: string): Locale | null {
  for (let i = 0; i < LOCALES.length; i += 1) {
    if (LOCALE_META[LOCALES[i]].bcp47 === bcp47) return LOCALES[i]
  }
  return null
}

/** Absolute production URL for a root-relative path. */
export function absoluteUrl(path: string): string {
  return path === '/' ? `${ORIGIN}/` : `${ORIGIN}${path}`
}
