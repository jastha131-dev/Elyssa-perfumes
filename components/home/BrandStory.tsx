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
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BrandStorySectionBlock } from '@/lib/types'

interface BrandStoryProps {
  data?: BrandStorySectionBlock | null
}

const BRANDS = ['YSL', 'Dior', 'Chanel']

const brandVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.15,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: 0.55 + i * 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function BrandStory({ data }: BrandStoryProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const isTextInView = useInView(textRef, { once: true, margin: '-80px' })
  const isImageInView = useInView(imageRef, { once: true, margin: '-80px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%'])

  const imageSrc = data?.imageUrl ?? '/images/products/p1.jpeg'
  const imageRight = (data?.imagePosition ?? 'right') === 'right'

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-ink-950"
      style={{ minHeight: 'clamp(600px, 80vh, 700px)' }}
    >
      {/* Outer flex: image top on mobile, side-by-side at lg */}
      <div className={cn(
        'flex min-h-[600px] flex-col lg:min-h-[700px]',
        imageRight ? 'lg:flex-row-reverse' : 'lg:flex-row',
      )}>

        {/* ── Right column (image) — renders first on mobile ── */}
        <div
          ref={imageRef}
          className="relative min-h-[400px] w-full overflow-hidden lg:min-h-0 lg:w-1/2"
        >
          <motion.div
            className="absolute inset-0"
            style={{ y: imageY }}
            initial={{ opacity: 0, x: 50 }}
            animate={isImageInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={imageSrc}
              alt="Luxury fragrance"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          {/* Warm tint overlay */}
          <div className="pointer-events-none absolute inset-0 bg-camel-500/5" />
          {/* Left fade to dark for blending */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950/60 via-transparent to-transparent lg:from-ink-950/40" />
        </div>

        {/* ── Left column (text) ── */}
        <div
          ref={textRef}
          className="relative flex w-full flex-col justify-center overflow-hidden px-8 py-16 md:px-16 lg:w-1/2 lg:px-20"
        >
          {/* ICONS watermark */}
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 select-none',
              'font-headline text-[10rem] font-bold uppercase leading-none',
              'text-stone-100/[0.04] lg:text-[14rem]',
            )}
          >
            ICONS
          </span>

          {/* Eyebrow */}
          <motion.div
            className="relative z-10 mb-8 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={isTextInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-px w-6 bg-camel-500" />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-camel-400">
              Inspired By
            </p>
          </motion.div>

          {/* Brand names — staggered */}
          {BRANDS.map((brand, i) => (
            <motion.p
              key={brand}
              custom={i}
              variants={brandVariants}
              initial="hidden"
              animate={isTextInView ? 'visible' : 'hidden'}
              className={cn(
                'relative z-10 font-display font-light leading-tight text-stone-100',
                'text-5xl md:text-6xl lg:text-7xl',
              )}
            >
              {brand}
            </motion.p>
          ))}

          {/* Subtitle */}
          <motion.p
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate={isTextInView ? 'visible' : 'hidden'}
            className="relative z-10 mt-8 max-w-sm font-body text-base leading-relaxed text-stone-400"
          >
            Inspired by the greats. Crafted for you. Our collection echoes the world&apos;s finest maisons at a fraction of the price.
          </motion.p>

          {/* CTA */}
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate={isTextInView ? 'visible' : 'hidden'}
            className="relative z-10 mt-8"
          >
            <Link
              href="/products"
              className={cn(
                'inline-flex items-center gap-3 border border-camel-500/50 px-7 py-3',
                'font-body text-[11px] uppercase tracking-[0.25em] text-camel-300',
                'transition-all duration-300 hover:border-camel-400 hover:bg-camel-500/10 hover:text-camel-200',
              )}
            >
              Shop Now
              <ArrowRight size={12} strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
