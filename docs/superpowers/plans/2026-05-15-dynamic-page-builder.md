# Dynamic Page Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded homepage section list with a Sanity page builder — admin adds, reorders, and configures sections via drag-and-drop in Sanity Studio with live preview.

**Architecture:** `homePage` Sanity document gains a polymorphic `sections[]` array of 11 typed block objects. A new `PageBuilder` component maps each block's `_type` to the corresponding React component. `@sanity/presentation` plugin adds a split-screen live preview tab in Studio powered by Next.js draft mode.

**Tech Stack:** Next.js 15 App Router, Sanity 3, `@sanity/presentation`, Zustand, Framer Motion, Tailwind CSS, TypeScript

---

## File Structure

### New files
| Path | Responsibility |
|---|---|
| `sanity/schemaTypes/blocks/ctaButton.ts` | Shared CTA button object type |
| `sanity/schemaTypes/blocks/heroSection.ts` | Hero block schema |
| `sanity/schemaTypes/blocks/customBannerSection.ts` | Custom banner block schema |
| `sanity/schemaTypes/blocks/featuredProductsSection.ts` | Featured products block schema |
| `sanity/schemaTypes/blocks/bestSellersSection.ts` | Best sellers block schema |
| `sanity/schemaTypes/blocks/categoriesSection.ts` | Categories block schema |
| `sanity/schemaTypes/blocks/marqueeSection.ts` | Marquee strip block schema |
| `sanity/schemaTypes/blocks/scentBannerSection.ts` | Scent banner block schema |
| `sanity/schemaTypes/blocks/brandStorySection.ts` | Brand story block schema |
| `sanity/schemaTypes/blocks/testimonialsSection.ts` | Testimonials block schema |
| `sanity/schemaTypes/blocks/newsletterSection.ts` | Newsletter block schema |
| `sanity/schemaTypes/blocks/trustBarSection.ts` | Trust bar block schema |
| `sanity/schemaTypes/blocks/index.ts` | Barrel export for all block types |
| `components/PageBuilder.tsx` | Maps block `_type` → React component, filters hidden |
| `components/home/CustomBanner.tsx` | New full-width banner with overlay + CTA |
| `app/api/draft-mode/enable/route.ts` | Validates secret, enables Next.js draft mode |
| `app/api/draft-mode/disable/route.ts` | Disables Next.js draft mode |

### Modified files
| Path | Change |
|---|---|
| `sanity/schemaTypes/homePage.ts` | Replace flat fields with `sections[]` array |
| `sanity/schemaTypes/index.ts` | Export all block types |
| `sanity.config.ts` | Add `presentationTool` plugin |
| `lib/types.ts` | Add block interfaces, `CtaButton`, `Testimonial`, `HomePage` |
| `lib/sanity/client.ts` | Add `draftModeClient` export |
| `lib/sanity/queries.ts` | Replace `getHomePageQuery` with block-aware query |
| `lib/sanity/fetch.ts` | Draft-mode-aware `getHomePage`, import `Testimonial` from types |
| `components/home/Hero.tsx` | Accept `HeroSectionBlock` data shape |
| `components/home/ScentBanner.tsx` | Accept `ScentBannerSectionBlock` data shape |
| `components/home/BrandStory.tsx` | Accept `BrandStorySectionBlock` data shape |
| `components/home/FeaturedProducts.tsx` | Accept `FeaturedProductsSectionBlock` data shape |
| `components/home/BestSellers.tsx` | Accept `BestSellersSectionBlock` data shape |
| `components/home/Categories.tsx` | Accept `CategoriesSectionBlock` data shape |
| `components/home/MarqueeStrip.tsx` | Accept `MarqueeSectionBlock` data shape |
| `components/home/Newsletter.tsx` | Accept `NewsletterSectionBlock` data shape |
| `components/home/TrustBar.tsx` | Accept `TrustBarSectionBlock` data shape |
| `components/home/Testimonials.tsx` | Accept `TestimonialsSectionBlock` data shape |
| `app/page.tsx` | Fetch `homePage.sections`, render `<PageBuilder>` |

---

## Task 1: Install package and configure environment

**Files:**
- Modify: `package.json` (via npm)
- Modify: `.env.local`

- [ ] **Step 1: Install @sanity/presentation**

```bash
npm install @sanity/presentation
```

Expected output: `added N packages` with `@sanity/presentation` in `package.json` dependencies.

- [ ] **Step 2: Add env vars to .env.local**

Append to `.env.local`:

```
SANITY_PREVIEW_SECRET=replace-with-random-32-char-string
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SANITY_API_READ_TOKEN=
```

`SANITY_PREVIEW_SECRET`: any random string (32+ chars). Generate one with `openssl rand -hex 32`.
`SANITY_API_READ_TOKEN`: a Sanity API token with Viewer role — create at manage.sanity.io → API → Tokens. Required for draft document access in preview.

- [ ] **Step 3: Verify build still compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install @sanity/presentation"
```

---

## Task 2: Add TypeScript types for all block types

**Files:**
- Modify: `lib/types.ts`

- [ ] **Step 1: Append block types to lib/types.ts**

Add the following after the existing `SanityImageAsset` interface at the bottom of the file:

```typescript
// ─── Page Builder Types ───────────────────────────────────────────────────────

export interface CtaButton {
  label?: string
  link?: string
  style?: 'primary' | 'secondary' | 'ghost' | 'outline'
}

export interface Testimonial {
  _id: string
  name: string
  location: string
  rating: number
  review: string
  product?: {
    _id: string
    name: string
    slug: string
  }
}

export interface HeroSectionBlock {
  _type: 'heroSection'
  _key: string
  isVisible?: boolean
  headline?: string
  subheadline?: string
  bgImageUrl?: string
  bgImageAlt?: string
  bgVideo?: { url?: string; muxPlaybackId?: string }
  cta?: CtaButton
  textColor?: 'light' | 'dark'
}

export interface CustomBannerSectionBlock {
  _type: 'customBannerSection'
  _key: string
  isVisible?: boolean
  imageUrl?: string
  imageAlt?: string
  headline?: string
  subtext?: string
  overlayOpacity?: number
  cta?: CtaButton
  textAlign?: 'left' | 'center' | 'right'
}

