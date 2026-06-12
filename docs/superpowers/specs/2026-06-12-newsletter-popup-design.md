# Newsletter Popup — Design Spec
**Date:** 2026-06-12
**Project:** Luxe Parfum (Next.js 15 + Sanity CMS)

---

## Overview

Welcome popup shown on first site visit. Collects email, phone, nationality, and date of birth. Submissions saved as Sanity `newsletterLead` documents. Admin controls all content and the popup image via Sanity Studio → Site Settings.

---

## Behaviour

| Scenario | Result |
|---|---|
| First visit | Show after `delaySeconds` (default 2s) |
| Dismissed (X clicked) | Hide for 7 days via `localStorage` |
| Submitted (continue) | Hide permanently via `localStorage` |
| Logged-in user | Never show |
| `isEnabled = false` in Sanity | Never show |
| Revisit within 7-day window | Do not show |

**localStorage key:** `luxe_popup`
- `{ subscribed: true }` — permanent suppress
- `{ dismissedAt: number }` — suppress until `dismissedAt + 7 * 24 * 60 * 60 * 1000`

---

## Sanity Schema Changes

### 1. `siteSettings.ts` — new `popup` group

```
group: 'popup', title: '🎁 Welcome Popup'
```

Fields added inside `siteSettings`:

| Field | Type | Notes |
|---|---|---|
| `popup.isEnabled` | boolean | Master toggle, default false |
| `popup.image` | image (hotspot) | Left-panel image |
| `popup.headline_en` | string (max 60) | e.g. "SIGN UP AND GET 20% OFF" |
| `popup.headline_ar` | string (max 60) | Arabic headline |
| `popup.subtext_en` | string (max 120) | Body copy below headline |
| `popup.subtext_ar` | string (max 120) | Arabic body copy |
| `popup.ctaLabel_en` | string (max 30) | Button label, default "continue" |
| `popup.ctaLabel_ar` | string (max 30) | Arabic button label |
| `popup.delaySeconds` | number (0–10) | Delay before showing, default 2 |

### 2. New `newsletterLead.ts` schema

Document type storing each submission.

| Field | Type | Notes |
|---|---|---|
| `email` | string | Required |
| `phone` | string | Optional, stored as-is including country code |
| `nationality` | string | Optional |
| `dateOfBirth` | date | Optional |
| `locale` | string | `en` or `ar` — captured from URL |
| `_createdAt` | datetime | Auto by Sanity |

Register in `sanity/schemaTypes/index.ts`.

---

## API Route

**`/app/api/newsletter-lead/route.ts`** — POST

Request body:
```json
{
  "email": "user@example.com",
  "phone": "+971501234567",
  "nationality": "UAE",
  "dateOfBirth": "1990-01-15",
  "locale": "en"
}
```

- Validates `email` is present and non-empty
- Uses Sanity write client (`writeClient` from `@/lib/sanity/client`) to create `newsletterLead` document
- Returns `{ success: true }` on success
- Returns `{ error: "..." }` with appropriate HTTP status on failure

---

## Component

**`components/layout/NewsletterPopup.tsx`** — `'use client'`

### Props
```ts
interface NewsletterPopupProps {
  settings: PopupSettings | null
}
```

### Render logic
1. `settings?.isEnabled` is false → render nothing
2. On mount: check `localStorage.luxe_popup`
   - `subscribed: true` → set visible=false, return
   - `dismissedAt` within 7 days → set visible=false, return
3. `setTimeout(() => setVisible(true), delaySeconds * 1000)`
4. Render modal overlay when visible=true

### Layout (two-panel, 560px wide on desktop, full-width modal on mobile)
- **Left panel (40%):** Sanity image via `urlFor()`, dark gradient overlay at bottom, overlay shows `popup.headline_en/ar` text (same field as right panel headline — no extra field needed)
- **Right panel (60%):** 
  - Close button (top right, X icon)
  - Headline (`popup.headline_en/ar`)
  - Subtext (`popup.subtext_en/ar`)
  - Email input (required)
  - Phone input with UAE flag + country code prefix (static UAE default, text input for number)
  - Nationality text input
  - Date of Birth date input
  - Continue button (`popup.ctaLabel_en/ar`)
  - Disclaimer: "By signing up, you agree to receive email marketing"

### Form submission
1. Validate email non-empty client-side
2. POST to `/api/newsletter-lead`
3. On success: `localStorage.setItem('luxe_popup', JSON.stringify({ subscribed: true }))` → close modal
4. On error: show inline error message, keep modal open

### Animation
Framer Motion: backdrop `opacity 0→1`, modal panel `opacity 0→1 + scale 0.95→1`, matching `QuickViewModal` pattern.

---

## Types (`lib/types.ts`)

```ts
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

---

## Query Changes (`lib/sanity/queries.ts`)

Add popup fields to the siteSettings fetch query:

```groq
"popup": {
  "isEnabled": popup.isEnabled,
  "imageUrl": popup.image.asset->url,
  "headline_en": popup.headline_en,
  "headline_ar": popup.headline_ar,
  "subtext_en": popup.subtext_en,
  "subtext_ar": popup.subtext_ar,
  "ctaLabel_en": popup.ctaLabel_en,
  "ctaLabel_ar": popup.ctaLabel_ar,
  "delaySeconds": coalesce(popup.delaySeconds, 2)
}
```

---

## Integration Points

| File | Change |
|---|---|
| `sanity/schemaTypes/siteSettings.ts` | Add `popup` group + fields |
| `sanity/schemaTypes/newsletterLead.ts` | New file |
| `sanity/schemaTypes/index.ts` | Register `newsletterLead` |
| `lib/types.ts` | Add `PopupSettings` interface |
| `lib/sanity/queries.ts` | Add popup fields to siteSettings query |
| `app/[locale]/layout.tsx` | Pass `popupSettings` to `<Providers>` |
| `components/layout/Providers.tsx` | Accept + render `<NewsletterPopup>` |
| `components/layout/NewsletterPopup.tsx` | New file |
| `app/api/newsletter-lead/route.ts` | New file |

**Total: 7 edited, 3 new files.**

---

## Out of Scope
- Email delivery / Mailchimp integration (future sprint)
- Discount code generation (future sprint)
- A/B testing popup variants
- Analytics / conversion tracking
