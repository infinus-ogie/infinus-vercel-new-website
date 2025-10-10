import { NavBarDemo } from "@/components/ui/navbar-demo"
import { Footer7 } from "@/components/ui/footer-7"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBarDemo />
      <main className="flex-1">
        {children}
      </main>
      <Footer7 />
    </div>
  )
}
