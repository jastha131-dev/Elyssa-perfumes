'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'
import { Sparkles, ArrowRight, ArrowLeft, RotateCcw, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/types'

// ─── Quiz data ────────────────────────────────────────────────────────────────

interface Step {
  id: string
  question: string
  emoji: string
  options: { label: string; value: string; desc?: string; emoji?: string }[]
}

const STEPS: Step[] = [
  {
    id: 'recipient',
    question: 'Who is this fragrance for?',
    emoji: '🎁',
    options: [
      { label: 'Myself', value: 'myself', desc: 'I\'m treating myself', emoji: '✨' },
      { label: 'A Gift', value: 'gift', desc: 'For someone special', emoji: '💝' },
    ],
  },
  {
    id: 'vibe',
    question: 'What\'s the vibe you\'re after?',
    emoji: '🌸',
    options: [
      { label: 'Fresh & Citrus', value: 'Fresh & Citrus', desc: 'Light, energising, clean', emoji: '🍋' },
      { label: 'Warm & Oriental', value: 'Warm & Oriental', desc: 'Rich, exotic, sensual', emoji: '🌙' },
      { label: 'Bold & Woody', value: 'Bold & Woody', desc: 'Deep, smoky, confident', emoji: '🌲' },
      { label: 'Light & Floral', value: 'Light & Floral', desc: 'Romantic, feminine, soft', emoji: '🌹' },
    ],
  },
  {
    id: 'occasion',
    question: 'When will you wear it most?',
    emoji: '📅',
    options: [
      { label: 'Every Day', value: 'Daily', desc: 'Casual, effortless', emoji: '☀️' },
      { label: 'At Work', value: 'Work', desc: 'Professional, subtle', emoji: '💼' },
      { label: 'Evenings Out', value: 'Evening', desc: 'Social, memorable', emoji: '🌃' },
      { label: 'Special Occasions', value: 'Special', desc: 'Rare, unforgettable', emoji: '🥂' },
    ],
  },
  {
    id: 'intensity',
    question: 'How bold do you like it?',
    emoji: '🔥',
    options: [
      { label: 'Light Whisper', value: 'Light', desc: 'Subtle, close to skin', emoji: '🌿' },
      { label: 'Moderate Trail', value: 'Moderate', desc: 'Noticed but not overpowering', emoji: '🌬️' },
      { label: 'Strong Presence', value: 'Strong', desc: 'Fills the room', emoji: '🦁' },
      { label: 'Intense Signature', value: 'Intense', desc: 'Unforgettable sillage', emoji: '👑' },
    ],
  },
  {
    id: 'budget',
    question: 'What\'s your budget?',
    emoji: '💰',
    options: [
      { label: 'Under AED 100', value: 'Under AED 100', desc: 'Great value finds', emoji: '💎' },
      { label: 'AED 100 – 200', value: 'AED 100-200', desc: 'Premium picks', emoji: '✨' },
      { label: 'AED 200+', value: 'AED 200+', desc: 'Luxury without limits', emoji: '👑' },
    ],
  },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type Answers = Record<string, string>
type Status = 'intro' | 'quiz' | 'loading' | 'results' | 'error'

interface Recommendation {
  id: string
  slug: string
  reason: string
  product?: Product
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-[3px] flex-1 rounded-full transition-all duration-500',
            i < step ? 'bg-[#C8A96E]' : i === step ? 'bg-[#C8A96E]/40' : 'bg-charcoal-100'
          )}
        />
      ))}
    </div>
  )
}

// ─── Option card ──────────────────────────────────────────────────────────────

function OptionCard({
  label, desc, emoji, selected, onClick,
}: {
  label: string; desc?: string; emoji?: string
  selected: boolean; onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200 w-full',
        selected
          ? 'border-[#C8A96E] bg-[#FBF6EE] shadow-lg shadow-[#C8A96E]/10'
          : 'border-charcoal-100 bg-white hover:border-charcoal-300 hover:shadow-md hover:shadow-black/5'
      )}
    >
      {emoji && (
        <span className={cn(
          'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl',
          selected ? 'bg-[#C8A96E]/15' : 'bg-charcoal-50'
        )}>
          {emoji}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'font-medium text-[14px] leading-snug',
          selected ? 'text-charcoal-950' : 'text-charcoal-800'
        )}>
          {label}
        </p>
        {desc && (
          <p className="mt-0.5 text-[11.5px] text-charcoal-400">{desc}</p>
        )}
      </div>
      {selected && (
        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#C8A96E]">
          <span className="text-[10px] font-bold text-white">✓</span>
        </span>
      )}
    </motion.button>
  )
}

// ─── Loading animation ────────────────────────────────────────────────────────

