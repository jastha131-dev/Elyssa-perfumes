export interface Category {
  _id: string
  name_en: string
  name_ar: string
  slug: string
  description_en?: string
  description_ar?: string
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
  name_en: string
  name_ar: string
  slug: string
  price: number
  compareAtPrice?: number
  description_en: string
  description_ar: string
  story_en: PortableTextBlock[]
  story_ar: PortableTextBlock[]
  images: ProductImage[]
  category: Category
  fragranceFamily: string
  topNotes_en?: string[]
  topNotes_ar?: string[]
  middleNotes_en?: string[]
  middleNotes_ar?: string[]
  baseNotes_en?: string[]
  baseNotes_ar?: string[]
  intensity: string
  sillage: string
  longevity: string
  volume: VolumeOption[]
  stock: number
  featured: boolean
  bestSeller: boolean
  new: boolean
  tags: string[]
  seoTitle_en?: string
  seoTitle_ar?: string
  seoDescription_en?: string
  seoDescription_ar?: string
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
  label_en?: string
  label_ar?: string
  link?: string
  style?: 'primary' | 'secondary' | 'ghost' | 'outline'
}

export interface Testimonial {
  _id: string
  name_en: string
  name_ar: string
  location_en?: string
  location_ar?: string
  rating: number
  review_en: string
  review_ar: string
  product?: {
    _id: string
    name_en: string
    name_ar: string
    slug: string
  }
}

export interface HeroSectionBlock {
  _type: 'heroSection'
  _key: string
  isVisible?: boolean
  headline_en?: string
  headline_ar?: string
  subheadline_en?: string
  subheadline_ar?: string
  bgImageUrl?: string
  bgImageAlt?: string
  bgVideo?: { url?: string; muxPlaybackId?: string }
  cta?: CtaButton
  textColor?: 'light' | 'dark'
  headlineSize?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface CustomBannerSectionBlock {
  _type: 'customBannerSection'
  _key: string
  isVisible?: boolean
  imageUrl?: string
  imageAlt?: string
  headline_en?: string
  headline_ar?: string
  subtext_en?: string
  subtext_ar?: string
  overlayOpacity?: number
  cta?: CtaButton
  textAlign?: 'left' | 'center' | 'right'
}

export interface FeaturedProductsSectionBlock {
  _type: 'featuredProductsSection'
  _key: string
  isVisible?: boolean
  title_en?: string
  title_ar?: string
  subtitle_en?: string
  subtitle_ar?: string
  products?: Product[]
  layout?: 'grid' | 'carousel'
}

export interface BestSellersSectionBlock {
  _type: 'bestSellersSection'
  _key: string
  isVisible?: boolean
  title_en?: string
  title_ar?: string
  products?: Product[]
}

export interface CategoriesSectionBlock {
  _type: 'categoriesSection'
  _key: string
  isVisible?: boolean
  title_en?: string
  title_ar?: string
  categories?: Category[]
}

export interface MarqueeSectionBlock {
  _type: 'marqueeSection'
  _key: string
  isVisible?: boolean
  text_en?: string
  text_ar?: string
  speed?: number
}

export interface ScentBannerSectionBlock {
  _type: 'scentBannerSection'
  _key: string
  isVisible?: boolean
  eyebrow_en?: string
  eyebrow_ar?: string
  headline_en?: string
  headline_ar?: string
  highlightWord_en?: string
  highlightWord_ar?: string
  subtext_en?: string
  subtext_ar?: string
  bgImageUrl?: string
  cta?: CtaButton
}

export interface BrandStorySectionBlock {
  _type: 'brandStorySection'
  _key: string
  isVisible?: boolean
  eyebrow_en?: string
  eyebrow_ar?: string
  headline_en?: string
  headline_ar?: string
  body_en?: string
  body_ar?: string
  imageUrl?: string
  imageAlt?: string
  imagePosition?: 'left' | 'right'
  cta?: CtaButton
}

export interface TestimonialsSectionBlock {
  _type: 'testimonialsSection'
  _key: string
  isVisible?: boolean
  title_en?: string
  title_ar?: string
  testimonials?: Testimonial[]
}

export interface NewsletterSectionBlock {
  _type: 'newsletterSection'
  _key: string
  isVisible?: boolean
  headline_en?: string
  headline_ar?: string
  subtext_en?: string
  subtext_ar?: string
  buttonLabel_en?: string
  buttonLabel_ar?: string
  bgImageUrl?: string
}

export interface TrustBarSectionBlock {
  _type: 'trustBarSection'
  _key: string
  isVisible?: boolean
  items?: Array<{ icon?: string; label_en?: string; label_ar?: string; value?: string }>
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
