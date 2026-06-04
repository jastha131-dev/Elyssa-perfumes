# Journal Author Pages, Category Pages & Gift Card — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add author profile pages, article category filter pages, and a gift card purchase flow (with code shown on success) to the Luxe Parfum Next.js 15 / Sanity / Stripe site.

**Architecture:** Three feature tracks share a foundation pass (schemas → types → queries → fetch), then diverge into frontend routes. Gift cards add two API routes following the existing `app/api/auth/register` and `app/api/checkout` patterns. All new routes are locale-aware (`app/[locale]/...`) with bilingual text via `isAr ? x_ar || x_en : x_en`.

**Tech Stack:** Next.js 15 App Router, Sanity (GROQ + write client via `SANITY_API_TOKEN`), Stripe Checkout, TypeScript, Tailwind CSS

---

## File Map

### New files
| Path | Purpose |
|------|---------|
| `sanity/schemaTypes/author.ts` | Author document schema |
| `sanity/schemaTypes/giftCardPage.ts` | Gift card page singleton schema |
| `sanity/schemaTypes/giftCardOrder.ts` | Gift card order record schema |
| `app/[locale]/journal/author/[slug]/page.tsx` | Author profile + articles page |
| `app/[locale]/journal/category/[slug]/page.tsx` | Category-filtered article listing |
| `app/[locale]/gift-cards/page.tsx` | Gift card purchase page (server + client form) |
| `app/[locale]/gift-cards/GiftCardPurchaseForm.tsx` | Client component: denomination picker + form |
| `app/[locale]/gift-cards/success/page.tsx` | Success page (server, reads Stripe session) |
| `app/[locale]/gift-cards/success/CopyCode.tsx` | Client component: copy-to-clipboard code display |
| `app/api/gift-cards/checkout/route.ts` | POST: generate code, create Sanity order, create Stripe session |
| `app/api/gift-cards/session/route.ts` | GET: retrieve Stripe session, return code |

### Modified files
| Path | Change |
|------|--------|
| `sanity/schemaTypes/article.ts` | Add optional `author` reference field |
| `sanity/schemaTypes/index.ts` | Register `author`, `giftCardPage`, `giftCardOrder` |
| `lib/types.ts` | Add `Author`, `AuthorWithArticles`, `GiftCardPageData`, `GiftCardDenomination`, `GiftCardHowItWorksStep`, `GiftCardOrder`; update `ArticleSummary` + `ArticleDetail` |
| `lib/sanity/queries.ts` | Add author fragment + projection to existing article queries; add `getAuthorsQuery`, `getAuthorBySlugQuery`, `getArticlesByCategoryQuery`, `getGiftCardPageQuery` |
| `lib/sanity/fetch.ts` | Add `getAuthors`, `getAuthorBySlug`, `getArticlesByCategory`, `getGiftCardPage` |
| `app/[locale]/journal/page.tsx` | Category badges become `<Link>` tags |
| `app/[locale]/journal/[slug]/page.tsx` | Show linked author name + linked category badge |

---

## Task 1: Author Sanity Schema

**Files:**
- Create: `sanity/schemaTypes/author.ts`

- [ ] **Create the author schema file**

```typescript
// sanity/schemaTypes/author.ts
import { defineField, defineType } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name_en',
      title: 'Name (English)',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'name_ar',
      title: 'الاسم (Arabic)',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name_en', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role_en',
      title: 'Role (English)',
      type: 'string',
      description: 'e.g. Fragrance Writer',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'role_ar',
      title: 'الدور (Arabic)',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'bio_en',
      title: 'Bio (English)',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'bio_ar',
      title: 'السيرة الذاتية (Arabic)',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule) => Rule.max(120) }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name_en', subtitle: 'role_en', media: 'photo' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({ title: val.title, subtitle: val.subtitle, media: val.media }),
  },
})
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors in `author.ts`

---

## Task 2: Gift Card Sanity Schemas

**Files:**
- Create: `sanity/schemaTypes/giftCardPage.ts`
- Create: `sanity/schemaTypes/giftCardOrder.ts`

- [ ] **Create giftCardPage schema**

```typescript
// sanity/schemaTypes/giftCardPage.ts
import { defineField, defineType, defineArrayMember } from 'sanity'

