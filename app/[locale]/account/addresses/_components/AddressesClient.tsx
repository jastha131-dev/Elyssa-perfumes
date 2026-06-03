'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Plus, ArrowLeft, Trash2, Star } from 'lucide-react'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import type { UserAddress } from '@/lib/types'

interface Props { addresses: UserAddress[]; userId: string }

export default function AddressesClient({ addresses: initial, userId }: Props) {
  const locale = useLocale()
  const [addresses, setAddresses] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', address1: '', address2: '', city: '', state: '', country: 'AE', postalCode: '', phone: '', isDefault: false })

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId }),
      })
      if (res.ok) {
        const newAddr = await res.json() as UserAddress
        setAddresses(prev => form.isDefault ? [...prev.map(a => ({ ...a, isDefault: false as boolean | undefined })), newAddr] : [...prev, newAddr])
        setShowForm(false)
        setForm({ firstName: '', lastName: '', address1: '', address2: '', city: '', state: '', country: 'AE', postalCode: '', phone: '', isDefault: false })
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/account/addresses?id=${id}`, { method: 'DELETE' })
    setAddresses(prev => prev.filter(a => a._id !== id))
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-16">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/account`} className="text-ink-400 hover:text-ink-700 transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-display text-2xl font-light text-ink-900">Saved Addresses</h1>
          </div>
          <button onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 bg-camel-500 px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.15em] text-white hover:bg-camel-600 transition-colors">
            <Plus size={13} /> Add New
          </button>
        </div>

        {/* Add address form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
              <div className="bg-white border border-camel-200 p-6">
                <h2 className="font-body text-sm font-semibold text-ink-900 mb-4 uppercase tracking-[0.1em]">New Address</h2>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { key: 'firstName', label: 'First Name', col: 1 },
                    { key: 'lastName', label: 'Last Name', col: 1 },
                    { key: 'address1', label: 'Address Line 1', col: 2 },
                    { key: 'address2', label: 'Address Line 2 (optional)', col: 2 },
                    { key: 'city', label: 'City', col: 1 },
                    { key: 'state', label: 'State / Emirate', col: 1 },
                    { key: 'country', label: 'Country', col: 1 },
                    { key: 'postalCode', label: 'Postal Code', col: 1 },
                    { key: 'phone', label: 'Phone', col: 2 },
                  ] as const).map(({ key, label, col }) => (
                    <div key={key} className={cn(col === 2 ? 'col-span-2' : '')}>
                      <label className="mb-1 block font-body text-[10px] uppercase tracking-[0.15em] text-ink-400">{label}</label>
                      <input
                        value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full border border-stone-200 px-3 py-2 font-body text-sm text-ink-900 outline-none focus:border-camel-400 transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <label className="mt-3 flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} className="h-3.5 w-3.5 accent-camel-500" />
                  <span className="font-body text-xs text-ink-600">Set as default address</span>
                </label>
                <div className="mt-4 flex gap-2">
                  <button onClick={handleSave} disabled={saving}
                    className="bg-camel-500 px-5 py-2 font-body text-xs font-semibold uppercase tracking-[0.15em] text-white hover:bg-camel-600 disabled:opacity-60 transition-colors">
                    {saving ? 'Saving…' : 'Save Address'}
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-5 py-2 font-body text-xs text-ink-500 border border-stone-200 hover:border-stone-400 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {addresses.length === 0 && !showForm ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-stone-100 px-8 py-16 text-center">
            <MapPin className="mx-auto mb-4 h-10 w-10 text-stone-300" />
            <p className="font-display text-lg font-light text-ink-700 mb-1">No saved addresses</p>
            <p className="font-body text-sm text-ink-400">Add a delivery address to speed up checkout.</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr, i) => (
              <motion.div key={addr._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={cn('bg-white border px-6 py-5', addr.isDefault ? 'border-camel-200' : 'border-stone-100')}>
                <div className="flex items-start justify-between">
                  <div>
                    {addr.isDefault && (
                      <span className="mb-2 inline-flex items-center gap-1 bg-camel-50 border border-camel-200 px-2 py-0.5 font-body text-[9px] font-semibold uppercase tracking-widest text-camel-600">
                        <Star size={8} fill="currentColor" /> Default
                      </span>
                    )}
                    <p className="font-body text-sm font-medium text-ink-900">{addr.firstName} {addr.lastName}</p>
                    <p className="font-body text-sm text-ink-500">{addr.address1}{addr.address2 ? `, ${addr.address2}` : ''}</p>
                    <p className="font-body text-sm text-ink-500">{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.postalCode}</p>
                    <p className="font-body text-sm text-ink-500">{addr.country}</p>
                    {addr.phone && <p className="font-body text-sm text-ink-400 mt-0.5">{addr.phone}</p>}
                  </div>
                  <button onClick={() => handleDelete(addr._id)} className="text-ink-300 hover:text-red-400 transition-colors p-1">
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
