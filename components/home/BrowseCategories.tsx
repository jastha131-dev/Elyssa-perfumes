'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useLocale } from 'next-intl'
import { urlFor } from '@/lib/sanity/image'
import type { BrowseCategoriesSectionBlock } from '@/lib/types'

interface Props { data: BrowseCategoriesSectionBlock }

interface TileData {
  id: string
  label: string
  imgUrl: string | null
  href: string
}

function Tile({ tile }: { tile: TileData }) {
  return (
    <Link
      href={tile.href}
      className="group relative flex h-[88px] w-[148px] flex-shrink-0 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5"
    >
      {/* Background */}
      <div className="absolute inset-0">
        {tile.imgUrl ? (
          <Image
            src={tile.imgUrl}
            alt={tile.label}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
            sizes="148px"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#2C2B29] via-[#3D3A35] to-[#1A1916]">
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 70% 60%, #C8A96E 0%, transparent 55%)' }}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/22 to-black/5 transition-opacity duration-300 group-hover:from-black/80" />
      </div>

      {/* Gold top accent line on hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#C8A96E] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-end p-3 pb-3">
        <span className="font-headline text-[9.5px] font-black uppercase leading-tight tracking-[0.14em] text-white drop-shadow-sm">
          {tile.label}
        </span>
        <div className="mt-1.5 h-[1.5px] w-0 bg-[#C8A96E] origin-left transition-all duration-300 group-hover:w-5" />
      </div>
    </Link>
  )
}

export default function BrowseCategories({ data }: Props) {
  const locale = useLocale()
  const isAr = locale === 'ar'
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  const label = (isAr ? data?.title_ar : data?.title_en) ?? 'Browse by category'
  const bg = data?.bgColor ?? '#EDE8E0'

  const tiles: TileData[] = []

  if (data?.showAllTile !== false) {
    tiles.push({
      id: 'all',
      label: isAr ? 'كل العطور' : 'All Perfumes',
      imgUrl: null,
      href: `/${locale}/products`,
    })
  }

  for (const cat of data?.categories ?? []) {
    const name = isAr ? (cat.name_ar || cat.name_en) : cat.name_en
    const imgUrl = cat.image?.asset?._ref
      ? urlFor(cat.image).width(200).height(140).url()
      : null
    tiles.push({
      id: cat._id,
      label: name ?? '',
      imgUrl,
      href: `/${locale}/products?category=${cat.slug}`,
    })
  }

  for (const col of data?.collections ?? []) {
    const name = isAr ? (col.title_ar || col.title_en) : col.title_en
    tiles.push({
      id: col._id,
      label: name ?? '',
      imgUrl: col.imageUrl ?? null,
      href: `/${locale}/collections/${col.slug}`,
    })
  }

  if (!tiles.length) return null

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor: bg }}
      className="px-4 pb-4 pt-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1400px]">
        {label && (
          <p className="mb-2.5 font-body text-[8px] font-bold uppercase tracking-[0.35em] text-charcoal-500">
            {label}
          </p>
        )}
        <div
          className="flex gap-2 overflow-x-auto pb-0.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        >
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.id}
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Tile tile={tile} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
