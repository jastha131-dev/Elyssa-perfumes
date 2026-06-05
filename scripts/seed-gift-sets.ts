/** Create Gift Sets category + 3 gift-set bundle products (EN+AR) + wire collection. */
import { readFileSync, existsSync } from 'fs'; import { join } from 'path'
import { createClient } from '@sanity/client'; import { randomUUID } from 'crypto'
const p=join(process.cwd(),'.env.local'); if(existsSync(p)) readFileSync(p,'utf-8').split('\n').filter(l=>l.trim()&&!l.startsWith('#')).forEach(l=>{const i=l.indexOf('=');if(i>0){const k=l.slice(0,i).trim();const v=l.slice(i+1).trim().replace(/^["']|["']$/g,'');if(!process.env[k])process.env[k]=v}})
const c=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET||'production',apiVersion:'2024-01-01',useCdn:false,token:process.env.SANITY_API_TOKEN})
const key=()=>`k${randomUUID().replace(/-/g,'').slice(0,10)}`
const b=(t:string)=>{const k=key();return{_type:'block',_key:k,style:'normal',markDefs:[],children:[{_type:'span',_key:k+'s',text:t,marks:[]}]}}
const im=(r:string,a:string)=>({_type:'image',_key:key(),asset:{_type:'reference',_ref:r},alt:a})
const ref=(id:string,qty=1)=>({_key:key(),product:{_type:'reference',_ref:id},quantity:qty})
const vol=(price:number,sku:string)=>[{_type:'volumeOption',_key:key(),ml:100,price,sku}]
const A={oriental:'image-310577811d5e12aee8b2c381cdaf17923b42cbe6-800x1067-jpg',floral:'image-ca178f5fd6dbbdc0dd01f6b8a61ebdba7d0dc9d3-800x1067-jpg',woody:'image-84de95433a1af6dae611a9ada3a2c6e7ca4b806c-1024x1024-jpg'}

const SETS=[
 {id:'prod-gift-discovery',en:'Discovery Trio',ar:'مجموعة الاكتشاف',fam:'Floral',price:120,cmp:150,img:A.floral,
  dEn:'Three of our most-loved fragrances in elegant travel sizes — the perfect introduction to the Elyssa world.',dAr:'ثلاثة من أحب عطورنا بأحجام سفر أنيقة — المقدّمة المثالية لعالم إليسا.',
  bundle:[ref('prod-iris-poudre'),ref('prod-jasmin-etoile'),ref('prod-neroli-azur')],tags:['gift-set','gift','discovery'],sku:'GIFT-DISC'},
 {id:'prod-gift-hishers',en:'His & Hers Duo',ar:'ثنائي له ولها',fam:'Oriental',price:180,cmp:230,img:A.oriental,
  dEn:'A curated pairing of two signature scents — one bold, one romantic — presented in our signature gift box.',dAr:'ثنائي منتقى من عطرين مميّزين — أحدهما جريء والآخر رومانسي — في صندوق هدايانا المميّز.',
  bundle:[ref('prod-royal-oud-intense'),ref('prod-rose-empress')],tags:['gift-set','gift','couple'],sku:'GIFT-DUO'},
 {id:'prod-gift-oud',en:'Luxury Oud Collection',ar:'مجموعة العود الفاخرة',fam:'Oriental',price:320,cmp:400,img:A.woody,
  dEn:'Our three finest oud compositions in one opulent set — the ultimate gift for the connoisseur.',dAr:'أرقى ثلاث تركيبات عود لدينا في مجموعة فاخرة واحدة — الهدية المثالية للخبير.',
  bundle:[ref('prod-royal-oud-intense'),ref('prod-black-diamond-elixir'),ref('prod-imperial-saffron')],tags:['gift-set','gift','oud','luxury'],sku:'GIFT-OUD'},
]

;(async()=>{
  // 1. Gift Sets category
  await c.createOrReplace({_id:'category-gift-sets',_type:'category',name_en:'Gift Sets',name_ar:'طقم هدايا',slug:{_type:'slug',current:'gift-sets'},order:4})
  console.log('✓ category: Gift Sets')
  // 2. Gift-set products
  for(const s of SETS){
    await c.createOrReplace({_id:s.id,_type:'product',name_en:s.en,name_ar:s.ar,slug:{_type:'slug',current:s.id.replace('prod-','')},
      price:s.price,compareAtPrice:s.cmp,description_en:s.dEn,description_ar:s.dAr,
      story_en:[b(s.dEn)],story_ar:[b(s.dAr)],images:[im(s.img,s.en)],
      category:{_type:'reference',_ref:'category-gift-sets'},fragranceFamily:s.fam,intensity:'Moderate',sillage:'Moderate',longevity:'Long',
      volume:vol(s.price,s.sku),stock:25,featured:false,bestSeller:false,new:true,tags:s.tags,bundleProducts:s.bundle,
      seoTitle_en:s.en,seoTitle_ar:s.ar,seoDescription_en:s.dEn.slice(0,155),seoDescription_ar:s.dAr.slice(0,155)})
    console.log('✓ gift set:',s.en)
  }
  // 3. Wire gift-sets collection → manual, these products
  const col:any=await c.fetch(`*[_type=="collection" && slug.current=="gift-sets"][0]{_id}`)
  if(col?._id){
    await c.patch(col._id).set({filterType:'manual',manualProducts:SETS.map(s=>({_type:'reference',_ref:s.id,_key:key()}))}).commit()
    console.log('✓ collection wired (manual → 3 gift sets)')
  }
  console.log('\n✅ Gift Sets done (EN + AR, dynamic).')
})().catch(e=>{console.error('❌',e.message);process.exit(1)})
