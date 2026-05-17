'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function ConditionalLayout({
  header,
  footer,
  children,
}: {
  header: ReactNode
  footer: ReactNode
  children: ReactNode
}) {
  const pathname = usePathname()
  const isStudio = pathname.startsWith('/studio')

  if (isStudio) {
    return <>{children}</>
  }

  return (
    <>
      {header}
      <main className="min-h-screen">{children}</main>
      {footer}
    </>
  )
}
