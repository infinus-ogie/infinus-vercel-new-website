import Script from "next/script"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
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

      {/* Breadcrumbs */}
      <Section surface="surface-1">
        <Container>
          <Breadcrumbs items={getBreadcrumbs("/privacy")} />
        </Container>
      </Section>

      {/* Content */}
      <Section>
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <div className="prose prose-lg max-w-none">
              <h2>Introduction</h2>
              <p>
                Infinus ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard 
                your information when you visit our website or use our services.
              </p>

              <h2>Information We Collect</h2>
              <h3>Personal Information</h3>
              <p>
                We may collect personal information that you voluntarily provide to us, including:
              </p>
              <ul>
                <li>Name and contact information (email address, phone number)</li>
                <li>Company information</li>
                <li>Information provided through contact forms</li>
                <li>Communication preferences</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <p>
                We may automatically collect certain information about your device and usage, including:
              </p>
              <ul>
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our website</li>
                <li>Referring website information</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide and improve our services</li>
                <li>Respond to your inquiries and requests</li>
                <li>Send you relevant information about our services</li>
                <li>Analyze website usage and performance</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>Information Sharing and Disclosure</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to 
                third parties without your consent, except as described in this Privacy Policy. 
                We may share your information in the following circumstances:
              </p>
              <ul>
                <li>With service providers who assist us in operating our website and services</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>

              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect 
                your personal information against unauthorized access, alteration, disclosure, 
                or destruction. However, no method of transmission over the internet or 
                electronic storage is 100% secure.
              </p>

              <h2>Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience 
                on our website. You can control cookie settings through your browser preferences.
              </p>

              <h2>Your Rights</h2>
              <p>Depending on your location, you may have the following rights regarding your personal information:</p>
              <ul>
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your personal information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
              </ul>

              <h2>Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible 
                for the privacy practices or content of these external sites.
              </p>

              <h2>Children's Privacy</h2>
              <p>
                Our services are not directed to children under 13 years of age. We do not 
                knowingly collect personal information from children under 13.
              </p>

              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of 
                any changes by posting the new Privacy Policy on this page and updating the 
                "Last updated" date.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our privacy practices, 
                please contact us at:
              </p>
              <ul>
                <li>Email: office@infinus.rs</li>
                <li>Address: Infinus d.o.o., Tresnjinog cveta 1, 11070 Belgrade, Serbia</li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
