# Arabic/English Bilingual Support — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full Arabic/English bilingual support — URL-based locale routing (`/en/*`, `/ar/*`), RTL layout, bilingual Sanity content fields (`field_en`/`field_ar`), Cairo font for Arabic, and a language switcher in the header.

**Architecture:** `next-intl` middleware handles locale routing and sets locale context. Root `app/layout.tsx` reads locale to set `lang` and `dir` on `<html>`. UI strings live in `messages/en.json` + `messages/ar.json`. Sanity document fields are duplicated with `_en`/`_ar` suffixes; a `localField()` helper resolves the right field per locale.

**Tech Stack:** Next.js 15 App Router, next-intl ^3.x, Sanity CMS, Cairo (next/font/google), Tailwind CSS RTL modifiers, TypeScript

---

## File Map

### New Files
| File | Purpose |
|------|---------|
| `i18n.ts` | next-intl request config — loads message JSON per locale |
| `middleware.ts` | next-intl locale middleware — routing + cookie persistence |
| `messages/en.json` | All English UI strings |
| `messages/ar.json` | All Arabic UI strings |
| `lib/i18n-helpers.ts` | `localField()` — reads `field_en` or `field_ar` from any object |
| `app/[locale]/layout.tsx` | Locale layout — NextIntlClientProvider + Cairo font class |
| `components/layout/LanguageSwitcher.tsx` | EN/AR toggle button in header |

### Modified Files
| File | Change |
|------|--------|
| `package.json` | Remove `i18next`, `react-i18next`; add `next-intl` |
| `next.config.ts` | Wrap with `withNextIntl` plugin |
| `app/layout.tsx` | Reads locale from `next-intl/server` → sets `lang`/`dir` on `<html>` |
| `app/page.tsx` → `app/[locale]/page.tsx` | Move under locale segment |
| `app/about/page.tsx` → `app/[locale]/about/page.tsx` | Move |
| `app/journal/page.tsx` → `app/[locale]/journal/page.tsx` | Move |
| `app/products/page.tsx` → `app/[locale]/products/page.tsx` | Move |
| `app/products/[slug]/page.tsx` → `app/[locale]/products/[slug]/page.tsx` | Move |
| `app/cart/page.tsx` → `app/[locale]/cart/page.tsx` | Move |
| `app/checkout/page.tsx` → `app/[locale]/checkout/page.tsx` | Move |
| `app/checkout/success/page.tsx` → `app/[locale]/checkout/success/page.tsx` | Move |
| `app/checkout/cancel/page.tsx` → `app/[locale]/checkout/cancel/page.tsx` | Move |
| `app/search/page.tsx` → `app/[locale]/search/page.tsx` | Move |
| `app/wishlist/page.tsx` → `app/[locale]/wishlist/page.tsx` | Move |
| `lib/types.ts` | All translatable fields → `field_en` + `field_ar` |
| `sanity/schemaTypes/product.ts` | Bilingual fields |
| `sanity/schemaTypes/category.ts` | Bilingual fields |
| `sanity/schemaTypes/testimonial.ts` | Bilingual fields |
| All 11 `sanity/schemaTypes/blocks/*.ts` | Bilingual fields |
| All GROQ queries in `lib/sanity/` + page files | Request `field_en`, `field_ar` not `field` |
| `components/layout/Header.tsx` | Add LanguageSwitcher, nav via `useTranslations` |
| `components/layout/Footer.tsx` | Footer strings via `useTranslations` |
| All 32 component files | `useTranslations()` for UI strings, `localField()` for CMS content |

---

## Task 1: Install next-intl, remove i18next packages

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Remove i18next packages and add next-intl**

```bash
npm uninstall i18next react-i18next
npm install next-intl
```

- [ ] **Step 2: Verify install**

```bash
npm ls next-intl
```

