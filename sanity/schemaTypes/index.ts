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
} from './blocks'

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
