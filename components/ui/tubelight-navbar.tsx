"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon?: React.ReactNode
  submenu?: { name: string; url: string }[]
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [textColor, setTextColor] = useState('text-white/90')
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
      // Handle submenu items - check if current path matches any submenu URL
      if (item.submenu) {
        return item.submenu.some(subItem => subItem.url === pathname)
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
  }, [])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

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
            >
              {hasSubmenu ? (
                <button
                  onClick={() => {
                    setActiveTab(item.name)
                  }}
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-3 py-2 rounded-full transition-colors flex items-center gap-1 whitespace-nowrap",
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
                  <div className="py-4 px-2">
                    {item.submenu!.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.url}
                        onClick={() => {
                          setActiveTab(item.name)
                          setOpenSubmenu(null)
                          // If clicking on a hash link from a different page, ensure proper navigation
                          if (subItem.url.startsWith('#') && pathname !== '/') {
                            setTimeout(() => {
                              setActiveTab(item.name)
                            }, 100)
                          }
                        }}
                        className={cn(
                          "block px-4 py-3 text-sm transition-colors",
                          textColor === 'text-white/90' 
                            ? "text-white/90 hover:text-white hover:bg-white/10" 
                            : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                        )}
                      >
                        {subItem.name}
                      </Link>
                    ))}
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
                                {item.submenu!.map((subItem) => (
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