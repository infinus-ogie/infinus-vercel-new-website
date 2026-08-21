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
import { home as enHome } from './en/home'
import { home as srHome } from './sr/home'
import { faq as enFaq } from './en/faq'
import { faq as srFaq } from './sr/faq'
import { nav as enNav } from './en/nav'
import { nav as srNav } from './sr/nav'
import { footer as enFooter } from './en/footer'
import { footer as srFooter } from './sr/footer'

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


// ════════════════════════════════════════════════════════════════════════════════
// PHASE H1 NAMESPACES — homepage, FAQ, and the shared Navbar/Footer chrome.
//
// Same rules as above: one interface per namespace, tuple types wherever the design
// has a FIXED number of items so a locale cannot quietly ship a different count, and
// no optional keys — a missing string must be a compile error, never a silent gap.
// ════════════════════════════════════════════════════════════════════════════════

/** A card with a heading and a body. Used by the services and benefits grids. */
export interface CardCopy {
  readonly title: string
  readonly body: string
}

/** One industry tile: its visible label and the image's accessible description. */
export interface DomainCopy {
  readonly label: string
  readonly imageAlt: string
}

/**
 * Every user-facing string on the homepage.
 *
 * Extracted verbatim from the live English implementation — the hero, AboutSection,
 * SapServicesSection, PartnershipBenefitsSection, DomainExpertiseSection and
 * JoinSection — so the refactor cannot change a visible character on `/`.
 */
export interface HomeDictionary {
  readonly metadata: { readonly title: string; readonly description: string }

  readonly hero: {
    /** The h1 is two spans with different gradients; both halves are separate strings. */
    readonly titleLine1: string
    readonly titleLine2: string
    readonly lede: string
    /** alt/aria for the Infinus logo badge. */
    readonly logoAlt: string
  }

  /** The three trust pills, shared by the hero and the join section. */
  readonly trust: {
    readonly goldPartner: string
    readonly consultants: string
    readonly customers: string
  }

  readonly about: {
    readonly title: string
    readonly intro: string
    readonly paragraphs: readonly [string, string]
    readonly bullets: readonly [string, string, string, string]
    readonly ctaLabel: string
    /** Locale-specific: the Serbian page links to the Serbian Contact page. */
    readonly ctaHref: string
    readonly imageAlt: string
  }

  readonly services: {
    readonly heading: string
    readonly lede: string
    readonly items: readonly [CardCopy, CardCopy, CardCopy, CardCopy, CardCopy]
    /** Where a service card links. Locale-specific. */
    readonly cardHref: string
  }

  readonly benefits: {
    readonly heading: string
    readonly lede: string
    readonly items: readonly [CardCopy, CardCopy, CardCopy, CardCopy, CardCopy, CardCopy]
    readonly cardHref: string
  }

  readonly domains: {
    readonly eyebrow: string
    readonly heading: string
    readonly lede: string
    readonly items: readonly [
      DomainCopy, DomainCopy, DomainCopy, DomainCopy, DomainCopy,
      DomainCopy, DomainCopy, DomainCopy, DomainCopy,
    ]
    /**
     * The tile modal interpolates the industry label. Split into fragments rather than
     * a template string: Serbian puts the label in a different position, and the
     * dictionary convention forbids an interpolation syntax.
     */
    readonly modal: {
      readonly titlePrefix: string
      readonly titleSuffix: string
      readonly bodyBefore: string
      readonly bodyAfter: string
      readonly close: string
      readonly contact: string
      readonly closeAria: string
      /** Appended to the label for each tile's aria-label. */
      readonly tileAriaSuffix: string
    }
    /** Where the modal's contact button links. Locale-specific. */
    readonly contactHref: string
  }

  readonly join: {
    readonly heading: string
    readonly paragraphs: readonly [string, string, string]
    readonly form: {
      readonly nameLabel: string
      readonly namePlaceholder: string
      readonly phoneLabel: string
      readonly phonePlaceholder: string
      readonly phoneHint: string
      readonly emailLabel: string
      readonly emailPlaceholder: string
      readonly linkedinLabel: string
      readonly linkedinPlaceholder: string
      readonly subjectLabel: string
      readonly subjectPlaceholder: string
      readonly messageLabel: string
      readonly messagePlaceholder: string
      readonly fileLabel: string
      readonly fileClickToUpload: string
      readonly fileOrDragAndDrop: string
      readonly fileHint: string
      readonly submit: string
      readonly submitting: string
      readonly replyPromise: string
    }
    /** Zod messages. The RULES stay shared; only the wording is per locale. */
    readonly validation: {
      readonly name: string
      readonly email: string
      readonly linkedin: string
      readonly subject: string
      readonly message: string
      readonly fileType: string
      readonly fileSize: string
    }
    readonly success: string
    /**
     * The job-application acknowledgement. English is OWNER-APPROVED wording; the
     * Serbian is DRAFT. Informational, NOT the cookie-consent mechanism.
     */
    readonly privacy: {
      readonly before: string
      readonly linkText: string
      readonly after: string
      readonly href: string
    }
    /** Q&A used only for the homepage's JSON-LD, not rendered on the page. */
    readonly faq: readonly [CardCopy, CardCopy]
  }

