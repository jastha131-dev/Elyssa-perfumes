import { defineField, defineArrayMember, defineType } from 'sanity'

const COLOR_PALETTES = [
  { title: '🟠 Ginger & Parchment — Electric Ginger + Azure Mist (Active)', value: 'ginger-parchment' },
  { title: '🟡 Classic Gold — Warm gold on cream (Original)', value: 'classic-gold' },
  { title: '🌹 Midnight Rose — Deep rose on soft pink', value: 'midnight-rose' },
  { title: '🌿 Forest Sage — Natural green on off-white', value: 'forest-sage' },
]

const CARD_STYLES = [
  { title: 'Clean — no border, no background (current)', value: 'clean' },
  { title: 'Bordered Square — white card with 1px border, sharp corners', value: 'bordered-square' },
  { title: 'Bordered Rounded — white card with 1px border, rounded corners', value: 'bordered-rounded' },
]

const FONT_PAIRINGS = [
  { title: '⭐ Satoshi — Modern sans-serif, all weights (Custom / Active)', value: 'satoshi' },
  { title: '✦ Fixel Text — Geometric sans-serif, all weights (Custom)', value: 'fixel' },
  { title: 'Modern Luxury — Playfair Display + Oswald + Inter', value: 'modern-luxury' },
  { title: 'Classic Editorial — Cormorant Garamond + Raleway + Lato', value: 'classic-editorial' },
  { title: 'Clean Minimalist — EB Garamond + Montserrat + Poppins', value: 'clean-minimalist' },
  { title: 'Bold Statement — Libre Baskerville + Bebas Neue + Nunito Sans', value: 'bold-statement' },
  { title: 'Contemporary — Fraunces + DM Sans + DM Sans', value: 'contemporary' },
  { title: '✨ Parisian Chic — Marcellus + Jost', value: 'parisian-chic' },
  { title: '✨ Soft Luxe — Tenor Sans + Manrope', value: 'soft-luxe' },
]

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'colors', title: '🎨 Color Palette', default: true },
    { name: 'typography', title: '✍️ Typography' },
    { name: 'header', title: '🧭 Header Layout' },
    { name: 'collection', title: '📦 Collection Page' },
    { name: 'pdp', title: '🛍️ Product Detail Page' },
    { name: 'currency', title: '💰 Currency' },
  ],
  fields: [
    // Logo
    defineField({ name: 'logo', title: 'Logo Image', type: 'image', options: { hotspot: true }, description: 'Header logo. Leave blank to use the text logo below.', fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }] }),
    defineField({ name: 'logoText_en', title: 'Logo Text (English)', type: 'string', initialValue: 'LUXE', description: 'Used when no logo image is set.', validation: (R) => R.max(20) }),
    defineField({ name: 'logoText_ar', title: 'شعار النص (Arabic)', type: 'string', validation: (R) => R.max(20) }),
    defineField({ name: 'logoSubtext_en', title: 'Logo Subtext (English)', type: 'string', initialValue: 'PARFUM', validation: (R) => R.max(24) }),
    defineField({ name: 'logoSubtext_ar', title: 'الشعار الفرعي (Arabic)', type: 'string', validation: (R) => R.max(24) }),
    // Header Layout — desktop item order (drag to reorder, left → right)
    defineField({
      name: 'desktopHeaderOrder',
      title: 'Desktop Header Order (left → right)',
      type: 'array',
      group: 'header',
      description: 'Drag to reorder the header items on desktop. Add "⟷ Flexible Gap" between items to push them apart. (Mobile/tablet uses the burger menu and is not affected.)',
      of: [
        defineArrayMember({
          type: 'string',
          options: {
            list: [
              { title: 'Logo', value: 'logo' },
              { title: 'Menu (nav links)', value: 'nav' },
              { title: 'Language switch', value: 'language' },
              { title: 'Currency switch', value: 'currency' },
              { title: 'Account', value: 'account' },
              { title: 'Search', value: 'search' },
              { title: 'Wishlist', value: 'wishlist' },
              { title: 'Cart', value: 'cart' },
              { title: '⟷ Flexible Gap', value: 'spacer' },
            ],
          },
        }),
      ],
      initialValue: ['logo', 'spacer', 'nav', 'spacer', 'language', 'currency', 'account', 'search', 'wishlist', 'cart'],
    }),
    // Color Palette
    defineField({
      name: 'colorPalette',
      title: 'Color Palette',
      type: 'string',
      group: 'colors',
      description: 'Choose a color theme for the entire site. Changes take effect within 5 minutes.',
      options: { list: COLOR_PALETTES, layout: 'radio' },
      initialValue: 'ginger-parchment',
    }),
    // Typography
    defineField({
      name: 'fontPairing',
      title: 'Font Pairing',
      type: 'string',
      group: 'typography',
      description: 'Choose a curated font combination for the entire site.',
      options: { list: FONT_PAIRINGS, layout: 'radio' },
      initialValue: 'satoshi',
    }),
    defineField({
      name: 'baseFontSize',
      title: 'Base Font Size',
      type: 'string',
      group: 'typography',
      description: 'Controls overall text scale. All sizes (headings, body, labels) scale proportionally.',
      options: {
        list: [
          { title: 'Small (14px) — compact, dense', value: '14' },
          { title: 'Default (16px) — standard', value: '16' },
          { title: 'Large (18px) — spacious, accessible', value: '18' },
        ],
        layout: 'radio',
      },
      initialValue: '16',
    }),
    defineField({
      name: 'headingLetterSpacing',
      title: 'Heading Letter Spacing',
      type: 'string',
      group: 'typography',
      description: 'Controls letter spacing on headings and labels.',
      options: {
        list: [
          { title: 'Tight (-0.02em)', value: '-0.02em' },
          { title: 'Normal (0)', value: '0' },
          { title: 'Airy (0.05em)', value: '0.05em' },
          { title: 'Wide (0.12em)', value: '0.12em' },
          { title: 'Very Wide (0.2em)', value: '0.2em' },
        ],
        layout: 'radio',
      },
      initialValue: '0',
    }),
    defineField({
      name: 'bodyLineHeight',
      title: 'Body Line Height',
      type: 'string',
      group: 'typography',
      description: 'Controls body text line spacing.',
      options: {
        list: [
          { title: 'Compact (1.4)', value: '1.4' },
          { title: 'Normal (1.6)', value: '1.6' },
          { title: 'Relaxed (1.75)', value: '1.75' },
          { title: 'Loose (2)', value: '2' },
        ],
        layout: 'radio',
      },
      initialValue: '1.6',
    }),
    defineField({
      name: 'headingWeight',
      title: 'Display / Serif Heading Weight',
      type: 'string',
      group: 'typography',
      options: {
        list: [
          { title: 'Light (300)', value: '300' },
          { title: 'Regular (400)', value: '400' },
          { title: 'Medium (500)', value: '500' },
          { title: 'Semi-Bold (600)', value: '600' },
        ],
        layout: 'radio',
      },
      initialValue: '400',
    }),
    defineField({
      name: 'cardStyle',
      title: 'Product Card Style',
      type: 'string',
      group: 'collection',
      description: 'Controls border and corner radius of product cards site-wide.',
      options: { list: CARD_STYLES, layout: 'radio' },
      initialValue: 'clean',
    }),
    defineField({
      name: 'cardTextAlign',
      title: 'Card Text Alignment',
      type: 'string',
      group: 'collection',
      options: {
        list: [
          { title: 'Left (default)', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'cardBadgePosition',
      title: 'Badge Position',
      type: 'string',
      group: 'collection',
      description: 'NEW / BEST SELLER badge placement on card image.',
      options: {
        list: [
          { title: 'Left (default)', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'cardBadgeOffsetTop',
      title: 'Badge Offset — Top (px)',
      type: 'number',
      group: 'collection',
      description: 'Pixels from top of image to badge. Default 12.',
      initialValue: 12,
      validation: (Rule) => Rule.min(0).max(80).integer(),
    }),
    defineField({
      name: 'cardBadgeOffsetSide',
      title: 'Badge Offset — Side (px)',
      type: 'number',
      group: 'collection',
      description: 'Pixels from left/right edge of image to badge. Default 12.',
      initialValue: 12,
      validation: (Rule) => Rule.min(0).max(80).integer(),
    }),
    defineField({
      name: 'cardBadgeBg',
      title: 'Badge Background Color',
      type: 'string',
      group: 'collection',
      description: 'Background color of NEW ARRIVAL / BEST SELLER badge.',
      options: {
        list: [
          { title: '⬛ Charcoal Black (default)', value: '#1a1a1a' },
          { title: '⬜ White', value: '#ffffff' },
          { title: '🟫 Warm Gold', value: '#B08040' },
          { title: '🟠 Electric Ginger', value: '#E9631A' },
          { title: '🌹 Rose', value: '#C0476A' },
          { title: '🌿 Sage Green', value: '#4A7C59' },
          { title: '🔵 Azure Blue', value: '#A9C2E0' },
          { title: '🟤 Caramel Brown', value: '#8B5E3C' },
        ],
        layout: 'radio',
      },
      initialValue: '#1a1a1a',
    }),
    defineField({
      name: 'cardBadgeText',
      title: 'Badge Text Color',
      type: 'string',
      group: 'collection',
      description: 'Text color of the badge label.',
      options: {
        list: [
          { title: '⬜ White (default)', value: '#ffffff' },
          { title: '⬛ Black', value: '#1a1a1a' },
          { title: '🟫 Warm Gold', value: '#B08040' },
        ],
        layout: 'radio',
      },
      initialValue: '#ffffff',
    }),
    defineField({
      name: 'cardImageRatio',
      title: 'Image Aspect Ratio',
      type: 'string',
      group: 'collection',
      options: {
        list: [
          { title: 'Portrait 3:4 (default)', value: 'portrait' },
          { title: 'Square 1:1', value: 'square' },
          { title: 'Wide 4:3', value: 'wide' },
        ],
        layout: 'radio',
      },
      initialValue: 'portrait',
    }),
    defineField({
      name: 'cardFontSize',
      title: 'Card Font Size',
      type: 'string',
      group: 'collection',
      options: {
        list: [
          { title: 'Small', value: 'sm' },
          { title: 'Medium (default)', value: 'md' },
          { title: 'Large', value: 'lg' },
        ],
        layout: 'radio',
      },
      initialValue: 'md',
    }),
    defineField({
      name: 'collectionColumns',
      title: 'Collection Grid Columns',
      type: 'string',
      group: 'collection',
      description: 'Number of product columns on desktop (collection & search pages).',
      options: {
        list: [
          { title: '3 columns', value: '3' },
          { title: '4 columns (default)', value: '4' },
          { title: '5 columns', value: '5' },
        ],
        layout: 'radio',
      },
      initialValue: '4',
    }),
    defineField({
      name: 'pdpTextSize',
      title: 'Description / Body Text Size',
      type: 'string',
      group: 'pdp',
      description: 'Controls font size of the product description and story text on the product detail page.',
      options: {
        list: [
          { title: 'Small (13px)', value: 'sm' },
          { title: 'Medium — default (15px)', value: 'md' },
          { title: 'Large (17px)', value: 'lg' },
        ],
        layout: 'radio',
      },
      initialValue: 'md',
    }),
    defineField({
      name: 'promoBanner',
      title: 'Product Page Promo Banner',
      type: 'object',
      group: 'pdp',
      description: 'Promotional strip shown on every product page (between price and size selector).',
      fields: [
        defineField({ name: 'isEnabled', title: 'Show Banner', type: 'boolean', initialValue: false }),
        defineField({ name: 'headline_en', title: 'Headline (English)', type: 'string', validation: (Rule) => Rule.max(60) }),
        defineField({ name: 'headline_ar', title: 'العنوان (Arabic)', type: 'string', validation: (Rule) => Rule.max(60) }),
        defineField({ name: 'subtitle_en', title: 'Subtitle (English)', type: 'string', description: 'e.g. "With orders over $95+"', validation: (Rule) => Rule.max(80) }),
        defineField({ name: 'subtitle_ar', title: 'النص الفرعي (Arabic)', type: 'string', validation: (Rule) => Rule.max(80) }),
        defineField({ name: 'image', title: 'Gift / Promo Image', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'countdownEndDate', title: 'Countdown End Date & Time', type: 'datetime', description: 'Banner auto-hides after this date.' }),
        defineField({ name: 'minOrderAmount', title: 'Min Order Amount (display only)', type: 'number', description: 'e.g. 95 → shown in subtitle as reference.' }),
      ],
    }),
    // Currency
    defineField({
      name: 'currencies',
      title: 'Supported Currencies',
      type: 'array',
      group: 'currency',
      description: 'Set exchange rates relative to USD. Admin updates these when rates change.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'code',
              title: 'Currency Code',
              type: 'string',
              options: {
                list: [
                  { title: 'USD — US Dollar', value: 'USD' },
                  { title: 'AED — UAE Dirham', value: 'AED' },
                  { title: 'INR — Indian Rupee', value: 'INR' },
                  { title: 'EUR — Euro', value: 'EUR' },
                  { title: 'GBP — British Pound', value: 'GBP' },
                  { title: 'SAR — Saudi Riyal', value: 'SAR' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'symbol', title: 'Symbol', type: 'string', description: 'e.g. $, AED, ₹', validation: (Rule) => Rule.required().max(6) }),
            defineField({ name: 'rate', title: 'Exchange Rate (from USD)', type: 'number', description: '1 USD = X of this currency. e.g. 1 USD = 3.67 AED', validation: (Rule) => Rule.required().positive() }),
            defineField({ name: 'isEnabled', title: 'Enabled', type: 'boolean', initialValue: true }),
            defineField({
              name: 'position',
              title: 'Symbol Position',
              type: 'string',
              options: { list: [{ title: 'Before amount ($10)', value: 'before' }, { title: 'After amount (10 AED)', value: 'after' }] },
              initialValue: 'before',
            }),
          ],
          preview: {
            select: { title: 'code', subtitle: 'rate', isEnabled: 'isEnabled' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare: (val: any) => ({
              title: val.title,
              subtitle: `1 USD = ${val.rate} · ${val.isEnabled ? '✅ Enabled' : '🔴 Disabled'}`,
            }),
          },
        }),
      ],
      initialValue: [
        { _type: 'object', code: 'USD', symbol: '$', rate: 1, isEnabled: true, position: 'before' },
        { _type: 'object', code: 'AED', symbol: 'AED', rate: 3.67, isEnabled: true, position: 'after' },
        { _type: 'object', code: 'INR', symbol: '₹', rate: 83.5, isEnabled: true, position: 'before' },
      ],
    }),
    defineField({
      name: 'defaultCurrency',
      title: 'Default Currency',
      type: 'string',
      group: 'currency',
      description: 'Currency shown to users who have not made a selection.',
      options: {
        list: [
          { title: 'USD', value: 'USD' },
          { title: 'AED', value: 'AED' },
          { title: 'INR', value: 'INR' },
        ],
      },
      initialValue: 'USD',
    }),
  ],
  preview: {
    select: { fontPairing: 'fontPairing', baseFontSize: 'baseFontSize' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: 'Site Settings',
      subtitle: `${val.fontPairing ?? 'modern-luxury'} · ${val.baseFontSize ?? 16}px`,
    }),
  },
})
