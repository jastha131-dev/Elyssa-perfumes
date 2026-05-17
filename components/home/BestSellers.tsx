'use client'

import { useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
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
  const tp = useTranslations('product')
  const locale = useLocale()
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const hydrated = useHydrated()
  const isWishlisted = hydrated && isInWishlist(product._id)
  const primaryImage = product.images?.[0]
  const imageUrl = primaryImage?.url || LOCAL_PRODUCT_IMAGES[index % LOCAL_PRODUCT_IMAGES.length]
  const displayPrice = product.volume?.[0]?.price ?? product.price
  const productName = locale === 'ar' ? product.name_ar : product.name_en
  const categoryName = product.category
    ? (locale === 'ar' ? product.category.name_ar : product.category.name_en)
    : null

  const handleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      toggleWishlist(product)
    },
    [toggleWishlist, product]
  )

  return (
    <motion.div variants={cardVariants} className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative w-full overflow-hidden bg-stone-200" style={{ aspectRatio: '3/4' }}>
          <Image
            src={imageUrl}
            alt={primaryImage?.alt || productName}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 1024px) 50vw, 30vw"
          />

          {/* Best Seller Badge */}
          <div className="absolute left-3 top-3">
            <span className="bg-camel-500 px-2.5 py-1 font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
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
            aria-label={isWishlisted ? tp('removeFromWishlist') : tp('addToWishlist')}
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
                      ? 'fill-camel-500 text-camel-500'
                      : 'fill-transparent text-ink-700'
                  )}
                />
              </motion.div>
            </AnimatePresence>
          </button>
        </div>

        {/* Product Info */}
        <div className="mt-3 px-0.5">
          {categoryName && (
            <p className="font-body text-[10px] uppercase tracking-[0.25em] text-camel-500/80">
              {categoryName}
            </p>
          )}
          <h3 className="mt-0.5 font-display text-base font-light text-ink-900 transition-colors group-hover:text-camel-600">
            {productName}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-body text-sm font-medium text-ink-900">
              ${displayPrice.toFixed(2)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > displayPrice && (
              <span className="font-body text-xs text-ink-400 line-through">
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
  const t = useTranslations('home')
  const locale = useLocale()
  const products: Product[] = (data?.products ?? []) as Product[]
  const title =
    (locale === 'ar' ? data?.title_ar : data?.title_en) ?? 'Best Sellers'

  const headingRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' })
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  if (products.length === 0) return null

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-stone-50 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[60%_40%] lg:gap-8 lg:items-start">

          {/* ── Left column ── */}
          <div className="flex flex-col">
            {/* Heading */}
            <motion.div
              ref={headingRef}
              variants={headingVariants}
              initial="hidden"
              animate={isHeadingInView ? 'visible' : 'hidden'}
              className="mb-10"
            >
              <p className="mb-2 font-body text-xs uppercase tracking-widest text-camel-500">
                Top Picks
              </p>
              <h2 className="font-headline font-bold uppercase text-ink-900 text-4xl md:text-5xl">
                {title}
              </h2>
              <div className="mt-4 h-px w-16 bg-camel-500/50" />
            </motion.div>

            {/* 2×2 product grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="grid grid-cols-2 gap-4"
            >
              {products.slice(0, 4).map((product, idx) => (
                <BestSellerCard key={product._id} product={product} index={idx} />
              ))}
            </motion.div>

            {/* View All */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-8"
            >
              <Link
                href="/products?filter=bestseller"
                className="font-body text-sm uppercase tracking-[0.2em] text-ink-600 border-b border-stone-300 pb-0.5 hover:border-camel-500 hover:text-camel-600 transition-colors"
              >
                {t('viewAllBestSellers')}
              </Link>
            </motion.div>
          </div>

          {/* ── Right column — lifestyle image ── */}
          <div className="hidden lg:block relative">
            <div className="sticky top-0 h-[600px] overflow-hidden">
              <Image
                src="/images/categories/I2.webp"
                alt="Best sellers lifestyle"
                fill
                className="object-cover object-center"
                sizes="40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-100/10" />
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  )
}
