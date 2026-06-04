import type { NextAuthConfig } from 'next-auth'
import type { AuthUser } from './auth'

// Edge-safe config — no bcryptjs, no Sanity client.
// Used by middleware (Edge Runtime) for JWT verification only.
export const authConfig: NextAuthConfig = {
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as unknown as AuthUser).role
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        ;(session.user as unknown as AuthUser & { id: string }).role =
          token.role as 'customer' | 'admin'
      }
      return session
    },
  },
  pages: { signIn: '/login', error: '/login' },
  session: { strategy: 'jwt' },
}
