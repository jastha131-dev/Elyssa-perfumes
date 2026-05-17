'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import type { Product, FeaturedProductsSectionBlock } from '@/lib/types'

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
  data: FeaturedProductsSectionBlock
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
  index: number
}

function FeaturedCard({ product, onQuickAdd, justAdded, index }: FeaturedCardProps) {
  const primaryImage = product.images?.[0]
  const imageUrl = primaryImage?.url || LOCAL_PRODUCT_IMAGES[index % LOCAL_PRODUCT_IMAGES.length]
  const productName = product.name_en
  const displayPrice = product.volume?.[0]?.price ?? product.price

  return (
    <motion.div variants={cardVariants} className="group relative flex flex-col">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-stone-200">
          <Image
            src={imageUrl}
            alt={primaryImage?.alt || productName}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.new && (
              <span className="bg-camel-500 px-2 py-0.5 font-body text-[10px] font-medium uppercase tracking-widest text-white">
                New
              </span>
            )}
            {product.bestSeller && (
              <span className="bg-camel-500 px-2 py-0.5 font-body text-[10px] font-medium uppercase tracking-widest text-white">
                Best Seller
              </span>
            )}
          </div>
        </div>

        {/* Info below image */}
        <div className="mt-4 flex flex-col gap-1 px-1">
          {product.category?.name_en && (
            <p className="font-body text-[11px] uppercase tracking-[0.25em] text-camel-500/80">
              {product.category.name_en}
            </p>
          )}
          <h3 className="font-display text-lg font-light text-ink-900 transition-colors group-hover:text-camel-600">
            {productName}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-body text-sm font-medium text-ink-800">
              ${displayPrice.toFixed(2)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > displayPrice && (
              <span className="font-body text-sm text-ink-400 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Always-visible Add to Cart button */}
      <div className="px-1">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickAdd(product) }}
          className="mt-2 w-full border border-camel-500/40 py-2 font-body text-[10px] font-semibold uppercase tracking-widest text-camel-600 transition-colors duration-200 hover:bg-camel-500/10"
        >
          {justAdded ? 'Added ✓' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  )
}

export default function FeaturedProducts({ data }: FeaturedProductsProps) {
  const products: Product[] = (data?.products ?? []) as Product[]

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

  const displayProducts = products.slice(0, 4)

  if (displayProducts.length === 0) return null

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading — left-aligned */}
        <motion.div
          ref={headingRef}
          variants={headingVariants}
          initial="hidden"
          animate={isHeadingInView ? 'visible' : 'hidden'}
          className="mb-14 flex flex-col items-start"
        >
          <p className="mb-3 font-body text-xs uppercase tracking-widest text-camel-500">
            Luxury You Can Afford
          </p>
          <h2 className="font-headline font-bold uppercase text-ink-900 text-4xl md:text-5xl">
            {data?.title_en ?? 'Signature Inspirations'}
          </h2>
          <div className="mt-5 h-px w-16 bg-camel-500" />
        </motion.div>

        {/* 4-column equal grid */}
        <motion.div
          ref={sectionRef}
          variants={sectionVariants}
          initial="hidden"
          animate={isGridInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 gap-6 md:grid-cols-4"
        >
          {displayProducts.map((product, idx) => (
            <FeaturedCard
              key={product._id}
              product={product}
              onQuickAdd={handleQuickAdd}
              justAdded={justAddedId === product._id}
              index={idx}
            />
          ))}
        </motion.div>

        {/* CTA — right-aligned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isGridInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-10 flex justify-end"
        >
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 font-body text-sm uppercase tracking-[0.2em] text-ink-700 border-b border-stone-300 pb-0.5 hover:border-camel-500 hover:text-camel-600 transition-colors"
          >
            View All Products
            <ArrowRight size={13} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
