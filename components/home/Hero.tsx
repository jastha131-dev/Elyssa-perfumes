'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { HeroSectionBlock } from '@/lib/types'

interface HeroProps {
  data?: HeroSectionBlock | null
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

const STATS = [
  { value: '100%', label: 'Authentic' },
  { value: '50+',  label: 'Maisons'   },
  { value: '30-Day', label: 'Returns' },
]

export default function Hero({ data }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef    = useRef<HTMLDivElement>(null)
  const isInView   = useInView(textRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const bgY    = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const textY  = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const fadeOp = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  const title    = data?.headline    ?? 'Discover Your Signature Scent'
  const subtitle = data?.subheadline ?? 'A curated collection of rare and extraordinary fragrances for the discerning soul'
  const hasVideo = Boolean(data?.bgVideo?.url)
  const cta      = data?.cta

  const heroImageSrc = data?.bgImageUrl || '/images/categories/I1.webp'

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', minHeight: '640px' }}
    >
      {/* ─── Background ─────────────────────────────────────── */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        {hasVideo ? (
          <video
            src={data?.bgVideo?.url ?? ''}
            autoPlay muted loop playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={heroImageSrc}
            alt="Luxury fragrance"
            fill priority quality={100}
            className="object-cover object-center"
          />
        )}

        {/* Strong left band keeps text readable, fades to show image on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-950/65 to-charcoal-950/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/55 via-transparent to-charcoal-950/20" />

        {/* Film grain */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '150px 150px',
          }}
        />
      </motion.div>

      {/* ─── Corner brackets ─────────────────────────────────── */}
      <div className="pointer-events-none absolute left-7 top-7 z-10 hidden lg:block">
        <div className="h-10 w-px bg-gradient-to-b from-gold-500/55 to-transparent" />
        <div className="h-px w-10 bg-gradient-to-r from-gold-500/55 to-transparent" />
      </div>
      <div className="pointer-events-none absolute bottom-7 right-7 z-10 hidden lg:block">
        <div className="ml-auto h-px w-10 bg-gradient-to-l from-gold-500/55 to-transparent" />
        <div className="ml-auto h-10 w-px bg-gradient-to-t from-gold-500/55 to-transparent" />
      </div>

      {/* ─── Content ─────────────────────────────────────────── */}
      <motion.div
        className="relative z-20 flex h-full flex-col justify-center px-8 md:px-16 lg:px-24"
        style={{ y: textY, opacity: fadeOp }}
      >
        <motion.div
          ref={textRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-[520px] lg:max-w-[42%]"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="mb-7 flex items-center gap-4">
            <div className="h-px w-8 flex-shrink-0 bg-gold-500" />
            <p className="font-body text-[10px] font-light uppercase tracking-[0.42em] text-gold-400">
              Luxury Fragrance House
            </p>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className={cn(
              'font-display mb-5 font-light leading-[1.04] text-cream-50',
              'text-[2.75rem] md:text-[4.25rem] lg:text-[5.25rem]'
            )}
          >
            {title}
          </motion.h1>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="mb-6 h-px w-20 bg-gradient-to-r from-gold-500 to-transparent"
          />

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="mb-9 max-w-[390px] font-body text-base font-light leading-[1.75] tracking-wide text-cream-100/60 md:text-lg"
          >
            {subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mb-11 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            {cta?.link && (
              <Link
                href={cta.link}
                className={cn(
                  'group inline-flex items-center justify-center gap-2.5 px-7 py-[11px]',
                  'font-body text-[12px] font-semibold uppercase tracking-[0.2em]',
                  'transition-all duration-300',
                  cta.style === 'secondary'
                    ? 'border border-gold-500/50 bg-transparent text-gold-400 hover:bg-gold-500/10'
                    : cta.style === 'ghost'
                    ? 'text-cream-100/65 hover:text-cream-100'
                    : cta.style === 'outline'
                    ? 'border border-cream-100/20 text-cream-100/65 hover:border-gold-400/50 hover:text-gold-400'
                    : 'bg-gold-500 text-charcoal-950 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/25'
                )}
              >
                {cta.label ?? 'Shop Collection'}
                <ArrowRight
                  size={11}
                  strokeWidth={2.5}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            )}
            {!cta?.link && (
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2.5 bg-gold-500 px-7 py-[11px] font-body text-[12px] font-semibold uppercase tracking-[0.2em] text-charcoal-950 transition-all duration-300 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/25"
              >
                Shop Collection
                <ArrowRight size={11} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            )}
          </motion.div>

          {/* Stats / social proof */}
          <motion.div
            variants={itemVariants}
            className="flex items-center border-t border-white/10 pt-7"
          >
            {STATS.map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                <div className="pr-6 pl-0">
                  <p className="font-display text-[1.6rem] font-light leading-none text-cream-100/85">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-body text-[9px] uppercase tracking-[0.28em] text-cream-100/32">
                    {stat.label}
                  </p>
                </div>
                {i < STATS.length - 1 && (
                  <div className="mr-6 h-7 w-px flex-shrink-0 bg-white/10" />
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ─── Scroll indicator ────────────────────────────────── */}
      <motion.div
        className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        style={{ opacity: fadeOp }}
      >
        <span className="font-body text-[8px] uppercase tracking-[0.38em] text-cream-100/30">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="text-gold-400/40" size={15} strokeWidth={1} />
        </motion.div>
      </motion.div>
    </section>
  )
}
