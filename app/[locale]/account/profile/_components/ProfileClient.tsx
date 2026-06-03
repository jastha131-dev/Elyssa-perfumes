'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

interface Props { user: { id: string; name?: string | null; email?: string | null } }

export default function ProfileClient({ user }: Props) {
  const locale = useLocale()
  const router = useRouter()
  const [name, setName] = useState(user.name ?? '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) { const d = await res.json() as { error: string }; setError(d.error); return }
      setSuccess(true)
      router.refresh()
    } catch {
      setError('Update failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-16">
      <div className="mx-auto max-w-lg px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href={`/${locale}/account`} className="text-ink-400 hover:text-ink-700 transition-colors"><ArrowLeft size={18} /></Link>
          <h1 className="font-display text-2xl font-light text-ink-900">Profile</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-stone-100 px-8 py-8">
          {success && <div className="mb-5 bg-green-50 border border-green-200 px-4 py-3 font-body text-sm text-green-700">Profile updated.</div>}
          {error && <div className="mb-5 bg-red-50 border border-red-200 px-4 py-3 font-body text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block font-body text-xs uppercase tracking-[0.15em] text-ink-500">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required
                className="w-full border border-stone-200 px-4 py-3 font-body text-sm text-ink-900 outline-none focus:border-camel-400 transition-colors" />
            </div>
            <div>
              <label className="mb-1.5 block font-body text-xs uppercase tracking-[0.15em] text-ink-500">Email</label>
              <input value={user.email ?? ''} disabled className="w-full border border-stone-100 bg-stone-50 px-4 py-3 font-body text-sm text-ink-400 cursor-not-allowed" />
              <p className="mt-1 font-body text-xs text-ink-400">Email cannot be changed.</p>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-camel-500 py-3.5 font-body text-sm font-semibold uppercase tracking-[0.18em] text-white hover:bg-camel-600 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors">
              {loading ? <><Loader2 size={14} className="animate-spin" /> Saving&hellip;</> : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
