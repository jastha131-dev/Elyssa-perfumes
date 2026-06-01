'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useLocale } from 'next-intl'
import type { Collection, CollectionsGridSectionBlock } from '@/lib/types'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

interface Props { data: CollectionsGridSectionBlock }

export default function CollectionsGrid({ data }: Props) {
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const collections: Collection[] = (data?.collections ?? []) as Collection[]
  const title = locale === 'ar' ? data?.title_ar : data?.title_en
  const subtitle = locale === 'ar' ? data?.subtitle_ar : data?.subtitle_en
  const ctaLabel = locale === 'ar' ? data?.cta?.label_ar : data?.cta?.label_en
  const cols = data?.columnCount ?? 3

  const colClass = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' }[cols] ?? 'md:grid-cols-3'

  if (!collections.length) return null

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-stone-50 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 text-center"
          >
            {title && <h2 className="font-headline font-bold uppercase text-ink-900 text-4xl md:text-5xl">{title}</h2>}
            {subtitle && <p className="mt-3 font-body text-sm text-ink-400">{subtitle}</p>}
            <div className="mx-auto mt-4 h-px w-16 bg-camel-500/50" />
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className={`grid grid-cols-1 gap-4 ${colClass}`}
        >
          {collections.map((col) => {
            const name = locale === 'ar' ? col.title_ar : col.title_en
            const href = col.filterParam ? `/products?${col.filterParam}` : `/products`
            return (
              <motion.div key={col._id} variants={itemVariants} className="group relative overflow-hidden">
                <Link href={href} className="block">
                  <div className="relative w-full overflow-hidden bg-stone-200" style={{ aspectRatio: '4/5' }}>
                    {col.imageUrl ? (
                      <Image
                        src={col.imageUrl}
                        alt={name ?? ''}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-stone-300" />
                    )}
                    <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/30" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="font-headline font-bold uppercase text-white text-lg">{name}</h3>
                      <span className="mt-1 inline-flex items-center gap-1 font-body text-xs uppercase tracking-[0.2em] text-white/80">
                        Shop <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {data?.cta?.link && ctaLabel && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 text-center"
          >
            <Link
              href={data.cta.link}
              className="inline-flex items-center gap-2 font-body text-sm uppercase tracking-[0.2em] text-ink-600 border-b border-stone-300 pb-0.5 hover:border-camel-500 hover:text-camel-600 transition-colors"
            >
              {ctaLabel}
              <ArrowRight size={12} strokeWidth={2} />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}
