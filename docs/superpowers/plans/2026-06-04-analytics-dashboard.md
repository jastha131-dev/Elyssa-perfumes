# Analytics Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a protected `/[locale]/admin` analytics dashboard showing revenue KPIs, order analytics, top products, inventory status, and discount usage — all sourced from existing Sanity data.

**Architecture:** Admin layout guards with `session.user.role === 'admin'`. Server component fetches all data, computes aggregates in TypeScript, passes typed props to Recharts client components. Middleware extended with admin-specific redirect that also checks role.

**Tech Stack:** Next.js 15 App Router, Sanity GROQ, Recharts, NextAuth sessions, Tailwind CSS

---

## File Map

### New files
| Path | Purpose |
|------|---------|
| `app/[locale]/admin/layout.tsx` | Auth guard — redirects non-admins |
| `app/[locale]/admin/page.tsx` | Main dashboard — fetches data, renders sections |
| `app/[locale]/admin/_components/KPICard.tsx` | Reusable KPI metric card |
| `app/[locale]/admin/_components/RevenueChart.tsx` | Line chart — revenue over time (client) |
| `app/[locale]/admin/_components/StatusDonut.tsx` | Pie/donut — orders by status (client) |
| `app/[locale]/admin/_components/TopProductsChart.tsx` | Horizontal bar — top products (client) |
| `app/[locale]/admin/_components/InventoryTable.tsx` | Table — low stock products (client) |
| `app/[locale]/admin/_components/DiscountTable.tsx` | Table — discount/promo usage (client) |
| `lib/sanity/admin-queries.ts` | GROQ queries for analytics |
| `lib/sanity/admin-fetch.ts` | Fetch functions + data aggregation helpers |

### Modified files
| Path | Change |
|------|--------|
| `middleware.ts` | Add admin route pattern + role check |

### Package to install
`recharts` — run `npm install recharts` before any chart component tasks.

---

## Data Shapes (used throughout)

```typescript
// From Sanity
interface AdminOrder {
  _id: string
  total: number
  subtotal: number
  discount?: number
  shipping?: number
  status: string
  placedAt?: string
  items: Array<{ productId: string; productName: string; quantity: number; price: number; ml?: number }>
}

interface AdminProduct {
  _id: string
  name_en: string
  slug: string
  stock: number
  price: number
  category?: string
}

// Computed aggregates (in admin-fetch.ts)
interface RevenuePoint { date: string; revenue: number }
interface StatusCount { status: string; count: number }
interface TopProduct { name: string; quantity: number; revenue: number }
interface DiscountRow { code: string; uses: number; totalSaved: number }
interface AdminStats {
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
  discountRows: DiscountRow[]
}
```

---

## Task 1: Install recharts + update middleware

**Files:**
- `middleware.ts`
- `package.json` (via npm install)

- [ ] **Install recharts**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npm install recharts
```

Expected: `recharts` added to dependencies, no peer dep errors.

- [ ] **Update middleware.ts to protect admin routes with role check**

Replace the entire content of `middleware.ts` with:

```typescript
import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const LOCALES = ['en', 'ar']
const DEFAULT_LOCALE = 'en'

const { auth } = NextAuth(authConfig)

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
})

const PROTECTED_PATTERNS = [
  /^\/[a-z]{2}\/account(\/.*)?$/,
]

const ADMIN_PATTERNS = [
  /^\/[a-z]{2}\/admin(\/.*)?$/,
]

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const locale = pathname.split('/')[1] || DEFAULT_LOCALE

  const isProtected = PROTECTED_PATTERNS.some((p) => p.test(pathname))
  const isAdmin = ADMIN_PATTERNS.some((p) => p.test(pathname))

  if (isProtected || isAdmin) {
    const session = await auth()
    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/login`
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
    if (isAdmin && session.user?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}`
      return NextResponse.redirect(url)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|studio|.*\\..*).*)'],
}
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add middleware.ts package.json package-lock.json
git commit -m "feat(admin): install recharts, protect /admin routes in middleware"
```

---

## Task 2: Admin GROQ Queries + Fetch Functions

**Files:**
- Create: `lib/sanity/admin-queries.ts`
- Create: `lib/sanity/admin-fetch.ts`

- [ ] **Create admin-queries.ts**

```typescript
// lib/sanity/admin-queries.ts

