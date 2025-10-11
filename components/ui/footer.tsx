"use client";

import Image from "next/image";
import Link from "next/link";

const footerConfig = {
  description:
    "Infinus d.o.o. is a SAP Gold Partner focused on SAP Business Suite solutions including Cloud ERP, Business Data Cloud, Business AI, and Business Technology Platform. We help businesses transform their operations with cutting-edge SAP technologies.",
  logo: {
    dark: "/infinus-new-logo.webp",
    light: "/infinus-new-logo.webp",
  },
  contact: {
    email: "office@infinus.rs",
    phone: "+381 11 123 4567",
    address: "Tresnjinog cveta 1, 11070 Belgrade, Serbia",
  },
  columns: [
    {
      title: "Contact Information",
      links: [
        { label: "Tresnjinog cveta 1, 11070 Belgrade, Serbia", href: "#" },
        { label: "office@infinus.rs", href: "mailto:office@infinus.rs" },
        { label: "+381 11 123 4567", href: "tel:+381111234567" },
        { label: "Follow Us", href: "https://www.linkedin.com/company/infinus", isExternal: true },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "SAP Implementation Services", href: "/#services" },
        { label: "SAP Support Services", href: "/#services" },
        { label: "Other Services", href: "/#services" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/#about" },
        { label: "Grow", href: "/grow" },
        { label: "Professional Services", href: "/professional-services" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Expertise",
      links: [
        { label: "SAP Expertise", href: "/#sap-expertise" },
        { label: "Domain Expertise", href: "/#domain-expertise" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Grow Materials", href: "/grow#downloads" },
        { label: "Professional Services Materials", href: "/professional-services#downloads" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
      ],
    },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-[#00144a] text-white px-6 py-14 border-t border-blue-500/20 overflow-hidden">
      {/* Background gradient effects similar to hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] via-transparent to-blue-600/[0.06] blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#00144a] via-transparent to-[#00144a]/80 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Top Section: Logo and Description */}
        <div className="mb-12">
          {/* Logo with dark/light mode support */}
          <div className="relative mb-6">
            <Image
              src={footerConfig.logo.dark}
              alt="Infinus Logo"
              width={250}
              height={75}
              className="h-20 w-auto"
            />
          </div>
          <p className="text-sm text-white/70 leading-relaxed max-w-2xl">
            {footerConfig.description}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 flex-1">
            {footerConfig.columns.map((col, idx) => (
              <div key={idx} className={col.title === "Contact Information" ? "relative" : ""}>
                {col.title === "Contact Information" ? (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                    <h3 className="text-sm font-medium mb-3 text-white">{col.title}</h3>
                    <ul className="space-y-2">
                      {col.links.map((link, i) => (
                        <li key={i}>
                          <Link
                            href={link.href}
                            className="text-[0.85rem] text-white/80 hover:text-blue-300 transition"
                            {...(link.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <>
                    <h3 className="text-sm font-medium mb-3 text-white">{col.title}</h3>
                    <ul className="space-y-2">
                      {col.links.map((link, i) => (
                        <li key={i}>
                          <Link
                            href={link.href}
                            className="text-[0.85rem] text-white/70 hover:text-blue-300 transition"
                            {...(link.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-white/60 gap-4">
          <p>© {new Date().getFullYear()} Infinus. All rights reserved.</p>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white/80 transition">Privacy</Link>
            </div>
            <p className="text-xs text-white/60">
              Developed by{" "}
              <a
                href="https://www.brivio.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 transition-colors font-medium"
              >
                Brivio
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}