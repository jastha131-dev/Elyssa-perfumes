import { Suspense } from 'react'
import type { Metadata } from 'next'
import { stripe } from '@/lib/stripe'
import SuccessClient from './SuccessClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your Luxe Parfum order has been successfully placed.',
  robots: { index: false, follow: false },
}

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>
}

async function getSessionDetails(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer_details'],
    })
    return {
      id: session.id,
      customerEmail: session.customer_details?.email ?? null,
      customerName: session.customer_details?.name ?? null,
      amountTotal: session.amount_total ? session.amount_total / 100 : null,
      currency: session.currency?.toUpperCase() ?? 'USD',
      paymentStatus: session.payment_status,
    }
  } catch {
    return null
  }
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const sessionId = params.session_id ?? null
  const orderNumber = sessionId ? sessionId.slice(-8).toUpperCase() : null

  const sessionDetails = sessionId ? await getSessionDetails(sessionId) : null

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cream-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal-200 border-t-gold-500" />
        </div>
      }
    >
      <SuccessClient
        orderNumber={orderNumber}
        customerEmail={sessionDetails?.customerEmail ?? null}
        customerName={sessionDetails?.customerName ?? null}
        amountTotal={sessionDetails?.amountTotal ?? null}
        currency={sessionDetails?.currency ?? 'USD'}
        paymentStatus={sessionDetails?.paymentStatus ?? null}
      />
    </Suspense>
  )
}
