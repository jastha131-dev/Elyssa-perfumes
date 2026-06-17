'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { urlFor } from '@/lib/sanity/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, Sparkles, TrendingUp, Gift, BookOpen, ArrowRight, HelpCircle, Mail, User } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { useUIStore } from '@/lib/store/ui-store'
import { cn } from '@/lib/utils'
import type { Category, NavPage, NavItem, MenuPromo, SiteLogo, Collection, AnnouncementBar as AnnouncementBarType } from '@/lib/types'
import LanguageSwitcher from './LanguageSwitcher'
import AnnouncementBarComponent from './AnnouncementBar'

const FALLBACK_CATEGORIES = [
  { _id: 'men', name_en: 'Men', name_ar: 'رجالي', slug: 'men' },
  { _id: 'women', name_en: 'Women', name_ar: 'نسائي', slug: 'women' },
  { _id: 'unisex', name_en: 'Unisex', name_ar: 'جنسين', slug: 'unisex' },
]

const FALLBACK_NAV_ITEMS: NavItem[] = [
  { label_en: 'New Arrivals', label_ar: 'الوافدون الجدد',  href: '/products?filter=new',    highlight: false, visible: true },
  { label_en: 'Bestsellers',  label_ar: 'الأكثر مبيعاً',   href: '/products?sort=popular',   highlight: false, visible: true },
  { label_en: 'Journal',      label_ar: 'المجلة',            href: '/journal',                 highlight: false, visible: true },
  { label_en: 'About',        label_ar: 'من نحن',            href: '/about',                   highlight: false, visible: true },
  { label_en: 'FAQ',          label_ar: 'الأسئلة الشائعة',  href: '/faq',                     highlight: false, visible: true },
  { label_en: 'Contact',      label_ar: 'تواصل معنا',        href: '/contact',                 highlight: false, visible: true },
  { label_en: 'Scent Quiz',   label_ar: 'اختبار العطور',     href: '/quiz',                    highlight: true,  visible: true },
]

interface HeaderProps {
  categories: Category[]
  collections?: Collection[]
  navPages?: NavPage[]
  navItems?: NavItem[]
  menuPromo?: MenuPromo | null
  siteLogo?: SiteLogo | null
  announcementBar?: AnnouncementBarType | null
}