export const giftCardPage = defineType({
  name: 'giftCardPage',
  title: 'Gift Card Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'headline_en', title: 'Headline (English)', type: 'string', validation: (Rule) => Rule.required().max(120) }),
    defineField({ name: 'headline_ar', title: 'العنوان (Arabic)', type: 'string', validation: (Rule) => Rule.max(120) }),
    defineField({ name: 'subtext_en', title: 'Subtext (English)', type: 'text', rows: 3, validation: (Rule) => Rule.max(300) }),
    defineField({ name: 'subtext_ar', title: 'النص الفرعي (Arabic)', type: 'text', rows: 3, validation: (Rule) => Rule.max(300) }),
    defineField({
      name: 'denominations',
      title: 'Denominations',
      type: 'array',
      validation: (Rule) => Rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label_en', title: 'Label (English)', type: 'string', description: 'e.g. Perfect for beginners', validation: (Rule) => Rule.required().max(80) }),
            defineField({ name: 'label_ar', title: 'التسمية (Arabic)', type: 'string', validation: (Rule) => Rule.max(80) }),
            defineField({ name: 'amountCents', title: 'Amount (cents)', type: 'number', description: 'e.g. 10000 for $100', validation: (Rule) => Rule.required().min(100) }),
            defineField({ name: 'popular', title: 'Mark as Popular', type: 'boolean', initialValue: false }),
          ],
          preview: {
            select: { title: 'label_en', subtitle: 'amountCents' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare: (val: any) => ({ title: val.title, subtitle: `$${Math.round(val.amountCents / 100)}` }),
          },
        }),
      ],
    }),
    defineField({
      name: 'howItWorks',
      title: 'How It Works Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'step', title: 'Step Number', type: 'number', validation: (Rule) => Rule.required().min(1) }),
            defineField({ name: 'text_en', title: 'Step Text (English)', type: 'string', validation: (Rule) => Rule.required().max(150) }),
            defineField({ name: 'text_ar', title: 'نص الخطوة (Arabic)', type: 'string', validation: (Rule) => Rule.max(150) }),
          ],
          preview: {
            select: { title: 'text_en', subtitle: 'step' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare: (val: any) => ({ title: val.title, subtitle: `Step ${val.subtitle}` }),
          },
        }),
      ],
    }),
    defineField({ name: 'terms_en', title: 'Terms & Conditions (English)', type: 'text', rows: 4 }),
    defineField({ name: 'terms_ar', title: 'الشروط والأحكام (Arabic)', type: 'text', rows: 4 }),
  ],
})
```

- [ ] **Create giftCardOrder schema**

```typescript
// sanity/schemaTypes/giftCardOrder.ts
import { defineField, defineType } from 'sanity'

export const giftCardOrder = defineType({
  name: 'giftCardOrder',
  title: 'Gift Card Order',
  type: 'document',
  fields: [
    defineField({ name: 'code', title: 'Gift Card Code', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'amountCents', title: 'Amount (cents)', type: 'number', validation: (Rule) => Rule.required().min(1) }),
    defineField({ name: 'currency', title: 'Currency', type: 'string', initialValue: 'usd', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'pending',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'stripeSessionId', title: 'Stripe Session ID', type: 'string' }),
    defineField({ name: 'recipientName', title: 'Recipient Name', type: 'string' }),
    defineField({ name: 'message', title: 'Personal Message', type: 'text', rows: 3 }),
    defineField({ name: 'createdAt', title: 'Created At', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'code', subtitle: 'status', amount: 'amountCents' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({ title: val.title, subtitle: `${val.subtitle} · $${Math.round(val.amount / 100)}` }),
  },
})
```

---

## Task 3: Register New Schemas in index.ts

**Files:**
- Modify: `sanity/schemaTypes/index.ts`

- [ ] **Add imports and register all three new schemas**

At the top of `sanity/schemaTypes/index.ts`, add after the existing imports:

```typescript
import { author } from './author'
import { giftCardPage } from './giftCardPage'
import { giftCardOrder } from './giftCardOrder'
```

In the `schemaTypes` array, add inside `// ── Content documents ──` section:

```typescript
  author,
```

Add inside `// ── Singleton page documents ──` section:

```typescript
  giftCardPage,
```

Add inside `// ── Content documents ──` section (after `order`):

```typescript
  giftCardOrder,
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors

- [ ] **Commit**

```bash
git add sanity/schemaTypes/author.ts sanity/schemaTypes/giftCardPage.ts sanity/schemaTypes/giftCardOrder.ts sanity/schemaTypes/index.ts
git commit -m "feat(sanity): add author, giftCardPage, giftCardOrder schemas"
```

---

## Task 4: Update article.ts — Add author Reference Field

**Files:**
- Modify: `sanity/schemaTypes/article.ts`

- [ ] **Add optional author reference to the meta group, after the `category` field**

In `sanity/schemaTypes/article.ts`, after the `category` field definition, insert:

```typescript
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'meta',
    }),
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add sanity/schemaTypes/article.ts
git commit -m "feat(sanity): add optional author reference to article schema"
```

---

## Task 5: TypeScript Types

**Files:**
- Modify: `lib/types.ts`

- [ ] **Add Author and AuthorWithArticles interfaces**

At the bottom of `lib/types.ts`, before the final closing, add:

```typescript
// ─── Author Types ─────────────────────────────────────────────────────────────

export interface Author {
  _id: string
  name_en: string
  name_ar?: string
  slug: string
  role_en?: string
  role_ar?: string
  bio_en?: string
  bio_ar?: string
  photoUrl?: string
}

export interface AuthorWithArticles extends Author {
  articles?: ArticleSummary[]
}
```

- [ ] **Update ArticleSummary to include optional author**

Find the existing `ArticleSummary` interface (around line 862) and add `author?: Author` field:

```typescript
export interface ArticleSummary {
  _id: string
  title_en: string
  title_ar?: string
  slug: string
  category?: string
  excerpt_en?: string
  excerpt_ar?: string
  coverImageUrl?: string
  coverImageAlt?: string
  readTime?: string
  publishedAt?: string
  featured?: boolean
  author?: Author
}
```

- [ ] **Add Gift Card types**

At the bottom of `lib/types.ts`, add:

```typescript
// ─── Gift Card Types ──────────────────────────────────────────────────────────

