import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { generatePageJsonLd, getCurrentDate, DEFAULT_AUTHOR, DEFAULT_PUBLISHER, SITE_CONFIG } from '@/lib/jsonld'

// Mock Next.js Script component
vi.mock('next/script', () => ({
  default: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('script', props, children);
  }
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => {
    const React = require('react');
    return React.createElement('a', { href, ...props }, children);
  }
}))

// Mock Next.js usePathname hook
vi.mock('next/navigation', () => ({
  usePathname: () => '/'
}))

// Helper function to get JSON-LD scripts from rendered component
function getJsonLdScripts(container: HTMLElement): HTMLScriptElement[] {
  return Array.from(container.querySelectorAll('script[type="application/ld+json"]'))
}

describe('JSON-LD Implementation', () => {
  it('should generate correct JSON-LD structure with all required entities', () => {
    const jsonLd = generatePageJsonLd({
      pageData: {
        name: 'Test Page',
        url: 'https://www.infinus.co/test',
        inLanguage: 'en-US',
        description: 'Test page description'
      },
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Test', url: '/test' }
      ],
      articleData: {
        headline: 'Test Page',
        description: 'Test page description',
        image: 'https://www.infinus.co/test-image.jpg',
        authorName: DEFAULT_AUTHOR.name,
        authorUrl: DEFAULT_AUTHOR.url,
        datePublished: getCurrentDate(),
        dateModified: getCurrentDate(),
        inLanguage: 'en-US',
        mainEntityOfPage: 'https://www.infinus.co/test',
        publisher: DEFAULT_PUBLISHER
      },
      faqs: [
        {
          question: 'Test question?',
          answer: 'Test answer.'
        }
      ]
    })

    expect(jsonLd).toHaveLength(4)
    
    const types = jsonLd.map((item: any) => item['@type'])
    expect(types).toContain('WebPage')
    expect(types).toContain('BreadcrumbList')
    expect(types).toContain('Article')
    expect(types).toContain('FAQPage')
  })

  it('should include all required fields in Article entity', () => {
    const jsonLd = generatePageJsonLd({
      pageData: {
        name: 'Test Page',
        url: 'https://www.infinus.co/test',
        inLanguage: 'en-US',
        description: 'Test page description'
      },
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Test', url: '/test' }
      ],
      articleData: {
        headline: 'Test Page',
        description: 'Test page description',
        image: 'https://www.infinus.co/test-image.jpg',
        authorName: DEFAULT_AUTHOR.name,
        authorUrl: DEFAULT_AUTHOR.url,
        datePublished: getCurrentDate(),
        dateModified: getCurrentDate(),
        inLanguage: 'en-US',
        mainEntityOfPage: 'https://www.infinus.co/test',
        publisher: DEFAULT_PUBLISHER
      },
      faqs: []
    })

    const article = jsonLd.find((item: any) => item['@type'] === 'Article')
    
    expect(article).toHaveProperty('datePublished')
    expect(article).toHaveProperty('dateModified')
    expect(article).toHaveProperty('author')
    expect(article.author).toHaveProperty('url')
    expect(article).toHaveProperty('inLanguage', 'en-US')
    expect(article).toHaveProperty('image')
    expect(article.image).toHaveProperty('url')
  })

  it('should generate proper BreadcrumbList structure', () => {
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Implementation', url: '/services/implementation' }
    ]

    const jsonLd = generatePageJsonLd({
      pageData: {
        name: 'Test Page',
        url: 'https://www.infinus.co/test',
        inLanguage: 'en-US',
        description: 'Test page description'
      },
      breadcrumbs,
      articleData: {
        headline: 'Test Page',
        description: 'Test page description',
        image: 'https://www.infinus.co/test-image.jpg',
        authorName: DEFAULT_AUTHOR.name,
        authorUrl: DEFAULT_AUTHOR.url,
        datePublished: getCurrentDate(),
        dateModified: getCurrentDate(),
        inLanguage: 'en-US',
        mainEntityOfPage: 'https://www.infinus.co/test',
        publisher: DEFAULT_PUBLISHER
      },
      faqs: []
    })

    const breadcrumbList = jsonLd.find((item: any) => item['@type'] === 'BreadcrumbList')
    
    expect(breadcrumbList).toHaveProperty('itemListElement')
    expect(breadcrumbList.itemListElement).toHaveLength(3)
    
    breadcrumbList.itemListElement.forEach((item: any, index: number) => {
      expect(item).toHaveProperty('@type', 'ListItem')
      expect(item).toHaveProperty('position', index + 1)
      expect(item).toHaveProperty('name', breadcrumbs[index].name)
      expect(item).toHaveProperty('item', breadcrumbs[index].url)
    })
  })

  it('should generate FAQPage when FAQs are provided', () => {
    const faqs = [
      {
        question: 'What services do you provide?',
        answer: 'We provide comprehensive SAP services.'
      },
      {
        question: 'How can I contact you?',
        answer: 'You can contact us through our website or email.'
      }
    ]

    const jsonLd = generatePageJsonLd({
      pageData: {
        name: 'Test Page',
        url: 'https://www.infinus.co/test',
        inLanguage: 'en-US',
        description: 'Test page description'
      },
      breadcrumbs: [{ name: 'Home', url: '/' }],
      articleData: {
        headline: 'Test Page',
        description: 'Test page description',
        image: 'https://www.infinus.co/test-image.jpg',
        authorName: DEFAULT_AUTHOR.name,
        authorUrl: DEFAULT_AUTHOR.url,
        datePublished: getCurrentDate(),
        dateModified: getCurrentDate(),
        inLanguage: 'en-US',
        mainEntityOfPage: 'https://www.infinus.co/test',
        publisher: DEFAULT_PUBLISHER
      },
      faqs
    })

    const faqPage = jsonLd.find((item: any) => item['@type'] === 'FAQPage')
    
    expect(faqPage).toBeDefined()
    expect(faqPage).toHaveProperty('mainEntity')
    expect(faqPage.mainEntity).toHaveLength(2)
    
    faqPage.mainEntity.forEach((item: any, index: number) => {
      expect(item).toHaveProperty('@type', 'Question')
      expect(item).toHaveProperty('name', faqs[index].question)
      expect(item).toHaveProperty('acceptedAnswer')
      expect(item.acceptedAnswer).toHaveProperty('@type', 'Answer')
      expect(item.acceptedAnswer).toHaveProperty('text', faqs[index].answer)
    })
  })

  it('should not include FAQPage when no FAQs are provided', () => {
    const jsonLd = generatePageJsonLd({
      pageData: {
        name: 'Test Page',
        url: 'https://www.infinus.co/test',
        inLanguage: 'en-US',
        description: 'Test page description'
      },
      breadcrumbs: [{ name: 'Home', url: '/' }],
      articleData: {
        headline: 'Test Page',
        description: 'Test page description',
        image: 'https://www.infinus.co/test-image.jpg',
        authorName: DEFAULT_AUTHOR.name,
        authorUrl: DEFAULT_AUTHOR.url,
        datePublished: getCurrentDate(),
        dateModified: getCurrentDate(),
        inLanguage: 'en-US',
        mainEntityOfPage: 'https://www.infinus.co/test',
        publisher: DEFAULT_PUBLISHER
      },
      faqs: []
    })

    expect(jsonLd).toHaveLength(3)
    
    const types = jsonLd.map((item: any) => item['@type'])
    expect(types).toContain('WebPage')
    expect(types).toContain('BreadcrumbList')
    expect(types).toContain('Article')
    expect(types).not.toContain('FAQPage')
  })
})