export default function Header({ categories, collections = [], navPages = [], navItems = [], menuPromo = null, siteLogo = null, announcementBar = null }: HeaderProps) {
  const pathname = usePathname()
  const t = useTranslations('nav')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const promo = {
    badge: menuPromo ? (isAr ? menuPromo.badge_ar || menuPromo.badge_en : menuPromo.badge_en) : undefined,
    label: menuPromo ? (isAr ? menuPromo.label_ar || menuPromo.label_en : menuPromo.label_en) : undefined,
    headline: menuPromo ? (isAr ? menuPromo.headline_ar || menuPromo.headline_en : menuPromo.headline_en) : undefined,
    subtext: menuPromo ? (isAr ? menuPromo.subtext_ar || menuPromo.subtext_en : menuPromo.subtext_en) : undefined,
    ctaLabel: menuPromo ? (isAr ? menuPromo.ctaLabel_ar || menuPromo.ctaLabel_en : menuPromo.ctaLabel_en) : undefined,
    image: menuPromo?.imageUrl,
    link: menuPromo?.ctaLink,
  }

  const resolvedItems = (navItems.length > 0 ? navItems : FALLBACK_NAV_ITEMS)
    .filter((item) => item.visible !== false)

  const regularLinks = resolvedItems.filter((item) => !item.highlight)
  const highlightLinks = resolvedItems.filter((item) => item.highlight)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [collectionsHovered, setCollectionsHovered] = useState(false)
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(108)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { openCart, totalItems: cartTotal } = useCartStore()
  const { totalItems: wishlistTotal } = useWishlistStore()
  const { openSearch } = useUIStore()

  useEffect(() => {
    setMobileOpen(false)
    setCollectionsHovered(false)
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current)
  }, [pathname])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target as Node)
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

  useEffect(() => {
    if (!headerRef.current) return
    const update = () => {
      const h = headerRef.current!.offsetHeight
      setHeaderHeight(h)
      document.documentElement.style.setProperty('--header-h', `${h}px`)
    }
    const ro = new ResizeObserver(update)
    ro.observe(headerRef.current)
    update()
    return () => ro.disconnect()
  }, [])

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

  // ── Desktop header item order (admin-controlled via Site Settings) ──
  const DEFAULT_HEADER_ORDER = ['logo', 'spacer', 'nav', 'spacer', 'language', 'currency', 'account', 'search', 'wishlist', 'cart']
  const headerOrder = siteLogo?.desktopHeaderOrder && siteLogo.desktopHeaderOrder.length > 0
    ? siteLogo.desktopHeaderOrder
    : DEFAULT_HEADER_ORDER
  const orderOf = (token: string) => {
    const i = headerOrder.indexOf(token)
    return i < 0 ? 99 : i
  }

  const logoEl = (
    <Link href={`/${locale}`} className="group flex items-center leading-none" aria-label="Home">
      {siteLogo?.logoUrl ? (
        <Image src={siteLogo.logoUrl} alt={siteLogo.logoAlt || 'Logo'} width={130} height={32} className="h-6 w-auto object-contain" priority />
      ) : (
        <span className="flex flex-col">
          <span className="font-display text-base font-bold tracking-[0.18em] uppercase leading-none text-charcoal-900">
            {(isAr ? siteLogo?.logoText_ar || siteLogo?.logoText_en : siteLogo?.logoText_en) || 'LUXE'}
          </span>
          {(isAr ? siteLogo?.logoSubtext_ar || siteLogo?.logoSubtext_en : siteLogo?.logoSubtext_en) && (
            <span className="font-display text-[9px] font-medium tracking-[0.35em] uppercase text-camel-500">
              {isAr ? siteLogo?.logoSubtext_ar || siteLogo?.logoSubtext_en : siteLogo?.logoSubtext_en}
            </span>
          )}
        </span>
      )}
    </Link>
  )

  return (
    <>
      <header ref={headerRef} className="fixed left-0 right-0 top-0 z-40 bg-white shadow-sm border-b border-stone-200">
        {announcementBar && <AnnouncementBarComponent data={announcementBar} />}

        {/* ── Mobile / tablet bar ── */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:hidden">
          <div className="flex items-center gap-2">
            <motion.button
              ref={hamburgerRef}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="-ml-1 rounded-full p-2 text-charcoal-700 transition-colors duration-200 hover:bg-stone-100 rtl:-ml-0 rtl:-mr-1"
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
            {logoEl}
          </div>
          <div className="flex items-center gap-1">
            <IconButton href={`/${locale}/account`} label="My Account">
              <User className="h-5 w-5" />
            </IconButton>
            <IconButton href={`/${locale}/wishlist`} label={`Wishlist (${wishlistCount} items)`} badge={wishlistCount}>
              <Heart className="h-5 w-5" />
            </IconButton>
            <IconButton onClick={() => openCart()} label={`Open cart (${cartCount} items)`} badge={cartCount}>
              <ShoppingBag className="h-5 w-5" />
            </IconButton>
          </div>
        </div>

        {/* ── Desktop bar (admin-ordered, left → right) ── */}
        <div className="mx-auto hidden max-w-7xl items-center gap-x-3 px-4 py-3 sm:px-6 lg:flex lg:px-8">
          {headerOrder.map((tok, i) => (tok === 'spacer' ? <div key={`sp-${i}`} className="flex-1" style={{ order: i }} /> : null))}
          <div style={{ order: orderOf('logo') }}>{logoEl}</div>

          {/* Desktop nav */}
          <nav className="flex items-center gap-8" style={{ order: orderOf('nav') }} aria-label="Main navigation">
            {/* Collections with dropdown */}
            <div
              className="relative"
              onMouseEnter={handleCollectionsEnter}
              onMouseLeave={handleCollectionsLeave}
            >
              <button
                className={cn(
                  'flex items-center gap-1 text-sm font-medium tracking-wide transition-colors duration-200',
                  'hover:text-camel-500',
                  pathname.startsWith(`/${locale}/products`) || pathname.startsWith(`/${locale}/collections`)
                    ? 'text-camel-500'
                    : 'text-charcoal-700'
                )}
              >
                {t('collections')}
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
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="fixed left-0 right-0 flex justify-center"
                    style={{ top: headerHeight }}
                    onMouseEnter={handleCollectionsEnter}
                    onMouseLeave={handleCollectionsLeave}
                  >
                    {/* 4-col luxury mega-menu */}
                    <div className="w-[1080px] overflow-hidden rounded-b-xl border border-stone-200 bg-white shadow-2xl shadow-black/15">
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-camel-500 to-transparent" />

                      <div className="grid min-h-[460px] grid-cols-[250px_1fr_210px_280px]">

                        {/* ── Col 1: Shop All + Categories ── */}
                        <div className="flex flex-col justify-center border-r border-stone-100 px-5 py-8">
                          {/* Shop All */}
                          <Link
                            href={`/${locale}/products`}
                            className="group/all mb-5 flex items-center justify-between rounded-sm border border-camel-500/30 bg-camel-50 px-3 py-2.5 transition-all duration-200 hover:border-camel-500/60 hover:bg-camel-100"
                          >
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-camel-600 transition-colors group-hover/all:text-camel-700">
                                {t('allFragrances')}
                              </span>
                              <span className="block text-[9px] text-charcoal-400 tracking-wide">
                                {t('fullCollection')}
                              </span>
                            </div>
                            <ArrowRight className="h-3 w-3 flex-shrink-0 text-camel-500/60 transition-all duration-200 group-hover/all:translate-x-0.5 group-hover/all:text-camel-500" />
                          </Link>

                          <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.4em] text-camel-500">
                            {t('shopByCategory')}
                          </p>

                          <ul className="space-y-0.5">
                            {(categories.length > 0 ? categories : FALLBACK_CATEGORIES).map((cat) => {
                              const catName = locale === 'ar' ? (cat as Category).name_ar : (cat as Category).name_en
                              const imgUrl = (cat as Category).image?.asset?._ref
                                ? urlFor((cat as Category).image).width(96).height(96).url()
                                : null
                              const subs = (cat as Category).subcategories ?? []
                              return (
                                <li key={cat._id}>
                                  <Link
                                    href={`/${locale}/products?category=${cat.slug}`}
                                    className="group/item flex items-center gap-3 border-l-2 rtl:border-l-0 rtl:border-r-2 border-transparent py-2 pl-1 rtl:pl-0 rtl:pr-1 transition-all duration-200 hover:border-camel-500 hover:pl-2 rtl:hover:pl-0 rtl:hover:pr-2"
                                  >
                                    <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden bg-stone-100">
                                      {imgUrl ? (
                                        <Image
                                          src={imgUrl}
                                          alt={catName ?? ''}
                                          fill
                                          className="object-cover opacity-70 transition-all duration-400 group-hover/item:opacity-100 group-hover/item:scale-110"
                                        />
                                      ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-stone-100 to-stone-200" />
                                      )}
                                    </div>
                                    <div>
                                      <span className="block text-sm font-light tracking-wide text-charcoal-700 transition-colors group-hover/item:text-charcoal-900">
                                        {catName}
                                      </span>
                                      <span className="block text-[9px] tracking-wide text-charcoal-400 transition-colors group-hover/item:text-charcoal-500">
                                        {t('shopArrow')}
                                      </span>
                                    </div>
                                  </Link>
                                  {subs.length > 0 && (
                                    <ul className="ml-[52px] rtl:ml-0 rtl:mr-[52px] mb-1 flex flex-wrap gap-x-2 gap-y-0.5">
                                      {subs.map((sub) => {
                                        const subName = locale === 'ar' ? (sub.name_ar || sub.name_en) : sub.name_en
                                        return (
                                          <li key={sub._id}>
                                            <Link
                                              href={`/${locale}/products?category=${sub.slug}`}
                                              className="text-[10px] tracking-wide text-charcoal-400 transition-colors hover:text-camel-500"
                                            >
                                              {subName}
                                            </Link>
                                          </li>
                                        )
                                      })}
                                    </ul>
                                  )}
                                </li>
                              )
                            })}
                          </ul>
                        </div>

                        {/* ── Col 2: Discover + Fragrance Families ── */}
                        <div className="flex flex-col justify-center border-r border-stone-100 px-5 py-8">
                          <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.4em] text-camel-500">
                            {t('discover')}
                          </p>

                          <ul className="mb-5 space-y-0.5">
                            {[
                              { href: `/${locale}/products?filter=new`,       icon: Sparkles,   label: t('newArrivals'),  sub: t('latestReleases'),    badge: 'New' },
                              { href: `/${locale}/products?filter=bestseller`, icon: TrendingUp, label: t('bestsellers'),  sub: t('mostLoved'),          badge: null },
                              { href: `/${locale}/collections/gift-sets`,icon: Gift,       label: t('giftSets'),     sub: t('forSomeoneSpecial'),  badge: null },
                              { href: `/${locale}/journal`,                    icon: BookOpen,   label: t('journal'),      sub: t('storiesGuides'),      badge: null },
                              { href: `/${locale}/quiz`,                       icon: Sparkles,   label: t('quiz'),         sub: t('aiMatching'),        badge: 'AI' },
                              { href: `/${locale}/faq`,                        icon: HelpCircle, label: t('faq'),          sub: t('commonQuestions'),    badge: null },
                              { href: `/${locale}/contact`,                    icon: Mail,       label: t('contact'),      sub: t('getInTouch'),         badge: null },
                            ].map(({ href, icon: Icon, label, sub, badge }) => (
                              <li key={href}>
                                <Link
                                  href={href}
                                  className="group/item flex items-center gap-3 border-l-2 rtl:border-l-0 rtl:border-r-2 border-transparent py-2.5 pl-1 rtl:pl-0 rtl:pr-1 transition-all duration-200 hover:border-camel-500 hover:pl-2 rtl:hover:pl-0 rtl:hover:pr-2"
                                >
                                  <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-stone-200 bg-stone-50 text-camel-500 transition-all duration-200 group-hover/item:border-camel-500/40 group-hover/item:bg-camel-50 group-hover/item:text-camel-600">
                                    <Icon className="h-3.5 w-3.5" />
                                  </span>
                                  <div className="flex-1">
                                    <span className="flex items-center gap-2 text-[13px] font-light leading-tight tracking-wide text-charcoal-700 transition-colors group-hover/item:text-charcoal-900">
                                      {label}
                                      {badge && (
                                        <span className="rounded-full bg-camel-500 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                                          {badge}
                                        </span>
                                      )}
                                    </span>
                                    <span className="block text-[10px] tracking-wide text-charcoal-400">
                                      {sub}
                                    </span>
                                  </div>
                                  <ArrowRight className="h-3 w-3 flex-shrink-0 text-charcoal-300 transition-all duration-200 group-hover/item:translate-x-0.5 group-hover/item:text-camel-500" />
                                </Link>
                              </li>
                            ))}
                          </ul>

                        </div>

                        {/* ── Col 3: Fragrance Family (own column) + Featured Collections ── */}
                        <div className="flex flex-col justify-center border-r border-stone-100 px-5 py-8">
                          <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.4em] text-camel-500">
                            {t('fragranceFamily')}
                          </p>
                          <ul className="space-y-0.5">
                            {([
                              { key: 'woody',    label: t('familyWoody'),    dot: '#9C6B3F' },
                              { key: 'floral',   label: t('familyFloral'),   dot: '#D98AA8' },
                              { key: 'citrus',   label: t('familyCitrus'),   dot: '#E3B23C' },
                              { key: 'oriental', label: t('familyOriental'), dot: '#B5562E' },
                              { key: 'fresh',    label: t('familyFresh'),    dot: '#6FA8A0' },
                              { key: 'aquatic',  label: t('familyAquatic'),  dot: '#5B8FB5' },
                              { key: 'gourmand', label: t('familyGourmand'), dot: '#C08552' },
                            ] as const).map(({ key, label, dot }) => (
                              <li key={key}>
                                <Link
                                  href={`/${locale}/products?family=${key}`}
                                  className="group/fam flex items-center gap-2.5 border-l-2 rtl:border-l-0 rtl:border-r-2 border-transparent py-1.5 pl-1 rtl:pl-0 rtl:pr-1 transition-all duration-200 hover:border-camel-500 hover:pl-2 rtl:hover:pl-0 rtl:hover:pr-2"
                                >
                                  <span className="h-2 w-2 flex-shrink-0 rounded-full ring-1 ring-black/5" style={{ backgroundColor: dot }} />
                                  <span className="flex-1 text-[12px] font-light tracking-wide text-charcoal-600 transition-colors group-hover/fam:text-charcoal-900">
                                    {label}
                                  </span>
                                  <ArrowRight className="h-2.5 w-2.5 flex-shrink-0 text-charcoal-300 transition-all duration-200 group-hover/fam:translate-x-0.5 group-hover/fam:text-camel-500" />
                                </Link>
                              </li>
                            ))}
                          </ul>

                          {collections && collections.length > 0 && (
                            <>
                              <div className="my-4 h-px bg-stone-100" />
                              <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.4em] text-camel-500">
                                {t('collections')}
                              </p>
                              <ul className="space-y-0.5">
                                {collections.slice(0, 5).map((col) => {
                                  const cName = locale === 'ar' ? (col.title_ar || col.title_en) : col.title_en
                                  return (
                                    <li key={col._id}>
                                      <Link
                                        href={`/${locale}/collections/${col.slug}`}
                                        className="group/col flex items-center justify-between border-l-2 rtl:border-l-0 rtl:border-r-2 border-transparent py-1.5 pl-1 rtl:pl-0 rtl:pr-1 text-[12px] font-light tracking-wide text-charcoal-600 transition-all duration-200 hover:border-camel-500 hover:pl-2 rtl:hover:pl-0 rtl:hover:pr-2 hover:text-camel-600"
                                      >
                                        <span>{cName}</span>
                                        <ArrowRight className="h-2.5 w-2.5 flex-shrink-0 text-charcoal-300 transition-all duration-200 group-hover/col:translate-x-0.5 group-hover/col:text-camel-500" />
                                      </Link>
                                    </li>
                                  )
                                })}
                              </ul>
                            </>
                          )}
                        </div>

                        {/* ── Col 4: Editorial panel ── */}
                        <div className="relative overflow-hidden">
                          <Image
                            src={promo.image || '/images/categories/I1.webp'}
                            alt={menuPromo?.imageAlt || 'New Season'}
                            fill
                            className="object-cover object-center opacity-60"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-50/95 via-stone-50/50 to-transparent" />

                          {/* Top badge */}
                          <div className="absolute left-4 top-4">
                            <span className="bg-camel-500 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.3em] text-white">
                              {promo.badge ?? t('newSeason')}
                            </span>
                          </div>

                          {/* Bottom content */}
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            <p className="mb-1 text-[9px] uppercase tracking-[0.4em] text-camel-500">
                              {promo.label ?? t('seasonLabel')}
                            </p>
                            <p className="mb-1 font-display text-xl font-light leading-tight text-charcoal-900">
                              {promo.headline ?? t('seasonHeadline')}
                            </p>
                            <p className="mb-4 text-[10px] leading-relaxed text-charcoal-500">
                              {promo.subtext ?? t('seasonDesc')}
                            </p>
                            <Link
                              href={`/${locale}${promo.link ?? '/products'}`}
                              className="group/cta inline-flex items-center gap-2 border-b border-camel-500/50 pb-0.5 text-[10px] uppercase tracking-[0.25em] text-camel-600 transition-all duration-200 hover:border-camel-500 hover:text-camel-700"
                            >
                              {t('shopNow')}
                              <ArrowRight className="h-2.5 w-2.5 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                            </Link>
                          </div>
                        </div>

                      </div>

                      <div className="h-px w-full bg-gradient-to-r from-transparent via-camel-500/20 to-transparent" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Regular nav links */}
            {regularLinks.map((item) => {
              const fullHref = `/${locale}${item.href}`
              const label = locale === 'ar' ? (item.label_ar || item.label_en) : item.label_en
              const isActive = !item.href.includes('?') && pathname === fullHref
              return (
                <Link
                  key={item._key ?? item.href}
                  href={fullHref}
                  className={cn(
                    'relative text-sm font-medium tracking-wide transition-colors duration-200',
                    'after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full',
                    'after:origin-left after:scale-x-0 after:bg-camel-500 after:transition-transform after:duration-300',
                    'hover:text-camel-500 hover:after:scale-x-100',
                    isActive ? 'text-camel-500 after:scale-x-100' : 'text-charcoal-700'
                  )}
                >
                  {label}
                </Link>
              )
            })}

            {/* Highlighted nav links (e.g. Scent Quiz) */}
            {highlightLinks.map((item) => {
              const fullHref = `/${locale}${item.href}`
              const label = locale === 'ar' ? (item.label_ar || item.label_en) : item.label_en
              const isActive = pathname === fullHref
              return (
                <div key={item._key ?? item.href} className="relative rounded-sm p-[2px] overflow-hidden">
                  {/* Spinning rainbow gradient border */}
                  <div
                    className="absolute inset-0 scale-[2.5] animate-[spin_3s_linear_infinite]"
                    style={{ background: 'conic-gradient(from 0deg, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6, #a855f7, #ec4899, #ef4444)' }}
                  />
                  <Link
                    href={fullHref}
                    className={cn(
                      'relative z-10 flex items-center gap-1.5 rounded-[2px] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-all duration-200',
                      isActive ? 'bg-camel-400 text-white' : 'bg-white text-camel-600 hover:bg-black/[0.06]'
                    )}
                  >
                    <Sparkles className="h-3 w-3" />
                    {label}
                  </Link>
                </div>
              )
            })}

            {/* Dynamic CMS pages */}
            {navPages.map((p) => {
              const label = locale === 'ar' ? (p.title_ar || p.title_en) : p.title_en
              const href = `/${locale}/${p.slug}`
              const isActive = pathname === href
              return (
                <Link
                  key={p._id}
                  href={href}
                  className={cn(
                    'relative text-sm font-medium tracking-wide transition-colors duration-200',
                    'after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full',
                    'after:origin-left after:scale-x-0 after:bg-camel-500 after:transition-transform after:duration-300',
                    'hover:text-camel-500 hover:after:scale-x-100',
                    isActive ? 'text-camel-500 after:scale-x-100' : 'text-charcoal-700'
                  )}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Right-side items — each an individually orderable flex child */}
          <div style={{ order: orderOf('language') }} className="flex items-center">
            <LanguageSwitcher />
          </div>
          <div style={{ order: orderOf('account') }}>
            <IconButton href={`/${locale}/account`} label="My Account">
              <User className="h-5 w-5" />
            </IconButton>
          </div>
          <div style={{ order: orderOf('search') }}>
            <IconButton onClick={openSearch} label="Open search">
              <Search className="h-5 w-5" />
            </IconButton>
          </div>
          <div style={{ order: orderOf('wishlist') }}>
            <IconButton href={`/${locale}/wishlist`} label={`Wishlist (${wishlistCount} items)`} badge={wishlistCount}>
              <Heart className="h-5 w-5" />
            </IconButton>
          </div>
          <div style={{ order: orderOf('cart') }}>
            <IconButton onClick={() => openCart()} label={`Open cart (${cartCount} items)`} badge={cartCount}>
              <ShoppingBag className="h-5 w-5" />
            </IconButton>
          </div>
        </div>
      </header>

      {/* Menu overlay backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-charcoal-900/30 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={mobileMenuRef}
            key="mobile-menu"
            initial={{ x: isAr ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isAr ? '100%' : '-100%' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 top-0 z-50 flex w-[86%] max-w-sm flex-col overflow-y-auto overscroll-contain bg-white shadow-2xl shadow-black/20 lg:hidden ltr:left-0 rtl:right-0"
          >
            {/* Drawer header: brand + close */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-100 bg-white px-4 py-4">
              <span className="font-display text-lg font-bold uppercase tracking-[0.18em] text-charcoal-900">
                {(isAr ? siteLogo?.logoText_ar || siteLogo?.logoText_en : siteLogo?.logoText_en) || 'LUXE'}
              </span>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" className="rounded-full p-1.5 text-charcoal-500 transition-colors hover:bg-stone-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Camel gradient accent */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-camel-500 to-transparent" />

            {/* Search — top of drawer */}
            <div className="px-4 pt-4 pb-2 sm:px-6">
              <button
                type="button"
                onClick={() => { setMobileOpen(false); openSearch() }}
                className="flex w-full items-center gap-3 rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-charcoal-500 hover:border-camel-400 hover:bg-camel-50 hover:text-camel-600 transition-all duration-200"
              >
                <Search className="h-4 w-4 flex-shrink-0" />
                <span className="font-body tracking-wide">{t('search')}</span>
              </button>
            </div>

            <nav
              className="px-4 pb-8 pt-2 sm:px-6"
              aria-label="Mobile navigation"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('a')) setMobileOpen(false)
              }}
            >
              <ul className="flex flex-col divide-y divide-stone-100">
                {/* Collections accordion */}
                <li>
                  <button
                    onClick={() => setMobileCollectionsOpen((v) => !v)}
                    className="flex w-full items-center justify-between py-4 text-base font-medium tracking-wide text-charcoal-800 hover:text-camel-500 transition-colors"
                  >
                    {t('collections')}
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
                        {/* All Fragrances */}
                        <Link
                          href={`/${locale}/products`}
                          className="group/all mx-4 mt-2 mb-4 flex items-center justify-between border border-camel-500/30 bg-camel-50 px-3 py-2.5 transition-all hover:border-camel-500/60 hover:bg-camel-100"
                        >
                          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-camel-600 group-hover/all:text-camel-700 transition-colors">
                            {t('allFragrances')}
                          </span>
                          <ArrowRight className="h-3 w-3 text-camel-500/60 transition-all duration-200 group-hover/all:translate-x-0.5 group-hover/all:text-camel-500" />
                        </Link>

                        {/* Shop by Category */}
                        <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.4em] text-camel-500">
                          {t('shopByCategory')}
                        </p>
                        <ul className="mb-4 space-y-0.5 px-4">
                          {(categories.length > 0 ? categories : FALLBACK_CATEGORIES).map((cat) => {
                            const catName = locale === 'ar' ? (cat as Category).name_ar : (cat as Category).name_en
                            const imgUrl = (cat as Category).image?.asset?._ref
                              ? urlFor((cat as Category).image).width(112).height(112).url()
                              : null
                            const subs = (cat as Category).subcategories ?? []
                            return (
                              <li key={cat._id}>
                                <Link
                                  href={`/${locale}/products?category=${cat.slug}`}
                                  className="group/item flex items-center gap-3 border-l-2 rtl:border-l-0 rtl:border-r-2 border-transparent py-2.5 pl-1 rtl:pl-0 rtl:pr-1 transition-all duration-200 hover:border-camel-500 hover:pl-2 rtl:hover:pl-0 rtl:hover:pr-2"
                                >
                                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden bg-stone-100">
                                    {imgUrl ? (
                                      <Image
                                        src={imgUrl}
                                        alt={catName ?? ''}
                                        fill
                                        className="object-cover opacity-80 transition-all duration-300 group-hover/item:opacity-100"
                                      />
                                    ) : (
                                      <div className="h-full w-full bg-stone-100" />
                                    )}
                                  </div>
                                  <div>
                                    <span className="block text-base font-light tracking-wide text-charcoal-700 transition-colors group-hover/item:text-charcoal-900">
                                      {catName}
                                    </span>
                                    <span className="block text-[11px] text-charcoal-400">{t('shopArrow')}</span>
                                  </div>
                                </Link>
                                {subs.length > 0 && (
                                  <div className="ml-[52px] rtl:ml-0 rtl:mr-[52px] mb-1 flex flex-wrap gap-x-3 gap-y-1">
                                    {subs.map((sub) => {
                                      const subName = locale === 'ar' ? (sub.name_ar || sub.name_en) : sub.name_en
                                      return (
                                        <Link
                                          key={sub._id}
                                          href={`/${locale}/products?category=${sub.slug}`}
                                          className="text-[11px] tracking-wide text-charcoal-400 transition-colors hover:text-camel-500"
                                        >
                                          {subName}
                                        </Link>
                                      )
                                    })}
                                  </div>
                                )}
                              </li>
                            )
                          })}
                        </ul>

                        {/* Discover */}
                        <div className="mx-4 mb-3 h-px bg-stone-100" />
                        <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.4em] text-camel-500">
                          {t('discover')}
                        </p>
                        <ul className="mb-4 space-y-0.5 px-4">
                          {[
                            { href: `/${locale}/products?filter=new`,        icon: Sparkles,   label: t('newArrivals'),  sub: t('latestReleases'),    badge: 'New' },
                            { href: `/${locale}/products?filter=bestseller`,  icon: TrendingUp, label: t('bestsellers'),  sub: t('mostLoved'),          badge: null },
                            { href: `/${locale}/collections/gift-sets`, icon: Gift,       label: t('giftSets'),     sub: t('forSomeoneSpecial'),  badge: null },
                            { href: `/${locale}/journal`,                     icon: BookOpen,   label: t('journal'),      sub: t('storiesGuides'),      badge: null },
                            { href: `/${locale}/quiz`,                        icon: Sparkles,   label: t('quiz'),         sub: t('aiMatching'),        badge: 'AI' },
                            { href: `/${locale}/faq`,                         icon: HelpCircle, label: t('faq'),          sub: t('commonQuestions'),    badge: null },
                            { href: `/${locale}/contact`,                     icon: Mail,       label: t('contact'),      sub: t('getInTouch'),         badge: null },
                          ].map(({ href, icon: Icon, label, sub, badge }) => (
                            <li key={href}>
                              <Link href={href} className="group/item flex items-center gap-3 py-2.5 transition-colors">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-stone-200 bg-stone-50 text-camel-500 transition-colors duration-200 group-hover/item:border-camel-500/40 group-hover/item:text-camel-600">
                                  <Icon className="h-4 w-4" />
                                </span>
                                <div>
                                  <span className="flex items-center gap-1.5 text-sm font-light tracking-wide text-charcoal-700 transition-colors group-hover/item:text-charcoal-900">
                                    {label}
                                    {badge && (
                                      <span className="rounded-full bg-camel-500 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                                        {badge}
                                      </span>
                                    )}
                                  </span>
                                  <span className="block text-[11px] tracking-wide text-charcoal-400">{sub}</span>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>

                        {/* Fragrance Family */}
                        <div className="mx-4 mb-3 h-px bg-stone-100" />
                        <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.4em] text-camel-500">
                          {t('fragranceFamily')}
                        </p>
                        <div className="mb-4 flex flex-wrap gap-1.5 px-4">
                          {([
                            { key: 'woody',    label: t('familyWoody') },
                            { key: 'floral',   label: t('familyFloral') },
                            { key: 'citrus',   label: t('familyCitrus') },
                            { key: 'oriental', label: t('familyOriental') },
                            { key: 'fresh',    label: t('familyFresh') },
                            { key: 'aquatic',  label: t('familyAquatic') },
                            { key: 'gourmand', label: t('familyGourmand') },
                          ] as const).map(({ key, label }) => (
                            <Link
                              key={key}
                              href={`/${locale}/products?family=${key}`}
                              className="border border-azure-300 px-2.5 py-1 text-[10px] tracking-[0.15em] text-charcoal-500 transition-all hover:border-camel-500 hover:bg-camel-50 hover:text-camel-600"
                            >
                              {label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>

                {/* Regular nav links */}
                {regularLinks.map((item, i) => {
                  const fullHref = `/${locale}${item.href}`
                  const label = locale === 'ar' ? (item.label_ar || item.label_en) : item.label_en
                  return (
                    <motion.li
                      key={item._key ?? item.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 + 0.05, duration: 0.22 }}
                    >
                      <Link
                        href={fullHref}
                        className={cn(
                          'block py-4 text-base font-medium tracking-wide transition-colors',
                          'hover:text-camel-500',
                          pathname === fullHref.split('?')[0] ? 'text-camel-500' : 'text-charcoal-700'
                        )}
                      >
                        {label}
                      </Link>
                    </motion.li>
                  )
                })}

                {/* Dynamic CMS pages */}
                {navPages.map((p, i) => {
                  const label = locale === 'ar' ? (p.title_ar || p.title_en) : p.title_en
                  const href = `/${locale}/${p.slug}`
                  return (
                    <motion.li
                      key={p._id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (regularLinks.length + i) * 0.06 + 0.05, duration: 0.22 }}
                    >
                      <Link
                        href={href}
                        className={cn(
                          'block py-4 text-base font-medium tracking-wide transition-colors',
                          'hover:text-camel-500',
                          pathname === href ? 'text-camel-500' : 'text-charcoal-700'
                        )}
                      >
                        {label}
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>

              {/* Mobile bottom actions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-6 flex flex-col gap-3"
              >
                {/* Highlighted links (e.g. Scent Quiz) */}
                {highlightLinks.map((item) => {
                  const fullHref = `/${locale}${item.href}`
                  const label = locale === 'ar' ? (item.label_ar || item.label_en) : item.label_en
                  return (
                    <div key={item._key ?? item.href} className="relative rounded-sm p-[2px] overflow-hidden">
                      <div
                        className="absolute inset-0 scale-[2.5] animate-[spin_3s_linear_infinite]"
                        style={{ background: 'conic-gradient(from 0deg, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6, #a855f7, #ec4899, #ef4444)' }}
                      />
                      <Link
                        href={fullHref}
                        className="relative z-10 flex items-center justify-between bg-white px-4 py-3 rounded-[2px] transition-all hover:bg-black/[0.06] group"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-camel-500 transition-colors" />
                          <span className="text-sm font-medium tracking-wide text-camel-600 transition-colors">{label}</span>
                        </div>
                        <span className="rounded-full bg-camel-500 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white transition-colors">AI</span>
                      </Link>
                    </div>
                  )
                })}

                <Link
                  href={`/${locale}/wishlist`}
                  className="flex items-center gap-2 text-sm text-charcoal-600 hover:text-camel-500 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  {t('wishlist')}
                  {wishlistCount > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-camel-500 text-[10px] font-medium text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <div className="pt-2 flex items-center gap-3">
                  <LanguageSwitcher />
                </div>
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
  badge?: number
  onClick?: () => void
  href?: string
  badgeSide?: 'left' | 'right'
}

function IconButton({ children, label, badge, onClick, href, badgeSide = 'right' }: IconButtonProps) {
  const baseClass = cn(
    'relative inline-flex items-center justify-center rounded-full p-2 transition-colors duration-200',
    'text-charcoal-600 hover:bg-stone-100 hover:text-charcoal-900'
  )

  const badgeEl =
    badge != null && badge > 0 ? (
      <motion.span
        key={badge}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          'pointer-events-none absolute top-1 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-camel-500 text-[9px] font-bold leading-none text-white ring-2 ring-white',
          badgeSide === 'left' ? '-left-1' : '-right-1'
        )}
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