export interface GiftCardDenomination {
  _key: string
  label_en: string
  label_ar?: string
  amountCents: number
  popular?: boolean
}

export interface GiftCardHowItWorksStep {
  _key: string
  step: number
  text_en: string
  text_ar?: string
}

export interface GiftCardPageData {
  _id: string
  headline_en?: string
  headline_ar?: string
  subtext_en?: string
  subtext_ar?: string
  denominations?: GiftCardDenomination[]
  howItWorks?: GiftCardHowItWorksStep[]
  terms_en?: string
  terms_ar?: string
}

export interface GiftCardOrder {
  _id: string
  code: string
  amountCents: number
  currency: string
  status: 'pending' | 'paid'
  stripeSessionId?: string
  recipientName?: string
  message?: string
  createdAt?: string
}
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add lib/types.ts
git commit -m "feat(types): add Author, AuthorWithArticles, GiftCard types; extend ArticleSummary"
```

---

## Task 6: GROQ Queries

**Files:**
- Modify: `lib/sanity/queries.ts`

- [ ] **Add authorFragment constant near the top of queries.ts (after the existing categoryFragment)**

```typescript
const authorFragment = `
  _id,
  name_en, name_ar,
  "slug": slug.current,
  role_en, role_ar,
  bio_en, bio_ar,
  "photoUrl": photo.asset->url
`
```

- [ ] **Update getArticlesQuery to project author data**

Replace the existing `getArticlesQuery`:

```typescript
export const getArticlesQuery = `
  *[_type == "article"] | order(publishedAt desc) {
    _id,
    title_en, title_ar,
    "slug": slug.current,
    category,
    excerpt_en, excerpt_ar,
    "coverImageUrl": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    readTime,
    publishedAt,
    featured,
    "author": author->{ ${authorFragment} }
  }
`
```

- [ ] **Update getArticleBySlugQuery to project author data**

Replace the existing `getArticleBySlugQuery`:

```typescript
export const getArticleBySlugQuery = `
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title_en, title_ar,
    "slug": slug.current,
    category,
    excerpt_en, excerpt_ar,
    "coverImageUrl": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    body_en, body_ar,
    readTime,
    publishedAt,
    featured,
    "author": author->{ ${authorFragment} },
    seoTitle_en, seoTitle_ar,
    seoDescription_en, seoDescription_ar
  }
`
```

- [ ] **Add new author + category + gift card queries at the bottom of queries.ts**

```typescript
// ─── Author Queries ───────────────────────────────────────────────────────────

export const getAuthorsQuery = `
  *[_type == "author"] | order(name_en asc) {
    ${authorFragment}
  }
`

export const getAuthorBySlugQuery = `
  *[_type == "author" && slug.current == $slug][0] {
    ${authorFragment},
    "articles": *[_type == "article" && author._ref == ^._id] | order(publishedAt desc) {
      _id,
      title_en, title_ar,
      "slug": slug.current,
      category,
      excerpt_en, excerpt_ar,
      "coverImageUrl": coverImage.asset->url,
      "coverImageAlt": coverImage.alt,
      readTime,
      publishedAt,
      featured
    }
  }
`

// ─── Article Category Queries ─────────────────────────────────────────────────

export const getArticlesByCategoryQuery = `
  *[_type == "article" && category == $category] | order(publishedAt desc) {
    _id,
    title_en, title_ar,
    "slug": slug.current,
    category,
    excerpt_en, excerpt_ar,
    "coverImageUrl": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    readTime,
    publishedAt,
    featured,
    "author": author->{ ${authorFragment} }
  }
`

// ─── Gift Card Queries ────────────────────────────────────────────────────────

export const getGiftCardPageQuery = `
  *[_type == "giftCardPage"][0] {
    _id,
    headline_en, headline_ar,
    subtext_en, subtext_ar,
    "denominations": denominations[]{ _key, label_en, label_ar, amountCents, popular },
    "howItWorks": howItWorks[]{ _key, step, text_en, text_ar },
    terms_en, terms_ar
  }
`
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add lib/sanity/queries.ts
git commit -m "feat(queries): add author projection, category filter, gift card queries"
```

---

## Task 7: Fetch Functions

**Files:**
- Modify: `lib/sanity/fetch.ts`

- [ ] **Add new imports at the top of fetch.ts**

In the import block from `./queries`, add the four new query names:

```typescript
import {
  // ...existing imports...
  getAuthorsQuery,
  getAuthorBySlugQuery,
  getArticlesByCategoryQuery,
  getGiftCardPageQuery,
} from './queries'
```

In the type imports from `../types`, add:

```typescript
import type {
  // ...existing imports...
  AuthorWithArticles,
  Author,
  GiftCardPageData,
} from '../types'
```

- [ ] **Add four new fetch functions at the bottom of the Articles section**

```typescript
export async function getAuthors(): Promise<Author[]> {
  if (!isSanityConfigured) return []
  return client.fetch<Author[]>(getAuthorsQuery, {}, { next: { revalidate: 300 } })
}

