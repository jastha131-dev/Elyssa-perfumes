import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/lib/sanity/client'

const QUESTIONS_QUERY = `*[_type == "productQuestion" && product._ref == $productId && approved == true] | order(createdAt desc) {
  _id, name, question, answer, createdAt
}`

// GET /api/questions?productId=xxx → approved Q&A for a product
export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  try {
    const questions = await client.fetch(QUESTIONS_QUERY, { productId }, { cache: 'no-store' })
    return NextResponse.json({ questions })
  } catch {
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
  }
}

// POST /api/questions → submit a new question (saved to Studio)
export async function POST(req: NextRequest) {
  try {
    const { productId, name, email, question } = await req.json()
    if (!productId || !name || !question) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const created = await writeClient.create({
      _type: 'productQuestion',
      product: { _type: 'reference', _ref: productId },
      name: String(name).slice(0, 80),
      email: email ? String(email).slice(0, 120) : undefined,
      question: String(question).slice(0, 600),
      approved: true,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      question: { _id: created._id, name: created.name, question: created.question, answer: null, createdAt: created.createdAt },
    })
  } catch (e) {
    console.error('[questions] submit failed', e)
    return NextResponse.json({ error: 'Failed to submit question' }, { status: 500 })
  }
}
