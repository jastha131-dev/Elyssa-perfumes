'use client'

import { useEffect, useState } from 'react'

interface SiteConfig {
  atcLabel_en: string
  atcLabel_ar: string
}

const DEFAULTS: SiteConfig = {
  atcLabel_en: 'Buy Now',
  atcLabel_ar: 'اشتري الآن',
}

export function useSiteConfig(): SiteConfig {
  const [config, setConfig] = useState<SiteConfig>(DEFAULTS)
  useEffect(() => {
    const el = document.getElementById('__site-config')
    if (!el?.textContent) return
    try {
      setConfig({ ...DEFAULTS, ...JSON.parse(el.textContent) })
    } catch {}
  }, [])
  return config
}
