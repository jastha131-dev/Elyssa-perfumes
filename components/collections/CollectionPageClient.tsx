'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, SlidersHorizontal, ChevronDown, X, Sparkles, Search } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { useCurrencyStore } from '@/lib/store/currency-store'
import { PriceText } from '@/components/ui/PriceText'
import type { CollectionDetail, Product } from '@/lib/types'

const LOCAL_IMAGES = ['/images/products/default-product.jpeg', '/images/products/p1.jpeg', '/images/products/p2.jpeg', '/images/products/p3.jpeg']

const SORT_OPTIONS = [
  { label: 'Best Selling', value: 'best_selling' },
  { label: 'Most Popular', value: 'featured' },
  { label: 'New Arrivals', value: 'new_arrivals' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name A–Z', value: 'name_asc' },
]

// Designer fragrance → keyword tags for smart search
const DESIGNER_SEARCH_MAP: Record<string, string[]> = {
  sauvage: ['sauvage', 'dior', 'fresh', 'woody', 'spicy'],
  'dior sauvage': ['sauvage', 'dior'],
  aventus: ['aventus', 'creed', 'fruity', 'woody'],
  'creed aventus': ['aventus', 'creed'],
  'br540': ['br540', 'baccarat', 'rouge', 'mfk', 'floral', 'woody'],
  'baccarat rouge': ['br540', 'baccarat', 'mfk'],
  'bleu de chanel': ['bleu', 'chanel', 'woody', 'aromatic'],
  bleu: ['bleu', 'chanel'],
  'black opium': ['black opium', 'ysl', 'sweet', 'vanilla'],
  'good girl': ['good girl', 'carolina herrera', 'floral'],
  libre: ['libre', 'ysl', 'floral', 'lavender'],
  'acqua di gio': ['acqua', 'armani', 'aquatic', 'citrus'],
  acqua: ['acqua', 'armani', 'aquatic'],
  'ysl y': ['ysl', 'fresh', 'apple'],
  'tom ford': ['tom ford', 'luxury'],
  'la vie est belle': ['lancome', 'floral', 'sweet'],
  'one million': ['paco rabanne', 'spicy', 'woody'],
  'invictus': ['paco rabanne', 'aquatic', 'fresh'],
}

// AED price ranges (rate ≈ 3.67 → convert back to USD for filtering)
const AED_RATE = 3.67
const PRICE_PRESETS = [
  { label: 'Any Price', range: [0, 99999] as [number, number] },
  { label: 'Under AED 50', range: [0, Math.round(50 / AED_RATE)] as [number, number] },
  { label: 'AED 50 – 99', range: [Math.round(50 / AED_RATE), Math.round(99 / AED_RATE)] as [number, number] },
  { label: 'AED 100 – 149', range: [Math.round(100 / AED_RATE), Math.round(149 / AED_RATE)] as [number, number] },
  { label: 'AED 150+', range: [Math.round(150 / AED_RATE), 99999] as [number, number] },
]

const GENDER_OPTIONS = [
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'Unisex', value: 'unisex' },
]

const OCCASION_OPTIONS = [
  { label: 'Everyday', value: 'everyday' },
  { label: 'Office', value: 'office' },
  { label: 'Date Night', value: 'date-night' },
  { label: 'Party', value: 'party' },
  { label: 'Summer', value: 'summer' },
  { label: 'Winter', value: 'winter' },
]

const BRAND_OPTIONS = [
  { label: 'Dior', value: 'dior' },
  { label: 'Chanel', value: 'chanel' },
  { label: 'Tom Ford', value: 'tom-ford' },
  { label: 'Creed', value: 'creed' },
  { label: 'YSL', value: 'ysl' },
  { label: 'Armani', value: 'armani' },
  { label: 'MFK', value: 'mfk' },
  { label: 'Carolina Herrera', value: 'carolina-herrera' },
  { label: 'Paco Rabanne', value: 'paco-rabanne' },
  { label: 'Others', value: 'others' },
]

