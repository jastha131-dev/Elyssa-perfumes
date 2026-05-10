/**
 * Image seeder — downloads Unsplash perfume photos, uploads to Sanity, patches products.
 * Run: npx tsx scripts/seed-images.ts
 * Requires SANITY_API_TOKEN with write permissions in .env.local
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { createClient } from '@sanity/client'

// ── Load .env.local ───────────────────────────────────────────────────────────
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

// ── Curated perfume images from Unsplash ──────────────────────────────────────
// Each entry maps to a product by _id. Replace photo IDs if you want different images.
const PRODUCT_IMAGES: Record<string, { photoId: string; alt: string }[]> = {
  'product-oud-royale': [
    { photoId: '1541943869728-4bd4f450c8f5', alt: 'Oud Royale luxury perfume bottle on dark background' },
    { photoId: '1592945403244-b3fbafd7f539', alt: 'Oud Royale side profile' },
  ],
  'product-vetiver-classique': [
    { photoId: '1547793549-70faf88843be', alt: 'Vetiver Classique cologne bottle' },
    { photoId: '1541943869728-4bd4f450c8f5', alt: 'Vetiver Classique detail' },
  ],
  'product-noir-absolut': [
    { photoId: '1550259979-ed79b48d2a30', alt: 'Noir Absolut dark perfume bottle' },
    { photoId: '1547793549-70faf88843be', alt: 'Noir Absolut profile' },
  ],
  'product-fleur-de-lumiere': [
    { photoId: '1585386959984-a4155224a1ad', alt: 'Fleur de Lumière floral fragrance bottle' },
    { photoId: '1592945403244-b3fbafd7f539', alt: 'Fleur de Lumière on marble' },
  ],
  'product-rose-noire': [
    { photoId: '1556228578-8c89e6adf883', alt: 'Rose Noire dark rose perfume bottle' },
    { photoId: '1585386959984-a4155224a1ad', alt: 'Rose Noire detail shot' },
  ],
  'product-iris-celeste': [
    { photoId: '1592945403244-b3fbafd7f539', alt: 'Iris Céleste delicate perfume bottle' },
    { photoId: '1556228578-8c89e6adf883', alt: 'Iris Céleste profile' },
  ],
  'product-santal-lumiere': [
    { photoId: '1585386959984-a4155224a1ad', alt: 'Santal Lumière warm sandalwood perfume' },
    { photoId: '1550259979-ed79b48d2a30', alt: 'Santal Lumière side view' },
  ],
  // Manually created product (Tiare Nights Zara)
  '7fe1a0de-6c14-49d5-a696-028ffa927492': [
    { photoId: '1556228578-8c89e6adf883', alt: 'Tiare Nights exotic floral perfume bottle' },
    { photoId: '1592945403244-b3fbafd7f539', alt: 'Tiare Nights tropical fragrance' },
  ],
  'product-ambre-sublime': [
    { photoId: '1550259979-ed79b48d2a30', alt: 'Ambre Sublime rich amber perfume bottle' },
    { photoId: '1541943869728-4bd4f450c8f5', alt: 'Ambre Sublime detail' },
  ],
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function downloadImage(photoId: string): Promise<Buffer> {
  const url = `https://images.unsplash.com/photo-${photoId}?w=800&h=1067&fit=crop&q=85&fm=jpg`
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; LuxeParfumSeeder/1.0)',
    },
    redirect: 'follow',
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} downloading photo-${photoId}`)
  }
  const arrayBuffer = await res.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

let _k = 0
const uid = () => `img${(++_k).toString(36).padStart(4, '0')}`

// ── Main ──────────────────────────────────────────────────────────────────────

async function seedImages() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID not set in .env.local')
  }
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error('SANITY_API_TOKEN not set in .env.local — needs write permissions')
  }

  console.log('📸 Seeding product images...\n')

  const products = await client.fetch<{ _id: string; name: string; images: unknown[] }[]>(
    `*[_type == "product"]{_id, name, images}`
  )

  console.log(`Found ${products.length} products in Sanity\n`)

  for (const product of products) {
    const imageConfigs = PRODUCT_IMAGES[product._id]
    if (!imageConfigs) {
      console.log(`  ⚠  No image config for ${product.name} (${product._id}) — skipping`)
      continue
    }

    const existingCount = Array.isArray(product.images) ? product.images.length : 0
    if (existingCount > 0) {
      console.log(`  ↩  ${product.name} already has ${existingCount} image(s) — skipping`)
      continue
    }

    console.log(`  ⬇  ${product.name}`)

    const sanityImages: unknown[] = []

    for (const config of imageConfigs) {
      try {
        process.stdout.write(`       Downloading photo-${config.photoId}... `)
        const buffer = await downloadImage(config.photoId)
        process.stdout.write(`(${Math.round(buffer.length / 1024)}KB) uploading... `)

        const asset = await client.assets.upload('image', buffer, {
          filename: `${product._id}-${uid()}.jpg`,
          contentType: 'image/jpeg',
        })

        sanityImages.push({
          _type: 'image',
          _key: uid(),
          asset: { _type: 'reference', _ref: asset._id },
          alt: config.alt,
        })

        console.log('✓')
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.log(`✗ ${msg}`)
      }
    }

    if (sanityImages.length === 0) {
      console.log(`       No images uploaded — skipping patch for ${product.name}`)
      continue
    }

    await client.patch(product._id).set({ images: sanityImages }).commit()
    console.log(`     ✓ Patched ${product.name} with ${sanityImages.length} image(s)\n`)
  }

  console.log('✅ Image seeding complete!')
}

seedImages().catch((err) => {
  console.error('\n❌ Failed:', err.message)
  process.exit(1)
})
