// app/[locale]/admin/page.tsx
import type { Metadata } from 'next'
import { getAdminStats } from '@/lib/sanity/admin-fetch'
import { KPICard } from './_components/KPICard'
import { RevenueChart } from './_components/RevenueChart'
import { StatusDonut } from './_components/StatusDonut'
import { TopProductsChart } from './_components/TopProductsChart'
import { InventoryTable } from './_components/InventoryTable'
import { DiscountSummary } from './_components/DiscountSummary'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Admin Dashboard — Luxe Parfum',
  robots: { index: false, follow: false },
}

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(n)
}

export default async function AdminPage() {
  const stats = await getAdminStats()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Heading */}
      <div>
        <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>
          Overview
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 300, color: '#fff', margin: 0 }}>Dashboard</h1>
      </div>

      {/* KPI row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <KPICard label="Total Revenue" value={fmt(stats.totalRevenue)} sub={`${stats.orderCount} paid orders`} />
        <KPICard label="Revenue (30d)" value={fmt(stats.revenue30d)} sub={`${stats.orderCount7d} orders last 7d`} trend={stats.revenue7d > 0 ? 'up' : 'flat'} trendLabel={`${fmt(stats.revenue7d)} this week`} />
        <KPICard label="Avg Order Value" value={fmt(stats.aov)} sub="Paid orders all time" />
        <KPICard label="Customers" value={stats.totalUsers.toString()} sub={`+${stats.newUsersThisMonth} this month`} trend={stats.newUsersThisMonth > 0 ? 'up' : 'flat'} trendLabel="new this month" />
      </div>

      {/* KPI row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <KPICard label="Revenue Today" value={fmt(stats.revenueToday)} sub={`${stats.orderCountToday} orders`} />
        <KPICard label="Revenue (7d)" value={fmt(stats.revenue7d)} sub={`${stats.orderCount7d} orders`} />
        <KPICard label="Discount Given" value={fmt(stats.totalDiscountGiven)} sub={`${stats.ordersWithDiscount} promo orders`} />
        <KPICard
          label="Low Stock Items"
          value={stats.lowStockProducts.length.toString()}
          sub={`${stats.lowStockProducts.filter((p) => p.stock === 0).length} out of stock`}
          trend={stats.lowStockProducts.filter((p) => p.stock === 0).length > 0 ? 'down' : 'flat'}
          trendLabel={stats.lowStockProducts.length > 0 ? 'need restocking' : 'all stocked'}
        />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <RevenueChart data={stats.revenueByDay} />
        <StatusDonut data={stats.ordersByStatus} />
      </div>

      {/* Products + Inventory */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
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
