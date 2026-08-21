import type { Metadata } from "next"
import { HomePage } from "@/components/pages/HomePage"
import { getDictionary } from "@/content/dictionary"
import { buildHomeJsonLd } from "@/lib/home-jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"
import { LOCALE_META } from "@/lib/i18n"

/**
 * SERBIAN homepage — /sr.
 *
 * `(sr)` is a route group and contributes nothing to the URL; the literal `sr` segment is
 * what produces /sr. Sitting inside the Serbian root means the document emits
 * <html lang="sr-Latn"> with no per-page work.
 *
 * No middleware, no [locale] segment, no request-time locale detection — the locale is a
 * property of this file's position in the tree, decided at build time, so the route stays
 * statically prerendered.
 *
 * The body, every section and all interactive behaviour come from
 * components/pages/HomePage.tsx — the same component `/` renders. This file supplies only
 * the Serbian dictionary, metadata and JSON-LD input.
 *
 * The visible copy is a DRAFT pending owner approval; see content/sr/home.ts.
 */

const PATH = "/sr"
const content = getDictionary("sr").home

const base = generatePageMetadata(content.metadata.title, content.metadata.description, PATH)

export const metadata: Metadata = {
  ...base,
  // Mirrors the English homepage, which uses `title.absolute` to opt out of the root
  // layout's `%s | Infinus` template. Without this the Serbian home would render
  // "… | Infinus" while `/` renders no suffix — an inconsistency between two halves of the
  // same pair. The two homepages now behave identically.
  title: { absolute: content.metadata.title },
  // Self-canonical https://www.infinus.co/sr, plus the same reciprocal en / sr-Latn /
  // x-default set that `/` emits. Both halves must advertise the identical set.
  alternates: localeAlternatesMetadata(PATH),
  openGraph: {
    ...base.openGraph,
    // The one field the shared English-defaulted helper gets wrong for this locale.
    locale: LOCALE_META.sr.ogLocale,
  },
}

const jsonLd = buildHomeJsonLd("sr")

export default function SerbianHomePage() {
  return <HomePage content={content} jsonLd={jsonLd} anchorBase={PATH} />
}
