import { SchemaTypeDefinition } from 'sanity'

import { product } from './product'
import { category } from './category'
import { collection } from './collection'
import { homePage } from './homePage'
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
} from './blocks'
import { announcementBar } from './announcementBar'
import { promotion } from './promotion'

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

  // ── Global singletons ──────────────────────────────────────────
  announcementBar,
  promotion,

  // ── Content documents ──────────────────────────────────────────
  product,
  category,
  collection,
  testimonial,
  faqItem,
  contactPage,

  // ── Singleton page documents ───────────────────────────────────
  homePage,
  navConfig,

  // ── Dynamic pages ─────────────────────────────────────────────
  page,
]
