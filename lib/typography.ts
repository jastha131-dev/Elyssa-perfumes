// Font pairing definitions — Google Fonts URL params + CSS var values
export const FONT_PAIRINGS: Record<string, {
  displayFont: string
  headlineFont: string
  bodyFont: string
  googleFontsUrl: string // empty string = local font, no Google Fonts link needed
}> = {
  // ── Local fonts (no Google Fonts request) ────────────────────────────────
  'satoshi': {
    displayFont: "var(--font-satoshi), system-ui, sans-serif",
    headlineFont: "var(--font-satoshi), system-ui, sans-serif",
    bodyFont: "var(--font-satoshi), system-ui, sans-serif",
    googleFontsUrl: '',
  },
  'fixel': {
    displayFont: "var(--font-fixel), system-ui, sans-serif",
    headlineFont: "var(--font-fixel), system-ui, sans-serif",
    bodyFont: "var(--font-fixel), system-ui, sans-serif",
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
  'parisian-chic': {
    displayFont: "'Marcellus', Georgia, serif",
    headlineFont: "'Jost', system-ui, sans-serif",
    bodyFont: "'Jost', system-ui, sans-serif",
    googleFontsUrl: 'family=Marcellus&family=Jost:wght@300;400;500;600;700',
  },
  'soft-luxe': {
    displayFont: "'Tenor Sans', system-ui, sans-serif",
    headlineFont: "'Manrope', system-ui, sans-serif",
    bodyFont: "'Manrope', system-ui, sans-serif",
    googleFontsUrl: 'family=Tenor+Sans&family=Manrope:wght@300;400;500;600;700;800',
  },
}

// ─── Color Palettes ───────────────────────────────────────────────────────────

export const COLOR_PALETTES: Record<string, {
  accent: string; accentDark: string; accentLight: string
  dark: string; bg: string; bgSoft: string; secondary: string
}> = {
  'ginger-parchment': { accent: '#E9631A', accentDark: '#C25015', accentLight: '#FEF3EC', dark: '#323232', bg: '#F4F4EE', bgSoft: '#EBEBDF', secondary: '#A9C2E0' },
  'classic-gold':     { accent: '#B08040', accentDark: '#9A6E32', accentLight: '#FAF4EC', dark: '#1A1A1A', bg: '#F7F0E6', bgSoft: '#FDFAF7', secondary: '#D4A96A' },
  'midnight-rose':    { accent: '#C0476A', accentDark: '#9B3556', accentLight: '#FCEEF3', dark: '#1E1E2E', bg: '#F5F0F5', bgSoft: '#FAF7FA', secondary: '#8E9BCC' },
  'forest-sage':      { accent: '#4A7C59', accentDark: '#3A6146', accentLight: '#EEF5F1', dark: '#1E2A22', bg: '#F2F5F2', bgSoft: '#F8FAF8', secondary: '#A3C4A8' },
}

export function buildColorCss(settings: Pick<SiteTypographySettings, 'colorMode' | 'colorPalette' | 'customColors'> | null | undefined): string {
  let p: typeof COLOR_PALETTES[string]
  if (settings?.colorMode === 'custom' && settings.customColors) {
    const c = settings.customColors
    const fallback = COLOR_PALETTES['ginger-parchment']
    p = {
      accent:      c.accent      ?? fallback.accent,
      accentDark:  c.accentDark  ?? fallback.accentDark,
      accentLight: c.accentLight ?? fallback.accentLight,
      dark:        c.dark        ?? fallback.dark,
      bg:          c.bg          ?? fallback.bg,
      bgSoft:      c.bgSoft      ?? fallback.bgSoft,
      secondary:   c.secondary   ?? fallback.secondary,
    }
  } else {
    p = COLOR_PALETTES[settings?.colorPalette ?? 'ginger-parchment'] ?? COLOR_PALETTES['ginger-parchment']
  }
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
  tabletFontSize?: string
  mobileFontSize?: string
  headingLetterSpacing?: string
  bodyLineHeight?: string
  headingWeight?: string
  cardStyle?: string
  cardTextAlign?: string
  cardBadgePosition?: string
  cardBadgeOffsetTop?: number
  cardBadgeOffsetSide?: number
  cardBadgeBg?: string
  cardBadgeText?: string
  cardImageRatio?: string
  cardFontSize?: string
  collectionColumns?: string
  mobileCardColumns?: string
  pdpTextSize?: string
  promoBanner?: {
    isEnabled?: boolean
    headline_en?: string
    headline_ar?: string
    subtitle_en?: string
    subtitle_ar?: string
    imageUrl?: string
    countdownEndDate?: string
    minOrderAmount?: number
  }
  colorMode?: string | null
  colorPalette?: string | null
  customColors?: {
    accent?: string | null
    accentDark?: string | null
    accentLight?: string | null
    dark?: string | null
    bg?: string | null
    bgSoft?: string | null
    secondary?: string | null
  } | null
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
  const colorCss = buildColorCss(settings)

  const cardStyle = settings?.cardStyle ?? 'clean'
  const CARD_VARS: Record<string, { radius: string; borderW: string; borderC: string; bg: string; infoX: string; infoT: string; infoB: string }> = {
    'clean':            { radius: '0px',  borderW: '0px', borderC: 'transparent', bg: 'transparent', infoX: '2px',  infoT: '12px', infoB: '0px'  },
    'bordered-square':  { radius: '0px',  borderW: '1px', borderC: '#e2ddd5',    bg: '#ffffff',     infoX: '14px', infoT: '14px', infoB: '16px' },
    'bordered-rounded': { radius: '16px', borderW: '1px', borderC: '#e2ddd5',    bg: '#ffffff',     infoX: '14px', infoT: '14px', infoB: '16px' },
  }
  const cv = CARD_VARS[cardStyle] ?? CARD_VARS['clean']

  const textAlign = settings?.cardTextAlign ?? 'left'
  const priceJustify = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start'

  const badgePos = settings?.cardBadgePosition ?? 'left'
  const badgeTop = `${settings?.cardBadgeOffsetTop ?? 12}px`
  const badgeSide = `${settings?.cardBadgeOffsetSide ?? 12}px`
  const badgeL = badgePos === 'right' ? 'auto' : badgeSide
  const badgeR = badgePos === 'right' ? badgeSide : 'auto'
  const badgeBg = settings?.cardBadgeBg ?? '#1a1a1a'
  const badgeTextColor = settings?.cardBadgeText ?? '#ffffff'

  const imgRatioMap: Record<string, string> = { portrait: '3/4', square: '1/1', wide: '4/3' }
  const imgRatio = imgRatioMap[settings?.cardImageRatio ?? 'portrait'] ?? '3/4'

  const fontSizeMap: Record<string, { name: string; cat: string; price: string }> = {
    sm: { name: '13px', cat: '8px',  price: '12px' },
    md: { name: '15px', cat: '9px',  price: '13px' },
    lg: { name: '17px', cat: '10px', price: '15px' },
  }
  const fs = fontSizeMap[settings?.cardFontSize ?? 'md'] ?? fontSizeMap['md']

  const cols = settings?.collectionColumns ?? '4'
  const mobileCols = settings?.mobileCardColumns ?? '2'

  const tabletSize = settings?.tabletFontSize
  const mobileSize = settings?.mobileFontSize ?? '14'

  const tabletCss = (tabletSize && tabletSize !== 'inherit')
    ? `@media (min-width: 768px) and (max-width: 1023px) { html { font-size: ${tabletSize}px; } }`
    : ''

  return `
    ${colorCss}
    :root {
      --font-display: ${pairing.displayFont};
      --font-headline: ${pairing.headlineFont};
      --font-body: ${pairing.bodyFont};
      --heading-letter-spacing: ${headingSpacing};
      --body-line-height: ${lineHeight};
      --heading-weight: ${headingWeight};
      --card-radius: ${cv.radius};
      --card-border-w: ${cv.borderW};
      --card-border-c: ${cv.borderC};
      --card-bg: ${cv.bg};
      --card-info-px: ${cv.infoX};
      --card-info-pt: ${cv.infoT};
      --card-info-pb: ${cv.infoB};
      --card-text-align: ${textAlign};
      --card-price-justify: ${priceJustify};
      --card-badge-l: ${badgeL};
      --card-badge-r: ${badgeR};
      --card-badge-top: ${badgeTop};
      --card-badge-side: ${badgeSide};
      --card-badge-bg: ${badgeBg};
      --card-badge-text: ${badgeTextColor};
      --card-img-ratio: ${imgRatio};
      --card-name-size: ${fs.name};
      --card-cat-size: ${fs.cat};
      --card-price-size: ${fs.price};
      --collection-cols: ${cols};
      --mobile-collection-cols: ${mobileCols};
      --pdp-desc-size: ${{ sm: '13px', md: '15px', lg: '17px' }[settings?.pdpTextSize ?? 'md'] ?? '15px'};
      --pdp-body-size: ${{ sm: '12px', md: '14px', lg: '16px' }[settings?.pdpTextSize ?? 'md'] ?? '14px'};
    }
    html { font-size: ${fontSize}px; }
    @media (max-width: 767px) { html { font-size: ${mobileSize}px; } }
    ${tabletCss}
    body { line-height: var(--body-line-height); }
    .font-display { font-weight: var(--heading-weight); }
  `.replace(/\n\s+/g, ' ').trim()
}
