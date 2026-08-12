/**
 * LOCALE-AWARE METADATA PRIMITIVES — canonical + reciprocal hreflang.
 *
 * NOTHING CALLS THIS YET, and that is the point of the phase.
 *
 * ── Why a separate module instead of an addition to lib/seo.ts ──────────────────
 * lib/seo.ts is imported by 10 live page files. Importing the route map into it pulled
 * content/routes.ts into the module graph of every one of those pages, which shifted
 * webpack chunk ids in the build output — measured, not assumed. The rendered <head> was
 * unaffected, but a phase promising an inert foundation should not move a single byte of
 * the shipped bundle, so the new primitive sits in its own module that no page imports.
 * lib/seo.ts is therefore byte-identical to the previous commit.
 *
 * When a page eventually needs alternates, it imports THIS module and merges the result
 * into its metadata. `generateMetadata` in lib/seo.ts stays locale-unaware.
 *
 * ── The rule ────────────────────────────────────────────────────────────────────
 * `languages` is emitted ONLY for a route pair that is real and complete on both sides —
 * lib/locale-routes.ts decides, and it refuses for a `planned` path, a null side or an
 * `excluded` pair. No page on the site satisfies that today, so every current path yields
 * exactly `{ canonical }`, which is precisely the metadata the site already produces.
 */

import type { Metadata } from 'next'
import { absoluteUrl } from './i18n'
import { localeAlternatesFor } from './locale-routes'
import type { RoutePair } from '@/content/routes'

type MetadataAlternates = NonNullable<Metadata['alternates']>
type MetadataLanguages = NonNullable<MetadataAlternates['languages']>

/**
 * Canonical plus reciprocal hreflang for a page, in Next's `Metadata` shape.
 *
 * For a complete pair both members produce the SAME language set — reciprocity is what
 * makes hreflang valid — plus `x-default` pointing at the default locale, which is served
 * at the unprefixed URL.
 *
 * For everything else: exactly `{ canonical }`.
 *
 * OPEN DECISION for the rollout phase: the Serbian hreflang token is `sr-Latn`, matching
 * the `<html lang>` the Serbian root layout already emits. The alternative is the
 * region-specific `sr-Latn-RS` the existing JSON-LD uses. Both are valid BCP-47 and the
 * choice widens or narrows targeting, so it belongs to the owner rather than being baked
 * in silently while no hreflang is emitted at all.
 */
export function localeAlternatesMetadata(path: string, pairs?: readonly RoutePair[]): MetadataAlternates {
  const canonical = absoluteUrl(path)
  const alternates = pairs === undefined ? localeAlternatesFor(path) : localeAlternatesFor(path, pairs)

  if (alternates === null) {
    return { canonical }
  }

  // Next types `languages` as a closed union of language codes. It contains 'en' and
  // 'sr-Latn-RS' but NOT the script-only 'sr-Latn' this site uses for <html lang>, so the
  // key set needs one assertion. Scoped to this single boundary; values stay typed.
  const languages = {
    ...alternates.languages,
    'x-default': alternates.xDefault,
  } as MetadataLanguages

  return { canonical, languages }
}
