import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CurrencyConfig {
  code: string
  symbol: string
  rate: number
  position?: 'before' | 'after'
}

interface CurrencyState {
  selected: string
  currencies: CurrencyConfig[]
  setSelected: (code: string) => void
  setCurrencies: (currencies: CurrencyConfig[]) => void
  format: (usdAmount: number) => string
  convert: (usdAmount: number) => number
}

function buildFormat(currencies: CurrencyConfig[], selected: string) {
  return (usdAmount: number): string => {
    const cur = currencies.find((c) => c.code === selected) ?? { code: 'USD', symbol: '$', rate: 1, position: 'before' as const }
    const converted = usdAmount * cur.rate
    const decimals = cur.code === 'INR' ? 0 : 2
    const formatted = converted.toLocaleString('en', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    const sep = cur.symbol.length > 1 ? ' ' : ''
    return cur.position === 'after'
      ? `${formatted}${sep}${cur.symbol}`
      : `${cur.symbol}${sep}${formatted}`
  }
}

function buildConvert(currencies: CurrencyConfig[], selected: string) {
  return (usdAmount: number): number => {
    const cur = currencies.find((c) => c.code === selected)
    return cur ? usdAmount * cur.rate : usdAmount
  }
}

function getStoredCurrency(): string {
  if (typeof window === 'undefined') return 'USD'
  try {
    const v = sessionStorage.getItem('luxe-detected-currency')
    if (v) return v
  } catch { /* ignore */ }
  return 'USD'
}

const DEFAULT_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', rate: 1, position: 'before' },
  { code: 'AED', symbol: 'AED', rate: 3.67, position: 'before' },
  { code: 'INR', symbol: '₹', rate: 83.5, position: 'before' },
]

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => {
      const initialSelected = getStoredCurrency()
      const initialCurrencies = DEFAULT_CURRENCIES
      return {
        selected: initialSelected,
        currencies: initialCurrencies,
        format: buildFormat(initialCurrencies, initialSelected),
        convert: buildConvert(initialCurrencies, initialSelected),

        setSelected: (code) =>
          set((state) => ({
            selected: code,
            format: buildFormat(state.currencies, code),
            convert: buildConvert(state.currencies, code),
          })),

        setCurrencies: (currencies) =>
          set((state) => ({
            currencies,
            format: buildFormat(currencies, state.selected),
            convert: buildConvert(currencies, state.selected),
          })),
      }
    },
    {
      name: 'luxe-currency-v2',
      partialize: (s) => ({ currencies: s.currencies }),
    }
  )
)
