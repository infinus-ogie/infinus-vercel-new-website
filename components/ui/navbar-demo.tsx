"use client"

import { Home, User, Briefcase, FileText, MessageCircle, HelpCircle, ChevronDown, Zap, Users, Menu, X, Star } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function NavBarDemo() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [textColor, setTextColor] = useState('text-white/90')
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const navItems = [
    { name: 'Home', url: '/', icon: <Home size={18} strokeWidth={2.5} /> },
    { name: 'About', url: '/#about', icon: <User size={18} strokeWidth={2.5} /> },
    { name: 'Our Expertise', url: '/#our-expertise', icon: <Briefcase size={18} strokeWidth={2.5} /> },
    { name: 'Benefits', url: '/#partnership-benefits', icon: <Star size={18} strokeWidth={2.5} /> },
    { 
      name: 'Focus Topics', 
      url: '#', 
      icon: <FileText size={18} strokeWidth={2.5} />,
      submenu: [
        { name: 'GROW with SAP: Finance', url: '/grow' },
        { name: 'SAP for Professional Services', url: '/professional-services' }
      ]
    },
    { name: 'Contact', url: '/contact', icon: <MessageCircle size={18} strokeWidth={2.5} /> },
    { name: 'FAQ', url: '/faq', icon: <HelpCircle size={18} strokeWidth={2.5} /> }
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setOpenSubmenu(null)
  }

  const toggleSubmenu = (itemName: string) => {
    setOpenSubmenu(openSubmenu === itemName ? null : itemName)
  }

  useEffect(() => {
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
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-6">
      <div className="container-custom">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center">
          <NavBar items={navItems} />
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
            <Link href="/" className="flex items-center">
              <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-lg border transition-colors",
                textColor === 'text-white/90' 
                  ? "bg-black/20 border-white/20 text-white/90 hover:bg-white/10" 
                  : "bg-slate-200/80 border-slate-300 text-slate-700 hover:bg-slate-300/80"
              )}>
                <Home size={20} />
              </div>
            </Link>

            {/* Hamburger Menu - Right */}
            <button
              onClick={toggleMobileMenu}
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
                  : "bg-white/95 border-slate-700"
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
                  {navItems.map((item) => {
                    const hasSubmenu = item.submenu && item.submenu.length > 0

                    return (
                      <div key={item.name}>
                        {hasSubmenu ? (
                          <div>
                            <button
                              onClick={() => toggleSubmenu(item.name)}
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
                </nav>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
