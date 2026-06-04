# Coupon & Discount System — Full Wiring Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the already-complete `promotions-store.ts` into the cart UI and checkout API so coupon codes validate in-cart, show a discount preview, and apply correctly via Stripe at payment time.

**Architecture:** Server fetches active Sanity promotions → passed as prop to CartPageClient → on mount, loaded into Zustand `promotionsStore` → user enters code → `applyCode()` validates + calculates → discount shown in cart summary → checkout page passes `promoCode` to `/api/checkout` → API re-validates server-side, creates/retrieves Stripe coupon, applies via `discounts[]`.

**Tech Stack:** Next.js 15 App Router, Zustand (`promotions-store`), Sanity GROQ, Stripe Checkout Sessions, Tailwind CSS, `next-intl`

---

## What Already Exists (Do NOT rebuild)

- `lib/store/promotions-store.ts` — complete: `applyCode()`, `removeCode()`, `recalculate()`, `getEffectiveDiscount()`, `hasFreeShipping()`, `setAvailablePromotions()`
- `lib/sanity/fetch.ts` → `getActivePromotions()` — fetches active promos from Sanity
- `lib/sanity/queries.ts` → `getActivePromotionsQuery`
- `app/api/checkout/route.ts` — existing Stripe checkout; needs `promoCode` support added

---

## File Map

### Modified files
| Path | Change |
|------|--------|
| `app/[locale]/cart/page.tsx` | Fetch active promotions server-side, pass to CartPageClient |
| `app/cart/CartPageClient.tsx` | Accept promos prop, load into store, wire Apply Promo input, show discount line |
| `app/[locale]/checkout/page.tsx` | Read `appliedPromotion` from store, pass `promoCode` to checkout API |
| `app/api/checkout/route.ts` | Accept optional `promoCode`, re-validate vs Sanity, create/get Stripe coupon, apply via `discounts[]` |

### No new files needed.

---

## Stripe Coupon Strategy

When `promoCode` is present in checkout API:
- Calculate `discountAmountDollars` server-side (replicate store logic)
- Create Stripe coupon with `amount_off = Math.round(discountAmountDollars * 100)` in cents
  - For `percentage` and `fixed` types: stable ID `SANITY_${promo._id}`, get-or-create
  - For `tiered` and `buy_x_get_y`: unique ID `SANITY_${promo._id}_${Date.now()}`, `max_redemptions: 1`
- For `free_shipping`: do NOT create coupon — instead set shipping option `amount: 0`
- Apply via `discounts: [{ coupon: stripeId }]`
- When `discounts` is set, do NOT set `allow_promotion_codes: true` (Stripe forbids both)
- When no `promoCode`: keep `allow_promotion_codes: true` (current behavior)

---

## Task 1: Load Promotions Server-Side in Cart Page

**Files:**
- Modify: `app/[locale]/cart/page.tsx`

- [ ] **Update cart page to fetch and pass promotions**

Replace the entire content of `app/[locale]/cart/page.tsx` with:

