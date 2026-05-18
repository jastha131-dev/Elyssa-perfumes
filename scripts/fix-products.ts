/// <reference types="node" />
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { createClient } from '@sanity/client'
const envPath = join(process.cwd(), '.env.local')
if (existsSync(envPath)) { readFileSync(envPath, 'utf-8').split('\n').filter((l: string) => l.trim() && !l.trim().startsWith('#')).forEach((l: string) => { const idx = l.indexOf('='); if (idx > 0) { const k = l.slice(0, idx).trim(); const v = l.slice(idx + 1).trim().replace(/^["']|["']$/g, ''); if (!process.env[k]) process.env[k] = v } }) }
const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_API_TOKEN, useCdn: false })

const NAMES: Record<string, { name_en: string; name_ar: string }> = {
  'tiare-nights-zara':  { name_en: 'Tiare Nights',       name_ar: 'ليالي تياري' },
  'ambre-sublime':      { name_en: 'Ambre Sublime',       name_ar: 'العنبر الرائع' },
  'fleur-de-lumiere':   { name_en: 'Fleur de Lumière',    name_ar: 'زهرة النور' },
  'iris-celeste':       { name_en: 'Iris Céleste',         name_ar: 'السوسن السماوي' },
  'noir-absolut':       { name_en: 'Noir Absolut',         name_ar: 'الأسود المطلق' },
  'oud-royale':         { name_en: 'Oud Royale',           name_ar: 'العود الملكي' },
  'rose-noire':         { name_en: 'Rose Noire',           name_ar: 'الوردة السوداء' },
  'santal-lumiere':     { name_en: 'Santal Lumière',       name_ar: 'خشب الصندل المضيء' },
  'vetiver-classique':  { name_en: 'Vétiver Classique',    name_ar: 'فيتيفير كلاسيكي' },
}

async function run() {
  const prods = await client.fetch<{ _id: string; slug: string }[]>(
    '*[_type == "product" && !(_id in path("drafts.**"))]{ _id, "slug": slug.current }'
  )
  for (const p of prods) {
    const fix = NAMES[p.slug]
    if (!fix) { console.log(`  ⚠️  No mapping for "${p.slug}"`); continue }
    await client.patch(p._id).set({ name_en: fix.name_en, name_ar: fix.name_ar }).commit()
    console.log(`  ✅ ${p.slug} → "${fix.name_en}" / "${fix.name_ar}"`)
  }
  console.log('\nDone.')
}
run().catch(e => { console.error('❌', e.message); process.exit(1) })
