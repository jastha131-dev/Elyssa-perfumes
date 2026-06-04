// Font pairing definitions — Google Fonts URL params + CSS var values
export const FONT_PAIRINGS: Record<string, {
  displayFont: string
  headlineFont: string
  bodyFont: string
  googleFontsUrl: string // empty string = local font, no Google Fonts link needed
}> = {
  // ── Local font (no Google Fonts request) ─────────────────────────────────
  'satoshi': {
    displayFont: "var(--font-satoshi), system-ui, sans-serif",
    headlineFont: "var(--font-satoshi), system-ui, sans-serif",
    bodyFont: "var(--font-satoshi), system-ui, sans-serif",
    googleFontsUrl: '',
  },
  'modern-luxury': {
    displayFont: "'Playfair Display', Georgia, serif",
    headlineFont: "'Oswald', 'Barlow Condensed', sans-serif",
    bodyFont: "'Inter', system-ui, sans-serif",
    googleFontsUrl: 'family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Oswald:wght@400;500;600;700&family=Inter:wght@300;400;500;600',
  },
  'classic-editorial': {
    displayFont: "'Cormorant Garamond', 'Garamond', Georgia, serif",
    headlineFont: "'Raleway', sans-serif",
    bodyFont: "'Lato', system-ui, sans-serif",
    googleFontsUrl: 'family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Raleway:wght@300;400;500;600;700&family=Lato:wght@300;400;700',
  },
  'clean-minimalist': {
    displayFont: "'EB Garamond', Georgia, serif",
    headlineFont: "'Montserrat', sans-serif",
    bodyFont: "'Poppins', system-ui, sans-serif",
    googleFontsUrl: 'family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Montserrat:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600',
  },
  'bold-statement': {
    displayFont: "'Libre Baskerville', Georgia, serif",
    headlineFont: "'Bebas Neue', sans-serif",
    bodyFont: "'Nunito Sans', system-ui, sans-serif",
    googleFontsUrl: 'family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Bebas+Neue&family=Nunito+Sans:wght@300;400;500;600',
  },
  'contemporary': {
    displayFont: "'Fraunces', Georgia, serif",
    headlineFont: "'DM Sans', system-ui, sans-serif",
    bodyFont: "'DM Sans', system-ui, sans-serif",
    googleFontsUrl: 'family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500;600;700',
  },
}

// ─── Color Palettes ───────────────────────────────────────────────────────────

export const COLOR_PALETTES: Record<string, {
  accent: string      // primary CTA / accent (replaces gold/camel-500)
  accentDark: string  // darker accent (camel-600)
  accentLight: string // light accent bg (camel-50)
  dark: string        // main dark / text (charcoal-900 / ink-900)
  bg: string          // page background (stone-100)
  bgSoft: string      // softer background (cream-50)
  secondary: string   // secondary accent
}> = {
  'ginger-parchment': {
    accent:      '#E9631A',
    accentDark:  '#C25015',
    accentLight: '#FEF3EC',
    dark:        '#323232',
    bg:          '#F4F4EE',
    bgSoft:      '#EBEBDF',
    secondary:   '#A9C2E0',
  },
  'classic-gold': {
    accent:      '#B08040',
    accentDark:  '#9A6E32',
    accentLight: '#FAF4EC',
    dark:        '#1A1A1A',
    bg:          '#F7F0E6',
    bgSoft:      '#FDFAF7',
    secondary:   '#D4A96A',
  },
  'midnight-rose': {
    accent:      '#C0476A',
    accentDark:  '#9B3556',
    accentLight: '#FCEEF3',
    dark:        '#1E1E2E',
    bg:          '#F5F0F5',
    bgSoft:      '#FAF7FA',
    secondary:   '#8E9BCC',
  },
  'forest-sage': {
    accent:      '#4A7C59',
    accentDark:  '#3A6146',
    accentLight: '#EEF5F1',
    dark:        '#1E2A22',
    bg:          '#F2F5F2',
    bgSoft:      '#F8FAF8',
    secondary:   '#A3C4A8',
  },
}

export function buildColorCss(colorPalette: string | null | undefined): string {
  const key = colorPalette ?? 'ginger-parchment'
  const p = COLOR_PALETTES[key] ?? COLOR_PALETTES['ginger-parchment']
  return `
    :root {
      --gold: ${p.accent};
      --camel: ${p.accent};
      --camel-dark: ${p.accentDark};
      --camel-light: ${p.accentLight};
      --charcoal: ${p.dark};
      --ink: ${p.dark};
      --stone: ${p.bg};
      --cream: ${p.bgSoft};
      --azure: ${p.secondary};
    }
  `.replace(/\n\s+/g, ' ').trim()
}

export interface SiteTypographySettings {
  fontPairing?: string
  baseFontSize?: string
  headingLetterSpacing?: string
  bodyLineHeight?: string
  headingWeight?: string
  colorPalette?: string
  defaultCurrency?: string
  currencies?: Array<{
    code: string
    symbol: string
    rate: number
    position?: 'before' | 'after'
  }>
}

export function buildGoogleFontsUrl(pairingKey: string): string {
  const pairing = FONT_PAIRINGS[pairingKey] ?? FONT_PAIRINGS['satoshi']
  if (!pairing.googleFontsUrl) return ''
  return `https://fonts.googleapis.com/css2?${pairing.googleFontsUrl}&display=swap`
}

export function buildTypographyCss(settings: SiteTypographySettings | null): string {
  const pairingKey = settings?.fontPairing ?? 'satoshi'
  const pairing = FONT_PAIRINGS[pairingKey] ?? FONT_PAIRINGS['satoshi']
  const fontSize = settings?.baseFontSize ?? '16'
  const headingSpacing = settings?.headingLetterSpacing ?? '0'
  const lineHeight = settings?.bodyLineHeight ?? '1.6'
  const headingWeight = settings?.headingWeight ?? '400'
  const colorCss = buildColorCss(settings?.colorPalette)

  return `
    ${colorCss}
    :root {
      --font-display: ${pairing.displayFont};
      --font-headline: ${pairing.headlineFont};
      --font-body: ${pairing.bodyFont};
      --heading-letter-spacing: ${headingSpacing};
      --body-line-height: ${lineHeight};
      --heading-weight: ${headingWeight};
    }
    html { font-size: ${fontSize}px; }
    body { line-height: var(--body-line-height); }
    .font-display { font-weight: var(--heading-weight); }
  `.replace(/\n\s+/g, ' ').trim()
}
