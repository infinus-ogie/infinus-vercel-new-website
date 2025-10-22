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
    address: "Tresnjinog cveta 1, 11070 Belgrade, Serbia",
  },
  columns: [
    {
      title: "Contact Information",
      links: [
        { label: "Tresnjinog cveta 1, 11070 Belgrade, Serbia", href: "#" },
        { label: "office@infinus.rs", href: "mailto:office@infinus.rs" },
        { label: "LinkedIn", href: "https://www.linkedin.com/company/infinus1/posts/?feedView=all", isExternal: true, isLinkedIn: true },
      ],
    },
    {
      title: "Our Expertise",
      links: [
        { label: "SAP Advisory & Consulting", href: "/#our-expertise" },
        { label: "SAP Implementations", href: "/#our-expertise" },
        { label: "SAP Application Management & Support", href: "/#our-expertise" },
        { label: "SAP Integration & Process Optimization", href: "/#our-expertise" },
        { label: "SAP Extensions & Innovation", href: "/#our-expertise" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/#about" },
        { label: "GROW with SAP: Finance", href: "/grow" },
        { label: "SAP for Professional Services", href: "/professional-services" },
        { label: "Careers", href: "/#join-team" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "GROW Materials", href: "/grow#downloads" },
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
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <Image
                src={footerConfig.logo.dark}
                alt="Infinus Logo"
                width={250}
                height={75}
                className="h-20 w-auto"
              />
            </Link>
          </div>
          <p className="text-sm text-white/70 leading-relaxed max-w-2xl">
            {footerConfig.description}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 flex-1">
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
                            className="text-[0.85rem] text-white/80 hover:text-blue-300 transition flex items-center gap-2"
                            {...(link.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                          >
                            {link.isLinkedIn ? (
                              <>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                {link.label}
                              </>
                            ) : (
                              link.label
                            )}
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