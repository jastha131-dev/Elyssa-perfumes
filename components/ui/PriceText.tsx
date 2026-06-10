'use client'

import { useCurrencyStore } from '@/lib/store/currency-store'
import { DirhamSymbol } from './DirhamSymbol'

interface Props {
  amount: number
  className?: string
  symbolSize?: number
}

export function PriceText({ amount, className = '', symbolSize }: Props) {
  const { selected, currencies, format } = useCurrencyStore()
  const cur = currencies.find((c) => c.code === selected)

  if (cur?.code !== 'AED') {
    return <span className={className}>{format(amount)}</span>
  }

  const converted = amount * cur.rate
  const formatted = converted.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      <DirhamSymbol size={symbolSize} />
      {formatted}
    </span>
  )
}
