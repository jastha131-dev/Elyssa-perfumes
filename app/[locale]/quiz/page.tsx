import type { Metadata } from 'next'
import { getAllProducts } from '@/lib/sanity/fetch'
import { QuizClient } from './_client'

export const metadata: Metadata = {
  title: 'Scent Quiz — Luxe Parfum',
  description: 'Find your perfect fragrance in 5 questions. Our AI recommends the ideal scent for your personality and lifestyle.',
}

export const revalidate = 3600

export default async function QuizPage() {
  const products = await getAllProducts()
  return <QuizClient products={products} />
}
