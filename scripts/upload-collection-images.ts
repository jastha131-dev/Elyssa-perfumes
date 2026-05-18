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

const UPLOADS = [
  {
    collectionId: 'collection-new-arrivals',
    imagePath: join(process.cwd(), 'public/images/categories/I1.webp'),
    filename: 'new-arrivals.webp',
    alt: 'New Arrivals',
  },
  {
    collectionId: 'collection-best-sellers',
    imagePath: join(process.cwd(), 'public/images/categories/I2.webp'),
    filename: 'best-sellers.webp',
    alt: 'Best Sellers',
  },
  {
    collectionId: 'collection-gift-sets',
    imagePath: join(process.cwd(), 'public/images/categories/I3.webp'),
    filename: 'gift-sets.webp',
    alt: 'Gift Sets',
  },
]

async function run() {
  for (const { collectionId, imagePath, filename, alt } of UPLOADS) {
    console.log(`\nUploading ${filename}…`)
    const buffer = readFileSync(imagePath)

    const asset = await client.assets.upload('image', buffer, {
      filename,
      contentType: 'image/webp',
    })
    console.log(`  ✅ Asset uploaded: ${asset._id}`)

    await client.patch(collectionId).set({
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
        alt,
      },
    }).commit()
    console.log(`  ✅ Patched collection "${collectionId}" with image`)
  }

  console.log('\nDone — all collection tiles now have images.')
}

run().catch(e => { console.error('❌', e.message); process.exit(1) })
