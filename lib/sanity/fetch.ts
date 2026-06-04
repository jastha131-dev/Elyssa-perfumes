import { client, draftModeClient } from './client'
import { draftMode } from 'next/headers'

const isSanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)

import {
  getAllProductsQuery,
  getProductBySlugQuery,
  getFeaturedProductsQuery,
  getBestSellerProductsQuery,
  getNewProductsQuery,
  getProductsByCategoryQuery,
  getRelatedProductsQuery,
  searchProductsQuery,
  getAllCategoriesQuery,
  getCollectionsQuery,
  getHomePageQuery,
  getTestimonialsQuery,
  getNavPagesQuery,
  getPageBySlugQuery,
  getFaqItemsQuery,
  getContactPageQuery,
  getNavConfigQuery,
  getAnnouncementBarQuery,
  getCollectionBySlugQuery,
  getSmartCollectionProductsQuery,
  getActivePromotionsQuery,
  getAboutPageQuery,
  getArticlesQuery,
  getArticleBySlugQuery,
  getSiteSettingsQuery,
  getAuthorsQuery,
  getAuthorBySlugQuery,
  getArticlesByCategoryQuery,
  getGiftCardPageQuery,
} from './queries'
import type { Product, Category, Collection, CollectionDetail, HomePage, Testimonial, NavPage, Page, FaqItem, ContactPageData, NavItem, AnnouncementBar, Promotion, AboutPageData, ArticleSummary, ArticleDetail, Author, AuthorWithArticles, GiftCardPageData } from '../types'
import type { SiteTypographySettings } from '@/lib/typography'

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  if (!isSanityConfigured) return []
  return client.fetch<Product[]>(getAllProductsQuery, {}, { next: { revalidate: 60 } })
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSanityConfigured) return null
  return client.fetch<Product | null>(
    getProductBySlugQuery,
    { slug },
    { next: { revalidate: 3600 } }
  )
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSanityConfigured) return []
  return client.fetch<Product[]>(
    getFeaturedProductsQuery,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getBestSellerProducts(): Promise<Product[]> {
  if (!isSanityConfigured) return []
  return client.fetch<Product[]>(
    getBestSellerProductsQuery,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getNewProducts(): Promise<Product[]> {
  if (!isSanityConfigured) return []
  return client.fetch<Product[]>(
    getNewProductsQuery,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  if (!isSanityConfigured) return []
  return client.fetch<Product[]>(
    getProductsByCategoryQuery,
    { categorySlug },
    { next: { revalidate: 60 } }
  )
}

export async function getRelatedProducts(
  productId: string,
  category: string,
  limit: number = 4
): Promise<Product[]> {
  if (!isSanityConfigured) return []
  return client.fetch<Product[]>(
    getRelatedProductsQuery,
    { productId, category, limit },
    { next: { revalidate: 60 } }
  )
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!isSanityConfigured) return []
  return client.fetch<Product[]>(
    searchProductsQuery,
    { searchTerm: `*${query}*` },
    { cache: 'no-store' }
  )
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  if (!isSanityConfigured) return []
  return client.fetch<Category[]>(
    getAllCategoriesQuery,
    {},
    { next: { revalidate: 300 } }
  )
}

export async function getCollections(): Promise<Collection[]> {
  if (!isSanityConfigured) return []
  return client.fetch<Collection[]>(
    getCollectionsQuery,
    {},
    { next: { revalidate: 300 } }
  )
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function getHomePage(): Promise<HomePage | null> {
  if (!isSanityConfigured) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fetchOptions: any = { next: { revalidate: 60 } }
  let useClient = client
  try {
    const { isEnabled } = await draftMode()
    if (isEnabled) {
      useClient = draftModeClient
      fetchOptions = { cache: 'no-store' }
    }
  } catch (e) {
    // draftMode() throws outside a request context (e.g. during static build)
    if (process.env.NODE_ENV === 'development') console.debug('[draft-mode]', e)
  }
  return useClient.fetch<HomePage>(getHomePageQuery, {}, fetchOptions)
}

export async function getNavPages(): Promise<NavPage[]> {
  if (!isSanityConfigured) return []
  return client.fetch<NavPage[]>(getNavPagesQuery, {}, { next: { revalidate: 300 } })
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  if (!isSanityConfigured) return null
  return client.fetch<Page | null>(getPageBySlugQuery, { slug }, { next: { revalidate: 60 } })
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSanityConfigured) return []
  return client.fetch<Testimonial[]>(
    getTestimonialsQuery,
    {},
    { next: { revalidate: 300 } }
  )
}

export async function getFaqItems(): Promise<FaqItem[]> {
  if (!isSanityConfigured) return []
  return client.fetch<FaqItem[]>(getFaqItemsQuery, {}, { next: { revalidate: 3600 } })
}

export async function getContactPage(): Promise<ContactPageData | null> {
  if (!isSanityConfigured) return null
  return client.fetch<ContactPageData | null>(getContactPageQuery, {}, { next: { revalidate: 3600 } })
}

export async function getNavConfig(): Promise<NavItem[]> {
  if (!isSanityConfigured) return []
  const data = await client.fetch<{ items: NavItem[] } | null>(
    getNavConfigQuery, {}, { next: { revalidate: 300 } }
  )
  return data?.items ?? []
}

export async function getAnnouncementBar(): Promise<AnnouncementBar | null> {
  if (!isSanityConfigured) return null
  return client.fetch<AnnouncementBar | null>(
    getAnnouncementBarQuery, {}, { next: { revalidate: 300 } }
  )
}

export async function getCollectionBySlug(slug: string): Promise<CollectionDetail | null> {
  if (!isSanityConfigured) return null
  return client.fetch<CollectionDetail | null>(
    getCollectionBySlugQuery,
    { slug },
    { next: { revalidate: 60 } }
  )
}

export async function getSmartCollectionProducts(filters: {
  fragranceFamilies?: string[]
  tags?: string[]
  priceMin?: number
  priceMax?: number
  featured?: boolean
  bestSeller?: boolean
  new?: boolean
}): Promise<Product[]> {
  if (!isSanityConfigured) return []
  return client.fetch<Product[]>(
    getSmartCollectionProductsQuery,
    {
      fragranceFamilies: filters.fragranceFamilies ?? [],
      tags: filters.tags ?? [],
      priceMin: filters.priceMin ?? null,
      priceMax: filters.priceMax ?? null,
      featured: filters.featured ?? false,
      bestSeller: filters.bestSeller ?? false,
      new: filters.new ?? false,
    },
    { next: { revalidate: 60 } }
  )
}

export async function getActivePromotions(): Promise<Promotion[]> {
  if (!isSanityConfigured) return []
  return client.fetch<Promotion[]>(
    getActivePromotionsQuery, {}, { next: { revalidate: 60 } }
  )
}

export async function getAboutPage(): Promise<AboutPageData | null> {
  if (!isSanityConfigured) return null
  return client.fetch<AboutPageData | null>(getAboutPageQuery, {}, { next: { revalidate: 300 } })
}

// ─── Articles ─────────────────────────────────────────────────────────────────

export async function getArticles(): Promise<ArticleSummary[]> {
  if (!isSanityConfigured) return []
  return client.fetch<ArticleSummary[]>(getArticlesQuery, {}, { next: { revalidate: 300 } })
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  if (!isSanityConfigured) return null
  return client.fetch<ArticleDetail | null>(getArticleBySlugQuery, { slug }, { next: { revalidate: 300 } })
}

export async function getAuthors(): Promise<Author[]> {
  if (!isSanityConfigured) return []
  return client.fetch<Author[]>(getAuthorsQuery, {}, { next: { revalidate: 300 } })
}

export async function getAuthorBySlug(slug: string): Promise<AuthorWithArticles | null> {
  if (!isSanityConfigured) return null
  return client.fetch<AuthorWithArticles | null>(
    getAuthorBySlugQuery,
    { slug },
    { next: { revalidate: 300 } }
  )
}

export async function getArticlesByCategory(category: string): Promise<ArticleSummary[]> {
  if (!isSanityConfigured) return []
  return client.fetch<ArticleSummary[]>(
    getArticlesByCategoryQuery,
    { category },
    { next: { revalidate: 300 } }
  )
}

export async function getGiftCardPage(): Promise<GiftCardPageData | null> {
  if (!isSanityConfigured) return null
  return client.fetch<GiftCardPageData | null>(
    getGiftCardPageQuery,
    {},
    { next: { revalidate: 300 } }
  )
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteTypographySettings | null> {
  if (!isSanityConfigured) return null
  return client.fetch<SiteTypographySettings | null>(
    getSiteSettingsQuery, {}, { next: { revalidate: 300 } }
  )
}
