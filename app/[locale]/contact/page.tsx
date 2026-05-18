import type { Metadata } from 'next'
import { getContactPage } from '@/lib/sanity/fetch'
import { ContactClient } from './_client'

export const metadata: Metadata = {
  title: 'Contact — Luxe Parfum',
  description: "Get in touch with Luxe Parfum. We'd love to hear from you.",
}

export const revalidate = 3600

export default async function ContactPage() {
  const data = await getContactPage()
  return <ContactClient data={data} />
}
