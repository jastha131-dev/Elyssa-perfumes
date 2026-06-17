export interface VolumeOption {
  ml: number
  price: number
  sku?: string
  isSample?: boolean
  stockQty?: number
}

export interface ProductCategory {
  name_en: string
  slug: string
}

export interface ProductRow {
  _id: string
  name_en: string
  name_ar?: string
  slug: { current: string }
  price: number
  compareAtPrice?: number
  volume?: VolumeOption[]
  status?: 'active' | 'draft' | 'archived'
  new?: boolean
  bestSeller?: boolean
  inStock?: boolean
  tags?: string[]
  badgeText_en?: string
  badgeText_ar?: string
  badgeColor?: string
  category?: ProductCategory
  thumb?: string
}

export interface BulkOps {
  // Price
  priceMode?: 'pct' | 'flat'
  priceValue?: number          // positive = increase, negative = decrease
  compareAtMarkupPct?: number  // compareAtPrice = price * (1 + pct/100)
  clearSale?: boolean

  // Flags — undefined/null = skip
  new?: boolean | null
  bestSeller?: boolean | null
  inStock?: boolean | null
  status?: 'active' | 'draft' | 'archived' | null

  // Tags
  addTags?: string[]
  removeTags?: string[]

  // Badge
  badgeText_en?: string
  badgeText_ar?: string
  badgeColor?: string | null
}
