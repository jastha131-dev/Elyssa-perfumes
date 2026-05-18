/// <reference types="node" />
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { createClient } from '@sanity/client'

const envPath = join(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf-8').split('\n')
    .filter((l: string) => l.trim() && !l.trim().startsWith('#'))
    .forEach((l: string) => {
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
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const COLLECTIONS = [
  {
    _id: 'collection-new-arrivals',
    _type: 'collection',
    title_en: 'New Arrivals',
    title_ar: 'وصل حديثاً',
    slug: { _type: 'slug', current: 'new-arrivals' },
    filterParam: 'sort=newest',
    showInTiles: true,
    order: 1,
  },
  {
    _id: 'collection-best-sellers',
    _type: 'collection',
    title_en: 'Best Sellers',
    title_ar: 'الأكثر مبيعاً',
    slug: { _type: 'slug', current: 'best-sellers' },
    filterParam: 'sort=best_selling',
    showInTiles: true,
    order: 2,
  },
  {
    _id: 'collection-gift-sets',
    _type: 'collection',
    title_en: 'Gift Sets',
    title_ar: 'طقم هدايا',
    slug: { _type: 'slug', current: 'gift-sets' },
    filterParam: 'category=gift-sets',
    showInTiles: true,
    order: 3,
  },
]

async function run() {
  for (const col of COLLECTIONS) {
    await client.createOrReplace(col)
    console.log(`  ✅ Created: "${col.title_en}" (${col._id})`)
  }
  console.log('\nDone. Collections visible in Sanity Studio → Featured Collections.')
  console.log('Upload tile images in Studio for each collection to get background images.')
}

run().catch(e => { console.error('❌', e.message); process.exit(1) })
