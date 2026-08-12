# ProjectPulse Page - Auto-Sync System

## Overview

This page uses an **automatic synchronization system** that ensures JSON-LD schemas are always up-to-date with the page content. When you update text in the config file, schemas automatically update.

## How It Works

### 1. Single Source of Truth: `_config.ts`

All page content is defined in `app/(site)/projectpulse/_config.ts`. This includes:
- Hero section text
- Industries list
- Problem descriptions
- Value propositions
- How it works steps
- Outcomes by role
- Implementation phases
- CTA text
- About section

### 2. Auto-Generated JSON-LD: `_jsonld.ts`

The `_jsonld.ts` file automatically generates all JSON-LD schemas based on the config:
- WebPage schema
- BreadcrumbList
- Article schema
- SoftwareApplication schema
- HowTo schema (for implementation)
- ItemList (for industries)

### 3. Component Usage: `ProjectPulseContent.tsx`

The component reads from `_config.ts` instead of hardcoded values, ensuring consistency.

### 4. Page Integration: `page.tsx`

The page automatically uses the generated JSON-LD schemas.

## How to Update Content

### Step 1: Edit `_config.ts`

Simply update the text in `app/(site)/projectpulse/_config.ts`:

```typescript
export const projectPulseConfig = {
  hero: {
    title: "ProjectPulse", // ← Change this
    subtitle: "Project-to-Profit for Professional Services", // ← Or this
    // ... etc
  },
  // ...
};
```

### Step 2: That's It!

The system automatically:
- ✅ Updates the component display
- ✅ Updates JSON-LD schemas
- ✅ Updates SEO metadata
- ✅ Updates all related content

## File Structure

```
app/(site)/projectpulse/
├── _config.ts              ← Edit content here
├── _jsonld.ts              ← Auto-generates schemas (don't edit manually)
├── _components/
│   └── ProjectPulseContent.tsx  ← Reads from _config.ts
├── page.tsx                 ← Uses auto-generated JSON-LD
└── README.md               ← This file
```

## Benefits

1. **No Duplication**: Content is defined once, used everywhere
2. **Always in Sync**: Schemas match content automatically
3. **Easy Updates**: Change one file, everything updates
4. **Type Safety**: TypeScript ensures consistency
5. **SEO Optimized**: Schemas always reflect current content

## Example: Adding a New Industry

1. Open `_config.ts`
2. Add to `industries` array:
   ```typescript
   industries: [
     // ... existing
     "New Industry Name", // ← Add here
   ],
   ```
3. Add icon mapping in `ProjectPulseContent.tsx` if needed
4. Done! The industry appears in:
   - The page display
   - JSON-LD ItemList schema
   - Article "about" schema

## Example: Changing Hero Text

1. Open `_config.ts`
2. Update `hero.title` or `hero.subtitle`
3. Done! The change appears in:
   - Page display
   - JSON-LD WebPage schema
   - SEO metadata
   - Article headline

## Important Notes

- ⚠️ **Don't edit `_jsonld.ts` manually** - it's auto-generated
- ⚠️ **Don't hardcode text in components** - always use `projectPulseConfig`
- ✅ **Always edit `_config.ts`** for content changes
- ✅ **The system handles the rest automatically**

