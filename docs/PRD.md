# Product Requirements Document (PRD)
## Infinus Website Strict 1:1 Remake

### Project Overview
**Objective**: Create a strict 1:1 remake of www.infinus.co website using modern Next.js 14 technology stack while maintaining identical content and section order.

### Core Requirements

#### 1. Content Fidelity (CRITICAL)
- **EXACT TEXT COPY**: All text content must be identical to the original Odoo website
- **SECTION ORDER**: Home page sections must follow exact order from original site
- **NO CONTENT CREATION**: Zero tolerance for invented or modified text
- **TODO MARKERS**: Use `// TODO: [MISSING_CONTENT]` for any content that cannot be retrieved

#### 2. Technical Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **Validation**: Zod for form validation
- **Testing**: Vitest + Testing Library

#### 3. Page Structure (Exact Order)
```
Home Page Sections (A-H):
[A] Hero - "Driving Business Success through SAP Expertise" + CTA
[B] About Us - SAP Gold Partner description with bullet points
[C] Our Services - 3 numbered cards (Implementation, Support, Other)
[D] Benefits from working with us - 4 benefit cards
[E] SAP Expertise - Chip list of SAP solutions
[F] Domain Expertise - Grid of industry domains
[G] Join Our Team - Contact form with specific fields
[H] Footer - Company info, navigation, contact details
```

#### 4. Required Pages
- `/` - Home page (sections A-H)
- `/about` - About page (copy from original)
- `/services` - Services page (copy from original "Our Services")
- `/faq` - FAQ page (copy from original Q&A)
- `/contact` - Contact page (form with original fields)
- `/privacy` - Privacy Policy (copy from original)
- `/grow` - GROW with SAP program page (hero + materials)
- `/professional-services` - Placeholder page (hero + paragraph)

#### 5. SEO & Structured Data
- **JSON-LD Required**: WebPage, BreadcrumbList, Article, FAQPage
- **Required Fields**: datePublished, dateModified (ISO 8601), Article.image, author.url, inLanguage
- **Meta Tags**: title, description, og:image, canonical
- **Files**: robots.txt, sitemap.xml, llms.txt

#### 6. Testing Requirements
- **home-sections-order.test.tsx**: Verify exact section order
- **home-copy-match.test.tsx**: Verify key phrases exist exactly
- **faq-copy.test.tsx**: Verify FAQ content matches 1:1
- **privacy-copy.test.tsx**: Verify privacy policy content

#### 7. Design Guidelines
- **Style**: Modern enterprise design with clean grid layout
- **Colors**: Neutral dark-blue/gray palette
- **Components**: shadcn/ui (Button, Card, Input, Textarea, Accordion, Badge)
- **Typography**: Clean H1-H3 hierarchy with good contrast
- **Hero**: Subtle gradient with prominent CTA buttons
- **Cards**: Subtle shadows and rounded corners

#### 8. Form Requirements
- **Contact Form Fields**: Name*, Phone, Email*, Subject*, Message*, Attach Resume
- **Validation**: Client-side validation with Zod
- **Submission**: Stub implementation (no real sending)
- **Error Handling**: Proper validation feedback

#### 9. Navigation
- **Header**: Logo left, navigation right (Home, Services, About, GROW, Professional Services, FAQ, Contact)
- **Footer**: Company description, navigation links, contact info, copyright, privacy link

#### 10. Content Sources
- **Primary**: www.infinus.co (Odoo website)
- **Fallback**: Web search results provided
- **Missing Content**: Mark with TODO comments for later completion

### Success Criteria
1. ✅ All sections appear in exact order as original
2. ✅ All text content matches original 1:1
3. ✅ All required pages exist with proper content
4. ✅ JSON-LD structured data implemented on all pages
5. ✅ All tests pass (section order, content match, FAQ, privacy)
6. ✅ Modern UI with shadcn/ui components
7. ✅ Responsive design works on all devices
8. ✅ SEO optimization complete

### Risk Mitigation
- **Content Gaps**: Use TODO markers for missing content
- **Design Conflicts**: Prioritize content fidelity over design
- **Technical Issues**: Use proven Next.js patterns and shadcn/ui
- **Testing**: Implement comprehensive test suite early

### Timeline
- **Phase 1**: Documentation and project setup
- **Phase 2**: Core layout and home page sections
- **Phase 3**: Additional pages and components
- **Phase 4**: SEO, testing, and final polish

### Approval Criteria
- Content matches original website 100%
- All sections appear in correct order
- Modern UI implementation complete
- All tests passing
- SEO optimization complete