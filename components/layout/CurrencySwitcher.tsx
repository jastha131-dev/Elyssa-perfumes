'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCurrencyStore } from '@/lib/store/currency-store'

export default function CurrencySwitcher() {
  const { selected, currencies, setSelected } = useCurrencyStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  if (currencies.length <= 1) return null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1 font-body text-xs font-medium transition-colors',
          'text-charcoal-500 hover:text-charcoal-900',
          open && 'text-charcoal-900'
        )}
        aria-label="Switch currency"
      >
        {selected}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown className="h-3 w-3" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-stone-100 bg-white shadow-xl"
          >
            {currencies.map((c) => (
              <button
                key={c.code}
                onClick={() => { setSelected(c.code); setOpen(false) }}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2.5 text-left font-body text-sm transition-colors',
                  selected === c.code
                    ? 'bg-camel-50 font-semibold text-camel-600'
                    : 'text-charcoal-600 hover:bg-stone-50'
                )}
              >
                <span>{c.code}</span>
                <span className="text-charcoal-400 text-xs">{c.symbol}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
