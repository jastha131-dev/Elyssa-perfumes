/// <reference types="node" />
/**
 * Uploads 10 sample hero images to Sanity media library.
 * Run: npx tsx scripts/upload-hero-samples.ts
 * After running, go to Sanity Studio → Hero Banner → Background Image → pick any sample.
 */
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

const SAMPLES = [
  { url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1920&q=90', name: 'hero-sample-1-editorial-bottle.jpg',    label: '1 — Editorial glass bottle (warm tones)' },
  { url: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1920&q=90', name: 'hero-sample-2-perfume-flatlay.jpg',      label: '2 — Perfume flatlay (neutral bg)' },
  { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&q=90', name: 'hero-sample-3-lifestyle-dark.jpg',       label: '3 — Lifestyle dark (full-bleed)' },
  { url: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=1920&q=90', name: 'hero-sample-4-amber-spices.jpg',           label: '4 — Amber & spices (warm)' },
  { url: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=1920&q=90', name: 'hero-sample-5-beauty-flatlay.jpg',         label: '5 — Beauty flatlay (soft)' },
  { url: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=1920&q=90', name: 'hero-sample-6-luxury-bottle.jpg',       label: '6 — Luxury bottle close-up' },
  { url: 'https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=1920&q=90', name: 'hero-sample-7-fragrance-editorial.jpg', label: '7 — Fragrance editorial (light)' },
  { url: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=1920&q=90', name: 'hero-sample-8-perfume-dark.jpg',        label: '8 — Perfume dark moody' },
  { url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1920&q=90', name: 'hero-sample-9-floral-bottle.jpg',       label: '9 — Floral & bottle' },
  { url: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=1920&q=90', name: 'hero-sample-10-luxury-perfume.jpg',     label: '10 — Luxury perfume still life' },
]

async function upload(url: string, filename: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, { filename, contentType: 'image/jpeg' })
  return asset._id
}

async function run() {
  console.log('\n📸  Uploading 10 sample hero images to Sanity...\n')
  const results: { label: string; assetId: string }[] = []

  for (const s of SAMPLES) {
    try {
      process.stdout.write(`  ↑ ${s.label}... `)
      const id = await upload(s.url, s.name)
      results.push({ label: s.label, assetId: id })
      console.log('✓')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      console.log(`✗ (${msg})`)
    }
  }

  console.log('\n✅  Done! All images now in Sanity Media Library.')
  console.log('\n   How to use:')
  console.log('   1. Go to Sanity Studio → Home Page → Hero Banner')
  console.log('   2. Click "Background Image" → "Select"')
  console.log('   3. Choose any of the uploaded samples')
  console.log('   4. Click Publish\n')
}

run().catch((e) => { console.error('❌', e.message); process.exit(1) })
