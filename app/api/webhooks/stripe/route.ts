import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('[Stripe Webhook] Missing stripe-signature header')
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not configured')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[Stripe Webhook] Signature verification failed: ${message}`)
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        console.log('[Stripe Webhook] checkout.session.completed', {
          sessionId: session.id,
          customerEmail: session.customer_details?.email ?? 'N/A',
          amountTotal: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency?.toUpperCase(),
          paymentStatus: session.payment_status,
          shippingDetails: session.shipping_details,
          metadata: session.metadata,
        })

        // Parse items from metadata for order fulfillment
        if (session.metadata?.items) {
          try {
            const orderedItems = JSON.parse(session.metadata.items) as Array<{
              id: string
              qty: number
              ml: number
            }>
            console.log('[Stripe Webhook] Order items:', orderedItems)
            // TODO: Integrate with order management system (e.g., create order in Sanity/DB)
          } catch (parseError) {
            console.error('[Stripe Webhook] Failed to parse order metadata:', parseError)
          }
        }

        // TODO: Send order confirmation email (e.g., via Resend/SendGrid)
        // TODO: Update inventory in Sanity
        // TODO: Create order record in database

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        console.log('[Stripe Webhook] payment_intent.succeeded', {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency?.toUpperCase(),
          customerId: paymentIntent.customer,
        })

        // TODO: Additional post-payment success logic if needed
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        console.error('[Stripe Webhook] payment_intent.payment_failed', {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency?.toUpperCase(),
          lastPaymentError: paymentIntent.last_payment_error?.message,
          failureCode: paymentIntent.last_payment_error?.code,
          customerId: paymentIntent.customer,
        })

        // TODO: Notify customer of failed payment
        // TODO: Log failed payment for analytics
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge

        console.log('[Stripe Webhook] charge.refunded', {
          chargeId: charge.id,
          amountRefunded: charge.amount_refunded / 100,
          currency: charge.currency?.toUpperCase(),
        })

        // TODO: Handle refund — update order status, restock inventory
        break
      }

      default: {
        // Log unhandled events in development for visibility
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`)
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (handlerError) {
    console.error(`[Stripe Webhook] Handler error for event ${event.type}:`, handlerError)
    // Still return 200 to prevent Stripe from retrying — log the error internally
    return NextResponse.json({ received: true, warning: 'Handler error logged' }, { status: 200 })
  }
}
