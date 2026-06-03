'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Package, ArrowLeft } from 'lucide-react'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import type { Order } from '@/lib/types'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  paid: 'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  refunded: 'bg-stone-50 text-stone-600 border-stone-200',
}

interface Props { orders: Order[] }

export default function OrdersClient({ orders }: Props) {
  const locale = useLocale()

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-16">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href={`/${locale}/account`} className="text-ink-400 hover:text-ink-700 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-2xl font-light text-ink-900">Order History</h1>
        </div>

        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-stone-100 px-8 py-16 text-center">
            <Package className="mx-auto mb-4 h-10 w-10 text-stone-300" />
            <p className="font-display text-lg font-light text-ink-700 mb-1">No orders yet</p>
            <p className="font-body text-sm text-ink-400 mb-6">Your order history will appear here.</p>
            <Link href={`/${locale}/products`} className="inline-block bg-camel-500 px-6 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-camel-600 transition-colors">
              Shop Now
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border border-stone-100 px-6 py-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-body text-xs text-ink-400 uppercase tracking-widest mb-0.5">Order #{order.stripeSessionId?.slice(-8) ?? order._id.slice(-8)}</p>
                    {order.placedAt && (
                      <p className="font-body text-xs text-ink-400">{new Date(order.placedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    )}
                  </div>
                  <span className={cn('border px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-widest', STATUS_STYLES[order.status] ?? STATUS_STYLES['pending'])}>
                    {order.status}
                  </span>
                </div>

                <div className="mb-3 space-y-1">
                  {order.items?.slice(0, 2).map((item, j) => (
                    <p key={j} className="font-body text-sm text-ink-700">
                      {item.productName} {item.ml ? `${item.ml}ml` : ''} &times; {item.quantity}
                    </p>
                  ))}
                  {(order.items?.length ?? 0) > 2 && (
                    <p className="font-body text-xs text-ink-400">+{(order.items?.length ?? 0) - 2} more items</p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-stone-50 pt-3">
                  <p className="font-body text-sm font-semibold text-ink-900">${order.total?.toFixed(2)}</p>
                  {order.trackingNumber && (
                    <a href={order.trackingUrl ?? '#'} target="_blank" rel="noopener noreferrer"
                      className="font-body text-xs text-camel-500 hover:text-camel-700 transition-colors">
                      Track: {order.trackingNumber}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
