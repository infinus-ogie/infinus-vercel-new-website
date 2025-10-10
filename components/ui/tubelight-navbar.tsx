"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: React.ReactNode
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
  const [openTimeout, setOpenTimeout] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (itemName: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    if (openTimeout) {
      clearTimeout(openTimeout)
      setOpenTimeout(null)
    }
    // Small delay to prevent accidental triggers
    const timeout = setTimeout(() => {
      setOpenSubmenu(itemName)
    }, 100)
    setOpenTimeout(timeout)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setOpenSubmenu(null)
    }, 300) // Reduced delay for better responsiveness
    setHoverTimeout(timeout)
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

      // Get the hero section (first section with dark background)
      const heroSection = document.querySelector('main > div:first-child')
      if (!heroSection) {
        // Fallback to simple scroll position detection
        const rect = navbar.getBoundingClientRect()
        const isOverDarkBackground = rect.top < 100
        setTextColor(isOverDarkBackground ? 'text-white/90' : 'text-slate-900')
        return
      }

      const heroRect = heroSection.getBoundingClientRect()
      const navbarRect = navbar.getBoundingClientRect()
      
      // Check if navbar is over the hero section (dark background)
      const isOverDarkBackground = navbarRect.bottom > heroRect.top && navbarRect.top < heroRect.bottom
      
      setTextColor(isOverDarkBackground ? 'text-white/90' : 'text-slate-900')
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
      if (openTimeout) {
        clearTimeout(openTimeout)
      }
    }
  }, [hoverTimeout, openTimeout])

  return (
    <div
      data-navbar
      className={cn(
        "relative",
        className,
      )}
    >
      <div className={cn(
        "flex items-center gap-3 backdrop-blur-lg py-3 px-4 rounded-full shadow-lg border transition-colors whitespace-nowrap",
        textColor === 'text-white/90' 
          ? "bg-black/20 border-white/20" 
          : "bg-white/80 border-slate-200/60"
      )}>
        {items.map((item) => {
          const isActive = activeTab === item.name
          const hasSubmenu = item.submenu && item.submenu.length > 0

          return (
            <div key={item.name} className="relative">
              {hasSubmenu ? (
                <button
                  onClick={() => {
                    setActiveTab(item.name)
                    setOpenSubmenu(openSubmenu === item.name ? null : item.name)
                  }}
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={() => {
                    if (openTimeout) {
                      clearTimeout(openTimeout)
                      setOpenTimeout(null)
                    }
                    handleMouseLeave()
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
                  <span className="hidden md:inline">{item.name}</span>
                  <span className="md:hidden">
                    <div className="w-[18px] h-[18px] flex items-center justify-center">
                      {item.icon}
                    </div>
                  </span>
                  {hasSubmenu && (
                    <ChevronDown 
                      size={14} 
                      className={cn(
                        "hidden md:inline transition-transform",
                        openSubmenu === item.name && "rotate-180"
                      )} 
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className={cn(
                        "absolute inset-0 w-full rounded-full -z-10",
                        textColor === 'text-white/90' ? "bg-white/10" : "bg-slate-200/30"
                      )}
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className={cn(
                        "absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full",
                        textColor === 'text-white/90' ? "bg-white" : "bg-slate-400"
                      )}>
                        <div className={cn(
                          "absolute w-12 h-6 rounded-full blur-md -top-2 -left-2",
                          textColor === 'text-white/90' ? "bg-white/30" : "bg-slate-400/30"
                        )} />
                        <div className={cn(
                          "absolute w-8 h-6 rounded-full blur-md -top-1",
                          textColor === 'text-white/90' ? "bg-white/30" : "bg-slate-400/30"
                        )} />
                        <div className={cn(
                          "absolute w-4 h-4 rounded-full blur-sm top-0 left-2",
                          textColor === 'text-white/90' ? "bg-white/30" : "bg-slate-400/30"
                        )} />
                      </div>
                    </motion.div>
                  )}
                </button>
              ) : (
                <Link
                  href={item.url}
                  onClick={() => {
                    setActiveTab(item.name)
                    // If clicking on a hash link from a different page, navigate to home first
                    if (item.url.startsWith('#') && pathname !== '/') {
                      // The Link component will handle navigation, but we need to ensure proper state
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
                  <span className="hidden md:inline">{item.name}</span>
                  <span className="md:hidden">
                    <div className="w-[18px] h-[18px] flex items-center justify-center">
                      {item.icon}
                    </div>
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className={cn(
                        "absolute inset-0 w-full rounded-full -z-10",
                        textColor === 'text-white/90' ? "bg-white/10" : "bg-slate-200/30"
                      )}
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className={cn(
                        "absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full",
                        textColor === 'text-white/90' ? "bg-white" : "bg-slate-400"
                      )}>
                        <div className={cn(
                          "absolute w-12 h-6 rounded-full blur-md -top-2 -left-2",
                          textColor === 'text-white/90' ? "bg-white/30" : "bg-slate-400/30"
                        )} />
                        <div className={cn(
                          "absolute w-8 h-6 rounded-full blur-md -top-1",
                          textColor === 'text-white/90' ? "bg-white/30" : "bg-slate-400/30"
                        )} />
                        <div className={cn(
                          "absolute w-4 h-4 rounded-full blur-sm top-0 left-2",
                          textColor === 'text-white/90' ? "bg-white/30" : "bg-slate-400/30"
                        )} />
                      </div>
                    </motion.div>
                  )}
                </Link>
              )}
              
              {/* Submenu */}
              {hasSubmenu && openSubmenu === item.name && (
                <>
                  {/* Invisible bridge to prevent hover gap */}
                  <div 
                    className="absolute top-full left-0 right-0 h-2 -mt-2"
                    onMouseEnter={() => {
                      if (hoverTimeout) {
                        clearTimeout(hoverTimeout)
                        setHoverTimeout(null)
                      }
                      setOpenSubmenu(item.name)
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseEnter={() => {
                      if (hoverTimeout) {
                        clearTimeout(hoverTimeout)
                        setHoverTimeout(null)
                      }
                      setOpenSubmenu(item.name)
                    }}
                    onMouseLeave={handleMouseLeave}
                    className={cn(
                      "absolute top-full left-0 w-56 rounded-lg shadow-lg border backdrop-blur-lg z-50",
                      textColor === 'text-white/90' 
                        ? "bg-black/80 border-white/20" 
                        : "bg-white/95 border-slate-200/60"
                    )}
                  >
                    <div className="py-2">
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
                            "block px-4 py-2 text-sm transition-colors",
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
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
