import { useCurrencyStore } from '@/lib/store/currency-store'

export function useCurrencyFormat() {
  const { format, convert, selected } = useCurrencyStore()
  return { format, convert, currency: selected }
}
