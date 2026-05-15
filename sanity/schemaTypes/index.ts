import { SchemaTypeDefinition } from 'sanity'

import { product } from './product'
import { category } from './category'
import { homePage } from './homePage'
import { testimonial } from './testimonial'
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
  testimonial,

  // ── Singleton page documents ───────────────────────────────────
  homePage,
]
