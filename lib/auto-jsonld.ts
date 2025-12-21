/**
 * Automatic JSON-LD Schema Generator
 * Generates schemas automatically from page config
 * Works for all pages across the site
 */

import { PageConfig } from "./page-config";
import { 
  getCurrentDate, 
  DEFAULT_AUTHOR, 
  DEFAULT_PUBLISHER, 
  SITE_CONFIG,
  WebPageData,
  BreadcrumbItem,
  ArticleData,
  FAQItem
} from "./jsonld";
import { getPageUrl, getDefaultBreadcrumbs } from "./page-config";

/**
 * Automatically generate all JSON-LD schemas for a page
 * Based on page config - updates automatically when config changes
 */
export function generateAutoJsonLd(config: PageConfig) {
  const pageUrl = getPageUrl(config.slug);
  const language = config.language || SITE_CONFIG.language;
  const breadcrumbs = config.breadcrumbs || getDefaultBreadcrumbs(config.slug, config.title);
  
  const schemas: any[] = [];
  
  // 1. WebPage Schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: config.title,
    url: pageUrl,
    inLanguage: language,
    description: config.description,
    datePublished: getCurrentDate(),
    dateModified: getCurrentDate(),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  });
  
  // 2. BreadcrumbList Schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : getPageUrl(item.url),
    })),
  });
  
  // 3. Article Schema (if article data provided)
  if (config.articleHeadline || config.articleDescription) {
    const articleData: ArticleData = {
      headline: config.articleHeadline || config.title,
      description: config.articleDescription || config.description,
      image: config.ogImage || SITE_CONFIG.defaultImage,
      authorName: DEFAULT_AUTHOR.name,
      authorUrl: DEFAULT_AUTHOR.url,
      datePublished: getCurrentDate(),
      dateModified: getCurrentDate(),
      inLanguage: language,
      mainEntityOfPage: pageUrl,
      publisher: DEFAULT_PUBLISHER,
    };
    
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: articleData.headline,
      description: articleData.description,
      image: {
        "@type": "ImageObject",
        url: articleData.image,
        width: 1200,
        height: 630,
      },
      author: {
        "@type": "Organization",
        name: articleData.authorName,
        url: articleData.authorUrl,
      },
      publisher: articleData.publisher,
      datePublished: articleData.datePublished,
      dateModified: articleData.dateModified,
      inLanguage: articleData.inLanguage,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": articleData.mainEntityOfPage,
      },
      about: config.articleAbout?.map((topic) => ({
        "@type": "Thing",
        name: topic,
      })) || [],
    });
  }
  
  // 4. FAQPage Schema (if FAQs provided)
  if (config.faqs && config.faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: config.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }
  
  // 5. Additional custom schemas
  if (config.additionalSchemas) {
    schemas.push(...config.additionalSchemas);
  }
  
  return schemas;
}

/**
 * Helper to create page config from simple data
 * For pages that don't need full config object
 */
export function createSimplePageConfig(
  slug: string,
  title: string,
  description: string,
  options?: {
    language?: string;
    faqs?: Array<{ question: string; answer: string }>;
    articleAbout?: string[];
    ogImage?: string;
    additionalSchemas?: any[];
  }
): PageConfig {
  return {
    slug,
    title,
    description,
    language: options?.language,
    faqs: options?.faqs,
    articleHeadline: title,
    articleDescription: description,
    articleAbout: options?.articleAbout,
    ogImage: options?.ogImage,
    additionalSchemas: options?.additionalSchemas,
  };
}

