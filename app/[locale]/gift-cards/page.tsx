import type { Metadata } from 'next'
import { getGiftCardPage } from '@/lib/sanity/fetch'
import { GiftCardPurchaseForm } from './GiftCardPurchaseForm'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Gift Cards — Luxe Parfum',
  description: 'Give the gift of luxury fragrance. Redeemable on any order.',
}

export default async function GiftCardsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isAr = locale === 'ar'
  const data = await getGiftCardPage()

  const headline = data
    ? (isAr ? (data.headline_ar || data.headline_en) : data.headline_en)
    : 'Give the Gift of Fragrance'
  const subtext = data
    ? (isAr ? (data.subtext_ar || data.subtext_en) : data.subtext_en)
    : 'Redeemable on any Luxe Parfum order. No expiry.'
  const denominations = data?.denominations ?? [
    { _key: 'default-50', label_en: 'A thoughtful start', amountCents: 5000, popular: false },
    { _key: 'default-100', label_en: 'Perfect gift', amountCents: 10000, popular: true },
    { _key: 'default-200', label_en: 'For the connoisseur', amountCents: 20000, popular: false },
  ]
  const howItWorks = data?.howItWorks ?? [
    { _key: 'step-1', step: 1, text_en: 'Choose a denomination and personalise with a message.' },
    { _key: 'step-2', step: 2, text_en: 'Complete payment. Your unique code appears instantly.' },
    { _key: 'step-3', step: 3, text_en: 'Share the code. Recipient enters it at checkout.' },
  ]
  const terms = data ? (isAr ? (data.terms_ar || data.terms_en) : data.terms_en) : null

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 font-body text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-500">
            Luxe Parfum
          </p>
          <h1 className="font-display text-4xl font-light text-charcoal-900 md:text-5xl">
            {headline}
          </h1>
          {subtext && (
            <p className="mx-auto mt-5 max-w-md font-body text-sm font-light leading-relaxed text-charcoal-500">
              {subtext}
            </p>
          )}
          <div className="mx-auto mt-6 h-px w-12 bg-gold-400/50" />
        </div>

        {/* How it works */}
        {howItWorks.length > 0 && (
          <div className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {howItWorks
              .sort((a, b) => a.step - b.step)
              .map((s) => {
                const text = isAr ? (s.text_ar || s.text_en) : s.text_en
                return (
                  <div key={s._key} className="text-center">
                    <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-gold-100">
                      <span className="font-display text-sm font-semibold text-gold-600">
                        {s.step}
                      </span>
                    </div>
                    <p className="font-body text-xs font-light leading-relaxed text-charcoal-500">
                      {text}
                    </p>
                  </div>
                )
              })}
          </div>
        )}

        <div className="mb-10 h-px bg-charcoal-100" />

        {/* Purchase form */}
        <GiftCardPurchaseForm
          denominations={denominations}
          locale={locale}
          isAr={isAr}
        />

        {/* Terms */}
        {terms && (
          <p className="mt-8 font-body text-[10px] leading-relaxed text-charcoal-300">
            {terms}
          </p>
        )}
      </div>
    </div>
  )
}
