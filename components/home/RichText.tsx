'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLocale } from 'next-intl'
import { PortableText } from '@portabletext/react'
import { cn } from '@/lib/utils'
import type { RichTextSectionBlock, PortableTextBlock } from '@/lib/types'

const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-body text-base font-light text-ink-600 leading-relaxed mb-4">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-headline font-bold uppercase text-ink-900 text-3xl mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-headline font-bold uppercase text-ink-900 text-xl mt-6 mb-3">{children}</h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-2 border-camel-400 pl-5 font-display font-light italic text-ink-500 text-lg my-6">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-ink-900">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({ children, value }: { children?: React.ReactNode; value?: { href: string } }) => (
      <a href={value?.href} className="text-camel-500 underline underline-offset-2 hover:text-camel-600 transition-colors">
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-none mb-4 space-y-2">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 font-body text-ink-600">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="flex items-start gap-2 font-body text-sm text-ink-600">
        <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-camel-400" />
        {children}
      </li>
    ),
  },
}

interface Props { data: RichTextSectionBlock }

export default function RichText({ data }: Props) {
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const content = (locale === 'ar' ? data?.content_ar : data?.content_en) as PortableTextBlock[] | undefined
  const maxWidth = { narrow: 'max-w-2xl', normal: 'max-w-3xl', wide: 'max-w-5xl' }[data?.maxWidth ?? 'normal']
  const alignClass = data?.textAlign === 'center' ? 'text-center' : 'text-left'

  if (!content?.length) return null

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="py-16 md:py-24"
      style={{ backgroundColor: 'var(--section-bg, #ffffff)' }}
    >
      <div className={cn('mx-auto px-6 lg:px-8', maxWidth, alignClass)}>
        <PortableText value={content} components={ptComponents as any} />
      </div>
    </motion.section>
  )
}
