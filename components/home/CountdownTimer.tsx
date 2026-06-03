'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import type { CountdownTimerSectionBlock } from '@/lib/types'

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }

function calcTimeLeft(endDate: string): TimeLeft | null {
  const diff = new Date(endDate).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

interface Props { data: CountdownTimerSectionBlock }

export default function CountdownTimer({ data }: Props) {
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!data?.endDate) return
    setTimeLeft(calcTimeLeft(data.endDate))
    const id = setInterval(() => setTimeLeft(calcTimeLeft(data.endDate!)), 1000)
    return () => clearInterval(id)
  }, [data?.endDate])

  const headline = locale === 'ar' ? data?.headline_ar : data?.headline_en
  const subtext = locale === 'ar' ? data?.subtext_ar : data?.subtext_en
  const expiredText = locale === 'ar' ? data?.expiredText_ar : data?.expiredText_en
  const ctaLabel = locale === 'ar' ? data?.cta?.label_ar : data?.cta?.label_en
  const style = data?.style ?? 'minimal'

  const isFullBleed = style === 'full-bleed'
  const isCard = style === 'card'

  const units = timeLeft
    ? [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds },
      ]
    : []

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn('text-center', isFullBleed && 'relative z-10')}
    >
      {headline && (
        <h2 className={cn('font-headline font-bold uppercase text-3xl md:text-4xl lg:text-5xl', isFullBleed ? 'text-white' : 'text-ink-900')}>
          {headline}
        </h2>
      )}
      {subtext && (
        <p className={cn('mt-3 font-body text-sm', isFullBleed ? 'text-white/70' : 'text-ink-500')}>{subtext}</p>
      )}

      {mounted && (
        <div className="mt-10 flex items-center justify-center gap-2.5 sm:gap-4 md:gap-5">
          {timeLeft ? units.map(({ label, value }, i) => (
            <div key={label} className="flex items-center gap-2.5 sm:gap-4 md:gap-5">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'relative flex h-[66px] w-[62px] items-center justify-center overflow-hidden rounded-2xl sm:h-20 sm:w-[72px] md:h-28 md:w-[104px]',
                  isFullBleed
                    ? 'bg-white/10 ring-1 ring-white/15 backdrop-blur-md'
                    : 'bg-gradient-to-b from-ink-900 to-ink-800 shadow-[0_16px_44px_-18px_rgba(0,0,0,0.55)] ring-1 ring-white/5'
                )}>
                  <AnimatePresence initial={false}>
                    <motion.span
                      key={value}
                      initial={{ y: '-100%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      exit={{ y: '100%', opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 flex items-center justify-center font-headline text-3xl font-bold tabular-nums text-white sm:text-4xl md:text-6xl"
                    >
                      {String(value).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                  <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/30" />
                </div>
                <span className={cn('mt-3 font-body text-[9px] uppercase tracking-[0.2em] sm:text-[10px]', isFullBleed ? 'text-white/60' : 'text-camel-600')}>
                  {label}
                </span>
              </div>
              {i < units.length - 1 && (
                <span className={cn('-mt-6 font-headline text-2xl font-light sm:text-3xl md:text-4xl', isFullBleed ? 'text-white/25' : 'text-camel-400/50')}>:</span>
              )}
            </div>
          )) : (
            <p className={cn('font-body text-sm', isFullBleed ? 'text-white/70' : 'text-ink-500')}>
              {expiredText ?? 'Offer has ended'}
            </p>
          )}
        </div>
      )}

      {data?.cta?.link && ctaLabel && timeLeft && (
        <div className="mt-8">
          <Link
            href={data.cta.link}
            className={cn(
              'inline-flex items-center gap-2.5 px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] transition-colors',
              isFullBleed
                ? 'bg-white text-ink-900 hover:bg-stone-100'
                : 'bg-camel-500 text-white hover:bg-camel-600'
            )}
          >
            {ctaLabel}
            <ArrowRight size={11} strokeWidth={2.5} />
          </Link>
        </div>
      )}
    </motion.div>
  )

  if (isFullBleed) {
    return (
      <section ref={ref} className="relative overflow-hidden">
        {data?.bgImageUrl && (
          <Image src={data.bgImageUrl} alt="" fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-ink-900/70" />
        <div className="relative z-10 py-24 px-6 text-center">{content}</div>
      </section>
    )
  }

  if (isCard) {
    return (
      <section ref={ref} className="bg-gradient-to-b from-stone-50 to-white py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="relative overflow-hidden rounded-[28px] border border-camel-500/15 bg-gradient-to-b from-white via-white to-stone-50/60 p-10 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.35)] md:p-16">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-camel-400/15 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-camel-500/60 to-transparent" />
            <div className="relative">{content}</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">{content}</div>
    </section>
  )
}
