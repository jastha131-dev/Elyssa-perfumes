import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import type { CartItem, Promotion } from '@/lib/types'
import { client } from '@/lib/sanity/client'
import { getActivePromotionsQuery } from '@/lib/sanity/queries'

interface CheckoutRequestBody {
  items: CartItem[]
  successUrl: string
  cancelUrl: string
  promoCode?: string
}

function calcPromoDiscountAmount(promotion: Promotion, items: CartItem[], subtotal: number): number {
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
      return 0
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
  stripeClient: typeof stripe,
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
      await stripeClient.coupons.retrieve(couponId)
      return couponId
    } catch {
      // doesn't exist yet, fall through to create
    }
  }

  const amountOffCents = Math.round(discountAmountDollars * 100)
  if (amountOffCents < 1) return null

  await stripeClient.coupons.create({
    id: couponId,
    amount_off: amountOffCents,
    currency: 'usd',
    name: promotion.name,
    ...(isStable ? {} : { max_redemptions: 1 }),
  })

  return couponId
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json()
    const { items, successUrl, cancelUrl } = body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty. Please add items before checking out.' },
        { status: 400 }
      )
    }

    if (!successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Success and cancel URLs are required.' },
        { status: 400 }
      )
    }

    // Validate each item has required fields
    for (const item of items) {
      if (!item.product?._id || !item.product?.name_en || !item.selectedVolume?.price || !item.quantity) {
        return NextResponse.json(
          { error: 'Invalid cart item data.' },
          { status: 400 }
        )
      }
      if (item.quantity < 1 || !Number.isInteger(item.quantity)) {
        return NextResponse.json(
          { error: `Invalid quantity for ${item.product.name_en}.` },
          { status: 400 }
        )
      }
      if (item.selectedVolume.price <= 0) {
        return NextResponse.json(
          { error: `Invalid price for ${item.product.name_en}.` },
          { status: 400 }
        )
      }
    }

    // Calculate subtotal (needed for promo validation and shipping)
    const subtotal = items.reduce(
      (sum, item) => sum + item.selectedVolume.price * item.quantity,
      0
    )

    // ── Promo code validation ─────────────────────────────────────────────────────
    const { promoCode } = body
    let stripeCouponId: string | null = null
    let isFreeShipping = false

    if (promoCode) {
      try {
        const promos = await client.fetch<Promotion[]>(
          getActivePromotionsQuery,
          {},
          { cache: 'no-store' }
        )
        const promo = promos.find(
          (p) => p.code?.toUpperCase() === promoCode.trim().toUpperCase() && p.isActive
        )
        if (promo) {
          const discountDollars = calcPromoDiscountAmount(promo, items, subtotal)
          if (promo.type === 'free_shipping') {
            isFreeShipping = true
          } else {
            stripeCouponId = await getOrCreateStripeCoupon(stripe, promo, discountDollars)
          }
        }
      } catch (promoError) {
        console.error('[Checkout] Promo validation error (non-fatal):', promoError)
        // Don't fail the whole checkout if promo lookup fails
      }
    }
    // ─────────────────────────────────────────────────────────────────────────────

    // Build Stripe line items
    const lineItems = items.map((item) => {
      const primaryImage = item.product.images?.[0]?.url
      const images = primaryImage ? [primaryImage] : []

      return {
        price_data: {
          currency: 'usd' as const,
          unit_amount: Math.round(item.selectedVolume.price * 100),
          product_data: {
            name: `${item.product.name_en} — ${item.selectedVolume.ml}ml`,
            images,
            description: item.product.description_en
              ? item.product.description_en.slice(0, 500)
              : `${item.product.fragranceFamily ?? 'Luxury'} fragrance, ${item.selectedVolume.ml}ml`,
          },
        },
        quantity: item.quantity,
      }
    })

    const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: (isFreeShipping || subtotal >= 100) ? 0 : 1500,
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
        metadata: {
          source: 'luxe_parfum_checkout',
        },
      },
      custom_text: {
        shipping_address: {
          message: 'Please ensure your shipping address is correct. Luxury fragrances are shipped with care.',
        },
        submit: {
          message: 'Your order will be shipped within 1–2 business days.',
        },
      },
      phone_number_collection: {
        enabled: true,
      },
      billing_address_collection: 'auto',
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (error) {
    console.error('[Checkout API Error]:', error)

    if (error instanceof Error) {
      // Stripe-specific errors have a 'type' property
      const stripeError = error as Error & { type?: string; statusCode?: number }

      if (stripeError.type === 'StripeInvalidRequestError') {
        return NextResponse.json(
          { error: 'Invalid request to payment processor. Please check your cart and try again.' },
          { status: 400 }
        )
      }

      if (stripeError.type === 'StripeAuthenticationError') {
        console.error('[Checkout] Stripe authentication failed — check STRIPE_SECRET_KEY')
        return NextResponse.json(
          { error: 'Payment service configuration error. Please contact support.' },
          { status: 500 }
        )
      }

      if (stripeError.type === 'StripeConnectionError' || stripeError.type === 'StripeAPIError') {
        return NextResponse.json(
          { error: 'Payment service is temporarily unavailable. Please try again in a moment.' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
