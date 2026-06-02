'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useLocale } from 'next-intl'
import type { CategoryTilesSectionBlock } from '@/lib/types'

interface Props { data: CategoryTilesSectionBlock }

interface TileItem {
  _key: string
  label_en?: string
  label_ar?: string
  imageUrl?: string
  imageAlt?: string
  href?: string
}

function Tile({ tile, locale }: { tile: TileItem; locale: string }) {
  const isAr = locale === 'ar'
  const label = isAr ? (tile.label_ar || tile.label_en) : tile.label_en
  const hasImage = !!tile.imageUrl

  const inner = (
    <div className="group relative flex h-[88px] w-[148px] flex-shrink-0 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5">
      {/* Background */}
      <div className="absolute inset-0">
        {hasImage ? (
          <Image
            src={tile.imageUrl!}
            alt={tile.imageAlt || label || ''}
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

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-end p-3 pb-3">
        <span className="font-headline text-[9.5px] font-black uppercase leading-tight tracking-[0.14em] text-white drop-shadow-sm">
          {label}
        </span>
        <div className="mt-1.5 h-[1.5px] w-0 bg-[#C8A96E] origin-left transition-all duration-300 group-hover:w-5" />
      </div>
    </div>
  )

  if (tile.href) {
    return <Link href={tile.href}>{inner}</Link>
  }
  return inner
}

export default function CategoryTilesSection({ data }: Props) {
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  const tiles: TileItem[] = (data?.tiles ?? []) as TileItem[]
  const title = locale === 'ar' ? data?.title_ar : data?.title_en
  const bg = data?.bgColor ?? '#EDE8E0'

  if (!tiles.length) return null

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor: bg }}
      className="px-4 pb-4 pt-5 sm:px-6 lg:px-8"
    >
      {title && (
        <p className="mb-2.5 text-[8px] font-bold uppercase tracking-[0.35em] text-charcoal-500">
          {title}
        </p>
      )}
      <div
        className="flex gap-2 overflow-x-auto pb-0.5"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
      >
        {tiles.map((tile) => (
          <motion.div
            key={tile._key}
            initial={{ opacity: 0, x: -12 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Tile tile={tile} locale={locale} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
