/**
 * English homepage copy.
 *
 * ── Provenance: EXTRACTED, NOT WRITTEN ──────────────────────────────────────────
 * Every value is lifted VERBATIM from the live implementation as it stood at commit
 * fe98e64, so the Phase H1 refactor changes nothing a visitor sees on `/`:
 *
 *   app/(en)/(site)/page.tsx                    metadata, the hero props, the four
 *                                               JSON-LD FAQ entries
 *   components/ui/shape-landing-hero.tsx        the two h1 spans and the lede
 *   components/ui/StatPills.tsx                 the three trust pills
 *   components/ui/HeroPartnerBadge.tsx          the logo alt/aria
 *   components/ui/about-section.tsx             `defaultCopy` in full
 *   components/ui/sap-services-section.tsx      heading, lede, five service cards
 *   components/ui/partnership-benefits-section  heading, lede, six benefit cards
 *   app/(en)/(site)/_components/DomainExpertise nine industries, headings, modal
 *   components/ui/join-section.tsx              heading, three paragraphs, the whole
 *                                               application form, Zod messages,
 *                                               success text, acknowledgement, and the
 *                                               two JSON-LD-only Q&A
 *
 * No copy editing was done, including where the original wording is imperfect. Left
 * exactly as-is and worth knowing:
 *
 *   · `join.paragraphs[0]` used to read "Due to continues business expansion" and
 *     `join.paragraphs[1]` "interested to become a member". Both were long-standing typos,
 *     preserved verbatim through H1 because correcting them would have changed `/`. The
 *     client asked for them in the final feedback round, so they now read "continuous" and
 *     "interested in becoming"; this is the one place the extracted copy deliberately
 *     departs from fe98e64.
 *   · `about.imageAlt` and `trust.goldPartner` are both "SAP Gold Partner"; they are
 *     different elements that happen to share a string.
 *   · `services.cardHref` / `benefits.cardHref` are "/contact" because every card in
 *     both grids links there, not to a per-card destination.
 */

import type { HomeDictionary } from '../dictionary'

