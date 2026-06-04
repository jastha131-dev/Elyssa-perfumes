'use client'

import { useState } from 'react'
import type { GiftCardDenomination } from '@/lib/types'

interface Props {
  denominations: GiftCardDenomination[]
  locale: string
  isAr: boolean
}

export function GiftCardPurchaseForm({ denominations, locale, isAr }: Props) {
  const [selected, setSelected] = useState<GiftCardDenomination | null>(
    denominations.find((d) => d.popular) ?? denominations[0] ?? null
  )
  const [recipientName, setRecipientName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (!selected) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/gift-cards/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountCents: selected.amountCents,
          currency: 'usd',
          ...(recipientName.trim() ? { recipientName: recipientName.trim() } : {}),
          ...(message.trim() ? { message: message.trim() } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed.')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Denomination grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {denominations.map((d) => {
          const label = isAr ? (d.label_ar || d.label_en) : d.label_en
          return (
            <button
              key={d._key}
              onClick={() => setSelected(d)}
              className={`relative rounded-2xl border-2 p-6 text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                selected?._key === d._key
                  ? 'border-gold-500 bg-gold-50'
                  : 'border-charcoal-100 bg-white hover:border-gold-300'
              }`}
            >
              {d.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gold-500 px-3 py-0.5 font-body text-[9px] font-semibold uppercase tracking-wider text-white whitespace-nowrap">
                  Popular
                </span>
              )}
              <p className="font-display text-2xl font-light text-charcoal-900">
                ${Math.round(d.amountCents / 100)}
              </p>
              <p className="mt-1 font-body text-xs text-charcoal-400">{label}</p>
            </button>
          )
        })}
      </div>

      {/* Optional personalisation fields */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="mb-1.5 block font-body text-xs font-medium text-charcoal-600">
            Recipient Name{' '}
            <span className="font-normal text-charcoal-300">(optional)</span>
          </label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="e.g. Sarah"
            maxLength={80}
            className="w-full rounded-xl border border-charcoal-200 bg-white px-4 py-3 font-body text-sm text-charcoal-900 outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-body text-xs font-medium text-charcoal-600">
            Personal Message{' '}
            <span className="font-normal text-charcoal-300">(optional)</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a personal note..."
            maxLength={300}
            rows={3}
            className="w-full resize-none rounded-xl border border-charcoal-200 bg-white px-4 py-3 font-body text-sm text-charcoal-900 outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
          />
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 font-body text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        onClick={handleCheckout}
        disabled={!selected || loading}
        className="w-full rounded-full bg-gold-500 py-4 font-body text-sm font-semibold text-white shadow-md transition-all hover:bg-gold-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
      >
        {loading
          ? 'Redirecting to payment…'
          : `Purchase $${selected ? Math.round(selected.amountCents / 100) : ''} Gift Card`}
      </button>
    </div>
  )
}
