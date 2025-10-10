import Script from "next/script"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  generatePageJsonLd, 
  getCurrentDate, 
  DEFAULT_AUTHOR, 
  DEFAULT_PUBLISHER,
  SITE_CONFIG 
} from "@/lib/jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { getBreadcrumbs } from "@/lib/breadcrumbs"
import { Mail, FileText } from "lucide-react"

// SEO Metadata
export const metadata = generatePageMetadata(
  "Privacy Policy - Infinus",
  "Privacy policy and data protection information for Infinus website and services.",
  "/privacy"
)

// Generate JSON-LD
const jsonLd = generatePageJsonLd({
  pageData: {
    name: "Privacy Policy - Infinus",
    url: `${SITE_CONFIG.url}/privacy`,
    inLanguage: SITE_CONFIG.language,
    description: "Privacy policy and data protection information for Infinus website and services."
  },
  breadcrumbs: getBreadcrumbs("/privacy"),
  articleData: {
    headline: "Privacy Policy - Infinus",
    description: "Privacy policy and data protection information for Infinus website and services.",
    image: SITE_CONFIG.defaultImage,
    authorName: DEFAULT_AUTHOR.name,
    authorUrl: DEFAULT_AUTHOR.url,
    datePublished: getCurrentDate(),
    dateModified: getCurrentDate(),
    inLanguage: SITE_CONFIG.language,
    mainEntityOfPage: `${SITE_CONFIG.url}/privacy`,
    publisher: DEFAULT_PUBLISHER
  },
  faqs: []
})

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString()
  
  return (
    <>
      {/* JSON-LD Script */}
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
        }}
      />


      {/* Content */}
      <Section className="pt-32">
        <Container>
          <div className="max-w-7xl mx-auto" lang="en">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                Privacy Policy
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="secondary" className="text-sm">
                  Last updated: {lastUpdated}
                </Badge>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Sidebar - Table of Contents */}
              <div className="lg:col-span-1">
                <div className="toc sticky top-24 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 no-print">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Table of Contents
                  </h3>
                  <nav className="space-y-2">
                    <a href="#introduction" className="block text-sm text-blue-600 hover:text-blue-800">Introduction</a>
                    <a href="#information-collection" className="block text-sm text-blue-600 hover:text-blue-800">Information Collection</a>
                    <a href="#use-of-information" className="block text-sm text-blue-600 hover:text-blue-800">Use of Information</a>
                    <a href="#sharing-of-information" className="block text-sm text-blue-600 hover:text-blue-800">Sharing of Information</a>
                    <a href="#data-security" className="block text-sm text-blue-600 hover:text-blue-800">Data Security</a>
                    <a href="#your-rights" className="block text-sm text-blue-600 hover:text-blue-800">Your Rights</a>
                    <a href="#changes-to-privacy-policy" className="block text-sm text-blue-600 hover:text-blue-800">Changes to Privacy Policy</a>
                    <a href="#contact-us" className="block text-sm text-blue-600 hover:text-blue-800">Contact Us</a>
                  </nav>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="prose prose-lg max-w-none">
                  <section id="introduction" className="mb-12">
                    <p className="text-lg leading-relaxed text-gray-700">
                      At Infinus, we are committed to protecting your privacy and personal information. This Privacy Policy outlines the information we collect, how it is used, and your rights to control that information.
                    </p>
                  </section>
                  
                  <section id="information-collection" className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-gray-200">
                      Information Collection
                    </h2>
                    <p className="mb-6 text-gray-700 leading-relaxed">
                      We collect information that you voluntarily provide to us when you:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-3 text-gray-700">
                      <li>Sign up for our services</li>
                      <li>Participate in our events or surveys</li>
                      <li>Engage with us through our website or other channels</li>
                      <li>Contact us for support or inquiries</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed">
                      This information may include your name, email address, phone number, company information, and other contact details.
                    </p>
                  </section>
                  
                  <section id="use-of-information" className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-gray-200">
                      Use of Information
                    </h2>
                    <p className="mb-6 text-gray-700 leading-relaxed">
                      The information we collect is used to:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-3 text-gray-700">
                      <li>Provide you with the best possible service and experience</li>
                      <li>Send you updates and news about our services and offerings</li>
                      <li>Customize your experience on our website</li>
                      <li>Respond to your inquiries and provide customer support</li>
                      <li>Improve our services and develop new offerings</li>
                    </ul>
                  </section>
                  
                  <section id="sharing-of-information" className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-gray-200">
                      Sharing of Information
                    </h2>
                    <p className="mb-6 text-gray-700 leading-relaxed">
                      Infinus will not sell or rent your personal information to third parties. We may share your information with:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-3 text-gray-700">
                      <li>Service providers who help us provide our services (they are obligated to keep information confidential)</li>
                      <li>Legal authorities when required by law or to protect our rights</li>
                      <li>Business partners with your explicit consent</li>
                    </ul>
                  </section>
                  
                  <section id="data-security" className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-gray-200">
                      Data Security
                    </h2>
                    <p className="mb-6 text-gray-700 leading-relaxed">
                      Infinus takes appropriate measures to protect the security of your personal information, including:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-3 text-gray-700">
                      <li>Encryption of sensitive data in transit and at rest</li>
                      <li>Regular security audits and assessments</li>
                      <li>Access controls and authentication measures</li>
                      <li>Staff training on data protection best practices</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed">
                      However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                    </p>
                  </section>
                  
                  <section id="your-rights" className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-gray-200">
                      Your Rights
                    </h2>
                    <p className="mb-6 text-gray-700 leading-relaxed">
                      You have the following rights regarding your personal information:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-3 text-gray-700">
                      <li>Access your personal information we hold about you</li>
                      <li>Update or correct inaccurate information</li>
                      <li>Request deletion of your information</li>
                      <li>Object to processing of your information</li>
                      <li>Request data portability</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed">
                      You can exercise these rights by contacting us at the address provided below.
                    </p>
                  </section>
                  
                  <section id="changes-to-privacy-policy" className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-gray-200">
                      Changes to Privacy Policy
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      Infinus may change this Privacy Policy from time to time, so please review it periodically. If we make any material changes, we will notify you by email or through a notice on our website.
                    </p>
                  </section>
                  
                  <section id="contact-us" className="print-break">
                    <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-gray-200">
                      Contact Us
                    </h2>
                    <Card className="contact-card border-2 border-blue-100 bg-blue-50/50">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-lg mb-2">Privacy Questions?</h3>
                            <p className="text-gray-700 mb-3 leading-relaxed">
                              If you have any questions about this Privacy Policy or the information we collect, please contact us:
                            </p>
                            <a 
                              href="mailto:office@infinus.rs" 
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              office@infinus.rs
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
