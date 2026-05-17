'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductFilters } from '@/components/product/ProductFilters'
import type { FilterState } from '@/components/product/ProductFilters'
import type { Product, Category } from '@/lib/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductsPageClientProps {
  products: Product[]
  categories: Category[]
}

type SortOption = 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'best_selling'

const DEFAULT_FILTER_STATE: FilterState = {
  category: undefined,
  fragranceFamily: undefined,
  priceRange: [0, 1000],
  sortBy: 'featured',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getProductDisplayPrice(product: Product): number {
  return product.volume?.[0]?.price ?? product.price
}

function applyFiltersAndSort(
  products: Product[],
  filters: FilterState
): Product[] {
  let result = [...products]

  // Category
  if (filters.category) {
    result = result.filter((p) => p.category?.slug === filters.category)
  }

  // Fragrance family
  if (filters.fragranceFamily && filters.fragranceFamily.length > 0) {
    result = result.filter((p) =>
      filters.fragranceFamily!.includes(p.fragranceFamily)
    )
  }

  // Price range
  const [priceMin, priceMax] = filters.priceRange
  result = result.filter((p) => {
    const price = getProductDisplayPrice(p)
    return price >= priceMin && price <= priceMax
  })

  // Sort
  switch (filters.sortBy as SortOption) {
    case 'featured':
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return 0
      })
      break
    case 'newest':
      result.sort((a, b) => {
        if (a.new && !b.new) return -1
        if (!a.new && b.new) return 1
        return 0
      })
      break
    case 'price_asc':
      result.sort(
        (a, b) => getProductDisplayPrice(a) - getProductDisplayPrice(b)
      )
      break
    case 'price_desc':
      result.sort(
        (a, b) => getProductDisplayPrice(b) - getProductDisplayPrice(a)
      )
      break
    case 'best_selling':
      result.sort((a, b) => {
        if (a.bestSeller && !b.bestSeller) return -1
        if (!a.bestSeller && b.bestSeller) return 1
        return 0
      })
      break
  }

  return result
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
      <Link
        href="/"
        className="font-body text-xs text-charcoal-400 transition-colors hover:text-charcoal-700"
      >
        Home
      </Link>
      <ChevronRight className="h-3 w-3 text-charcoal-300 flex-shrink-0" />
      <span className="font-body text-xs text-charcoal-700" aria-current="page">
        All Fragrances
      </span>
    </nav>
  )
}

// ─── Active Filter Chips ──────────────────────────────────────────────────────

interface FilterChipsProps {
  filters: FilterState
  categories: Category[]
  onRemoveCategory: () => void
  onRemoveFamily: (family: string) => void
  onRemovePriceRange: () => void
}

function FilterChips({
  filters,
  categories,
  onRemoveCategory,
  onRemoveFamily,
  onRemovePriceRange,
}: FilterChipsProps) {
  const locale = useLocale()
  const isAr = locale === 'ar'
  const hasChips =
    filters.category ||
    (filters.fragranceFamily && filters.fragranceFamily.length > 0) ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 1000

  if (!hasChips) return null

  const categoryLabel = filters.category
    ? (categories.find((c) => c.slug === filters.category)
        ? (isAr
            ? categories.find((c) => c.slug === filters.category)!.name_ar
            : categories.find((c) => c.slug === filters.category)!.name_en)
        : filters.category)
    : null

  const hasPriceFilter =
    filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000
  const priceLabel = hasPriceFilter
    ? `$${filters.priceRange[0]} – $${filters.priceRange[1]}`
    : null

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {categoryLabel && (
        <Chip label={categoryLabel} onRemove={onRemoveCategory} />
      )}
      {filters.fragranceFamily?.map((f) => (
        <Chip key={f} label={f} onRemove={() => onRemoveFamily(f)} />
      ))}
      {priceLabel && (
        <Chip label={priceLabel} onRemove={onRemovePriceRange} />
      )}
    </div>
  )
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-gold-300 bg-gold-50 px-3 py-1">
      <span className="font-body text-xs text-gold-700">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="text-gold-500 transition-colors hover:text-gold-700"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

// ─── Sort label for display ───────────────────────────────────────────────────

