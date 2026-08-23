/**
 * SEO Helper Functions
 * Generates metadata for Next.js pages
 */

import { Metadata } from 'next';
import { SITE_CONFIG } from './jsonld';

export interface SEOData {
  title: string;
  description: string;
  url: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  canonical?: string;
}

/**
 * Generate default metadata for a page
 */
export function generateMetadata({
  title,
  description,
  url,
  image,
  keywords = [],
  noIndex = false,
  canonical
}: SEOData): Metadata {
  // ── The document title vs the social title ────────────────────────────────────
  // These were once the same value, and that is what produced "X | Infinus | Infinus" on
  // 21 pages. TWO mechanisms were appending the brand:
  //
  //   1. this helper, guarded by `title.includes('Infinus')` — a CONTAINMENT check, which
  //      passes for "Contact Infinus - …" but does nothing about a title that already ENDS
  //      in "| Infinus";
  //   2. the root layout's `title.template` = "%s | Infinus", which appends unconditionally
  //      to any page title that is a plain string.
  //
  // So a page whose title lacked the brand got it from (1) and then again from (2), and a
  // page whose title already ended in it got it from (2). Only pages with the brand
  // mid-title — "Contact Infinus - …" — came out right, by accident.
  //
  // `socialTitle` keeps the OLD expression byte-for-byte, because og:title, twitter:title
  // and og:image:alt have always carried that exact value and are not what was broken.
  //
  // `documentTitle` is normalised — strip any trailing brand, append exactly one — and
  // returned as `title.absolute`, which opts this page out of the root template. That makes
  // this helper the single owner of the <title> for every page that uses it, so the two
  // mechanisms can no longer stack.
  const socialTitle = title.includes('Infinus') ? title : `${title} | Infinus`;
  const documentTitle = `${title.replace(/\s*\|\s*Infinus\s*$/i, '')} | Infinus`;
  const fullDescription = description || SITE_CONFIG.description;
  const fullUrl = url.startsWith('http') ? url : `${SITE_CONFIG.url}${url}`;
  const fullImage = image || SITE_CONFIG.defaultImage;
  const canonicalUrl = canonical || fullUrl;

  return {
    title: { absolute: documentTitle },
    description: fullDescription,
    keywords: keywords.join(', '),
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: socialTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: socialTitle
        }
      ],
      locale: 'en_US',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: fullDescription,
      images: [fullImage]
    },
    other: {
      'og:image:alt': socialTitle,
      'og:image:width': '1200',
      'og:image:height': '630'
    }
  };
}

/**
 * Generate page-specific metadata
 */
export function generatePageMetadata(
  pageTitle: string,
  pageDescription: string,
  path: string,
  options: Partial<SEOData> = {}
): Metadata {
  return generateMetadata({
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_CONFIG.url}${path}`,
    ...options
  });
}

/**
 * Default SEO keywords for Infinus
 */
export const DEFAULT_KEYWORDS = [
  'SAP',
  'SAP Cloud',
  'SAP implementation',
  'SAP support',
  'SAP Gold Partner',
  'business solutions',
  'enterprise software',
  'cloud migration',
  'digital transformation',
  'Infinus'
];

/**
 * Service-specific keywords
 */
export const SERVICE_KEYWORDS = {
  implementation: [
    'SAP implementation',
    'SAP deployment',
    'SAP project management',
    'SAP consulting',
    'business process optimization'
  ],
  support: [
    'SAP support',
    'SAP maintenance',
    'SAP troubleshooting',
    'SAP training',
    'SAP help desk'
  ],
  growth: [
    'business growth',
    'digital transformation',
    'process improvement',
    'scalability',
    'growth consulting'
  ],
  professional: [
    'professional services',
    'SAP consulting',
    'business advisory',
    'strategic planning',
    'enterprise architecture'
  ]
};

/**
 * Generate structured data script tag
 */
export function generateJsonLdScript(jsonLd: any[]): string {
  return `<script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>`;
}

/**
 * Common page metadata templates
 */
export const PAGE_METADATA = {
  home: {
    title: 'Infinus - SAP Cloud Expertise & Implementation Services',
    description: 'Leading SAP Gold Partner providing comprehensive cloud solutions, implementation services, and expert support. Transform your business with our SAP expertise.',
    keywords: DEFAULT_KEYWORDS
  },
  services: {
    title: 'SAP Services - Implementation, Support & Consulting',
    description: 'Comprehensive SAP services including implementation, support, and consulting. Expert SAP Gold Partner delivering business transformation solutions.',
    keywords: [...DEFAULT_KEYWORDS, ...SERVICE_KEYWORDS.implementation, ...SERVICE_KEYWORDS.support]
  },
  about: {
    title: 'About Infinus - SAP Gold Partner',
    description: 'Learn about Infinus, a trusted SAP Gold Partner with extensive experience in cloud solutions and business transformation.',
    keywords: [...DEFAULT_KEYWORDS, 'about Infinus', 'SAP Gold Partner', 'company history']
  },
  growth: {
    title: 'GROW Services - Business Transformation & Scaling',
    description: 'Accelerate your business growth with our strategic consulting and digital transformation services. Scale efficiently with expert guidance.',
    keywords: [...DEFAULT_KEYWORDS, ...SERVICE_KEYWORDS.growth]
  },
  professional: {
    title: 'Professional Services - Strategic SAP Consulting',
    description: 'Professional SAP consulting services for enterprise architecture, strategic planning, and business advisory. Expert guidance for complex projects.',
    keywords: [...DEFAULT_KEYWORDS, ...SERVICE_KEYWORDS.professional]
  },
  faq: {
    title: 'Frequently Asked Questions - SAP Services',
    description: 'Find answers to common questions about SAP services, implementation, support, and our expertise as an SAP Gold Partner.',
    keywords: [...DEFAULT_KEYWORDS, 'FAQ', 'questions', 'SAP help']
  },
  contact: {
    title: 'Contact Infinus - Get Expert SAP Support',
    description: 'Contact our SAP experts for implementation, support, and consulting services. Get in touch with Infinus, your trusted SAP Gold Partner.',
    keywords: [...DEFAULT_KEYWORDS, 'contact', 'SAP support', 'get in touch']
  },
  privacy: {
    title: 'Privacy Policy - Infinus',
    description: 'Privacy policy and data protection information for Infinus website and services.',
    keywords: ['privacy policy', 'data protection', 'Infinus privacy']
  }
};
