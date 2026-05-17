import { defineField, defineType, defineArrayMember } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({
      name: 'headline_en',
      title: 'Headline (English)',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'headline_ar',
      title: 'العنوان (Arabic)',
      type: 'string',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'subheadline_en',
      title: 'Subheadline (English)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(250),
    }),
    defineField({
      name: 'subheadline_ar',
      title: 'العنوان الفرعي (Arabic)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(250),
    }),
    defineField({
      name: 'bgImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bgVideo',
      title: 'Background Video (optional)',
      type: 'object',
      fields: [
        defineField({ name: 'url', type: 'url', title: 'Video URL' }),
        defineField({ name: 'muxPlaybackId', type: 'string', title: 'Mux Playback ID' }),
      ],
    }),
    defineField({ name: 'cta', title: 'CTA Button', type: 'ctaButton' }),
    defineField({
      name: 'stats',
      title: 'Stats / Social Proof',
      description: 'Up to 3 stat items shown below the CTA button.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', description: 'e.g. "100%" or "50+"', validation: (Rule) => Rule.required().max(20) }),
            defineField({ name: 'label_en', title: 'Label (English)', type: 'string', description: 'e.g. "Authentic"', validation: (Rule) => Rule.required().max(40) }),
            defineField({ name: 'label_ar', title: 'التصنيف (Arabic)', type: 'string', validation: (Rule) => Rule.max(40) }),
          ],
          preview: { select: { title: 'value', subtitle: 'label_en' } },
        }),
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'headlineSize',
      title: 'Headline Size',
      type: 'string',
      options: {
        list: [
          { title: 'Small', value: 'sm' },
          { title: 'Medium', value: 'md' },
          { title: 'Large (Default)', value: 'lg' },
          { title: 'Extra Large', value: 'xl' },
        ],
        layout: 'radio',
      },
      initialValue: 'lg',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      options: {
        list: [
          { title: 'Light — white text (for dark backgrounds)', value: 'light' },
          { title: 'Dark — dark text (for light backgrounds)', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
    }),
    defineField({
      name: 'layout',
      title: 'Hero Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Split — text left, image right (default)', value: 'split' },
          { title: 'Full Bleed — image fills entire hero', value: 'full' },
        ],
        layout: 'radio',
      },
      initialValue: 'split',
    }),
  ],
  preview: {
    select: {
      title: 'headline_en',
      isVisible: 'isVisible',
      image: 'bgImage',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('heroSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: val.image || createSectionIcon('heroSection'),
    }),
  },
})
