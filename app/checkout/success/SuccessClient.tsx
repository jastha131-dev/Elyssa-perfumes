'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Truck, ShoppingBag, ExternalLink, Package } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

interface SuccessClientProps {
  orderNumber: string | null
  customerEmail: string | null
  customerName: string | null
  amountTotal: number | null
  currency: string
  paymentStatus: string | null
}

// Confetti particle
interface Particle {
  id: number
  x: number
  initialY: number
  color: string
  size: number
  rotation: number
  duration: number
  delay: number
}

const CONFETTI_COLORS = [
  '#d99a1b', // gold-500
  '#e6b330', // gold-400
  '#ecc85c', // gold-300
  '#1a1a1a', // charcoal-900
  '#f9f0cc', // cream-100
  '#c07a13', // gold-600
]

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    initialY: -10 - Math.random() * 20,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
    duration: 2.5 + Math.random() * 2,
    delay: Math.random() * 1.5,
  }))
}

export default function SuccessClient({
  orderNumber,
  customerEmail,
  customerName,
  amountTotal,
  currency,
  paymentStatus,
}: SuccessClientProps) {
  const clearCart = useCartStore((state) => state.clearCart)
  const cartCleared = useRef(false)
  const [particles] = useState<Particle[]>(() => generateParticles(50))
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (!cartCleared.current) {
      clearCart()
      cartCleared.current = true
    }

    // Trigger confetti after a brief delay
    const timer = setTimeout(() => setShowConfetti(true), 300)
    return () => clearTimeout(timer)
  }, [clearCart])

  const displayName = customerName ? customerName.split(' ')[0] : null

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-cream-50 to-white px-4 py-16 sm:px-6">
      {/* Confetti */}
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-sm"
              style={{
                left: `${particle.x}%`,
                top: `${particle.initialY}%`,
                width: particle.size,
                height: particle.size * 0.5,
                backgroundColor: particle.color,
                rotate: particle.rotation,
              }}
              animate={{
                top: ['0%', '110%'],
                rotate: [particle.rotation, particle.rotation + 720],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: 'easeIn',
                times: [0, 0.8, 1],
              }}
            />
          ))}
        </div>
      )}

      <div className="relative mx-auto max-w-lg">
        {/* Animated checkmark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex justify-center"
        >
          <div className="relative flex h-28 w-28 items-center justify-center">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gold-100"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Inner ring */}
            <motion.div
              className="absolute inset-3 rounded-full bg-gold-200"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* SVG checkmark with draw animation */}
            <motion.svg
              className="relative z-10 h-14 w-14"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.circle
                cx="28"
                cy="28"
                r="26"
                stroke="#d99a1b"
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
              <motion.path
                d="M16 28L24 36L40 20"
                stroke="#d99a1b"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
              />
            </motion.svg>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 text-center"
        >
          <p className="mb-3 font-body text-xs uppercase tracking-[0.3em] text-gold-500">
            Payment Confirmed
          </p>
          <h1 className="mb-3 font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">
            {displayName ? `Thank you, ${displayName}!` : 'Order Confirmed!'}
          </h1>
          <p className="text-base leading-relaxed text-charcoal-500">
            Your order has been successfully placed. We are preparing your luxury fragrance with care.
          </p>
        </motion.div>

        {/* Order details card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 overflow-hidden rounded-2xl border border-gold-200 bg-white shadow-sm"
        >
          {/* Card header */}
          <div className="bg-gradient-to-r from-gold-50 to-cream-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-[11px] uppercase tracking-[0.2em] text-charcoal-400">
                  Order Number
                </p>
                <p className="mt-0.5 font-display text-lg font-semibold text-charcoal-900 tracking-wider">
                  #{orderNumber ?? '—'}
                </p>
              </div>
              {amountTotal !== null && (
                <div className="text-right">
                  <p className="font-body text-[11px] uppercase tracking-[0.2em] text-charcoal-400">
                    Total Paid
                  </p>
                  <p className="mt-0.5 font-display text-lg font-bold text-charcoal-900 tabular-nums">
                    {formatPrice(amountTotal, currency)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Steps */}
          <div className="divide-y divide-charcoal-50 px-6">
            <NextStep
              icon={<Mail className="h-5 w-5 text-gold-500" />}
              title="Check Your Email"
              description={
                customerEmail
                  ? `A confirmation has been sent to ${customerEmail}`
                  : 'A confirmation email will arrive shortly with your order details.'
              }
              delay={0.55}
            />
            <NextStep
              icon={<Package className="h-5 w-5 text-gold-500" />}
              title="Order Processing"
              description="Your fragrance will be carefully packaged within 1–2 business days."
              delay={0.6}
            />
            <NextStep
              icon={<Truck className="h-5 w-5 text-gold-500" />}
              title="Shipping Updates"
              description="You will receive tracking information once your order ships (5–10 business days)."
              delay={0.65}
            />
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Link href="/products" className="flex-1">
            <Button
              variant="primary"
              className="w-full gap-2"
              size="lg"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 gap-2"
            onClick={() => {
              // Placeholder: In production, link to order tracking page or Stripe dashboard
              window.open('https://luxeparfum.com/orders', '_blank')
            }}
          >
            <ExternalLink className="h-4 w-4" />
            Track Order
          </Button>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-8 text-center text-xs leading-relaxed text-charcoal-400"
        >
          Questions about your order? Contact us at{' '}
          <a
            href="mailto:support@luxeparfum.com"
            className="text-gold-600 underline underline-offset-2 hover:text-gold-700"
          >
            support@luxeparfum.com
          </a>
        </motion.p>
      </div>
    </div>
  )
}

function NextStep({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-4 py-4"
    >
      <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold-50">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-charcoal-900">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-charcoal-400">{description}</p>
      </div>
    </motion.div>
  )
}
