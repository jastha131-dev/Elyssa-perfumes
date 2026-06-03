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
    title: (isAr ? data?.seoTitle_ar : data?.seoTitle_en) ?? 'About — Luxe Parfum',
    description: (isAr ? data?.seoDescription_ar : data?.seoDescription_en) ?? 'The story behind Luxe Parfum.',
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

  // Fallback values if Sanity not yet configured
  const heroHeadline = (isAr ? data?.heroHeadline_ar : data?.heroHeadline_en) ?? 'The Art of Fragrance'
  const heroSubline = (isAr ? data?.heroSubline_ar : data?.heroSubline_en) ?? 'Luxe Parfum was born from a singular obsession: that scent is the most intimate form of self-expression.'
  const heroEyebrow = (isAr ? data?.heroEyebrow_ar : data?.heroEyebrow_en) ?? 'Our Story'
  const stats = data?.stats ?? [
    { value: '60+', label_en: 'Countries we ship to', label_ar: 'دولة نشحن إليها' },
    { value: '14', label_en: 'Years of craft', label_ar: 'عاماً من الحرفية' },
    { value: '100%', label_en: 'Pure fragrance oil', label_ar: 'زيت عطري نقي' },
    { value: '48h', label_en: 'Worldwide express delivery', label_ar: 'توصيل سريع عالمي' },
  ]
  const pillars = data?.pillars ?? [
    { number: '01', title_en: 'Uncompromising Craft', body_en: 'Every fragrance is composed by master perfumers with decades of experience.' },
    { number: '02', title_en: 'Rare Ingredients', body_en: 'We source from the world\'s finest growing regions — Bulgarian rose, Omani frankincense.' },
    { number: '03', title_en: 'Lasting Impression', body_en: 'Longevity and sillage are non-negotiable. Our formulations use the highest concentration of pure fragrance oil.' },
  ]
  const timeline = data?.timeline ?? [
    { year: '2010', event_en: 'Founded in Paris with a single ambition: luxury fragrance accessible without compromise.' },
    { year: '2014', event_en: 'First collection launched — twelve scents inspired by twelve cities.' },
    { year: '2018', event_en: 'Opened our first atelier for bespoke creations.' },
    { year: '2023', event_en: 'Expanded globally, now shipping to over 60 countries.' },
  ]
  const philHeadline = (isAr ? data?.philosophyHeadline_ar : data?.philosophyHeadline_en) ?? 'Scent is memory. Scent is identity.'
  const ctaHeadline = (isAr ? data?.ctaHeadline_ar : data?.ctaHeadline_en) ?? 'Our Promise to You'
  const ctaBody = (isAr ? data?.ctaBody_ar : data?.ctaBody_en) ?? 'Every order ships with complimentary samples. Every fragrance carries a 30-day satisfaction guarantee.'

  return (
    <div className="min-h-screen bg-cream-50">

      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal-950 pb-24 pt-40">
        {data?.heroBgImageUrl && (
          <Image src={data.heroBgImageUrl} alt={heroHeadline} fill className="object-cover opacity-20" />
        )}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.45em] text-gold-500">{heroEyebrow}</p>
          <h1 className="max-w-3xl font-display text-5xl font-light leading-tight text-cream-100 md:text-7xl">
            {heroHeadline}
          </h1>
          {heroSubline && (
            <p className="mt-8 max-w-xl text-base font-light leading-relaxed text-cream-300">{heroSubline}</p>
          )}
          <div className="mt-16 flex items-center gap-6">
            <div className="h-px w-16 bg-gold-500" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold-500/60">Est. 2010 · Dubai</span>
          </div>
        </div>
      </section>

      {/* Philosophy + Stats */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="mb-6 text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-500/70">Philosophy</p>
            <h2 className="mb-6 font-display text-3xl font-light text-charcoal-900 md:text-4xl">{philHeadline}</h2>
            {data?.philosophyBody_en ? (
              <div className="space-y-4 text-sm font-light leading-relaxed text-charcoal-600">
                <PortableText value={isAr ? (data.philosophyBody_ar ?? data.philosophyBody_en) : data.philosophyBody_en} />
              </div>
            ) : (
              <div className="space-y-5 text-sm font-light leading-relaxed text-charcoal-600">
                <p>We believe a great fragrance does more than smell beautiful. It becomes part of who you are — triggering memories, shaping moods, announcing your presence before a word is spoken.</p>
                <p>We work with a small circle of independent perfumers who treat fragrance as a lifelong discipline. The results speak for themselves.</p>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center gap-8 border-l border-charcoal-100 pl-16">
            {stats.map(stat => (
              <div key={stat.value}>
                <p className="font-display text-4xl font-light text-charcoal-900">{stat.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-charcoal-400">
                  {isAr ? (stat.label_ar || stat.label_en) : stat.label_en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-y border-charcoal-100 bg-charcoal-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid divide-y divide-white/5 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {pillars.map(p => (
              <div key={p.number} className="px-8 py-16 lg:px-10">
                <p className="mb-6 font-display text-5xl font-light text-gold-500/30">{p.number}</p>
                <h3 className="mb-4 font-display text-xl font-medium text-cream-100">
                  {isAr ? ((p as { title_ar?: string; title_en: string }).title_ar || p.title_en) : p.title_en}
                </h3>
                <p className="text-sm font-light leading-relaxed text-cream-300/80">
                  {isAr ? ((p as { body_ar?: string; body_en: string }).body_ar || p.body_en) : p.body_en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-500/70">Milestones</p>
        <h2 className="mb-16 font-display text-3xl font-light text-charcoal-900 md:text-4xl">How we got here</h2>
        <div className="relative space-y-0">
          <div className="absolute left-[72px] top-0 h-full w-px bg-charcoal-100 lg:left-[88px]" />
          {timeline.map(item => (
            <div key={item.year} className="relative flex gap-10 pb-12 lg:gap-14">
              <div className="relative z-10 w-16 shrink-0 lg:w-20">
                <span className="inline-flex h-8 items-center bg-cream-50 pr-3 font-display text-sm font-medium text-gold-600">{item.year}</span>
              </div>
              <p className="pt-1 text-sm font-light leading-relaxed text-charcoal-600">
                {isAr ? ((item as { event_ar?: string; event_en: string }).event_ar || item.event_en) : item.event_en}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-charcoal-900 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center"><div className="h-px w-12 bg-gold-500" /></div>
          <h2 className="mb-6 font-display text-3xl font-light text-cream-100 md:text-4xl">{ctaHeadline}</h2>
          {ctaBody && <p className="mb-10 text-sm font-light leading-relaxed text-cream-300">{ctaBody}</p>}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={data?.ctaPrimary?.link ?? '/products'}
              className="inline-block bg-gold-500 px-10 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-charcoal-950 transition-colors hover:bg-gold-400"
            >
              {(isAr ? data?.ctaPrimary?.label_ar : data?.ctaPrimary?.label_en) ?? 'Explore Collection'}
            </Link>
            <Link
              href={data?.ctaSecondary?.link ?? '/journal'}
              className="inline-block border border-white/20 px-10 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-cream-200 transition-colors hover:border-gold-500/50 hover:text-gold-400"
            >
              {(isAr ? data?.ctaSecondary?.label_ar : data?.ctaSecondary?.label_en) ?? 'Read the Journal'}
            </Link>
          </div>
        </div>
      </section>

      {/* Extra PageBuilder sections */}
      {data?.sections && data.sections.length > 0 && (
        <PageBuilder sections={data.sections} />
      )}
    </div>
  )
}
