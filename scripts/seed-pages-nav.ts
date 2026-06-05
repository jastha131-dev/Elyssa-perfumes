/** Seed legal + gift pages (EN+AR rich text) and add Blog to the navbar (navConfig). */
import { readFileSync, existsSync } from 'fs'; import { join } from 'path'
import { createClient } from '@sanity/client'; import { randomUUID } from 'crypto'
const p=join(process.cwd(),'.env.local'); if(existsSync(p)) readFileSync(p,'utf-8').split('\n').filter(l=>l.trim()&&!l.startsWith('#')).forEach(l=>{const i=l.indexOf('=');if(i>0){const k=l.slice(0,i).trim();const v=l.slice(i+1).trim().replace(/^["']|["']$/g,'');if(!process.env[k])process.env[k]=v}})
const c=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET||'production',apiVersion:'2024-01-01',useCdn:false,token:process.env.SANITY_API_TOKEN})
const key=()=>`k${randomUUID().replace(/-/g,'').slice(0,10)}`
const blk=(text:string,style='normal')=>{const k=key();return{_type:'block',_key:k,style,markDefs:[],children:[{_type:'span',_key:k+'s',text,marks:[]}]}}
const rich=(en:string[],ar:string[])=>({_type:'richTextSection',_key:key(),isVisible:true,maxWidth:'normal',textAlign:'left',content_en:en.map((t,i)=>blk(t,i===0?'h2':'normal')),content_ar:ar.map((t,i)=>blk(t,i===0?'h2':'normal'))})

const PAGES=[
 {slug:'privacy-policy',ten:'Privacy Policy',tar:'سياسة الخصوصية',ord:20,
  en:['Privacy Policy','We respect your privacy. The personal information you share — name, contact, address and payment details — is used only to process your orders and improve your experience.','We never sell your data. Information is stored securely and shared only with trusted partners (payment and delivery) required to fulfil your order.','You may request access to, correction of, or deletion of your data at any time by contacting our support team.'],
  ar:['سياسة الخصوصية','نحترم خصوصيتك. تُستخدم معلوماتك الشخصية — الاسم وبيانات الاتصال والعنوان وتفاصيل الدفع — فقط لمعالجة طلباتك وتحسين تجربتك.','لا نبيع بياناتك أبداً. تُخزَّن المعلومات بأمان وتُشارَك فقط مع الشركاء الموثوقين (الدفع والتوصيل) اللازمين لإتمام طلبك.','يمكنك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها في أي وقت بالتواصل مع فريق الدعم.']},
 {slug:'terms-conditions',ten:'Terms & Conditions',tar:'الشروط والأحكام',ord:21,
  en:['Terms & Conditions','By using this website and placing an order, you agree to these terms. All products are subject to availability and prices may change without notice.','Orders are confirmed once payment is received. We reserve the right to refuse or cancel any order at our discretion.','All content, images and branding on this site are our property and may not be reproduced without permission.'],
  ar:['الشروط والأحكام','باستخدامك هذا الموقع وتقديم طلب، فإنك توافق على هذه الشروط. تخضع جميع المنتجات للتوفر وقد تتغير الأسعار دون إشعار.','تُؤكَّد الطلبات بمجرد استلام الدفع. نحتفظ بالحق في رفض أو إلغاء أي طلب وفق تقديرنا.','جميع المحتويات والصور والعلامات على هذا الموقع ملكنا ولا يجوز نسخها دون إذن.']},
 {slug:'shipping-policy',ten:'Shipping Policy',tar:'سياسة الشحن',ord:22,
  en:['Shipping Policy','We ship worldwide to over 80 countries. Orders are dispatched within 1–2 business days of confirmation.','Standard delivery takes 5–10 business days; express delivery (2–3 days) is available at checkout. Complimentary shipping applies on orders over $110.','You will receive a tracking link by email once your order ships. Customs duties, where applicable, are the responsibility of the recipient.'],
  ar:['سياسة الشحن','نشحن إلى أكثر من 80 دولة حول العالم. تُرسل الطلبات خلال 1–2 يوم عمل من التأكيد.','يستغرق التوصيل القياسي 5–10 أيام عمل؛ ويتوفر التوصيل السريع (2–3 أيام) عند الدفع. الشحن مجاني للطلبات التي تتجاوز 110 دولار.','ستتلقى رابط تتبع عبر البريد بمجرد شحن طلبك. الرسوم الجمركية، إن وُجدت، مسؤولية المستلم.']},
 {slug:'return-refund-policy',ten:'Return & Refund Policy',tar:'سياسة الإرجاع والاسترداد',ord:23,
  en:['Return & Refund Policy','We offer a 30-day return window on unopened, unused items in their original packaging. For hygiene reasons, opened fragrances cannot be returned.','Damaged or incorrect items are replaced free of charge or fully refunded. Email support with your order number to start a return.','Approved refunds are processed within 5–7 business days to your original payment method.'],
  ar:['سياسة الإرجاع والاسترداد','نقدّم نافذة إرجاع مدتها 30 يوماً للمنتجات غير المفتوحة وغير المستخدمة في عبوتها الأصلية. لأسباب صحية، لا يمكن إرجاع العطور المفتوحة.','تُستبدل المنتجات التالفة أو الخاطئة مجاناً أو يُسترد ثمنها كاملاً. راسل الدعم مع رقم طلبك لبدء الإرجاع.','تُعالَج المبالغ المستردة المعتمدة خلال 5–7 أيام عمل إلى وسيلة الدفع الأصلية.']},
 {slug:'disclaimer',ten:'Disclaimer',tar:'إخلاء المسؤولية',ord:24,
  en:['Disclaimer','The information on this website is provided for general purposes only. Fragrance descriptions, notes and imagery are indicative and may vary slightly.','We are not liable for any allergic reaction; please review ingredients and patch-test before use. Colours may differ slightly between screens.','This site may contain links to third-party websites for which we are not responsible.'],
  ar:['إخلاء المسؤولية','المعلومات على هذا الموقع لأغراض عامة فقط. أوصاف العطور والنوتات والصور إرشادية وقد تختلف قليلاً.','لسنا مسؤولين عن أي رد فعل تحسّسي؛ يُرجى مراجعة المكوّنات وإجراء اختبار قبل الاستخدام. قد تختلف الألوان قليلاً بين الشاشات.','قد يحتوي هذا الموقع على روابط لمواقع خارجية لسنا مسؤولين عنها.']},
 {slug:'gift-wrapping',ten:'Gift Wrapping',tar:'تغليف الهدايا',ord:25,
  en:['Gift Wrapping','Every order can arrive beautifully gift-wrapped in our signature box with satin ribbon and tissue — complimentary on request.','Add a personalised message at checkout and we will include a handwritten card. Prices are never shown on gift orders.','Choose gift wrapping in your cart before payment to make any order ready to give.'],
  ar:['تغليف الهدايا','يمكن أن يصل كل طلب مغلّفاً بشكل جميل في صندوقنا المميّز مع شريط ساتان وورق — مجاناً عند الطلب.','أضف رسالة شخصية عند الدفع وسنرفق بطاقة مكتوبة بخط اليد. لا تظهر الأسعار أبداً على طلبات الهدايا.','اختر تغليف الهدايا في سلتك قبل الدفع لتجهيز أي طلب للإهداء.']},
 {slug:'corporate-gifting',ten:'Corporate Gifting',tar:'الهدايا للشركات',ord:26,
  en:['Corporate Gifting','Make a lasting impression with bespoke corporate gifts. We offer bulk orders, custom branding and curated fragrance sets for clients and teams.','Enjoy preferential pricing on volume orders, personalised packaging and dedicated account support.','Contact our corporate team to design a gifting programme tailored to your business.'],
  ar:['الهدايا للشركات','اترك انطباعاً يدوم مع هدايا شركات مخصّصة. نوفّر طلبات بالجملة وعلامة تجارية مخصّصة ومجموعات عطور مُنتقاة للعملاء والفرق.','استمتع بأسعار تفضيلية على الطلبات الكبيرة، وتغليف مخصّص، ودعم حساب مخصّص.','تواصل مع فريق الشركات لتصميم برنامج هدايا مصمّم خصيصاً لأعمالك.']},
]

;(async()=>{
  for(const pg of PAGES){
    await c.createOrReplace({_id:`page-${pg.slug}`,_type:'page',title_en:pg.ten,title_ar:pg.tar,slug:{_type:'slug',current:pg.slug},showInNav:false,navOrder:pg.ord,
      seoTitle_en:pg.ten,seoTitle_ar:pg.tar,seoDescription_en:pg.en[1].slice(0,155),seoDescription_ar:pg.ar[1].slice(0,155),
      sections:[rich(pg.en,pg.ar)]})
    console.log('✓ page:',pg.slug)
  }
  // Add Blog to navbar via navConfig (Studio data, not header code)
  const nav:any=await c.fetch(`*[_type=="navConfig"][0]{_id, items}`)
  if(nav?._id){
    const items=nav.items||[]
    if(!items.some((i:any)=>i.href==='/journal')){
      items.splice(2,0,{_key:key(),label_en:'Blog',label_ar:'المدونة',href:'/journal',highlight:false,visible:true})
      await c.patch(nav._id).set({items}).commit()
      console.log('✓ added Blog to navbar')
    } else console.log('↩ Blog already in navbar')
  }
  console.log('\n✅ Done — 7 pages seeded (EN+AR) + Blog in nav. Toggle "Show in Navigation" per page in Studio.')
})().catch(e=>{console.error('❌',e.message);process.exit(1)})
