/**
 * English SAP vs Microsoft Insights article - /insights/sap-vs-microsoft.
 *
 * CLIENT-SUPPLIED SOURCE OF TRUTH, transcribed from "Infinus_SAP_vs_Microsoft_EN.docx".
 * Do NOT rewrite, improve or paraphrase without separate approval.
 *
 * Public copy starts at the document's full title. The "For Ogi" note above it, with
 * the menu, URL and button lines, is implementation guidance and is not carried across.
 *
 * ── Departures from the document, all owner-approved ────────────────────────────
 * At launch:
 *   1. The SAP Business One sentence gained its availability clause ("which is
 *      available in the cloud and on-premises").
 *   2. Every em dash became a spaced hyphen, per the copy rule in CLAUDE.md.
 * After Dejan's review of the published page:
 *   3. That sentence ("Before making a final decision, …") opens its own paragraph
 *      instead of continuing the first one.
 *   4. The partner link reads "B-ONE Solutions" instead of "B-ONE Solutions in Serbia".
 *      Its destination is unchanged.
 * Otherwise bold runs, link texts and link destinations are exactly the document's.
 *
 * ── Not from the document ───────────────────────────────────────────────────────
 * `metadata.description` is a DRAFT assembled from the document's own headings: the
 * source supplies no SEO description. `metadata.title` is the h1. `schema` feeds JSON-LD
 * only and is never rendered.
 */

import type { SapVsMicrosoftDictionary } from '../dictionary'

