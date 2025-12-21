/**
 * ProjectPulse Page Configuration
 * Single source of truth for all content and metadata
 * Changes here automatically update both the component and JSON-LD schemas
 */

export const projectPulseConfig = {
  // Page metadata
  page: {
    title: "ProjectPulse | SAP Qualified Partner-Packaged Solution",
    description: "ProjectPulse is a SAP Qualified Partner-Packaged Solution (QPPS) for Professional Services firms. An ERP-based solution that connects service delivery, resource planning, invoice readiness, profitability, and cash visibility in one end-to-end flow.",
    url: "https://www.infinus.co/projectpulse",
    slug: "/projectpulse",
  },

  // Hero section
  hero: {
    title: "ProjectPulse",
    subtitle: "Project-to-Profit for Professional Services",
    description: "An ERP-based solution that connects service delivery, resource planning, invoice readiness, profitability, and cash visibility in one end-to-end flow, supported by embedded analytics, AI, and integrations with your existing tools.",
    valueHighlights: [
      "Structured delivery and staffing discipline",
      "Invoice readiness and billing blockers visible early",
      "Real-time margin and cash visibility by project and customer",
    ],
  },

  // Industries
  industries: [
    "Consulting & Advisory",
    "IT Services",
    "Systems Integration",
    "Software Development",
    "Outsourcing & Nearshoring",
    "Creative & Digital Agencies",
    "Architecture & Design",
    "Engineering",
    "Legal",
  ],

  // Problem section
  problem: {
    title: "A common challenge",
    description: "When execution, timesheets, costs, and billing are spread across tools, margin and cash visibility arrives late, often after the damage is done.",
    symptoms: [
      "Plan vs. actual becomes clear only at month-end",
      "Billing delays due to missing approvals and unclear invoice readiness",
      "Multiple sources of truth across PM, timesheets, spreadsheets, accounting",
      "Limited WIP and profitability visibility by project and customer",
    ],
    outcome: "ProjectPulse standardizes the Project-to-Profit flow so you see risk early, not after month-end.",
  },

  // What ProjectPulse is
  valueProposition: {
    title: "What ProjectPulse is",
    subtitle: "From project setup to invoice readiness, profitability, and close in one disciplined flow.",
    items: [
      {
        title: "What it is",
        description: "SAP Qualified Partner Packaged Solution (QPPS), an ERP-based platform designed for project-based service organizations.",
      },
      {
        title: "What it standardizes",
        description: "The complete Project-to-Profit flow from project setup and staffing to execution, billing, profitability, and close.",
      },
      {
        title: "What you get",
        description: "Curated analytics, pre-built integration patterns, and embedded AI, ready to deploy in 4-6 months.",
      },
    ],
  },

  // How it works
  howItWorks: {
    title: "How it works",
    subtitle: "Project-to-Profit in 7 steps",
    steps: [
      { name: "Setup", number: 1 },
      { name: "Staffing", number: 2 },
      { name: "Execution", number: 3 },
      { name: "Control", number: 4 },
      { name: "Billing", number: 5 },
      { name: "Profitability", number: 6 },
      { name: "Close", number: 7 },
    ],
    microCards: [
      {
        title: "Staffing discipline",
        description: "Right people, right projects, right time, with utilization visibility built in.",
      },
      {
        title: "Invoice readiness signals",
        description: "See billing blockers early, no month-end surprises.",
      },
      {
        title: "Margin and cash visibility",
        description: "Real-time profitability by project, customer, and service line.",
      },
    ],
  },

  // Outcomes by role
  outcomes: {
    title: "Outcomes by role",
    subtitle: "What each executive gains from ProjectPulse",
    roles: {
      CEO: [
        "Portfolio visibility across all projects",
        "Profitability by customer and service line",
        "Strategic decision support with real-time data",
      ],
      CFO: [
        "Faster billing cycles",
        "WIP and unbilled clarity",
        "Cash visibility and forecasting",
        "Revenue recognition compliance",
      ],
      COO: [
        "Utilization and billability transparency",
        "Early deviation detection",
        "Resource planning optimization",
      ],
    },
  },

  // Implementation
  implementation: {
    title: "Implementation",
    subtitle: "Typically 4-6 months from kickoff to go-live",
    phases: [
      { name: "Discover", duration: "2-3 weeks", description: "Requirements & fit analysis" },
      { name: "Fit-to-Standard", duration: "4-6 weeks", description: "Configuration & customization" },
      { name: "Build & Integrate", duration: "6-8 weeks", description: "Development & integration" },
      { name: "Test & Train", duration: "3-4 weeks", description: "UAT & user enablement" },
      { name: "Go-live & Hypercare", duration: "2-4 weeks", description: "Launch & stabilization" },
    ],
  },

  // About Infinus
  about: {
    title: "About Infinus",
    description: "We help Professional Services companies gain the structure, control, and agility needed for the next phase of growth through SAP Cloud ERP.",
  },

  // CTA
  cta: {
    title: "Ready to see your Project-to-Profit flow?",
    description: "Book a discovery call and see how ProjectPulse can bring structure, visibility, and control to your professional services operations.",
    primaryCta: "Book a discovery call",
    secondaryCta: "Download brochure",
    trustNote: "We respond within one business day",
  },
};

