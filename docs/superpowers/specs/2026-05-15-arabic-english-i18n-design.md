# Arabic/English Bilingual Support — Design Spec

**Date:** 2026-05-15  
**Project:** Luxe Parfum (p1test)  
**Status:** Approved

---

## Goal

Full Arabic/English bilingual support across the entire site — CMS content, UI strings, routing, and layout direction — with a single toggle for users and a simple editorial workflow in Sanity.

---

## Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Routing | URL-based `/en/*` `/ar/*` | SEO, RTL auto-apply, shareable links |
| i18n library | `next-intl` | App Router native, replaces unused `i18next` |
| Sanity approach | Field-level (`name_en` / `name_ar`) | Single doc per entity, simple editor UX |
| Default locale | English (`/en`) | Current audience baseline |
| Arabic font | Cairo (Google Fonts) | Matches warm editorial luxury aesthetic |

---

## Architecture

Two content layers:

1. **UI strings** — hardcoded labels, nav items, button text, empty states → `messages/en.json` + `messages/ar.json`
2. **CMS content** — products, categories, page sections, testimonials → Sanity bilingual fields

```
User visits /
    ↓ middleware
Redirect → /en (or /ar if cookie set)
    ↓ [locale]/layout.tsx
<html lang="en|ar" dir="ltr|rtl">
    ↓ components
useTranslations() for UI strings
product.name_en | product.name_ar for CMS content
```

---

## Routing

### File Structure

```
app/
├── [locale]/
│   ├── layout.tsx          ← lang + dir on <html>, Cairo font conditional
│   ├── page.tsx
│   ├── about/page.tsx
│   ├── journal/page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/
│   │   ├── page.tsx
│   │   ├── success/page.tsx
│   │   └── cancel/page.tsx
│   ├── search/page.tsx
│   └── wishlist/page.tsx
├── studio/[[...tool]]/     ← unchanged, no locale
├── api/                    ← unchanged, no locale
messages/
├── en.json
└── ar.json
middleware.ts               ← locale detection + redirect
i18n.ts                     ← next-intl config
```

### Middleware Behaviour

- Any path without `/en` or `/ar` prefix → redirect to `/en/path`
- Reads `NEXT_LOCALE` cookie to persist user's last-chosen language
- Sets cookie on locale switch
- Excludes: `/api/*`, `/studio/*`, `/_next/*`, `/favicon.ico`

---

## Sanity Schema Changes

### Pattern

Every translatable string/text field is replaced with two fields:

```ts
// Before
{ name: 'name', title: 'Product Name', type: 'string' }

// After
{ name: 'name_en', title: 'Product Name (English)', type: 'string' },
{ name: 'name_ar', title: 'اسم المنتج (Arabic)', type: 'string' }
```

### Affected Schemas

#### `product.ts`
- `name` → `name_en`, `name_ar`
- `description` → `description_en`, `description_ar`
- `story` (portable text) → `story_en`, `story_ar`
- `topNotes` → `topNotes_en`, `topNotes_ar`
- `middleNotes` → `middleNotes_en`, `middleNotes_ar`
- `baseNotes` → `baseNotes_en`, `baseNotes_ar`
- `seoTitle` → `seoTitle_en`, `seoTitle_ar`
- `seoDescription` → `seoDescription_en`, `seoDescription_ar`

#### `category.ts`
- `name` → `name_en`, `name_ar`
- `description` → `description_en`, `description_ar`

#### `testimonial.ts`
- `name` → `name_en`, `name_ar`
- `location` → `location_en`, `location_ar`
- `review` → `review_en`, `review_ar`

#### `blocks/heroSection.ts`
- `headline` → `headline_en`, `headline_ar`
- `subheadline` → `subheadline_en`, `subheadline_ar`

#### `blocks/scentBannerSection.ts`
- `eyebrow` → `eyebrow_en`, `eyebrow_ar`
- `headline` → `headline_en`, `headline_ar`
- `highlightWord` → `highlightWord_en`, `highlightWord_ar`
- `subtext` → `subtext_en`, `subtext_ar`

#### `blocks/brandStorySection.ts`
- `eyebrow` → `eyebrow_en`, `eyebrow_ar`
- `headline` → `headline_en`, `headline_ar`
- `body` → `body_en`, `body_ar`

#### `blocks/newsletterSection.ts`
- `headline` → `headline_en`, `headline_ar`
- `subtext` → `subtext_en`, `subtext_ar`
- `buttonLabel` → `buttonLabel_en`, `buttonLabel_ar`

#### `blocks/customBannerSection.ts`
- `headline` → `headline_en`, `headline_ar`
- `subtext` → `subtext_en`, `subtext_ar`

#### `blocks/featuredProductsSection.ts`
- `title` → `title_en`, `title_ar`
- `subtitle` → `subtitle_en`, `subtitle_ar`

#### `blocks/bestSellersSection.ts`
- `title` → `title_en`, `title_ar`

#### `blocks/categoriesSection.ts`
- `title` → `title_en`, `title_ar`

#### `blocks/marqueeSection.ts`
- `text` → `text_en`, `text_ar`

#### `blocks/testimonialsSection.ts`
- `title` → `title_en`, `title_ar`

#### `blocks/trustBarSection.ts`
- `label` (per trust item) → `label_en`, `label_ar`

#### `blocks/ctaButton.ts`
- `label` → `label_en`, `label_ar`

---

## TypeScript Types (`lib/types.ts`)

All translatable string fields adopt bilingual shape:

