'use client'

import { useState, useRef, FormEvent } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
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

interface NewsletterProps {
  data?: NewsletterSectionBlock
}

export default function Newsletter({ data }: NewsletterProps = {}) {
  const t = useTranslations('newsletter')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const PERKS = [t('perk1'), t('perk2'), t('perk3')]

  const headline = (isAr ? data?.headline_ar : data?.headline_en) ?? ''
  const subtext = (isAr ? data?.subtext_ar : data?.subtext_en) ?? ''
  const buttonLabel = (isAr ? data?.buttonLabel_ar : data?.buttonLabel_en) ?? ''

  if (!headline) return null
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
      toast.error(t('invalidEmail'))
      inputRef.current?.focus()
      return
    }

    setHasError(false)
    setStatus('loading')

    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 1200))
      setStatus('success')
      setEmail('')
      toast.success(t('welcomeInnerCircle'), {
        description: t('welcomeToastDesc'),
        duration: 5000,
      })
    } catch {
      setStatus('idle')
      toast.error(t('errorGeneric'))
    }
  }

  return (
    <section
      className="relative overflow-hidden bg-stone-100"
      style={safeBgImageUrl ? { backgroundImage: `url(${safeBgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {/* Light warm overlay when bg image is present */}
      {safeBgImageUrl && (
        <div className="absolute inset-0 bg-stone-100/60" />
      )}

      {/* Left decorative panel */}
      <div className="absolute inset-y-0 left-0 w-1/3 bg-stone-200/60 hidden lg:block" />
      {/* Camel accent line */}
      <div className="absolute inset-y-0 left-1/3 w-px bg-gradient-to-b from-transparent via-camel-400/30 to-transparent hidden lg:block" />

      {/* Dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(180,140,100,1) 1px, transparent 0)`,
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
            <p className="mb-4 font-body text-xs uppercase tracking-[0.35em] text-camel-500">
              {t('exclusiveAccess')}
            </p>
            <h2 className="font-headline font-bold uppercase text-ink-900 leading-tight text-3xl md:text-4xl">
              {headline}
            </h2>
            <div className="mt-8 h-px w-16 bg-camel-400/40" />
            <ul className="mt-8 space-y-4">
              {PERKS.map((perk, i) => (
                <motion.li
                  key={perk}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                  className="flex items-center gap-3 font-body text-sm font-light text-ink-500"
                >
                  <span className="h-px w-5 flex-shrink-0 bg-camel-400/60" />
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
            className="flex flex-col justify-center py-20 lg:py-28 lg:pl-16 border-t border-stone-300 lg:border-t-0 lg:border-l lg:border-stone-300"
          >
            <motion.p
              variants={itemVariants}
              className="mb-3 font-body text-sm font-light leading-relaxed text-ink-500"
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
                  'relative flex items-center border transition-colors duration-300',
                  hasError
                    ? 'border-red-400'
                    : inputFocused
                    ? 'border-camel-400 focus-within:border-camel-400'
                    : 'border-stone-300'
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
                  placeholder={t('placeholder')}
                  disabled={status === 'loading' || status === 'success'}
                  aria-label="Email address"
                  className={cn(
                    'w-full bg-white border-none py-3.5 px-4 font-body text-sm text-ink-800 outline-none',
                    'placeholder:text-ink-300',
                    'disabled:opacity-50'
                  )}
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
                    {t('invalidEmail')}
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
                    ? 'border border-camel-400/30 bg-camel-500/8 text-camel-700 cursor-default'
                    : 'bg-camel-500 text-white hover:bg-camel-600',
                  'disabled:cursor-not-allowed disabled:opacity-70'
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {status === 'loading' ? (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      {t('subscribing')}
                    </motion.span>
                  ) : status === 'success' ? (
                    <motion.span key="success" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      {t('welcomeInnerCircle')}
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
              className="mt-5 font-body text-[11px] font-light leading-relaxed text-ink-400"
            >
              {t('privacyNote')}{' '}
              <a href="/privacy" className="text-ink-400 underline underline-offset-2 transition-colors hover:text-ink-600">
                {t('privacyPolicy')}
              </a>
              .
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
