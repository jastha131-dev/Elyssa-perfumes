'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, ArrowRight, TrendingUp } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useUIStore } from '@/lib/store/ui-store'
import { cn, formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/types'

const TRENDING_SEARCHES = ['Oud', 'Rose', 'Amber', 'Citrus', 'Vetiver', 'Jasmine']
const STORAGE_KEY = 'luxe-recent-searches'
const MAX_RECENT = 6

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function saveRecentSearch(query: string) {
  const trimmed = query.trim()
  if (!trimmed) return
  const existing = getRecentSearches().filter((s) => s.toLowerCase() !== trimmed.toLowerCase())
  const updated = [trimmed, ...existing].slice(0, MAX_RECENT)
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch { /* ignore */ }
}

function clearRecentSearches() {
  try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
}

export default function SearchOverlay() {
  const router = useRouter()
  const { isSearchOpen, closeSearch } = useUIStore()
  const t = useTranslations('search')
  const locale = useLocale()

  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [results, setResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load recent searches when overlay opens
  useEffect(() => {
    if (isSearchOpen) {
      setRecentSearches(getRecentSearches())
      setResults([])
      const timer = setTimeout(() => inputRef.current?.focus(), 120)
      return () => clearTimeout(timer)
    } else {
      setQuery('')
      setResults([])
    }
  }, [isSearchOpen])

  // Debounced live search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
        const data = await res.json()
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeSearch()
    }
    if (isSearchOpen) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isSearchOpen, closeSearch])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isSearchOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isSearchOpen])

  const handleSearch = useCallback(
    (searchQuery: string) => {
      const trimmed = searchQuery.trim()
      if (!trimmed) return
      saveRecentSearch(trimmed)
      closeSearch()
      router.push(`/${locale}/search?q=${encodeURIComponent(trimmed)}`)
    },
    [closeSearch, router, locale]
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    handleSearch(query)
  }

  function handleRemoveRecent(term: string) {
    const updated = recentSearches.filter((s) => s !== term)
    setRecentSearches(updated)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch { /* ignore */ }
  }

  const showRecent = recentSearches.length > 0 && !query
  const showTrending = !query
  const showResults = !!query
  const showPanel = showRecent || showTrending || showResults

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          key="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-charcoal-950/85 backdrop-blur-md"
            onClick={closeSearch}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="relative z-10 flex w-full flex-col items-center px-4 pt-16 sm:pt-24">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl"
            >
              {/* Search input */}
              <form onSubmit={handleSubmit}>
                <div
                  className={cn(
                    'flex items-center gap-4 rounded-2xl',
                    'border border-charcoal-700 bg-charcoal-900/90',
                    'px-5 py-4 shadow-2xl',
                    'focus-within:border-gold-500 transition-colors duration-200'
                  )}
                >
                  <Search className="h-5 w-5 flex-shrink-0 text-gold-500" aria-hidden="true" />
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('placeholder')}
                    autoComplete="off"
                    spellCheck={false}
                    className="flex-1 bg-transparent font-display text-lg text-cream-100 placeholder:text-charcoal-500 outline-none caret-gold-500"
                    aria-label="Search"
                  />
                  {isSearching && (
                    <span className="flex-shrink-0 h-4 w-4 rounded-full border-2 border-charcoal-600 border-t-gold-500 animate-spin" />
                  )}
                  {query && !isSearching && (
                    <motion.button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label="Clear search"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileTap={{ scale: 0.85 }}
                      className="flex-shrink-0 rounded-full p-1 text-charcoal-400 transition-colors hover:text-cream-100"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  )}
                  {query && (
                    <motion.button
                      type="submit"
                      aria-label="Submit search"
                      whileTap={{ scale: 0.9 }}
                      className="flex-shrink-0 rounded-full bg-gold-500 p-2 text-white transition-colors hover:bg-gold-400"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  )}
                </div>
              </form>

              {/* Results / suggestions panel */}
              <AnimatePresence>
                {showPanel && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 overflow-hidden rounded-2xl border border-charcoal-800 bg-charcoal-900/95 shadow-2xl max-h-[60vh] overflow-y-auto"
                  >
                    {/* Live search results */}
                    {showResults && (
                      <div className="px-3 py-3">
                        {results.length > 0 ? (
                          <>
                            <p className="px-2 mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-charcoal-500">
                              {results.length} result{results.length !== 1 ? 's' : ''}
                            </p>
                            <ul className="space-y-1">
                              {results.slice(0, 6).map((product) => (
                                <li key={product._id}>
                                  <Link
                                    href={`/${locale}/products/${product.slug}`}
                                    onClick={() => { saveRecentSearch(query); closeSearch() }}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-charcoal-800 transition-colors group"
                                  >
                                    {/* Thumbnail */}
                                    <div className="relative h-12 w-10 flex-shrink-0 overflow-hidden bg-charcoal-800 rounded">
                                      {product.images?.[0]?.url ? (
                                        <Image
                                          src={product.images[0].url}
                                          alt={product.images[0].alt || product.name}
                                          fill
                                          sizes="40px"
                                          className="object-cover"
                                        />
                                      ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                          <span className="font-display text-xs italic text-charcoal-500">
                                            {product.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                      <p className="font-display text-sm font-light text-cream-100 truncate group-hover:text-gold-400 transition-colors">
                                        {product.name}
                                      </p>
                                      <p className="text-[11px] text-charcoal-500 truncate">
                                        {product.category?.name} · {product.fragranceFamily}
                                      </p>
                                    </div>

                                    {/* Price */}
                                    <span className="flex-shrink-0 text-sm font-medium text-cream-200">
                                      {formatPrice(product.volume?.[0]?.price ?? product.price)}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                            {results.length > 6 && (
                              <button
                                onClick={() => handleSearch(query)}
                                className="mt-2 w-full rounded-xl py-2.5 text-center text-xs text-charcoal-400 hover:text-gold-400 hover:bg-charcoal-800 transition-colors"
                              >
                                See all {results.length} results →
                              </button>
                            )}
                          </>
                        ) : !isSearching ? (
                          <p className="px-3 py-6 text-center text-sm text-charcoal-500">
                            {t('noResults')} <span className="text-cream-300">&ldquo;{query}&rdquo;</span>
                          </p>
                        ) : null}
                      </div>
                    )}

                    {/* Recent searches */}
                    {showRecent && (
                      <div className={cn('px-5 py-4', showTrending && 'border-b border-charcoal-800')}>
                        <div className="mb-3 flex items-center justify-between">
                          <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-charcoal-500">
                            <Clock className="h-3 w-3" />
                            {t('recent')}
                          </span>
                          <button
                            onClick={() => { clearRecentSearches(); setRecentSearches([]) }}
                            className="text-[11px] text-charcoal-500 transition-colors hover:text-cream-100"
                          >
                            {t('clearAll')}
                          </button>
                        </div>
                        <ul className="flex flex-col gap-1">
                          {recentSearches.map((term) => (
                            <li key={term} className="group flex items-center gap-2">
                              <button
                                onClick={() => handleSearch(term)}
                                className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-charcoal-300 transition-colors hover:bg-charcoal-800 hover:text-cream-100"
                              >
                                <Clock className="h-3.5 w-3.5 flex-shrink-0 text-charcoal-600" />
                                {term}
                              </button>
                              <button
                                onClick={() => handleRemoveRecent(term)}
                                aria-label={`Remove ${term}`}
                                className="rounded-full p-1 text-charcoal-600 opacity-0 transition-all group-hover:opacity-100 hover:text-cream-100"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Trending */}
                    {showTrending && (
                      <div className="px-5 py-4">
                        <p className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-charcoal-500">
                          <TrendingUp className="h-3 w-3" />
                          {t('trending')}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {TRENDING_SEARCHES.map((term) => (
                            <motion.button
                              key={term}
                              onClick={() => handleSearch(term)}
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.96 }}
                              className="rounded-full border border-charcoal-700 px-4 py-1.5 text-xs text-charcoal-300 transition-all hover:border-gold-500 hover:text-gold-400"
                            >
                              {term}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Close button */}
          <motion.button
            onClick={closeSearch}
            aria-label="Close search"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
            whileTap={{ scale: 0.88 }}
            className="absolute right-4 top-4 z-10 rounded-full p-2 sm:right-8 sm:top-8 border border-charcoal-700 bg-charcoal-900/80 text-charcoal-300 transition-all hover:border-charcoal-500 hover:text-cream-100"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