Expected: `next-intl@3.x.x` listed with no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: replace i18next with next-intl"
```

---

## Task 2: Create i18n.ts and message files

**Files:**
- Create: `i18n.ts`
- Create: `messages/en.json`
- Create: `messages/ar.json`

- [ ] **Step 1: Create `i18n.ts`**

```ts
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}))
```

- [ ] **Step 2: Create `messages/en.json`**

```json
{
  "nav": {
    "home": "Home",
    "products": "Products",
    "about": "About",
    "journal": "Journal",
    "cart": "Cart",
    "wishlist": "Wishlist",
    "search": "Search"
  },
  "product": {
    "addToCart": "Add to Cart",
    "quickView": "Quick View",
    "outOfStock": "Out of Stock",
    "viewDetails": "View Details",
    "relatedProducts": "You May Also Like",
    "fragranceNotes": "Fragrance Notes",
    "top": "Top",
    "middle": "Middle",
    "base": "Base",
    "intensity": "Intensity",
    "sillage": "Sillage",
    "longevity": "Longevity",
    "addToWishlist": "Add to Wishlist",
    "removeFromWishlist": "Remove from Wishlist",
    "inStock": "In Stock",
    "selectSize": "Select Size"
  },
  "cart": {
    "title": "Your Cart",
    "empty": "Your cart is empty",
    "checkout": "Checkout",
    "continueShopping": "Continue Shopping",
    "total": "Total",
    "subtotal": "Subtotal",
    "remove": "Remove",
    "quantity": "Qty",
    "itemAdded": "Item added to cart"
  },
  "checkout": {
    "title": "Checkout",
    "placeOrder": "Place Order",
    "orderSummary": "Order Summary",
    "paymentDetails": "Payment Details",
    "shippingDetails": "Shipping Details"
  },
  "search": {
    "placeholder": "Search fragrances...",
    "noResults": "No results found for",
    "resultsFor": "Results for"
  },
  "newsletter": {
    "placeholder": "Your email address",
    "subscribe": "Subscribe",
    "success": "Thank you for subscribing!"
  },
  "wishlist": {
    "title": "Wishlist",
    "empty": "Your wishlist is empty"
  },
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "backToHome": "Back to Home",
    "viewAll": "View All",
    "learnMore": "Learn More",
    "close": "Close",
    "open": "Open",
    "new": "New",
    "sale": "Sale",
    "featured": "Featured"
  },
  "language": {
    "switchToArabic": "عربي",
    "switchToEnglish": "English"
  }
}
```

- [ ] **Step 3: Create `messages/ar.json`**

```json
{
  "nav": {
    "home": "الرئيسية",
    "products": "المنتجات",
    "about": "من نحن",
    "journal": "المجلة",
    "cart": "السلة",
    "wishlist": "المفضلة",
    "search": "بحث"
  },
  "product": {
    "addToCart": "أضف إلى السلة",
    "quickView": "عرض سريع",
    "outOfStock": "نفد المخزون",
    "viewDetails": "عرض التفاصيل",
    "relatedProducts": "قد يعجبك أيضاً",
    "fragranceNotes": "مكونات العطر",
    "top": "رأسية",
    "middle": "قلبية",
    "base": "قاعدية",
    "intensity": "الكثافة",
    "sillage": "الأثر",
    "longevity": "الثبات",
    "addToWishlist": "أضف إلى المفضلة",
    "removeFromWishlist": "حذف من المفضلة",
    "inStock": "متوفر",
    "selectSize": "اختر الحجم"
  },
  "cart": {
    "title": "سلة التسوق",
    "empty": "سلتك فارغة",
    "checkout": "الدفع",
    "continueShopping": "مواصلة التسوق",
    "total": "الإجمالي",
    "subtotal": "المجموع الجزئي",
    "remove": "حذف",
    "quantity": "الكمية",
    "itemAdded": "تمت إضافة المنتج إلى السلة"
  },
  "checkout": {
    "title": "الدفع",
    "placeOrder": "تأكيد الطلب",
    "orderSummary": "ملخص الطلب",
    "paymentDetails": "تفاصيل الدفع",
    "shippingDetails": "تفاصيل الشحن"
  },
  "search": {
    "placeholder": "ابحث عن العطور...",
    "noResults": "لا توجد نتائج لـ",
    "resultsFor": "نتائج البحث عن"
  },
  "newsletter": {
    "placeholder": "بريدك الإلكتروني",
    "subscribe": "اشترك",
    "success": "شكراً لاشتراكك!"
  },
  "wishlist": {
    "title": "المفضلة",
    "empty": "قائمة مفضلتك فارغة"
  },
  "common": {
    "loading": "جاري التحميل...",
    "error": "حدث خطأ ما",
    "backToHome": "العودة للرئيسية",
    "viewAll": "عرض الكل",
    "learnMore": "اعرف أكثر",
    "close": "إغلاق",
    "open": "فتح",
    "new": "جديد",
    "sale": "تخفيض",
    "featured": "مميز"
  },
  "language": {
    "switchToArabic": "عربي",
    "switchToEnglish": "English"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add i18n.ts messages/
git commit -m "feat: add next-intl config and message files (en/ar)"
```

---

## Task 3: Create middleware.ts

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create `middleware.ts`**

```ts
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always'
})

export const config = {
  matcher: [
    '/((?!api|studio|_next|_vercel|favicon\\.ico|.*\\..*).*)'
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: add next-intl locale routing middleware"
```

---

## Task 4: Update next.config.ts

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Read current `next.config.ts`**

Read the file to see its current shape before editing.

- [ ] **Step 2: Wrap config with next-intl plugin**

The file currently looks something like:
```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ... existing config
}

export default nextConfig
```

Replace with:
```ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  // ... keep all existing config exactly as-is
}

export default withNextIntl(nextConfig)
```

- [ ] **Step 3: Verify build compiles**

```bash
npm run build 2>&1 | head -30
```

Expected: no `next-intl` import errors. (There may be other errors about missing `[locale]` segment — that's fine, fixed in Task 6.)

- [ ] **Step 4: Commit**

```bash
git add next.config.ts
git commit -m "feat: wire next-intl plugin into next.config.ts"
```

---

## Task 5: Update lib/types.ts — bilingual fields

**Files:**
- Modify: `lib/types.ts`

- [ ] **Step 1: Read `lib/types.ts`**

Read the full file before editing.

- [ ] **Step 2: Replace all translatable string fields with bilingual variants**

For every type that has translatable content, replace single-language fields with `_en`/`_ar` pairs. The full updated types should be:

```ts
export interface Product {
  _id: string
  _type: 'product'
  name_en: string
  name_ar: string
  slug: { current: string }
  description_en: string
  description_ar: string
  story_en: any[] // Portable Text blocks
  story_ar: any[] // Portable Text blocks
  price: number
  comparePrice?: number
  images: SanityImage[]
  category?: Category
  fragranceFamily?: string
  topNotes_en?: string[]
  topNotes_ar?: string[]
  middleNotes_en?: string[]
  middleNotes_ar?: string[]
  baseNotes_en?: string[]
  baseNotes_ar?: string[]
  intensity?: string
  sillage?: string
  longevity?: string
  tags?: string[]
  volume?: VolumePricing[]
  inStock?: boolean
  featured?: boolean
  bestSeller?: boolean
  seoTitle_en?: string
  seoTitle_ar?: string
  seoDescription_en?: string
  seoDescription_ar?: string
}

export interface Category {
  _id: string
  _type: 'category'
  name_en: string
  name_ar: string
  slug: { current: string }
  description_en?: string
  description_ar?: string
  image?: SanityImage
}

export interface Testimonial {
  _id: string
  name_en: string
  name_ar: string
  location_en?: string
  location_ar?: string
  review_en: string
  review_ar: string
  rating?: number
  avatar?: SanityImage
}

// Keep all non-translatable types (SanityImage, VolumePricing, etc.) unchanged.
// Update section block types to use _en/_ar for all string fields:

export interface HeroSection {
  _type: 'heroSection'
  _key?: string
  headline_en?: string
  headline_ar?: string
  subheadline_en?: string
  subheadline_ar?: string
  bgImage?: SanityImage
  cta?: CtaButton
}

