'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Check, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cart-store'
import type { Product } from '@/lib/types'

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

interface FeaturedProductsProps {
  products: Product[]
}

const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
}

const headingVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

interface FeaturedCardProps {
  product: Product
  onQuickAdd: (product: Product) => void
  justAdded: boolean
  isHero?: boolean
  index: number
}

function FeaturedCard({ product, onQuickAdd, justAdded, isHero = false, index }: FeaturedCardProps) {
  const primaryImage = product.images?.[0]
  const imageUrl = primaryImage?.url || LOCAL_PRODUCT_IMAGES[index % LOCAL_PRODUCT_IMAGES.length]
  const displayPrice = product.volume?.[0]?.price ?? product.price

  return (
    <motion.div
      variants={cardVariants}
      className={cn('group relative flex flex-col', isHero && 'md:col-span-2')}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div
          className={cn(
            'relative w-full overflow-hidden bg-charcoal-800',
            isHero ? 'aspect-[4/3] md:aspect-[16/10]' : 'aspect-[3/4]'
          )}
        >
          <Image
            src={imageUrl}
            alt={primaryImage?.alt || product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            sizes={
              isHero
                ? '(max-width: 768px) 100vw, 66vw'
                : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            }
          />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.new && (
              <span className="bg-gold-500 px-2 py-0.5 font-body text-[10px] font-medium uppercase tracking-widest text-charcoal-950">
                New
              </span>
            )}
            {product.bestSeller && (
              <span className="bg-charcoal-900/90 px-2 py-0.5 font-body text-[10px] font-medium uppercase tracking-widest text-gold-400">
                Best Seller
              </span>
            )}
          </div>

          {/* Hero card — persistent bottom overlay with info */}
          {isHero && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/40 to-transparent p-6 md:p-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  {product.category?.name && (
                    <p className="mb-1 font-body text-[11px] uppercase tracking-[0.25em] text-gold-400/80">
                      {product.category.name}
                    </p>
                  )}
                  <h3 className="font-display text-2xl font-light text-cream-50 md:text-3xl">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-body text-sm font-medium text-cream-100">
                      ${displayPrice.toFixed(2)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > displayPrice && (
                      <span className="font-body text-sm text-cream-100/40 line-through">
                        ${product.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: justAdded ? 1 : 1.03 }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onQuickAdd(product)
                  }}
                  className={cn(
                    'flex flex-shrink-0 items-center gap-2 border px-5 py-2.5',
                    'font-body text-[10px] font-semibold uppercase tracking-[0.22em]',
                    'transition-colors duration-200',
                    justAdded
                      ? 'border-gold-400/60 text-gold-300'
                      : 'border-gold-400/60 text-gold-300 hover:bg-gold-500/20'
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {justAdded ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Check size={11} strokeWidth={2} />
                        Added
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingBag size={11} strokeWidth={1.5} />
                        Quick Add
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          )}

          {/* Standard card — hover overlay */}
          {!isHero && (
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-charcoal-950/70 via-charcoal-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="p-4">
                <motion.button
                  whileHover={{ scale: justAdded ? 1 : 1.02 }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onQuickAdd(product)
                  }}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 py-2.5 font-body text-[10px] font-semibold uppercase tracking-[0.22em]',
                    'transition-colors duration-200',
                    justAdded
                      ? 'border border-gold-400/60 text-gold-300'
                      : 'border border-gold-400/60 text-gold-300 hover:bg-gold-500/20'
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {justAdded ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Check size={11} strokeWidth={2} />
                        Added
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingBag size={11} strokeWidth={1.5} />
                        Quick Add
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Info below image — standard cards only */}
        {!isHero && (
          <div className="mt-4 flex flex-col gap-1 px-1">
            {product.category?.name && (
              <p className="font-body text-[11px] uppercase tracking-[0.25em] text-gold-500/80">
                {product.category.name}
              </p>
            )}
            <h3 className="font-display text-lg font-light text-charcoal-900 transition-colors group-hover:text-gold-600">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-body text-sm font-medium text-charcoal-900">
                ${displayPrice.toFixed(2)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > displayPrice && (
                <span className="font-body text-sm text-charcoal-400 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        )}
      </Link>
    </motion.div>
  )
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const [justAddedId, setJustAddedId] = useState<string | null>(null)

  const { addItem, openCart } = useCartStore()

  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' })
  const isGridInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const handleQuickAdd = useCallback(
    (product: Product) => {
      const volume = product.volume?.[0] ?? { ml: 50, price: product.price }
      addItem(product, 1, volume)
      setJustAddedId(product._id)
      openCart()
      setTimeout(() => setJustAddedId(null), 2000)
    },
    [addItem, openCart]
  )

  // First product = hero (2-col), remaining up to 4 in standard grid
  const displayProducts = products.slice(0, 5)

  if (displayProducts.length === 0) return null

  return (
    <section className="bg-cream-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          ref={headingRef}
          variants={headingVariants}
          initial="hidden"
          animate={isHeadingInView ? 'visible' : 'hidden'}
          className="mb-14 flex flex-col items-center text-center"
        >
          <div className="mb-4 flex items-center gap-4">
            <div className="h-px w-8 bg-gold-500/60" />
            <p className="font-body text-xs uppercase tracking-[0.35em] text-gold-500">
              Curated Selection
            </p>
            <div className="h-px w-8 bg-gold-500/60" />
          </div>
          <h2 className="font-display text-4xl font-light text-charcoal-900 md:text-5xl">
            Featured Fragrances
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />
        </motion.div>

        {/* Grid — hero card + standard grid */}
        <motion.div
          ref={sectionRef}
          variants={sectionVariants}
          initial="hidden"
          animate={isGridInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {displayProducts.map((product, idx) => (
            <FeaturedCard
              key={product._id}
              product={product}
              onQuickAdd={handleQuickAdd}
              justAdded={justAddedId === product._id}
              isHero={idx === 0}
              index={idx}
            />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isGridInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-14 text-center"
        >
          <Link
            href="/products"
            className={cn(
              'group inline-flex items-center gap-3 border border-charcoal-900 px-10 py-3.5',
              'font-body text-sm uppercase tracking-[0.2em] text-charcoal-900',
              'transition-all duration-300 hover:bg-charcoal-900 hover:text-cream-100'
            )}
          >
            View All Fragrances
            <ArrowRight
              size={13}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
