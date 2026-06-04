import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { stripe } from '@/lib/stripe'

const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

function generateGiftCardCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const segment = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `GC-${segment()}-${segment()}`
}

interface GiftCardCheckoutBody {
  amountCents: number
  currency?: string
  recipientName?: string
  message?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: GiftCardCheckoutBody = await req.json()
    const { amountCents, currency = 'usd', recipientName, message } = body

    if (!amountCents || typeof amountCents !== 'number' || amountCents < 100) {
      return NextResponse.json(
        { error: 'Invalid gift card amount. Minimum is $1.' },
        { status: 400 }
      )
    }

    const code = generateGiftCardCode()

    const order = await adminClient.create({
      _type: 'giftCardOrder',
      code,
      amountCents,
      currency,
      status: 'pending',
      ...(recipientName?.trim() ? { recipientName: recipientName.trim() } : {}),
      ...(message?.trim() ? { message: message.trim() } : {}),
      createdAt: new Date().toISOString(),
    })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: amountCents,
            product_data: {
              name: `Luxe Parfum Gift Card${recipientName?.trim() ? ` for ${recipientName.trim()}` : ''}`,
              description: 'Redeemable on any Luxe Parfum order.',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/en/gift-cards/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/en/gift-cards`,
      metadata: {
        giftCardOrderId: order._id,
        giftCardCode: code,
        ...(recipientName?.trim() ? { recipientName: recipientName.trim() } : {}),
      },
      custom_text: {
        submit: {
          message: 'Gift card code will be shown immediately after payment.',
        },
      },
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[Gift Card Checkout Error]:', error)
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
  }
}
