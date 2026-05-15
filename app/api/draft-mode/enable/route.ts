import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const secret = searchParams.get('secret')
  const redirectTo = searchParams.get('redirectTo') ?? '/'

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid secret', { status: 401 })
  }

  const { enable } = await draftMode()
  enable()

  redirect(redirectTo)
}
