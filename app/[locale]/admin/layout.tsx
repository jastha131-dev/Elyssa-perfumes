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

  if (!session || (session.user as { role?: string } | undefined)?.role !== 'admin') {
    redirect(`/${locale}/login`)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 20, height: 20, background: '#d99a1b', borderRadius: 4 }} />
            <span style={{ fontFamily: 'inherit', fontSize: 11, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
              Luxe Parfum · Admin
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{session.user?.email}</span>
        </div>
      </header>
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>{children}</main>
    </div>
  )
}
