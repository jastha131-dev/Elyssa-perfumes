# Homepage Redesign — Design Spec

**Date:** 2026-05-15
**Project:** Luxe Parfum (p1test)
**Status:** Approved
**Approach:** A — Surgical layout swap (edit existing components, no Sanity schema changes)

---

## Goal

Redesign homepage layout to match Scentspired reference — more commercial, promotional, editorial. Keep camel/gold brand colors. All Sanity data interfaces unchanged.

---

## Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Color scheme | Keep camel/gold | Matches existing brand system |
| Hero layout | Split-column (text left, image right) | More commercial/promotional |
| Hero promo | Seasonal sale badge (50% OFF) | Drives urgency |
| Brand story section | Rebuild as dark "Icons" editorial | Adds prestige, matches reference |
| Best Sellers | Static 2-col split (grid + lifestyle image) | More editorial than carousel |
| FeaturedProducts | 4-equal-col grid, always-visible cart button | Matches reference product grid |
| Sanity schema | No changes | All data fits existing types |

---

## Sections

### 1. Hero — `components/home/Hero.tsx`

**Layout:** Two-column split at `lg:`. Left 55%, right 45%. Mobile: stacked (text → image).

**Left column:**
- Eyebrow: `"Inspired by Icons. Reimagined for You."` (from `data.subheadline` fallback)
- Headline: `data.headline` (e.g. `"Spring Summer Story"`)
- Discount badge: `"50% OFF / LIMITED TIME OFFER"` — pill with camel-500 background, white text. Hardcoded until Sanity `discountLabel` optional field added later.
- Subtitle: short body text (from `data.subheadline` secondary or hardcoded fallback)
- CTA button: `data.cta` → `/products`
- Stats row: `100% Authentic · 50+ Maisons · 30-Day Returns` — below CTA, border-top divider

**Right column:**
- `data.bgImageUrl` or fallback `/images/categories/I1.webp`
- `aspect-[3/4]` at lg, fills height at md
- No overlay, no parallax
- Slight inset shadow on left edge to blend columns

**Removed:** parallax scroll, full-bleed bg, scroll indicator, corner brackets

---

### 2. Marquee Strip — `components/home/MarqueeStrip.tsx`

**Unchanged.** Already matches reference style.

---

### 3. TrustBar — `components/home/TrustBar.tsx`

**Unchanged.**

---

### 4. Categories — `components/home/Categories.tsx`

**Layout:** Same 3-column grid, same `aspect-[3/4]` cards.

**Changes:**
- Heading: left-aligned (was centered). Eyebrow `"Shop By"` + `h2` left-flush.
- Taglines always visible (was hidden until hover).
- Per-card CTA button always visible at bottom: `"Shop [Name]"` — camel-bordered, small pill, white text on hover.
- Remove "Shop Now" link below grid — per-card buttons replace it.
- Hover: image scale stays, remove opacity-0 on CTA (already visible).

---

### 5. Featured Products — `components/home/FeaturedProducts.tsx`

**Layout:** 4-column equal grid (`grid-cols-2 md:grid-cols-4`). No hero card.

**Heading:** Left-aligned.
- Eyebrow: `"Luxury You Can Afford"`
- `h2`: `"Signature Inspirations"` (or `data.title`)
- Underline accent: camel-500 `h-px w-16` left-aligned

**Card changes:**
- All cards `aspect-[3/4]`, no hero variant
- "Add to Cart" button always visible below image (not hover-only)
- Button: full-width, camel-bordered, `font-body text-[11px] uppercase tracking-widest`
- Compare price strikethrough shown when `compareAtPrice` set
- Hover: image scale + button bg fill camel-500/10

**CTA:** `"View All Products"` → `/products`, right-aligned below grid, replaces current centered button.

---

### 6. BrandStory → Icons Section — `components/home/BrandStory.tsx`

**Full rebuild of this component's render, props interface unchanged.**

**Layout:** Full-width, `bg-ink-950`. Split 50/50 at `lg:`. Mobile: stacked (image top, text below).

**Left (text) column:**
- `"ICONS"` as giant watermark (`text-[8rem] font-bold text-stone-800/20 absolute`)
- Stacked brand names: `YSL` / `Dior` / `Chanel` — each on own line, `font-display text-5xl md:text-7xl font-light text-stone-100`, staggered scroll-in animation
- Subtitle: `"Inspired by the greats. Made for you."` — `font-body text-stone-400`
- CTA: `"Shop Now"` → `/products` — bordered camel button

**Right (image) column:**
- Single product image from `data.image` → `urlFor()` or fallback `/images/products/p1.jpeg`
- `aspect-[3/4]`, `object-cover`, slight warm overlay `bg-camel-500/5`

**Animation:** `useInView` stagger on brand names — `opacity: 0, x: -20` → `opacity: 1, x: 0`, each 0.15s apart.

---

### 7. Best Sellers — `components/home/BestSellers.tsx`

**Layout:** Two-column split at `lg:`. Left 60% (heading + 2×2 grid), right 40% (lifestyle image). Mobile: stacked, image hidden.

**Left column:**
- Heading: `"Best Sellers"` left-aligned, same eyebrow `"Top Picks"`
- 2×2 product grid (4 products max from `data.products.slice(0, 4)`)
- "View All Products" → `/products?filter=bestseller` link below grid
- Remove prev/next carousel buttons

**Product card (shared with FeaturedProducts style):**
- `aspect-[3/4]`, always-visible "Add to Cart" below image
- Best Seller badge top-left
- Wishlist heart top-right

**Right column:**
- Lifestyle image: `data.lifestyleImage` (new optional field on type, not schema) or fallback `/images/categories/I2.webp`
- `aspect-[3/4] lg:h-full`, `object-cover`

---

### 8. Newsletter — `components/home/Newsletter.tsx`

**Unchanged.**

---

## Files Changed

| File | Change type |
|------|-------------|
| `components/home/Hero.tsx` | Layout rewrite |
| `components/home/Categories.tsx` | Heading alignment, always-visible CTA |
| `components/home/FeaturedProducts.tsx` | Grid layout, heading, card button |
| `components/home/BrandStory.tsx` | Full rebuild to Icons section |
| `components/home/BestSellers.tsx` | Split layout, remove carousel |

## Files Unchanged

- `components/home/MarqueeStrip.tsx`
- `components/home/TrustBar.tsx`
- `components/home/Newsletter.tsx`
- `components/home/Testimonials.tsx`
- `components/home/ScentBanner.tsx`
- All Sanity schema files
- All TypeScript type definitions (no breaking changes)

---

## Constraints

- No Sanity schema migrations
- No new npm packages
- RTL/Arabic layout must still work — all flex directions use `rtl:` variants where needed
- Framer Motion animations kept, just reorganized
- Mobile-first — each layout collapses gracefully
