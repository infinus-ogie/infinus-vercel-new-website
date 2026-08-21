/**
 * English GROW / Professional Services copy — the four new English counterparts.
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  DRAFT — OWNER/DEJAN REVIEW REQUIRED. Not approved. Do not mark approved.       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ── Direction of translation ────────────────────────────────────────────────────
 * This is the ONLY namespace in the project translated SERBIAN -> ENGLISH. Everywhere else
 * the English is the source. content/sr/growth.ts is the approved source here, and it was
 * not touched: the four historical Serbian pages predate the bilingual rollout and their
 * copy is what the business already published.
 *
 * ── Principles applied ─────────────────────────────────────────────────────────
 * Meaning, hierarchy and every fact preserved. No claim, number, percentage, source,
 * certification or CTA was added, removed or strengthened. Where the Serbian sentence is
 * long and clause-heavy, the English is restructured so it reads as English rather than as
 * transposed Serbian — but the content of each sentence is the same content.
 *
 * ── Kept in English because they already were ───────────────────────────────────
 * SAP product and programme names (SAP Cloud ERP, SAP Business AI, Joule, SAP DRC/eDocument,
 * SAP Best Practices, GROW with SAP), finance and process acronyms (DSO, DPO, DIO, AP/AR,
 * IFRS 15/16, TCO, OPEX, CapEx, M&A, ROI, KPI, SSO, ISO, SOC, O2C, P2P, XaaS, ERP),
 * "single source of truth", "audit readiness", "audit trail", "rolling forecast", "what-if",
 * "time-to-cash", "revenue assurance", "key-person risk", "Group Reporting",
 * "multi-company/multi-country", "role-based access", "best practice", "value chain",
 * "margin mix", "due diligence", "post-merger integration", "Oxford Economics", "TechTarget",
 * and every download title — those are the published names of third-party documents.
 *
 * ── Terminology decisions worth flagging at review ──────────────────────────────
 *   · "profesionalne usluge" -> "Professional Services" as the industry category, capitalised
 *     as SAP capitalises it. Lower-case "professional services firms" where the Serbian means
 *     the companies rather than the category.
 *   · "brzorastuće srednje kompanije" -> "fast-growing midsize companies". Not "SMB": the
 *     Serbian is specifically midmarket, and the schema's own `articleAbout` says
 *     "Midmarket growth".
 *   · "jedinstveni izvor finansijske istine" -> "a single source of financial truth", keeping
 *     the metaphor the Serbian uses rather than flattening it to "consistent data".
 *   · "Otvori" (the two role-card buttons) -> "Open". A neutral verb, matching the Serbian,
 *     rather than an invented "Learn more" or "Explore" that would read as new marketing.
 *   · "Pošaljite upit" -> "Send an inquiry". "Contact us" would be more idiomatic but is a
 *     different CTA; the Serbian is specifically about sending an inquiry.
 *   · "„ERP + Excel“ pristup" -> the "ERP + Excel" approach. Serbian low-high quotation marks
 *     become straight double quotes; the phrase is unchanged.
 *
 * ── Assets ─────────────────────────────────────────────────────────────────────
 * Every download and ZIP is a LANGUAGE-NEUTRAL or already-English document — Oxford Economics
 * research, SAP infographics, a TechTarget analysis. The English pages therefore reuse the
 * exact same files. No English-only asset was invented and no file was duplicated.
 *
 * `professionalServices.schema.schemaDownloads` uses the REAL asset paths. It briefly
 * diverged from the Serbian half, which carried historical paths pointing at a directory that
 * does not exist; that defect has since been fixed on the Serbian side too, so both locales
 * now advertise the same real files. A test resolves every one of these URLs against public/.
 */

import type { GrowthDictionary } from '../dictionary'

