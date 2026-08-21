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
 *   · `join.paragraphs[0]` reads "Due to continues business expansion" — a typo in the
 *     live English page. NOT corrected here; correcting it would change `/`.
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
  },

  trust: {
    goldPartner: 'SAP Gold Partner',
    consultants: '30+ experienced consultants',
    customers: '20+ satisfied customers',
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
    heading: 'Our Expertise in Action',
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
    heading: 'Benefits working with us',
    lede:
      'Partnering with Infinus means working with experts who understand both SAP technology and real business challenges.',
    items: [
      {
        title: 'Deep SAP Expertise',
        body:
          '20+ years of combined consulting experience across SAP ECC, S/4HANA, ABAP, BTP, LoB solutions and platforms - proven knowledge, delivered with precision.',
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
    heading: 'Domain Expertise',
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

  join: {
    heading: 'Join Our Team',
    paragraphs: [
      'Due to continues business expansion, we are looking to expand our team.',
      'If you have experience in some of SAP S/4HANA or ECC modules and areas, industry solutions, and/or LOB solutions, and if you are interested to become a member of the agile team of dedicated SAP professionals, please contact us.',
      'We will be glad to talk with you!',
    ],
    form: {
      nameLabel: 'Your Name *',
      namePlaceholder: 'Nikola Trivic',
      phoneLabel: 'Phone Number',
      phonePlaceholder: '+381 64 123 4567',
      phoneHint: 'Include country code (E.164 format)',
      emailLabel: 'Your Email *',
      emailPlaceholder: 'name@company.com',
      linkedinLabel: 'LinkedIn URL',
      linkedinPlaceholder: 'https://linkedin.com/in/yourprofile',
      subjectLabel: 'Subject *',
      subjectPlaceholder: 'SAP Consultant Position',
      messageLabel: 'Message *',
      messagePlaceholder: "Tell us about your SAP experience and why you'd like to join our team...",
      fileLabel: 'Attach your resume (optional)',
      fileClickToUpload: 'Click to upload',
      fileOrDragAndDrop: ' or drag and drop',
      fileHint: 'PDF, DOC, DOCX (max 5MB)',
      submit: 'Submit Application',
      submitting: 'Submitting...',
      replyPromise: 'We reply within 1 business day.',
    },
    validation: {
      name: 'Please enter your name.',
      email: 'Enter a valid email address.',
      linkedin: 'Please enter a valid LinkedIn URL.',
      subject: 'Subject is required.',
      message: 'Message should be at least 10 characters.',
      fileType: 'Allowed files: PDF, DOC, DOCX.',
      fileSize: 'Max file size is 5MB.',
    },
    success: "Thanks for your application. We'll get back to you!",
    privacy: {
      before: 'By submitting your application, you confirm that you have read our ',
      linkText: 'Privacy Policy',
      after: '.',
      href: '/politika-privatnosti',
    },
    faq: [
      {
        title: 'How do I apply?',
        body:
          'Fill in your name, email, phone, subject and message, attach your resume if you have one, and click Submit Application. We will review and get back to you.',
      },
      {
        title: 'What happens after I submit?',
        body:
          'Our team reviews your application and replies by email. If there is a fit, we will schedule an introductory call.',
      },
    ],
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
    {
      title: 'How do I apply?',
      body:
        'Fill in your name, email, phone, subject and message, attach your resume if you have one, and click Submit Application. We will review and get back to you.',
    },
    {
      title: 'What happens after I submit?',
      body:
        'Our team reviews your application and replies by email. If there is a fit, we will schedule an introductory call.',
    },
  ],
}
