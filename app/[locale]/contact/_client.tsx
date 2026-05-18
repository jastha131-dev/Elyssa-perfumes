'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import { Mail, Phone, MapPin, MessageCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ContactPageData } from '@/lib/types'

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay },
  }),
}

// ─── Form types ────────────────────────────────────────────────────────────────

type FormStatus = 'idle' | 'sending' | 'sent' | 'error'

interface FormFields {
  name: string
  email: string
  subject: string
  message: string
}

const SUBJECTS = [
  'Order Inquiry',
  'Product Question',
  'Wholesale',
  'General',
]

// ─── Component ─────────────────────────────────────────────────────────────────

export function ContactClient({ data }: { data: ContactPageData | null }) {
  const locale = useLocale()
  const isAr = locale === 'ar'

  // Resolved content (falls back to defaults when data is null)
  const heading =
    (isAr ? data?.heading_ar : data?.heading_en) ?? 'Get in Touch'
  const subtext =
    (isAr ? data?.subtext_ar : data?.subtext_en) ??
    'We would love to hear from you. Reach out to us through any of the channels below or fill in the form and we will respond within 24 hours.'
  const address =
    (isAr ? data?.address_ar : data?.address_en) ??
    'Dubai Design District, Building 7\nDubai, United Arab Emirates'
  const email = data?.email ?? 'hello@luxeparfum.com'
  const phone = data?.phone ?? '+971 4 000 0000'
  const whatsapp = data?.whatsappNumber
  const instagram = data?.instagramUrl

  // ─── Form state ───────────────────────────────────────────────────────────

  const [fields, setFields] = useState<FormFields>({
    name: '',
    email: '',
    subject: SUBJECTS[0],
    message: '',
  })
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({})
  const [status, setStatus] = useState<FormStatus>('idle')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }))
  }

  const isInvalid = (field: keyof FormFields) =>
    touched[field] && fields[field].trim() === ''

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true, subject: true })

    if (!fields.name.trim() || !fields.email.trim() || !fields.message.trim()) return

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      if (res.ok) {
        setStatus('sent')
        setFields({ name: '', email: '', subject: SUBJECTS[0], message: '' })
        setTouched({})
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className={cn('pt-[72px]', isAr && 'rtl')}>

      {/* ═══════════════════════ DARK HERO ═══════════════════════ */}
      <section className="relative overflow-hidden bg-charcoal-950 pb-28 pt-24">
        {/* Gold ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-1/4 left-1/2 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-gold-500/[0.04] blur-[120px]" />
        </div>

        {/* Decorative top rule */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Eyebrow */}
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-4 text-[10px] font-semibold uppercase tracking-[0.45em] text-gold-500"
          >
            Contact
          </motion.p>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.08}
            className="max-w-2xl font-display text-5xl font-light leading-tight text-cream-100 md:text-7xl"
          >
            {heading}
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.18}
            className="mt-8 max-w-lg text-sm font-light leading-relaxed text-cream-300/80"
          >
            {subtext}
          </motion.p>

          {/* Decorative divider */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0.28}
            className="mt-14 flex items-center gap-5"
          >
            <div className="h-px w-14 bg-gold-500/60" />
            <span className="text-[9px] uppercase tracking-[0.4em] text-gold-500/50">
              Luxe Parfum · Est. 2010
            </span>
          </motion.div>

          {/* ── Contact info cards ── */}
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Email */}
            <motion.a
              href={`mailto:${email}`}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.32}
              className="group flex items-start gap-4 rounded-none border border-white/8 bg-charcoal-900/60 px-6 py-6 transition-colors duration-300 hover:border-gold-500/30 hover:bg-charcoal-900"
            >
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-gold-500/20 bg-gold-500/5 transition-colors duration-300 group-hover:border-gold-500/40">
                <Mail className="h-4 w-4 text-gold-500" />
              </div>
              <div>
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.35em] text-charcoal-400">
                  Email
                </p>
                <p className="text-sm font-light text-cream-100 transition-colors duration-300 group-hover:text-gold-400">
                  {email}
                </p>
              </div>
            </motion.a>

            {/* Phone */}
            <motion.a
              href={`tel:${phone.replace(/\s/g, '')}`}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="group flex items-start gap-4 rounded-none border border-white/8 bg-charcoal-900/60 px-6 py-6 transition-colors duration-300 hover:border-gold-500/30 hover:bg-charcoal-900"
            >
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-gold-500/20 bg-gold-500/5 transition-colors duration-300 group-hover:border-gold-500/40">
                <Phone className="h-4 w-4 text-gold-500" />
              </div>
              <div>
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.35em] text-charcoal-400">
                  Phone
                </p>
                <p className="text-sm font-light text-cream-100 transition-colors duration-300 group-hover:text-gold-400">
                  {phone}
                </p>
              </div>
            </motion.a>

            {/* WhatsApp */}
            <motion.a
              href={
                whatsapp
                  ? `https://wa.me/${whatsapp.replace(/\D/g, '')}`
                  : 'https://wa.me/971400000000'
              }
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.48}
              className="group flex items-start gap-4 rounded-none border border-white/8 bg-charcoal-900/60 px-6 py-6 transition-colors duration-300 hover:border-gold-500/30 hover:bg-charcoal-900"
            >
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-gold-500/20 bg-gold-500/5 transition-colors duration-300 group-hover:border-gold-500/40">
                <MessageCircle className="h-4 w-4 text-gold-500" />
              </div>
              <div>
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.35em] text-charcoal-400">
                  WhatsApp
                </p>
                <p className="text-sm font-light text-cream-100 transition-colors duration-300 group-hover:text-gold-400">
                  Message us directly
                </p>
              </div>
            </motion.a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ MAIN SECTION ═══════════════════════ */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[1fr_380px] lg:gap-24">

            {/* ── LEFT: Contact form ── */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              custom={0}
            >
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-500/70">
                Send a Message
              </p>
              <h2 className="mb-10 font-display text-3xl font-light text-charcoal-900 md:text-4xl">
                We would love to<br />
                <em className="font-light italic text-charcoal-500">hear from you</em>
              </h2>

              {/* Success message */}
              {status === 'sent' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 border-l-2 border-gold-500 bg-gold-50 px-5 py-4"
                >
                  <p className="text-sm font-medium text-charcoal-900">Message sent.</p>
                  <p className="mt-0.5 text-sm font-light text-charcoal-600">
                    Thank you for reaching out. We will get back to you within 24 hours.
                  </p>
                </motion.div>
              )}

              {/* Error message */}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 border-l-2 border-red-400 bg-red-50 px-5 py-4"
                >
                  <p className="text-sm font-medium text-charcoal-900">Something went wrong.</p>
                  <p className="mt-0.5 text-sm font-light text-charcoal-600">
                    Please try again or email us directly at {email}.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name + Email row */}
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.3em] text-charcoal-500"
                    >
                      Name <span className="text-gold-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={fields.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your name"
                      className={cn(
                        'w-full rounded-none border border-charcoal-200 bg-white px-4 py-3 text-sm font-light text-charcoal-900 placeholder-charcoal-300 outline-none transition-colors duration-200 focus:border-charcoal-900 focus:ring-0',
                        isInvalid('name') && 'border-red-400 bg-red-50/30'
                      )}
                    />
                    {isInvalid('name') && (
                      <p className="mt-1 text-[10px] text-red-500">Name is required.</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.3em] text-charcoal-500"
                    >
                      Email <span className="text-gold-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={fields.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="your@email.com"
                      className={cn(
                        'w-full rounded-none border border-charcoal-200 bg-white px-4 py-3 text-sm font-light text-charcoal-900 placeholder-charcoal-300 outline-none transition-colors duration-200 focus:border-charcoal-900 focus:ring-0',
                        isInvalid('email') && 'border-red-400 bg-red-50/30'
                      )}
                    />
                    {isInvalid('email') && (
                      <p className="mt-1 text-[10px] text-red-500">Email is required.</p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.3em] text-charcoal-500"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={fields.subject}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-none border border-charcoal-200 bg-white px-4 py-3 text-sm font-light text-charcoal-900 outline-none transition-colors duration-200 focus:border-charcoal-900 focus:ring-0"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.3em] text-charcoal-500"
                  >
                    Message <span className="text-gold-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={fields.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tell us how we can help…"
                    className={cn(
                      'w-full resize-none rounded-none border border-charcoal-200 bg-white px-4 py-3 text-sm font-light text-charcoal-900 placeholder-charcoal-300 outline-none transition-colors duration-200 focus:border-charcoal-900 focus:ring-0',
                      isInvalid('message') && 'border-red-400 bg-red-50/30'
                    )}
                  />
                  {isInvalid('message') && (
                    <p className="mt-1 text-[10px] text-red-500">Message is required.</p>
                  )}
                </div>

                {/* Submit */}
                <div className="flex items-center gap-6">
                  <button
                    type="submit"
                    disabled={status === 'sending' || status === 'sent'}
                    className="inline-flex items-center gap-3 bg-charcoal-950 px-10 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-camel-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'sending' ? (
                      <>
                        {/* Spinner */}
                        <svg
                          className="h-3.5 w-3.5 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Sending…
                      </>
                    ) : status === 'sent' ? (
                      'Message Sent'
                    ) : (
                      'Send Message'
                    )}
                  </button>

                  <p className="text-[10px] font-light text-charcoal-400">
                    We reply within 24 hours.
                  </p>
                </div>
              </form>
            </motion.div>

            {/* ── RIGHT: Info sidebar ── */}
            <div className="space-y-10">

              {/* Address card */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                custom={0.1}
                className="border border-charcoal-100 bg-charcoal-50 px-7 py-8"
              >
                <div className="mb-5 flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gold-500" />
                  <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-charcoal-500">
                    Our Location
                  </p>
                </div>
                <p className="whitespace-pre-line text-sm font-light leading-relaxed text-charcoal-700">
                  {address}
                </p>
              </motion.div>

              {/* Operating hours */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                custom={0.18}
                className="border border-charcoal-100 bg-charcoal-50 px-7 py-8"
              >
                <div className="mb-5 flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gold-500" />
                  <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-charcoal-500">
                    Operating Hours
                  </p>
                </div>
                <div className="space-y-2.5">
                  {[
                    { day: 'Monday – Saturday', hours: '9:00 AM – 6:00 PM' },
                    { day: 'Sunday', hours: 'Closed' },
                    { day: 'Time zone', hours: 'GST (UTC+4)' },
                  ].map(({ day, hours }) => (
                    <div key={day} className="flex items-start justify-between gap-4">
                      <span className="text-xs font-light text-charcoal-500">{day}</span>
                      <span className="text-xs font-medium text-charcoal-900">{hours}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Social links */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                custom={0.26}
              >
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.35em] text-charcoal-500">
                  Follow Us
                </p>
                <div className="flex flex-col gap-3">
                  {/* Instagram */}
                  {(instagram || true) && (
                    <a
                      href={instagram ?? 'https://instagram.com/luxeparfum'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 border border-charcoal-200 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal-700 transition-all duration-300 hover:border-charcoal-900 hover:text-charcoal-900"
                    >
                      {/* Instagram icon */}
                      <svg className="h-3.5 w-3.5 transition-colors duration-300 group-hover:text-gold-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden>
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                      </svg>
                      Instagram
                    </a>
                  )}

                  {/* WhatsApp */}
                  <a
                    href={
                      whatsapp
                        ? `https://wa.me/${whatsapp.replace(/\D/g, '')}`
                        : 'https://wa.me/971400000000'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 border border-charcoal-200 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal-700 transition-all duration-300 hover:border-charcoal-900 hover:text-charcoal-900"
                  >
                    <MessageCircle className="h-3.5 w-3.5 transition-colors duration-300 group-hover:text-gold-500" />
                    WhatsApp
                  </a>
                </div>
              </motion.div>

              {/* Gold accent note */}
              <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                custom={0.34}
                className="border-l-2 border-gold-500/60 pl-5"
              >
                <p className="text-xs font-light leading-relaxed text-charcoal-500">
                  For urgent inquiries regarding an existing order, please include your order number in the subject line for faster assistance.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ MAP ═══════════════════════ */}
      <section className="relative h-[480px] w-full overflow-hidden bg-charcoal-950">
        {/* Label overlay — top-left */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          className="absolute left-6 top-6 z-10 border border-gold-500/30 bg-charcoal-950/90 px-5 py-4 backdrop-blur-sm sm:left-10 sm:top-10"
        >
          <p className="mb-0.5 text-[8px] font-bold uppercase tracking-[0.45em] text-gold-500">
            Find Us
          </p>
          <p className="text-sm font-light text-cream-100">Dubai International Financial Centre</p>
          <p className="text-[11px] font-light text-cream-300/60">Dubai, United Arab Emirates</p>
        </motion.div>

        {/* Map iframe */}
        <iframe
          title="Luxe Parfum location"
          src="https://www.openstreetmap.org/export/embed.html?bbox=55.2720%2C25.2020%2C55.3020%2C25.2180&layer=mapnik&marker=25.2097%2C55.2870"
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          aria-label="Map showing Luxe Parfum office in Dubai International Financial Centre"
        />

        {/* Gradient vignette edges */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-charcoal-950/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-charcoal-950/30 to-transparent" />
        </div>

        {/* Directions link — bottom-right */}
        <a
          href="https://www.openstreetmap.org/?mlat=25.2097&mlon=55.2870#map=16/25.2097/55.2870"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-6 right-6 z-10 flex items-center gap-2 border border-gold-500/40 bg-charcoal-950/90 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400 backdrop-blur-sm transition-colors duration-200 hover:border-gold-400 hover:text-gold-300 sm:bottom-10 sm:right-10"
        >
          <MapPin className="h-3 w-3" />
          Get Directions
        </a>
      </section>

      {/* ═══════════════════════ BOTTOM STRIP ═══════════════════════ */}
      <section className="border-t border-charcoal-100 bg-charcoal-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-500/60">
                Luxe Parfum
              </p>
              <p className="text-sm font-light text-cream-300/60">
                The art of fragrance, delivered.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-gold-500/40" />
              <span className="text-[9px] uppercase tracking-[0.35em] text-gold-500/40">
                Dubai · UAE
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
