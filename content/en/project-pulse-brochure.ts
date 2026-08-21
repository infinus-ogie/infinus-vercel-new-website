/**
 * English ProjectPulse brochure copy — /projectpulse/brochure.
 *
 * ── Provenance: EXTRACTED, NOT WRITTEN ──────────────────────────────────────────
 * Every value is lifted VERBATIM from the JSX of
 * app/(en)/(site)/projectpulse/brochure/page.tsx at commit f143256. HTML entities in the
 * source (`&amp;`, `&ndash;`) are written here as the characters they render as, which is
 * what reaches the DOM either way.
 *
 * ── The page this describes ────────────────────────────────────────────────────
 * A dark, print-brochure-styled one-pager: ribbon, hero with a fake "Executive Command
 * Center" dashboard, challenges, value by role, key benefits, functional scope, commercial
 * model, why-Infinus, and a closing CTA. Unlike /projectpulse it has no config file — all
 * copy sat inline in the markup, which is why this file is long.
 *
 * ── Preserved deliberately ─────────────────────────────────────────────────────
 *   · The dashboard mock-up's KPI figures (DSO 42 days, utilization 82%, gross margin 31%)
 *     are ILLUSTRATIVE, not claims about a customer. They are part of the mock-up and are
 *     carried across as-is.
 *   · The two "from" prices are formatted inconsistently in the live page — "€9,000 / month"
 *     uses the symbol, "from EUR 100,000" spells the code out and repeats the word "from"
 *     that its own row label already carries. Reproduced, not fixed.
 *   · The hero paragraph and the "Why Professional Services firms need ProjectPulse"
 *     paragraph overlap: the second is the tail of the first, repeated. That is the live
 *     copy.
 *   · The final CTA's button is a plain <button> with no click handler in the live page, so
 *     it does nothing. Carried across unchanged — wiring it up is a separate decision, not
 *     a translation one.
 *   · The copyright line interpolates the CURRENT YEAR at build time, so it moves on its
 *     own; `copyrightSuffix` is only the text after the year.
 */

import type { ProjectPulseBrochureDictionary } from '../dictionary'

