import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createClient } from '@sanity/client'

const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name } = await req.json() as { name: string }
  if (!name?.trim()) return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
  const userId = (session.user as { id: string }).id
  await adminClient.patch(userId).set({ name: name.trim() }).commit()
  return NextResponse.json({ ok: true })
}
