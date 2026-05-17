'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { cn, formatPrice } from '@/lib/utils'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { useHydrated } from '@/lib/hooks/use-hydrated'
import { useRecentlyViewedStore } from '@/lib/store/recently-viewed-store'
import type { Product } from '@/lib/types'

function emitQuickView(product: Product) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('luxe:quickview', { detail: { product } }))
  }
}

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const t = useTranslations('product')
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const { addProduct } = useRecentlyViewedStore()
  const hydrated = useHydrated()

  const isWishlisted = hydrated && isInWishlist(product._id)

  const primaryImage = product.images?.[0]
  const hoverImage = product.images?.[1] ?? product.images?.[0]

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0

  const handleWishlistToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      toggleWishlist(product)
    },
    [toggleWishlist, product]
  )

  const handleQuickView = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      addProduct(product)
      emitQuickView(product)
    },
    [addProduct, product]
  )

  const handleLinkClick = useCallback(() => {
    addProduct(product)
  }, [addProduct, product])

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Image container ─────────────────────────────────────────────── */}
      <Link
        href={`/products/${product.slug}`}
        onClick={handleLinkClick}
        className="relative block overflow-hidden bg-cream-100 aspect-[3/4] focus-visible:outline-2 focus-visible:outline-gold-500 focus-visible:outline-offset-2"
        aria-label={`View ${product.name}`}
      >
        {/* Primary image */}
        {primaryImage ? (
          <motion.div
            className="absolute inset-0"
            animate={{ scale: isHovered ? 1.06 : 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={cn(
                'object-cover transition-opacity duration-500',
                imageLoaded ? 'opacity-100' : 'opacity-0',
                hoverImage?.url !== primaryImage.url && 'group-hover:opacity-0'
              )}
              priority={priority}
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-cream-50 via-cream-100 to-cream-200">
            <div className="h-px w-8 bg-gold-300/50" />
            <span className="font-display text-5xl font-light italic text-charcoal-200 select-none">
              {product.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
            </span>
            <div className="h-px w-8 bg-gold-300/50" />
          </div>
        )}

        {/* Hover / secondary image */}
        {hoverImage && hoverImage.url !== primaryImage?.url && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1.06 : 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src={hoverImage.url}
              alt={hoverImage.alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </motion.div>
        )}

        {/* ── Bottom gradient + action buttons ──────────────────────────── */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-0 flex flex-col justify-end"
            >
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/75 via-charcoal-950/20 to-transparent pointer-events-none" />

              {/* Buttons */}
              <div className="relative z-10 flex flex-col gap-0 px-4 pb-4">
                {/* QUICK VIEW */}
                <motion.button
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.06 }}
                  onClick={handleQuickView}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-gold-400/60 text-gold-300 text-[10px] font-semibold tracking-[0.22em] uppercase hover:bg-gold-500/20 transition-colors"
                  aria-label={`Quick view ${product.name}`}
                >
                  <Sparkles size={10} />
                  {t('quickView')}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Badges (top-left) ─────────────────────────────────────────── */}
        <div className="absolute top-0 left-0 flex flex-col z-10">
          {product.new && (
            <span className="bg-gold-500 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-white leading-none">
              {t('new')}
            </span>
          )}
          {product.bestSeller && !product.new && (
            <span className="bg-charcoal-900/90 backdrop-blur-sm px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-cream-200 leading-none">
              {t('bestSeller')}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white leading-none">
              -{discount}%
            </span>
          )}
        </div>

        {/* ── Wishlist (top-right, circular) ────────────────────────────── */}
        <motion.button
          onClick={handleWishlistToggle}
          initial={false}
          animate={{ opacity: isHovered || isWishlisted ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'absolute top-2.5 right-2.5 z-10',
            'w-7 h-7 flex items-center justify-center rounded-full',
            'backdrop-blur-sm transition-colors duration-200',
            isWishlisted
              ? 'bg-white text-red-500'
              : 'bg-white/80 text-charcoal-600 hover:bg-white hover:text-red-400'
          )}
          whileTap={{ scale: 0.82 }}
          aria-label={isWishlisted ? `${t('removeFromWishlist')}: ${product.name}` : `${t('addToWishlist')}: ${product.name}`}
          aria-pressed={isWishlisted}
        >
          <Heart
            size={13}
            className="transition-all duration-150"
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </motion.button>
      </Link>

      {/* ── Product info ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-0.5 pt-3 px-0.5">
        <p className="text-[9px] font-medium tracking-[0.22em] uppercase text-charcoal-400">
          {product.category?.name ?? product.fragranceFamily}
        </p>

        <Link
          href={`/products/${product.slug}`}
          onClick={handleLinkClick}
          className="font-display text-[15px] font-light text-charcoal-900 leading-snug hover:text-gold-600 transition-colors duration-150 focus-visible:outline-none focus-visible:underline"
          tabIndex={-1}
        >
          {product.name}
        </Link>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-body text-sm font-medium text-charcoal-900">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-charcoal-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}
