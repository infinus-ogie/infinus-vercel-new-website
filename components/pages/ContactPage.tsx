import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Contact2 } from "@/components/ui/contact-2"
import { Clock, MessageSquare, Users } from "lucide-react"
import { AutoJsonLd } from "@/components/seo/AutoJsonLd"
import type { PageConfig } from "@/lib/page-config"
import type { ContactDictionary } from "@/content/dictionary"

/**
 * The Contact page body, shared by /contact and /sr/contact.
 *
 * ONE implementation, two locales. The route files differ only in which dictionary they
 * pass, which metadata they export and which JSON-LD config they build — there is no
 * second copy of this markup, and no Serbian fork of the form.
 *
 * The markup is exactly what app/(en)/(site)/contact/page.tsx rendered at 4e283f27, with
 * literal strings replaced by lookups on `content`. The English dictionary holds those
 * literals verbatim, so /contact is unchanged apart from the intentional language switcher
 * that the shared Navbar now renders.
 *
 * A server component: it reads no request state, so both routes stay statically
 * prerendered. Only Contact2 below it is a client component, exactly as before.
 *
 * The icons are presentation, not copy, so they live here and are paired with the three CTA
 * cards by position — the dictionary type pins the list at exactly three entries.
 */

const CTA_ICONS = [Users, MessageSquare, Clock] as const

export interface ContactPageProps {
  content: ContactDictionary
  /** Locale-specific JSON-LD input, built by the route file. */
  jsonLd: PageConfig
}

export function ContactPage({ content, jsonLd }: ContactPageProps) {
  return (
    <>
      {/* Auto-generated JSON-LD - updates automatically when the page config changes */}
      <AutoJsonLd config={jsonLd} />


      {/* Contact hero, details and form */}
      <Contact2 content={content} />

      {/* CTA Section */}
      <Section>
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {content.cta.heading}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {content.cta.body}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {content.cta.cards.map((card, index) => {
                const Icon = CTA_ICONS[index]
                return (
                  <div key={card.title} className="flex flex-col items-center">
                    <Icon className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-semibold mb-1">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {card.body}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
