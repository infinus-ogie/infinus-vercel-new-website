import type { Metadata } from "next"
import { Inter, IBM_Plex_Sans } from "next/font/google"
import "./globals.css"
import { SITE_CONFIG } from "@/lib/jsonld"
import { Toaster } from "sonner"
import { ConsentProvider } from "@/components/consent/ConsentProvider"
import { CookieBanner } from "@/components/consent/CookieBanner"
import { CookieSettingsDialog } from "@/components/consent/CookieSettingsDialog"
import { AnalyticsGate } from "@/components/consent/AnalyticsGate"
import { MarketingGate } from "@/components/consent/MarketingGate"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const ibmPlexSans = IBM_Plex_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
})

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* No analytics or marketing vendor script is loaded here.
            The previous unconditional GA4 <Script> tags were removed: because they
            lived in this server component they ran for every visitor before any
            consent decision. Analytics now loads only from <AnalyticsGate>, and only
            after explicit consent — see components/consent/AnalyticsGate.tsx. */}
      </head>
      <body className={`${inter.variable} ${ibmPlexSans.variable} font-sans`}>
        <ConsentProvider>
          {children}
          <Toaster position="top-right" richColors />

          {/* Consent UI. Mounted exactly once, at the root, so the banner and the
              settings dialog are available on every page including the ones that
              render their own header/footer. */}
          <CookieBanner />
          <CookieSettingsDialog />

          {/* Vendor mount points. Both render null until the matching category is
              explicitly allowed, so nothing reaches the prerendered HTML. */}
          <AnalyticsGate />
          <MarketingGate />
        </ConsentProvider>
      </body>
    </html>
  )
}