export interface ScentBannerSection {
  _type: 'scentBannerSection'
  _key?: string
  eyebrow_en?: string
  eyebrow_ar?: string
  headline_en?: string
  headline_ar?: string
  highlightWord_en?: string
  highlightWord_ar?: string
  subtext_en?: string
  subtext_ar?: string
  image?: SanityImage
  cta?: CtaButton
}

export interface BrandStorySection {
  _type: 'brandStorySection'
  _key?: string
  eyebrow_en?: string
  eyebrow_ar?: string
  headline_en?: string
  headline_ar?: string
  body_en?: string
  body_ar?: string
  image?: SanityImage
  cta?: CtaButton
}

export interface NewsletterSection {
  _type: 'newsletterSection'
  _key?: string
  headline_en?: string
  headline_ar?: string
  subtext_en?: string
  subtext_ar?: string
  buttonLabel_en?: string
  buttonLabel_ar?: string
}

export interface FeaturedProductsSection {
  _type: 'featuredProductsSection'
  _key?: string
  title_en?: string
  title_ar?: string
  subtitle_en?: string
  subtitle_ar?: string
  products?: Product[]
}

export interface BestSellersSection {
  _type: 'bestSellersSection'
  _key?: string
  title_en?: string
  title_ar?: string
}

export interface CategoriesSection {
  _type: 'categoriesSection'
  _key?: string
  title_en?: string
  title_ar?: string
}

export interface MarqueeSection {
  _type: 'marqueeSection'
  _key?: string
  text_en?: string
  text_ar?: string
}

export interface TestimonialsSection {
  _type: 'testimonialsSection'
  _key?: string
  title_en?: string
  title_ar?: string
}

export interface TrustBarSection {
  _type: 'trustBarSection'
  _key?: string
  items?: { value: string; label_en: string; label_ar: string }[]
}

export interface CustomBannerSection {
  _type: 'customBannerSection'
  _key?: string
  headline_en?: string
  headline_ar?: string
  subtext_en?: string
  subtext_ar?: string
  image?: SanityImage
  cta?: CtaButton
}

export interface CtaButton {
  label_en: string
  label_ar: string
  link?: string
  style?: string
}
```

Keep any types not listed above (e.g. `SanityImage`, `VolumePricing`, `PageSection` union type) unchanged from the original file. Only modify the field names on translatable string fields.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: update TypeScript types to bilingual _en/_ar fields"
```

---

## Task 6: Create lib/i18n-helpers.ts

**Files:**
- Create: `lib/i18n-helpers.ts`
- Create: `lib/i18n-helpers.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// lib/i18n-helpers.test.ts
import { localField } from './i18n-helpers'

describe('localField', () => {
  const obj = { name_en: 'Rose Oud', name_ar: 'ورد العود' }

  it('returns _ar field when locale is ar', () => {
    expect(localField(obj, 'name', 'ar')).toBe('ورد العود')
  })

  it('returns _en field when locale is en', () => {
    expect(localField(obj, 'name', 'en')).toBe('Rose Oud')
  })

  it('falls back to _en when _ar is missing', () => {
    const partial = { name_en: 'Rose Oud' }
    expect(localField(partial, 'name', 'ar')).toBe('Rose Oud')
  })

  it('returns empty string when both are missing', () => {
    expect(localField({}, 'name', 'ar')).toBe('')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest lib/i18n-helpers.test.ts 2>&1 | tail -10
```

Expected: FAIL — `localField` not defined.

- [ ] **Step 3: Create `lib/i18n-helpers.ts`**

```ts
type Locale = 'en' | 'ar'

export function localField(obj: Record<string, any>, field: string, locale: Locale): string {
  return obj[`${field}_${locale}`] ?? obj[`${field}_en`] ?? ''
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest lib/i18n-helpers.test.ts 2>&1 | tail -10
```

Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add lib/i18n-helpers.ts lib/i18n-helpers.test.ts
git commit -m "feat: add localField helper for bilingual CMS field resolution"
```

---

## Task 7: Restructure app routing — move pages under [locale]

**Files:**
- Create: `app/[locale]/` directory with all user-facing pages
- Modify: `app/layout.tsx`

> This task moves files. `api/`, `studio/`, `loading.tsx`, `error.tsx`, `not-found.tsx` stay at root.

- [ ] **Step 1: Create locale directory and move pages**

```bash
mkdir -p app/[locale]/products/\[slug\]
mkdir -p app/[locale]/checkout/success
mkdir -p app/[locale]/checkout/cancel

# Move all user-facing pages
cp app/page.tsx app/[locale]/page.tsx
cp app/about/page.tsx app/[locale]/about/page.tsx
cp app/journal/page.tsx app/[locale]/journal/page.tsx
cp app/products/page.tsx app/[locale]/products/page.tsx
cp "app/products/[slug]/page.tsx" "app/[locale]/products/[slug]/page.tsx"
cp app/cart/page.tsx app/[locale]/cart/page.tsx
cp app/checkout/page.tsx app/[locale]/checkout/page.tsx
cp app/checkout/success/page.tsx app/[locale]/checkout/success/page.tsx
cp app/checkout/cancel/page.tsx app/[locale]/checkout/cancel/page.tsx
cp app/search/page.tsx app/[locale]/search/page.tsx
cp app/wishlist/page.tsx app/[locale]/wishlist/page.tsx
```

- [ ] **Step 2: Delete old top-level page files** (keep directories for now if they have other files)

```bash
rm app/page.tsx
rm app/about/page.tsx
rm app/journal/page.tsx
rm app/products/page.tsx
rm "app/products/[slug]/page.tsx"
rm app/cart/page.tsx
rm app/checkout/page.tsx
rm app/checkout/success/page.tsx
rm app/checkout/cancel/page.tsx
rm app/search/page.tsx
rm app/wishlist/page.tsx
```

- [ ] **Step 3: Update `app/layout.tsx` to read locale and set `lang`/`dir` on `<html>`**

Read the current `app/layout.tsx` first, then replace it with:

```tsx
import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond, Cairo } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import './globals.css'