export interface FeaturedProductsSectionBlock {
  _type: 'featuredProductsSection'
  _key: string
  isVisible?: boolean
  title?: string
  subtitle?: string
  products?: Product[]
  layout?: 'grid' | 'carousel'
}

export interface BestSellersSectionBlock {
  _type: 'bestSellersSection'
  _key: string
  isVisible?: boolean
  title?: string
  products?: Product[]
}

export interface CategoriesSectionBlock {
  _type: 'categoriesSection'
  _key: string
  isVisible?: boolean
  title?: string
  categories?: Category[]
}

export interface MarqueeSectionBlock {
  _type: 'marqueeSection'
  _key: string
  isVisible?: boolean
  text?: string
  speed?: number
}

export interface ScentBannerSectionBlock {
  _type: 'scentBannerSection'
  _key: string
  isVisible?: boolean
  eyebrow?: string
  headline?: string
  highlightWord?: string
  subtext?: string
  bgImageUrl?: string
  cta?: CtaButton
}

export interface BrandStorySectionBlock {
  _type: 'brandStorySection'
  _key: string
  isVisible?: boolean
  eyebrow?: string
  headline?: string
  body?: string
  imageUrl?: string
  imageAlt?: string
  imagePosition?: 'left' | 'right'
  cta?: CtaButton
}

export interface TestimonialsSectionBlock {
  _type: 'testimonialsSection'
  _key: string
  isVisible?: boolean
  title?: string
  testimonials?: Testimonial[]
}

export interface NewsletterSectionBlock {
  _type: 'newsletterSection'
  _key: string
  isVisible?: boolean
  headline?: string
  subtext?: string
  buttonLabel?: string
  bgImageUrl?: string
}

export interface TrustBarSectionBlock {
  _type: 'trustBarSection'
  _key: string
  isVisible?: boolean
  items?: Array<{ icon?: string; label?: string; value?: string }>
}

export type HomePageSection =
  | HeroSectionBlock
  | CustomBannerSectionBlock
  | FeaturedProductsSectionBlock
  | BestSellersSectionBlock
  | CategoriesSectionBlock
  | MarqueeSectionBlock
  | ScentBannerSectionBlock
  | BrandStorySectionBlock
  | TestimonialsSectionBlock
  | NewsletterSectionBlock
  | TrustBarSectionBlock

export interface HomePage {
  _id: string
  sections: HomePageSection[]
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add TypeScript types for page builder block types"
```

---

## Task 3: Create Sanity block schemas — simple blocks

**Files:**
- Create: `sanity/schemaTypes/blocks/ctaButton.ts`
- Create: `sanity/schemaTypes/blocks/heroSection.ts`
- Create: `sanity/schemaTypes/blocks/customBannerSection.ts`
- Create: `sanity/schemaTypes/blocks/marqueeSection.ts`
- Create: `sanity/schemaTypes/blocks/trustBarSection.ts`

- [ ] **Step 1: Create sanity/schemaTypes/blocks/ctaButton.ts**

```typescript
import { defineField, defineType } from 'sanity'

export const ctaButton = defineType({
  name: 'ctaButton',
  title: 'CTA Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'link',
      title: 'Link URL',
      type: 'string',
      description: 'Relative path (e.g. /products) or absolute URL.',
    }),
    defineField({
      name: 'style',
      title: 'Button Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary — gold filled', value: 'primary' },
          { title: 'Secondary — outlined gold', value: 'secondary' },
          { title: 'Ghost — transparent', value: 'ghost' },
          { title: 'Outline — cream border', value: 'outline' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'style' },
  },
})
```

- [ ] **Step 2: Create sanity/schemaTypes/blocks/heroSection.ts**

```typescript
import { defineField, defineType } from 'sanity'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(250),
    }),
    defineField({
      name: 'bgImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bgVideo',
      title: 'Background Video (optional)',
      type: 'object',
      fields: [
        defineField({ name: 'url', type: 'url', title: 'Video URL' }),
        defineField({ name: 'muxPlaybackId', type: 'string', title: 'Mux Playback ID' }),
      ],
    }),
    defineField({ name: 'cta', title: 'CTA Button', type: 'ctaButton' }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      options: {
        list: [
          { title: 'Light — white text (for dark backgrounds)', value: 'light' },
          { title: 'Dark — dark text (for light backgrounds)', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
    }),
  ],
  preview: {
    select: { title: 'headline', media: 'bgImage' },
    prepare: (val: { title?: string; media?: unknown }) => ({
      title: val.title ?? 'Hero',
      subtitle: 'heroSection',
      media: val.media,
    }),
  },
})
```

- [ ] **Step 3: Create sanity/schemaTypes/blocks/customBannerSection.ts**

```typescript
import { defineField, defineType } from 'sanity'

export const customBannerSection = defineType({
  name: 'customBannerSection',
  title: 'Custom Banner',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({
      name: 'image',
      title: 'Banner Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'overlayOpacity',
      title: 'Overlay Opacity (%)',
      type: 'number',
      description: '0 = no overlay, 100 = fully opaque black overlay',
      initialValue: 40,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({ name: 'cta', title: 'CTA Button', type: 'ctaButton' }),
    defineField({
      name: 'textAlign',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    }),
  ],
  preview: {
    select: { title: 'headline', media: 'image' },
    prepare: (val: { title?: string; media?: unknown }) => ({
      title: val.title ?? 'Custom Banner',
      subtitle: 'customBannerSection',
      media: val.media,
    }),
  },
})
```

- [ ] **Step 4: Create sanity/schemaTypes/blocks/marqueeSection.ts**

```typescript
import { defineField, defineType } from 'sanity'

export const marqueeSection = defineType({
  name: 'marqueeSection',
  title: 'Marquee Strip',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({
      name: 'text',
      title: 'Marquee Text',
      type: 'string',
      description: 'Text that scrolls. Separate items with  •  (bullet).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'speed',
      title: 'Scroll Speed (seconds)',
      type: 'number',
      description: 'Duration of one full scroll. Lower = faster.',
      initialValue: 30,
      validation: (Rule) => Rule.min(5).max(120),
    }),
  ],
  preview: {
    select: { title: 'text' },
    prepare: (val: { title?: string }) => ({ title: val.title ?? 'Marquee', subtitle: 'marqueeSection' }),
  },
})
```

- [ ] **Step 5: Create sanity/schemaTypes/blocks/trustBarSection.ts**

```typescript
import { defineField, defineType, defineArrayMember } from 'sanity'

