'use client'

import { useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { HeroSectionBlock } from '@/lib/types'

interface HeroProps {
  data?: HeroSectionBlock | null
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero({ data }: HeroProps) {
  const t      = useTranslations('home')
  const locale = useLocale()
  const isAr   = locale === 'ar'

  const STATS = data?.stats?.length
    ? data.stats.map((s) => ({ value: s.value, label: isAr ? (s.label_ar || s.label_en) : s.label_en }))
    : [
        { value: '100%',   label: t('statAuthentic') },
        { value: '50+',    label: t('statMaisons') },
        { value: '30-Day', label: t('statReturns') },
      ]

  const sectionRef = useRef<HTMLElement>(null)
  const textRef    = useRef<HTMLDivElement>(null)
  const isInView   = useInView(textRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const bgY    = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const fadeOp = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  const title    = (isAr ? data?.headline_ar    : data?.headline_en)    ?? ''
  const subtitle = (isAr ? data?.subheadline_ar : data?.subheadline_en) ?? ''
  const cta      = data?.cta
  const ctaLabel = (isAr ? cta?.label_ar : cta?.label_en) ?? 'Shop Collection'
  const layout   = data?.layout ?? 'split'
  const isFull   = layout === 'full'
  const isLight  = data?.textColor === 'light'
  const heroImageSrc = data?.bgImageUrl || '/images/categories/I1.webp'

  if (!title) return null

  // ── Full-bleed layout ─────────────────────────────────────────────────────
  if (isFull) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden bg-stone-100"
        style={{ height: '100vh', minHeight: '640px' }}
      >
        {/* Background with parallax */}
        <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
          <Image
            src={heroImageSrc}
            alt="Luxury fragrance"
            fill priority quality={100}
            className="object-cover object-center"
          />
          <div className={cn(
            'absolute inset-0',
            isLight
              ? 'bg-gradient-to-r from-ink-950/70 via-ink-950/40 to-transparent'
              : 'bg-gradient-to-r from-stone-100/80 via-stone-100/40 to-transparent'
          )} />
        </motion.div>

        {/* Content */}
        <motion.div
          className="relative z-20 flex h-full flex-col justify-center px-8 md:px-16 lg:px-24"
          style={{ opacity: fadeOp }}
        >
          <motion.div
            ref={textRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="max-w-[520px] lg:max-w-[42%]"
          >
            <TextContent
              title={title}
              subtitle={subtitle}
              ctaLabel={ctaLabel}
              ctaLink={cta?.link}
              isLight={isLight}
              STATS={STATS}
            />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{ opacity: fadeOp }}
        >
          <span className={cn('font-body text-[8px] uppercase tracking-[0.38em]', isLight ? 'text-stone-400/70' : 'text-ink-400/70')}>
            Scroll
          </span>
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="text-camel-500/40" size={15} strokeWidth={1} />
          </motion.div>
        </motion.div>
      </section>
    )
  }

  // ── Split layout (default) ────────────────────────────────────────────────
  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-stone-100">
      <div className={cn(
        'flex min-h-[640px] flex-col lg:min-h-[700px] lg:flex-row',
        isAr ? 'rtl:flex-row-reverse' : ''
      )}>
        {/* Left: text 55% */}
        <div className="flex w-full items-center px-8 py-16 md:px-16 lg:w-[55%] lg:py-20 lg:px-20">
          <motion.div
            ref={textRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="w-full max-w-[520px]"
          >
            <TextContent
              title={title}
              subtitle={subtitle}
              ctaLabel={ctaLabel}
              ctaLink={cta?.link}
              isLight={false}
              STATS={STATS}
            />
          </motion.div>
        </div>

        {/* Right: image 45% */}
        <div className="relative hidden w-full min-h-[500px] sm:block lg:w-[45%]">
          <Image
            src={heroImageSrc}
            alt="Luxury fragrance"
            fill priority quality={100}
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  )
}

// ── Shared text block ─────────────────────────────────────────────────────────
interface TextContentProps {
  title: string
  subtitle: string
  ctaLabel: string
  ctaLink?: string
  isLight: boolean
  STATS: { value: string; label: string }[]
}

function TextContent({ title, subtitle, ctaLabel, ctaLink, isLight, STATS }: TextContentProps) {
  const headlineColor = isLight ? 'text-stone-50' : 'text-ink-900'
  const bodyColor     = isLight ? 'text-stone-300' : 'text-ink-600'
  const statColor     = isLight ? 'text-stone-100' : 'text-ink-900'
  const statLabelColor = isLight ? 'text-stone-400' : 'text-ink-400'
  const dividerColor  = isLight ? 'border-stone-700' : 'border-ink-200'
  const dividerLineColor = isLight ? 'bg-stone-700' : 'bg-ink-200'

  return (
    <>
      {/* Eyebrow */}
      <motion.div variants={itemVariants} className="mb-6 flex items-center gap-3 outline-none">
        <div className="h-px w-8 flex-shrink-0 bg-camel-500" />
        <span className="font-body text-[10px] font-light uppercase tracking-[0.42em] text-camel-500 select-none">
          Inspired by Icons. Reimagined for You.
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        variants={itemVariants}
        className={cn('font-headline mb-6 font-bold uppercase leading-[0.95] tracking-tight text-5xl md:text-6xl lg:text-7xl', headlineColor)}
      >
        {title}
      </motion.h1>

      {/* Discount badge */}
      <motion.div variants={itemVariants} className="mb-6">
        <span className="inline-block bg-camel-500 px-4 py-2 text-white font-body text-center leading-tight">
          <span className="block text-sm font-bold tracking-widest">50% OFF</span>
          <span className="block text-[9px] font-semibold uppercase tracking-[0.3em] opacity-90">Limited Time Offer</span>
        </span>
      </motion.div>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          variants={itemVariants}
          className={cn('mb-9 max-w-[390px] font-body text-base font-light leading-[1.75] tracking-wide md:text-lg', bodyColor)}
        >
          {subtitle}
        </motion.p>
      )}

      {/* CTA */}
      <motion.div variants={itemVariants} className="mb-9">
        <Link
          href={ctaLink ?? '/products'}
          className="group inline-flex items-center justify-center gap-2.5 bg-ink-900 px-7 py-[11px] font-body text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-ink-700 hover:shadow-xl hover:shadow-black/15"
        >
          {ctaLabel}
          <ArrowRight size={11} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className={cn('flex items-center border-t pt-7', dividerColor)}>
        {STATS.map((stat, i) => (
          <div key={stat.label} className="flex items-center">
            <div className="pr-6 pl-0">
              <p className={cn('font-display text-[1.6rem] font-light leading-none', statColor)}>{stat.value}</p>
              <p className={cn('mt-1 font-body text-[9px] uppercase tracking-[0.28em]', statLabelColor)}>{stat.label}</p>
            </div>
            {i < STATS.length - 1 && <div className={cn('mr-6 h-7 w-px flex-shrink-0', dividerLineColor)} />}
          </div>
        ))}
      </motion.div>
    </>
  )
}
