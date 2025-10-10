import { NavBarDemo } from "@/components/ui/navbar-demo"
import Footer from "@/components/ui/footer"

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
      <Footer />
    </div>
  )
}