const PERFORMANCE_OPTIONS = [
  { label: 'Moderate', value: 'Moderate' },
  { label: 'Long Lasting', value: 'Long' },
  { label: 'Beast Mode', value: 'Beast Mode' },
]

function getPrice(p: Product) { return p.volume?.[0]?.price ?? p.price }
function norm(s: string) { return s.trim().toLowerCase() }

function hasTag(p: Product, tag: string) {
  return (p.tags ?? []).some(t => norm(t) === norm(tag) || norm(t).includes(norm(tag)))
}

function smartSearchMatch(p: Product, query: string): boolean {
  if (!query.trim()) return true
  const q = query.toLowerCase().trim()
  const name = (p.name_en ?? '').toLowerCase()
  const family = (p.fragranceFamily ?? '').toLowerCase()
  const tags = (p.tags ?? []).map(t => t.toLowerCase())
  const desc = ((p as unknown as Record<string, unknown>).description_en as string ?? '').toLowerCase()

  if (name.includes(q) || family.includes(q)) return true
  if (tags.some(t => t.includes(q))) return true
  if (desc.includes(q)) return true

  // Check designer map
  for (const [key, keywords] of Object.entries(DESIGNER_SEARCH_MAP)) {
    if (q.includes(key) || key.includes(q)) {
      if (keywords.some(k => tags.includes(k) || name.includes(k) || family.includes(k))) return true
    }
  }
  return false
}

function applyFilters(products: Product[], filters: {
  gender: string[]
  fragranceFamily: string[]
  occasion: string[]
  inspiredBy: string[]
  performance: string[]
  priceRange: [number, number]
  inStock: boolean
  sort: string
  search: string
}): Product[] {
  let arr = [...products]

  if (filters.search.trim()) {
    arr = arr.filter(p => smartSearchMatch(p, filters.search))
  }
  if (filters.gender.length) {
    arr = arr.filter(p => filters.gender.some(g => hasTag(p, g)))
  }
  if (filters.fragranceFamily.length) {
    arr = arr.filter(p => p.fragranceFamily && filters.fragranceFamily.map(norm).includes(norm(p.fragranceFamily)))
  }
  if (filters.occasion.length) {
    arr = arr.filter(p => filters.occasion.some(o => hasTag(p, o)))
  }
  if (filters.inspiredBy.length) {
    arr = arr.filter(p => filters.inspiredBy.some(b => hasTag(p, b)))
  }
  if (filters.performance.length) {
    arr = arr.filter(p => {
      const longevity = (p.longevity ?? '').toLowerCase()
      const intensity = (p.intensity ?? '').toLowerCase()
      return filters.performance.some(perf => {
        if (perf === 'Beast Mode') return longevity.includes('very long') || intensity === 'intense'
        if (perf === 'Long') return longevity.includes('long')
        if (perf === 'Moderate') return longevity.includes('moderate') || intensity === 'moderate'
        return false
      })
    })
  }
  if (filters.inStock) {
    arr = arr.filter(p => (p.stock ?? 0) > 0)
  }
  const [lo, hi] = filters.priceRange
  arr = arr.filter(p => { const pr = getPrice(p); return pr >= lo && pr <= hi })

  switch (filters.sort) {
    case 'best_selling': return arr.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0))
    case 'featured': return arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    case 'new_arrivals': return arr.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0))
    case 'price_asc': return arr.sort((a, b) => getPrice(a) - getPrice(b))
    case 'price_desc': return arr.sort((a, b) => getPrice(b) - getPrice(a))
    case 'name_asc': return arr.sort((a, b) => a.name_en.localeCompare(b.name_en))
    default: return arr
  }
}

// ─── Filter Pill ──────────────────────────────────────────────────────────────

