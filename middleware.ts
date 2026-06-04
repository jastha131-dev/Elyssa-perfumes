import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const LOCALES = ['en', 'ar']
const DEFAULT_LOCALE = 'en'

// Edge-safe auth — uses JWT only, no bcryptjs
const { auth } = NextAuth(authConfig)

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
})

const PROTECTED_PATTERNS = [
  /^\/[a-z]{2}\/account(\/.*)?$/,
]

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isProtected = PROTECTED_PATTERNS.some((p) => p.test(pathname))

  if (isProtected) {
    const session = await auth()
    if (!session) {
      const locale = pathname.split('/')[1] || DEFAULT_LOCALE
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/login`
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|studio|.*\\..*).*)'],
}
