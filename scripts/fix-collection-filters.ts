/**
 * Fix collection filterParam values so the product-page tiles actually filter.
 * Run: npx tsx scripts/fix-collection-filters.ts
 */
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { createClient } from '@sanity/client'

const envPath = join(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf-8').split('\n').filter((l) => l.trim() && !l.trim().startsWith('#')).forEach((l) => {
    const idx = l.indexOf('='); if (idx > 0) { const k = l.slice(0, idx).trim(); const v = l.slice(idx + 1).trim().replace(/^["']|["']$/g, ''); if (!process.env[k]) process.env[k] = v }
  })
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', useCdn: false, token: process.env.SANITY_API_TOKEN,
})

// slug -> correct filterParam (matches the product-page filter parser)
const FIXES: Record<string, string> = {
  'best-sellers': 'filter=bestseller',          // shows only bestSeller === true
  'new-arrivals': 'filter=new',                 // shows only new === true
  'gift-sets': 'category=luxury-collection',    // gift-sets had no products; point to Luxury
}

async function run() {
  const cols = await client.fetch<{ _id: string; slug: string; filterParam?: string }[]>(
    `*[_type == "collection"]{_id, "slug": slug.current, filterParam}`
  )
  for (const c of cols) {
    const want = FIXES[c.slug]
    if (!want) { console.log(`  ↩ ${c.slug} — no change`); continue }
    if (c.filterParam === want) { console.log(`  ✓ ${c.slug} — already ${want}`); continue }
    await client.patch(c._id).set({ filterParam: want }).commit()
    console.log(`  ✓ ${c.slug}: "${c.filterParam ?? ''}" → "${want}"`)
  }
  console.log('\n✅ Collection filters fixed.')
}

run().catch((e) => { console.error('\n❌ Failed:', e.message); process.exit(1) })
