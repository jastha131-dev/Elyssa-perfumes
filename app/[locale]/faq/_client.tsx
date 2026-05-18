'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { FaqItem } from '@/lib/types'

// ─── Fallback data ────────────────────────────────────────────────────────────

const FALLBACK_ITEMS: FaqItem[] = [
  {
    _id: '1',
    question_en: 'How long does shipping take?',
    answer_en:
      'We offer 2-5 business day standard shipping and next-day express across the UAE. International orders take 5-10 business days.',
    category: 'Shipping',
    order: 1,
  },
  {
    _id: '2',
    question_en: 'Do you ship internationally?',
    answer_en:
      'Yes, we ship to over 60 countries worldwide. Shipping costs and times vary by destination.',
    category: 'Shipping',
    order: 2,
  },
  {
    _id: '3',
    question_en: 'What is your return policy?',
    answer_en:
      "We offer a 30-day satisfaction guarantee. If you're not completely satisfied, return the unused portion for a full refund or exchange.",
    category: 'Returns',
    order: 1,
  },
  {
    _id: '4',
    question_en: 'Are your fragrances authentic?',
    answer_en:
      'All our fragrances are original creations inspired by iconic luxury maisons. They are crafted by master perfumers using the finest raw materials.',
    category: 'Products',
    order: 1,
  },
  {
    _id: '5',
    question_en: 'What concentration are your perfumes?',
    answer_en:
      'Our fragrances are Eau de Parfum (EDP) concentration, containing 20-30% pure fragrance oil for exceptional longevity.',
    category: 'Products',
    order: 2,
  },
  {
    _id: '6',
    question_en: 'How do I track my order?',
    answer_en:
      "Once your order ships, you'll receive an email with tracking details. You can also track your order in your account dashboard.",
    category: 'Orders',
    order: 1,
  },
]

// ─── Types ────────────────────────────────────────────────────────────────────

const GOLD = '#C8A96E'

// ─── Accordion Item ───────────────────────────────────────────────────────────

function AccordionItem({
  item,
  isOpen,
  onToggle,
  isRtl,
  index,
}: {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
  isRtl: boolean
  index: number
}) {
  const question = isRtl && item.question_ar ? item.question_ar : item.question_en
  const answer = isRtl && item.answer_ar ? item.answer_ar : item.answer_en

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-charcoal-100 last:border-b-0"
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          'w-full flex items-center gap-4 py-5 text-left transition-colors duration-200',
          'hover:bg-charcoal-50/60 px-6 rounded-sm',
          isRtl && 'flex-row-reverse text-right'
        )}
      >
        {/* Gold dot */}
        <span
          className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-0.5 transition-all duration-300"
          style={{ backgroundColor: isOpen ? GOLD : '#c8c8c8' }}
          aria-hidden="true"
        />

        <span
          className={cn(
            'flex-1 font-display text-[15px] font-light leading-snug transition-colors duration-200',
            isOpen ? 'text-charcoal-900' : 'text-charcoal-700'
          )}
        >
          {question}
        </span>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0"
        >
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            style={{ color: isOpen ? GOLD : '#a4a4a4' }}
          />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                'px-6 pb-5 pt-0',
                isRtl ? 'pr-[3.25rem] text-right' : 'pl-[3.25rem]'
              )}
            >
              <p className="text-sm text-charcoal-500 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FaqClient({ items }: { items: FaqItem[] }) {
  const locale = useLocale()
  const isRtl = locale === 'ar'

  const displayItems = items.length > 0 ? items : FALLBACK_ITEMS
  const sorted = [...displayItems].sort((a, b) => a.order - b.order)

  // Derive unique categories that have items
  const categoriesWithItems = Array.from(
    new Set(sorted.map((i) => i.category).filter((c): c is string => Boolean(c)))
  )

  const tabs = ['All', ...categoriesWithItems]

  const [activeTab, setActiveTab] = useState<string>('All')
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered =
    activeTab === 'All' ? sorted : sorted.filter((i) => i.category === activeTab)

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  // Reset open item when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setOpenId(null)
  }

  return (
    <div className={cn('pt-[72px]', isRtl && 'rtl')} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-charcoal-950 overflow-hidden">
        {/* Subtle grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          }}
          aria-hidden="true"
        />

        {/* Decorative gold line */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-24 opacity-40"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
          aria-hidden="true"
        />

        <div className="relative max-w-3xl mx-auto px-6 py-24 text-center">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-body text-[11px] tracking-[0.25em] uppercase mb-5"
            style={{ color: GOLD }}
          >
            FAQ
          </motion.p>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-display text-4xl sm:text-5xl font-light text-white leading-tight mb-5"
          >
            Frequently Asked{' '}
            <span className="italic" style={{ color: GOLD }}>
              Questions
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="font-body text-sm text-charcoal-400 tracking-wide leading-relaxed max-w-md mx-auto"
          >
            Everything you need to know about Luxe Parfum
          </motion.p>
        </div>
      </section>

      {/* ── Category Tabs ─────────────────────────────────────────────────── */}
      <section className="sticky top-[72px] z-20 bg-white/90 backdrop-blur-md border-b border-charcoal-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div
            className={cn(
              'flex flex-wrap gap-2',
              isRtl ? 'flex-row-reverse justify-end' : 'justify-start'
            )}
            role="tablist"
            aria-label="FAQ categories"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-body tracking-wide transition-all duration-200 whitespace-nowrap',
                  activeTab === tab
                    ? 'bg-charcoal-950 text-white shadow-sm'
                    : 'border border-charcoal-200 text-charcoal-600 hover:border-charcoal-400 hover:text-charcoal-900'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Accordion ─────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-charcoal-100 overflow-hidden"
          >
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-charcoal-400 py-16 font-body">
                No questions in this category yet.
              </p>
            ) : (
              filtered.map((item, index) => (
                <AccordionItem
                  key={item._id}
                  item={item}
                  isOpen={openId === item._id}
                  onToggle={() => handleToggle(item._id)}
                  isRtl={isRtl}
                  index={index}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'relative rounded-2xl overflow-hidden bg-charcoal-950 px-8 py-12 text-center',
            isRtl && 'text-right'
          )}
        >
          {/* Decorative accent */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-32 opacity-50"
            style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
            aria-hidden="true"
          />

          <p
            className="font-body text-[10px] tracking-[0.3em] uppercase mb-4"
            style={{ color: GOLD }}
          >
            Still need help?
          </p>

          <h2 className="font-display text-2xl font-light text-white mb-3">
            Still have questions?
          </h2>

          <p className="text-sm text-charcoal-400 font-body leading-relaxed mb-8 max-w-sm mx-auto">
            Our fragrance specialists are here to guide you to your perfect scent.
          </p>

          <Link
            href={`/${locale}/contact`}
            className={cn(
              'inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-body tracking-widest uppercase transition-all duration-300',
              'border hover:opacity-80'
            )}
            style={{
              borderColor: GOLD,
              color: GOLD,
            }}
          >
            Contact Us
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
