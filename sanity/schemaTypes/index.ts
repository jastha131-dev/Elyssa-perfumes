import { SchemaTypeDefinition } from 'sanity'

import { product } from './product'
import { category } from './category'
import { homePage } from './homePage'
import { testimonial } from './testimonial'

/**
 * All Sanity schema types for Luxe Parfum.
 *
 * Order matters for the Studio sidebar — documents are listed
 * in the order they appear here.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  // ── Content documents ──────────────────────────────────────────
  product,
  category,
  testimonial,

  // ── Singleton page documents ───────────────────────────────────
  homePage,
]
