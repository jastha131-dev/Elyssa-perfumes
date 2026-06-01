'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'
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

export default function ComparisonTable({ data }: Props) {
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const { addItem } = useCartStore()

  const products: Product[] = (data?.products ?? []) as Product[]
  const title = locale === 'ar' ? data?.title_ar : data?.title_en
  const highlight = data?.highlightProductIndex ?? 0

  if (!products.length) return null

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-stone-50 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 text-center"
          >
            <h2 className="font-headline font-bold uppercase text-ink-900 text-4xl md:text-5xl">{title}</h2>
            <div className="mx-auto mt-4 h-px w-16 bg-camel-500/50" />
          </motion.div>
        )}

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className="w-40 py-4 text-left font-body text-xs uppercase tracking-widest text-ink-400" />
                {products.map((p, i) => {
                  const name = locale === 'ar' ? p.name_ar : p.name_en
                  const isHighlighted = i === highlight
                  const price = p.volume?.[0]?.price ?? p.price
                  return (
                    <th
                      key={p._id}
                      className={cn('px-4 py-4 text-center', isHighlighted && 'bg-white shadow-sm')}
                    >
                      <div className="flex flex-col items-center gap-3">
                        {p.images?.[0]?.url && (
                          <div className="relative h-20 w-20 overflow-hidden">
                            <Image src={p.images[0].url} alt={name} fill className="object-cover" />
                          </div>
                        )}
                        <Link href={`/products/${p.slug}`} className="font-body text-sm font-medium text-ink-900 hover:text-camel-600 transition-colors">
                          {name}
                        </Link>
                        <span className="font-body text-sm text-camel-500">${price.toFixed(2)}</span>
                        {isHighlighted && (
                          <span className="bg-camel-500 px-2 py-0.5 font-body text-[9px] uppercase tracking-widest text-white">
                            Recommended
                          </span>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {ATTRIBUTES.map(({ key, label }, rowIdx) => (
                <tr key={key} className={rowIdx % 2 === 0 ? 'bg-white/40' : ''}>
                  <td className="py-3.5 pr-4 font-body text-xs uppercase tracking-widest text-ink-500">{label}</td>
                  {products.map((p, i) => (
                    <td
                      key={p._id}
                      className={cn('px-4 py-3.5 text-center font-body text-sm text-ink-700', i === highlight && 'bg-white')}
                    >
                      {String(p[key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Notes rows */}
              <tr>
                <td className="py-3.5 pr-4 font-body text-xs uppercase tracking-widest text-ink-500">Top Notes</td>
                {products.map((p, i) => (
                  <td key={p._id} className={cn('px-4 py-3.5 text-center font-body text-xs text-ink-600', i === highlight && 'bg-white')}>
                    {(locale === 'ar' ? p.topNotes_ar : p.topNotes_en)?.join(', ') ?? '—'}
                  </td>
                ))}
              </tr>
              <tr className="bg-white/40">
                <td className="py-3.5 pr-4 font-body text-xs uppercase tracking-widest text-ink-500">Base Notes</td>
                {products.map((p, i) => (
                  <td key={p._id} className={cn('px-4 py-3.5 text-center font-body text-xs text-ink-600', i === highlight && 'bg-white')}>
                    {(locale === 'ar' ? p.baseNotes_ar : p.baseNotes_en)?.join(', ') ?? '—'}
                  </td>
                ))}
              </tr>
              {data?.showAddToCart && (
                <tr>
                  <td />
                  {products.map((p, i) => {
                    const vol = p.volume?.[0]
                    return (
                      <td key={p._id} className={cn('px-4 py-5 text-center', i === highlight && 'bg-white')}>
                        {vol ? (
                          <button
                            onClick={() => addItem(p, 1, vol)}
                            className={cn(
                              'px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.15em] transition-colors',
                              i === highlight
                                ? 'bg-camel-500 text-white hover:bg-camel-600'
                                : 'border border-stone-300 text-ink-700 hover:border-camel-400 hover:text-camel-600'
                            )}
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <span className="font-body text-xs text-ink-400">Out of Stock</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  )
}
