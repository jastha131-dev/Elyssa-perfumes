# Design: Author Pages, Article Category Pages, Gift Card Page

**Date:** 2026-06-04  
**Project:** Luxe Parfum (Next.js 15 / Sanity / Stripe)

---

## 1. Author Pages

### Goal
Authors can be created in Sanity Studio and assigned to articles. Each author has a dedicated public page listing their bio and articles.

### Sanity Schema — `author`
New document type: `sanity/schemaTypes/author.ts`

Fields:
- `name_en` (string, required)
- `name_ar` (string)
- `slug` (slug, source: `name_en`, required)
- `role_en` (string) — e.g. "Fragrance Writer"
- `role_ar` (string)
- `bio_en` (text)
- `bio_ar` (text)
- `photo` (image, hotspot)

### Article Schema Change
Add optional field to `sanity/schemaTypes/article.ts`:
```
author → reference to author document (optional)
```

### GROQ Query Changes
- `getArticlesQuery` — project `"author": author->{ _id, name_en, name_ar, "slug": slug.current, role_en, role_ar, "photoUrl": photo.asset->url }`
- `getArticleBySlugQuery` — same author projection
- New: `getAuthorBySlugQuery` — fetches author + all their articles
- New: `getAuthorsQuery` — all authors (for `generateStaticParams`)

### TypeScript Types
- New `Author` interface in `lib/types.ts`
- Update `ArticleSummary` and `ArticleDetail` to include optional `author?: Author`

### Frontend Route
`app/[locale]/journal/author/[slug]/page.tsx`
- Hero: author photo, name, role
- Bio text (locale-aware)
- Grid of their articles (same card component as journal listing)
- `generateStaticParams` fetches all authors
- `generateMetadata` uses author name + role

### Article Detail Page Update
`app/[locale]/journal/[slug]/page.tsx`
- Show author name + role below category/readTime meta line
- Name is a `<Link href="/journal/author/[slug]">` if author exists

---

## 2. Article Category Pages

### Goal
Each article category (Guide, Education, Behind the Scenes, Inspiration, News) has a filterable listing page. Category labels throughout the site become links.

### No New Schema
Categories remain hardcoded strings in `article.ts`. No schema change needed.

### GROQ Query Changes
New: `getArticlesByCategoryQuery`
```groq
*[_type == "article" && category == $category] | order(publishedAt desc) { ...articleSummaryFields }
```

New fetch function: `getArticlesByCategory(category: string): Promise<ArticleSummary[]>`

### Frontend Route
`app/[locale]/journal/category/[slug]/page.tsx`
- `slug` param maps directly to category string value (URL-encoded where needed, e.g. `behind-the-scenes`)
- Need a slug→value map: `{ guide: "Guide", education: "Education", "behind-the-scenes": "Behind the Scenes", inspiration: "Inspiration", news: "News" }`
- `generateStaticParams` returns the 5 fixed slugs
- Page renders: category label header + filtered article grid
- If 0 articles: empty state

### Link Updates
- `app/[locale]/journal/page.tsx` — category badge wraps in `<Link href="/{locale}/journal/category/{slug}">`
- `app/[locale]/journal/[slug]/page.tsx` — category badge becomes link

---

## 3. Gift Card Page

### Goal
Users can purchase a gift card in a fixed denomination. After Stripe checkout, the success page displays a unique alphanumeric code. No email delivery; code is shown once on-screen.

### Sanity Schema — `giftCardPage` (singleton)
New document: `sanity/schemaTypes/giftCardPage.ts`

Fields:
- `headline_en`, `headline_ar` (string)
- `subtext_en`, `subtext_ar` (text)
- `denominations` (array of objects): `{ label_en, label_ar, amountCents: number, popular: boolean }`
- `howItWorks` (array of objects): `{ step: number, text_en, text_ar }`
- `terms_en`, `terms_ar` (text)

### Sanity Schema — `giftCardOrder` (document)
New document: `sanity/schemaTypes/giftCardOrder.ts`

Fields:
- `code` (string) — e.g. `GC-A3B2-9X7K`
- `amountCents` (number)
- `currency` (string, default: `usd`)
- `stripeSessionId` (string)
- `status` (string: `pending` | `paid`) — default `pending`
- `createdAt` (datetime)
- `recipientName` (string, optional)
- `message` (text, optional)

