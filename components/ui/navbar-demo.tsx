import { Home, User, Briefcase, FileText, MessageCircle, HelpCircle, ChevronDown, Zap, Users } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"

export function NavBarDemo() {
  const navItems = [
    { name: 'Home', url: '/', icon: <Home size={18} strokeWidth={2.5} /> },
    { name: 'About', url: '/#about', icon: <User size={18} strokeWidth={2.5} /> },
    { name: 'Services', url: '/#services', icon: <Briefcase size={18} strokeWidth={2.5} /> },
    { 
      name: 'Expertise', 
      url: '#', 
      icon: <Zap size={18} strokeWidth={2.5} />,
      submenu: [
        { name: 'SAP Expertise', url: '/#sap-expertise' },
        { name: 'Domain Expertise', url: '/#domain-expertise' }
      ]
    },
    { 
      name: 'Grow with SAP', 
      url: '#', 
      icon: <FileText size={18} strokeWidth={2.5} />,
      submenu: [
        { name: 'Grow - Overview', url: '/grow' },
        { name: 'Grow - Professional Services', url: '/professional-services' }
      ]
    },
    { name: 'Contact', url: '/contact', icon: <MessageCircle size={18} strokeWidth={2.5} /> },
    { name: 'FAQ', url: '/faq', icon: <HelpCircle size={18} strokeWidth={2.5} /> }
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-6">
      <div className="container-custom">
        <div className="flex items-center justify-center">
          {/* Navigation */}
          <NavBar items={navItems} />
        </div>
      </div>
    </div>
  )
}