export const home: HomeDictionary = {
  metadata: {
    title: 'Infinus - Driving Business Success through SAP Expertise',
    description:
      'Your reliable SAP expertise partner. SAP Gold Partner focused on SAP Business Suite solutions including SAP Cloud ERP, SAP Business Data Cloud, SAP Business AI, and SAP Business Technology Platform.',
  },

  hero: {
    titleLine1: 'Turning SAP Expertise',
    titleLine2: 'into Business Advantage',
    lede: 'Empowering companies to work smarter and grow faster',
    logoAlt: 'Infinus',
    ctaLabel: 'Contact Us',
    ctaHref: '/contact',
  },

  trust: {
    goldPartner: 'SAP Gold Partner',
    consultants: '30+ experienced consultants',
    customers: '30+ satisfied clients',
  },

  about: {
    title: 'About Us',
    intro:
      'Infinus is an SAP Gold Partner specializing in SAP Cloud ERP (Public and Private) and SAP Business AI, delivering deep expertise across the SAP Business Suite portfolio.',
    paragraphs: [
      'Our team of experienced consultants combines technology know-how with business process understanding to deliver best-in-class SAP consulting services and tailored solutions that drive measurable results.',
      'The majority of our experts are senior SAP consultants with over a decade of professional experience across various industries, technologies, and functional areas.',
    ],
    bullets: [
      'SAP Cloud ERP (Public and Private)',
      'SAP Business AI',
      'SAP Business Technology Platform (BTP)',
      'SAP Business Data Cloud',
    ],
    ctaLabel: 'Learn more',
    ctaHref: '/contact',
    imageAlt: 'SAP Gold Partner',
  },

  services: {
    heading: 'Our SAP Expertise in Action',
    lede:
      "We combine business insight and SAP expertise to help companies operate smarter, faster, and with confidence. From strategy to support, we're your trusted partner throughout the entire SAP lifecycle.",
    items: [
      {
        title: 'SAP Advisory & Consulting',
        body:
          'We define the right SAP strategy for your business - aligning technology with your goals and ensuring measurable outcomes.',
      },
      {
        title: 'SAP Implementations',
        body:
          'Fast, transparent, and reliable deployments based on SAP Activate and proven best practices - tailored to your operations.',
      },
      {
        title: 'SAP Application Management & Support',
        body:
          'Continuous monitoring, optimization, and expert guidance to keep your SAP system stable, secure, and up to date.',
      },
      {
        title: 'SAP Integration & Process Optimization',
        body:
          'Connecting SAP with other systems to streamline workflows, improve visibility, and eliminate operational silos.',
      },
      {
        title: 'SAP Extensions & Innovation',
        body:
          'Enhancing standard SAP functionality through custom developments, analytics, and BTP innovations for your specific needs.',
      },
    ],
    cardHref: '/contact',
  },

  benefits: {
    heading: 'Why Infinus',
    lede:
      'Partnering with Infinus means working with experts who understand both SAP technology and real business challenges.',
    items: [
      {
        title: 'Deep SAP Expertise',
        body:
          '70% of our consultants have over 10 years of hands-on SAP experience across SAP ECC, SAP S/4HANA, ABAP, BTP, and line-of-business solutions.',
      },
      {
        title: 'Business Understanding',
        body:
          'We speak the language of CFOs, COOs, and CEOs - translating complex SAP concepts into clear business outcomes.',
      },
      {
        title: 'Trusted Partnership',
        body:
          'We act as an extension of your team - transparent, accountable, and fully aligned with your success.',
      },
      {
        title: 'End-to-End Capability',
        body:
          'From advisory and implementation to support and optimization - we cover the full SAP lifecycle with one team.',
      },
      {
        title: 'Agility & Predictability',
        body:
          'Fast execution, minimal disruption, and results you can measure - powered by SAP Activate methodology and best practices.',
      },
      {
        title: 'Regional Presence, European Reach',
        body:
          'Headquartered in Serbia with clients across the EU - combining local dedication with international standards.',
      },
    ],
    cardHref: '/contact',
  },

  domains: {
    eyebrow: 'Industries',
    heading: 'Industry Expertise',
    lede: 'Industry-specific SAP solutions delivered with deep process knowledge.',
    items: [
      { label: 'Retail', imageAlt: 'Retail industry' },
      { label: 'Pharmaceuticals', imageAlt: 'Pharmaceuticals industry' },
      { label: 'Wholesale and Distribution', imageAlt: 'Wholesale and Distribution' },
      { label: 'Consumer Goods', imageAlt: 'Consumer goods' },
      { label: 'Industrial Manufacturing', imageAlt: 'Industrial manufacturing' },
      { label: 'Professional Services', imageAlt: 'Professional services' },
      { label: 'Travel', imageAlt: 'Travel industry' },
      { label: 'Oil & Gas', imageAlt: 'Oil and gas sector' },
      { label: 'Telco', imageAlt: 'Telecommunications' },
    ],
    modal: {
      titlePrefix: '',
      titleSuffix: ' Expertise',
      bodyBefore: 'Detailed information about our ',
      bodyAfter:
        " expertise and SAP solutions is coming soon. We're working on comprehensive content to help you understand how we can support your industry-specific needs.",
      close: 'Close',
      contact: 'Contact Us',
      closeAria: 'Close modal',
      tileAriaSuffix: ' domain',
    },
    contactHref: '/contact',
  },


  /**
   * The short business enquiry form, in the slot the Join Our Team section used to occupy.
   *
   * Wording is new — there was no English source to extract, because this form did not
   * exist. It stays close to the approved Contact page's register rather than inventing a
   * different voice for the same company.
   */
  contactShort: {
    heading: 'Talk to our SAP team',
    body:
      'Tell us what you are working on and we will get back to you within one business day.',
    nameLabel: 'Name *',
    namePlaceholder: 'Your full name',
    emailLabel: 'Business Email *',
    emailPlaceholder: 'name@company.com',
    companyLabel: 'Company',
    companyPlaceholder: 'Your company',
    messageLabel: 'Message *',
    messagePlaceholder: 'Tell us about your SAP needs or project requirements...',
    submit: 'Contact Us',
    submitting: 'Sending...',
    validation: {
      name: 'Name must be at least 2 characters',
      email: 'Invalid email address',
      message: 'Message must be at least 10 characters',
    },
    success: {
      heading: 'Thank You!',
      body: "Your message has been sent successfully. We'll get back to you soon.",
    },
    error: 'Failed to send message. Please try again.',
    privacy: {
      before: 'By submitting this form, you confirm that you have read our ',
      linkText: 'Privacy Policy',
      after: '.',
      href: '/privacy',
    },
  },

  // Verbatim from the WebPage/Article schema in the pre-H1 page: shorter than the meta
  // description, and left exactly as it was.
  structuredDescription:
    'Your reliable SAP expertise partner. SAP Gold Partner focused on SAP Business Suite solutions.',

  structuredFaq: [
    {
      title: 'What services does Infinus provide?',
      body:
        'Infinus provides SAP Implementation Services (greenfield, brownfield, conversions, migrations and rollouts), SAP Support Services (SAP Application Management Services and SLA Support Services), and Other Services (SAP localisation support, developments, trainings, etc.).',
    },
    {
      title: 'What are the benefits of working with Infinus?',
      body:
        'Benefits include European Focus (located in Serbia, CET time zone, services throughout Europe), Hybrid Work Model (onsite and remote work), Competitive Pricing (cost-effective services without sacrificing quality), and Flexible Solutions (flexible engagement models tailored to your needs).',
    },
  ],
}
