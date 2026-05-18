'use client'

import { useState } from 'react'
import { useClient, useFormValue } from 'sanity'
import type { TextInputProps } from 'sanity'

export function AiFillInput(props: TextInputProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const client = useClient({ apiVersion: '2024-01-01' })
  const rawIdValue = useFormValue(['_id'])
  const rawId = typeof rawIdValue === 'string' ? rawIdValue : undefined
  const name = useFormValue(['name_en']) as string | undefined

  const description = props.value as string | undefined

  async function handleAiFill() {
    if (!description?.trim()) return

    setLoading(true)
    setStatus(null)

    try {
      const res = await fetch('/api/admin/ai-fill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, name }),
      })

      if (!res.ok) {
        const body = await res.json() as { error: string }
        throw new Error(body.error)
      }

      const { data } = await res.json() as {
        data: Record<string, unknown>
      }

      // Resolve the draft document ID
      const docId = rawId?.startsWith('drafts.') ? rawId : `drafts.${rawId}`

      const fieldMap: Record<string, string[]> = {
        fragranceFamily: ['fragranceFamily'],
        topNotes_en: ['topNotes_en'],
        middleNotes_en: ['middleNotes_en'],
        baseNotes_en: ['baseNotes_en'],
        intensity: ['intensity'],
        sillage: ['sillage'],
        longevity: ['longevity'],
        tags: ['tags'],
        description_ar: ['description_ar'],
        name_ar: ['name_ar'],
        seoTitle_en: ['seoTitle_en'],
        seoDescription_en: ['seoDescription_en'],
      }

      const patch: Record<string, unknown> = {}
      for (const [dataKey, [docField]] of Object.entries(fieldMap)) {
        if (data[dataKey] != null) {
          patch[docField] = data[dataKey]
        }
      }

      await client.patch(docId).set(patch).commit()

      const count = Object.keys(patch).length
      setStatus(`✅ ${count} fields filled — reload page to see them`)
    } catch (err) {
      setStatus(`❌ ${err instanceof Error ? err.message : 'AI fill failed'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {props.renderDefault(props)}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          type="button"
          onClick={handleAiFill}
          disabled={loading || !description?.trim()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: loading || !description?.trim()
              ? '#2a2a2a'
              : 'linear-gradient(135deg, #7c6b3e 0%, #b59a5c 100%)',
            color: loading || !description?.trim() ? '#666' : '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: loading || !description?.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '0.02em',
          }}
        >
          {loading ? (
            <>
              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
              Analysing with AI…
            </>
          ) : (
            <>
              ✨ Auto-Fill Fields from Description
            </>
          )}
        </button>

        {!description?.trim() && (
          <p style={{ margin: 0, fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
            Type a description above to enable AI auto-fill
          </p>
        )}

        {status && (
          <p style={{
            margin: 0,
            fontSize: '12px',
            color: status.startsWith('✅') ? '#4caf50' : '#f44336',
            fontWeight: 500,
          }}>
            {status}
          </p>
        )}

        <p style={{ margin: 0, fontSize: '11px', color: '#555' }}>
          Fills: fragrance family · top/middle/base notes · intensity · sillage · longevity · tags · SEO fields.
          Only overwrites empty fields. Volumes/prices &amp; Arabic fields must be set manually.
        </p>
      </div>
    </div>
  )
}
