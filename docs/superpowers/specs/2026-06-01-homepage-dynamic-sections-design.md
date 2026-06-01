# Homepage Dynamic Sections — Design Spec

**Date:** 2026-06-01  
**Project:** Luxe Parfum (Next.js 15 / Sanity CMS / Tailwind / Framer Motion)  
**Scope:** Add 15 new dynamic homepage sections + global announcement bar across two phases

---

## 1. Background

The homepage uses a `PageBuilder` pattern: Sanity stores an ordered array of typed section objects in the `homePage` document. `components/PageBuilder.tsx` maps each `_type` to a React component. Currently 11 section types exist.

This spec adds 15 new section types (10 in Phase 1, 5 in Phase 2) plus a global announcement bar singleton.

---

## 2. Existing Architecture (unchanged)

```
sanity/schemaTypes/blocks/<name>.ts    ← Sanity schema per block
sanity/schemaTypes/blocks/index.ts     ← barrel export
sanity/schemaTypes/homePage.ts         ← sections array (add new members here)
sanity/schemaTypes/index.ts            ← schemaTypes[] array
lib/types.ts                           ← TypeScript interfaces
lib/sanity/queries.ts                  ← GROQ query (getHomePageQuery)
lib/sanity/fetch.ts                    ← fetch functions
components/home/<Name>.tsx             ← React component
components/PageBuilder.tsx             ← blockMap registration
```

Every block has `isVisible: boolean` (initialValue: true) for CMS toggle.  
All user-facing text fields come in `_en` / `_ar` pairs (bilingual).

---

## 3. Announcement Bar (Global Singleton)

### What
A dismissible top-of-page strip shown across all pages. Managed as a standalone Sanity singleton document, fetched in the root layout — not a PageBuilder section.

### Files
| File | Action |
|------|--------|
| `sanity/schemaTypes/announcementBar.ts` | New singleton schema |
| `sanity/schemaTypes/index.ts` | Register `announcementBar` |
| `lib/types.ts` | Add `AnnouncementBar` interface |
| `lib/sanity/queries.ts` | Add `announcementBarQuery` |
| `lib/sanity/fetch.ts` | Add `getAnnouncementBar()` |
| `components/layout/AnnouncementBar.tsx` | New client component |
| `app/[locale]/layout.tsx` | Fetch + render above `<Header>` |

### Schema Fields
| Field | Type | Notes |
|-------|------|-------|
| `isEnabled` | boolean | Master toggle |
| `text_en` | string | Bar message (English) |
| `text_ar` | string | Bar message (Arabic) |
| `bgColor` | string (list) | `gold` / `black` / `cream` / `custom` |
| `customBgColor` | string | Hex, shown only when bgColor = `custom` |
| `textColor` | string (list) | `light` / `dark` |
| `link` | url | Optional CTA link |
| `linkLabel_en` | string | Link text (English) |
| `linkLabel_ar` | string | Link text (Arabic) |
| `dismissible` | boolean | Show × close button |

### Rendering
- Fetched server-side in `app/[locale]/layout.tsx` via `getAnnouncementBar()`
- Rendered as a `<AnnouncementBar>` client component above `<Header>`
- Dismissal stored in `sessionStorage` (disappears on tab close, returns on new session)
- RTL-aware (Arabic locale flips layout)

---

## 4. Phase 1 — 10 New Content Blocks

### 4.1 `videoBannerSection`
Full-width or split video section with overlay content.

**Schema fields:** `videoUrl` (url), `muxPlaybackId` (string), `posterImage` (image), `headline_en/ar`, `subtext_en/ar`, `overlayOpacity` (number 0–100), `layout` (radio: `fullscreen` / `split`), `cta` (ctaButton), `autoplay` (boolean, default true), `muted` (boolean, default true), `loop` (boolean, default true)

**Component:** `components/home/VideoBanner.tsx` — uses `<video>` tag with Mux fallback URL. Fullscreen layout matches existing heroSection full-bleed style. Split layout mirrors brandStory layout.

---

### 4.2 `newArrivalsSection`
Auto-populated grid of newest products (filtered by `new == true`).

**Schema fields:** `title_en/ar`, `subtitle_en/ar`, `limit` (number, 4–12, default 8), `cta` (ctaButton), `layout` (radio: `grid` / `carousel`)

**Data:** GROQ fetches `*[_type=="product" && new==true] | order(_createdAt desc) [0..$limit]` inline within `getHomePageQuery`. Same product projection as `bestSellersSection`.

**Component:** `components/home/NewArrivals.tsx` — reuses product card component.

---

### 4.3 `collectionsGridSection`
Manual grid of Collection documents.