// Existing English fonts — keep whatever fonts were in the original layout
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Luxe Parfum',
  description: 'Luxury fragrances',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const isArabic = locale === 'ar'

  return (
    <html
      lang={locale}
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`${playfair.variable} ${cormorant.variable} ${isArabic ? cairo.variable : ''}`}
    >
      <body>{children}</body>
    </html>
  )
}
```

> **Note:** Read the original `app/layout.tsx` before replacing it. Keep any existing font imports, metadata, and global CSS imports. The key additions are: `getLocale()`, `cairo` font, `dir` and `lang` attributes on `<html>`. Adjust font variable names to match what was already in the file.

- [ ] **Step 4: Commit**

```bash
git add app/
git commit -m "feat: restructure app routing under [locale] segment"
```

---

## Task 8: Create app/[locale]/layout.tsx

**Files:**
- Create: `app/[locale]/layout.tsx`

- [ ] **Step 1: Create `app/[locale]/layout.tsx`**

```tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Providers from '@/components/layout/Providers'
import ConditionalLayout from '@/components/layout/ConditionalLayout'

const locales = ['en', 'ar']

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale)) notFound()

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <ConditionalLayout>{children}</ConditionalLayout>
      </Providers>
    </NextIntlClientProvider>
  )
}
```

> **Note:** Read the original `app/layout.tsx` before writing this. The `[locale]/layout.tsx` should include all providers and layout wrappers that were previously in root `app/layout.tsx` (e.g. `Providers`, `ConditionalLayout`, cart/wishlist providers). The root `app/layout.tsx` (Task 7) only keeps `<html>` and `<body>`.

- [ ] **Step 2: Verify dev server starts**

```bash
npm run dev 2>&1 | head -20
```

Expected: Starts without errors. `localhost:3000` should redirect to `localhost:3000/en`.

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/layout.tsx
git commit -m "feat: add [locale] layout with NextIntlClientProvider"
```

---

## Task 9: Update Sanity schema — product.ts

**Files:**
- Modify: `sanity/schemaTypes/product.ts`

- [ ] **Step 1: Read `sanity/schemaTypes/product.ts`**

Read the full file before editing.

- [ ] **Step 2: Replace all translatable string/text/array fields with bilingual pairs**

For each translatable field in the schema, replace the single field with two. Do NOT change non-translatable fields (`slug`, `price`, `images`, `category`, `fragranceFamily` enum, `intensity`, `sillage`, `longevity`, `inStock`, `featured`, `bestSeller`).

Translatable fields to bilingualize:

```ts
// name
{ name: 'name_en', title: 'Product Name (English)', type: 'string', validation: (R) => R.required().max(100) },
{ name: 'name_ar', title: 'اسم المنتج (Arabic)', type: 'string', validation: (R) => R.max(100) },

// description
{ name: 'description_en', title: 'Short Description (English)', type: 'text', rows: 3, validation: (R) => R.max(500) },
{ name: 'description_ar', title: 'وصف قصير (Arabic)', type: 'text', rows: 3, validation: (R) => R.max(500) },

// story (portable text)
{ name: 'story_en', title: 'Brand Story (English)', type: 'array', of: [{ type: 'block' }] },
{ name: 'story_ar', title: 'قصة العلامة (Arabic)', type: 'array', of: [{ type: 'block' }] },

// topNotes
{ name: 'topNotes_en', title: 'Top Notes (English)', type: 'array', of: [{ type: 'string' }] },
{ name: 'topNotes_ar', title: 'النوتات الرأسية (Arabic)', type: 'array', of: [{ type: 'string' }] },

// middleNotes
{ name: 'middleNotes_en', title: 'Middle Notes (English)', type: 'array', of: [{ type: 'string' }] },
{ name: 'middleNotes_ar', title: 'النوتات القلبية (Arabic)', type: 'array', of: [{ type: 'string' }] },

// baseNotes
{ name: 'baseNotes_en', title: 'Base Notes (English)', type: 'array', of: [{ type: 'string' }] },
{ name: 'baseNotes_ar', title: 'النوتات القاعدية (Arabic)', type: 'array', of: [{ type: 'string' }] },

// seoTitle
{ name: 'seoTitle_en', title: 'SEO Title (English)', type: 'string', validation: (R) => R.max(60) },
{ name: 'seoTitle_ar', title: 'عنوان SEO (Arabic)', type: 'string', validation: (R) => R.max(60) },

// seoDescription
{ name: 'seoDescription_en', title: 'SEO Description (English)', type: 'text', rows: 2, validation: (R) => R.max(160) },
{ name: 'seoDescription_ar', title: 'وصف SEO (Arabic)', type: 'text', rows: 2, validation: (R) => R.max(160) },
```

Also update the document title preview to use `name_en`:
```ts
preview: {
  select: { title: 'name_en', media: 'images.0' },
  prepare({ title, media }) {
    return { title, media }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add sanity/schemaTypes/product.ts
git commit -m "feat: bilingualize product Sanity schema (_en/_ar fields)"
```

---

## Task 10: Update Sanity schemas — category.ts and testimonial.ts

**Files:**
- Modify: `sanity/schemaTypes/category.ts`
- Modify: `sanity/schemaTypes/testimonial.ts`

- [ ] **Step 1: Read both files**

Read `sanity/schemaTypes/category.ts` and `sanity/schemaTypes/testimonial.ts` before editing.

- [ ] **Step 2: Update `category.ts`**

Replace translatable fields:

```ts
// name
{ name: 'name_en', title: 'Category Name (English)', type: 'string', validation: (R) => R.required().max(80) },
{ name: 'name_ar', title: 'اسم التصنيف (Arabic)', type: 'string', validation: (R) => R.max(80) },

// description
{ name: 'description_en', title: 'Description (English)', type: 'text', rows: 3, validation: (R) => R.max(300) },
{ name: 'description_ar', title: 'الوصف (Arabic)', type: 'text', rows: 3, validation: (R) => R.max(300) },
```

