'use client'

import { useEffect } from 'react'
import { useCurrencyStore, CurrencyConfig } from '@/lib/store/currency-store'

interface Props {
  currencies: CurrencyConfig[]
  defaultCurrency: string
}

export default function CurrencyProvider({ currencies, defaultCurrency }: Props) {
  const { setCurrencies, setSelected } = useCurrencyStore()

  useEffect(() => {
    if (currencies.length > 0) setCurrencies(currencies)
  }, [currencies, setCurrencies])

  useEffect(() => {
    // Only auto-detect on first load (no stored preference)
    const stored = localStorage.getItem('luxe-currency')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { state?: { selected?: string } }
        if (parsed.state?.selected) return
      } catch { /* ignore */ }
    }
    // Auto-detect from browser locale
    const detected = detectLocaleCurrency()
    const available = currencies.map((c) => c.code)
    setSelected(available.includes(detected) ? detected : (defaultCurrency || 'USD'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

function detectLocaleCurrency(): string {
  if (typeof navigator === 'undefined') return 'USD'
  const lang = navigator.language || ''
  if (lang.includes('AE') || lang.startsWith('ar')) return 'AED'
  if (lang.includes('IN') || lang.startsWith('hi')) return 'INR'
  return 'USD'
}
