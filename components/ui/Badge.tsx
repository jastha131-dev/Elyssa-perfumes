'use client'

import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'new' | 'bestseller' | 'sale' | 'default'
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  new: 'bg-gold-500 text-white border-transparent',
  bestseller: 'bg-charcoal-900 text-cream-100 border-transparent',
  sale: 'bg-red-600 text-white border-transparent',
  default: 'bg-transparent text-charcoal-700 border-charcoal-300',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2 py-0.5',
        'text-[10px] font-semibold tracking-[0.12em] uppercase',
        'border rounded-none leading-none',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
