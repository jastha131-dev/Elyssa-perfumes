'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import type { VideoWithTextSectionBlock } from '@/lib/types'

interface Props { data: VideoWithTextSectionBlock }

export default function VideoWithText({ data }: Props) {
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const {
    videoUrl, muxPlaybackId, videoFileUrl, posterImageUrl,
    headline_en, headline_ar, eyebrow_en, eyebrow_ar, body_en, body_ar,
    videoPosition = 'left', bgColor = 'white', cta, autoplay = true,
  } = data

  const headline = locale === 'ar' ? headline_ar : headline_en
  const eyebrow = locale === 'ar' ? eyebrow_ar : eyebrow_en
  const body = locale === 'ar' ? body_ar : body_en
  const ctaLabel = locale === 'ar' ? cta?.label_ar : cta?.label_en
  const videoSrc = videoFileUrl || (muxPlaybackId ? `https://stream.mux.com/${muxPlaybackId}/high.mp4` : videoUrl)

  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = videoRef.current
    if (!el || !videoSrc) return
    el.muted = true
    const p = el.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }, [videoSrc])

  const bgClass = { white: 'bg-white', cream: 'bg-stone-50', black: 'bg-ink-900' }[bgColor] ?? 'bg-white'
  const textClass = bgColor === 'black' ? 'text-white' : 'text-ink-900'
  const subtextClass = bgColor === 'black' ? 'text-white/60' : 'text-ink-500'

  const videoCol = (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink-900 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterImageUrl ?? undefined}
          autoPlay={autoplay}
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-contain"
        />
      ) : posterImageUrl ? (
        <Image src={posterImageUrl} alt="" fill className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-stone-200" />
      )}
    </div>
  )

  const textCol = (
    <motion.div
      initial={{ opacity: 0, x: videoPosition === 'left' ? 30 : -30 }}
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
            className="inline-flex items-center gap-2.5 bg-camel-500 px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-camel-600 transition-colors"
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
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center gap-10 lg:gap-14">
          {videoPosition === 'left' ? <>{videoCol}{textCol}</> : <>{textCol}{videoCol}</>}
        </div>
      </div>
    </section>
  )
}
