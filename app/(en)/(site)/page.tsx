import { HomePage } from "@/components/pages/HomePage"
import { getDictionary } from "@/content/dictionary"
import { buildHomeJsonLd } from "@/lib/home-jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"

/**
 * ENGLISH homepage — the English half of the home locale pair.
 *
 * Phase H1 changed how this file is assembled, not what it renders. The body moved to
 * components/pages/HomePage.tsx (shared with /sr) and every string moved to
 * content/en/home.ts verbatim, so the visible English copy is byte-for-byte what it was.
 *
 * The ONE intentional head change: `alternates` now carries real reciprocal hreflang,
 * because /sr went live in this phase.
 *
 * The dead `getServices()` array that used to sit in this file was never called — no
 * ServiceCard was ever rendered here — and went away with the refactor rather than being
 * carried into the dictionary.
 */

const PATH = "/"
const content = getDictionary("en").home

const homeMetadata = generatePageMetadata(content.metadata.title, content.metadata.description, PATH)

export const metadata = {
  ...homeMetadata,
  // `title.absolute` keeps the rendered <title> byte-identical to what this page emitted
  // before Phase D. While it lived at app/page.tsx it was part of the ROOT segment, so
  // the root layout's `%s | Infinus` template did not apply to it. Moving it into the
  // (site) route group — needed to share the site chrome — makes it a child segment,
  // which would otherwise append " | Infinus" and change the homepage title.
  title: { absolute: content.metadata.title },
  // Replaces the plain { canonical } the shared helper produces. Same canonical, plus
  // en / sr-Latn / x-default.
  alternates: localeAlternatesMetadata(PATH),
}

const jsonLd = buildHomeJsonLd("en")

export default function EnglishHomePage() {
  return <HomePage content={content} jsonLd={jsonLd} anchorBase={PATH} />
}
