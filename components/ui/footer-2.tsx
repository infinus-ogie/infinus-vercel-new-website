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
      { href: "/#about", label: "About" },
      { href: "/grow", label: "Grow" },
      { href: "/professional-services", label: "Professional Services" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
  {
    title: "Expertise",
    links: [
      { href: "/#sap-expertise", label: "SAP Expertise" },
      { href: "/#domain-expertise", label: "Domain Expertise" },
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
  { name: "LinkedIn", href: "#" },
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8">
          {/* Infinus Company Info - takes 2 columns */}
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

          {/* Navigation Links - takes 3 columns */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
            {socialLinks.map(({ name, href }, i) => (
              <a
                href={href}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                key={i}
              >
                {name}
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