```typescript
import { getActivePromotions } from '@/lib/sanity/fetch'
import CartPageClient from '@/app/cart/CartPageClient'
import type { Promotion } from '@/lib/types'

export const metadata = {
  title: 'Your Cart | Luxe Parfum',
  description: 'Review your selected fragrances and proceed to checkout.',
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  let activePromotions: Promotion[] = []
  try {
    activePromotions = await getActivePromotions()
  } catch {
    // non-fatal — cart works without promotions
  }
  return <CartPageClient activePromotions={activePromotions} locale={locale} />
}
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

---

## Task 2: Wire Promo Input in CartPageClient

**Files:**
- Modify: `app/cart/CartPageClient.tsx`

This task has three sub-changes: (A) accept new props, (B) load promos into store on mount, (C) replace dead button with functional promo input + discount line in OrderSummary.

- [ ] **A: Add imports and update component signature**

Add to the existing imports at the top of `CartPageClient.tsx`:

```typescript
import { useEffect, useRef, useState as usePromoState } from 'react'
import { X } from 'lucide-react'
import { usePromotionsStore } from '@/lib/store/promotions-store'
import type { Promotion } from '@/lib/types'
```

Note: `useState` is not yet imported in this file. Import it as `useState` (check if already imported — if not, add it). `useEffect` may also need to be added if not present. Check current imports before adding.

Update `CartPageClient` function signature:

```typescript
export default function CartPageClient({
  activePromotions = [],
  locale = 'en',
}: {
  activePromotions?: Promotion[]
  locale?: string
}) {
```

- [ ] **B: Load promotions into store + recalculate on cart changes**

Inside `CartPageClient`, after the existing hooks (`useCartStore`, `useHydrated`), add:

```typescript
const {
  setAvailablePromotions,
  applyCode,
  removeCode,
  recalculate,
  appliedPromotion,
  autoAppliedPromotion,
  discountResult,
  enteredCode,
  setEnteredCode,
  getEffectiveDiscount,
  hasFreeShipping,
} = usePromotionsStore()

// Load promotions from server into store once hydrated
useEffect(() => {
  if (hydrated && activePromotions.length > 0) {
    setAvailablePromotions(activePromotions)
  }
}, [hydrated, activePromotions, setAvailablePromotions])

// Recalculate discount when cart changes
useEffect(() => {
  if (hydrated && items.length > 0) {
    recalculate(items, subtotal, locale)
  }
}, [hydrated, items, subtotal, locale, recalculate])
```

Note: `subtotal` is already computed in the component. Move its definition BEFORE these `useEffect` calls if needed.

- [ ] **C: Update OrderSummary component to accept and show discount**

The `OrderSummary` function (inline in this file, around line 117) currently takes `{ subtotal, shipping, tax, total }`. Update its signature and body:

Replace the entire `OrderSummary` function with:

```typescript
function OrderSummary({
  subtotal,
  shipping,
  tax,
  total,
  discountAmount,
  discountLabel,
  onRemoveDiscount,
}: {
  subtotal: number
  shipping: number
  tax: number
  total: number
  discountAmount?: number
  discountLabel?: string
  onRemoveDiscount?: () => void
}) {
  const t = useTranslations('cart')
  const tc = useTranslations('checkout')

  const [promoOpen, setPromoOpen] = usePromoState(false)
  const [promoInput, setPromoInput] = usePromoState('')
  const [promoError, setPromoError] = usePromoState<string | null>(null)
  const [promoLoading, setPromoLoading] = usePromoState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { applyCode, items, enteredCode } = usePromotionsStore()
  const { items: cartItems } = useCartStore()

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoInput.trim()) return
    setPromoLoading(true)
    setPromoError(null)
    const result = applyCode(promoInput.trim(), cartItems, subtotal, 'en')
    setPromoLoading(false)
    if (result.success) {
      setPromoOpen(false)
      setPromoInput('')
    } else {
      setPromoError(result.message)
    }
  }

  useEffect(() => {
    if (promoOpen) inputRef.current?.focus()
  }, [promoOpen])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-24 rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-5 font-display text-lg font-semibold text-charcoal-900">
        {tc('orderSummary')}
      </h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-charcoal-500">{t('subtotal')}</span>
          <span className="font-body text-sm font-medium text-charcoal-900">
            {formatPrice(subtotal)}
          </span>
        </div>

        {discountAmount !== undefined && discountAmount > 0 && (
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-green-600 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {discountLabel ?? 'Discount'}
            </span>
            <div className="flex items-center gap-1">
              <span className="font-body text-sm font-medium text-green-600">
                -{formatPrice(discountAmount)}
              </span>
              {onRemoveDiscount && (
                <button
                  onClick={onRemoveDiscount}
                  aria-label="Remove discount"
                  className="ml-1 rounded-full p-0.5 text-charcoal-300 hover:text-charcoal-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-charcoal-500">{t('shipping')}</span>
          <span
            className={cn(
              'font-body text-sm font-medium',
              shipping === 0 ? 'text-green-600' : 'text-charcoal-900'
            )}
          >
            {shipping === 0 ? t('free') : formatPrice(shipping)}
          </span>
        </div>

        {shipping > 0 && (
          <p className="rounded-lg bg-cream-50 px-3 py-2 font-body text-xs text-charcoal-500 leading-relaxed">
            {t('addMore', { amount: formatPrice(SHIPPING_THRESHOLD - subtotal) })}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-charcoal-500">
            {t('tax')} <span className="text-charcoal-400">(est. {TAX_RATE * 100}%)</span>
          </span>
          <span className="font-body text-sm font-medium text-charcoal-900">
            {formatPrice(tax)}
          </span>
        </div>

        <div className="my-1 border-t border-charcoal-100" />

        <div className="flex items-center justify-between">
          <span className="font-display text-base font-semibold text-charcoal-900">{t('total')}</span>
          <span className="font-display text-lg font-semibold text-charcoal-900">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Promo code section */}
      <div className="mt-5">
        {!promoOpen && !discountAmount ? (
          <button
            onClick={() => setPromoOpen(true)}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg border border-dashed border-charcoal-200 px-4 py-2.5',
              'font-body text-sm text-charcoal-400 transition-colors hover:border-gold-400 hover:text-gold-600',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400'
            )}
          >
            <Tag className="h-4 w-4" />
            {t('applyPromo')}
          </button>
        ) : promoOpen ? (
          <form onSubmit={handlePromoSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={promoInput}
                onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(null) }}
                placeholder="ENTER CODE"
                maxLength={30}
                className={cn(
                  'flex-1 rounded-lg border px-3 py-2 font-mono text-sm uppercase tracking-wider outline-none transition-all',
                  promoError
                    ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-100'
                    : 'border-charcoal-200 focus:border-gold-400 focus:ring-1 focus:ring-gold-100'
                )}
              />
              <button
                type="submit"
                disabled={promoLoading || !promoInput.trim()}
                className="rounded-lg bg-charcoal-900 px-4 py-2 font-body text-xs font-semibold text-white transition-all hover:bg-charcoal-700 disabled:opacity-50"
              >
                {promoLoading ? '…' : 'Apply'}
              </button>
              <button
                type="button"
                onClick={() => { setPromoOpen(false); setPromoInput(''); setPromoError(null) }}
                className="rounded-lg border border-charcoal-200 p-2 text-charcoal-400 hover:text-charcoal-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {promoError && (
              <p className="font-body text-xs text-red-500">{promoError}</p>
            )}
          </form>
        ) : null}
      </div>

      <Link
        href="/checkout"
        className={cn(
          'mt-5 block w-full rounded-full bg-gold-500 py-3.5',
          'text-center font-body text-sm font-semibold text-white shadow-md',
          'transition-all duration-200 hover:bg-gold-600 hover:shadow-lg active:scale-[0.98]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2'
        )}
      >
        {t('proceedToCheckout')}
      </Link>

      {/* Trust signals */}
      <div className="mt-5 flex flex-col gap-2">
        {[
          '🔒 ' + t('secureCheckoutBadge'),
          '↩ ' + t('freeReturnsBadge'),
          '📦 ' + t('luxuryPackagingBadge'),
        ].map((signal) => (
          <p key={signal} className="font-body text-xs text-charcoal-400 text-center">
            {signal}
          </p>
        ))}
      </div>
    </motion.div>
  )
}
```

- [ ] **D: Pass discount props to OrderSummary and update totals**

In the main `CartPageClient` function where `OrderSummary` is rendered, update the call to pass discount data and adjust the `total` calculation:

Find this block (around line 354):
```typescript
<OrderSummary
  subtotal={subtotal}
  shipping={shipping}
  tax={tax}
  total={total}
