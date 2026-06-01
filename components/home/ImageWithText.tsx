'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import type { ImageWithTextSectionBlock } from '@/lib/types'

interface Props { data: ImageWithTextSectionBlock }

export default function ImageWithText({ data }: Props) {
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const {
    imageUrl, imageAlt,
    headline_en, headline_ar, eyebrow_en, eyebrow_ar, body_en, body_ar,
    imagePosition = 'left', imageStyle = 'square', bgColor = 'white', cta,
  } = data

  const headline = locale === 'ar' ? headline_ar : headline_en
  const eyebrow = locale === 'ar' ? eyebrow_ar : eyebrow_en
  const body = locale === 'ar' ? body_ar : body_en
  const ctaLabel = locale === 'ar' ? cta?.label_ar : cta?.label_en

  const bgClass = { white: 'bg-white', cream: 'bg-stone-50', black: 'bg-ink-900' }[bgColor]
  const textClass = bgColor === 'black' ? 'text-white' : 'text-ink-900'
  const subtextClass = bgColor === 'black' ? 'text-white/60' : 'text-ink-500'

  const imageRounding = imageStyle === 'rounded' ? 'rounded-2xl' : ''

  const imageCol = (
    <div className={cn('relative overflow-hidden', imageStyle === 'full-bleed' ? 'min-h-[480px]' : 'aspect-square lg:aspect-auto', imageRounding)}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt ?? ''}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      ) : (
        <div className="absolute inset-0 bg-stone-200" />
      )}
    </div>
  )

  const textCol = (
    <motion.div
      initial={{ opacity: 0, x: imagePosition === 'left' ? 30 : -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col justify-center py-12 lg:py-0 lg:px-12"
    >
      {eyebrow && (
        <p className="mb-3 font-body text-xs uppercase tracking-widest text-camel-500">{eyebrow}</p>
      )}
      {headline && (
        <h2 className={cn('font-headline font-bold uppercase text-3xl md:text-4xl leading-tight', textClass)}>
          {headline}
        </h2>
      )}
      {body && (
        <p className={cn('mt-4 font-body text-base font-light leading-relaxed', subtextClass)}>{body}</p>
      )}
      {cta?.link && ctaLabel && (
        <div className="mt-8">
          <Link
            href={cta.link}
            className="inline-flex items-center gap-2.5 bg-camel-500 px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-camel-600"
          >
            {ctaLabel}
            <ArrowRight size={11} strokeWidth={2.5} />
          </Link>
        </div>
      )}
    </motion.div>
  )

  return (
    <section ref={ref} className={cn('overflow-hidden', bgClass)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-0">
        <div className={cn(
          'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0',
          imageStyle === 'full-bleed' ? 'lg:items-stretch' : 'lg:items-center'
        )}>
          {imagePosition === 'left' ? (
            <>{imageCol}{textCol}</>
          ) : (
            <>{textCol}{imageCol}</>
          )}
        </div>
      </div>
    </section>
  )
}
