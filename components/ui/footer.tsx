"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsDialog";
import { chromeLocaleFor } from "@/lib/chrome-locale";
import { getDictionary } from "@/content/dictionary";

/**
 * Phase H1: the copy and destinations moved to content/{en,sr}/footer.ts VERBATIM, and the
 * shared Footer now renders in the locale of the page it is on — resolved through the
 * route-pair map, never by sniffing the path.
 *
 * The logo asset stays here: it is the same image in both locales.
 */
const LOGO_SRC = "/infinus-new-logo.webp";

export default function Footer() {
  const pathname = usePathname();
  const dictionary = getDictionary(chromeLocaleFor(pathname));
  const copy = dictionary.footer;

  // Five columns in the order the client proposed, mirroring the new navigation:
  // Contact Information, Company, Expertise, Insights, Legal. The Contact column keeps its
  // distinct card treatment, keyed on identity rather than on the English title string.
  //
  // The three middle columns hold NavMenuEntry, so a category with no index page renders as
  // a heading over its children instead of linking to one of them. Contact and Legal are
  // plain link lists — neither has a category in it — so they are converted to the same
  // shape here rather than growing a second rendering path.
  const asEntries = (group: { label: string; items: readonly { label: string; href: string }[] }) => ({
    label: group.label,
    entries: group.items.map((item) => ({ kind: "link" as const, ...item })),
  });

  const columns = [
    { key: "contact", isContact: true, menu: asEntries(copy.columns.contact) },
    { key: "company", isContact: false, menu: copy.columns.company },
    { key: "expertise", isContact: false, menu: copy.columns.expertise },
    { key: "insights", isContact: false, menu: copy.columns.insights },
    { key: "legal", isContact: false, menu: asEntries(copy.columns.legal) },
  ];

  return (
    <footer className="relative bg-[#00144a] text-white px-4 sm:px-6 lg:px-8 py-14 border-t border-blue-500/20 overflow-hidden">
      {/* Background gradient effects similar to hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] via-transparent to-blue-600/[0.06] blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#00144a] via-transparent to-[#00144a]/80 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Top Section: Logo and Description */}
        <div className="mb-12">
          {/* Logo with dark/light mode support */}
          <div className="relative mb-6">
            <Link href={dictionary.nav.home.href} className="inline-block hover:opacity-80 transition-opacity">
              <Image
                src={LOGO_SRC}
                alt={copy.logoAlt}
                width={250}
                height={75}
                className="h-20 w-auto"
              />
            </Link>
          </div>
          <p className="text-sm text-white/70 leading-relaxed max-w-2xl">
            {copy.description}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 flex-1">
            {columns.map((col) => {
              // The Contact column renders address / mailbox / LinkedIn, never a category.
              const contactLinks = copy.columns.contact.items;
              return (
              <div key={col.key} className={col.isContact ? "relative" : ""}>
                {col.isContact ? (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                    <h3 className="text-sm font-medium mb-3 text-white">{col.menu.label}</h3>
                    <ul className="space-y-2">
                      {contactLinks.map((link, i) => (
                        <li key={i}>
                          <Link
                            href={link.href}
                            className="text-[0.85rem] text-white/80 hover:text-blue-300 transition flex items-center gap-2"
                            {...(link.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                          >
                            {link.href.includes("linkedin.com") ? (
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
                    <h3 className="text-sm font-medium mb-3 text-white">{col.menu.label}</h3>
                    <ul className="space-y-2">
                      {col.menu.entries.map((entry, i) =>
                        entry.kind === "group" ? (
                          // A CATEGORY with no index page. It is a label, not a link — the
                          // whole reason NavMenuEntry has two shapes. Its children carry the
                          // real destinations.
                          <li key={i}>
                            <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-white/40 mt-3 mb-1.5">
                              {entry.label}
                            </p>
                            <ul className="space-y-2 pl-3 border-l border-white/10">
                              {entry.items.map((link, j) => (
                                <li key={j}>
                                  <Link
                                    href={link.href}
                                    className="text-[0.85rem] text-white/70 hover:text-blue-300 transition"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ) : (
                          <li key={i}>
                            <Link
                              href={entry.href}
                              className="text-[0.85rem] text-white/70 hover:text-blue-300 transition"
                              {...(entry.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                            >
                              {entry.label}
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}
              </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-white/60 gap-4">
          <p>© {new Date().getFullYear()} Infinus. {copy.bottom.rights}</p>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex gap-6">
              <Link href={copy.bottom.privacyHref} className="hover:text-white/80 transition">{copy.bottom.privacyLabel}</Link>
              {/* Reopens the consent dialog at any time — required so a decision can be
                  changed or withdrawn. Deliberately a button, not a link to a page. */}
              <CookieSettingsButton
                label={copy.bottom.cookieSettings}
                className="hover:text-white/80 transition underline-offset-4 hover:underline"
              />
            </div>
            <p className="text-xs text-white/60">
              {copy.bottom.developedBy}{" "}
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