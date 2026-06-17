import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAboutPage } from '@/lib/sanity/fetch'
import { PortableText } from '@portabletext/react'
import PageBuilder from '@/components/PageBuilder'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const data = await getAboutPage()
  const isAr = locale === 'ar'
  return {
    title: (isAr ? data?.seoTitle_ar : data?.seoTitle_en) ?? 'About Us — Custom Scents by Elyssa Perfumes',
    description:
      (isAr ? data?.seoDescription_ar : data?.seoDescription_en) ??
      'Founded in 2005 by Satish & Suresh. 20+ years of fragrance expertise, 6,000+ bottles sold, trusted by customers across Dubai and beyond.',
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isAr = locale === 'ar'
  const data = await getAboutPage()

  // Hero
  const heroHeadline =
    (isAr ? data?.heroHeadline_ar : data?.heroHeadline_en) ??
    'Crafted Through 20 Years of Fragrance Expertise'
  const heroSubline =
    (isAr ? data?.heroSubline_ar : data?.heroSubline_en) ??
    'From a 400 sq. ft. perfume shop in 2005 to creating thousands of custom fragrances trusted by customers across Dubai and beyond.'
  const heroEyebrow = (isAr ? data?.heroEyebrow_ar : data?.heroEyebrow_en) ?? 'Our Story'
  const heroLead =
    (isAr ? data?.heroLead_ar : data?.heroLead_en) ??
    'A Dubai house of fragrance, composing scent as a form of memory since 2005.'
  const heroLeadLabel = (isAr ? data?.heroLeadLabel_ar : data?.heroLeadLabel_en) ?? 'Est. 2005 · Dubai'
  const overlayOpacity = (data?.overlayOpacity ?? 55) / 100

  // Stats strip
  const statsColorKey = data?.statsStripColor ?? 'camel'
  const statsStripBg = { camel: 'bg-camel-600', cream: 'bg-stone-100', charcoal: 'bg-charcoal-800', white: 'bg-white' }[statsColorKey] ?? 'bg-camel-600'
  const statsIsDark = statsColorKey === 'camel' || statsColorKey === 'charcoal'
  const statsNumColor = statsIsDark ? 'text-white' : 'text-charcoal-900'
  const statsLabelColor = statsIsDark ? 'text-white/70' : 'text-charcoal-500'
  const statsDividerColor = statsIsDark ? 'bg-white/20' : 'bg-charcoal-200'
  const statsRuleColor = statsIsDark ? 'bg-white/40' : 'bg-camel-400/50'

  // Stats
  const stats = data?.stats ?? [
    { value: '20+', label_en: 'Years Experience', label_ar: 'سنة خبرة' },
    { value: '6,000+', label_en: 'Bottles Sold', label_ar: 'زجاجة مبيعة' },
    { value: '4.7★', label_en: 'Customer Rating', label_ar: 'تقييم العملاء' },
    { value: '100%', label_en: 'Premium French Oils', label_ar: 'زيوت فرنسية فاخرة' },
    { value: '50+', label_en: 'Nationalities Served', label_ar: 'جنسية تخدمها' },
  ]

  // Story
  const storyHeadline =
    (isAr ? data?.philosophyHeadline_ar : data?.philosophyHeadline_en) ??
    'A Family Legacy of Fragrance'

  // Timeline
  const timeline = data?.timeline ?? [
    { year: '2005', event_en: 'Elyssa Perfumes founded — a 400 sq. ft. perfume shop born from passion for fragrance.' },
    { year: '2009', event_en: 'Expanded to a 1,900 sq. ft. showroom, becoming a fragrance destination in Dubai.' },
    { year: '2022', event_en: 'Began creating custom Attars (perfume oils) for discerning customers.' },
    { year: '2024', event_en: 'Started crafting perfumes in-house with full creative control over every blend.' },
    { year: '2026', event_en: 'Launch of Custom Scents — bringing 20 years of expertise to customers online.' },
  ]

  // Pillars
  const pillars = data?.pillars ?? [
    {
      number: '01',
      title_en: '20+ Years Expertise',
      title_ar: 'خبرة تزيد عن 20 عامًا',
      body_en: 'Two decades serving loyal customers from diverse nationalities across Dubai and beyond.',
      body_ar: 'عقدان من الخدمة لعملاء مخلصين من جنسيات متنوعة في دبي وما وراءها.',
    },
    {
      number: '02',
      title_en: 'Premium Ingredients',
      title_ar: 'مكونات فاخرة',
      body_en: 'We use only the finest fragrance oils and premium French ingredients, sourced for quality and longevity.',
      body_ar: 'نستخدم فقط أجود زيوت العطور والمكونات الفرنسية الفاخرة المختارة للجودة والديمومة.',
    },
    {
      number: '03',
      title_en: 'Designer Inspired',
      title_ar: 'مستوحى من المصممين',
      body_en: 'Fragrances inspired by iconic designer and niche scents, crafted for those who appreciate the art.',
      body_ar: 'عطور مستوحاة من روائح المصممين الأيقونية والعطور النادرة، مصنوعة لمن يقدّر الفن.',
    },
    {
      number: '04',
      title_en: 'Thousands Satisfied',
      title_ar: 'آلاف العملاء الراضين',
      body_en: 'Over 6,000 bottles sold and thousands of loyal customers who return, gift, and recommend.',
      body_ar: 'أكثر من 6,000 زجاجة مبيعة وآلاف العملاء المخلصين الذين يعودون ويوصون.',
    },
  ]

  // Behind The Bottle
  const behindBottleHeadline =
    (isAr ? data?.behindBottleHeadline_ar : data?.behindBottleHeadline_en) ?? 'Behind The Bottle'
  const behindBottleImages = data?.behindBottleImages ?? []

  // Section visibility toggles (default true when not set)
  const showStats      = data?.showStats      !== false
  const showStory      = data?.showStory      !== false
  const showTimeline   = data?.showTimeline   !== false
  const showPillars    = data?.showPillars    !== false
  const showFounders   = data?.showFounders   !== false
  const showBehindBottle = data?.showBehindBottle !== false
  const showClosing    = data?.showClosing    !== false
  const foundersHeadline =
    (isAr ? data?.foundersHeadline_ar : data?.foundersHeadline_en) ?? 'Meet The Founders'
  const foundersName = data?.foundersName ?? 'Satish & Suresh'
  const foundersRole =
    (isAr ? data?.foundersRole_ar : data?.foundersRole_en) ?? 'Co-Founders, Elyssa Perfumes'
  const foundersStory = isAr
    ? data?.foundersStory_ar || data?.foundersStory_en
    : data?.foundersStory_en

  // Closing
  const closingTitle =
    (isAr ? data?.closingTitle_ar : data?.closingTitle_en) ?? 'Every Fragrance Has A Story'
  const closingStatement =
    (isAr ? data?.closingStatement_ar : data?.closingStatement_en) ??
    "For more than 20 years, we've helped customers discover scents they love. Today, through Custom Scents, we're bringing that same passion into every bottle we create."

  return (
    <div className="min-h-screen bg-cream-50">

      {/* ── 1. HERO ──────────────────────────────────────────────── */}
      <section
        className="bg-stone-50"
        style={{ paddingTop: 'var(--header-h, 72px)' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2" style={{ minHeight: 'calc(80vh - var(--header-h, 72px))' }}>

          {/* Left — headline at top, lead fills lower space */}
          <div className="flex w-full flex-col justify-between pb-16 pt-14 lg:pb-20 lg:pr-16">

            {/* Top — headline block */}
            <div>
              <p className="mb-5 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.45em] text-camel-500">
                <span className="h-px w-8 bg-camel-500/60" />
                {heroEyebrow}
              </p>
              <h1 className="font-display text-5xl font-light leading-[1.05] text-charcoal-900 sm:text-6xl lg:text-7xl">
                {heroHeadline}
              </h1>
              {heroSubline && (
                <p className="mt-7 max-w-md text-sm font-light leading-relaxed text-charcoal-500">
                  {heroSubline}
                </p>
              )}
            </div>

            {/* Bottom — brand lead (CMS-editable) */}
            <div className="mt-16 max-w-md">
              <p className="font-display text-2xl font-light leading-snug text-charcoal-300 sm:text-3xl">
                {heroLead}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-px w-10 bg-camel-500/50" />
                <span className="text-[9px] uppercase tracking-[0.4em] text-camel-500/60">
                  {heroLeadLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Right — hero image full height */}
          <div className="relative min-h-[320px] lg:min-h-0">
            <Image
              src={data?.heroBgImageUrl || '/images/categories/I1.webp'}
              alt={heroHeadline}
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-50/40 via-transparent to-transparent lg:from-stone-50/30" />
          </div>

        </div>
        </div>
      </section>

      {/* ── 2. STATS STRIP ───────────────────────────────────────── */}
      {showStats && <section className="bg-cream-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${statsStripBg}`}>
          <div className={`grid ${stats.length === 5 ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4'}`}>
            {stats.map((stat, i) => (
              <div key={i} className="relative flex flex-col items-center py-10 text-center">
                {i > 0 && (
                  <div className={`absolute inset-y-6 left-0 w-px ${statsDividerColor}`} />
                )}
                <p className={`font-display text-4xl font-light tracking-tight md:text-5xl ${statsNumColor}`}>
                  {stat.value}
                </p>
                <div className={`mt-2 h-px w-6 ${statsRuleColor}`} />
                <p className={`mt-2 text-[9px] font-semibold uppercase tracking-[0.35em] ${statsLabelColor}`}>
                  {isAr ? stat.label_ar || stat.label_en : stat.label_en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>}

      {/* ── 3. OUR STORY ─────────────────────────────────────────── */}
      {showStory && <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-28">
          {/* Text */}
          <div>
            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.45em] text-gold-500/70">
              Founded 2005
            </p>
            <h2 className="mb-8 font-display text-3xl font-light text-charcoal-900 md:text-4xl lg:text-5xl">
              {storyHeadline}
            </h2>
            <div className="space-y-5 border-l-2 border-gold-500/30 pl-6 text-sm font-light leading-relaxed text-charcoal-600">
              {data?.philosophyBody_en ? (
                <PortableText
                  value={
                    isAr
                      ? (data.philosophyBody_ar ?? data.philosophyBody_en)
                      : data.philosophyBody_en
                  }
                />
              ) : (
                <>
                  <p>
                    Founded in 2005 by brothers Satish and Suresh, Elyssa Perfumes started as a
                    small 400 sq. ft. perfume store in Dubai. Through dedication, passion, and an
                    unwavering commitment to quality, the business quickly earned the trust of
                    fragrance lovers from across the city.
                  </p>
                  <p>
                    In 2009, growing demand led to an expansion into a 1,900 sq. ft. showroom — a
                    true destination for French, designer, niche, and trending Dubai fragrances.
                    Despite many challenges and successes over the years, the business continues
                    to serve loyal customers from over 50 nationalities.
                  </p>
                  <p>
                    Today, Custom Scents represents the next chapter: bringing two decades of
                    fragrance expertise directly to you, crafted with the same passion that built
                    Elyssa Perfumes.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10 aspect-[4/5] overflow-hidden">
              {data?.storyImageUrl ? (
                <Image
                  src={data.storyImageUrl}
                  alt={storyHeadline}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-charcoal-100 to-charcoal-200 flex flex-col items-center justify-center text-charcoal-300">
                  <svg className="mb-3 h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-[10px] uppercase tracking-[0.3em]">Add Story Image</p>
                  <p className="mt-1 text-center text-[10px] text-charcoal-400 px-6">
                    Sanity Studio → About Page → Our Story
                  </p>
                </div>
              )}
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
            </div>
            {/* Gold offset frame — sits behind the image, peeks out bottom-right */}
            <div className="pointer-events-none absolute -bottom-3 -right-3 h-full w-full border border-gold-500/25 lg:-bottom-5 lg:-right-5" />
          </div>
        </div>
      </section>}

      {/* ── 4. TIMELINE ──────────────────────────────────────────── */}
      {showTimeline && <section className="bg-stone-100 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.45em] text-camel-500/70">
            Milestones
          </p>
          <h2 className="mb-16 font-display text-3xl font-light text-charcoal-900 md:text-4xl">
            How We Got Here
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[68px] top-0 h-full w-px bg-gradient-to-b from-camel-400/50 via-camel-300/30 to-transparent lg:left-[80px]" />

            {timeline.map((item, i) => (
              <div
                key={item.year}
                className={`relative flex gap-8 lg:gap-12 ${i < timeline.length - 1 ? 'pb-12' : ''}`}
              >
                <div className="relative z-10 w-14 shrink-0 lg:w-20">
                  <div className="relative flex items-start pt-0.5">
                    <span className="relative z-10 bg-stone-100 pr-3 font-display text-sm font-medium text-camel-600">
                      {item.year}
                    </span>
                    <div className="absolute right-0 top-[9px] h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-camel-400 bg-stone-100" />
                  </div>
                </div>
                <div className="pt-0.5">
                  <p className="text-sm font-light leading-relaxed text-charcoal-600">
                    {isAr
                      ? (item as { event_ar?: string; event_en: string }).event_ar || item.event_en
                      : item.event_en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>}

      {/* ── 5. WHY TRUST US ──────────────────────────────────────── */}
      {showPillars && <section className="bg-cream-50 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.45em] text-gold-500/70">
            Our Promise
          </p>
          <h2 className="mb-16 font-display text-3xl font-light text-charcoal-900 md:text-4xl">
            Why Trust Us?
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div
                key={p.number}
                className="group relative overflow-hidden border border-charcoal-100 bg-white p-8 transition-all duration-300 hover:border-gold-500/40 hover:shadow-lg"
              >
                {/* Top hover bar */}
                <div className="absolute inset-x-0 top-0 h-0.5 w-0 bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-500 group-hover:w-full" />
                <p className="mb-5 font-display text-5xl font-light text-gold-500/15 transition-colors duration-300 group-hover:text-gold-500/25">
                  {p.number}
                </p>
                <h3 className="mb-3 font-display text-lg font-medium text-charcoal-900">
                  {isAr
                    ? (p as { title_ar?: string; title_en: string }).title_ar || p.title_en
                    : p.title_en}
                </h3>
                <p className="text-sm font-light leading-relaxed text-charcoal-500">
                  {isAr
                    ? (p as { body_ar?: string; body_en: string }).body_ar || p.body_en
                    : p.body_en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>}

      {/* ── 6. BEHIND THE BOTTLE ─────────────────────────────────── */}
      {showBehindBottle && behindBottleImages.length > 0 && (
        <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.45em] text-gold-500/70">
              The Craft
            </p>
            <h2 className="mb-16 font-display text-3xl font-light text-charcoal-900 md:text-4xl">
              {behindBottleHeadline}
            </h2>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {behindBottleImages.map((img, i) => (
                <div
                  key={i}
                  className={`group relative overflow-hidden ${
                    i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
                  }`}
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.imageAlt || img.caption_en || behindBottleHeadline}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  {(img.caption_en || img.caption_ar) && (
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-charcoal-950/90 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
                      <p className="text-[11px] font-light text-cream-200">
                        {isAr ? img.caption_ar || img.caption_en : img.caption_en}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 7. MEET THE FOUNDERS ─────────────────────────────────── */}
      {showFounders && (
        <section className="bg-cream-50 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className={`grid items-center gap-16 lg:gap-28 ${data?.foundersImageUrl ? 'lg:grid-cols-2' : ''}`}>
              {/* Image */}
              {data?.foundersImageUrl && (
                <div className="relative">
                  <div className="relative z-10 aspect-[3/4] overflow-hidden">
                    <Image
                      src={data.foundersImageUrl}
                      alt={foundersName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
                  </div>
                  {/* Gold offset frame — sits behind the image, peeks out top-left */}
                  <div className="pointer-events-none absolute -left-3 -top-3 h-full w-full border border-gold-500/25 lg:-left-5 lg:-top-5" />
                </div>
              )}

              {/* Text */}
              <div>
                <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.45em] text-gold-500/70">
                  The People Behind the Scent
                </p>
                <h2 className="mb-3 font-display text-3xl font-light text-charcoal-900 md:text-4xl lg:text-5xl">
                  {foundersHeadline}
                </h2>
                <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <div className="h-px w-8 bg-gold-500/60" />
                  <span className="text-sm font-medium text-charcoal-700">{foundersName}</span>
                  <span className="text-charcoal-200">·</span>
                  <span className="text-sm font-light text-charcoal-400">{foundersRole}</span>
                </div>
                {foundersStory ? (
                  <div className="space-y-4 text-sm font-light leading-relaxed text-charcoal-600">
                    {foundersStory
                      .split('\n')
                      .filter(Boolean)
                      .map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm font-light leading-relaxed text-charcoal-400 italic">
                    Add the founder story in Sanity Studio → About Page → Meet The Founders.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 8. CLOSING STATEMENT ─────────────────────────────────── */}
      {showClosing && <section className="bg-stone-50 px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Decorative top */}
          <div className="mb-10 flex flex-col items-center gap-2">
            <div className="h-px w-20 bg-camel-400/50" />
            <div className="h-1.5 w-1.5 rounded-full bg-camel-400/50" />
            <div className="h-px w-8 bg-camel-400/30" />
          </div>

          <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.45em] text-camel-500/60">
            Est. 2005 · Dubai
          </p>
          <h2 className="mb-6 font-display text-3xl font-light italic text-charcoal-900 md:text-4xl lg:text-5xl">
            &ldquo;{closingTitle}&rdquo;
          </h2>
          {closingStatement && (
            <p className="mb-12 text-sm font-light leading-relaxed text-charcoal-500">
              {closingStatement}
            </p>
          )}

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={data?.ctaPrimary?.link ?? '/products'}
              className="inline-block rounded-lg bg-camel-600 px-10 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-sm transition-all hover:bg-camel-700 hover:shadow-md"
            >
              {(isAr ? data?.ctaPrimary?.label_ar : data?.ctaPrimary?.label_en) ??
                'Explore Collection'}
            </Link>
            <Link
              href={data?.ctaSecondary?.link ?? '/contact'}
              className="inline-block rounded-lg border border-stone-300 px-10 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-charcoal-700 transition-all hover:border-camel-400 hover:text-camel-600"
            >
              {(isAr ? data?.ctaSecondary?.label_ar : data?.ctaSecondary?.label_en) ?? 'Contact Us'}
            </Link>
          </div>
        </div>
      </section>}

      {/* ── EXTRA PAGEBUILDER SECTIONS (Reviews, etc.) ───────────── */}
      {data?.sections && data.sections.length > 0 && (
        <PageBuilder sections={data.sections} />
      )}
    </div>
  )
}
