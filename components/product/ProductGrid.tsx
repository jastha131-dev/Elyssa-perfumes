'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/LoadingSkeleton'
import type { Product } from '@/lib/types'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
}

const SKELETON_COUNT = 8

export function ProductGrid({ products, loading = false }: ProductGridProps) {
  if (loading) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading fragrances"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10"
      >
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-24 px-6 text-center"
      >
        <Sparkles
          size={36}
          className="text-gold-400 mb-5"
          aria-hidden="true"
          strokeWidth={1.25}
        />
        <h3 className="font-display text-2xl text-charcoal-900 mb-3">
          No Fragrances Found
        </h3>
        <p className="text-sm text-charcoal-400 max-w-xs leading-relaxed">
          We couldn&apos;t find any fragrances matching your current selection.
          Try adjusting your filters or browsing our full collection.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10"
    >
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          priority={index < 4}
        />
      ))}
    </motion.div>
  )
}
