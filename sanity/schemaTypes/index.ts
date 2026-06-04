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
import { announcementBar } from './announcementBar'
import { promotion } from './promotion'
import { user } from './user'
import { address } from './address'
import { order } from './order'
import { siteSettings } from './siteSettings'

export const schemaTypes: SchemaTypeDefinition[] = [
  // ── Shared object types ────────────────────────────────────────
  ctaButton,

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
  siteSettings,

  // ── Content documents ──────────────────────────────────────────
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

  // ── Dynamic pages ─────────────────────────────────────────────
  page,
]
