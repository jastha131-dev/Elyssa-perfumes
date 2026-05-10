import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import type { CartItem } from '@/lib/types'

interface CheckoutRequestBody {
  items: CartItem[]
  successUrl: string
  cancelUrl: string
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
      if (!item.product?._id || !item.product?.name || !item.selectedVolume?.price || !item.quantity) {
        return NextResponse.json(
          { error: 'Invalid cart item data.' },
          { status: 400 }
        )
      }
      if (item.quantity < 1 || !Number.isInteger(item.quantity)) {
        return NextResponse.json(
          { error: `Invalid quantity for ${item.product.name}.` },
          { status: 400 }
        )
      }
      if (item.selectedVolume.price <= 0) {
        return NextResponse.json(
          { error: `Invalid price for ${item.product.name}.` },
          { status: 400 }
        )
      }
    }

    // Build Stripe line items
    const lineItems = items.map((item) => {
      const primaryImage = item.product.images?.[0]?.url
      const images = primaryImage ? [primaryImage] : []

      return {
        price_data: {
          currency: 'usd' as const,
          unit_amount: Math.round(item.selectedVolume.price * 100),
          product_data: {
            name: `${item.product.name} — ${item.selectedVolume.ml}ml`,
            images,
            description: item.product.description
              ? item.product.description.slice(0, 500)
              : `${item.product.fragranceFamily ?? 'Luxury'} fragrance, ${item.selectedVolume.ml}ml`,
          },
        },
        quantity: item.quantity,
      }
    })

    // Calculate subtotal to determine shipping options
    const subtotal = items.reduce(
      (sum, item) => sum + item.selectedVolume.price * item.quantity,
      0
    )

    const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: subtotal >= 100 ? 0 : 1500,
            currency: 'usd',
          },
          display_name: subtotal >= 100 ? 'Free Shipping' : 'Standard Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 10 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 3500,
            currency: 'usd',
          },
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
      allow_promotion_codes: true,
      metadata: {
        items: JSON.stringify(
          items.map((i) => ({ id: i.product._id, qty: i.quantity, ml: i.selectedVolume.ml }))
        ),
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
