import { Inter, IBM_Plex_Sans } from "next/font/google"
import "@/app/globals.css"
import { Toaster } from "sonner"
import { ConsentProvider } from "@/components/consent/ConsentProvider"
import { CookieBanner } from "@/components/consent/CookieBanner"
import { CookieSettingsDialog } from "@/components/consent/CookieSettingsDialog"
import { AnalyticsGate } from "@/components/consent/AnalyticsGate"
import { MarketingGate } from "@/components/consent/MarketingGate"
import { getDictionary } from "@/content/dictionary"
import { htmlLangFor, type Locale } from "@/lib/i18n"

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
 * ── This is where the site's locale is decided ───────────────────────────────────
 * `locale` comes from which ROOT LAYOUT rendered this, i.e. from the file's position in the
 * tree — app/(en)/layout.tsx passes "en", app/(sr)/layout.tsx passes "sr". It is fixed at
 * BUILD time and involves no request state whatsoever.
 *
 * That matters for more than the `lang` attribute. It is also the source of truth for which
 * language the consent UI speaks, and it is the only correct one: four Serbian pages live at
 * UNPREFIXED URLs — /grow, /grow/cfo, /grow/ceo, /professional-services — so deciding locale
 * from `pathname.startsWith("/sr")` would serve them an English cookie banner and send them
 * to the English Privacy Policy. Root position knows they are Serbian; the URL does not.
 *
 * The consent copy is resolved HERE, on the server, and passed down as a plain object. The
 * consent components are client components, so importing content/dictionary.ts into them
 * would pull all twelve namespaces into the client bundle for every page. This way only the
 * active locale's consent strings cross into the client.
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
  locale,
  children,
}: {
  /**
   * Which document root this is. The ONE per-root difference, and the source of truth for
   * both the `lang` attribute and the consent UI's language — see the note above.
   */
  locale: Locale
  children: React.ReactNode
}) {
  // "en" / "sr-Latn", from the locale model rather than a literal repeated in each layout.
  const lang = htmlLangFor(locale)
  const consentCopy = getDictionary(locale).consent

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
        <ConsentProvider copy={consentCopy}>
          {children}
          <Toaster position="top-right" richColors />

          {/* Consent UI. Exactly once per document, in both locale roots, so the behaviour
              is identical whichever root a visitor lands on — ONE banner implementation and
              ONE dialog implementation, differing only in the copy handed to them above.
              The decision lives in a first-party cookie, so it survives the full document
              navigation that Next.js performs when crossing between root layouts, and
              switching language never re-prompts. */}
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