export const growth: GrowthDictionary = {
  shared: {
    aboutHeading: 'About Infinus',
    ctaHeading: 'Ready to talk?',
    ctaBody: 'Book a short call and see how SAP Cloud ERP can support your growth.',
    ctaButton: 'Send an inquiry',
    ctaNote: 'We respond within one business day',
    quickStartHeading: 'For a fast start (the first 90 days)',
    whyHeading: 'Why now',
    heroBadgeLabel: 'PROGRAM',
    heroBadgeText: 'GROW with SAP',
    industriesLabel: 'Industries',
    faqHeading: 'Frequently asked questions',
    // The English contact page. Its Serbian counterpart is '/sr/contact' — see
    // content/sr/growth.ts. Locale-owned, never derived from the pathname at render time.
    contactHref: '/contact',
    faqShared: [
      {
        question: 'Is SAP Cloud ERP too big for midsize, fast-growing companies with no ERP in place?',
        answer:
          'No. It is designed to go live quickly on best-practice processes and to expand later as needed.',
      },
      {
        question: 'How does SAP help with compliance and standards?',
        answer:
          'Built-in support for local standards, e-invoicing, taxes and international standards, with centralised data for faster audits.',
      },
    ],
    resourceList: {
      zipLabel: 'Download the full pack (ZIP)',
      defaultTitle: 'Materials for fast-growing companies',
      defaultDescription:
        'Download free materials explaining how finance can become a driver of growth — and see, through concrete examples, how SAP Cloud ERP supports scaling a business.',
    },
  },

  grow: {
    metadata: {
      title: 'GROW with SAP: Finance as a Growth Driver',
      description:
        'Transform the finance function so it supports fast, sustainable growth. For CFOs, finance managers, owners and CEOs of fast-growing midsize companies.',
    },
    hero: {
      title: 'GROW with SAP:',
      subtitle: 'Finance as a growth driver',
      description:
        'Transform the finance function so it supports fast, sustainable growth. For CFOs, finance managers, owners and CEOs of fast-growing midsize companies running today with no ERP, or on legacy systems.',
      ctaText: 'Download the materials',
    },
    whyBody:
      'Finance is no longer just about the numbers. CFOs and finance managers are taking on a decisive role in technology, security, ESG requirements and compliance. The problem? Manual, disconnected processes and legacy systems cannot keep pace with growth - they limit accuracy, the speed of decision-making and customer satisfaction.',
    stats: [
      {
        value: '2',
        suffix: ' in 3',
        label: 'CFOs say their current systems cannot scale as the business grows.',
      },
      {
        value: '70',
        suffix: '%+',
        label: 'of CFOs name global accounting standards, data security and compliance as their biggest challenges.',
      },
      {
        value: '81',
        suffix: '%',
        label: 'of finance leaders believe artificial intelligence and Cloud ERP will have a positive impact on strategy and corporate finance.',
      },
    ],
    sourceLabel: 'Source:',
    sourceText: 'Oxford Economics (CFO Insights), 2024',
    sourceHref: 'https://www.oxfordeconomics.com/resource/cfo-insights/',
    benefitsHeadingLine1: 'How SAP Cloud ERP helps',
    benefitsHeadingLine2: 'your business grow',
    valueCards: [
      {
        title: 'Simplify finance operations',
        description:
          'Automate period-close processes, accounts receivable and payable, consolidation and reporting.',
      },
      {
        title: 'Accelerate growth',
        description:
          'Use industry-specific best practice templates, support multiple entities, currencies and languages, and enter new markets faster.',
      },
      {
        title: 'Set your business up for success',
        description:
          'Establish a single source of financial truth, accurate and timely insight, and support for every regulatory requirement.',
      },
      {
        title: 'Prepare for what comes next',
        description:
          'Integrate finance, HR and other functions, supported by AI and advanced analytics for better decision-making.',
      },
    ],
    zipUrl: '/downloads/CFO_pack.zip',
    downloads: [
      {
        id: 'cfo-insights',
        title: 'Oxford Economics report: CFO Insights',
        description:
          'What finance leaders are planning and where the obstacles are: scaling, compliance and the role of AI and Cloud ERP.',
        label: 'Research',
        url: '/downloads/CFO_Insights_OxfordEconomics.pdf',
        analyticsId: 'CFO_Insights_OxfordEconomics',
      },
      {
        id: 'finance-checklist',
        title: 'Checklist for CFOs and finance managers',
        description:
          'The key questions when selecting an ERP solution - how to simplify the work, accelerate growth and ensure compliance.',
        label: 'Checklist',
        url: '/downloads/Finance_Checklist.pdf',
        analyticsId: 'Finance_Checklist',
      },
      {
        id: 'finance-insights',
        title: 'Infographic: 3 insights on finance and growth',
        description:
          'Quick insights into the processes that slow finance down, and how Cloud ERP helps with scaling.',
        label: 'Infographic',
        url: '/downloads/Finance_3_Insights.pdf',
        analyticsId: 'Finance_3_Insights',
      },
    ],
    focusHeading: 'Focused perspectives',
    focusBody: 'Deeper insight for different roles in the organisation',
    focusCards: [
      {
        title: 'SAP for CFOs',
        body: '10 long-term advantages from a CFO perspective',
        cta: 'Open',
        ariaLabel: 'Open the SAP for CFOs page',
      },
      {
        title: 'SAP for CEOs',
        body: '12 long-term advantages from a CEO perspective',
        cta: 'Open',
        ariaLabel: 'Open the SAP for CEOs page',
      },
    ],
    aboutBody:
      'Infinus d.o.o. is an SAP Gold Partner with more than 30 certified SAP consultants and numerous regional and international references. Our focus is helping fast-growing companies use SAP Cloud ERP to gain the structure, control and agility they need for their next phase of growth.',
    faqExtra: {
      question: 'What is the role of AI in finance?',
      answer: 'AI automates routine tasks and delivers insights faster, so teams can make better decisions sooner.',
    },
    schema: {
      articleAbout: ['SAP Cloud ERP', 'Finance transformation', 'Midmarket growth'],
      downloadsListName: 'GROW Resources and Downloads',
      downloadsListDescription: 'Resources and downloads for GROW with SAP finance transformation',
      schemaDownloadNames: [
        'Oxford Economics report: CFO Insights',
        'Checklist for CFOs and finance managers',
        'Infographic: 3 insights on finance and growth',
      ],
    },
  },

  cfo: {
    metadata: {
      title: 'SAP for CFOs | Infinus',
      description:
        'SAP Cloud ERP + Business AI — 10 long-term advantages from a CFO perspective, compared with the traditional "ERP + Excel" approach.',
      ogImageAlt: 'SAP for CFOs',
    },
    hero: {
      title: 'SAP Cloud ERP + Business AI',
      description:
        '10 long-term advantages from a CFO perspective, compared with the traditional "ERP + Excel" approach',
      ctaText: 'See the advantages',
    },
    timelineHeading: 'Key advantages from a CFO perspective',
    timelineDescription: '10 reasons SAP Cloud ERP + Business AI outperforms "ERP + Excel"',
    timeline: [
      {
        title: '1) A single source of truth',
        body: 'Finance, sales, procurement, logistics and operations integrated - no spreadsheet islands, no duplicate entry, no competing versions of the same figure.',
      },
      {
        title: '2) Faster, more reliable monthly close',
        body: 'Automated postings, less manual work, traceable adjustments and clear controls.',
      },
      {
        title: '3) Real-time profitability and cash flow',
        body: 'Profitability by product, customer and channel, plus a daily view of DSO/DPO and liquidity needs.',
      },
      {
        title: '4) Compliance and audit readiness',
        body: 'Support for e-Faktura and eOtpremnica (SAP DRC/eDocument), IFRS 15/16, and a complete audit trail.',
      },
      {
        title: '5) Automated AP/AR and bank processing',
        body: 'Automatic statement reconciliation, overdue monitoring, fewer errors and faster collection.',
      },
      {
        title: '6) Rolling forecast and "what-if" scenarios',
        body: 'Planning connected to operational data, enabling faster adjustments to budgets and investments.',
      },
      {
        title: '7) Embedded analytics and Business AI (Joule)',
        body: 'Natural-language queries, predictive analytics, anomaly detection and task automation.',
      },
      {
        title: '8) Lower TCO and predictable OPEX',
        body: 'No on-premise servers and no major version upgrade projects - updates happen automatically in the cloud.',
      },
      {
        title: '9) Security, availability and access control',
        body: 'Role-based access, encryption, SSO and high availability, with ISO and SOC certifications.',
      },
      {
        title: '10) Ready for growth and M&A',
        body: 'Multi-company/multi-country, consolidation and Group Reporting out of the box.',
      },
    ],
    quickStart: [
      { title: 'Faster monthly close', detail: '−20% to −30%' },
      { title: 'Daily cash flow forecast', detail: 'straight from the system' },
      { title: 'Profitability by product and channel', detail: 'in real time' },
    ],
    aboutBody:
      'Infinus d.o.o. is an SAP Gold Partner with more than 30 certified SAP consultants and numerous regional and international references. Our focus is helping fast-growing companies use SAP Cloud ERP to gain the structure, control and agility they need for their next phase of growth.',
    faqExtra: {
      question: 'What is the role of AI in finance?',
      answer: 'AI automates routine tasks and delivers insights faster, so teams can make better decisions sooner.',
    },
    schema: {
      pageName: 'SAP for CFOs',
      articleAbout: ['SAP Cloud ERP', 'Business AI', 'CFO'],
      breadcrumbs: ['Home', 'GROW', 'SAP for CFOs'],
    },
  },

  ceo: {
    metadata: {
      title: 'SAP for CEOs | Infinus',
      description:
        'SAP Cloud ERP + Business AI from a CEO perspective — how the leader of a fast-growing company gains a single source of truth, faster decisions and readiness for growth.',
      ogImageAlt: 'SAP for CEOs',
    },
    hero: {
      title: 'SAP Cloud ERP + Business AI',
      description:
        '12 long-term advantages from a CEO perspective, compared with the traditional "ERP + Excel" approach',
      ctaText: 'See the advantages',
    },
    timelineHeading: 'Key advantages from a CEO perspective',
    timelineDescription: '12 reasons SAP Cloud ERP + Business AI accelerates growth and reduces risk',
    timeline: [
      { title: '1) Business AI as a lever for growth', body: 'Faster analysis, insights and decision-making, without waiting for reports.' },
      { title: '2) End-to-end coverage of every process', body: 'One integrated system for the entire value chain.' },
      {
        title: '3) Fast, reliable insight into every part of the business',
        body: 'Profitability, cash flow, margin mix, risk.',
      },
      {
        title: '4) Rolling forecast and what-if scenarios',
        body: 'Predictable growth and more confident investment decisions (CapEx, M&A).',
      },
      {
        title: '5) Optimised operations with SAP Best Practices',
        body: 'Standardised O2C/P2P, lower operational risk, greater efficiency.',
      },
      {
        title: '6) Scaling and M&A readiness',
        body: 'Multi-company/multi-country, fast post-merger integration and consolidation.',
      },
      {
        title: '7) Security and business continuity',
        body: 'Reliable operation without downtime, data protection and controlled access; lower operational risk.',
      },
      {
        title: '8) Faster time-to-cash and cash release',
        body: 'Shorter DSO/DIO/DPO, lower working capital, stronger liquidity.',
      },
      {
        title: '9) More efficient capital allocation',
        body: 'Clear ROI by segment; winding down unprofitable initiatives and investing in the winners.',
      },
      {
        title: '10) Revenue assurance (no revenue leakage)',
        body: 'Tighter control of discounts and rebates, with accurate invoicing and less margin erosion.',
      },
      {
        title: '11) A stronger position with banks and investors',
        body: 'Transparent KPIs and reliable reporting speed up due diligence and improve financing terms.',
      },
      {
        title: '12) Lower key-person risk',
        body: 'Standardisation and automation reduce dependence on individuals and help ensure continuity.',
      },
    ],
    quickStart: [
      { title: 'Faster decisions with AI', detail: 'natural-language queries' },
      { title: 'Predictable growth', detail: 'rolling forecast and scenarios' },
      { title: 'Better cash flow', detail: 'shorter DSO/DIO/DPO' },
    ],
    aboutBody:
      'Infinus d.o.o. is an SAP Gold Partner with more than 30 certified SAP consultants and numerous regional and international references. Our focus is helping fast-growing companies use SAP Cloud ERP to gain the structure, control and agility they need for their next phase of growth.',
    faqExtra: {
      question: 'What is the role of AI in business?',
      answer: 'AI automates routine tasks and delivers insights faster, so teams can make better decisions sooner.',
    },
    schema: {
      pageName: 'SAP for CEOs',
      articleAbout: ['SAP Cloud ERP', 'Business AI', 'CEO'],
      breadcrumbs: ['Home', 'GROW', 'SAP for CEOs'],
    },
  },

  professionalServices: {
    metadata: {
      title: 'GROW with SAP for Professional Services | Infinus',
      description:
        'An ERP solution for growth, agility and profitability in professional services - download the materials and book a consultation.',
      ogImageAlt: 'GROW with SAP for Professional Services',
    },
    hero: {
      title: 'SAP Cloud ERP for Professional Services companies',
      description:
        'Manage projects, resources, processes and profitability with a solution that understands your business. An efficient, scalable and agile ERP for firms that sell knowledge, time and services.',
      ctaText: 'Download the materials',
    },
    whyBody:
      'Professional services firms are under pressure: outstanding client experience, attracting and retaining talent, and rapid technological change. How do you align people and processes in one flexible system that enables profitable, sustainable growth?',
    stats: [
      {
        value: '85',
        suffix: '%',
        label: 'of professional services firms are seeing revenue growth, but fewer than 70% are also seeing profitability growth',
      },
      {
        value: '40',
        suffix: '%',
        label: 'of leaders see innovation and new business models as critical, but point to barriers to scaling and to legacy systems',
      },
      {
        value: '78',
        suffix: '%',
        label: 'of companies already use Cloud ERP to improve agility, optimise processes and deliver better client experiences',
      },
      {
        value: '53',
        suffix: '%',
        label: 'plan to adopt AI within the next 12 months for greater efficiency and productivity',
      },
    ],
    sourceLabel: 'Source:',
    sourceText: 'SAP and Oxford Economics research, 2024',
    sourceHref: 'https://www.oxfordeconomics.com/resource/professional-services-research/',
    benefitsHeadingLine1: 'How SAP Cloud ERP helps',
    benefitsHeadingLine2: 'services companies',
    valueCards: [
      {
        title: 'Connect people and processes',
        description: 'Match talent to project needs with digital tools, AI and automation.',
      },
      {
        title: 'Accelerate service delivery',
        description:
          'Shorten project setup time, improve the accuracy of estimates and strengthen profitability tracking.',
      },
      {
        title: 'Open new revenue streams',
        description:
          'Create and monetise new business models, from XaaS and subscriptions to bundled services and digital solutions.',
      },
      {
        title: 'Build a competitive advantage',
        description:
          'Get real-time insight into project margins, resource utilisation and KPIs so you can decide faster and with more confidence.',
      },
    ],
    zipUrl: '/growth-professional-services-materials/Professional_Services_pack.zip',
    downloadsTitle: 'Materials for professional services',
    downloadsDescription:
      'Access our collection of resources, research and guides to help you grow a professional services business with SAP solutions.',
    downloads: [
      {
        id: 'proserv-automation',
        title: 'Staying Ahead: How Professional Services firms use automation to become agile',
        description:
          'Research on how professional services firms use automation to become agile and grow profitability.',
        label: 'Research',
        url: '/growth-professional-services-materials/34388_Oxford_ProServPartner_91961.pdf',
        analyticsId: 'Oxford_ProServPartner',
      },
      {
        id: 'service-innovation',
        title: 'Rethinking Service Innovation: How business model transformation drives growth',
        description:
          'An analysis of business model transformation in professional services and its impact on company growth.',
        label: 'Analysis',
        url: '/growth-professional-services-materials/34390_Oxford_ServInnovPartner_91960.pdf',
        analyticsId: 'Oxford_ServInnovPartner',
      },
      {
        id: 'xaas-infographic',
        title: 'XaaS: How midsize organizations are innovating services (Infographic)',
        description: 'A visual overview of how midsize companies are innovating services through XaaS business models.',
        label: 'Infographic',
        url: '/growth-professional-services-materials/35353_ServiceInnovationPartnerIG_91829.pdf',
        analyticsId: 'ServiceInnovPartnerIG',
      },
      {
        id: 'xaas-techtarget',
        title: 'How can the XaaS business model drive innovative growth… (TechTarget)',
        description: 'A technical analysis of the XaaS business model and its potential for innovative company growth.',
        label: 'Technical Analysis',
        url: '/growth-professional-services-materials/Techtarget-How can the XaaS business model drive innovative growth for your services, software or digital content bu.pdf',
        analyticsId: 'Techtarget_XaaS',
      },
    ],
    aboutBody:
      'Infinus d.o.o. is an SAP Gold Partner with more than 30 certified SAP consultants and numerous regional and international references. Our focus is helping professional services companies use SAP Cloud ERP to gain the structure, control and agility they need for their next phase of growth.',
    faqs: [
      {
        question: 'Is SAP Cloud ERP too big for professional services companies?',
        answer:
          'No. It is designed to go live quickly on best-practice processes and to expand later as needed. It suits professional services particularly well, because it allows flexibility in managing projects and resources.',
      },
      {
        question: 'How does SAP help with scaling and agility in professional services?',
        answer:
          'SAP Cloud ERP centralises the management of projects, resources and finance, enabling faster scaling and greater agility in responding to market changes.',
      },
      {
        question: 'What is the role of AI in professional services?',
        answer:
          'AI automates routine tasks, improves resource allocation and enables better forecasting of client needs, helping improve profitability and service quality.',
      },
    ],
    schema: {
      articleAbout: ['SAP Cloud ERP', 'Professional Services', 'Business growth'],
      downloadsListName: 'Professional Services Resources and Downloads',
      downloadsListDescription: 'Resources and downloads for GROW with SAP professional services',
      // The REAL asset paths, matching the Serbian half. Both were briefly out of step: the
      // Serbian schema pointed at a directory that does not exist. See content/sr/growth.ts.
      schemaDownloads: [
        {
          name: 'Staying Ahead: How Professional Services firms use automation to become agile',
          url: '/growth-professional-services-materials/34388_Oxford_ProServPartner_91961.pdf',
        },
        {
          name: 'Rethinking Service Innovation: How business model transformation drives growth',
          url: '/growth-professional-services-materials/34390_Oxford_ServInnovPartner_91960.pdf',
        },
        {
          name: 'XaaS: How midsize organizations are innovating services (Infographic)',
          url: '/growth-professional-services-materials/35353_ServiceInnovationPartnerIG_91829.pdf',
        },
        {
          name: 'How can the XaaS business model drive innovative growth… (TechTarget)',
          url: '/growth-professional-services-materials/Techtarget-How can the XaaS business model drive innovative growth for your services, software or digital content bu.pdf',
        },
      ],
    },
  },
}
