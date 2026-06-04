'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // clipboard API unavailable — user can select text manually
    }
  }

  return (
    <div className="flex items-center justify-between rounded-xl bg-cream-50 border border-charcoal-100 px-5 py-4">
      <span className="font-mono text-xl font-semibold tracking-widest text-charcoal-900 select-all">
        {code}
      </span>
      <button
        onClick={handleCopy}
        aria-label="Copy gift card code"
        className="ml-4 flex items-center gap-1.5 rounded-lg bg-gold-500 px-3 py-1.5 font-body text-xs font-semibold text-white transition-all hover:bg-gold-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
      >
        {copied ? (
          <>
            <Check size={12} /> Copied
          </>
        ) : (
          <>
            <Copy size={12} /> Copy
          </>
        )}
      </button>
    </div>
  )
}
