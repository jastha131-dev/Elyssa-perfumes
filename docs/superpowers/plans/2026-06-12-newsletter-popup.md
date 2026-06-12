# Newsletter Popup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an admin-controlled newsletter popup that appears on first site visit, collects email/phone/nationality/DOB, and saves leads to Sanity.

**Architecture:** Popup settings live in the existing `siteSettings` Sanity document (new `popup` group). Leads are stored as `newsletterLead` documents via a server-side API route. The `NewsletterPopup` client component reads `localStorage` to suppress repeat displays, and is rendered inside `Providers` alongside existing overlays.

**Tech Stack:** Next.js 15 App Router, Sanity CMS, Framer Motion, next-auth (for session check), TypeScript

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `lib/types.ts` | Modify | Add `PopupSettings` interface |
| `sanity/schemaTypes/newsletterLead.ts` | Create | Lead document schema |
| `sanity/schemaTypes/siteSettings.ts` | Modify | Add `popup` group + 9 fields |
| `sanity/schemaTypes/index.ts` | Modify | Register `newsletterLead` |
| `lib/sanity/queries.ts` | Modify | Add `getPopupSettingsQuery` |
| `lib/sanity/fetch.ts` | Modify | Add `getPopupSettings()` function |
| `app/api/newsletter-lead/route.ts` | Create | POST handler — writes lead to Sanity |
| `components/layout/NewsletterPopup.tsx` | Create | Popup UI + form logic |
| `app/[locale]/layout.tsx` | Modify | Fetch popup settings, pass to Providers |
| `components/layout/Providers.tsx` | Modify | Accept `popupSettings` prop, render popup |

---

## Task 1: Add `PopupSettings` type

**Files:**
- Modify: `lib/types.ts`

- [ ] **Step 1: Add interface to `lib/types.ts`**

Open `lib/types.ts` and append at the end of the file (after the last export):

```typescript
export interface PopupSettings {
  isEnabled: boolean
  imageUrl: string | null
  headline_en: string | null
  headline_ar: string | null
  subtext_en: string | null
  subtext_ar: string | null
  ctaLabel_en: string | null
  ctaLabel_ar: string | null
  delaySeconds: number
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors related to `PopupSettings`.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat(types): add PopupSettings interface"
```

---

## Task 2: Create `newsletterLead` Sanity schema

**Files:**
- Create: `sanity/schemaTypes/newsletterLead.ts`

- [ ] **Step 1: Create the schema file**

Create `sanity/schemaTypes/newsletterLead.ts` with this exact content:

```typescript
import { defineField, defineType } from 'sanity'

export const newsletterLead = defineType({
  name: 'newsletterLead',
  title: 'Newsletter Leads',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (R) => R.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'nationality',
      title: 'Nationality',
      type: 'string',
    }),
    defineField({
      name: 'dateOfBirth',
      title: 'Date of Birth',
      type: 'date',
    }),
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      description: 'en or ar — captured from URL at submission time',
    }),
  ],
  preview: {
    select: { title: 'email', subtitle: 'nationality' },
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add sanity/schemaTypes/newsletterLead.ts
git commit -m "feat(sanity): add newsletterLead document schema"
```

---

## Task 3: Register `newsletterLead` in schema index

**Files:**
- Modify: `sanity/schemaTypes/index.ts`

- [ ] **Step 1: Add import**

In `sanity/schemaTypes/index.ts`, add this import after the existing imports (e.g., after the `productQuestion` import line):

```typescript
import { newsletterLead } from './newsletterLead'
```

- [ ] **Step 2: Register in array**

In the same file, find the `// ── Content documents ──` comment block. Add `newsletterLead` to the array there:

```typescript
  // ── Content documents ──────────────────────────────────────────
  author,
  article,
  product,
  category,
  collection,
  testimonial,
  faqItem,
  contactPage,
  productReview,
  productQuestion,
  newsletterLead,   // ← add this line
  user,
  address,
  order,
```