**Schema fields:** `title_en/ar`, `subtitle_en/ar`, `collections[]` (array of references to `collection` documents), `columnCount` (radio: `2` / `3` / `4`, default `3`), `cta` (ctaButton)

**Data:** `collections[]->` dereferenced in GROQ. Uses existing `Collection` type.

**Component:** `components/home/CollectionsGrid.tsx`

---

### 4.4 `faqSection`
Accordion FAQ, manually curated from existing `faqItem` documents.

**Schema fields:** `title_en/ar`, `subtitle_en/ar`, `faqs[]` (array of references to `faqItem` documents), `layout` (radio: `single-column` / `two-column`)

**Data:** `faqs[]->` dereferenced in GROQ. Uses existing `FaqItem` type.

**Component:** `components/home/FaqAccordion.tsx` — animated expand/collapse with Framer Motion. One item open at a time.

---

### 4.5 `imageWithTextSection`
Generic reusable image + text split. More flexible than `brandStorySection`.

**Schema fields:** `image` (image with hotspot + alt), `headline_en/ar`, `eyebrow_en/ar`, `body_en/ar` (text), `imagePosition` (radio: `left` / `right`), `imageStyle` (radio: `square` / `rounded` / `full-bleed`), `bgColor` (radio: `white` / `cream` / `black`), `cta` (ctaButton)

**Component:** `components/home/ImageWithText.tsx`

---

### 4.6 `videoWithTextSection`
Video + text split layout. Same structure as imageWithText but video replaces image.

**Schema fields:** `videoUrl` (url), `muxPlaybackId` (string), `posterImage` (image), `autoplay` (boolean), `headline_en/ar`, `eyebrow_en/ar`, `body_en/ar`, `videoPosition` (radio: `left` / `right`), `bgColor` (radio: `white` / `cream` / `black`), `cta` (ctaButton)

**Component:** `components/home/VideoWithText.tsx`

---

### 4.7 `instagramFeedSection`
Manual photo gallery — no Instagram API. Photos uploaded directly in Sanity.

**Schema fields:** `title_en/ar`, `handle` (string, display only — e.g. `@luxeparfum`), `photos[]` (array of objects: `image` + `caption_en/ar` + `link` url), `columns` (radio: `3` / `4` / `6`), `cta` (ctaButton)

**Component:** `components/home/InstagramFeed.tsx` — masonry or uniform grid, hover reveals caption, click opens link in new tab.

---

### 4.8 `countdownTimerSection`
Countdown to a specific date/time. Purely client-side JS timer.

**Schema fields:** `headline_en/ar`, `subtext_en/ar`, `endDate` (datetime), `expiredText_en/ar` (shown after countdown ends), `bgImage` (optional), `style` (radio: `minimal` / `card` / `full-bleed`), `cta` (ctaButton)

**Component:** `components/home/CountdownTimer.tsx` — client component using `useEffect` + `setInterval`. Shows days/hours/minutes/seconds. Hides or shows expired text after end date.

---

### 4.9 `richTextSection`
Free-form Portable Text block for editorial content.

**Schema fields:** `content_en` (array of Portable Text blocks), `content_ar` (array of Portable Text blocks), `maxWidth` (radio: `narrow` / `normal` / `wide`), `textAlign` (radio: `left` / `center`)

**Component:** `components/home/RichText.tsx` — renders via `@portabletext/react` with existing styled components. Locale-aware (renders `content_en` or `content_ar`).

---

### 4.10 `multiColumnSection`
2–4 icon/text columns for features, benefits, or process steps.

**Schema fields:** `title_en/ar`, `subtitle_en/ar`, `columnCount` (radio: `2` / `3` / `4`), `columns[]` (array of objects: `icon` string (emoji or icon name), `headline_en/ar`, `body_en/ar`, `cta` optional ctaButton), `bgColor` (radio: `white` / `cream` / `black`)

**Component:** `components/home/MultiColumn.tsx`

---

## 5. Phase 2 — 5 Interactive/Commerce Blocks

### 5.1 `beforeAfterSection`
Image comparison slider.

**Schema fields:** `title_en/ar`, `subtitle_en/ar`, `beforeImage` (image + alt), `afterImage` (image + alt), `beforeLabel_en/ar`, `afterLabel_en/ar`, `initialPosition` (number 0–100, default 50)

**Component:** `components/home/BeforeAfter.tsx` — uses `react-compare-slider` package. Drag handle with Framer Motion animation.

**New dependency:** `react-compare-slider`

---

### 5.2 `comparisonTableSection`
Side-by-side product attribute comparison.

