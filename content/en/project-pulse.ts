/**
 * English ProjectPulse copy — /projectpulse.
 *
 * ── Provenance: EXTRACTED, NOT WRITTEN ──────────────────────────────────────────
 * Every value is lifted VERBATIM from app/(en)/(site)/projectpulse/_config.ts and from the
 * literals that sat directly in _components/ProjectPulseContent.tsx at commit f143256.
 * Nothing was reworded, reordered or tidied.
 *
 * ── Why this holds more than the page shows ─────────────────────────────────────
 * The live page renders six blocks: hero, challenge/solution, "What you gain", "Ideal for",
 * "Why ProjectPulse" and the final CTA. Four further blocks — "How it works", "Outcomes by
 * role", "Implementation" and "About Infinus" — are commented out in the component but
 * their copy still lives in the config, and two of them still FEED THE JSON-LD:
 *
 *   · `howItWorks.microCards[].description` and `valueProposition.items[].description`
 *     are concatenated into the SoftwareApplication `featureList`.
 *   · `implementation.subtitle` and `implementation.phases` build the whole HowTo schema.
 *
 * So they are not dead weight and they are not optional. `outcomes` and `about` are the two
 * that feed neither the page nor the schema today; they are carried across anyway so that
 * un-commenting a section is a one-line change rather than a new translation phase.
 *
 * ── Quirks preserved deliberately ──────────────────────────────────────────────
 *   · `valueProposition.items[].description` is empty on all four items. The cards render
 *     titles only, but the empty strings still land in the JSON-LD `featureList` as four
 *     empty entries. That is the live schema; reproduced, not fixed. Logged for SEO review.
 *   · The hero's discovery CTA reads "Book a 60-min discovery call" while the footer CTA
 *     reads "Book a discovery call". Two different labels for the same destination, exactly
 *     as the page ships.
 *   · The solution card's description is split into three fields because the component
 *     wraps "Project-to-Profit" in <strong>. `problem.solution.description` in the old
 *     config held an unbolded copy of the same sentence that nothing rendered; the three
 *     fields here are what actually reaches the page.
 *   · `page.title` already ends in "| SAP Qualified Partner-Packaged Solution" and the
 *     route appends " | Infinus" on top, which the root template then extends again. The
 *     resulting doubled suffix is pre-existing and out of scope here.
 */

import type { ProjectPulseDictionary } from '../dictionary'

