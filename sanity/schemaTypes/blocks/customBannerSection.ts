import { defineField, defineType } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const customBannerSection = defineType({
  name: 'customBannerSection',
  title: 'Custom Banner',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({
      name: 'image',
      title: 'Banner Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'overlayOpacity',
      title: 'Overlay Opacity (%)',
      type: 'number',
      description: '0 = no overlay, 100 = fully opaque black overlay',
      initialValue: 40,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({ name: 'cta', title: 'CTA Button', type: 'ctaButton' }),
    defineField({
      name: 'textAlign',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      isVisible: 'isVisible',
      image: 'image',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('customBannerSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: val.image || createSectionIcon('customBannerSection'),
    }),
  },
})
