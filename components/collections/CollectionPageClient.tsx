'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, SlidersHorizontal, ChevronDown, X, Sparkles, Zap, DollarSign } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { useCurrencyStore } from '@/lib/store/currency-store'
import type { CollectionDetail, Product } from '@/lib/types'

const LOCAL_IMAGES = ['/images/products/default-product.jpeg', '/images/products/p1.jpeg', '/images/products/p2.jpeg', '/images/products/p3.jpeg']

const SORT_OPTIONS = [
  { label: 'Newest', value: '_createdAt_desc' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name A–Z', value: 'name_asc' },
]

function getPrice(p: Product) { return p.volume?.[0]?.price ?? p.price }
function norm(s: string) { return s.trim().toLowerCase() }

function applyFilters(products: Product[], filters: {
  fragranceFamily?: string[]
  intensity?: string[]
  priceRange: [number, number]
  sort: string
}): Product[] {
  let arr = [...products]
  if (filters.fragranceFamily?.length) {
    arr = arr.filter(p => p.fragranceFamily && filters.fragranceFamily!.map(norm).includes(norm(p.fragranceFamily)))
  }
  if (filters.intensity?.length) {
    arr = arr.filter(p => p.intensity && filters.intensity!.map(norm).includes(norm(p.intensity)))
  }
  const [lo, hi] = filters.priceRange
  arr = arr.filter(p => { const pr = getPrice(p); return pr >= lo && pr <= hi })
  switch (filters.sort) {
    case 'price_asc': return arr.sort((a, b) => getPrice(a) - getPrice(b))
    case 'price_desc': return arr.sort((a, b) => getPrice(b) - getPrice(a))
    case 'name_asc': return arr.sort((a, b) => a.name_en.localeCompare(b.name_en))
    default: return arr
  }
}

// ─── Filter Pill ─────────────────────────────────────────────────────────────

function FilterPill({ icon, label, activeCount, children }: {
  icon?: React.ReactNode; label: string; activeCount?: number; children: React.ReactNode
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
            ? 'border-camel-500 bg-camel-500 text-white'
            : 'border-stone-200 bg-white text-ink-700 hover:border-stone-400'
        )}
      >
        {icon && <span className="opacity-70">{icon}</span>}
        {label}
        {hasActive ? (
          <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full bg-camel-500 text-[8.5px] font-bold text-white">
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

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const cardVariants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }

interface Props { collection: CollectionDetail; products: Product[] }

export default function CollectionPageClient({ collection, products }: Props) {
  const locale = useLocale()
  const t = useTranslations('filters')
  const isAr = locale === 'ar'
  const formatPrice = useCurrencyStore((s) => s.format)

  const [sort, setSort] = useState(collection.defaultSort ?? '_createdAt_desc')
  const [showSort, setShowSort] = useState(false)
  const [fragranceFamily, setFragranceFamily] = useState<string[]>([])
  const [intensity, setIntensity] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 99999])

  const sortRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSort(false)
    }
    if (showSort) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [showSort])

  // Derive dynamic filter options
  const families = useMemo(() => [...new Set(products.map(p => p.fragranceFamily).filter(Boolean))].sort() as string[], [products])
  const intensities = useMemo(() => [...new Set(products.map(p => p.intensity).filter(Boolean))].sort() as string[], [products])
  const priceMin = useMemo(() => products.length ? Math.floor(Math.min(...products.map(p => getPrice(p)))) : 0, [products])
  const priceMax = useMemo(() => products.length ? Math.ceil(Math.max(...products.map(p => getPrice(p)))) : 999, [products])

  const PRICE_PRESETS = useMemo(() => {
    const mid = Math.round((priceMin + priceMax) / 2 / 50) * 50
    return [
      { label: `Under $${mid}`, range: [0, mid] as [number, number] },
      { label: `$${mid} – $${priceMax}`, range: [mid, priceMax] as [number, number] },
      { label: `Over $${priceMax}`, range: [priceMax, 99999] as [number, number] },
    ]
  }, [priceMin, priceMax])

  const filtered = useMemo(() => applyFilters(products, { fragranceFamily, intensity, priceRange, sort }), [products, fragranceFamily, intensity, priceRange, sort])

  function toggleFamily(f: string) {
    setFragranceFamily(cur => cur.includes(f) ? cur.filter(x => x !== f) : [...cur, f])
  }
  function toggleIntensity(i: string) {
    setIntensity(cur => cur.includes(i) ? cur.filter(x => x !== i) : [...cur, i])
  }
  function clearAll() {
    setFragranceFamily([]); setIntensity([]); setPriceRange([0, 99999])
  }
  const activeCount = fragranceFamily.length + intensity.length + (priceRange[0] !== 0 || priceRange[1] !== 99999 ? 1 : 0)

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

      {/* Sticky filter bar */}
      <div className="sticky top-[72px] z-20 border-b border-stone-100 bg-white/95 backdrop-blur-sm px-4 py-2.5 sm:px-6 lg:px-8 overflow-visible">
        <div className="mx-auto max-w-7xl flex items-center gap-2.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {/* Sort */}
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
              {activeCount > 0 && (
                <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full bg-camel-500 text-[8.5px] font-bold text-white">{activeCount}</span>
              )}
            </button>
            <AnimatePresence>
              {showSort && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full z-50 mt-2.5 w-52 overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-2xl"
                >
                  <div className="p-1.5">
                    <p className="px-3 py-2 text-[9px] font-bold uppercase tracking-[0.3em] text-ink-400">Sort by</p>
                    {SORT_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => { setSort(opt.value); setShowSort(false) }}
                        className={cn('flex w-full items-center justify-between rounded-xl px-3 py-2 text-[11.5px] transition-colors', sort === opt.value ? 'bg-camel-500 font-semibold text-white' : 'text-ink-700 hover:bg-stone-50')}
                      >
                        {opt.label}
                        {sort === opt.value && <span className="text-camel-400 text-[10px]">✓</span>}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scent family */}
          {families.length > 0 && (
            <FilterPill icon={<Sparkles className="h-3 w-3" />} label="Scent" activeCount={fragranceFamily.length}>
              <div className="p-3">
                <p className="mb-2.5 text-[8.5px] font-bold uppercase tracking-[0.3em] text-ink-400">Fragrance family</p>
                <div className="flex flex-wrap gap-1.5">
                  {families.map(f => {
                    const active = fragranceFamily.map(norm).includes(norm(f))
                    return (
                      <button key={f} onClick={() => toggleFamily(f)}
                        className={cn('rounded-full border px-3 py-1.5 text-[10.5px] font-medium transition-all', active ? 'border-camel-500 bg-camel-500 text-white' : 'border-stone-200 text-ink-600 hover:border-stone-400')}
                      >{f}</button>
                    )
                  })}
                </div>
              </div>
            </FilterPill>
          )}

          {/* Intensity */}
          {intensities.length > 0 && (
            <FilterPill icon={<Zap className="h-3 w-3" />} label="Intensity" activeCount={intensity.length}>
              <div className="p-1.5">
                <p className="px-3 py-2 text-[8.5px] font-bold uppercase tracking-[0.3em] text-ink-400">Strength</p>
                {intensities.map(level => {
                  const active = intensity.map(norm).includes(norm(level))
                  return (
                    <button key={level} onClick={() => toggleIntensity(level)}
                      className={cn('flex w-full items-center justify-between rounded-xl px-3 py-2 text-[11.5px] transition-colors', active ? 'bg-camel-500 font-semibold text-white' : 'text-ink-700 hover:bg-stone-50')}
                    >
                      {level}{active && <span className="text-camel-400 text-[10px]">✓</span>}
                    </button>
                  )
                })}
              </div>
            </FilterPill>
          )}

          {/* Price */}
          <FilterPill icon={<DollarSign className="h-3 w-3" />} label="Price" activeCount={priceRange[0] !== 0 || priceRange[1] !== 99999 ? 1 : 0}>
            <div className="p-1.5">
              <button onClick={() => setPriceRange([0, 99999])}
                className={cn('flex w-full items-center justify-between rounded-xl px-3 py-2 text-[11.5px] transition-colors', priceRange[0] === 0 && priceRange[1] === 99999 ? 'bg-camel-500 font-semibold text-white' : 'text-ink-700 hover:bg-stone-50')}
              >Any Price</button>
              {PRICE_PRESETS.map(p => {
                const active = priceRange[0] === p.range[0] && priceRange[1] === p.range[1]
                return (
                  <button key={p.label} onClick={() => setPriceRange(p.range)}
                    className={cn('flex w-full items-center justify-between rounded-xl px-3 py-2 text-[11.5px] transition-colors', active ? 'bg-camel-500 font-semibold text-white' : 'text-ink-700 hover:bg-stone-50')}
                  >{p.label}</button>
                )
              })}
            </div>
          </FilterPill>

          {activeCount > 0 && (
            <button onClick={clearAll} className="flex-shrink-0 text-[10.5px] font-medium text-ink-400 underline underline-offset-2 hover:text-ink-900 transition-colors ml-1">
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Product grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10">
        {/* Result count + active chips */}
        <div className="mb-6 flex items-center justify-between">
          <p className="font-body text-sm text-ink-400">{filtered.length} {filtered.length === 1 ? 'fragrance' : 'fragrances'}</p>
        </div>

        {/* Active filter chips */}
        <AnimatePresence>
          {activeCount > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-5 flex flex-wrap gap-1.5 overflow-hidden">
              {fragranceFamily.map(f => (
                <span key={f} className="inline-flex items-center gap-1.5 rounded-full border border-camel-300/40 bg-camel-50 px-3 py-1 text-[10.5px] font-medium text-ink-700">
                  {f}
                  <button onClick={() => toggleFamily(f)} className="text-ink-400 hover:text-ink-900"><X className="h-2.5 w-2.5" /></button>
                </span>
              ))}
              {intensity.map(i => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-camel-300/40 bg-camel-50 px-3 py-1 text-[10.5px] font-medium text-ink-700">
                  {i}
                  <button onClick={() => toggleIntensity(i)} className="text-ink-400 hover:text-ink-900"><X className="h-2.5 w-2.5" /></button>
                </span>
              ))}
              {(priceRange[0] !== 0 || priceRange[1] !== 99999) && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-camel-300/40 bg-camel-50 px-3 py-1 text-[10.5px] font-medium text-ink-700">
                  ${priceRange[0]} – {priceRange[1] === 99999 ? '∞' : `$${priceRange[1]}`}
                  <button onClick={() => setPriceRange([0, 99999])} className="text-ink-400 hover:text-ink-900"><X className="h-2.5 w-2.5" /></button>
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
                        <span className="font-body text-sm font-medium text-ink-900">{formatPrice(price)}</span>
                        {product.compareAtPrice && product.compareAtPrice > price && <span className="font-body text-xs text-ink-400 line-through">{formatPrice(product.compareAtPrice)}</span>}
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
