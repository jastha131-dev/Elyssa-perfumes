import { NextRequest, NextResponse } from 'next/server'
import { searchProducts } from '@/lib/sanity/fetch'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (!q) return NextResponse.json([])
  const results = await searchProducts(q)
  return NextResponse.json(results)
}
