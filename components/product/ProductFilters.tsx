'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { Category } from '@/lib/types'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface FilterState {
  category?: string
  fragranceFamily?: string[]
  priceRange: [number, number]
  sortBy: string
}

interface ProductFiltersProps {
  categories: Category[]
  onFilterChange: (filters: FilterState) => void
  activeFilters: FilterState
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const FRAGRANCE_FAMILIES = [
  'Woody',
  'Floral',
  'Citrus',
  'Oriental',
  'Fresh',
  'Aquatic',
  'Gourmand',
] as const

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'best_selling', label: 'Best Selling' },
] as const

const DEFAULT_PRICE_RANGE: [number, number] = [0, 1000]

// ─── Collapsible section ───────────────────────────────────────────────────────

interface CollapsibleSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-charcoal-100 py-4">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left focus-visible:outline-none focus-visible:text-gold-500"
        aria-expanded={isOpen}
      >
        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal-700">
          {title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.22 }}
        >
          <ChevronDown
            size={14}
            className="text-charcoal-500"
            aria-hidden="true"
          />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

function FilterPanel({
  categories,
  onFilterChange,
  activeFilters,
}: ProductFiltersProps) {
  const handleCategoryChange = useCallback(
    (value: string) => {
      onFilterChange({
        ...activeFilters,
        category: value === 'all' ? undefined : value,
      })
    },
    [activeFilters, onFilterChange]
  )

  const handleFragranceFamilyChange = useCallback(
    (family: string, checked: boolean) => {
      const current = activeFilters.fragranceFamily ?? []
      const updated = checked
        ? [...current, family]
        : current.filter((f) => f !== family)
      onFilterChange({
        ...activeFilters,
        fragranceFamily: updated.length > 0 ? updated : undefined,
      })
    },
    [activeFilters, onFilterChange]
  )

  const handlePriceChange = useCallback(
    (index: 0 | 1, rawValue: string) => {
      const parsed = parseInt(rawValue, 10)
      const value = isNaN(parsed) ? DEFAULT_PRICE_RANGE[index] : Math.max(0, parsed)
      const next: [number, number] = [...activeFilters.priceRange] as [number, number]
      next[index] = value
      onFilterChange({ ...activeFilters, priceRange: next })
    },
    [activeFilters, onFilterChange]
  )

  const handleSortChange = useCallback(
    (value: string) => {
      onFilterChange({ ...activeFilters, sortBy: value })
    },
    [activeFilters, onFilterChange]
  )

  const handleClearAll = useCallback(() => {
    onFilterChange({
      category: undefined,
      fragranceFamily: undefined,
      priceRange: DEFAULT_PRICE_RANGE,
      sortBy: 'featured',
    })
  }, [onFilterChange])

  const activeCount = [
    activeFilters.category ? 1 : 0,
    (activeFilters.fragranceFamily?.length ?? 0),
    activeFilters.priceRange[0] !== DEFAULT_PRICE_RANGE[0] ||
    activeFilters.priceRange[1] !== DEFAULT_PRICE_RANGE[1]
      ? 1
      : 0,
    activeFilters.sortBy !== 'featured' ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  const categoryOptions = [
    { value: 'all', label: 'All Fragrances' },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ]

  return (
    <aside aria-label="Product filters" className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 pb-4 border-b border-charcoal-100">
        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal-900">
          Filters
          {activeCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gold-500 text-white text-[9px] font-bold">
              {activeCount}
            </span>
          )}
        </span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[10px] tracking-[0.1em] uppercase text-charcoal-400 hover:text-gold-500 transition-colors focus-visible:outline-none focus-visible:text-gold-500"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Sort By */}
      <CollapsibleSection title="Sort By">
        <div className="relative">
          <select
            value={activeFilters.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className={cn(
              'w-full appearance-none',
              'border border-charcoal-200 bg-white',
              'text-xs text-charcoal-700 tracking-wide',
              'px-3 py-2.5 pr-8',
              'focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500',
              'cursor-pointer transition-colors duration-150'
            )}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </CollapsibleSection>

      {/* Category */}
      <CollapsibleSection title="Category">
        <div className="flex flex-col gap-2.5">
          {categoryOptions.map((opt) => {
            const isChecked =
              opt.value === 'all'
                ? !activeFilters.category
                : activeFilters.category === opt.value

            return (
              <label
                key={opt.value}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <span
                  className={cn(
                    'relative w-3.5 h-3.5 rounded-full border flex-shrink-0',
                    'transition-colors duration-150',
                    isChecked
                      ? 'border-gold-500 bg-gold-500'
                      : 'border-charcoal-300 group-hover:border-gold-400'
                  )}
                >
                  {isChecked && (
                    <span className="absolute inset-[3px] rounded-full bg-white" />
                  )}
                </span>
                <input
                  type="radio"
                  name="category"
                  value={opt.value}
                  checked={isChecked}
                  onChange={() => handleCategoryChange(opt.value)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    'text-xs transition-colors duration-150',
                    isChecked
                      ? 'text-charcoal-900 font-medium'
                      : 'text-charcoal-500 group-hover:text-charcoal-800'
                  )}
                >
                  {opt.label}
                </span>
              </label>
            )
          })}
        </div>
      </CollapsibleSection>

      {/* Fragrance Family */}
      <CollapsibleSection title="Fragrance Family">
        <div className="flex flex-col gap-2.5">
          {FRAGRANCE_FAMILIES.map((family) => {
            const isChecked =
              activeFilters.fragranceFamily?.includes(family) ?? false

            return (
              <label
                key={family}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <span
                  className={cn(
                    'relative w-3.5 h-3.5 border flex-shrink-0',
                    'transition-colors duration-150',
                    isChecked
                      ? 'border-gold-500 bg-gold-500'
                      : 'border-charcoal-300 group-hover:border-gold-400'
                  )}
                >
                  {isChecked && (
                    <svg
                      className="absolute inset-0 w-full h-full text-white"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.5 7L5.5 10L11.5 4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  value={family}
                  checked={isChecked}
                  onChange={(e) =>
                    handleFragranceFamilyChange(family, e.target.checked)
                  }
                  className="sr-only"
                />
                <span
                  className={cn(
                    'text-xs transition-colors duration-150',
                    isChecked
                      ? 'text-charcoal-900 font-medium'
                      : 'text-charcoal-500 group-hover:text-charcoal-800'
                  )}
                >
                  {family}
                </span>
              </label>
            )
          })}
        </div>
      </CollapsibleSection>

      {/* Price Range */}
      <CollapsibleSection title="Price Range">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="sr-only" htmlFor="price-min">
              Minimum price
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-charcoal-400">
                $
              </span>
              <input
                id="price-min"
                type="number"
                min={0}
                value={activeFilters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                placeholder="Min"
                className={cn(
                  'w-full pl-6 pr-2 py-2',
                  'border border-charcoal-200 bg-white',
                  'text-xs text-charcoal-700',
                  'focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500',
                  'transition-colors duration-150'
                )}
              />
            </div>
          </div>
          <span className="text-charcoal-300 text-xs select-none">—</span>
          <div className="flex-1">
            <label className="sr-only" htmlFor="price-max">
              Maximum price
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-charcoal-400">
                $
              </span>
              <input
                id="price-max"
                type="number"
                min={0}
                value={activeFilters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                placeholder="Max"
                className={cn(
                  'w-full pl-6 pr-2 py-2',
                  'border border-charcoal-200 bg-white',
                  'text-xs text-charcoal-700',
                  'focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500',
                  'transition-colors duration-150'
                )}
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </aside>
  )
}

// ─── Mobile drawer wrapper ─────────────────────────────────────────────────────

export function ProductFilters(props: ProductFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeCount = [
    props.activeFilters.category ? 1 : 0,
    (props.activeFilters.fragranceFamily?.length ?? 0),
    props.activeFilters.priceRange[0] !== DEFAULT_PRICE_RANGE[0] ||
    props.activeFilters.priceRange[1] !== DEFAULT_PRICE_RANGE[1]
      ? 1
      : 0,
    props.activeFilters.sortBy !== 'featured' ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <>
      {/* Desktop: static panel */}
      <div className="hidden lg:block w-56 shrink-0">
        <FilterPanel {...props} />
      </div>

      {/* Mobile: trigger button */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5',
            'border border-charcoal-200 bg-white',
            'text-xs font-medium tracking-[0.1em] uppercase text-charcoal-700',
            'hover:border-gold-500 hover:text-gold-500 transition-colors duration-150',
            'focus-visible:outline-none focus-visible:border-gold-500'
          )}
          aria-haspopup="dialog"
          aria-expanded={mobileOpen}
        >
          <SlidersHorizontal size={13} aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gold-500 text-white text-[9px] font-bold ml-0.5">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile: drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-charcoal-900/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Product filters"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 36 }}
              className={cn(
                'fixed inset-y-0 left-0 z-50 w-[min(340px,90vw)]',
                'bg-white shadow-2xl overflow-y-auto',
                'flex flex-col'
              )}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal-100 sticky top-0 bg-white z-10">
                <span className="text-sm font-semibold tracking-[0.12em] uppercase text-charcoal-900">
                  Filters
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-charcoal-500 hover:text-charcoal-900 focus-visible:outline-none focus-visible:text-gold-500 transition-colors"
                  aria-label="Close filters"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 px-5 pb-6">
                <FilterPanel {...props} />
              </div>

              {/* Drawer footer */}
              <div className="sticky bottom-0 bg-white border-t border-charcoal-100 px-5 py-4">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setMobileOpen(false)}
                >
                  View Results
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
