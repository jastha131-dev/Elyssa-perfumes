import { defineField, defineType } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const brandStorySection = defineType({
  name: 'brandStorySection',
  title: 'Brand Story',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'eyebrow', title: 'Eyebrow Label', type: 'string', description: 'e.g. "Our Philosophy"', validation: (Rule) => Rule.max(50) }),
    defineField({ name: 'headline', title: 'Headline', type: 'string', validation: (Rule) => Rule.max(100) }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'text',
      rows: 6,
      description: 'Separate paragraphs with a blank line.',
      validation: (Rule) => Rule.max(1000),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          { title: 'Right — text left, image right', value: 'right' },
          { title: 'Left — image left, text right', value: 'left' },
        ],
        layout: 'radio',
      },
      initialValue: 'right',
    }),
    defineField({ name: 'cta', title: 'CTA Button (optional)', type: 'ctaButton' }),
  ],
  preview: {
    select: {
      title: 'headline',
      isVisible: 'isVisible',
      image: 'image',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('brandStorySection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: val.image || createSectionIcon('brandStorySection'),
    }),
  },
})
