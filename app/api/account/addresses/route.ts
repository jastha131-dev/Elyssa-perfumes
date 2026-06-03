import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createClient } from '@sanity/client'
import type { UserAddress } from '@/lib/types'

const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as UserAddress & { userId: string }
  const userId = (session.user as { id: string }).id

  // If setting as default, unset all others
  if (body.isDefault) {
    const existing = await adminClient.fetch<{ _id: string }[]>(
      `*[_type == "address" && user._ref == $userId && isDefault == true]{ _id }`,
      { userId }
    )
    for (const a of existing) {
      await adminClient.patch(a._id).set({ isDefault: false }).commit()
    }
  }

  const created = await adminClient.create({
    _type: 'address',
    user: { _type: 'reference', _ref: userId },
    label: body.label,
    firstName: body.firstName,
    lastName: body.lastName,
    address1: body.address1,
    address2: body.address2 || undefined,
    city: body.city,
    state: body.state || undefined,
    country: body.country,
    postalCode: body.postalCode || undefined,
    phone: body.phone || undefined,
    isDefault: body.isDefault ?? false,
  })

  return NextResponse.json(created)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  await adminClient.delete(id)
  return NextResponse.json({ ok: true })
}
