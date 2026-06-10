'use client'

import { useEffect } from 'react'
import { useCurrencyStore, CurrencyConfig } from '@/lib/store/currency-store'

interface Props {
  currencies: CurrencyConfig[]
  defaultCurrency: string
}

const SESSION_KEY = 'luxe-detected-currency'

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  AE: 'AED', SA: 'AED', KW: 'AED', BH: 'AED', OM: 'AED', QA: 'AED',
  IN: 'INR',
}

async function fetchCountryCode(): Promise<string | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)

  // Race 3 independent APIs — first to respond wins
  const apis: Array<() => Promise<string | null>> = [
    async () => {
      const r = await fetch('https://ipapi.co/json/', { signal: controller.signal })
      const d = await r.json() as { country_code?: string }
      return d.country_code ?? null
    },
    async () => {
      const r = await fetch('https://ipinfo.io/json', { signal: controller.signal })
      const d = await r.json() as { country?: string }
      return d.country ?? null
    },
    async () => {
      const r = await fetch('https://api.country.is/', { signal: controller.signal })
      const d = await r.json() as { country?: string }
      return d.country ?? null
    },
  ]

  try {
    const code = await Promise.any(apis.map((fn) => fn().then((c) => {
      if (!c) throw new Error('no country')
      return c
    })))
    clearTimeout(timer)
    controller.abort()
    return code
  } catch {
    clearTimeout(timer)
    return null
  }
}

async function detectCurrencyFromIP(available: string[], fallback: string): Promise<string> {
  // Use session cache to avoid repeated API calls
  try {
    const cached = sessionStorage.getItem(SESSION_KEY)
    if (cached && available.includes(cached)) return cached
  } catch { /* private mode */ }

  const countryCode = await fetchCountryCode()
  const currency = countryCode ? (COUNTRY_TO_CURRENCY[countryCode] ?? fallback) : fallback
  const result = available.includes(currency) ? currency : fallback

  try { sessionStorage.setItem(SESSION_KEY, result) } catch { /* ignore */ }
  return result
}

export default function CurrencyProvider({ currencies, defaultCurrency }: Props) {
  const { setCurrencies, setSelected } = useCurrencyStore()

  useEffect(() => {
    if (currencies.length > 0) setCurrencies(currencies)
  }, [currencies, setCurrencies])

  useEffect(() => {
    const available = currencies.map((c) => c.code)
    const fallback = available.includes(defaultCurrency) ? defaultCurrency : (available[0] ?? 'USD')
    detectCurrencyFromIP(available, fallback).then(setSelected)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
