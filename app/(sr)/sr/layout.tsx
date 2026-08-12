import { SiteChrome } from "@/components/shell/SiteChrome"

/**
 * Shared site chrome for the /sr URL space.
 *
 * The Serbian document root — app/(sr)/layout.tsx — owns <html lang="sr-Latn">, fonts and
 * the consent mounts. It has no equivalent of the English `(site)` group, so the four
 * legacy campaign pages each wrap SiteChrome in their own layout. This file does the same
 * job once for everything under /sr, so future Serbian pages inherit navigation, the <main>
 * landmark and the footer without repeating it.
 *
 * A layout without a page.tsx creates NO route: /sr itself still returns 404. Only
 * /sr/contact is real in this phase.
 *
 * Deliberately no metadata export — each page declares its own Serbian title, description,
 * canonical, og:locale and alternates, so nothing is inherited that would need overriding.
 */
export default function SerbianSiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>
}
