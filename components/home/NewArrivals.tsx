'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useLocale } from 'next-intl'
import type { Product, NewArrivalsSectionBlock } from '@/lib/types'

const LOCAL_IMAGES = [
  '/images/products/default-product.jpeg',
  '/images/products/p1.jpeg',
  '/images/products/p2.jpeg',
  '/images/products/p3.jpeg',
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

interface Props { data: NewArrivalsSectionBlock }

export default function NewArrivals({ data }: Props) {
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const products: Product[] = (data?.newArrivalsProducts ?? []) as Product[]
  const limit = data?.limit ?? 8
  const sliced = products.slice(0, limit)
  const title = (locale === 'ar' ? data?.title_ar : data?.title_en) ?? 'New Arrivals'
  const subtitle = locale === 'ar' ? data?.subtitle_ar : data?.subtitle_en
  const ctaLabel = locale === 'ar' ? data?.cta?.label_ar : data?.cta?.label_en

  if (sliced.length === 0) return null

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <p className="mb-2 font-body text-xs uppercase tracking-widest text-camel-500">Just In</p>
          <h2 className="font-headline font-bold uppercase text-ink-900 text-4xl md:text-5xl">{title}</h2>
          {subtitle && <p className="mt-3 font-body text-sm text-ink-400">{subtitle}</p>}
          <div className="mx-auto mt-4 h-px w-16 bg-camel-500/50" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          {sliced.map((product, idx) => {
            const name = locale === 'ar' ? product.name_ar : product.name_en
            const imageUrl = product.images?.[0]?.url || LOCAL_IMAGES[idx % LOCAL_IMAGES.length]
            const price = product.volume?.[0]?.price ?? product.price
            return (
              <motion.div key={product._id} variants={cardVariants} className="group">
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative w-full overflow-hidden bg-stone-200" style={{ aspectRatio: '3/4' }}>
                    <Image
                      src={imageUrl}
                      alt={product.images?.[0]?.alt || name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute left-3 top-3">
                      <span className="bg-camel-500 px-2.5 py-1 font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
                        New
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-display text-base font-light text-ink-900 transition-colors group-hover:text-camel-600">
                      {name}
                    </h3>
                    <p className="mt-1 font-body text-sm font-medium text-ink-900">${price.toFixed(2)}</p>
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
            transition={{ delay: 0.5, duration: 0.6 }}
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