export const trustBarSection = defineType({
  name: 'trustBarSection',
  title: 'Trust Bar',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({
      name: 'items',
      title: 'Trust Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'value', type: 'string', title: 'Value', description: 'e.g. "100%"' }),
            defineField({ name: 'label', type: 'string', title: 'Label', description: 'e.g. "Authentic"' }),
            defineField({ name: 'icon', type: 'string', title: 'Icon', description: 'emoji or lucide icon name' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),
  ],
  preview: {
    select: {},
    prepare: () => ({ title: 'Trust Bar', subtitle: 'trustBarSection' }),
  },
})
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add sanity/schemaTypes/blocks/
git commit -m "feat: add simple block schemas (hero, customBanner, marquee, trustBar, ctaButton)"
```

---

## Task 4: Create Sanity block schemas — content blocks with references

**Files:**
- Create: `sanity/schemaTypes/blocks/featuredProductsSection.ts`
- Create: `sanity/schemaTypes/blocks/bestSellersSection.ts`
- Create: `sanity/schemaTypes/blocks/categoriesSection.ts`
- Create: `sanity/schemaTypes/blocks/scentBannerSection.ts`
- Create: `sanity/schemaTypes/blocks/brandStorySection.ts`
- Create: `sanity/schemaTypes/blocks/testimonialsSection.ts`
- Create: `sanity/schemaTypes/blocks/newsletterSection.ts`
- Create: `sanity/schemaTypes/blocks/index.ts`

- [ ] **Step 1: Create sanity/schemaTypes/blocks/featuredProductsSection.ts**

```typescript
import { defineField, defineType, defineArrayMember } from 'sanity'

export const featuredProductsSection = defineType({
  name: 'featuredProductsSection',
  title: 'Featured Products',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title', title: 'Section Title', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({ name: 'subtitle', title: 'Section Subtitle', type: 'text', rows: 2, validation: (Rule) => Rule.max(200) }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      validation: (Rule) => Rule.required().min(1).max(8).unique(),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Carousel', value: 'carousel' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: (val: { title?: string }) => ({ title: val.title ?? 'Featured Products', subtitle: 'featuredProductsSection' }),
  },
})
```

- [ ] **Step 2: Create sanity/schemaTypes/blocks/bestSellersSection.ts**

```typescript
import { defineField, defineType, defineArrayMember } from 'sanity'

export const bestSellersSection = defineType({
  name: 'bestSellersSection',
  title: 'Best Sellers',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title', title: 'Section Title', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      description: 'Select products to feature as best sellers.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      validation: (Rule) => Rule.required().min(1).max(12).unique(),
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: (val: { title?: string }) => ({ title: val.title ?? 'Best Sellers', subtitle: 'bestSellersSection' }),
  },
})
```

- [ ] **Step 3: Create sanity/schemaTypes/blocks/categoriesSection.ts**

```typescript
import { defineField, defineType, defineArrayMember } from 'sanity'

export const categoriesSection = defineType({
  name: 'categoriesSection',
  title: 'Categories',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title', title: 'Section Title', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: (val: { title?: string }) => ({ title: val.title ?? 'Categories', subtitle: 'categoriesSection' }),
  },
})
```

- [ ] **Step 4: Create sanity/schemaTypes/blocks/scentBannerSection.ts**

```typescript
import { defineField, defineType } from 'sanity'

export const scentBannerSection = defineType({
  name: 'scentBannerSection',
  title: 'Scent Banner',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'eyebrow', title: 'Eyebrow Label', type: 'string', description: 'e.g. "Explore by Note"', validation: (Rule) => Rule.max(50) }),
    defineField({ name: 'headline', title: 'Headline', type: 'string', description: 'Use \\n to split into lines.', validation: (Rule) => Rule.max(80) }),
    defineField({ name: 'highlightWord', title: 'Highlighted Word(s)', type: 'string', description: 'Italic gold portion of headline, e.g. "A Story"', validation: (Rule) => Rule.max(40) }),
    defineField({ name: 'subtext', title: 'Body Text', type: 'text', rows: 3, validation: (Rule) => Rule.max(300) }),
    defineField({
      name: 'bgImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
    defineField({ name: 'cta', title: 'CTA Button', type: 'ctaButton' }),
  ],
  preview: {
    select: { title: 'headline', media: 'bgImage' },
    prepare: (val: { title?: string; media?: unknown }) => ({ title: val.title ?? 'Scent Banner', subtitle: 'scentBannerSection', media: val.media }),
  },
})
```

- [ ] **Step 5: Create sanity/schemaTypes/blocks/brandStorySection.ts**

```typescript
import { defineField, defineType } from 'sanity'

export const brandStorySection = defineType({
  name: 'brandStorySection',
  title: 'Brand Story',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'eyebrow', title: 'Eyebrow Label', type: 'string', description: 'e.g. "Our Philosophy"', validation: (Rule) => Rule.max(50) }),
    defineField({ name: 'headline', title: 'Headline', type: 'string', validation: (Rule) => Rule.max(100) }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'text',
      rows: 6,
      description: 'Separate paragraphs with a blank line.',
      validation: (Rule) => Rule.max(1000),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          { title: 'Right — text left, image right', value: 'right' },
          { title: 'Left — image left, text right', value: 'left' },
        ],
        layout: 'radio',
      },
      initialValue: 'right',
    }),
    defineField({ name: 'cta', title: 'CTA Button (optional)', type: 'ctaButton' }),
  ],
  preview: {
    select: { title: 'headline', media: 'image' },
    prepare: (val: { title?: string; media?: unknown }) => ({ title: val.title ?? 'Brand Story', subtitle: 'brandStorySection', media: val.media }),
  },
})
```

- [ ] **Step 6: Create sanity/schemaTypes/blocks/testimonialsSection.ts**

```typescript
import { defineField, defineType, defineArrayMember } from 'sanity'

export const testimonialsSection = defineType({
  name: 'testimonialsSection',
  title: 'Testimonials',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title', title: 'Section Title', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'testimonial' }] })],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: (val: { title?: string }) => ({ title: val.title ?? 'Testimonials', subtitle: 'testimonialsSection' }),
  },
})
```

- [ ] **Step 7: Create sanity/schemaTypes/blocks/newsletterSection.ts**

```typescript
import { defineField, defineType } from 'sanity'

