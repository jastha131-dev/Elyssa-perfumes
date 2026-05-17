import { Suspense } from 'react'
import { getAllProducts, getAllCategories } from '@/lib/sanity/fetch'
import { ProductsPageClient } from '@/app/products/_client'

export const revalidate = 3600

export const metadata = {
  title: 'All Fragrances',
  description:
    'Explore our full collection of handcrafted luxury fragrances. Filter by category, fragrance family, and price to find your perfect scent.',
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ])

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
            <p className="font-body text-sm tracking-widest uppercase text-charcoal-400">
              Loading fragrances…
            </p>
          </div>
        </div>
      }
    >
      <ProductsPageClient products={products} categories={categories} />
    </Suspense>
  )
}
