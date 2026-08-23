import Script from "next/script"
import { Section } from "@/components/ui/section"
import { HeroGeometric } from "@/components/ui/shape-landing-hero"
import { SapServicesSection } from "@/components/ui/sap-services-section"
import { PartnershipBenefitsSection } from "@/components/ui/partnership-benefits-section"
import DomainExpertiseSection from "@/components/ui/domain-expertise-section"
import AboutSection from "@/components/ui/about-section"
import type { HomeDictionary } from "@/content/dictionary"

/**
 * The homepage body, shared by `/` and `/sr`.
 *
 * ONE implementation, two locales. The route files differ only in which dictionary they
 * pass, which metadata they export and which JSON-LD they build — there is no second copy
 * of this markup and no Serbian fork of any section.
 *
 * The markup and section order are exactly what app/(en)/(site)/page.tsx rendered at commit
 * fe98e64, with literal strings replaced by lookups on `content`. The English dictionary
 * holds those literals verbatim, so `/` is unchanged apart from the language switcher the
 * shared Navbar now renders (its counterpart went live in this phase).
 *
 * `anchorBase` is the page's own path, so the industry tiles link to the anchor on the page
 * the visitor is already on rather than always jumping to the English homepage.
 *
 * A server component: it reads no request state, so both routes stay statically prerendered.
 */
export interface HomePageProps {
  content: HomeDictionary
  /** Serialised JSON-LD for this locale, built by the route file. */
  jsonLd: string
  /** This page's own path — "/" or "/sr". */
  anchorBase: string
}

export function HomePage({ content, jsonLd, anchorBase }: HomePageProps) {
  return (
    <>
      {/* JSON-LD Script */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd
          }}
        />

        {/* [A] Geometric Hero Section */}
        <div className="hero-dark">
          <HeroGeometric hero={content.hero} trust={content.trust} />
        </div>

        {/* [B] About Us Section */}
        <AboutSection copy={content.about} />


        {/* [D] Our SAP Services Section */}
        <Section id="our-expertise" surface="surface-1" data-section="sap-services">
          <SapServicesSection copy={content.services} />
        </Section>

        {/* [E] Partnership Benefits Section */}
        <Section id="partnership-benefits" surface="surface-1" data-section="partnership-benefits">
          <PartnershipBenefitsSection copy={content.benefits} />
        </Section>

        {/* [F] Domain Expertise Section */}
        <DomainExpertiseSection
          copy={content.domains}
          sectionHref={`${anchorBase === "/" ? "/" : anchorBase}#domain-expertise`}
        />

    </>
  )
}
