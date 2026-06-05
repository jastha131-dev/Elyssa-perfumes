/** Seed the About page (EN + AR). */
import { readFileSync, existsSync } from 'fs'; import { join } from 'path'
import { createClient } from '@sanity/client'; import { randomUUID } from 'crypto'
const p=join(process.cwd(),'.env.local'); if(existsSync(p)) readFileSync(p,'utf-8').split('\n').filter(l=>l.trim()&&!l.startsWith('#')).forEach(l=>{const i=l.indexOf('=');if(i>0){const k=l.slice(0,i).trim();const v=l.slice(i+1).trim().replace(/^["']|["']$/g,'');if(!process.env[k])process.env[k]=v}})
const c=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET||'production',apiVersion:'2024-01-01',useCdn:false,token:process.env.SANITY_API_TOKEN})
const key=()=>`k${randomUUID().replace(/-/g,'').slice(0,10)}`
const blk=(t:string)=>{const k=key();return{_type:'block',_key:k,style:'normal',markDefs:[],children:[{_type:'span',_key:k+'s',text:t,marks:[]}]}}
const IMG='image-310577811d5e12aee8b2c381cdaf17923b42cbe6-800x1067-jpg'

;(async()=>{
  await c.createOrReplace({
    _id:'aboutPage',_type:'aboutPage',
    heroEyebrow_en:'Our Story',heroEyebrow_ar:'قصتنا',
    heroHeadline_en:'Crafted for the Extraordinary',heroHeadline_ar:'صُنع للاستثنائيين',
    heroSubline_en:'Elyssa was born from a single belief — that fragrance is the most intimate form of luxury. We source the world’s rarest materials and compose them into scents that become part of who you are.',
    heroSubline_ar:'وُلدت إليسا من إيمان واحد — أن العطر هو أكثر أشكال الفخامة حميمية. نستورد أندر المواد في العالم ونؤلّفها في عطور تصبح جزءاً من هويتك.',
    heroBgImage:{_type:'image',asset:{_type:'reference',_ref:IMG},alt:'Elyssa luxury fragrances'},
    stats:[
      {_key:key(),value:'100%',label_en:'Authentic',label_ar:'أصلي'},
      {_key:key(),value:'50+',label_en:'Maisons',label_ar:'دار عطر'},
      {_key:key(),value:'80+',label_en:'Countries',label_ar:'دولة'},
      {_key:key(),value:'30-Day',label_en:'Easy Returns',label_ar:'إرجاع سهل'},
    ],
    philosophyHeadline_en:'A Philosophy of Scent',philosophyHeadline_ar:'فلسفة العطر',
    philosophyBody_en:[blk('We believe a fragrance should never be ordinary. Every Elyssa scent begins with the finest raw materials — aged oud, Grasse florals, precious resins — and is composed by master perfumers over months of patient refinement.'),blk('We do not chase trends. We craft signatures: layered, lasting, and entirely your own.')],
    philosophyBody_ar:[blk('نؤمن أن العطر يجب ألا يكون عادياً أبداً. يبدأ كل عطر من إليسا بأجود المواد الخام — العود المُعتّق، وزهور غراس، والراتنجات النفيسة — يؤلّفه صانعو عطور بارعون عبر أشهر من التنقيح الصبور.'),blk('نحن لا نلاحق الصيحات. بل نصنع توقيعات: متعددة الطبقات، تدوم طويلاً، وخاصة بك تماماً.')],
    pillars:[
      {_key:key(),number:'01',title_en:'Authenticity',title_ar:'الأصالة',body_en:'Every fragrance is sourced directly from trusted houses and guaranteed 100% genuine.',body_ar:'يُستورد كل عطر مباشرةً من دور موثوقة ومضمون أصلي 100٪.'},
      {_key:key(),number:'02',title_en:'Craftsmanship',title_ar:'الحرفية',body_en:'Composed by master perfumers using time-honoured techniques and rare materials.',body_ar:'يؤلّفه صانعو عطور بارعون باستخدام تقنيات عريقة ومواد نادرة.'},
      {_key:key(),number:'03',title_en:'Sustainability',title_ar:'الاستدامة',body_en:'Responsibly sourced ingredients and recyclable, considered packaging.',body_ar:'مكوّنات مستخرجة بمسؤولية وتغليف قابل لإعادة التدوير ومدروس.'},
      {_key:key(),number:'04',title_en:'Lasting Luxury',title_ar:'فخامة تدوم',body_en:'High-concentration Eau de Parfum for projection and longevity that endures.',body_ar:'أو دو بارفان عالي التركيز لانتشار وثبات يدومان طويلاً.'},
    ],
    timeline:[
      {_key:key(),year:'2018',event_en:'Elyssa is founded with a single oud blend and a bold vision.',event_ar:'تأسّست إليسا بمزيج عود واحد ورؤية جريئة.'},
      {_key:key(),year:'2020',event_en:'Our first atelier opens, partnering with perfumers in Grasse.',event_ar:'افتُتح أول مشغل لنا بالشراكة مع صانعي عطور في غراس.'},
      {_key:key(),year:'2023',event_en:'We expand to over 80 countries, shipping worldwide.',event_ar:'توسّعنا إلى أكثر من 80 دولة، نشحن حول العالم.'},
      {_key:key(),year:'2026',event_en:'The signature collection launches — our finest work yet.',event_ar:'تُطلق المجموعة المميّزة — أرقى أعمالنا حتى الآن.'},
    ],
    ctaHeadline_en:'Find Your Signature',ctaHeadline_ar:'اعثر على توقيعك',
    ctaBody_en:'Discover the fragrance that was made for you. Explore the collection or take our scent quiz.',
    ctaBody_ar:'اكتشف العطر الذي صُنع لك. استكشف المجموعة أو جرّب اختبار العطور.',
    ctaPrimary:{_type:'ctaButton',label_en:'Shop the Collection',label_ar:'تسوّق المجموعة',link:'/products',style:'primary'},
    ctaSecondary:{_type:'ctaButton',label_en:'Take the Quiz',label_ar:'ابدأ الاختبار',link:'/quiz',style:'outline'},
    seoTitle_en:'About Elyssa — Our Story',seoTitle_ar:'عن إليسا — قصتنا',
    seoDescription_en:'Elyssa crafts rare luxury fragrances from the world’s finest materials. Discover our story, philosophy and craftsmanship.',
    seoDescription_ar:'تصنع إليسا عطوراً فاخرة نادرة من أجود مواد العالم. اكتشف قصتنا وفلسفتنا وحرفيتنا.',
  })
  console.log('✅ About page seeded (EN + AR).')
})().catch(e=>{console.error('❌',e.message);process.exit(1)})
