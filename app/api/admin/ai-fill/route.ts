import { NextRequest, NextResponse } from 'next/server'

// ─── Note keyword lists ────────────────────────────────────────────────────────

const TOP_NOTE_WORDS = [
  'bergamot','lemon','lime','grapefruit','orange','mandarin','yuzu','tangerine',
  'pink pepper','black pepper','white pepper','saffron','cardamom','ginger',
  'sea salt','aldehydes','petitgrain','neroli','mint','basil','tarragon',
  'violet leaf','green tea','fig leaf',
]
const MIDDLE_NOTE_WORDS = [
  'rose','jasmine','iris','violet','peony','magnolia','tuberose','geranium',
  'lily','water lily','ylang ylang','lavender','neroli','orris','heliotrope',
  'carnation','oud','oud wood','rose oud','incense','leather','suede',
  'cinnamon','nutmeg','clove','black currant','peach','plum','apricot',
  'osmanthus','vetiver','tobacco','hay',
]
const BASE_NOTE_WORDS = [
  'sandalwood','cedarwood','cedar','patchouli','musk','white musk','amber',
  'ambergris','vanilla','benzoin','labdanum','oakmoss','vetiver','tonka bean',
  'tonka','myrrh','frankincense','olibanum','resin','incense','driftwood',
  'cashmeran','iso e super','coumarin','white chocolate','praline','caramel',
  'oud','agarwood','birch tar','castoreum',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function has(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(w))
}

function extractNotes(text: string, candidates: string[]): string[] {
  return candidates
    .filter((note) => text.includes(note.toLowerCase()))
    .map((note) => note.split(' ').map((w) => w[0].toUpperCase() + w.slice(1)).join(' '))
    .slice(0, 5)
}

function extractSection(text: string, ...markers: string[]): string {
  for (const marker of markers) {
    const idx = text.indexOf(marker)
    if (idx !== -1) {
      const after = text.slice(idx + marker.length, idx + marker.length + 120)
      const end = after.search(/[.!]/)
      return end !== -1 ? after.slice(0, end) : after
    }
  }
  return ''
}

// ─── Main parser ─────────────────────────────────────────────────────────────