Update preview:
```ts
preview: {
  select: { title: 'name_en', media: 'image' },
}
```

- [ ] **Step 3: Update `testimonial.ts`**

Replace translatable fields:

```ts
// name
{ name: 'name_en', title: 'Customer Name (English)', type: 'string', validation: (R) => R.required().max(80) },
{ name: 'name_ar', title: 'اسم العميل (Arabic)', type: 'string', validation: (R) => R.max(80) },

// location
{ name: 'location_en', title: 'Location (English)', type: 'string', validation: (R) => R.max(80) },
{ name: 'location_ar', title: 'الموقع (Arabic)', type: 'string', validation: (R) => R.max(80) },

// review
{ name: 'review_en', title: 'Review (English)', type: 'text', rows: 4, validation: (R) => R.required().max(1000) },
{ name: 'review_ar', title: 'التقييم (Arabic)', type: 'text', rows: 4, validation: (R) => R.max(1000) },
```

Update preview:
```ts
preview: {
  select: { title: 'name_en', subtitle: 'review_en' },
}
```

- [ ] **Step 4: Commit**

```bash
git add sanity/schemaTypes/category.ts sanity/schemaTypes/testimonial.ts
git commit -m "feat: bilingualize category and testimonial Sanity schemas"
```

---

## Task 11: Update all 11 block schemas

**Files:**
- Modify: `sanity/schemaTypes/blocks/heroSection.ts`
- Modify: `sanity/schemaTypes/blocks/customBannerSection.ts`
- Modify: `sanity/schemaTypes/blocks/scentBannerSection.ts`
- Modify: `sanity/schemaTypes/blocks/brandStorySection.ts`
- Modify: `sanity/schemaTypes/blocks/newsletterSection.ts`
- Modify: `sanity/schemaTypes/blocks/featuredProductsSection.ts`
- Modify: `sanity/schemaTypes/blocks/bestSellersSection.ts`
- Modify: `sanity/schemaTypes/blocks/categoriesSection.ts`
- Modify: `sanity/schemaTypes/blocks/marqueeSection.ts`
- Modify: `sanity/schemaTypes/blocks/testimonialsSection.ts`
- Modify: `sanity/schemaTypes/blocks/trustBarSection.ts`
- Modify: `sanity/schemaTypes/blocks/ctaButton.ts`

- [ ] **Step 1: Read all 12 block schema files before editing**

- [ ] **Step 2: Apply bilingual field transformation to each file**

For each file, replace each translatable `string`/`text` field with two fields. The pattern for every field is:

```ts
// Original
{ name: 'fieldName', title: 'Field Title', type: 'string' }

// Replacement
{ name: 'fieldName_en', title: 'Field Title (English)', type: 'string' },
{ name: 'fieldName_ar', title: 'عنوان الحقل (Arabic)', type: 'string' },
```

Field mapping per schema:

**`heroSection.ts`:** `headline` → `headline_en`/`headline_ar`, `subheadline` → `subheadline_en`/`subheadline_ar`

**`customBannerSection.ts`:** `headline` → `headline_en`/`headline_ar`, `subtext` → `subtext_en`/`subtext_ar`

**`scentBannerSection.ts`:** `eyebrow` → `eyebrow_en`/`eyebrow_ar`, `headline` → `headline_en`/`headline_ar`, `highlightWord` → `highlightWord_en`/`highlightWord_ar`, `subtext` → `subtext_en`/`subtext_ar`

**`brandStorySection.ts`:** `eyebrow` → `eyebrow_en`/`eyebrow_ar`, `headline` → `headline_en`/`headline_ar`, `body` → `body_en`/`body_ar`

**`newsletterSection.ts`:** `headline` → `headline_en`/`headline_ar`, `subtext` → `subtext_en`/`subtext_ar`, `buttonLabel` → `buttonLabel_en`/`buttonLabel_ar`

**`featuredProductsSection.ts`:** `title` → `title_en`/`title_ar`, `subtitle` → `subtitle_en`/`subtitle_ar`

**`bestSellersSection.ts`:** `title` → `title_en`/`title_ar`

**`categoriesSection.ts`:** `title` → `title_en`/`title_ar`

**`marqueeSection.ts`:** `text` → `text_en`/`text_ar`

**`testimonialsSection.ts`:** `title` → `title_en`/`title_ar`

