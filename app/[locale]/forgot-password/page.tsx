'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'
import { useLocale } from 'next-intl'

export default function ForgotPasswordPage() {
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 pt-20 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-light text-ink-900">Reset Password</h1>
          <div className="mx-auto mt-4 h-px w-10 bg-camel-400/50" />
        </div>

        <div className="bg-white px-8 py-10 shadow-sm border border-stone-100">
          {submitted ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-camel-50">
                <Mail className="h-6 w-6 text-camel-500" />
              </div>
              <h2 className="font-display text-xl font-light text-ink-900 mb-2">Check your email</h2>
              <p className="font-body text-sm text-ink-500 leading-relaxed">
                If an account exists for <strong>{email}</strong>, a password reset link has been sent.
              </p>
              <Link href={`/${locale}/login`} className="mt-6 inline-flex items-center gap-2 font-body text-sm text-camel-500 hover:text-camel-700 transition-colors">
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </motion.div>
          ) : (
            <>
              <p className="mb-5 font-body text-sm text-ink-500 leading-relaxed">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-1.5 block font-body text-xs uppercase tracking-[0.15em] text-ink-500">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full border border-stone-200 bg-white px-4 py-3 font-body text-sm text-ink-900 outline-none focus:border-camel-400 transition-colors"
                    placeholder="your@email.com" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-camel-500 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.18em] text-white hover:bg-camel-600 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors">
                  {loading ? <><Loader2 size={14} className="animate-spin" /> Sending&hellip;</> : 'Send Reset Link'}
                </button>
              </form>
              <div className="mt-5 text-center">
                <Link href={`/${locale}/login`} className="inline-flex items-center gap-2 font-body text-sm text-ink-400 hover:text-ink-700 transition-colors">
                  <ArrowLeft size={13} /> Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
