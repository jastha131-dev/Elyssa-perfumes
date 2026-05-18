import type { Metadata } from 'next'
import { getFaqItems } from '@/lib/sanity/fetch'
import { FaqClient } from './_client'

export const metadata: Metadata = {
  title: 'FAQ — Luxe Parfum',
  description: 'Frequently asked questions about Luxe Parfum fragrances, shipping, returns and more.',
}

export const revalidate = 3600

export default async function FaqPage() {
  const items = await getFaqItems()
  return <FaqClient items={items} />
}
