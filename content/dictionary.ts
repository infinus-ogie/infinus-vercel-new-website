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
 *
 * The consent UI DID come in here, in the final rollout pass. It used to be a standalone
 * module carrying the English strings plus two Serbian ones rendered together on every page,
 * which was the right compromise before the site had locales and the wrong one after. It is
 * now the `consent` namespace, which gets the same key-parity and no-fallback guarantees as
 * everything else. Note it is INTERFACE copy: the approved legal text is still frozen in
 * content/legal/politika-privatnosti.ts and still outside this system.
 */

import { LOCALES, type Locale } from '@/lib/i18n'
import { common as enCommon } from './en/common'
import { common as srCommon } from './sr/common'
import { contact as enContact } from './en/contact'
import { contact as srContact } from './sr/contact'
import { home as enHome } from './en/home'
import { home as srHome } from './sr/home'
import { careers as enCareers } from './en/careers'
import { careers as srCareers } from './sr/careers'
import { faq as enFaq } from './en/faq'
import { faq as srFaq } from './sr/faq'
import { nav as enNav } from './en/nav'
import { nav as srNav } from './sr/nav'
import { footer as enFooter } from './en/footer'
import { footer as srFooter } from './sr/footer'
import { caseStudies as enCaseStudies } from './en/case-studies'
import { caseStudies as srCaseStudies } from './sr/case-studies'
import { projectPulse as enProjectPulse } from './en/project-pulse'
import { projectPulse as srProjectPulse } from './sr/project-pulse'
import { projectPulseBrochure as enProjectPulseBrochure } from './en/project-pulse-brochure'
import { projectPulseBrochure as srProjectPulseBrochure } from './sr/project-pulse-brochure'
import { projectPulseVideo as enProjectPulseVideo } from './en/project-pulse-video'
import { projectPulseVideo as srProjectPulseVideo } from './sr/project-pulse-video'
import { sapStarterPackage as enSapStarterPackage } from './en/sap-starter-package'
import { sapStarterPackage as srSapStarterPackage } from './sr/sap-starter-package'
import { consent as enConsent } from './en/consent'
import { consent as srConsent } from './sr/consent'
import { growth as enGrowth } from './en/growth'
import { growth as srGrowth } from './sr/growth'
import { mythBusters as enMythBusters } from './en/mythbusters'
import { mythBusters as srMythBusters } from './sr/mythbusters'

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
    /**
     * The file picker's own two strings.
     *
     * A native `<input type="file">` renders its button and its "no file" text from the
     * BROWSER's locale, not the page's — so a Serbian page on an English-configured browser
     * said "Choose file / No file chosen" next to Serbian labels, and the site had no way to
     * influence it. These two strings are what the custom presentation shows instead. The
     * input itself is untouched; only its chrome is ours.
     */
    readonly attachmentButton: string
    readonly attachmentEmpty: string
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
    /**
     * The first-screen call to action, added at the client's request.
     *
     * `ctaHref` is LOCALE-OWNED, like every other destination in this file: English points
     * at /contact and Serbian at /sr/contact. The alternative — one href plus a "which
     * locale am I?" check inside the hero component — is the request-time guessing this
     * architecture exists to avoid.
     */
    readonly ctaLabel: string
    readonly ctaHref: string
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

  /**
   * The short business contact form that replaced the Join Our Team section.
   *
   * The homepage used to host the JOB APPLICATION form. The client asked for that to move
   * to a page of its own — see CareersDictionary — and for a short business enquiry form
   * to take its place.
   *
   * Deliberately shorter than the Contact page's form, and deliberately NOT a second copy
   * of it: no phone, no attachment, and explicitly no LinkedIn and no CV upload. It posts
   * to the same /api/contact endpoint, so this is presentation and copy only — there is no
   * second contact backend.
   */
  readonly contactShort: {
    readonly heading: string
    readonly body: string
    readonly nameLabel: string
    readonly namePlaceholder: string
    readonly emailLabel: string
    readonly emailPlaceholder: string
    readonly companyLabel: string
    readonly companyPlaceholder: string
    readonly messageLabel: string
    readonly messagePlaceholder: string
    readonly submit: string
    readonly submitting: string
    /** Zod messages. The RULES are the ones /api/contact already enforces. */
    readonly validation: {
      readonly name: string
      readonly email: string
      readonly message: string
    }
    readonly success: { readonly heading: string; readonly body: string }
    /** Rendered on a failed submission — unlike the Contact page, which sets and never shows it. */
    readonly error: string
    readonly privacy: {
      readonly before: string
      readonly linkText: string
      readonly after: string
      readonly href: string
    }
  }

  /**
   * Homepage JSON-LD: the Q&A the page advertises as structured data.
   *
   * This used to be a FOUR-tuple whose last two entries were "How do I apply?" and "What
   * happens after I submit?". Those described the job-application form, which now lives on
   * the Careers page — see CareersDictionary.faq. Leaving them here would have advertised
   * an application process to crawlers on a page that can no longer start one.
   */
  readonly structuredFaq: readonly [CardCopy, CardCopy]
  /**
   * The shorter description the homepage's WebPage schema uses — deliberately not the same
   * string as `metadata.description`, which is what the live English page already does.
   */
  readonly structuredDescription: string
}

/**
 * The Careers page — /careers and /sr/careers.
 *
 * This IS the old `HomeDictionary.join`, promoted to a namespace of its own when the client
 * asked for the job-application form to leave the homepage. The keys are unchanged, so the
 * move is a relocation rather than a rewrite; `metadata` and `structuredDescription` are the
 * only additions, because a section has no title of its own and a page needs one.
 *
 * The form's Zod RULES (min 2 / min 10 characters, email format, the three accepted MIME
 * types, the 5MB ceiling) and its FormData keys are NOT here and never were: they belong to
 * components/ui/join-section.tsx and to /api/join-team. Only the wording is per locale.
 */