export const newsletterSection = defineType({
  name: 'newsletterSection',
  title: 'Newsletter',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'headline', title: 'Headline', type: 'string', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'subtext', title: 'Subtext', type: 'text', rows: 2, validation: (Rule) => Rule.max(200) }),
    defineField({ name: 'buttonLabel', title: 'Button Label', type: 'string', initialValue: 'Subscribe', validation: (Rule) => Rule.max(40) }),
    defineField({
      name: 'bgImage',
      title: 'Background Image (optional)',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
  ],
  preview: {
    select: { title: 'headline', media: 'bgImage' },
    prepare: (val: { title?: string; media?: unknown }) => ({ title: val.title ?? 'Newsletter', subtitle: 'newsletterSection', media: val.media }),
  },
})
```

- [ ] **Step 8: Create sanity/schemaTypes/blocks/index.ts**

```typescript
export { ctaButton } from './ctaButton'
export { heroSection } from './heroSection'
export { customBannerSection } from './customBannerSection'
export { featuredProductsSection } from './featuredProductsSection'
export { bestSellersSection } from './bestSellersSection'
export { categoriesSection } from './categoriesSection'
export { marqueeSection } from './marqueeSection'
export { scentBannerSection } from './scentBannerSection'
export { brandStorySection } from './brandStorySection'
export { testimonialsSection } from './testimonialsSection'
export { newsletterSection } from './newsletterSection'
export { trustBarSection } from './trustBarSection'
```

- [ ] **Step 9: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 10: Commit**

```bash
git add sanity/schemaTypes/blocks/
git commit -m "feat: add content block schemas with product/category/testimonial refs"
```

---

## Task 5: Update homePage schema and schema index

**Files:**
- Modify: `sanity/schemaTypes/homePage.ts`
- Modify: `sanity/schemaTypes/index.ts`

- [ ] **Step 1: Replace sanity/schemaTypes/homePage.ts**

Replace the entire file content:

```typescript
import { defineField, defineType, defineArrayMember } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      description: 'Add, reorder, and toggle visibility of homepage sections.',
      of: [
        defineArrayMember({ type: 'heroSection' }),
        defineArrayMember({ type: 'customBannerSection' }),
        defineArrayMember({ type: 'featuredProductsSection' }),
        defineArrayMember({ type: 'bestSellersSection' }),
        defineArrayMember({ type: 'categoriesSection' }),
        defineArrayMember({ type: 'marqueeSection' }),
        defineArrayMember({ type: 'scentBannerSection' }),
        defineArrayMember({ type: 'brandStorySection' }),
        defineArrayMember({ type: 'testimonialsSection' }),
        defineArrayMember({ type: 'newsletterSection' }),
        defineArrayMember({ type: 'trustBarSection' }),
      ],
    }),
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preview: {
    select: {},
    prepare() {
      return { title: 'Home Page', subtitle: 'Singleton document' }
    },
  } as any,
})
```

- [ ] **Step 2: Replace sanity/schemaTypes/index.ts**

Replace the entire file content:

```typescript
import { SchemaTypeDefinition } from 'sanity'

import { product } from './product'
import { category } from './category'
import { homePage } from './homePage'
import { testimonial } from './testimonial'
import {
  ctaButton,
  heroSection,
  customBannerSection,
  featuredProductsSection,
  bestSellersSection,
  categoriesSection,
  marqueeSection,
  scentBannerSection,
  brandStorySection,
  testimonialsSection,
  newsletterSection,
  trustBarSection,
} from './blocks'

export const schemaTypes: SchemaTypeDefinition[] = [
  // ── Shared object types ────────────────────────────────────────
  ctaButton,

  // ── Block types ────────────────────────────────────────────────
  heroSection,
  customBannerSection,
  featuredProductsSection,
  bestSellersSection,
  categoriesSection,
  marqueeSection,
  scentBannerSection,
  brandStorySection,
  testimonialsSection,
  newsletterSection,
  trustBarSection,

  // ── Content documents ──────────────────────────────────────────
  product,
  category,
  testimonial,

  // ── Singleton page documents ───────────────────────────────────
  homePage,
]
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add sanity/schemaTypes/homePage.ts sanity/schemaTypes/index.ts
git commit -m "feat: refactor homePage schema to sections[] page builder array"
```

---

## Task 6: Update sanity.config.ts with Presentation tool

**Files:**
- Modify: `sanity.config.ts`

- [ ] **Step 1: Replace sanity.config.ts**

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from '@sanity/presentation'
import { schemaTypes } from './sanity/schemaTypes'
import { StudioLogo } from './sanity/components/StudioLogo'

export default defineConfig({
  name: 'default',
  title: 'Luxe Parfum',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        draftMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
  ],
  schema: { types: schemaTypes },
  studio: {
    components: {
      logo: StudioLogo,
    },
  },
})
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add sanity.config.ts
git commit -m "feat: add Presentation tool to Sanity Studio config"
```

---

## Task 7: Update Sanity client and data layer

**Files:**
- Modify: `lib/sanity/client.ts`
- Modify: `lib/sanity/queries.ts`
- Modify: `lib/sanity/fetch.ts`

- [ ] **Step 1: Replace lib/sanity/client.ts**

```typescript
import { createClient } from '@sanity/client'

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
}

export const client = createClient({
  ...config,
  useCdn: process.env.NODE_ENV === 'production',
})

export const draftModeClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'previewDrafts',
})
```

- [ ] **Step 2: Replace getHomePageQuery in lib/sanity/queries.ts**

Find and replace the `getHomePageQuery` constant (currently lines 116–139). Replace with:

```typescript
export const getHomePageQuery = `
  *[_type == "homePage"][0] {
    _id,
    "sections": sections[] {
      ...,
      "bgImageUrl": bgImage.asset->url,
      "bgImageAlt": bgImage.alt,
      "imageUrl": image.asset->url,
      "imageAlt": image.alt,
      "products": products[]->{
        _id,
        "id": _id,
        name,
        "slug": slug.current,
        price,
        compareAtPrice,
        description,
        "images": images[]{"url": asset->url, alt},
        "category": category->{ _id, name, "slug": slug.current },
        stock,
        featured,
        bestSeller,
        "new": new,
        fragranceFamily,
        topNotes,
        middleNotes,
        baseNotes,
        intensity,
        sillage,
        longevity,
        volume
      },
      "categories": categories[]->{
        _id,
        name,
        "slug": slug.current,
        description,
        image,
        order
      },
      "testimonials": testimonials[]->{
        _id,
        name,
        location,
        rating,
        review,
        "product": product->{ _id, name, "slug": slug.current }
      }
    }
  }
