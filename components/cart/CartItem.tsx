'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { X, Plus, Minus } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/lib/types'

interface CartItemProps {
  item: CartItemType
  onRemove: () => void
  onUpdateQuantity: (qty: number) => void
  size?: 'sm' | 'lg'
}

export default function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
  size = 'sm',
}: CartItemProps) {
  const { product, selectedVolume, quantity } = item
  const lineTotal = selectedVolume.price * quantity
  const primaryImage = product.images?.[0]

  const isLarge = size === 'lg'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.22, ease: 'easeIn' } }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative flex gap-4',
        isLarge ? 'gap-6 py-6' : 'py-5'
      )}
    >
      {/* Product Image */}
      <div
        className={cn(
          'relative flex-shrink-0 overflow-hidden rounded-lg bg-cream-100',
          isLarge ? 'h-28 w-20' : 'h-20 w-16'
        )}
      >
        {primaryImage?.url ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            className="object-cover"
            sizes={isLarge ? '80px' : '64px'}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-charcoal-100 to-charcoal-200" />
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        {/* Top row: name + remove */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {product.category?.name && (
              <p className="mb-0.5 font-body text-[10px] uppercase tracking-[0.25em] text-gold-500/80">
                {product.category.name}
              </p>
            )}
            <p
              className={cn(
                'font-display font-medium text-charcoal-900 leading-tight truncate',
                isLarge ? 'text-base' : 'text-sm'
              )}
            >
              {product.name}
            </p>
            <p className={cn('text-charcoal-400', isLarge ? 'text-sm mt-0.5' : 'text-xs')}>
              {selectedVolume.ml} ml
            </p>
          </div>

          <button
            onClick={onRemove}
            className={cn(
              'flex-shrink-0 rounded-full p-1 text-charcoal-300 transition-colors',
              'hover:bg-charcoal-100 hover:text-charcoal-700',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400'
            )}
            aria-label={`Remove ${product.name} from cart`}
          >
            <X className={isLarge ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
          </button>
        </div>

        {/* Bottom row: qty stepper + line total */}
        <div className="mt-auto flex items-center justify-between pt-2">
          {/* Quantity Stepper */}
          <div
            className={cn(
              'flex items-center gap-2 rounded-full border border-charcoal-200',
              isLarge ? 'px-3 py-1.5' : 'px-2.5 py-1'
            )}
          >
            <button
              onClick={() => onUpdateQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className={cn(
                'text-charcoal-400 transition-colors hover:text-charcoal-900',
                'disabled:cursor-not-allowed disabled:opacity-30',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-full'
              )}
              aria-label="Decrease quantity"
            >
              <Minus className={isLarge ? 'h-3.5 w-3.5' : 'h-3 w-3'} />
            </button>
            <span
              className={cn(
                'text-center font-medium text-charcoal-900 tabular-nums',
                isLarge ? 'w-6 text-sm' : 'w-5 text-sm'
              )}
            >
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(quantity + 1)}
              className={cn(
                'text-charcoal-400 transition-colors hover:text-charcoal-900',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-full'
              )}
              aria-label="Increase quantity"
            >
              <Plus className={isLarge ? 'h-3.5 w-3.5' : 'h-3 w-3'} />
            </button>
          </div>

          {/* Line total */}
          <div className="text-right">
            <p
              className={cn(
                'font-display font-semibold text-charcoal-900 tabular-nums',
                isLarge ? 'text-base' : 'text-sm'
              )}
            >
              {formatPrice(lineTotal)}
            </p>
            {quantity > 1 && (
              <p className="text-xs text-charcoal-400">
                {formatPrice(selectedVolume.price)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