export const projectPulse: ProjectPulseDictionary = {
  page: {
    title: 'ProjectPulse | SAP Qualified Partner-Packaged Solution',
    description:
      'ProjectPulse is a SAP Qualified Partner-Packaged Solution (QPPS) for Professional Services firms. An ERP-based solution that connects service delivery, resource planning, invoice readiness, profitability, and cash visibility in one end-to-end flow.',
    url: 'https://www.infinus.co/projectpulse',
    slug: '/projectpulse',
  },

  hero: {
    backgroundAlt: 'ProjectPulse Background',
    badgeAlt: 'SAP Qualified Partner-Packaged Solution',
    title: 'ProjectPulse',
    subtitle: 'Project-to-Profit for Professional Services',
    description:
      'ProjectPulse is an SAP Qualified Partner Packaged Solution built for professional services companies that want full control over delivery, margins, and cash flow.',
    valueHighlights: [
      'Structured delivery and staffing discipline',
      'Invoice readiness and billing blockers visible early',
      'Real-time margin and cash visibility by project and customer',
    ],
    ctaDiscovery: 'Book a 60-min discovery call',
    ctaBrochure: 'Download brochure',
  },

  industries: [
    'Business Consulting & Advisory',
    'IT Services',
    'Software Development',
    'Outsourcing & Managed Services',
    'Creative & Digital Services',
    'Architecture & Design Services',
    'Engineering Services',
    'Legal Services',
  ],

  problem: {
    title: 'The challenge',
    description:
      'When projects, timesheets, costs, and billing live in different tools, visibility comes too late.',
    description2:
      'You only see problems when margins are already gone and invoices are already delayed.',
    solution: {
      title: 'The solution',
      descriptionPrefix: 'ProjectPulse standardizes your entire ',
      descriptionStrong: 'Project-to-Profit',
      descriptionSuffix:
        ' flow in SAP Cloud ERP - from project setup and staffing to billing, profitability, and cash flow.',
      description2: 'One system. One source of truth. One end-to-end process.',
    },
  },

  valueProposition: {
    kicker: 'Product overview',
    title: 'Why ProjectPulse',
    items: [
      { title: 'SAP Qualified Partner Packaged Solution (QPPS)', description: '' },
      { title: 'Pre-configured Best Practices for Professional Services', description: '' },
      { title: 'Embedded Analytics and AI', description: '' },
      { title: 'Ready to deploy in 4-6 months', description: '' },
    ],
  },

  whatYouGain: {
    kicker: 'Benefits',
    title: 'What you gain',
    items: [
      {
        title: 'Structured delivery & staffing discipline',
        description: 'Right people on the right projects, with utilization visibility built in.',
      },
      {
        title: 'Invoice readiness without surprises',
        description: 'See billing blockers early, not at month-end.',
      },
      {
        title: 'Real-time margin & cash visibility',
        description: 'Profitability by project, customer, and service line.',
      },
    ],
  },

  idealFor: {
    kicker: 'Built for Professional Services',
    title: 'Ideal for',
  },

  howItWorks: {
    kicker: 'End-to-end flow',
    title: 'How it works',
    subtitle: 'Project-to-Profit in 7 steps',
    steps: ['Setup', 'Staffing', 'Execution', 'Control', 'Billing', 'Profitability', 'Close'],
    microCards: [
      {
        title: 'Staffing discipline',
        description:
          'Right people, right projects, right time, with utilization visibility built in.',
      },
      {
        title: 'Invoice readiness signals',
        description: 'See billing blockers early, no month-end surprises.',
      },
      {
        title: 'Margin and cash visibility',
        description: 'Real-time profitability by project, customer, and service line.',
      },
    ],
  },

  outcomes: {
    kicker: 'Executive outcomes',
    title: 'Outcomes by role',
    subtitle: 'What each executive gains from ProjectPulse',
    outcomesSuffix: 'Outcomes',
    roles: {
      CEO: [
        'Portfolio visibility across all projects',
        'Profitability by customer and service line',
        'Strategic decision support with real-time data',
      ],
      CFO: [
        'Faster billing cycles',
        'WIP and unbilled clarity',
        'Cash visibility and forecasting',
        'Revenue recognition compliance',
      ],
      COO: [
        'Utilization and billability transparency',
        'Early deviation detection',
        'Resource planning optimization',
      ],
    },
  },

  implementation: {
    kicker: 'Delivery plan',
    title: 'Implementation',
    subtitle: 'Typically 4-6 months from kickoff to go-live',
    phases: [
      { name: 'Discover', duration: '2-3 weeks', description: 'Requirements & fit analysis' },
      {
        name: 'Fit-to-Standard',
        duration: '4-6 weeks',
        description: 'Configuration & customization',
      },
      { name: 'Build & Integrate', duration: '6-8 weeks', description: 'Development & integration' },
      { name: 'Test & Train', duration: '3-4 weeks', description: 'UAT & user enablement' },
      { name: 'Go-live & Hypercare', duration: '2-4 weeks', description: 'Launch & stabilization' },
    ],
  },

  about: {
    title: 'About Infinus',
    description:
      'We help Professional Services companies gain the structure, control, and agility needed for the next phase of growth through SAP Cloud ERP.',
    industriesLabel: 'Industries',
  },

  cta: {
    title: 'Ready to see your Project-to-Profit flow?',
    description:
      'Book a discovery call and see how ProjectPulse brings structure, visibility, and control to your operations.',
    primaryCta: 'Book a discovery call',
    secondaryCta: 'Download brochure',
    trustNote: 'We respond within one business day',
  },

  schema: {
    breadcrumbHome: 'Home',
    breadcrumbPage: 'ProjectPulse',
    softwareReleaseNotes: 'SAP Qualified Partner-Packaged Solution for Professional Services',
    howToName: 'ProjectPulse Implementation Process',
    industriesListName: 'Industries Served by ProjectPulse',
    industriesListDescription: 'Professional services industries that benefit from ProjectPulse',
    // Order and @type are exactly what the live Article schema emits — the product entry
    // is a SoftwareApplication, the rest are Things — so both are carried explicitly
    // rather than reconstructed in the builder.
    articleAbout: [
      { name: 'SAP Cloud ERP', type: 'Thing' },
      { name: 'Professional Services', type: 'Thing' },
      { name: 'ProjectPulse', type: 'SoftwareApplication' },
      { name: 'SAP Qualified Partner-Packaged Solution', type: 'Thing' },
    ],
  },

  contactHref: '/contact',
  brochureHref: '/api/projectpulse/pdf?v=2',
  brochureFilename: 'ProjectPulse-Brochure.pdf',
}
