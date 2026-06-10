'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLocale } from 'next-intl'
import type { Testimonial, TestimonialsSectionBlock } from '@/lib/types'

const FALLBACK: Testimonial[] = [
  {
    _id: 'f1',
    name_en: 'Sophia Marchand',
    name_ar: 'Sophia Marchand',
    location_en: 'Paris, France',
    location_ar: 'Paris, France',
    rating: 5,
    review_en:
      'The most transcendent fragrance I have ever experienced. It evolves beautifully on skin — from a bright citrus opening to the most intoxicating warm base. I receive compliments every time I wear it.',
    review_ar:
      'The most transcendent fragrance I have ever experienced. It evolves beautifully on skin — from a bright citrus opening to the most intoxicating warm base. I receive compliments every time I wear it.',
  },
  {
    _id: 'f2',
    name_en: 'James Harrington',
    name_ar: 'James Harrington',
    location_en: 'London, UK',
    location_ar: 'London, UK',
    rating: 5,
    review_en:
      'I have spent years searching for a scent that truly feels bespoke. Luxe Parfum delivered exactly that. The longevity is extraordinary — a single application lasts the entire day.',
    review_ar:
      'I have spent years searching for a scent that truly feels bespoke. Luxe Parfum delivered exactly that. The longevity is extraordinary — a single application lasts the entire day.',
  },
  {
    _id: 'f3',
    name_en: 'Isabella Romano',
    name_ar: 'Isabella Romano',
    location_en: 'Milan, Italy',
    location_ar: 'Milan, Italy',
    rating: 5,
    review_en:
      'From the moment it arrived in its exquisite packaging I knew this was different. The fragrance itself is a masterpiece — complex, evolving, deeply personal. Absolutely worth every penny.',
    review_ar:
      'From the moment it arrived in its exquisite packaging I knew this was different. The fragrance itself is a masterpiece — complex, evolving, deeply personal. Absolutely worth every penny.',
  },
]

interface TestimonialsProps {
  data?: TestimonialsSectionBlock
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-camel-500">
          <path d="M6 0l1.545 3.09L11 3.635l-2.5 2.427.59 3.438L6 7.91 2.91 9.5l.59-3.438L1 3.635l3.455-.545z" />
        </svg>
      ))}
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-stone-200 bg-stone-50">
      <span className="font-display text-sm font-light text-ink-600">{initials}</span>
    </div>
  )
}

export default function Testimonials({ data }: TestimonialsProps = {}) {
  const locale = useLocale()
  const testimonials: Testimonial[] = (data?.testimonials ?? FALLBACK) as Testimonial[]
  const title = locale === 'ar' ? (data?.title_ar ?? 'Words From Our Clients') : (data?.title_en ?? 'Words From Our Clients')

  const headingRef = useRef<HTMLDivElement>(null)
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' })

  const items = testimonials && testimonials.length > 0 ? testimonials : FALLBACK
  const display = items.slice(0, 3)

  return (
    <section className="py-24 md:py-32 bg-stone-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-col items-center text-center"
        >
          <div className="mb-4 flex items-center gap-4">
            <div className="h-px w-8 bg-stone-300" />
            <p className="font-body text-xs uppercase tracking-widest text-camel-500">
              Client Stories
            </p>
            <div className="h-px w-8 bg-stone-300" />
          </div>
          <h2 className="font-headline text-4xl uppercase text-ink-900 md:text-5xl">
            {title}
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-stone-300" />
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {display.map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-4 border border-stone-200 bg-white p-8 shadow-sm"
            >
              <Stars rating={t.rating} />
              <p className="flex-1 font-body text-sm font-light leading-relaxed text-ink-700">
                &ldquo;{locale === 'ar' ? t.review_ar : t.review_en}&rdquo;
              </p>
              <div className="mt-2 border-t border-stone-100 pt-4 flex items-center gap-3">
                <Avatar name={locale === 'ar' ? t.name_ar : t.name_en} />
                <div>
                  <p className="font-display text-sm font-medium text-ink-800">
                    {locale === 'ar' ? t.name_ar : t.name_en}
                  </p>
                  <p className="font-body text-[10px] uppercase tracking-widest text-ink-500">
                    {(locale === 'ar' ? t.product?.name_ar : t.product?.name_en) ?? (locale === 'ar' ? t.location_ar : t.location_en)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