`
```

- [ ] **Step 3: Update lib/sanity/fetch.ts**

At the top of the file, update imports to:

```typescript
import { client, draftModeClient } from './client'
import { draftMode } from 'next/headers'
```

Update the type import line to include `HomePage` and `Testimonial`:

```typescript
import type { Product, Category, HomePage, Testimonial } from '../types'
```

Replace the `getHomePage` function:

```typescript
export async function getHomePage(): Promise<HomePage | null> {
  if (!isSanityConfigured) return null
  let useClient = client
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fetchOptions: any = { next: { revalidate: 60 } }
  try {
    const { isEnabled } = await draftMode()
    if (isEnabled) {
      useClient = draftModeClient
      fetchOptions = { cache: 'no-store' }
    }
  } catch {
    // draftMode() throws outside a request context (e.g. during static build)
  }
  return useClient.fetch<HomePage>(getHomePageQuery, {}, fetchOptions)
}
```

Remove the `Testimonial` interface from this file (it now lives in `lib/types.ts`).

Update `getTestimonials` return type to use the imported `Testimonial`:

```typescript
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSanityConfigured) return []
  return client.fetch<Testimonial[]>(
    getTestimonialsQuery,
    {},
    { next: { revalidate: 300 } }
  )
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add lib/sanity/client.ts lib/sanity/queries.ts lib/sanity/fetch.ts
git commit -m "feat: add draftModeClient and update homepage GROQ query for page builder blocks"
```

---

## Task 8: Create draft mode API routes

**Files:**
- Create: `app/api/draft-mode/enable/route.ts`
- Create: `app/api/draft-mode/disable/route.ts`

- [ ] **Step 1: Create app/api/draft-mode/enable/route.ts**

```typescript
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const secret = searchParams.get('secret')
  const redirectTo = searchParams.get('redirectTo') ?? '/'

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid secret', { status: 401 })
  }

  const { enable } = await draftMode()
  enable()

  redirect(redirectTo)
}
```

- [ ] **Step 2: Create app/api/draft-mode/disable/route.ts**

```typescript
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  const { disable } = await draftMode()
  disable()
  redirect('/')
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/api/draft-mode/
git commit -m "feat: add draft mode enable/disable API routes for Presentation tool"
```

---

## Task 9: Update Hero component

**Files:**
- Modify: `components/home/Hero.tsx`

- [ ] **Step 1: Replace the interface and import at top of Hero.tsx**

Replace lines 1–24 (the `'use client'` directive through the `HeroProps` interface):

```typescript
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { HeroSectionBlock } from '@/lib/types'

interface HeroProps {
  data?: HeroSectionBlock | null
}
```

- [ ] **Step 2: Replace data extraction lines in Hero.tsx**

Find lines 62–66 (currently `const title = data?.heroTitle ...`). Replace with:

```typescript
const title    = data?.headline    ?? 'Discover Your Signature Scent'
const subtitle = data?.subheadline ?? 'A curated collection of rare and extraordinary fragrances for the discerning soul'
const hasVideo = Boolean(data?.bgVideo?.url)
const cta      = data?.cta

const heroImageSrc = data?.bgImageUrl || '/images/categories/I1.webp'
```

- [ ] **Step 3: Replace the video src in Hero.tsx**

Find `src={data!.heroVideo}` and replace with:

```typescript
src={data?.bgVideo?.url ?? ''}
```

- [ ] **Step 4: Replace the two hardcoded CTA Link elements**

Find the `<motion.div>` containing the two `<Link>` elements (the "Shop Collection" and "Our Story" buttons, around lines 164–185). Replace it with:

```tsx
<motion.div
  variants={itemVariants}
  className="mb-11 flex flex-col gap-3 sm:flex-row sm:items-center"
>
  {cta?.link && (
    <Link
      href={cta.link}
      className={cn(
        'group inline-flex items-center justify-center gap-2.5 px-7 py-[11px]',
        'font-body text-[12px] font-semibold uppercase tracking-[0.2em]',
        'transition-all duration-300',
        cta.style === 'secondary'
          ? 'border border-gold-500/50 bg-transparent text-gold-400 hover:bg-gold-500/10'
          : cta.style === 'ghost'
          ? 'text-cream-100/65 hover:text-cream-100'
          : cta.style === 'outline'
          ? 'border border-cream-100/20 text-cream-100/65 hover:border-gold-400/50 hover:text-gold-400'
          : 'bg-gold-500 text-charcoal-950 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/25'
      )}
    >
      {cta.label ?? 'Shop Collection'}
      <ArrowRight
        size={11}
        strokeWidth={2.5}
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  )}
  {!cta?.link && (
    <Link
      href="/products"
      className="group inline-flex items-center justify-center gap-2.5 bg-gold-500 px-7 py-[11px] font-body text-[12px] font-semibold uppercase tracking-[0.2em] text-charcoal-950 transition-all duration-300 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/25"
    >
      Shop Collection
      <ArrowRight size={11} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  )}
</motion.div>
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add components/home/Hero.tsx
git commit -m "feat: update Hero component to accept HeroSectionBlock data shape"
```

---

## Task 10: Update ScentBanner component

**Files:**
- Modify: `components/home/ScentBanner.tsx`

- [ ] **Step 1: Replace interface import in ScentBanner.tsx**

Replace lines 1–19 (through the `ScentBannerProps` interface):

```typescript
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import type { ScentBannerSectionBlock } from '@/lib/types'

interface ScentBannerProps {
  data?: ScentBannerSectionBlock | null
}
```

- [ ] **Step 2: Replace data extraction in ScentBanner.tsx**

Find lines 36–43 (currently `const eyebrow = data?.scentBannerEyebrow ...`). Replace with:

