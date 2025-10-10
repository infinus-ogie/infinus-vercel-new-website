import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

interface Footer7Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "Services",
    links: [
      { name: "SAP Implementation Services", href: "/#services" },
      { name: "SAP Support Services", href: "/#services" },
      { name: "Other Services", href: "/#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/#about" },
      { name: "Grow", href: "/grow" },
      { name: "Professional Services", href: "/professional-services" },
      { name: "FAQ", href: "/faq" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
  },
  {
    title: "Expertise",
    links: [
      { name: "SAP Expertise", href: "/#sap-expertise" },
      { name: "Domain Expertise", href: "/#domain-expertise" },
    ],
  },
  {
    title: "Grow Materials",
    links: [
      { name: "CFO Insights & Finance Resources", href: "/grow#downloads" },
    ],
  },
  {
    title: "Professional Services Materials",
    links: [
      { name: "Automation & Innovation Reports", href: "/professional-services#downloads" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaLinkedin className="size-7" />, href: "#", label: "LinkedIn" },
];

const defaultLegalLinks: Array<{ name: string; href: string }> = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Cookie Settings", href: "#" },
];

export const Footer7 = ({
  logo = {
    url: "/",
    src: "/infinus-new-logo.webp",
    alt: "Infinus Logo",
    title: "Infinus",
  },
  sections = defaultSections,
  description = "SAP Gold Partner focused on SAP Business Suite solutions including Cloud ERP, Business Data Cloud, Business AI, and Business Technology Platform.",
  socialLinks = defaultSocialLinks,
  copyright = `© ${new Date().getFullYear()} Infinus. All rights reserved.`,
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <section className="py-32 bg-muted/50 border-t">
      <div className="container mx-auto">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            {/* Logo */}
            <div className="flex items-center lg:justify-start">
              <Link href={logo.url} className="hover:opacity-80 transition-opacity">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  width={200}
                  height={60}
                  className="h-14 w-auto"
                  priority
                />
              </Link>
            </div>
            <p className="max-w-[70%] text-sm text-muted-foreground">
              {description}
            </p>
            <ul className="flex items-center space-x-6 text-muted-foreground">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="font-medium hover:text-primary">
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-5 lg:gap-20">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center md:text-left">
          <div className="order-2 lg:order-1 flex flex-col gap-2">
            <p>{copyright}</p>
            {legalLinks.length > 0 && (
              <div className="flex gap-4">
                {legalLinks.map((link, idx) => (
                  <Link key={idx} href={link.href} className="hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <p className="order-1 text-sm font-medium">
            Developed by <a href="https://www.brivio.co/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors font-semibold">
              Brivio
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
