import { NavBarDemo } from "@/components/ui/navbar-demo"
import Footer from "@/components/ui/footer"

/**
 * The shared public-site chrome: navigation, the main landmark, and the footer.
 *
 * Before this existed, six page files each rendered a byte-identical copy of this
 * wrapper inline (`app/page.tsx`, `app/grow/page.tsx`, `app/grow/cfo/page.tsx`,
 * `app/grow/ceo/page.tsx`, `app/professional-services/page.tsx`, `app/cfo/page.tsx`)
 * alongside the copy in `app/(site)/layout.tsx`. The markup below is that wrapper,
 * unchanged, so consolidating onto it is a no-op for rendered output.
 *
 * Deliberately a SERVER component. NavBarDemo and Footer are client components and stay
 * that way, but the chrome itself no longer has to live inside a page's client tree —
 * which is why the four Serbian campaign pages get a slightly smaller client bundle
 * boundary without any behavioural change.
 *
 * It owns no <html>, no <body> and no fonts: those remain in app/layout.tsx. It reads no
 * request state, so every route stays statically prerendered.
 *
 * Pages that intentionally have NO chrome (the demo and debug routes) simply do not use
 * this component, exactly as before.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBarDemo />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
