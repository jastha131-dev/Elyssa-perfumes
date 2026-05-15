'use client'

import { useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { useHydrated } from '@/lib/hooks/use-hydrated'
import type { Product, BestSellersSectionBlock } from '@/lib/types'

const LOCAL_PRODUCT_IMAGES = [
  '/images/products/default-product.jpeg',
  '/images/products/p1.jpeg',
  '/images/products/p2.jpeg',
  '/images/products/p3.jpeg',
  '/images/products/p4.jpeg',
  '/images/products/p5.jpeg',
  '/images/products/p6.jpeg',
  '/images/products/p7.jpeg',
  '/images/products/p8.jpeg',
  '/images/products/p10.jpeg',
  '/images/products/p11.jpeg',
  '/images/products/p12.jpeg',
  '/images/products/p13.jpeg',
  '/images/products/p14.jpeg',
]

interface BestSellersProps {
  data: BestSellersSectionBlock
}

const headingVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

interface BestSellerCardProps {
  product: Product
  index: number
}

function BestSellerCard({ product, index }: BestSellerCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const hydrated = useHydrated()
  const isWishlisted = hydrated && isInWishlist(product._id)
  const primaryImage = product.images?.[0]
  const imageUrl = primaryImage?.url || LOCAL_PRODUCT_IMAGES[index % LOCAL_PRODUCT_IMAGES.length]
  const displayPrice = product.volume?.[0]?.price ?? product.price

  const handleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      toggleWishlist(product)
    },
    [toggleWishlist, product]
  )

  return (
    <motion.div
      variants={cardVariants}
      className="group relative flex-none"
      style={{ width: 'clamp(220px, 25vw, 280px)' }}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div
          className="relative w-full overflow-hidden bg-charcoal-800"
          style={{ aspectRatio: '3/4' }}
        >
          <Image
            src={imageUrl}
            alt={primaryImage?.alt || product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="280px"
          />

          {/* Badge */}
          <div className="absolute left-3 top-3">
            <span className="bg-gold-500 px-2.5 py-1 font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-charcoal-950">
              Best Seller
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute right-3 top-3 flex h-8 w-8 items-center justify-center',
              'bg-white/90 backdrop-blur-sm transition-all duration-200 hover:bg-white',
              'shadow-sm'
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={isWishlisted}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isWishlisted ? 'filled' : 'empty'}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                <Heart
                  size={14}
                  className={cn(
                    'transition-colors',
                    isWishlisted
                      ? 'fill-gold-500 text-gold-500'
                      : 'fill-transparent text-charcoal-700'
                  )}
                />
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Hover tint */}
          <div className="absolute inset-0 bg-charcoal-950/0 transition-colors duration-300 group-hover:bg-charcoal-950/15" />
        </div>

        {/* Info */}
        <div className="mt-3 px-0.5">
          {product.category?.name && (
            <p className="font-body text-[10px] uppercase tracking-[0.25em] text-gold-500/80">
              {product.category.name}
            </p>
          )}
          <h3 className="mt-0.5 font-display text-base font-light text-charcoal-900 transition-colors group-hover:text-gold-600">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-body text-sm font-medium text-charcoal-900">
              ${displayPrice.toFixed(2)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > displayPrice && (
              <span className="font-body text-xs text-charcoal-400 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function BestSellers({ data }: BestSellersProps) {
  const products: Product[] = (data?.products ?? []) as Product[]
  const title = data?.title ?? 'Best Sellers'

  const headingRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' })
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const scroll = useCallback((direction: 'prev' | 'next') => {
    if (!trackRef.current) return
    trackRef.current.scrollBy({
      left: direction === 'next' ? 300 : -300,
      behavior: 'smooth',
    })
  }, [])

  if (products.length === 0) return null

  return (
    <section ref={sectionRef} className="overflow-hidden bg-cream-100 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading + Arrows */}
        <div className="mb-12 flex items-end justify-between">
          <motion.div
            ref={headingRef}
            variants={headingVariants}
            initial="hidden"
            animate={isHeadingInView ? 'visible' : 'hidden'}
          >
            <p className="mb-2 font-body text-xs uppercase tracking-[0.35em] text-gold-500">
              Top Picks
            </p>
            <h2 className="font-display text-4xl font-light text-charcoal-900 md:text-5xl">
              {title}
            </h2>
            <div className="mt-4 h-px w-16 bg-gold-500/50" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isHeadingInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={() => scroll('prev')}
              className={cn(
                'flex h-11 w-11 items-center justify-center border border-charcoal-300',
                'text-charcoal-700 transition-all duration-200',
                'hover:border-gold-500 hover:bg-gold-500 hover:text-charcoal-950'
              )}
              aria-label="Previous products"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scroll('next')}
              className={cn(
                'flex h-11 w-11 items-center justify-center border border-charcoal-300',
                'text-charcoal-700 transition-all duration-200',
                'hover:border-gold-500 hover:bg-gold-500 hover:text-charcoal-950'
              )}
              aria-label="Next products"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </motion.div>
        </div>

        {/* Carousel */}
        <motion.div
          ref={trackRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className={cn(
            'flex gap-5 overflow-x-auto pb-4',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            'scroll-smooth'
          )}
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {products.map((product, idx) => (
            <div key={product._id} style={{ scrollSnapAlign: 'start' }}>
              <BestSellerCard product={product} index={idx} />
            </div>
          ))}
        </motion.div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 text-center"
        >
          <Link
            href="/products?filter=bestseller"
            className={cn(
              'font-body text-sm uppercase tracking-[0.2em] text-charcoal-600',
              'border-b border-charcoal-300 pb-0.5 transition-colors duration-200',
              'hover:border-gold-500 hover:text-gold-600'
            )}
          >
            View All Best Sellers
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
