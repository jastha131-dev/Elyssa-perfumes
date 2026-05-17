/// <reference types="node" />
/**
 * Seed script — populates the Home Page singleton in Sanity.
 * Run: npx tsx scripts/seed-homepage.ts
 * Requires SANITY_API_TOKEN with write permissions in .env.local
 *
 * Uses correct bilingual field names (_en / _ar) matching the schema.
 * Products, categories, and testimonials are referenced by _id from Sanity.
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
    .filter((l: string) => l.trim() && !l.trim().startsWith('#'))
    .forEach((l: string) => {
      const idx = l.indexOf('=')
      if (idx > 0) {
        const k = l.slice(0, idx).trim()
        const v = l.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
        if (!process.env[k]) process.env[k] = v
      }
    })
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

// ─── Reference helpers ────────────────────────────────────────────────────────
const ref = (id: string) => ({ _key: key(), _type: 'reference' as const, _ref: id })

// ─── Image upload ─────────────────────────────────────────────────────────────
async function uploadImage(url: string, filename: string) {
  console.log(`  ↑ Uploading ${filename}...`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, { filename, contentType: 'image/jpeg' })
  return { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: asset._id } }
}

// ─── Seed ─────────────────────────────────────────────────────────────────────
async function seed() {
  // ── Fetch existing Sanity documents ─────────────────────────────────────────
  console.log('\n🔍  Fetching existing products, categories & testimonials...\n')

  const [products, categories, testimonials] = await Promise.all([
    client.fetch<{ _id: string }[]>('*[_type == "product"] | order(_createdAt asc) { _id }'),
    client.fetch<{ _id: string }[]>('*[_type == "category"] | order(order asc) { _id }'),
    client.fetch<{ _id: string }[]>('*[_type == "testimonial"] | order(_createdAt asc) { _id }'),
  ])

  console.log(`  → ${products.length} products, ${categories.length} categories, ${testimonials.length} testimonials found`)

  const featuredIds  = products.slice(0, 4).map((p) => p._id)
  const bestSellerIds = products.slice(4, 8).length ? products.slice(4, 8).map((p) => p._id) : products.slice(0, 4).map((p) => p._id)
  const categoryIds  = categories.map((c) => c._id)
  const testimonialIds = testimonials.slice(0, 6).map((t) => t._id)

  // ── Upload images ────────────────────────────────────────────────────────────
  console.log('\n📸  Uploading images...\n')

  const results = await Promise.allSettled([
    // 0 — hero: editorial glass perfume bottle on warm neutral background
    uploadImage(
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1920&q=90',
      'hero-perfume-editorial.jpg'
    ),
    // 1 — brand story / Icons section: dark dramatic bottle
    uploadImage(
      'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=1200&q=90',
      'brand-story-dark.jpg'
    ),
    // 2 — custom banner: lifestyle fragrance
    uploadImage(
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&q=85',
      'custom-banner-lifestyle.jpg'
    ),
    // 3 — scent banner: warm amber spices
    uploadImage(
      'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=1920&q=85',
      'scent-amber-banner.jpg'
    ),
    // 4 — newsletter: soft beauty flatlay
    uploadImage(
      'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=1920&q=85',
      'newsletter-bg.jpg'
    ),
  ])

  const uploaded = results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value
    console.warn(`  ⚠️  Image ${i} failed — section will use fallback. (${(r as PromiseRejectedResult).reason?.message})`)
    return null
  })

  const [heroImg, brandImg, bannerImg, scentImg, newsletterImg] = uploaded

  // ── Build sections ───────────────────────────────────────────────────────────
  console.log('\n📝  Building homepage sections...\n')

  const sections: unknown[] = [

    // ── 1. Hero ──────────────────────────────────────────────────────────────
    {
      _key: key(),
      _type: 'heroSection',
      isVisible: true,
      headline_en: 'Spring Summer Story',
      headline_ar: 'قصة الربيع والصيف',
      subheadline_en: 'Inspired by Icons. Reimagined for you. Rare fragrances crafted for the discerning soul.',
      subheadline_ar: 'مستوحاة من الأيقونات. مُعاد تصورها لك. عطور نادرة لأرواح ذوي الذوق الرفيع.',
      ...(heroImg ? { bgImage: heroImg } : {}),
      textColor: 'dark',
      headlineSize: 'lg',
      layout: 'split',
      stats: [
        { _key: key(), value: '100%',   label_en: 'Authentic',   label_ar: 'أصيل' },
        { _key: key(), value: '50+',    label_en: 'Maisons',     label_ar: 'دار عطر' },
        { _key: key(), value: '30-Day', label_en: 'Free Returns', label_ar: 'إرجاع مجاني' },
      ],
      cta: {
        _type: 'ctaButton',
        label_en: 'Shop Collection',
        label_ar: 'تسوق المجموعة',
        link: '/products',
        style: 'primary',
      },
    },

    // ── 2. Marquee ───────────────────────────────────────────────────────────
    {
      _key: key(),
      _type: 'marqueeSection',
      isVisible: true,
      text_en: 'Long Lasting  •  Extrait De Parfum  •  Up to 35% Off  •  Free Shipping  •  100% Authentic  •  YSL Inspired  •  Dior Inspired  •  Chanel Inspired  •  50+ Maisons  •  30-Day Returns',
      text_ar: 'دائم الأثر  •  عطر مركّز  •  خصم حتى 35%  •  شحن مجاني  •  100% أصيل  •  مستوحى من YSL  •  مستوحى من Dior  •  مستوحى من Chanel  •  أكثر من 50 دار عطر',
      speed: 35,
    },

    // ── 3. Trust Bar ─────────────────────────────────────────────────────────
    {
      _key: key(),
      _type: 'trustBarSection',
      isVisible: true,
      items: [
        { _key: key(), icon: '✓', value: '100%', label_en: 'Authentic Fragrances', label_ar: 'عطور أصيلة' },
        { _key: key(), icon: '✦', value: '50+', label_en: 'Luxury Maisons', label_ar: 'دار عطر فاخرة' },
        { _key: key(), icon: '↩', value: '30-Day', label_en: 'Free Returns', label_ar: 'إرجاع مجاني' },
        { _key: key(), icon: '✈', value: 'Free', label_en: 'Shipping on $100+', label_ar: 'شحن مجاني فوق $100' },
      ],
    },

    // ── 4. Categories ────────────────────────────────────────────────────────
    ...(categoryIds.length > 0
      ? [{
          _key: key(),
          _type: 'categoriesSection',
          isVisible: true,
          title_en: 'Shop By',
          title_ar: 'تسوق حسب',
          categories: categoryIds.map(ref),
        }]
      : []),

    // ── 5. Featured Products (Signature Inspirations) ────────────────────────
    ...(featuredIds.length > 0
      ? [{
          _key: key(),
          _type: 'featuredProductsSection',
          isVisible: true,
          title_en: 'Signature Inspirations',
          title_ar: 'إلهامات مميزة',
          subtitle_en: 'Luxury You Can Afford',
          subtitle_ar: 'الفخامة التي تستطيع تحملها',
          products: featuredIds.map(ref),
          layout: 'grid',
        }]
      : []),

    // ── 6. Brand Story (Icons section) ───────────────────────────────────────
    {
      _key: key(),
      _type: 'brandStorySection',
      isVisible: true,
      eyebrow_en: 'Inspired By',
      eyebrow_ar: 'مستوحى من',
      headline_en: 'Icons',
      headline_ar: 'أيقونات',
      body_en: 'Inspired by the greats. Crafted for you. Our collection echoes the world\'s finest maisons at a fraction of the price.',
      body_ar: 'مستوحاة من العظماء. مصنوعة من أجلك. مجموعتنا تعكس أفضل دور الأزياء العالمية بجزء من السعر.',
      ...(brandImg ? { image: brandImg } : {}),
      imagePosition: 'right',
      cta: {
        _type: 'ctaButton',
        label_en: 'Shop Now',
        label_ar: 'تسوق الآن',
        link: '/products',
        style: 'outline',
      },
    },

    // ── 7. Best Sellers ──────────────────────────────────────────────────────
    ...(bestSellerIds.length > 0
      ? [{
          _key: key(),
          _type: 'bestSellersSection',
          isVisible: true,
          title_en: 'Best Sellers',
          title_ar: 'الأكثر مبيعاً',
          products: bestSellerIds.map(ref),
        }]
      : []),

    // ── 8. Custom Banner ─────────────────────────────────────────────────────
    {
      _key: key(),
      _type: 'customBannerSection',
      isVisible: true,
      headline_en: 'Your Signature Scent Awaits',
      headline_ar: 'عطرك المميز بانتظارك',
      subtext_en: 'Every fragrance in our collection is crafted to last — bold, refined, and unmistakably you.',
      subtext_ar: 'كل عطر في مجموعتنا مصنوع ليدوم — جريء، أنيق، ولا يمكن إخطاؤه.',
      ...(bannerImg ? { image: bannerImg } : {}),
      overlayOpacity: 50,
      textAlign: 'center',
      cta: {
        _type: 'ctaButton',
        label_en: 'Explore All Fragrances',
        label_ar: 'استكشف جميع العطور',
        link: '/products',
        style: 'primary',
      },
    },

    // ── 9. Scent Banner ──────────────────────────────────────────────────────
    {
      _key: key(),
      _type: 'scentBannerSection',
      isVisible: true,
      eyebrow_en: 'Fragrance Family',
      eyebrow_ar: 'عائلة العطر',
      headline_en: 'Amber',
      headline_ar: 'عنبر',
      highlightWord_en: 'Gourmand',
      highlightWord_ar: 'الشهي',
      subtext_en: 'Sweet, opulent, and almost edible. Amber Gourmand fragrances weave notes of vanilla, praline, and caramel into a warm, sensual signature.',
      subtext_ar: 'حلو، فاخر، وشبه صالح للأكل. تنسج عطور العنبر الشهي نغمات الفانيليا والبرالين والكراميل في توقيع دافئ وحسي.',
      ...(scentImg ? { bgImage: scentImg } : {}),
      cta: {
        _type: 'ctaButton',
        label_en: 'Shop Amber Gourmand',
        label_ar: 'تسوق العنبر الشهي',
        link: '/products?family=amber-gourmand',
        style: 'primary',
      },
    },

    // ── 10. Testimonials ─────────────────────────────────────────────────────
    ...(testimonialIds.length > 0
      ? [{
          _key: key(),
          _type: 'testimonialsSection',
          isVisible: true,
          title_en: 'What People Say About Us',
          title_ar: 'ماذا يقول الناس عنا',
          testimonials: testimonialIds.map(ref),
        }]
      : []),

    // ── 11. Newsletter ───────────────────────────────────────────────────────
    {
      _key: key(),
      _type: 'newsletterSection',
      isVisible: true,
      headline_en: 'Join the Inner Circle',
      headline_ar: 'انضم إلى الدائرة الداخلية',
      subtext_en: 'New launches, exclusive offers, and first access — straight to your inbox.',
      subtext_ar: 'الإطلاقات الجديدة، العروض الحصرية، والوصول الأول — مباشرة إلى بريدك الإلكتروني.',
      buttonLabel_en: 'Subscribe',
      buttonLabel_ar: 'اشترك',
      ...(newsletterImg ? { bgImage: newsletterImg } : {}),
    },
  ]

  // ── Patch or create the homePage singleton ───────────────────────────────────
  const existing = await client.fetch<{ _id: string } | null>('*[_type == "homePage"][0]{ _id }')

  if (existing?._id) {
    console.log(`  → Patching existing document: ${existing._id}`)
    await client.patch(existing._id).set({ sections }).commit()
  } else {
    console.log('  → Creating new homePage document')
    await client.create({ _type: 'homePage', sections })
  }

  console.log('\n✅  Homepage seeded successfully!')
  console.log('   Refresh Sanity Studio and your Next.js dev server to see changes.\n')
}

seed().catch((err) => {
  console.error('\n❌  Seed failed:', err.message)
  process.exit(1)
})
