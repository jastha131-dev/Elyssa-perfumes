'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import type { ScentBannerSectionBlock } from '@/lib/types'

interface ScentBannerProps {
  data?: ScentBannerSectionBlock | null
}

const NOTES = [
  { name: 'Oud',        size: 'text-5xl md:text-7xl', opacity: 'opacity-90' },
  { name: 'Rose',       size: 'text-3xl md:text-5xl', opacity: 'opacity-60' },
  { name: 'Amber',      size: 'text-4xl md:text-6xl', opacity: 'opacity-75' },
  { name: 'Vetiver',    size: 'text-2xl md:text-4xl', opacity: 'opacity-45' },
  { name: 'Jasmine',    size: 'text-3xl md:text-5xl', opacity: 'opacity-65' },
  { name: 'Citrus',     size: 'text-xl md:text-3xl',  opacity: 'opacity-40' },
  { name: 'Musk',       size: 'text-4xl md:text-5xl', opacity: 'opacity-55' },
  { name: 'Sandalwood', size: 'text-2xl md:text-3xl', opacity: 'opacity-35' },
]

export default function ScentBanner({ data }: ScentBannerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const eyebrow    = data?.eyebrow       ?? 'Explore by Note'
  const titleMain  = data?.headline      ?? 'Every Scent\nTells'
  const titleGold  = data?.highlightWord ?? 'A Story'
  const bodyText   = data?.subtext       ?? 'Each note in our palette is a world unto itself — sourced from the finest gardens, distilled by master perfumers, composed to unfold on your skin.'
  const bgImage    = data?.bgImageUrl    ?? '/images/products/default-product.jpeg'

  return (
    <section className="relative overflow-hidden bg-camel-500 py-24 md:py-32">
      {/* Background image with warm tinted overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt=""
          fill
          className="object-cover object-center"
          quality={90}
        />
        <div className="absolute inset-0 bg-camel-500/40" />
      </div>

      {/* Top fade */}
      <div className="absolute top-0 left-1/2 z-10 h-px w-48 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Atmospheric glow */}
      <div className="pointer-events-none absolute right-0 top-1/2 z-10 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/3 rounded-full bg-white/8 blur-[100px]" />

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">

          {/* Left — text + CTA */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-4 flex items-center gap-4"
            >
              <div className="h-px w-8 bg-white/70" />
              <p className="font-body text-white/70 uppercase tracking-widest text-xs">
                {eyebrow}
              </p>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="font-headline font-bold uppercase text-white leading-tight text-4xl md:text-5xl lg:text-6xl"
            >
              {titleMain.split('\n').map((line, i) => (
                <span key={i}>{line}{i < titleMain.split('\n').length - 1 && <br />}</span>
              ))}{' '}
              <span className="italic text-stone-100">{titleGold}</span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="my-8 h-px w-16 origin-left bg-white/40"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.35 }}
              className="mb-10 max-w-sm font-body text-sm font-light leading-relaxed text-white/80"
            >
              {bodyText}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link
                href={data?.cta?.link ?? '/products'}
                className="group inline-flex items-center gap-3 bg-ink-900 text-white px-8 py-3.5 font-body text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:bg-ink-700"
              >
                {data?.cta?.label ?? 'Browse All Fragrances'}
                <ArrowRight size={13} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* Right — typographic note cloud */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden select-none flex-col items-start gap-1 lg:flex"
          >
            {NOTES.map((note, i) => (
              <motion.div
                key={note.name}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.25 + i * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={`/products?note=${note.name.toLowerCase()}`}
                  className={`font-headline font-bold italic uppercase leading-tight text-white transition-all duration-300 hover:opacity-100 hover:not-italic ${note.size} ${note.opacity} ${i % 2 === 0 ? 'ml-0' : 'ml-8'}`}
                >
                  {note.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile note pills fallback */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-3 lg:hidden"
          >
            {NOTES.map((note) => (
              <Link
                key={note.name}
                href={`/products?note=${note.name.toLowerCase()}`}
                className="border border-white/40 px-4 py-1.5 font-body text-xs uppercase tracking-[0.2em] text-white/80 transition-all duration-300 hover:border-white hover:text-white"
              >
                {note.name}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-1/2 z-10 h-px w-48 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </section>
  )
}