**Schema fields:** `title_en/ar`, `products[]` (2–4 references to `product` documents), `highlightProductIndex` (number, which column to visually highlight), `showAddToCart` (boolean)

**Data:** `products[]->` dereferenced in GROQ with full product projection. Attributes compared: `fragranceFamily`, `intensity`, `sillage`, `longevity`, `topNotes_en/ar`, `middleNotes_en/ar`, `baseNotes_en/ar`, `price`, `volume[]`.

**Component:** `components/home/ComparisonTable.tsx` — responsive: horizontal scroll on mobile, full table on desktop.

---

### 5.3 `tabsSection`
Tabbed content sections with Portable Text per tab.

**Schema fields:** `title_en/ar`, `tabs[]` (array of objects: `label_en/ar`, `content_en` Portable Text, `content_ar` Portable Text, `icon` optional string)

**Component:** `components/home/Tabs.tsx` — client component. Framer Motion underline indicator. Locale-aware label + content.

---

### 5.4 `upsellSection`
Editorially curated "You may also like" product grid.

**Schema fields:** `title_en/ar`, `subtitle_en/ar`, `products[]` (array of references to `product` documents, max 8), `layout` (radio: `grid` / `carousel`), `cta` (ctaButton)

**Data:** `products[]->` dereferenced in GROQ with same product projection as `featuredProductsSection`.

**Component:** `components/home/UpsellProducts.tsx` — reuses product card component.

---

## 6. PageBuilder Registration

Each new block registered in:

1. `sanity/schemaTypes/blocks/index.ts` — add named export
2. `sanity/schemaTypes/homePage.ts` — add `defineArrayMember({ type: '<name>' })` to sections array
3. `sanity/schemaTypes/index.ts` — add to `schemaTypes[]`
4. `lib/types.ts` — add `<Name>Block` interface + add to `HomePageSection` union
5. `components/PageBuilder.tsx` — add entry to `blockMap`

---

## 7. GROQ Query Changes (`lib/sanity/queries.ts`)

The `getHomePageQuery` needs expanded projections for sections referencing other documents:

| Section | GROQ expansion needed |
|---------|----------------------|
| `newArrivalsSection` | Inline subquery: `"products": *[_type=="product" && new==true] \| order(_createdAt desc)[0..limit]` where `limit` is read from the section's own `limit` field (coalesce to 8 if null) |
| `collectionsGridSection` | `collections[]->{ _id, title_en, title_ar, slug, imageUrl, order }` |
| `faqSection` | `faqs[]->{ _id, question_en, question_ar, answer_en, answer_ar }` |
| `upsellSection` | `products[]->{ ...full product projection }` |
| `comparisonTableSection` | `products[]->{ ...full product projection }` |

All other new sections contain only inline CMS data — no dereference needed.

---

## 8. TypeScript Types

All new block interfaces follow this pattern (example):

```typescript
export interface VideoBannerSectionBlock {
  _type: 'videoBannerSection'
  _key: string
  isVisible?: boolean
  videoUrl?: string
  muxPlaybackId?: string
  // ... etc
}
```

`HomePageSection` union type in `lib/types.ts` updated to include all new block interfaces.

---

## 9. Bilingual Convention

Every user-facing text field exists as `_en` (English) and `_ar` (Arabic) pair. Components read the active locale via `useLocale()` from `next-intl` and render the correct field. RTL layout applied via Tailwind `rtl:` variants for Arabic locale.

---

## 10. Skipped Sections (out of scope)

| Section | Reason skipped |
|---------|---------------|
| TikTok embeds | Third-party embed complexity, user confirmed skip |
| Recently viewed products | Requires client-side localStorage tracking — separate sprint |
| Flash sale section | Requires Stripe/pricing integration — separate sprint |
| Limited-time offer section | Same as flash sale |
| Product carousel (standalone) | Covered by `featuredProductsSection` with `layout: 'carousel'` |

---

## 11. Delivery Phases

### Phase 1 — Content Blocks
`videoBannerSection`, `newArrivalsSection`, `collectionsGridSection`, `faqSection`, `imageWithTextSection`, `videoWithTextSection`, `instagramFeedSection`, `countdownTimerSection`, `richTextSection`, `multiColumnSection`

### Phase 2 — Interactive + Commerce
`beforeAfterSection`, `comparisonTableSection`, `tabsSection`, `upsellSection`, `announcementBar` (global singleton)

---

## 12. Out-of-Scope for This Spec

- Changes to product detail pages, cart, or checkout
- New Sanity document types (product, category, collection schemas unchanged)
- Navigation / header changes
- SEO metadata per section
