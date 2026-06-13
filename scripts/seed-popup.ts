/** Patch siteSettings popup fields with default content (EN + AR). */
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
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function run() {
  const doc = await client.fetch<{ _id: string } | null>(`*[_type == "siteSettings"][0]{ _id }`)
  if (!doc) {
    console.error('❌ No siteSettings document found. Publish Site Settings in Sanity Studio first.')
    process.exit(1)
  }

  await client.patch(doc._id).set({
    'popup.isEnabled': true,
    'popup.headline_en': 'Discover Your Signature Scent',
    'popup.headline_ar': 'اكتشفي عطرك المثالي',
    'popup.subtext_en': 'Join the Luxe Parfum family and enjoy exclusive offers, early access to new arrivals, and curated fragrance recommendations.',
    'popup.subtext_ar': 'انضمي إلى عائلة لوكس بارفيوم واستمتعي بعروض حصرية، ووصول مبكر إلى المنتجات الجديدة، وتوصيات عطرية مختارة.',
    'popup.ctaLabel_en': 'Get Early Access',
    'popup.ctaLabel_ar': 'احصلي على وصول مبكر',
    'popup.delaySeconds': 2,
  }).commit()

  console.log('✓ Popup content seeded. Image must be uploaded manually in Studio → Site Settings → Welcome Popup → Left Panel Image.')
}

run().catch((e) => { console.error('❌', e.message); process.exit(1) })
