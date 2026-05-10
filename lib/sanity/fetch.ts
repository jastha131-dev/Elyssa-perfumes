import { client } from './client'

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
  getHomePageQuery,
  getTestimonialsQuery,
} from './queries'
import type { Product, Category } from '../types'

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

// ─── Pages ────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getHomePage(): Promise<any> {
  if (!isSanityConfigured) return null
  return client.fetch(getHomePageQuery, {}, { next: { revalidate: 60 } })
}

export interface Testimonial {
  _id: string
  name: string
  location: string
  rating: number
  review: string
  product?: {
    _id: string
    name: string
    slug: string
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSanityConfigured) return []
  return client.fetch<Testimonial[]>(
    getTestimonialsQuery,
    {},
    { next: { revalidate: 300 } }
  )
}
