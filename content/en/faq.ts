/**
 * English FAQ page copy.
 *
 * ── Provenance: EXTRACTED, NOT WRITTEN ──────────────────────────────────────────
 * Every value is lifted VERBATIM from app/(en)/(site)/faq/page.tsx as it stood at
 * commit fe98e64 — the metadata, the h1 and lede, all twelve Q&A (which feed both the
 * visible accordion and the FAQPage JSON-LD from one array), and the closing CTA.
 *
 * No copy editing. Two things left exactly as they are:
 *
 *   · `cta.emailHref` used to be contact@infinus.co while the footer and the Contact page
 *     said office@infinus.rs. Both are now office@infinus.co: the final client-feedback
 *     round normalised the public contact address across every visible surface.
 *     lib/email.ts still DELIVERS to the .rs mailbox — displaying an address and routing
 *     mail to it are separate decisions, and the .co mailbox has not been verified to
 *     receive form submissions yet.
 *   · The lede renders as one sentence because JSX collapses its source line break.
 *     Reproduced here as that single rendered string.
 */

import type { FaqDictionary } from '../dictionary'

export const faq: FaqDictionary = {
  metadata: {
    title: 'Frequently Asked Questions - SAP Services',
    description:
      'Find answers to common questions about SAP services, implementation, support, and our expertise as an SAP Gold Partner.',
  },

  heading: 'Frequently Asked Questions',
  intro:
    'Find answers to common questions about our SAP services, implementation process, and how we can help transform your business with expert SAP solutions.',

  items: [
    {
      question: 'What services do you offer?',
      answer:
        "SAP implementation services - we are open for both T&M and fix-price types of engagement. SAP support services for clients' existing SAP system (for all modules and processes, including standard support and change requests). Other services related to SAP solutions, including upgrades, transformations, conversions, migrations, custom development training, and quality assurance services.",
    },
    {
      question: 'What are your setup resources?',
      answer:
        'SAP functional consultants with extensive knowledge and experience in many SAP modules and solutions such as FI, CO, MM, SD, EWM, PP, PM, QM, SCM, F & R, SAP Retail, and SAP Oil & Gas. SAP developers who are highly proficient in utilizing ABAP and Fiori technologies for the development of custom solutions and user-centric interfaces. SAP BC technical consultants who are adept in providing expert-level technical support, troubleshooting, and solutions for SAP Basis and NetWeaver. SAP consultants for Data & Analytics solutions who are well-versed in utilizing BW, DWC, SAC, IBP, and more, providing robust data analytics and solutions to clients.',
    },
    {
      question: 'What are your main domain areas of expertise?',
      answer:
        'Vertical industry expertise includes: Retail, Logistics, Life Sciences, Manufacturing, Airlines, Oil & Gas, Utilities, and Telco.',
    },
    {
      question: 'What are your prices?',
      answer:
        'Our prices vary based on our specific services and solutions. We offer flexible pricing options and will work with you to create a customized plan that fits your budget and needs.',
    },
    {
      question: 'What are the benefits of using your service?',
      answer:
        'Our experienced SAP consultants bring comprehensive knowledge of business processes, technologies, market trends, and best practices to deliver best-in-class consulting services and solutions.',
    },
    {
      question: 'What is your process for working with clients?',
      answer:
        'Our process begins with an initial consultation to understand your business needs and goals. From there, we will work with you to identify areas for improvement, provide guidance on best practices, and tailor solutions to meet your specific needs.',
    },
    {
      question: 'How can I get started with your service?',
      answer:
        'You can get started by organizing an initial consultation meeting. We will work with you to understand your business needs and goals and provide guidance on how we can best assist you.',
    },
    {
      question: 'What are your hours of operation?',
      answer: 'Our hours of operation are from 9:00 AM to 5:00 PM CET time, Monday through Friday.',
    },
    {
      question: 'Do you have any client testimonials or case studies?',
      answer: 'Yes, we have a variety of client testimonials and case studies available upon request.',
    },
    {
      question: 'What are your terms and conditions?',
      answer: 'Our terms and conditions are available upon request.',
    },
    {
      question: 'Do you have any guarantees or warranties?',
      answer:
        'We stand behind our services and are committed to delivering results. If you are not satisfied with the results of our services, we will work with you to find a solution.',
    },
    {
      question: 'How can I contact you if I have more questions?',
      answer: 'You can contact us by phone or email.',
    },
  ],

  cta: {
    heading: 'Still Have Questions?',
    body:
      'Our SAP experts are here to help. Contact us for personalized answers to your specific questions and requirements.',
    contactLabel: 'Contact Us',
    contactHref: '/contact',
    emailLabel: 'Email Us',
    emailHref: 'mailto:office@infinus.co',
  },

  // Verbatim from the pre-H1 `articleAbout`.
  structuredAbout: ['SAP Services', 'SAP FAQ', 'SAP Support', 'SAP Implementation'],
}
