import { auth } from '@/auth'
import { notFound } from 'next/navigation'
import ProfileClient from './_components/ProfileClient'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) notFound()
  return <ProfileClient user={session.user as { id: string; name?: string | null; email?: string | null }} />
}