```ts
// Product
name_en: string
name_ar: string
description_en: string
description_ar: string
// ... etc

// Category
name_en: string
name_ar: string

// Section blocks follow same pattern
```

Frontend resolves correct field via locale helper:

```ts
// lib/i18n-helpers.ts
export function localField<T>(obj: T, field: string, locale: 'en' | 'ar'): string {
  return (obj as any)[`${field}_${locale}`] ?? (obj as any)[`${field}_en`] ?? ''
}

// Usage
localField(product, 'name', locale) // → product.name_ar or product.name_en
```

---

## next-intl Setup

### `i18n.ts`
```ts
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}))
```

### `messages/en.json` structure
```json
{
  "nav": { "home": "Home", "products": "Products", "about": "About", "journal": "Journal", "cart": "Cart", "wishlist": "Wishlist", "search": "Search" },
  "product": { "addToCart": "Add to Cart", "quickView": "Quick View", "outOfStock": "Out of Stock", "viewDetails": "View Details", "relatedProducts": "You May Also Like" },
  "cart": { "title": "Your Cart", "empty": "Your cart is empty", "checkout": "Checkout", "continueShopping": "Continue Shopping", "total": "Total", "remove": "Remove" },
  "checkout": { "title": "Checkout", "placeOrder": "Place Order", "orderSummary": "Order Summary" },
  "search": { "placeholder": "Search fragrances...", "noResults": "No results found" },
  "newsletter": { "placeholder": "Your email address", "subscribe": "Subscribe" },
  "common": { "loading": "Loading...", "error": "Something went wrong", "backToHome": "Back to Home" }
}
```

### `messages/ar.json` structure
```json
{
  "nav": { "home": "الرئيسية", "products": "المنتجات", "about": "من نحن", "journal": "المجلة", "cart": "السلة", "wishlist": "المفضلة", "search": "بحث" },
  "product": { "addToCart": "أضف إلى السلة", "quickView": "عرض سريع", "outOfStock": "نفد المخزون", "viewDetails": "عرض التفاصيل", "relatedProducts": "قد يعجبك أيضاً" },
  "cart": { "title": "سلة التسوق", "empty": "سلتك فارغة", "checkout": "الدفع", "continueShopping": "مواصلة التسوق", "total": "الإجمالي", "remove": "حذف" },
  "checkout": { "title": "الدفع", "placeOrder": "تأكيد الطلب", "orderSummary": "ملخص الطلب" },
  "search": { "placeholder": "ابحث عن العطور...", "noResults": "لا توجد نتائج" },
  "newsletter": { "placeholder": "بريدك الإلكتروني", "subscribe": "اشترك" },
  "common": { "loading": "جاري التحميل...", "error": "حدث خطأ ما", "backToHome": "العودة للرئيسية" }
}
```

---

## RTL Layout

### Automatic via `dir="rtl"`

`app/[locale]/layout.tsx` sets direction on `<html>`:

```tsx
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

Tailwind CSS with RTL flips automatically:
- Flex row direction
- Text alignment
- Padding/margin logical properties

### Manual RTL fixes needed

| Component | Fix |
|-----------|-----|
| `MarqueeStrip` | Reverse scroll animation direction |
| Arrow/chevron icons | `rtl:scale-x-[-1]` class |
| Absolute-positioned decorative elements | `rtl:left-auto rtl:right-X` overrides |
| `CartDrawer` slide direction | `rtl:translate-x-full` / `rtl:-translate-x-full` |

### Cairo Font

```tsx
// app/[locale]/layout.tsx
import { Playfair_Display, Cormorant_Garamond, Cairo } from 'next/font/google'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

// Applied on <html> when locale === 'ar'
// className={locale === 'ar' ? cairo.variable : ''}
// Tailwind: font-sans maps to Cairo in ar locale via CSS var override
```

---

## Language Switcher

Lives in `Header.tsx`. Simple link pair:

```tsx
// Switches /en/products/oud → /ar/products/oud and vice versa
// Highlights active locale
// Sets NEXT_LOCALE cookie on click
// Accessible: aria-label="Switch to Arabic" / aria-label="Switch to English"
```

Visual: `EN | AR` text toggle, styled to match header aesthetic.

---

## Packages

### Remove
- `i18next`
- `react-i18next`

### Add
- `next-intl` (^3.x)

---

## Sanity Editor Experience

- Editor opens any document (product, category, section)
- Sees English fields first, Arabic fields below
- No plugin required — field-level approach works with standard Sanity Studio
- Optional future upgrade: group fields into tabs using Sanity field groups

---

## Out of Scope

- Email templates (Stripe/order confirmation) — not bilingual in this phase
- Sanity Studio UI language — stays English
- SEO hreflang tags — add after routing is stable
- Auto-translation — editors fill Arabic fields manually

---

## Migration Note

Existing Sanity documents have `name`, `description` etc. — not `name_en`. After schema migration:
- Old field data stays in dataset but is ignored by new queries
- Editors must re-enter content in `name_en` fields
- Old fields can be removed in a follow-up schema cleanup after content is migrated

---

## Success Criteria

- [ ] `/en/*` serves English, LTR, existing fonts
- [ ] `/ar/*` serves Arabic, RTL, Cairo font
- [ ] All 32 components use `useTranslations()` for UI strings
- [ ] All CMS content reads `field_en` or `field_ar` based on locale
- [ ] Language switcher in Header works on all pages
- [ ] No layout breakage in RTL mode
- [ ] Sanity editors can fill both language fields per document
- [ ] New products added in Sanity automatically available in both locales (once Arabic fields filled)
