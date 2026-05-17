'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ChevronRight, ArrowRight, Tag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCartStore } from '@/lib/store/cart-store'
import CartItem from '@/components/cart/CartItem'
import { cn, formatPrice } from '@/lib/utils'
import { useHydrated } from '@/lib/hooks/use-hydrated'

const TAX_RATE = 0.08
const SHIPPING_THRESHOLD = 100
const SHIPPING_COST = 15

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
}

function Breadcrumb() {
  const t = useTranslations('cart')
  const tn = useTranslations('nav')
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-1.5 font-body text-xs text-charcoal-400">
        <li>
          <Link
            href="/"
            className="transition-colors hover:text-charcoal-700 focus:outline-none focus-visible:underline"
          >
            {tn('home')}
          </Link>
        </li>
        <li>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
        </li>
        <li className="font-medium text-charcoal-900" aria-current="page">
          {t('title')}
        </li>
      </ol>
    </nav>
  )
}

function EmptyCart() {
  const t = useTranslations('cart')
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-cream-100">
          <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-14 w-14"
            aria-hidden="true"
          >
            <path
              d="M28 18h24l4 8H24l4-8z"
              stroke="#d99a1b"
              strokeWidth="1.5"
              strokeLinejoin="round"
              fill="none"
            />
            <rect
              x="18"
              y="26"
              width="44"
              height="32"
              rx="3"
              stroke="#d99a1b"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="32" cy="42" r="4" stroke="#c8c8c8" strokeWidth="1.5" fill="none" />
            <circle cx="48" cy="42" r="4" stroke="#c8c8c8" strokeWidth="1.5" fill="none" />
            <path d="M36 42h8" stroke="#c8c8c8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        {/* Decorative dots */}
        <div className="absolute -right-2 -top-2 h-3 w-3 rounded-full bg-gold-200" />
        <div className="absolute -bottom-1 -left-3 h-2 w-2 rounded-full bg-gold-300" />
      </div>

      <h2 className="font-display text-2xl font-light text-charcoal-900">
        {t('bagEmpty')}
      </h2>
      <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-charcoal-400">
        {t('bagEmptyDesc')}
      </p>

      <Link
        href="/products"
        className={cn(
          'mt-8 inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3',
          'font-body text-sm font-semibold text-white shadow-md',
          'transition-all duration-200 hover:bg-gold-600 hover:shadow-lg active:scale-[0.98]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2'
        )}
      >
        {t('startShopping')}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  )
}

function OrderSummary({
  subtotal,
  shipping,
  tax,
  total,
}: {
  subtotal: number
  shipping: number
  tax: number
  total: number
}) {
  const t = useTranslations('cart')
  const tc = useTranslations('checkout')
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

      {/* Promo code hint */}
      <div className="mt-5">
        <button
          className={cn(
            'flex w-full items-center gap-2 rounded-lg border border-dashed border-charcoal-200 px-4 py-2.5',
            'font-body text-sm text-charcoal-400 transition-colors hover:border-gold-400 hover:text-gold-600',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400'
          )}
        >
          <Tag className="h-4 w-4" />
          {t('applyPromo')}
        </button>
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

function YouMayAlsoLike() {
  const t = useTranslations('cart')
  return (
    <section className="mt-20 border-t border-charcoal-100 pt-14">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-1.5 font-body text-xs uppercase tracking-[0.3em] text-gold-500">
            {t('recommendations')}
          </p>
          <h2 className="font-display text-2xl font-light text-charcoal-900">
            {t('youMayAlsoLike')}
          </h2>
        </div>
        <Link
          href="/products"
          className="hidden font-body text-sm text-charcoal-400 underline-offset-2 transition-colors hover:text-charcoal-700 hover:underline sm:block"
        >
          {t('viewAll')}
        </Link>
      </div>

      {/* Placeholder grid — wire up real products via server component when ready */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-[3/4] w-full animate-pulse rounded-xl bg-charcoal-100" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-charcoal-100" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-charcoal-100" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function CartPageClient() {
  const t = useTranslations('cart')
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore()
  const hydrated = useHydrated()

  const subtotal = hydrated ? totalPrice() : 0
  const shipping = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST
  const tax = subtotal * TAX_RATE
  const total = subtotal + shipping + tax
  const count = hydrated ? totalItems() : 0

  const hasItems = hydrated && items.length > 0

  return (
    <main className="min-h-screen bg-cream-50 pb-20">
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <Breadcrumb />

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-light text-charcoal-900 sm:text-4xl">
            {t('bag')}
          </h1>
          {hasItems && (
            <p className="mt-1 font-body text-sm text-charcoal-400">
              {t('itemCount', { count })}
            </p>
          )}
        </div>

        {!hasItems ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Cart Items — takes 2/3 width on large screens */}
            <div className="lg:col-span-2">
              <motion.div
                className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-sm"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="divide-y divide-charcoal-50 px-6">
                  <motion.ul
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <li key={`${item.product._id}-${item.selectedVolume.ml}`}>
                          <CartItem
                            item={item}
                            onRemove={() =>
                              removeItem(item.product._id, item.selectedVolume.ml)
                            }
                            onUpdateQuantity={(qty) =>
                              updateQuantity(
                                item.product._id,
                                item.selectedVolume.ml,
                                qty
                              )
                            }
                            size="lg"
                          />
                        </li>
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                </div>

                {/* Cart footer row */}
                <div className="flex items-center justify-between border-t border-charcoal-100 bg-cream-50 px-6 py-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 font-body text-sm text-charcoal-400 transition-colors hover:text-charcoal-700 focus:outline-none focus-visible:underline"
                  >
                    <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                    {t('continueShopping')}
                  </Link>
                  <span className="font-body text-sm text-charcoal-500">
                    {t('subtotal')}:{' '}
                    <span className="font-semibold text-charcoal-900">
                      {formatPrice(subtotal)}
                    </span>
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Order Summary — 1/3 width */}
            <div className="lg:col-span-1">
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
              />
            </div>
          </div>
        )}

        <YouMayAlsoLike />
      </div>
    </main>
  )
}
