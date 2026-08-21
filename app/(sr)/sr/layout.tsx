import type { Metadata } from "next"
import { SiteChrome } from "@/components/shell/SiteChrome"
import { rootMetadata } from "@/components/shell/root-metadata"
import { LOCALE_META } from "@/lib/i18n"

/**
 * Shared site chrome for the /sr URL space.
 *
 * The Serbian document root — app/(sr)/layout.tsx — owns <html lang="sr-Latn">, fonts and
 * the consent mounts. It has no equivalent of the English `(site)` group, so the four
 * legacy campaign pages each wrap SiteChrome in their own layout. This file does the same
 * job once for everything under /sr: navigation, the <main> landmark and the footer.
 *
 * ── Why this file now exports metadata ─────────────────────────────────────────
 * It used to export none, on the reasoning that every page declares its own title,
 * description, canonical, og:locale and alternates. That held only for pages built with
 * `generatePageMetadata`, which spread `base.openGraph` and override `locale`. Two routes
 * hand-write their metadata objects instead — /sr/projectpulse/brochure and
 * /sr/projectpulse/video — and set no `openGraph` at all, so they inherited the ROOT's
 * openGraph block and advertised themselves to crawlers as `og:locale: en_US`. Serbian
 * documents claiming to be American English.
 *
 * Declaring it here fixes both and makes sr_RS the DEFAULT for the whole /sr subtree, so a
 * future Serbian page cannot forget it. Pages that define their own `openGraph` still win,
 * because the nearest ancestor that defines the field owns it.
 *
 * The root block is SPREAD rather than replaced: Next swaps `openGraph` wholesale at the
 * nearest definition, so writing `{ locale: 'sr_RS' }` alone would have silently dropped
 * og:type, og:url, og:title, og:description, og:site_name and og:image from those two
 * pages. Only `locale` changes.
 *
 * Nothing else is declared here. Titles, descriptions, canonicals and hreflang stay with
 * the individual pages, where the route-pair map can drive them.
 */
export const metadata: Metadata = {
  openGraph: {
    ...rootMetadata.openGraph,
    locale: LOCALE_META.sr.ogLocale,
  },
}

export default function SerbianSiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>
}
