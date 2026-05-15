'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Testimonial } from '@/lib/types'

const FALLBACK: Testimonial[] = [
  {
    _id: 'f1',
    name: 'Sophia Marchand',
    location: 'Paris, France',
    rating: 5,
    review:
      'The most transcendent fragrance I have ever experienced. It evolves beautifully on skin — from a bright citrus opening to the most intoxicating warm base. I receive compliments every time I wear it.',
  },
  {
    _id: 'f2',
    name: 'James Harrington',
    location: 'London, UK',
    rating: 5,
    review:
      'I have spent years searching for a scent that truly feels bespoke. Luxe Parfum delivered exactly that. The longevity is extraordinary — a single application lasts the entire day.',
  },
  {
    _id: 'f3',
    name: 'Isabella Romano',
    location: 'Milan, Italy',
    rating: 5,
    review:
      'From the moment it arrived in its exquisite packaging I knew this was different. The fragrance itself is a masterpiece — complex, evolving, deeply personal. Absolutely worth every penny.',
  },
]

interface TestimonialsProps {
  testimonials?: Testimonial[]
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-gold-500">
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
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-gold-500/30 bg-gold-500/8">
      <span className="font-display text-sm font-light text-gold-600">{initials}</span>
    </div>
  )
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const headingRef = useRef<HTMLDivElement>(null)
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' })
  const [active, setActive] = useState(0)

  const items = testimonials && testimonials.length > 0 ? testimonials : FALLBACK
  const display = items.slice(0, 3)

  return (
    <section className="relative overflow-hidden bg-cream-50 py-24 md:py-32">
      {/* Subtle dot texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(26,26,26,1) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <div className="mb-4 flex items-center gap-4">
            <div className="h-px w-8 bg-gold-500/60" />
            <p className="font-body text-xs uppercase tracking-[0.35em] text-gold-500">
              Client Stories
            </p>
            <div className="h-px w-8 bg-gold-500/60" />
          </div>
          <h2 className="font-display text-4xl font-light text-charcoal-900 md:text-5xl">
            Words From Our Clients
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
        </motion.div>

        {/* Large quote display */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-3xl text-center"
            >
              {/* Decorative quote mark */}
              <div className="mb-6 select-none font-display text-[100px] leading-none text-gold-500/15">
                &ldquo;
              </div>

              <Stars rating={display[active].rating} />

              <blockquote className="mt-6 font-display text-xl font-light italic leading-relaxed text-charcoal-700 md:text-2xl lg:text-3xl">
                {display[active].review}
              </blockquote>

              <div className="mx-auto mt-8 h-px w-12 bg-gold-500/40" />

              <div className="mt-6 flex items-center justify-center gap-3">
                <Avatar name={display[active].name} />
                <div className="text-left">
                  <p className="font-display text-base font-medium text-charcoal-900">
                    {display[active].name}
                  </p>
                  <p className="mt-0.5 font-body text-[11px] uppercase tracking-[0.2em] text-gold-500/70">
                    {display[active].product?.name ?? display[active].location}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dot navigation */}
          <div className="mt-12 flex items-center justify-center gap-3">
            {display.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`View testimonial ${i + 1}`}
                className={cn(
                  'transition-all duration-300',
                  i === active
                    ? 'h-2 w-8 bg-gold-500'
                    : 'h-2 w-2 rounded-full bg-charcoal-300 hover:bg-charcoal-400'
                )}
              />
            ))}
          </div>

          {/* Mini cards */}
          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
            {display.map((t, i) => (
              <motion.button
                key={t._id}
                onClick={() => setActive(i)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={cn(
                  'group relative border p-6 text-left transition-all duration-300',
                  i === active
                    ? 'border-gold-500/40 bg-white shadow-sm shadow-gold-500/10'
                    : 'border-charcoal-200 bg-white/60 hover:border-charcoal-300 hover:bg-white'
                )}
              >
                <Stars rating={t.rating} />
                <p className="mt-3 line-clamp-2 font-body text-xs font-light leading-relaxed text-charcoal-500 transition-colors group-hover:text-charcoal-700">
                  &ldquo;{t.review}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-2.5">
                  <Avatar name={t.name} />
                  <div>
                    <p className="font-display text-sm text-charcoal-900">{t.name}</p>
                    <p className="font-body text-[10px] uppercase tracking-widest text-gold-500/60">
                      {t.product?.name ?? t.location}
                    </p>
                  </div>
                </div>
                {i === active && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500/0 via-gold-500 to-gold-500/0" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
