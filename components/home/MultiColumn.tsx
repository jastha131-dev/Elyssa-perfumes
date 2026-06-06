'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import type { MultiColumnSectionBlock, MultiColumnItem } from '@/lib/types'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

interface Props { data: MultiColumnSectionBlock }

export default function MultiColumn({ data }: Props) {
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const columns: MultiColumnItem[] = data?.columns ?? []
  const title = locale === 'ar' ? data?.title_ar : data?.title_en
  const subtitle = locale === 'ar' ? data?.subtitle_ar : data?.subtitle_en
  const bgColor = data?.bgColor ?? 'white'
  const colCount = data?.columnCount ?? 3

  const bgStyle = ({ white: '#ffffff', cream: '#fafaf9', black: '#1a1a1a' } as Record<string, string>)[bgColor] ?? '#ffffff'
  const bgClass = { white: 'bg-white', cream: 'bg-stone-50', black: 'bg-ink-900' }[bgColor]
  const textClass = bgColor === 'black' ? 'text-white' : 'text-ink-900'
  const subtextClass = bgColor === 'black' ? 'text-white/60' : 'text-ink-500'
  const borderClass = bgColor === 'black' ? 'border-white/10' : 'border-stone-200'

  const colClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[colCount] ?? 'md:grid-cols-3'

  if (!columns.length) return null

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="py-20 md:py-28"
      style={{ backgroundColor: `var(--section-bg, ${bgStyle})` }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14 text-center"
          >
            {title && (
              <h2 className={cn('font-headline font-bold uppercase text-4xl md:text-5xl', textClass)}>
                {title}
              </h2>
            )}
            {subtitle && <p className={cn('mt-3 font-body text-sm', subtextClass)}>{subtitle}</p>}
            <div className="mx-auto mt-4 h-px w-16 bg-camel-500/50" />
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className={cn('grid grid-cols-1 gap-px', colClass, bgColor !== 'black' && 'border border-stone-200')}
        >
          {columns.map((col, idx) => {
            const colHeadline = locale === 'ar' ? col.headline_ar : col.headline_en
            const colBody = locale === 'ar' ? col.body_ar : col.body_en
            const ctaLabel = locale === 'ar' ? col.cta?.label_ar : col.cta?.label_en
            return (
              <motion.div
                key={col._key}
                variants={itemVariants}
                className={cn('group relative flex flex-col overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.25)]', borderClass, bgClass)}
              >
                {/* gold fill-up overlay on hover */}
                <span className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-camel-500 transition-transform duration-500 ease-out group-hover:scale-y-100" />
                <div className="relative z-10 flex flex-1 flex-col p-8 md:p-10">
                  <span className={cn('mb-5 font-headline text-3xl font-bold tabular-nums transition-colors duration-300 group-hover:text-white', bgColor === 'black' ? 'text-camel-400' : 'text-camel-500')}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className={cn('mb-5 h-px w-10 transition-all duration-500 group-hover:w-16 group-hover:bg-white/50', bgColor === 'black' ? 'bg-white/20' : 'bg-camel-500/30')} />
                  {colHeadline && (
                    <h3 className={cn('mb-3 font-headline text-lg font-bold uppercase tracking-wide transition-colors duration-300 group-hover:text-white', textClass)}>
                      {colHeadline}
                    </h3>
                  )}
                  {colBody && (
                    <p className={cn('flex-1 font-body text-sm font-light leading-relaxed transition-colors duration-300 group-hover:text-white/85', subtextClass)}>
                      {colBody}
                    </p>
                  )}
                  {col.cta?.link && ctaLabel && (
                    <Link
                      href={col.cta.link}
                      className="mt-5 inline-flex items-center gap-1.5 font-body text-xs uppercase tracking-[0.15em] text-camel-500 transition-colors hover:text-camel-600 group-hover:text-white"
                    >
                      {ctaLabel}
                      <ArrowRight size={10} />
                    </Link>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}