function FilterPill({ icon, label, activeCount, children }: {
  icon?: React.ReactNode; label: string; activeCount?: number; children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const hasActive = activeCount && activeCount > 0

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-1.5 rounded-full border px-3.5 py-[8px] text-[11px] font-medium transition-all duration-200',
          open || hasActive ? 'border-camel-500 bg-camel-500 text-white' : 'border-stone-200 bg-white text-ink-700 hover:border-stone-400'
        )}
      >
        {icon && <span className="opacity-70">{icon}</span>}
        {label}
        {hasActive ? (
          <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full bg-white/30 text-[8.5px] font-bold">{activeCount}</span>
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
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-2.5 min-w-[200px] overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-2xl"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CheckOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn('flex w-full items-center justify-between rounded-xl px-3 py-2 text-[11.5px] transition-colors', active ? 'bg-camel-500 font-semibold text-white' : 'text-ink-700 hover:bg-stone-50')}>
      {label}
      {active && <span className="text-[10px]">✓</span>}
    </button>
  )
}

function TagOptions({ options, active, onToggle }: {
  options: { label: string; value: string }[]
  active: string[]
  onToggle: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(o => {
        const isActive = active.map(norm).includes(norm(o.value))
        return (
          <button key={o.value} onClick={() => onToggle(o.value)}
            className={cn('rounded-full border px-3 py-1.5 text-[10.5px] font-medium transition-all', isActive ? 'border-camel-500 bg-camel-500 text-white' : 'border-stone-200 text-ink-600 hover:border-stone-400')}
          >{o.label}</button>
        )
      })}
    </div>
  )
}

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }
const cardVariants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }

interface Props { collection: CollectionDetail; products: Product[] }

