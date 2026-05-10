'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product } from '@/lib/types'

interface RelatedProductsProps {
  products: Product[]
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.1,
    },
  },
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!products || products.length === 0) return null

  const scrollBy = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.75
    scrollRef.current.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    })
  }

  return (
    <section aria-label="Related products" className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-8"
      >
        <div>
          <h2 className="font-display text-2xl md:text-3xl text-charcoal-900">
            You May Also Like
          </h2>
          <div className="h-px w-10 bg-gold-500 mt-2" aria-hidden="true" />
        </div>

        {/* Desktop carousel controls */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy('left')}
            className={cn(
              'w-9 h-9 flex items-center justify-center',
              'border border-charcoal-200 text-charcoal-600',
              'hover:border-gold-500 hover:text-gold-500',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500'
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft size={14} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy('right')}
            className={cn(
              'w-9 h-9 flex items-center justify-center',
              'border border-charcoal-200 text-charcoal-600',
              'hover:border-gold-500 hover:text-gold-500',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500'
            )}
            aria-label="Scroll right"
          >
            <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
      </motion.div>

      {/* ── Mobile: horizontal scroll carousel ────────────────────────────── */}
      <div className="block md:hidden">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
        >
          {products.map((product, i) => (
            <div
              key={product._id}
              className="snap-start shrink-0 w-[min(260px,72vw)]"
            >
              <ProductCard product={product} priority={i === 0} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Desktop: 4-col grid with stagger ─────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10"
      >
        {products.slice(0, 8).map((product, i) => (
          <ProductCard key={product._id} product={product} priority={i < 4} />
        ))}
      </motion.div>
    </section>
  )
}
