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
]

/** Every path that is half of a complete pair — the only paths allowed locale output. */
export const PAIRED_PATHS: readonly string[] = COMPLETE_PAIRS.flatMap((p) => [p.en, p.sr])

/** Every Serbian half, i.e. every /sr URL that must exist. */
export const LIVE_SERBIAN_PREFIXED_PATHS: readonly string[] = COMPLETE_PAIRS.map((p) => p.sr)

/**
 * English pages whose Serbian counterpart is still only PLANNED.
 *
 * These must emit no hreflang and show no switcher. Kept explicit so that translating one
 * requires moving it up into COMPLETE_PAIRS rather than just deleting an expectation.
 */
export const UNPAIRED_ENGLISH_PATHS: readonly string[] = [
  '/projectpulse',
  '/projectpulse/brochure',
  '/projectpulse/video',
  '/sap-packaged-solutions/sap-starter-package',
]

/** Serbian URLs that must still 404 — the planned counterparts of the list above. */
export const PLANNED_SERBIAN_PATHS: readonly string[] = [
  '/sr/projectpulse',
  '/sr/projectpulse/brochure',
  '/sr/projectpulse/video',
  '/sr/sap-packaged-solutions/sap-starter-package',
]

/**
 * Serbian pages with NO English counterpart, not even a planned one.
 *
 * The legacy campaign pages plus the redirect-backed /cfo. They must never show a switcher
 * and must never be paired with "/" as a fake English version.
 */
export const SERBIAN_ONLY_PATHS: readonly string[] = [
  '/grow',
  '/grow/cfo',
  '/grow/ceo',
  '/professional-services',
  '/cfo',
]