```typescript
const eyebrow    = data?.eyebrow       ?? 'Explore by Note'
const titleMain  = data?.headline      ?? 'Every Scent\nTells'
const titleGold  = data?.highlightWord ?? 'A Story'
const bodyText   = data?.subtext       ?? 'Each note in our palette is a world unto itself — sourced from the finest gardens, distilled by master perfumers, composed to unfold on your skin.'
const bgImage    = data?.bgImageUrl    ?? '/images/products/default-product.jpeg'
```

- [ ] **Step 3: Replace the hardcoded CTA Link in ScentBanner.tsx**

Find the `<Link href="/products" ...>Browse All Fragrances</Link>` element (around line 115). Replace with:

```tsx
<Link
  href={data?.cta?.link ?? '/products'}
  className="group inline-flex items-center gap-3 border border-gold-500/40 bg-gold-500/10 px-8 py-3.5 font-body text-sm uppercase tracking-[0.2em] text-gold-400 transition-all duration-300 hover:bg-gold-500 hover:text-charcoal-950"
>
  {data?.cta?.label ?? 'Browse All Fragrances'}
  <ArrowRight size={13} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
</Link>
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add components/home/ScentBanner.tsx
git commit -m "feat: update ScentBanner component to accept ScentBannerSectionBlock"
```

---

## Task 11: Update BrandStory component

**Files:**
- Modify: `components/home/BrandStory.tsx`

- [ ] **Step 1: Replace interface import in BrandStory.tsx**

Replace lines 1–19 (through the `BrandStoryProps` interface):

```typescript
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion'
import { cn } from '@/lib/utils'
import type { BrandStorySectionBlock } from '@/lib/types'

interface BrandStoryProps {
  data?: BrandStorySectionBlock | null
}
```

- [ ] **Step 2: Replace data extraction in BrandStory.tsx**

Find lines 71–82 (currently `const eyebrow = data?.brandStoryEyebrow ...`). Replace with:

```typescript
const eyebrow = data?.eyebrow ?? 'Our Philosophy'
const title = data?.headline ?? 'The Art of Perfumery'
const brandImageSrc = data?.imageUrl ?? '/images/categories/I1.webp'

const paragraphs = data?.body
  ? data.body.split(/\n\n+/).filter(Boolean)
  : FALLBACK_PARAGRAPHS
```

- [ ] **Step 3: Update CTA in BrandStory.tsx**

Find the `if (line.type === 'cta')` block (around line 178). Replace the inner content to use `data?.cta`:

```typescript
if (line.type === 'cta') {
  const ctaLabel = data?.cta?.label ?? 'Discover Our Story'
  const ctaHref  = data?.cta?.link  ?? '/about'
  return (
    <motion.div
      key={i}
      custom={i}
      variants={lineVariants}
      initial="hidden"
      animate={isTextInView ? 'visible' : 'hidden'}
    >
      <Link
        href={ctaHref}
        className={cn(
          'inline-flex items-center gap-3 border border-cream-100/30 px-8 py-3.5',
          'font-body text-sm uppercase tracking-[0.2em] text-cream-100',
          'transition-all duration-300 hover:border-gold-500 hover:text-gold-400'
        )}
      >
        {ctaLabel}
      </Link>
    </motion.div>
  )
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add components/home/BrandStory.tsx
git commit -m "feat: update BrandStory component to accept BrandStorySectionBlock"
```

---

## Task 12: Update FeaturedProducts, BestSellers, and Categories components

**Files:**
- Modify: `components/home/FeaturedProducts.tsx`
- Modify: `components/home/BestSellers.tsx`
- Modify: `components/home/Categories.tsx`

- [ ] **Step 1: Update FeaturedProducts.tsx interface**

Find the `FeaturedProductsProps` interface (currently lines 29–31) and the existing import line. Keep the `Product` import and add the block import:

```typescript
import type { Product, FeaturedProductsSectionBlock } from '@/lib/types'

interface FeaturedProductsProps {
  data?: FeaturedProductsSectionBlock | null
}
```

Find all usages of `products` prop inside the component. Update the function signature from `{ products }` to `{ data }`, then add products extraction as the first line inside the function body:

```typescript
export default function FeaturedProducts({ data }: FeaturedProductsProps) {
  const products: Product[] = data?.products ?? []
  // rest of component unchanged
```

- [ ] **Step 2: Update BestSellers.tsx interface**

Find the `BestSellersProps` interface (currently lines 30–32). Keep the `Product` import and add the block import:

```typescript
import type { Product, BestSellersSectionBlock } from '@/lib/types'

interface BestSellersProps {
  data?: BestSellersSectionBlock | null
}
```

Update the function signature and add products extraction:

```typescript
export default function BestSellers({ data }: BestSellersProps) {
  const products: Product[] = data?.products ?? []
  // rest of component unchanged
```

- [ ] **Step 3: Update Categories.tsx interface**

Find the `CategoriesProps` interface (currently lines 12–14). Keep the `Category` import and add the block import:

```typescript
import type { Category, CategoriesSectionBlock } from '@/lib/types'

interface CategoriesProps {
  data?: CategoriesSectionBlock | null
}
```

Update the function signature and add categories extraction. Find `export default function Categories({ categories }`:

```typescript
export default function Categories({ data }: CategoriesProps) {
  const categories: Category[] = data?.categories ?? []
  // rest of component unchanged
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add components/home/FeaturedProducts.tsx components/home/BestSellers.tsx components/home/Categories.tsx
git commit -m "feat: update product/category section components to accept block data props"
```

---

## Task 13: Update MarqueeStrip, TrustBar, Newsletter, and Testimonials components

**Files:**
- Modify: `components/home/MarqueeStrip.tsx`
- Modify: `components/home/TrustBar.tsx`
- Modify: `components/home/Newsletter.tsx`
- Modify: `components/home/Testimonials.tsx`

- [ ] **Step 1: Update MarqueeStrip.tsx**

Add the import and props at the top, and update the function signature. The component currently has no imports at all. Add:

```typescript
import type { MarqueeSectionBlock } from '@/lib/types'

interface MarqueeStripProps {
  data?: MarqueeSectionBlock | null
}
```

Update the function signature from `export default function MarqueeStrip()` to:

```typescript
export default function MarqueeStrip({ data }: MarqueeStripProps) {
```

