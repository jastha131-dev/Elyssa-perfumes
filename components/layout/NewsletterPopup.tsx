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
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000

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
    if (settings && !settings.isEnabled) return
    if (sessionStatus === 'loading') return
    if (session?.user) return
    if (!shouldShow()) return

    const delay = (settings?.delaySeconds ?? 2) * 1000
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
      toast.success(isAr ? 'شكراً! تم تسجيلك بنجاح.' : "You're in! Welcome to the family.")
      setVisible(false)
    } catch {
      setError(isAr ? 'حدث خطأ. يرجى المحاولة مجدداً.' : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const headline =
    (isAr ? settings?.headline_ar || settings?.headline_en : settings?.headline_en) ??
    (isAr ? 'اكتشفي عطرك المثالي' : 'Discover Your Signature Scent')

  const subtext =
    (isAr ? settings?.subtext_ar || settings?.subtext_en : settings?.subtext_en) ??
    (isAr
      ? 'انضمي إلى عائلة لوكس بارفيوم واستمتعي بعروض حصرية.'
      : 'Join the Luxe Parfum family and enjoy exclusive offers, early access to new arrivals, and curated fragrance recommendations.')

  const ctaLabel =
    (isAr ? settings?.ctaLabel_ar || settings?.ctaLabel_en : settings?.ctaLabel_en) ??
    (isAr ? 'احصلي على وصول مبكر' : 'Get Early Access')

  const imageUrl = settings?.imageUrl ?? '/images/categories/I1.webp'

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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            key="popup-modal"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={headline}
              className="relative flex w-full max-w-[620px] overflow-hidden rounded-2xl shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Left panel — image ── */}
              <div className="relative hidden w-[230px] shrink-0 sm:block">
                <Image
                  src={imageUrl}
                  alt={headline}
                  fill
                  className="object-cover object-center"
                  sizes="230px"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {/* Brand badge — top */}
                <div className="absolute top-5 left-0 right-0 flex justify-center">
                  <span className="rounded-full border border-white/30 bg-black/30 px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.35em] text-white/80 backdrop-blur-sm">
                    Luxe Parfum
                  </span>
                </div>
                {/* Bottom copy */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="mb-2 h-px w-8 bg-camel-400/70" />
                  <p className="font-display text-[13px] font-light italic leading-snug text-white/90">
                    {isAr ? 'عطور نادرة\nللروح المميّزة' : 'Rare fragrances\nfor the discerning soul'}
                  </p>
                </div>
              </div>

              {/* ── Right panel — form ── */}
              <div className="flex flex-1 flex-col bg-stone-50">

                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-camel-400 via-camel-500 to-camel-300" />

                <div className="flex flex-1 flex-col gap-5 px-7 py-6">

                  {/* Close */}
                  <button
                    onClick={handleDismiss}
                    className="absolute right-4 top-3 flex items-center gap-1 text-[11px] text-charcoal-400 hover:text-charcoal-800 transition-colors"
                    aria-label="Close popup"
                  >
                    <X size={13} />
                    <span>{isAr ? 'إغلاق' : 'Close'}</span>
                  </button>

                  {/* Eyebrow */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="h-px flex-1 bg-camel-200" />
                    <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-camel-500">
                      {isAr ? 'عرض حصري' : 'Exclusive Offer'}
                    </p>
                    <div className="h-px flex-1 bg-camel-200" />
                  </div>

                  {/* Headline */}
                  <div>
                    <h2 className="font-display text-[22px] font-light leading-snug text-charcoal-900">
                      {headline.split(' ').length > 3
                        ? <>
                            {headline.split(' ').slice(0, Math.ceil(headline.split(' ').length / 2)).join(' ')}<br />
                            <em className="font-light italic text-camel-600">
                              {headline.split(' ').slice(Math.ceil(headline.split(' ').length / 2)).join(' ')}
                            </em>
                          </>
                        : <><em className="font-light italic text-camel-600">{headline}</em></>
                      }
                    </h2>
                    {subtext && (
                      <p className="mt-2 text-[12px] font-light leading-relaxed text-charcoal-500">
                        {subtext}
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                    {/* Email */}
                    <div>
                      <label className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.3em] text-charcoal-400">
                        {isAr ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-camel-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder={isAr ? 'you@example.com' : 'you@example.com'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-300 focus:border-camel-400 focus:outline-none focus:ring-2 focus:ring-camel-100 transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.3em] text-charcoal-400">
                        {isAr ? 'رقم الهاتف' : 'Phone Number'}
                      </label>
                      <div className="flex overflow-hidden rounded-lg border border-stone-200 bg-white focus-within:border-camel-400 focus-within:ring-2 focus-within:ring-camel-100 transition-all">
                        <span className="flex items-center gap-1.5 border-r border-stone-200 bg-stone-100 px-3 text-sm text-charcoal-600 shrink-0">
                          🇦🇪 +971
                        </span>
                        <input
                          type="tel"
                          placeholder={isAr ? 'رقم الهاتف' : '50 000 0000'}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="flex-1 px-3 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-300 focus:outline-none bg-white"
                        />
                      </div>
                    </div>

                    {/* Nationality + DOB */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.3em] text-charcoal-400">
                          {isAr ? 'الجنسية' : 'Nationality'}
                        </label>
                        <input
                          type="text"
                          placeholder={isAr ? 'الجنسية' : 'e.g. Emirati'}
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
                          className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-300 focus:border-camel-400 focus:outline-none focus:ring-2 focus:ring-camel-100 transition-all"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.3em] text-charcoal-400">
                          {isAr ? 'تاريخ الميلاد' : 'Date of Birth'}
                        </label>
                        <input
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-charcoal-900 placeholder:text-charcoal-300 focus:border-camel-400 focus:outline-none focus:ring-2 focus:ring-camel-100 transition-all"
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-camel-600 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-camel-700 hover:shadow-md disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          {isAr ? 'جاري الإرسال...' : 'Sending…'}
                        </span>
                      ) : ctaLabel}
                    </button>
                  </form>

                  {/* Disclaimer */}
                  <p className="text-center text-[10px] text-charcoal-400">
                    {isAr
                      ? 'بالتسجيل، أنت توافق على تلقي رسائل تسويقية'
                      : 'By signing up, you agree to receive email marketing'}
                  </p>

                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
