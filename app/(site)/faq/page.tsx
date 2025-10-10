import Script from "next/script"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FAQItem } from "@/components/content/faq-item"
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
  "Frequently Asked Questions - SAP Services",
  "Find answers to common questions about SAP services, implementation, support, and our expertise as a SAP Gold Partner.",
  "/faq"
)

// FAQ data
const faqs = [
  {
    question: "What services do you offer?",
    answer: "SAP implementation services - we are open for both T&M and fix-price types of engagement. SAP support services for customers' existing SAP system (for all modules and processes, including standard support and change requests). Other services related to SAP solutions, including upgrades, transformations, conversions, migrations, custom development training, and quality assurance services."
  },
  {
    question: "What are your setup resources?",
    answer: "SAP functional consultants with extensive knowledge and experience in many SAP modules and solutions such as FI, CO, MM, SD, EWM, PP, PM, QM, SCM, F & R, SAP Retail, and SAP Oil & Gas. SAP developers who are highly proficient in utilizing ABAP and Fiori technologies for the development of custom solutions and user-centric interfaces. SAP BC technical consultants who are adept in providing expert-level technical support, troubleshooting, and solutions for SAP Basis and NetWeaver. SAP consultants for Data & Analytics solutions who are well-versed in utilizing BW, DWC, SAC, IBP, and more, providing robust data analytics and solutions to clients."
  },
  {
    question: "What are your main domain areas of expertise?",
    answer: "Vertical industry expertise includes: Retail, Logistics, Life Sciences, Manufacturing, Airlines, Oil & Gas, Utilities, and Telco."
  },
  {
    question: "What are your prices?",
    answer: "Our prices vary based on our specific services and solutions. We offer flexible pricing options and will work with you to create a customized plan that fits your budget and needs."
  },
  {
    question: "What are the benefits of using your service?",
    answer: "Our experienced SAP consultants bring comprehensive knowledge of business processes, technologies, market trends, and best practices to deliver best-in-class consulting services and solutions."
  },
  {
    question: "What is your process for working with clients?",
    answer: "Our process begins with an initial consultation to understand your business needs and goals. From there, we will work with you to identify areas for improvement, provide guidance on best practices, and tailor solutions to meet your specific needs."
  },
  {
    question: "How can I get started with your service?",
    answer: "You can get started by organizing an initial consultation meeting. We will work with you to understand your business needs and goals and provide guidance on how we can best assist you."
  },
  {
    question: "What are your hours of operation?",
    answer: "Our hours of operation are from 9:00 AM to 5:00 PM CET time, Monday through Friday."
  },
  {
    question: "Do you have any customer testimonials or case studies?",
    answer: "Yes, we have a variety of customer testimonials and case studies available upon request."
  },
  {
    question: "What are your terms and conditions?",
    answer: "Our terms and conditions are available upon request."
  },
  {
    question: "Do you have any guarantees or warranties?",
    answer: "We stand behind our services and are committed to delivering results. If you are not satisfied with the results of our services, we will work with you to find a solution."
  },
  {
    question: "How can I contact you if I have more questions?",
    answer: "You can contact us by phone or email."
  }
]

// Generate JSON-LD
const jsonLd = generatePageJsonLd({
  pageData: {
    name: "Frequently Asked Questions - SAP Services",
    url: `${SITE_CONFIG.url}/faq`,
    inLanguage: SITE_CONFIG.language,
    description: "Find answers to common questions about SAP services, implementation, support, and our expertise as a SAP Gold Partner."
  },
  breadcrumbs: getBreadcrumbs("/faq"),
  articleData: {
    headline: "Frequently Asked Questions - SAP Services",
    description: "Find answers to common questions about SAP services, implementation, support, and our expertise as a SAP Gold Partner.",
    image: SITE_CONFIG.defaultImage,
    authorName: DEFAULT_AUTHOR.name,
    authorUrl: DEFAULT_AUTHOR.url,
    datePublished: getCurrentDate(),
    dateModified: getCurrentDate(),
    inLanguage: SITE_CONFIG.language,
    mainEntityOfPage: `${SITE_CONFIG.url}/faq`,
    publisher: DEFAULT_PUBLISHER
  },
  faqs
})

export default function FAQPage() {
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


      {/* Hero Section */}
      <Section className="pt-32">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers to common questions about our SAP services, implementation process, 
              and how we can help transform your business with expert SAP solutions.
            </p>
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section surface="surface-1">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  value={`item-${index}`}
                />
              ))}
            </Accordion>
          </div>
        </Container>
      </Section>

      {/* Contact CTA */}
      <Section>
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our SAP experts are here to help. Contact us for personalized answers 
              to your specific questions and requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="mailto:contact@infinus.co"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-transparent hover:bg-primary/10 transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
