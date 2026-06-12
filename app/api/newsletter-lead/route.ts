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

    await writeClient.create({
      _type: 'newsletterLead',
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      nationality: nationality?.trim() || undefined,
      dateOfBirth: dateOfBirth || undefined,
      locale: locale || 'en',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[newsletter-lead]', err)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }
}