function AiThinking() {
  const dots = ['Analysing your preferences', 'Consulting our perfumers', 'Matching your sillage', 'Curating your selections']

  return (
    <div className="flex flex-col items-center gap-8 py-16">
      {/* Animated orb */}
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="h-28 w-28 rounded-full bg-gradient-to-br from-[#C8A96E]/30 via-[#C8A96E]/10 to-transparent border border-[#C8A96E]/20"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sparkles className="h-8 w-8 text-[#C8A96E]" />
        </motion.div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="font-display text-xl font-light text-charcoal-900">Finding your perfect scent</h3>
        <p className="text-sm text-charcoal-400">Our AI is consulting master perfumers…</p>
      </div>

      {/* Cycling status messages */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {dots.map((text, i) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.7, duration: 0.4 }}
            className="flex items-center gap-2.5"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
              className="h-1.5 w-1.5 rounded-full bg-[#C8A96E]"
            />
            <span className="text-[12px] text-charcoal-500">{text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({ rec, locale, rank }: { rec: Recommendation; locale: string; rank: number }) {
  const p = rec.product
  if (!p) return null

  const name = locale === 'ar' ? p.name_ar : p.name_en
  const image = p.images?.[0]?.url
  const price = p.volume?.[0]?.price ?? p.price

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-sm hover:shadow-xl hover:shadow-black/8 transition-all duration-300"
    >
      {/* Rank badge */}
      <div className="absolute top-3.5 left-3.5 z-10">
        <span className={cn(
          'flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold',
          rank === 0 ? 'bg-[#C8A96E] text-white' : 'bg-charcoal-100 text-charcoal-600'
        )}>
          #{rank + 1}
        </span>
      </div>

      {/* Best Match label */}
      {rank === 0 && (
        <div className="absolute top-3.5 right-3.5 z-10">
          <span className="rounded-full bg-[#C8A96E]/15 border border-[#C8A96E]/30 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#C8A96E]">
            Best Match
          </span>
        </div>
      )}

      {/* Product image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-charcoal-50 to-charcoal-100">
            <span className="font-display text-5xl italic text-charcoal-200">
              {name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="mb-1 text-[8.5px] font-bold uppercase tracking-[0.2em] text-charcoal-400">
          {p.fragranceFamily} · {p.intensity}
        </p>
        <h3 className="font-display text-lg font-light text-charcoal-950 leading-snug">{name}</h3>

        {/* AI reason */}
        <div className="mt-2.5 flex gap-2">
          <Sparkles className="h-3 w-3 flex-shrink-0 text-[#C8A96E] mt-0.5" />
          <p className="text-[11.5px] italic text-charcoal-500 leading-relaxed">{rec.reason}</p>
        </div>

        <div className="mt-3.5 flex items-center justify-between">
          <span className="font-medium text-charcoal-900">{formatPrice(price)}</span>
          <Link
            href={`/${locale}/products/${p.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-charcoal-950 px-4 py-2 text-[10.5px] font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#C8A96E]"
          >
            View Scent
            <ArrowRight className="h-2.5 w-2.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Quiz Component ──────────────────────────────────────────────────────

export function QuizClient({ products }: { products: Product[] }) {
  const locale = useLocale()

  const [status, setStatus] = useState<Status>('intro')
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [error, setError] = useState('')

  const step = STEPS[currentStep]

  const handleSelect = useCallback((value: string) => {
    setAnswers(prev => ({ ...prev, [step.id]: value }))
  }, [step.id])

  const handleNext = useCallback(async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1)
    } else {
      // Submit
      setStatus('loading')
      try {
        const productInfo = products.map(p => ({
          _id: p._id,
          name: p.name_en,
          slug: p.slug,
          price: p.volume?.[0]?.price ?? p.price,
          fragranceFamily: p.fragranceFamily,
          intensity: p.intensity,
          tags: p.tags ?? [],
          topNotes: p.topNotes_en ?? [],
          imageUrl: p.images?.[0]?.url,
        }))

        const res = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, products: productInfo }),
        })

        if (!res.ok) throw new Error('Quiz API failed')

        const data = await res.json()

        // Hydrate recs with full product objects
        const hydrated = data.recommendations.map((rec: Recommendation) => ({
          ...rec,
          product: products.find(p => p._id === rec.id || p.slug === rec.slug),
        }))

        setRecommendations(hydrated)
        setStatus('results')
      } catch (err) {
        console.error(err)
        setError('Something went wrong. Please try again.')
        setStatus('error')
      }
    }
  }, [currentStep, answers, products])

  const handleBack = useCallback(() => {
    if (currentStep > 0) setCurrentStep(s => s - 1)
    else setStatus('intro')
  }, [currentStep])

  const restart = useCallback(() => {
    setStatus('intro')
    setCurrentStep(0)
    setAnswers({})
    setRecommendations([])
    setError('')
  }, [])

  const canProceed = !!answers[step?.id]

  // ── Intro screen ────────────────────────────────────────────────────────────
  if (status === 'intro') {
    return (
      <div className="min-h-screen bg-charcoal-950 pt-[72px] flex flex-col">
        {/* Hero */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Icon orb */}
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#C8A96E]/30 bg-[#C8A96E]/10">
              <Sparkles className="h-8 w-8 text-[#C8A96E]" />
            </div>

            <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.45em] text-[#C8A96E]">
              AI-Powered · 5 Questions
            </p>
            <h1 className="mb-5 font-display text-4xl font-light text-white md:text-5xl lg:text-6xl">
              Find Your<br />
              <em className="italic text-[#C8A96E]">Perfect Scent</em>
            </h1>
            <p className="mx-auto mb-10 max-w-md text-base font-light leading-relaxed text-charcoal-300">
              Answer 5 quick questions and our AI will match you with fragrances perfectly tailored to your personality, lifestyle, and taste.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStatus('quiz')}
              className="inline-flex items-center gap-3 bg-[#C8A96E] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-charcoal-950 transition-colors hover:bg-[#B8965E]"
            >
              Start the Quiz
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 flex items-center gap-10"
          >
            {[
              { value: '9+', label: 'Fragrances' },
              { value: '5', label: 'Questions' },
              { value: 'AI', label: 'Powered' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-2xl font-light text-[#C8A96E]">{value}</p>
                <p className="mt-0.5 text-[9px] uppercase tracking-[0.3em] text-charcoal-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    )
  }

  // ── Loading screen ───────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white pt-[72px] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <AiThinking />
        </div>
      </div>
    )
  }

  // ── Error screen ─────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-white pt-[72px] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <p className="text-5xl">😔</p>
        <h2 className="font-display text-2xl font-light text-charcoal-800">Something went wrong</h2>
        <p className="text-sm text-charcoal-400 max-w-xs">{error}</p>
        <button
          onClick={restart}
          className="inline-flex items-center gap-2 rounded-full border-2 border-charcoal-950 px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-charcoal-950 hover:bg-charcoal-950 hover:text-white transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Try Again
        </button>
      </div>
    )
  }

  // ── Results screen ───────────────────────────────────────────────────────────
  if (status === 'results') {
    return (
      <div className="min-h-screen bg-[#FAFAF9] pt-[72px]">
        {/* Results hero */}
        <div className="bg-charcoal-950 px-4 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C8A96E]/20 border border-[#C8A96E]/30">
              <Sparkles className="h-5 w-5 text-[#C8A96E]" />
            </div>
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.4em] text-[#C8A96E]">Your Matches</p>
            <h2 className="font-display text-3xl font-light text-white">
              We found your perfect scents
            </h2>
            <p className="mt-3 text-sm text-charcoal-400">
              Curated by AI · Based on your personal profile
            </p>
          </motion.div>
        </div>

        {/* Results grid */}
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, i) => (
              <ResultCard key={rec.id + i} rec={rec} locale={locale} rank={i} />
            ))}
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={restart}
              className="inline-flex items-center gap-2 rounded-full border-2 border-charcoal-200 px-8 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-charcoal-600 hover:border-charcoal-900 hover:text-charcoal-900 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retake Quiz
            </button>
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center gap-2 rounded-full bg-charcoal-950 px-8 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white hover:bg-[#C8A96E] transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View All Fragrances
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Quiz screen ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white pt-[72px]">
      {/* Top bar */}
      <div className="sticky top-[72px] z-10 border-b border-charcoal-100 bg-white/95 backdrop-blur-sm px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-lg">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal-400">
              Step {currentStep + 1} of {STEPS.length}
            </p>
            <button
              onClick={restart}
              className="text-[10px] text-charcoal-400 underline underline-offset-2 hover:text-charcoal-700 transition-colors"
            >
              Restart
            </button>
          </div>
          <ProgressBar step={currentStep} total={STEPS.length} />
        </div>
      </div>

      {/* Question */}
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="mb-8">
              <p className="mb-3 text-3xl">{step.emoji}</p>
              <h2 className="font-display text-2xl font-light text-charcoal-950 md:text-3xl">
                {step.question}
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {step.options.map(opt => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  desc={opt.desc}
                  emoji={opt.emoji}
                  selected={answers[step.id] === opt.value}
                  onClick={() => handleSelect(opt.value)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[11px] font-medium text-charcoal-400 hover:text-charcoal-800 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>

          <motion.button
            onClick={handleNext}
            disabled={!canProceed}
            whileHover={canProceed ? { scale: 1.02 } : {}}
            whileTap={canProceed ? { scale: 0.98 } : {}}
            className={cn(
              'inline-flex items-center gap-2.5 px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-200',
              canProceed
                ? currentStep === STEPS.length - 1
                  ? 'bg-[#C8A96E] text-charcoal-950 hover:bg-[#B8965E] shadow-lg shadow-[#C8A96E]/25'
                  : 'bg-charcoal-950 text-white hover:bg-charcoal-800'
                : 'bg-charcoal-100 text-charcoal-300 cursor-not-allowed'
            )}
          >
            {currentStep === STEPS.length - 1 ? (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Get My Recommendations
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
