'use client'

import { useRef } from 'react'
import { useLocale } from 'next-intl'
import { motion, useInView } from 'framer-motion'
import type { TrustBarSectionBlock } from '@/lib/types'

interface TrustBarProps {
  data?: TrustBarSectionBlock
}

export default function TrustBar({ data }: TrustBarProps = {}) {
  const locale = useLocale()
  const isAr = locale === 'ar'
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })

  const sanityItems = data?.items && data.items.length > 0 ? data.items : null

  if (!sanityItems) return null

  return (
    <section className="border-b border-stone-200 bg-white">
      <div
        ref={ref}
        className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-stone-200 lg:grid-cols-4 lg:divide-y-0"
      >
        {sanityItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col items-center gap-4 px-6 py-10 text-center transition-colors duration-300 hover:bg-stone-50 lg:flex-row lg:items-center lg:gap-6 lg:text-left"
          >
            {/* Decorative number */}
            <span className="absolute right-4 top-4 font-body text-[10px] font-light tracking-[0.1em] text-ink-200 lg:static lg:hidden">
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Emoji icon from Sanity */}
            {item.icon && (
              <span className="flex-shrink-0 text-lg leading-none transition-transform duration-500 group-hover:scale-110">
                {item.icon}
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-800">
                {item.value}
              </p>
              <p className="mt-0.5 font-body text-[11px] leading-relaxed text-ink-400">
                {isAr ? item.label_ar : item.label_en}
              </p>
            </div>

            {/* Number — desktop right edge */}
            <span className="hidden font-body text-[10px] font-light tracking-[0.1em] text-ink-200 lg:block">
              {String(i + 1).padStart(2, '0')}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
