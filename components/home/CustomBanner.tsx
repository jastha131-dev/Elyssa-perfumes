'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CustomBannerSectionBlock } from '@/lib/types'
import { useLocale } from 'next-intl'

interface CustomBannerProps {
  data: CustomBannerSectionBlock
}

export default function CustomBanner({ data }: CustomBannerProps) {
  const locale = useLocale()
  const {
    imageUrl,
    imageAlt,
    headline_en,
    headline_ar,
    subtext_en,
    subtext_ar,
    overlayOpacity = 50,
    cta,
    textAlign = 'center',
  } = data
  const headline = locale === 'ar' ? headline_ar : headline_en
  const subtext = locale === 'ar' ? subtext_ar : subtext_en

  const alignClass = {
    left:   'items-start text-left',
    center: 'items-center text-center',
    right:  'items-end text-right',
  }[textAlign] ?? 'items-center text-center'

  const overlayAlpha = Math.min(1, Math.max(0, overlayOpacity / 100))

  return (
    <section className="relative w-full overflow-hidden">
      {/* ─── Background ──────────────────────────────────────── */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt ?? ''}
          fill
          className="object-cover object-center"
          quality={90}
        />
      ) : (
        <div className="absolute inset-0 bg-charcoal-900" />
      )}

      {/* ─── Overlay ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }}
      />

      {/* ─── Content ─────────────────────────────────────────── */}
      <div
        className={cn(
          'relative z-10 flex min-h-[400px] flex-col justify-center px-8 py-16 md:px-16 lg:px-24',
          alignClass
        )}
      >
        {headline && (
          <h2
            className={cn(
              'font-display mb-4 font-light leading-tight text-cream-50',
              'text-[2rem] md:text-[3rem] lg:text-[3.75rem]'
            )}
          >
            {headline}
          </h2>
        )}

        {subtext && (
          <p className="mb-8 max-w-xl font-body text-base font-light leading-relaxed text-cream-100/60">
            {subtext}
          </p>
        )}

        {cta?.link && (
          <Link
            href={cta.link}
            className={cn(
              'group inline-flex items-center justify-center gap-2.5 px-7 py-[11px]',
              'font-body text-[12px] font-semibold uppercase tracking-[0.2em]',
              'transition-all duration-300',
              cta.style === 'secondary'
                ? 'border border-gold-500/50 bg-transparent text-gold-400 hover:bg-gold-500/10'
                : cta.style === 'ghost'
                ? 'text-cream-100/65 hover:text-cream-100'
                : cta.style === 'outline'
                ? 'border border-cream-100/20 text-cream-100/65 hover:border-gold-400/50 hover:text-gold-400'
                : 'bg-gold-500 text-charcoal-950 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/25'
            )}
          >
            {(locale === 'ar' ? cta.label_ar : cta.label_en) || 'Shop Now'}
            <ArrowRight
              size={11}
              strokeWidth={2.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden={true}
            />
          </Link>
        )}
      </div>
    </section>
  )
}
