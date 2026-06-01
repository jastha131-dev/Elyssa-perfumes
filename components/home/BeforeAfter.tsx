'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import type { BeforeAfterSectionBlock } from '@/lib/types'

interface Props { data: BeforeAfterSectionBlock }

export default function BeforeAfter({ data }: Props) {
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(data?.initialPosition ?? 50)
  const dragging = useRef(false)

  const title = locale === 'ar' ? data?.title_ar : data?.title_en
  const subtitle = locale === 'ar' ? data?.subtitle_ar : data?.subtitle_en
  const beforeLabel = (locale === 'ar' ? data?.beforeLabel_ar : data?.beforeLabel_en) ?? 'Before'
  const afterLabel = (locale === 'ar' ? data?.afterLabel_ar : data?.afterLabel_en) ?? 'After'

  const calcPosition = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    setPosition(pct)
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    calcPosition(e.clientX)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    calcPosition(e.clientX)
  }
  const onPointerUp = () => { dragging.current = false }

  if (!data?.beforeImageUrl && !data?.afterImageUrl) return null

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 text-center"
          >
            {title && <h2 className="font-headline font-bold uppercase text-ink-900 text-4xl md:text-5xl">{title}</h2>}
            {subtitle && <p className="mt-3 font-body text-sm text-ink-500">{subtitle}</p>}
            <div className="mx-auto mt-4 h-px w-16 bg-camel-500/50" />
          </motion.div>
        )}

        <div
          ref={containerRef}
          className="relative overflow-hidden select-none cursor-col-resize"
          style={{ aspectRatio: '16/9' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* After image (full) */}
          {data?.afterImageUrl && (
            <Image
              src={data.afterImageUrl}
              alt={data?.afterImageAlt ?? afterLabel}
              fill
              className="object-cover pointer-events-none"
              draggable={false}
            />
          )}

          {/* Before image (clipped) */}
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
            {data?.beforeImageUrl && (
              <div className="relative w-full h-full" style={{ width: `${100 / (position / 100)}%` }}>
                <Image
                  src={data.beforeImageUrl}
                  alt={data?.beforeImageAlt ?? beforeLabel}
                  fill
                  className="object-cover pointer-events-none"
                  draggable={false}
                />
              </div>
            )}
          </div>

          {/* Divider line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
            style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
          >
            {/* Handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xl">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-700">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-700">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <span className="absolute left-3 bottom-3 bg-black/60 px-2.5 py-1 font-body text-xs font-semibold uppercase tracking-widest text-white pointer-events-none">
            {beforeLabel}
          </span>
          <span className="absolute right-3 bottom-3 bg-black/60 px-2.5 py-1 font-body text-xs font-semibold uppercase tracking-widest text-white pointer-events-none">
            {afterLabel}
          </span>
        </div>
      </div>
    </motion.section>
  )
}