  /** Homepage JSON-LD: the four Q&A the page advertises as structured data. */
  readonly structuredFaq: readonly [CardCopy, CardCopy, CardCopy, CardCopy]
  /**
   * The shorter description the homepage's WebPage schema uses — deliberately not the same
   * string as `metadata.description`, which is what the live English page already does.
   */
  readonly structuredDescription: string
}

/** One question and answer, kept as its own type so identity/order is explicit. */
export interface FaqEntry {
  readonly question: string
  readonly answer: string
}

/**
 * The FAQ page. `items` is a fixed 12-tuple: FAQ identity and order must stay stable
 * between locales, and the tuple makes a dropped or added question a compile error.
 */
export interface FaqDictionary {
  readonly metadata: { readonly title: string; readonly description: string }
  readonly heading: string
  readonly intro: string
  readonly items: readonly [
    FaqEntry, FaqEntry, FaqEntry, FaqEntry, FaqEntry, FaqEntry,
    FaqEntry, FaqEntry, FaqEntry, FaqEntry, FaqEntry, FaqEntry,
  ]
  readonly cta: {
    readonly heading: string
    readonly body: string
    readonly contactLabel: string
    /** Locale-specific: the Serbian page links to the Serbian Contact page. */
    readonly contactHref: string
    readonly emailLabel: string
    /** Data, not copy — the same mailbox in both locales. */
    readonly emailHref: string
  }
  /** `about` topics for the page's Article schema. Not rendered. */
  readonly structuredAbout: readonly [string, string, string, string]
}

/**
 * A navigation entry.
 *
 * `label` and `href` are SEPARATE CONCERNS: translating a label must never invent a
 * URL. Each locale declares its own real destination, so a Serbian entry either points
 * at a live Serbian route or deliberately keeps the English one. Asserted in
 * test/shell/chrome-locale.test.ts against the route map.
 */
export interface NavLinkCopy {
  readonly label: string
  readonly href: string
}

export interface NavGroupCopy {
  readonly label: string
  readonly items: readonly NavLinkCopy[]
}

/** The shared Navbar, per locale. */
export interface NavDictionary {
  readonly home: NavLinkCopy
  readonly about: NavLinkCopy
  readonly expertise: NavLinkCopy
  readonly benefits: NavLinkCopy
  readonly packagedSolutions: NavGroupCopy
  readonly caseStudies: NavGroupCopy
  readonly contact: NavLinkCopy
  readonly faq: NavLinkCopy
  /** Accessible name for the mobile menu panel. */
  readonly menuLabel: string
}

/** The shared Footer, per locale. */
export interface FooterDictionary {
  readonly description: string
  readonly logoAlt: string
  readonly columns: {
    readonly contact: NavGroupCopy
    readonly expertise: NavGroupCopy
    readonly company: NavGroupCopy
    readonly resources: NavGroupCopy
    readonly legal: NavGroupCopy
  }
  readonly bottom: {
    /** Rendered after the year: "© 2026 Infinus. <rights>" */
    readonly rights: string
    readonly privacyLabel: string
    readonly privacyHref: string
    readonly cookieSettings: string
    readonly developedBy: string
  }
}

/** Every namespace a locale must provide. Add a namespace here and both locales break. */
export interface Dictionary {
  readonly common: CommonDictionary
  readonly contact: ContactDictionary
  readonly home: HomeDictionary
  readonly faq: FaqDictionary
  readonly nav: NavDictionary
  readonly footer: FooterDictionary
}

/**
 * Static registry. `Record<Locale, Dictionary>` is what makes a missing locale a compile
 * error; `satisfies` keeps that check while preserving the literal types for callers.
 */
export const dictionaries = {
  en: { common: enCommon, contact: enContact, home: enHome, faq: enFaq, nav: enNav, footer: enFooter },
  sr: { common: srCommon, contact: srContact, home: srHome, faq: srFaq, nav: srNav, footer: srFooter },
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
export const DICTIONARY_NAMESPACES = ['common', 'contact', 'home', 'faq', 'nav', 'footer'] as const

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
