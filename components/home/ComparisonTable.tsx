'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cart-store'
import type { Product, ComparisonTableSectionBlock } from '@/lib/types'

const ATTRIBUTES: { key: keyof Product; label: string }[] = [
  { key: 'fragranceFamily', label: 'Fragrance Family' },
  { key: 'intensity', label: 'Intensity' },
  { key: 'sillage', label: 'Sillage' },
  { key: 'longevity', label: 'Longevity' },
]

interface Props { data: ComparisonTableSectionBlock }

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }
const cardVariant = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }

export default function ComparisonTable({ data }: Props) {
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const { addItem } = useCartStore()

  const products: Product[] = (data?.products ?? []) as Product[]
  const title = locale === 'ar' ? data?.title_ar : data?.title_en
  const highlight = data?.highlightProductIndex ?? 0

  if (!products.length) return null

  const rowsFor = (p: Product) => [
    ...ATTRIBUTES.map((a) => ({ label: a.label, value: String(p[a.key] ?? '—') })),
    { label: 'Top Notes', value: (locale === 'ar' ? p.topNotes_ar : p.topNotes_en)?.join(', ') ?? '—' },
    { label: 'Base Notes', value: (locale === 'ar' ? p.baseNotes_ar : p.baseNotes_en)?.join(', ') ?? '—' },
  ]

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-b from-stone-50 to-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14 text-center"
          >
            <h2 className="font-headline font-bold uppercase text-ink-900 text-4xl md:text-5xl">{title}</h2>
            <div className="mx-auto mt-4 h-px w-16 bg-camel-500/50" />
          </motion.div>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((p, i) => {
            const name = locale === 'ar' ? p.name_ar : p.name_en
            const isHi = i === highlight
            const price = p.volume?.[0]?.price ?? p.price
            const vol = p.volume?.[0]
            return (
              <motion.div
                key={p._id}
                variants={cardVariant}
                whileHover={{ y: -12 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className={cn(
                  'group relative flex flex-col rounded-[28px] border bg-white p-7 transition-colors duration-300',
                  'hover:border-camel-500 hover:bg-camel-500 hover:shadow-[0_36px_80px_-30px_rgba(176,137,79,0.6)]',
                  isHi ? 'border-camel-500/40 ring-1 ring-camel-500/20 shadow-sm' : 'border-stone-200'
                )}
              >
                {isHi && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-camel-500 px-4 py-1 font-body text-[9px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition-colors duration-300 group-hover:bg-white group-hover:text-camel-600">
                    Recommended
                  </span>
                )}

                {/* Header */}
                <div className="flex flex-col items-center gap-3 pt-2 text-center">
                  {p.images?.[0]?.url && (
                    <div className="relative h-24 w-24 overflow-hidden rounded-2xl ring-1 ring-stone-200 transition-all duration-300 group-hover:ring-white/50">
                      <Image src={p.images[0].url} alt={name} fill className="object-cover" />
                    </div>
                  )}
                  <Link
                    href={`/products/${p.slug}`}
                    className="font-headline text-base font-bold uppercase tracking-wide text-ink-900 transition-colors duration-300 group-hover:text-white"
                  >
                    {name}
                  </Link>
                  <span className="font-body text-base font-medium text-camel-600 transition-colors duration-300 group-hover:text-white">
                    ${price.toFixed(2)}
                  </span>
                </div>

                <div className="my-5 h-px w-full bg-stone-200 transition-colors duration-300 group-hover:bg-white/25" />

                {/* Attributes */}
                <div className="flex flex-1 flex-col gap-3.5">
                  {rowsFor(p).map((r) => (
                    <div key={r.label} className="flex items-start justify-between gap-4">
                      <span className="font-body text-[10px] uppercase tracking-widest text-ink-400 transition-colors duration-300 group-hover:text-white/60">
                        {r.label}
                      </span>
                      <span className="text-right font-body text-xs text-ink-700 transition-colors duration-300 group-hover:text-white">
                        {r.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                {data?.showAddToCart && (
                  <div className="mt-7">
                    {vol ? (
                      <button
                        type="button"
                        onClick={() => addItem(p, 1, vol)}
                        className={cn(
                          'w-full px-5 py-3 font-body text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300 group-hover:bg-white group-hover:text-camel-600',
                          isHi ? 'bg-camel-500 text-white' : 'border border-stone-300 text-ink-700'
                        )}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <span className="block text-center font-body text-xs text-ink-400 transition-colors duration-300 group-hover:text-white/70">
                        Out of Stock
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}
