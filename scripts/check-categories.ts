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

async function run() {
  const cats = await client.fetch('*[_type == "category"]{ _id, name_en, name_ar, "slug": slug.current, order }')
  console.log('Categories:', JSON.stringify(cats, null, 2))
  
  const prods = await client.fetch('*[_type == "product"][0..2]{ _id, name_en, "slug": slug.current, "category": category->{ _id, name_en } }')
  console.log('\nSample products:', JSON.stringify(prods, null, 2))
}

run().catch(e => { console.error(e.message); process.exit(1) })
// also check products
async function checkProducts() {
  const prods = await client.fetch<{ _id: string; name_en: string | null; slug: string }[]>(
    '*[_type == "product" && !(_id in path("drafts.**"))]{ _id, name_en, "slug": slug.current }'
  )
  console.log('\nPublished products:')
  prods.forEach(p => console.log(' ', p.slug, '|', p.name_en ?? 'NULL'))
}
