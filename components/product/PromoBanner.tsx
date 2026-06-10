'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'

export interface PromoBannerData {
  isEnabled?: boolean
  headline_en?: string
  headline_ar?: string
  subtitle_en?: string
  subtitle_ar?: string
  imageUrl?: string
  countdownEndDate?: string
  minOrderAmount?: number
}

function useCountdown(endDate: string | undefined) {
  const calc = () => {
    if (!endDate) return { days: 0, hours: 0, mins: 0, secs: 0, expired: true }
    const diff = new Date(endDate).getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, expired: true }
    return {
      days:  Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins:  Math.floor((diff % 3600000) / 60000),
      secs:  Math.floor((diff % 60000) / 1000),
      expired: false,
    }
  }

  const [state, setState] = useState(calc)

  useEffect(() => {
    if (!endDate) return
    const id = setInterval(() => setState(calc()), 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate])

  return state
}

export function PromoBanner({ data }: { data: PromoBannerData }) {
  const locale  = useLocale()
  const isAr    = locale === 'ar'
  const { days, hours, mins, secs, expired } = useCountdown(data.countdownEndDate)

  if (!data.isEnabled || expired) return null

  const headline = isAr ? data.headline_ar : data.headline_en
  const subtitle  = isAr ? data.subtitle_ar  : data.subtitle_en

  const units = [
    { v: days,  l: 'DAYS' },
    { v: hours, l: 'HRS'  },
    { v: mins,  l: 'MIN'  },
    { v: secs,  l: 'SEC'  },
  ]

  return (
    <div className="flex items-center gap-3 rounded-xl bg-camel-50 border border-camel-100 px-3 py-3 my-3">

      {/* Gift image */}
      {data.imageUrl && (
        <div className="relative h-[68px] w-[68px] flex-shrink-0 overflow-hidden rounded-lg bg-white shadow-sm">
          <Image
            src={data.imageUrl}
            alt={headline ?? 'Promotion'}
            fill
            className="object-contain p-1.5"
            sizes="68px"
          />
        </div>
      )}

      {/* Text */}
      <div className="flex-1 min-w-0">
        {headline && (
          <p className="font-headline text-[13px] font-bold uppercase tracking-[0.06em] text-charcoal-900 leading-tight">
            {headline}
          </p>
        )}
        {subtitle && (
          <p className="font-body text-[10px] uppercase tracking-[0.18em] text-charcoal-500 mt-0.5 leading-tight">
            {subtitle}
          </p>
        )}
      </div>

      {/* Countdown */}
      {data.countdownEndDate && (
        <div className="flex-shrink-0 border-2 border-camel-400 rounded-xl px-2.5 py-2">
          <div className="flex items-center gap-1">
            {units.map(({ v, l }, i) => (
              <div key={l} className="flex items-center gap-1">
                {i > 0 && (
                  <span className="font-headline text-sm font-bold text-camel-500 pb-3 leading-none">:</span>
                )}
                <div className="text-center w-[28px]">
                  <p className="font-headline text-sm font-bold text-charcoal-900 leading-none tabular-nums">
                    {String(v).padStart(2, '0')}
                  </p>
                  <p className="font-body text-[7px] uppercase tracking-[0.08em] text-charcoal-400 mt-1">
                    {l}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
