export interface Category {
  _id: string
  name_en: string
  name_ar: string
  slug: string
  description_en?: string
  description_ar?: string
  image: SanityImageAsset
  order: number
  subcategories?: Pick<Category, '_id' | 'name_en' | 'name_ar' | 'slug' | 'image'>[]
}

export interface Collection {
  _id: string
  title_en: string
  title_ar?: string
  slug: string
  imageUrl?: string
  filterParam?: string
  showInTiles?: boolean
  order: number
}

export interface CollectionDetail {
  _id: string
  title_en: string
  title_ar?: string
  slug: string
  imageUrl?: string
  heroImageUrl?: string
  heroImageAlt?: string
  headline_en?: string
  headline_ar?: string
  subtext_en?: string
  subtext_ar?: string
  cta?: CtaButton
  ctaSecondary?: CtaButton
  ctaTertiary?: CtaButton
  filterType?: 'manual' | 'smart'
  smartFilters?: {
    fragranceFamilies?: string[]
    tags?: string[]
    priceMin?: number
    priceMax?: number
    featured?: boolean
    bestSeller?: boolean
    new?: boolean
  }
  defaultSort?: string
  filterParam?: string
  seoTitle_en?: string
  seoTitle_ar?: string
  seoDescription_en?: string
  seoDescription_ar?: string
  manualProducts?: Product[]
  sections?: HomePageSection[]
}

export interface VolumeOption {
  ml: number
  price: number
  sku?: string
  isSample?: boolean
  stockQty?: number
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
  badgeColor?: string
  badgeText_en?: string
  badgeText_ar?: string
  hideThumbnails?: boolean
  hideReviews?: boolean
  new: boolean
  tags: string[]
  seoTitle_en?: string
  seoTitle_ar?: string
  seoDescription_en?: string
  seoDescription_ar?: string
  sections?: HomePageSection[]
  // Product management fields
  productSku?: string
  barcode?: string
  stockStatus?: 'auto' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'backorder'
  status?: 'active' | 'draft' | 'archived'
  scheduledPublishAt?: string
  videos?: ProductVideo[]
  bundleProducts?: Array<{ product: Product; quantity: number }>
  // Enhanced PDP fields
  concentration?: string
  ingredients?: string
  shippingText_en?: PortableTextBlock[]
  shippingText_ar?: PortableTextBlock[]
  layeringProducts?: Product[]
  frequentlyBoughtTogether?: Product[]
  reviews?: ProductReview[]
  reviewCount?: number
  reviewSum?: number
}

export interface ProductVideo {
  videoUrl?: string
  muxPlaybackId?: string
  caption_en?: string
  caption_ar?: string
  posterImageUrl?: string
}

