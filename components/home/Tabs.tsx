'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import type { TabsSectionBlock, TabItem, PortableTextBlock } from '@/lib/types'

interface Props { data: TabsSectionBlock }

export default function Tabs({ data }: Props) {
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const tabs: TabItem[] = data?.tabs ?? []
  const [activeIdx, setActiveIdx] = useState(0)
  const title = locale === 'ar' ? data?.title_ar : data?.title_en

  if (!tabs.length) return null

  const activeTab = tabs[activeIdx]
  const content = (locale === 'ar' ? activeTab?.content_ar : activeTab?.content_en) as PortableTextBlock[] | undefined

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 text-center"
          >
            <h2 className="font-headline font-bold uppercase text-ink-900 text-4xl md:text-5xl">{title}</h2>
            <div className="mx-auto mt-4 h-px w-16 bg-camel-500/50" />
          </motion.div>
        )}

        {/* Tab bar */}
        <div className="relative flex items-center gap-0 overflow-x-auto border-b border-stone-200 pb-0">
          {tabs.map((tab, i) => {
            const label = locale === 'ar' ? tab.label_ar : tab.label_en
            const isActive = i === activeIdx
            return (
              <button
                key={tab._key}
                onClick={() => setActiveIdx(i)}
                className={cn(
                  'relative flex flex-shrink-0 items-center gap-2 px-5 py-3.5 font-body text-xs uppercase tracking-[0.15em] transition-colors',
                  isActive ? 'text-ink-900' : 'text-ink-400 hover:text-ink-700'
                )}
              >
                {tab.icon && <span>{tab.icon}</span>}
                {label}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-camel-500"
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            {content?.length ? (
              <div className="font-body text-sm font-light text-ink-600 leading-relaxed prose-sm max-w-none">
                <PortableText value={content} />
              </div>
            ) : (
              <p className="font-body text-sm text-ink-400">No content for this tab.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
