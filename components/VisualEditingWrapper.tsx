'use client'
import { enableVisualEditing } from '@sanity/visual-editing'
import { useEffect } from 'react'

export default function VisualEditingWrapper() {
  useEffect(() => {
    return enableVisualEditing()
  }, [])
  return null
}
