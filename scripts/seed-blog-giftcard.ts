/** Seed Gift Card page + Authors + Articles (EN + AR). */
import { readFileSync, existsSync } from 'fs'; import { join } from 'path'
import { createClient } from '@sanity/client'; import { randomUUID } from 'crypto'
const p=join(process.cwd(),'.env.local'); if(existsSync(p)) readFileSync(p,'utf-8').split('\n').filter(l=>l.trim()&&!l.startsWith('#')).forEach(l=>{const i=l.indexOf('=');if(i>0){const k=l.slice(0,i).trim();const v=l.slice(i+1).trim().replace(/^["']|["']$/g,'');if(!process.env[k])process.env[k]=v}})
const c=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET||'production',apiVersion:'2024-01-01',useCdn:false,token:process.env.SANITY_API_TOKEN})
const key=()=>`k${randomUUID().replace(/-/g,'').slice(0,10)}`
const blk=(t:string,style='normal')=>{const k=key();return{_type:'block',_key:k,style,markDefs:[],children:[{_type:'span',_key:k+'s',text:t,marks:[]}]}}
const img=(ref:string,alt:string)=>({_type:'image',asset:{_type:'reference',_ref:ref},alt})
const A={floral:'image-ca178f5fd6dbbdc0dd01f6b8a61ebdba7d0dc9d3-800x1067-jpg',oriental:'image-310577811d5e12aee8b2c381cdaf17923b42cbe6-800x1067-jpg',woody:'image-84de95433a1af6dae611a9ada3a2c6e7ca4b806c-1024x1024-jpg',floral2:'image-fc4c8e1313aabf322043b7fd11243d1a4b0ce518-800x1067-jpg'}

;(async()=>{
  // ── Gift Card page ──
  await c.createOrReplace({_id:'giftCardPage',_type:'giftCardPage',
    headline_en:'The Gift of Choice',headline_ar:'هدية الاختيار',
    subtext_en:'Give them the freedom to choose their perfect scent with an Elyssa gift card — delivered instantly by email.',
    subtext_ar:'امنحهم حرية اختيار عطرهم المثالي ببطاقة هدية من إليسا — تُرسل فوراً عبر البريد الإلكتروني.',
    denominations:[
      {_key:key(),label_en:'$50',label_ar:'50$',amountCents:5000,popular:false},
      {_key:key(),label_en:'$100',label_ar:'100$',amountCents:10000,popular:true},
      {_key:key(),label_en:'$200',label_ar:'200$',amountCents:20000,popular:false},
    ],
    howItWorks:[
      {_key:key(),step:1,text_en:'Choose an amount',text_ar:'اختر المبلغ'},
      {_key:key(),step:2,text_en:'Add a personal message',text_ar:'أضف رسالة شخصية'},
      {_key:key(),step:3,text_en:'Delivered instantly by email',text_ar:'تُرسل فوراً عبر البريد'},
    ],
    terms_en:'Gift cards never expire and can be redeemed on any product. They are non-refundable and cannot be exchanged for cash.',
    terms_ar:'بطاقات الهدايا لا تنتهي صلاحيتها ويمكن استخدامها على أي منتج. وهي غير قابلة للاسترداد ولا تُستبدل نقداً.'})
  console.log('✓ gift card page')

  // ── Authors ──
  const authors=[
    {id:'author-yasmin',name_en:'Yasmin Haddad',name_ar:'ياسمين حداد',role_en:'Fragrance Editor',role_ar:'محرّرة العطور',bio_en:'Yasmin has spent a decade writing about scent, beauty and the art of perfumery for leading luxury titles.',bio_ar:'أمضت ياسمين عقداً في الكتابة عن العطور والجمال وفن العطارة لكبرى المجلات الفاخرة.',photo:A.floral},
    {id:'author-omar',name_en:'Omar Rahman',name_ar:'عمر رحمن',role_en:'Master Perfumer',role_ar:'صانع عطور بارع',bio_en:'A third-generation perfumer, Omar blends traditional Arabian techniques with modern composition.',bio_ar:'صانع عطور من الجيل الثالث، يمزج عمر التقنيات العربية التقليدية مع التأليف الحديث.',photo:A.woody},
    {id:'author-layla',name_en:'Layla Karim',name_ar:'ليلى كريم',role_en:'Lifestyle Writer',role_ar:'كاتبة أسلوب حياة',bio_en:'Layla explores how fragrance shapes mood, memory and everyday rituals of self-care.',bio_ar:'تستكشف ليلى كيف يشكّل العطر المزاج والذاكرة وطقوس العناية اليومية بالذات.',photo:A.floral2},
  ]
  for(const a of authors){
    await c.createOrReplace({_id:a.id,_type:'author',name_en:a.name_en,name_ar:a.name_ar,slug:{_type:'slug',current:a.id.replace('author-','')},role_en:a.role_en,role_ar:a.role_ar,bio_en:a.bio_en,bio_ar:a.bio_ar,photo:img(a.photo,a.name_en)})
    console.log('✓ author:',a.name_en)
  }

  // ── Articles ──
  const arts=[
    {id:'article-signature-scent',ten:'How to Find Your Signature Scent',tar:'كيف تجد عطرك المميّز',cat:'Guide',auth:'author-yasmin',feat:true,date:'2026-05-20',cover:A.floral,tags:['guide','signature','beginners'],
     exEn:'Your signature scent is more than a fragrance — it is an extension of who you are. Here is how to find yours.',exAr:'عطرك المميّز أكثر من مجرد رائحة — إنه امتداد لشخصيتك. إليك كيف تجد عطرك.',
     en:['Finding the One','Start by identifying the fragrance families you naturally gravitate towards — floral, woody, oriental or fresh. Your favourite scents often share a hidden thread.','Test on skin, not paper, and live with a fragrance for a full day before deciding. The right scent should feel effortless, like it was always yours.'],
     ar:['العثور على العطر','ابدأ بتحديد عائلات العطور التي تنجذب إليها طبيعياً — زهرية أو خشبية أو شرقية أو منعشة. غالباً ما تشترك عطورك المفضّلة في خيط خفي.','جرّب العطر على البشرة لا الورق، وعِش معه يوماً كاملاً قبل أن تقرّر. العطر الصحيح يجب أن يبدو سلساً، وكأنه كان لك دائماً.']},
    {id:'article-layering',ten:'The Art of Layering Fragrances',tar:'فن تركيب العطور',cat:'Education',auth:'author-omar',feat:false,date:'2026-04-28',cover:A.woody,tags:['layering','technique','advanced'],
     exEn:'Layering lets you build a scent that is truly your own. Master the basics with our perfumer’s guide.',exAr:'يتيح لك التركيب بناء عطر خاص بك تماماً. أتقن الأساسيات مع دليل صانع العطور لدينا.',
     en:['Building Depth','Begin with a heavier base — oud, amber or sandalwood — then layer a lighter floral or citrus on top to add brightness.','Keep notes within the same family for harmony, or contrast warm and fresh for a bolder signature. Less is more: two scents are usually enough.'],
     ar:['بناء العمق','ابدأ بقاعدة أثقل — عود أو عنبر أو خشب صندل — ثم أضف طبقة أخف من الزهور أو الحمضيات في الأعلى لإضافة الإشراق.','أبقِ النوتات ضمن العائلة نفسها للانسجام، أو قابل بين الدافئ والمنعش لتوقيع أجرأ. القليل أفضل: عطران عادةً يكفيان.']},
    {id:'article-atelier-oud',ten:'Inside Our Atelier: Crafting Oud',tar:'داخل مشغلنا: صناعة العود',cat:'Behind the Scenes',auth:'author-omar',feat:false,date:'2026-03-15',cover:A.oriental,tags:['oud','craft','atelier'],
     exEn:'Step inside our atelier to discover how the world’s most precious wood becomes liquid gold.',exAr:'ادخل إلى مشغلنا لتكتشف كيف يتحوّل أثمن خشب في العالم إلى ذهب سائل.',
     en:['From Wood to Gold','True oud takes years to mature. We source aged agarwood from protected forests and macerate it slowly to release its smoky, resinous soul.','Every batch is hand-blended and aged again before bottling — a patient ritual that no machine can replace.'],
     ar:['من الخشب إلى الذهب','يحتاج العود الحقيقي سنوات لينضج. نستورد خشب العود المُعتّق من غابات محمية وننقعه ببطء لإطلاق روحه الدخانية الراتنجية.','تُمزج كل دفعة يدوياً وتُعتّق مرة أخرى قبل التعبئة — طقس صبور لا يمكن لأي آلة أن تحلّ محلّه.']},
    {id:'article-spring-scents',ten:'5 Scents for Spring',tar:'5 عطور للربيع',cat:'Inspiration',auth:'author-layla',feat:false,date:'2026-02-10',cover:A.floral2,tags:['spring','seasonal','fresh'],
     exEn:'As the season turns, lighten your fragrance wardrobe with these five fresh, floral picks.',exAr:'مع تغيّر الفصل، خفّف خزانة عطورك مع هذه الاختيارات الخمسة المنعشة والزهرية.',
     en:['Scents of the Season','Spring calls for lighter, brighter compositions — think neroli, jasmine and dewy green notes that feel like a fresh start.','From luminous florals to crisp citrus, these five fragrances capture the optimism of the season in a single spritz.'],
     ar:['عطور الموسم','يستدعي الربيع تركيبات أخف وأكثر إشراقاً — نيرولي وياسمين ونوتات خضراء نديّة تشبه بداية جديدة.','من الزهور المضيئة إلى الحمضيات المنعشة، تلتقط هذه العطور الخمسة تفاؤل الموسم في رشّة واحدة.']},
  ]
  for(const a of arts){
    await c.createOrReplace({_id:a.id,_type:'article',title_en:a.ten,title_ar:a.tar,slug:{_type:'slug',current:a.id.replace('article-','')},
      category:a.cat,author:{_type:'reference',_ref:a.auth},featured:a.feat,publishedAt:a.date+'T09:00:00Z',readTime:'4 min read',
      excerpt_en:a.exEn,excerpt_ar:a.exAr,coverImage:img(a.cover,a.ten),tags:a.tags,
      content:a.en.map((t,i)=>blk(t,i===0?'h2':'normal')),
      seoTitle_en:a.ten,seoTitle_ar:a.tar,seoDescription_en:a.exEn.slice(0,155),seoDescription_ar:a.exAr.slice(0,155)})
    console.log('✓ article:',a.ten)
  }
  console.log('\n✅ Gift card + 3 authors + 4 articles seeded (EN + AR).')
})().catch(e=>{console.error('❌',e.message);process.exit(1)})
