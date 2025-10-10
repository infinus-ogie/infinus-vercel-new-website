import Script from "next/script"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import Footer from "@/components/ui/footer"
import { Hero } from "@/components/ui/animated-hero"
import { Feature } from "@/components/ui/feature-section-with-grid"
import { AnimatedSapExpertise } from "@/components/ui/animated-sap-expertise"
import { BenefitsSection } from "@/components/ui/benefits-section"
import { Globe, Users, DollarSign, Settings } from "lucide-react"
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

// FAQ data for JSON-LD
const faqs = [
  {
    question: "What services does Infinus provide?",
    answer: "Infinus provides SAP Implementation Services (greenfield, brownfield, conversions, migrations and rollouts), SAP Support Services (SAP Application Management Services and SLA Support Services), and Other Services (SAP localisation support, developments, trainings, etc.)."
  },
  {
    question: "What are the benefits of working with Infinus?",
    answer: "Benefits include European Focus (located in Serbia, CET time zone, services throughout Europe), Hybrid Work Model (onsite and remote work), Competitive Pricing (cost-effective services without sacrificing quality), and Flexible Solutions (flexible engagement models tailored to your needs)."
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

export default function HomePageWithAnimatedHero() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* JSON-LD Script */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />

        {/* [A] Animated Hero Section */}
        <Hero />

        {/* [B] About Us Section */}
        <Section data-section="about">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center lg:justify-start">
                <Image
                  src="/sap-gold-partner-logo-about-us.webp"
                  alt="SAP Gold Partner Logo"
                  width={400}
                  height={300}
                  className="w-full max-w-md h-auto rounded-lg shadow-lg"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-8">About Us</h2>
                <div className="text-lg text-muted-foreground space-y-4">
                  <p>
                    Infinus is SAP Gold Partner focused on SAP Business Suite solutions:
                  </p>
                  <ul className="text-left space-y-2">
                    <li>• SAP Cloud ERP (Private and Public)</li>
                    <li>• SAP Business Data Cloud</li>
                    <li>• SAP Business AI</li>
                    <li>• SAP Business Technology Platform</li>
                  </ul>
                  <p>
                    Our experienced SAP consultants can bring high-quality expertise in various SAP solutions, business processes, technologies, market trends, and best practices to deliver best-in-class consulting services and solutions for your business.
                  </p>
                  <p>
                    The vast majority of our team consists of senior SAP consultants with 10+ years of professional experience.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* [C] Our Services Section */}
        <Section data-section="services">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="text-4xl font-bold text-primary mb-2">1</div>
                  <CardTitle>SAP Implementation Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Greenfield, brownfield, conversions, migrations and rollouts.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="text-4xl font-bold text-primary mb-2">2</div>
                  <CardTitle>SAP Support Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    SAP Application Management Services and SLA Support Services
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="text-4xl font-bold text-primary mb-2">3</div>
                  <CardTitle>Other Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    SAP localisation support, developments, trainings, etc.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button asChild>
                <Link href="/#services">Learn more</Link>
              </Button>
            </div>
          </Container>
        </Section>

        {/* [D] Benefits from working with us Section */}
        <BenefitsSection
          tagline="Why Choose Us"
          heading="Benefits from working with us"
          description="Discover the advantages of partnering with Infinus for your SAP implementation and support needs. We provide European expertise, flexible engagement models, and competitive pricing."
          buttonText="Contact us today"
          buttonUrl="/contact"
          benefits={[
            {
              id: "benefit-1",
              title: "European Focus",
              summary: "We are located in Serbia (CET time zone) and provide services throughout Europe. All our consultants are fluent in English and some of them in German as well.",
              label: "Location",
              author: "Infinus Team",
              published: "2024",
              url: "/contact",
              image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop&crop=center",
              icon: Globe,
            },
            {
              id: "benefit-2",
              title: "Hybrid Work Model",
              summary: "Our consultants are available for both onsite and remote work, giving you the flexibility to choose the option that works best for you.",
              label: "Flexibility",
              author: "Infinus Team",
              published: "2024",
              url: "/contact",
              image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=450&fit=crop&crop=center",
              icon: Users,
            },
            {
              id: "benefit-3",
              title: "Competitive Pricing",
              summary: "By sourcing with us, you can take advantage of cost-effective services without sacrificing quality.",
              label: "Value",
              author: "Infinus Team",
              published: "2024",
              url: "/contact",
              image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop&crop=center",
              icon: DollarSign,
            },
            {
              id: "benefit-4",
              title: "Flexible Solutions",
              summary: "We offer flexible engagement models tailored to your unique needs and challenges, whether you need short-term support or long-term solutions.",
              label: "Customization",
              author: "Infinus Team",
              published: "2024",
              url: "/contact",
              image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop&crop=center",
              icon: Settings,
            },
          ]}
        />

        {/* [E] SAP Expertise Section */}
        <Section surface="surface-1" data-section="sap-expertise">
          <AnimatedSapExpertise />
        </Section>

        {/* [F] Domain Expertise Section */}
        <Section data-section="domain-expertise">
          <Feature />
        </Section>

        {/* [G] Join Our Team Section */}
        <Section surface="surface-1" data-section="join-team">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Join Our Team</h2>
              <div className="text-lg text-muted-foreground space-y-4 mb-8">
                <p>
                  Due to continues business expansion, we are looking to expand our team.
                </p>
                <p>
                  If you have experience in some of SAP S/4HANA or ECC modules and areas, industry solutions, and/or LoB solutions, and if you are interested to become a member of the agile team of dedicated SAP professionals, please contact us.
                </p>
                <p>
                  We will be glad to talk with you!
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="resume" className="block text-sm font-medium mb-2">
                      Attach your Resume
                    </label>
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </form>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </div>
  )
}
