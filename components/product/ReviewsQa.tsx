'use client'

import { useState, useMemo } from 'react'
import { useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ReviewItem {
  _id: string
  name: string
  location?: string
  rating: number
  title?: string
  body: string
  ratingScent?: number
  ratingLongevity?: number
  ratingValue?: number
  verified?: boolean
  createdAt?: string
}

export interface QuestionItem {
  _id: string
  name: string
  question: string
  answer?: string | null
  createdAt?: string
}

interface Props {
  productId: string
  productName: string
  initialReviews: ReviewItem[]
  initialQuestions: QuestionItem[]
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(value) ? 'text-camel-500' : 'text-charcoal-200'}
          fill={i < Math.round(value) ? 'currentColor' : 'none'}
          strokeWidth={i < Math.round(value) ? 0 : 1.5}
        />
      ))}
    </span>
  )
}

export default function ReviewsQa({ productId, productName, initialReviews, initialQuestions }: Props) {
  const locale = useLocale()
  const isAr = locale === 'ar'
  const [tab, setTab] = useState<'reviews' | 'qa'>('reviews')
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews)
  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showQaForm, setShowQaForm] = useState(false)

  const t = (en: string, ar: string) => (isAr ? ar : en)

  const { avg, count, bars } = useMemo(() => {
    const count = reviews.length
    const avg = count ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / count : 0
    const attr = (key: keyof ReviewItem) => {
      const vals = reviews.map((r) => r[key] as number).filter((v) => typeof v === 'number' && v > 0)
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    }
    return {
      avg, count,
      bars: [
        { label: t('Scent', 'الرائحة'), value: attr('ratingScent') },
        { label: t('Longevity', 'الثبات'), value: attr('ratingLongevity') },
        { label: t('Value for Money', 'القيمة مقابل السعر'), value: attr('ratingValue') },
      ].filter((b) => b.value > 0),
    }
  }, [reviews, isAr])

  return (
    <section className="border-t border-charcoal-100 bg-white py-14">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <h2 className="mb-6 text-center font-display text-xl font-semibold uppercase tracking-[0.12em] text-charcoal-900 sm:text-2xl">
          {productName} {t('Reviews', 'التقييمات')}
        </h2>

        {/* Tabs */}
        <div className="mb-8 flex items-center gap-1 border-b border-charcoal-200">
          {([['reviews', `${t('Reviews', 'التقييمات')} (${count})`], ['qa', `${t('Q&A', 'الأسئلة')} (${questions.length})`]] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                'relative -mb-px rounded-t-lg px-5 py-2.5 text-sm font-semibold transition-colors',
                tab === key ? 'bg-camel-500 text-white' : 'text-charcoal-500 hover:text-charcoal-800'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Reviews tab ── */}
        {tab === 'reviews' && (
          <div>
            <div className="flex flex-col items-center gap-6 rounded-2xl bg-stone-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex items-center gap-4">
                <span className="font-display text-5xl font-light text-charcoal-900">{avg.toFixed(1)}</span>
                <div>
                  <Stars value={avg} size={18} />
                  <p className="mt-1 text-xs text-charcoal-500">{count} {t('reviews', 'تقييم')}</p>
                </div>
              </div>

              {bars.length > 0 && (
                <div className="grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-3">
                  {bars.map((b) => (
                    <div key={b.label}>
                      <p className="mb-1 text-[11px] font-medium text-charcoal-600">{b.label}</p>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-charcoal-200">
                        <div className="h-full rounded-full bg-camel-500" style={{ width: `${(b.value / 5) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowReviewForm(true)}
                className="shrink-0 rounded-full bg-charcoal-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-camel-500"
              >
                {t('Write a Review', 'اكتب تقييماً')}
              </button>
            </div>

            {/* Review list */}
            <div className="mt-8 space-y-6">
              {reviews.length === 0 && (
                <p className="py-10 text-center text-sm text-charcoal-400">{t('No reviews yet. Be the first to review this product.', 'لا توجد تقييمات بعد. كن أول من يقيّم هذا المنتج.')}</p>
              )}
              {reviews.map((r) => (
                <div key={r._id} className="border-b border-charcoal-100 pb-6 last:border-0">
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Stars value={r.rating} />
                      {r.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-green-600">
                          <CheckCircle2 size={11} /> {t('Verified', 'موثّق')}
                        </span>
                      )}
                    </div>
                    {r.createdAt && (
                      <span className="text-[11px] text-charcoal-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  {r.title && <p className="mb-1 text-sm font-semibold text-charcoal-900">{r.title}</p>}
                  <p className="text-sm leading-relaxed text-charcoal-600">{r.body}</p>
                  <p className="mt-2 text-xs font-medium text-charcoal-500">
                    {r.name}{r.location ? ` · ${r.location}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Q&A tab ── */}
        {tab === 'qa' && (
          <div>
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-stone-50 p-8 text-center">
              <p className="font-display text-lg text-charcoal-800">{t('Have a question?', 'هل لديك سؤال؟')}</p>
              <p className="text-sm text-charcoal-500">{t('Our team is happy to help.', 'فريقنا سعيد بمساعدتك.')}</p>
              <button
                type="button"
                onClick={() => setShowQaForm(true)}
                className="rounded-full bg-camel-500 px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-camel-600"
              >
                {t('Ask a Question', 'اطرح سؤالاً')}
              </button>
            </div>

            <div className="mt-8 space-y-6">
              {questions.length === 0 && (
                <p className="py-10 text-center text-sm text-charcoal-400">{t('No questions yet.', 'لا توجد أسئلة بعد.')}</p>
              )}
              {questions.map((q) => (
                <div key={q._id} className="border-b border-charcoal-100 pb-6 last:border-0">
                  <p className="text-sm font-semibold text-charcoal-900">Q: {q.question}</p>
                  <p className="mt-1 text-xs text-charcoal-400">{q.name}</p>
                  {q.answer && (
                    <p className="mt-2 rounded-lg bg-stone-50 p-3 text-sm leading-relaxed text-charcoal-600">
                      <span className="font-semibold text-camel-600">A: </span>{q.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Forms */}
      <AnimatePresence>
        {showReviewForm && (
          <ReviewForm
            productId={productId}
            productName={productName}
            isAr={isAr}
            onClose={() => setShowReviewForm(false)}
            onSuccess={(rev) => setReviews((prev) => [rev, ...prev])}
          />
        )}
        {showQaForm && (
          <QuestionForm
            productId={productId}
            productName={productName}
            isAr={isAr}
            onClose={() => setShowQaForm(false)}
            onSuccess={(q) => setQuestions((prev) => [q, ...prev])}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

// ─── Modal shell ───────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h3 className="font-display text-lg font-semibold text-charcoal-900">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1 text-charcoal-400 hover:bg-stone-100">
            <X size={20} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}

const inputCls = 'w-full rounded-lg border border-charcoal-200 px-3 py-2.5 text-sm text-charcoal-900 outline-none transition-colors focus:border-camel-500'

// ─── Review form ────────────────────────────────────────────────────────────────
function ReviewForm({ productId, productName, isAr, onClose, onSuccess }: {
  productId: string; productName: string; isAr: boolean
  onClose: () => void; onSuccess: (r: ReviewItem) => void
}) {
  const t = (en: string, ar: string) => (isAr ? ar : en)
  const [rating, setRating] = useState(5)
  const [scent, setScent] = useState(5)
  const [longevity, setLongevity] = useState(5)
  const [value, setValue] = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    const payload = {
      productId,
      name: fd.get('name'),
      email: fd.get('email'),
      title: fd.get('title'),
      review: fd.get('review'),
      rating, ratingScent: scent, ratingLongevity: longevity, ratingValue: value,
    }
    if (!payload.name || !payload.review) { setError(t('Please fill all required fields.', 'يرجى ملء جميع الحقول المطلوبة.')); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      onSuccess(data.review as ReviewItem)
      setDone(true)
      setTimeout(onClose, 1200)
    } catch {
      setError(t('Something went wrong. Please try again.', 'حدث خطأ ما. حاول مرة أخرى.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={`${t('Review', 'تقييم')} ${productName}`} onClose={onClose}>
      {done ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <CheckCircle2 className="text-green-500" size={40} />
          <p className="text-sm font-medium text-charcoal-700">{t('Thank you! Your review is now live.', 'شكراً لك! تقييمك ظاهر الآن.')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-charcoal-600">{t('Overall Rating', 'التقييم العام')} *</label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} type="button" onClick={() => setRating(i + 1)} aria-label={`${i + 1} stars`}>
                  <Star size={28} className={i < rating ? 'text-camel-500' : 'text-charcoal-200'} fill={i < rating ? 'currentColor' : 'none'} strokeWidth={i < rating ? 0 : 1.5} />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {([['Scent', 'الرائحة', scent, setScent], ['Longevity', 'الثبات', longevity, setLongevity], ['Value', 'القيمة', value, setValue]] as const).map(([en, ar, val, set]) => (
              <div key={en}>
                <label className="mb-1 block text-[11px] font-medium text-charcoal-500">{t(en, ar)}</label>
                <select value={val as number} onChange={(e) => (set as (n: number) => void)(Number(e.target.value))} className={inputCls}>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            ))}
          </div>

          <input name="title" placeholder={t('Review title (optional)', 'عنوان التقييم (اختياري)')} className={inputCls} maxLength={120} />
          <textarea name="review" required rows={4} placeholder={t('Share your experience…', 'شاركنا تجربتك…')} className={inputCls} maxLength={1000} />
          <div className="grid grid-cols-2 gap-3">
            <input name="name" required placeholder={t('Your name', 'اسمك')} className={inputCls} maxLength={80} />
            <input name="email" type="email" placeholder={t('Email (optional)', 'البريد (اختياري)')} className={inputCls} />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full rounded-full bg-camel-500 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-camel-600 disabled:opacity-60">
            {submitting ? t('Submitting…', 'جارٍ الإرسال…') : t('Submit Review', 'إرسال التقييم')}
          </button>
        </form>
      )}
    </Modal>
  )
}

// ─── Question form ──────────────────────────────────────────────────────────────
function QuestionForm({ productId, productName, isAr, onClose, onSuccess }: {
  productId: string; productName: string; isAr: boolean
  onClose: () => void; onSuccess: (q: QuestionItem) => void
}) {
  const t = (en: string, ar: string) => (isAr ? ar : en)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    const payload = { productId, name: fd.get('name'), email: fd.get('email'), question: fd.get('question') }
    if (!payload.name || !payload.question) { setError(t('Please fill all required fields.', 'يرجى ملء جميع الحقول المطلوبة.')); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      onSuccess(data.question as QuestionItem)
      setDone(true)
      setTimeout(onClose, 1200)
    } catch {
      setError(t('Something went wrong. Please try again.', 'حدث خطأ ما. حاول مرة أخرى.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={`${t('Ask about', 'اسأل عن')} ${productName}`} onClose={onClose}>
      {done ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <CheckCircle2 className="text-green-500" size={40} />
          <p className="text-sm font-medium text-charcoal-700">{t('Thanks! Your question has been submitted.', 'شكراً! تم إرسال سؤالك.')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea name="question" required rows={4} placeholder={t('Your question…', 'سؤالك…')} className={inputCls} maxLength={600} />
          <div className="grid grid-cols-2 gap-3">
            <input name="name" required placeholder={t('Your name', 'اسمك')} className={inputCls} maxLength={80} />
            <input name="email" type="email" placeholder={t('Email (optional)', 'البريد (اختياري)')} className={inputCls} />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full rounded-full bg-camel-500 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-camel-600 disabled:opacity-60">
            {submitting ? t('Submitting…', 'جارٍ الإرسال…') : t('Submit Question', 'إرسال السؤال')}
          </button>
        </form>
      )}
    </Modal>
  )
}
