import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { texts } = await req.json() as { texts: string[] }

  const key = process.env.DEEPL_API_KEY
  if (!key) {
    return NextResponse.json({ error: 'DEEPL_API_KEY not set in .env.local' }, { status: 500 })
  }

  const body = new URLSearchParams()
  body.append('target_lang', 'AR')
  body.append('source_lang', 'EN')
  for (const t of texts) body.append('text', t)

  const apiUrl = key.endsWith(':fx')
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate'

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: `DeepL error ${res.status}: ${text}` }, { status: 502 })
  }

  const data = await res.json() as { translations: { text: string }[] }
  return NextResponse.json({ translations: data.translations.map((t) => t.text) })
}
