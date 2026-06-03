import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { createClient } from '@sanity/client'

// Server-only Sanity client with write token — never exposed to browser
const authClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'customer' | 'admin'
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await authClient.fetch<{
          _id: string
          email: string
          name: string
          passwordHash: string
          role: string
        } | null>(
          `*[_type == "user" && email == $email][0]{
            _id, email, name, passwordHash, role
          }`,
          { email: (credentials.email as string).toLowerCase().trim() }
        )

        if (!user) return null

        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!valid) return null

        return {
          id: user._id,
          email: user.email,
          name: user.name,
          role: (user.role ?? 'customer') as 'customer' | 'admin',
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as AuthUser).role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        ;(session.user as unknown as AuthUser & { id: string }).role = token.role as 'customer' | 'admin'
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
})
