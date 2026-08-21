import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Accordion } from "@/components/ui/accordion"
import { FAQItem } from "@/components/content/faq-item"
import { AutoJsonLd } from "@/components/seo/AutoJsonLd"
import type { PageConfig } from "@/lib/page-config"
import type { FaqDictionary } from "@/content/dictionary"

/**
 * The FAQ page body, shared by `/faq` and `/sr/faq`.
 *
 * ONE implementation, two locales. The markup is exactly what app/(en)/(site)/faq/page.tsx
 * rendered at commit fe98e64, with literal strings replaced by lookups on `content`.
 *
 * The accordion items and the FAQPage JSON-LD are built from the SAME dictionary array, so a
 * question visible to a visitor is by construction the question advertised to crawlers — in
 * whichever language the page is. Order and identity are pinned by the 12-tuple type.
 *
 * A server component; the accordion below it is the only client boundary, as before.
 */
export interface FaqPageProps {
  content: FaqDictionary
  /** Locale-specific JSON-LD input, built by the route file from the same items. */
  jsonLd: PageConfig
}

export function FaqPage({ content, jsonLd }: FaqPageProps) {
  return (
    <>
      {/* Auto-generated JSON-LD - updates automatically when the dictionary changes */}
      <AutoJsonLd config={jsonLd} />


      {/* Hero Section */}
      <Section className="pt-32">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {content.heading}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {content.intro}
            </p>
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section surface="surface-1">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {content.items.map((faq, index) => (
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
              {content.cta.heading}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {content.cta.body}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={content.cta.contactHref}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                {content.cta.contactLabel}
              </a>
              <a
                href={content.cta.emailHref}
                className="inline-flex items-center justify-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-transparent hover:bg-primary/10 transition-colors"
              >
                {content.cta.emailLabel}
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
