/// <reference types="node" />
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { createClient } from '@sanity/client'
const envPath = join(process.cwd(), '.env.local')
if (existsSync(envPath)) { readFileSync(envPath, 'utf-8').split('\n').filter((l: string) => l.trim() && !l.trim().startsWith('#')).forEach((l: string) => { const idx = l.indexOf('='); if (idx > 0) { const k = l.slice(0, idx).trim(); const v = l.slice(idx + 1).trim().replace(/^["']|["']$/g, ''); if (!process.env[k]) process.env[k] = v } }) }
const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_API_TOKEN, useCdn: false })
async function run() {
  const prods = await client.fetch<{ _id: string; name_en: string | null; slug: string }[]>('*[_type == "product" && !(_id in path("drafts.**"))]{ _id, name_en, "slug": slug.current }')
  console.log(`${prods.length} published products:`)
  prods.forEach(p => console.log(` ${p.slug} | name_en: ${p.name_en ?? 'NULL'}`))
}
run().catch(e => { console.error(e.message); process.exit(1) })
