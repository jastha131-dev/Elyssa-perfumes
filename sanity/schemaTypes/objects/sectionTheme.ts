import { defineField, defineType } from 'sanity'

const BG_OPTIONS = [
  { title: 'Default (section default)', value: 'default' },
  { title: 'White', value: 'white' },
  { title: 'Cream / Parchment (site bg)', value: 'cream' },
  { title: 'Soft Cream (secondary bg)', value: 'cream-soft' },
  { title: 'Accent Light (pale tint)', value: 'accent-light' },
  { title: 'Accent (primary CTA color)', value: 'accent' },
  { title: 'Charcoal (dark)', value: 'dark' },
  { title: 'Black', value: 'black' },
]

const BADGE_OPTIONS = [
  { title: 'Default (accent color)', value: 'default' },
  { title: 'Gold', value: 'gold' },
  { title: 'White', value: 'white' },
  { title: 'Black', value: 'black' },
  { title: 'Rose', value: 'rose' },
  { title: 'Sage', value: 'sage' },
]

const RADIUS_OPTIONS = [
  { title: 'None / Sharp corners', value: 'none' },
  { title: 'Small (4px)', value: 'sm' },
  { title: 'Medium (12px)', value: 'md' },
  { title: 'Large (24px)', value: 'lg' },
  { title: 'Extra Large (40px)', value: 'xl' },
]

const PADDING_OPTIONS = [
  { title: 'Compact (32px)', value: 'sm' },
  { title: 'Normal (default)', value: 'md' },
  { title: 'Spacious (96px)', value: 'lg' },
  { title: 'Extra Large (128px)', value: 'xl' },
  { title: 'None (no vertical padding)', value: 'none' },
]

export const sectionTheme = defineType({
  name: 'sectionTheme',
  title: 'Section Styling',
  type: 'object',
  fields: [
    defineField({
      name: 'bgColor',
      title: 'Background Color',
      type: 'string',
      description: 'Override the background color of this section.',
      options: { list: BG_OPTIONS, layout: 'radio' },
      initialValue: 'default',
    }),
    defineField({
      name: 'badgeColor',
      title: 'Badge / Highlight Color',
      type: 'string',
      description: 'Color used for badges, pills, and accent highlights in this section.',
      options: { list: BADGE_OPTIONS, layout: 'radio' },
      initialValue: 'default',
    }),
    defineField({
      name: 'cornerRadius',
      title: 'Corner Radius',
      type: 'string',
      description: 'Rounds the corners of the section container.',
      options: { list: RADIUS_OPTIONS, layout: 'radio' },
      initialValue: 'none',
    }),
    defineField({
      name: 'paddingY',
      title: 'Vertical Padding',
      type: 'string',
      description: 'Controls top and bottom spacing of this section.',
      options: { list: PADDING_OPTIONS, layout: 'radio' },
      initialValue: 'md',
    }),
  ],
})
