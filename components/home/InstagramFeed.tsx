'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Instagram } from 'lucide-react'
import { useLocale } from 'next-intl'
import type { InstagramFeedSectionBlock, InstagramPhoto } from '@/lib/types'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

interface Props { data: InstagramFeedSectionBlock }

export default function InstagramFeed({ data }: Props) {
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const photos: InstagramPhoto[] = data?.photos ?? []
  const title = locale === 'ar' ? data?.title_ar : data?.title_en
  const ctaLabel = locale === 'ar' ? data?.cta?.label_ar : data?.cta?.label_en
  const cols = data?.columns ?? 4
  const colClass = { 3: 'grid-cols-3', 4: 'grid-cols-2 md:grid-cols-4', 6: 'grid-cols-3 md:grid-cols-6' }[cols] ?? 'grid-cols-2 md:grid-cols-4'

  if (!photos.length) return null

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
          className="mb-10 flex items-center justify-between"
        >
          <div>
            {data?.handle && (
              <a
                href={`https://instagram.com/${data.handle.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-1 inline-flex items-center gap-1.5 font-body text-xs uppercase tracking-widest text-camel-500 transition-colors hover:text-camel-600"
              >
                <Instagram size={12} /> {data.handle}
              </a>
            )}
            {title && <h2 className="font-headline font-bold uppercase text-ink-900 text-3xl md:text-4xl">{title}</h2>}
          </div>
          {data?.cta?.link && ctaLabel && (
            <Link
              href={data.cta.link}
              className="hidden md:inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-ink-600 border-b border-stone-300 pb-0.5 hover:border-camel-500 hover:text-camel-600 transition-colors"
            >
              {ctaLabel}
              <ArrowRight size={11} />
            </Link>
          )}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className={`grid gap-1 ${colClass}`}
        >
          {photos.map((photo, i) => {
            const caption = locale === 'ar' ? photo.caption_ar : photo.caption_en
            return (
              <motion.div key={i} variants={itemVariants} className="group relative overflow-hidden aspect-square bg-stone-200">
                {photo.imageUrl ? (
                  <Image
                    src={photo.imageUrl}
                    alt={photo.imageAlt || caption || ''}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-stone-200" />
                )}
                {caption && (
                  <div className="absolute inset-0 flex items-end bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
                    <p className="translate-y-2 p-3 font-body text-xs text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 line-clamp-3">
                      {caption}
                    </p>
                  </div>
                )}
                {photo.link && (
                  <a
                    href={photo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0"
                    aria-label={caption ?? 'View post'}
                  />
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {data?.cta?.link && ctaLabel && (
          <div className="mt-6 flex justify-center md:hidden">
            <Link
              href={data.cta.link}
              className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-ink-600 border-b border-stone-300 pb-0.5 hover:border-camel-500 hover:text-camel-600 transition-colors"
            >
              {ctaLabel}
              <ArrowRight size={11} />
            </Link>
          </div>
        )}
      </div>
    </motion.section>
  )
}
