/**
 * JSON-LD Helper Functions
 * Generates structured data for SEO and LLMO optimization
 */

export interface WebPageData {
  name: string;
  url: string;
  inLanguage: string;
  description?: string;
  isPartOf?: {
    '@type': 'WebSite';
    name: string;
    url: string;
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ArticleData {
  headline: string;
  description: string;
  image: string;
  authorName: string;
  authorUrl: string;
  datePublished: string;
  dateModified: string;
  inLanguage: string;
  mainEntityOfPage: string;
  publisher?: {
    '@type': 'Organization';
    name: string;
    url: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
      width: number;
      height: number;
    };
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Generate WebPage structured data
 */
export function webPage(data: WebPageData) {
  return {
    '@type': 'WebPage',
    '@id': `${data.url}#webpage`,
    url: data.url,
    name: data.name,
    description: data.description,
    inLanguage: data.inLanguage,
    isPartOf: data.isPartOf || {
      '@type': 'WebSite',
      name: 'Infinus',
      url: 'https://www.infinus.co'
    }
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function breadcrumbs(items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * Generate Article structured data
 */
export function article(data: ArticleData) {
  return {
    '@type': 'Article',
    '@id': `${data.mainEntityOfPage}#article`,
    headline: data.headline,
    description: data.description,
    image: {
      '@type': 'ImageObject',
      url: data.image,
      width: 1200,
      height: 630
    },
    author: {
      '@type': 'Person',
      name: data.authorName,
      url: data.authorUrl
    },
    publisher: data.publisher || {
      '@type': 'Organization',
      name: 'Infinus',
      url: 'https://www.infinus.co',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.infinus.co/logo.svg',
        width: 200,
        height: 60
      }
    },
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    inLanguage: data.inLanguage,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.mainEntityOfPage
    }
  };
}

/**
 * Generate FAQPage structured data
 */
export function faqPage(faqs: FAQItem[], pageUrl: string) {
  if (faqs.length === 0) {
    return null;
  }

  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generate complete JSON-LD array for a page
 */
export function generatePageJsonLd({
  pageData,
  breadcrumbs: breadcrumbItems,
  articleData,
  faqs = []
}: {
  pageData: WebPageData;
  breadcrumbs: BreadcrumbItem[];
  articleData: ArticleData;
  faqs?: FAQItem[];
}) {
  const jsonLd: any[] = [
    webPage(pageData),
    breadcrumbs(breadcrumbItems),
    article(articleData)
  ];

  const faqPageData = faqPage(faqs, pageData.url);
  if (faqPageData) {
    jsonLd.push(faqPageData);
  }

  return jsonLd;
}

/**
 * Get current date in ISO 8601 format
 */
export function getCurrentDate(): string {
  return new Date().toISOString();
}

/**
 * Get date from a specific date in ISO 8601 format
 */
export function getDateFromString(dateString: string): string {
  return new Date(dateString).toISOString();
}

/**
 * Default author information
 */
export const DEFAULT_AUTHOR = {
  name: 'Infinus Team',
  url: 'https://www.infinus.co/about'
};

/**
 * Default publisher information
 */
export const DEFAULT_PUBLISHER = {
  '@type': 'Organization' as const,
  name: 'Infinus',
  url: 'https://www.infinus.co',
  logo: {
    '@type': 'ImageObject' as const,
    url: 'https://www.infinus.co/logo.svg',
    width: 200,
    height: 60
  }
};

/**
 * Default site configuration
 */
export const SITE_CONFIG = {
  name: 'Infinus',
  url: 'https://www.infinus.co',
  language: 'en-US',
  description: 'SAP Cloud expertise and implementation services. SAP Gold Partner providing comprehensive business solutions.',
  defaultImage: 'https://www.infinus.co/og-default.png'
};
