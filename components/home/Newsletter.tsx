'use client'

import { useState, useRef, FormEvent } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NewsletterSectionBlock } from '@/lib/types'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const PERKS = ['Early access to new collections', 'Exclusive member-only offers', 'Rare fragrance stories & guides']

interface NewsletterProps {
  data?: NewsletterSectionBlock
}

export default function Newsletter({ data }: NewsletterProps = {}) {
  const headline = data?.headline ?? 'Join The Inner Circle'
  const subtext = data?.subtext ?? 'Be the first to discover new collections, exclusive launches, and the rare stories behind each fragrance.'
  const buttonLabel = data?.buttonLabel ?? 'Subscribe'
  const bgImageUrl = data?.bgImageUrl
  const safeBgImageUrl = bgImageUrl && (bgImageUrl.startsWith('http://') || bgImageUrl.startsWith('https://') || bgImageUrl.startsWith('/'))
    ? bgImageUrl
    : undefined

  const contentRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [inputFocused, setInputFocused] = useState(false)
  const [hasError, setHasError] = useState(false)

  const isInView = useInView(contentRef, { once: true, margin: '-100px' })

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setHasError(true)
      toast.error('Please enter a valid email address.')
      inputRef.current?.focus()
      return
    }

    setHasError(false)
    setStatus('loading')

    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 1200))
      setStatus('success')
      setEmail('')
      toast.success('Welcome to the Inner Circle', {
        description: "You'll be the first to know about new collections and exclusive offers.",
        duration: 5000,
      })
    } catch {
      setStatus('idle')
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <section
      className="relative overflow-hidden bg-charcoal-900"
      style={safeBgImageUrl ? { backgroundImage: `url(${safeBgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {/* Left decorative panel */}
      <div className="absolute inset-y-0 left-0 w-1/3 bg-charcoal-950 hidden lg:block" />
      {/* Gold accent line */}
      <div className="absolute inset-y-0 left-1/3 w-px bg-gradient-to-b from-transparent via-gold-500/30 to-transparent hidden lg:block" />

      {/* Dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(217,154,27,1) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: brand statement */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center py-20 lg:py-28 lg:pr-16"
          >
            <p className="mb-4 font-body text-xs uppercase tracking-[0.35em] text-gold-500">
              Exclusive Access
            </p>
            <h2 className="font-display text-4xl font-light leading-tight text-cream-100 md:text-5xl">
              {headline === 'Join The Inner Circle' ? (
                <>Join The <span className="italic text-gold-400">Inner Circle</span></>
              ) : (
                headline
              )}
            </h2>
            <div className="mt-8 h-px w-16 bg-gold-500/40" />
            <ul className="mt-8 space-y-4">
              {PERKS.map((perk, i) => (
                <motion.li
                  key={perk}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                  className="flex items-center gap-3 font-body text-sm font-light text-charcoal-300"
                >
                  <span className="h-px w-5 flex-shrink-0 bg-gold-500/60" />
                  {perk}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right: form */}
          <motion.div
            ref={contentRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="flex flex-col justify-center py-20 lg:py-28 lg:pl-16 border-t border-charcoal-800 lg:border-t-0 lg:border-l lg:border-charcoal-800"
          >
            <motion.p
              variants={itemVariants}
              className="mb-3 font-body text-sm font-light leading-relaxed text-charcoal-400"
            >
              {subtext}
            </motion.p>

            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              noValidate
              className="mt-8"
            >
              {/* Input */}
              <div
                className={cn(
                  'relative border-b transition-colors duration-300',
                  hasError
                    ? 'border-red-400'
                    : inputFocused
                    ? 'border-gold-500'
                    : 'border-charcoal-700'
                )}
              >
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (hasError) setHasError(false)
                  }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder="Your email address"
                  disabled={status === 'loading' || status === 'success'}
                  aria-label="Email address"
                  className={cn(
                    'w-full bg-transparent py-3.5 pr-4 font-body text-sm text-cream-100 outline-none',
                    'placeholder:text-charcoal-600',
                    'disabled:opacity-50'
                  )}
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-px bg-gold-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: inputFocused ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ originX: 0 }}
                />
              </div>

              <AnimatePresence>
                {hasError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="mt-1.5 font-body text-xs text-red-400"
                  >
                    Please enter a valid email address.
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                whileHover={{ scale: status === 'idle' ? 1.02 : 1 }}
                whileTap={{ scale: status === 'idle' ? 0.98 : 1 }}
                className={cn(
                  'mt-6 flex w-full items-center justify-center gap-2 py-4',
                  'font-body text-sm font-medium uppercase tracking-[0.18em]',
                  'transition-all duration-300',
                  status === 'success'
                    ? 'bg-charcoal-800 text-gold-400 cursor-default'
                    : 'bg-gold-500 text-charcoal-950 hover:bg-gold-400',
                  'disabled:cursor-not-allowed disabled:opacity-70'
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {status === 'loading' ? (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Subscribing…
                    </motion.span>
                  ) : status === 'success' ? (
                    <motion.span key="success" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      Welcome to the Inner Circle
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      {buttonLabel}
                      <ArrowRight size={14} strokeWidth={1.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.form>

            <motion.p
              variants={itemVariants}
              className="mt-5 font-body text-[11px] font-light leading-relaxed text-charcoal-600"
            >
              We respect your privacy. Unsubscribe at any time. By subscribing you agree to our{' '}
              <a href="/privacy" className="text-charcoal-500 underline underline-offset-2 transition-colors hover:text-charcoal-300">
                Privacy Policy
              </a>
              .
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
