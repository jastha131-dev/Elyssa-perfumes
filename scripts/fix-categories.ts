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
      if (idx > 0) { const k = l.slice(0, idx).trim(); const v = l.slice(idx + 1).trim().replace(/^["']|["']$/g, ''); if (!process.env[k]) process.env[k] = v }
    })
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const CATEGORY_NAMES: Record<string, { name_en: string; name_ar: string; order: number }> = {
  'men':    { name_en: 'Men',      name_ar: 'رجالي',   order: 1 },
  'women':  { name_en: 'Women',    name_ar: 'نسائي',   order: 2 },
  'unisex': { name_en: 'Unisex',   name_ar: 'جنسين',   order: 3 },
  'gift-sets': { name_en: 'Gift Sets', name_ar: 'طقم هدايا', order: 4 },
}

async function run() {
  const cats = await client.fetch<{ _id: string; slug: string }[]>(
    '*[_type == "category"]{ _id, "slug": slug.current }'
  )

  for (const cat of cats) {
    const fix = CATEGORY_NAMES[cat.slug]
    if (!fix) {
      console.log(`  ⚠️  No fix mapping for slug "${cat.slug}" (${cat._id}) — skipping`)
      continue
    }
    await client.patch(cat._id).set({
      name_en: fix.name_en,
      name_ar: fix.name_ar,
      order: fix.order,
    }).commit()
    console.log(`  ✅ ${cat._id} → name_en="${fix.name_en}" / name_ar="${fix.name_ar}"`)
  }

  console.log('\nDone. Refresh Studio & dev server.')
}

run().catch(e => { console.error('❌', e.message); process.exit(1) })