/>
```

Replace with:
```typescript
<OrderSummary
  subtotal={subtotal}
  shipping={effectiveShipping}
  tax={tax}
  total={effectiveTotal}
  discountAmount={discountAmount > 0 ? discountAmount : undefined}
  discountLabel={discountResult?.label}
  onRemoveDiscount={appliedPromotion ? removeCode : undefined}
/>
```

And update the computed values near the top of `CartPageClient` (after existing consts):

```typescript
const discountAmount = hydrated ? getEffectiveDiscount() : 0
const freeShip = hydrated && hasFreeShipping()
const effectiveShipping = freeShip ? 0 : shipping
const tax = (subtotal - discountAmount) * TAX_RATE
const effectiveTotal = subtotal - discountAmount + effectiveShipping + tax
```

Remove or replace the existing `tax` and `total` computations so they don't conflict.

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -30
```

Expected: 0 errors

- [ ] **Commit**

```bash
git add app/\[locale\]/cart/page.tsx app/cart/CartPageClient.tsx
git commit -m "feat(cart): wire promo code input and discount display to promotions-store"
```

---

## Task 3: Pass Promo Code from Checkout Page to API

**Files:**
- Modify: `app/[locale]/checkout/page.tsx`

The checkout page is a `'use client'` component that calls `/api/checkout` on mount. It needs to read the applied promo code from the store and include it in the API call.

- [ ] **Add promotions store read and pass code to checkout API**

At the top of `CheckoutPage`, add the store read:

```typescript
const { appliedPromotion, discountResult } = usePromotionsStore()
```

