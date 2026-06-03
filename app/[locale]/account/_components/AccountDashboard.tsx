'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Package, MapPin, Heart, User, LogOut, ChevronRight } from 'lucide-react'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'

interface Props {
  user: { id: string; name?: string | null; email?: string | null }
}

const MENU_ITEMS = [
  { icon: Package, label: 'Order History', sub: 'Track and review your orders', href: '/account/orders' },
  { icon: MapPin, label: 'Saved Addresses', sub: 'Manage delivery addresses', href: '/account/addresses' },
  { icon: Heart, label: 'Wishlist', sub: 'Your saved fragrances', href: '/wishlist' },
  { icon: User, label: 'Profile', sub: 'Update your details', href: '/account/profile' },
]

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const itemVariants = { hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }

export default function AccountDashboard({ user }: Props) {
  const locale = useLocale()

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-16">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-camel-500 text-white font-display text-2xl font-light">
            {user.name?.charAt(0).toUpperCase() ?? user.email?.charAt(0).toUpperCase()}
          </div>
          <h1 className="font-display text-2xl font-light text-ink-900">{user.name ?? 'My Account'}</h1>
          <p className="mt-1 font-body text-sm text-ink-400">{user.email}</p>
          <div className="mx-auto mt-4 h-px w-10 bg-camel-400/40" />
        </motion.div>

        {/* Menu */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
          {MENU_ITEMS.map(({ icon: Icon, label, sub, href }) => (
            <motion.div key={href} variants={itemVariants}>
              <Link
                href={`/${locale}${href}`}
                className={cn(
                  'flex items-center gap-4 bg-white px-5 py-4 border border-stone-100 transition-all duration-200',
                  'hover:border-camel-200 hover:shadow-sm group'
                )}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-camel-50 text-camel-500">
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-body text-sm font-medium text-ink-900 group-hover:text-camel-600 transition-colors">{label}</p>
                  <p className="font-body text-xs text-ink-400">{sub}</p>
                </div>
                <ChevronRight size={16} className="text-ink-300 group-hover:text-camel-400 transition-colors" />
              </Link>
            </motion.div>
          ))}

          {/* Sign out */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className="flex w-full items-center gap-4 bg-white px-5 py-4 border border-stone-100 hover:border-red-100 hover:bg-red-50 transition-all duration-200 group"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-stone-50 text-ink-400 group-hover:text-red-400 transition-colors">
                <LogOut size={18} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-body text-sm font-medium text-ink-700 group-hover:text-red-500 transition-colors">Sign Out</p>
              </div>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
