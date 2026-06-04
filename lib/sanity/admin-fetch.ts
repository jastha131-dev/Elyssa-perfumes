// lib/sanity/admin-fetch.ts
import { client } from './client'
import {
  getAllOrdersAdminQuery,
  getAllProductsAdminQuery,
  getUserStatsQuery,
} from './admin-queries'

export interface AdminOrder {
  _id: string
  total: number
  subtotal: number
  discount?: number
  shipping?: number
  status: string
  placedAt?: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
    ml?: number
  }>
}

export interface AdminProduct {
  _id: string
  name_en: string
  slug: string
  stock: number
  price: number
  category?: string
}

export interface RevenuePoint { date: string; revenue: number }
export interface StatusCount { status: string; count: number; fill: string }
export interface TopProduct { name: string; quantity: number; revenue: number }

export interface AdminStats {
  totalRevenue: number
  revenueToday: number
  revenue7d: number
  revenue30d: number
  orderCount: number
  orderCountToday: number
  orderCount7d: number
  aov: number
  totalUsers: number
  newUsersThisMonth: number
  revenueByDay: RevenuePoint[]
  ordersByStatus: StatusCount[]
  topProducts: TopProduct[]
  lowStockProducts: AdminProduct[]
  totalDiscountGiven: number
  ordersWithDiscount: number
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#9ca3af',
  paid: '#22c55e',
  processing: '#3b82f6',
  shipped: '#f59e0b',
  delivered: '#10b981',
  cancelled: '#ef4444',
  refunded: '#8b5cf6',
}

const PAID_STATUSES = ['paid', 'processing', 'shipped', 'delivered']

function toDateStr(iso: string): string {
  return iso.slice(0, 10)
}

function daysBefore(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(0, 0, 0, 0)
  return d
}

function computeStats(orders: AdminOrder[]): Omit<AdminStats, 'totalUsers' | 'newUsersThisMonth' | 'lowStockProducts'> {
  const paidOrders = orders.filter((o) => PAID_STATUSES.includes(o.status))
  const startToday = new Date(); startToday.setHours(0, 0, 0, 0)
  const start7d = daysBefore(7)
  const start30d = daysBefore(30)

  const totalRevenue = paidOrders.reduce((s, o) => s + (o.total ?? 0), 0)
  const revenueToday = paidOrders.filter((o) => o.placedAt && new Date(o.placedAt) >= startToday).reduce((s, o) => s + o.total, 0)
  const revenue7d = paidOrders.filter((o) => o.placedAt && new Date(o.placedAt) >= start7d).reduce((s, o) => s + o.total, 0)
  const revenue30d = paidOrders.filter((o) => o.placedAt && new Date(o.placedAt) >= start30d).reduce((s, o) => s + o.total, 0)
  const orderCount = paidOrders.length
  const orderCountToday = paidOrders.filter((o) => o.placedAt && new Date(o.placedAt) >= startToday).length
  const orderCount7d = paidOrders.filter((o) => o.placedAt && new Date(o.placedAt) >= start7d).length
  const aov = orderCount > 0 ? totalRevenue / orderCount : 0

  // Revenue by day (last 30 days)
  const revenueMap: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0)
    revenueMap[toDateStr(d.toISOString())] = 0
  }
  paidOrders.forEach((o) => {
    if (o.placedAt && new Date(o.placedAt) >= start30d) {
      const key = toDateStr(o.placedAt)
      if (key in revenueMap) revenueMap[key] = (revenueMap[key] ?? 0) + o.total
    }
  })
  const revenueByDay: RevenuePoint[] = Object.entries(revenueMap).map(([date, revenue]) => ({ date, revenue }))

  // Orders by status
  const statusMap: Record<string, number> = {}
  orders.forEach((o) => { statusMap[o.status] = (statusMap[o.status] ?? 0) + 1 })
  const ordersByStatus: StatusCount[] = Object.entries(statusMap).map(([status, count]) => ({
    status,
    count,
    fill: STATUS_COLORS[status] ?? '#6b7280',
  }))

  // Top products (last 30 days, paid orders)
  const productMap: Record<string, { quantity: number; revenue: number }> = {}
  paidOrders
    .filter((o) => !o.placedAt || new Date(o.placedAt) >= start30d)
    .forEach((o) => {
      o.items.forEach((item) => {
        if (!productMap[item.productName]) productMap[item.productName] = { quantity: 0, revenue: 0 }
        productMap[item.productName].quantity += item.quantity
        productMap[item.productName].revenue += item.price * item.quantity
      })
    })
  const topProducts: TopProduct[] = Object.entries(productMap)
    .map(([name, d]) => ({ name, ...d }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)

  const discountOrders = paidOrders.filter((o) => o.discount && o.discount > 0)
  const totalDiscountGiven = discountOrders.reduce((s, o) => s + (o.discount ?? 0), 0)

  return {
    totalRevenue,
    revenueToday,
    revenue7d,
    revenue30d,
    orderCount,
    orderCountToday,
    orderCount7d,
    aov,
    revenueByDay,
    ordersByStatus,
    topProducts,
    totalDiscountGiven,
    ordersWithDiscount: discountOrders.length,
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  const isSanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
  if (!isSanityConfigured) {
    return {
      totalRevenue: 0, revenueToday: 0, revenue7d: 0, revenue30d: 0,
      orderCount: 0, orderCountToday: 0, orderCount7d: 0, aov: 0,
      totalUsers: 0, newUsersThisMonth: 0,
      revenueByDay: [], ordersByStatus: [], topProducts: [],
      lowStockProducts: [], totalDiscountGiven: 0, ordersWithDiscount: 0,
    }
  }

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [orders, products, userStats] = await Promise.all([
    client.fetch<AdminOrder[]>(getAllOrdersAdminQuery, {}, { next: { revalidate: 60 } }),
    client.fetch<AdminProduct[]>(getAllProductsAdminQuery, {}, { next: { revalidate: 300 } }),
    client.fetch<{ total: number; newThisMonth: number }>(
      getUserStatsQuery,
      { startOfMonth: startOfMonth.toISOString() },
      { next: { revalidate: 300 } }
    ),
  ])

  const computed = computeStats(orders)
  const lowStockProducts = products.filter((p) => p.stock <= 10).slice(0, 20)

  return {
    ...computed,
    totalUsers: userStats?.total ?? 0,
    newUsersThisMonth: userStats?.newThisMonth ?? 0,
    lowStockProducts,
  }
}
