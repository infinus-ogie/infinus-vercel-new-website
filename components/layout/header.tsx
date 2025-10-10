"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/#services" },
  { name: "About", href: "/#about" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
]

const expertiseMenu = {
  name: "Our Expertise",
  items: [
    { name: "SAP Expertise", href: "/#sap-expertise" },
    { name: "Domain Expertise", href: "/#domain-expertise" },
  ]
}

export function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isExpertiseMenuOpen, setIsExpertiseMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const toggleExpertiseMenu = () => {
    setIsExpertiseMenuOpen(!isExpertiseMenuOpen)
  }

  const closeExpertiseMenu = () => {
    setIsExpertiseMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur bg-white/75 border-b border-slate-200/60">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center focus-visible">
              <Image
                src="/infinus-new-logo.webp"
                alt="Infinus Logo"
                width={200}
                height={60}
                className="h-14 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors focus-visible",
                    pathname === item.href
                      ? "text-slate-900 underline underline-offset-8"
                      : "text-slate-900 hover:text-slate-900/70"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              
              
              {/* Expertise Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleExpertiseMenu}
                  onMouseEnter={() => setIsExpertiseMenuOpen(true)}
                  onMouseLeave={() => setIsExpertiseMenuOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-colors focus-visible flex items-center space-x-1",
                    "text-slate-900 hover:text-slate-900/70"
                  )}
                >
                  <span>{expertiseMenu.name}</span>
                  <svg
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isExpertiseMenuOpen ? "rotate-180" : ""
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {isExpertiseMenuOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur border border-slate-200/60 rounded-lg shadow-lg z-50"
                    onMouseEnter={() => setIsExpertiseMenuOpen(true)}
                    onMouseLeave={() => setIsExpertiseMenuOpen(false)}
                  >
                    <div className="py-2">
                      {expertiseMenu.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                          onClick={closeExpertiseMenu}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button asChild className="cta-accessible rounded-2xl px-6 py-2">
                <Link href="/contact">Get Started</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden focus-visible rounded-2xl"
              onClick={toggleMobileMenu}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-16 left-0 right-0 bg-white/95 backdrop-blur border-b border-slate-200/60 shadow-lg">
            <div className="container-custom py-4">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      "text-base font-medium transition-colors focus-visible py-2",
                      pathname === item.href
                        ? "text-slate-900 underline underline-offset-8"
                        : "text-slate-900 hover:text-slate-900/70"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                
                
                {/* Mobile Expertise Menu */}
                <div className="py-2">
                  <div className="text-base font-medium text-slate-900 py-2">
                    {expertiseMenu.name}
                  </div>
                  <div className="ml-4 space-y-2">
                    {expertiseMenu.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="block text-sm text-slate-700 hover:text-slate-900 transition-colors py-1"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Mobile CTA */}
                <div className="pt-4 border-t border-slate-200/60">
                  <Button asChild className="cta-accessible rounded-2xl px-6 py-2 w-full">
                    <Link href="/contact" onClick={closeMobileMenu}>Get Started</Link>
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
