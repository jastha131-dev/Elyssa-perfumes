'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  X,
  ShoppingBag,
  Share2,
  Check,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { useCartStore } from '@/lib/store/cart-store'
import { useHydrated } from '@/lib/hooks/use-hydrated'
import { cn, formatPrice } from '@/lib/utils'
import type { WishlistItem } from '@/lib/types'

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

function EmptyWishlist() {
  const t = useTranslations('wishlist')
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-28 text-center"
    >
      {/* Heart illustration */}
      <div className="relative mb-8">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-rose-50">
          <Heart
            className="h-12 w-12 text-rose-300"
            strokeWidth={1.2}
            fill="currentColor"
            fillOpacity={0.3}
          />
        </div>
        <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-gold-200" />
        <div className="absolute -bottom-2 left-2 h-2.5 w-2.5 rounded-full bg-rose-200" />
      </div>

      <h2 className="font-display text-2xl font-light text-charcoal-900">
        {t('empty')}
      </h2>
      <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-charcoal-400">
        {t('emptyDesc')}
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
        {t('exploreCollection')}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  )
}

function WishlistCard({ wishlistItem }: { wishlistItem: WishlistItem }) {
  const { product } = wishlistItem
  const { removeItem } = useWishlistStore()
  const { addItem } = useCartStore()
  const [addedToCart, setAddedToCart] = useState(false)
  const t = useTranslations('wishlist')
  const tp = useTranslations('product')

  const primaryImage = product.images?.[0]
  const defaultVolume = product.volume?.[0]
  const displayPrice = defaultVolume?.price ?? product.price

  const handleMoveToCart = () => {
    if (!defaultVolume) return
    addItem(product, 1, defaultVolume)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2200)
  }

  return (
    <motion.div
      layout
      variants={cardVariants}
      exit={{
        opacity: 0,
        scale: 0.92,
        transition: { duration: 0.25, ease: 'easeIn' },
      }}
      className="group relative flex flex-col rounded-2xl border border-charcoal-100 bg-white shadow-sm overflow-hidden"
    >
      {/* Remove button */}
      <button
        onClick={() => removeItem(product._id)}
        className={cn(
          'absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full',
          'bg-white/90 text-charcoal-400 shadow-sm backdrop-blur-sm',
          'transition-all duration-200 hover:bg-white hover:text-rose-500 hover:shadow-md',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400',
          'opacity-0 group-hover:opacity-100'
        )}
        aria-label={`Remove ${product.name} from wishlist`}
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* Product image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream-100">
          {primaryImage?.url ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-charcoal-100 to-charcoal-200" />
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.new && (
              <span className="bg-gold-500 px-2 py-0.5 font-body text-[10px] font-medium uppercase tracking-widest text-charcoal-950">
                {tp('new')}
              </span>
            )}
            {product.bestSeller && (
              <span className="bg-charcoal-900/90 px-2 py-0.5 font-body text-[10px] font-medium uppercase tracking-widest text-gold-400">
                {tp('bestSeller')}
              </span>
            )}
          </div>

          {/* Hover: view link */}
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              'bg-charcoal-950/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
            )}
          >
            <span className="flex items-center gap-1.5 bg-white/90 px-4 py-2 font-body text-xs font-medium uppercase tracking-[0.15em] text-charcoal-900 backdrop-blur-sm">
              <ExternalLink className="h-3.5 w-3.5" />
              {t('viewDetails')}
            </span>
          </div>
        </div>
      </Link>

      {/* Card info */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          {product.category?.name && (
            <p className="mb-1 font-body text-[10px] uppercase tracking-[0.25em] text-gold-500/80">
              {product.category.name}
            </p>
          )}
          <Link
            href={`/products/${product.slug}`}
            className="font-display text-base font-light text-charcoal-900 transition-colors hover:text-gold-600 line-clamp-2"
          >
            {product.name}
          </Link>

          <div className="mt-1.5 flex items-center gap-2">
            <span className="font-body text-sm font-semibold text-charcoal-900">
              {formatPrice(displayPrice)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > displayPrice && (
              <span className="font-body text-xs text-charcoal-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {defaultVolume && (
            <p className="mt-0.5 font-body text-xs text-charcoal-400">
              {defaultVolume.ml} ml
            </p>
          )}
        </div>

        {/* Move to cart */}
        <button
          onClick={handleMoveToCart}
          disabled={!defaultVolume || addedToCart}
          className={cn(
            'mt-auto flex w-full items-center justify-center gap-2 rounded-full py-2.5',
            'font-body text-xs font-semibold uppercase tracking-[0.15em]',
            'transition-all duration-300',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2',
            addedToCart
              ? 'bg-green-50 text-green-600 border border-green-200'
              : 'bg-gold-500 text-white hover:bg-gold-600 active:scale-[0.97]',
            !defaultVolume && 'cursor-not-allowed opacity-50'
          )}
          aria-label={`Add ${product.name} to cart`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {addedToCart ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                {t('addedToBag')}
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                {t('moveToBag')}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  )
}

function ShareButton() {
  const [copied, setCopied] = useState(false)
  const t = useTranslations('wishlist')

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback: select the URL text
      if (typeof window !== 'undefined') {
        const input = document.createElement('input')
        input.value = window.location.href
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    }
  }

  return (
    <motion.button
      onClick={handleShare}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-5 py-2',
        'font-body text-sm font-medium transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2',
        copied
          ? 'border-green-300 bg-green-50 text-green-600'
          : 'border-charcoal-200 bg-white text-charcoal-600 hover:border-charcoal-400 hover:text-charcoal-900'
      )}
      aria-label={t('shareWishlist')}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {t('linkCopied')}
          </motion.span>
        ) : (
          <motion.span
            key="share"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            {t('shareWishlist')}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default function WishlistPage() {
  const { items, totalItems } = useWishlistStore()
  const hydrated = useHydrated()
  const count = hydrated ? totalItems() : 0
  const hasItems = hydrated && items.length > 0
  const t = useTranslations('wishlist')

  return (
    <main className="min-h-screen bg-cream-50 pb-20">
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="mb-1.5 font-body text-xs uppercase tracking-[0.3em] text-gold-500">
              {t('savedItems')}
            </p>
            <h1 className="font-display text-3xl font-light text-charcoal-900 sm:text-4xl">
              {t('myWishlist')}
            </h1>
            {hasItems && (
              <p className="mt-1.5 font-body text-sm text-charcoal-400">
                {t('fragranceCount', { count })}
              </p>
            )}
          </div>

          {hasItems && (
            <div className="flex items-center gap-3">
              <ShareButton />
            </div>
          )}
        </motion.div>

        {/* Decorative divider */}
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-charcoal-100" />
          <Heart
            className="h-3.5 w-3.5 flex-shrink-0 text-gold-400"
            fill="currentColor"
            strokeWidth={0}
          />
          <div className="h-px flex-1 bg-charcoal-100" />
        </div>

        {!hasItems ? (
          <EmptyWishlist />
        ) : (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {items.map((wishlistItem) => (
                <WishlistCard
                  key={wishlistItem.product._id}
                  wishlistItem={wishlistItem}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* CTA when wishlist has items */}
        {hasItems && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-14 text-center"
          >
            <p className="mb-4 font-body text-sm text-charcoal-400">
              {t('discoverMore')}
            </p>
            <Link
              href="/products"
              className={cn(
                'inline-flex items-center gap-2 border border-charcoal-900 px-10 py-3.5',
                'font-body text-sm uppercase tracking-[0.2em] text-charcoal-900',
                'transition-all duration-300 hover:bg-charcoal-900 hover:text-cream-100',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-400'
              )}
            >
              {t('exploreAll')}
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  )
}
