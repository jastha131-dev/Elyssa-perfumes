/**
 * Full content seeder for Luxe Parfum.
 * Uploads Unsplash images + seeds FAQ, testimonials, contact page, nav config.
 *
 * Run: npx tsx scripts/seed-all.ts
 * Flags: --force  (re-upload images even if product already has them)
 *
 * Requires in .env.local:
 *   SANITY_API_TOKEN   (needs Editor or higher permissions)
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { createClient } from '@sanity/client'
import { randomUUID } from 'crypto'

// ─── Load .env.local ──────────────────────────────────────────────────────────
const envPath = join(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('#'))
    .forEach((l) => {
      const idx = l.indexOf('=')
      if (idx > 0) {
        const k = l.slice(0, idx).trim()
        const v = l.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
        if (!process.env[k]) process.env[k] = v
      }
    })
}

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID not set')
if (!process.env.SANITY_API_TOKEN) throw new Error('SANITY_API_TOKEN not set — needs write permissions')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const FORCE = process.argv.includes('--force')
const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

// ─── Image helpers ────────────────────────────────────────────────────────────

async function downloadImage(photoId: string, w = 800, h = 1067): Promise<Buffer> {
  const url = `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&q=85&fm=jpg`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'LuxeParfumSeeder/2.0' },
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for photo-${photoId}`)
  return Buffer.from(await res.arrayBuffer())
}

async function uploadImage(photoId: string, filename: string, w?: number, h?: number) {
  const buf = await downloadImage(photoId, w, h)
  process.stdout.write(` (${Math.round(buf.length / 1024)}KB)`)
  return client.assets.upload('image', buf, { filename, contentType: 'image/jpeg' })
}

function sanityImage(assetId: string, alt: string, k = key()) {
  return { _type: 'image', _key: k, asset: { _type: 'reference', _ref: assetId }, alt }
}

// ─── Curated Unsplash photo IDs ───────────────────────────────────────────────
// Dark/Oriental — oud, amber, smoke tones
const ORIENTAL = [
  { id: '1541943869728-4bd4f450c8f5', alt: 'Dark luxury oud perfume bottle on black marble' },
  { id: '1550259979-ed79b48d2a30',    alt: 'Moody oriental fragrance with amber glow' },
  { id: '1547793549-70faf88843be',    alt: 'Premium cologne bottle on obsidian surface' },
]

// Light/Floral — rose, jasmine, feminine
const FLORAL = [
  { id: '1585386959984-a4155224a1ad', alt: 'Elegant floral perfume bottle surrounded by petals' },
  { id: '1556228578-8c89e6adf883',    alt: 'Rose-tinted fragrance on white marble' },
  { id: '1592945403244-b3fbafd7f539', alt: 'Delicate perfume bottle on soft white surface' },
]

// Fresh/Woody/Citrus — clean, natural
const FRESH = [
  { id: '1523293182086-7651a899d37f', alt: 'Clean modern fragrance bottle in natural light' },
  { id: '1616594039964-ae9021a400a0', alt: 'Minimalist woody perfume on marble slab' },
  { id: '1600369672770-985fd30004eb', alt: 'Citrus-inspired fresh cologne on stone' },
]

// Gourmand/Warm — vanilla, chocolate, sweet
const GOURMAND = [
  { id: '1592945403244-b3fbafd7f539', alt: 'Warm gourmand perfume with golden tones' },
  { id: '1585386959984-a4155224a1ad', alt: 'Sweet vanilla fragrance on soft surface' },
]

// Wide hero/banner shots (landscape)
const HERO_SHOTS = [
  { id: '1541943869728-4bd4f450c8f5', alt: 'Luxe Parfum — luxury fragrance collection hero' },
  { id: '1550259979-ed79b48d2a30',    alt: 'Luxe Parfum — signature collection banner' },
  { id: '1585386959984-a4155224a1ad', alt: 'Luxe Parfum — floral heritage campaign' },
]

function photosForFamily(family: string): typeof ORIENTAL {
  const f = (family || '').toLowerCase()
  if (f === 'oriental') return ORIENTAL
  if (f === 'floral') return FLORAL
  if (f === 'citrus' || f === 'fresh' || f === 'aquatic' || f === 'woody') return FRESH
  if (f === 'gourmand') return GOURMAND
  return ORIENTAL // default
}

// ─── 1. Product images ────────────────────────────────────────────────────────

async function seedProductImages() {
  console.log('\n━━━ 1/5  Product Images ━━━')
  const products = await client.fetch<{
    _id: string; name_en: string; fragranceFamily: string; images: unknown[]
  }[]>(`*[_type == "product"]{_id, name_en, fragranceFamily, images}`)

  console.log(`Found ${products.length} products\n`)

  for (const p of products) {
    const hasImages = Array.isArray(p.images) && p.images.length > 0
    if (hasImages && !FORCE) {
      console.log(`  ↩  ${p.name_en} — already has ${p.images.length} image(s), skipping`)
      continue
    }

    const photos = photosForFamily(p.fragranceFamily)
    const picks = [photos[0], photos[1] ?? photos[0]] // primary + hover

    console.log(`  ⬇  ${p.name_en} (${p.fragranceFamily || 'Unknown'})`)
    const imgs: unknown[] = []

    for (const photo of picks) {
      try {
        process.stdout.write(`       photo-${photo.id}...`)
        const asset = await uploadImage(photo.id, `${p._id}-${key()}.jpg`)
        imgs.push(sanityImage(asset._id, photo.alt))
        console.log(' ✓')
      } catch (e) {
        console.log(` ✗ ${(e as Error).message}`)
      }
    }

    if (imgs.length) {
      await client.patch(p._id).set({ images: imgs }).commit()
      console.log(`     → Patched with ${imgs.length} image(s)\n`)
    }
  }
}

// ─── 2. Category images ───────────────────────────────────────────────────────

async function seedCategoryImages() {
  console.log('\n━━━ 2/5  Category Images ━━━')
  const cats = await client.fetch<{ _id: string; name_en: string; image: unknown }[]>(
    `*[_type == "category"]{_id, name_en, image}`
  )

  const CAT_PHOTOS: Record<string, { id: string; alt: string }> = {
    men:    { id: '1547793549-70faf88843be', alt: 'Men\'s luxury cologne collection — dark and sophisticated' },
    women:  { id: '1556228578-8c89e6adf883', alt: 'Women\'s floral perfume collection — elegant and feminine' },
    unisex: { id: '1523293182086-7651a899d37f', alt: 'Unisex fragrance collection — modern and boundary-free' },
  }

  for (const cat of cats) {
    const slug = cat.name_en?.toLowerCase()
    const photo = CAT_PHOTOS[slug]
    if (!photo) { console.log(`  ↩  ${cat.name_en} — no photo config`); continue }
    if (cat.image && !FORCE) { console.log(`  ↩  ${cat.name_en} — already has image`); continue }

    try {
      process.stdout.write(`  ⬇  ${cat.name_en}...`)
      const asset = await uploadImage(photo.id, `cat-${slug}-${key()}.jpg`, 600, 600)
      await client.patch(cat._id).set({
        image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
      }).commit()
      console.log(' ✓')
    } catch (e) {
      console.log(` ✗ ${(e as Error).message}`)
    }
  }
}

// ─── 3. Testimonials ─────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    _id: 'testimonial-sara',
    _type: 'testimonial',
    name: 'Sara Al-Hassan',
    location: 'Dubai, UAE',
    rating: 5,
    text_en: 'Noir Oud Royale is simply extraordinary. The sillage is incredible — I received compliments all evening. This is the finest oud fragrance I have ever worn.',
    text_ar: 'عطر نوار عود رويال رائع ببساطة. كان الأثر العطري مذهلاً — تلقيت إطراءً طوال المساء. هذا أفضل عطر عود ارتديته على الإطلاق.',
    featured: true,
    order: 1,
  },
  {
    _id: 'testimonial-james',
    _type: 'testimonial',
    name: 'James Whitmore',
    location: 'London, UK',
    rating: 5,
    text_en: 'I ordered the Vetiver Classique and was blown away by the quality. The packaging alone is a work of art. Luxe Parfum has earned a loyal customer.',
    text_ar: 'طلبت عطر فيتيفر كلاسيك وانبهرت بجودته. التغليف وحده تحفة فنية. لقد كسب لوكس بارفان عميلاً مخلصاً.',
    featured: true,
    order: 2,
  },
  {
    _id: 'testimonial-amira',
    _type: 'testimonial',
    name: 'Amira Khalil',
    location: 'Riyadh, Saudi Arabia',
    rating: 5,
    text_en: 'Rose Noire is everything I dreamed of — deep, romantic, and long-lasting. The customer service was exceptional too. Highly recommended.',
    text_ar: 'روز نوار هو كل ما حلمت به — عميق ورومانسي وطويل الأمد. خدمة العملاء كانت استثنائية أيضاً. أنصح به بشدة.',
    featured: true,
    order: 3,
  },
  {
    _id: 'testimonial-carlos',
    _type: 'testimonial',
    name: 'Carlos Mendez',
    location: 'New York, USA',
    rating: 5,
    text_en: 'Santal Lumière is my new signature scent. Warm, creamy sandalwood that evolves beautifully throughout the day. Worth every penny.',
    text_ar: 'سانتال لوميير هو عطري المميز الجديد. صندل دافئ وكريمي يتطور بشكل جميل طوال اليوم. يستحق كل قرش.',
    featured: false,
    order: 4,
  },
  {
    _id: 'testimonial-fatima',
    _type: 'testimonial',
    name: 'Fatima Al-Rashid',
    location: 'Abu Dhabi, UAE',
    rating: 5,
    text_en: 'The Ambre Sublime is a masterpiece. I gifted it to my husband and he has not stopped wearing it. The amber and oud combination is pure luxury.',
    text_ar: 'عطر أمبر سوبليم تحفة فنية. أهديته لزوجي وما توقف عن ارتدائه. مزيج العنبر والعود رفاهية خالصة.',
    featured: true,
    order: 5,
  },
  {
    _id: 'testimonial-priya',
    _type: 'testimonial',
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    rating: 5,
    text_en: 'Iris Céleste is the most elegant fragrance I have ever encountered. Powdery, sophisticated, and utterly timeless. My friends always ask what I am wearing.',
    text_ar: 'إيريس سيليست هو أكثر العطور أناقة التي صادفتها على الإطلاق. مسحوق، راقٍ، وخالد تماماً. أصدقائي دائماً يسألون عما أرتديه.',
    featured: false,
    order: 6,
  },
]

async function seedTestimonials() {
  console.log('\n━━━ 3/5  Testimonials ━━━')
  for (const t of TESTIMONIALS) {
    const existing = await client.fetch(`*[_id == $id][0]._id`, { id: t._id })
    if (existing && !FORCE) { console.log(`  ↩  ${t.name} — exists`); continue }
    await client.createOrReplace(t)
    console.log(`  ✓  ${t.name}`)
  }
}

// ─── 4. FAQ items ─────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  // Shipping
  { _id: 'faq-ship-1', category: 'shipping', order: 1,
    question_en: 'How long does delivery take?',
    question_ar: 'كم يستغرق التسليم؟',
    answer_en: 'Standard delivery takes 5–10 business days internationally. Express shipping (2–3 days) is available at checkout for most destinations. UAE orders typically arrive within 1–3 business days.',
    answer_ar: 'يستغرق التسليم القياسي 5–10 أيام عمل دولياً. يتوفر الشحن السريع (2–3 أيام) عند الدفع لمعظم الوجهات. تصل طلبات الإمارات عادةً خلال 1–3 أيام عمل.' },

  { _id: 'faq-ship-2', category: 'shipping', order: 2,
    question_en: 'Do you offer free shipping?',
    question_ar: 'هل تقدمون الشحن المجاني؟',
    answer_en: 'Yes — complimentary shipping is included on all orders over AED 400 (approximately $110 USD). For orders below this threshold, flat-rate shipping is calculated at checkout based on your location.',
    answer_ar: 'نعم — يشمل الشحن المجاني جميع الطلبات التي تتجاوز 400 درهم إماراتي (ما يعادل حوالي 110 دولار أمريكي). بالنسبة للطلبات دون هذا الحد، يُحسب الشحن بسعر ثابت عند الدفع بناءً على موقعك.' },

  { _id: 'faq-ship-3', category: 'shipping', order: 3,
    question_en: 'Do you ship internationally?',
    question_ar: 'هل تشحنون دولياً؟',
    answer_en: 'We ship to over 80 countries worldwide. All orders are carefully packaged in our signature luxury gift boxes, complete with ribbon, tissue paper, and a personalised card. Please note that certain countries have restrictions on shipping perfume due to regulations on alcohol-based products.',
    answer_ar: 'نشحن إلى أكثر من 80 دولة حول العالم. يتم تعبئة جميع الطلبات بعناية في صناديق الهدايا الفاخرة المميزة لدينا، مع شريط وورق أنسجة وبطاقة شخصية. يرجى ملاحظة أن بعض الدول لديها قيود على شحن العطور بسبب اللوائح المتعلقة بالمنتجات الكحولية.' },

  // Returns
  { _id: 'faq-ret-1', category: 'returns', order: 1,
    question_en: 'What is your returns policy?',
    question_ar: 'ما هي سياسة الإرجاع لديكم؟',
    answer_en: 'We offer a 30-day return window for unopened, unused items in original packaging. Once a fragrance has been sprayed, we are unable to accept returns for hygiene reasons. If you receive a damaged or incorrect item, we will arrange a free replacement or full refund immediately.',
    answer_ar: 'نقدم نافذة إرجاع مدتها 30 يوماً للمنتجات غير المفتوحة وغير المستخدمة في عبوتها الأصلية. بمجرد رش العطر، لا نستطيع قبول الإرجاع لأسباب صحية. إذا تلقيت منتجاً تالفاً أو غير صحيح، سنرتب استبدالاً مجانياً أو استرداداً كاملاً فوراً.' },

  { _id: 'faq-ret-2', category: 'returns', order: 2,
    question_en: 'How do I initiate a return?',
    question_ar: 'كيف أبدأ عملية الإرجاع؟',
    answer_en: 'Email our team at support@luxeparfum.com with your order number and reason for return. We will provide a prepaid return label within 24 hours. Refunds are processed within 5–7 business days of receiving the returned item.',
    answer_ar: 'أرسل بريداً إلكترونياً إلى فريقنا على support@luxeparfum.com مع رقم طلبك وسبب الإرجاع. سنوفر ملصق إرجاع مدفوع مسبقاً خلال 24 ساعة. تتم معالجة المبالغ المستردة في غضون 5–7 أيام عمل من استلام المنتج المُعاد.' },

  // Products
  { _id: 'faq-prod-1', category: 'products', order: 1,
    question_en: 'Are your fragrances authentic?',
    question_ar: 'هل عطوركم أصيلة؟',
    answer_en: 'Absolutely. Luxe Parfum sources directly from authorised distributors and brand houses. Every fragrance comes with a certificate of authenticity and full manufacturer warranty. We have a zero-tolerance policy for grey-market or counterfeit products.',
    answer_ar: 'بالتأكيد. يحصل لوكس بارفان مباشرةً من الموزعين المعتمدين ودور العطور. كل عطر يأتي مع شهادة أصالة وضمان كامل من الشركة المصنعة. لدينا سياسة صارمة ضد المنتجات المقلدة أو منتجات السوق الرمادية.' },

  { _id: 'faq-prod-2', category: 'products', order: 2,
    question_en: 'How do I find my signature scent?',
    question_ar: 'كيف أجد عطري المميز؟',
    answer_en: 'Try our AI-powered Scent Quiz — it takes just 2 minutes and analyses your preferences for occasion, intensity, and fragrance family to recommend your perfect match from our catalogue. You can also use the filters on our products page to browse by fragrance family, intensity, and price.',
    answer_ar: 'جرّب اختبار العطور المدعوم بالذكاء الاصطناعي — لا يستغرق سوى دقيقتين ويحلل تفضيلاتك للمناسبة والكثافة وعائلة العطر لتوصية بتطابقك المثالي من كتالوجنا. يمكنك أيضاً استخدام الفلاتر في صفحة المنتجات للتصفح حسب عائلة العطر والكثافة والسعر.' },

  { _id: 'faq-prod-3', category: 'products', order: 3,
    question_en: 'What is the difference between EDP and EDT?',
    question_ar: 'ما الفرق بين EDP وEDT؟',
    answer_en: 'Eau de Parfum (EDP) contains a higher concentration of fragrance oils (15–20%) compared to Eau de Toilette (EDT, 5–15%). This results in richer scent, stronger projection, and longer wear time — typically 6–8 hours for EDP versus 3–5 hours for EDT. All Luxe Parfum products are Eau de Parfum concentration unless stated otherwise.',
    answer_ar: 'تحتوي أو دو بارفان (EDP) على تركيز أعلى من الزيوت العطرية (15–20٪) مقارنةً بأو دو تواليت (EDT، 5–15٪). ينتج عن ذلك رائحة أغنى، وانتشار أقوى، ووقت ارتداء أطول — عادةً 6–8 ساعات لـ EDP مقابل 3–5 ساعات لـ EDT. جميع منتجات لوكس بارفان بتركيز أو دو بارفان ما لم يُذكر خلاف ذلك.' },

  // Orders
  { _id: 'faq-ord-1', category: 'orders', order: 1,
    question_en: 'How do I track my order?',
    question_ar: 'كيف أتتبع طلبي؟',
    answer_en: 'Once your order is dispatched, you will receive an email with a tracking number and a direct link to monitor your shipment in real time. Orders are typically dispatched within 1–2 business days of placement.',
    answer_ar: 'بمجرد إرسال طلبك، ستتلقى بريداً إلكترونياً برقم تتبع ورابط مباشر لمراقبة شحنتك في الوقت الفعلي. تُرسل الطلبات عادةً في غضون 1–2 يوم عمل من تقديمها.' },

  { _id: 'faq-ord-2', category: 'orders', order: 2,
    question_en: 'Can I modify or cancel my order?',
    question_ar: 'هل يمكنني تعديل طلبي أو إلغاؤه؟',
    answer_en: 'Orders can be modified or cancelled within 2 hours of placement by contacting us at support@luxeparfum.com. After this window, the order will have entered our fulfilment process and cancellations may not be possible. In this case, you are welcome to return the item under our returns policy.',
    answer_ar: 'يمكن تعديل الطلبات أو إلغاؤها خلال ساعتين من تقديمها عن طريق التواصل معنا على support@luxeparfum.com. بعد هذه النافذة، سيكون الطلب قد دخل في عملية الشحن وقد لا تكون إلغاءات ممكنة. في هذه الحالة، يسعدنا استقبال إرجاع المنتج وفق سياسة الإرجاع لدينا.' },

  // Fragrance Care
  { _id: 'faq-care-1', category: 'fragrance_care', order: 1,
    question_en: 'How should I store my perfume?',
    question_ar: 'كيف يجب أن أحفظ عطري؟',
    answer_en: 'Store your fragrance away from direct sunlight, heat, and humidity. The ideal location is a cool, dark drawer or cupboard — not the bathroom. Avoid storing perfume in the fridge as temperature fluctuations can alter the composition. Keep bottles upright and tightly sealed to prevent evaporation.',
    answer_ar: 'احفظ عطرك بعيداً عن أشعة الشمس المباشرة والحرارة والرطوبة. المكان المثالي هو درج أو خزانة بارد ومظلم — ليس الحمام. تجنب تخزين العطر في الثلاجة لأن تقلبات درجات الحرارة يمكن أن تغير تركيبته. احفظ الزجاجات في وضع مستقيم ومغلقة بإحكام لمنع التبخر.' },
]

async function seedFAQ() {
  console.log('\n━━━ 4/5  FAQ Items ━━━')
  for (const item of FAQ_ITEMS) {
    const existing = await client.fetch(`*[_id == $id][0]._id`, { id: item._id })
    if (existing && !FORCE) { console.log(`  ↩  "${item.question_en.slice(0, 50)}…" — exists`); continue }
    await client.createOrReplace({ ...item, _type: 'faqItem' })
    console.log(`  ✓  ${item.question_en.slice(0, 60)}`)
  }
}

// ─── 5. Contact page + Nav config ────────────────────────────────────────────

async function seedContactPage() {
  console.log('\n━━━ 5a  Contact Page ━━━')
  const doc = {
    _id: 'contactPage',
    _type: 'contactPage',
    heading_en: 'We\'d Love to Hear From You',
    heading_ar: 'يسعدنا الاستماع إليك',
    subtext_en: 'Whether you have a question about a fragrance, need help with an order, or simply want to share your experience — our team is here for you.',
    subtext_ar: 'سواء كان لديك سؤال حول عطر، أو تحتاج مساعدة في طلب، أو ببساطة تريد مشاركة تجربتك — فريقنا هنا من أجلك.',
    email: 'hello@luxeparfum.com',
    phone: '+971 4 000 0000',
    address_en: 'Luxe Parfum\nLevel 12, Dubai International Financial Centre\nDubai, United Arab Emirates',
    address_ar: 'لوكس بارفان\nالطابق 12، مركز دبي المالي الدولي\nدبي، الإمارات العربية المتحدة',
    instagramUrl: 'https://instagram.com/luxeparfum',
    whatsappNumber: '+971500000000',
  }

  const existing = await client.fetch(`*[_id == "contactPage"][0]._id`)
  if (existing && !FORCE) {
    console.log('  ↩  contactPage — exists')
  } else {
    await client.createOrReplace(doc)
    console.log('  ✓  Contact page seeded')
  }
}

async function seedNavConfig() {
  console.log('\n━━━ 5b  Nav Config ━━━')
  const doc = {
    _id: 'navConfig-singleton',
    _type: 'navConfig',
    items: [
      { _key: key(), label_en: 'New Arrivals', label_ar: 'الجديد',           href: '/products?sort=newest',   highlight: false, visible: true },
      { _key: key(), label_en: 'Bestsellers',  label_ar: 'الأكثر مبيعاً',   href: '/products?sort=popular',  highlight: false, visible: true },
      { _key: key(), label_en: 'Journal',      label_ar: 'المجلة',           href: '/journal',                highlight: false, visible: true },
      { _key: key(), label_en: 'About',        label_ar: 'من نحن',           href: '/about',                  highlight: false, visible: true },
      { _key: key(), label_en: 'FAQ',          label_ar: 'الأسئلة الشائعة', href: '/faq',                    highlight: false, visible: true },
      { _key: key(), label_en: 'Contact',      label_ar: 'تواصل معنا',       href: '/contact',                highlight: false, visible: true },
      { _key: key(), label_en: 'Scent Quiz',   label_ar: 'اختبار العطور',    href: '/quiz',                   highlight: true,  visible: true },
    ],
  }

  const existing = await client.fetch(`*[_type == "navConfig"][0]._id`)
  if (existing && !FORCE) {
    console.log('  ↩  navConfig — exists')
  } else {
    await client.createOrReplace(doc)
    console.log('  ✓  Nav config seeded')
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌹 Luxe Parfum — Full Content Seeder')
  console.log(`   Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}`)
  console.log(`   Force:   ${FORCE ? 'YES (overwriting existing)' : 'NO (skipping existing)'}`)

  await seedProductImages()
  await seedCategoryImages()
  await seedTestimonials()
  await seedFAQ()
  await seedContactPage()
  await seedNavConfig()

  console.log('\n✅  All done! Refresh Sanity Studio and your site to see the changes.\n')
}

main().catch((e) => {
  console.error('\n❌ Seeder failed:', e.message)
  process.exit(1)
})