export async function getAuthorBySlug(slug: string): Promise<AuthorWithArticles | null> {
  if (!isSanityConfigured) return null
  return client.fetch<AuthorWithArticles | null>(
    getAuthorBySlugQuery,
    { slug },
    { next: { revalidate: 300 } }
  )
}

export async function getArticlesByCategory(category: string): Promise<import('../types').ArticleSummary[]> {
  if (!isSanityConfigured) return []
  return client.fetch(getArticlesByCategoryQuery, { category }, { next: { revalidate: 300 } })
}

export async function getGiftCardPage(): Promise<GiftCardPageData | null> {
  if (!isSanityConfigured) return null
  return client.fetch<GiftCardPageData | null>(
    getGiftCardPageQuery,
    {},
    { next: { revalidate: 300 } }
  )
}
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add lib/sanity/fetch.ts
git commit -m "feat(fetch): add getAuthors, getAuthorBySlug, getArticlesByCategory, getGiftCardPage"
```

---

## Task 8: Author Page Route

**Files:**
- Create: `app/[locale]/journal/author/[slug]/page.tsx`

- [ ] **Create the author page**

```typescript
// app/[locale]/journal/author/[slug]/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAuthorBySlug, getAuthors } from '@/lib/sanity/fetch'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 300

export async function generateStaticParams() {
  try {
    const authors = await getAuthors()
    return authors.map((a) => ({ slug: a.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) return { title: 'Author Not Found' }
  const isAr = locale === 'ar'
  const name = isAr ? (author.name_ar || author.name_en) : author.name_en
  const role = isAr ? (author.role_ar || author.role_en) : author.role_en
  return {
    title: `${name}${role ? ` — ${role}` : ''} | Luxe Parfum Journal`,
    description: isAr ? (author.bio_ar || author.bio_en) : author.bio_en,
    ...(author.photoUrl ? { openGraph: { images: [{ url: author.photoUrl }] } } : {}),
  }
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const isAr = locale === 'ar'
  const author = await getAuthorBySlug(slug)
  if (!author) notFound()

  const name = isAr ? (author.name_ar || author.name_en) : author.name_en
  const role = isAr ? (author.role_ar || author.role_en) : author.role_en
  const bio = isAr ? (author.bio_ar || author.bio_en) : author.bio_en
  const articles = author.articles ?? []

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/journal`}
          className="mb-10 inline-flex items-center gap-2 font-body text-xs text-charcoal-400 hover:text-gold-500 transition-colors"
        >
          <ArrowLeft size={13} /> Back to Journal
        </Link>

        {/* Author hero */}
        <div className="mb-16 flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-8">
          {author.photoUrl ? (
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-gold-200">
              <Image
                src={author.photoUrl}
                alt={name}
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-charcoal-100 border-2 border-gold-200">
              <span className="font-display text-4xl font-light text-gold-500">{name.charAt(0)}</span>
            </div>
          )}
          <div>
            {role && (
              <p className="mb-1 font-body text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-500">
                {role}
              </p>
            )}
            <h1 className="font-display text-3xl font-light text-charcoal-900 md:text-4xl">{name}</h1>
            {bio && (
              <p className="mt-4 max-w-xl font-body text-sm font-light leading-relaxed text-charcoal-500">
                {bio}
              </p>
            )}
          </div>
        </div>

        <div className="mb-12 h-px w-full bg-charcoal-100" />

        {/* Articles by this author */}
        <div className="mb-8">
          <p className="font-body text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-500">
            Articles by {name}
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-body text-sm text-charcoal-400">No articles published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const title = isAr ? (article.title_ar || article.title_en) : article.title_en
              const excerpt = isAr
                ? (article.excerpt_ar || article.excerpt_en)
                : article.excerpt_en
              return (
                <Link
                  key={article._id}
                  href={`/${locale}/journal/${article.slug}`}
                  className="group block"
                >
                  <div className="overflow-hidden bg-charcoal-100 aspect-[16/9]">
                    {article.coverImageUrl ? (
                      <Image
                        src={article.coverImageUrl}
                        alt={article.coverImageAlt || title}
                        width={800}
                        height={450}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-charcoal-800 to-charcoal-900 flex items-center justify-center">
                        <span className="font-display text-4xl font-light text-gold-500/30">
                          {title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-3">
                      {article.category && (
                        <span className="font-body text-[9px] font-semibold uppercase tracking-[0.3em] text-gold-500">
                          {article.category}
                        </span>
                      )}
                      {article.readTime && (
                        <span className="font-body text-[9px] text-charcoal-400">
                          {article.readTime}
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-lg font-light text-charcoal-900 transition-colors group-hover:text-gold-600 leading-snug">
                      {title}
                    </h2>
                    {excerpt && (
                      <p className="mt-2 font-body text-sm font-light leading-relaxed text-charcoal-500 line-clamp-2">
                        {excerpt}
                      </p>
                    )}
                    {article.publishedAt && (
                      <p className="mt-3 font-body text-[10px] text-charcoal-400">
                        {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add app/\[locale\]/journal/author/
git commit -m "feat: add author profile page at /journal/author/[slug]"
```

---

## Task 9: Article Category Page Route

**Files:**
- Create: `app/[locale]/journal/category/[slug]/page.tsx`

- [ ] **Create the category page**

```typescript
// app/[locale]/journal/category/[slug]/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticlesByCategory } from '@/lib/sanity/fetch'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 300

const CATEGORY_MAP: Record<string, string> = {
  guide: 'Guide',
  education: 'Education',
  'behind-the-scenes': 'Behind the Scenes',
  inspiration: 'Inspiration',
  news: 'News',
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = CATEGORY_MAP[slug]
  if (!category) return { title: 'Category Not Found' }
  return {
    title: `${category} — Journal | Luxe Parfum`,
    description: `Browse all ${category} articles from Luxe Parfum.`,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const isAr = locale === 'ar'
  const category = CATEGORY_MAP[slug]
  if (!category) notFound()

  const articles = await getArticlesByCategory(category)

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/journal`}
          className="mb-10 inline-flex items-center gap-2 font-body text-xs text-charcoal-400 hover:text-gold-500 transition-colors"
        >
          <ArrowLeft size={13} /> Back to Journal
        </Link>

        <div className="mb-16 text-center">
          <p className="mb-3 font-body text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-500">
            Journal
          </p>
          <h1 className="font-display text-4xl font-light text-charcoal-900 md:text-6xl">
            {category}
          </h1>
          <div className="mx-auto mt-4 h-px w-12 bg-gold-400/50" />
        </div>

        {articles.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-body text-sm text-charcoal-400">
              No articles in this category yet.
            </p>
            <Link
              href={`/${locale}/journal`}
              className="mt-4 inline-block font-body text-xs text-gold-500 underline-offset-2 hover:underline"
            >
              Browse all articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const title = isAr ? (article.title_ar || article.title_en) : article.title_en
              const excerpt = isAr
                ? (article.excerpt_ar || article.excerpt_en)
                : article.excerpt_en
              return (
                <Link
                  key={article._id}
                  href={`/${locale}/journal/${article.slug}`}
                  className="group block"
                >
                  <div className="overflow-hidden bg-charcoal-100 aspect-[16/9]">
                    {article.coverImageUrl ? (
                      <Image
                        src={article.coverImageUrl}
                        alt={article.coverImageAlt || title}
                        width={800}
                        height={450}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-charcoal-800 to-charcoal-900 flex items-center justify-center">
                        <span className="font-display text-4xl font-light text-gold-500/30">
                          {title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="font-body text-[9px] font-semibold uppercase tracking-[0.3em] text-gold-500">
                        {article.category}
                      </span>
                      {article.readTime && (
                        <span className="font-body text-[9px] text-charcoal-400">
                          {article.readTime}
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-lg font-light text-charcoal-900 transition-colors group-hover:text-gold-600 leading-snug">
                      {title}
                    </h2>
                    {excerpt && (
                      <p className="mt-2 font-body text-sm font-light leading-relaxed text-charcoal-500 line-clamp-2">
                        {excerpt}
                      </p>
                    )}
                    {article.publishedAt && (
                      <p className="mt-3 font-body text-[10px] text-charcoal-400">
                        {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add app/\[locale\]/journal/category/
git commit -m "feat: add article category filter page at /journal/category/[slug]"
```

---

## Task 10: Update Journal Listing — Category Badges as Links

**Files:**
- Modify: `app/[locale]/journal/page.tsx`

- [ ] **Replace plain category span with a Link**

In `app/[locale]/journal/page.tsx`, find the category badge span inside the `articles.map`:

```tsx
{article.category && (
  <span className="font-body text-[9px] font-semibold uppercase tracking-[0.3em] text-gold-500">
    {article.category}
  </span>
)}
```

Replace with:

```tsx
{article.category && (
  <Link
    href={`/${locale}/journal/category/${article.category.toLowerCase().replace(/ /g, '-')}`}
    onClick={(e) => e.stopPropagation()}
    className="font-body text-[9px] font-semibold uppercase tracking-[0.3em] text-gold-500 hover:text-gold-600 transition-colors"
  >
    {article.category}
  </Link>
)}
```

Note: `e.stopPropagation()` prevents the outer `<Link>` (the card) from triggering when clicking the category badge.

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add app/\[locale\]/journal/page.tsx
git commit -m "feat: make category badges clickable links on journal listing"
```

---

## Task 11: Update Article Detail — Linked Author + Linked Category

**Files:**
- Modify: `app/[locale]/journal/[slug]/page.tsx`

- [ ] **Replace the plain category span with a Link**

In `app/[locale]/journal/[slug]/page.tsx`, find the meta section (around line 97) with:

```tsx
{article.category && (
  <span className="font-body text-[9px] font-semibold uppercase tracking-[0.3em] text-gold-500">{article.category}</span>
)}
```

Replace with:

```tsx
{article.category && (
  <Link
    href={`/${locale}/journal/category/${article.category.toLowerCase().replace(/ /g, '-')}`}
    className="font-body text-[9px] font-semibold uppercase tracking-[0.3em] text-gold-500 hover:text-gold-600 transition-colors"
  >
    {article.category}
  </Link>
)}
```

- [ ] **Add author display after the meta div**

After the closing `</div>` of the meta block (containing category, readTime, publishedAt), add:

```tsx
{article.author && (
  <div className="mt-3 flex items-center gap-2">
    {article.author.photoUrl ? (
      <Image
        src={article.author.photoUrl}
        alt={isAr ? (article.author.name_ar || article.author.name_en) : article.author.name_en}
        width={24}
        height={24}
        className="rounded-full object-cover"
      />
    ) : (
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal-100">
        <span className="font-display text-xs text-gold-500">
          {(isAr ? (article.author.name_ar || article.author.name_en) : article.author.name_en).charAt(0)}
        </span>
      </div>
    )}
    <Link
      href={`/${locale}/journal/author/${article.author.slug}`}
      className="font-body text-xs text-charcoal-500 hover:text-gold-500 transition-colors"
    >
      {isAr ? (article.author.name_ar || article.author.name_en) : article.author.name_en}
      {(isAr ? (article.author.role_ar || article.author.role_en) : article.author.role_en) && (
        <span className="ml-1 text-charcoal-300">
          · {isAr ? (article.author.role_ar || article.author.role_en) : article.author.role_en}
        </span>
      )}
    </Link>
  </div>
)}
```

Ensure `Image` is imported (it already is in that file).

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add app/\[locale\]/journal/\[slug\]/page.tsx
git commit -m "feat: add linked author + linked category on article detail page"
```

---

## Task 12: Gift Card Checkout API

**Files:**
- Create: `app/api/gift-cards/checkout/route.ts`

- [ ] **Create the checkout API route**

```typescript
// app/api/gift-cards/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { stripe } from '@/lib/stripe'

const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

function generateGiftCardCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const segment = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `GC-${segment()}-${segment()}`
}

interface GiftCardCheckoutBody {
  amountCents: number
  currency?: string
  recipientName?: string
  message?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: GiftCardCheckoutBody = await req.json()
    const { amountCents, currency = 'usd', recipientName, message } = body

    if (!amountCents || typeof amountCents !== 'number' || amountCents < 100) {
      return NextResponse.json(
        { error: 'Invalid gift card amount. Minimum is $1.' },
        { status: 400 }
      )
    }

    const code = generateGiftCardCode()

    const order = await adminClient.create({
      _type: 'giftCardOrder',
      code,
      amountCents,
      currency,
      status: 'pending',
      ...(recipientName?.trim() ? { recipientName: recipientName.trim() } : {}),
      ...(message?.trim() ? { message: message.trim() } : {}),
      createdAt: new Date().toISOString(),
    })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: amountCents,
            product_data: {
              name: `Luxe Parfum Gift Card${recipientName?.trim() ? ` for ${recipientName.trim()}` : ''}`,
              description: 'Redeemable on any Luxe Parfum order.',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/en/gift-cards/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/en/gift-cards`,
      metadata: {
        giftCardOrderId: order._id,
        giftCardCode: code,
        ...(recipientName?.trim() ? { recipientName: recipientName.trim() } : {}),
      },
      custom_text: {
        submit: {
          message: 'Gift card code will be shown immediately after payment.',
        },
      },
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[Gift Card Checkout Error]:', error)
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
  }
}
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add app/api/gift-cards/
git commit -m "feat(api): add gift card checkout route"
```

---

## Task 13: Gift Card Session API

**Files:**
- Create: `app/api/gift-cards/session/route.ts`

- [ ] **Create the session lookup route**

```typescript
// app/api/gift-cards/session/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('sessionId')

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'Missing sessionId parameter.' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    const code = session.metadata?.giftCardCode
    const amountCents = session.amount_total
    const recipientName = session.metadata?.recipientName ?? null

    if (!code) {
      return NextResponse.json({ error: 'Gift card code not found in session.' }, { status: 404 })
    }

    return NextResponse.json({ code, amountCents, recipientName })
  } catch (error) {
    console.error('[Gift Card Session Error]:', error)
    return NextResponse.json({ error: 'Failed to retrieve session.' }, { status: 500 })
  }
}
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add app/api/gift-cards/session/
git commit -m "feat(api): add gift card session lookup route"
```

---

## Task 14: Gift Card Purchase Form Client Component

**Files:**
- Create: `app/[locale]/gift-cards/GiftCardPurchaseForm.tsx`

- [ ] **Create the client form component**

```tsx
// app/[locale]/gift-cards/GiftCardPurchaseForm.tsx
'use client'

import { useState } from 'react'
import type { GiftCardDenomination } from '@/lib/types'

interface Props {
  denominations: GiftCardDenomination[]
  locale: string
  isAr: boolean
}

export function GiftCardPurchaseForm({ denominations, locale, isAr }: Props) {
  const [selected, setSelected] = useState<GiftCardDenomination | null>(
    denominations.find((d) => d.popular) ?? denominations[0] ?? null
  )
  const [recipientName, setRecipientName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (!selected) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/gift-cards/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountCents: selected.amountCents,
          currency: 'usd',
          ...(recipientName.trim() ? { recipientName: recipientName.trim() } : {}),
          ...(message.trim() ? { message: message.trim() } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed.')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Denomination grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {denominations.map((d) => {
          const label = isAr ? (d.label_ar || d.label_en) : d.label_en
          return (
            <button
              key={d._key}
              onClick={() => setSelected(d)}
              className={`relative rounded-2xl border-2 p-6 text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                selected?._key === d._key
                  ? 'border-gold-500 bg-gold-50'
                  : 'border-charcoal-100 bg-white hover:border-gold-300'
              }`}
            >
              {d.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gold-500 px-3 py-0.5 font-body text-[9px] font-semibold uppercase tracking-wider text-white whitespace-nowrap">
                  Popular
                </span>
              )}
              <p className="font-display text-2xl font-light text-charcoal-900">
                ${Math.round(d.amountCents / 100)}
              </p>
              <p className="mt-1 font-body text-xs text-charcoal-400">{label}</p>
            </button>
          )
        })}
      </div>

      {/* Optional personalisation fields */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="mb-1.5 block font-body text-xs font-medium text-charcoal-600">
            Recipient Name{' '}
            <span className="font-normal text-charcoal-300">(optional)</span>
          </label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="e.g. Sarah"
            maxLength={80}
            className="w-full rounded-xl border border-charcoal-200 bg-white px-4 py-3 font-body text-sm text-charcoal-900 outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-body text-xs font-medium text-charcoal-600">
            Personal Message{' '}
            <span className="font-normal text-charcoal-300">(optional)</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a personal note..."
            maxLength={300}
            rows={3}
            className="w-full resize-none rounded-xl border border-charcoal-200 bg-white px-4 py-3 font-body text-sm text-charcoal-900 outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
          />
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 font-body text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        onClick={handleCheckout}
        disabled={!selected || loading}
        className="w-full rounded-full bg-gold-500 py-4 font-body text-sm font-semibold text-white shadow-md transition-all hover:bg-gold-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
      >
        {loading
          ? 'Redirecting to payment…'
          : `Purchase $${selected ? Math.round(selected.amountCents / 100) : ''} Gift Card`}
      </button>
    </div>
  )
}
```

---

## Task 15: Gift Card Page (Server Component)

**Files:**
- Create: `app/[locale]/gift-cards/page.tsx`

- [ ] **Create the gift cards page**

```tsx
// app/[locale]/gift-cards/page.tsx
import type { Metadata } from 'next'
import { getGiftCardPage } from '@/lib/sanity/fetch'
import { GiftCardPurchaseForm } from './GiftCardPurchaseForm'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Gift Cards — Luxe Parfum',
  description: 'Give the gift of luxury fragrance. Redeemable on any order.',
}

export default async function GiftCardsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isAr = locale === 'ar'
  const data = await getGiftCardPage()

  const headline = data
    ? (isAr ? (data.headline_ar || data.headline_en) : data.headline_en)
    : 'Give the Gift of Fragrance'
  const subtext = data
    ? (isAr ? (data.subtext_ar || data.subtext_en) : data.subtext_en)
    : 'Redeemable on any Luxe Parfum order. No expiry.'
  const denominations = data?.denominations ?? [
    { _key: 'default-50', label_en: 'A thoughtful start', amountCents: 5000, popular: false },
    { _key: 'default-100', label_en: 'Perfect gift', amountCents: 10000, popular: true },
    { _key: 'default-200', label_en: 'For the connoisseur', amountCents: 20000, popular: false },
  ]
  const howItWorks = data?.howItWorks ?? [
    { _key: 'step-1', step: 1, text_en: 'Choose a denomination and personalise with a message.' },
    { _key: 'step-2', step: 2, text_en: 'Complete payment. Your unique code appears instantly.' },
    { _key: 'step-3', step: 3, text_en: 'Share the code. Recipient enters it at checkout.' },
  ]
  const terms = data ? (isAr ? (data.terms_ar || data.terms_en) : data.terms_en) : null

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 font-body text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-500">
            Luxe Parfum
          </p>
          <h1 className="font-display text-4xl font-light text-charcoal-900 md:text-5xl">
            {headline}
          </h1>
          {subtext && (
            <p className="mx-auto mt-5 max-w-md font-body text-sm font-light leading-relaxed text-charcoal-500">
              {subtext}
            </p>
          )}
          <div className="mx-auto mt-6 h-px w-12 bg-gold-400/50" />
        </div>

        {/* How it works */}
        {howItWorks.length > 0 && (
          <div className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {howItWorks
              .sort((a, b) => a.step - b.step)
              .map((s) => {
                const text = isAr ? (s.text_ar || s.text_en) : s.text_en
                return (
                  <div key={s._key} className="text-center">
                    <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-gold-100">
                      <span className="font-display text-sm font-semibold text-gold-600">
                        {s.step}
                      </span>
                    </div>
                    <p className="font-body text-xs font-light leading-relaxed text-charcoal-500">
                      {text}
                    </p>
                  </div>
                )
              })}
          </div>
        )}

        <div className="mb-10 h-px bg-charcoal-100" />

        {/* Purchase form */}
        <GiftCardPurchaseForm
          denominations={denominations}
          locale={locale}
          isAr={isAr}
        />

        {/* Terms */}
        {terms && (
          <p className="mt-8 font-body text-[10px] leading-relaxed text-charcoal-300">
            {terms}
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add app/\[locale\]/gift-cards/page.tsx app/\[locale\]/gift-cards/GiftCardPurchaseForm.tsx
git commit -m "feat: add gift card purchase page at /gift-cards"
```

---

## Task 16: Gift Card Success — CopyCode Client Component

**Files:**
- Create: `app/[locale]/gift-cards/success/CopyCode.tsx`

- [ ] **Create the copy-to-clipboard component**

```tsx
// app/[locale]/gift-cards/success/CopyCode.tsx
'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback: select text manually
    }
  }

  return (
    <div className="flex items-center justify-between rounded-xl bg-cream-50 border border-charcoal-100 px-5 py-4">
      <span className="font-mono text-xl font-semibold tracking-widest text-charcoal-900 select-all">
        {code}
      </span>
      <button
        onClick={handleCopy}
        aria-label="Copy gift card code"
        className="ml-4 flex items-center gap-1.5 rounded-lg bg-gold-500 px-3 py-1.5 font-body text-xs font-semibold text-white transition-all hover:bg-gold-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
      >
        {copied ? (
          <>
            <Check size={12} /> Copied
          </>
        ) : (
          <>
            <Copy size={12} /> Copy
          </>
        )}
      </button>
    </div>
  )
}
```

---

## Task 17: Gift Card Success Page

**Files:**
- Create: `app/[locale]/gift-cards/success/page.tsx`

- [ ] **Create the success page**

```tsx
// app/[locale]/gift-cards/success/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import { CopyCode } from './CopyCode'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Gift Card Ready — Luxe Parfum',
}

export default async function GiftCardSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ session_id?: string }>
}) {
  const { locale } = await params
  const { session_id } = await searchParams

  if (!session_id) notFound()

  let code: string | null = null
  let amountCents: number | null = null
  let recipientName: string | null = null

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)
    code = session.metadata?.giftCardCode ?? null
    amountCents = session.amount_total
    recipientName = session.metadata?.recipientName ?? null
  } catch {
    notFound()
  }

  if (!code) notFound()

  const amount = amountCents ? `$${Math.round(amountCents / 100)}` : ''

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <div className="mx-auto max-w-lg px-4 text-center">
        {/* Icon */}
        <div className="mb-8 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold-100">
          <span className="text-3xl">🎁</span>
        </div>

        <p className="mb-2 font-body text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-500">
          Gift Card
        </p>
        <h1 className="font-display text-3xl font-light text-charcoal-900">
          Purchase Complete
        </h1>
        <p className="mt-3 font-body text-sm font-light text-charcoal-500">
          {amount && `Your ${amount} gift card is ready.`}
          {recipientName && ` For ${recipientName}.`}
        </p>

        {/* Code box */}
        <div className="mt-10 rounded-2xl border border-gold-200 bg-white p-8 shadow-sm text-left">
          <p className="mb-3 font-body text-xs text-charcoal-400 text-center">
            Your Gift Card Code
          </p>
          <CopyCode code={code} />
          <p className="mt-4 font-body text-[10px] leading-relaxed text-charcoal-300 text-center">
            Screenshot or copy this code now. Share it with the recipient — they enter it at checkout.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3 font-body text-sm font-semibold text-white shadow-md transition-all hover:bg-gold-600 active:scale-[0.98]"
          >
            Shop Now
          </Link>
          <Link
            href={`/${locale}/gift-cards`}
            className="font-body text-xs text-charcoal-400 hover:text-gold-500 transition-colors underline-offset-2 hover:underline"
          >
            Buy another gift card
          </Link>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add app/\[locale\]/gift-cards/success/
git commit -m "feat: add gift card success page with copyable code display"
```

---

## Task 18: Final Build Verification

- [ ] **Run full TypeScript check**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1
```

Expected: 0 errors

- [ ] **Run Next.js build**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npm run build 2>&1 | tail -30
```

Expected: Build succeeds. All new routes appear in the route list. No "Module not found" errors.

- [ ] **Manual smoke test — start dev server and verify routes exist**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npm run dev
```

Check these URLs load without 500 errors:
- `http://localhost:3000/en/journal` — category badges now link to category pages
- `http://localhost:3000/en/journal/category/guide` — renders empty state or articles
- `http://localhost:3000/en/journal/category/education` — renders
- `http://localhost:3000/en/journal/author/any-slug` — 404 (expected, no authors in Sanity yet)
- `http://localhost:3000/en/gift-cards` — denomination picker renders (uses fallback defaults if CMS empty)
- `http://localhost:3000/en/gift-cards/success` — 404 (expected, no session_id)

- [ ] **Final commit**

```bash
git add .
git commit -m "feat: complete author pages, category pages, and gift card flow"
```

---

## Sanity Studio Setup (post-deploy)

After implementation, set up content in Sanity Studio (`/studio`):

1. **Gift Card Page** — Studio → Gift Card Page → create document with headlines + denominations (e.g. $50/$100/$200)
2. **Authors** — Studio → Author → create author documents, generate slugs
3. **Articles** — edit existing articles to assign an Author reference

The gift card checkout requires `SANITY_API_TOKEN` to have **write** permissions. Verify in Sanity project settings → API → Tokens that the token used has Editor or above.
