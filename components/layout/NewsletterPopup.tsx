'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { PopupSettings } from '@/lib/types'

const STORAGE_KEY = 'luxe_popup'
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

function shouldShow(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return true
    const data = JSON.parse(raw)
    if (data.subscribed) return false
    if (data.dismissedAt && Date.now() - data.dismissedAt < DISMISS_TTL_MS) return false
    return true
  } catch {
    return true
  }
}

interface NewsletterPopupProps {
  settings: PopupSettings | null
}

export default function NewsletterPopup({ settings }: NewsletterPopupProps) {
  const locale = useLocale()
  const isAr = locale === 'ar'
  const { data: session, status: sessionStatus } = useSession()

  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [nationality, setNationality] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!settings?.isEnabled) return
    if (sessionStatus === 'loading') return
    if (session?.user) return
    if (!shouldShow()) return

    const delay = (settings.delaySeconds ?? 2) * 1000
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [settings, session, sessionStatus])

  useEffect(() => {
    if (!visible) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleDismiss()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [visible])

  function handleDismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ dismissedAt: Date.now() }))
    } catch {}
    setVisible(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !email.includes('@')) {
      setError(isAr ? 'البريد الإلكتروني مطلوب' : 'A valid email is required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/newsletter-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, nationality, dateOfBirth, locale }),
      })
      if (!res.ok) throw new Error('Failed')
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ subscribed: true }))
      toast.success(isAr ? 'شكراً! تم تسجيلك بنجاح.' : 'You\'re in! Welcome to the family.')
      setVisible(false)
    } catch {
      setError(isAr ? 'حدث خطأ. يرجى المحاولة مجدداً.' : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const headline = isAr ? settings?.headline_ar || settings?.headline_en : settings?.headline_en
  const subtext = isAr ? settings?.subtext_ar || settings?.subtext_en : settings?.subtext_en
  const ctaLabel = isAr ? settings?.ctaLabel_ar || settings?.ctaLabel_en : settings?.ctaLabel_en

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            key="popup-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={headline || 'Newsletter signup'}
              className="relative flex w-full max-w-[580px] overflow-hidden rounded-lg bg-white shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left panel — image */}
              {settings?.imageUrl && (
                <div className="relative hidden w-[220px] shrink-0 sm:block">
                  <Image
                    src={settings.imageUrl}
                    alt={headline || 'Promotion'}
                    fill
                    className="object-cover"
                    sizes="220px"
                  />
                  {/* Gradient overlay + text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  {headline && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="font-display text-sm font-medium uppercase tracking-wider leading-snug">
                        {headline}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Right panel — form */}
              <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Close */}
                <button
                  onClick={handleDismiss}
                  className="absolute right-3 top-3 flex items-center gap-1 text-xs text-charcoal-400 hover:text-charcoal-900 transition-colors"
                  aria-label="Close popup"
                >
                  <X size={14} />
                  <span>{isAr ? 'إغلاق' : 'Close'}</span>
                </button>

                {/* Headline */}
                {headline && (
                  <h2 className="font-display text-2xl font-bold uppercase leading-tight text-charcoal-900 pr-8">
                    {headline}
                  </h2>
                )}

                {/* Subtext */}
                {subtext && (
                  <p className="text-sm text-charcoal-500">{subtext}</p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  {/* Email */}
                  <input
                    type="email"
                    placeholder={isAr ? 'البريد الإلكتروني' : 'Email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded border border-charcoal-200 px-3 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-charcoal-400 focus:outline-none"
                  />

                  {/* Phone with UAE prefix */}
                  <div className="flex overflow-hidden rounded border border-charcoal-200 focus-within:border-charcoal-400">
                    <span className="flex items-center gap-1.5 border-r border-charcoal-200 bg-charcoal-50 px-3 text-sm text-charcoal-600 shrink-0">
                      🇦🇪 +971
                    </span>
                    <input
                      type="tel"
                      placeholder={isAr ? 'رقم الهاتف' : 'Phone Number'}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 px-3 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none bg-white"
                    />
                  </div>

                  {/* Nationality + DOB row */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={isAr ? 'الجنسية' : 'Nationality'}
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="w-1/2 rounded border border-charcoal-200 px-3 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-charcoal-400 focus:outline-none"
                    />
                    <input
                      type="date"
                      placeholder={isAr ? 'تاريخ الميلاد' : 'Date of Birth'}
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-1/2 rounded border border-charcoal-200 px-3 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:border-charcoal-400 focus:outline-none"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-xs text-red-500">{error}</p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded bg-charcoal-900 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-charcoal-700 disabled:opacity-50"
                  >
                    {loading ? '...' : (ctaLabel || 'continue')}
                  </button>
                </form>

                {/* Disclaimer */}
                <p className="text-center text-[11px] text-charcoal-400">
                  {isAr
                    ? 'بالتسجيل، أنت توافق على تلقي رسائل تسويقية عبر البريد الإلكتروني'
                    : 'By signing up, you agree to receive email marketing'}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
