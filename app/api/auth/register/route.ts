import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createClient } from '@sanity/client'

const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json() as { name: string; email: string; password: string }

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const existing = await adminClient.fetch<{ _id: string } | null>(
      `*[_type == "user" && email == $email][0]{ _id }`,
      { email: normalizedEmail }
    )
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const newUser = await adminClient.create({
      _type: 'user',
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'customer',
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ id: newUser._id, email: newUser.email })
  } catch {
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}