export const getAllOrdersAdminQuery = `
  *[_type == "order"] | order(placedAt desc) {
    _id,
    total,
    subtotal,
    discount,
    shipping,
    status,
    placedAt,
    "items": items[]{
      productId,
      productName,
      quantity,
      price,
      ml
    }
  }
`

export const getAllProductsAdminQuery = `
  *[_type == "product"] | order(stock asc) {
    _id,
    name_en,
    "slug": slug.current,
    stock,
    price,
    "category": category->name_en
  }
`

export const getUserStatsQuery = `
  {
    "total": count(*[_type == "user"]),
    "newThisMonth": count(*[_type == "user" && dateTime(createdAt) >= dateTime($startOfMonth)])
  }
`
```

- [ ] **Create admin-fetch.ts**

```typescript
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
export interface DiscountRow { orderId: string; discount: number; placedAt?: string }

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
  const now = new Date()
  now.setHours(23, 59, 59, 999)
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

  // Orders by status (all orders, not just paid)
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

  // Discounts
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
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add lib/sanity/admin-queries.ts lib/sanity/admin-fetch.ts
git commit -m "feat(admin): add analytics queries and data aggregation helpers"
```

---

## Task 3: Admin Layout + KPICard

**Files:**
- Create: `app/[locale]/admin/layout.tsx`
- Create: `app/[locale]/admin/_components/KPICard.tsx`

- [ ] **Create admin layout with auth guard**

```typescript
// app/[locale]/admin/layout.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()

  if (!session || session.user?.role !== 'admin') {
    redirect(`/${locale}/login`)
  }

  return (
    <div className="min-h-screen bg-charcoal-950" style={{ background: '#0a0a0a' }}>
      <header className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-gold-500" />
            <span className="font-display text-sm font-light tracking-widest text-white/60 uppercase">
              Luxe Parfum · Admin
            </span>
          </div>
          <span className="font-body text-xs text-white/30">
            {session.user?.email}
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  )
}
```

- [ ] **Create KPICard component**

```typescript
// app/[locale]/admin/_components/KPICard.tsx
interface KPICardProps {
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down' | 'flat'
  trendLabel?: string
}

