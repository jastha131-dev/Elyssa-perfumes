'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useLocale } from 'next-intl'
import { useHydrated } from '@/lib/hooks/use-hydrated'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  ShoppingBag,
  Heart,
  Plus,
  Minus,
  ChevronDown,
  Truck,
  RotateCcw,
  Leaf,
  Droplets,
  Star,
} from 'lucide-react'
import { PortableText } from '@portabletext/react'
import { cn, calculateDiscount } from '@/lib/utils'
import { useCurrencyStore } from '@/lib/store/currency-store'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { useRecentlyViewedStore } from '@/lib/store/recently-viewed-store'
import { useCartDrawerStore } from '@/lib/store/cart-drawer-store'
import { ImageGallery } from '@/components/product/ImageGallery'
import { FragranceNotes } from '@/components/product/FragranceNotes'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import { PromoBanner } from '@/components/product/PromoBanner'
import type { PromoBannerData } from '@/components/product/PromoBanner'
import ReviewsQa from '@/components/product/ReviewsQa'
import type { ReviewItem, QuestionItem } from '@/components/product/ReviewsQa'
import type { Product, VolumeOption, ProductReview } from '@/lib/types'
import { PriceText } from '@/components/ui/PriceText'
import { useSiteConfig } from '@/lib/hooks/useSiteConfig'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
  promoBanner?: PromoBannerData
  reviewDocs?: ReviewItem[]
  questions?: QuestionItem[]
}

// ─── PortableText components ──────────────────────────────────────────────────

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-body text-charcoal-600 leading-relaxed mb-3 last:mb-0" style={{ fontSize: 'var(--pdp-body-size, 14px)' }}>
        {children}
      </p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-display text-lg font-medium text-charcoal-900 mb-2">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-body text-sm font-semibold text-charcoal-800 mb-1.5">
        {children}
      </h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-2 border-gold-400 pl-4 italic text-charcoal-500 text-sm my-3">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-charcoal-900">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic text-charcoal-700">{children}</em>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-none space-y-1 my-3">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside space-y-1 my-3 text-charcoal-600 text-sm">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="flex items-start gap-2 text-sm text-charcoal-600">
        <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-gold-500" />
        <span>{children}</span>
      </li>
    ),
  },
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function Breadcrumb({ product }: { product: Product }) {
  const locale = useLocale()
  const isAr = locale === 'ar'
  const productName = isAr ? product.name_ar : product.name_en
  const categoryName = product.category
    ? (isAr ? product.category.name_ar : product.category.name_en)
    : undefined
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 flex-wrap">
      <Link
        href="/"
        className="font-body text-xs text-charcoal-400 transition-colors hover:text-charcoal-700"
      >
        Home
      </Link>
      <ChevronRight className="h-3 w-3 text-charcoal-300 flex-shrink-0" />
      <Link
        href={`/${locale}/products`}
        className="font-body text-xs text-charcoal-400 transition-colors hover:text-charcoal-700"
      >
        {categoryName ?? 'Fragrances'}
      </Link>
      <ChevronRight className="h-3 w-3 text-charcoal-300 flex-shrink-0" />
      <span className="font-body text-xs text-charcoal-700 truncate max-w-[180px]">
        {productName}
      </span>
    </nav>
  )
}

// ─── Accordion Section ────────────────────────────────────────────────────────

interface AccordionSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-charcoal-100">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-gold-500 flex-shrink-0">{icon}</span>
          <span className="font-body text-sm font-medium text-charcoal-800 tracking-wide">
            {title}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-charcoal-400 flex-shrink-0 ml-4"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm text-charcoal-600 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Pairing Section ─────────────────────────────────────────────────────────

