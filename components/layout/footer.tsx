import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

const navigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "Services", href: "/#services" },
    { name: "About", href: "/#about" },
    { name: "GROW", href: "/grow" },
    { name: "Professional Services", href: "/professional-services" },
    { name: "Careers", href: "/#join-team" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
  legal: [],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container-custom">
        <div className="section-padding">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                  <Image
                    src="/infinus-new-logo.webp"
                    alt="Infinus Logo"
                    width={200}
                    height={60}
                    className="h-14 w-auto"
                    priority
                  />
                </Link>
              </div>
              <p className="text-slate-600 mb-6 max-w-md leading-relaxed">
                Infinus d.o.o.<br />
                Tresnjinog cveta 1<br />
                11070 Belgrade,<br />
                Serbia
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="rounded-2xl px-4 py-2">SAP Gold Partner</Badge>
              </div>
            </div>

            {/* Main Navigation */}
            <div>
              <h3 className="font-semibold mb-6 text-slate-900">Navigation</h3>
              <ul className="space-y-3">
                {navigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="link-accessible text-sm transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-6 text-slate-900">Contact</h3>
              <div className="space-y-3">
                <p className="text-slate-600">
                  <a 
                    href="mailto:office@infinus.rs" 
                    className="link-accessible hover:text-slate-900 transition-colors"
                  >
                    office@infinus.rs
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-600 text-sm">
                © {currentYear} Infinus. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0">
                <p className="text-slate-600 text-sm font-medium">
                  Developed by <a href="https://www.brivio.co/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors font-semibold">
                    Brivio
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
