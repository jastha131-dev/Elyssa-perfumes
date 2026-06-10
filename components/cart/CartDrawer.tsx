'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Tag, CheckCircle, AlertCircle, Truck } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { usePromotionsStore } from '@/lib/store/promotions-store'
import CartItem from '@/components/cart/CartItem'
import { cn } from '@/lib/utils'
import { useCurrencyStore } from '@/lib/store/currency-store'
import { PriceText } from '@/components/ui/PriceText'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const t = useTranslations('cart')
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const formatPrice = useCurrencyStore((s) => s.format)
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart, giftWrap, setGiftWrap, giftMessage, setGiftMessage } = useCartStore()

  const {
    enteredCode,
    appliedPromotion,
    discountResult,
    freeShippingThreshold,
    setEnteredCode,
    applyCode,
    removeCode,
    recalculate,
    getEffectiveDiscount,
    hasFreeShipping,
  } = usePromotionsStore()

  const [codeStatus, setCodeStatus] = useState<{ ok: boolean; msg: string } | null>(null)
  const [applying, setApplying] = useState(false)

  const subtotal = totalPrice()
  const count = totalItems()
  const discount = getEffectiveDiscount()
  const freeShip = hasFreeShipping()
  const total = Math.max(0, subtotal - discount)

  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100)
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const hasBaseFreeShipping = subtotal >= freeShippingThreshold

  // Recalculate promotions when cart changes
  useEffect(() => {
    recalculate(items, subtotal, locale)
  }, [subtotal, items, locale, recalculate])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleApplyCode = useCallback(async () => {
    if (!enteredCode.trim()) return
    setApplying(true)
    setCodeStatus(null)
    await new Promise((r) => setTimeout(r, 300))
    const result = applyCode(enteredCode, items, subtotal, locale)
    setCodeStatus({ ok: result.success, msg: result.message })
    setApplying(false)
  }, [enteredCode, items, subtotal, locale, applyCode])

  const handleRemoveCode = useCallback(() => {
    removeCode()
    setCodeStatus(null)
  }, [removeCode])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-charcoal-900/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.aside
            key="cart-drawer-panel"
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300, mass: 0.8 }}
            className={cn(
              'fixed right-0 rtl:right-auto rtl:left-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl',
              'max-w-sm sm:max-w-md'
            )}
            role="dialog"
            aria-modal="true"
            aria-label={t('title')}
          >
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-charcoal-100 px-6 py-5">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-gold-500" strokeWidth={1.5} />
                <h2 className="font-display text-lg font-semibold text-charcoal-900">{t('bag')}</h2>
                <AnimatePresence mode="popLayout">
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 font-body text-[11px] font-semibold text-white"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="rounded-full p-2 text-charcoal-300 transition-colors hover:bg-charcoal-50 hover:text-charcoal-600 focus:outline-none"
                    aria-label={t('clearCart')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-charcoal-400 transition-colors hover:bg-charcoal-50 hover:text-charcoal-900 focus:outline-none"
                  aria-label={t('close')}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Free Shipping Progress Bar */}
            {items.length > 0 && (
              <div className="flex-shrink-0 border-b border-charcoal-50 px-6 py-3 bg-cream-50">
                <div className="flex items-center gap-2 mb-1.5">
                  <Truck className="h-3.5 w-3.5 text-gold-500 flex-shrink-0" />
                  <p className="font-body text-xs text-charcoal-600">
                    {(hasBaseFreeShipping || freeShip) ? (
                      <span className="font-semibold text-green-700">Free shipping unlocked!</span>
                    ) : (
                      <>Add <PriceText amount={amountToFreeShipping} className="font-semibold text-charcoal-900" /> more for free shipping</>
                    )}
                  </p>
                </div>
                <div className="h-1 w-full rounded-full bg-charcoal-100 overflow-hidden">
                  <motion.div
                    className={cn('h-full rounded-full', (hasBaseFreeShipping || freeShip) ? 'bg-green-500' : 'bg-gold-500')}
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                  >
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cream-100">
                      <ShoppingBag className="h-7 w-7 text-gold-400" strokeWidth={1.2} />
                    </div>
                    <p className="font-display text-lg font-light text-charcoal-800">{t('bagEmpty')}</p>
                    <p className="mt-2 max-w-[220px] font-body text-sm leading-relaxed text-charcoal-400">
                      {t('bagEmptyDrawerDesc')}
                    </p>
                    <Link
                      href="/products"
                      onClick={onClose}
                      className="mt-7 inline-flex items-center rounded-full border border-gold-500 px-7 py-2.5 font-body text-sm font-medium text-gold-600 transition-all duration-200 hover:bg-gold-500 hover:text-white"
                    >
                      {t('shopNow')}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.ul
                    key="item-list"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    className="divide-y divide-charcoal-100"
                  >
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <li key={`${item.product._id}-${item.selectedVolume.ml}`}>
                          <CartItem
                            item={item}
                            onRemove={() => removeItem(item.product._id, item.selectedVolume.ml)}
                            onUpdateQuantity={(qty) => updateQuantity(item.product._id, item.selectedVolume.ml, qty)}
                            size="sm"
                          />
                        </li>
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <AnimatePresence>
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-shrink-0 border-t border-charcoal-100 bg-white px-6 pb-8 pt-4"
                >
                  {/* Active discount badge */}
                  {discountResult && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-3 flex items-center gap-2 rounded bg-green-50 border border-green-200 px-3 py-2"
                    >
                      <Tag className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                      <p className="flex-1 font-body text-xs font-medium text-green-700">{discountResult.label}</p>
                      {appliedPromotion && (
                        <button onClick={handleRemoveCode} className="font-body text-[10px] text-green-600 underline hover:text-green-800">
                          Remove
                        </button>
                      )}
                    </motion.div>
                  )}

                  {/* Coupon Code Input */}
                  {!appliedPromotion && (
                    <div className="mb-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={enteredCode}
                          onChange={(e) => { setEnteredCode(e.target.value.toUpperCase()); setCodeStatus(null) }}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCode()}
                          placeholder="Promo code"
                          className="flex-1 border border-charcoal-200 px-3 py-2 font-body text-sm text-charcoal-900 placeholder:text-charcoal-300 outline-none focus:border-gold-400 uppercase"
                          maxLength={30}
                        />
                        <button
                          onClick={handleApplyCode}
                          disabled={applying || !enteredCode.trim()}
                          className="rounded bg-camel-500 px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-camel-600 disabled:opacity-40"
                        >
                          {applying ? '...' : 'Apply'}
                        </button>
                      </div>
                      {codeStatus && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn('mt-1.5 flex items-center gap-1.5 font-body text-xs', codeStatus.ok ? 'text-green-600' : 'text-red-500')}
                        >
                          {codeStatus.ok ? <CheckCircle className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                          {codeStatus.msg}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Price rows */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-charcoal-500">{t('subtotal')}</span>
                      <PriceText amount={subtotal} className="font-body text-sm text-charcoal-700" />
                    </div>
                    {discount > 0 && (
                      <div className="flex items-center justify-between text-green-600">
                        <span className="font-body text-sm">Discount</span>
                        <span className="font-body text-sm font-medium">− <PriceText amount={discount} /></span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-charcoal-100 pt-2 mt-2">
                      <span className="font-body text-sm font-semibold text-charcoal-900">Total</span>
                      <PriceText amount={total} className="font-display text-base font-semibold text-charcoal-900" />
                    </div>
                  </div>

                  <p className="mt-1.5 font-body text-xs text-charcoal-400">{t('taxNote')}</p>

                  {/* Gift wrap */}
                  <div className="mt-4 rounded-xl border border-charcoal-100 bg-cream-50/60 p-3">
                    <label className="flex cursor-pointer items-center justify-between gap-3">
                      <span className="flex items-center gap-2 font-body text-sm text-charcoal-800">
                        <span className="text-base">🎁</span>
                        {t('giftWrap')} <span className="text-charcoal-400">+$5</span>
                      </span>
                      <button
                        type="button"
                        aria-label={t('giftWrap')}
                        onClick={() => setGiftWrap(!giftWrap)}
                        className={cn('relative h-5 w-9 flex-shrink-0 rounded-full transition-colors', giftWrap ? 'bg-gold-500' : 'bg-charcoal-200')}
                      >
                        <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all', giftWrap ? 'left-[18px]' : 'left-0.5')} />
                      </button>
                    </label>
                    {giftWrap && (
                      <input
                        type="text"
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        maxLength={140}
                        placeholder={t('giftMessagePlaceholder')}
                        className="mt-2.5 w-full rounded-lg border border-charcoal-200 bg-white px-3 py-2 font-body text-xs text-charcoal-700 focus:border-gold-500 focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Checkout CTA */}
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="mt-5 block w-full rounded bg-camel-500 py-3.5 text-center font-body text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-camel-600 hover:shadow-lg active:scale-[0.98]"
                  >
                    {t('checkout')}
                  </Link>

                  <button
                    onClick={onClose}
                    className="mt-3 block w-full text-center font-body text-xs text-charcoal-400 underline-offset-2 transition-colors hover:text-charcoal-700 hover:underline"
                  >
                    {t('continueShopping')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