export function KPICard({ label, value, sub, trend, trendLabel }: KPICardProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="mb-2 font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
        {label}
      </p>
      <p className="font-display text-3xl font-light text-white">{value}</p>
      {sub && <p className="mt-1 font-body text-xs text-white/30">{sub}</p>}
      {trend && trendLabel && (
        <p className={`mt-2 font-body text-xs ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-white/30'}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendLabel}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add "app/[locale]/admin/"
git commit -m "feat(admin): add layout with auth guard and KPICard component"
```

---

## Task 4: RevenueChart + StatusDonut

**Files:**
- Create: `app/[locale]/admin/_components/RevenueChart.tsx`
- Create: `app/[locale]/admin/_components/StatusDonut.tsx`

- [ ] **Create RevenueChart (line chart, client)**

```typescript
// app/[locale]/admin/_components/RevenueChart.tsx
'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { RevenuePoint } from '@/lib/sanity/admin-fetch'

interface Props {
  data: RevenuePoint[]
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function formatCurrency(v: number): string {
  return v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(0)}`
}

export function RevenueChart({ data }: Props) {
  return (
    <div className="rounded-2xl border border-white/8 p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="mb-6 font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
        Revenue — Last 30 Days
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={45}
          />
          <Tooltip
            contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
            labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}
            itemStyle={{ color: '#d99a1b' }}
            labelFormatter={formatDate}
            formatter={(v: number) => [`$${v.toFixed(2)}`, 'Revenue']}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#d99a1b"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#d99a1b' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] **Create StatusDonut (pie chart, client)**

```typescript
// app/[locale]/admin/_components/StatusDonut.tsx
'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { StatusCount } from '@/lib/sanity/admin-fetch'

interface Props {
  data: StatusCount[]
}

export function StatusDonut({ data }: Props) {
  const total = data.reduce((s, d) => s + d.count, 0)

  return (
    <div className="rounded-2xl border border-white/8 p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="mb-4 font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
        Orders by Status
      </p>
      <p className="mb-4 font-display text-2xl font-light text-white">{total} total</p>
      {data.length === 0 ? (
        <p className="py-8 text-center font-body text-xs text-white/20">No orders yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              itemStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}
              formatter={(v: number, name: string) => [v, name]}
            />
            <Legend
              formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add "app/[locale]/admin/_components/RevenueChart.tsx" "app/[locale]/admin/_components/StatusDonut.tsx"
git commit -m "feat(admin): add RevenueChart and StatusDonut chart components"
```

---

## Task 5: TopProductsChart + InventoryTable + DiscountTable

**Files:**
- Create: `app/[locale]/admin/_components/TopProductsChart.tsx`
- Create: `app/[locale]/admin/_components/InventoryTable.tsx`
- Create: `app/[locale]/admin/_components/DiscountTable.tsx`

- [ ] **Create TopProductsChart (horizontal bar, client)**

```typescript
// app/[locale]/admin/_components/TopProductsChart.tsx
'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TopProduct } from '@/lib/sanity/admin-fetch'

interface Props {
  data: TopProduct[]
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + '…' : s
}

export function TopProductsChart({ data }: Props) {
  const chartData = data.map((d) => ({ ...d, shortName: truncate(d.name, 20) }))

  return (
    <div className="rounded-2xl border border-white/8 p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="mb-6 font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
        Top Products — Last 30 Days
      </p>
      {data.length === 0 ? (
        <p className="py-8 text-center font-body text-xs text-white/20">No orders in last 30 days</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(v) => `$${v}`}
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="shortName"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={130}
            />
            <Tooltip
              contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              itemStyle={{ color: '#d99a1b', fontSize: 11 }}
              formatter={(v: number) => [`$${v.toFixed(2)}`, 'Revenue']}
            />
            <Bar dataKey="revenue" fill="#d99a1b" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
```

- [ ] **Create InventoryTable (client)**

```typescript
// app/[locale]/admin/_components/InventoryTable.tsx
'use client'

import type { AdminProduct } from '@/lib/sanity/admin-fetch'

interface Props {
  products: AdminProduct[]
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="rounded-full bg-red-500/20 px-2 py-0.5 font-body text-[10px] font-semibold text-red-400">Out of Stock</span>
  if (stock <= 5) return <span className="rounded-full bg-red-500/10 px-2 py-0.5 font-body text-[10px] font-semibold text-red-300">{stock} left</span>
  return <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-body text-[10px] font-semibold text-amber-300">{stock} left</span>
}

export function InventoryTable({ products }: Props) {
  return (
    <div className="rounded-2xl border border-white/8 p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="mb-5 font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
        Low Stock Alert (≤ 10 units)
      </p>
      {products.length === 0 ? (
        <p className="py-6 text-center font-body text-xs text-green-400">All products well stocked ✓</p>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p._id} className="flex items-center justify-between rounded-xl bg-white/3 px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div>
                <p className="font-body text-sm text-white/80">{p.name_en}</p>
                {p.category && <p className="font-body text-[10px] text-white/30">{p.category}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-body text-xs text-white/30">${p.price}</span>
                <StockBadge stock={p.stock} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Create DiscountTable (client)**

```typescript
// app/[locale]/admin/_components/DiscountTable.tsx
'use client'

interface Props {
  totalDiscountGiven: number
  ordersWithDiscount: number
  orderCount: number
}

export function DiscountSummary({ totalDiscountGiven, ordersWithDiscount, orderCount }: Props) {
  const pct = orderCount > 0 ? ((ordersWithDiscount / orderCount) * 100).toFixed(1) : '0'

  return (
    <div className="rounded-2xl border border-white/8 p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="mb-5 font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
        Discount Performance
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <p className="font-body text-[10px] text-white/30 uppercase tracking-wider mb-1">Total Saved by Customers</p>
          <p className="font-display text-2xl font-light text-white">${totalDiscountGiven.toFixed(2)}</p>
        </div>
        <div>
          <p className="font-body text-[10px] text-white/30 uppercase tracking-wider mb-1">Orders with Discount</p>
          <p className="font-display text-2xl font-light text-white">{ordersWithDiscount}</p>
        </div>
        <div>
          <p className="font-body text-[10px] text-white/30 uppercase tracking-wider mb-1">Discount Usage Rate</p>
          <p className="font-display text-2xl font-light text-white">{pct}%</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Commit**

```bash
git add "app/[locale]/admin/_components/"
git commit -m "feat(admin): add TopProductsChart, InventoryTable, DiscountSummary components"
```

---

## Task 6: Main Admin Dashboard Page

**Files:**
- Create: `app/[locale]/admin/page.tsx`

- [ ] **Create the main admin page**

```typescript
// app/[locale]/admin/page.tsx
import type { Metadata } from 'next'
import { getAdminStats } from '@/lib/sanity/admin-fetch'
import { KPICard } from './_components/KPICard'
import { RevenueChart } from './_components/RevenueChart'
import { StatusDonut } from './_components/StatusDonut'
import { TopProductsChart } from './_components/TopProductsChart'
import { InventoryTable } from './_components/InventoryTable'
import { DiscountSummary } from './_components/DiscountTable'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Admin Dashboard — Luxe Parfum',
  robots: { index: false, follow: false },
}

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)
}

export default async function AdminPage() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <p className="mb-1 font-body text-[9px] font-semibold uppercase tracking-[0.4em] text-white/30">
          Overview
        </p>
        <h1 className="font-display text-3xl font-light text-white">Dashboard</h1>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard
          label="Total Revenue"
          value={fmt(stats.totalRevenue)}
          sub={`${stats.orderCount} paid orders`}
        />
        <KPICard
          label="Revenue (30d)"
          value={fmt(stats.revenue30d)}
          sub={`${stats.orderCount7d} orders last 7d`}
          trend={stats.revenue7d > 0 ? 'up' : 'flat'}
          trendLabel={`${fmt(stats.revenue7d)} this week`}
        />
        <KPICard
          label="Avg Order Value"
          value={fmt(stats.aov)}
          sub="Paid orders all time"
        />
        <KPICard
          label="Customers"
          value={stats.totalUsers.toString()}
          sub={`+${stats.newUsersThisMonth} this month`}
          trend={stats.newUsersThisMonth > 0 ? 'up' : 'flat'}
          trendLabel="new this month"
        />
      </div>

      {/* Today row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard label="Revenue Today" value={fmt(stats.revenueToday)} sub={`${stats.orderCountToday} orders`} />
        <KPICard label="Revenue (7d)" value={fmt(stats.revenue7d)} sub={`${stats.orderCount7d} orders`} />
        <KPICard label="Discount Given" value={fmt(stats.totalDiscountGiven)} sub={`${stats.ordersWithDiscount} orders used promo`} />
        <KPICard
          label="Low Stock Items"
          value={stats.lowStockProducts.length.toString()}
          sub={stats.lowStockProducts.filter(p => p.stock === 0).length + ' out of stock'}
          trend={stats.lowStockProducts.filter(p => p.stock === 0).length > 0 ? 'down' : 'flat'}
          trendLabel={stats.lowStockProducts.length > 0 ? 'need restocking' : 'all stocked'}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={stats.revenueByDay} />
        </div>
        <div>
          <StatusDonut data={stats.ordersByStatus} />
        </div>
      </div>

      {/* Products row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopProductsChart data={stats.topProducts} />
        <InventoryTable products={stats.lowStockProducts} />
      </div>

      {/* Discounts */}
      <DiscountSummary
        totalDiscountGiven={stats.totalDiscountGiven}
        ordersWithDiscount={stats.ordersWithDiscount}
        orderCount={stats.orderCount}
      />
    </div>
  )
}
```

- [ ] **Verify TypeScript compiles**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npx tsc --noEmit 2>&1 | head -30
```

Expected: 0 errors

- [ ] **Run build**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test && npm run build 2>&1 | tail -20
```

Expected: Build succeeds, `/[locale]/admin` appears in route list.

- [ ] **Commit**

```bash
git add "app/[locale]/admin/page.tsx"
git commit -m "feat(admin): add main analytics dashboard page"
```