- [ ] **Step 3: Verify Studio compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add sanity/schemaTypes/index.ts
git commit -m "feat(sanity): register newsletterLead schema"
```

---

## Task 4: Add popup fields to `siteSettings` schema

**Files:**
- Modify: `sanity/schemaTypes/siteSettings.ts`

- [ ] **Step 1: Add popup group**

In `sanity/schemaTypes/siteSettings.ts`, find the `groups` array (around line 32). Add the popup group as the last item:

```typescript
  groups: [
    { name: 'colors', title: '🎨 Color Palette', default: true },
    { name: 'typography', title: '✍️ Typography' },
    { name: 'header', title: '🧭 Header Layout' },
    { name: 'collection', title: '📦 Collection Page' },
    { name: 'pdp', title: '🛍️ Product Detail Page' },
    { name: 'currency', title: '💰 Currency' },
    { name: 'popup', title: '🎁 Welcome Popup' },  // ← add this
  ],
```

- [ ] **Step 2: Add popup fields**

In `sanity/schemaTypes/siteSettings.ts`, find the `defaultCurrency` field (the last field before the closing `]` of the `fields` array). Add these fields after `defaultCurrency`:

```typescript
    defineField({
      name: 'popup',
      title: 'Welcome Popup',
      type: 'object',
      group: 'popup',
      description: 'Newsletter signup popup shown to first-time visitors.',
      fields: [
        defineField({ name: 'isEnabled', title: 'Enable Popup', type: 'boolean', initialValue: false }),
        defineField({ name: 'image', title: 'Left Panel Image', type: 'image', options: { hotspot: true }, description: 'Product/brand image shown on the left side of the popup.' }),
        defineField({ name: 'headline_en', title: 'Headline (English)', type: 'string', description: 'e.g. SIGN UP AND GET 20% OFF', validation: (R) => R.max(60) }),
        defineField({ name: 'headline_ar', title: 'العنوان (Arabic)', type: 'string', validation: (R) => R.max(60) }),
        defineField({ name: 'subtext_en', title: 'Subtext (English)', type: 'string', description: 'e.g. Enjoy an instant discount, exclusive deals, exciting new products, and more', validation: (R) => R.max(120) }),
        defineField({ name: 'subtext_ar', title: 'النص الفرعي (Arabic)', type: 'string', validation: (R) => R.max(120) }),
        defineField({ name: 'ctaLabel_en', title: 'Button Label (English)', type: 'string', initialValue: 'continue', validation: (R) => R.max(30) }),
        defineField({ name: 'ctaLabel_ar', title: 'نص الزر (Arabic)', type: 'string', initialValue: 'متابعة', validation: (R) => R.max(30) }),
        defineField({
          name: 'delaySeconds',
          title: 'Delay Before Showing (seconds)',
          type: 'number',
          initialValue: 2,
          description: 'How many seconds after page load before popup appears. 0 = immediate.',
          validation: (R) => R.min(0).max(10).integer(),
        }),
      ],
    }),
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add sanity/schemaTypes/siteSettings.ts
git commit -m "feat(sanity): add popup group and fields to siteSettings"
```

---

## Task 5: Add GROQ query and fetch function

**Files:**
- Modify: `lib/sanity/queries.ts`
- Modify: `lib/sanity/fetch.ts`

- [ ] **Step 1: Add query to `lib/sanity/queries.ts`**

After the `getSiteLogoQuery` export (around line 614), add:

```typescript
export const getPopupSettingsQuery = `
  *[_type == "siteSettings"][0] {
    "popup": {
      "isEnabled": coalesce(popup.isEnabled, false),
      "imageUrl": popup.image.asset->url,
      "headline_en": popup.headline_en,
      "headline_ar": popup.headline_ar,
      "subtext_en": popup.subtext_en,
      "subtext_ar": popup.subtext_ar,
      "ctaLabel_en": coalesce(popup.ctaLabel_en, "continue"),
      "ctaLabel_ar": coalesce(popup.ctaLabel_ar, "متابعة"),
      "delaySeconds": coalesce(popup.delaySeconds, 2)
    }
  }.popup
`
```

- [ ] **Step 2: Add `PopupSettings` to imports in `lib/sanity/fetch.ts`**

In `lib/sanity/fetch.ts`, find the import line that imports types from `@/lib/types`. Add `PopupSettings` to that import. For example, if the line reads:

```typescript
import type { ... SiteLogo ... } from '@/lib/types'
```

Change it to also include `PopupSettings`:

```typescript
import type { ... SiteLogo, PopupSettings ... } from '@/lib/types'
```

- [ ] **Step 3: Add `getPopupSettingsQuery` to the query imports in `lib/sanity/fetch.ts`**

Find the import from `@/lib/sanity/queries` in `lib/sanity/fetch.ts`. Add `getPopupSettingsQuery` to the destructured list.

- [ ] **Step 4: Add fetch function to `lib/sanity/fetch.ts`**

After the `getSiteLogo` function (around line 236), add:

```typescript
export async function getPopupSettings(): Promise<PopupSettings | null> {
  if (!isSanityConfigured) return null
  return client.fetch<PopupSettings | null>(
    getPopupSettingsQuery, {}, { next: { revalidate: 300 } }
  )
}
```

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add lib/sanity/queries.ts lib/sanity/fetch.ts
git commit -m "feat(sanity): add popup settings query and fetch function"
```

