import { Metadata } from "next";
import { getDictionary } from "@/content/dictionary";
import { localeAlternatesMetadata } from "@/lib/seo-i18n";
import { pairPath } from "@/lib/growth-routes";

/**
 * Serbian SAP for CEOs metadata.
 *
 * Returns `children` untouched. The chrome for the whole /sr subtree comes from
 * app/(sr)/sr/layout.tsx; this file exists only to own the head for one page.
 *
 * The strings are unchanged. The only thing this migration moved is PATH — now /sr/grow/ceo —
 * which updates og:url, the self-canonical and the hreflang pair. The English counterpart is
 * /grow/ceo, the clean path this page used to occupy.
 */

const PATH = pairPath("grow-ceo", "sr");
const content = getDictionary("sr").growth.ceo;

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
        alt: content.metadata.ogImageAlt,
      },
    ],
    locale: "sr_RS",
    type: "website",
  },
  alternates: localeAlternatesMetadata(PATH),
};

export default function CEOLayout({ children }: { children: React.ReactNode }) {
  return children;
}
