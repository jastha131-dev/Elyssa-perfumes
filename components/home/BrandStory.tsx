'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion'
import { cn } from '@/lib/utils'

interface BrandStoryData {
  brandStoryEyebrow?: string
  brandStoryTitle?: string
  brandStoryText?: string
  brandStoryImage?: string
}

interface BrandStoryProps {
  data?: BrandStoryData | null
}

const FALLBACK_PARAGRAPHS = [
  'Every fragrance we craft is born from an obsession with the extraordinary. We journey to the rarest gardens—the jasmine fields of Grasse, the oud forests of Cambodia, the rose valleys of Turkey—sourcing ingredients that carry the memory of place and time.',
  'Our master perfumers weave these precious materials into olfactory narratives that unfold on the skin over hours. We believe a truly great fragrance is not merely worn—it becomes part of who you are, a second skin that speaks before you do.',
]

const PULL_QUOTE =
  '"Perfume is the art that makes memory speak."'

const lineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      delay: i * 0.14,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const imageVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function BrandStory({ data }: BrandStoryProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const isTextInView = useInView(textRef, { once: true, margin: '-100px' })
  const isImageInView = useInView(imageRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Parallax: image moves slightly upward as we scroll past
  const imageY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%'])

  const eyebrow = data?.brandStoryEyebrow ?? 'Our Philosophy'
  const title = data?.brandStoryTitle ?? 'The Art of Perfumery'
  const brandImageSrc = (typeof data?.brandStoryImage === 'string' && data.brandStoryImage)
    ? data.brandStoryImage
    : '/images/categories/I1.webp'
  const hasImage = true

  // Split provided text into paragraphs or use fallback
  const paragraphs = data?.brandStoryText
    ? data.brandStoryText.split(/\n\n+/).filter(Boolean)
    : FALLBACK_PARAGRAPHS

  // Lines for staggered reveal: title words + paragraphs + quote + CTA
  const textLines = [
    { type: 'eyebrow', content: eyebrow },
    { type: 'title', content: title },
    { type: 'divider', content: '' },
    ...paragraphs.map((p) => ({ type: 'paragraph', content: p })),
    { type: 'quote', content: PULL_QUOTE },
    { type: 'cta', content: 'Discover Our Story' },
  ]

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-charcoal-950 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-0">
          {/* Left: Text */}
          <div
            ref={textRef}
            className="flex flex-col justify-center py-0 pr-0 md:py-8 md:pr-16 lg:pr-24"
          >
            {textLines.map((line, i) => {
              if (line.type === 'eyebrow') {
                return (
                  <motion.p
                    key={i}
                    custom={i}
                    variants={lineVariants}
                    initial="hidden"
                    animate={isTextInView ? 'visible' : 'hidden'}
                    className="mb-4 font-body text-xs uppercase tracking-[0.35em] text-gold-500"
                  >
                    {line.content}
                  </motion.p>
                )
              }
              if (line.type === 'title') {
                return (
                  <motion.h2
                    key={i}
                    custom={i}
                    variants={lineVariants}
                    initial="hidden"
                    animate={isTextInView ? 'visible' : 'hidden'}
                    className="font-display text-4xl font-light leading-tight text-cream-100 md:text-5xl lg:text-6xl"
                  >
                    {line.content}
                  </motion.h2>
                )
              }
              if (line.type === 'divider') {
                return (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={lineVariants}
                    initial="hidden"
                    animate={isTextInView ? 'visible' : 'hidden'}
                    className="my-8 h-px w-16 bg-gold-500/50"
                  />
                )
              }
              if (line.type === 'paragraph') {
                return (
                  <motion.p
                    key={i}
                    custom={i}
                    variants={lineVariants}
                    initial="hidden"
                    animate={isTextInView ? 'visible' : 'hidden'}
                    className="mb-5 font-body text-base font-light leading-relaxed text-charcoal-300"
                  >
                    {line.content}
                  </motion.p>
                )
              }
              if (line.type === 'quote') {
                return (
                  <motion.blockquote
                    key={i}
                    custom={i}
                    variants={lineVariants}
                    initial="hidden"
                    animate={isTextInView ? 'visible' : 'hidden'}
                    className={cn(
                      'my-8 border-l-2 border-gold-500/50 pl-6',
                      'font-display text-lg italic font-light leading-relaxed text-gold-400',
                      'md:text-xl'
                    )}
                  >
                    {line.content}
                  </motion.blockquote>
                )
              }
              if (line.type === 'cta') {
                return (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={lineVariants}
                    initial="hidden"
                    animate={isTextInView ? 'visible' : 'hidden'}
                  >
                    <Link
                      href="/about"
                      className={cn(
                        'inline-flex items-center gap-3 border border-cream-100/30 px-8 py-3.5',
                        'font-body text-sm uppercase tracking-[0.2em] text-cream-100',
                        'transition-all duration-300 hover:border-gold-500 hover:text-gold-400'
                      )}
                    >
                      {line.content}
                    </Link>
                  </motion.div>
                )
              }
              return null
            })}
          </div>

          {/* Right: Image */}
          <motion.div
            ref={imageRef}
            variants={imageVariants}
            initial="hidden"
            animate={isImageInView ? 'visible' : 'hidden'}
            className="relative min-h-[500px] overflow-hidden md:min-h-0"
          >
            <motion.div className="absolute inset-0" style={{ y: imageY }}>
              {hasImage ? (
                <Image
                  src={brandImageSrc!}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-charcoal-800 via-charcoal-900 to-charcoal-950">
                  {/* Decorative texture pattern */}
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, rgba(217,154,27,0.4) 1px, transparent 0)`,
                      backgroundSize: '32px 32px',
                    }}
                  />
                  {/* Golden atmospheric glow */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-64 w-64 rounded-full bg-gold-500/5 blur-3xl" />
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-500/10" />
                  <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-500/10" />
                  <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-500/15" />
                  {/* Center label */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="font-display text-4xl font-light text-gold-500/30">
                      Luxe
                    </p>
                    <p className="font-display text-2xl font-light text-gold-500/20">
                      Parfum
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Subtle overlay for dark edge blend */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-charcoal-950/20 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