export const sapVsMicrosoft: SapVsMicrosoftDictionary = {
  metadata: {
    title: 'SAP ERP vs Microsoft Dynamics 365 Business Central',
    description:
      'Thinking about moving from Microsoft Navision? See where SAP Cloud ERP goes further in AI, processes, finance, group operations and manufacturing.',
  },

  schema: {
    breadcrumbHome: 'Home',
    breadcrumbPage: 'SAP vs Microsoft',
  },

  title: 'SAP ERP vs Microsoft Dynamics 365 Business Central',

  intro: {
    heading: 'Thinking about moving from Microsoft Navision?',
    paragraphs: [
      [
        { kind: 'text', text: 'If you already use Navision, ' },
        { kind: 'strong', text: 'Microsoft Dynamics 365 Business Central' },
        { kind: 'text', text: ' is a natural option to consider. It is Microsoft’s ERP solution for small and midsize businesses.' },
      ],
      [
        { kind: 'text', text: 'Before making a final decision, it is also worth looking at ' },
        { kind: 'strong', text: 'SAP Business One' },
        { kind: 'text', text: ', SAP’s ERP solution for the same market segment, which is available in the cloud and on-premises. ' },
        { kind: 'link', text: 'SAP Business One', href: 'https://www.sap.com/products/erp/business-one.html' },
        { kind: 'text', text: ' · ' },
        { kind: 'link', text: 'B-ONE Solutions', href: 'https://b-one.rs/' },
      ],
      [
        { kind: 'strong', text: 'What has changed in your business since you introduced Navision?' },
        { kind: 'text', text: ' If your manufacturing is now more complex, you are expanding your retail network, or you operate across multiple lines of business, markets or legal entities, see how ' },
        { kind: 'strong', text: 'SAP Cloud ERP' },
        { kind: 'text', text: ', SAP’s solution for midsize and large enterprises, can help you address those challenges.' },
      ],
    ],
  },

  comparison: {
    heading: 'Where SAP Cloud ERP goes further',
    groups: [
      {
        heading: 'AI',
        items: [
          [
            { kind: 'strong', text: 'Joule Work' },
            { kind: 'text', text: ' - SAP’s vision for day-to-day work in ERP. ' },
            { kind: 'link', text: 'Watch the video', href: 'https://www.youtube.com/watch?v=hVEl-itw4fQ&list=PLRFmzdHJ8Y2A' },
          ],
        ],
      },
      {
        heading: 'Processes',
        items: [
          [
            { kind: 'strong', text: 'SAP Best Practices' },
            { kind: 'text', text: ' - preconfigured business processes based on experience from SAP implementations worldwide. Your team can review and test them, then decide which to adopt.' },
          ],
          [
            { kind: 'strong', text: 'Built-in industry expertise' },
            { kind: 'text', text: ' - industry-specific processes and capabilities informed by SAP’s experience working with leading companies around the world.' },
          ],
          [
            { kind: 'strong', text: 'Less reliance on third-party solutions' },
            { kind: 'text', text: ' - advanced capabilities are available in the standard solution or through additional SAP products. Broader SAP coverage can reduce the need for partner add-ons and complex integrations, along with the work needed to maintain them.' },
          ],
        ],
      },
      {
        heading: 'Finance and group operations',
        items: [
          [
            { kind: 'strong', text: 'Multiple legal entities and plants' },
            { kind: 'text', text: ' - shared processes across the group, with separate books for each legal entity.' },
          ],
          [
            { kind: 'strong', text: 'Intercompany sales' },
            { kind: 'text', text: ' - one legal entity takes the order, another fulfils it, and sales and intercompany documents remain linked.' },
          ],
          [
            { kind: 'strong', text: 'Group financial close' },
            { kind: 'text', text: ' - automatic posting of intercompany eliminations based on configured rules.' },
          ],
          [
            { kind: 'strong', text: 'Treasury' },
            { kind: 'text', text: ' - a central view of cash flows and liquidity, with tools to manage financial transactions and foreign exchange risk.' },
          ],
          [
            { kind: 'strong', text: 'Contract and Lease Management (IFRS 16)' },
            { kind: 'text', text: ' - manage lease agreements and calculate right-of-use assets and lease liabilities.' },
          ],
          [
            { kind: 'strong', text: 'Profitability analysis' },
            { kind: 'text', text: ' - review margins by product, customer or sales channel and see the components of cost of goods sold.' },
          ],
          [
            { kind: 'strong', text: 'Customer credit risk' },
            { kind: 'text', text: ' - automated checks can block a sales order or delivery based on configured rules.' },
          ],
        ],
      },
      {
        heading: 'Manufacturing and operations',
        items: [
          [
            { kind: 'strong', text: 'Capacity simulation' },
            { kind: 'text', text: ' - assess how changes in demand or a decision to buy a component affect production workloads.' },
          ],
          [
            { kind: 'strong', text: 'Traceability from raw materials to finished goods' },
            { kind: 'text', text: ' - trace where a batch came from and how it was used across multiple production levels.' },
          ],
          [
            { kind: 'strong', text: 'Product Costing' },
            { kind: 'text', text: ' - calculate work in progress and variances based on events such as material consumption or confirmation of a production operation.' },
          ],
          [
            { kind: 'strong', text: 'Replenishment of critical materials' },
            { kind: 'text', text: ' - adjust replenishment stock levels based on consumption and lead times.' },
          ],
          [
            { kind: 'strong', text: 'Product allocation during shortages' },
            { kind: 'text', text: ' - allocate available quantities by customer and time period using predefined rules.' },
          ],
          [
            { kind: 'strong', text: 'Quality inspection at goods receipt' },
            { kind: 'text', text: ' - record supplier certificates and decide which portion of the inspected quantity can be used.' },
          ],
          [
            { kind: 'strong', text: 'Preventive equipment maintenance' },
            { kind: 'text', text: ' - maintenance plans, work orders and team scheduling.' },
          ],
          [
            { kind: 'strong', text: 'Central purchasing for the group' },
            { kind: 'text', text: ' - review and approve purchase requisitions from multiple connected systems in one place.' },
          ],
        ],
      },
    ],
  },

  closing: {
    heading: 'See how SAP handles one of your business processes',
    body: [
      { kind: 'text', text: 'SAP Cloud ERP provides deeper functionality for more complex operations.' },
      { kind: 'break' },
      { kind: 'text', text: 'Infinus offers competitive pricing and an efficient implementation for the scope we agree with you.' },
    ],
    cta: 'Book a demo and request a budgetary quote',
  },
}
