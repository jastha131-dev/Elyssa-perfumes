'use client'

import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gold-500 text-white hover:bg-gold-600 active:bg-gold-700 border border-gold-500 hover:border-gold-600 focus-visible:ring-gold-500',
  secondary:
    'bg-charcoal-900 text-white hover:bg-charcoal-800 active:bg-charcoal-700 border border-charcoal-900 hover:border-charcoal-800 focus-visible:ring-charcoal-700',
  ghost:
    'bg-transparent text-charcoal-900 hover:text-gold-500 border border-transparent hover:border-transparent underline-offset-4 hover:underline focus-visible:ring-charcoal-400',
  outline:
    'bg-transparent text-gold-500 hover:bg-gold-50 active:bg-gold-100 border border-gold-500 hover:border-gold-600 focus-visible:ring-gold-500',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-4 text-xs tracking-[0.1em]',
  md: 'h-11 px-6 text-sm tracking-[0.1em]',
  lg: 'h-14 px-8 text-base tracking-[0.12em]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'font-body font-medium uppercase',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'select-none cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && (
          <Loader2
            className="animate-spin shrink-0"
            size={size === 'sm' ? 12 : size === 'md' ? 14 : 16}
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