The component renders `ITEMS_A` and `ITEMS_B` as hardcoded arrays and uses CSS `animate-marquee`. The Sanity `data.text` field provides a custom text string. Update to use it if provided — split by ` • ` to get items:

Add this derivation before the `return`:

```typescript
const customItems = data?.text
  ? data.text.split('•').map((s) => s.trim()).filter(Boolean)
  : null
const rowA = customItems ?? ITEMS_A
const rowB = customItems ?? ITEMS_B
```

Replace `<Strip items={ITEMS_A} />` with `<Strip items={rowA} />` and `<Strip items={ITEMS_B} />` with `<Strip items={rowB} />`.

- [ ] **Step 2: Update TrustBar.tsx**

Add the import and props:

```typescript
import type { TrustBarSectionBlock } from '@/lib/types'

interface TrustBarProps {
  data?: TrustBarSectionBlock | null
}
```

Update the function signature:

```typescript
export default function TrustBar({ data }: TrustBarProps) {
```

TrustBar uses Lucide icons from a hardcoded `ITEMS` array. When `data?.items` is provided from Sanity, the `icon` field is an emoji string. Use two separate render paths to avoid TypeScript union type issues — no derived array needed.

Add this flag before the `return`:

```typescript
const hasCustomItems = Boolean(data?.items && data.items.length > 0)
```

Replace the entire JSX content inside `<section>` with:

```tsx
<div
  ref={ref}
  className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-charcoal-100/80 lg:grid-cols-4 lg:divide-y-0"
>
  {hasCustomItems
    ? data!.items!.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="group relative flex flex-col items-center gap-4 px-6 py-10 text-center transition-colors duration-300 hover:bg-cream-50/60 lg:flex-row lg:items-center lg:gap-6 lg:text-left"
        >
          <span className="text-xl text-gold-500">{item.icon ?? '✦'}</span>
          <div className="min-w-0 flex-1">
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal-800">
              {item.label ?? ''}
            </p>
            <p className="mt-0.5 font-body text-[11px] leading-relaxed text-charcoal-400">
              {item.value ?? ''}
            </p>
          </div>
        </motion.div>
      ))
    : ITEMS.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="group relative flex flex-col items-center gap-4 px-6 py-10 text-center transition-colors duration-300 hover:bg-cream-50/60 lg:flex-row lg:items-center lg:gap-6 lg:text-left"
        >
          <span className="absolute right-4 top-4 font-body text-[10px] font-light tracking-[0.1em] text-charcoal-200 lg:static lg:hidden">
            {item.label}
          </span>
          <item.icon
            className="h-[18px] w-[18px] flex-shrink-0 text-gold-500 transition-transform duration-500 group-hover:scale-110"
            strokeWidth={1.5}
          />
          <div className="min-w-0 flex-1">
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal-800">
              {item.title}
            </p>
            <p className="mt-0.5 font-body text-[11px] leading-relaxed text-charcoal-400">
              {item.sub}
            </p>
          </div>
          <span className="hidden font-body text-[10px] font-light tracking-[0.1em] text-charcoal-200 lg:block">
            {item.label}
          </span>
        </motion.div>
      ))
  }
</div>
```

- [ ] **Step 3: Update Newsletter.tsx**

Add the import and props:

```typescript
import type { NewsletterSectionBlock } from '@/lib/types'

interface NewsletterProps {
  data?: NewsletterSectionBlock | null
}
```

Update the function signature from `export default function Newsletter()` to:

```typescript
export default function Newsletter({ data }: NewsletterProps) {
```

Add data extraction before the `return`:

```typescript
const headline    = data?.headline    ?? 'Join The Inner Circle'
const subtext     = data?.subtext     ?? null
const buttonLabel = data?.buttonLabel ?? 'Subscribe'
```

In the JSX, find `Join The<br /><span className="italic text-gold-400">Inner Circle</span>` (around line 97) and replace it with:

```tsx
{headline}
```

Find the subscribe button label (currently text `Subscribe` in the submit button, around line 170+) and replace with `{buttonLabel}`.

The `PERKS` array is hardcoded and stays as-is (it's marketing copy that doesn't need to be CMS-driven).

- [ ] **Step 4: Update Testimonials.tsx**

The file currently imports `Testimonial` from `@/lib/sanity/fetch` (line 6). Replace that import:

```typescript
import type { TestimonialsSectionBlock, Testimonial } from '@/lib/types'
```

Replace the `TestimonialsProps` interface (lines 35–37):

```typescript
interface TestimonialsProps {
  data?: TestimonialsSectionBlock | null
}
```

Update the function signature. Find `export default function Testimonials({ testimonials }`:

```typescript
export default function Testimonials({ data }: TestimonialsProps) {
  const testimonials = data?.testimonials && data.testimonials.length > 0
    ? data.testimonials
    : FALLBACK
  // rest of component unchanged
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add components/home/MarqueeStrip.tsx components/home/TrustBar.tsx components/home/Newsletter.tsx components/home/Testimonials.tsx
git commit -m "feat: update MarqueeStrip, TrustBar, Newsletter, Testimonials to accept block data props"
```

---

## Task 14: Create CustomBanner component

**Files:**
- Create: `components/home/CustomBanner.tsx`

- [ ] **Step 1: Create components/home/CustomBanner.tsx**

