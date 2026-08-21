/**
 * COMPLETE LOCALE PAIRS — an independent declaration of what the site has translated.
 *
 * Like test/fixtures/routes.ts, this is a hand-written literal, NOT derived from
 * content/routes.ts. If the tests computed this from the map they are testing, they could
 * only restate it and would catch nothing: a pair activated by accident would silently
 * become "expected".
 *
 * It lives in one file rather than being repeated in each test because five suites need the
 * same list, and five copies drifting apart is its own failure mode. Adding a pair is a
 * single deliberate edit here — which is exactly the review checkpoint we want.
 *
 * ── What "complete" means ───────────────────────────────────────────────────────
 * Both halves exist as real routes, so the pair emits reciprocal hreflang and gets a
 * language switcher. Anything absent from this list must emit NEITHER.
 */

/** One complete pair: the English URL and its real Serbian counterpart. */
export interface LocalePairFixture {
  readonly en: string
  readonly sr: string
}

export const COMPLETE_PAIRS: readonly LocalePairFixture[] = [
  // Phase H1
  { en: '/', sr: '/sr' },
  { en: '/faq', sr: '/sr/faq' },
  // Phase G
  { en: '/contact', sr: '/sr/contact' },
  // Phase H2
  { en: '/case-study/retail1', sr: '/sr/case-study/retail1' },
  { en: '/case-study/pharma1', sr: '/sr/case-study/pharma1' },
  { en: '/case-study/pharma2', sr: '/sr/case-study/pharma2' },
  { en: '/case-study/nearshoring1', sr: '/sr/case-study/nearshoring1' },
  { en: '/case-study/manufacturing1', sr: '/sr/case-study/manufacturing1' },
  // Phase H3
  { en: '/projectpulse', sr: '/sr/projectpulse' },
  { en: '/projectpulse/brochure', sr: '/sr/projectpulse/brochure' },
  { en: '/projectpulse/video', sr: '/sr/projectpulse/video' },
  {
    en: '/sap-packaged-solutions/sap-starter-package',
    sr: '/sr/sap-packaged-solutions/sap-starter-package',
  },
  // Phase H4 — the GROW campaign. English took the clean unprefixed paths, which is where
  // the SERBIAN pages used to live; the Serbian halves moved under /sr like every other pair.
  { en: '/grow', sr: '/sr/grow' },
  { en: '/grow/cfo', sr: '/sr/grow/cfo' },
  { en: '/grow/ceo', sr: '/sr/grow/ceo' },
  { en: '/professional-services', sr: '/sr/professional-services' },
]

/**
 * Pairs that are NAVIGABLE but deliberately NOT INDEXABLE.
 *
 * The Privacy Policy: two independently approved legal documents, one per locale, each
 * `noindex, follow` and outside the sitemap. A visitor can switch between them and the
 * EN|SR control must work, but neither page may emit hreflang.
 *
 * Kept in its own list, not folded into COMPLETE_PAIRS, because the two lists answer
 * different questions and the tests must not blur them:
 *   COMPLETE_PAIRS      -> may emit hreflang, must be in the sitemap
 *   LOCALE_LINKED_PAIRS -> must emit NO hreflang, must be OUT of the sitemap
 * Both -> must resolve a counterpart and render the switcher.
 */
export const LOCALE_LINKED_PAIRS: readonly LocalePairFixture[] = [
  { en: '/privacy', sr: '/sr/politika-privatnosti' },
]

/** Every pair a visitor can switch across — indexable or not. 17 as of the GROW migration. */
export const NAVIGABLE_PAIRS: readonly LocalePairFixture[] = [
  ...COMPLETE_PAIRS,
  ...LOCALE_LINKED_PAIRS,
]

/** Every path that is half of a complete pair — the only paths allowed HREFLANG output. */
export const PAIRED_PATHS: readonly string[] = COMPLETE_PAIRS.flatMap((p) => [p.en, p.sr])

/** Every path that is half of ANY navigable pair — the paths allowed a SWITCHER. */
export const NAVIGABLE_PATHS: readonly string[] = NAVIGABLE_PAIRS.flatMap((p) => [p.en, p.sr])

/**
 * Every Serbian half that lives under /sr, i.e. every /sr URL that must exist.
 *
 * The filter is now a no-op — every navigable Serbian half is under /sr again, because the
 * GROW migration moved the last four there. It stays because it is the assertion that keeps
 * being true: if someone adds a pair whose Serbian side sits at an unprefixed URL, this list
 * and LIVE_SERBIAN_PATHS below stop agreeing, and the test that compares them fails.
 */
export const LIVE_SERBIAN_PREFIXED_PATHS: readonly string[] = NAVIGABLE_PAIRS.map((p) => p.sr).filter(
  (p) => p === '/sr' || p.indexOf('/sr/') === 0
)

/** Every Serbian half, wherever it lives. Identical to the filtered list above today. */
export const LIVE_SERBIAN_PATHS: readonly string[] = NAVIGABLE_PAIRS.map((p) => p.sr)

/**
 * English pages whose Serbian counterpart is still only PLANNED.
 *
 * These must emit no hreflang and show no switcher. Kept explicit so that translating one
 * requires moving it up into COMPLETE_PAIRS rather than just deleting an expectation.
 *
 * EMPTY as of Phase H3: every English page in the public site now has a live Serbian
 * counterpart. The list stays — as a declaration, and as the place the next untranslated
 * English page goes — and the suites that iterate it are written to pass on an empty list
 * rather than to assume at least one entry.
 */
export const UNPAIRED_ENGLISH_PATHS: readonly string[] = []

/**
 * Serbian URLs that must still 404 — the planned counterparts of the list above.
 *
 * Also EMPTY as of Phase H3, and still empty after the GROW migration: /sr/grow,
 * /sr/grow/cfo, /sr/grow/ceo and /sr/professional-services were the one set of paths that
 * might have belonged here, and they are LIVE — they are where the Serbian campaign pages
 * moved to, not URLs waiting to be built.
 */
export const PLANNED_SERBIAN_PATHS: readonly string[] = []

/**
 * Serbian pages with NO English counterpart, not even a planned one.
 *
 * They must never show a switcher and must never be paired with "/" as a fake English version.
 */
export const SERBIAN_ONLY_PATHS: readonly string[] = [
  // All that is left. Phase H4 paired the four campaign pages, and their Serbian halves then
  // moved under /sr. /cfo stays here: a redirect-backed duplicate, `excluded` from pairing,
  // with no counterpart in either direction. Its canonical points at /grow/cfo, which is now
  // the ENGLISH page — irrelevant in practice, because the redirect means the document is
  // never served.
  '/cfo',
]