Add the import:
```typescript
import { usePromotionsStore } from '@/lib/store/promotions-store'
```

In the `initiateCheckout` function, update the `fetch` body to include the promo code when present:

Find:
```typescript
body: JSON.stringify({
  items: cartItems,
  successUrl: `${origin}/checkout/success`,
  cancelUrl: `${origin}/checkout/cancel`,
}),
```

Replace with:
```typescript
body: JSON.stringify({
  items: cartItems,
  successUrl: `${origin}/checkout/success`,
  cancelUrl: `${origin}/checkout/cancel`,
  ...(appliedPromotion?.code ? { promoCode: appliedPromotion.code } : {}),
}),
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add app/\[locale\]/checkout/page.tsx
git commit -m "feat(checkout): pass applied promo code to checkout API"
```

---

## Task 4: Apply Coupon in Checkout API via Stripe

**Files:**
- Modify: `app/api/checkout/route.ts`

This is the most complex task. The checkout API needs to:
1. Accept optional `promoCode` in request body
2. Re-validate the code server-side against Sanity
3. Calculate the discount amount
4. Create or retrieve a Stripe coupon
5. Apply via `discounts: [{ coupon: id }]`
6. Remove `allow_promotion_codes` when a discount is applied (Stripe forbids both)

- [ ] **Add promo validation and Stripe coupon logic to checkout route**

At the top of `app/api/checkout/route.ts`, add these imports:

```typescript
import { client } from '@/lib/sanity/client'
import { getActivePromotionsQuery } from '@/lib/sanity/queries'
import type { Promotion, CartItem } from '@/lib/types'
```

Add a server-side discount calculator function and coupon helper (paste BEFORE the `POST` function):

```typescript
function calcDiscountAmount(promotion: Promotion, items: CartItem[], subtotal: number): number {
  const now = Date.now()
  if (promotion.validFrom && new Date(promotion.validFrom).getTime() > now) return 0
  if (promotion.validUntil && new Date(promotion.validUntil).getTime() < now) return 0
  if (promotion.minOrderValue && subtotal < promotion.minOrderValue) return 0
  const totalQty = items.reduce((s, i) => s + i.quantity, 0)
  if (promotion.minQuantity && totalQty < promotion.minQuantity) return 0

  switch (promotion.type) {
    case 'percentage':
      return (subtotal * (promotion.discountValue ?? 0)) / 100
    case 'fixed':
      return Math.min(promotion.discountValue ?? 0, subtotal)
    case 'free_shipping':
      return 0 // handled via shipping override
    case 'tiered': {
      if (!promotion.tiers?.length) return 0
      const sorted = [...promotion.tiers].sort((a, b) => b.minSpend - a.minSpend)
      const matched = sorted.find((t) => subtotal >= t.minSpend)
      if (!matched) return 0
      return (subtotal * matched.discountPercent) / 100
    }
    case 'buy_x_get_y': {
      if (!promotion.buyQuantity || !promotion.getQuantity) return 0
      if (totalQty < promotion.buyQuantity) return 0
      const cheapest = [...items]
        .sort((a, b) => (a.selectedVolume?.price ?? a.product.price) - (b.selectedVolume?.price ?? b.product.price))
        .slice(0, promotion.getQuantity)
      return cheapest.reduce((s, i) => s + (i.selectedVolume?.price ?? i.product.price) * i.quantity, 0)
    }
    default:
      return 0
  }
}

async function getOrCreateStripeCoupon(
  stripe: Stripe,
  promotion: Promotion,
  discountAmountDollars: number
): Promise<string | null> {
  if (promotion.type === 'free_shipping') return null
  if (discountAmountDollars <= 0) return null

  const isStable = promotion.type === 'percentage' || promotion.type === 'fixed'
  const couponId = isStable
    ? `SANITY_${promotion._id}`
    : `SANITY_${promotion._id}_${Date.now()}`

  if (isStable) {
    try {
      await stripe.coupons.retrieve(couponId)
      return couponId
    } catch {
      // doesn't exist yet, create below
    }
  }

  const amountOffCents = Math.round(discountAmountDollars * 100)
  if (amountOffCents < 1) return null

  await stripe.coupons.create({
    id: couponId,
    amount_off: amountOffCents,
    currency: 'usd',
    name: promotion.name,
    ...(isStable ? {} : { max_redemptions: 1 }),
  })

  return couponId
}
```

