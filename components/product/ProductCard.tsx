'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { useCurrencyStore } from '@/lib/store/currency-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { useCartStore } from '@/lib/store/cart-store'
import { useCartDrawerStore } from '@/lib/store/cart-drawer-store'
import { useHydrated } from '@/lib/hooks/use-hydrated'
import { useRecentlyViewedStore } from '@/lib/store/recently-viewed-store'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedVolIdx, setSelectedVolIdx] = useState(0)

  const t = useTranslations('product')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const name = isAr ? product.name_ar : product.name_en
  const formatPrice = useCurrencyStore((s) => s.format)
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()
  const { openCart } = useCartDrawerStore()
  const { addProduct } = useRecentlyViewedStore()
  const hydrated = useHydrated()

  const isWishlisted = hydrated && isInWishlist(product._id)
  const images = product.images ?? []
  const currentImage = images[imgIdx] ?? images[0]

  const volumes = product.volume ?? []
  const selectedVol = volumes[selectedVolIdx]
  const displayPrice = selectedVol?.price ?? product.price

  const reviews = product.reviews ?? []
  const reviewCount = reviews.length
  const avgRating = reviewCount > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviewCount
    : 0

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0

  // Touch swipe for image navigation
  const touchStartX = useRef<number | null>(null)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || images.length < 2) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 35) {
      if (dx < 0) setImgIdx((i) => (i + 1) % images.length)
      else setImgIdx((i) => (i - 1 + images.length) % images.length)
    }
    touchStartX.current = null
  }

  const handleWishlistToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      toggleWishlist(product)
    },
    [toggleWishlist, product]
  )

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const vol = selectedVol ?? { ml: 100, price: product.price }
      addToCart(product, 1, vol)
      openCart()
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    },
    [product, selectedVol, addToCart, openCart]
  )

  const handleLinkClick = useCallback(() => addProduct(product), [addProduct, product])

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIdx((i) => (i - 1 + images.length) % images.length)
  }
  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setImgIdx((i) => (i + 1) % images.length)
  }

  const badgeLabel = product.new
    ? (isAr ? 'وصل حديثاً' : 'New Arrival')
    : product.bestSeller
    ? (isAr ? 'الأكثر مبيعاً' : 'Best Seller')
    : (isAr ? product.category?.name_ar : product.category?.name_en) ?? null

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col bg-white"
      style={{
        borderRadius: 'var(--card-radius, 16px)',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Image */}
      <Link
        href={`/${locale}/products/${product.slug}`}
        onClick={handleLinkClick}
        className="relative block bg-stone-50"
        style={{ overflow: 'hidden', aspectRatio: 'var(--card-img-ratio, 3/4)', touchAction: 'pan-y' }}
        aria-label={`View ${name}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {currentImage ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={imgIdx}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              <Image
                src={currentImage.url}
                alt={currentImage.alt || name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={cn(
                  'object-cover transition-transform duration-700 group-hover:scale-[1.04]',
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                priority={priority}
                onLoad={() => setImageLoaded(true)}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
            <span className="font-display text-4xl font-light italic text-charcoal-200 select-none">
              {name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
            </span>
          </div>
        )}

        {/* Status badge (NEW ARRIVAL / BEST SELLER) — position/offset from Site Settings CSS vars */}
        {badgeLabel && (
          <div
            className="absolute z-10"
            style={{
              top: 'var(--card-badge-top, 12px)',
              left: 'var(--card-badge-l, 12px)',
              right: 'var(--card-badge-r, auto)',
            }}
          >
            <span
              className="inline-block text-[9px] font-bold uppercase tracking-[0.18em] px-2.5 py-1.5 leading-none"
              style={{ backgroundColor: 'var(--card-badge-bg, #1a1a1a)', color: 'var(--card-badge-text, #ffffff)' }}
            >
              {badgeLabel}
            </span>
          </div>
        )}

        {/* Nav overlay */}
        {images.length > 1 && (
          <>
            {/* Arrows — appear on hover */}
            <button
              type="button"
              onClick={prevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center bg-white/90 text-charcoal-800 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={13} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={nextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center bg-white/90 text-charcoal-800 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight size={13} strokeWidth={2.5} />
            </button>
            {/* Dots — always visible */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImgIdx(i)}
                  className={cn(
                    'h-1 rounded-full transition-all duration-200',
                    i === imgIdx ? 'bg-white w-4 shadow-sm' : 'bg-white/45 w-1 hover:bg-white/70'
                  )}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </Link>

      {/* Info */}
      <div
        className="flex flex-col gap-1.5 flex-1 p-2.5 sm:p-3.5 pt-3 sm:pt-3.5"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={{ textAlign: 'var(--card-text-align, left)' as any }}
      >
        {/* Name + wishlist heart inline */}
        <div className="flex items-start gap-1.5 mt-0.5" style={{ justifyContent: 'var(--card-price-justify, flex-start)' }}>
          <Link
            href={`/${locale}/products/${product.slug}`}
            onClick={handleLinkClick}
            className="flex-1 font-body text-charcoal-900 leading-snug hover:text-camel-600 transition-colors duration-150 text-sm sm:text-base"
            style={{ fontSize: 'var(--card-name-size)' }}
          >
            {name}
          </Link>
          <button
            type="button"
            onClick={handleWishlistToggle}
            className={cn(
              'flex-shrink-0 mt-0.5 transition-colors duration-150',
              isWishlisted ? 'text-rose-400' : 'text-rose-300 hover:text-rose-400'
            )}
            aria-label={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
            aria-pressed={isWishlisted}
          >
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={1.5} />
          </button>
        </div>

        {/* Review stars — always visible */}
        <div className="flex items-center gap-1.5" style={{ justifyContent: 'var(--card-price-justify, flex-start)' }}>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.round(avgRating) ? 'text-yellow-400' : 'text-charcoal-200'}
                fill={i < Math.round(avgRating) ? 'currentColor' : 'none'}
                strokeWidth={i < Math.round(avgRating) ? 0 : 1.5}
              />
            ))}
          </div>
          {reviewCount > 0 && (
            <span className="font-body text-[9px] font-semibold uppercase tracking-[0.12em] text-charcoal-400">
              {reviewCount}
            </span>
          )}
        </div>

        {/* Volume selector */}
        {volumes.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mt-0.5" style={{ justifyContent: 'var(--card-price-justify, flex-start)' }}>
            {volumes.map((vol, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedVolIdx(i) }}
                className={cn(
                  'px-2.5 py-1 text-[10px] font-medium border transition-all duration-150',
                  i === selectedVolIdx
                    ? 'border-charcoal-800 text-charcoal-900 bg-white'
                    : 'border-charcoal-200 text-charcoal-400 bg-white hover:border-charcoal-500'
                )}
              >
                {vol.ml}ml
              </button>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-0.5" style={{ justifyContent: 'var(--card-price-justify, flex-start)' }}>
          <span
            className="font-body font-semibold text-charcoal-900"
            style={{ fontSize: 'var(--card-price-size, 14px)' }}
          >
            {formatPrice(displayPrice)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-charcoal-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* CTA — no icon, price | label */}
        <motion.button
          type="button"
          onClick={handleAddToCart}
          whileTap={{ scale: 0.97 }}
          className={cn(
            'mt-auto pt-3 w-full rounded-full py-2.5 sm:py-3',
            'font-body font-bold uppercase transition-all duration-300',
            'text-[10px] tracking-[0.08em] sm:text-xs sm:tracking-[0.16em]',
            addedToCart
              ? 'bg-charcoal-800 text-white'
              : 'bg-camel-500 text-white hover:bg-camel-600'
          )}
          aria-label={`Add ${name} to cart`}
        >
          {addedToCart
            ? (isAr ? 'تمت الإضافة ✓' : 'Added ✓')
            : `${formatPrice(displayPrice)} | ${isAr ? 'أضف للسلة' : 'Add to Cart'}`}
        </motion.button>
      </div>
    </motion.article>
  )
}
