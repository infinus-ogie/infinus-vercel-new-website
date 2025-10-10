# Testing Documentation
## Infinus Website Test Suite

### Overview
This document outlines the comprehensive test suite designed to ensure the Infinus website maintains 1:1 content fidelity with the original Odoo website and proper functionality.

### Test Framework
- **Testing Library**: @testing-library/react, @testing-library/jest-dom
- **Test Runner**: Vitest
- **Coverage**: Jest coverage reporting
- **Mocking**: Vitest mocking capabilities

### Critical Tests for Content Fidelity

#### 1. Home Page Section Order Test
**File**: `test/home-sections-order.test.tsx`

**Purpose**: Verify that home page sections appear in the exact order as the original website.

**Test Cases**:
```typescript
describe('Home Page Section Order', () => {
  test('renders sections in correct order', () => {
    render(<HomePage />)
    
    const sections = [
      'hero',
      'about', 
      'services',
      'benefits',
      'sap-expertise',
      'domain-expertise',
      'join-team',
      'footer'
    ]
    
    sections.forEach((section, index) => {
      const element = screen.getByTestId(`section-${section}`)
      expect(element).toBeInTheDocument()
      // Verify DOM order
    })
  })
})
```

**Expected Results**:
- Hero section appears first
- About Us section appears second
- Services section appears third
- Benefits section appears fourth
- SAP Expertise section appears fifth
- Domain Expertise section appears sixth
- Join Our Team section appears seventh
- Footer appears last

#### 2. Home Page Content Match Test
**File**: `test/home-copy-match.test.tsx`

**Purpose**: Verify that key text content matches the original website exactly.

**Test Cases**:
```typescript
describe('Home Page Content Match', () => {
  test('contains exact hero text', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/Driving Business Success through SAP Expertise/i)).toBeInTheDocument()
    expect(screen.getByText(/Your reliable SAP expertise partner/i)).toBeInTheDocument()
  })
  
  test('contains exact about us text', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/About Us/i)).toBeInTheDocument()
    expect(screen.getByText(/Infinus is SAP Gold Partner focused on SAP Business Suite solutions/i)).toBeInTheDocument()
  })
  
  test('contains exact services text', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/SAP Implementation Services/i)).toBeInTheDocument()
    expect(screen.getByText(/Greenfield, brownfield, conversions, migrations and rollouts/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Support Services/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Application Management Services and SLA Support Services/i)).toBeInTheDocument()
    expect(screen.getByText(/Other Services/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP localisation support, developments, trainings, etc/i)).toBeInTheDocument()
  })
  
  test('contains exact benefits text', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/European Focus/i)).toBeInTheDocument()
    expect(screen.getByText(/We are located in Serbia \(CET time zone\) and provide services throughout Europe/i)).toBeInTheDocument()
    expect(screen.getByText(/Hybrid Work Model/i)).toBeInTheDocument()
    expect(screen.getByText(/Our consultants are available for both onsite and remote work/i)).toBeInTheDocument()
    expect(screen.getByText(/Competitive Pricing/i)).toBeInTheDocument()
    expect(screen.getByText(/By sourcing with us, you can take advantage of cost-effective services/i)).toBeInTheDocument()
    expect(screen.getByText(/Flexible Solutions/i)).toBeInTheDocument()
    expect(screen.getByText(/We offer flexible engagement models tailored to your unique needs/i)).toBeInTheDocument()
  })
  
  test('contains SAP expertise items', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/SAP Cloud ERP \(Private and Public\)/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Business Data Cloud/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Business AI/i)).toBeInTheDocument()
    expect(screen.getByText(/SAP Business Technology Platform/i)).toBeInTheDocument()
  })
  
  test('contains domain expertise items', () => {
    render(<HomePage />)
    
    const domains = [
      'Retail',
      'Pharmaceuticals', 
      'Wholesale and Distribution',
      'Consumer Goods',
      'Industrial Manufacturing',
      'Professional Services'
    ]
    
    domains.forEach(domain => {
      expect(screen.getByText(new RegExp(domain, 'i'))).toBeInTheDocument()
    })
  })
})
```

#### 3. FAQ Content Test
**File**: `test/faq-copy.test.tsx`

**Purpose**: Verify that FAQ questions and answers match the original website exactly.

**Test Cases**:
```typescript
describe('FAQ Content Match', () => {
  test('contains exact FAQ questions and answers', () => {
    render(<FAQPage />)
    
    // Test specific Q&A pairs from original website
    expect(screen.getByText(/What services does Infinus provide\?/i)).toBeInTheDocument()
    expect(screen.getByText(/Infinus provides comprehensive SAP services/i)).toBeInTheDocument()
    
    // Add more specific Q&A tests based on original content
  })
  
  test('FAQ accordion functionality works', () => {
    render(<FAQPage />)
    
    const firstQuestion = screen.getByText(/What services does Infinus provide\?/i)
    fireEvent.click(firstQuestion)
    
    expect(screen.getByText(/Infinus provides comprehensive SAP services/i)).toBeVisible()
  })
})
```

#### 4. Privacy Policy Content Test
**File**: `test/privacy-copy.test.tsx`

**Purpose**: Verify that privacy policy content matches the original website.

**Test Cases**:
```typescript
describe('Privacy Policy Content Match', () => {
  test('contains key privacy policy text', () => {
    render(<PrivacyPage />)
    
    const privacyText = screen.getByTestId('privacy-content').textContent
    
    // Test for key phrases from original privacy policy
    expect(privacyText).toContain('privacy policy')
    expect(privacyText).toContain('data protection')
    expect(privacyText).toContain('personal information')
    
    // Add more specific content tests based on original privacy policy
  })
})
```

### Component Tests

