/**
 * Seed script — creates 3 categories and 8 products in Sanity.
 * Run: npm run seed
 * Requires SANITY_API_TOKEN with write permissions in .env.local
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { createClient } from '@sanity/client'

// Load .env.local
const envPath = join(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('#'))
    .forEach((l) => {
      const idx = l.indexOf('=')
      if (idx > 0) {
        const k = l.slice(0, idx).trim()
        const v = l.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
        if (!process.env[k]) process.env[k] = v
      }
    })
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

let _k = 0
const uid = () => (++_k).toString(36).padStart(4, '0')

function block(text: string) {
  const k = uid()
  return {
    _type: 'block',
    _key: k,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: k + 'c', text, marks: [] }],
  }
}

// ── Categories ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    _id: 'category-men',
    _type: 'category',
    name: 'Men',
    slug: { _type: 'slug', current: 'men' },
    description: 'Bold, refined fragrances crafted for the modern gentleman. From aromatic woods to deep orientals.',
    order: 1,
  },
  {
    _id: 'category-women',
    _type: 'category',
    name: 'Women',
    slug: { _type: 'slug', current: 'women' },
    description: 'Luminous, sophisticated scents celebrating femininity in all its complexity. Floral, powdery, and beyond.',
    order: 2,
  },
  {
    _id: 'category-unisex',
    _type: 'category',
    name: 'Unisex',
    slug: { _type: 'slug', current: 'unisex' },
    description: 'Boundary-free fragrances that transcend gender. Designed for anyone who appreciates exceptional scent.',
    order: 3,
  },
]

// ── Products ──────────────────────────────────────────────────────────────────

const PRODUCTS = [
  // ── Men's ──
  {
    _id: 'product-oud-royale',
    _type: 'product',
    name: 'Oud Royale',
    slug: { _type: 'slug', current: 'oud-royale' },
    description: 'A majestic tribute to the finest Arabian oud. Regal, smoky, and utterly unforgettable — the defining scent of power and prestige.',
    story: [block('Inspired by the royal courts of Arabia, Oud Royale opens with saffron-laced bergamot before settling into a heart of Bulgarian rose and rare agarwood. The base is a cathedral of sandalwood and white musk that lingers for hours.')],
    category: { _type: 'reference', _ref: 'category-men' },
    fragranceFamily: 'Oriental',
    topNotes: ['Bergamot', 'Saffron', 'Cardamom'],
    middleNotes: ['Rose', 'Oud', 'Amber'],
    baseNotes: ['Sandalwood', 'Musk', 'Ambergris'],
    intensity: 'Intense',
    sillage: 'Enormous',
    longevity: 'Very Long',
    price: 285,
    volume: [
      { _type: 'volumeOption', _key: uid(), ml: 50, price: 195, sku: 'OUD-50' },
      { _type: 'volumeOption', _key: uid(), ml: 100, price: 285, sku: 'OUD-100' },
    ],
    stock: 50,
    featured: true,
    bestSeller: true,
    new: false,
    tags: ['oud', 'oriental', 'luxury', 'men', 'woody'],
    seoTitle: 'Oud Royale — Luxury Arabian Oud Fragrance',
    seoDescription: 'A regal oriental with saffron, rose, and rare oud. The defining luxury scent for the discerning gentleman.',
  },
  {
    _id: 'product-vetiver-classique',
    _type: 'product',
    name: 'Vetiver Classique',
    slug: { _type: 'slug', current: 'vetiver-classique' },
    description: "The timeless gentleman's fragrance. Earthy Haitian vetiver cut with citrus brightness and a soft oakmoss finish.",
    story: [block("Vetiver Classique is a study in restraint. Sourced from the finest vetiver roots of Haiti, this fragrance channels the quiet confidence of a man who has nothing to prove. Grapefruit and neroli open with a crisp handshake before the earthy heart takes hold.")],
    category: { _type: 'reference', _ref: 'category-men' },
    fragranceFamily: 'Woody',
    topNotes: ['Grapefruit', 'Neroli', 'Lemon'],
    middleNotes: ['Vetiver', 'Cedar', 'Iris'],
    baseNotes: ['Oakmoss', 'Tonka Bean', 'White Musk'],
    intensity: 'Moderate',
    sillage: 'Moderate',
    longevity: 'Long',
    price: 175,
    volume: [
      { _type: 'volumeOption', _key: uid(), ml: 50, price: 125, sku: 'VET-50' },
      { _type: 'volumeOption', _key: uid(), ml: 100, price: 175, sku: 'VET-100' },
    ],
    stock: 80,
    featured: false,
    bestSeller: false,
    new: true,
    tags: ['vetiver', 'woody', 'classic', 'men', 'fresh'],
    seoTitle: 'Vetiver Classique — Timeless Woody Fragrance for Men',
    seoDescription: 'A refined woody fragrance built around Haitian vetiver, iris, and oakmoss. Timeless, understated luxury.',
  },
  {
    _id: 'product-noir-absolut',
    _type: 'product',
    name: 'Noir Absolut',
    slug: { _type: 'slug', current: 'noir-absolut' },
    description: 'Dark and magnetic. A brooding oriental that commands attention from first spray to lingering dry-down.',
    story: [block('Noir Absolut was born from a desire to capture midnight in a bottle. Black pepper and atlas cedar create an immediate, commanding presence. As the fragrance evolves, a heart of amber and incense reveals itself — smoky, sacred, and deeply sensual.')],
    category: { _type: 'reference', _ref: 'category-men' },
    fragranceFamily: 'Oriental',
    topNotes: ['Black Pepper', 'Bergamot', 'Patchouli Leaf'],
    middleNotes: ['Amber', 'Incense', 'Leather'],
    baseNotes: ['Vetiver', 'Oud', 'Dark Musk'],
    intensity: 'Intense',
    sillage: 'Strong',
    longevity: 'Very Long',
    price: 240,
    volume: [
      { _type: 'volumeOption', _key: uid(), ml: 50, price: 165, sku: 'NOI-50' },
      { _type: 'volumeOption', _key: uid(), ml: 100, price: 240, sku: 'NOI-100' },
    ],
    stock: 35,
    featured: false,
    bestSeller: false,
    new: false,
    tags: ['oriental', 'dark', 'leather', 'men', 'oud', 'evening'],
    seoTitle: 'Noir Absolut — Dark Oriental Eau de Parfum',
    seoDescription: 'A dark, magnetic oriental with black pepper, amber, and oud. For those who prefer their fragrance with an edge.',
  },

  // ── Women's ──
  {
    _id: 'product-fleur-de-lumiere',
    _type: 'product',
    name: 'Fleur de Lumière',
    slug: { _type: 'slug', current: 'fleur-de-lumiere' },
    description: 'A sun-drenched floral capturing the lightness of a Provençal garden in full bloom.',
    story: [block("Fleur de Lumière embodies the golden hour — that moment when afternoon light softens and the air smells of jasmine and possibility. A Grasse jasmine heart is framed by pink pepper's vivid brightness and anchored by warm sandalwood.")],
    category: { _type: 'reference', _ref: 'category-women' },
    fragranceFamily: 'Floral',
    topNotes: ['Bergamot', 'Pink Pepper', 'Grapefruit'],
    middleNotes: ['Jasmine', 'Peony', 'Rose'],
    baseNotes: ['White Musk', 'Cedarwood', 'Sandalwood'],
    intensity: 'Light',
    sillage: 'Moderate',
    longevity: 'Long',
    price: 195,
    volume: [
      { _type: 'volumeOption', _key: uid(), ml: 30, price: 115, sku: 'FLU-30' },
      { _type: 'volumeOption', _key: uid(), ml: 50, price: 145, sku: 'FLU-50' },
      { _type: 'volumeOption', _key: uid(), ml: 100, price: 195, sku: 'FLU-100' },
    ],
    stock: 65,
    featured: true,
    bestSeller: false,
    new: false,
    tags: ['floral', 'jasmine', 'women', 'light', 'summer'],
    seoTitle: 'Fleur de Lumière — Luxury Floral Eau de Parfum',
    seoDescription: 'A luminous floral with Grasse jasmine, peony, and rose. Sunlit and effortlessly sophisticated.',
  },
  {
    _id: 'product-rose-noire',
    _type: 'product',
    name: 'Rose Noire',
    slug: { _type: 'slug', current: 'rose-noire' },
    description: 'Our most iconic creation. A damask rose given depth and shadow with oud and midnight patchouli.',
    story: [block('Rose Noire was eight years in the making. We worked with three perfumers across Paris and Grasse before finding the precise balance of light and dark that defines this fragrance. The damask rose at its heart is unlike any other — rich, velvety, and threaded with the mineral quality of true oud.')],
    category: { _type: 'reference', _ref: 'category-women' },
    fragranceFamily: 'Floral',
    topNotes: ['Black Pepper', 'Bergamot', 'Mandarin'],
    middleNotes: ['Damask Rose', 'Osmanthus', 'Iris'],
    baseNotes: ['Patchouli', 'Vanilla', 'White Musk'],
    intensity: 'Strong',
    sillage: 'Strong',
    longevity: 'Very Long',
    price: 310,
    compareAtPrice: 380,
    volume: [
      { _type: 'volumeOption', _key: uid(), ml: 30, price: 195, sku: 'RON-30' },
      { _type: 'volumeOption', _key: uid(), ml: 50, price: 240, sku: 'RON-50' },
      { _type: 'volumeOption', _key: uid(), ml: 100, price: 310, sku: 'RON-100' },
    ],
    stock: 28,
    featured: true,
    bestSeller: true,
    new: false,
    tags: ['rose', 'floral', 'women', 'oud', 'iconic', 'evening'],
    seoTitle: 'Rose Noire — The Iconic Dark Rose Fragrance',
    seoDescription: "Damask rose deepened with oud and patchouli. Our most acclaimed women's fragrance — eight years in the making.",
  },
  {
    _id: 'product-iris-celeste',
    _type: 'product',
    name: 'Iris Céleste',
    slug: { _type: 'slug', current: 'iris-celeste' },
    description: 'A powdery iris of celestial delicacy. Soft, luminous, and impossible to ignore.',
    story: [block('The iris root — orris — takes three years to dry before extraction, making it one of the most precious materials in perfumery. Iris Céleste is built around the finest orris butter from Florence, framed with violet leaf and wrapped in a cloud of cashmere musk.')],
    category: { _type: 'reference', _ref: 'category-women' },
    fragranceFamily: 'Floral',
    topNotes: ['Mandarin', 'Violet Leaf', 'Green Tea'],
    middleNotes: ['Iris', 'Orris Root', 'Jasmine'],
    baseNotes: ['White Musk', 'Cashmeran', 'Cedarwood'],
    intensity: 'Light',
    sillage: 'Intimate',
    longevity: 'Moderate',
    price: 230,
    volume: [
      { _type: 'volumeOption', _key: uid(), ml: 50, price: 160, sku: 'IRI-50' },
      { _type: 'volumeOption', _key: uid(), ml: 100, price: 230, sku: 'IRI-100' },
    ],
    stock: 45,
    featured: false,
    bestSeller: false,
    new: true,
    tags: ['iris', 'floral', 'powdery', 'women', 'delicate'],
    seoTitle: 'Iris Céleste — Powdery Iris Eau de Parfum',
    seoDescription: 'A celestial iris fragrance built around rare Florentine orris butter. Soft, luminous, and utterly refined.',
  },

  // ── Unisex ──
  {
    _id: 'product-santal-lumiere',
    _type: 'product',
    name: 'Santal Lumière',
    slug: { _type: 'slug', current: 'santal-lumiere' },
    description: 'Warm Australian sandalwood wrapped in spice and vanilla. Comfort elevated to art.',
    story: [block("There is something deeply comforting about sandalwood — a warmth that feels ancient and personal. Santal Lumière sources its sandalwood from sustainably managed Australian plantations, blending it with cardamom's exotic spice and the gentle sweetness of Tahitian vanilla.")],
    category: { _type: 'reference', _ref: 'category-unisex' },
    fragranceFamily: 'Woody',
    topNotes: ['Cardamom', 'Lemon', 'Pink Pepper'],
    middleNotes: ['Sandalwood', 'Jasmine', 'Amyris'],
    baseNotes: ['Vanilla', 'Amberwood', 'Musk'],
    intensity: 'Moderate',
    sillage: 'Moderate',
    longevity: 'Long',
    price: 220,
    volume: [
      { _type: 'volumeOption', _key: uid(), ml: 50, price: 155, sku: 'SAN-50' },
      { _type: 'volumeOption', _key: uid(), ml: 100, price: 220, sku: 'SAN-100' },
    ],
    stock: 55,
    featured: true,
    bestSeller: false,
    new: false,
    tags: ['sandalwood', 'woody', 'unisex', 'vanilla', 'warm'],
    seoTitle: 'Santal Lumière — Warm Sandalwood Unisex Fragrance',
    seoDescription: 'Australian sandalwood with cardamom and vanilla. A warm, genderless fragrance of quiet luxury.',
  },
  {
    _id: 'product-ambre-sublime',
    _type: 'product',
    name: 'Ambre Sublime',
    slug: { _type: 'slug', current: 'ambre-sublime' },
    description: 'A rich, resinous amber of extraordinary depth. Enveloping, addictive, and impossible to forget.',
    story: [block('Amber is not a single material — it is a symphony. Ambre Sublime layers Omani frankincense, Moroccan benzoin, and Spanish labdanum into a deep resinous accord that shifts and evolves on skin for hours. Orange blossom provides the luminous entry; the rest is pure warmth.')],
    category: { _type: 'reference', _ref: 'category-unisex' },
    fragranceFamily: 'Oriental',
    topNotes: ['Orange Blossom', 'Nutmeg', 'Bergamot'],
    middleNotes: ['Benzoin', 'Labdanum', 'Rose'],
    baseNotes: ['Amber', 'Vanilla', 'Frankincense'],
    intensity: 'Strong',
    sillage: 'Strong',
    longevity: 'Very Long',
    price: 265,
    volume: [
      { _type: 'volumeOption', _key: uid(), ml: 50, price: 185, sku: 'AMB-50' },
      { _type: 'volumeOption', _key: uid(), ml: 100, price: 265, sku: 'AMB-100' },
    ],
    stock: 40,
    featured: false,
    bestSeller: true,
    new: false,
    tags: ['amber', 'oriental', 'unisex', 'resinous', 'evening'],
    seoTitle: 'Ambre Sublime — Rich Oriental Amber Fragrance',
    seoDescription: 'A luxurious amber of extraordinary depth. Frankincense, labdanum, and vanilla create an unforgettable oriental.',
  },
]

// ── Run ───────────────────────────────────────────────────────────────────────

async function seed() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID not set in .env.local')
  }
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error('SANITY_API_TOKEN not set in .env.local — needs write permissions')
  }

  console.log('🌱 Seeding Sanity...\n')

  for (const cat of CATEGORIES) {
    await client.createOrReplace(cat)
    console.log(`  ✓ Category: ${cat.name}`)
  }

  console.log()

  for (const product of PRODUCTS) {
    await client.createOrReplace(product)
    console.log(`  ✓ Product:  ${product.name}`)
  }

  console.log(`\n✅ Done — ${CATEGORIES.length} categories, ${PRODUCTS.length} products seeded.`)
  console.log('   Add product images via the Sanity Studio at /studio.\n')
}

seed().catch((err) => {
  console.error('\n❌ Seed failed:', err.message)
  process.exit(1)
})
