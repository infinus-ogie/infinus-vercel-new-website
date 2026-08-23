"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { navbarSurfaceFor, navbarTextColorFor } from "@/lib/navbar-surface"

import { submenuLinks, type NavItem } from "@/components/ui/nav-items"

/** A stable DOM id fragment for a menu label, so aria-controls can point at its panel. */
const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  // Which treatment this route starts in. Pages that open on a light surface must not use
  // the light-text state at all, or their white text sits on a white background.
  const surface = navbarSurfaceFor(pathname)
  const [textColor, setTextColor] = useState(() => navbarTextColorFor(surface))
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // ── Keyboard support for the dropdowns ────────────────────────────────────────
  // The dropdowns used to open on `onMouseEnter` and nothing else: no way to open one from
  // the keyboard, no aria-expanded, no aria-haspopup, and no way to close one once open.
  // A keyboard or screen-reader user simply could not reach seven of the site's pages.
  //
  // The pattern implemented here is a DISCLOSURE, not an ARIA menu: a button that toggles a
  // container of ordinary links. That is deliberate. `role="menu"` obliges roving tabindex
  // and takes the links out of the normal tab order, which is the wrong model for site
  // navigation and easy to implement subtly wrong. Links stay links.
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({})
  /**
   * Where to put focus once a menu has actually rendered.
   *
   * Opening and focusing cannot happen in one go: the panel is conditionally rendered, so at
   * the moment the trigger handler runs there is nothing to focus yet. This records the
   * intent and an effect carries it out after the render that creates the panel.
   */
  const [pendingFocus, setPendingFocus] = useState<{ name: string; index: number } | null>(null)

  /** The real links inside one open dropdown, in document order. Headings have none. */
  const menuLinksOf = useCallback((name: string): HTMLAnchorElement[] => {
    const node = menuRefs.current[name]
    if (!node) return []
    return Array.from(node.querySelectorAll<HTMLAnchorElement>("a[href]"))
  }, [])

  /** Focus the nth link, wrapping at both ends. Negative indexes count from the end. */
  const focusMenuLink = useCallback(
    (name: string, index: number) => {
      const links = menuLinksOf(name)
      if (links.length === 0) return
      links[((index % links.length) + links.length) % links.length].focus()
    },
    [menuLinksOf]
  )

  useEffect(() => {
    if (!pendingFocus || openSubmenu !== pendingFocus.name) return
    focusMenuLink(pendingFocus.name, pendingFocus.index)
    setPendingFocus(null)
  }, [openSubmenu, pendingFocus, focusMenuLink])

  const openWithFocus = (name: string, index: number) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setOpenSubmenu(name)
    setPendingFocus({ name, index })
  }

  /** Close and hand focus back to the trigger, so Escape never strands the caret. */
  const closeSubmenu = (name: string, returnFocus = true) => {
    setOpenSubmenu((prev) => (prev === name ? null : prev))
    if (returnFocus) triggerRefs.current[name]?.focus()
  }

  const onTriggerKeyDown = (event: React.KeyboardEvent, name: string) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      openWithFocus(name, 0)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      openWithFocus(name, -1)
    } else if (event.key === "Escape" && openSubmenu === name) {
      event.preventDefault()
      closeSubmenu(name)
    }
    // Enter and Space are left alone: this is a <button>, so the browser fires onClick for
    // both already, and calling preventDefault here would break that.
  }

  const onMenuKeyDown = (event: React.KeyboardEvent, name: string) => {
    const links = menuLinksOf(name)
    const current = links.indexOf(document.activeElement as HTMLAnchorElement)

    if (event.key === "ArrowDown") {
      event.preventDefault()
      focusMenuLink(name, current + 1)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      focusMenuLink(name, current - 1)
    } else if (event.key === "Home") {
      event.preventDefault()
      focusMenuLink(name, 0)
    } else if (event.key === "End") {
      event.preventDefault()
      focusMenuLink(name, -1)
    } else if (event.key === "Escape") {
      event.preventDefault()
      closeSubmenu(name)
    }
    // Tab is deliberately NOT trapped. It moves on to the next control and the blur handler
    // below closes the menu — no keyboard trap, and the language switcher after the bar
    // stays reachable.
  }

  /** Close when focus leaves the trigger + panel entirely, which is what makes Tab safe. */
  const onGroupBlur = (event: React.FocusEvent<HTMLDivElement>, name: string) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
    setOpenSubmenu((prev) => (prev === name ? null : prev))
  }

  const handleMouseEnter = (itemName: string) => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    
    setOpenSubmenu(itemName)
  }

  const handleMouseLeave = (itemName: string) => {
    const timeout = setTimeout(() => {
      setOpenSubmenu(null)
    }, 200)
    setHoverTimeout(timeout)
  }

  const handleContainerMouseEnter = (itemName: string) => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    
    setOpenSubmenu(itemName)
  }

  const handleContainerMouseLeave = () => {
    const timeout = setTimeout(() => {
      setOpenSubmenu(null)
    }, 200)
    setHoverTimeout(timeout)
  }

  /**
   * What a dropdown link does on click, for both the plain and the grouped case.
   *
   * The hash branch reproduces the pre-existing behaviour: a `#…` link followed from a page
   * that is not the homepage loses the active highlight, and this puts it back once the
   * navigation has settled. Extracted rather than duplicated a third time.
   */
  const closeAfterNavigate = (itemName: string, url: string) => {
    setActiveTab(itemName)
    setOpenSubmenu(null)
    if (url.startsWith('#') && pathname !== '/') {
      setTimeout(() => setActiveTab(itemName), 100)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setOpenSubmenu(null)
  }

  // Detect current page and set active tab
  useEffect(() => {
    const currentItem = items.find(item => {
      // Exact path match
      if (item.url === pathname) return true
      // Handle hash links (e.g., /#about, /#services) - only on home page
      if (item.url.startsWith('#') && pathname === '/') return true
      // A dropdown may contain HEADINGS as well as links, and a heading has no URL —
      // so this flattens to the real links first. `submenu.some(s => s.url === ...)`
      // would read undefined off a group and silently never match.
      if (item.submenu) {
        return submenuLinks(item.submenu).some(subItem => subItem.url === pathname)
      }
      return false
    })
    
    if (currentItem) {
      setActiveTab(currentItem.name)
    }
  }, [pathname, items])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    // Light-surface pages have no dark hero to transition away from, so the dark-text
    // treatment applies at every scroll position. No listener needed.
    if (surface === 'light') {
      setTextColor(navbarTextColorFor('light'))
      return
    }

    // Dark-hero pages keep the existing transition, threshold unchanged.
    const handleScroll = () => {
      const navbar = document.querySelector('[data-navbar]')
      if (!navbar) return

      const scrollY = window.scrollY
      const shouldBeDark = scrollY > 100

      if (shouldBeDark) {
        setTextColor('text-slate-900')
      } else {
        setTextColor('text-white/90')
      }
    }

    handleScroll() // Initial check
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [surface])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  /**
   * A visible focus indicator that survives both navbar treatments.
   *
   * The bar is transparent over a dark hero and white once scrolled, so a single ring colour
   * is invisible in one of the two states. This picks per treatment.
   */
  const focusRing =
    textColor === "text-white/90"
      ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#00144a]"
      : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"

  return (
    <div
      data-navbar
      className={cn(
        "relative",
        className,
      )}
    >
      {/* Desktop Navigation */}
      <div className={cn(
        "hidden md:flex items-center gap-3 backdrop-blur-lg py-3 px-4 rounded-full shadow-lg border transition-colors whitespace-nowrap",
        textColor === 'text-white/90' 
          ? "bg-black/20 border-white/20" 
          : "bg-white/80 border-slate-200/60"
      )}>
        {items.map((item) => {
          const isActive = activeTab === item.name
          const hasSubmenu = item.submenu && item.submenu.length > 0

          return (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => hasSubmenu && handleContainerMouseEnter(item.name)}
              onMouseLeave={() => hasSubmenu && handleContainerMouseLeave()}
              onBlur={hasSubmenu ? (event) => onGroupBlur(event, item.name) : undefined}
            >
              {hasSubmenu ? (
                <button
                  type="button"
                  ref={(node) => {
                    triggerRefs.current[item.name] = node
                  }}
                  aria-haspopup="true"
                  aria-expanded={openSubmenu === item.name}
                  aria-controls={`navbar-submenu-${slugify(item.name)}`}
                  onClick={() => {
                    setActiveTab(item.name)
                    // Click now TOGGLES. It used to only set the active tab, which meant a
                    // pointer user who clicked instead of hovering got no menu at all.
                    setOpenSubmenu((prev) => (prev === item.name ? null : item.name))
                  }}
                  onKeyDown={(event) => onTriggerKeyDown(event, item.name)}
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-3 py-2 rounded-full transition-colors flex items-center gap-1 whitespace-nowrap",
                    focusRing,
                    textColor,
                    textColor === 'text-white/90' 
                      ? "hover:text-white hover:bg-white/10" 
                      : "hover:text-slate-700 hover:bg-slate-100/50",
                    isActive && (textColor === 'text-white/90' ? "bg-white/20 text-white" : "bg-slate-200/50 text-slate-900"),
                  )}
                >
                  <span>{item.name}</span>
                  <ChevronDown 
                    size={14} 
                    className={cn(
                      "transition-transform",
                      openSubmenu === item.name && "rotate-180"
                    )} 
                  />
                </button>
              ) : (
                <Link
                  href={item.url}
                  onClick={() => {
                    setActiveTab(item.name)
                    setOpenSubmenu(null)
                    // If clicking on a hash link from a different page, ensure proper navigation
                    if (item.url.startsWith('#') && pathname !== '/') {
                      setTimeout(() => {
                        setActiveTab(item.name)
                      }, 100)
                    }
                  }}
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-3 py-2 rounded-full transition-colors flex items-center gap-1 whitespace-nowrap",
                    focusRing,
                    textColor,
                    textColor === 'text-white/90' 
                      ? "hover:text-white hover:bg-white/10" 
                      : "hover:text-slate-700 hover:bg-slate-100/50",
                    isActive && (textColor === 'text-white/90' ? "bg-white/20 text-white" : "bg-slate-200/50 text-slate-900"),
                  )}
                >
                  <span>{item.name}</span>
                </Link>
              )}
              
              {/* Desktop Submenu */}
              {hasSubmenu && openSubmenu === item.name && (
                <motion.div
                  id={`navbar-submenu-${slugify(item.name)}`}
                  ref={(node) => {
                    menuRefs.current[item.name] = node
                  }}
                  aria-label={item.name}
                  onKeyDown={(event) => onMenuKeyDown(event, item.name)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "absolute top-full left-0 w-72 rounded-lg shadow-lg border backdrop-blur-lg z-50 mt-2",
                    textColor === 'text-white/90' 
                      ? "bg-black/80 border-white/20" 
                      : "bg-white/95 border-slate-200/60"
                  )}
                >
                  <div className="py-3 px-2">
                    {item.submenu!.map((entry) =>
                      entry.kind === 'group' ? (
                        // A CATEGORY, not a link. It has no index page, so it is rendered as
                        // a label over its real children rather than pointed at one of them.
                        <div key={entry.name} className="mt-2 first:mt-0">
                          <p
                            className={cn(
                              "px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider",
                              textColor === 'text-white/90' ? "text-white/50" : "text-slate-400"
                            )}
                          >
                            {entry.name}
                          </p>
                          {entry.items.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.url}
                              onClick={() => closeAfterNavigate(item.name, subItem.url)}
                              className={cn(
                                "block rounded-md pl-6 pr-4 py-2 text-sm transition-colors",
                                focusRing,
                                textColor === 'text-white/90'
                                  ? "text-white/90 hover:text-white hover:bg-white/10"
                                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
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
                          onClick={() => closeAfterNavigate(item.name, entry.url)}
                          className={cn(
                            "block rounded-md px-4 py-2.5 text-sm transition-colors",
                            focusRing,
                            textColor === 'text-white/90'
                              ? "text-white/90 hover:text-white hover:bg-white/10"
                              : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                          )}
                        >
                          {entry.name}
                        </Link>
                      )
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-lg border transition-colors",
            textColor === 'text-white/90' 
              ? "bg-black/20 border-white/20 text-white/90 hover:bg-white/10" 
              : "bg-white/80 border-slate-200/60 text-slate-700 hover:bg-slate-100/50"
          )}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={closeMobileMenu}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "fixed top-4 right-4 w-80 max-w-[calc(100vw-2rem)] rounded-lg shadow-lg border backdrop-blur-lg",
                textColor === 'text-white/90' 
                  ? "bg-black/80 border-white/20" 
                  : "bg-white/95 border-slate-200/60"
              )}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className={cn(
                    "text-lg font-semibold",
                    textColor === 'text-white/90' ? "text-white" : "text-slate-900"
                  )}>
                    Menu
                  </h2>
                  <button
                    onClick={closeMobileMenu}
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

                <nav className="space-y-2">
                  {items.map((item) => {
                    const isActive = activeTab === item.name
                    const hasSubmenu = item.submenu && item.submenu.length > 0

                    return (
                      <div key={item.name}>
                        {hasSubmenu ? (
                          <div>
                            <button
                              onClick={() => {
                                setActiveTab(item.name)
                                setOpenSubmenu(openSubmenu === item.name ? null : item.name)
                              }}
                              className={cn(
                                "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-left",
                                textColor === 'text-white/90' 
                                  ? "text-white/90 hover:bg-white/10 hover:text-white" 
                                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                                isActive && (textColor === 'text-white/90' ? "bg-white/20 text-white" : "bg-slate-200/50 text-slate-900")
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
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="ml-4 mt-2 space-y-1"
                              >
                                {submenuLinks(item.submenu).map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    href={subItem.url}
                                    onClick={closeMobileMenu}
                                    className={cn(
                                      "block px-4 py-2 rounded-lg transition-colors text-sm",
                                      textColor === 'text-white/90' 
                                        ? "text-white/70 hover:bg-white/10 hover:text-white" 
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    )}
                                  >
                                    {subItem.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={item.url}
                            onClick={closeMobileMenu}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                              textColor === 'text-white/90' 
                                ? "text-white/90 hover:bg-white/10 hover:text-white" 
                                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                              isActive && (textColor === 'text-white/90' ? "bg-white/20 text-white" : "bg-slate-200/50 text-slate-900")
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
                </nav>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}