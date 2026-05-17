import { useState } from 'react'
import { useClient, useEditState } from 'sanity'
import type { DocumentActionProps } from 'sanity'

interface Field {
  enPath: string
  arPath: string
  value: string
}

function collectEnFields(obj: unknown, prefix = ''): Field[] {
  if (!obj || typeof obj !== 'object') return []
  const results: Field[] = []

  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      results.push(...collectEnFields(item, prefix ? `${prefix}[${i}]` : `[${i}]`))
    })
  } else {
    for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
      const fullPath = prefix ? `${prefix}.${key}` : key
      if (key.endsWith('_en') && typeof val === 'string' && val.trim()) {
        results.push({
          enPath: fullPath,
          arPath: fullPath.replace(/_en$/, '_ar'),
          value: val,
        })
      } else if (val && typeof val === 'object') {
        results.push(...collectEnFields(val, fullPath))
      }
    }
  }
  return results
}

export function translateToArabicAction(props: DocumentActionProps) {
  const { id, type } = props
  const { draft, published } = useEditState(id, type)
  const client = useClient({ apiVersion: '2024-01-01' })
  const [busy, setBusy] = useState(false)

  const doc = draft || published

  return {
    label: busy ? 'Translating…' : '🌐 Translate to Arabic',
    disabled: busy || !doc,
    onHandle: async () => {
      if (!doc) return
      setBusy(true)

      try {
        const fields = collectEnFields(doc).filter((f) => f.value.trim().length > 0)

        if (fields.length === 0) {
          // eslint-disable-next-line no-alert
          alert('No English text fields found in this document.')
          return
        }

        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts: fields.map((f) => f.value) }),
        })

        if (!res.ok) {
          const { error } = await res.json() as { error: string }
          throw new Error(error)
        }

        const { translations } = await res.json() as { translations: string[] }

        const patch: Record<string, string> = {}
        fields.forEach((field, i) => {
          patch[field.arPath] = translations[i]
        })

        await client.patch(id).set(patch).commit()
        // eslint-disable-next-line no-alert
        alert(`✅ Translated ${fields.length} fields to Arabic. Reload to see changes.`)
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert(`❌ ${err instanceof Error ? err.message : 'Translation failed'}`)
      } finally {
        setBusy(false)
      }
    },
  }
}
