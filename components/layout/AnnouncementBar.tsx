'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import type { AnnouncementBar as AnnouncementBarType } from '@/lib/types'

const SESSION_KEY = 'luxe-announcement-dismissed'

interface Props { data: AnnouncementBarType }

export default function AnnouncementBar({ data }: Props) {
  const locale = useLocale()
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      if (sessionStorage.getItem(SESSION_KEY) === data._id) setDismissed(true)
    } catch { /* SSR or private mode */ }
  }, [data._id])

  if (!data.isEnabled || !mounted || dismissed) return null

  const text = locale === 'ar' ? data.text_ar : data.text_en
  const linkLabel = locale === 'ar' ? data.linkLabel_ar : data.linkLabel_en
  if (!text) return null

  const bgStyle = data.bgColor === 'custom' && data.customBgColor
    ? { backgroundColor: data.customBgColor }
    : undefined

  const bgClass = {
    gold: 'bg-camel-500',
    black: 'bg-ink-900',
    cream: 'bg-stone-100',
    custom: '',
  }[data.bgColor ?? 'gold'] ?? 'bg-camel-500'

  const textClass = data.textColor === 'light' ? 'text-white' : 'text-ink-900'

  const handleDismiss = () => {
    setDismissed(true)
    try { sessionStorage.setItem(SESSION_KEY, data._id) } catch { /* noop */ }
  }

  return (
    <div
      className={cn('relative flex items-center justify-center px-10 py-2.5 text-center', bgClass, textClass)}
      style={bgStyle}
    >
      <p className="font-body text-xs font-medium tracking-wide">
        {text}
        {data.link && linkLabel && (
          <>
            {' '}
            <Link href={data.link} className="underline underline-offset-2 hover:opacity-75 transition-opacity">
              {linkLabel}
            </Link>
          </>
        )}
      </p>
      {data.dismissible && (
        <button
          onClick={handleDismiss}
          className={cn('absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:opacity-75 transition-opacity', textClass)}
          aria-label="Dismiss announcement"
        >
          <X size={13} strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
