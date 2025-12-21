# Auto JSON-LD System - Global Documentation

## Overview

The entire website now uses an **automatic JSON-LD schema generation system**. When you change any text on any page, the JSON-LD schemas automatically update to match.

## How It Works

### 1. Page Config System

Each page defines its content in a simple config object. This config is the **single source of truth** for:
- Page title and description
- FAQ questions and answers
- Breadcrumbs
- Article metadata
- All other content

### 2. Auto JSON-LD Generation

The system automatically generates:
- ✅ WebPage schema
- ✅ BreadcrumbList schema
- ✅ Article schema (if applicable)
- ✅ FAQPage schema (if FAQs provided)
- ✅ Any custom schemas

### 3. Automatic Updates

When you change text in the config:
- ✅ Page display updates
- ✅ JSON-LD schemas update
- ✅ SEO metadata updates
- ✅ Everything stays in sync

## Usage Examples

### Simple Page (Contact, FAQ, etc.)

```typescript
import { AutoJsonLd } from "@/components/seo/AutoJsonLd"
import { createSimplePageConfig } from "@/lib/auto-jsonld"

// Define page content - single source of truth
const pageConfig = createSimplePageConfig(
  "/contact",  // slug
  "Contact Us",  // title
  "Get in touch with our team",  // description
  {
    faqs: [
      {
        question: "How can I contact you?",
        answer: "You can contact us via email or phone."
      }
    ],
    articleAbout: ["Contact", "Support"],
  }
)

export default function ContactPage() {
  return (
    <>
      {/* Auto-generated JSON-LD */}
      <AutoJsonLd config={pageConfig} />
      {/* Rest of page content */}
    </>
  )
}
```

### Complex Page (like ProjectPulse)

For complex pages, create a `_config.ts` file:

```typescript
// app/(site)/projectpulse/_config.ts
export const projectPulseConfig = {
  page: {
    slug: "/projectpulse",
    title: "ProjectPulse",
    description: "...",
  },
  hero: {
    title: "ProjectPulse",
    subtitle: "...",
  },
  // ... more sections
}
```

Then use it:

```typescript
// app/(site)/projectpulse/_jsonld.ts
import { projectPulseConfig } from "./_config"
import { generateAutoJsonLd } from "@/lib/auto-jsonld"

export function generateProjectPulseJsonLd() {
  return generateAutoJsonLd({
    slug: projectPulseConfig.page.slug,
    title: projectPulseConfig.page.title,
    description: projectPulseConfig.page.description,
    faqs: projectPulseConfig.faqs,
    // ... etc
  })
}
```

## Migration Guide

### Step 1: Replace Old JSON-LD Code

**Before:**
```typescript
const jsonLd = generatePageJsonLd({
  pageData: { ... },
  breadcrumbs: [ ... ],
  articleData: { ... },
  faqs: [ ... ]
})

<Script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

**After:**
```typescript
const pageConfig = createSimplePageConfig(
  "/page-slug",
  "Page Title",
  "Page Description",
  { faqs: [ ... ] }
)

<AutoJsonLd config={pageConfig} />
```

### Step 2: Move Content to Config

Move all hardcoded text into the config object. This becomes your single source of truth.

### Step 3: Test

Verify that:
- ✅ Page displays correctly
- ✅ JSON-LD is generated (check page source)
- ✅ SEO metadata is correct

## Benefits

1. **No Duplication**: Content defined once, used everywhere
2. **Always in Sync**: Schemas match content automatically
3. **Easy Updates**: Change one place, everything updates
4. **Type Safety**: TypeScript ensures consistency
5. **SEO Optimized**: Schemas always reflect current content
6. **AI Discoverable**: Rich structured data for AI crawlers

## Page Status

### ✅ Migrated to Auto System
- `/contact` - Uses `AutoJsonLd` component
- `/faq` - Uses `AutoJsonLd` component
- `/projectpulse` - Uses custom config system

### 🔄 Needs Migration
- `/grow` - Has hardcoded JSON-LD
- `/professional-services` - Has hardcoded JSON-LD
- `/cfo` - Has hardcoded JSON-LD
- `/privacy` - Uses old `generatePageJsonLd`

### Migration Priority
1. High-traffic pages first
2. Pages with FAQs
3. Product/service pages
4. Other pages

## FAQ Schema

FAQ schemas are automatically generated when you provide FAQs in the config:

```typescript
const pageConfig = createSimplePageConfig(
  "/page",
  "Title",
  "Description",
  {
    faqs: [
      { question: "...", answer: "..." },
      { question: "...", answer: "..." },
    ]
  }
)
```

This automatically creates a `FAQPage` schema with all questions and answers.

## Breadcrumbs

Breadcrumbs are automatically generated. You can customize them:

```typescript
const pageConfig = {
  slug: "/page",
  title: "Page Title",
  description: "...",
  breadcrumbs: [
    { name: "Home", url: "/" },
    { name: "Section", url: "/section" },
    { name: "Page", url: "/page" },
  ]
}
```

If not provided, default breadcrumbs are generated (Home → Page).

## Article Schema

Article schema is automatically generated when you provide article metadata:

```typescript
const pageConfig = createSimplePageConfig(
  "/page",
  "Title",
  "Description",
  {
    articleAbout: ["Topic 1", "Topic 2"],
  }
)
```

## Custom Schemas

You can add custom schemas:

```typescript
const pageConfig = {
  slug: "/page",
  title: "Title",
  description: "...",
  additionalSchemas: [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Product Name",
      // ... more fields
    }
  ]
}
```

## Best Practices

1. **Always use config for content** - Don't hardcode text in components
2. **Keep configs organized** - Use `_config.ts` for complex pages
3. **Update configs, not schemas** - Let the system generate schemas
4. **Test after changes** - Verify JSON-LD in page source
5. **Use TypeScript** - Get type safety and autocomplete

## Troubleshooting

### JSON-LD not appearing?
- Check that `<AutoJsonLd>` is in the component
- Verify config is properly structured
- Check browser console for errors

### Schemas not updating?
- Clear browser cache
- Check that config changes are saved
- Verify imports are correct

### Type errors?
- Ensure all required fields in config
- Check TypeScript types match
- Verify imports from `@/lib/auto-jsonld`

## Support

For questions or issues:
1. Check this documentation
2. Look at existing examples (`/contact`, `/faq`, `/projectpulse`)
3. Review `lib/auto-jsonld.ts` for implementation details

