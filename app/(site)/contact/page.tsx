import Script from "next/script"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Contact2 } from "@/components/ui/contact-2"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  MessageSquare,
  Users
} from "lucide-react"
import { 
  generatePageJsonLd, 
  getCurrentDate, 
  DEFAULT_AUTHOR, 
  DEFAULT_PUBLISHER,
  SITE_CONFIG 
} from "@/lib/jsonld"
import { generatePageMetadata } from "@/lib/seo"
import { getBreadcrumbs } from "@/lib/breadcrumbs"

// SEO Metadata
export const metadata = generatePageMetadata(
  "Contact Infinus - Get Expert SAP Support",
  "Contact our SAP experts for implementation, support, and consulting services. Get in touch with Infinus, your trusted SAP Gold Partner.",
  "/contact"
)

// FAQ data for JSON-LD
const faqs = [
  {
    question: "How can I contact Infinus for SAP services?",
    answer: "You can contact us through our contact form, email us at contact@infinus.co, or call us at +1 (555) 123-4567. We're available Monday through Friday, 9 AM to 6 PM EST."
  },
  {
    question: "What information should I include when contacting you?",
    answer: "Please include your name, company, contact information, and a brief description of your SAP needs or project requirements. This helps us provide you with the most relevant information and next steps."
  },
  {
    question: "How quickly do you respond to inquiries?",
    answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly for immediate assistance."
  },
  {
    question: "Do you offer free consultations?",
    answer: "Yes, we offer free initial consultations to discuss your SAP needs and provide recommendations. Contact us to schedule a consultation with our SAP experts."
  }
]

// Contact information
const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us an email anytime",
    details: "office@infinus.rs",
    href: "mailto:office@infinus.rs"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Our office location",
    details: "Infinus d.o.o.\nTresnjinog cveta 1\n11070 Belgrade, Serbia",
    href: "#"
  }
]

// Generate JSON-LD
const jsonLd = generatePageJsonLd({
  pageData: {
    name: "Contact Infinus - Get Expert SAP Support",
    url: `${SITE_CONFIG.url}/contact`,
    inLanguage: SITE_CONFIG.language,
    description: "Contact our SAP experts for implementation, support, and consulting services. Get in touch with Infinus, your trusted SAP Gold Partner."
  },
  breadcrumbs: getBreadcrumbs("/contact"),
  articleData: {
    headline: "Contact Infinus - Get Expert SAP Support",
    description: "Contact our SAP experts for implementation, support, and consulting services. Get in touch with Infinus, your trusted SAP Gold Partner.",
    image: SITE_CONFIG.defaultImage,
    authorName: DEFAULT_AUTHOR.name,
    authorUrl: DEFAULT_AUTHOR.url,
    datePublished: getCurrentDate(),
    dateModified: getCurrentDate(),
    inLanguage: SITE_CONFIG.language,
    mainEntityOfPage: `${SITE_CONFIG.url}/contact`,
    publisher: DEFAULT_PUBLISHER
  },
  faqs
})

export default function ContactPage() {
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


      {/* New Contact Design */}
      <Contact2 
        title="Contact Our SAP Experts"
        description="Ready to transform your business with SAP? Get in touch with our expert team for implementation, support, and consulting services. We're here to help you succeed."
        email="office@infinus.rs"
        address="Tresnjinog cveta 1, Belgrade, Serbia"
        web={{ label: "infinus.co", url: "https://infinus.co" }}
      />

      {/* CTA Section */}
      <Section>
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of satisfied clients who have transformed their business 
              with our SAP expertise. Contact us today for a free consultation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <Users className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Expert Team</h3>
                <p className="text-sm text-muted-foreground">
                  Certified SAP professionals with deep industry expertise
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Free Consultation</h3>
                <p className="text-sm text-muted-foreground">
                  Get expert advice on your SAP implementation needs
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <Clock className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Quick Response</h3>
                <p className="text-sm text-muted-foreground">
                  We respond to all inquiries within 24 hours
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