**`trustBarSection.ts`:** Within each item in the array, `label` → `label_en`/`label_ar` (keep `value` unchanged as it's a non-translatable number/stat)

**`ctaButton.ts`:** `label` → `label_en`/`label_ar`

Arabic titles to use:
- `headline` → `العنوان (Arabic)`
- `subheadline` → `العنوان الفرعي (Arabic)`
- `subtext` → `النص التوضيحي (Arabic)`
- `eyebrow` → `النص العلوي (Arabic)`
- `highlightWord` → `الكلمة المميزة (Arabic)`
- `body` → `نص المحتوى (Arabic)`
- `title` → `العنوان (Arabic)`
- `subtitle` → `العنوان الفرعي (Arabic)`
- `text` → `النص (Arabic)`
- `buttonLabel` → `نص الزر (Arabic)`
- `label` → `التصنيف (Arabic)`

- [ ] **Step 3: Commit**

```bash
git add sanity/schemaTypes/blocks/
git commit -m "feat: bilingualize all 11 Sanity block schemas"
```

---

## Task 12: Update GROQ queries to fetch bilingual fields

**Files:**
- Modify: All files in `lib/sanity/` that contain GROQ queries
- Modify: All page files in `app/[locale]/` that contain inline GROQ queries

- [ ] **Step 1: Find all GROQ queries in the codebase**

```bash
grep -r "\*\[_type" --include="*.ts" --include="*.tsx" -l .
```

This lists every file with GROQ queries. Common locations: `lib/sanity/fetch.ts`, `lib/sanity/queries.ts`, page files.

- [ ] **Step 2: For each file found, update field projections**

In GROQ projections, replace single-language field names with both variants:

```groq
// Before
*[_type == "product"] {
  name,
  description,
  story,
  topNotes,
  middleNotes,
  baseNotes,
  seoTitle,
  seoDescription,
  "category": category->{name, slug, image}
}

// After
*[_type == "product"] {
  name_en,
  name_ar,
  description_en,
  description_ar,
  story_en,
  story_ar,
  topNotes_en,
  topNotes_ar,
  middleNotes_en,
  middleNotes_ar,
  baseNotes_en,
  baseNotes_ar,
  seoTitle_en,
  seoTitle_ar,
  seoDescription_en,
  seoDescription_ar,
  "category": category->{name_en, name_ar, slug, description_en, description_ar, image}
}
```

For category queries:
```groq
// Before
*[_type == "category"] { name, description, slug, image }

// After
*[_type == "category"] { name_en, name_ar, description_en, description_ar, slug, image }
```

For testimonial queries:
```groq
// Before
*[_type == "testimonial"] { name, location, review, rating, avatar }

// After
*[_type == "testimonial"] { name_en, name_ar, location_en, location_ar, review_en, review_ar, rating, avatar }
```

For homePage/block queries, each block's text fields:
```groq
// Hero block
{ _type, _key, headline_en, headline_ar, subheadline_en, subheadline_ar, bgImage, cta }

// scentBanner block
{ _type, _key, eyebrow_en, eyebrow_ar, headline_en, headline_ar, highlightWord_en, highlightWord_ar, subtext_en, subtext_ar, image, cta }

// brandStory block
{ _type, _key, eyebrow_en, eyebrow_ar, headline_en, headline_ar, body_en, body_ar, image, cta }

// newsletter block
{ _type, _key, headline_en, headline_ar, subtext_en, subtext_ar, buttonLabel_en, buttonLabel_ar }

// trust bar items
{ _type, _key, "items": items[]{ value, label_en, label_ar } }

// cta button
{ label_en, label_ar, link, style }
```

Also update any filtering queries (e.g. slug-based lookups — keep filter field as `slug.current` which is not translatable):
```groq
// Slug filter unchanged
*[_type == "product" && slug.current == $slug][0] {
  name_en, name_ar, ...
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/ app/
git commit -m "feat: update GROQ queries to fetch bilingual _en/_ar fields"
```

---

## Task 13: Create LanguageSwitcher component + update Header

**Files:**
- Create: `components/layout/LanguageSwitcher.tsx`
- Modify: `components/layout/Header.tsx`

- [ ] **Step 1: Create `components/layout/LanguageSwitcher.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('language')
  const pathname = usePathname()

  // pathname is e.g. /en/products/oud — swap locale prefix
  const getLocalePath = (targetLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = targetLocale // replace locale segment
    return segments.join('/')
  }

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <Link
        href={getLocalePath('en')}
        className={`px-2 py-1 transition-colors ${
          locale === 'en'
            ? 'text-foreground font-semibold'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label="Switch to English"
        aria-current={locale === 'en' ? 'true' : undefined}
      >
        EN
      </Link>
      <span className="text-muted-foreground">|</span>
      <Link
        href={getLocalePath('ar')}
        className={`px-2 py-1 transition-colors font-cairo ${
          locale === 'ar'
            ? 'text-foreground font-semibold'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        aria-label="Switch to Arabic"
        aria-current={locale === 'ar' ? 'true' : undefined}
      >
        ع
      </Link>
    </div>
  )
}
```

- [ ] **Step 2: Read `components/layout/Header.tsx`**

Read the full file before editing.

- [ ] **Step 3: Update `Header.tsx`**

Make these changes to Header.tsx:

1. Add imports at the top:
```tsx
import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'
```

2. Inside the component, add:
```tsx
const t = useTranslations('nav')
```

3. Replace all hardcoded nav link labels with `t()` calls:
```tsx
// Before
<Link href="/products">Products</Link>

// After
<Link href={`/${locale}/products`}>{t('products')}</Link>
```

> To get the locale in Header (server or client component), use `useLocale()` if client, or `getLocale()` if server.

4. Add `<LanguageSwitcher />` to the header nav area (alongside cart/wishlist icons):
```tsx
<LanguageSwitcher />
```

5. Update all internal hrefs to include locale prefix:
```tsx
// Before
href="/products"
// After — locale from useLocale()
href={`/${locale}/products`}
```

- [ ] **Step 4: Commit**

```bash
git add components/layout/LanguageSwitcher.tsx components/layout/Header.tsx
git commit -m "feat: add LanguageSwitcher and bilingual nav to Header"
```

---

## Task 14: Update Footer and remaining layout components

**Files:**
- Modify: `components/layout/Footer.tsx`
- Modify: `components/layout/SearchOverlay.tsx`

- [ ] **Step 1: Read Footer.tsx and SearchOverlay.tsx**

- [ ] **Step 2: Update `Footer.tsx`**

1. Add import: `import { useTranslations } from 'next-intl'`
2. Add inside component: `const t = useTranslations('nav')`
3. Replace hardcoded nav link text with `t()` calls
4. Update all internal hrefs to include locale prefix (same pattern as Header — get locale via `useLocale()`)

- [ ] **Step 3: Update `SearchOverlay.tsx`**

1. Add import: `import { useTranslations } from 'next-intl'`
2. Add inside component: `const t = useTranslations('search')`
3. Replace hardcoded placeholder and labels:
```tsx
// Before
placeholder="Search fragrances..."
// After
placeholder={t('placeholder')}
```

- [ ] **Step 4: Commit**

```bash
git add components/layout/
git commit -m "feat: bilingual strings in Footer and SearchOverlay"
```

---

## Task 15: Update product components

**Files:**
- Modify: `components/product/ProductCard.tsx`
- Modify: `components/product/ProductGrid.tsx`
- Modify: `components/product/ProductFilters.tsx`
- Modify: `components/product/ImageGallery.tsx`
- Modify: `components/product/FragranceNotes.tsx`
- Modify: `components/product/RelatedProducts.tsx`
- Modify: `components/product/QuickViewModal.tsx`

- [ ] **Step 1: Read all 7 product component files**

- [ ] **Step 2: Update each component — pattern to apply**

For **UI strings** (buttons, labels, static text), add `useTranslations`:
```tsx
import { useTranslations } from 'next-intl'
// ...
const t = useTranslations('product')
// Replace hardcoded strings:
<button>{t('addToCart')}</button>
<span>{t('outOfStock')}</span>
<button>{t('quickView')}</button>
```

For **CMS content** (product name, description, notes — anything from Sanity), add `localField`:
```tsx
import { useLocale } from 'next-intl'
import { localField } from '@/lib/i18n-helpers'
// ...
const locale = useLocale()
// Replace direct field access:
// Before: {product.name}
// After: {localField(product, 'name', locale as 'en' | 'ar')}

// Before: {product.description}
// After: {localField(product, 'description', locale as 'en' | 'ar')}

// Before: {product.topNotes?.join(', ')}
// After: {(locale === 'ar' ? product.topNotes_ar : product.topNotes_en)?.join(', ')}
```

For **CategoryCard** or **category name** inside product components:
```tsx
{localField(product.category, 'name', locale as 'en' | 'ar')}
```

Apply same pattern to `RelatedProducts.tsx` and `QuickViewModal.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/product/
git commit -m "feat: bilingual strings and localField in product components"
```

---

## Task 16: Update cart and checkout components

**Files:**
- Modify: `components/cart/CartDrawer.tsx`
- Modify: `components/cart/CartItem.tsx`
- Modify: `components/checkout/OrderSummary.tsx`

- [ ] **Step 1: Read all 3 files**

- [ ] **Step 2: Update `CartDrawer.tsx`**

```tsx
import { useTranslations, useLocale } from 'next-intl'
import { localField } from '@/lib/i18n-helpers'

// Inside component:
const t = useTranslations('cart')
const locale = useLocale()

// Replace hardcoded strings:
// "Your Cart" → {t('title')}
// "Your cart is empty" → {t('empty')}
// "Checkout" → {t('checkout')}
// "Continue Shopping" → {t('continueShopping')}
// "Total" → {t('total')}
```

- [ ] **Step 3: Update `CartItem.tsx`**

```tsx
import { useTranslations, useLocale } from 'next-intl'
import { localField } from '@/lib/i18n-helpers'

const t = useTranslations('cart')
const locale = useLocale()

// Product name in cart comes from cart store — it was added as a string.
// If cart store holds product.name (single string), update cart store to hold
// name_en + name_ar and resolve here.
// If it holds a single resolved name string, keep as-is for now (Phase 2 improvement).

// Replace:
// "Remove" → {t('remove')}
// "Qty" → {t('quantity')}
```

- [ ] **Step 4: Update `OrderSummary.tsx`**

```tsx
import { useTranslations } from 'next-intl'

const t = useTranslations('checkout')

// Replace:
// "Order Summary" → {t('orderSummary')}
// "Place Order" → {t('placeOrder')}
// "Total" → t from 'cart' namespace: {tCart('total')}
```

- [ ] **Step 5: Commit**

```bash
git add components/cart/ components/checkout/
git commit -m "feat: bilingual strings in cart and checkout components"
```

---

## Task 17: Update home section components

**Files:**
- Modify: `components/home/Hero.tsx`
- Modify: `components/home/ScentBanner.tsx`
- Modify: `components/home/BrandStory.tsx`
- Modify: `components/home/FeaturedProducts.tsx`
- Modify: `components/home/BestSellers.tsx`
- Modify: `components/home/Categories.tsx`
- Modify: `components/home/Testimonials.tsx`
- Modify: `components/home/Newsletter.tsx`
- Modify: `components/home/TrustBar.tsx`
- Modify: `components/home/MarqueeStrip.tsx`
- Modify: `components/home/CustomBanner.tsx`

- [ ] **Step 1: Read all 11 home section files**

- [ ] **Step 2: Apply bilingual pattern to each component**

All home section components receive their props from Sanity (via the page builder / homePage document). Apply `localField()` to all CMS string fields. The pattern for every component:

```tsx
import { useLocale } from 'next-intl'
import { localField } from '@/lib/i18n-helpers'

// Inside component — props typed with bilingual fields from lib/types.ts:
const locale = useLocale()

// Before: {section.headline}
// After: {localField(section, 'headline', locale as 'en' | 'ar')}

// Before: {section.subtext}
// After: {localField(section, 'subtext', locale as 'en' | 'ar')}

// Before: {section.body}
// After: {localField(section, 'body', locale as 'en' | 'ar')}

// Before: {cta.label}
// After: {localField(cta, 'label', locale as 'en' | 'ar')}
```

For **Testimonials.tsx** — each testimonial is a CMS object:
```tsx
{localField(testimonial, 'name', locale as 'en' | 'ar')}
{localField(testimonial, 'location', locale as 'en' | 'ar')}
{localField(testimonial, 'review', locale as 'en' | 'ar')}
```

For **Categories.tsx** — each category is a CMS object:
```tsx
{localField(category, 'name', locale as 'en' | 'ar')}
{localField(category, 'description', locale as 'en' | 'ar')}
```

For **TrustBar.tsx** — each trust item:
```tsx
{localField(item, 'label', locale as 'en' | 'ar')}
// item.value stays as-is (not translatable — it's a stat like "100%")
```

For **Newsletter.tsx** — static UI strings from messages:
```tsx
import { useTranslations } from 'next-intl'
const t = useTranslations('newsletter')
// CMS fields: localField(section, 'headline', locale)
// Static: {t('placeholder')}, {t('subscribe')}
```

For **MarqueeStrip.tsx** — text is a CMS string:
```tsx
{localField(section, 'text', locale as 'en' | 'ar')}
```

- [ ] **Step 3: Commit**

```bash
git add components/home/
git commit -m "feat: bilingual CMS content in all home section components"
```

---

## Task 18: RTL layout fixes

**Files:**
- Modify: `components/home/MarqueeStrip.tsx`
- Modify: `components/layout/CartDrawer.tsx`
- Modify: Any component with arrow/chevron icons
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Verify Tailwind RTL support is enabled**

Read `tailwind.config.ts`. Ensure it does NOT have `rtl: false` or missing RTL config. Default Tailwind includes RTL support — nothing to change unless explicitly disabled.

- [ ] **Step 2: Fix MarqueeStrip scroll direction**

Read `components/home/MarqueeStrip.tsx`. The marquee animation scrolls left by default. For RTL it should scroll right.

Find the animation/keyframes definition. It likely uses `translate-x` or `@keyframes marquee`. Add an RTL variant:

```tsx
// If using inline style animation:
const animationDirection = locale === 'ar' ? 'reverse' : 'normal'
<div style={{ animationDirection }}>

// If using Tailwind animation classes:
<div className={`animate-marquee ${locale === 'ar' ? 'direction-reverse' : ''}`}>
```

Add to `tailwind.config.ts` if custom keyframes are defined:
```ts
// In extend.keyframes, add reverse variant if needed
// Or use CSS animation-direction: reverse
```

- [ ] **Step 3: Fix CartDrawer slide direction**

Read `components/cart/CartDrawer.tsx`. The drawer slides in from the right. In RTL it should slide from the left.

Find the translate classes or transition styles. Apply RTL overrides:

```tsx
// Example: if using translate-x classes
<div className={`
  fixed top-0 right-0 h-full w-80 transform transition-transform
  rtl:right-auto rtl:left-0
  ${isOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full'}
`}>
```

- [ ] **Step 4: Fix arrow/chevron icons**

Search for all chevron/arrow icons across components:

```bash
grep -r "ChevronRight\|ChevronLeft\|ArrowRight\|ArrowLeft" --include="*.tsx" -l .
```

For each file found, add `rtl:scale-x-[-1]` to directional icons so they mirror in RTL:

```tsx
// Before
<ChevronRight className="w-4 h-4" />

// After
<ChevronRight className="w-4 h-4 rtl:scale-x-[-1]" />
```

- [ ] **Step 5: Fix any absolute-positioned decorative elements**

Check components with `absolute left-X` or `absolute right-X` decorative elements. Use RTL overrides:

```tsx
// Before
<div className="absolute left-4 top-4">

// After
<div className="absolute left-4 top-4 rtl:left-auto rtl:right-4">
```

- [ ] **Step 6: Add Cairo font utility class to Tailwind**

Read `tailwind.config.ts`. Add Cairo font to the fontFamily config:

```ts
// In theme.extend.fontFamily:
fontFamily: {
  // ... keep existing fonts
  cairo: ['var(--font-cairo)', 'sans-serif'],
},
```

This enables `font-cairo` utility class used in `LanguageSwitcher`.

- [ ] **Step 7: Commit**

```bash
git add components/ tailwind.config.ts
git commit -m "feat: RTL layout fixes — marquee, drawer, icons, Cairo font utility"
```

---

## Task 19: Update page files — add locale to params and fix links

**Files:**
- Modify: All files in `app/[locale]/`

- [ ] **Step 1: Read each page file under `app/[locale]/`**

- [ ] **Step 2: Update params type in each page**

Each page that uses `params` now has a `locale` parameter:

```tsx
// Before
export default function ProductsPage() {

// After — locale is now in params
export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Pass locale to Sanity queries if needed
```

For `[slug]` pages:
```tsx
export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
```

- [ ] **Step 3: Fix all internal `<Link href>` values in page files**

```tsx
// Before
<Link href="/products">

// After
<Link href={`/${locale}/products`}>
```

- [ ] **Step 4: Update Sanity query calls to pass locale-aware data**

Queries themselves don't change (done in Task 12), but confirm page files pass correct slug/params:
```tsx
const product = await client.fetch(productQuery, { slug })
```

- [ ] **Step 5: Verify full build**

```bash
npm run build 2>&1 | tail -30
```

Expected: Build succeeds. Fix any TypeScript errors related to `locale` param type or missing `_en`/`_ar` fields.

- [ ] **Step 6: Commit**

```bash
git add app/[locale]/
git commit -m "feat: update all locale pages — params, links, locale-aware queries"
```

---

## Task 20: Final verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Manual test checklist**

| Test | Expected |
|------|----------|
| Visit `localhost:3000` | Redirects to `/en` |
| Visit `localhost:3000/ar` | Arabic text, RTL layout, Cairo font |
| Visit `localhost:3000/en` | English text, LTR layout |
| Click EN\|ع toggle | Switches locale, stays on same page |
| Visit `/ar/products` | Product names in Arabic (if filled in Sanity) |
| Cart drawer in `/ar` | Opens from left side |
| Marquee in `/ar` | Scrolls right |
| Arrows/chevrons in `/ar` | Pointing correct direction |
| `<html>` tag in `/ar` | `lang="ar" dir="rtl"` |
| Open Sanity Studio `/studio` | Product has `name_en` and `name_ar` fields |

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit 2>&1 | head -50
```

Fix any remaining type errors.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete Arabic/English bilingual support"
```

---

## Success Criteria

- [ ] `/en/*` → English, LTR, existing fonts
- [ ] `/ar/*` → Arabic, RTL, Cairo font  
- [ ] `<html lang="ar" dir="rtl">` on Arabic pages
- [ ] All 32 components use `useTranslations()` for UI strings
- [ ] All CMS content reads `field_en` or `field_ar` based on locale
- [ ] Language switcher works on all pages
- [ ] No layout breakage in RTL mode
- [ ] Sanity Studio shows bilingual fields per document
- [ ] `npm run build` completes without errors