export interface CareersDictionary {
  readonly metadata: { readonly title: string; readonly description: string }
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
   * The job-application acknowledgement. Informational — NOT the cookie-consent mechanism,
   * so "agree"/"accept"/"pristajete" phrasings are wrong here. `href` is locale-owned so a
   * Serbian applicant is never sent to the English document.
   */
  readonly privacy: {
    readonly before: string
    readonly linkText: string
    readonly after: string
    readonly href: string
  }
  /** Q&A used only for this page's JSON-LD, not rendered. Moved here from the homepage. */
  readonly faq: readonly [CardCopy, CardCopy]
  /** The shorter description this page's WebPage schema uses. */
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

/**
 * One entry inside a dropdown: either a link, or a HEADING over its own links.
 *
 * The heading case exists because of a rule the owner was explicit about: a category name
 * must never masquerade as a link to one of its children. "SAP Packaged Solutions" and
 * "Case Studies" are categories with no index page, so pointing them at
 * /sap-packaged-solutions/sap-starter-package or /case-study/retail1 would tell a visitor
 * they are opening a category and then show them one arbitrary member of it.
 *
 * Inventing the two index pages was the alternative and was rejected — no new routes just to
 * satisfy a menu shape. So the category renders as a non-interactive label with its real
 * children listed beneath it, and the type makes "heading" a thing the data can SAY rather
 * than something the component has to infer.
 */
export type NavMenuEntry =
  | ({ readonly kind: 'link' } & NavLinkCopy)
  | { readonly kind: 'group'; readonly label: string; readonly items: readonly NavLinkCopy[] }

/** A top-level dropdown: its trigger label and what it contains. */
export interface NavMenuCopy {
  readonly label: string
  readonly entries: readonly NavMenuEntry[]
}

/**
 * The shared Navbar, per locale.
 *
 * ── Restructured at the client's request ────────────────────────────────────────
 * This used to be EIGHT flat top-level entries (Home, About, Our Expertise, Benefits, SAP
 * Packaged Solutions, Case Studies, Contact, FAQ). The client proposed five groups, and
 * that is what this shape encodes:
 *
 *     Home · Company · Expertise · Insights · Contact
 *
 * Nothing lost a page in the move. About, Why Infinus and FAQ moved under Company; the two
 * former top-level dropdowns became categories inside Expertise; the campaign pages that
 * were only reachable from the footer got a home in Insights.
 *
 * `label` and `href` remain SEPARATE CONCERNS at every level: translating a label must
 * never invent a URL. Each locale declares its own real destinations.
 */
export interface NavDictionary {
  readonly home: NavLinkCopy
  readonly company: NavMenuCopy
  readonly expertise: NavMenuCopy
  readonly insights: NavMenuCopy
  readonly contact: NavLinkCopy
  /** Accessible name for the mobile menu panel. */
  readonly menuLabel: string
}

/**
 * The shared Footer, per locale.
 *
 * ── Restructured alongside the navbar ───────────────────────────────────────────
 * The columns were `contact / expertise / company / resources / legal`, where Expertise
 * listed five service names that all pointed at the same `#our-expertise` anchor, and
 * Company mixed About and FAQ with two campaign pages. The client proposed a structure that
 * mirrors the new navigation instead:
 *
 *     Contact Information · Company · Expertise · Insights · Legal
 *
 * The old Resources column is gone. Its two links pointed at `#downloads` on the campaign
 * pages; those sections, their anchors and every PDF and ZIP behind them are untouched —
 * only the footer column was removed.
 *
 * `company`, `expertise` and `insights` use NavMenuEntry, so a category with no index page
 * renders as a heading over its real children rather than as a link to one of them. Same
 * rule as the navbar, same type, for the same reason.
 *
 * `contact` and `legal` stay plain link lists: neither has a category in it.
 */
export interface FooterDictionary {
  readonly description: string
  readonly logoAlt: string
  readonly columns: {
    readonly contact: NavGroupCopy
    readonly company: NavMenuCopy
    readonly expertise: NavMenuCopy
    readonly insights: NavMenuCopy
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

// ════════════════════════════════════════════════════════════════════════════════
// PHASE H2 — case studies.
//
// All five pages share one structure, so they share one entry type and one set of
// section labels. `solutionItems` and `engagementModel` may legitimately be EMPTY:
// the pharma1 page has neither section, and the shared component omits a section whose
// content is empty rather than rendering an empty heading.
// ════════════════════════════════════════════════════════════════════════════════

export interface CaseStudyEntry {
  /** `<title>` input. The English pages append " | Infinus" themselves. */
  readonly metadataTitle: string
  /** The h1, also used as the hero image's alt text, exactly as the pages do today. */
  readonly title: string
  readonly badge: string
  readonly clientOverview: string
  /** Paragraphs separated by a blank line, as the component already splits them. */
  readonly challenge: string
  readonly solutionIntro: string
  /** Empty on pages that have no bullet list. */
  readonly solutionItems: readonly string[]
  readonly results: readonly string[]
  /** Empty on pages that have no engagement-model section. */
  readonly engagementModel: string
  /** Comma-separated; the component splits on ", " into pills. */
  readonly technologies: string
  /** `about` topics for the page's Article schema. Not rendered. */
  readonly structuredAbout: readonly string[]
}

export interface CaseStudiesDictionary {
  /** Section headings and CTA copy, shared by all five pages. */
  readonly labels: {
    readonly clientOverview: string
    readonly challenge: string
    readonly solution: string
    readonly engagementIncluded: string
    readonly results: string
    readonly engagementModel: string
    readonly technologies: string
    readonly ctaHeading: string
    readonly ctaButton: string
    readonly ctaNote: string
  }
  /** Where the CTA links. Locale-specific. */
  readonly contactHref: string
  readonly items: {
    readonly retail1: CaseStudyEntry
    readonly pharma1: CaseStudyEntry
    readonly pharma2: CaseStudyEntry
    readonly nearshoring1: CaseStudyEntry
    readonly manufacturing1: CaseStudyEntry
  }
}

/** The five case-study keys, for iteration and for the route files. */
export const CASE_STUDY_KEYS = ['retail1', 'pharma1', 'pharma2', 'nearshoring1', 'manufacturing1'] as const
export type CaseStudyKey = (typeof CASE_STUDY_KEYS)[number]

/* ─────────────────────────────────────────────────────────────────────────────
 * PROJECTPULSE — /projectpulse
 * ─────────────────────────────────────────────────────────────────────────── */

/** A card with a title and a body. Some cards on this page carry a title only. */
export interface ProjectPulseCard {
  readonly title: string
  /**
   * Empty on all four `valueProposition` items: the cards render titles only. The empty
   * strings are not decorative — they still reach the JSON-LD `featureList`, which is why
   * this is `string` and not optional. See content/en/project-pulse.ts.
   */
  readonly description: string
}

/** One implementation phase: a name, how long it takes, what happens in it. */
export interface ProjectPulsePhase {
  readonly name: string
  readonly duration: string
  readonly description: string
}

/**
 * One `about` entry in the Article schema. The product entry is a SoftwareApplication and
 * the rest are Things, so the @type travels with the name rather than being reconstructed.
 */
export interface ProjectPulseAboutEntry {
  readonly name: string
  readonly type: 'Thing' | 'SoftwareApplication'
}

export interface ProjectPulseDictionary {
  /** Metadata and the absolute URL the JSON-LD uses. Locale-specific. */
  readonly page: {
    readonly title: string
    readonly description: string
    readonly url: string
    readonly slug: string
  }
  readonly hero: {
    readonly backgroundAlt: string
    readonly badgeAlt: string
    readonly title: string
    readonly subtitle: string
    readonly description: string
    /** Three, and the first three entries of the schema's `featureList`. */
    readonly valueHighlights: readonly [string, string, string]
    readonly ctaDiscovery: string
    readonly ctaBrochure: string
  }
  /**
   * Eight, in a FIXED ORDER. components/pages/ProjectPulsePage.tsx pairs them with icons
   * positionally, which is what lets the Serbian labels keep the English icons — an icon
   * map keyed on the English label would have silently fallen back to one generic icon for
   * every Serbian entry.
   */
  readonly industries: readonly [string, string, string, string, string, string, string, string]
  readonly problem: {
    readonly title: string
    readonly description: string
    readonly description2: string
    readonly solution: {
      readonly title: string
      /** Split three ways because the component bolds the middle fragment. */
      readonly descriptionPrefix: string
      readonly descriptionStrong: string
      readonly descriptionSuffix: string
      readonly description2: string
    }
  }
  readonly valueProposition: {
    readonly kicker: string
    readonly title: string
    readonly items: readonly [
      ProjectPulseCard,
      ProjectPulseCard,
      ProjectPulseCard,
      ProjectPulseCard,
    ]
  }
  readonly whatYouGain: {
    readonly kicker: string
    readonly title: string
    readonly items: readonly [ProjectPulseCard, ProjectPulseCard, ProjectPulseCard]
  }
  readonly idealFor: {
    readonly kicker: string
    readonly title: string
  }
  /** Not rendered today — the section is commented out — but it feeds the schema. */
  readonly howItWorks: {
    readonly kicker: string
    readonly title: string
    readonly subtitle: string
    /** Seven. The step NUMBER is derived from position, so it is not copy. */
    readonly steps: readonly [string, string, string, string, string, string, string]
    readonly microCards: readonly [ProjectPulseCard, ProjectPulseCard, ProjectPulseCard]
  }
  /** Not rendered and not in the schema; carried so re-enabling the section needs no phase. */
  readonly outcomes: {
    readonly kicker: string
    readonly title: string
    readonly subtitle: string
    /** The word after the role in "CEO Outcomes" — a separate word order per locale. */
    readonly outcomesSuffix: string
    readonly roles: {
      readonly CEO: readonly string[]
      readonly CFO: readonly string[]
      readonly COO: readonly string[]
    }
  }
  /** Not rendered today; `subtitle` and `phases` build the whole HowTo schema. */
  readonly implementation: {
    readonly kicker: string
    readonly title: string
    readonly subtitle: string
    readonly phases: readonly [
      ProjectPulsePhase,
      ProjectPulsePhase,
      ProjectPulsePhase,
      ProjectPulsePhase,
      ProjectPulsePhase,
    ]
  }
  /** Not rendered and not in the schema. Carried, as above. */
  readonly about: {
    readonly title: string
    readonly description: string
    readonly industriesLabel: string
  }
  readonly cta: {
    readonly title: string
    readonly description: string
    readonly primaryCta: string
    readonly secondaryCta: string
    readonly trustNote: string
  }
  /** Strings that appear ONLY in JSON-LD, never on screen. */
  readonly schema: {
    readonly breadcrumbHome: string
    readonly breadcrumbPage: string
    readonly softwareReleaseNotes: string
    readonly howToName: string
    readonly industriesListName: string
    readonly industriesListDescription: string
    readonly articleAbout: readonly [
      ProjectPulseAboutEntry,
      ProjectPulseAboutEntry,
      ProjectPulseAboutEntry,
      ProjectPulseAboutEntry,
    ]
  }
  /** Where the CTAs link. Locale-specific. */
  readonly contactHref: string
  /** The brochure PDF. One asset, identical in both locales. */
  readonly brochureHref: string
  readonly brochureFilename: string
}

/* ─────────────────────────────────────────────────────────────────────────────
 * PROJECTPULSE BROCHURE — /projectpulse/brochure
 * ─────────────────────────────────────────────────────────────────────────── */

/** A kicker/title/body card. */
export interface BrochureCard {
  readonly kicker: string
  readonly title: string
  readonly body: string
}

/** A kicker/title/bullets column. */
export interface BrochureRoleColumn {
  readonly kicker: string
  readonly title: string
  readonly bullets: readonly [string, string, string]
}

/** A titled bullet list in the functional-scope grid. */
export interface BrochureScopeGroup {
  readonly title: string
  readonly bullets: readonly string[]
}

/** A label/value row — a dashboard KPI or a commercial-model line. */
export interface BrochureRow {
  readonly label: string
  readonly value: string
}

export interface ProjectPulseBrochureDictionary {
  readonly metadata: { readonly title: string; readonly description: string }
  readonly ribbon: { readonly left: string; readonly right: string }
  readonly hero: {
    readonly kicker: string
    readonly title: string
    readonly body: string
    readonly pills: readonly [string, string, string]
  }
  /**
   * The illustrative "Executive Command Center" mock-up. The KPI figures are part of the
   * mock-up, not claims about a customer — see content/en/project-pulse-brochure.ts.
   */
  readonly dashboard: {
    readonly title: string
    readonly subtitle: string
    readonly portfolio: { readonly title: string; readonly body: string }
    readonly utilization: { readonly title: string; readonly body: string }
    readonly cash: { readonly title: string; readonly body: string }
    readonly kpis: readonly [BrochureRow, BrochureRow, BrochureRow]
    readonly poweredBy: string
  }
  readonly challenges: {
    readonly heading: string
    readonly intro: string
    readonly items: readonly [BrochureCard, BrochureCard, BrochureCard]
  }
  readonly byRole: {
    readonly heading: string
    readonly intro: string
    readonly roles: readonly [BrochureRoleColumn, BrochureRoleColumn, BrochureRoleColumn]
  }
  readonly benefits: {
    readonly heading: string
    readonly items: readonly [string, string, string, string, string, string]
  }
  readonly scope: {
    readonly heading: string
    readonly intro: string
    readonly groups: readonly [
      BrochureScopeGroup,
      BrochureScopeGroup,
      BrochureScopeGroup,
      BrochureScopeGroup,
    ]
    readonly optional: { readonly title: string; readonly body: string }
  }
  readonly commercial: {
    readonly heading: string
    readonly intro: string
    readonly rows: readonly [BrochureRow, BrochureRow, BrochureRow]
    readonly footnote: string
  }
  readonly whyInfinus: {
    readonly kicker: string
    readonly title: string
    readonly bullets: readonly [string, string, string, string]
    readonly footnote: string
  }
  readonly cta: {
    readonly kicker: string
    readonly heading: string
    readonly body: string
    readonly button: string
    /** The sentence is prefix + linked address + suffix. */
    readonly emailPrefix: string
    readonly emailAddress: string
    readonly emailSuffix: string
  }
  /** Everything after the build-time year in the copyright line. */
  readonly copyrightSuffix: string
}

/* ─────────────────────────────────────────────────────────────────────────────
 * PROJECTPULSE VIDEO — /projectpulse/video
 * ─────────────────────────────────────────────────────────────────────────── */

export interface ProjectPulseVideoDictionary {
  readonly metadata: { readonly title: string; readonly description: string }
  /** The close control's accessible name, distinct from its visible label. */
  readonly closeAriaLabel: string
  readonly closeLabel: string
  /** Shown by a browser with no <video> support. Real copy, rarely seen. */
  readonly videoFallback: string
  readonly title: string
  readonly caption: string
  /**
   * NOT localised: there is one recording, narrated in English, served on both halves of
   * the pair. A Serbian recording is a content task — see content/sr/project-pulse-video.ts.
   */
  readonly videoSrc: string
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SAP STARTER PACKAGE — /sap-packaged-solutions/sap-starter-package
 * ─────────────────────────────────────────────────────────────────────────── */

export interface SapStarterPackageDictionary {
  /**
   * `title` feeds the SOCIAL tags and the JSON-LD; `documentTitle` feeds the <title>.
   *
   * They differ by one thing: the brand. `title` carries it mid-string — "SAP Starter
   * Package | Infinus – SAP Packaged Solutions" — which is correct for og:title, where the
   * value stands alone and needs to name the company. In the <title> the root layout
   * already appends "| Infinus", so the mid-string copy made the tab read
   * "…| Infinus – SAP Packaged Solutions | Infinus": branded twice.
   *
   * Splitting the field is what lets the <title> lose the redundancy while og:title,
   * twitter:title, the JSON-LD name/headline and the Serbian breadcrumb keep the exact
   * value they have always had. The brochure namespace needs no equivalent: its title feeds
   * nothing but the <title>, so it was corrected in place.
   */
  readonly metadata: {
    readonly title: string
    readonly documentTitle: string
    readonly description: string
  }
  readonly hero: {
    readonly badge: string
    readonly imageAlt: string
    readonly title: string
    readonly tagline: string
    readonly description: string
    readonly ctaDiscovery: string
    readonly ctaBrochure: string
  }
  readonly challenge: { readonly heading: string; readonly lines: readonly [string, string, string] }
  readonly solution: {
    readonly heading: string
    readonly body: string
    readonly highlight: string
    readonly sub: string
  }
  /** Title-only cards; the icons are positional in the component. */
  readonly whatYouGain: {
    readonly heading: string
    readonly items: readonly [string, string, string, string]
  }
  readonly idealFor: {
    readonly heading: string
    readonly items: readonly [string, string, string, string]
  }
  /** Title-only cards, as above. */
  readonly why: {
    readonly heading: string
    readonly items: readonly [string, string, string, string]
  }
  readonly cta: {
    readonly heading: string
    readonly ctaDiscovery: string
    readonly ctaBrochure: string
    readonly trustNote: string
  }
  /**
   * The brochure language modal. Until this phase its copy was hardcoded English inside
   * components/ui/BrochureLanguageModal.tsx, so it read English on any page that used it.
   * `note` is empty on the reader's own language — see content/en/sap-starter-package.ts.
   */
  readonly brochureModal: {
    readonly heading: string
    readonly subheading: string
    readonly closeLabel: string
    readonly cancelLabel: string
    readonly englishOption: { readonly label: string; readonly note: string }
    readonly serbianOption: { readonly label: string; readonly note: string }
  }
  /** Both PDFs are offered on both halves of the pair, so these are locale-invariant. */
  readonly brochure: { readonly hrefEn: string; readonly hrefSr: string }
  readonly schema: {
    readonly breadcrumbHome: string
    readonly articleAbout: readonly [string, string, string, string, string]
  }
  readonly contactHref: string
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SAP MYTHBUSTING — /insights/sap-mythbusters
 * ─────────────────────────────────────────────────────────────────────────── */

/**
 * One field in the e-book form.
 *
 * The two locales ask for DIFFERENT fields — the English source asks for an optional Role
 * or Job Title, the newer Serbian source asks for a required Zemlja and no role at all — so
 * the field list is DATA rather than JSX. That is what lets one form component serve both
 * without a `locale === 'sr'` conditional inside it.
 *
 * `key` is the API contract and is NEVER translated. `label` is.
 */
export type EbookFieldKey = 'name' | 'email' | 'company' | 'role' | 'country'

export interface EbookFormField {
  readonly key: EbookFieldKey
  readonly label: string
  readonly required: boolean
  /** The Zod message shown when a REQUIRED field is empty or malformed. */
  readonly validation: string
}

/** A myth paired with the fact that answers it. The Serbian page previews four. */
export interface MythFact {
  readonly myth: string
  readonly fact: string
}

/** One question and its answer, rendered visibly AND emitted as FAQPage schema. */
export interface EbookFaq {
  readonly question: string
  readonly answer: string
}

/**
 * The ENGLISH landing page's body — the structure of "eng verzija.docx".
 *
 * Hero, a four-metric trust bar, a why-download block, the ten myths as a list, an audience
 * section, then the form.
 */
export interface EnMythBustersLayout {
  readonly variant: 'en-overview'
  readonly hero: {
    readonly eyebrow: string
    readonly titleLine1: string
    readonly titleLine2: string
    readonly lede: string
    readonly bullets: readonly [string, string, string, string]
    readonly cta: string
  }
  /** FOUR items, where the shared StatPills renders three — hence a page-local list. */
  readonly trustBar: readonly [string, string, string, string]
  readonly why: {
    readonly introTitle: string
    readonly introBody: string
    readonly items: readonly [CardCopy, CardCopy, CardCopy, CardCopy]
  }
  readonly myths: {
    readonly heading: string
    readonly items: readonly [
      string, string, string, string, string,
      string, string, string, string, string,
    ]
    readonly cta: string
  }
  readonly audience: {
    readonly heading: string
    readonly body: string
    readonly roles: readonly [string, string, string, string, string, string]
  }
}

/**
 * The SERBIAN landing page's body — the structure of "LP_copy_structure_INFINUS_RS.docx".
 *
 * A genuinely different page: a split hero with the form and an e-book asset card beside the
 * copy, a one-line trust bar with two logos, then audience, contents, four myth/fact
 * previews, why-Infinus, why-now, a real FAQ, and a closing CTA above a second form.
 *
 * ── Why this is a separate shape rather than optional keys ──────────────────────
 * The site's dictionary convention forbids optional keys, because an optional key is how a
 * locale quietly ships a missing section. The client did not send a translation of the
 * English page; they sent a different page. Modelling that as one interface with half its
 * fields unused per locale would be describing something that is not true.
 */
export interface SrMythBustersLayout {
  readonly variant: 'sr-conversion'
  readonly hero: {
    readonly badge: string
    readonly title: string
    readonly subtitle: string
    readonly paragraphs: readonly [string, string]
    readonly benefitsHeading: string
    readonly benefits: readonly [string, string, string]
  }
  /** The e-book card shown beside the form. */
  readonly assetCard: {
    readonly title: string
    readonly subtitle: string
    readonly whatYouGetHeading: string
    readonly items: readonly [string, string, string, string]
    readonly coverAlt: string
  }
  /** Reassurances printed under the form's CTA. */
  readonly formAssurances: readonly [string, string, string]
  /**
   * The same four-metric shape as {@link EnMythBustersLayout}. The Serbian page briefly used a
   * statement plus two logos instead; that presentation is withdrawn and both locales now
   * share one trust band, so the two variants agree on this field again.
   */
  readonly trustBar: readonly [string, string, string, string]
  readonly audience: {
    readonly heading: string
    readonly body: string
    readonly rolesIntro: string
    readonly roles: readonly [string, string, string, string, string, string]
  }
  readonly contents: {
    readonly heading: string
    readonly intro: string
    readonly items: readonly [string, string, string, string, string]
  }
  readonly preview: {
    readonly heading: string
    readonly mythLabel: string
    readonly factLabel: string
    readonly items: readonly [MythFact, MythFact, MythFact, MythFact]
    readonly more: string
  }
  readonly whyInfinus: {
    readonly heading: string
    readonly paragraphs: readonly [string, string]
    readonly reasonsHeading: string
    readonly reasons: readonly [string, string, string, string]
  }
  readonly whyNow: {
    readonly heading: string
    readonly paragraphs: readonly [string, string, string]
  }
  readonly faq: {
    readonly heading: string
    readonly items: readonly [EbookFaq, EbookFaq, EbookFaq, EbookFaq, EbookFaq]
  }
  readonly finalCta: {
    readonly heading: string
    readonly body: string
    readonly button: string
    readonly note: string
  }
}

/**
 * The SAP MythBusting e-book landing page.
 *
 * ── The copy is CLIENT-SUPPLIED SOURCE OF TRUTH ─────────────────────────────────
 * Neither side is a translation of the other — the client wrote both — so the usual
 * "English is the source" rule does not apply and neither file may be edited to match the
 * other. `layout` is a discriminated union precisely because they are different pages.
 *
 * ONE deliberate departure from the supplied text, in Serbian only: the acknowledgement
 * ended "...pročitali našu Privacy Policy", an English legal term inside Serbian body copy
 * and grammatically wrong in the accusative slot. It uses the site's already-approved
 * "Politiku privatnosti" instead. Recorded in content/sr/mythbusters.ts.
 */
export interface MythBustersDictionary {
  readonly metadata: {
    /**
     * Both supplied SEO titles already end in "| Infinus", so the route files pass them as
     * `title.absolute` — the root layout's `%s | Infinus` template would otherwise brand
     * the tab twice. seo:assert-build fails on exactly that.
     */
    readonly title: string
    readonly description: string
  }

  /** The page body. The two locales have genuinely different structures — see above. */
  readonly layout: EnMythBustersLayout | SrMythBustersLayout

  readonly form: {
    readonly heading: string
    readonly body: string
    /** Ordered. The locale decides which fields exist and which are required. */
    readonly fields: readonly EbookFormField[]
    readonly submit: string
    readonly submitting: string
    readonly success: {
      readonly eyebrow: string
      readonly heading: string
      readonly body: string
      readonly downloadLabel: string
      readonly downloadNote: string
      /**
       * Shown ONLY when the delivery email actually went out.
       *
       * The endpoint reports `emailDelivered`, and the success panel keys off it. Telling a
       * visitor a copy is in their inbox when the send failed is a claim they can check and
       * find false, so these two strings are gated rather than always rendered.
       */
      readonly emailHeading: string
      readonly emailBody: string
      /**
       * The replacement when delivery FAILED.
       *
       * Deliberately not an error: the submission succeeded, the lead was captured and the
       * download is right there. Only the secondary convenience copy did not arrive, and a
       * scary red state over that would misrepresent what happened.
       */
      readonly emailFallback: string
      readonly nextHeading: string
      readonly nextBody: string
      readonly expertCta: string
      readonly questionsHeading: string
      readonly questionsBody: string
      readonly contactCta: string
      /** Where both closing CTAs go. Locale-owned; there is no scheduling integration. */
      readonly contactHref: string
    }
    readonly error: string
    /**
     * "The e-book is provided in PDF format and is available in English."
     *
     * Rendered BEFORE submission on both halves. On the Serbian page especially: a visitor
     * must know the asset is English-only before handing over their details, not after.
     */
    readonly languageNote: string
    readonly privacy: {
      readonly before: string
      readonly linkText: string
      readonly after: string
      readonly href: string
    }
  }

  /** Strings that appear only in JSON-LD, never on screen. */
  readonly schema: {
    readonly breadcrumbHome: string
    readonly breadcrumbPage: string
    readonly mythListName: string
    readonly ebookName: string
  }
}

/**
 * Narrow the layout to the Serbian shape, or fail loudly at module scope.
 *
 * The Serbian route file calls this once when the module loads, so a dictionary that stops
 * carrying the Serbian layout is a BUILD failure rather than a page that renders half of
 * itself. Same discipline as `pairPath` in lib/growth-routes.ts.
 */
export function srMythBustersLayout(content: MythBustersDictionary): SrMythBustersLayout {
  if (content.layout.variant !== 'sr-conversion') {
    throw new Error('the Serbian MythBusting page requires the "sr-conversion" layout')
  }
  return content.layout
}

/** The English counterpart of {@link srMythBustersLayout}. */
export function enMythBustersLayout(content: MythBustersDictionary): EnMythBustersLayout {
  if (content.layout.variant !== 'en-overview') {
    throw new Error('the English MythBusting page requires the "en-overview" layout')
  }
  return content.layout
}

/* ─────────────────────────────────────────────────────────────────────────────
 * CONSENT UI — the cookie banner and the settings dialog
 * ─────────────────────────────────────────────────────────────────────────── */

/** One consent category as the settings dialog presents it. */
export interface ConsentCategoryCopy {
  readonly label: string
  readonly description: string
}

/**
 * Copy for the consent UI, per locale.
 *
 * INTERFACE copy, not legal copy — see content/en/consent.ts. The approved Privacy Policy
 * lives in content/legal/politika-privatnosti.ts and is deliberately outside this system.
 *
 * Consumed by CLIENT components, but never imported by one: components/shell/RootShell.tsx
 * is a server component and resolves this for its own root locale, then passes the single
 * resolved object into ConsentProvider. That keeps the whole dictionary out of the client
 * bundle while still giving the consent UI a compile-time-checked contract.
 */
export interface ConsentDictionary {
  readonly banner: {
    readonly title: string
    readonly body: string
    readonly accept: string
    readonly reject: string
    readonly settings: string
    readonly policyLink: string
  }
  readonly settings: {
    readonly title: string
    readonly intro: string
    readonly save: string
    readonly acceptAll: string
    readonly rejectAll: string
    /** The dialog's close control. Used as its accessible name, so it is real copy. */
    readonly close: string
    /** The badge on the always-enabled category. */
    readonly alwaysOn: string
    readonly categories: {
      readonly necessary: ConsentCategoryCopy
      readonly analytics: ConsentCategoryCopy
      readonly marketing: ConsentCategoryCopy
    }
  }
  /**
   * Where the consent UI's Privacy Policy link goes, per locale.
   *
   * Locale-aware by CONSTRUCTION rather than by a conditional at the call site: the banner
   * and the dialog both read this one field, so a Serbian visitor cannot be sent to the
   * English document from either of them.
   */
  readonly privacyHref: string
}

/* ─────────────────────────────────────────────────────────────────────────────
 * GROW / PROFESSIONAL SERVICES — the four asymmetric locale pairs
 * ─────────────────────────────────────────────────────────────────────────── */

/** A question/answer pair, used by FaqSection and by the FAQPage schema. */
export interface GrowthFaq {
  readonly question: string
  readonly answer: string
}

/** An animated statistic: the number, its suffix, and the claim it supports. */
export interface GrowthStat {
  /** Counted up to, so it must parse as a number. */
  readonly value: string
  readonly suffix: string
  readonly label: string
}

/** A titled feature tile. */
export interface GrowthCard {
  readonly title: string
  readonly description: string
}

/** One downloadable resource, as ResourceList renders it. */
export interface GrowthDownload {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly label: string
  readonly url: string
  /** Analytics identifier. NOT copy — identical in both locales so events stay comparable. */
  readonly analyticsId: string
}

/** One entry in a role page's advantages timeline. */
export interface GrowthTimelineItem {
  readonly title: string
  readonly body: string
}

/** One pill in the "fast start" row. */
export interface GrowthQuickStart {
  readonly title: string
  readonly detail: string
}

/** A CreativeWork in the downloads ItemList schema. */
export interface GrowthSchemaDownload {
  readonly name: string
  readonly url: string
}

/**
 * The CFO and CEO pages are structurally IDENTICAL — hero, advantages timeline, fast-start
 * pills, About, CTA, FAQ — so they share one interface and one component. Only their copy and
 * their hero image differ.
 */
export interface GrowthRolePage {
  readonly metadata: {
    readonly title: string
    readonly description: string
    readonly ogImageAlt: string
  }
  readonly hero: {
    readonly title: string
    readonly description: string
    readonly ctaText: string
  }
  readonly timelineHeading: string
  readonly timelineDescription: string
  readonly timeline: readonly GrowthTimelineItem[]
  readonly quickStart: readonly [GrowthQuickStart, GrowthQuickStart, GrowthQuickStart]
  readonly aboutBody: string
  /** The one FAQ entry this page does not share with the others. */
  readonly faqExtra: GrowthFaq
  readonly schema: {
    readonly pageName: string
    readonly articleAbout: readonly string[]
    readonly breadcrumbs: readonly [string, string, string]
  }
}

export interface GrowthDictionary {
  /**
   * Copy every one of the four pages renders identically.
   *
   * Extracted once rather than four times: the About heading, the CTA block, the fast-start
   * heading, the "Why now" heading, the hero badge and the two shared FAQ entries were
   * duplicated verbatim across the Serbian originals. Translating them four times would have
   * invited four slightly different English versions of the same sentence.
   */
  readonly shared: {
    readonly aboutHeading: string
    readonly ctaHeading: string
    readonly ctaBody: string
    readonly ctaButton: string
    readonly ctaNote: string
    readonly quickStartHeading: string
    readonly whyHeading: string
    readonly heroBadgeLabel: string
    readonly heroBadgeText: string
    /** IndustriesScroll's label. Its component default is Serbian, so English must pass this. */
    readonly industriesLabel: string
    /** FaqSection's heading. Its component default is Serbian too. */
    readonly faqHeading: string
    /**
     * The closing CTA's destination, per locale: /contact for English and /sr/contact for
     * Serbian. Written down in each dictionary rather than derived at render time, because
     * the alternative is a component asking "which locale am I?" from the pathname — the
     * exact request-time guessing this architecture exists to avoid.
     */
    readonly contactHref: string
    /** The two FAQ entries all three GROW pages share word for word. */
    readonly faqShared: readonly [GrowthFaq, GrowthFaq]
    /** ResourceList's own copy, which was hardcoded Serbian before this phase. */
    readonly resourceList: {
      readonly zipLabel: string
      readonly defaultTitle: string
      readonly defaultDescription: string
    }
  }

  readonly grow: {
    readonly metadata: { readonly title: string; readonly description: string }
    readonly hero: {
      readonly title: string
      readonly subtitle: string
      readonly description: string
      readonly ctaText: string
    }
    readonly whyBody: string
    readonly stats: readonly [GrowthStat, GrowthStat, GrowthStat]
    readonly sourceLabel: string
    readonly sourceText: string
    readonly sourceHref: string
    /** The heading breaks across two lines in the original; the break is preserved. */
    readonly benefitsHeadingLine1: string
    readonly benefitsHeadingLine2: string
    readonly valueCards: readonly [GrowthCard, GrowthCard, GrowthCard, GrowthCard]
    readonly zipUrl: string
    readonly downloads: readonly [GrowthDownload, GrowthDownload, GrowthDownload]
    readonly focusHeading: string
    readonly focusBody: string
    /** The CFO and CEO role cards. Their destinations come from the ROUTE MAP, not from here. */
    readonly focusCards: readonly [
      { readonly title: string; readonly body: string; readonly cta: string; readonly ariaLabel: string },
      { readonly title: string; readonly body: string; readonly cta: string; readonly ariaLabel: string },
    ]
    readonly aboutBody: string
    readonly faqExtra: GrowthFaq
    readonly schema: {
      readonly articleAbout: readonly string[]
      readonly downloadsListName: string
      readonly downloadsListDescription: string
      readonly schemaDownloadNames: readonly [string, string, string]
    }
  }

  readonly cfo: GrowthRolePage
  readonly ceo: GrowthRolePage

  readonly professionalServices: {
    readonly metadata: {
      readonly title: string
      readonly description: string
      /** The OG image's alt text. Differs from the title: it carries no brand suffix. */
      readonly ogImageAlt: string
    }
    readonly hero: {
      readonly title: string
      readonly description: string
      readonly ctaText: string
    }
    readonly whyBody: string
    readonly stats: readonly [GrowthStat, GrowthStat, GrowthStat, GrowthStat]
    readonly sourceLabel: string
    readonly sourceText: string
    readonly sourceHref: string
    readonly benefitsHeadingLine1: string
    readonly benefitsHeadingLine2: string
    readonly valueCards: readonly [GrowthCard, GrowthCard, GrowthCard, GrowthCard]
    readonly zipUrl: string
    readonly downloadsTitle: string
    readonly downloadsDescription: string
    readonly downloads: readonly [GrowthDownload, GrowthDownload, GrowthDownload, GrowthDownload]
    readonly aboutBody: string
    /** This page shares no FAQ entry with the GROW pages — all three differ. */
    readonly faqs: readonly [GrowthFaq, GrowthFaq, GrowthFaq]
    readonly schema: {
      readonly articleAbout: readonly string[]
      readonly downloadsListName: string
      readonly downloadsListDescription: string
      /**
       * The ItemList entries. Deliberately SEPARATE from `downloads` above, because the
       * Serbian half's URLs are historical and point at a directory that no longer exists —
       * a pre-existing defect preserved so Serbian schema output cannot drift. The English
       * half uses the real paths. See content/sr/growth.ts and the H4 report.
       */
      readonly schemaDownloads: readonly [
        GrowthSchemaDownload,
        GrowthSchemaDownload,
        GrowthSchemaDownload,
        GrowthSchemaDownload,
      ]
    }
  }
}

/** Every namespace a locale must provide. Add a namespace here and both locales break. */
export interface Dictionary {
  readonly common: CommonDictionary
  readonly contact: ContactDictionary
  readonly home: HomeDictionary
  readonly careers: CareersDictionary
  readonly faq: FaqDictionary
  readonly nav: NavDictionary
  readonly footer: FooterDictionary
  readonly caseStudies: CaseStudiesDictionary
  readonly projectPulse: ProjectPulseDictionary
  readonly projectPulseBrochure: ProjectPulseBrochureDictionary
  readonly projectPulseVideo: ProjectPulseVideoDictionary
  readonly sapStarterPackage: SapStarterPackageDictionary
  readonly consent: ConsentDictionary
  readonly growth: GrowthDictionary
  readonly mythBusters: MythBustersDictionary
}

/**
 * Static registry. `Record<Locale, Dictionary>` is what makes a missing locale a compile
 * error; `satisfies` keeps that check while preserving the literal types for callers.
 */
export const dictionaries = {
  en: {
    common: enCommon,
    contact: enContact,
    home: enHome,
    careers: enCareers,
    faq: enFaq,
    nav: enNav,
    footer: enFooter,
    caseStudies: enCaseStudies,
    projectPulse: enProjectPulse,
    projectPulseBrochure: enProjectPulseBrochure,
    projectPulseVideo: enProjectPulseVideo,
    sapStarterPackage: enSapStarterPackage,
    consent: enConsent,
    growth: enGrowth,
    mythBusters: enMythBusters,
  },
  sr: {
    common: srCommon,
    contact: srContact,
    home: srHome,
    careers: srCareers,
    faq: srFaq,
    nav: srNav,
    footer: srFooter,
    caseStudies: srCaseStudies,
    projectPulse: srProjectPulse,
    projectPulseBrochure: srProjectPulseBrochure,
    projectPulseVideo: srProjectPulseVideo,
    sapStarterPackage: srSapStarterPackage,
    consent: srConsent,
    growth: srGrowth,
    mythBusters: srMythBusters,
  },
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
export const DICTIONARY_NAMESPACES = [
  'common',
  'contact',
  'home',
  'careers',
  'faq',
  'nav',
  'footer',
  'caseStudies',
  'projectPulse',
  'projectPulseBrochure',
  'projectPulseVideo',
  'sapStarterPackage',
  'consent',
  'growth',
  'mythBusters',
] as const

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
