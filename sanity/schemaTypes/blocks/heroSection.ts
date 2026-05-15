import { defineField, defineType } from 'sanity'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
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
  ],
  preview: {
    select: { title: 'headline', media: 'bgImage' },
    prepare: (val: { title?: string; media?: unknown }) => ({
      title: val.title ?? 'Hero',
      subtitle: 'heroSection',
      media: val.media,
    }),
  },
})
