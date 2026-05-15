import { Suspense } from 'react'
import { searchProducts } from '@/lib/sanity/fetch'
import { ProductGrid } from '@/components/product/ProductGrid'
import Link from 'next/link'
import type { Metadata } from 'next'

export function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Metadata {
  return { title: 'Search — Luxe Parfum' }
}

async function SearchResults({ q }: { q: string }) {
  const results = await searchProducts(q)

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center">
        <p className="font-display text-4xl font-light text-charcoal-900">No results</p>
        <p className="font-body text-sm text-charcoal-400">
          No fragrances found for <span className="text-charcoal-700">&ldquo;{q}&rdquo;</span>
        </p>
        <div className="mt-2 flex flex-col items-center gap-3">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-charcoal-400">Try searching for</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Oud', 'Rose', 'Amber', 'Citrus', 'Vetiver'].map((term) => (
              <Link
                key={term}
                href={`/search?q=${term}`}
                className="border border-charcoal-200 px-4 py-1.5 font-body text-xs text-charcoal-600 hover:border-gold-400 hover:text-gold-600 transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
        <Link
          href="/products"
          className="mt-4 bg-charcoal-900 px-8 py-3 font-body text-xs uppercase tracking-[0.18em] text-white hover:bg-gold-500 transition-colors"
        >
          View All Fragrances
        </Link>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-8 font-body text-sm text-charcoal-500">
        <span className="font-medium text-charcoal-900">{results.length}</span>{' '}
        {results.length === 1 ? 'result' : 'results'} for{' '}
        <span className="text-charcoal-700">&ldquo;{q}&rdquo;</span>
      </p>
      <ProductGrid products={results} />
    </div>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const query = q.trim()

  return (
    <main className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 border-b border-charcoal-100 pb-8">
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-charcoal-400">
            <Link href="/" className="hover:text-charcoal-700 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-charcoal-700">Search</span>
          </nav>
          <h1 className="font-display text-4xl font-light text-charcoal-900">
            {query ? `"${query}"` : 'Search'}
          </h1>
        </div>

        {query ? (
          <Suspense
            fallback={
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="aspect-[3/4] bg-charcoal-100 animate-pulse" />
                    <div className="h-3 w-3/4 bg-charcoal-100 animate-pulse rounded" />
                    <div className="h-3 w-1/2 bg-charcoal-100 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            }
          >
            <SearchResults q={query} />
          </Suspense>
        ) : (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="font-display text-3xl font-light text-charcoal-400">
              What are you looking for?
            </p>
            <Link
              href="/products"
              className="mt-4 border border-charcoal-200 px-8 py-3 font-body text-xs uppercase tracking-[0.18em] text-charcoal-700 hover:border-gold-400 hover:text-gold-600 transition-colors"
            >
              Browse All Fragrances
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
