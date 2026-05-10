'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GalleryImage {
  url: string
  alt: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const safeImages = images.length > 0 ? images : []

  // ── Lightbox keyboard navigation ──────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') {
        setLightboxOpen(false)
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((i) => (i - 1 + safeImages.length) % safeImages.length)
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((i) => (i + 1) % safeImages.length)
      }
    },
    [lightboxOpen, safeImages.length]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightboxOpen])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const prev = () =>
    setActiveIndex((i) => (i - 1 + safeImages.length) % safeImages.length)
  const next = () =>
    setActiveIndex((i) => (i + 1) % safeImages.length)

  const lightboxPrev = () =>
    setLightboxIndex((i) => (i - 1 + safeImages.length) % safeImages.length)
  const lightboxNext = () =>
    setLightboxIndex((i) => (i + 1) % safeImages.length)

  if (safeImages.length === 0) return null

  return (
    <>
      {/* ── Main gallery ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {/* Large image */}
        <div
          className="relative aspect-[3/4] overflow-hidden bg-cream-100 cursor-zoom-in group select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => openLightbox(activeIndex)}
          role="button"
          tabIndex={0}
          aria-label={`View ${safeImages[activeIndex]?.alt || 'product image'} in full screen`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              openLightbox(activeIndex)
            }
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <Image
                src={safeImages[activeIndex].url}
                alt={safeImages[activeIndex].alt || ''}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom hint */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center bg-charcoal-900/10"
                aria-hidden="true"
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm text-charcoal-800">
                  <ZoomIn size={12} />
                  <span className="text-[10px] tracking-wider uppercase font-medium">
                    Click to zoom
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prev/next arrows (only when multiple images) */}
          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
                className={cn(
                  'absolute left-3 top-1/2 -translate-y-1/2',
                  'w-8 h-8 flex items-center justify-center',
                  'bg-white/80 backdrop-blur-sm text-charcoal-800',
                  'hover:bg-white transition-colors duration-150',
                  'opacity-0 group-hover:opacity-100 transition-opacity',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500'
                )}
                aria-label="Previous image"
              >
                <ChevronLeft size={14} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2',
                  'w-8 h-8 flex items-center justify-center',
                  'bg-white/80 backdrop-blur-sm text-charcoal-800',
                  'hover:bg-white transition-colors duration-150',
                  'opacity-0 group-hover:opacity-100 transition-opacity',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500'
                )}
                aria-label="Next image"
              >
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {safeImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" aria-hidden="true">
              {safeImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveIndex(i)
                  }}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all duration-200',
                    i === activeIndex
                      ? 'bg-gold-500 w-4'
                      : 'bg-white/60 hover:bg-white/90'
                  )}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {safeImages.length > 1 && (
          <div
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
            role="tablist"
            aria-label="Product images"
          >
            {safeImages.map((img, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={img.alt || `Product image ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  'relative w-16 h-16 shrink-0 overflow-hidden bg-cream-100',
                  'transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                  i === activeIndex
                    ? 'ring-2 ring-gold-500 ring-offset-0'
                    : 'ring-1 ring-charcoal-100 opacity-60 hover:opacity-100'
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt || ''}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Mobile swipe hint */}
        {safeImages.length > 1 && (
          <p className="text-[10px] text-center text-charcoal-300 tracking-wide md:hidden" aria-hidden="true">
            Swipe thumbnails to see more
          </p>
        )}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-950/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Image container */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full max-w-2xl mx-4 aspect-[3/4]"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.28 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={safeImages[lightboxIndex].url}
                    alt={safeImages[lightboxIndex].alt || ''}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className={cn(
                'absolute top-4 right-4',
                'w-10 h-10 flex items-center justify-center',
                'bg-white/10 text-white hover:bg-white/20 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
              )}
              aria-label="Close lightbox"
            >
              <X size={18} aria-hidden="true" />
            </button>

            {/* Nav: prev */}
            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    lightboxPrev()
                  }}
                  className={cn(
                    'absolute left-4 top-1/2 -translate-y-1/2',
                    'w-10 h-10 flex items-center justify-center',
                    'bg-white/10 text-white hover:bg-white/20 transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
                  )}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    lightboxNext()
                  }}
                  className={cn(
                    'absolute right-4 top-1/2 -translate-y-1/2',
                    'w-10 h-10 flex items-center justify-center',
                    'bg-white/10 text-white hover:bg-white/20 transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
                  )}
                  aria-label="Next image"
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </>
            )}

            {/* Counter */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs tracking-widest"
              aria-live="polite"
              aria-atomic="true"
            >
              {lightboxIndex + 1} / {safeImages.length}
            </div>

            {/* Keyboard hint */}
            <p className="absolute bottom-6 right-6 text-white/30 text-[10px] tracking-wider hidden lg:block" aria-hidden="true">
              ← → to navigate · ESC to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
