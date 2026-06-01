'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import type { CollectionDetail, Product } from '@/lib/types'

const LOCAL_IMAGES = ['/images/products/default-product.jpeg', '/images/products/p1.jpeg', '/images/products/p2.jpeg', '/images/products/p3.jpeg']

const SORT_OPTIONS = [
  { label: 'Newest', value: '_createdAt_desc' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name A–Z', value: 'name_asc' },
]

function sortProducts(products: Product[], sort: string): Product[] {
  const arr = [...products]
  switch (sort) {
    case 'price_asc': return arr.sort((a, b) => (a.volume?.[0]?.price ?? a.price) - (b.volume?.[0]?.price ?? b.price))
    case 'price_desc': return arr.sort((a, b) => (b.volume?.[0]?.price ?? b.price) - (a.volume?.[0]?.price ?? a.price))
    case 'name_asc': return arr.sort((a, b) => a.name_en.localeCompare(b.name_en))
    default: return arr
  }
}

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const cardVariants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }

interface Props {
  collection: CollectionDetail
  products: Product[]
}

export default function CollectionPageClient({ collection, products }: Props) {
  const locale = useLocale()
  const isAr = locale === 'ar'
  const [sort, setSort] = useState(collection.defaultSort ?? '_createdAt_desc')
  const [showSort, setShowSort] = useState(false)

  const title = isAr ? collection.title_ar : collection.title_en
  const headline = isAr ? collection.headline_ar : collection.headline_en
  const subtext = isAr ? collection.subtext_ar : collection.subtext_en
  const ctaLabel = isAr ? collection.cta?.label_ar : collection.cta?.label_en

  const sorted = useMemo(() => sortProducts(products, sort), [products, sort])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: '420px' }}>
        {collection.heroImageUrl ? (
          <Image src={collection.heroImageUrl} alt={collection.heroImageAlt ?? title ?? ''} fill className="object-cover" priority />
        ) : collection.imageUrl ? (
          <Image src={collection.imageUrl} alt={title ?? ''} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex min-h-[420px] flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-3 font-body text-xs uppercase tracking-[0.35em] text-white/70">Collection</p>
            <h1 className="font-display font-light text-white text-4xl md:text-6xl leading-tight max-w-2xl">
              {headline || title}
            </h1>
            {subtext && (
              <p className="mt-4 font-body text-base font-light text-white/70 max-w-lg leading-relaxed">
                {subtext}
              </p>
            )}
            {collection.cta?.link && ctaLabel && (
              <Link
                href={collection.cta.link}
                className="mt-7 inline-flex items-center gap-2.5 bg-white px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink-900 hover:bg-stone-100 transition-colors"
              >
                {ctaLabel}
                <ArrowRight size={11} strokeWidth={2.5} />
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Product grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-14">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-10">
          <p className="font-body text-sm text-ink-400">
            {sorted.length} {sorted.length === 1 ? 'fragrance' : 'fragrances'}
          </p>
          <div className="relative">
            <button
              onClick={() => setShowSort((v) => !v)}
              className="flex items-center gap-2 font-body text-sm text-ink-700 border border-stone-200 px-4 py-2 hover:border-camel-400 transition-colors"
            >
              <SlidersHorizontal size={13} />
              {SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Sort'}
              <ChevronDown size={13} className={cn('transition-transform', showSort && 'rotate-180')} />
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-stone-200 shadow-lg z-20">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setShowSort(false) }}
                    className={cn(
                      'block w-full px-4 py-2.5 text-left font-body text-sm transition-colors hover:bg-stone-50',
                      sort === opt.value ? 'text-camel-600 font-medium' : 'text-ink-700'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-body text-sm text-ink-400">No products in this collection yet.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            {sorted.map((product, idx) => {
              const name = isAr ? product.name_ar : product.name_en
              const imageUrl = product.images?.[0]?.url || LOCAL_IMAGES[idx % LOCAL_IMAGES.length]
              const price = product.volume?.[0]?.price ?? product.price
              return (
                <motion.div key={product._id} variants={cardVariants} className="group">
                  <Link href={`/${locale}/products/${product.slug}`} className="block">
                    <div className="relative w-full overflow-hidden bg-stone-200" style={{ aspectRatio: '3/4' }}>
                      <Image
                        src={imageUrl}
                        alt={product.images?.[0]?.alt || name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      {product.new && (
                        <span className="absolute left-3 top-3 bg-camel-500 px-2.5 py-1 font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-white">New</span>
                      )}
                      {product.bestSeller && !product.new && (
                        <span className="absolute left-3 top-3 bg-ink-900 px-2.5 py-1 font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-camel-400">Best Seller</span>
                      )}
                    </div>
                    <div className="mt-3">
                      {product.fragranceFamily && (
                        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-camel-500 mb-0.5">{product.fragranceFamily}</p>
                      )}
                      <h3 className="font-display text-base font-light text-ink-900 transition-colors group-hover:text-camel-600 leading-snug">{name}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-body text-sm font-medium text-ink-900">${price.toFixed(2)}</span>
                        {product.compareAtPrice && product.compareAtPrice > price && (
                          <span className="font-body text-xs text-ink-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}
