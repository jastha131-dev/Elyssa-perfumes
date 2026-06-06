'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import type { FaqItem, FaqSectionBlock } from '@/lib/types'

interface Props { data: FaqSectionBlock }

function FaqItem({ faq, open, onToggle }: { faq: FaqItem; open: boolean; onToggle: () => void }) {
  const locale = useLocale()
  const question = locale === 'ar' ? faq.question_ar : faq.question_en
  const answer = locale === 'ar' ? faq.answer_ar : faq.answer_en

  return (
    <div className="border-b border-stone-200">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left gap-4"
        aria-expanded={open}
      >
        <span className="font-body text-sm font-medium text-ink-900">{question}</span>
        <span className="flex-shrink-0 text-camel-500">
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 font-body text-sm font-light text-ink-500 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FaqAccordion({ data }: Props) {
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [openKey, setOpenKey] = useState<string | null>(null)

  const faqs: FaqItem[] = (data?.faqs ?? []) as FaqItem[]
  const title = locale === 'ar' ? data?.title_ar : data?.title_en
  const subtitle = locale === 'ar' ? data?.subtitle_ar : data?.subtitle_en
  const twoCol = data?.layout === 'two-column'

  if (!faqs.length) return null

  const mid = Math.ceil(faqs.length / 2)
  const leftFaqs = twoCol ? faqs.slice(0, mid) : faqs
  const rightFaqs = twoCol ? faqs.slice(mid) : []

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="py-20 md:py-28"
      style={{ backgroundColor: 'var(--section-bg, #ffffff)' }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 text-center"
          >
            {title && <h2 className="font-headline font-bold uppercase text-ink-900 text-4xl md:text-5xl">{title}</h2>}
            {subtitle && <p className="mt-3 font-body text-sm text-ink-400">{subtitle}</p>}
            <div className="mx-auto mt-4 h-px w-16 bg-camel-500/50" />
          </motion.div>
        )}

        <div className={cn('mx-auto', twoCol ? 'grid grid-cols-1 gap-0 lg:grid-cols-2 lg:gap-16 max-w-6xl' : 'max-w-3xl')}>
          <div>
            {leftFaqs.map((faq) => (
              <FaqItem
                key={faq._id}
                faq={faq}
                open={openKey === faq._id}
                onToggle={() => setOpenKey(openKey === faq._id ? null : faq._id)}
              />
            ))}
          </div>
          {twoCol && rightFaqs.length > 0 && (
            <div>
              {rightFaqs.map((faq) => (
                <FaqItem
                  key={faq._id}
                  faq={faq}
                  open={openKey === faq._id}
                  onToggle={() => setOpenKey(openKey === faq._id ? null : faq._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  )
}
