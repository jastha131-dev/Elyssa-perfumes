'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Category, CategoriesSectionBlock } from '@/lib/types'
import { urlFor } from '@/lib/sanity/image'

interface CategoriesProps {
  data: CategoriesSectionBlock
}

const FALLBACK = [
  {
    _id: 'men',
    name: 'Men',
    slug: 'men',
    gradient: 'from-stone-800 via-stone-700 to-stone-600',
    tagline: 'Bold & Distinguished',
  },
  {
    _id: 'women',
    name: 'Women',
    slug: 'women',
    gradient: 'from-stone-900 via-stone-800 to-stone-700',
    tagline: 'Elegant & Alluring',
  },
  {
    _id: 'unisex',
    name: 'Unisex',
    slug: 'unisex',
    gradient: 'from-stone-700 via-stone-800 to-stone-900',
    tagline: 'Beyond Boundaries',
  },
]

const LOCAL_CAT_IMAGES = [
  '/images/categories/I1.webp',
  '/images/categories/I2.webp',
  '/images/categories/I3.webp',
]

const GRADIENTS = [
  'from-stone-800 via-stone-700 to-stone-600',
  'from-stone-900 via-stone-800 to-stone-700',
  'from-stone-700 via-stone-800 to-stone-900',
  'from-stone-800 via-stone-900 to-stone-800',
]

interface CardData {
  _id: string
  name: string
  slug: string
  imageUrl?: string
  gradient: string
  tagline?: string
}

function CategoryCard({ name, slug, imageUrl, gradient, tagline }: CardData) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link href={`/products?category=${slug}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              quality={90}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div
              className={cn(
                'h-full w-full bg-stone-200 bg-gradient-to-br transition-transform duration-700 ease-out group-hover:scale-105',
                gradient
              )}
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/20 to-transparent" />
          <div className="absolute inset-0 bg-ink-950/0 transition-colors duration-500 group-hover:bg-ink-950/10" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
              {tagline && (
                <p className="mb-1 font-body text-[11px] uppercase tracking-[0.3em] text-camel-300/80">
                  {tagline}
                </p>
              )}
              <h3 className="font-display text-3xl font-light text-stone-50 md:text-4xl">
                {name}
              </h3>
            </div>

            <div
              className={cn(
                'mt-3 flex items-center gap-2',
                'translate-y-4 opacity-0 transition-all duration-300 ease-out',
                'group-hover:translate-y-0 group-hover:opacity-100'
              )}
            >
              <span className="font-body text-xs uppercase tracking-[0.2em] text-camel-300">
                Explore
              </span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight size={14} className="text-camel-400" strokeWidth={1.5} />
              </motion.div>
            </div>
          </div>

          {/* Camel border hover */}
          <div className="pointer-events-none absolute inset-0 border border-camel-500/0 transition-all duration-500 group-hover:border-camel-500/25" />
        </div>
      </Link>
    </motion.div>
  )
}

export default function Categories({ data }: CategoriesProps) {
  const categories: Category[] = (data?.categories ?? []) as Category[]
  const title = data?.title ?? 'Shop Categories'

  const headingRef = useRef<HTMLDivElement>(null)
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' })

  // Build display items: use ALL real Sanity categories, or fallback to 3 hardcoded
  let cards: CardData[]

  if (categories && categories.length > 0) {
    cards = categories.map((cat, i) => {
      let imageUrl: string | undefined
      if (cat.image?.asset?._ref) {
        try {
          imageUrl = urlFor(cat.image).width(800).height(800).url()
        } catch {
          imageUrl = undefined
        }
      }
      imageUrl = imageUrl || LOCAL_CAT_IMAGES[i % LOCAL_CAT_IMAGES.length]
      return {
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        imageUrl,
        gradient: GRADIENTS[i % GRADIENTS.length],
        tagline: undefined,
      }
    })
  } else {
    cards = FALLBACK.map((f, i) => ({ ...f, imageUrl: LOCAL_CAT_IMAGES[i % LOCAL_CAT_IMAGES.length] }))
  }

  // Grid class adapts to count
  const gridClass =
    cards.length === 1
      ? 'grid-cols-1'
      : cards.length === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : cards.length === 4
      ? 'grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 text-center"
        >
          <p className="mb-3 font-body text-xs uppercase tracking-widest text-camel-500">
            Explore By
          </p>
          <h2 className="font-headline font-bold uppercase text-ink-900 text-4xl md:text-5xl">
            {title}
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-camel-500/50" />
        </motion.div>

        {/* Grid */}
        <div className={cn('grid gap-4 md:gap-6', gridClass)}>
          {cards.map((card) => (
            <CategoryCard key={card._id} {...card} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-14 text-center"
        >
          <Link
            href="/products"
            className={cn(
              'group inline-flex items-center gap-3 border border-ink-800 px-10 py-3.5',
              'font-body text-sm uppercase tracking-[0.2em] text-ink-800',
              'transition-all duration-300 hover:bg-ink-900 hover:text-white'
            )}
          >
            Shop Now
            <ArrowRight
              size={13}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
