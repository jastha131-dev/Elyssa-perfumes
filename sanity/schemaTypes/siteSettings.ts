import { defineField, defineArrayMember, defineType } from 'sanity'

const COLOR_PALETTES = [
  { title: '🟠 Ginger & Parchment — Electric Ginger + Azure Mist (Active)', value: 'ginger-parchment' },
  { title: '🟡 Classic Gold — Warm gold on cream (Original)', value: 'classic-gold' },
  { title: '🌹 Midnight Rose — Deep rose on soft pink', value: 'midnight-rose' },
  { title: '🌿 Forest Sage — Natural green on off-white', value: 'forest-sage' },
]

const FONT_PAIRINGS = [
  { title: '⭐ Satoshi — Modern sans-serif, all weights (Custom / Active)', value: 'satoshi' },
  { title: 'Modern Luxury — Playfair Display + Oswald + Inter', value: 'modern-luxury' },
  { title: 'Classic Editorial — Cormorant Garamond + Raleway + Lato', value: 'classic-editorial' },
  { title: 'Clean Minimalist — EB Garamond + Montserrat + Poppins', value: 'clean-minimalist' },
  { title: 'Bold Statement — Libre Baskerville + Bebas Neue + Nunito Sans', value: 'bold-statement' },
  { title: 'Contemporary — Fraunces + DM Sans + DM Sans', value: 'contemporary' },
]

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'colors', title: 'Color Palette', default: true },
    { name: 'typography', title: 'Typography' },
    { name: 'layout', title: 'Layout' },
    { name: 'currency', title: 'Currency' },
  ],
  fields: [
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
