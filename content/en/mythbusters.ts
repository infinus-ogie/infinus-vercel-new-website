/**
 * English SAP MythBusting landing-page copy.
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  CLIENT-SUPPLIED SOURCE OF TRUTH. Transcribed from "eng verzija.docx".         ║
 * ║  Do NOT rewrite, improve or paraphrase without separate approval.              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * This namespace breaks the site's usual rule that English is the source and Serbian is
 * translated from it. The client wrote BOTH documents, and the Serbian one was later
 * REPLACED by a different document with a different page structure. So
 * content/sr/mythbusters.ts is not a translation of this file, the two are allowed to
 * diverge, and neither may be edited to match the other.
 *
 * Nothing here is paraphrased. The English page and its form are unchanged by the Serbian
 * rework: the client sent no new English source, so the old one still governs.
 *
 * ── Structure notes ─────────────────────────────────────────────────────────────
 * The source's [WHY DOWNLOAD THE E-BOOK] section opens with "FROM ASSUMPTIONS TO BETTER
 * DECISIONS" and a paragraph, then lists four titled blocks. That first block reads as the
 * section's lead rather than a fifth peer, so it is `why.introTitle` / `why.introBody` and
 * the remaining four are `why.items`.
 *
 * The section markers in the DOCX ([HERO SECTION], [TRUST BAR], …) are editorial labels, not
 * visible copy, and are not carried across.
 *
 * ── One e-book, in English, for both landing pages ──────────────────────────────
 * The site is bilingual; the ASSET is not, by design. There is one canonical English PDF
 * and both locales link to it. On this page that needs no caveat at all, but the note is
 * stated anyway because the source states it — and its Serbian counterpart does need it.
 */

import type { MythBustersDictionary } from '../dictionary'

export const mythBusters: MythBustersDictionary = {
  metadata: {
    // Verbatim from the source. It already ends in "| Infinus", so the route file passes it
    // as title.absolute rather than letting the root template append a second brand.
    title: '10 Myths About SAP Cloud ERP | Free E-Book | Infinus',
    description:
      'Download the free e-book and discover the facts behind 10 common myths about SAP Cloud ERP costs, implementation, scalability, and business value.',
  },

  layout: {
    variant: 'en-overview',

    hero: {
      eyebrow: 'Free E-Book | PDF | 15-Minute Read',
      titleLine1: '10 Myths About SAP Cloud ERP.',
      titleLine2: 'A New Perspective on Growth.',
      lede:
        'Discover what successful companies are doing differently today and how SAP Cloud ERP supports growth without unnecessary complexity, unpredictable costs, or lengthy projects.',
      bullets: [
        'Ten common myths about SAP Cloud ERP',
        "Facts based on the solution's current capabilities",
        'Real-world examples and company results',
        'Practical insights for better ERP decisions',
      ],
      cta: 'Download the Free E-Book',
    },

    // The English source keeps the four-metric trust bar, including the 70% claim. The
    // Serbian page no longer has one — its newer source replaced it with a statement and
    // two logos — and that divergence is the client's, not a translation gap.
    trustBar: [
      'SAP Gold Partner',
      '30+ SAP Consultants',
      '30+ Satisfied Clients',
      '70% of Consultants with 10+ Years of SAP Experience',
    ],

    why: {
      introTitle: 'FROM ASSUMPTIONS TO BETTER DECISIONS',
      introBody:
        'ERP transformation decisions are often based on experiences with previous generations of business systems. This e-book explains what has changed and which facts should be considered when evaluating SAP Cloud ERP.',
      items: [
        {
          title: 'A MORE REALISTIC VIEW OF COSTS',
          body:
            'Learn how subscription-based models and a fit-to-standard approach can make costs more transparent and predictable.',
        },
        {
          title: 'FASTER, SIMPLER IMPLEMENTATION',
          body:
            'Discover how preconfigured best practices, automation, and the SAP Activate methodology accelerate the path to business value.',
        },
        {
          title: 'GROWTH WITHOUT ADDITIONAL COMPLEXITY',
          body:
            'Understand how a modular cloud architecture supports business expansion, entry into new markets, and increasing operational scale.',
        },
        {
          title: 'MEASURABLE BUSINESS VALUE',
          body:
            'See how companies achieve measurable results through automation, analytics, and integrated business processes.',
        },
      ],
    },

    myths: {
      heading: 'Which Myths Are We Busting?',
      items: [
        'SAP is too expensive.',
        'SAP is designed only for large and multinational companies.',
        'Implementing an SAP solution takes too long and is too complicated.',
        'SAP is difficult to understand and adapt.',
        'Integration with existing systems requires extensive customization.',
        'SAP is not designed for growing companies.',
        'SAP is not a good fit for our industry.',
        'There is not enough evidence of return on investment.',
        'SAP is advanced, but it does not deliver enough business value.',
        'Using SAP successfully requires a large in-house SAP team.',
      ],
      cta: 'Discover All 10 Myths',
    },

    audience: {
      heading: 'Is This E-Book for You?',
      body:
        'This e-book is designed for executives and decision-makers who are considering ERP modernization, looking for a more reliable foundation for growth, or evaluating the business case for moving to SAP Cloud ERP.',
      roles: [
        'CEOs and business owners',
        'CFOs and finance leaders',
        'CIOs and IT leaders',
        'Operations directors',
        'Digital transformation leaders',
        'Decision-makers in growing midsize companies',
      ],
    },
  },

  form: {
    heading: 'Download the Free E-Book',
    body: 'Complete the short form and get immediate access to the e-book.',
    // The English source's four fields, in its order. `key` is the API contract and is not
    // translated; only `label` is. Role is the one optional field, and the source marks it
    // optional in the label itself rather than with an asterisk.
    fields: [
      { key: 'name', label: 'Full Name', required: true, validation: 'Please enter your full name.' },
      {
        key: 'email',
        label: 'Business Email',
        required: true,
        validation: 'Enter a valid business email address.',
      },
      { key: 'company', label: 'Company', required: true, validation: 'Please enter your company.' },
      { key: 'role', label: 'Role or Job Title – optional', required: false, validation: '' },
    ],
    submit: 'Download the E-Book',
    submitting: 'Sending...',
    // Same OWNER-APPROVED correction as the Serbian side: the download is automatic now, so
    // the panel acknowledges it rather than asking for a click that already happened.
    success: {
      eyebrow: 'Thank you for your interest!',
      heading: 'Your e-book download has started.',
      body: 'The e-book should download automatically to your device.',
      downloadLabel: 'Download Again',
      downloadNote: 'If the download did not start, you can try again using the button below.',
      nextHeading: 'What happens next?',
      nextBody:
        'Whether you are still evaluating ERP options or already have concrete requirements, our SAP specialists can help.',
      expertCta: 'Talk to an SAP specialist',
      questionsHeading: 'Have questions?',
      questionsBody: 'Our team is here to help.',
      contactCta: 'Contact Us',
      contactHref: '/contact',
    },
    error: 'Something went wrong. Please try again.',
    languageNote: 'The e-book is provided in PDF format and is available in English.',
    privacy: {
      before: 'By submitting this form, you confirm that you have read our ',
      linkText: 'Privacy Policy',
      after: '. Your information will be used to deliver the e-book.',
      href: '/privacy',
    },
  },

  schema: {
    breadcrumbHome: 'Home',
    breadcrumbPage: '10 Myths About SAP Cloud ERP',
    mythListName: '10 Myths About SAP Cloud ERP',
    ebookName: '10 Myths About SAP Cloud ERP',
  },
}
