import Script from "next/script"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ServiceCard } from "@/components/content/service-card"
import ServicesSection from "./(site)/_components/ServicesSection"
import { Cloud, Headphones, Settings, CheckCircle } from "lucide-react"
import { NavBarDemo } from "@/components/ui/navbar-demo"
import Footer from "@/components/ui/footer"
import { HeroGeometric } from "@/components/ui/shape-landing-hero"
import { Feature } from "@/components/ui/feature-section-with-grid"
import { AnimatedSapExpertise } from "@/components/ui/animated-sap-expertise"
import DomainExpertiseSection from "./(site)/_components/DomainExpertiseSection"
import CombinedFeaturedSection from "@/components/ui/combined-featured-section"
import AboutSection from "@/components/ui/about-section"
import { JoinSection } from "@/components/ui/join-section"
import { 
  generatePageJsonLd, 
  getCurrentDate, 
  DEFAULT_AUTHOR, 
  DEFAULT_PUBLISHER,
  SITE_CONFIG 
} from "@/lib/jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { getBreadcrumbs } from "@/lib/breadcrumbs"
import Link from "next/link"

// SEO Metadata
export const metadata = generatePageMetadata(
  "Infinus - Driving Business Success through SAP Expertise",
  "Your reliable SAP expertise partner. SAP Gold Partner focused on SAP Business Suite solutions including SAP Cloud ERP, SAP Business Data Cloud, SAP Business AI, and SAP Business Technology Platform.",
  "/"
)

// Services data for ServiceCard components
const getServices = () => [
  {
    title: "SAP Implementation Services",
    description: "Greenfield, brownfield, conversions, migrations and rollouts.",
    icon: Cloud,
    href: "/professional-services",
    features: [
      "Greenfield implementations",
      "Brownfield implementations", 
      "System conversions",
      "Data migrations",
      "Global rollouts"
    ]
  },
  {
    title: "SAP Support Services", 
    description: "SAP Application Management Services and SLA Support Services",
    icon: Headphones,
    href: "/professional-services",
    features: [
      "Application Management Services",
      "SLA Support Services",
      "24/7 monitoring",
      "Incident management",
      "Performance optimization"
    ]
  },
  {
    title: "Other Services",
    description: "SAP localisation support, developments, trainings, etc.",
    icon: Settings,
    href: "/professional-services", 
    features: [
      "SAP localisation support",
      "Custom developments",
      "Training programs",
      "Consulting services",
      "Technical support"
    ]
  }
]

// FAQ data for JSON-LD
const faqs = [
  {
    question: "What services does Infinus provide?",
    answer: "Infinus provides SAP Implementation Services (greenfield, brownfield, conversions, migrations and rollouts), SAP Support Services (SAP Application Management Services and SLA Support Services), and Other Services (SAP localisation support, developments, trainings, etc.)."
  },
  {
    question: "What are the benefits of working with Infinus?",
    answer: "Benefits include European Focus (located in Serbia, CET time zone, services throughout Europe), Hybrid Work Model (onsite and remote work), Competitive Pricing (cost-effective services without sacrificing quality), and Flexible Solutions (flexible engagement models tailored to your needs)."
  },
  {
    question: "How do I apply?",
    answer: "Fill in your name, email, phone, subject and message, attach your resume if you have one, and click Submit Application. We will review and get back to you."
  },
  {
    question: "What happens after I submit?",
    answer: "Our team reviews your application and replies by email. If there is a fit, we will schedule an introductory call."
  }
]

// Generate JSON-LD
const jsonLd = generatePageJsonLd({
  pageData: {
    name: "Infinus - Driving Business Success through SAP Expertise",
    url: SITE_CONFIG.url,
    inLanguage: SITE_CONFIG.language,
    description: "Your reliable SAP expertise partner. SAP Gold Partner focused on SAP Business Suite solutions."
  },
  breadcrumbs: getBreadcrumbs("/"),
  articleData: {
    headline: "Infinus - Driving Business Success through SAP Expertise",
    description: "Your reliable SAP expertise partner. SAP Gold Partner focused on SAP Business Suite solutions including SAP Cloud ERP, SAP Business Data Cloud, SAP Business AI, and SAP Business Technology Platform.",
    image: SITE_CONFIG.defaultImage,
    authorName: DEFAULT_AUTHOR.name,
    authorUrl: DEFAULT_AUTHOR.url,
    datePublished: getCurrentDate(),
    dateModified: getCurrentDate(),
    inLanguage: SITE_CONFIG.language,
    mainEntityOfPage: SITE_CONFIG.url,
    publisher: DEFAULT_PUBLISHER
  },
  faqs
})

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBarDemo />
      <main className="flex-1">
        {/* JSON-LD Script */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />

        {/* [A] Geometric Hero Section */}
        <div className="hero-dark">
          <HeroGeometric 
            badge="SAP Gold Partner"
            title1="Business Success"
            title2="by SAP Expertise"
          />
        </div>

        {/* [B] About Us Section */}
        <AboutSection />

        {/* [C] Our Services Section */}
        <ServicesSection />

        {/* [D] Benefits from working with us Section */}
        <CombinedFeaturedSection />

        {/* [E] SAP Expertise Section */}
        <Section id="sap-expertise" surface="surface-1" data-section="sap-expertise">
          <AnimatedSapExpertise />
        </Section>

        {/* [F] Domain Expertise Section */}
        <DomainExpertiseSection />

        {/* [G] Join Our Team Section */}
        <Section surface="surface-1" topFade data-section="join-team">
          <JoinSection />
        </Section>
      </main>
      <Footer />
    </div>
  )
}
