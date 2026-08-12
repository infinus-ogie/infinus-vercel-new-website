import { ContactPage } from "@/components/pages/ContactPage"
import { getDictionary } from "@/content/dictionary"
import { generatePageMetadata } from "@/lib/seo"
import { localeAlternatesMetadata } from "@/lib/seo-i18n"
import { createSimplePageConfig } from "@/lib/auto-jsonld"
import { LOCALE_META } from "@/lib/i18n"

/**
 * ENGLISH Contact page — the English half of the site's first real locale pair.
 *
 * Phase G changed how this file is assembled, not what it renders. The page body moved to
 * components/pages/ContactPage.tsx (shared with /sr/contact) and every string moved to
 * content/en/contact.ts verbatim, so the visible English copy is byte-for-byte what it was.
 *
 * The ONE intentional head change: `alternates` now carries real reciprocal hreflang,
 * because /sr/contact exists. lib/seo-i18n.ts derives that from the route-pair map and
 * would emit nothing if the Serbian side were missing or merely planned.
 */

const PATH = "/contact"
const content = getDictionary("en").contact

export const metadata = {
  ...generatePageMetadata(content.metadata.title, content.metadata.description, PATH),
  // Replaces the plain { canonical } the shared helper produces. Same canonical, plus
  // en / sr-Latn / x-default — the first hreflang the site has ever emitted.
  alternates: localeAlternatesMetadata(PATH),
}

/**
 * Page config — single source of truth for JSON-LD.
 *
 * The FAQ entries are unchanged from before Phase G. NOTE: they contain placeholder contact
 * data ("+1 (555) 123-4567", "9 AM to 6 PM EST", contact@infinus.co) that contradicts the
 * real details on the page. Pre-existing and out of scope here — flagged rather than fixed,
 * and deliberately NOT carried over into the Serbian page's structured data.
 */
const pageConfig = createSimplePageConfig(
  PATH,
  content.metadata.title,
  content.metadata.description,
  {
    language: LOCALE_META.en.jsonLdLanguage,
    faqs: [
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
    ],
    articleAbout: ["SAP Services", "SAP Consulting", "SAP Support", "Contact"],
  }
)

export default function EnglishContactPage() {
  return <ContactPage content={content} jsonLd={pageConfig} />
}
