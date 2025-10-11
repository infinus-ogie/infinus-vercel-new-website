import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const footerLinks = [
  {
    title: "Services",
    links: [
      { href: "/#services", label: "SAP Implementation Services" },
      { href: "/#services", label: "SAP Support Services" },
      { href: "/#services", label: "Other Services" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#about", label: "About Us" },
      { href: "/grow", label: "GROW With SAP: Finance" },
      { href: "/professional-services", label: "SAP for Professional Services" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/grow#downloads", label: "CFO Insights & Finance Resources" },
      { href: "/professional-services#downloads", label: "Automation & Innovation Reports" },
    ],
  },
];

const socialLinks = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/infinus1/posts/?feedView=all", icon: true },
  { name: "Facebook", href: "#" },
  { name: "Instagram", href: "#" },
  { name: "Twitter", href: "#" },
];

export function Footer2() {
  const currentYear = new Date().getFullYear();

  return (
    <footer data-qa="FOOTER_ACTIVE" className="bg-slate-50 border-t">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        {/* Top section with Infinus info and navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
          {/* Infinus Company Info - takes 1 column */}
          <div className="md:col-span-1">
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
            
            <p className="text-slate-600 mb-4 max-w-md leading-relaxed">
              Infinus d.o.o.<br />
              Tresnjinog cveta 1<br />
              11070 Belgrade,<br />
              Serbia
            </p>

            <div className="flex items-center mb-4">
              <Badge variant="secondary" className="rounded-2xl px-4 py-2">
                SAP Gold Partner
              </Badge>
            </div>

            <p className="text-sm text-slate-600 max-w-md">
              SAP Gold Partner focused on SAP Business Suite solutions including Cloud ERP, Business Data Cloud, Business AI, and Business Technology Platform.
            </p>
          </div>

          {/* Navigation Links - takes 2 columns */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {footerLinks.map((item, i) => (
                <div key={i}>
                  <h3 className="mb-4 text-xs font-semibold text-slate-900 tracking-tight">{item.title}</h3>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    {item.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="hover:text-slate-900 transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-200" />
        
        {/* Social Buttons + App Links */}
        <div className="py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 items-center">
            {socialLinks.map(({ name, href, icon }, i) => (
              <a
                href={href}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                key={i}
                target={name === "LinkedIn" ? "_blank" : "_self"}
                rel={name === "LinkedIn" ? "noopener noreferrer" : undefined}
              >
                {name === "LinkedIn" && icon ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                ) : (
                  name
                )}
              </a>
            ))}
          </div>

          <div className="flex gap-4">
            <p className="text-sm text-slate-600">Mobile Apps Coming Soon</p>
          </div>
        </div>

        <div className="h-px bg-slate-200" />
        
        {/* Bottom copyright */}
        <div className="text-center text-xs text-slate-600 py-4">
          <p>
            © {currentYear} Infinus. All rights reserved.{" "}
            <span className="hidden md:inline">•</span>{" "}
            <span className="block md:inline mt-1 md:mt-0">
              Developed by{" "}
              <a
                href="https://www.brivio.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 hover:underline transition-colors"
              >
                Brivio
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
