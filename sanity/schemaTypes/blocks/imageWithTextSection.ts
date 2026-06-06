import { defineField, defineType } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const imageWithTextSection = defineType({
  name: 'imageWithTextSection',
  title: 'Image with Text',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'eyebrow_en', title: 'Eyebrow (English)', type: 'string', validation: (Rule) => Rule.max(60) }),
    defineField({ name: 'eyebrow_ar', title: 'العنوان الصغير (Arabic)', type: 'string', validation: (Rule) => Rule.max(60) }),
    defineField({ name: 'headline_en', title: 'Headline (English)', type: 'string', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'headline_ar', title: 'العنوان (Arabic)', type: 'string', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'body_en', title: 'Body Text (English)', type: 'text', rows: 4, validation: (Rule) => Rule.max(600) }),
    defineField({ name: 'body_ar', title: 'النص (Arabic)', type: 'text', rows: 4, validation: (Rule) => Rule.max(600) }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: { list: [{ title: 'Left', value: 'left' }, { title: 'Right', value: 'right' }], layout: 'radio' },
      initialValue: 'left',
    }),
    defineField({
      name: 'imageStyle',
      title: 'Image Style',
      type: 'string',
      options: { list: [{ title: 'Square', value: 'square' }, { title: 'Rounded', value: 'rounded' }, { title: 'Full Bleed', value: 'full-bleed' }], layout: 'radio' },
      initialValue: 'square',
    }),
    defineField({
      name: 'bgColor',
      title: 'Background Color',
      type: 'string',
      options: { list: [{ title: 'White', value: 'white' }, { title: 'Cream', value: 'cream' }, { title: 'Black', value: 'black' }], layout: 'radio' },
      initialValue: 'white',
    }),
    defineField({ name: 'cta', title: 'CTA Button', type: 'ctaButton' }),
    defineField({
      name: 'theme',
      title: 'Section Styling',
      type: 'sectionTheme',
      description: 'Override background, badge color, corner radius and padding for this section.',
    }),
  ],
  preview: {
    select: { title: 'headline_en', isVisible: 'isVisible', image: 'image' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('imageWithTextSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: val.image || createSectionIcon('imageWithTextSection'),
    }),
  },
})