Note: `Stripe` type needs to be imported — add `import Stripe from 'stripe'` if not already present.

- [ ] **Update the request body interface**

Find:
```typescript
interface CheckoutRequestBody {
  items: CartItem[]
  successUrl: string
  cancelUrl: string
}
```

Replace with:
```typescript
interface CheckoutRequestBody {
  items: CartItem[]
  successUrl: string
  cancelUrl: string
  promoCode?: string
}
```

- [ ] **Add promo validation logic inside the POST handler**

Inside the `POST` function, after the existing item validation block and before the `lineItems` build, add:

```typescript
// ── Promo code handling ───────────────────────────────────────────────────────
const { promoCode } = body
let stripeCouponId: string | null = null
let isFreeShipping = false

if (promoCode) {
  const promos = await client.fetch<Promotion[]>(
    getActivePromotionsQuery,
    {},
    { cache: 'no-store' }
  )
  const promo = promos.find(
    (p) => p.code?.toUpperCase() === promoCode.trim().toUpperCase() && p.isActive
  )
  if (promo) {
    const discountDollars = calcDiscountAmount(promo, items, subtotal)
    if (promo.type === 'free_shipping') {
      isFreeShipping = true
    } else {
      stripeCouponId = await getOrCreateStripeCoupon(stripe, promo, discountDollars)
    }
  }
}
// ─────────────────────────────────────────────────────────────────────────────
```

- [ ] **Update the Stripe session creation to apply the coupon**

Find the `stripe.checkout.sessions.create` call. Update the shipping options and add discount support:

Replace the existing `shippingOptions` block and session creation call:

```typescript
const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
  {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: {
        amount: isFreeShipping ? 0 : (subtotal >= 100 ? 0 : 1500),
        currency: 'usd',
      },
      display_name: (isFreeShipping || subtotal >= 100) ? 'Free Shipping' : 'Standard Shipping',
      delivery_estimate: {
        minimum: { unit: 'business_day', value: 5 },
        maximum: { unit: 'business_day', value: 10 },
      },
    },
  },
  {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: { amount: 3500, currency: 'usd' },
      display_name: 'Express Shipping',
      delivery_estimate: {
        minimum: { unit: 'business_day', value: 2 },
        maximum: { unit: 'business_day', value: 3 },
      },
    },
  },
]

const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: lineItems,
  success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: cancelUrl,
  shipping_address_collection: {
    allowed_countries: ['US', 'GB', 'AE', 'SA', 'CA', 'AU'],
  },
  shipping_options: shippingOptions,
  // Use coupon if applied in cart; otherwise allow Stripe's own code field
  ...(stripeCouponId
    ? { discounts: [{ coupon: stripeCouponId }] }
    : { allow_promotion_codes: true }),
  metadata: {
    items: JSON.stringify(
      items.map((i) => ({ id: i.product._id, qty: i.quantity, ml: i.selectedVolume.ml }))
    ),
    ...(promoCode ? { promoCode } : {}),
  },
  payment_intent_data: {
    metadata: { source: 'luxe_parfum_checkout' },
  },
  custom_text: {
    shipping_address: {
      message: 'Please ensure your shipping address is correct. Luxury fragrances are shipped with care.',
    },
    submit: {
      message: 'Your order will be shipped within 1–2 business days.',
    },
  },
  phone_number_collection: { enabled: true },
  billing_address_collection: 'auto',
})
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -30
```

Expected: 0 errors

- [ ] **Run build**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npm run build 2>&1 | tail -20
```

Expected: Build succeeds

- [ ] **Commit**

```bash
git add app/api/checkout/route.ts
git commit -m "feat(api): apply Sanity promo code to Stripe checkout session"
```

---

## Task 5: Final verification

- [ ] **Smoke test the flow mentally:**
  1. Go to `/cart` — "Apply Promo" button expands to input
  2. Enter a code that doesn't exist → error "Invalid or expired code."
  3. Enter a valid code (one in Sanity with `isActive: true` and a `code` field) → discount shown in order summary, total updates
  4. X button removes the discount
  5. Proceed to checkout → Stripe session created with `discounts: [{ coupon: ... }]`

- [ ] **Ensure no regression in checkout without promo:**
  - Empty cart → `/cart` → proceed without entering code → `allow_promotion_codes: true` is set, Stripe shows code field as before

- [ ] **Final commit if any cleanup needed**

```bash
git add -p  # review any outstanding changes
git commit -m "fix(coupon): cleanup and final verification"
```
