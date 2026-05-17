'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Package, Truck, Tag } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { cn, formatPrice } from '@/lib/utils'
import type { CartItem } from '@/lib/types'

interface OrderSummaryProps {
  items: CartItem[]
  showImages?: boolean
  className?: string
}

const FREE_SHIPPING_THRESHOLD = 100
const STANDARD_SHIPPING_COST = 15
const TAX_RATE = 0.08 // 8%

export default function OrderSummary({
  items,
  showImages = true,
  className,
}: OrderSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.selectedVolume.price * item.quantity,
    0
  )

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST
  const taxAmount = subtotal * TAX_RATE
  const total = subtotal + shippingCost + taxAmount

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const t = useTranslations('checkout')
  const tc = useTranslations('cart')
  const locale = useLocale()

  return (
    <div className={cn('flex flex-col gap-0', className)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-charcoal-900">
          {t('orderSummary')}
        </h3>
        <span className="text-sm text-charcoal-400">
          {t('itemCount', { count: itemCount })}
        </span>
      </div>

      {/* Items List */}
      <div className="mb-5 divide-y divide-charcoal-100">
        {items.map((item, index) => {
          const primaryImage = item.product.images?.[0]
          const lineTotal = item.selectedVolume.price * item.quantity

          return (
            <motion.div
              key={`${item.product._id}-${item.selectedVolume.ml}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-3 py-4 first:pt-0"
            >
              {/* Image */}
              {showImages && (
                <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-md bg-cream-100">
                  {primaryImage?.url ? (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.alt || (locale === 'ar' ? item.product.name_ar : item.product.name_en)}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-charcoal-100 to-charcoal-200" />
                  )}
                  {/* Quantity badge */}
                  {item.quantity > 1 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal-900 text-[10px] font-bold text-white">
                      {item.quantity}
                    </span>
                  )}
                </div>
              )}

              {/* Details */}
              <div className="flex flex-1 items-start justify-between gap-2 min-w-0">
                <div className="min-w-0">
                  {(locale === 'ar' ? item.product.category?.name_ar : item.product.category?.name_en) && (
                    <p className="mb-0.5 text-[10px] uppercase tracking-[0.2em] text-gold-500">
                      {locale === 'ar' ? item.product.category?.name_ar : item.product.category?.name_en}
                    </p>
                  )}
                  <p className="truncate text-sm font-medium text-charcoal-900">
                    {locale === 'ar' ? item.product.name_ar : item.product.name_en}
                  </p>
                  <p className="text-xs text-charcoal-400">
                    {item.selectedVolume.ml}ml
                    {!showImages && item.quantity > 1 && (
                      <span className="ml-1.5 text-charcoal-300">× {item.quantity}</span>
                    )}
                  </p>
                </div>
                <p className="flex-shrink-0 text-sm font-semibold text-charcoal-900 tabular-nums">
                  {formatPrice(lineTotal)}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Totals */}
      <div className="space-y-2.5 border-t border-charcoal-100 pt-5">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-charcoal-500">{tc('subtotal')}</span>
          <span className="font-medium text-charcoal-900 tabular-nums">
            {formatPrice(subtotal)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-charcoal-500">
            <Truck className="h-3.5 w-3.5" />
            {t('estimatedShipping')}
          </span>
          {shippingCost === 0 ? (
            <span className="font-medium text-green-600">{tc('free')}</span>
          ) : (
            <span className="font-medium text-charcoal-900 tabular-nums">
              {formatPrice(shippingCost)}
            </span>
          )}
        </div>

        {/* Free shipping progress */}
        {subtotal < FREE_SHIPPING_THRESHOLD && (
          <div className="rounded-lg bg-cream-50 px-3 py-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] text-charcoal-500">
                <Tag className="h-3 w-3" />
                {t('freeShippingAt', { amount: formatPrice(FREE_SHIPPING_THRESHOLD) })}
              </span>
              <span className="text-[11px] font-medium text-gold-600">
                {t('away', { amount: formatPrice(FREE_SHIPPING_THRESHOLD - subtotal) })}
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-charcoal-200">
              <motion.div
                className="h-full rounded-full bg-gold-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        )}

        {/* Tax */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-charcoal-500">{t('estimatedTax', { rate: TAX_RATE * 100 })}</span>
          <span className="font-medium text-charcoal-900 tabular-nums">
            {formatPrice(taxAmount)}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-charcoal-100 pt-3">
          <div className="flex items-center justify-between">
            <span className="font-display text-base font-semibold text-charcoal-900">
              {t('estimatedTotal')}
            </span>
            <span className="font-display text-lg font-bold text-charcoal-900 tabular-nums">
              {formatPrice(total)}
            </span>
          </div>
          <p className="mt-1 text-right text-[11px] text-charcoal-400">
            {t('finalTotal')}
          </p>
        </div>
      </div>

      {/* Delivery note */}
      <div className="mt-4 flex items-start gap-2 rounded-lg bg-cream-50 px-3 py-3">
        <Package className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
        <p className="text-[11px] leading-relaxed text-charcoal-500">
          {t('deliveryNote')}
        </p>
      </div>
    </div>
  )
}
