'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2 } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import CartItem from '@/components/cart/CartItem'
import { cn, formatPrice } from '@/lib/utils'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const t = useTranslations('cart')
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } =
    useCartStore()

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const subtotal = totalPrice()
  const count = totalItems()

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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300, mass: 0.8 }}
            className={cn(
              'fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl',
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
                <h2 className="font-display text-lg font-semibold text-charcoal-900">
                  {t('bag')}
                </h2>
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
                    className={cn(
                      'rounded-full p-2 text-charcoal-300 transition-colors',
                      'hover:bg-charcoal-50 hover:text-charcoal-600',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400'
                    )}
                    aria-label={t('clearCart')}
                    title={t('clearItems')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className={cn(
                    'rounded-full p-2 text-charcoal-400 transition-colors',
                    'hover:bg-charcoal-50 hover:text-charcoal-900',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400'
                  )}
                  aria-label={t('close')}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

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
                    <p className="font-display text-lg font-light text-charcoal-800">
                      {t('bagEmpty')}
                    </p>
                    <p className="mt-2 max-w-[220px] font-body text-sm leading-relaxed text-charcoal-400">
                      {t('bagEmptyDrawerDesc')}
                    </p>
                    <Link
                      href="/products"
                      onClick={onClose}
                      className={cn(
                        'mt-7 inline-flex items-center rounded-full border border-gold-500',
                        'px-7 py-2.5 font-body text-sm font-medium text-gold-600',
                        'transition-all duration-200 hover:bg-gold-500 hover:text-white',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400'
                      )}
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
                            onUpdateQuantity={(qty) =>
                              updateQuantity(item.product._id, item.selectedVolume.ml, qty)
                            }
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
                  className="flex-shrink-0 border-t border-charcoal-100 bg-white px-6 pb-8 pt-5"
                >
                  {/* Subtotal row */}
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-charcoal-500">{t('subtotal')}</span>
                    <span className="font-display text-base font-semibold text-charcoal-900">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {/* Shipping note */}
                  <p className="mt-1.5 font-body text-xs text-charcoal-400">
                    {subtotal >= 100 ? (
                      <span className="text-green-600 font-medium">
                        {t('freeShipping')}
                      </span>
                    ) : (
                      t.rich('freeShippingThreshold', {
                        threshold: '$100',
                        span: (chunks) => (
                          <span className="text-charcoal-600 font-medium">{chunks}</span>
                        ),
                      })
                    )}
                  </p>

                  <p className="mt-1 font-body text-xs text-charcoal-400">
                    {t('taxNote')}
                  </p>

                  {/* Checkout CTA */}
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className={cn(
                      'mt-5 block w-full rounded-full bg-gold-500 py-3.5',
                      'text-center font-body text-sm font-semibold text-white shadow-md',
                      'transition-all duration-200 hover:bg-gold-600 hover:shadow-lg',
                      'active:scale-[0.98]',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2'
                    )}
                  >
                    {t('checkout')}
                  </Link>

                  <button
                    onClick={onClose}
                    className={cn(
                      'mt-3 block w-full text-center font-body text-xs text-charcoal-400',
                      'underline-offset-2 transition-colors hover:text-charcoal-700 hover:underline',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400'
                    )}
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
