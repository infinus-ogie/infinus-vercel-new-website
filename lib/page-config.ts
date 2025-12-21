/**
 * Global Page Configuration System
 * Centralized content management for all pages
 * Changes here automatically update JSON-LD schemas
 */

import { SITE_CONFIG } from "./jsonld";

export interface PageConfig {
  // Basic page info
  slug: string;
  title: string;
  description: string;
  language?: string;
  
  // SEO
  keywords?: string[];
  ogImage?: string;
  
  // Breadcrumbs
  breadcrumbs?: Array<{ name: string; url: string }>;
  
  // FAQ (optional)
  faqs?: Array<{ question: string; answer: string }>;
  
  // Article metadata (optional)
  articleHeadline?: string;
  articleDescription?: string;
  articleAbout?: string[];
  
  // Additional schemas (optional)
  additionalSchemas?: any[];
}

/**
 * Get full URL for a page
 */
export function getPageUrl(slug: string): string {
  return `${SITE_CONFIG.url}${slug}`;
}

/**
 * Get default breadcrumbs for a page
 */
export function getDefaultBreadcrumbs(slug: string, pageName: string): Array<{ name: string; url: string }> {
  const breadcrumbs: Array<{ name: string; url: string }> = [
    { name: "Home", url: SITE_CONFIG.url },
  ];
  
  if (slug !== "/") {
    breadcrumbs.push({ name: pageName, url: getPageUrl(slug) });
  }
  
  return breadcrumbs;
}

