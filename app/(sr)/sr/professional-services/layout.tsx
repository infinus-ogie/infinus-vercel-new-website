import { Metadata } from "next";
import { getDictionary } from "@/content/dictionary";
import { localeAlternatesMetadata } from "@/lib/seo-i18n";
import { pairPath } from "@/lib/growth-routes";

/**
 * Serbian Professional Services metadata — /sr/professional-services.
 *
 * No longer renders SiteChrome: app/(sr)/sr/layout.tsx owns the navbar, <main> and footer for
 * everything under /sr, and rendering it twice would nest one set inside the other.
 *
 * The head is otherwise unchanged from when this page lived at /professional-services. Only
 * PATH moved, which updates og:url, the self-canonical and the hreflang pair. The
 * `title.absolute` stays for the reason it was added — the literal already ends in
 * "| Infinus", and the root template would append a second one.
 */

const PATH = pairPath("professional-services", "sr");
const content = getDictionary("sr").growth.professionalServices;

export const metadata: Metadata = {
  // `absolute` because this literal already ends in "| Infinus" and the root layout's
  // "%s | Infinus" template would otherwise append a second one, rendering
  // "… | Infinus | Infinus". The openGraph and twitter titles below keep the same literal
  // they have always carried — only the <title> was rendering the brand twice.
  title: { absolute: content.metadata.title },
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
  twitter: {
    card: "summary_large_image",
    title: content.metadata.title,
    description: content.metadata.description,
    images: ["/og-default.png"],
  },
  alternates: localeAlternatesMetadata(PATH),
};

export default function ProfessionalServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
