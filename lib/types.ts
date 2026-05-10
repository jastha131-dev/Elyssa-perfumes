export interface Category {
  _id: string
  name: string
  slug: string
  description: string
  image: SanityImageAsset
  order: number
}

export interface VolumeOption {
  ml: number
  price: number
}

export interface ProductImage {
  url: string
  alt: string
}

export interface PortableTextBlock {
  _type: string
  _key: string
  style?: string
  children?: Array<{
    _type: string
    _key: string
    text: string
    marks?: string[]
  }>
  markDefs?: Array<{
    _type: string
    _key: string
    [key: string]: unknown
  }>
}

export interface Product {
  id: string
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  description: string
  story: PortableTextBlock[]
  images: ProductImage[]
  category: Category
  fragranceFamily: string
  topNotes: string[]
  middleNotes: string[]
  baseNotes: string[]
  intensity: string
  sillage: string
  longevity: string
  volume: VolumeOption[]
  stock: number
  featured: boolean
  bestSeller: boolean
  new: boolean
  tags: string[]
  seoTitle?: string
  seoDescription?: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedVolume: VolumeOption
}

export interface WishlistItem {
  product: Product
  addedAt: Date
}

export interface SanityImageAsset {
  _ref: string
  _type: string
  asset: {
    _ref: string
    _type: string
  }
}