function parseDescription(description: string, name = '') {
  const t = description.toLowerCase()

  // ── Fragrance Family ──
  let fragranceFamily = ''
  if (has(t, ['aquatic','ocean','marine','sea salt','oceanic','water'])) fragranceFamily = 'Aquatic'
  else if (has(t, ['gourmand','chocolate','praline','caramel','cookie','honey','vanilla'])) fragranceFamily = 'Gourmand'
  else if (has(t, ['floral','rose','jasmine','peony','lily','magnolia','tuberose','flower'])) fragranceFamily = 'Floral'
  else if (has(t, ['citrus','bergamot','lemon','lime','grapefruit','orange zest','yuzu'])) fragranceFamily = 'Citrus'
  else if (has(t, ['fresh','clean','crisp','airy','green','herbal','fougère'])) fragranceFamily = 'Fresh'
  else if (has(t, ['woody','wood','cedar','sandalwood','vetiver','patchouli','forest','bark'])) fragranceFamily = 'Woody'
  else if (has(t, ['oriental','oud','amber','resinous','spicy','incense','smoke','myrrh','frankincense','resin'])) fragranceFamily = 'Oriental'

  // ── Notes ──
  const topSection = extractSection(t, 'top notes of ','top notes:','opens with ','opening of ','opening: ')
  const midSection = extractSection(t, 'heart of ','heart notes of ','heart:','middle notes','reveals a ','centre of ')
  const baseSection = extractSection(t, 'base of ','base notes of ','base:','dry-down','drydown','dry down','settl')

  let topNotes = extractNotes(topSection || t, TOP_NOTE_WORDS)
  let middleNotes = extractNotes(midSection || t, MIDDLE_NOTE_WORDS)
  let baseNotes = extractNotes(baseSection || t, BASE_NOTE_WORDS)

  // Fallback: scan full text if sections found nothing
  if (!topNotes.length) topNotes = extractNotes(t, TOP_NOTE_WORDS).slice(0, 3)
  if (!middleNotes.length) middleNotes = extractNotes(t, MIDDLE_NOTE_WORDS).slice(0, 3)
  if (!baseNotes.length) baseNotes = extractNotes(t, BASE_NOTE_WORDS).slice(0, 3)

  // ── Intensity ──
  let intensity = 'Moderate'
  if (has(t, ['very light','ultra light','barely-there','sheer','subtle','delicate','soft'])) intensity = 'Light'
  else if (has(t, ['intense','very strong','powerful','overwhelming','heavy','rich and powerful'])) intensity = 'Intense'
  else if (has(t, ['strong','bold','potent','robust','deep and'])) intensity = 'Strong'
  else if (has(t, ['light','gentle','airy','fresh and light','moderate'])) intensity = 'Light'

  // ── Sillage ──
  let sillage = 'Moderate'
  if (has(t, ['enormous','room-filling','enormous projection','huge sillage'])) sillage = 'Enormous'
  else if (has(t, ['strong sillage','strong projection','great projection','excellent projection','great sillage'])) sillage = 'Strong'
  else if (has(t, ['intimate','skin scent','close to skin','personal','subtle sillage'])) sillage = 'Intimate'
  else if (has(t, ['moderate projection','moderate sillage'])) sillage = 'Moderate'

  // ── Longevity ──
  let longevity = 'Moderate'
  const hourMatch = t.match(/(\d+)[–\-–]?(\d*)\s*[-–]?\s*hour/i)
  if (hourMatch) {
    const h = parseInt(hourMatch[1])
    if (h >= 8) longevity = 'Very Long'
    else if (h >= 4) longevity = 'Long'
    else if (h >= 2) longevity = 'Moderate'
    else longevity = 'Weak'
  } else if (has(t, ['exceptional longevity','very long','all day','all-day','12+ hour','12 hour'])) {
    longevity = 'Very Long'
  } else if (has(t, ['long lasting','long-lasting','excellent longevity','8 hour','great longevity'])) {
    longevity = 'Long'
  } else if (has(t, ['poor longevity','fades quickly','short-lived','poor performance','1 hour','2 hour'])) {
    longevity = 'Weak'
  }

  // ── Tags ──
  const tags: string[] = []
  if (has(t, ['unisex','gender neutral','gender-neutral'])) tags.push('unisex')
  if (has(t, ['for men','masculine','men\'s'])) tags.push('men')
  if (has(t, ['for women','feminine','women\'s','ladies'])) tags.push('women')
  if (has(t, ['evening','night','nocturnal','date night','formal'])) tags.push('evening')
  if (has(t, ['daytime','daily','everyday','casual','office','work'])) tags.push('daytime')
  if (has(t, ['summer','beach','warm weather','tropical'])) tags.push('summer')
  if (has(t, ['winter','cold weather','cozy','warm and'])) tags.push('winter')
  if (has(t, ['oud'])) tags.push('oud')
  if (has(t, ['rose'])) tags.push('rose')
  if (has(t, ['musk'])) tags.push('musk')
  if (has(t, ['inspired by','dupe','similar to'])) {
    const inspired = description.match(/inspired by ([A-Z][^.!,]+)/i)
    if (inspired) tags.push(`Inspired by ${inspired[1].trim()}`)
  }

  // ── SEO ──
  const cleanName = name || 'Fragrance'
  const familyLabel = fragranceFamily || 'Luxury'
  const seoTitle_en = `${cleanName} — ${familyLabel} Eau de Parfum | Luxe Parfum`.slice(0, 60)
  const seoDescription_en = `${description.split('.')[0].trim()}.`.slice(0, 155)

  return {
    fragranceFamily,
    topNotes_en: topNotes,
    middleNotes_en: middleNotes,
    baseNotes_en: baseNotes,
    intensity,
    sillage,
    longevity,
    tags: tags.slice(0, 6),
    seoTitle_en,
    seoDescription_en,
    // Arabic & name_ar left blank — use Translate to Arabic action for those
    description_ar: '',
    name_ar: '',
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { description, name } = await req.json() as { description: string; name?: string }

    if (!description?.trim()) {
      return NextResponse.json({ error: 'No description provided' }, { status: 400 })
    }

    const data = parseDescription(description, name)
    return NextResponse.json({ data })
  } catch (err) {
    console.error('AI fill error:', err)
    return NextResponse.json({ error: 'Failed to extract product data' }, { status: 500 })
  }
}
