'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Truck, Shield, Gift, RotateCcw } from 'lucide-react'
import type { TrustBarSectionBlock } from '@/lib/types'

const HARDCODED_ITEMS = [
  { icon: Truck,      label: '01', title: 'Complimentary Shipping', sub: 'On all orders over $100' },
  { icon: Shield,     label: '02', title: 'Certified Authentic',    sub: '100% genuine fragrances' },
  { icon: Gift,       label: '03', title: 'Luxury Gifting',         sub: 'Signature gift packaging' },
  { icon: RotateCcw,  label: '04', title: '30-Day Returns',         sub: 'Hassle-free exchanges' },
]

interface TrustBarProps {
  data?: TrustBarSectionBlock
}

export default function TrustBar({ data }: TrustBarProps = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })

  const sanityItems = data?.items && data.items.length > 0 ? data.items : null

  return (
    <section className="border-b border-stone-200 bg-white">
      <div
        ref={ref}
        className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-stone-200 lg:grid-cols-4 lg:divide-y-0"
      >
        {sanityItems
          ? sanityItems.map((item, i) => (
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
                    {item.label}
                  </p>
                </div>

                {/* Number — desktop right edge */}
                <span className="hidden font-body text-[10px] font-light tracking-[0.1em] text-ink-200 lg:block">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </motion.div>
            ))
          : HARDCODED_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col items-center gap-4 px-6 py-10 text-center transition-colors duration-300 hover:bg-stone-50 lg:flex-row lg:items-center lg:gap-6 lg:text-left"
              >
                {/* Decorative number */}
                <span className="absolute right-4 top-4 font-body text-[10px] font-light tracking-[0.1em] text-ink-200 lg:static lg:hidden">
                  {item.label}
                </span>

                {/* Icon — bare, no box */}
                <item.icon
                  className="h-[18px] w-[18px] flex-shrink-0 text-camel-500 transition-transform duration-500 group-hover:scale-110"
                  strokeWidth={1.5}
                />

                <div className="min-w-0 flex-1">
                  <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-800">
                    {item.title}
                  </p>
                  <p className="mt-0.5 font-body text-[11px] leading-relaxed text-ink-400">
                    {item.sub}
                  </p>
                </div>

                {/* Number — desktop right edge */}
                <span className="hidden font-body text-[10px] font-light tracking-[0.1em] text-ink-200 lg:block">
                  {item.label}
                </span>
              </motion.div>
            ))}
      </div>
    </section>
  )
}
