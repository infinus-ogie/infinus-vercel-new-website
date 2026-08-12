import type { Metadata } from "next"
import { SITE_CONFIG } from "@/lib/jsonld"

/**
 * Root metadata defaults, shared by BOTH locale root layouts.
 *
 * Kept in one module on purpose: app/(en)/layout.tsx and app/(sr)/layout.tsx must not
 * drift. Everything here — including `openGraph.locale: "en_US"` — is byte-identical to
 * what the single root layout emitted before the split, so no English or Serbian page's
 * head output changes. The Serbian pages already override og:locale to sr_RS in their
 * own layouts, exactly as before.
 */
export const rootMetadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "SAP",
    "SAP Cloud",
    "SAP implementation",
    "SAP support",
    "SAP Gold Partner",
    "business solutions",
    "enterprise software",
    "cloud migration",
    "digital transformation",
    "Infinus"
  ],
  authors: [{ name: "Infinus Team" }],
  creator: "Infinus",
  publisher: "Infinus",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.defaultImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.defaultImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}
