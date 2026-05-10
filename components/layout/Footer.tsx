'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { urlFor } from '@/lib/sanity/image'
import type { Category } from '@/lib/types'

const SHOP_LINKS = [
  { label: 'All Fragrances', href: '/products' },
  { label: 'Men', href: '/products?category=men' },
  { label: 'Women', href: '/products?category=women' },
  { label: 'Unisex', href: '/products?category=unisex' },
  { label: 'New Arrivals', href: '/products?filter=new' },
  { label: 'Best Sellers', href: '/products?filter=bestseller' },
]

const HELP_LINKS = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Shipping', href: '/shipping' },
  { label: 'Returns', href: '/returns' },
  { label: 'Track Order', href: '/track-order' },
]

const ABOUT_LINKS = [
  { label: 'Our Story', href: '/about' },
  { label: 'Sustainability', href: '/sustainability' },
  { label: 'Press', href: '/press' },
  { label: 'Careers', href: '/careers' },
]

const LOCAL_CAT_IMAGES = [
  '/images/categories/I1.webp',
  '/images/categories/I2.webp',
  '/images/categories/I3.webp',
]

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'Twitter',   href: 'https://twitter.com',   icon: Twitter },
  { label: 'Facebook',  href: 'https://facebook.com',  icon: Facebook },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

interface FooterColumnProps {
  title: string
  links: { label: string; href: string }[]
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <motion.div variants={itemVariants}>
      <h3 className="mb-5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-body text-sm text-charcoal-400 transition-colors duration-200 hover:text-cream-100"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

interface FooterProps {
  categories?: Category[]
}

export default function Footer({ categories = [] }: FooterProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email || subscribed) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setSubscribed(true)
    setLoading(false)
    setEmail('')
  }

  const displayCategories = categories.slice(0, 3)

  return (
    <footer className="bg-charcoal-950 text-charcoal-100">

      {/* ── Category image strip from Sanity admin ── */}
      {displayCategories.length > 0 && (
        <div
          className={cn(
            'grid border-b border-charcoal-800',
            displayCategories.length === 1 ? 'grid-cols-1' :
            displayCategories.length === 2 ? 'grid-cols-2' :
            'grid-cols-2 md:grid-cols-3'
          )}
        >
          {displayCategories.map((cat, i) => {
            const sanityUrl = cat.image?.asset?._ref
              ? urlFor(cat.image).width(800).height(500).url()
              : null
            const imageUrl = sanityUrl || LOCAL_CAT_IMAGES[i % LOCAL_CAT_IMAGES.length]

            // Hide 3rd item on mobile (2-col grid) — only show 2
            const isThird = i === 2
            return (
              <Link
                key={cat._id}
                href={`/products?category=${cat.slug}`}
                className={cn(
                  'group relative aspect-[4/3] overflow-hidden bg-charcoal-800',
                  isThird && 'hidden md:block'
                )}
              >
                <Image
                  src={imageUrl}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/30 to-charcoal-950/10" />
                <div className="absolute inset-0 bg-charcoal-950/0 transition-colors duration-500 group-hover:bg-charcoal-950/20" />

                {/* Category info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                  <div className="transform transition-transform duration-400 group-hover:-translate-y-1">
                    <p className="mb-1 font-body text-[10px] uppercase tracking-[0.3em] text-gold-400/70">
                      Explore
                    </p>
                    <h3 className="font-display text-2xl font-light text-cream-100 md:text-3xl">
                      {cat.name}
                    </h3>
                  </div>

                  <div className="mt-3 flex items-center gap-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="font-body text-[10px] uppercase tracking-[0.2em] text-gold-400">
                      Shop Now
                    </span>
                    <ArrowRight size={12} className="text-gold-400" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Gold border on hover */}
                <div className="pointer-events-none absolute inset-0 border border-gold-500/0 transition-colors duration-500 group-hover:border-gold-500/25" />

                {/* Divider between tiles */}
                {i < displayCategories.length - 1 && (
                  <div className="pointer-events-none absolute right-0 inset-y-0 w-px bg-charcoal-800" />
                )}
              </Link>
            )
          })}
        </div>
      )}

      {/* Gold gradient accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/35 to-transparent" />

      {/* ── Main footer grid ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:grid-cols-2 lg:grid-cols-5 lg:px-8 lg:py-20"
      >
        {/* Brand column */}
        <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="inline-flex flex-col leading-none" aria-label="Luxe Parfum">
            <span className="font-display text-xl font-bold uppercase tracking-[0.18em] text-cream-100">
              LUXE
            </span>
            <span className="font-display text-[10px] font-medium uppercase tracking-[0.35em] text-gold-500">
              PARFUM
            </span>
          </Link>

          <p className="mt-4 font-body text-sm italic leading-relaxed text-charcoal-400">
            The Art of Fragrance
          </p>

          <p className="mt-3 max-w-xs font-body text-xs leading-relaxed text-charcoal-500">
            Crafting extraordinary scents that tell stories, evoke memories, and define moments of timeless elegance.
          </p>

          {/* Social — square, luxury */}
          <div className="mt-6 flex items-center gap-2">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={cn(
                  'flex h-8 w-8 items-center justify-center',
                  'border border-charcoal-700 text-charcoal-500',
                  'transition-all duration-200 hover:border-gold-500 hover:text-gold-500'
                )}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
              >
                <Icon className="h-3.5 w-3.5" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Nav columns */}
        <FooterColumn title="Shop" links={SHOP_LINKS} />
        <FooterColumn title="Help" links={HELP_LINKS} />
        <FooterColumn title="About" links={ABOUT_LINKS} />

        {/* Newsletter */}
        <motion.div variants={itemVariants}>
          <h3 className="mb-5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
            Stay Connected
          </h3>
          <p className="mb-4 font-body text-xs leading-relaxed text-charcoal-400">
            Be the first to discover new collections, exclusive offers, and fragrance stories.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gold-500/30 bg-gold-500/8 px-4 py-3"
            >
              <p className="font-body text-xs text-gold-400">
                Thank you for subscribing! We&apos;ll be in touch soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2" noValidate>
              {/* Sharp rectangle — matches brand aesthetic */}
              <div className="flex border border-charcoal-700 transition-colors duration-200 focus-within:border-gold-500/70">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  aria-label="Email address for newsletter"
                  required
                  className={cn(
                    'flex-1 bg-transparent px-4 py-2.5 font-body text-xs text-charcoal-100',
                    'placeholder:text-charcoal-600 outline-none'
                  )}
                />
                <motion.button
                  type="submit"
                  disabled={loading || !email}
                  whileTap={{ scale: 0.94 }}
                  aria-label="Subscribe to newsletter"
                  className={cn(
                    'flex items-center justify-center px-3.5',
                    'bg-gold-500 text-charcoal-950 transition-all duration-200',
                    'hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                >
                  {loading ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-charcoal-950 border-t-transparent" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5" />
                  )}
                </motion.button>
              </div>
              <p className="font-body text-[10px] text-charcoal-600">
                No spam, ever. Unsubscribe at any time.
              </p>
            </form>
          )}
        </motion.div>
      </motion.div>

      {/* ── Bottom bar ── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-charcoal-600 sm:flex-row sm:px-6 lg:px-8"
      >
        <p>&copy; {new Date().getFullYear()} Luxe Parfum. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/privacy-policy" className="transition-colors hover:text-charcoal-300">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-charcoal-300">
            Terms of Service
          </Link>
          <Link href="/cookies" className="transition-colors hover:text-charcoal-300">
            Cookie Policy
          </Link>
        </div>
      </motion.div>
    </footer>
  )
}