export default function CollectionPageClient({ collection, products }: Props) {
  const locale = useLocale()
  const t = useTranslations('filters')
  const isAr = locale === 'ar'
  useCurrencyStore()

  const [sort, setSort] = useState(collection.defaultSort ?? '_createdAt_desc')
  const [showSort, setShowSort] = useState(false)
  const [search, setSearch] = useState('')

  const [gender, setGender] = useState<string[]>([])
  const [fragranceFamily, setFragranceFamily] = useState<string[]>([])
  const [occasion, setOccasion] = useState<string[]>([])
  const [inspiredBy, setInspiredBy] = useState<string[]>([])
  const [performance, setPerformance] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 99999])
  const [inStock, setInStock] = useState(false)

  const sortRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handle(e: MouseEvent) { if (sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSort(false) }
    if (showSort) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [showSort])

  const families = useMemo(() => [...new Set(products.map(p => p.fragranceFamily).filter(Boolean))].sort() as string[], [products])

  const filtered = useMemo(() => applyFilters(products, { gender, fragranceFamily, occasion, inspiredBy, performance, priceRange, inStock, sort, search }), [products, gender, fragranceFamily, occasion, inspiredBy, performance, priceRange, inStock, sort, search])

  function toggle<T>(setter: React.Dispatch<React.SetStateAction<T[]>>, val: T) {
    setter(cur => cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val])
  }

  function clearAll() {
    setGender([]); setFragranceFamily([]); setOccasion([]); setInspiredBy([])
    setPerformance([]); setPriceRange([0, 99999]); setInStock(false); setSearch('')
  }

  const filterCount = gender.length + fragranceFamily.length + occasion.length + inspiredBy.length + performance.length +
    (priceRange[0] !== 0 || priceRange[1] !== 99999 ? 1 : 0) + (inStock ? 1 : 0)

  const title = isAr ? collection.title_ar : collection.title_en
  const headline = isAr ? collection.headline_ar : collection.headline_en
  const subtext = isAr ? collection.subtext_ar : collection.subtext_en
  const ctaLabel = isAr ? collection.cta?.label_ar : collection.cta?.label_en
  const cta2Label = isAr ? collection.ctaSecondary?.label_ar : collection.ctaSecondary?.label_en
  const cta3Label = isAr ? collection.ctaTertiary?.label_ar : collection.ctaTertiary?.label_en

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
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <p className="mb-3 font-body text-xs uppercase tracking-[0.35em] text-white/70">Collection</p>
            <h1 className="font-display font-light text-white text-4xl md:text-6xl leading-tight max-w-2xl">{headline || title}</h1>
            {subtext && <p className="mt-4 font-body text-base font-light text-white/70 max-w-lg leading-relaxed">{subtext}</p>}
            {((collection.cta?.link && ctaLabel) || (collection.ctaSecondary?.link && cta2Label)) && (
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                {collection.cta?.link && ctaLabel && (
                  <Link href={collection.cta.link} className="inline-flex items-center gap-2.5 bg-white px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink-900 hover:bg-stone-100 transition-colors">
                    {ctaLabel}<ArrowRight size={11} strokeWidth={2.5} />
                  </Link>
                )}
                {collection.ctaSecondary?.link && cta2Label && (
                  <Link href={collection.ctaSecondary.link} className="inline-flex items-center gap-2.5 border border-white/70 px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-colors">
                    {cta2Label}<ArrowRight size={11} strokeWidth={2.5} />
                  </Link>
                )}
                {collection.ctaTertiary?.link && cta3Label && (
                  <Link href={collection.ctaTertiary.link} className="inline-flex items-center gap-2.5 border border-white/70 px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-colors">
                    {cta3Label}<ArrowRight size={11} strokeWidth={2.5} />
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Smart Search */}
      <div className="border-b border-stone-100 bg-stone-50 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or try: Sauvage, Aventus, BR540, Bleu de Chanel…"
              className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-10 pr-10 text-sm text-ink-900 placeholder:text-stone-400 focus:border-camel-400 focus:outline-none focus:ring-2 focus:ring-camel-100"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-[72px] z-20 border-b border-stone-100 bg-white/95 backdrop-blur-sm px-4 py-2.5 sm:px-6 lg:px-8 overflow-visible">
        <div className="relative">
        <div className="mx-auto max-w-7xl flex items-center gap-2.5 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>


          {/* Sort & Filter */}
          <div ref={sortRef} className="relative flex-shrink-0">
            <button
              onClick={() => setShowSort(v => !v)}
              className={cn(
                'flex items-center gap-2 rounded-full border-2 px-4 py-[8px] text-[11px] font-bold uppercase tracking-[0.1em] transition-all',
                showSort ? 'border-camel-500 bg-camel-500 text-white' : 'border-camel-500 bg-white text-camel-600 hover:bg-camel-500 hover:text-white'
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Sort & Filter
              {filterCount > 0 && <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full bg-camel-500 text-[8.5px] font-bold text-white">{filterCount}</span>}
            </button>
            <AnimatePresence>
              {showSort && (
                <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full z-50 mt-2.5 w-52 overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-2xl"
                >
                  <div className="p-1.5">
                    <p className="px-3 py-2 text-[9px] font-bold uppercase tracking-[0.3em] text-ink-400">Sort by</p>
                    {SORT_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => { setSort(opt.value); setShowSort(false) }}
                        className={cn('flex w-full items-center justify-between rounded-xl px-3 py-2 text-[11.5px] transition-colors', sort === opt.value ? 'bg-camel-500 font-semibold text-white' : 'text-ink-700 hover:bg-stone-50')}
                      >
                        {opt.label}{sort === opt.value && <span className="text-[10px]">✓</span>}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Gender */}
          <FilterPill label="Gender" activeCount={gender.length}>
            <div className="p-3">
              <p className="mb-2.5 text-[8.5px] font-bold uppercase tracking-[0.3em] text-ink-400">Gender</p>
              <div className="flex flex-wrap gap-1.5">
                <TagOptions options={GENDER_OPTIONS} active={gender} onToggle={v => toggle(setGender, v)} />
              </div>
            </div>
          </FilterPill>

          {/* Scent family */}
          {families.length > 0 && (
            <FilterPill icon={<Sparkles className="h-3 w-3" />} label="Scent" activeCount={fragranceFamily.length}>
              <div className="p-3">
                <p className="mb-2.5 text-[8.5px] font-bold uppercase tracking-[0.3em] text-ink-400">Fragrance family</p>
                <div className="flex flex-wrap gap-1.5">
                  {families.map(f => {
                    const active = fragranceFamily.map(norm).includes(norm(f))
                    return (
                      <button key={f} onClick={() => toggle(setFragranceFamily, f)}
                        className={cn('rounded-full border px-3 py-1.5 text-[10.5px] font-medium transition-all', active ? 'border-camel-500 bg-camel-500 text-white' : 'border-stone-200 text-ink-600 hover:border-stone-400')}
                      >{f}</button>
                    )
                  })}
                </div>
              </div>
            </FilterPill>
          )}

          {/* Occasion */}
          <FilterPill label="Occasion" activeCount={occasion.length}>
            <div className="p-1.5">
              <p className="px-3 py-2 text-[8.5px] font-bold uppercase tracking-[0.3em] text-ink-400">Occasion</p>
              {OCCASION_OPTIONS.map(o => (
                <CheckOption key={o.value} label={o.label} active={occasion.map(norm).includes(norm(o.value))} onClick={() => toggle(setOccasion, o.value)} />
              ))}
            </div>
          </FilterPill>

          {/* Inspired By */}
          <FilterPill label="Inspired By" activeCount={inspiredBy.length}>
            <div className="p-3">
              <p className="mb-2.5 text-[8.5px] font-bold uppercase tracking-[0.3em] text-ink-400">Designer Brand</p>
              <div className="flex flex-wrap gap-1.5">
                <TagOptions options={BRAND_OPTIONS} active={inspiredBy} onToggle={v => toggle(setInspiredBy, v)} />
              </div>
            </div>
          </FilterPill>

          {/* Performance */}
          <FilterPill label="Performance" activeCount={performance.length}>
            <div className="p-1.5">
              <p className="px-3 py-2 text-[8.5px] font-bold uppercase tracking-[0.3em] text-ink-400">Longevity</p>
              {PERFORMANCE_OPTIONS.map(o => (
                <CheckOption key={o.value} label={o.label} active={performance.map(norm).includes(norm(o.value))} onClick={() => toggle(setPerformance, o.value)} />
              ))}
            </div>
          </FilterPill>

          {/* Price */}
          <FilterPill label="Price" activeCount={priceRange[0] !== 0 || priceRange[1] !== 99999 ? 1 : 0}>
            <div className="p-1.5">
              {PRICE_PRESETS.map(p => {
                const active = priceRange[0] === p.range[0] && priceRange[1] === p.range[1]
                return (
                  <button key={p.label} onClick={() => setPriceRange(p.range)}
                    className={cn('flex w-full items-center justify-between rounded-xl px-3 py-2 text-[11.5px] transition-colors', active ? 'bg-camel-500 font-semibold text-white' : 'text-ink-700 hover:bg-stone-50')}
                  >{p.label}{active && <span className="text-[10px]">✓</span>}</button>
                )
              })}
            </div>
          </FilterPill>

          {/* In Stock toggle */}
          <button
            onClick={() => setInStock(v => !v)}
            className={cn(
              'flex-shrink-0 flex items-center gap-1.5 rounded-full border px-3.5 py-[8px] text-[11px] font-medium transition-all',
              inStock ? 'border-camel-500 bg-camel-500 text-white' : 'border-stone-200 bg-white text-ink-700 hover:border-stone-400'
            )}
          >
            In Stock
            {inStock && <X className="h-3 w-3" onClick={e => { e.stopPropagation(); setInStock(false) }} />}
          </button>

          {(filterCount > 0 || search) && (
            <button onClick={clearAll} className="flex-shrink-0 text-[10.5px] font-medium text-ink-400 underline underline-offset-2 hover:text-ink-900 transition-colors ml-1">
              Clear all
            </button>
          )}
        </div>
        {/* Right fade hint — signals more pills to scroll to */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white/95 to-transparent" aria-hidden="true" />
        </div>
      </div>

      {/* Product grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10">
        <div className="mb-6 flex items-center justify-between">
          <p className="font-body text-sm text-ink-400">
            {filtered.length} {filtered.length === 1 ? 'fragrance' : 'fragrances'}
            {search && <span className="ml-1 text-camel-600">for "{search}"</span>}
          </p>
        </div>

        {/* Active chips */}
        <AnimatePresence>
          {(filterCount > 0 || search) && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-5 flex flex-wrap gap-1.5 overflow-hidden">
              {search && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-camel-300/40 bg-camel-50 px-3 py-1 text-[10.5px] font-medium text-ink-700">
                  🔍 {search}
                  <button onClick={() => setSearch('')} className="text-ink-400 hover:text-ink-900"><X className="h-2.5 w-2.5" /></button>
                </span>
              )}
              {[...gender, ...fragranceFamily, ...occasion, ...inspiredBy, ...performance].map(chip => (
                <span key={chip} className="inline-flex items-center gap-1.5 rounded-full border border-camel-300/40 bg-camel-50 px-3 py-1 text-[10.5px] font-medium text-ink-700">
                  {chip}
                  <button onClick={() => {
                    toggle(setGender, chip); toggle(setFragranceFamily, chip)
                    toggle(setOccasion, chip); toggle(setInspiredBy, chip); toggle(setPerformance, chip)
                  }} className="text-ink-400 hover:text-ink-900"><X className="h-2.5 w-2.5" /></button>
                </span>
              ))}
              {(priceRange[0] !== 0 || priceRange[1] !== 99999) && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-camel-300/40 bg-camel-50 px-3 py-1 text-[10.5px] font-medium text-ink-700">
                  {PRICE_PRESETS.find(p => p.range[0] === priceRange[0] && p.range[1] === priceRange[1])?.label ?? 'Custom price'}
                  <button onClick={() => setPriceRange([0, 99999])} className="text-ink-400 hover:text-ink-900"><X className="h-2.5 w-2.5" /></button>
                </span>
              )}
              {inStock && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-camel-300/40 bg-camel-50 px-3 py-1 text-[10.5px] font-medium text-ink-700">
                  In Stock
                  <button onClick={() => setInStock(false)} className="text-ink-400 hover:text-ink-900"><X className="h-2.5 w-2.5" /></button>
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-body text-sm text-ink-400 mb-4">No fragrances match your filters.</p>
            <button onClick={clearAll} className="rounded-full border-2 border-camel-500 px-6 py-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-camel-600 hover:bg-camel-500 hover:text-white transition-all">
              {t('clearFilters')}
            </button>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 gap-4 md:grid-cols-3 collection-grid">
            {filtered.map((product, idx) => {
              const name = isAr ? product.name_ar : product.name_en
              const imageUrl = product.images?.[0]?.url || LOCAL_IMAGES[idx % LOCAL_IMAGES.length]
              const price = getPrice(product)
              return (
                <motion.div key={product._id} variants={cardVariants} className="group">
                  <Link href={`/${locale}/products/${product.slug}`} className="block">
                    <div className="relative w-full overflow-hidden bg-stone-200" style={{ aspectRatio: '3/4' }}>
                      <Image src={imageUrl} alt={product.images?.[0]?.alt || name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
                      {product.new && <span className="absolute left-3 top-3 bg-camel-500 px-2.5 py-1 font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-white">New</span>}
                      {product.bestSeller && !product.new && <span className="absolute left-3 top-3 bg-azure-300 px-2.5 py-1 font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-charcoal-800">Best Seller</span>}
                    </div>
                    <div className="mt-3">
                      {product.fragranceFamily && <p className="font-body text-[10px] uppercase tracking-[0.22em] text-camel-500 mb-0.5">{product.fragranceFamily}</p>}
                      <h3 className="font-display text-base font-light text-ink-900 transition-colors group-hover:text-camel-600 leading-snug">{name}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        <PriceText amount={price} className="font-body text-sm font-medium text-ink-900" />
                        {product.compareAtPrice && product.compareAtPrice > price && <PriceText amount={product.compareAtPrice} className="font-body text-xs text-ink-400 line-through" />}
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
