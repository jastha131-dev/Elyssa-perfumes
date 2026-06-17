import { useClient } from 'sanity'
import { useState, useEffect, useCallback } from 'react'
import type { ProductRow } from './types'

const QUERY = `*[_type == "product"] | order(name_en asc) {
  _id, name_en, name_ar, slug, price, compareAtPrice,
  volume, status, "new": new, bestSeller, inStock, tags,
  badgeText_en, badgeText_ar, badgeColor,
  "category": category->{ name_en, "slug": slug.current },
  "thumb": images[0].asset->url
}`

export function useProducts() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await client.fetch<ProductRow[]>(QUERY)
      setProducts(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => { fetch() }, [fetch])

  return { products, loading, error, refetch: fetch }
}
