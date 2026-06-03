'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import type { VideoBannerSectionBlock } from '@/lib/types'

interface Props { data: VideoBannerSectionBlock }

export default function VideoBanner({ data }: Props) {
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const {
    videoUrl, muxPlaybackId, videoFileUrl, posterImageUrl, posterImageAlt,
    headline_en, headline_ar, subtext_en, subtext_ar,
    overlayOpacity = 40, layout = 'fullscreen', cta,
    autoplay = true, muted = true, loop = true,
  } = data

  const headline = locale === 'ar' ? headline_ar : headline_en
  const subtext = locale === 'ar' ? subtext_ar : subtext_en
  const ctaLabel = locale === 'ar' ? cta?.label_ar : cta?.label_en
  const videoSrc = videoFileUrl
    || (muxPlaybackId ? `https://stream.mux.com/${muxPlaybackId}/high.mp4` : videoUrl)

  const overlayAlpha = Math.min(1, Math.max(0, (overlayOpacity) / 100))

  if (layout === 'split') {
    return (
      <section ref={ref} className="overflow-hidden bg-stone-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-center py-16 lg:py-24 lg:pr-12"
            >
              {headline && (
                <h2 className="font-headline font-bold uppercase text-ink-900 text-3xl md:text-4xl lg:text-5xl leading-tight">
                  {headline}
                </h2>
              )}
              {subtext && (
                <p className="mt-4 font-body text-base font-light text-ink-500 leading-relaxed max-w-sm">
                  {subtext}
                </p>
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
            <div className="relative min-h-[400px] lg:min-h-[560px] overflow-hidden">
              {videoSrc ? (
                <video
                  src={videoSrc}
                  poster={posterImageUrl ?? undefined}
                  autoPlay={autoplay}
                  muted={muted}
                  loop={loop}
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : posterImageUrl ? (
                <Image src={posterImageUrl} alt={posterImageAlt ?? ''} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-ink-900" />
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative w-full overflow-hidden aspect-[4/5] sm:aspect-video max-h-[90vh]">
      {videoSrc ? (
        <video
          src={videoSrc}
          poster={posterImageUrl ?? undefined}
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : posterImageUrl ? (
        <Image src={posterImageUrl} alt={posterImageAlt ?? ''} fill className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-ink-900" />
      )}
      <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }} />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
      >
        {headline && (
          <h2 className="font-display font-light text-white text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl">
            {headline}
          </h2>
        )}
        {subtext && (
          <p className="mt-4 font-body font-light text-white/70 text-base leading-relaxed max-w-lg">
            {subtext}
          </p>
        )}
        {cta?.link && ctaLabel && (
          <Link
            href={cta.link}
            className="mt-8 inline-flex items-center gap-2.5 bg-white px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink-900 transition-colors hover:bg-stone-100"
          >
            {ctaLabel}
            <ArrowRight size={11} strokeWidth={2.5} />
          </Link>
        )}
      </motion.div>
    </section>
  )
}
