import { readFileSync, existsSync } from 'fs'; import { join } from 'path'; import { createClient } from '@sanity/client'
const p=join(process.cwd(),'.env.local'); if(existsSync(p)) readFileSync(p,'utf-8').split('\n').filter(l=>l.trim()&&!l.startsWith('#')).forEach(l=>{const i=l.indexOf('=');if(i>0){const k=l.slice(0,i).trim();const v=l.slice(i+1).trim().replace(/^["']|["']$/g,'');if(!process.env[k])process.env[k]=v}})
const c=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET||'production',apiVersion:'2024-01-01',useCdn:false,token:process.env.SANITY_API_TOKEN})
;(async()=>{
  const col:any=await c.fetch(`*[_type=="collection" && slug.current=="gift-sets"][0]{_id}`)
  if(!col?._id){console.log('no gift-sets collection');return}
  await c.patch(col._id).set({
    headline_en:'Gift Sets',headline_ar:'طقم هدايا',
    subtext_en:'Beautifully curated sets — the perfect way to give the gift of luxury fragrance.',
    subtext_ar:'مجموعات منتقاة بعناية — الطريقة المثالية لإهداء فخامة العطور.',
    ctaButton:{_type:'ctaButton',label_en:'Shop Gift Sets',label_ar:'تسوّق الأطقم',link:'/en/collections/gift-sets',style:'primary'},
    ctaSecondary:{_type:'ctaButton',label_en:'Gift Card',label_ar:'بطاقة هدية',link:'/en/gift-cards',style:'outline'},
  }).commit()
  console.log('✅ gift-sets hero + 2 buttons seeded (EN+AR)')
})().catch(e=>{console.error('❌',e.message);process.exit(1)})