```typescript
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CustomBannerSectionBlock } from '@/lib/types'

interface CustomBannerProps {
  data?: CustomBannerSectionBlock | null
}

export default function CustomBanner({ data }: CustomBannerProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const headline       = data?.headline       ?? ''
  const subtext        = data?.subtext        ?? ''
  const overlayOpacity = data?.overlayOpacity ?? 40
  const textAlign      = data?.textAlign      ?? 'center'
  const imageSrc       = data?.imageUrl       ?? '/images/categories/I1.webp'
  const imageAlt       = data?.imageAlt       ?? ''
  const cta            = data?.cta

  const alignClass =
    textAlign === 'left'  ? 'items-start text-left'  :
    textAlign === 'right' ? 'items-end text-right'   :
    'items-center text-center'

  return (
    <section ref={ref} className="relative w-full overflow-hidden" style={{ minHeight: '480px' }}>
      {/* Background image */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover object-center"
        quality={90}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-charcoal-950"
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'relative z-10 flex h-full min-h-[480px] flex-col justify-center px-8 py-20 md:px-16 lg:px-24',
          alignClass
        )}
      >
        {headline && (
          <h2
            className={cn(
              'font-display text-4xl font-light leading-tight text-cream-50 md:text-6xl',
              textAlign === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'
            )}
          >
            {headline}
          </h2>
        )}

        {subtext && (
          <p
            className={cn(
              'mt-6 font-body text-base font-light leading-relaxed text-cream-100/70',
              textAlign === 'center' ? 'max-w-xl mx-auto' : 'max-w-xl'
            )}
          >
            {subtext}
          </p>
        )}

        {cta?.link && (
          <div className={cn('mt-8', textAlign === 'center' && 'flex justify-center')}>
            <Link
              href={cta.link}
              className={cn(
                'group inline-flex items-center gap-2.5 px-7 py-[11px]',
                'font-body text-[12px] font-semibold uppercase tracking-[0.2em]',
                'transition-all duration-300',
                cta.style === 'secondary'
                  ? 'border border-gold-500/50 text-gold-400 hover:bg-gold-500/10'
                  : cta.style === 'ghost'
                  ? 'text-cream-100/65 hover:text-cream-100'
                  : cta.style === 'outline'
                  ? 'border border-cream-100/30 text-cream-100 hover:border-gold-500 hover:text-gold-400'
                  : 'bg-gold-500 text-charcoal-950 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/25'
              )}
            >
              {cta.label}
              <ArrowRight size={11} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/home/CustomBanner.tsx
git commit -m "feat: create CustomBanner component for full-width configurable banners"
```

---

## Task 15: Create PageBuilder component and update app/page.tsx

**Files:**
- Create: `components/PageBuilder.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create components/PageBuilder.tsx**

```typescript
import type { HomePageSection } from '@/lib/types'
import Hero from '@/components/home/Hero'
import CustomBanner from '@/components/home/CustomBanner'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import BestSellers from '@/components/home/BestSellers'
import Categories from '@/components/home/Categories'
import MarqueeStrip from '@/components/home/MarqueeStrip'
import ScentBanner from '@/components/home/ScentBanner'
import BrandStory from '@/components/home/BrandStory'
import Testimonials from '@/components/home/Testimonials'
import Newsletter from '@/components/home/Newsletter'
import TrustBar from '@/components/home/TrustBar'

interface PageBuilderProps {
  sections?: HomePageSection[]
}

export default function PageBuilder({ sections = [] }: PageBuilderProps) {
  const visible = sections.filter((s) => s.isVisible !== false)

  return (
    <>
      {visible.map((section) => {
        switch (section._type) {
          case 'heroSection':
            return <Hero key={section._key} data={section} />
          case 'customBannerSection':
            return <CustomBanner key={section._key} data={section} />
          case 'featuredProductsSection':
            return <FeaturedProducts key={section._key} data={section} />
          case 'bestSellersSection':
            return <BestSellers key={section._key} data={section} />
          case 'categoriesSection':
            return <Categories key={section._key} data={section} />
          case 'marqueeSection':
            return <MarqueeStrip key={section._key} data={section} />
          case 'scentBannerSection':
            return <ScentBanner key={section._key} data={section} />
          case 'brandStorySection':
            return <BrandStory key={section._key} data={section} />
          case 'testimonialsSection':
            return <Testimonials key={section._key} data={section} />
          case 'newsletterSection':
            return <Newsletter key={section._key} data={section} />
          case 'trustBarSection':
            return <TrustBar key={section._key} data={section} />
          default:
            return null
        }
      })}
    </>
  )
}
```

- [ ] **Step 2: Replace app/page.tsx**

```typescript
import PageBuilder from '@/components/PageBuilder'
import { getHomePage } from '@/lib/sanity/fetch'

export default async function HomePage() {
  const homePage = await getHomePage()

  return <PageBuilder sections={homePage?.sections} />
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Verify the dev server starts without errors**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: homepage renders (may show fallback content if Sanity homePage document has no sections yet — that is correct behaviour).

- [ ] **Step 5: Verify the build succeeds**

```bash
npm run build
```

Expected: Build completes without TypeScript or runtime errors.

- [ ] **Step 6: Commit**

```bash
git add components/PageBuilder.tsx app/page.tsx
git commit -m "feat: create PageBuilder component and wire up homepage to dynamic section rendering"
```

---

## Task 16: Seed initial homePage sections in Sanity Studio

> This task is performed manually in the browser, not in code.

- [ ] **Step 1: Start the dev server and open Studio**

```bash
npm run dev
```

Open `http://localhost:3000/studio`.

- [ ] **Step 2: Create or open the homePage document**

In the Studio sidebar, click **Home Page**. If no document exists, click **Create new**.

- [ ] **Step 3: Add sections matching the current hardcoded layout**

Click **Add item** and add these sections in order (matching the current `app/page.tsx` hardcoded layout):

1. Hero — fill headline, subheadline, bgImage, cta
2. Trust Bar — add 4 items (Shipping, Authentic, Gifting, Returns)
3. Featured Products — select products, layout: Grid
4. Categories — select categories
5. Marquee Strip — add text with bullets
6. Best Sellers — select products
7. Scent Banner — fill eyebrow, headline, highlightWord, subtext, bgImage, cta
8. Testimonials — select testimonials
9. Brand Story — fill eyebrow, headline, body, image, cta
10. Newsletter — fill headline, subtext, buttonLabel

- [ ] **Step 4: Publish the homePage document**

Click **Publish**. Open `http://localhost:3000` and verify all sections render correctly.

- [ ] **Step 5: Test the Presentation tool**

In Studio, click the **Presentation** tab. Verify the homepage renders in the right iframe. Edit a field (e.g. Hero headline). Verify the preview updates after save.

---

## Verification Checklist

After all tasks are complete:

- [ ] `npx tsc --noEmit` — no TypeScript errors
- [ ] `npm run build` — build succeeds
- [ ] Homepage at `http://localhost:3000` renders all sections
- [ ] `/studio` → Presentation tab shows live preview iframe
- [ ] Adding a new section in Studio and publishing shows it on the homepage
- [ ] Toggling `isVisible: false` on a section hides it on the homepage
- [ ] Reordering sections in Studio changes order on the homepage
- [ ] Draft mode: editing in Presentation tool shows changes in preview iframe without publishing
