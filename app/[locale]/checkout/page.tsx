'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { Button } from '@/components/ui/Button'
import OrderSummary from '@/components/checkout/OrderSummary'
import type { CartItem } from '@/lib/types'

type CheckoutState = 'loading' | 'redirecting' | 'error'

export default function CheckoutPage() {
  const t = useTranslations('checkout')
  const router = useRouter()

  const trustItems = [
    { emoji: '🔒', label: t('securePayment') },
    { emoji: '↩️', label: t('easyReturns') },
    { emoji: '📦', label: t('premiumPackaging') },
  ]
  const { items, clearCart } = useCartStore()
  const [state, setState] = useState<CheckoutState>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  const initiateCheckout = useCallback(async (cartItems: CartItem[]) => {
    setState('loading')
    setErrorMessage('')

    try {
      const origin = window.location.origin

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          successUrl: `${origin}/checkout/success`,
          cancelUrl: `${origin}/checkout/cancel`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to initiate checkout. Please try again.')
      }

      if (!data.url) {
        throw new Error('No checkout URL received. Please try again.')
      }

      setState('redirecting')

      // Brief pause to show "Redirecting..." state before navigation
      await new Promise<void>((resolve) => setTimeout(resolve, 600))
      window.location.href = data.url
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setErrorMessage(message)
      setState('error')
    }
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Redirect to cart if empty
    if (items.length === 0) {
      router.replace('/cart')
      return
    }

    initiateCheckout(items)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  // Prevent SSR flash
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal-200 border-t-gold-500" />
      </div>
    )
  }

  // Empty cart — will redirect
  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal-200 border-t-gold-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center"
        >
          <p className="mb-2 font-body text-xs uppercase tracking-[0.3em] text-gold-500">
            {t('secureCheckout')}
          </p>
          <h1 className="font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">
            {t('completingOrder')}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left: Status panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-sm">
              <AnimatePresence mode="wait">
                {(state === 'loading' || state === 'redirecting') && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center px-8 py-16 text-center"
                  >
                    {/* Animated loader */}
                    <div className="relative mb-8 h-20 w-20">
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-charcoal-100"
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold-500"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="h-7 w-7 text-gold-500" />
                      </div>
                    </div>

                    <h2 className="mb-2 font-display text-xl font-semibold text-charcoal-900">
                      {state === 'redirecting'
                        ? t('redirecting')
                        : t('preparing')}
                    </h2>
                    <p className="max-w-xs text-sm leading-relaxed text-charcoal-400">
                      {state === 'redirecting'
                        ? t('redirectingDesc')
                        : t('preparingDesc')}
                    </p>

                    {/* Progress dots */}
                    <div className="mt-8 flex items-center gap-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="h-2 w-2 rounded-full bg-gold-400"
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: 'easeInOut',
                          }}
                        />
                      ))}
                    </div>

                    {/* Security badges */}
                    <div className="mt-10 flex items-center justify-center gap-6">
                      <SecurityBadge
                        icon={<ShieldCheck className="h-4 w-4 text-green-600" />}
                        label={t('sslSecured')}
                      />
                      <div className="h-4 w-px bg-charcoal-200" />
                      <SecurityBadge
                        icon={<StripeLogo />}
                        label={t('poweredByStripe')}
                      />
                      <div className="h-4 w-px bg-charcoal-200" />
                      <SecurityBadge
                        icon={<Lock className="h-4 w-4 text-charcoal-400" />}
                        label={t('encryption')}
                      />
                    </div>
                  </motion.div>
                )}

                {state === 'error' && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center px-8 py-16 text-center"
                  >
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                      <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h2 className="mb-2 font-display text-xl font-semibold text-charcoal-900">
                      {t('errorTitle')}
                    </h2>
                    <p className="mb-8 max-w-sm text-sm leading-relaxed text-charcoal-500">
                      {errorMessage || t('errorFallback')}
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        variant="primary"
                        onClick={() => initiateCheckout(items)}
                        className="gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        {t('tryAgain')}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push('/cart')}
                      >
                        {t('returnToCart')}
                      </Button>
                    </div>

                    {/* Security badges */}
                    <div className="mt-10 flex items-center justify-center gap-6">
                      <SecurityBadge
                        icon={<ShieldCheck className="h-4 w-4 text-green-600" />}
                        label={t('sslSecured')}
                      />
                      <div className="h-4 w-px bg-charcoal-200" />
                      <SecurityBadge
                        icon={<StripeLogo />}
                        label={t('poweredByStripe')}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-4 grid grid-cols-3 gap-3"
            >
              {trustItems.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-charcoal-100 bg-white px-3 py-4 text-center"
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-[11px] font-medium text-charcoal-600">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2"
          >
            <div className="sticky top-8 rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm">
              <OrderSummary items={items} showImages={true} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function SecurityBadge({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      {icon}
      <span className="text-[10px] text-charcoal-400">{label}</span>
    </div>
  )
}

function StripeLogo() {
  return (
    <svg
      className="h-4 w-auto"
      viewBox="0 0 60 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Stripe"
    >
      <path
        d="M5.5 10.2c0-.8.6-1.1 1.6-1.1 1.5 0 3.3.4 4.8 1.3V6.1C10.3 5.4 8.6 5 6.9 5 3 5 .5 7.1.5 10.4c0 5.2 7.2 4.4 7.2 6.6 0 .9-.8 1.2-1.9 1.2-1.6 0-3.7-.7-5.3-1.6v4.4C1.9 21.7 3.8 22 5.7 22c3.9 0 6.6-1.9 6.6-5.3C12.2 11.2 5.5 12.2 5.5 10.2z"
        fill="#635BFF"
      />
      <path
        d="M26.4 5.3l-2.8.6-.6 2.9h-2.4l-.7 3.5h2.4l-1.1 5.2c-.1.5-.1.9-.1 1.3 0 2.6 1.6 3.5 4 3.2l1.9-.3V17c-.4.1-.8.1-1.2.1-.9 0-1.2-.4-1-1.3l1.1-5.3h2.4l.7-3.5h-2.4l.8-3.7z"
        fill="#635BFF"
      />
      <path
        d="M31.5 8.8h-4.2l-3.1 13h4.2l3.1-13zM29.4 5c-1.3 0-2.3 1-2.3 2.3s1 2.3 2.3 2.3 2.3-1 2.3-2.3-1-2.3-2.3-2.3z"
        fill="#635BFF"
      />
      <path
        d="M39.3 8.5c-1.9 0-3.2.9-3.9 1.5l-.3-1.2h-3.7l-3.1 13h4.2l1.2-5.1c.5-2.2 1.8-3.3 3.1-3.3.8 0 1.3.5 1.3 1.5 0 .4-.1.9-.2 1.3l-1.3 5.6h4.2l1.3-5.9c.2-.8.3-1.7.3-2.4 0-3-1.7-5-3.1-5z"
        fill="#635BFF"
      />
      <path
        d="M52.2 8.5c-2.1 0-3.7.9-4.7 2.3l-.2-2H43l-3.1 13h4.2l1.2-5c.5-2.3 1.8-3.5 3.1-3.5.8 0 1.3.4 1.3 1.3 0 .4-.1.8-.2 1.3l-1.3 5.9h4.2l1.3-5.9c.2-.8.3-1.7.3-2.4 0-3-1.7-5-1.8-5z"
        fill="#635BFF"
      />
    </svg>
  )
}

