'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import type { QuizPromoSectionBlock } from '@/lib/types'

interface Props { data: QuizPromoSectionBlock }

export default function QuizPromo({ data }: Props) {
  const locale = useLocale()
  const isAr = locale === 'ar'
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const eyebrow = isAr ? (data?.eyebrow_ar || data?.eyebrow_en) : data?.eyebrow_en ?? 'Discover Your Scent'
  const headline = isAr ? (data?.headline_ar || data?.headline_en) : data?.headline_en ?? 'Find Your Perfect Fragrance'
  const subtext = isAr ? (data?.subtext_ar || data?.subtext_en) : data?.subtext_en ?? 'Answer 5 quick questions and we\'ll match you with your ideal scent.'
  const ctaLabel = isAr ? (data?.ctaLabel_ar || data?.ctaLabel_en) : data?.ctaLabel_en ?? 'Take the Quiz'
  const href = data?.quizUrl || '/quiz'
  const steps = data?.steps ?? ['5 questions', 'Instant results', 'Expert matching']
  const style = data?.style ?? 'dark'

  // Right-side preview card (dynamic from Studio, with fallbacks)
  const previewLabel = (isAr ? data?.previewLabel_ar || data?.previewLabel_en : data?.previewLabel_en) ?? 'Scent Finder'
  const previewQuestion = (isAr ? data?.previewQuestion_ar || data?.previewQuestion_en : data?.previewQuestion_en) ?? "What's your ideal mood?"
  const previewProgress = (isAr ? data?.previewProgress_ar || data?.previewProgress_en : data?.previewProgress_en) ?? 'Question 2 of 5'
  const previewOptions = data?.previewOptions?.length
    ? data.previewOptions.map((o) => (isAr ? o.label_ar || o.label_en : o.label_en) || '')
    : ['Warm & cosy evenings', 'Fresh air & nature', 'Bold & confident', 'Romantic & sensual']

  const bgClass = {
    dark: 'bg-charcoal-700',
    light: 'bg-stone-100',
    accent: 'bg-camel-500',
  }[style]

  const textClass = style === 'light' ? 'text-ink-900' : 'text-white'
  const subtextClass = style === 'light' ? 'text-ink-500' : 'text-white/70'
  const eyebrowClass = style === 'light' ? 'text-camel-500' : style === 'accent' ? 'text-white/80' : 'text-camel-400'
  const pillClass = style === 'light'
    ? 'bg-stone-200 text-ink-700'
    : style === 'accent'
    ? 'bg-white/20 text-white'
    : 'bg-white/10 text-white/80'
  const btnClass = style === 'accent'
    ? 'bg-white text-camel-600 hover:bg-stone-100 border border-white'
    : style === 'light'
    ? 'bg-camel-500 text-white hover:bg-camel-600'
    : 'bg-camel-500 text-white hover:bg-camel-600'

  return (
    <section ref={ref} className={cn('relative overflow-hidden', bgClass)}>
      {data?.bgImageUrl && (
        <Image src={data.bgImageUrl} alt="" fill className="object-cover opacity-15" />
      )}

      {/* Decorative orb */}
      <div className={cn(
        'pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl opacity-20',
        style === 'light' ? 'bg-camel-400' : 'bg-camel-500'
      )} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">

          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={cn('mb-3 flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.3em]', eyebrowClass)}>
              <Sparkles size={12} />
              {eyebrow}
            </div>
            <h2 className={cn('font-display font-light leading-tight text-4xl md:text-5xl', textClass)}>
              {headline}
            </h2>
            <p className={cn('mt-4 font-body text-base font-light leading-relaxed max-w-md', subtextClass)}>
              {subtext}
            </p>

            {/* Steps pills */}
            {steps.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {steps.map((step, i) => (
                  <span key={i} className={cn('flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-xs font-medium', pillClass)}>
                    <CheckCircle size={11} />
                    {step}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8">
              <Link
                href={href}
                className={cn(
                  'inline-flex items-center gap-2.5 px-8 py-4 font-body text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-200',
                  btnClass
                )}
              >
                {ctaLabel}
                <ArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Right — Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className={cn(
              'relative mx-auto max-w-xs rounded-2xl p-8',
              style === 'light' ? 'bg-white shadow-xl shadow-ink-900/10' : 'bg-white/10 border border-white/20'
            )}>
              {/* Quiz card mockup */}
              <div className="mb-5 flex items-center gap-2">
                <Sparkles size={16} className="text-camel-500" />
                <span className={cn('font-body text-xs font-semibold uppercase tracking-widest', style === 'light' ? 'text-ink-600' : 'text-white/80')}>{previewLabel}</span>
              </div>
              <p className={cn('mb-4 font-display text-lg font-light', style === 'light' ? 'text-ink-900' : 'text-white')} dir={isAr ? 'rtl' : 'ltr'}>
                {previewQuestion}
              </p>
              <div className="space-y-2" dir={isAr ? 'rtl' : 'ltr'}>
                {previewOptions.map((opt, i) => (
                  <div
                    key={opt}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2.5 font-body text-sm transition-all',
                      i === 0
                        ? 'bg-camel-500 text-white'
                        : style === 'light'
                        ? 'bg-stone-100 text-ink-600 hover:bg-stone-200'
                        : 'bg-white/10 text-white/70'
                    )}
                  >
                    <span className={cn('h-3 w-3 rounded-full border-2 flex-shrink-0', i === 0 ? 'border-white bg-white' : style === 'light' ? 'border-stone-300' : 'border-white/40')} />
                    {opt}
                  </div>
                ))}
              </div>
              <div className={cn('mt-4 h-1.5 w-full rounded-full overflow-hidden', style === 'light' ? 'bg-stone-100' : 'bg-white/10')}>
                <div className="h-full w-2/5 rounded-full bg-camel-500" />
              </div>
              <p className={cn('mt-1.5 font-body text-[10px]', style === 'light' ? 'text-ink-400' : 'text-white/50')}>{previewProgress}</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
