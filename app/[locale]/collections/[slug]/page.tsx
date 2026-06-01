import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCollectionBySlug, getSmartCollectionProducts } from '@/lib/sanity/fetch'
import type { Product } from '@/lib/types'
import CollectionPageClient from '@/components/collections/CollectionPageClient'
import PageBuilder from '@/components/PageBuilder'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const collection = await getCollectionBySlug(slug)
  if (!collection) return { title: 'Collection Not Found' }
  const isAr = locale === 'ar'
  const title = (isAr ? collection.seoTitle_ar : collection.seoTitle_en) || (isAr ? collection.title_ar : collection.title_en)
  const description = isAr ? collection.seoDescription_ar : collection.seoDescription_en
  return {
    title,
    description,
    openGraph: {
      title: title ?? undefined,
      description: description ?? undefined,
      ...(collection.heroImageUrl ? { images: [{ url: collection.heroImageUrl }] } : {}),
    },
  }
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug } = await params
  const collection = await getCollectionBySlug(slug)
  if (!collection) notFound()

  let products: Product[] = []

  if (collection.filterType === 'smart' && collection.smartFilters) {
    products = await getSmartCollectionProducts({
      fragranceFamilies: collection.smartFilters.fragranceFamilies,
      tags: collection.smartFilters.tags,
      priceMin: collection.smartFilters.priceMin,
      priceMax: collection.smartFilters.priceMax,
      featured: collection.smartFilters.featured,
      bestSeller: collection.smartFilters.bestSeller,
      new: collection.smartFilters.new,
    })
  } else {
    products = (collection.manualProducts as Product[]) ?? []
  }

  // Split sections: before and after product grid
  const sectionsAbove = collection.sections?.slice(0, Math.ceil((collection.sections.length) / 2)) ?? []
  const sectionsBelow = collection.sections?.slice(Math.ceil((collection.sections.length) / 2)) ?? []

  return (
    <>
      <CollectionPageClient collection={collection} products={products} />
      {sectionsBelow.length > 0 && <PageBuilder sections={sectionsBelow} />}
    </>
  )
}
