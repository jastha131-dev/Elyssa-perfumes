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

// ─── Page Builder Types ───────────────────────────────────────────────────────

export interface CtaButton {
  label?: string
  link?: string
  style?: 'primary' | 'secondary' | 'ghost' | 'outline'
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

export interface HeroSectionBlock {
  _type: 'heroSection'
  _key: string
  isVisible?: boolean
  headline?: string
  subheadline?: string
  bgImageUrl?: string
  bgImageAlt?: string
  bgVideo?: { url?: string; muxPlaybackId?: string }
  cta?: CtaButton
  textColor?: 'light' | 'dark'
}

export interface CustomBannerSectionBlock {
  _type: 'customBannerSection'
  _key: string
  isVisible?: boolean
  imageUrl?: string
  imageAlt?: string
  headline?: string
  subtext?: string
  overlayOpacity?: number
  cta?: CtaButton
  textAlign?: 'left' | 'center' | 'right'
}

export interface FeaturedProductsSectionBlock {
  _type: 'featuredProductsSection'
  _key: string
  isVisible?: boolean
  title?: string
  subtitle?: string
  products?: Product[]
  layout?: 'grid' | 'carousel'
}

export interface BestSellersSectionBlock {
  _type: 'bestSellersSection'
  _key: string
  isVisible?: boolean
  title?: string
  products?: Product[]
}

export interface CategoriesSectionBlock {
  _type: 'categoriesSection'
  _key: string
  isVisible?: boolean
  title?: string
  categories?: Category[]
}

export interface MarqueeSectionBlock {
  _type: 'marqueeSection'
  _key: string
  isVisible?: boolean
  text?: string
  speed?: number
}

export interface ScentBannerSectionBlock {
  _type: 'scentBannerSection'
  _key: string
  isVisible?: boolean
  eyebrow?: string
  headline?: string
  highlightWord?: string
  subtext?: string
  bgImageUrl?: string
  cta?: CtaButton
}

export interface BrandStorySectionBlock {
  _type: 'brandStorySection'
  _key: string
  isVisible?: boolean
  eyebrow?: string
  headline?: string
  body?: string
  imageUrl?: string
  imageAlt?: string
  imagePosition?: 'left' | 'right'
  cta?: CtaButton
}

export interface TestimonialsSectionBlock {
  _type: 'testimonialsSection'
  _key: string
  isVisible?: boolean
  title?: string
  testimonials?: Testimonial[]
}

export interface NewsletterSectionBlock {
  _type: 'newsletterSection'
  _key: string
  isVisible?: boolean
  headline?: string
  subtext?: string
  buttonLabel?: string
  bgImageUrl?: string
}

export interface TrustBarSectionBlock {
  _type: 'trustBarSection'
  _key: string
  isVisible?: boolean
  items?: Array<{ icon?: string; label?: string; value?: string }>
}

export type HomePageSection =
  | HeroSectionBlock
  | CustomBannerSectionBlock
  | FeaturedProductsSectionBlock
  | BestSellersSectionBlock
  | CategoriesSectionBlock
  | MarqueeSectionBlock
  | ScentBannerSectionBlock
  | BrandStorySectionBlock
  | TestimonialsSectionBlock
  | NewsletterSectionBlock
  | TrustBarSectionBlock

export interface HomePage {
  _id: string
  sections: HomePageSection[]
}