---

## Task 6: Create the newsletter lead API route

**Files:**
- Create: `app/api/newsletter-lead/route.ts`

- [ ] **Step 1: Create the file**

Create `app/api/newsletter-lead/route.ts` with this exact content:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, phone, nationality, dateOfBirth, locale } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    await writeClient.create({
      _type: 'newsletterLead',
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      nationality: nationality?.trim() || undefined,
      dateOfBirth: dateOfBirth || undefined,
      locale: locale || 'en',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[newsletter-lead]', err)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Manual test — start dev server and POST to the route**

```bash
npm run dev
```

In a separate terminal:

```bash
curl -X POST http://localhost:3000/api/newsletter-lead \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","phone":"+971501234567","nationality":"UAE","dateOfBirth":"1990-01-15","locale":"en"}'
```

Expected response: `{"success":true}`

Check Sanity Studio → Newsletter Leads to confirm the document was created.

- [ ] **Step 4: Commit**

```bash
git add app/api/newsletter-lead/route.ts
git commit -m "feat(api): add newsletter-lead POST route"
```

---

## Task 7: Create `NewsletterPopup` component

**Files:**
- Create: `components/layout/NewsletterPopup.tsx`

- [ ] **Step 1: Create the component**

Create `components/layout/NewsletterPopup.tsx` with this exact content:

```typescript
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { PopupSettings } from '@/lib/types'

const STORAGE_KEY = 'luxe_popup'
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

function shouldShow(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return true
    const data = JSON.parse(raw)
    if (data.subscribed) return false
    if (data.dismissedAt && Date.now() - data.dismissedAt < DISMISS_TTL_MS) return false
    return true
  } catch {
    return true
  }
}

interface NewsletterPopupProps {
  settings: PopupSettings | null
}

export default function NewsletterPopup({ settings }: NewsletterPopupProps) {
  const locale = useLocale()
  const isAr = locale === 'ar'
  const { data: session } = useSession()

  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [nationality, setNationality] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!settings?.isEnabled) return
    if (session?.user) return
    if (!shouldShow()) return

    const delay = (settings.delaySeconds ?? 2) * 1000
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [settings, session])

  function handleDismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ dismissedAt: Date.now() }))
    } catch {}
    setVisible(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !email.includes('@')) {
      setError(isAr ? 'البريد الإلكتروني مطلوب' : 'A valid email is required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/newsletter-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, nationality, dateOfBirth, locale }),
      })
      if (!res.ok) throw new Error('Failed')
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ subscribed: true }))
      setVisible(false)
    } catch {
      setError(isAr ? 'حدث خطأ. يرجى المحاولة مجدداً.' : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const headline = isAr ? settings?.headline_ar || settings?.headline_en : settings?.headline_en
  const subtext = isAr ? settings?.subtext_ar || settings?.subtext_en : settings?.subtext_en
  const ctaLabel = isAr ? settings?.ctaLabel_ar || settings?.ctaLabel_en : settings?.ctaLabel_en

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            key="popup-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative flex w-full max-w-[580px] overflow-hidden rounded-lg bg-white shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left panel — image */}
              {settings?.imageUrl && (
                <div className="relative hidden w-[220px] shrink-0 sm:block">
                  <Image
                    src={settings.imageUrl}
                    alt={headline || 'Promotion'}
                    fill
                    className="object-cover"
                    sizes="220px"
                  />
                  {/* Gradient overlay + text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  {headline && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="font-display text-sm font-medium uppercase tracking-wider leading-snug">
                        {headline}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Right panel — form */}
              <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Close */}
                <button
                  onClick={handleDismiss}
                  className="absolute right-3 top-3 flex items-center gap-1 text-xs text-charcoal-400 hover:text-charcoal-900 transition-colors"
                  aria-label="Close popup"
                >
                  <X size={14} />
                  <span>Close</span>
                </button>

                {/* Headline */}
                {headline && (
                  <h2 className="font-display text-2xl font-bold uppercase leading-tight text-charcoal-900 pr-8">
                    {headline}
                  </h2>
                )}

                {/* Subtext */}
                {subtext && (
                  <p className="text-sm text-charcoal-500">{subtext}</p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  {/* Email */}
                  <input
                    type="email"
                    placeholder={isAr ? 'البريد الإلكتروني' : 'Email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded border border-charcoal-200 px-3 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-charcoal-400 focus:outline-none"
                  />

                  {/* Phone with UAE prefix */}
                  <div className="flex overflow-hidden rounded border border-charcoal-200 focus-within:border-charcoal-400">
                    <span className="flex items-center gap-1.5 border-r border-charcoal-200 bg-charcoal-50 px-3 text-sm text-charcoal-600 shrink-0">
                      🇦🇪 +971
                    </span>
                    <input
                      type="tel"
                      placeholder={isAr ? 'رقم الهاتف' : 'Phone Number'}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 px-3 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none bg-white"
                    />
                  </div>

                  {/* Nationality + DOB row */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={isAr ? 'الجنسية' : 'Nationality'}
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="w-1/2 rounded border border-charcoal-200 px-3 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-charcoal-400 focus:outline-none"
                    />
                    <input
                      type="date"
                      placeholder={isAr ? 'تاريخ الميلاد' : 'Date of Birth'}
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-1/2 rounded border border-charcoal-200 px-3 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-charcoal-400 focus:outline-none"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-xs text-red-500">{error}</p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded bg-charcoal-900 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-charcoal-700 disabled:opacity-50"
                  >
                    {loading ? '...' : (ctaLabel || 'continue')}
                  </button>
                </form>

                {/* Disclaimer */}
                <p className="text-center text-[11px] text-charcoal-400">
                  {isAr
                    ? 'بالتسجيل، أنت توافق على تلقي رسائل تسويقية عبر البريد الإلكتروني'
                    : 'By signing up, you agree to receive email marketing'}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/layout/NewsletterPopup.tsx
git commit -m "feat(ui): add NewsletterPopup component"
```

---

## Task 8: Wire popup into layout and Providers

**Files:**
- Modify: `components/layout/Providers.tsx`
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: Update `Providers` to accept and render popup**

Replace the entire content of `components/layout/Providers.tsx` with:

```typescript
'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import CartDrawer from '@/components/cart/CartDrawer'
import SearchOverlay from '@/components/layout/SearchOverlay'
import { QuickViewListener } from '@/components/product/QuickViewModal'
import NewsletterPopup from '@/components/layout/NewsletterPopup'
import { useCartStore } from '@/lib/store/cart-store'
import { useCartDrawerStore } from '@/lib/store/cart-drawer-store'
import type { PopupSettings } from '@/lib/types'

interface ProvidersProps {
  children: React.ReactNode
  popupSettings?: PopupSettings | null
}

function GlobalOverlays({ popupSettings }: { popupSettings?: PopupSettings | null }) {
  const { isOpen: cartStoreOpen, closeCart: closeCartStore } = useCartStore()
  const { isOpen: drawerStoreOpen, closeCart: closeDrawerStore } = useCartDrawerStore()

  const isOpen = cartStoreOpen || drawerStoreOpen
  const handleClose = () => {
    closeCartStore()
    closeDrawerStore()
  }

  return (
    <>
      <CartDrawer isOpen={isOpen} onClose={handleClose} />
      <SearchOverlay />
      <QuickViewListener />
      <NewsletterPopup settings={popupSettings ?? null} />
    </>
  )
}

export default function Providers({ children, popupSettings }: ProvidersProps) {
  return (
    <SessionProvider>
      {children}
      <GlobalOverlays popupSettings={popupSettings} />
      <Toaster
        position="bottom-right"
        theme="light"
        toastOptions={{
          classNames: {
            toast:
              'font-body text-sm text-charcoal-900 bg-white border border-charcoal-100 shadow-lg rounded-xl',
            title: 'font-semibold',
            description: 'text-charcoal-500',
            actionButton:
              'bg-gold-500 text-white hover:bg-gold-600 rounded-full px-4 py-1 text-xs font-medium',
            cancelButton:
              'bg-charcoal-100 text-charcoal-600 rounded-full px-4 py-1 text-xs font-medium',
            success: 'border-l-4 border-l-gold-500',
            error: 'border-l-4 border-l-red-500',
          },
        }}
        richColors={false}
        expand={false}
        closeButton
      />
    </SessionProvider>
  )
}
```

- [ ] **Step 2: Update `app/[locale]/layout.tsx` to fetch and pass popup settings**

In `app/[locale]/layout.tsx`:

**2a.** Add `getPopupSettings` to the import line:

```typescript
import { getAllCategories, getCollections, getNavPages, getNavConfig, getAnnouncementBar, getMenuPromo, getSiteLogo, getPopupSettings } from '@/lib/sanity/fetch'
```

**2b.** Add `getPopupSettings()` to the `Promise.all` call:

```typescript
  const [categories, collections, navPages, navItems, announcementBar, menuPromo, siteLogo, popupSettings] = await Promise.all([
    getAllCategories(),
    getCollections(),
    getNavPages(),
    getNavConfig(),
    getAnnouncementBar(),
    getMenuPromo(),
    getSiteLogo(),
    getPopupSettings(),
  ])
```

**2c.** Pass `popupSettings` to `<Providers>`:

```typescript
      <Providers popupSettings={popupSettings}>
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/layout/Providers.tsx app/[locale]/layout.tsx
git commit -m "feat(layout): wire NewsletterPopup into Providers and locale layout"
```

---

## Task 9: End-to-end manual verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Enable popup in Sanity Studio**

Open Sanity Studio (`http://localhost:3000/studio`). Go to **Site Settings → 🎁 Welcome Popup**. Set:
- Enable Popup: ✅ true
- Left Panel Image: upload any image
- Headline (English): `SIGN UP AND GET 20% OFF`
- Subtext (English): `Enjoy an instant discount, exclusive deals, exciting new products, and more`
- Button Label: `continue`
- Delay: `2`

Save.

- [ ] **Step 3: Clear localStorage and test popup appearance**

Open `http://localhost:3000/en` in incognito or after running this in DevTools console:

```javascript
localStorage.removeItem('luxe_popup')
```

Reload the page. After 2 seconds, popup should appear with image on left and form on right.

- [ ] **Step 4: Test dismiss behaviour**

Click the X button. Popup should close.

Reload the page. Popup should NOT appear again (7-day suppress).

Check DevTools → Application → Local Storage → `luxe_popup`. Should contain `{ dismissedAt: <timestamp> }`.

- [ ] **Step 5: Test form submission**

Clear localStorage again:
```javascript
localStorage.removeItem('luxe_popup')
```

Reload. Fill in email (`valid@test.com`), phone, nationality, DOB. Click continue.

Popup should close.

Check Sanity Studio → **Newsletter Leads** — new document should appear with the submitted data.

Check localStorage → `luxe_popup` should now contain `{ subscribed: true }`.

Reload again — popup should NOT appear (permanent suppress).

- [ ] **Step 6: Test logged-in suppress**

Log in to a user account on the site. Clear localStorage. Reload. Popup should NOT appear for logged-in users.

- [ ] **Step 7: Test `isEnabled = false`**

In Sanity Studio, set Enable Popup to false. Clear localStorage. Reload. Popup should not appear.

- [ ] **Step 8: Verify Arabic locale**

Open `http://localhost:3000/ar`. Clear localStorage. Reload. If Arabic headline/subtext/button are set in Sanity, they should display. RTL layout should not break the popup.

- [ ] **Step 9: Final commit**

```bash
git add -p   # review any remaining unstaged changes
git commit -m "chore: newsletter popup feature complete"
```
