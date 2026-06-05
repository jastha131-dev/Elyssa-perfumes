import { readFileSync, existsSync } from 'fs'; import { join } from 'path'; import { createClient } from '@sanity/client'; import { randomUUID } from 'crypto'
const p=join(process.cwd(),'.env.local'); if(existsSync(p)) readFileSync(p,'utf-8').split('\n').filter(l=>l.trim()&&!l.startsWith('#')).forEach(l=>{const i=l.indexOf('=');if(i>0){const k=l.slice(0,i).trim();const v=l.slice(i+1).trim().replace(/^["']|["']$/g,'');if(!process.env[k])process.env[k]=v}})
const c=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET||'production',apiVersion:'2024-01-01',useCdn:false,token:process.env.SANITY_API_TOKEN})
const key=()=>`k${randomUUID().replace(/-/g,'').slice(0,10)}`
const HOME='0634faed-e967-417d-b210-711cc46caf4d'
;(async()=>{
  const d:any=await c.fetch(`*[_id==$id][0]{sections}`,{id:HOME})
  const s=(d.sections||[]).find((x:any)=>x._type==='quizPromoSection')
  if(!s){console.log('no quizPromoSection');return}
  const opts=[['Warm & Oriental','دافئ وشرقي'],['Fresh & Citrus','منعش وحمضي'],['Bold & Woody','جريء وخشبي'],['Light & Floral','خفيف وزهري']]
  await c.patch(HOME).set({
    [`sections[_key=="${s._key}"].previewLabel_en`]:'Scent Finder',
    [`sections[_key=="${s._key}"].previewLabel_ar`]:'مكتشف العطر',
    [`sections[_key=="${s._key}"].previewQuestion_en`]:"What's the vibe you're after?",
    [`sections[_key=="${s._key}"].previewQuestion_ar`]:'ما الأجواء التي تبحث عنها؟',
    [`sections[_key=="${s._key}"].previewProgress_en`]:'Question 1 of 5',
    [`sections[_key=="${s._key}"].previewProgress_ar`]:'السؤال 1 من 5',
    [`sections[_key=="${s._key}"].previewOptions`]:opts.map(o=>({_type:'opt',_key:key(),label_en:o[0],label_ar:o[1]})),
  }).commit()
  console.log('✅ quiz preview card seeded (EN + AR)')
})().catch(e=>{console.error('❌',e.message);process.exit(1)})
