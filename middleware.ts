import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const LOCALES = ['en', 'ar']
const DEFAULT_LOCALE = 'en'

const { auth } = NextAuth(authConfig)

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localeDetection: false,
})

const PROTECTED_PATTERNS = [
  /^\/[a-z]{2}\/account(\/.*)?$/,
]

const ADMIN_PATTERNS = [
  /^\/[a-z]{2}\/admin(\/.*)?$/,
]

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const locale = pathname.split('/')[1] || DEFAULT_LOCALE

  const isProtected = PROTECTED_PATTERNS.some((p) => p.test(pathname))
  const isAdmin = ADMIN_PATTERNS.some((p) => p.test(pathname))

  if (isProtected || isAdmin) {
    const session = await auth()
    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/login`
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
    if (isAdmin && session.user?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}`
      return NextResponse.redirect(url)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|studio|.*\\..*).*)'],
}
