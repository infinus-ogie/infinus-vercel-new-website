import { Inter, IBM_Plex_Sans } from "next/font/google"
import "@/app/globals.css"
import { Toaster } from "sonner"
import { ConsentProvider } from "@/components/consent/ConsentProvider"
import { CookieBanner } from "@/components/consent/CookieBanner"
import { CookieSettingsDialog } from "@/components/consent/CookieSettingsDialog"
import { AnalyticsGate } from "@/components/consent/AnalyticsGate"
import { MarketingGate } from "@/components/consent/MarketingGate"

/**
 * The one and only HTML document shell.
 *
 * Next.js supports multiple ROOT layouts only via top-level route groups, and each root
 * must render its own <html> and <body>. That is the whole reason this component exists:
 * app/(en)/layout.tsx and app/(sr)/layout.tsx both delegate here, so the two roots differ
 * in exactly ONE respect — the `lang` attribute — and cannot drift in fonts, consent,
 * global styles or body classes.
 *
 * A SERVER component. It must never become a client component: <html>/<body> ownership
 * has to stay on the server, and nothing here reads request state (no next/headers), so
 * every route remains statically prerendered.
 *
 * Fonts are declared once, in this module. Both roots therefore share the same font
 * instances and the same CSS variables — no duplicate loading, no fallback change.
 */

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

export function RootShell({
  lang,
  children,
}: {
  /** BCP-47 tag for this document root: "en" or "sr-Latn". The only per-root difference. */
  lang: string
  children: React.ReactNode
}) {
  return (
    <html lang={lang} className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* No analytics or marketing vendor script is loaded here. Analytics loads only
            from <AnalyticsGate>, and only after explicit consent — see
            components/consent/AnalyticsGate.tsx. */}
      </head>
      <body className={`${inter.variable} ${ibmPlexSans.variable} font-sans`}>
        <ConsentProvider>
          {children}
          <Toaster position="top-right" richColors />

          {/* Consent UI. Exactly once per document, in both locale roots, so the Phase C
              behaviour is identical whichever root a visitor lands on. The decision lives
              in a first-party cookie, so it survives the full document navigation that
              Next.js performs when crossing between root layouts. */}
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