export const projectPulseBrochure: ProjectPulseBrochureDictionary = {
  metadata: {
    title: 'ProjectPulse Brochure – SAP Qualified Partner-Packaged Solution',
    description:
      'ProjectPulse is a SAP Qualified Partner-Packaged Solution by Infinus for Professional Services firms, unifying finance, projects, sales, procurement, HR and analytics on a single intelligent cloud platform.',
  },

  ribbon: {
    left: 'Infinus · SAP Gold Partner',
    right: 'ProjectPulse · SAP Qualified Partner-Packaged Solution',
  },

  hero: {
    kicker: 'For Professional Services firms',
    title: 'ProjectPulse: Run projects, people, and profit on one intelligent cloud platform.',
    body: 'ProjectPulse is a SAP Qualified Partner-Packaged Solution by Infinus designed for Professional Services companies. It unifies finance, project & resource management, sales, procurement and core HR – augmented by SAP embedded analytics and SAP Business AI – to automate the end-to-end flow from opportunity/quote to invoice and period-end close.',
    pills: [
      '3–6 month implementation',
      '500+ prebuilt KPIs & dashboards',
      'SAP Business AI & embedded analytics',
    ],
  },

  dashboard: {
    title: 'Executive Command Center',
    subtitle: 'Live KPIs · AI Insights',
    portfolio: {
      title: 'Project Portfolio Health',
      body: 'Margin, WIP, and billing readiness across all active engagements.',
    },
    utilization: {
      title: 'Utilization & Capacity',
      body: 'Plan vs. actual billable hours by role, region, and skill.',
    },
    cash: {
      title: 'Cash & Working Capital',
      body: 'DSO, DPO, cash flow, and liquidity projections in one view.',
    },
    kpis: [
      { label: 'DSO', value: '42 days' },
      { label: 'Utilization', value: '82%' },
      { label: 'Gross margin', value: '31%' },
    ],
    poweredBy:
      'Powered by SAP S/4HANA Cloud, SAP SuccessFactors, SAP Integration Suite, SAP Document & Reporting Compliance, Embedded Analytics and SAP Business AI.',
  },

  challenges: {
    heading: 'Why Professional Services firms need ProjectPulse',
    intro:
      'It unifies finance, project & resource management, sales, procurement and core HR – augmented by SAP embedded analytics and SAP Business AI – to automate the end-to-end flow from opportunity/quote to invoice and period-end close.',
    items: [
      {
        kicker: 'Challenge · Projects',
        title: 'Limited real-time visibility',
        body: 'No single place to see scope, milestones, staffing, costs, and billing readiness for each engagement.',
      },
      {
        kicker: 'Challenge · Finance',
        title: 'Complex revenue & cash',
        body: 'Revenue recognition, WIP and margins scattered across spreadsheets and tools – close is slow and reactive.',
      },
      {
        kicker: 'Challenge · People',
        title: 'Underutilized or overloaded teams',
        body: 'No shared view of availability, skills, and demand – making it hard to optimize utilization and avoid burnout.',
      },
    ],
  },

  byRole: {
    heading: 'Business value by role',
    intro:
      'Executives gain real-time visibility into profitability, cash, and utilization, while delivery teams get control of scope, milestones, staffing and billing readiness.',
    roles: [
      {
        kicker: 'CEO',
        title: 'One cloud backbone for growth',
        bullets: [
          'Unified platform for finance, projects, HR, sales, and procurement.',
          'Real-time profitability by customer, region, and service line.',
          'Standardized operating model for scale-up and M&A.',
        ],
      },
      {
        kicker: 'CFO',
        title: 'Continuous close & predictable margins',
        bullets: [
          'Event-based revenue recognition for fixed price and T&M projects.',
          'Real-time WIP, DSO, cash, and margin analytics.',
          'IFRS-compliant accounting, consolidation, and group reporting.',
        ],
      },
      {
        kicker: 'COO / Delivery',
        title: 'Real-time control of projects & resources',
        bullets: [
          'Scope, milestones, staffing, and billing readiness in one place.',
          'Utilization and capacity planning by role, region, and skill.',
          'Less manual reconciliation across project tools and spreadsheets.',
        ],
      },
    ],
  },

  benefits: {
    heading: 'Key benefits at a glance',
    items: [
      'Real-time visibility into project performance and profitability.',
      'End-to-end automation from opportunity / quote to invoice and close.',
      'Embedded SAP analytics and 500+ prebuilt KPIs, dashboards and overview pages.',
      'Unified project, finance, sales, procurement and core HR in one cloud platform.',
      'AI-augmented decision making with SAP Business AI and Joule Copilot.',
      'Mobile-enabled access for project teams and executives on the go.',
    ],
  },

  scope: {
    heading: 'Functional scope',
    intro:
      'The base scope covers Finance (AR/AP, closing, treasury, profitability, consolidation), Customer Projects & Billing, Sourcing & Procurement, Sales of Services, SuccessFactors Employee Central, Integration Suite, DRC localizations, and embedded analytics.',
    groups: [
      {
        title: 'Finance',
        bullets: [
          'Accounts Receivable / Payable and bank reconciliation.',
          'Financial closing, consolidation and group reporting.',
          'Treasury and cash management.',
          'Profitability and cost analysis across dimensions.',
          'Event-based revenue recognition & WIP tracking.',
        ],
      },
      {
        title: 'Customer Projects & Billing',
        bullets: [
          'Project structuring, planning and control.',
          'Milestones, budgets, actuals and change orders.',
          'Resource management and staffing by skills.',
          'Time and expense capture and approvals.',
          'Fixed price and T&M billing scenarios.',
        ],
      },
      {
        title: 'Sourcing, Procurement & Sales',
        bullets: [
          'Service procurement and subcontracting.',
          'Purchase requisitions and purchase orders.',
          'Sales of services, quotes and orders.',
          'Margin and profitability by customer & engagement.',
        ],
      },
      {
        title: 'Core HR & Analytics',
        bullets: [
          'Employee master data and org structure.',
          'Work schedules, time off and basic time recording.',
          'Embedded analytics and role-based overview pages.',
          'SAP Business AI Joule Copilot on top of operational data.',
        ],
      },
    ],
    optional: {
      title: 'Optional extensions',
      body: 'Optional extensions such as SAP Sales Cloud and additional SAP SuccessFactors modules (Performance & Goals, Compensation, Learning, Career & Talent, Recruiting / Onboarding) can be added as your Professional Services business scales up.',
    },
  },

  commercial: {
    heading: 'Time-to-value and commercial model',
    intro:
      'A prescriptive 3–6-month implementation accelerates time-to-value, with a clearly defined base scope and extensions.',
    rows: [
      { label: 'Project duration', value: '3–6 months' },
      { label: 'Cloud subscriptions (from)', value: '€9,000 / month' },
      { label: 'Implementation services (from)', value: 'from EUR 100,000' },
    ],
    footnote:
      'Exact scope, entities, localizations and optional extensions are confirmed during discovery and reflected in the final fixed-price proposal.',
  },

  whyInfinus: {
    kicker: 'Why Infinus',
    title: 'SAP Gold Partner for Professional Services',
    bullets: [
      'SAP Gold Partner with proven SAP Cloud ERP expertise.',
      '30+ consultants focused on Professional Services business models.',
      '20+ SAP Cloud ERP customers implemented and supported.',
      'Recognized as SAP Top Cloud Performer in the region.',
    ],
    footnote:
      'Net result: real-time projects, aligned resources, and predictable margins on a single intelligent cloud platform.',
  },

  cta: {
    kicker: 'Next step',
    heading: 'Real-time projects. Aligned resources. Predictable margins.',
    body: 'Talk to Infinus about ProjectPulse and see how a SAP Qualified Partner-Packaged Solution can modernize your Professional Services operations in months, not years.',
    button: 'Schedule a ProjectPulse exploration call',
    emailPrefix: 'Or email',
    emailAddress: 'dejan@infinus.co',
    emailSuffix: 'to request the full brochure and video.',
  },

  copyrightSuffix:
    'Infinus d.o.o. ProjectPulse is a SAP Qualified Partner-Packaged Solution for Professional Services companies.',
}
