'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  const getLocalePath = (targetLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = targetLocale
    return segments.join('/')
  }

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <Link
        href={getLocalePath('en')}
        className={`px-2 py-1 transition-colors ${
          locale === 'en'
            ? 'text-camel-600 font-semibold'
            : 'text-charcoal-500 hover:text-charcoal-900'
        }`}
        aria-label="Switch to English"
      >
        EN
      </Link>
      <span className="text-charcoal-300">|</span>
      <Link
        href={getLocalePath('ar')}
        className={`px-2 py-1 transition-colors ${
          locale === 'ar'
            ? 'text-camel-600 font-semibold'
            : 'text-charcoal-500 hover:text-charcoal-900'
        }`}
        aria-label="Switch to Arabic"
      >
        ع
      </Link>
    </div>
  )
}