export interface ProductReview {
  _key: string
  name: string
  location?: string
  rating: number
  review_en: string
  review_ar?: string
  date?: string
  verified?: boolean
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

export interface SiteLogo {
  logoUrl?: string
  logoAlt?: string
  logoText_en?: string
  logoText_ar?: string
  logoSubtext_en?: string
  logoSubtext_ar?: string
  desktopHeaderOrder?: string[]
}

export interface MenuPromo {
  badge_en?: string; badge_ar?: string
  label_en?: string; label_ar?: string
  headline_en?: string; headline_ar?: string
  subtext_en?: string; subtext_ar?: string
  ctaLabel_en?: string; ctaLabel_ar?: string
  ctaLink?: string
  imageUrl?: string; imageAlt?: string
}

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

export interface SectionTheme {
  bgColor?: 'default' | 'white' | 'cream' | 'cream-soft' | 'accent-light' | 'accent' | 'dark' | 'black'
  badgeColor?: 'default' | 'gold' | 'white' | 'black' | 'rose' | 'sage'
  cornerRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  paddingY?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export interface HeroSectionBlock {
  _type: 'heroSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  headline_en?: string
  headline_ar?: string
  subheadline_en?: string
  subheadline_ar?: string
  bgImageUrl?: string
  bgImageAlt?: string
  mobileImageUrl?: string
  mobileImageAlt?: string
  badge_en?: string
  badge_ar?: string
  badgeSub_en?: string
  badgeSub_ar?: string
  bgVideo?: { url?: string; muxPlaybackId?: string }
  cta?: CtaButton
  textColor?: 'light' | 'dark'
  headlineSize?: 'sm' | 'md' | 'lg' | 'xl'
  layout?: 'split' | 'full'
  stats?: Array<{ value: string; label_en: string; label_ar?: string }>
}

export interface CustomBannerSectionBlock {
  _type: 'customBannerSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
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
  theme?: SectionTheme
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
  theme?: SectionTheme
  title_en?: string
  title_ar?: string
  products?: Product[]
}

export interface CategoriesSectionBlock {
  _type: 'categoriesSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  title_en?: string
  title_ar?: string
  categories?: Category[]
}

export interface MarqueeSectionBlock {
  _type: 'marqueeSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  text_en?: string
  text_ar?: string
  speed?: number
}

export interface ScentBannerSectionBlock {
  _type: 'scentBannerSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
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
  theme?: SectionTheme
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
  theme?: SectionTheme
  title_en?: string
  title_ar?: string
  testimonials?: Testimonial[]
}

export interface NewsletterSectionBlock {
  _type: 'newsletterSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
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
  theme?: SectionTheme
  items?: Array<{ icon?: string; label_en?: string; label_ar?: string; value?: string }>
}

// ─── Phase 1 Section Blocks ───────────────────────────────────────────────────

export interface VideoBannerSectionBlock {
  _type: 'videoBannerSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  videoUrl?: string
  muxPlaybackId?: string
  videoFileUrl?: string
  posterImageUrl?: string
  posterImageAlt?: string
  headline_en?: string
  headline_ar?: string
  subtext_en?: string
  subtext_ar?: string
  overlayOpacity?: number
  layout?: 'fullscreen' | 'split'
  cta?: CtaButton
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
}

export interface NewArrivalsSectionBlock {
  _type: 'newArrivalsSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  title_en?: string
  title_ar?: string
  subtitle_en?: string
  subtitle_ar?: string
  limit?: number
  layout?: 'grid' | 'carousel'
  cta?: CtaButton
  newArrivalsProducts?: Product[]
}

export interface CollectionsGridSectionBlock {
  _type: 'collectionsGridSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  title_en?: string
  title_ar?: string
  subtitle_en?: string
  subtitle_ar?: string
  collections?: Collection[]
  columnCount?: 2 | 3 | 4
  cta?: CtaButton
}

export interface FaqSectionBlock {
  _type: 'faqSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  title_en?: string
  title_ar?: string
  subtitle_en?: string
  subtitle_ar?: string
  faqs?: FaqItem[]
  layout?: 'single-column' | 'two-column'
}

export interface ImageWithTextSectionBlock {
  _type: 'imageWithTextSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  imageUrl?: string
  imageAlt?: string
  headline_en?: string
  headline_ar?: string
  eyebrow_en?: string
  eyebrow_ar?: string
  body_en?: string
  body_ar?: string
  imagePosition?: 'left' | 'right'
  imageStyle?: 'square' | 'rounded' | 'full-bleed'
  bgColor?: 'white' | 'cream' | 'black'
  cta?: CtaButton
}

export interface VideoWithTextSectionBlock {
  _type: 'videoWithTextSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  videoUrl?: string
  muxPlaybackId?: string
  videoFileUrl?: string
  posterImageUrl?: string
  autoplay?: boolean
  headline_en?: string
  headline_ar?: string
  eyebrow_en?: string
  eyebrow_ar?: string
  body_en?: string
  body_ar?: string
  videoPosition?: 'left' | 'right'
  bgColor?: 'white' | 'cream' | 'black'
  cta?: CtaButton
}

export interface InstagramPhoto {
  imageUrl?: string
  imageAlt?: string
  caption_en?: string
  caption_ar?: string
  link?: string
}

export interface InstagramFeedSectionBlock {
  _type: 'instagramFeedSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  title_en?: string
  title_ar?: string
  handle?: string
  photos?: InstagramPhoto[]
  columns?: 3 | 4 | 6
  cta?: CtaButton
}

export interface CountdownTimerSectionBlock {
  _type: 'countdownTimerSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  headline_en?: string
  headline_ar?: string
  subtext_en?: string
  subtext_ar?: string
  endDate?: string
  expiredText_en?: string
  expiredText_ar?: string
  bgImageUrl?: string
  style?: 'minimal' | 'card' | 'full-bleed'
  cta?: CtaButton
}

export interface RichTextSectionBlock {
  _type: 'richTextSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  content_en?: PortableTextBlock[]
  content_ar?: PortableTextBlock[]
  maxWidth?: 'narrow' | 'normal' | 'wide'
  textAlign?: 'left' | 'center'
}

export interface MultiColumnItem {
  _key: string
  icon?: string
  headline_en?: string
  headline_ar?: string
  body_en?: string
  body_ar?: string
  cta?: CtaButton
}

export interface MultiColumnSectionBlock {
  _type: 'multiColumnSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  title_en?: string
  title_ar?: string
  subtitle_en?: string
  subtitle_ar?: string
  columnCount?: 2 | 3 | 4
  columns?: MultiColumnItem[]
  bgColor?: 'white' | 'cream' | 'black'
}

// ─── Phase 2 Section Blocks ───────────────────────────────────────────────────

export interface BeforeAfterSectionBlock {
  _type: 'beforeAfterSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  title_en?: string
  title_ar?: string
  subtitle_en?: string
  subtitle_ar?: string
  beforeImageUrl?: string
  beforeImageAlt?: string
  afterImageUrl?: string
  afterImageAlt?: string
  beforeLabel_en?: string
  beforeLabel_ar?: string
  afterLabel_en?: string
  afterLabel_ar?: string
  initialPosition?: number
}

export interface ComparisonTableSectionBlock {
  _type: 'comparisonTableSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  title_en?: string
  title_ar?: string
  products?: Product[]
  highlightProductIndex?: number
  showAddToCart?: boolean
}

export interface TabItem {
  _key: string
  label_en?: string
  label_ar?: string
  content_en?: PortableTextBlock[]
  content_ar?: PortableTextBlock[]
  icon?: string
}

export interface TabsSectionBlock {
  _type: 'tabsSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  title_en?: string
  title_ar?: string
  tabs?: TabItem[]
}

export interface UpsellSectionBlock {
  _type: 'upsellSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  title_en?: string
  title_ar?: string
  subtitle_en?: string
  subtitle_ar?: string
  products?: Product[]
  layout?: 'grid' | 'carousel'
  cta?: CtaButton
}

// ─── Global Announcement Bar ──────────────────────────────────────────────────

export interface AnnouncementBar {
  _id: string
  isEnabled?: boolean
  text_en?: string
  text_ar?: string
  bgColor?: 'gold' | 'black' | 'cream' | 'custom'
  customBgColor?: string
  textColor?: 'light' | 'dark'
  link?: string
  linkLabel_en?: string
  linkLabel_ar?: string
  dismissible?: boolean
}

// ─── Promotions ───────────────────────────────────────────────────────────────

export interface PromotionTier {
  minSpend: number
  discountPercent: number
  label_en?: string
  label_ar?: string
}

export interface Promotion {
  _id: string
  name: string
  isActive: boolean
  code?: string
  type: 'percentage' | 'fixed' | 'free_shipping' | 'buy_x_get_y' | 'tiered' | 'free_gift'
  discountValue?: number
  tiers?: PromotionTier[]
  buyQuantity?: number
  getQuantity?: number
  minOrderValue?: number
  minQuantity?: number
  validFrom?: string
  validUntil?: string
  usageLimit?: number
  onePerCustomer?: boolean
  applicableProducts?: Array<{ _id: string }>
  label_en?: string
  label_ar?: string
  badgeText_en?: string
  badgeText_ar?: string
  cartMessage_en?: string
  cartMessage_ar?: string
  freeShippingThreshold?: number
}

export interface CategoryTileItem {
  _key: string
  label_en?: string
  label_ar?: string
  imageUrl?: string
  imageAlt?: string
  href?: string
}

export interface CategoryTilesSectionBlock {
  _type: 'categoryTilesSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  title_en?: string
  title_ar?: string
  tiles?: CategoryTileItem[]
  bgColor?: string
}

export interface BrowseCategoriesSectionBlock {
  _type: 'browseCategoriesSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  title_en?: string
  title_ar?: string
  categories?: Array<{
    _id: string
    name_en: string
    name_ar?: string
    slug: string
    image?: SanityImageAsset
  }>
  collections?: Array<{
    _id: string
    title_en: string
    title_ar?: string
    slug: string
    imageUrl?: string
  }>
  showAllTile?: boolean
  bgColor?: string
}

export interface QuizPromoSectionBlock {
  _type: 'quizPromoSection'
  _key: string
  isVisible?: boolean
  theme?: SectionTheme
  eyebrow_en?: string
  eyebrow_ar?: string
  headline_en?: string
  headline_ar?: string
  subtext_en?: string
  subtext_ar?: string
  ctaLabel_en?: string
  ctaLabel_ar?: string
  quizUrl?: string
  style?: 'dark' | 'light' | 'accent'
  bgImageUrl?: string
  steps?: string[]
  previewLabel_en?: string
  previewLabel_ar?: string
  previewQuestion_en?: string
  previewQuestion_ar?: string
  previewOptions?: { label_en?: string; label_ar?: string }[]
  previewProgress_en?: string
  previewProgress_ar?: string
}

// ─── Updated Union ────────────────────────────────────────────────────────────

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
  | VideoBannerSectionBlock
  | NewArrivalsSectionBlock
  | CollectionsGridSectionBlock
  | FaqSectionBlock
  | ImageWithTextSectionBlock
  | VideoWithTextSectionBlock
  | InstagramFeedSectionBlock
  | CountdownTimerSectionBlock
  | RichTextSectionBlock
  | MultiColumnSectionBlock
  | BeforeAfterSectionBlock
  | ComparisonTableSectionBlock
  | TabsSectionBlock
  | UpsellSectionBlock
  | CategoryTilesSectionBlock
  | BrowseCategoriesSectionBlock
  | QuizPromoSectionBlock

export interface HomePage {
  _id: string
  sections: HomePageSection[]
}

export interface ProductsPageData {
  _id: string
  sectionsAbove?: HomePageSection[]
  sectionsBelow?: HomePageSection[]
}

export interface NavPage {
  _id: string
  title_en: string
  title_ar?: string
  slug: string
  navOrder: number
}

export interface Page {
  _id: string
  title_en: string
  title_ar?: string
  slug: string
  showInNav?: boolean
  navOrder?: number
  sections: HomePageSection[]
}

export interface FaqItem {
  _id: string
  question_en: string
  question_ar?: string
  answer_en: string
  answer_ar?: string
  category?: string
  order: number
}

export interface ContactPageData {
  _id: string
  heading_en?: string
  heading_ar?: string
  subtext_en?: string
  subtext_ar?: string
  email?: string
  phone?: string
  address_en?: string
  address_ar?: string
  instagramUrl?: string
  whatsappNumber?: string
  heroImageUrl?: string
  heroImageAlt?: string
  overlayOpacity?: number
  openingHours?: Array<{ day: string; hours: string }>
  showMap?: boolean
  mapEmbedUrl?: string
}

export interface NavItem {
  _key?: string
  label_en: string
  label_ar?: string
  href: string
  highlight?: boolean
  visible: boolean
}

// ─── About Page ───────────────────────────────────────────────────────────────

export interface AboutPageData {
  _id: string
  heroHeadline_en?: string
  heroHeadline_ar?: string
  heroSubline_en?: string
  heroSubline_ar?: string
  heroEyebrow_en?: string
  heroEyebrow_ar?: string
  heroBgImageUrl?: string
  overlayOpacity?: number
  stats?: Array<{ value: string; label_en: string; label_ar?: string }>
  philosophyHeadline_en?: string
  philosophyHeadline_ar?: string
  philosophyBody_en?: PortableTextBlock[]
  philosophyBody_ar?: PortableTextBlock[]
  storyImageUrl?: string
  pillars?: Array<{ number: string; title_en: string; title_ar?: string; body_en: string; body_ar?: string }>
  timeline?: Array<{ year: string; event_en: string; event_ar?: string }>
  foundersHeadline_en?: string
  foundersHeadline_ar?: string
  foundersName?: string
  foundersRole_en?: string
  foundersRole_ar?: string
  foundersStory_en?: string
  foundersStory_ar?: string
  foundersImageUrl?: string
  behindBottleHeadline_en?: string
  behindBottleHeadline_ar?: string
  behindBottleImages?: Array<{ imageUrl: string; imageAlt?: string; caption_en?: string; caption_ar?: string }>
  closingTitle_en?: string
  closingTitle_ar?: string
  closingStatement_en?: string
  closingStatement_ar?: string
  ctaHeadline_en?: string
  ctaHeadline_ar?: string
  ctaBody_en?: string
  ctaBody_ar?: string
  ctaPrimary?: CtaButton
  ctaSecondary?: CtaButton
  seoTitle_en?: string
  seoTitle_ar?: string
  seoDescription_en?: string
  seoDescription_ar?: string
  sections?: HomePageSection[]
  statsStripColor?: string
}

// ─── Auth / Account Types ─────────────────────────────────────────────────────

export interface UserAccount {
  _id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  phone?: string
  createdAt?: string
}

export interface UserAddress {
  _id: string
  label?: string
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  state?: string
  country: string
  postalCode?: string
  phone?: string
  isDefault?: boolean
}

export interface OrderItem {
  _key: string
  productId: string
  productName: string
  imageUrl?: string
  quantity: number
  ml?: number
  price: number
}

export interface Order {
  _id: string
  stripeSessionId?: string
  stripePaymentIntentId?: string
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  items: OrderItem[]
  subtotal: number
  discount?: number
  shipping?: number
  total: number
  currency: string
  shippingAddress?: string
  trackingNumber?: string
  trackingUrl?: string
  placedAt?: string
}

// ─── Author Types ─────────────────────────────────────────────────────────────

export interface Author {
  _id: string
  name_en: string
  name_ar?: string
  slug: string
  role_en?: string
  role_ar?: string
  bio_en?: string
  bio_ar?: string
  photoUrl?: string
}

export interface AuthorWithArticles extends Author {
  articles?: ArticleSummary[]
}

// ─── Article Types ────────────────────────────────────────────────────────────

export interface ArticleSummary {
  _id: string
  title_en: string
  title_ar?: string
  slug: string
  category?: string
  excerpt_en?: string
  excerpt_ar?: string
  coverImageUrl?: string
  coverImageAlt?: string
  readTime?: string
  publishedAt?: string
  featured?: boolean
  author?: Author
}

export interface ArticleDetail extends ArticleSummary {
  body_en?: PortableTextBlock[]
  body_ar?: PortableTextBlock[]
  seoTitle_en?: string
  seoTitle_ar?: string
  seoDescription_en?: string
  seoDescription_ar?: string
}

// ─── Gift Card Types ──────────────────────────────────────────────────────────

export interface GiftCardDenomination {
  _key: string
  label_en: string
  label_ar?: string
  amountCents: number
  popular?: boolean
}

export interface GiftCardHowItWorksStep {
  _key: string
  step: number
  text_en: string
  text_ar?: string
}

export interface GiftCardPageData {
  _id: string
  headline_en?: string
  headline_ar?: string
  subtext_en?: string
  subtext_ar?: string
  denominations?: GiftCardDenomination[]
  howItWorks?: GiftCardHowItWorksStep[]
  terms_en?: string
  terms_ar?: string
}

export interface GiftCardOrder {
  _id: string
  code: string
  amountCents: number
  currency: string
  status: 'pending' | 'paid'
  stripeSessionId?: string
  recipientName?: string
  message?: string
  createdAt?: string
}

// ─── Popup Settings ───────────────────────────────────────────────────────────

export interface PopupSettings {
  isEnabled: boolean
  imageUrl: string | null
  headline_en: string | null
  headline_ar: string | null
  subtext_en: string | null
  subtext_ar: string | null
  ctaLabel_en: string | null
  ctaLabel_ar: string | null
  delaySeconds: number
}
