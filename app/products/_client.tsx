'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, X, SlidersHorizontal, ArrowRight, Search, Heart, Sparkles, DollarSign, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { urlFor } from '@/lib/sanity/image'
import { useUIStore } from '@/lib/store/ui-store'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product, Category, Collection } from '@/lib/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductsPageClientProps {
  products: Product[]
  categories: Category[]
  collections: Collection[]
}

export interface FilterState {
  category?: string
  fragranceFamily?: string[]
  inspiredBy?: string[]
  intensity?: string[]
  priceRange: [number, number]
  sortBy: string
}

type SortOption = 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'best_selling'

const DEFAULT_FILTER_STATE: FilterState = {
  category: undefined,
  fragranceFamily: undefined,
  inspiredBy: undefined,
  intensity: undefined,
  priceRange: [0, 10000],
  sortBy: 'featured',
}

const SORT_OPTIONS = [
  { value: 'featured',     label: 'Featured' },
  { value: 'newest',       label: 'Newest' },
  { value: 'price_asc',    label: 'Price: Low → High' },
  { value: 'price_desc',   label: 'Price: High → Low' },
  { value: 'best_selling', label: 'Best Selling' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPrice(p: Product) { return p.volume?.[0]?.price ?? p.price }

function normalise(s: string) { return s.trim().toLowerCase() }

function applyFiltersAndSort(products: Product[], filters: FilterState): Product[] {
  // Tag each product with its original Sanity order index
  const indexed = products.map((p, i) => ({ p, i }))

  const filtered = indexed.filter(({ p }) => {
    if (filters.category && p.category?.slug !== filters.category) return false
    if (filters.fragranceFamily?.length && !(p.fragranceFamily && filters.fragranceFamily.map(normalise).includes(normalise(p.fragranceFamily)))) return false
    if (filters.inspiredBy?.length && !filters.inspiredBy.some(b => p.tags?.some(t => normalise(t) === normalise(b)))) return false
    if (filters.intensity?.length && !(p.intensity && filters.intensity.map(normalise).includes(normalise(p.intensity)))) return false
    const [lo, hi] = filters.priceRange
    const pr = getPrice(p)
    if (pr < lo || pr > hi) return false
    return true
  })

  switch (filters.sortBy as SortOption) {
    case 'newest':
      // Products already come newest-first from Sanity; preserve original order
      filtered.sort((a, b) => a.i - b.i)
      break
    case 'price_asc':
      filtered.sort((a, b) => getPrice(a.p) - getPrice(b.p))
      break
    case 'price_desc':
      filtered.sort((a, b) => getPrice(b.p) - getPrice(a.p))
      break
    case 'best_selling':
      filtered.sort((a, b) => {
        if (a.p.bestSeller === b.p.bestSeller) return a.i - b.i
        return a.p.bestSeller ? -1 : 1
      })
      break
    default: // featured
      filtered.sort((a, b) => {
        if (a.p.featured === b.p.featured) return a.i - b.i
        return a.p.featured ? -1 : 1
      })
  }

  return filtered.map(({ p }) => p)
}

// ─── Category Tile — compact ──────────────────────────────────────────────────

function Tile({ label, imgUrl, active, onClick, href }: {
  label: string; imgUrl: string | null; active: boolean
  onClick?: () => void; href?: string
}) {
  const cls = cn(
    'group relative flex-shrink-0 flex h-[88px] w-[148px] overflow-hidden cursor-pointer',
    'transition-all duration-300',
    active
      ? 'ring-2 ring-[#C8A96E] ring-offset-2 ring-offset-[#EDE8E0] shadow-lg shadow-black/15'
      : 'hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5'
  )

  const inner = (
    <>
      <div className="absolute inset-0">
        {imgUrl ? (
          <Image
            src={imgUrl} alt={label} fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#2C2B29] via-[#3D3A35] to-[#1A1916]">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 70% 60%, #C8A96E 0%, transparent 55%)' }} />
          </div>
        )}
        <div className={cn(
          'absolute inset-0 transition-opacity duration-300',
          active
            ? 'bg-gradient-to-t from-black/88 via-black/35 to-black/10'
            : 'bg-gradient-to-t from-black/72 via-black/22 to-black/5 group-hover:from-black/80'
        )} />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-end p-3 pb-3">
        <span className="font-headline text-[9.5px] font-black uppercase leading-tight tracking-[0.14em] text-white drop-shadow-sm">
          {label.replace(/\n/g, ' ')}
        </span>
        <motion.div
          animate={{ width: active ? 20 : 0, opacity: active ? 1 : 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="mt-1.5 h-[1.5px] bg-[#C8A96E] origin-left"
        />
      </div>

      {active && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#C8A96E] to-transparent" />
      )}
    </>
  )

  if (href) return <Link href={href} className={cls}>{inner}</Link>
  return <button onClick={onClick} className={cls}>{inner}</button>
}

// ─── Category Tiles Row ───────────────────────────────────────────────────────

interface CategoryTilesProps {
  categories: Category[]
  collections: Collection[]
  filters: FilterState
  locale: string
  onChange: (f: FilterState) => void
}

function parseCollectionFilter(filterParam: string | undefined, base: FilterState): FilterState {
  if (!filterParam) return { ...base, category: undefined }
  const p = new URLSearchParams(filterParam)
  return {
    ...base,
    category: p.get('category') ?? undefined,
    sortBy: p.get('sort') ?? base.sortBy,
  }
}

function CategoryTiles({ categories, collections, filters, locale, onChange }: CategoryTilesProps) {
  const isAr = locale === 'ar'
  const validCategories = categories.filter(c => c.name_en || c.name_ar)

  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <Tile
        label={isAr ? 'كل العطور' : 'All Perfumes'}
        imgUrl={null}
        active={!filters.category}
        onClick={() => onChange({ ...filters, category: undefined })}
      />
      {validCategories.map(c => (
        <Tile
          key={c.slug}
          label={isAr ? (c.name_ar || c.name_en) : c.name_en}
          imgUrl={c.image?.asset?._ref ? urlFor(c.image).width(200).height(140).url() : null}
          active={filters.category === c.slug}
          onClick={() => onChange({ ...filters, category: c.slug })}
        />
      ))}
      {collections.map(c => (
        <Tile
          key={c._id}
          label={isAr ? (c.title_ar || c.title_en) : c.title_en}
          imgUrl={c.imageUrl ?? null}
          active={false}
          onClick={() => onChange(parseCollectionFilter(c.filterParam, filters))}
        />
      ))}
    </div>
  )
}

// ─── Filter Pill ──────────────────────────────────────────────────────────────

function FilterPill({
  icon, label, activeCount, children,
}: {
  icon?: React.ReactNode
  label: string
  activeCount?: number
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const hasActive = activeCount && activeCount > 0

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-1.5 rounded-full border px-3.5 py-[8px] text-[11px] font-medium transition-all duration-200',
          open || hasActive
            ? 'border-charcoal-900 bg-charcoal-900 text-white shadow-md shadow-black/10'
            : 'border-charcoal-200 bg-white text-charcoal-700 hover:border-charcoal-400 hover:shadow-sm'
        )}
      >
        {icon && <span className="opacity-70">{icon}</span>}
        {label}
        {hasActive ? (
          <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#C8A96E] text-[8.5px] font-bold text-white">
            {activeCount}
          </span>
        ) : (
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }} className="flex opacity-50">
            <ChevronDown className="h-3 w-3" />
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="absolute left-0 top-full z-30 mt-2.5 min-w-[220px] overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-2xl shadow-black/15"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

interface FilterBarProps {
  filters: FilterState
  onChange: (f: FilterState) => void
  onClearAll: () => void
  onOpenSearch: () => void
  fragranceFamilies: string[]
  brandTags: string[]
  intensities: string[]
  priceMin: number
  priceMax: number
}

function FilterBar({
  filters, onChange, onClearAll, onOpenSearch,
  fragranceFamilies, brandTags, intensities, priceMin, priceMax,
}: FilterBarProps) {
  const totalActive = [
    filters.category ? 1 : 0,
    filters.fragranceFamily?.length ?? 0,
    filters.inspiredBy?.length ?? 0,
    filters.intensity?.length ?? 0,
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 10000) ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
    }
    if (sortOpen) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [sortOpen])

  function toggle<K extends 'fragranceFamily' | 'inspiredBy' | 'intensity'>(key: K, val: string) {
    const cur = (filters[key] ?? []) as string[]
    const next = cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val]
    onChange({ ...filters, [key]: next.length ? next : undefined })
  }

  // Dynamic price presets based on actual range
  const PRICE_PRESETS: { label: string; range: [number, number] }[] = useMemo(() => {
    const lo = Math.floor(priceMin / 50) * 50
    const hi = Math.ceil(priceMax / 50) * 50
    const mid = Math.round((lo + hi) / 2 / 50) * 50
    return [
      { label: `Under AED ${mid}`,         range: [0, mid] },
      { label: `AED ${mid}–${hi}`,         range: [mid, hi] },
      { label: `Over AED ${hi}`,           range: [hi, 10000] },
    ]
  }, [priceMin, priceMax])

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>

      {/* Sort & Filter */}
      <div ref={sortRef} className="relative flex-shrink-0">
        <button
          onClick={() => setSortOpen(v => !v)}
          className={cn(
            'flex items-center gap-2 rounded-full border-2 px-4 py-[8px] text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-200',
            totalActive > 0 || sortOpen
              ? 'border-charcoal-950 bg-charcoal-950 text-white shadow-lg shadow-black/20'
              : 'border-charcoal-900 bg-white text-charcoal-900 hover:bg-charcoal-950 hover:border-charcoal-950 hover:text-white'
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Sort & Filter
          {totalActive > 0 && (
            <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#C8A96E] text-[8.5px] font-bold text-white">
              {totalActive}
            </span>
          )}
        </button>
        <AnimatePresence>
          {sortOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="absolute left-0 top-full z-30 mt-2.5 w-52 overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-2xl shadow-black/15"
            >
              <div className="p-1.5">
                <p className="px-3 py-2 text-[9px] font-bold uppercase tracking-[0.3em] text-charcoal-400">Sort by</p>
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { onChange({ ...filters, sortBy: opt.value }); setSortOpen(false) }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[11.5px] transition-colors',
                      filters.sortBy === opt.value
                        ? 'bg-charcoal-950 font-semibold text-white'
                        : 'text-charcoal-700 hover:bg-charcoal-50'
                    )}
                  >
                    {opt.label}
                    {filters.sortBy === opt.value && <span className="text-[#C8A96E] text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <button
        onClick={onOpenSearch}
        className="flex min-w-[180px] max-w-[280px] flex-1 items-center gap-2 rounded-full border border-charcoal-200 bg-[#FAFAF9] px-4 py-[8px] text-[11px] text-charcoal-400 transition-all duration-200 hover:border-charcoal-400 hover:bg-white hover:shadow-sm"
      >
        <Search className="h-3.5 w-3.5 flex-shrink-0 text-charcoal-400" />
        <span className="truncate">Search scents, brands…</span>
      </button>

      {/* Pills */}
      <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">

        {/* Scent family — dynamic from products */}
        {fragranceFamilies.length > 0 && (
          <FilterPill
            icon={<Sparkles className="h-3 w-3" />}
            label="Scent"
            activeCount={filters.fragranceFamily?.length}
          >
            <div className="p-3">
              <p className="mb-2.5 text-[8.5px] font-bold uppercase tracking-[0.3em] text-charcoal-400">Fragrance family</p>
              <div className="flex flex-wrap gap-1.5">
                {fragranceFamilies.map(f => {
                  const active = filters.fragranceFamily?.map(normalise).includes(normalise(f))
                  return (
                    <button
                      key={f}
                      onClick={() => toggle('fragranceFamily', f)}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-[10.5px] font-medium transition-all duration-150',
                        active
                          ? 'border-charcoal-950 bg-charcoal-950 text-white'
                          : 'border-charcoal-200 text-charcoal-600 hover:border-charcoal-500 hover:bg-charcoal-50'
                      )}
                    >
                      {f}
                    </button>
                  )
                })}
              </div>
            </div>
          </FilterPill>
        )}

        {/* Inspired by — dynamic from product tags */}
        {brandTags.length > 0 && (
          <FilterPill
            icon={<Heart className="h-3 w-3" />}
            label="Inspired by"
            activeCount={filters.inspiredBy?.length}
          >
            <div className="max-h-60 overflow-y-auto py-1">
              <p className="sticky top-0 bg-white px-4 py-2.5 text-[8.5px] font-bold uppercase tracking-[0.3em] text-charcoal-400 border-b border-charcoal-50">
                Luxury Houses
              </p>
              {brandTags.map(brand => {
                const active = filters.inspiredBy?.map(normalise).includes(normalise(brand))
                return (
                  <button
                    key={brand}
                    onClick={() => toggle('inspiredBy', brand)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2 text-left text-[11.5px] transition-colors',
                      active ? 'bg-charcoal-50 font-semibold text-charcoal-950' : 'text-charcoal-600 hover:bg-charcoal-50'
                    )}
                  >
                    <span className={cn(
                      'flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded border-2 transition-all',
                      active ? 'border-charcoal-950 bg-charcoal-950' : 'border-charcoal-300'
                    )}>
                      {active && <span className="text-[8px] font-bold text-white">✓</span>}
                    </span>
                    {brand}
                  </button>
                )
              })}
            </div>
          </FilterPill>
        )}

        {/* Intensity — dynamic from products */}
        {intensities.length > 0 && (
          <FilterPill
            icon={<Zap className="h-3 w-3" />}
            label="Intensity"
            activeCount={filters.intensity?.length}
          >
            <div className="p-1.5">
              <p className="px-3 py-2 text-[8.5px] font-bold uppercase tracking-[0.3em] text-charcoal-400">Strength</p>
              {intensities.map(level => {
                const active = filters.intensity?.map(normalise).includes(normalise(level))
                return (
                  <button
                    key={level}
                    onClick={() => toggle('intensity', level)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[11.5px] transition-colors',
                      active ? 'bg-charcoal-950 font-semibold text-white' : 'text-charcoal-700 hover:bg-charcoal-50'
                    )}
                  >
                    {level}
                    {active && <span className="text-[#C8A96E] text-[10px]">✓</span>}
                  </button>
                )
              })}
            </div>
          </FilterPill>
        )}

        {/* Price */}
        <FilterPill
          icon={<DollarSign className="h-3 w-3" />}
          label="Price"
          activeCount={(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 10000) ? 1 : 0}
        >
          <div className="p-1.5">
            <button
              onClick={() => onChange({ ...filters, priceRange: [0, 10000] })}
              className={cn(
                'flex w-full items-center justify-between rounded-xl px-3 py-2 text-[11.5px] transition-colors',
                filters.priceRange[0] === 0 && filters.priceRange[1] === 10000
                  ? 'bg-charcoal-950 font-semibold text-white'
                  : 'text-charcoal-700 hover:bg-charcoal-50'
              )}
            >
              Any Price
            </button>
            {PRICE_PRESETS.map(p => {
              const active = filters.priceRange[0] === p.range[0] && filters.priceRange[1] === p.range[1]
              return (
                <button
                  key={p.label}
                  onClick={() => onChange({ ...filters, priceRange: p.range })}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-3 py-2 text-[11.5px] transition-colors',
                    active ? 'bg-charcoal-950 font-semibold text-white' : 'text-charcoal-700 hover:bg-charcoal-50'
                  )}
                >
                  {p.label}
                </button>
              )
            })}
          </div>
        </FilterPill>

        {totalActive > 0 && (
          <button
            onClick={onClearAll}
            className="flex-shrink-0 text-[10.5px] font-medium text-charcoal-400 underline underline-offset-2 transition-colors hover:text-charcoal-900"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Active chips ─────────────────────────────────────────────────────────────

function ActiveChips({ filters, categories, locale, onChange }: {
  filters: FilterState; categories: Category[]
  locale: string; onChange: (f: FilterState) => void
}) {
  const isAr = locale === 'ar'
  const chips: { label: string; onRemove: () => void }[] = []

  if (filters.category) {
    const cat = categories.find(c => c.slug === filters.category)
    chips.push({
      label: cat ? (isAr ? (cat.name_ar || cat.name_en) : cat.name_en) : filters.category,
      onRemove: () => onChange({ ...filters, category: undefined }),
    })
  }
  filters.fragranceFamily?.forEach(f => chips.push({
    label: f, onRemove: () => onChange({ ...filters, fragranceFamily: filters.fragranceFamily?.filter(x => x !== f) })
  }))
  filters.inspiredBy?.forEach(b => chips.push({
    label: `Inspired by ${b}`, onRemove: () => onChange({ ...filters, inspiredBy: filters.inspiredBy?.filter(x => x !== b) })
  }))
  filters.intensity?.forEach(i => chips.push({
    label: i, onRemove: () => onChange({ ...filters, intensity: filters.intensity?.filter(x => x !== i) })
  }))
  if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 10000)
    chips.push({ label: `AED ${filters.priceRange[0]}–${filters.priceRange[1]}`, onRemove: () => onChange({ ...filters, priceRange: [0, 10000] }) })

  if (!chips.length) return null
  return (
    <div className="mb-5 flex flex-wrap gap-1.5">
      {chips.map(c => (
        <motion.span
          key={c.label}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.88 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#C8A96E]/40 bg-[#FBF6EE] px-3 py-1 text-[10.5px] font-medium text-charcoal-700 shadow-sm"
        >
          {c.label}
          <button onClick={c.onRemove} className="text-charcoal-400 hover:text-charcoal-900 transition-colors ml-0.5">
            <X className="h-2.5 w-2.5" />
          </button>
        </motion.span>
      ))}
    </div>
  )
}

// ─── Editorial Card ───────────────────────────────────────────────────────────

function EditorialCard({ collection, locale }: { collection: Collection; locale: string }) {
  const isAr = locale === 'ar'
  const title = isAr ? (collection.title_ar || collection.title_en) : collection.title_en
  const href = `/${locale}/products${collection.filterParam ? `?${collection.filterParam}` : ''}`
  return (
    <Link href={href} className="group relative block overflow-hidden bg-charcoal-950 aspect-[3/4]">
      {collection.imageUrl && (
        <Image
          src={collection.imageUrl} alt={title} fill
          className="object-cover object-center opacity-55 transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8A96E]/10 via-transparent to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <span className="inline-block border border-[#C8A96E]/60 px-2.5 py-0.5 text-[7.5px] font-bold uppercase tracking-[0.35em] text-[#C8A96E]">
          {isAr ? 'مميز' : 'Featured'}
        </span>
        <div>
          <div className="mb-2.5 h-px w-7 bg-[#C8A96E]/60" />
          <p className="mb-1 text-[8px] uppercase tracking-[0.35em] text-white/50">
            {isAr ? 'اكتشف' : 'Discover'}
          </p>
          <h3 className="mb-3.5 font-display text-lg font-light leading-tight text-white">
            {title}
            <span className="block text-[#C8A96E] italic">Collection</span>
          </h3>
          <span className="inline-flex items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-[0.3em] text-white/60 transition-all duration-300 group-hover:text-[#C8A96E] group-hover:gap-2.5">
            {isAr ? 'تسوق' : 'Shop Now'}
            <ArrowRight className="h-2.5 w-2.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}


// ─── Main Client Component ────────────────────────────────────────────────────

export function ProductsPageClient({ products, categories, collections }: ProductsPageClientProps) {
  const searchParams = useSearchParams()
  const locale = useLocale()
  const { openSearch } = useUIStore()

  // ── Derive dynamic filter options from actual product data ─────────────────
  const fragranceFamilies = useMemo(
    () => [...new Set(products.map(p => p.fragranceFamily).filter(Boolean))].sort() as string[],
    [products]
  )
  const brandTags = useMemo(
    () => [...new Set(products.flatMap(p => p.tags ?? []).filter(Boolean))].sort(),
    [products]
  )
  const intensities = useMemo(
    () => [...new Set(products.map(p => p.intensity).filter(Boolean))].sort() as string[],
    [products]
  )
  const priceMin = useMemo(() => products.length ? Math.floor(Math.min(...products.map(p => getPrice(p)))) : 0, [products])
  const priceMax = useMemo(() => products.length ? Math.ceil(Math.max(...products.map(p => getPrice(p)))) : 10000, [products])

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTER_STATE,
    category: searchParams.get('category') ?? undefined,
    sortBy: searchParams.get('sort') ?? 'featured',
  }))

  const processedProducts = useMemo(() => applyFiltersAndSort(products, filters), [products, filters])

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  const clearAll = useCallback(() => {
    setFilters(DEFAULT_FILTER_STATE)
  }, [])

  const showEditorial = !filters.category && !filters.fragranceFamily?.length
    && !filters.inspiredBy?.length && !filters.intensity?.length
    && filters.sortBy === 'featured' && !!collections[0]?.imageUrl

  const isAr = locale === 'ar'
  const activeCategory = filters.category
    ? categories.find(c => c.slug === filters.category)
    : null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-white pt-[72px]"
    >
      {/* ── Category Tiles ── */}
      <div className="bg-[#EDE8E0] px-4 pb-4 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <p className="mb-2.5 text-[8px] font-bold uppercase tracking-[0.35em] text-charcoal-500">Browse by category</p>
          <CategoryTiles
            categories={categories}
            collections={collections}
            filters={filters}
            locale={locale}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* ── Filter Bar — sticky ── */}
      <div className="sticky top-[72px] z-20 border-b border-charcoal-100 bg-white/95 backdrop-blur-sm px-4 py-2.5 shadow-sm sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <FilterBar
            filters={filters}
            onChange={handleFilterChange}
            onClearAll={clearAll}
            onOpenSearch={openSearch}
            fragranceFamilies={fragranceFamilies}
            brandTags={brandTags}
            intensities={intensities}
            priceMin={priceMin}
            priceMax={priceMax}
          />
        </div>
      </div>

      {/* ── Products ── */}
      <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-5 sm:px-6 lg:px-8">

        <ActiveChips
          filters={filters}
          categories={categories}
          locale={locale}
          onChange={handleFilterChange}
        />

        {activeCategory ? (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h2 className="font-display text-xl font-light text-charcoal-950">
              {isAr ? (activeCategory.name_ar || activeCategory.name_en) : activeCategory.name_en}
              <span className="ml-3 font-body text-sm font-normal text-charcoal-400">
                {processedProducts.length} items
              </span>
            </h2>
            <div className="mt-2 h-px w-10 bg-[#C8A96E]" />
          </motion.div>
        ) : (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-[12px] text-charcoal-500">
              Inspired by the world's finest maisons —{' '}
              <span className="font-semibold text-charcoal-800">at a fraction of the price.</span>
            </p>
            <p className="flex-shrink-0 ml-4 text-[12px] font-semibold text-charcoal-900">
              {processedProducts.length} Products
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${filters.category}-${filters.sortBy}-${filters.fragranceFamily?.join()}-${filters.inspiredBy?.join()}-${filters.intensity?.join()}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {processedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10">
                {showEditorial && (
                  <EditorialCard collection={collections[0]} locale={locale} />
                )}
                {processedProducts.map((product, i) => (
                  <ProductCard key={product._id} product={product} priority={i < 5} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-24 text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-charcoal-50">
                  <SlidersHorizontal className="h-6 w-6 text-charcoal-300" strokeWidth={1.25} />
                </div>
                <h3 className="mb-2 font-display text-xl font-light text-charcoal-700">No fragrances match</h3>
                <p className="mb-7 text-sm text-charcoal-400 max-w-xs">
                  Try adjusting your filters or explore the full collection.
                </p>
                <button
                  onClick={clearAll}
                  className="rounded-full border-2 border-charcoal-950 px-8 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-charcoal-950 transition-all duration-200 hover:bg-charcoal-950 hover:text-white"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
