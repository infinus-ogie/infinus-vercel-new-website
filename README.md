# Infinus Website

A modern Next.js 14 website for Infinus, a certified SAP Gold Partner providing comprehensive cloud solutions, implementation services, and expert support for business transformation.

## Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui components with Lucide React icons
- **SEO Optimized**: Comprehensive JSON-LD structured data, meta tags, and sitemap
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA attributes
- **Performance**: Optimized for Core Web Vitals with lazy loading and code splitting
- **Responsive Design**: Mobile-first approach with clean, enterprise-grade UI

## Pages

- **Home** (`/`) - Hero section, services preview, trust indicators
- **Services** (`/services`) - Comprehensive SAP services overview
- **About** (`/about`) - Company information and values
- **GROW** (`/grow`) - Business transformation and scaling services
- **Professional Services** (`/professional-services`) - Strategic SAP consulting
- **FAQ** (`/faq`) - Frequently asked questions with accordion interface
- **Contact** (`/contact`) - Contact form with validation and company information
- **Privacy** (`/privacy`) - Privacy policy and data protection information

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd infinus-vercel-new-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
├── app/                    # Next.js App Router pages
│   └── (site)/            # Site pages
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── content/          # Content components
│   └── forms/            # Form components
├── lib/                  # Utility functions
│   ├── jsonld.ts         # JSON-LD helpers
│   ├── seo.ts            # SEO helpers
│   ├── breadcrumbs.ts    # Breadcrumb helpers
│   └── utils.ts          # General utilities
├── styles/               # Global styles
├── test/                 # Test files
├── docs/                 # Documentation
└── public/               # Static assets
```

## SEO & LLMO Features

- **JSON-LD Structured Data**: WebPage, BreadcrumbList, Article, and FAQPage schemas
- **Meta Tags**: Comprehensive Open Graph and Twitter Card support
- **Sitemap**: XML sitemap for search engines
- **Robots.txt**: Search engine crawling instructions
- **LLMs.txt**: AI tool accessibility information
- **Breadcrumbs**: Structured navigation hierarchy

## Testing

The project includes comprehensive tests for:

- JSON-LD structured data generation
- Contact form validation and submission
- Component accessibility
- SEO metadata

Run tests with:
```bash
npm run test
```

## Deployment

The project is optimized for deployment on Vercel:

1. Connect your repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on push to main branch

## Environment Variables

Create a `.env.local` file for local development:

```bash
NEXT_PUBLIC_SITE_URL=https://www.infinus.co
CONTACT_EMAIL=contact@infinus.co
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests and linting
6. Submit a pull request

## License

This project is proprietary to Infinus.

## Support

For questions or support, contact:
- Email: contact@infinus.co
- Phone: +1 (555) 123-4567
