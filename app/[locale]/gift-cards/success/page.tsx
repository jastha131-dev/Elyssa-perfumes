import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import { CopyCode } from './CopyCode'

export const revalidate = 0

export const metadata: Metadata = {
  title: 'Gift Card Ready — Luxe Parfum',
}

export default async function GiftCardSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ session_id?: string }>
}) {
  const { locale } = await params
  const { session_id } = await searchParams

  if (!session_id) notFound()

  let code: string | null = null
  let amountCents: number | null = null
  let recipientName: string | null = null

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)
    code = session.metadata?.giftCardCode ?? null
    amountCents = session.amount_total
    recipientName = session.metadata?.recipientName ?? null
  } catch {
    notFound()
  }

  if (!code) notFound()

  const amount = amountCents ? `$${Math.round(amountCents / 100)}` : ''

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <div className="mx-auto max-w-lg px-4 text-center">
        {/* Icon */}
        <div className="mb-8 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold-100">
          <span className="text-3xl">🎁</span>
        </div>

        <p className="mb-2 font-body text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-500">
          Gift Card
        </p>
        <h1 className="font-display text-3xl font-light text-charcoal-900">
          Purchase Complete
        </h1>
        <p className="mt-3 font-body text-sm font-light text-charcoal-500">
          {amount && `Your ${amount} gift card is ready.`}
          {recipientName && ` For ${recipientName}.`}
        </p>

        {/* Code box */}
        <div className="mt-10 rounded-2xl border border-gold-200 bg-white p-8 shadow-sm text-left">
          <p className="mb-3 font-body text-xs text-charcoal-400 text-center">
            Your Gift Card Code
          </p>
          <CopyCode code={code} />
          <p className="mt-4 font-body text-[10px] leading-relaxed text-charcoal-300 text-center">
            Screenshot or copy this code now. Share it with the recipient — they enter it at checkout.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3 font-body text-sm font-semibold text-white shadow-md transition-all hover:bg-gold-600 active:scale-[0.98]"
          >
            Shop Now
          </Link>
          <Link
            href={`/${locale}/gift-cards`}
            className="font-body text-xs text-charcoal-400 hover:text-gold-500 transition-colors underline-offset-2 hover:underline"
          >
            Buy another gift card
          </Link>
        </div>
      </div>
    </div>
  )
}
