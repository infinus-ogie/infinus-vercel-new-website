import { RootShell } from "@/components/shell/RootShell"
import { rootMetadata } from "@/components/shell/root-metadata"

/**
 * ROOT LAYOUT — Serbian document root.
 *
 * `(sr)` is a route group, so it contributes NOTHING to any URL. The legacy Serbian
 * campaign pages keep their existing public paths exactly: /grow, /grow/cfo, /grow/ceo,
 * /professional-services, plus /cfo which is still built behind its permanent redirect.
 * No /sr/* route is created in this phase and no redirect changes.
 *
 * The ONE intentional public change in Phase E: these documents now emit
 * <html lang="sr-Latn"> instead of the incorrect lang="en" they inherited from the
 * single root layout. Their copy has always been Serbian.
 *
 * Metadata defaults are shared with the English root, so titles, descriptions,
 * canonicals, OpenGraph and Twitter output are unchanged — each page's own layout still
 * supplies its Serbian title and og:locale sr_RS exactly as before.
 */
export const metadata = rootMetadata

export default function SerbianRootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="sr">{children}</RootShell>
}
