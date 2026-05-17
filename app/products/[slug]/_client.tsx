'use client'

import { useEffect, useState, useCallback } from 'react'
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
} from 'lucide-react'
import { PortableText } from '@portabletext/react'
import { cn, formatPrice, calculateDiscount } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { useRecentlyViewedStore } from '@/lib/store/recently-viewed-store'
import { useCartDrawerStore } from '@/lib/store/cart-drawer-store'
import { ImageGallery } from '@/components/product/ImageGallery'
import { FragranceNotes } from '@/components/product/FragranceNotes'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import type { Product, VolumeOption } from '@/lib/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

// ─── PortableText components ──────────────────────────────────────────────────

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-body text-sm text-charcoal-600 leading-relaxed mb-3 last:mb-0">
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
        href="/products"
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

// ─── Recently Viewed ──────────────────────────────────────────────────────────

function RecentlyViewed({ excludeId }: { excludeId: string }) {
  const locale = useLocale()
  const isAr = locale === 'ar'
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
          Recently Viewed
        </p>
        <h2 className="font-display text-3xl font-light text-charcoal-900">
          Continue Exploring
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
              <Link href={`/products/${product.slug}`} className="block">
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
                  <p className="mt-1 font-body text-sm font-medium text-charcoal-800">
                    {formatPrice(displayPrice)}
                  </p>
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
}: ProductDetailClientProps) {
  const locale = useLocale()
  const isAr = locale === 'ar'
  const productName = isAr ? product.name_ar : product.name_en
  const categoryName = product.category
    ? (isAr ? product.category.name_ar : product.category.name_en)
    : undefined
  const description = isAr ? product.description_ar : product.description_en
  const story = isAr ? product.story_ar : product.story_en
  const topNotes = isAr ? product.topNotes_ar : product.topNotes_en
  const middleNotes = isAr ? product.middleNotes_ar : product.middleNotes_en
  const baseNotes = isAr ? product.baseNotes_ar : product.baseNotes_en

  const { addItem: addToCart } = useCartStore()
  const { openCart } = useCartDrawerStore()
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const { addProduct: addToRecentlyViewed } = useRecentlyViewedStore()

  // Volume state — default to first volume option
  const volumes = product.volume ?? []
  const [selectedVolume, setSelectedVolume] = useState<VolumeOption>(
    volumes[0] ?? { ml: 100, price: product.price }
  )
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const hydrated = useHydrated()
  const wishlisted = hydrated && isInWishlist(product._id)

  // Add to recently viewed once on mount
  useEffect(() => {
    addToRecentlyViewed(product)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product._id])

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white pt-20"
    >
      {/* ── Main Product Section ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb bar */}
        <div className="py-5 border-b border-charcoal-100">
          <Breadcrumb product={product} />
        </div>

        <div className="lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 xl:gap-24 py-10">

          {/* ── Left — Image Gallery ──────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {safeImages.length > 0 ? (
              <ImageGallery images={safeImages} />
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

            {/* Category + status row */}
            <div className="flex items-center gap-3 flex-wrap mb-4">
              {product.category?.name && (
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="font-body text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-500 hover:text-gold-600 transition-colors"
                >
                  {product.category.name}
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
              {product.bestSeller && !product.new && (
                <span className="ml-auto bg-charcoal-900 px-2.5 py-0.5 font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                  Best Seller
                </span>
              )}
            </div>

            {/* Product name */}
            <h1 className="font-display text-4xl font-light text-charcoal-900 leading-[1.1] tracking-tight md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-2 font-body text-xs tracking-[0.22em] uppercase text-charcoal-400">
              Eau de Parfum
            </p>

            {/* Gold accent divider */}
            <div className="mt-5 flex items-center gap-3">
              <div className="h-px w-8 bg-gold-400" />
              <div className="h-px flex-1 bg-charcoal-100" />
            </div>

            {/* Description */}
            {product.description && (
              <p className="mt-5 font-body text-[15px] text-charcoal-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Price */}
            <div className="mt-6 flex items-end gap-3 flex-wrap">
              <span className="font-display text-4xl font-light text-charcoal-900">
                {formatPrice(displayPrice)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > displayPrice && (
                <>
                  <span className="font-body text-base text-charcoal-400 line-through mb-1">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  {discount > 0 && (
                    <span className="mb-1 bg-red-500 px-2 py-0.5 font-body text-[11px] font-semibold text-white">
                      Save {discount}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Volume selector */}
            {volumes.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 font-body text-[10px] uppercase tracking-[0.22em] text-charcoal-500">
                  Size
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
                          'flex flex-col items-center px-5 py-3 font-body transition-all duration-200 border',
                          isSelected
                            ? 'bg-charcoal-900 border-charcoal-900 text-white'
                            : 'bg-white border-charcoal-200 text-charcoal-700 hover:border-charcoal-500'
                        )}
                      >
                        <span className="text-sm font-medium">{vol.ml}ml</span>
                        <span className={cn('text-[11px] mt-0.5', isSelected ? 'text-charcoal-400' : 'text-charcoal-400')}>
                          {formatPrice(vol.price)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity stepper */}
            <div className="mt-5">
              <p className="mb-3 font-body text-[10px] uppercase tracking-[0.22em] text-charcoal-500">
                Quantity
              </p>
              <div className="inline-flex items-center border border-charcoal-200">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-11 w-11 items-center justify-center text-charcoal-500 transition-colors hover:bg-charcoal-50 hover:text-charcoal-900 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span
                  className="flex h-11 w-14 items-center justify-center border-x border-charcoal-200 font-body text-sm font-medium text-charcoal-900"
                  aria-live="polite"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                  className="flex h-11 w-11 items-center justify-center text-charcoal-500 transition-colors hover:bg-charcoal-50 hover:text-charcoal-900 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 flex gap-3">
              <motion.button
                type="button"
                onClick={handleAddToCart}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2.5',
                  'h-13 py-4 px-8 font-body text-sm font-medium uppercase tracking-[0.18em]',
                  'transition-all duration-300',
                  addedToCart
                    ? 'bg-charcoal-900 text-white'
                    : 'bg-gold-500 text-white hover:bg-gold-600'
                )}
              >
                <ShoppingBag className="h-4 w-4 flex-shrink-0" />
                {addedToCart ? 'Added to Bag ✓' : 'Add to Bag'}
              </motion.button>

              <motion.button
                type="button"
                onClick={handleWishlist}
                whileTap={{ scale: 0.92 }}
                className={cn(
                  'flex h-13 py-4 w-14 flex-shrink-0 items-center justify-center border-2 transition-all duration-200',
                  wishlisted
                    ? 'border-gold-500 bg-gold-50 text-gold-600'
                    : 'border-charcoal-200 text-charcoal-400 hover:border-charcoal-400 hover:text-charcoal-700'
                )}
                aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                aria-pressed={wishlisted}
              >
                <Heart className="h-5 w-5" fill={wishlisted ? 'currentColor' : 'none'} />
              </motion.button>
            </div>

            {/* Trust strip */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: Truck, label: 'Free shipping', sub: 'Orders over $150' },
                { icon: RotateCcw, label: '30-day returns', sub: 'Hassle-free' },
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
            {product.story && product.story.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 font-body text-[10px] uppercase tracking-[0.28em] text-charcoal-400">
                  The Story
                </p>
                <PortableText value={product.story} components={portableTextComponents} />
              </div>
            )}

            {/* Fragrance Notes */}
            <div className="mt-6">
              <FragranceNotes
                topNotes={product.topNotes ?? []}
                middleNotes={product.middleNotes ?? []}
                baseNotes={product.baseNotes ?? []}
                intensity={product.intensity}
                sillage={product.sillage}
                longevity={product.longevity}
              />
            </div>

            {/* Accordions */}
            <div className="mt-6 border-t border-charcoal-100">
              <AccordionSection title="How to Apply" icon={<Droplets className="h-4 w-4" />}>
                <div className="space-y-2.5">
                  <p>Apply to pulse points — inner wrists, neck, behind ears, and inside elbows. These areas emit heat which diffuses and amplifies the scent.</p>
                  <p>Hold the bottle 15–20cm from skin and spray 2–3 times. Avoid rubbing — this breaks down scent molecules and reduces longevity.</p>
                  <p>Apply to freshly moisturised skin for best results. Fragrance adheres better to hydrated skin.</p>
                </div>
              </AccordionSection>
              <AccordionSection title="Shipping & Returns" icon={<Truck className="h-4 w-4" />}>
                <div className="space-y-2.5">
                  <p><strong className="font-semibold text-charcoal-800">Complimentary shipping</strong> on all orders over $150. Standard delivery 3–5 business days. Express 1–2 days available at checkout.</p>
                  <p>Returns accepted on unopened, unused items within 30 days. Opened items cannot be returned unless faulty.</p>
                  <p>To initiate a return: <span className="text-gold-600">support@luxeparfum.com</span></p>
                </div>
              </AccordionSection>
            </div>

            {/* Sustainability */}
            <div className="mt-4 flex items-start gap-3 bg-gradient-to-r from-cream-50 to-white border border-cream-200 px-5 py-4">
              <Leaf className="h-4 w-4 text-gold-500 flex-shrink-0 mt-0.5" />
              <p className="font-body text-xs text-charcoal-600 leading-relaxed">
                <span className="font-semibold text-charcoal-800">Sustainably crafted.</span>{' '}
                FSC-certified packaging, refillable bottles, carbon-conscious shipping. Every fragrance we make is a step toward a smaller footprint.
              </p>
            </div>
          </div>
        </div>

        {/* ── Below-fold ───────────────────────────────────────────────────── */}
        <div className="mt-6 border-t border-charcoal-100 pt-6">
          <RelatedProducts products={relatedProducts} />
          <RecentlyViewed excludeId={product._id} />
        </div>
      </div>
    </motion.div>
  )
}
