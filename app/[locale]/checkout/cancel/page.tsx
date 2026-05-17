'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ShoppingCart, ShoppingBag, ArrowLeft, HeartHandshake } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

export default function CancelPage() {
  const t = useTranslations('cancel')

  const reassurancePoints = [
    { text: t('point1') },
    { text: t('point2') },
    { text: t('point3') },
  ]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-cream-50 to-white px-4 py-16 sm:px-6">
      <motion.div
        className="w-full max-w-md text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Icon */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full bg-charcoal-100"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="absolute inset-3 rounded-full bg-charcoal-50"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="relative z-10"
              initial={{ rotate: -15, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <HeartHandshake className="h-10 w-10 text-charcoal-500" />
            </motion.div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div variants={itemVariants} className="mb-6">
          <p className="mb-3 font-body text-xs uppercase tracking-[0.3em] text-charcoal-400">
            {t('noWorries')}
          </p>
          <h1 className="mb-3 font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">
            {t('title')}
          </h1>
          <p className="text-base leading-relaxed text-charcoal-500">
            {t('desc')}
          </p>
        </motion.div>

        {/* Reassurance card */}
        <motion.div
          variants={itemVariants}
          className="mb-8 rounded-2xl border border-charcoal-100 bg-white p-6 text-left shadow-sm"
        >
          <h2 className="mb-4 font-display text-base font-semibold text-charcoal-900">
            {t('itemsWaiting')}
          </h2>
          <ul className="space-y-3">
            {reassurancePoints.map((point) => (
              <li key={point.text} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gold-100">
                  <span className="h-2 w-2 rounded-full bg-gold-500" />
                </span>
                <p className="text-sm leading-relaxed text-charcoal-500">{point.text}</p>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:flex-row">
          <Link href="/cart" className="flex-1">
            <Button variant="primary" size="lg" className="w-full gap-2">
              <ShoppingCart className="h-4 w-4" />
              {t('returnToCart')}
            </Button>
          </Link>
          <Link href="/products" className="flex-1">
            <Button variant="outline" size="lg" className="w-full gap-2">
              <ShoppingBag className="h-4 w-4" />
              {t('continueShopping')}
            </Button>
          </Link>
        </motion.div>

        {/* Back link */}
        <motion.div variants={itemVariants} className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-charcoal-400 transition-colors hover:text-charcoal-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('backHome')}
          </Link>
        </motion.div>

        {/* Help text */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-xs leading-relaxed text-charcoal-400"
        >
          {t('helpText')}{' '}
          <a
            href="mailto:support@luxeparfum.com"
            className="text-gold-600 underline underline-offset-2 hover:text-gold-700"
          >
            {t('contactSupport')}
          </a>{' '}
          and we will be happy to help.
        </motion.p>
      </motion.div>
    </div>
  )
}

