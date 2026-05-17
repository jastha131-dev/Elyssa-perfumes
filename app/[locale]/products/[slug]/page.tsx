import { Suspense, cache } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
} from '@/lib/sanity/fetch'
import type { Product } from '@/lib/types'
import { ProductDetailClient } from '@/app/products/[slug]/_client'

export const revalidate = 3600

// Deduplicate: React cache ensures one Sanity call per slug per request,
// shared between generateMetadata and the page component.
const getProduct = cache((slug: string) => getProductBySlug(slug))

// ─── Static Params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const products = await getAllProducts()
    if (!products || products.length === 0) return []
    return products.map((product: Product) => ({ slug: product.slug }))
  } catch {
    return []
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: 'Fragrance Not Found',
      description: 'The requested fragrance could not be found.',
    }
  }

  const isAr = locale === 'ar'
  const name = isAr ? product.name_ar : product.name_en
  const title = (isAr ? product.seoTitle_ar : product.seoTitle_en) || name
  const description =
    (isAr ? product.seoDescription_ar : product.seoDescription_en) ||
    (isAr ? product.description_ar : product.description_en) ||
    `Discover ${name} — a ${product.fragranceFamily ?? 'luxury'} fragrance from Luxe Parfum.`

  const primaryImage = product.images?.[0]

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(primaryImage?.url
        ? { images: [{ url: primaryImage.url, width: 1200, height: 630, alt: primaryImage.alt || name }] }
        : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug } = await params

  // getProduct is deduplicated via React cache — same result as generateMetadata, no extra Sanity call
  const product = await getProduct(slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product._id, product.category?.slug ?? '', 4)

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
            <p className="font-body text-sm tracking-widest uppercase text-charcoal-400">
              Loading…
            </p>
          </div>
        </div>
      }
    >
      <ProductDetailClient product={product} relatedProducts={related} />
    </Suspense>
  )
}
