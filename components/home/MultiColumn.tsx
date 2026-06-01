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
      className={cn('py-20 md:py-28', bgClass)}
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
          {columns.map((col) => {
            const colHeadline = locale === 'ar' ? col.headline_ar : col.headline_en
            const colBody = locale === 'ar' ? col.body_ar : col.body_en
            const ctaLabel = locale === 'ar' ? col.cta?.label_ar : col.cta?.label_en
            return (
              <motion.div
                key={col._key}
                variants={itemVariants}
                className={cn('flex flex-col p-8 border', borderClass, bgClass)}
              >
                {col.icon && (
                  <span className="mb-4 text-3xl">{col.icon}</span>
                )}
                {colHeadline && (
                  <h3 className={cn('font-headline font-bold uppercase text-lg mb-3', textClass)}>
                    {colHeadline}
                  </h3>
                )}
                {colBody && (
                  <p className={cn('font-body text-sm font-light leading-relaxed flex-1', subtextClass)}>
                    {colBody}
                  </p>
                )}
                {col.cta?.link && ctaLabel && (
                  <Link
                    href={col.cta.link}
                    className="mt-5 inline-flex items-center gap-1.5 font-body text-xs uppercase tracking-[0.15em] text-camel-500 hover:text-camel-600 transition-colors"
                  >
                    {ctaLabel}
                    <ArrowRight size={10} />
                  </Link>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}
