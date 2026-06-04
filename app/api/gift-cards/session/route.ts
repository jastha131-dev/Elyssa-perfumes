import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('sessionId')

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'Missing sessionId parameter.' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    const code = session.metadata?.giftCardCode
    const amountCents = session.amount_total
    const recipientName = session.metadata?.recipientName ?? null

    if (!code) {
      return NextResponse.json({ error: 'Gift card code not found in session.' }, { status: 404 })
    }

    return NextResponse.json({ code, amountCents, recipientName })
  } catch (error) {
    console.error('[Gift Card Session Error]:', error)
    return NextResponse.json({ error: 'Failed to retrieve session.' }, { status: 500 })
  }
}
