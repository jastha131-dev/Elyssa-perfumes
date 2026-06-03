import { auth } from '@/auth'
import { notFound } from 'next/navigation'
import AccountDashboard from './_components/AccountDashboard'

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user) notFound()
  return <AccountDashboard user={session.user as { id: string; name?: string | null; email?: string | null }} />
}
