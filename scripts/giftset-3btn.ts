import { readFileSync, existsSync } from 'fs'; import { join } from 'path'; import { createClient } from '@sanity/client'
const p=join(process.cwd(),'.env.local'); if(existsSync(p)) readFileSync(p,'utf-8').split('\n').filter(l=>l.trim()&&!l.startsWith('#')).forEach(l=>{const i=l.indexOf('=');if(i>0){const k=l.slice(0,i).trim();const v=l.slice(i+1).trim().replace(/^["']|["']$/g,'');if(!process.env[k])process.env[k]=v}})
const c=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET||'production',apiVersion:'2024-01-01',useCdn:false,token:process.env.SANITY_API_TOKEN})
;(async()=>{
  const col:any=await c.fetch(`*[_type=="collection" && slug.current=="gift-sets"][0]{_id}`)
  if(!col?._id){console.log('no collection');return}
  await c.patch(col._id).set({
    ctaButton:{_type:'ctaButton',label_en:'Gift Card',label_ar:'بطاقة هدية',link:'/en/gift-cards',style:'primary'},
    ctaSecondary:{_type:'ctaButton',label_en:'Gift Wrapping',label_ar:'تغليف الهدايا',link:'/en/gift-wrapping',style:'outline'},
    ctaTertiary:{_type:'ctaButton',label_en:'Corporate Gifting',label_ar:'هدايا الشركات',link:'/en/corporate-gifting',style:'outline'},
  }).commit()
  console.log('✅ 3 buttons set: Gift Card | Gift Wrapping | Corporate Gifting')
})().catch(e=>{console.error('❌',e.message);process.exit(1)})
