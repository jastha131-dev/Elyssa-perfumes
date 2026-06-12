import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, phone, nationality, dateOfBirth, locale } = body

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    // Validate optional string fields
    if (phone !== undefined && typeof phone !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    if (nationality !== undefined && typeof nationality !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    if (dateOfBirth !== undefined && typeof dateOfBirth !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    await writeClient.create({
      _type: 'newsletterLead',
      email: email.trim().toLowerCase(),
      phone: typeof phone === 'string' && phone.trim() ? '+971' + phone.trim() : undefined,
      nationality: typeof nationality === 'string' ? nationality.trim() || undefined : undefined,
      dateOfBirth: typeof dateOfBirth === 'string' ? dateOfBirth || undefined : undefined,
      locale: typeof locale === 'string' ? locale || 'en' : 'en',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[newsletter-lead]', err)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }
}
