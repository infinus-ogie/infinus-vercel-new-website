import { RootShell } from "@/components/shell/RootShell"
import { rootMetadata } from "@/components/shell/root-metadata"

/**
 * ROOT LAYOUT — English / default document root.
 *
 * `(en)` is a route group, so it contributes NOTHING to any URL: `/`, `/contact`,
 * `/faq`, the case studies, the ProjectPulse pages, the SAP Starter Package page, the
 * bilingual legal page and the internal demo/debug routes all keep their exact paths.
 *
 * Emits <html lang="en">, unchanged from before the split.
 */
export const metadata = rootMetadata

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="en">{children}</RootShell>
}
