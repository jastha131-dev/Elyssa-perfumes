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

function detectLocaleCurrency(): string {
  if (typeof navigator === 'undefined') return 'USD'
  const lang = navigator.language || ''
  if (lang.includes('AE') || lang.includes('ar-AE')) return 'AED'
  if (lang.includes('IN') || lang.includes('hi')) return 'INR'
  return 'USD'
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      selected: 'USD',
      currencies: [
        { code: 'USD', symbol: '$', rate: 1, position: 'before' },
        { code: 'AED', symbol: 'AED', rate: 3.67, position: 'after' },
        { code: 'INR', symbol: '₹', rate: 83.5, position: 'before' },
      ],

      setSelected: (code) => set({ selected: code }),

      setCurrencies: (currencies) => set({ currencies }),

      convert: (usdAmount) => {
        const { selected, currencies } = get()
        const cur = currencies.find((c) => c.code === selected)
        if (!cur) return usdAmount
        return usdAmount * cur.rate
      },

      format: (usdAmount) => {
        const { selected, currencies } = get()
        const cur = currencies.find((c) => c.code === selected) ?? { code: 'USD', symbol: '$', rate: 1, position: 'before' as const }
        const converted = usdAmount * cur.rate
        const decimals = cur.code === 'INR' ? 0 : cur.code === 'AED' ? 2 : 2
        const formatted = converted.toLocaleString('en', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
        return cur.position === 'after'
          ? `${formatted} ${cur.symbol}`
          : `${cur.symbol}${formatted}`
      },
    }),
    {
      name: 'luxe-currency',
      partialize: (s) => ({ selected: s.selected }),
    }
  )
)

// Re-export detectLocaleCurrency for use in CurrencyProvider
export { detectLocaleCurrency }
