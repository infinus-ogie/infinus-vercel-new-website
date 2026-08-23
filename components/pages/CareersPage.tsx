import Script from "next/script"
import { Section } from "@/components/ui/section"
import { JoinSection } from "@/components/ui/join-section"
import type { CareersDictionary, HomeDictionary } from "@/content/dictionary"

/**
 * The Careers page body, shared by /careers and /sr/careers.
 *
 * ONE implementation, two locales — the same arrangement every other pair on this site
 * uses. The route files differ only in which dictionary they pass, which metadata they
 * export and which JSON-LD they build.
 *
 * The body is `JoinSection`, unchanged. It rendered inside `#join-team` on the homepage
 * until the client asked for a dedicated page; the section id and the surrounding
 * `<Section>` wrapper are carried across so the visual treatment is identical to what was
 * already approved. The id also keeps any bookmarked `/#join-team` fragment meaningful if
 * it is ever forwarded here.
 *
 * A server component: it reads no request state, so both routes stay statically
 * prerendered.
 */
export interface CareersPageProps {
  content: CareersDictionary
  /** The trust pills, in this page's locale. Required — see JoinSection. */
  trust: HomeDictionary["trust"]
  /** Serialised JSON-LD for this locale, built by the route file. */
  jsonLd: string
}

export function CareersPage({ content, trust, jsonLd }: CareersPageProps) {
  return (
    <>
      <Script
        id="json-ld-careers"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <Section id="join-team" surface="surface-1" data-section="join-team">
        <JoinSection copy={content} trust={trust} />
      </Section>
    </>
  )
}
