import { Metadata } from "next";
import { getDictionary } from "@/content/dictionary";
import { localeAlternatesMetadata } from "@/lib/seo-i18n";
import { pairPath } from "@/lib/growth-routes";

/**
 * Serbian GROW metadata — /sr/grow and its two role children.
 *
 * ── Why this file no longer renders SiteChrome ──────────────────────────────────
 * It used to, because these pages sat directly under the Serbian document root, which has no
 * equivalent of the English `(site)` group. Under /sr they inherit app/(sr)/sr/layout.tsx,
 * which already renders the navbar, the <main> landmark and the footer for the whole subtree.
 * Rendering it again here would nest a second navbar and footer inside the first.
 *
 * ── Why the metadata is still hand-written ──────────────────────────────────────
 * Every other page under /sr builds its head with `generatePageMetadata`. These four keep the
 * literal blocks they have always had, deliberately: that helper derives og:title and
 * og:image:alt from the document title, and these pages carry their own `ogImageAlt` and an
 * og:title without the brand suffix. Switching them over would have quietly rewritten what
 * they advertise to social crawlers, which is not what a routing change is allowed to do.
 *
 * So the only field that moves in this migration is the URL: PATH is now /sr/grow, which
 * updates og:url, the self-canonical and both sides of the hreflang pair. The title,
 * description, og:locale sr_RS, the OG image and its alt are byte-identical.
 */

const PATH = pairPath("grow", "sr");
const content = getDictionary("sr").growth.grow;

export const metadata: Metadata = {
  title: content.metadata.title,
  description: content.metadata.description,
  openGraph: {
    title: content.metadata.title,
    description: content.metadata.description,
    url: PATH,
    siteName: "Infinus",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: content.metadata.title,
      },
    ],
    locale: "sr_RS",
    type: "website",
  },
  alternates: localeAlternatesMetadata(PATH),
};

export default function GrowLayout({ children }: { children: React.ReactNode }) {
  return children;
}
