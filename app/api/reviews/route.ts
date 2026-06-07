import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/lib/sanity/client'

const REVIEWS_QUERY = `*[_type == "productReview" && product._ref == $productId && approved == true] | order(createdAt desc) {
  _id, name, location, rating, title, body, ratingScent, ratingLongevity, ratingValue, verified, createdAt
}`

// GET /api/reviews?productId=xxx  → approved reviews for a product
export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  try {
    const reviews = await client.fetch(REVIEWS_QUERY, { productId }, { cache: 'no-store' })
    return NextResponse.json({ reviews })
  } catch {
    return NextResponse.json({ error: 'Failed to load reviews' }, { status: 500 })
  }
}

// POST /api/reviews  → submit a new review (saved to Studio, realtime)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, name, email, rating, title, review, ratingScent, ratingLongevity, ratingValue, location } = body

    if (!productId || !name || !review || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const r = Number(rating)
    if (!(r >= 1 && r <= 5)) {
      return NextResponse.json({ error: 'Rating must be 1–5' }, { status: 400 })
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const num = (v: unknown) => (v === undefined || v === null || v === '' ? undefined : Math.max(0, Math.min(5, Number(v))))

    const created = await writeClient.create({
      _type: 'productReview',
      product: { _type: 'reference', _ref: productId },
      name: String(name).slice(0, 80),
      email: email ? String(email).slice(0, 120) : undefined,
      location: location ? String(location).slice(0, 60) : undefined,
      rating: r,
      title: title ? String(title).slice(0, 120) : undefined,
      body: String(review).slice(0, 1000),
      ratingScent: num(ratingScent),
      ratingLongevity: num(ratingLongevity),
      ratingValue: num(ratingValue),
      verified: false,
      approved: true,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      review: {
        _id: created._id, name: created.name, location: created.location, rating: created.rating,
        title: created.title, body: created.body, ratingScent: created.ratingScent,
        ratingLongevity: created.ratingLongevity, ratingValue: created.ratingValue,
        verified: false, createdAt: created.createdAt,
      },
    })
  } catch (e) {
    console.error('[reviews] submit failed', e)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