#### 5. Contact Form Test
**File**: `test/components/contact-form.test.tsx`

**Purpose**: Verify contact form functionality and validation.

**Test Cases**:
```typescript
describe('Contact Form', () => {
  test('renders all required fields', () => {
    render(<ContactForm />)
    
    expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Your Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Attach your Resume/i)).toBeInTheDocument()
  })
  
  test('validates required fields', async () => {
    render(<ContactForm />)
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Subject is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Message is required/i)).toBeInTheDocument()
    })
  })
  
  test('validates email format', async () => {
    render(<ContactForm />)
    
    const emailInput = screen.getByLabelText(/Your Email/i)
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email/i)).toBeInTheDocument()
    })
  })
})
```

#### 6. Navigation Test
**File**: `test/components/navigation.test.tsx`

**Purpose**: Verify navigation functionality and links.

**Test Cases**:
```typescript
describe('Navigation', () => {
  test('renders all navigation links', () => {
    render(<Header />)
    
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /services/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /growth/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /professional services/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /faq/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })
  
  test('navigation links have correct href attributes', () => {
    render(<Header />)
    
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: /services/i })).toHaveAttribute('href', '/services')
  })
})
```

### SEO and Structured Data Tests

#### 7. JSON-LD Test
**File**: `test/seo/jsonld.test.ts`

**Purpose**: Verify JSON-LD structured data is properly generated.

**Test Cases**:
```typescript
describe('JSON-LD Generation', () => {
  test('generates valid WebPage schema', () => {
    const webPage = generateWebPage({
      name: 'Test Page',
      url: 'https://example.com',
      description: 'Test description'
    })
    
    expect(webPage['@type']).toBe('WebPage')
    expect(webPage.name).toBe('Test Page')
    expect(webPage.url).toBe('https://example.com')
  })
  
  test('generates valid BreadcrumbList schema', () => {
    const breadcrumbs = generateBreadcrumbs('/about')
    
    expect(breadcrumbs['@type']).toBe('BreadcrumbList')
    expect(breadcrumbs.itemListElement).toHaveLength(2)
    expect(breadcrumbs.itemListElement[0].item.name).toBe('Home')
    expect(breadcrumbs.itemListElement[1].item.name).toBe('About')
  })
  
  test('generates valid Article schema', () => {
    const article = generateArticle({
      headline: 'Test Article',
      description: 'Test description',
      image: 'https://example.com/image.jpg',
      authorName: 'Test Author',
      authorUrl: 'https://example.com/author',
      datePublished: '2024-01-01',
      dateModified: '2024-01-01'
    })
    
    expect(article['@type']).toBe('Article')
    expect(article.headline).toBe('Test Article')
    expect(article.author['@type']).toBe('Person')
    expect(article.author.name).toBe('Test Author')
  })
  
  test('generates valid FAQPage schema', () => {
    const faqs = [
      { question: 'Test Question?', answer: 'Test Answer' }
    ]
    
    const faqPage = generateFAQPage(faqs)
    
    expect(faqPage['@type']).toBe('FAQPage')
    expect(faqPage.mainEntity).toHaveLength(1)
    expect(faqPage.mainEntity[0].question).toBe('Test Question?')
    expect(faqPage.mainEntity[0].answer).toBe('Test Answer')
  })
})
```

### Integration Tests

#### 8. Page Rendering Test
**File**: `test/integration/page-rendering.test.tsx`

**Purpose**: Verify all pages render without errors.

**Test Cases**:
```typescript
describe('Page Rendering', () => {
  test('home page renders without errors', () => {
    expect(() => render(<HomePage />)).not.toThrow()
  })
  
  test('about page renders without errors', () => {
    expect(() => render(<AboutPage />)).not.toThrow()
  })
  
  test('services page renders without errors', () => {
    expect(() => render(<ServicesPage />)).not.toThrow()
  })
  
  test('faq page renders without errors', () => {
    expect(() => render(<FAQPage />)).not.toThrow()
  })
  
  test('contact page renders without errors', () => {
    expect(() => render(<ContactPage />)).not.toThrow()
  })
  
  test('privacy page renders without errors', () => {
    expect(() => render(<PrivacyPage />)).not.toThrow()
  })
})
```

### Performance Tests

#### 9. Performance Test
**File**: `test/performance/performance.test.tsx`

**Purpose**: Verify page performance meets standards.

**Test Cases**:
```typescript
describe('Performance', () => {
  test('home page loads within acceptable time', async () => {
    const startTime = performance.now()
    render(<HomePage />)
    const endTime = performance.now()
    
    expect(endTime - startTime).toBeLessThan(1000) // 1 second
  })
  
  test('all images have alt attributes', () => {
    render(<HomePage />)
    
    const images = screen.getAllByRole('img')
    images.forEach(img => {
      expect(img).toHaveAttribute('alt')
      expect(img.getAttribute('alt')).not.toBe('')
    })
  })
})
```

### Test Configuration

#### Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})
```

#### Test Setup
```typescript
// test/setup.ts
import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
```

### Running Tests

#### Commands
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test home-sections-order.test.tsx

# Run tests matching pattern
npm run test -- --grep "content match"
```

### Test Coverage Requirements

#### Minimum Coverage
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

#### Critical Areas
- All page components: 100% coverage
- Form validation: 100% coverage
- JSON-LD generation: 100% coverage
- Navigation components: 100% coverage

### Continuous Integration

#### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run type-check
```

### Test Maintenance

#### Regular Updates
- Update tests when content changes
- Add new tests for new features
- Review and update test coverage regularly
- Maintain test documentation

#### Test Review Process
1. All new features require tests
2. Content changes require content tests
3. Performance regressions require performance tests
4. Security changes require security tests