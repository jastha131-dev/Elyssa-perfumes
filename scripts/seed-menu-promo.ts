/** Seed the menuPromo singleton (mega-menu editorial card), EN + AR. */
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

async function run() {
  await client.createOrReplace({
    _id: 'menuPromo',
    _type: 'menuPromo',
    badge_en: 'New Season', badge_ar: 'موسم جديد',
    label_en: 'Spring / Summer', label_ar: 'ربيع / صيف',
    headline_en: 'Spring Summer Story', headline_ar: 'حكاية الربيع والصيف',
    subtext_en: 'Rare fragrances crafted for the discerning soul.',
    subtext_ar: 'عطور نادرة صُنعت للروح المميّزة.',
    ctaLabel_en: 'Shop Now', ctaLabel_ar: 'تسوّق الآن',
    ctaLink: '/products',
    image: { _type: 'image', asset: { _type: 'reference', _ref: 'image-310577811d5e12aee8b2c381cdaf17923b42cbe6-800x1067-jpg' }, alt: 'Spring Summer fragrance story' },
  })
  console.log('✓ menuPromo seeded (EN + AR)')
}
run().catch((e) => { console.error('❌', e.message); process.exit(1) })
