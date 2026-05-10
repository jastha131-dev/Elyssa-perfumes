'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { urlFor } from '@/lib/sanity/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, Sparkles, TrendingUp, Gift, BookOpen, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { useUIStore } from '@/lib/store/ui-store'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/types'

const STATIC_LINKS = [
  { label: 'New Arrivals', href: '/products?sort=newest' },
  { label: 'Bestsellers', href: '/products?sort=popular' },
  { label: 'Journal', href: '/journal' },
  { label: 'About', href: '/about' },
]

const FALLBACK_CATEGORIES = [
  { _id: 'men', name: 'Men', slug: 'men' },
  { _id: 'women', name: 'Women', slug: 'women' },
  { _id: 'unisex', name: 'Unisex', slug: 'unisex' },
]

function useScrollPosition(threshold = 20) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return scrolled
}

interface HeaderProps {
  categories: Category[]
}

export default function Header({ categories }: HeaderProps) {
  const pathname = usePathname()
  const scrolled = useScrollPosition(20)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collectionsHovered, setCollectionsHovered] = useState(false)
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { openCart, totalItems: cartTotal } = useCartStore()
  const { totalItems: wishlistTotal } = useWishlistStore()
  const { openSearch } = useUIStore()

  // Only home page has a dark hero — all other routes need a solid header
  const effectiveScrolled = scrolled || pathname !== '/'

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false)
      }
    }
    if (mobileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileOpen])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  function handleCollectionsEnter() {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current)
    setCollectionsHovered(true)
  }

  function handleCollectionsLeave() {
    dropdownTimerRef.current = setTimeout(() => setCollectionsHovered(false), 120)
  }

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const cartCount = mounted ? cartTotal() : 0
  const wishlistCount = mounted ? wishlistTotal() : 0

  return (
    <>
      <motion.header
        animate={{
          backgroundColor: effectiveScrolled ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
          boxShadow: effectiveScrolled
            ? '0 1px 24px 0 rgba(26,26,26,0.08)'
            : '0 0 0 0 rgba(26,26,26,0)',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 right-0 top-0 z-40"
      >
        {/* Announcement bar — fades out on scroll */}
        <div
          className={cn(
            'overflow-hidden text-center transition-all duration-300',
            effectiveScrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100 border-b border-white/10'
          )}
        >
          <p className="py-2.5 font-body text-[10px] uppercase tracking-[0.3em] text-cream-100/50">
            Complimentary shipping on all orders over $100
            <span className="mx-3 text-gold-500/50">·</span>
            <Link href="/products" className="text-gold-400/80 transition-colors hover:text-gold-400">
              Explore Now
            </Link>
          </p>
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="group flex flex-col leading-none"
            aria-label="Luxe Parfum — Home"
          >
            <motion.span
              animate={{ color: effectiveScrolled ? '#1a1a1a' : '#fdf9ec' }}
              transition={{ duration: 0.3 }}
              className="font-display text-xl font-bold tracking-[0.18em] uppercase"
            >
              LUXE
            </motion.span>
            <motion.span
              animate={{ color: '#d99a1b' }}
              className="font-display text-[10px] font-medium tracking-[0.35em] uppercase text-gold-500"
            >
              PARFUM
            </motion.span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {/* Collections with dropdown */}
            <div
              className="relative"
              onMouseEnter={handleCollectionsEnter}
              onMouseLeave={handleCollectionsLeave}
            >
              <button
                className={cn(
                  'flex items-center gap-1 text-sm font-medium tracking-wide transition-colors duration-200',
                  'hover:text-gold-500',
                  pathname.startsWith('/products') || pathname.startsWith('/collections')
                    ? 'text-gold-500'
                    : effectiveScrolled
                    ? 'text-charcoal-700'
                    : 'text-cream-100'
                )}
              >
                Collections
                <motion.span
                  animate={{ rotate: collectionsHovered ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.span>
              </button>

              <AnimatePresence>
                {collectionsHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="absolute left-1/2 top-full -translate-x-1/2 pt-4"
                    onMouseEnter={handleCollectionsEnter}
                    onMouseLeave={handleCollectionsLeave}
                  >
                    {/* Luxury mega-menu */}
                    <div className="w-[480px] overflow-hidden border border-gold-500/20 bg-[#0f0f0f] shadow-2xl shadow-black/60">
                      {/* Gold gradient top accent */}
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

                      <div className="grid grid-cols-2">
                        {/* Left: Shop by category */}
                        <div className="border-r border-white/8 px-6 py-6">
                          <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.35em] text-gold-500/60">
                            Shop
                          </p>

                          <Link
                            href="/products"
                            className="group/all mb-4 flex items-center justify-between transition-colors"
                          >
                            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400 transition-colors group-hover/all:text-gold-300">
                              All Fragrances
                            </span>
                            <ArrowRight className="h-3 w-3 text-gold-500 transition-all duration-200 group-hover/all:translate-x-0.5 group-hover/all:text-gold-300" />
                          </Link>

                          <div className="mb-4 h-px bg-white/8" />

                          <ul className="space-y-1">
                            {(categories.length > 0 ? categories : FALLBACK_CATEGORIES).map((cat) => {
                              const imgUrl = (cat as Category).image?.asset?._ref
                                ? urlFor((cat as Category).image).width(80).height(80).url()
                                : null
                              return (
                                <li key={cat._id}>
                                  <Link
                                    href={`/products?category=${cat.slug}`}
                                    className="group/item flex items-center gap-3 border-l-2 border-transparent py-1.5 pl-1 transition-all duration-200 hover:border-gold-500"
                                  >
                                    <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden bg-charcoal-800">
                                      {imgUrl ? (
                                        <Image
                                          src={imgUrl}
                                          alt={cat.name}
                                          fill
                                          className="object-cover opacity-60 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:scale-105"
                                        />
                                      ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-charcoal-700 to-charcoal-900" />
                                      )}
                                    </div>
                                    <span className="text-sm font-light tracking-wide text-cream-300 transition-colors group-hover/item:text-cream-100">
                                      {cat.name}
                                    </span>
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        </div>

                        {/* Right: Discover */}
                        <div className="px-6 py-6">
                          <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.35em] text-gold-500/60">
                            Discover
                          </p>

                          <ul className="space-y-1">
                            {[
                              { href: '/products?sort=newest', icon: Sparkles, label: 'New Arrivals', sub: 'Latest releases' },
                              { href: '/products?sort=best_selling', icon: TrendingUp, label: 'Bestsellers', sub: 'Most loved' },
                              { href: '/products?category=gift-sets', icon: Gift, label: 'Gift Sets', sub: 'For someone special' },
                              { href: '/journal', icon: BookOpen, label: 'Journal', sub: 'Stories & guides' },
                            ].map(({ href, icon: Icon, label, sub }) => (
                              <li key={href}>
                                <Link
                                  href={href}
                                  className="group/item flex items-center gap-3 rounded-sm py-2.5 transition-colors"
                                >
                                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gold-500 transition-colors duration-200 group-hover/item:border-gold-500/40 group-hover/item:bg-gold-500/10">
                                    <Icon className="h-3.5 w-3.5" />
                                  </span>
                                  <div>
                                    <span className="block text-[13px] font-light leading-tight tracking-wide text-cream-200 transition-colors group-hover/item:text-cream-100">
                                      {label}
                                    </span>
                                    <span className="block text-[10px] tracking-wide text-cream-400/60">
                                      {sub}
                                    </span>
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Bottom gold gradient */}
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Static links */}
            {STATIC_LINKS.map((link) => {
              const isActive = !link.href.includes('?') && pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative text-sm font-medium tracking-wide transition-colors duration-200',
                    'after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full',
                    'after:origin-left after:scale-x-0 after:bg-gold-500 after:transition-transform after:duration-300',
                    'hover:text-gold-500 hover:after:scale-x-100',
                    isActive ? 'text-gold-500 after:scale-x-100' : '',
                    effectiveScrolled ? 'text-charcoal-700' : 'text-cream-100'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <IconButton onClick={openSearch} label="Open search" scrolled={effectiveScrolled}>
              <Search className="h-5 w-5" />
            </IconButton>

            <IconButton
              href="/wishlist"
              label={`Wishlist (${wishlistCount} items)`}
              scrolled={effectiveScrolled}
              badge={wishlistCount}
            >
              <Heart className="h-5 w-5" />
            </IconButton>

            <IconButton
              onClick={() => openCart()}
              label={`Open cart (${cartCount} items)`}
              scrolled={effectiveScrolled}
              badge={cartCount}
            >
              <ShoppingBag className="h-5 w-5" />
            </IconButton>

            {/* Mobile hamburger */}
            <motion.button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className={cn(
                'ml-1 rounded-full p-2 transition-colors duration-200 lg:hidden',
                effectiveScrolled
                  ? 'text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-900'
                  : 'text-cream-100 hover:bg-white/10 hover:text-white'
              )}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex"
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 bg-charcoal-900/30 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={mobileMenuRef}
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed left-0 right-0 top-[72px] z-40 bg-[#0f0f0f] shadow-2xl shadow-black/50 lg:hidden"
          >
            {/* Gold gradient top accent */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
            <nav
              className="mx-auto max-w-7xl px-4 pb-8 pt-2 sm:px-6"
              aria-label="Mobile navigation"
            >
              <ul className="flex flex-col divide-y divide-white/10">
                {/* Collections accordion */}
                <li>
                  <button
                    onClick={() => setMobileCollectionsOpen((v) => !v)}
                    className="flex w-full items-center justify-between py-4 text-base font-medium tracking-wide text-cream-100 hover:text-gold-400 transition-colors"
                  >
                    Collections
                    <motion.span
                      animate={{ rotate: mobileCollectionsOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {mobileCollectionsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        {/* Shop section */}
                        <p className="mb-2 mt-1 px-4 text-[9px] font-semibold uppercase tracking-[0.35em] text-gold-500/60">
                          Shop
                        </p>

                        <Link
                          href="/products"
                          className="group/all mb-3 flex items-center justify-between px-4 py-2 transition-colors"
                        >
                          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400 group-hover/all:text-gold-300 transition-colors">
                            All Fragrances
                          </span>
                          <ArrowRight className="h-3 w-3 text-gold-500 transition-all duration-200 group-hover/all:translate-x-0.5 group-hover/all:text-gold-300" />
                        </Link>

                        <ul className="mb-4 space-y-1 px-4">
                          {(categories.length > 0 ? categories : FALLBACK_CATEGORIES).map((cat) => {
                            const imgUrl = (cat as Category).image?.asset?._ref
                              ? urlFor((cat as Category).image).width(64).height(64).url()
                              : null
                            return (
                              <li key={cat._id}>
                                <Link
                                  href={`/products?category=${cat.slug}`}
                                  className="group/item flex items-center gap-3 border-l-2 border-transparent py-1.5 pl-1 transition-all duration-200 hover:border-gold-500"
                                >
                                  <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden bg-charcoal-800">
                                    {imgUrl ? (
                                      <Image
                                        src={imgUrl}
                                        alt={cat.name}
                                        fill
                                        className="object-cover opacity-70 transition-all duration-300 group-hover/item:opacity-100"
                                      />
                                    ) : (
                                      <div className="h-full w-full bg-charcoal-700" />
                                    )}
                                  </div>
                                  <span className="text-sm font-light tracking-wide text-cream-300 transition-colors group-hover/item:text-cream-100">
                                    {cat.name}
                                  </span>
                                </Link>
                              </li>
                            )
                          })}
                        </ul>

                        {/* Discover section */}
                        <div className="mx-4 mb-3 h-px bg-white/10" />
                        <p className="mb-2 px-4 text-[9px] font-semibold uppercase tracking-[0.35em] text-gold-500/60">
                          Discover
                        </p>

                        <ul className="mb-4 space-y-1 px-4">
                          {[
                            { href: '/products?sort=newest', icon: Sparkles, label: 'New Arrivals', sub: 'Latest releases' },
                            { href: '/products?sort=best_selling', icon: TrendingUp, label: 'Bestsellers', sub: 'Most loved' },
                            { href: '/products?category=gift-sets', icon: Gift, label: 'Gift Sets', sub: 'For someone special' },
                            { href: '/journal', icon: BookOpen, label: 'Journal', sub: 'Stories & guides' },
                          ].map(({ href, icon: Icon, label, sub }) => (
                            <li key={href}>
                              <Link
                                href={href}
                                className="group/item flex items-center gap-3 py-2 transition-colors"
                              >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gold-500 transition-colors duration-200 group-hover/item:border-gold-500/40 group-hover/item:bg-gold-500/10">
                                  <Icon className="h-3.5 w-3.5" />
                                </span>
                                <div>
                                  <span className="block text-[13px] font-light leading-tight tracking-wide text-cream-200 transition-colors group-hover/item:text-cream-100">
                                    {label}
                                  </span>
                                  <span className="block text-[10px] tracking-wide text-cream-400/60">
                                    {sub}
                                  </span>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>

                {/* Static links */}
                {STATIC_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 + 0.05, duration: 0.22 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'block py-4 text-base font-medium tracking-wide transition-colors',
                        'hover:text-gold-500',
                        pathname === link.href ? 'text-gold-400' : 'text-cream-100'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Mobile bottom actions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-6 flex flex-col gap-3"
              >
                <Link
                  href="/wishlist"
                  className="flex items-center gap-2 text-sm text-cream-300 hover:text-gold-400 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-medium text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Shared icon button helper ────────────────────────────────────────────────

interface IconButtonProps {
  children: React.ReactNode
  label: string
  scrolled: boolean
  badge?: number
  onClick?: () => void
  href?: string
}

function IconButton({ children, label, scrolled, badge, onClick, href }: IconButtonProps) {
  const baseClass = cn(
    'relative rounded-full p-2 transition-colors duration-200',
    scrolled
      ? 'text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-900'
      : 'text-cream-100 hover:bg-white/10 hover:text-white'
  )

  const badgeEl =
    badge != null && badge > 0 ? (
      <motion.span
        key={badge}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-semibold text-white"
      >
        {badge > 99 ? '99+' : badge}
      </motion.span>
    ) : null

  if (href) {
    return (
      <Link href={href} aria-label={label} className={baseClass}>
        {children}
        {badgeEl}
      </Link>
    )
  }

  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      className={baseClass}
      whileTap={{ scale: 0.88 }}
    >
      {children}
      {badgeEl}
    </motion.button>
  )
}