### API Route — `/api/gift-cards/checkout`
`POST` handler:
1. Receives `{ amountCents, currency, recipientName?, message? }`
2. Generates unique code: `GC-` + 4 random alphanumeric + `-` + 4 random alphanumeric (uppercase)
3. Creates `giftCardOrder` document in Sanity (status: `pending`) via Sanity write client
4. Creates Stripe checkout session:
   - Single line item: "Gift Card — {label}" at `amountCents`
   - `metadata.giftCardOrderId = sanityDocId`
   - `metadata.giftCardCode = code`
   - `success_url`: `/gift-cards/success?session_id={CHECKOUT_SESSION_ID}`
   - `cancel_url`: `/gift-cards`
5. Returns `{ url: session.url }`

### API Route — `/api/gift-cards/session`
`GET ?sessionId=xxx` handler:
1. Fetches Stripe session by ID
2. Extracts `metadata.giftCardCode` and `metadata.giftCardOrderId`
3. Returns `{ code, amountCents, recipientName }`
(No Sanity write needed here — webhook can update status later)

### Frontend Routes
`app/[locale]/gift-cards/page.tsx`
- Fetches `giftCardPage` CMS data
- Denomination selector (card grid, highlight `popular`)
- Recipient name input (optional) + message input (optional)
- "Purchase Gift Card" button → POST to `/api/gift-cards/checkout` → redirect to Stripe

`app/[locale]/gift-cards/success/page.tsx`
- Reads `session_id` from query params
- Calls `/api/gift-cards/session?sessionId=xxx`
- Displays: amount, code in styled copy-box, recipient name if present, "Save this code" note
- Link back to shop

### GROQ + Fetch
- `getGiftCardPageQuery` + `getGiftCardPage()` fetch function
- Types: `GiftCardPageData`, `GiftCardOrder`

### Sanity Write Client
`SANITY_API_TOKEN` env var already used in `app/api/auth/register/route.ts`. The gift card checkout API follows the same inline pattern — create an `adminClient` with `token: process.env.SANITY_API_TOKEN` directly in the route file. No new shared write client file needed.

---

## Files Changed / Created

### New files
| Path | Purpose |
|------|---------|
| `sanity/schemaTypes/author.ts` | Author schema |
| `sanity/schemaTypes/giftCardPage.ts` | Gift card page CMS singleton |
| `sanity/schemaTypes/giftCardOrder.ts` | Gift card order record |
| `app/[locale]/journal/author/[slug]/page.tsx` | Author page route |
| `app/[locale]/journal/category/[slug]/page.tsx` | Category filter route |
| `app/[locale]/gift-cards/page.tsx` | Gift card purchase page |
| `app/[locale]/gift-cards/success/page.tsx` | Gift card success page |
| `app/api/gift-cards/checkout/route.ts` | Gift card checkout API |
| `app/api/gift-cards/session/route.ts` | Gift card session lookup API |

### Modified files
| Path | Change |
|------|--------|
| `sanity/schemaTypes/article.ts` | Add optional `author` reference field |
| `sanity/schemaTypes/index.ts` | Register author, giftCardPage, giftCardOrder |
| `lib/sanity/queries.ts` | Add author projection, getArticlesByCategoryQuery, getAuthorsQuery, getAuthorBySlugQuery, getGiftCardPageQuery |
| `lib/sanity/fetch.ts` | Add getArticlesByCategory, getAuthorBySlug, getAuthors, getGiftCardPage |
| `lib/types.ts` | Add Author, GiftCardPageData, GiftCardOrder types; update ArticleSummary/ArticleDetail |
| `app/[locale]/journal/page.tsx` | Category badges become links |
| `app/[locale]/journal/[slug]/page.tsx` | Show linked author + linked category |

---

## Constraints

- All text fields bilingual (en/ar), locale resolved with `isAr ? x_ar || x_en : x_en` pattern
- Gift card code shown once on success page — no email delivery
- No webhook required for code display (code is in Stripe session metadata)
- Category slugs are URL-safe versions of hardcoded category strings
- `generateStaticParams` used on all new routes for static generation
- Sanity write client needs `SANITY_API_TOKEN` env var with write permissions
