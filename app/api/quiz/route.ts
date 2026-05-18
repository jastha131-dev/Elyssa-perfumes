import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface QuizAnswers {
  recipient: string   // 'myself' | 'gift'
  vibe: string        // e.g. 'Fresh & Citrus'
  occasion: string    // e.g. 'Daily'
  intensity: string   // e.g. 'Light'
  budget: string      // e.g. 'Under AED 100'
}

interface ProductInfo {
  _id: string
  name: string
  slug: string
  price: number
  fragranceFamily: string
  intensity: string
  tags: string[]
  topNotes: string[]
  imageUrl?: string
}

export async function POST(req: NextRequest) {
  try {
    const { answers, products }: { answers: QuizAnswers; products: ProductInfo[] } = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'AI recommendations not configured' }, { status: 503 })
    }

    const productCatalogue = products.map(p => ({
      id: p._id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      fragranceFamily: p.fragranceFamily,
      intensity: p.intensity,
      tags: p.tags,
      topNotes: p.topNotes,
    }))

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are a luxury fragrance expert at Luxe Parfum. A customer has completed a scent quiz with these answers:

- Who is it for: ${answers.recipient}
- Desired vibe: ${answers.vibe}
- Occasion: ${answers.occasion}
- Preferred intensity: ${answers.intensity}
- Budget: ${answers.budget}

Our fragrance catalogue:
${JSON.stringify(productCatalogue, null, 2)}

Recommend exactly 3 fragrances from our catalogue that best match this customer's preferences. Return ONLY a valid JSON array with exactly 3 objects in this format (no markdown, no explanation outside the JSON):
[
  {
    "id": "product _id",
    "slug": "product slug",
    "reason": "One sentence explaining why this scent matches their profile, written warmly and poetically (max 20 words)"
  }
]

If fewer than 3 products exist, repeat the best match. Always return exactly 3 objects.`,
      }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    // Extract JSON from the response (handle any extra text)
    const jsonMatch = content.text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('No JSON array in response')

    const recommendations = JSON.parse(jsonMatch[0]) as Array<{
      id: string; slug: string; reason: string
    }>

    // Hydrate with full product info
    const results = recommendations.map(rec => {
      const product = products.find(p => p._id === rec.id || p.slug === rec.slug)
      return { ...rec, product }
    }).filter(r => r.product)

    return NextResponse.json({ recommendations: results })
  } catch (err) {
    console.error('Quiz API error:', err)
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 })
  }
}
