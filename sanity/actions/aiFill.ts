import { useState } from 'react'
import { useClient, useEditState } from 'sanity'
import type { DocumentActionProps } from 'sanity'

export function aiFillAction(props: DocumentActionProps) {
  const { id, type } = props

  // Hooks must be called unconditionally (React rules of hooks)
  const { draft, published } = useEditState(id, type)
  const client = useClient({ apiVersion: '2024-01-01' })
  const [busy, setBusy] = useState(false)

  // Only show on product documents — checked AFTER hooks
  if (type !== 'product') return null

  const doc = draft || published
  const description = (doc as Record<string, unknown>)?.description_en as string | undefined
  const name = (doc as Record<string, unknown>)?.name_en as string | undefined

  return {
    label: busy ? '🤖 Analysing…' : '🤖 AI Auto-Fill',
    title: 'Extract fragrance details from the description using AI',
    disabled: busy || !description?.trim(),
    onHandle: async () => {
      if (!description?.trim()) {
        // eslint-disable-next-line no-alert
        alert('Fill in the Short Description (English) field first, then run AI Auto-Fill.')
        return
      }

      setBusy(true)

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
          data: {
            fragranceFamily: string
            topNotes_en: string[]
            middleNotes_en: string[]
            baseNotes_en: string[]
            intensity: string
            sillage: string
            longevity: string
            tags: string[]
            description_ar: string
            name_ar: string
            seoTitle_en: string
            seoDescription_en: string
          }
        }

        // Build the patch — only set fields that aren't already filled
        const existing = doc as Record<string, unknown>

        const patch: Record<string, unknown> = {}

        if (data.fragranceFamily && !existing.fragranceFamily) patch.fragranceFamily = data.fragranceFamily
        if (data.topNotes_en?.length && !(existing.topNotes_en as string[])?.length) patch.topNotes_en = data.topNotes_en
        if (data.middleNotes_en?.length && !(existing.middleNotes_en as string[])?.length) patch.middleNotes_en = data.middleNotes_en
        if (data.baseNotes_en?.length && !(existing.baseNotes_en as string[])?.length) patch.baseNotes_en = data.baseNotes_en
        if (data.intensity && !existing.intensity) patch.intensity = data.intensity
        if (data.sillage && !existing.sillage) patch.sillage = data.sillage
        if (data.longevity && !existing.longevity) patch.longevity = data.longevity
        if (data.tags?.length && !(existing.tags as string[])?.length) patch.tags = data.tags
        if (data.description_ar && !existing.description_ar) patch.description_ar = data.description_ar
        if (data.name_ar && !existing.name_ar) patch.name_ar = data.name_ar
        if (data.seoTitle_en && !existing.seoTitle_en) patch.seoTitle_en = data.seoTitle_en
        if (data.seoDescription_en && !existing.seoDescription_en) patch.seoDescription_en = data.seoDescription_en

        if (Object.keys(patch).length === 0) {
          // eslint-disable-next-line no-alert
          alert('All fields are already filled. Clear fields you want AI to regenerate, then try again.')
          return
        }

        const docId = id.startsWith('drafts.') ? id : `drafts.${id}`
        await client.patch(docId).set(patch).commit()

        const filled = Object.keys(patch).join(', ')
        // eslint-disable-next-line no-alert
        alert(`✅ AI filled ${Object.keys(patch).length} fields: ${filled}\n\nReload the page to see changes.`)
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert(`❌ ${err instanceof Error ? err.message : 'AI fill failed'}`)
      } finally {
        setBusy(false)
      }
    },
  }
}
