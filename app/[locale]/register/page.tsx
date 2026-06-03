'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useLocale } from 'next-intl'

export default function RegisterPage() {
  const locale = useLocale()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) { setError(data.error ?? 'Registration failed.'); return }

      // Auto sign-in after registration
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) { setError('Registered but sign-in failed. Please log in.'); return }
      router.push(`/${locale}/account`)
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
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
          <p className="mb-2 font-body text-xs uppercase tracking-[0.3em] text-camel-500">Join us</p>
          <h1 className="font-display text-3xl font-light text-ink-900">Create Account</h1>
          <div className="mx-auto mt-4 h-px w-10 bg-camel-400/50" />
        </div>

        <div className="bg-white px-8 py-10 shadow-sm border border-stone-100">
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 bg-red-50 border border-red-200 px-4 py-3 font-body text-sm text-red-600">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block font-body text-xs uppercase tracking-[0.15em] text-ink-500">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required
                className="w-full border border-stone-200 bg-white px-4 py-3 font-body text-sm text-ink-900 outline-none focus:border-camel-400 transition-colors"
                placeholder="Your full name" />
            </div>
            <div>
              <label className="mb-1.5 block font-body text-xs uppercase tracking-[0.15em] text-ink-500">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
                className="w-full border border-stone-200 bg-white px-4 py-3 font-body text-sm text-ink-900 outline-none focus:border-camel-400 transition-colors"
                placeholder="your@email.com" />
            </div>
            <div>
              <label className="mb-1.5 block font-body text-xs uppercase tracking-[0.15em] text-ink-500">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                  className="w-full border border-stone-200 bg-white px-4 py-3 pr-11 font-body text-sm text-ink-900 outline-none focus:border-camel-400 transition-colors"
                  placeholder="Min 8 characters" />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-camel-500 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-camel-600 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={14} className="animate-spin" /> Creating account&hellip;</> : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center font-body text-sm text-ink-400">
            Already have an account?{' '}
            <Link href={`/${locale}/login`} className="text-camel-500 hover:text-camel-700 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
