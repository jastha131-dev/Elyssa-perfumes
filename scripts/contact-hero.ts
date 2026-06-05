import { readFileSync, existsSync } from 'fs'; import { join } from 'path'; import { createClient } from '@sanity/client'
const p=join(process.cwd(),'.env.local'); if(existsSync(p)) readFileSync(p,'utf-8').split('\n').filter(l=>l.trim()&&!l.startsWith('#')).forEach(l=>{const i=l.indexOf('=');if(i>0){const k=l.slice(0,i).trim();const v=l.slice(i+1).trim().replace(/^["']|["']$/g,'');if(!process.env[k])process.env[k]=v}})
const c=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET||'production',apiVersion:'2024-01-01',useCdn:false,token:process.env.SANITY_API_TOKEN})
;(async()=>{
  const id=await c.fetch(`*[_type=="contactPage"][0]._id`) || 'contactPage'
  await c.patch(id).setIfMissing({_type:'contactPage'} as any).set({
    heroImage:{_type:'image',asset:{_type:'reference',_ref:'image-310577811d5e12aee8b2c381cdaf17923b42cbe6-800x1067-jpg'},alt:'Get in touch with Elyssa'}
  }).commit({autoGenerateArrayKeys:true}).catch(async()=>{
    await c.createOrReplace({_id:'contactPage',_type:'contactPage',heroImage:{_type:'image',asset:{_type:'reference',_ref:'image-310577811d5e12aee8b2c381cdaf17923b42cbe6-800x1067-jpg'},alt:'Get in touch with Elyssa'}})
  })
  console.log('✅ contact hero image set')
})().catch(e=>{console.error('❌',e.message);process.exit(1)})