function PairingSection({ products }: { products: Product[] }) {
  const locale = useLocale()
  const isAr = locale === 'ar'
  const formatPrice = useCurrencyStore((s) => s.format)
  const items = products.slice(0, 3)

  if (items.length === 0) return null

  return (
    <section className="mt-8">
      <p className="mb-4 font-body text-[10px] uppercase tracking-[0.28em] text-charcoal-400">
        {isAr ? 'يتناسب مع' : 'Pairs Well With'}
      </p>
      <div className="flex flex-col gap-3">
        {items.map((p) => {
          const name = isAr ? p.name_ar : p.name_en
          const price = p.volume?.[0]?.price ?? p.price
          const concentration = p.concentration ?? 'Eau de Parfum'
          return (
            <Link
              key={p._id}
              href={`/${locale}/products/${p.slug}`}
              className="group flex items-center gap-4 border border-charcoal-100 bg-cream-50 px-4 py-3 transition-colors hover:border-charcoal-300 hover:bg-white"
            >
              {/* Thumbnail */}
              <div className="relative h-20 w-[60px] flex-shrink-0 overflow-hidden bg-cream-100">
                {p.images?.[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.images[0].url}
                    alt={p.images[0].alt || name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Droplets className="h-5 w-5 text-charcoal-300" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h4 className="font-display text-sm font-light text-charcoal-900 leading-snug group-hover:text-gold-600 transition-colors truncate">
                  {name}
                </h4>
                <span className="mt-1 inline-block bg-charcoal-100 px-2 py-0.5 font-body text-[9px] uppercase tracking-[0.18em] text-charcoal-500">
                  {concentration}
                </span>
              </div>

              {/* Price */}
              <PriceText amount={price} className="flex-shrink-0 font-body text-sm font-medium text-charcoal-800" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}

// ─── Frequently Bought Together ───────────────────────────────────────────────

function FrequentlyBoughtTogether({
  currentProduct,
  companions,
}: {
  currentProduct: Product
  companions: Product[]
}) {
  const locale = useLocale()
  const isAr = locale === 'ar'
  const formatPrice = useCurrencyStore((s) => s.format)
  const { addItem: addToCart } = useCartStore()
  const { openCart } = useCartDrawerStore()
  const [added, setAdded] = useState(false)

  const items = companions.slice(0, 3)
  const allProducts = [currentProduct, ...items]

  const combinedPrice = allProducts.reduce((sum, p) => {
    const vol = p.volume?.[0]
    return sum + (vol?.price ?? p.price)
  }, 0)

  const handleAddAll = useCallback(() => {
    allProducts.forEach((p) => {
      const vol = p.volume?.[0] ?? { ml: 100, price: p.price }
      addToCart(p, 1, vol)
    })
    openCart()
    setAdded(true)
    const timer = setTimeout(() => setAdded(false), 2500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProducts, addToCart, openCart])

  if (items.length === 0) return null

  return (
    <section className="py-12 border-t border-charcoal-100">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="mb-1.5 font-body text-[10px] uppercase tracking-[0.35em] text-charcoal-400">
          {isAr ? 'يُشترى معه عادةً' : 'Frequently Bought Together'}
        </p>
        <h2 className="font-display text-2xl font-light text-charcoal-900">
          {isAr ? 'كوّن طقمك المثالي' : 'Complete the Collection'}
        </h2>
        <div className="mt-3 h-px w-10 bg-charcoal-200" />
      </motion.div>

      {/* Product row */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        {allProducts.map((p, idx) => {
          const name = isAr ? p.name_ar : p.name_en
          const price = p.volume?.[0]?.price ?? p.price
          return (
            <div key={p._id} className="flex flex-shrink-0 items-center gap-3">
              <div className="flex-shrink-0 w-[120px] text-center">
                <Link href={`/${locale}/products/${p.slug}`} className="group block">
                  <div className="relative mx-auto h-[150px] w-[100px] overflow-hidden bg-cream-50 border border-charcoal-100">
                    {p.images?.[0]?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.images[0].url}
                        alt={p.images[0].alt || name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Droplets className="h-6 w-6 text-charcoal-300" />
                      </div>
                    )}
                    {idx === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-charcoal-900/80 py-1">
                        <p className="font-body text-[9px] uppercase tracking-[0.15em] text-white text-center">
                          {isAr ? 'هذا المنتج' : 'This item'}
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 font-display text-xs font-light text-charcoal-800 leading-snug truncate group-hover:text-gold-600 transition-colors">
                    {name}
                  </p>
                  <PriceText amount={price} className="mt-0.5 font-body text-xs font-medium text-charcoal-700" />
                </Link>
              </div>
              {idx < allProducts.length - 1 && (
                <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-charcoal-200 bg-white">
                  <Plus className="h-3 w-3 text-charcoal-400" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Combined price + CTA */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <div>
          <p className="font-body text-xs text-charcoal-400 uppercase tracking-[0.18em]">
            {isAr ? 'المجموع' : 'Combined Price'}
          </p>
          <PriceText amount={combinedPrice} className="font-display text-2xl font-light text-charcoal-900" />
        </div>
        <motion.button
          type="button"
          onClick={handleAddAll}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'flex items-center justify-center gap-2 px-8 py-3.5',
            'font-body text-sm font-medium uppercase tracking-[0.18em]',
            'transition-all duration-300',
            added
              ? 'bg-charcoal-900 text-white'
              : 'bg-gold-500 text-white hover:bg-gold-600'
          )}
        >
          <ShoppingBag className="h-4 w-4 flex-shrink-0" />
          {added
            ? (isAr ? 'تمت الإضافة ✓' : 'Added to Bag ✓')
            : (isAr ? 'إضافة الكل إلى الحقيبة' : 'Add All to Bag')}
        </motion.button>
      </div>
    </section>
  )
}

// ─── Reviews Section ──────────────────────────────────────────────────────────

function ReviewsSection({ reviews }: { reviews: ProductReview[] }) {
  const locale = useLocale()
  const isAr = locale === 'ar'

  if (reviews.length === 0) return null

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const roundedAvg = Math.round(avgRating * 10) / 10

  function formatReviewDate(dateStr?: string): string {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString(isAr ? 'ar-AE' : 'en-US', {
      month: 'long',
      year: 'numeric',
    })
  }

  function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={i < Math.round(rating) ? 'text-gold-500' : 'text-charcoal-200'}
            fill={i < Math.round(rating) ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    )
  }

  return (
    <section className="py-12 border-t border-charcoal-100">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1.5 font-body text-[10px] uppercase tracking-[0.35em] text-charcoal-400">
              {isAr ? 'آراء العملاء' : 'Customer Reviews'}
            </p>
            <h2 className="font-display text-2xl font-light text-charcoal-900">
              {isAr ? 'ما يقوله العملاء' : 'What Our Customers Say'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <StarRow rating={roundedAvg} size={16} />
            <span className="font-display text-xl font-light text-charcoal-900">
              {roundedAvg}
            </span>
            <span className="font-body text-xs text-charcoal-400">
              ({reviews.length} {isAr ? 'تقييم' : 'reviews'})
            </span>
          </div>
        </div>
        <div className="mt-3 h-px w-10 bg-charcoal-200" />
      </motion.div>

      {/* Review cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, i) => {
          const reviewText = isAr && review.review_ar ? review.review_ar : review.review_en
          return (
            <motion.div
              key={review._key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-3 border border-charcoal-100 bg-cream-50 px-5 py-4"
            >
              {/* Stars */}
              <StarRow rating={review.rating} />

              {/* Review text */}
              <p className="font-body text-sm text-charcoal-600 leading-relaxed flex-1">
                &ldquo;{reviewText}&rdquo;
              </p>

              {/* Reviewer info */}
              <div className="flex items-start justify-between gap-2 pt-1 border-t border-charcoal-100">
                <div>
                  <p className="font-body text-xs font-semibold text-charcoal-800">
                    {review.name}
                  </p>
                  {review.location && (
                    <p className="font-body text-[10px] text-charcoal-400 mt-0.5">
                      {review.location}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 bg-charcoal-900 px-1.5 py-0.5 font-body text-[9px] uppercase tracking-[0.15em] text-gold-400">
                      {isAr ? 'شراء موثق' : 'Verified'}
                    </span>
                  )}
                  {review.date && (
                    <p className="font-body text-[10px] text-charcoal-400">
                      {formatReviewDate(review.date)}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

// ─── Sticky Add-to-Cart Bar ───────────────────────────────────────────────────

interface StickyBarProps {
  productName: string
  selectedVolume: VolumeOption
  onAddToCart: () => void
  addedToCart: boolean
}

function StickyBar({
  productName,
  selectedVolume,
  onAddToCart,
  addedToCart,
}: StickyBarProps) {
  const locale = useLocale()
  const isAr = locale === 'ar'
  const formatPrice = useCurrencyStore((s) => s.format)

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 lg:hidden',
        'border-t border-charcoal-200 bg-white/95 backdrop-blur-sm shadow-lg',
        'px-4 py-3',
      )}
    >
      <div className="flex items-center gap-3">
        {/* Product info */}
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-light text-charcoal-900 truncate leading-snug">
            {productName}
          </p>
          <p className="font-body text-[11px] text-charcoal-400">
            {selectedVolume.ml}ml &middot; <PriceText amount={selectedVolume.price} />
          </p>
        </div>

        {/* CTA */}
        <motion.button
          type="button"
          onClick={onAddToCart}
          whileTap={{ scale: 0.97 }}
          className={cn(
            'flex flex-shrink-0 items-center gap-2 rounded px-5 py-3',
            'font-body text-xs font-medium uppercase tracking-[0.16em]',
            'transition-all duration-300',
            addedToCart
              ? 'bg-charcoal-700 text-white'
              : 'bg-camel-500 text-white hover:bg-camel-600'
          )}
        >
          <ShoppingBag className="h-3.5 w-3.5 flex-shrink-0" />
          {addedToCart
            ? (isAr ? 'تمت الإضافة ✓' : 'Added ✓')
            : (isAr ? 'أضف للحقيبة' : 'Add to Bag')}
        </motion.button>
      </div>
    </div>
  )
}

// ─── Recently Viewed ──────────────────────────────────────────────────────────

function RecentlyViewed({ excludeId }: { excludeId: string }) {
  const locale = useLocale()
  const isAr = locale === 'ar'
  const formatPrice = useCurrencyStore((s) => s.format)
  const { products } = useRecentlyViewedStore()
  const visible = products.filter((p) => p._id !== excludeId).slice(0, 4)

  if (visible.length === 0) return null

  return (
    <section className="py-16 border-t border-charcoal-100">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <p className="mb-2 font-body text-[10px] uppercase tracking-[0.35em] text-charcoal-400">
          {isAr ? 'شاهدته مؤخراً' : 'Recently Viewed'}
        </p>
        <h2 className="font-display text-3xl font-light text-charcoal-900">
          {isAr ? 'تابع الاستكشاف' : 'Continue Exploring'}
        </h2>
        <div className="mx-auto mt-4 h-px w-12 bg-charcoal-200" aria-hidden="true" />
      </motion.div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {visible.map((product, i) => {
          const displayPrice = product.volume?.[0]?.price ?? product.price
          const rvName = isAr ? product.name_ar : product.name_en
          const rvCategoryName = product.category
            ? (isAr ? product.category.name_ar : product.category.name_en)
            : undefined
          return (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group"
            >
              <Link href={`/${locale}/products/${product.slug}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-cream-50">
                  {product.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0].url}
                      alt={product.images[0].alt || rvName}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-charcoal-100 to-charcoal-200 flex items-center justify-center">
                      <Droplets className="h-8 w-8 text-charcoal-300" />
                    </div>
                  )}
                </div>
                <div className="mt-3 px-0.5">
                  {rvCategoryName && (
                    <p className="font-body text-[10px] uppercase tracking-[0.22em] text-gold-500 mb-0.5">
                      {rvCategoryName}
                    </p>
                  )}
                  <h3 className="font-display text-sm font-light text-charcoal-900 transition-colors group-hover:text-gold-600 leading-snug">
                    {rvName}
                  </h3>
                  <PriceText amount={displayPrice} className="mt-1 font-body text-sm font-medium text-charcoal-800" />
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

// ─── Main Client Component ────────────────────────────────────────────────────

export function ProductDetailClient({
  product,
  relatedProducts,
  promoBanner,
  reviewDocs = [],
  questions = [],
}: ProductDetailClientProps) {
  const locale = useLocale()
  const isAr = locale === 'ar'
  const productName = isAr ? product.name_ar : product.name_en

  // Merge manually-curated reviews (product.reviews) with user-submitted review docs
  const mergedReviews: ReviewItem[] = [
    ...reviewDocs,
    ...(product.reviews ?? []).map((r) => ({
      _id: r._key,
      name: r.name,
      location: r.location,
      rating: r.rating,
      body: isAr ? (r.review_ar || r.review_en) : r.review_en,
      verified: r.verified,
      createdAt: r.date,
    })),
  ]
  const categoryName = product.category
    ? (isAr ? product.category.name_ar : product.category.name_en)
    : undefined
  const description = isAr ? product.description_ar : product.description_en
  const story = isAr ? product.story_ar : product.story_en
  const topNotes = isAr ? product.topNotes_ar : product.topNotes_en
  const middleNotes = isAr ? product.middleNotes_ar : product.middleNotes_en
  const baseNotes = isAr ? product.baseNotes_ar : product.baseNotes_en

  const formatPrice = useCurrencyStore((s) => s.format)
  const { addItem: addToCart } = useCartStore()
  const { openCart } = useCartDrawerStore()
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const { addProduct: addToRecentlyViewed } = useRecentlyViewedStore()
  const siteConfig = useSiteConfig()

  // Volume state — default to first volume option
  const volumes = product.volume ?? []
  const [selectedVolume, setSelectedVolume] = useState<VolumeOption>(
    volumes[0] ?? { ml: 100, price: product.price }
  )
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Sticky bar visibility
  const [stickyVisible, setStickyVisible] = useState(false)
  const mainCtaRef = useRef<HTMLButtonElement>(null)

  const hydrated = useHydrated()
  const wishlisted = hydrated && isInWishlist(product._id)

  // Add to recently viewed once on mount
  useEffect(() => {
    addToRecentlyViewed(product)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product._id])

  // IntersectionObserver for sticky bar
  useEffect(() => {
    const btn = mainCtaRef.current
    if (!btn) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStickyVisible(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '0px' }
    )

    observer.observe(btn)
    return () => observer.disconnect()
  }, [])

  const handleAddToCart = useCallback(() => {
    addToCart(product, quantity, selectedVolume)
    openCart()
    setAddedToCart(true)
    const timer = setTimeout(() => setAddedToCart(false), 2500)
    return () => clearTimeout(timer)
  }, [product, quantity, selectedVolume, addToCart, openCart])

  const handleWishlist = useCallback(() => {
    toggleWishlist(product)
  }, [product, toggleWishlist])

  const displayPrice = selectedVolume?.price ?? product.price
  const discount = product.compareAtPrice
    ? calculateDiscount(displayPrice, product.compareAtPrice)
    : 0

  const safeImages = (product.images ?? []).filter((img) => img?.url)

  // Shipping text (locale-aware with PortableText fallback)
  const shippingText = isAr ? product.shippingText_ar : product.shippingText_en

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
      style={{ paddingTop: 'var(--header-h, 72px)' }}
    >
      {/* ── Top promo strip (JUST LANDED) ───────────────────────────────── */}
      {promoBanner?.isEnabled && promoBanner?.showTopStrip !== false && (() => {
        const BG_MAP: Record<string, string> = { camel: '#D4A96A', black: '#1a1a1a', white: '#ffffff', gold: '#C9A84C', rose: '#C0476A' }
        const stripBg = promoBanner.topStripBg === 'custom' ? (promoBanner.topStripBgCustom || '#D4A96A') : BG_MAP[promoBanner.topStripBg || 'camel'] || '#D4A96A'
        const stripText = promoBanner.topStripTextColor === 'white' ? '#ffffff' : promoBanner.topStripTextColor === 'gold' ? '#C9A84C' : '#1a1a1a'
        return (
        <div className="px-4 py-2 text-center" style={{ backgroundColor: stripBg }}>
          <p className="font-headline text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: stripText }}>
            {isAr ? 'وصل حديثاً' : 'Just Landed'}
            {' · '}
            {(isAr ? promoBanner.headline_ar : promoBanner.headline_en) || (isAr ? 'هديتنا الأكثر تميّزاً' : 'Our Most Exclusive Gift')}
          </p>
        </div>
        )
      })()}

      {/* ── Sticky Add-to-Cart Bar ───────────────────────────────────────── */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            key="sticky-bar"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <StickyBar
              productName={productName}
              selectedVolume={selectedVolume}
              onAddToCart={handleAddToCart}
              addedToCart={addedToCart}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Product Section ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb bar */}
        <div className="py-3 border-b border-charcoal-100">
          <Breadcrumb product={product} />
        </div>

        <div className="lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 xl:gap-24 pt-6 pb-10">

          {/* ── Left — Image Gallery ──────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {safeImages.length > 0 ? (
              <ImageGallery images={safeImages} hideThumbnails={product.hideThumbnails} />
            ) : (
              <div className="aspect-[3/4] w-full bg-gradient-to-br from-cream-100 to-cream-200 flex flex-col items-center justify-center gap-4">
                <div className="h-px w-16 bg-gold-300/50" />
                <span className="font-display text-8xl font-light italic text-charcoal-200 select-none">
                  {productName.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                </span>
                <div className="h-px w-16 bg-gold-300/50" />
              </div>
            )}
          </div>

          {/* ── Right — Product Details ───────────────────────────────────── */}
          <div className="mt-10 lg:mt-0 flex flex-col">

            {/* Top badge + wishlist row */}
            <div className="flex items-start justify-between mb-2">
              {(product.new || product.bestSeller || product.badgeText_en) ? (
                <span className={cn(
                  'py-1.5 pl-3 pr-7 font-body text-[9px] font-medium uppercase tracking-[0.22em] text-white [clip-path:polygon(0_0,100%_0,calc(100%-9px)_50%,100%_100%,0_100%)]',
                  { gold: 'bg-camel-500', black: 'bg-charcoal-900', red: 'bg-red-500', green: 'bg-green-600', blue: 'bg-blue-600', pink: 'bg-pink-500' }[product.badgeColor || 'gold'] || 'bg-camel-500'
                )}>
                  {(isAr ? product.badgeText_ar : product.badgeText_en) || (product.new ? (isAr ? 'جديد · إصدار محدود' : 'New & Limited Edition') : (isAr ? 'الأكثر مبيعاً' : 'Best Seller'))}
                </span>
              ) : <div />}
              <motion.button
                type="button"
                onClick={handleWishlist}
                whileTap={{ scale: 0.92 }}
                className={cn(
                  'flex flex-shrink-0 items-center justify-center p-0.5 transition-colors duration-200',
                  wishlisted ? 'text-camel-500' : 'text-charcoal-300 hover:text-charcoal-600'
                )}
                aria-label={wishlisted ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
                aria-pressed={wishlisted}
              >
                <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} fill={wishlisted ? 'currentColor' : 'none'} />
              </motion.button>
            </div>

            {/* Category + status row */}
            <div className="flex items-center gap-3 flex-wrap mb-4">
              {categoryName && (
                <Link
                  href={`/${locale}/products?category=${product.category.slug}`}
                  className="font-body text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-500 hover:text-gold-600 transition-colors"
                >
                  {categoryName}
                </Link>
              )}
              {product.fragranceFamily && (
                <>
                  <span className="text-charcoal-200">·</span>
                  <span className="font-body text-[10px] uppercase tracking-[0.22em] text-charcoal-400">
                    {product.fragranceFamily}
                  </span>
                </>
              )}
              {product.new && (
                <span className="ml-auto bg-gold-500 px-2.5 py-0.5 font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
                  New
                </span>
              )}
            </div>

            {/* Product name */}
            <h1 className="font-display text-[26px] font-black text-charcoal-900 leading-[1.08] tracking-tight md:text-[32px]">
              {productName}
            </h1>
            <p className="mt-2 font-body text-xs tracking-[0.22em] uppercase text-charcoal-400">
              {product.concentration ?? 'Eau de Parfum'}
            </p>

            {/* Rating + reviews count (real-time: manual + submitted) */}
            {mergedReviews.length > 0 && (() => {
              const avg = mergedReviews.reduce((s, r) => s + (r.rating || 0), 0) / mergedReviews.length
              return (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className={cn('h-3.5 w-3.5', i <= Math.round(avg) ? 'fill-gold-500 text-gold-500' : 'fill-charcoal-200 text-charcoal-200')} />
                    ))}
                  </div>
                  <span className="font-body text-xs text-charcoal-500">{mergedReviews.length} {isAr ? 'تقييم' : 'Reviews'}</span>
                </div>
              )
            })()}

            {/* Gold accent divider */}
            <div className="mt-5 flex items-center gap-3">
              <div className="h-px w-8 bg-gold-400" />
              <div className="h-px flex-1 bg-charcoal-100" />
            </div>

            {/* Description */}
            {description && (
              <p className="mt-5 font-body text-charcoal-600 leading-relaxed" style={{ fontSize: 'var(--pdp-desc-size, 15px)' }}>
                {description}
              </p>
            )}

            {/* Price */}
            <div className="mt-6 flex items-end gap-3 flex-wrap">
              <PriceText amount={displayPrice} className="font-display text-[26px] font-extrabold text-charcoal-900" />
              {product.compareAtPrice && product.compareAtPrice > displayPrice && (
                <>
                  <PriceText amount={product.compareAtPrice} className="font-body text-base text-charcoal-400 line-through mb-1" />
                  {discount > 0 && (
                    <span className="mb-1 bg-red-500 px-2 py-0.5 font-body text-[11px] font-semibold text-white">
                      Save {discount}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Promo banner */}
            {promoBanner && <PromoBanner data={promoBanner} />}

            {/* Volume selector */}
            {volumes.length > 0 && (
              <div className="mt-3">
                <p className="mb-3 font-body text-[10px] uppercase tracking-[0.22em] text-charcoal-500">
                  {isAr ? 'الحجم' : 'Size'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {volumes.map((vol) => {
                    const isSelected = selectedVolume?.ml === vol.ml
                    return (
                      <button
                        key={vol.ml}
                        type="button"
                        onClick={() => setSelectedVolume(vol)}
                        className={cn(
                          'flex items-center justify-center px-5 py-3 font-body transition-all duration-200 border',
                          isSelected
                            ? 'bg-charcoal-900 border-charcoal-900 text-white'
                            : 'bg-white border-charcoal-200 text-charcoal-700 hover:border-charcoal-500'
                        )}
                      >
                        <span className="text-sm font-medium">{vol.ml}ml</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity + CTA — single inline row */}
            <div className="mt-4 flex items-stretch gap-2">
              {/* Stepper */}
              <div className="inline-flex flex-shrink-0 items-center rounded-full border border-charcoal-200">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} className="flex h-11 w-9 items-center justify-center text-charcoal-500 transition-colors hover:bg-charcoal-50 hover:text-charcoal-900 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Decrease quantity"><Minus className="h-3.5 w-3.5" /></button>
                <span className="flex h-11 w-10 items-center justify-center border-charcoal-200 font-body text-sm font-medium text-charcoal-900" aria-live="polite">{quantity}</span>
                <button type="button" onClick={() => setQuantity((q) => Math.min(10, q + 1))} disabled={quantity >= 10} className="flex h-11 w-9 items-center justify-center text-charcoal-500 transition-colors hover:bg-charcoal-50 hover:text-charcoal-900 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Increase quantity"><Plus className="h-3.5 w-3.5" /></button>
              </div>
              {/* Add to bag */}
              <motion.button
                ref={mainCtaRef}
                type="button"
                onClick={handleAddToCart}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex flex-1 min-w-0 items-center justify-center gap-1.5 overflow-hidden sm:gap-2.5',
                  'min-h-[52px] rounded-full py-4 px-4 font-body text-[13px] font-semibold uppercase tracking-[0.06em] whitespace-nowrap sm:px-6 sm:text-sm sm:tracking-[0.16em]',
                  'transition-all duration-300',
                  addedToCart ? 'bg-charcoal-700 text-white' : 'hover:opacity-90'
                )}
                style={addedToCart ? undefined : { backgroundColor: 'var(--atc-bg, #C8A96E)', color: 'var(--atc-text, #000000)' }}
              >
                {addedToCart ? (
                  <>{isAr ? 'تمت الإضافة ✓' : 'Added ✓'}</>
                ) : (
                  <>
                    <PriceText amount={displayPrice} className="min-w-0 truncate" />
                    <span className="opacity-50">|</span>
                    <span className="flex-shrink-0">{isAr ? siteConfig.atcLabel_ar : siteConfig.atcLabel_en}</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Secure checkout + payment methods */}
            <div className="mt-3 flex flex-wrap items-center gap-2.5 border border-charcoal-100 bg-cream-50/50 px-4 py-2.5">
              <span className="font-body text-[11px] text-charcoal-500">{isAr ? 'دفع آمن عند الإتمام' : 'Available at checkout'}</span>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="flex h-6 items-center rounded-md bg-black px-2 font-body text-[10px] font-semibold text-white">Pay</span>
                <span className="flex h-6 items-center rounded-md border border-charcoal-200 bg-white px-2 font-body text-[10px] font-semibold text-charcoal-800">G Pay</span>
                <span className="flex h-6 items-center rounded-md bg-[#003087] px-2 font-body text-[10px] font-bold italic text-white">PayPal</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#00D632] font-body text-[13px] font-bold text-white">$</span>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  aria-label="View payment options"
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-charcoal-300 font-body text-[9px] text-charcoal-400 transition-colors hover:border-charcoal-500 hover:text-charcoal-600 focus:outline-none"
                >
                  i
                </button>
              </div>
            </div>

            {/* Trust strip */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                { icon: Truck, label: isAr ? 'شحن مجاني' : 'Free shipping', sub: isAr ? 'للطلبات فوق $150' : 'Orders over $150' },
                { icon: RotateCcw, label: isAr ? 'إرجاع 30 يوم' : '30-day returns', sub: isAr ? 'بدون متاعب' : 'Hassle-free' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3 bg-cream-50 border border-cream-200 px-4 py-3">
                  <Icon className="h-4 w-4 text-gold-500 flex-shrink-0" />
                  <div>
                    <p className="font-body text-xs font-semibold text-charcoal-800">{label}</p>
                    <p className="font-body text-[10px] text-charcoal-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Gold divider */}
            <div className="mt-8 h-px bg-gradient-to-r from-gold-300/60 via-gold-200/30 to-transparent" />

            {/* Story */}
            {story && story.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 font-body text-[10px] uppercase tracking-[0.28em] text-charcoal-400">
                  {isAr ? 'القصة' : 'The Story'}
                </p>
                <PortableText value={story} components={portableTextComponents} />
              </div>
            )}

            {/* Fragrance Notes */}
            <div className="mt-6">
              <FragranceNotes
                topNotes={topNotes ?? []}
                middleNotes={middleNotes ?? []}
                baseNotes={baseNotes ?? []}
                intensity={product.intensity}
                sillage={product.sillage}
                longevity={product.longevity}
              />
            </div>

            {/* Pairing / Pairs Well With */}
            {product.layeringProducts && product.layeringProducts.length > 0 && (
              <PairingSection products={product.layeringProducts} />
            )}

            {/* Accordions */}
            <div className="mt-6 border-t border-charcoal-100">
              <AccordionSection
                title={isAr ? 'كيفية الاستخدام' : 'How to Apply'}
                icon={<Droplets className="h-4 w-4" />}
              >
                <div className="space-y-2.5">
                  <p>{isAr
                    ? 'ضعيه على نقاط النبض — الرسغين الداخليين، الرقبة، خلف الأذنين، وداخل المرفقين. تولّد هذه المناطق حرارة تنشر العطر وتضخّمه.'
                    : 'Apply to pulse points — inner wrists, neck, behind ears, and inside elbows. These areas emit heat which diffuses and amplifies the scent.'}</p>
                  <p>{isAr
                    ? 'امسك الزجاجة على بعد 15–20 سم من الجلد ورشّ 2–3 مرات. تجنّب الفرك — فهو يكسر جزيئات العطر ويقلّل ثباته.'
                    : 'Hold the bottle 15–20cm from skin and spray 2–3 times. Avoid rubbing — this breaks down scent molecules and reduces longevity.'}</p>
                  <p>{isAr
                    ? 'ضعيه على بشرة مرطّبة حديثاً للحصول على أفضل النتائج. يثبت العطر بشكل أفضل على البشرة الرطبة.'
                    : 'Apply to freshly moisturised skin for best results. Fragrance adheres better to hydrated skin.'}</p>
                </div>
              </AccordionSection>

              <AccordionSection
                title={isAr ? 'الشحن والإرجاع' : 'Shipping & Returns'}
                icon={<Truck className="h-4 w-4" />}
              >
                {shippingText && shippingText.length > 0 ? (
                  <PortableText value={shippingText} components={portableTextComponents} />
                ) : (
                  <div className="space-y-2.5">
                    <p>
                      <strong className="font-semibold text-charcoal-800">
                        {isAr ? 'شحن مجاني' : 'Complimentary shipping'}
                      </strong>{' '}
                      {isAr
                        ? 'على جميع الطلبات التي تزيد عن $150. التوصيل الاعتيادي 3–5 أيام عمل. التوصيل السريع 1–2 يوم متاح عند الدفع.'
                        : 'on all orders over $150. Standard delivery 3–5 business days. Express 1–2 days available at checkout.'}
                    </p>
                    <p>
                      {isAr
                        ? 'يُقبل الإرجاع على المنتجات غير المفتوحة وغير المستخدمة خلال 30 يوماً. لا يمكن إرجاع المنتجات المفتوحة إلا إذا كانت معيبة.'
                        : 'Returns accepted on unopened, unused items within 30 days. Opened items cannot be returned unless faulty.'}
                    </p>
                    <p>
                      {isAr ? 'لبدء الإرجاع:' : 'To initiate a return:'}{' '}
                      <span className="text-gold-600">support@luxeparfum.com</span>
                    </p>
                  </div>
                )}
              </AccordionSection>

              {product.ingredients && (
                <AccordionSection
                  title={isAr ? 'المكوّنات' : 'Ingredients'}
                  icon={<Leaf className="h-4 w-4" />}
                >
                  <p className="font-body text-sm text-charcoal-600 leading-relaxed">
                    {product.ingredients}
                  </p>
                </AccordionSection>
              )}
            </div>

            {/* Sustainability */}
            <div className="mt-4 flex items-start gap-3 bg-gradient-to-r from-cream-50 to-white border border-cream-200 px-5 py-4">
              <Leaf className="h-4 w-4 text-gold-500 flex-shrink-0 mt-0.5" />
              <p className="font-body text-xs text-charcoal-600 leading-relaxed">
                <span className="font-semibold text-charcoal-800">
                  {isAr ? 'مُصنَّع باستدامة.' : 'Sustainably crafted.'}
                </span>{' '}
                {isAr
                  ? 'تغليف معتمد من FSC، زجاجات قابلة لإعادة الملء، شحن واعٍ بالبيئة. كل عطر نصنعه خطوة نحو بصمة أصغر.'
                  : 'FSC-certified packaging, refillable bottles, carbon-conscious shipping. Every fragrance we make is a step toward a smaller footprint.'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Below-fold ───────────────────────────────────────────────────── */}
        <div className="mt-6 border-t border-charcoal-100 pt-6">
          {product.frequentlyBoughtTogether && product.frequentlyBoughtTogether.length > 0 && (
            <FrequentlyBoughtTogether
              currentProduct={product}
              companions={product.frequentlyBoughtTogether}
            />
          )}
          <RelatedProducts products={relatedProducts} />
          <RecentlyViewed excludeId={product._id} />
        </div>
      </div>

      {/* ── Reviews & Q&A module (dynamic, toggle via product "Hide Reviews") ── */}
      {!product.hideReviews && (
        <ReviewsQa
          productId={product._id}
          productName={productName}
          initialReviews={mergedReviews}
          initialQuestions={questions}
        />
      )}

      {/* Bottom padding on mobile to prevent content hidden behind sticky bar */}
      <div className="h-20 lg:hidden" aria-hidden="true" />

      {/* Payment Options Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <>
            <motion.div
              key="payment-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-charcoal-900/50 backdrop-blur-sm"
              onClick={() => setShowPaymentModal(false)}
              aria-hidden="true"
            />
            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              key="payment-modal"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Payment options at checkout"
              className="pointer-events-auto w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            >
              {/* Header */}
              <div className="mb-5 flex items-start justify-between">
                <h2 className="font-display text-base font-semibold uppercase tracking-[0.15em] text-charcoal-900">
                  Payment Options at Checkout
                </h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  aria-label="Close"
                  className="ml-3 flex-shrink-0 rounded-full p-1 text-charcoal-400 transition-colors hover:bg-charcoal-100 hover:text-charcoal-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Section: Express & Digital Wallets */}
              <div className="mb-4">
                <p className="mb-2.5 font-body text-[10px] uppercase tracking-[0.2em] text-charcoal-400">Express &amp; Digital Wallets</p>
                <div className="flex flex-wrap gap-2">
                  <span className="flex h-8 items-center rounded-lg bg-black px-3 font-body text-[11px] font-semibold text-white">
                    Apple Pay
                  </span>
                  <span className="flex h-8 items-center rounded-lg border border-charcoal-200 bg-white px-3 font-body text-[11px] font-semibold text-charcoal-800">
                    G Pay
                  </span>
                  <span className="flex h-8 items-center rounded-lg bg-[#003087] px-3 font-body text-[11px] font-bold italic text-white">
                    PayPal
                  </span>
                  <span className="flex h-8 items-center rounded-lg bg-[#00D632] px-3 font-body text-[11px] font-bold text-white">
                    Cash App
                  </span>
                </div>
              </div>

              <div className="mb-4 h-px bg-charcoal-100" />

              {/* Section: Shop Now Pay Later */}
              <div className="mb-4">
                <p className="mb-2.5 font-body text-[10px] uppercase tracking-[0.2em] text-charcoal-400">Shop Now, Pay Later</p>
                <div className="flex flex-wrap gap-2">
                  <span className="flex h-8 items-center rounded-lg bg-[#FFB3C7] px-3 font-body text-[11px] font-bold text-[#17120E]">
                    Klarna
                  </span>
                  <span className="flex h-8 items-center rounded-lg bg-[#B2FCE4] px-3 font-body text-[11px] font-bold text-[#000]">
                    Afterpay
                  </span>
                  <span className="flex h-8 items-center rounded-lg border border-charcoal-200 bg-white px-3 font-body text-[11px] font-semibold text-charcoal-800">
                    Affirm
                  </span>
                </div>
                <p className="mt-2 font-body text-[10px] text-charcoal-400">Split into 4 interest-free installments at checkout.</p>
              </div>

              <div className="mb-4 h-px bg-charcoal-100" />

              {/* Section: Card */}
              <div>
                <p className="mb-2.5 font-body text-[10px] uppercase tracking-[0.2em] text-charcoal-400">Pay with Credit or Debit Card</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'VISA', bg: '#1A1F71', color: '#fff' },
                    { label: 'MC', bg: '#EB001B', color: '#fff' },
                    { label: 'AMEX', bg: '#007BC1', color: '#fff' },
                  ].map(({ label, bg, color }) => (
                    <span
                      key={label}
                      className="flex h-8 items-center rounded-lg px-3 font-body text-[11px] font-bold tracking-wide"
                      style={{ background: bg, color }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <p className="mt-2 font-body text-[10px] text-charcoal-400">All major cards accepted. Payments are encrypted and secure.</p>
              </div>
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
