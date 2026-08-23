"use client"

import { Home, Building2, Briefcase, Lightbulb, MessageCircle, ChevronDown, Menu, X } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"
import { navItemsFor } from "@/components/ui/nav-items"
import { LocaleSwitcherNav } from "@/components/i18n/LocaleSwitcherNav"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { navbarSurfaceFor, navbarTextColorFor } from "@/lib/navbar-surface"
import { chromeLocaleFor } from "@/lib/chrome-locale"
import { getDictionary } from "@/content/dictionary"

/** Matches the desktop bar's helper, so aria-controls ids are formed the same way. */
const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

export function NavBarDemo() {
  const pathname = usePathname()
  // usePathname is a CLIENT hook, not a request API: it reads router state and is inlined
  // into the prerendered output, so every route stays statically rendered.
  const surface = navbarSurfaceFor(pathname)
  // Phase H1: the shared Navbar renders in the locale of the page it is on. Labels and
  // destinations both come from the dictionary, so a translated label never invents a URL.
  const nav = getDictionary(chromeLocaleFor(pathname)).nav

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [textColor, setTextColor] = useState(() => navbarTextColorFor(surface))
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  // FIVE top-level entries since the client's restructure: Home, Company, Expertise,
  // Insights, Contact. Structure comes from the shared builder so the desktop bar and this
  // mobile panel cannot disagree about the menu; the icons are attached here because they
  // are presentation, not copy, and are matched by position.
  const icons = [
    <Home key="home" size={18} strokeWidth={2.5} />,
    <Building2 key="company" size={18} strokeWidth={2.5} />,
    <Briefcase key="expertise" size={18} strokeWidth={2.5} />,
    <Lightbulb key="insights" size={18} strokeWidth={2.5} />,
    <MessageCircle key="contact" size={18} strokeWidth={2.5} />,
  ]
  const navItems = navItemsFor(nav).map((item, i) => ({ ...item, icon: icons[i] }))

  // The hamburger, so focus can be handed back to it when the panel closes. Without this,
  // dismissing the menu with Escape leaves the caret nowhere and a keyboard user has to tab
  // in from the top of the document again.
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = ({ returnFocus = false } = {}) => {
    setIsMobileMenuOpen(false)
    setOpenSubmenu(null)
    if (returnFocus) menuButtonRef.current?.focus()
  }

  const toggleSubmenu = (itemName: string) => {
    setOpenSubmenu(openSubmenu === itemName ? null : itemName)
  }

  // Escape closes the panel from anywhere inside it. Bound at the document rather than on
  // the panel so it works no matter which control currently holds focus.
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileMenu({ returnFocus: true })
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobileMenuOpen])

  useEffect(() => {
    // Light-surface pages: the dark-text treatment applies from the top, at every scroll
    // position. Nothing to transition, so no listener.
    if (surface === 'light') {
      setTextColor(navbarTextColorFor('light'))
      return
    }

    // Dark-hero pages keep the existing transition, threshold unchanged.
    const handleScroll = () => {
      const scrollY = window.scrollY
      // Povećavam threshold da se pozadina pojavi tek kada korisnik dođe do About Us sekcije
      const shouldBeDark = scrollY > 600

      if (shouldBeDark) {
        setTextColor('text-slate-900')
      } else {
        setTextColor('text-white/90')
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [surface])

  return (
    <nav aria-label="Main" className="fixed top-0 left-0 right-0 z-50 pt-6">
      <div className="container-custom">
        {/* Desktop Navigation */}
        {/* `relative` anchors the language switcher; it has no visual effect on its own.
            LocaleSwitcherNav renders NOTHING unless the current page has a real locale
            counterpart, so on every other page this row's DOM is unchanged. */}
        <div className="hidden md:flex items-center justify-center relative">
          <NavBar items={navItems} />
          <LocaleSwitcherNav
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 backdrop-blur-lg transition-colors",
              textColor === 'text-white/90'
                ? "bg-black/20 border-white/20 text-white/90"
                : "bg-slate-200/80 border-slate-300 text-slate-700"
            )}
          />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          {/* Background container for mobile nav */}
          <div className={cn(
            "flex items-center justify-between px-4 py-2 transition-colors duration-300",
            textColor === 'text-white/90' 
              ? "" 
              : "bg-white/90 shadow-sm border-b border-black/5"
          )}>
            {/* Home Logo - Left */}
            <Link href={nav.home.href} className="flex items-center">
              <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-lg border transition-colors",
                textColor === 'text-white/90' 
                  ? "bg-black/20 border-white/20 text-white/90 hover:bg-white/10" 
                  : "bg-slate-200/80 border-slate-300 text-slate-700 hover:bg-slate-300/80"
              )}>
                <Home size={20} />
              </div>
            </Link>

            {/* Language switcher — renders nothing on pages without a real counterpart,
                leaving this row exactly as it was. */}
            <LocaleSwitcherNav
              className={cn(
                "rounded-full border px-3 py-1.5 backdrop-blur-lg transition-colors",
                textColor === 'text-white/90'
                  ? "bg-black/20 border-white/20 text-white/90"
                  : "bg-slate-200/80 border-slate-300 text-slate-700"
              )}
            />

            {/* Hamburger Menu - Right */}
            <button
              type="button"
              ref={menuButtonRef}
              onClick={toggleMobileMenu}
              aria-label={nav.menuLabel}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu-panel"
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-lg border transition-colors",
                textColor === 'text-white/90' 
                  ? "bg-black/20 border-white/20 text-white/90 hover:bg-white/10" 
                  : "bg-slate-200/80 border-slate-300 text-slate-700 hover:bg-slate-300/80"
              )}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => closeMobileMenu()}
            />
            
            {/* Menu Panel */}
            <motion.div
              id="mobile-menu-panel"
              role="dialog"
              aria-modal="true"
              aria-label={nav.menuLabel}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "fixed top-4 right-4 w-80 max-w-[calc(100vw-2rem)] rounded-lg shadow-lg border backdrop-blur-lg max-h-[calc(100vh-2rem)] overflow-y-auto",
                textColor === 'text-white/90' 
                  ? "bg-black/80 border-white/20" 
                  : "bg-white/95 border-slate-700"
              )}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className={cn(
                    "text-lg font-semibold",
                    textColor === 'text-white/90' ? "text-white" : "text-slate-900"
                  )}>
                    {nav.menuLabel}
                  </h2>
                  <button
                    type="button"
                    onClick={() => closeMobileMenu({ returnFocus: true })}
                    aria-label={nav.menuLabel}
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      textColor === 'text-white/90' 
                        ? "text-white/70 hover:bg-white/10 hover:text-white" 
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    )}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-2">
                  {navItems.map((item) => {
                    const hasSubmenu = item.submenu && item.submenu.length > 0

                    return (
                      <div key={item.name}>
                        {hasSubmenu ? (
                          <div>
                            <button
                              type="button"
                              onClick={() => toggleSubmenu(item.name)}
                              aria-expanded={openSubmenu === item.name}
                              aria-controls={`mobile-submenu-${slugify(item.name)}`}
                              className={cn(
                                "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-left",
                                textColor === 'text-white/90' 
                                  ? "text-white/90 hover:bg-white/10 hover:text-white" 
                                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 flex items-center justify-center">
                                  {item.icon}
                                </div>
                                <span className="font-medium">{item.name}</span>
                              </div>
                              <ChevronDown 
                                size={16} 
                                className={cn(
                                  "transition-transform",
                                  openSubmenu === item.name && "rotate-180"
                                )} 
                              />
                            </button>
                            
                            {/* Mobile Submenu */}
                            {openSubmenu === item.name && (
                              <motion.div
                                id={`mobile-submenu-${slugify(item.name)}`}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="ml-4 mt-2 space-y-1"
                              >
                                {item.submenu!.map((entry) =>
                                  entry.kind === 'group' ? (
                                    // A CATEGORY with no index page: a label over its real
                                    // children, never a link to one arbitrary child.
                                    <div key={entry.name}>
                                      <p
                                        className={cn(
                                          "px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider",
                                          textColor === 'text-white/90' ? "text-white/50" : "text-slate-400"
                                        )}
                                      >
                                        {entry.name}
                                      </p>
                                      {entry.items.map((subItem) => (
                                        <Link
                                          key={subItem.name}
                                          href={subItem.url}
                                          onClick={() => closeMobileMenu()}
                                          className={cn(
                                            "block pl-6 pr-4 py-2 rounded-lg transition-colors text-sm",
                                            textColor === 'text-white/90'
                                              ? "text-white/70 hover:bg-white/10 hover:text-white"
                                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                          )}
                                        >
                                          {subItem.name}
                                        </Link>
                                      ))}
                                    </div>
                                  ) : (
                                    <Link
                                      key={entry.name}
                                      href={entry.url}
                                      onClick={() => closeMobileMenu()}
                                      className={cn(
                                        "block px-4 py-2 rounded-lg transition-colors text-sm",
                                        textColor === 'text-white/90'
                                          ? "text-white/70 hover:bg-white/10 hover:text-white"
                                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                      )}
                                    >
                                      {entry.name}
                                    </Link>
                                  )
                                )}
                              </motion.div>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={item.url}
                            onClick={() => closeMobileMenu()}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                              textColor === 'text-white/90' 
                                ? "text-white/90 hover:bg-white/10 hover:text-white" 
                                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                            )}
                          >
                            <div className="w-5 h-5 flex items-center justify-center">
                              {item.icon}
                            </div>
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </nav>
  )
}
