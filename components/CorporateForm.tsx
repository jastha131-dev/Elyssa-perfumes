'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'

export default function CorporateForm() {
  const isAr = useLocale() === 'ar'
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const L = isAr
    ? { h: 'استفسار الهدايا للشركات', sub: 'أخبرنا عن احتياجاتك وسيتواصل فريق الشركات معك.', name: 'الاسم', company: 'الشركة', email: 'البريد الإلكتروني', phone: 'الهاتف', message: 'رسالتك', send: 'إرسال الاستفسار', sending: 'جارٍ الإرسال…', done: 'شكراً! سيتواصل فريقنا معك قريباً.', err: 'حدث خطأ. حاول مرة أخرى.' }
    : { h: 'Corporate Gifting Enquiry', sub: 'Tell us about your needs and our corporate team will be in touch.', name: 'Name', company: 'Company', email: 'Email', phone: 'Phone', message: 'Your message', send: 'Send Enquiry', sending: 'Sending…', done: 'Thank you! Our team will be in touch shortly.', err: 'Something went wrong. Please try again.' }

  const upd = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: 'Corporate Gifting Enquiry',
          message: `Company: ${form.company}\nPhone: ${form.phone}\n\n${form.message}`,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="bg-cream-50 px-4 py-16 sm:px-6 lg:px-8" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-xl">
        <h2 className="text-center font-display text-2xl font-light text-charcoal-900">{L.h}</h2>
        <p className="mx-auto mt-2 max-w-md text-center font-body text-sm text-charcoal-500">{L.sub}</p>

        {status === 'done' ? (
          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-8 text-center font-body text-sm text-green-800">
            ✓ {L.done}
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input required value={form.name} onChange={upd('name')} placeholder={L.name} className="rounded-lg border border-charcoal-200 bg-white px-4 py-3 font-body text-sm focus:border-gold-500 focus:outline-none" />
            <input value={form.company} onChange={upd('company')} placeholder={L.company} className="rounded-lg border border-charcoal-200 bg-white px-4 py-3 font-body text-sm focus:border-gold-500 focus:outline-none" />
            <input required type="email" value={form.email} onChange={upd('email')} placeholder={L.email} className="rounded-lg border border-charcoal-200 bg-white px-4 py-3 font-body text-sm focus:border-gold-500 focus:outline-none" />
            <input value={form.phone} onChange={upd('phone')} placeholder={L.phone} className="rounded-lg border border-charcoal-200 bg-white px-4 py-3 font-body text-sm focus:border-gold-500 focus:outline-none" />
            <textarea required value={form.message} onChange={upd('message')} placeholder={L.message} rows={4} className="rounded-lg border border-charcoal-200 bg-white px-4 py-3 font-body text-sm focus:border-gold-500 focus:outline-none sm:col-span-2" />
            {status === 'error' && <p className="font-body text-xs text-red-600 sm:col-span-2">{L.err}</p>}
            <button type="submit" disabled={status === 'sending'} className="rounded-full bg-charcoal-900 px-8 py-3.5 font-body text-sm font-semibold text-white transition-colors hover:bg-gold-500 disabled:opacity-60 sm:col-span-2">
              {status === 'sending' ? L.sending : L.send}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
