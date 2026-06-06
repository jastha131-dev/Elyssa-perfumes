import { SchemaTypeDefinition } from 'sanity'

import { article } from './article'
import { product } from './product'
import { category } from './category'
import { collection } from './collection'
import { homePage } from './homePage'
import { aboutPage } from './aboutPage'
import { page } from './page'
import { testimonial } from './testimonial'
import { faqItem } from './faqItem'
import { contactPage } from './contactPage'
import { navConfig } from './navConfig'
import {
  ctaButton,
  heroSection,
  customBannerSection,
  featuredProductsSection,
  bestSellersSection,
  categoriesSection,
  marqueeSection,
  scentBannerSection,
  brandStorySection,
  testimonialsSection,
  newsletterSection,
  trustBarSection,
  videoBannerSection,
  newArrivalsSection,
  collectionsGridSection,
  faqSection,
  imageWithTextSection,
  videoWithTextSection,
  instagramFeedSection,
  countdownTimerSection,
  richTextSection,
  multiColumnSection,
  beforeAfterSection,
  comparisonTableSection,
  tabsSection,
  upsellSection,
  categoryTilesSection,
  browseCategoriesSection,
  quizPromoSection,
} from './blocks'
import { sectionTheme } from './objects/sectionTheme'
import { announcementBar } from './announcementBar'
import { promotion } from './promotion'
import { menuPromo } from './menuPromo'
import { user } from './user'
import { address } from './address'
import { order } from './order'
import { siteSettings } from './siteSettings'
import { author } from './author'
import { giftCardPage } from './giftCardPage'
import { giftCardOrder } from './giftCardOrder'
import { productsPage } from './productsPage'

export const schemaTypes: SchemaTypeDefinition[] = [
  // ── Shared object types ────────────────────────────────────────
  ctaButton,
  sectionTheme,

  // ── Block types ────────────────────────────────────────────────
  heroSection,
  customBannerSection,
  featuredProductsSection,
  bestSellersSection,
  categoriesSection,
  marqueeSection,
  scentBannerSection,
  brandStorySection,
  testimonialsSection,
  newsletterSection,
  trustBarSection,
  videoBannerSection,
  newArrivalsSection,
  collectionsGridSection,
  faqSection,
  imageWithTextSection,
  videoWithTextSection,
  instagramFeedSection,
  countdownTimerSection,
  richTextSection,
  multiColumnSection,
  beforeAfterSection,
  comparisonTableSection,
  tabsSection,
  upsellSection,
  categoryTilesSection,
  browseCategoriesSection,
  quizPromoSection,

  // ── Global singletons ──────────────────────────────────────────
  announcementBar,
  promotion,
  menuPromo,
  siteSettings,
  productsPage,

  // ── Content documents ──────────────────────────────────────────
  author,
  article,
  product,
  category,
  collection,
  testimonial,
  faqItem,
  contactPage,
  user,
  address,
  order,

  // ── Singleton page documents ───────────────────────────────────
  homePage,
  aboutPage,
  navConfig,
  giftCardPage,

  // ── Gift card orders ───────────────────────────────────────────
  giftCardOrder,

  // ── Dynamic pages ─────────────────────────────────────────────
  page,
]
