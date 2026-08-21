/**
 * English case-study copy — all five pages.
 *
 * ── Provenance: EXTRACTED, NOT WRITTEN ──────────────────────────────────────────
 * Every value is lifted VERBATIM from the five `PAGE_CONTENT` objects and the shared
 * markup in the five app/(en)/(site)/case-study/<slug>/page.tsx files as they stood at
 * commit 2526c08. The
 * section headings and the CTA block were byte-identical across all five pages, so they
 * live once in `labels` instead of five times.
 *
 * Left exactly as-is, worth knowing:
 *   · the hero image's alt text equals the h1 on every page, so the component uses `title`
 *     for both — that is the existing behaviour, not a simplification.
 *   · `nearshoring1.technologies` contains a parenthetical list. The STRING is unchanged,
 *     but the rendering of it was corrected at owner review: the component used to split on
 *     every ", " and tore the parenthetical apart into "…modules (FI" and "SAC)".
 *     lib/case-study-technologies.ts now splits only at depth zero, so the module group
 *     renders as one pill. No value in this file changed.
 *   · pharma1 has no solution bullet list and no engagement-model section; both fields are
 *     empty and the shared component omits those sections.
 */

import type { CaseStudiesDictionary } from '../dictionary'

export const caseStudies: CaseStudiesDictionary = {
  labels: {
    clientOverview: 'Client Overview',
    challenge: 'Challenge',
    solution: 'Solution',
    engagementIncluded: 'The engagement included:',
    results: 'Results',
    engagementModel: 'Engagement Model',
    technologies: 'Technologies & Scope',
    ctaHeading: 'Interested in working with us?',
    ctaButton: 'Contact us',
    ctaNote: 'We respond within one business day',
  },
  contactHref: '/contact',

  items: {
    retail1: {
      metadataTitle: 'Retail Case Study | Infinus',
      title: 'Retail Case Study',
      badge: 'Case Study',
      clientOverview:
        'A leading European retail company with operations across multiple countries, managing complex supply chain processes and a large SAP landscape through its centralized SAP Center of Excellence (CoE).',
      challenge:
        'The client needed a reliable and scalable way to support and continuously improve its SAP environment across multiple markets. Key challenges included maintaining consistency across countries, managing frequent change requests, and ensuring stability of critical business processes such as Forecasting & Replenishment (F&R), Order-to-Cash (O2C), Procure-to-Pay (P2P), and Vendor Invoice Management (VIM).\n\nAdditionally, the internal team required experienced SAP professionals who could integrate quickly, communicate effectively in an international environment, and contribute with minimal ramp-up time.',
      solutionIntro:
        "Infinus provided long-term SAP expert support as an extension of the client's SAP Center of Excellence. Our senior consultants worked closely with internal teams, supporting daily operations, change requests, and continuous improvements across key business processes.",
      solutionItems: [
        'Functional and technical SAP support across multiple modules',
        'Continuous improvement of business processes',
        'Handling change requests and deployments',
        'Cross-country coordination and standardization efforts',
        'Close collaboration with business stakeholders and IT teams',
      ],
      results: [
        'Standardized processes across multiple European markets',
        'Faster and more efficient change deployment',
        'Improved control and visibility over complex supply chain operations',
        'Reduced operational risks and increased system stability',
        "Seamless integration with the client's internal SAP CoE",
      ],
      engagementModel:
        "Long-term nearshore collaboration with a dedicated team of senior SAP consultants, fully integrated into the client's SAP Center of Excellence.",
      technologies: 'SAP ERP, SAP IS Retail, F&R, O2C, P2P, VIM',
      structuredAbout: ['SAP', 'Retail', 'Case Study', 'Infinus'],
    },

    pharma1: {
      metadataTitle: 'Pharma Case Study 1 | Infinus',
      title: 'Pharma Case Study 1',
      badge: 'Case Study',
      clientOverview:
        'A fast-growing pharmaceutical company expanding into new markets and product lines, requiring integrated and scalable business processes aligned with strict regulatory standards.',
      challenge:
        'As the company expanded, business processes became increasingly complex. The client needed a single platform to integrate production, finance, and controlling while ensuring data reliability, full traceability, and compliance with GxP regulations.',
      solutionIntro:
        'Infinus implemented SAP Cloud ERP Private, delivering a full-scope, GxP-compliant system within 12 months. The solution integrated production planning, inventory management, finance, and controlling, while enabling real-time analytics and centralized data across the organization.',
      solutionItems: [],
      results: [
        'Improved operational efficiency across core business processes',
        'Better control of production costs and profitability',
        'Real-time visibility into financial and operational data',
        'Reliable, audit-ready system aligned with regulatory requirements',
        'Scalable digital platform supporting further business growth',
      ],
      engagementModel: '',
      technologies: 'SAP Cloud ERP (Private), FI, CO, MM, SD, PP, QM, WM',
      structuredAbout: ['SAP', 'Pharma', 'Case Study', 'Infinus'],
    },

    pharma2: {
      metadataTitle: 'Pharma Case Study 2 | Infinus',
      title: 'Pharma Case Study 2',
      badge: 'Case Study',
      clientOverview:
        'A leading pharmaceutical company operating in a highly regulated environment, relying on a complex SAP landscape to support its core business processes.',
      challenge:
        'The client required reliable, long-term SAP application support to ensure system stability, high availability, and compliance with strict regulatory standards. This included handling a high volume of incidents and complex change requests within demanding SLA requirements.',
      solutionIntro:
        'Infinus provided long-term SAP Application Management Services (AMS), covering all core modules including FI, CO, MM, SD, PP, QM, and WM. The engagement included handling incidents, service requests, and complex change requests under strict SLA conditions, ensuring continuous system stability and improvement.',
      solutionItems: [
        'End-to-end SAP application management',
        'SLA-based incident, service request, and change request handling',
        'Proactive system monitoring and optimization',
        'Functional and technical support across all modules',
        'Continuous improvement of business processes',
      ],
      results: [
        'High system availability and stability',
        'Faster incident resolution and reduced downtime',
        'Efficient handling of high-volume and complex change requests',
        'Improved efficiency of IT operations',
        'Enhanced compliance and audit readiness',
        'Long-term, reliable support for business-critical processes',
      ],
      engagementModel: 'Long-term AMS engagement with SLA-based delivery and continuous improvement.',
      technologies: 'SAP ERP, FI, CO, MM, SD, PP, QM, WM',
      structuredAbout: ['SAP', 'Pharma', 'Case Study', 'Infinus'],
    },

    nearshoring1: {
      metadataTitle: 'Nearshoring Case Study | Infinus',
      title: 'Nearshoring Case Study',
      badge: 'Case Study',
      clientOverview:
        'A leading EU-based SAP consulting company delivering complex SAP projects across multiple industries, requiring scalable and reliable delivery capacity to support growing client demand.',
      challenge:
        'With increasing project volume and tight delivery timelines, the client needed a flexible and scalable way to extend its SAP delivery capabilities. Key challenges included ensuring consistent quality, quickly onboarding skilled consultants, and seamlessly integrating external resources into ongoing projects.',
      solutionIntro:
        "Infinus acted as a strategic nearshore partner, providing experienced SAP consultants across multiple modules. Our team integrated directly with the client's delivery organization, supporting project execution, ongoing implementations, and continuous improvements.",
      solutionItems: [
        'Nearshore SAP consulting support across multiple modules',
        'Rapid onboarding of senior consultants',
        'Seamless integration with client project teams',
        'Flexible scaling of resources based on project needs',
        'Close collaboration with client stakeholders',
      ],
      results: [
        'Increased delivery capacity and project scalability',
        'Faster project execution and improved responsiveness',
        'Consistent delivery quality across multiple engagements',
        'Optimized resource utilization and cost efficiency',
        'Strong, long-term strategic partnership',
      ],
      engagementModel:
        "Long-term nearshore collaboration with a dedicated team of SAP consultants, fully integrated into the client's delivery model.",
      technologies:
        'SAP ERP, SAP S/4HANA, multiple functional and technical modules (FI, CO, MM, SD, PP, QM, EWM, ABAP, BC, SAC)',
      structuredAbout: ['SAP', 'Nearshoring', 'Case Study', 'Infinus'],
    },

    manufacturing1: {
      metadataTitle: 'Manufacturing Case Study | Infinus',
      title: 'Manufacturing Case Study',
      badge: 'Case Study',
      clientOverview:
        'A leading European manufacturer of polymer-based piping and construction solutions, headquartered in Serbia, operating across multiple international markets with complex production and supply chain processes.',
      challenge:
        'The client was running on a legacy SAP ECC system and needed to transition to S/4HANA while minimizing business disruption. Key challenges included ensuring data consistency, maintaining continuity of core operations, and modernizing the system landscape to support future growth and scalability.',
      solutionIntro:
        'Infinus executed a full ECC to S/4HANA conversion combined with migration from on-premise infrastructure to a SAP Cloud environment. The project covered all core modules including FI, CO, MM, SD, PP, and QM, ensuring a seamless transition with optimized processes and minimal downtime.',
      solutionItems: [
        'End-to-end S/4HANA system conversion',
        'Migration to SAP Cloud environment',
        'Data migration and system validation',
        'Process optimization during transition',
        'Functional and technical support across all modules',
      ],
      results: [
        'Successful conversion with no business disruption',
        'Improved system performance and stability',
        'Modernized and cloud-enabled SAP landscape',
        'Enhanced scalability and flexibility for future growth',
        'Optimized core business processes',
      ],
      engagementModel:
        'Project-based transformation with end-to-end delivery, from system conversion to cloud migration.',
      technologies: 'SAP S/4HANA, FI, CO, MM, SD, PP, QM',
      structuredAbout: ['SAP', 'Manufacturing', 'Case Study', 'Infinus'],
    },
  },
}