const SORT_LABELS: Record<string, string> = {
  featured: 'Featured',
  newest: 'Newest',
  price_asc: 'Price: Low to High',
  price_desc: 'Price: High to Low',
  best_selling: 'Best Selling',
}

// ─── Main Client Component ────────────────────────────────────────────────────

export function ProductsPageClient({
  products,
  categories,
}: ProductsPageClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Derive initial filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTER_STATE,
    category: searchParams.get('category') ?? undefined,
    sortBy: searchParams.get('sort') ?? 'featured',
  }))

  // Sync filters when URL params change (e.g. nav link clicks)
  useEffect(() => {
    setFilters({
      ...DEFAULT_FILTER_STATE,
      category: searchParams.get('category') ?? undefined,
      sortBy: searchParams.get('sort') ?? 'featured',
    })
  }, [searchParams])

  // Computed products
  const processedProducts = useMemo(
    () => applyFiltersAndSort(products, filters),
    [products, filters]
  )

  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters)
      const params = new URLSearchParams()
      if (newFilters.category) params.set('category', newFilters.category)
      if (newFilters.sortBy && newFilters.sortBy !== 'featured') {
        params.set('sort', newFilters.sortBy)
      }
      const qs = params.toString()
      router.replace(qs ? `/products?${qs}` : '/products', { scroll: false })
    },
    [router]
  )

  const clearAllFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER_STATE)
    router.replace('/products', { scroll: false })
  }, [router])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-white pt-20"
    >
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="border-b border-charcoal-100 bg-cream-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb />
          <div className="mt-4">
            <h1 className="font-display text-4xl font-light tracking-tight text-charcoal-900 md:text-5xl">
              All Fragrances
            </h1>
            <p className="mt-1.5 font-body text-sm text-charcoal-400 tracking-wide">
              The complete collection — {products.length} scents
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Toolbar row: mobile filter button + result count + sort */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          {/* Left: filters (mobile trigger is inside ProductFilters) + result count */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Mobile filter button (ProductFilters renders its own mobile trigger) */}
            <div className="lg:hidden">
              <ProductFilters
                categories={categories}
                onFilterChange={handleFilterChange}
                activeFilters={filters}
              />
            </div>

            <p className="font-body text-sm text-charcoal-500">
              Showing{' '}
              <span className="font-medium text-charcoal-900">
                {processedProducts.length}
              </span>{' '}
              {processedProducts.length === 1 ? 'fragrance' : 'fragrances'}
            </p>
          </div>

          {/* Right: sort info (ProductFilters has sort, but showing active sort here) */}
          <div className="flex items-center gap-2">
            <span className="font-body text-xs text-charcoal-400">
              Sorted by:
            </span>
            <span className="font-body text-xs font-medium text-charcoal-700">
              {SORT_LABELS[filters.sortBy] ?? 'Featured'}
            </span>
          </div>
        </div>

        {/* Content: sidebar + grid */}
        <div className="flex gap-10">
          {/* Desktop sidebar (sticky) */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-28">
              <ProductFilters
                categories={categories}
                onFilterChange={handleFilterChange}
                activeFilters={filters}
              />
            </div>
          </aside>

          {/* Products area */}
          <div className="flex-1 min-w-0">
            {/* Active filter chips */}
            <FilterChips
              filters={filters}
              categories={categories}
              onRemoveCategory={() =>
                handleFilterChange({ ...filters, category: undefined })
              }
              onRemoveFamily={(f) =>
                handleFilterChange({
                  ...filters,
                  fragranceFamily: (filters.fragranceFamily ?? []).filter(
                    (x) => x !== f
                  ),
                })
              }
              onRemovePriceRange={() =>
                handleFilterChange({ ...filters, priceRange: [0, 1000] })
              }
            />

            {/* Animated grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${filters.category}-${filters.sortBy}-${filters.fragranceFamily?.join(',')}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductGrid products={processedProducts} />
              </motion.div>
            </AnimatePresence>

            {/* Clear filters CTA when empty */}
            {processedProducts.length === 0 && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className={cn(
                    'border border-gold-500 px-8 py-3',
                    'font-body text-xs font-medium uppercase tracking-[0.18em] text-gold-600',
                    'transition-colors hover:bg-gold-500 hover:text-white'
                  )}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
